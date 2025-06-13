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
    }
  }
`);