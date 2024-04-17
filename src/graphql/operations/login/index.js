import gql from 'graphql-tag'

export const LOGIN = gql`
  mutation userLongin($email: String!, $password: String!) {
    userLogin(email: $email, password: $password) {
      authenticatable {
        id
        email
        name
        instance {
          id
          name
          logoImage
        }
        menus {
          id
          nombre
          icono
          ruta
        }
        canModify
        isAdmin
        isSuperuser
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
export const SEND_PASSWORD_RESET = gql`
  mutation userSendPasswordResetWithToken(
    $email: String!
    $redirectUrl: String!
  ) {
    userSendPasswordResetWithToken(email: $email, redirectUrl: $redirectUrl) {
      message
    }
  }
`
export const UPDATE_PASSWORD_WITH_TOKEN = gql`
  mutation updatePasswordWithToken(
    $password: String!
    $passwordConfirmation: String!
    $resetPasswordToken: String!
  ) {
    userUpdatePasswordWithToken(
      password: $password
      passwordConfirmation: $passwordConfirmation
      resetPasswordToken: $resetPasswordToken
    ) {
      authenticatable {
        id
        name
        email
        isAdmin
        isSuperuser
      }
      credentials {
        uid
        client
        accessToken
        tokenType
        expiry
      }
    }
  }
`
