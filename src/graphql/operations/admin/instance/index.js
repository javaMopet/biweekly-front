import gql from 'graphql-tag'

export const INSTANCE_LIST = gql`
  query instanceList {
    instanceList {
      id
      name
      dominio
      logoImage
      createdAt
    }
  }
`
