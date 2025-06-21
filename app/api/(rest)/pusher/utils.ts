export const NEW_MESSAGE = "new-message";
// create function to get sos channel name also export event name

const CONVERSATION_CHANNEL_NAME_PREFIX = "private-conversation-";
export function getConversationChannelName(conversation: number) {
  return `${CONVERSATION_CHANNEL_NAME_PREFIX}${conversation}`;
}
