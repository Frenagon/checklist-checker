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
  EVENT_OWNERSHIP_REQUIRED = 'EVENT_OWNERSHIP_REQUIRED',
  EVENT_ALREADY_REGISTERED = 'EVENT_ALREADY_REGISTERED',
  EVENT_REGISTRATION_LIMIT_REACHED = 'EVENT_REGISTRATION_LIMIT_REACHED',

  // Registration Errors
  REGISTRATION_BLOCKED = 'REGISTRATION_BLOCKED',
  REGISTRATION_ALREADY_BLOCKED = 'REGISTRATION_ALREADY_BLOCKED',
  REGISTRATION_NOT_FOUND = 'REGISTRATION_NOT_FOUND',

  // User Errors
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_REGISTRATION_LIMIT_REACHED = 'USER_REGISTRATION_LIMIT_REACHED',
}

export type ErrorPayload =
  | {
      code:
        | ErrorCodes.AUTH_REQUIRED
        | ErrorCodes.ACTIVITY_LIMIT_REACHED
        | ErrorCodes.EVENT_LIMIT_REACHED
        | ErrorCodes.EVENT_NOT_FOUND
        | ErrorCodes.EVENT_OWNERSHIP_REQUIRED
        | ErrorCodes.REGISTRATION_BLOCKED
        | ErrorCodes.REGISTRATION_NOT_FOUND
        | ErrorCodes.EVENT_REGISTRATION_LIMIT_REACHED
        | ErrorCodes.USER_NOT_FOUND
        | ErrorCodes.USER_REGISTRATION_LIMIT_REACHED;
      message: string;
    }
  | {
      code: ErrorCodes.EVENT_ALREADY_REGISTERED;
      message: string;
      event: Doc<'events'>;
      registration: Doc<'registrations'>;
    }
  | {
      code: ErrorCodes.REGISTRATION_ALREADY_BLOCKED;
      message: string;
      registration: Doc<'registrations'>;
    };

export class AppError extends ConvexError<ErrorPayload> {
  constructor(payload: ErrorPayload) {
    super(payload);
  }
}
