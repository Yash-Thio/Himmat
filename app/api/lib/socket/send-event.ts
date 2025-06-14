import Pusher from "pusher";

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || "",
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || "",
  secret: process.env.PUSHER_SECRET || "",
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
  useTLS: true,
});

export async function sendEvent(
  events: { channel: string; name: string; data: object }[],
) {
  if (events.length > 1) return pusher.triggerBatch(events);
  const event = events[0];
  if (!event) return;
  return pusher.trigger(event.channel, event.name, event.data);
}
