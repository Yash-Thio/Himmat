/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Conversation = {
  __typename?: 'Conversation';
  id: Scalars['Float']['output'];
  messages: Array<Message>;
  preview?: Maybe<Preview>;
  user?: Maybe<User>;
};


export type ConversationMessagesArgs = {
  page?: InputMaybe<Scalars['Float']['input']>;
};

export type Message = {
  __typename?: 'Message';
  body: Scalars['String']['output'];
  by: Scalars['Float']['output'];
  createdAt: Scalars['Float']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  readMessage: Scalars['Boolean']['output'];
  resetPassword: Scalars['Boolean']['output'];
  sendMessage: Scalars['Boolean']['output'];
  sendResetPasswordEmail?: Maybe<Scalars['Boolean']['output']>;
  sendSos: Scalars['Boolean']['output'];
  sendVerificationEmail: Scalars['Boolean']['output'];
  updateUser: Scalars['Boolean']['output'];
};


export type MutationReadMessageArgs = {
  conversationID: Scalars['Int']['input'];
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationSendMessageArgs = {
  body: Scalars['String']['input'];
  userID: Scalars['Int']['input'];
};


export type MutationSendResetPasswordEmailArgs = {
  email: Scalars['String']['input'];
};


export type MutationUpdateUserArgs = {
  updatedUser: UpdateUserInput;
};

export type Preview = {
  __typename?: 'Preview';
  at: Scalars['Float']['output'];
  hasRead: Scalars['Boolean']['output'];
  text: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  getChat?: Maybe<Conversation>;
  getChats: Array<Conversation>;
  getCurrentUser?: Maybe<User>;
  getUserTrusties: Array<Trusted>;
  isUsernameAvailable: Scalars['Boolean']['output'];
  verifyEmail: Scalars['Boolean']['output'];
};


export type QueryGetChatArgs = {
  username: Scalars['String']['input'];
};


export type QueryIsUsernameAvailableArgs = {
  username: Scalars['String']['input'];
};


export type QueryVerifyEmailArgs = {
  token: Scalars['String']['input'];
};

export type Trusted = {
  __typename?: 'Trusted';
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  userId: Scalars['Float']['output'];
  username: Scalars['String']['output'];
};

export type TrustedContactInput = {
  username: Scalars['String']['input'];
};

export type UpdateUserInput = {
  dob?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  trusties?: InputMaybe<Array<TrustedContactInput>>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  dob?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailVerified: Scalars['Boolean']['output'];
  id: Scalars['Float']['output'];
  isOnboarded?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type UpdateUserMutationVariables = Exact<{
  updatedUser: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: boolean };

export type ReadMessageMutationVariables = Exact<{
  conversationID: Scalars['Int']['input'];
}>;


export type ReadMessageMutation = { __typename?: 'Mutation', readMessage: boolean };

export type SendChatMutationVariables = Exact<{
  userID: Scalars['Int']['input'];
  body: Scalars['String']['input'];
}>;


export type SendChatMutation = { __typename?: 'Mutation', sendMessage: boolean };

export type SendResetPasswordEmailMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type SendResetPasswordEmailMutation = { __typename?: 'Mutation', sendResetPasswordEmail?: boolean | null };

export type SendVerificationEmailMutationVariables = Exact<{ [key: string]: never; }>;


export type SendVerificationEmailMutation = { __typename?: 'Mutation', sendVerificationEmail: boolean };

export type ResetPasswordMutationVariables = Exact<{
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: boolean };

export type SendSosMutationVariables = Exact<{ [key: string]: never; }>;


export type SendSosMutation = { __typename?: 'Mutation', sendSos: boolean };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: number, email?: string | null, username?: string | null, name?: string | null, emailVerified: boolean, isOnboarded?: boolean | null, phone?: string | null, dob?: string | null } | null };

export type GetDefaultOnboardingDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDefaultOnboardingDetailsQuery = { __typename?: 'Query', getCurrentUser?: { __typename?: 'User', id: number, email?: string | null, name?: string | null, phone?: string | null, isOnboarded?: boolean | null, username?: string | null, dob?: string | null } | null, trusties: Array<{ __typename?: 'Trusted', username: string }> };

export type IsUsernameAvailableQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type IsUsernameAvailableQuery = { __typename?: 'Query', isUsernameAvailable: boolean };

export type GetChatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChatsQuery = { __typename?: 'Query', chats: Array<{ __typename?: 'Conversation', id: number, preview?: { __typename?: 'Preview', text: string, hasRead: boolean, at: number } | null, user?: { __typename?: 'User', id: number, username?: string | null, name?: string | null } | null }> };

export type GetChatQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type GetChatQuery = { __typename?: 'Query', chat?: { __typename?: 'Conversation', id: number, user?: { __typename?: 'User', id: number, name?: string | null } | null, preview?: { __typename?: 'Preview', text: string } | null, messages: Array<{ __typename?: 'Message', body: string, createdAt: number, by: number }> } | null };

export type GetUserTrustiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserTrustiesQuery = { __typename?: 'Query', trusties: Array<{ __typename?: 'Trusted', name: string, email: string, username: string }> };

export type VerifyEmailQueryVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type VerifyEmailQuery = { __typename?: 'Query', verifyEmail: boolean };


export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"updatedUser"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"updatedUser"},"value":{"kind":"Variable","name":{"kind":"Name","value":"updatedUser"}}}]}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const ReadMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReadMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"conversationID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"readMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"conversationID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"conversationID"}}}]}]}}]} as unknown as DocumentNode<ReadMessageMutation, ReadMessageMutationVariables>;
export const SendChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendChat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"body"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userID"}}},{"kind":"Argument","name":{"kind":"Name","value":"body"},"value":{"kind":"Variable","name":{"kind":"Name","value":"body"}}}]}]}}]} as unknown as DocumentNode<SendChatMutation, SendChatMutationVariables>;
export const SendResetPasswordEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendResetPasswordEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendResetPasswordEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<SendResetPasswordEmailMutation, SendResetPasswordEmailMutationVariables>;
export const SendVerificationEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendVerificationEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendVerificationEmail"}}]}}]} as unknown as DocumentNode<SendVerificationEmailMutation, SendVerificationEmailMutationVariables>;
export const ResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}]}}]} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const SendSosDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendSOS"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendSos"}}]}}]} as unknown as DocumentNode<SendSosMutation, SendSosMutationVariables>;
export const GetCurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"user"},"name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"isOnboarded"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}}]}}]}}]} as unknown as DocumentNode<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const GetDefaultOnboardingDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDefaultOnboardingDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"isOnboarded"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"dob"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"trusties"},"name":{"kind":"Name","value":"getUserTrusties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<GetDefaultOnboardingDetailsQuery, GetDefaultOnboardingDetailsQueryVariables>;
export const IsUsernameAvailableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"IsUsernameAvailable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isUsernameAvailable"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}]}]}}]} as unknown as DocumentNode<IsUsernameAvailableQuery, IsUsernameAvailableQueryVariables>;
export const GetChatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"chats"},"name":{"kind":"Name","value":"getChats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"preview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"hasRead"}},{"kind":"Field","name":{"kind":"Name","value":"at"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetChatsQuery, GetChatsQueryVariables>;
export const GetChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"chat"},"name":{"kind":"Name","value":"getChat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"Field","name":{"kind":"Name","value":"messages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"by"}}]}}]}}]}}]} as unknown as DocumentNode<GetChatQuery, GetChatQueryVariables>;
export const GetUserTrustiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserTrusties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"trusties"},"name":{"kind":"Name","value":"getUserTrusties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<GetUserTrustiesQuery, GetUserTrustiesQueryVariables>;
export const VerifyEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VerifyEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}]}}]} as unknown as DocumentNode<VerifyEmailQuery, VerifyEmailQueryVariables>;