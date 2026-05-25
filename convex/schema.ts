import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  events: defineTable({
    createdBy: v.id('users'),
    title: v.string(),
    blockedUsers: v.optional(v.array(v.id('users'))),
  }),
  activities: defineTable({
    eventId: v.id('events'),
    title: v.string(),
    position: v.number(),
    blockedUsers: v.optional(v.array(v.id('users'))),
  }).index('by_eventId', ['eventId']),
});
