/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  #graphql\n  mutation UpdateUser($updatedUser: UpdateUserInput!) {\n    updateUser(updatedUser: $updatedUser)\n  }\n": typeof types.UpdateUserDocument,
    "\n  #graphql\n  mutation ReadMessage($conversationID:Int!) {\n    readMessage(conversationID: $conversationID)\n  }\n": typeof types.ReadMessageDocument,
    "\n  #graphql\n  mutation SendChat($userID: Int!, $body:String!) {\n    sendMessage(userID: $userID, body: $body)\n  }\n": typeof types.SendChatDocument,
    "\n  #graphql\n  mutation SendResetPasswordEmail($email:String!) {\n    sendResetPasswordEmail(email: $email)  \n  }\n": typeof types.SendResetPasswordEmailDocument,
    "\n  #graphql\n  mutation SendVerificationEmail {\n    sendVerificationEmail\n  }\n": typeof types.SendVerificationEmailDocument,
    "\n  #graphql\n  mutation ResetPassword($newPassword:String!, $token:String!) {\n    resetPassword(newPassword: $newPassword, token:$token)  \n  }\n": typeof types.ResetPasswordDocument,
    "\n  #graphql\n  mutation SendSOS {\n    sendSos\n  }\n": typeof types.SendSosDocument,
    "\n  #graphql\n  query GetCurrentUser {\n    user: getCurrentUser {\n      id\n      email\n      username\n      name\n      emailVerified\n      isOnboarded\n      phone\n      dob\n    }\n  }\n": typeof types.GetCurrentUserDocument,
    "\n  #graphql\n  query GetDefaultOnboardingDetails {\n    getCurrentUser {\n      id\n      email\n      name\n      phone\n      isOnboarded\n      username\n      dob\n    }\n    trusties: getUserTrusties {\n      username\n    }\n  }\n": typeof types.GetDefaultOnboardingDetailsDocument,
    "\n  #graphql\n  query IsUsernameAvailable($username: String!) {\n    isUsernameAvailable(username:$username)\n  }\n": typeof types.IsUsernameAvailableDocument,
    "\n  #graphql\n  query GetChats {\n    chats:getChats {\n      preview{\n          text\n          hasRead\n          at\n      }\n      id\n      user {\n        id\n        username\n        name\n      }\n    }\n  }\n": typeof types.GetChatsDocument,
    "\n  #graphql\n  query GetChat($username: String!) {\n    chat: getChat(username: $username) {\n      user {\n        id\n        name\n      }\n      id\n      preview{\n          text\n      }\n      messages{\n        body\n        createdAt\n        by\n      }\n    }\n  }\n": typeof types.GetChatDocument,
    "\n  #graphql\n  query GetUserTrusties {\n    trusties: getUserTrusties {\n      name\n      email\n      username\n    }\n  }\n": typeof types.GetUserTrustiesDocument,
    "\n  #graphql\n  query VerifyEmail($token:String!) {\n    verifyEmail(token: $token)\n  }\n": typeof types.VerifyEmailDocument,
};
const documents: Documents = {
    "\n  #graphql\n  mutation UpdateUser($updatedUser: UpdateUserInput!) {\n    updateUser(updatedUser: $updatedUser)\n  }\n": types.UpdateUserDocument,
    "\n  #graphql\n  mutation ReadMessage($conversationID:Int!) {\n    readMessage(conversationID: $conversationID)\n  }\n": types.ReadMessageDocument,
    "\n  #graphql\n  mutation SendChat($userID: Int!, $body:String!) {\n    sendMessage(userID: $userID, body: $body)\n  }\n": types.SendChatDocument,
    "\n  #graphql\n  mutation SendResetPasswordEmail($email:String!) {\n    sendResetPasswordEmail(email: $email)  \n  }\n": types.SendResetPasswordEmailDocument,
    "\n  #graphql\n  mutation SendVerificationEmail {\n    sendVerificationEmail\n  }\n": types.SendVerificationEmailDocument,
    "\n  #graphql\n  mutation ResetPassword($newPassword:String!, $token:String!) {\n    resetPassword(newPassword: $newPassword, token:$token)  \n  }\n": types.ResetPasswordDocument,
    "\n  #graphql\n  mutation SendSOS {\n    sendSos\n  }\n": types.SendSosDocument,
    "\n  #graphql\n  query GetCurrentUser {\n    user: getCurrentUser {\n      id\n      email\n      username\n      name\n      emailVerified\n      isOnboarded\n      phone\n      dob\n    }\n  }\n": types.GetCurrentUserDocument,
    "\n  #graphql\n  query GetDefaultOnboardingDetails {\n    getCurrentUser {\n      id\n      email\n      name\n      phone\n      isOnboarded\n      username\n      dob\n    }\n    trusties: getUserTrusties {\n      username\n    }\n  }\n": types.GetDefaultOnboardingDetailsDocument,
    "\n  #graphql\n  query IsUsernameAvailable($username: String!) {\n    isUsernameAvailable(username:$username)\n  }\n": types.IsUsernameAvailableDocument,
    "\n  #graphql\n  query GetChats {\n    chats:getChats {\n      preview{\n          text\n          hasRead\n          at\n      }\n      id\n      user {\n        id\n        username\n        name\n      }\n    }\n  }\n": types.GetChatsDocument,
    "\n  #graphql\n  query GetChat($username: String!) {\n    chat: getChat(username: $username) {\n      user {\n        id\n        name\n      }\n      id\n      preview{\n          text\n      }\n      messages{\n        body\n        createdAt\n        by\n      }\n    }\n  }\n": types.GetChatDocument,
    "\n  #graphql\n  query GetUserTrusties {\n    trusties: getUserTrusties {\n      name\n      email\n      username\n    }\n  }\n": types.GetUserTrustiesDocument,
    "\n  #graphql\n  query VerifyEmail($token:String!) {\n    verifyEmail(token: $token)\n  }\n": types.VerifyEmailDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  mutation UpdateUser($updatedUser: UpdateUserInput!) {\n    updateUser(updatedUser: $updatedUser)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation UpdateUser($updatedUser: UpdateUserInput!) {\n    updateUser(updatedUser: $updatedUser)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  mutation ReadMessage($conversationID:Int!) {\n    readMessage(conversationID: $conversationID)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation ReadMessage($conversationID:Int!) {\n    readMessage(conversationID: $conversationID)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  mutation SendChat($userID: Int!, $body:String!) {\n    sendMessage(userID: $userID, body: $body)\n  }\n"): (typeof documents)["\n  #graphql\n  mutation SendChat($userID: Int!, $body:String!) {\n    sendMessage(userID: $userID, body: $body)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  mutation SendResetPasswordEmail($email:String!) {\n    sendResetPasswordEmail(email: $email)  \n  }\n"): (typeof documents)["\n  #graphql\n  mutation SendResetPasswordEmail($email:String!) {\n    sendResetPasswordEmail(email: $email)  \n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  mutation SendVerificationEmail {\n    sendVerificationEmail\n  }\n"): (typeof documents)["\n  #graphql\n  mutation SendVerificationEmail {\n    sendVerificationEmail\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  mutation ResetPassword($newPassword:String!, $token:String!) {\n    resetPassword(newPassword: $newPassword, token:$token)  \n  }\n"): (typeof documents)["\n  #graphql\n  mutation ResetPassword($newPassword:String!, $token:String!) {\n    resetPassword(newPassword: $newPassword, token:$token)  \n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  mutation SendSOS {\n    sendSos\n  }\n"): (typeof documents)["\n  #graphql\n  mutation SendSOS {\n    sendSos\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetCurrentUser {\n    user: getCurrentUser {\n      id\n      email\n      username\n      name\n      emailVerified\n      isOnboarded\n      phone\n      dob\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetCurrentUser {\n    user: getCurrentUser {\n      id\n      email\n      username\n      name\n      emailVerified\n      isOnboarded\n      phone\n      dob\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetDefaultOnboardingDetails {\n    getCurrentUser {\n      id\n      email\n      name\n      phone\n      isOnboarded\n      username\n      dob\n    }\n    trusties: getUserTrusties {\n      username\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetDefaultOnboardingDetails {\n    getCurrentUser {\n      id\n      email\n      name\n      phone\n      isOnboarded\n      username\n      dob\n    }\n    trusties: getUserTrusties {\n      username\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query IsUsernameAvailable($username: String!) {\n    isUsernameAvailable(username:$username)\n  }\n"): (typeof documents)["\n  #graphql\n  query IsUsernameAvailable($username: String!) {\n    isUsernameAvailable(username:$username)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetChats {\n    chats:getChats {\n      preview{\n          text\n          hasRead\n          at\n      }\n      id\n      user {\n        id\n        username\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetChats {\n    chats:getChats {\n      preview{\n          text\n          hasRead\n          at\n      }\n      id\n      user {\n        id\n        username\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetChat($username: String!) {\n    chat: getChat(username: $username) {\n      user {\n        id\n        name\n      }\n      id\n      preview{\n          text\n      }\n      messages{\n        body\n        createdAt\n        by\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetChat($username: String!) {\n    chat: getChat(username: $username) {\n      user {\n        id\n        name\n      }\n      id\n      preview{\n          text\n      }\n      messages{\n        body\n        createdAt\n        by\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query GetUserTrusties {\n    trusties: getUserTrusties {\n      name\n      email\n      username\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetUserTrusties {\n    trusties: getUserTrusties {\n      name\n      email\n      username\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  #graphql\n  query VerifyEmail($token:String!) {\n    verifyEmail(token: $token)\n  }\n"): (typeof documents)["\n  #graphql\n  query VerifyEmail($token:String!) {\n    verifyEmail(token: $token)\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;