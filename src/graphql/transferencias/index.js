import gql from 'graphql-tag'

export const TRANSFERENCIA_CREATE = gql`
  mutation transferenciaCreate($input: TransferenciaInput!) {
    transferenciaCreate(transferenciaInput: $input) {
      transferencia {
        id
        observaciones
      }
    }
  }
`
