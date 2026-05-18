import {
  createAccount,
  modifyAccountCredentials,
} from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { internal } from './_generated/api';
import type { Id } from './_generated/dataModel';
import {
  internalAction,
  internalMutation,
  internalQuery,
  type ActionCtx,
} from './_generated/server';

const previewUsers = [
  {
    email: 'alex@checklist-checker.example',
    image: 'https://api.dicebear.com/9.x/initials/svg?seed=Alex%20Morgan',
    name: 'Alex Morgan',
    password: 'preview123',
  },
  {
    email: 'sam@checklist-checker.example',
    image: 'https://api.dicebear.com/9.x/initials/svg?seed=Sam%20Rivera',
    name: 'Sam Rivera',
    password: 'preview123',
  },
  {
    email: 'jules@checklist-checker.example',
    image: 'https://api.dicebear.com/9.x/initials/svg?seed=Jules%20Park',
    name: 'Jules Park',
    password: 'preview123',
  },
] as const;

type SeedSummary = {
  created: number;
  table: string;
  updated: number;
};

type SeedTask<Input, Existing> = {
  create: (ctx: ActionCtx, item: Input) => Promise<void>;
  findExisting: (ctx: ActionCtx, item: Input) => Promise<Existing | null>;
  items: readonly Input[];
  table: string;
  update: (ctx: ActionCtx, item: Input, existing: Existing) => Promise<void>;
};

async function syncSeedData<Input, Existing>(
  ctx: ActionCtx,
  config: SeedTask<Input, Existing>,
): Promise<SeedSummary> {
  let created = 0;
  let updated = 0;

  for (const item of config.items) {
    const existing = await config.findExisting(ctx, item);

    if (existing === null) {
      await config.create(ctx, item);
      created += 1;
      continue;
    }

    await config.update(ctx, item, existing);
    updated += 1;
  }

  return {
    created,
    table: config.table,
    updated,
  };
}

async function seedUsers(ctx: ActionCtx): Promise<SeedSummary> {
  return syncSeedData(ctx, {
    table: 'users',
    items: previewUsers,
    findExisting: async (seedCtx, user): Promise<Id<'users'> | null> => {
      const existingUser: Id<'users'> | null = await seedCtx.runQuery(
        internal.seed.getSeedUserByEmail,
        {
          email: user.email,
        },
      );

      return existingUser;
    },
    create: async (seedCtx, user) => {
      await createAccount(seedCtx, {
        provider: 'password',
        account: {
          id: user.email,
          secret: user.password,
        },
        profile: {
          email: user.email,
          image: user.image,
          name: user.name,
        },
        shouldLinkViaEmail: false,
        shouldLinkViaPhone: false,
      });
    },
    update: async (seedCtx, user, existingId) => {
      await modifyAccountCredentials(seedCtx, {
        provider: 'password',
        account: {
          id: user.email,
          secret: user.password,
        },
      });
      await seedCtx.runMutation(internal.seed.syncSeedUserProfile, {
        email: user.email,
        image: user.image,
        name: user.name,
        userId: existingId,
      });
    },
  });
}

export const getSeedUserByEmail = internalQuery({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args): Promise<Id<'users'> | null> => {
    const account = await ctx.db
      .query('authAccounts')
      .withIndex('providerAndAccountId', (q) =>
        q.eq('provider', 'password').eq('providerAccountId', args.email),
      )
      .unique();

    if (account === null) {
      return null;
    }

    const user = await ctx.db.get(account.userId);

    if (user === null) {
      throw new Error(`Missing user document for seeded account ${args.email}`);
    }

    return user._id;
  },
});

export const syncSeedUserProfile = internalMutation({
  args: {
    email: v.string(),
    image: v.string(),
    name: v.string(),
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      email: args.email,
      image: args.image,
      name: args.name,
    });
  },
});

export const seedPreviewDeployment = internalAction({
  args: {},
  handler: async (
    ctx,
  ): Promise<{
    created: number;
    tables: SeedSummary[];
    updated: number;
  }> => {
    const tables: SeedSummary[] = [await seedUsers(ctx)];

    return {
      created: tables.reduce((total, table) => total + table.created, 0),
      tables,
      updated: tables.reduce((total, table) => total + table.updated, 0),
    };
  },
});
