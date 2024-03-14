import gql from 'graphql-tag'

export const USERS_LIST = gql`
  query usersList {
    usersList {
      id
      name
      email
      createdAt
      __typename
    }
  }
`

export const USER_REGISTER = gql`
  mutation userRegister(
    $email: String!
    $password: String!
    $passwordConfirmation: String!
  ) {
    userRegister(
      email: $email
      password: $password
      passwordConfirmation: $passwordConfirmation
    ) {
      authenticatable {
        id
        email
        name
        createdAt
      }
      credentials {
        client
        uid
        accessToken
      }
    }
  }
`
