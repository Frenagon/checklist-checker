import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import type { Doc, Id } from './_generated/dataModel';
import { query, type MutationCtx, type QueryCtx } from './_generated/server';
import { AppError, ErrorCodes, type ErrorPayload } from './errors.internal';

const authRequiredError: ErrorPayload = {
  code: ErrorCodes.AUTH_REQUIRED,
  message: 'You must be signed in to access this resource.',
};

type PublicUser = {
  id: Id<'users'>;
  email: string | null;
  name: string | null;
  image: string | null;
};

function toPublicUser(user: Doc<'users'> | null): PublicUser | null {
  if (user === null) {
    return null;
  }

  return {
    id: user._id,
    email: user.email ?? null,
    name: user.name ?? null,
    image: user.image ?? null,
  };
}

export async function requireAuthenticatedUserId(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);

  if (userId === null) {
    throw new AppError(authRequiredError);
  }

  return userId;
}

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireAuthenticatedUserId(ctx);

    const user = await ctx.db.get('users', userId);

    return toPublicUser(user);
  },
});

export const getUser = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    await requireAuthenticatedUserId(ctx);

    const user = await ctx.db.get('users', args.userId);

    return toPublicUser(user);
  },
});
