import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

// Safety net for the mark-then-sweep event deletion: re-kick any event still
// stuck in the `deleting` state in case a scheduled purge failed and was not
// retried. The purge is idempotent, so re-running it is always safe.
crons.interval(
  'resume event deletions',
  { minutes: 15 },
  internal.events.resumeEventDeletions,
  {},
);

export default crons;
