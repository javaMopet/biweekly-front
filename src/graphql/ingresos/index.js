import gql from 'graphql-tag'

export const INGRESO_CREATE = gql`
  mutation ingresoCreate($input: IngresoInput!) {
    ingresoCreate(ingresoInput: $input) {
      ingreso {
        id
        registro {
          fecha
          importe
          cuenta {
            id
            nombre
          }
          observaciones
        }
      }
    }
  }
`
