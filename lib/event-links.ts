function normalizeBaseUrl(baseUrl: string | undefined) {
  return baseUrl?.replace(/\/$/, '');
}

function buildAbsoluteUrl(path: string) {
  const baseUrl = getAppBaseUrl();

  if (!baseUrl) {
    return path;
  }

  return new URL(path, baseUrl).toString();
}

export function getEventAttendeesPath(eventId: string) {
  return `/events/${encodeURIComponent(eventId)}/attendees`;
}

export function getEventEditPath(eventId: string) {
  return `/events/${encodeURIComponent(eventId)}/edit`;
}

export function getEventSubscribePath(eventId: string) {
  return `/events/${encodeURIComponent(eventId)}/subscribe`;
}

export function getActivityMarkAttendancePath(activityId: string) {
  return `/activities/${encodeURIComponent(activityId)}/markAttendance`;
}

export function getAppBaseUrl() {
  const configuredBaseUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL);

  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return '';
}

export function getEventSubscribeUrl(eventId: string) {
  return buildAbsoluteUrl(getEventSubscribePath(eventId));
}

export function getActivityMarkAttendanceUrl(activityId: string) {
  return buildAbsoluteUrl(getActivityMarkAttendancePath(activityId));
}
