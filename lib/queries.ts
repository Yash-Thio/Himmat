import { gql } from "@/__generated__";

export const GET_CURRENT_USER = gql(`
  #graphql
  query GetCurrentUser {
    user: getCurrentUser {
      id
      email
      username
      name
      emailVerified
      isOnboarded
      phone
      dob
    }
  }
`);

export const GET_DEFAULT_ONBOARDING_DETAILS = gql(`
  #graphql
  query GetDefaultOnboardingDetails {
    getCurrentUser {
      id
      email
      name
      phone
      isOnboarded
      username
      dob
    }
    trusties: getUserTrusties {
      username
    }
  }
`);

export const IS_USERNAME_AVAILABLE = gql(`
  #graphql
  query IsUsernameAvailable($username: String!) {
    isUsernameAvailable(username:$username)
  }
`);

export const GET_CHATS = gql(`
  #graphql
  query GetChats {
    chats:getChats {
      preview{
          text
          hasRead
          at
      }
      id
      user {
        id
        username
        name
      }
    }
  }
`);

export const GET_CHAT = gql(`
  #graphql
  query GetChat($username: String!) {
    chat: getChat(username: $username) {
      user {
        id
        name
      }
      id
      preview{
          text
      }
      messages{
        body
        createdAt
        by
      }
    }
  }
`);

export const GET_USER_TRUSTED_DETAILS = gql(`
  #graphql
  query GetUserTrusties {
    trusties: getUserTrusties {
      name
      email
      username
    }
  }
`);

export const VERIFY_EMAIL = gql(`
  #graphql
  query VerifyEmail($token:String!) {
    verifyEmail(token: $token)
  }
`);