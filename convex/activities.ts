import { v } from 'convex/values';
import type { Doc } from './_generated/dataModel';
import { query } from './_generated/server';
import { requireAuthenticatedUserId } from './users';

export const getActivitiesByEvent = query({
  args: {
    eventId: v.id('events'),
  },
  handler: async (ctx, args): Promise<Doc<'activities'>[]> => {
    await requireAuthenticatedUserId(ctx);

    // TODO: Check that the user is registered for the event.

    // TODO: Check that the user is not banned from the event.

    return await ctx.db
      .query('activities')
      .withIndex('by_eventId_and_position', (q) =>
        q.eq('eventId', args.eventId),
      )
      .collect();
  },
});
