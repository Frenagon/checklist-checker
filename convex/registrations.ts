import { v } from 'convex/values';
import type { Doc, Id } from './_generated/dataModel';
import { mutation, type MutationCtx } from './_generated/server';
import { AppError, ErrorCodes, type ErrorPayload } from './errors.internal';
import { requireAuthenticatedUserId } from './users';

const maxEventRegistrationsRaw = process.env.MAX_EVENT_REGISTRATIONS;

if (maxEventRegistrationsRaw === undefined) {
  throw new Error('MAX_EVENT_REGISTRATIONS environment variable is required');
}

const maxEventRegistrations = Number(maxEventRegistrationsRaw);

if (!Number.isInteger(maxEventRegistrations) || maxEventRegistrations < 0) {
  throw new Error(
    'MAX_EVENT_REGISTRATIONS environment variable must be a non-negative integer',
  );
}

const maxUserEventRegistrationsRaw = process.env.MAX_USER_EVENT_REGISTRATIONS;

if (maxUserEventRegistrationsRaw === undefined) {
  throw new Error(
    'MAX_USER_EVENT_REGISTRATIONS environment variable is required',
  );
}

const maxUserEventRegistrations = Number(maxUserEventRegistrationsRaw);

if (
  !Number.isInteger(maxUserEventRegistrations) ||
  maxUserEventRegistrations < 0
) {
  throw new Error(
    'MAX_USER_EVENT_REGISTRATIONS environment variable must be a non-negative integer',
  );
}

const blockedRegistrationError: ErrorPayload = {
  code: ErrorCodes.EVENT_REGISTRATION_BLOCKED,
  message: 'You are blocked from registering for this event.',
};

const eventRegistrationLimitError: ErrorPayload = {
  code: ErrorCodes.EVENT_REGISTRATION_LIMIT_REACHED,
  message: `This event has reached its registration capacity of ${maxEventRegistrations}.`,
};

const userEventRegistrationLimitError: ErrorPayload = {
  code: ErrorCodes.USER_EVENT_REGISTRATION_LIMIT_REACHED,
  message: `You can register for up to ${maxUserEventRegistrations} events.`,
};

type RegisterToEventResult = {
  event: Doc<'events'>;
  registration: Doc<'registrations'>;
};

async function getEventOrThrow(ctx: MutationCtx, eventId: Id<'events'>) {
  const event = await ctx.db.get(eventId);

  if (event === null) {
    throw new AppError({
      code: ErrorCodes.EVENT_NOT_FOUND,
      message: 'Event not found.',
    });
  }

  return event;
}

async function getExistingRegistration(
  ctx: MutationCtx,
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

function validateExistingRegistration(
  event: Doc<'events'>,
  registration: Doc<'registrations'> | null,
) {
  if (registration === null) {
    return;
  }

  if (registration.status === 'blocked') {
    throw new AppError(blockedRegistrationError);
  }

  throw new AppError({
    code: ErrorCodes.EVENT_ALREADY_REGISTERED,
    message: 'You are already registered for this event.',
    event,
    registration,
  });
}

async function validateEventRegistrationCapacity(
  ctx: MutationCtx,
  eventId: Id<'events'>,
) {
  const registrations = await ctx.db
    .query('registrations')
    .withIndex('by_eventId_and_status', (q) =>
      q.eq('eventId', eventId).eq('status', 'registered'),
    )
    .take(maxEventRegistrations);

  if (registrations.length >= maxEventRegistrations) {
    throw new AppError(eventRegistrationLimitError);
  }
}

async function validateUserRegistrationCapacity(
  ctx: MutationCtx,
  userId: Id<'users'>,
) {
  const registrations = await ctx.db
    .query('registrations')
    .withIndex('by_userId_and_status', (q) =>
      q.eq('userId', userId).eq('status', 'registered'),
    )
    .take(maxUserEventRegistrations);

  if (registrations.length >= maxUserEventRegistrations) {
    throw new AppError(userEventRegistrationLimitError);
  }
}

export const registerToEvent = mutation({
  args: {
    eventId: v.id('events'),
  },
  handler: async (ctx, args): Promise<RegisterToEventResult> => {
    const userId = await requireAuthenticatedUserId(ctx);
    const event = await getEventOrThrow(ctx, args.eventId);
    const existingRegistration = await getExistingRegistration(
      ctx,
      userId,
      args.eventId,
    );

    validateExistingRegistration(event, existingRegistration);
    await validateEventRegistrationCapacity(ctx, args.eventId);
    await validateUserRegistrationCapacity(ctx, userId);

    const registrationId = await ctx.db.insert('registrations', {
      eventId: args.eventId,
      status: 'registered',
      userId,
    });
    const registration = await ctx.db.get(registrationId);

    if (registration === null) {
      throw new Error('Failed to load created registration');
    }

    return {
      event,
      registration,
    };
  },
});
