import gql from 'graphql-tag'

export const LOGIN = gql`
  mutation userLongin($email: String!, $password: String!) {
    userLogin(email: $email, password: $password) {
      authenticatable {
        id
        email
        name
      }
      credentials {
        uid
        tokenType
        accessToken
        client
        expiry
        __typename
      }
    }
  }
`

export const LOGOUT = gql`
  mutation userLogOut {
    userLogout {
      authenticatable {
        id
        email
        name
      }
    }
  }
`
