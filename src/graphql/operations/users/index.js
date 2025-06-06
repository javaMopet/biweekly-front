import gql from 'graphql-tag'

export const USERS_LIST = gql`
  query usersList($instanceId: ID!) {
    usersList(instanceId: $instanceId) {
      id
      name
      email
      instances {
        id
        name
        dominio
        logoImage
        createdAt
      }
      isAdmin
      isSuperuser
      roles {
        id
        name
        resourceId
        resourceType
        updatedAt
        createdAt
      }
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
    $name: String!
    $instances: [ID!]
    $roles: [ID!]
  ) {
    userRegister(
      email: $email
      password: $password
      passwordConfirmation: $passwordConfirmation
      name: $name
      instances: $instances
      roles: $roles
    ) {
      authenticatable {
        id
        email
        name
        roles
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
  mutation userUpdate(
    $id: ID!
    $userInput: UserInput!
    $instances: [ID!]
    $roles: [ID!]
  ) {
    userUpdate(
      id: $id
      userInput: $userInput
      instances: $instances
      roles: $roles
    ) {
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
export const USER_ADD_ROLE = gql`
  mutation userAddRole($userId: ID!, $role: String!) {
    userAddRole(userId: $userId, role: $role) {
      user {
        id
        isAdmin
      }
    }
  }
`

export const USER_REMOVE_ROLE = gql`
  mutation userRemoveRole($userId: ID!, $role: String!) {
    userRemoveRole(userId: $userId, role: $role) {
      user {
        id
        isAdmin
      }
    }
  }
`
