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
  }).index('by_createdBy', ['createdBy']),
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
    .index('by_eventId_and_status', ['eventId', 'status']),
  attendance: defineTable({
    userId: v.id('users'),
    activityId: v.id('activities'),
    status: v.union(v.literal('attended'), v.literal('blocked')),
  })
    .index('by_userId_and_activityId', ['userId', 'activityId'])
    .index('by_activityId_and_status', ['activityId', 'status']),
});
