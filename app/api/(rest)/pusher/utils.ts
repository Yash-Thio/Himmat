export const NEW_MESSAGE = "new-message";

const CONVERSATION_CHANNEL_NAME_PREFIX = "private-conversation-";
export function getConversationChannelName(conversation: number) {
  return `${CONVERSATION_CHANNEL_NAME_PREFIX}${conversation}`;
}
