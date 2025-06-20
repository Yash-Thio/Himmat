export const SOS_LOCATION_UPDATE = "sos-location-update";
export const SOS_STOPPED = "sos-stopped";

const SOS_CHANNEL_PREFIX = "private-sos-";
export function getSosChannelName(userId: number) {
  return `${SOS_CHANNEL_PREFIX}${userId}`;
}