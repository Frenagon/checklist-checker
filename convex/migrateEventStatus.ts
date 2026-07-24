import { v } from 'convex/values';
import { internalMutation } from './_generated/server';

/**
 * One-off migration for the mark-then-sweep rollout: backfills `status: active`
 * on every event that predates the field. Run once per environment (dev,
 * staging, prod) after deploying this change, before the follow-up PR narrows
 * `status` to required and removes this file.
 *
 * Run with: `npx convex run migrateEventStatus:backfill '{}'`
 * Safe to re-run: it only touches events that still have no status.
 */
export const backfill = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const events = await ctx.db
      .query('events')
      .withIndex('by_status', (q) => q.eq('status', undefined))
      .take(1000);

    for (const event of events) {
      await ctx.db.patch(event._id, { status: 'active' });
    }

    return null;
  },
});
