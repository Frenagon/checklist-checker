import { v } from 'convex/values';
import type { Doc } from './_generated/dataModel';
import { query } from './_generated/server';
import {
  AppError,
  ErrorCodes,
  type ErrorPayload,
} from './errors.internal';
import { getEventOrThrow, getExistingRegistration } from './event-access.internal';
import { requireAuthenticatedUserId } from './users';

const blockedEventAccessError: ErrorPayload = {
  code: ErrorCodes.REGISTRATION_BLOCKED,
  message: 'You are blocked from this event.',
};

const eventNotFoundError: ErrorPayload = {
  code: ErrorCodes.EVENT_NOT_FOUND,
  message: 'Event not found.',
};

export const getEventActivities = query({
  args: {
    eventId: v.id('events'),
  },
  handler: async (ctx, args): Promise<Doc<'activities'>[]> => {
    const userId = await requireAuthenticatedUserId(ctx);
    const event = await getEventOrThrow(ctx, args.eventId);

    if (event.createdBy !== userId) {
      const registration = await getExistingRegistration(ctx, userId, args.eventId);

      if (registration === null) {
        throw new AppError(eventNotFoundError);
      }

      if (registration.status === 'blocked') {
        throw new AppError(blockedEventAccessError);
      }
    }

    return await ctx.db
      .query('activities')
      .withIndex('by_eventId_and_position', (q) =>
        q.eq('eventId', args.eventId),
      )
      .collect();
  },
});
