import gql from 'graphql-tag'

// export const LISTA_INSTANCES = gql`
//   query listaInstances($id: ID) {
//     listaInstances(id: $id) {
//       id
//       name
//       logoImage
//     }
//   }
// `
export const INSTANCE_CREATE = gql`
  mutation instanceCreate($input: InstanceInput!) {
    instanceCreate(instanceInput: $input) {
      instance {
        id
        name
        dominio
        logoImage
      }
    }
  }
`
export const INSTANCE_UPDATE = gql`
  mutation instanceUpdate($id: ID!, $input: InstanceInput!) {
    instanceUpdate(id: $id, instanceInput: $input) {
      instance {
        id
        name
        dominio
        logoImage
      }
    }
  }
`
export const INSTANCE_DELETE = gql`
  mutation instanceDelete($id: ID!) {
    instanceDelete(id: $id) {
      instance {
        id
        name
        dominio
        logoImage
      }
    }
  }
`
