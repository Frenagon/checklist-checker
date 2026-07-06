function encodeEventId(eventId: string) {
  return encodeURIComponent(eventId);
}

function normalizeBaseUrl(baseUrl: string | undefined) {
  return baseUrl?.replace(/\/$/, '');
}

export function getEventAttendeesPath(eventId: string) {
  return `/events/${encodeEventId(eventId)}/attendees`;
}

export function getEventEditPath(eventId: string) {
  return `/events/${encodeEventId(eventId)}/edit`;
}

export function getEventSubscribePath(eventId: string) {
  return `/events/${encodeEventId(eventId)}/subscribe`;
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
  const baseUrl = getAppBaseUrl();
  const subscribePath = getEventSubscribePath(eventId);

  if (!baseUrl) {
    return subscribePath;
  }

  return new URL(subscribePath, baseUrl).toString();
}
