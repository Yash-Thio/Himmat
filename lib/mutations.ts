import { gql } from "@/__generated__";

export const UPDATE_USER = gql(`
  #graphql
  mutation UpdateUser($updatedUser: UpdateUserInput!) {
    updateUser(updatedUser: $updatedUser)
  }
`);


export const READ_MESSAGE = gql(`
  #graphql
  mutation ReadMessage($conversationID:Int!) {
    readMessage(conversationID: $conversationID)
  }
`);

export const SEND_CHAT = gql(`
  #graphql
  mutation SendChat($userID: Int!, $body:String!) {
    sendMessage(userID: $userID, body: $body)
  }
`);


export const SEND_RESET_PASSWORD_EMAIL = gql(`
  #graphql
  mutation SendResetPasswordEmail($email:String!) {
    sendResetPasswordEmail(email: $email)  
  }
`);
export const SEND_VERIFICATION_EMAIL = gql(`
  #graphql
  mutation SendVerificationEmail {
    sendVerificationEmail
  }
`);

export const RESET_PASSWORD = gql(`
  #graphql
  mutation ResetPassword($newPassword:String!, $token:String!) {
    resetPassword(newPassword: $newPassword, token:$token)  
  }
`);