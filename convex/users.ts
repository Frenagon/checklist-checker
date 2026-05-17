import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import type { Doc, Id } from './_generated/dataModel';
import { query } from './_generated/server';

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

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return null;
    }

    const user = await ctx.db.get('users', userId);

    return toPublicUser(user);
  },
});

export const getUser = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);

    if (currentUserId === null) {
      throw new Error('Not authenticated');
    }

    const user = await ctx.db.get('users', args.userId);

    return toPublicUser(user);
  },
});
