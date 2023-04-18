import gql from 'graphql-tag'

export const EGRESO_CREATE = gql`
  mutation egresoCreate($input: EgresoInput!) {
    egresoCreate(egresoInput: $input) {
      egreso {
        id
        observaciones
      }
    }
  }
`
