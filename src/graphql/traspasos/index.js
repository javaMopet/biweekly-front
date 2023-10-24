import gql from 'graphql-tag'

export const TRASPASO_CREATE = gql`
  mutation traspasoCreate(
    $input: TraspasoInput!
    $inputDetalle: [TraspasoInput!]!
  ) {
    traspasoCreate(traspasoInput: $input, traspasoDetalleInput: $inputDetalle) {
      traspaso {
        id
      }
    }
  }
`
