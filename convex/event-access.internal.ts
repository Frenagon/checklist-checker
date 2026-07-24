import type { Doc, Id } from './_generated/dataModel';
import type { MutationCtx, QueryCtx } from './_generated/server';
import { AppError, ErrorCodes, type ErrorPayload } from './errors.internal';

type FunctionCtx = MutationCtx | QueryCtx;

const eventNotFoundError: ErrorPayload = {
  code: ErrorCodes.EVENT_NOT_FOUND,
  message: 'Event not found.',
};

const eventOwnershipRequiredError: ErrorPayload = {
  code: ErrorCodes.EVENT_OWNERSHIP_REQUIRED,
  message: 'You must own this event to perform this action.',
};

const registrationNotFoundError: ErrorPayload = {
  code: ErrorCodes.REGISTRATION_NOT_FOUND,
  message: 'Registration not found for this event.',
};

export async function getEventOrThrow(ctx: FunctionCtx, eventId: Id<'events'>) {
  const event = await ctx.db.get(eventId);

  // Only `active` events are visible to consumers. Anything else (today just
  // `deleting`, mid-purge) is treated as gone so no one observes a
  // half-deleted event, and any future non-active status is hidden by default.
  if (event === null || event.status !== 'active') {
    throw new AppError(eventNotFoundError);
  }

  return event;
}

export async function getExistingRegistration(
  ctx: FunctionCtx,
  userId: Id<'users'>,
  eventId: Id<'events'>,
) {
  return await ctx.db
    .query('registrations')
    .withIndex('by_userId_and_eventId', (q) =>
      q.eq('userId', userId).eq('eventId', eventId),
    )
    .unique();
}

export async function getRegistrationOrThrow(
  ctx: FunctionCtx,
  userId: Id<'users'>,
  eventId: Id<'events'>,
) {
  const registration = await getExistingRegistration(ctx, userId, eventId);

  if (registration === null) {
    throw new AppError(registrationNotFoundError);
  }

  return registration;
}

export function validateEventOwnership(
  event: Doc<'events'>,
  userId: Id<'users'>,
) {
  if (event.createdBy !== userId) {
    throw new AppError(eventOwnershipRequiredError);
  }
}
