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
  code: ErrorCodes.REGISTRATION_BLOCKED,
  message: 'You are blocked from registering for this event.',
};

const eventOwnershipRequiredError: ErrorPayload = {
  code: ErrorCodes.EVENT_OWNERSHIP_REQUIRED,
  message: 'You must own this event to manage registrations.',
};

const eventRegistrationLimitError: ErrorPayload = {
  code: ErrorCodes.EVENT_REGISTRATION_LIMIT_REACHED,
  message: `This event has reached its registration capacity of ${maxEventRegistrations}.`,
};

const registrationNotFoundError: ErrorPayload = {
  code: ErrorCodes.REGISTRATION_NOT_FOUND,
  message: 'Registration not found for this event.',
};

const userNotFoundError: ErrorPayload = {
  code: ErrorCodes.USER_NOT_FOUND,
  message: 'User not found.',
};

const userEventRegistrationLimitError: ErrorPayload = {
  code: ErrorCodes.USER_REGISTRATION_LIMIT_REACHED,
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

async function getRegistrationOrThrow(
  ctx: MutationCtx,
  userId: Id<'users'>,
  eventId: Id<'events'>,
) {
  const registration = await getExistingRegistration(ctx, userId, eventId);

  if (registration === null) {
    throw new AppError(registrationNotFoundError);
  }

  return registration;
}

async function getUserOrThrow(ctx: MutationCtx, userId: Id<'users'>) {
  const user = await ctx.db.get(userId);

  if (user === null) {
    throw new AppError(userNotFoundError);
  }

  return user;
}

function validateEventOwnership(event: Doc<'events'>, userId: Id<'users'>) {
  if (event.createdBy !== userId) {
    throw new AppError(eventOwnershipRequiredError);
  }
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

function alreadyBlockedRegistrationError(
  registration: Doc<'registrations'>,
): ErrorPayload {
  return {
    code: ErrorCodes.REGISTRATION_ALREADY_BLOCKED,
    message: 'User is already blocked from this event.',
    registration,
  };
}

async function getOwnedRegistrationOrThrow(
  ctx: MutationCtx,
  userId: Id<'users'>,
  eventId: Id<'events'>,
) {
  const currentUserId = await requireAuthenticatedUserId(ctx);
  const event = await getEventOrThrow(ctx, eventId);

  validateEventOwnership(event, currentUserId);
  await getUserOrThrow(ctx, userId);

  return await getRegistrationOrThrow(ctx, userId, eventId);
}

async function changeOwnedRegistrationStatus(
  ctx: MutationCtx,
  {
    eventId,
    getAlreadyChangedError,
    status,
    userId,
  }: {
    eventId: Id<'events'>;
    getAlreadyChangedError: (
      registration: Doc<'registrations'>,
    ) => ErrorPayload;
    status: Doc<'registrations'>['status'];
    userId: Id<'users'>;
  },
) {
  const registration = await getOwnedRegistrationOrThrow(ctx, userId, eventId);

  if (registration.status === status) {
    throw new AppError(getAlreadyChangedError(registration));
  }

  await ctx.db.patch(registration._id, {
    status,
  });

  const updatedRegistration = await ctx.db.get(registration._id);

  if (updatedRegistration === null) {
    throw new Error('Failed to load updated registration');
  }

  return updatedRegistration;
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

export const blockUser = mutation({
  args: {
    userId: v.id('users'),
    eventId: v.id('events'),
  },
  handler: async (ctx, args): Promise<Doc<'registrations'>> => {
    return await changeOwnedRegistrationStatus(ctx, {
      getAlreadyChangedError: alreadyBlockedRegistrationError,
      status: 'blocked',
      userId: args.userId,
      eventId: args.eventId,
    });
  },
});
