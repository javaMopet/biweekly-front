import gql from 'graphql-tag'

export const REGISTRO_DELETE = gql`
  mutation registroDelete($id: ID!) {
    registroDelete(id: $id) {
      registro {
        id
        cuentaId
        estadoRegistroId
      }
    }
  }
`
