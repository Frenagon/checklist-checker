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
    // Lifecycle status. `active` is a live event; `deleting` means it has been
    // removed from every read path while the mark-then-sweep purge removes its
    // child data. Required so a future status can never be silently mistaken
    // for an active event.
    status: v.union(v.literal('active'), v.literal('deleting')),
  })
    // Active events for an owner are exactly those with `status` set to
    // `active`, so this composite index lets owner listings skip `deleting`
    // tombstones entirely instead of reading and filtering them in memory.
    .index('by_createdBy_and_status', ['createdBy', 'status'])
    .index('by_status', ['status']),
  activities: defineTable({
    eventId: v.id('events'),
    title: v.string(),
    position: v.number(),
  }).index('by_eventId_and_position', ['eventId', 'position']),
  registrations: defineTable({
    userId: v.id('users'),
    eventId: v.id('events'),
    status: v.union(v.literal('registered'), v.literal('blocked')),
  })
    .index('by_userId_and_eventId', ['userId', 'eventId'])
    .index('by_userId_and_status', ['userId', 'status'])
    .index('by_eventId_and_status', ['eventId', 'status']),
  attendance: defineTable({
    userId: v.id('users'),
    activityId: v.id('activities'),
    status: v.union(v.literal('attended'), v.literal('blocked')),
  })
    .index('by_userId_and_activityId', ['userId', 'activityId'])
    .index('by_activityId_and_status', ['activityId', 'status']),
});
