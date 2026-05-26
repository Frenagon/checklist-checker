import { ConvexError } from 'convex/values';

export enum ErrorCodes {
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  EVENT_LIMIT_REACHED = 'EVENT_LIMIT_REACHED',
  ACTIVITY_LIMIT_REACHED = 'ACTIVITY_LIMIT_REACHED',
}

export type ErrorPayload = {
  code:
    | ErrorCodes.AUTH_REQUIRED
    | ErrorCodes.EVENT_LIMIT_REACHED
    | ErrorCodes.ACTIVITY_LIMIT_REACHED;
  message: string;
};

export class AppError extends ConvexError<ErrorPayload> {
  constructor(payload: ErrorPayload) {
    super(payload);
  }
}
