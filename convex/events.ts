import { v } from 'convex/values';
import type { Doc, Id } from './_generated/dataModel';
import { mutation, query, type MutationCtx } from './_generated/server';
import { AppError, ErrorCodes, type ErrorPayload } from './errors.internal';
import { requireAuthenticatedUserId } from './users';

const maxEventsPerUser = 50;
const maxActivitiesPerEvent = 50;

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

  const events = await ctx.db
    .query('events')
    .withIndex('by_createdBy', (q) => q.eq('createdBy', createdBy))
    .take(maxEventsPerUser + 1);

  if (events.length >= maxEventsPerUser) {
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
      .withIndex('by_eventId', (q) => q.eq('eventId', eventId))
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

export const getOwnedEvents = query({
  args: {},
  handler: async (ctx): Promise<Doc<'events'>[]> => {
    const userId = await requireAuthenticatedUserId(ctx);

    return await ctx.db
      .query('events')
      .withIndex('by_createdBy', (q) => q.eq('createdBy', userId))
      .order('desc')
      .collect();
  },
});
