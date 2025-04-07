import gql from 'graphql-tag'

export const ROLE_LIST = gql`
  query roleList {
    roleList {
      id
      name
      resourceId
      resourceType
      updatedAt
      createdAt
    }
  }
`
