import gql from 'graphql-tag'

export const TRASPASO_CREATE = gql`
  mutation traspasoCreate(
    $input: TraspasoInput!
    $inputDetalle: [TraspasoDetalleInput!]!
  ) {
    traspasoCreate(
      traspasoInput: $input
      traspasosDetalleInput: $inputDetalle
    ) {
      traspaso {
        id
      }
    }
  }
`

export const TRASPASO_DELETE = gql`
  mutation traspasoDelete($id: ID!) {
    traspasoDelete(id: $id) {
      traspaso {
        id
      }
    }
  }
`
