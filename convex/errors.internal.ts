import { ConvexError } from 'convex/values';
import type { Doc } from './_generated/dataModel';

export enum ErrorCodes {
  // Auth Errors
  AUTH_REQUIRED = 'AUTH_REQUIRED',

  // Activity Errors
  ACTIVITY_LIMIT_REACHED = 'ACTIVITY_LIMIT_REACHED',

  // Event Errors
  EVENT_LIMIT_REACHED = 'EVENT_LIMIT_REACHED',
  EVENT_NOT_FOUND = 'EVENT_NOT_FOUND',
  EVENT_REGISTRATION_BLOCKED = 'EVENT_REGISTRATION_BLOCKED',
  EVENT_ALREADY_REGISTERED = 'EVENT_ALREADY_REGISTERED',
  EVENT_REGISTRATION_LIMIT_REACHED = 'EVENT_REGISTRATION_LIMIT_REACHED',
  USER_EVENT_REGISTRATION_LIMIT_REACHED = 'USER_EVENT_REGISTRATION_LIMIT_REACHED',
}

export type ErrorPayload =
  | {
      code:
        | ErrorCodes.AUTH_REQUIRED
        | ErrorCodes.ACTIVITY_LIMIT_REACHED
        | ErrorCodes.EVENT_LIMIT_REACHED
        | ErrorCodes.EVENT_NOT_FOUND
        | ErrorCodes.EVENT_REGISTRATION_BLOCKED
        | ErrorCodes.EVENT_REGISTRATION_LIMIT_REACHED
        | ErrorCodes.USER_EVENT_REGISTRATION_LIMIT_REACHED;
      message: string;
    }
  | {
      code: ErrorCodes.EVENT_ALREADY_REGISTERED;
      message: string;
      event: Doc<'events'>;
      registration: Doc<'registrations'>;
    };

export class AppError extends ConvexError<ErrorPayload> {
  constructor(payload: ErrorPayload) {
    super(payload);
  }
}
