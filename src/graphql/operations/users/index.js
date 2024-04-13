import gql from 'graphql-tag'

export const USERS_LIST = gql`
  query usersList {
    usersList {
      id
      name
      email
      instance {
        id
        name
        logoImage
      }
      isAdmin
      roles
      menus {
        id
        nombre
        activo
      }
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

export const USER_UPDATE = gql`
  mutation userUpdate($id: ID!, $userInput: UserInput!) {
    userUpdate(id: $id, userInput: $userInput) {
      user {
        id
        email
        name
        createdAt
      }
    }
  }
`

export const USER_DELETE = gql`
  mutation userDelete($id: ID!) {
    userDelete(id: $id) {
      user {
        id
        email
        name
        createdAt
      }
    }
  }
`

export const USER_MENU_UPDATE = gql`
  mutation userMenuUpdate($id: ID!, $menuInput: JSON!) {
    userMenuUpdate(id: $id, menuInput: $menuInput) {
      user {
        id
        menus {
          id
          nombre
          activo
        }
      }
    }
  }
`
