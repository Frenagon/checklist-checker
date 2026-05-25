import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import type { Doc, Id } from './_generated/dataModel';
import { mutation, type MutationCtx } from './_generated/server';

const maxActivitiesPerEvent = 50;

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
    throw new Error(
      `Events cannot contain more than ${maxActivitiesPerEvent} activities`,
    );
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
    return await ctx.db.insert('events', {
      createdBy,
      title,
    });
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
    const createdBy = await getAuthUserId(ctx);

    if (createdBy === null) {
      throw new Error('Not authenticated');
    }

    validateRequiredTitle(args.event.title, 'Event title');
    validateActivities(args.activities);

    const eventId = await saveOrCreateEvent(ctx, args.event, createdBy);
    const existingActivities = await ctx.db
      .query('activities')
      .withIndex('by_eventId', (q) => q.eq('eventId', eventId))
      .take(maxActivitiesPerEvent + 1);

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
        await ctx.db.insert('activities', {
          eventId,
          position: activity.position,
          title,
        });
        continue;
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
