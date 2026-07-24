import { v } from 'convex/values';
import { internal } from './_generated/api';
import type { Doc, Id } from './_generated/dataModel';
import {
  internalMutation,
  mutation,
  query,
  type MutationCtx,
} from './_generated/server';
import { AppError, ErrorCodes, type ErrorPayload } from './errors.internal';
import {
  getEventOrThrow,
  validateEventOwnership,
} from './event-access.internal';
import { requireAuthenticatedUserId } from './users';

const maxEventsPerUserRaw = process.env.MAX_EVENTS_PER_USER;

if (maxEventsPerUserRaw === undefined) {
  throw new Error('MAX_EVENTS_PER_USER environment variable is required');
}

const maxEventsPerUser = Number(maxEventsPerUserRaw);

if (!Number.isInteger(maxEventsPerUser) || maxEventsPerUser < 0) {
  throw new Error(
    'MAX_EVENTS_PER_USER environment variable must be a non-negative integer',
  );
}

const maxActivitiesPerEventRaw = process.env.MAX_ACTIVITIES_PER_EVENT;

if (maxActivitiesPerEventRaw === undefined) {
  throw new Error('MAX_ACTIVITIES_PER_EVENT environment variable is required');
}

const maxActivitiesPerEvent = Number(maxActivitiesPerEventRaw);

if (!Number.isInteger(maxActivitiesPerEvent) || maxActivitiesPerEvent < 0) {
  throw new Error(
    'MAX_ACTIVITIES_PER_EVENT environment variable must be a non-negative integer',
  );
}

const eventLimitError: ErrorPayload = {
  code: ErrorCodes.EVENT_LIMIT_REACHED,
  message: `You can create up to ${maxEventsPerUser} events. Delete an existing event before creating a new one.`,
};

const activityLimitError: ErrorPayload = {
  code: ErrorCodes.ACTIVITY_LIMIT_REACHED,
  message: `An event can have up to ${maxActivitiesPerEvent} activities. Remove an existing activity before adding a new one.`,
};

const eventInputValidator = v.object({
  id: v.optional(v.id('events')),
  title: v.string(),
});

const activityInputValidator = v.object({
  id: v.optional(v.id('activities')),
  position: v.number(),
  title: v.string(),
});

type EventInput = {
  id?: Id<'events'>;
  title: string;
};

type ActivityInput = {
  id?: Id<'activities'>;
  position: number;
  title: string;
};

function validateRequiredTitle(title: string, fieldName: string) {
  if (title.trim().length === 0) {
    throw new Error(`${fieldName} is required`);
  }
}

function validateActivities(activities: ActivityInput[]) {
  if (activities.length > maxActivitiesPerEvent) {
    throw new AppError(activityLimitError);
  }

  const seenPositions = new Set<number>();

  for (const activity of activities) {
    validateRequiredTitle(activity.title, 'Activity title');

    if (!Number.isInteger(activity.position)) {
      throw new Error('Activity position must be an integer');
    }

    if (seenPositions.has(activity.position)) {
      throw new Error('Activity positions must be unique within an event');
    }

    seenPositions.add(activity.position);
  }
}

function sortActivitiesByPosition(activities: ActivityInput[]) {
  return [...activities].sort((left, right) => left.position - right.position);
}

async function validateEventCreationQuota(
  ctx: MutationCtx,
  event: EventInput,
  createdBy: Id<'users'>,
) {
  if (event.id !== undefined) {
    return;
  }

  // Only active events count toward the quota; querying by `active` status
  // through the index skips `deleting` tombstones and stops after at most
  // `maxEventsPerUser` rows.
  const activeEvents = await ctx.db
    .query('events')
    .withIndex('by_createdBy_and_status', (q) =>
      q.eq('createdBy', createdBy).eq('status', 'active'),
    )
    .take(maxEventsPerUser);

  if (activeEvents.length >= maxEventsPerUser) {
    throw new AppError(eventLimitError);
  }
}

async function saveOrCreateEvent(
  ctx: MutationCtx,
  event: EventInput,
  createdBy: Id<'users'>,
) {
  const title = event.title.trim();

  if (event.id === undefined) {
    return await ctx.db.insert('events', {
      createdBy,
      title,
      status: 'active',
    });
  }

  const existingEvent = await ctx.db.get(event.id);

  if (existingEvent === null) {
    throw new Error('Invalid event id');
  }

  if (existingEvent.createdBy !== createdBy) {
    throw new Error('Unauthorized');
  }

  await ctx.db.patch(event.id, {
    title,
  });

  return event.id;
}

export const saveEvent = mutation({
  args: {
    event: eventInputValidator,
    activities: v.array(activityInputValidator),
  },
  handler: async (ctx, args): Promise<Doc<'events'>> => {
    const createdBy = await requireAuthenticatedUserId(ctx);

    validateRequiredTitle(args.event.title, 'Event title');
    validateActivities(args.activities);
    await validateEventCreationQuota(ctx, args.event, createdBy);

    const eventId = await saveOrCreateEvent(ctx, args.event, createdBy);
    const existingActivities = await ctx.db
      .query('activities')
      .withIndex('by_eventId_and_position', (q) => q.eq('eventId', eventId))
      .collect();

    const existingActivitiesById = new Map(
      existingActivities.map((activity) => [activity._id, activity]),
    );
    const incomingActivityIds = new Set<Id<'activities'>>();

    for (const activity of args.activities) {
      if (activity.id !== undefined) {
        incomingActivityIds.add(activity.id);
      }
    }

    for (const activity of existingActivities) {
      if (!incomingActivityIds.has(activity._id)) {
        await ctx.db.delete(activity._id);
      }
    }

    for (const activity of sortActivitiesByPosition(args.activities)) {
      const title = activity.title.trim();

      if (activity.id === undefined) {
        await ctx.db.insert('activities', {
          eventId,
          position: activity.position,
          title,
        });
        continue;
      }

      const existingActivity = existingActivitiesById.get(activity.id) ?? null;

      if (existingActivity === null) {
        throw new Error('Activity not found for this event');
      }

      if (existingActivity.eventId !== eventId) {
        throw new Error('Activity does not belong to this event');
      }

      await ctx.db.patch(activity.id, {
        eventId,
        position: activity.position,
        title,
      });
    }

    const event = await ctx.db.get(eventId);

    if (event === null) {
      throw new Error('Failed to load saved event');
    }

    return event;
  },
});

export const getMyEvents = query({
  args: {},
  handler: async (ctx): Promise<Doc<'events'>[]> => {
    const userId = await requireAuthenticatedUserId(ctx);

    // Selecting `active` status excludes `deleting` tombstones at the index, so
    // they never reach the client and no in-memory filtering is needed.
    return await ctx.db
      .query('events')
      .withIndex('by_createdBy_and_status', (q) =>
        q.eq('createdBy', userId).eq('status', 'active'),
      )
      .order('desc')
      .collect();
  },
});

// The most rows a single purge transaction will read/delete before it hands
// off to a fresh transaction. Kept well under Convex's per-transaction limits
// so even the tail run (a partial attendance batch plus registrations,
// activities, and the event) stays comfortably within budget.
const PURGE_BATCH_SIZE = 1000;

// How many stuck `deleting` events the resume cron re-kicks per run.
const RESUME_DELETION_SCAN_LIMIT = 25;

/**
 * Deletes up to `budget` attendance rows belonging to the given activities and
 * returns how many were removed. It always deletes from the front of each
 * activity's index, so a later run resumes exactly where this one stopped.
 */
async function deleteAttendanceBatch(
  ctx: MutationCtx,
  activities: Doc<'activities'>[],
  budget: number,
): Promise<number> {
  let deleted = 0;

  for (const activity of activities) {
    if (deleted >= budget) {
      break;
    }

    const attendanceRecords = await ctx.db
      .query('attendance')
      .withIndex('by_activityId_and_status', (q) =>
        q.eq('activityId', activity._id),
      )
      .take(budget - deleted);

    for (const attendance of attendanceRecords) {
      await ctx.db.delete(attendance._id);
      deleted += 1;
    }
  }

  return deleted;
}

/**
 * Physically removes an event and everything under it, one bounded batch per
 * invocation, rescheduling itself until nothing remains. Splitting the work
 * across transactions keeps each run under Convex's per-transaction limits: a
 * full event can hold up to 50 activities x 1000 registrations = 50k
 * attendance rows, far more than one transaction may delete.
 *
 * Deletion still proceeds children-first — attendance -> registrations ->
 * activities -> event — so the event row is removed only once it is empty. The
 * handler is idempotent and resumable: it no-ops when the event is already gone
 * or was never marked for deletion, and re-running after a crash simply
 * continues draining whatever is left.
 */
export const purgeEventData = internalMutation({
  args: {
    eventId: v.id('events'),
  },
  returns: v.null(),
  handler: async (ctx, args): Promise<null> => {
    const event = await ctx.db.get(args.eventId);

    if (event === null || event.status !== 'deleting') {
      return null;
    }

    const activities = await ctx.db
      .query('activities')
      .withIndex('by_eventId_and_position', (q) =>
        q.eq('eventId', args.eventId),
      )
      .collect();

    const deletedAttendance = await deleteAttendanceBatch(
      ctx,
      activities,
      PURGE_BATCH_SIZE,
    );

    // Spent the whole budget on attendance alone — continue in a fresh
    // transaction before touching registrations or activities.
    if (deletedAttendance === PURGE_BATCH_SIZE) {
      await ctx.scheduler.runAfter(0, internal.events.purgeEventData, {
        eventId: args.eventId,
      });
      return null;
    }

    const registrations = await ctx.db
      .query('registrations')
      .withIndex('by_eventId_and_status', (q) => q.eq('eventId', args.eventId))
      .take(PURGE_BATCH_SIZE);

    for (const registration of registrations) {
      await ctx.db.delete(registration._id);
    }

    if (registrations.length === PURGE_BATCH_SIZE) {
      await ctx.scheduler.runAfter(0, internal.events.purgeEventData, {
        eventId: args.eventId,
      });
      return null;
    }

    // Future event-related entities should be drained here, before the event.

    for (const activity of activities) {
      await ctx.db.delete(activity._id);
    }

    await ctx.db.delete(args.eventId);

    return null;
  },
});

export const deleteEvent = mutation({
  args: {
    eventId: v.id('events'),
  },
  returns: v.null(),
  handler: async (ctx, args): Promise<null> => {
    const userId = await requireAuthenticatedUserId(ctx);
    const event = await getEventOrThrow(ctx, args.eventId);
    validateEventOwnership(event, userId);

    // Mark-then-sweep: flipping the event to `deleting` is a single atomic
    // write that instantly hides it from every read path, then the scheduled
    // purge removes the (potentially large) child data across as many
    // transactions as it needs.
    await ctx.db.patch(args.eventId, { status: 'deleting' });
    await ctx.scheduler.runAfter(0, internal.events.purgeEventData, {
      eventId: args.eventId,
    });

    return null;
  },
});

/**
 * Safety net for the mark-then-sweep flow: a scheduled purge is not retried if
 * it fails with a non-transient error, so this cron periodically re-kicks any
 * event still stuck in the `deleting` state. Re-kicking is safe because the
 * purge is idempotent.
 */
export const resumeEventDeletions = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx): Promise<null> => {
    const pendingEvents = await ctx.db
      .query('events')
      .withIndex('by_status', (q) => q.eq('status', 'deleting'))
      .take(RESUME_DELETION_SCAN_LIMIT);

    for (const event of pendingEvents) {
      await ctx.scheduler.runAfter(0, internal.events.purgeEventData, {
        eventId: event._id,
      });
    }

    return null;
  },
});
