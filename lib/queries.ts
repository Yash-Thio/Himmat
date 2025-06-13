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
      name
      email
    }
  }
`);

export const IS_USERNAME_AVAILABLE = gql(`
  #graphql
  query IsUsernameAvailable($username: String!) {
    isUsernameAvailable(username:$username)
  }
`);