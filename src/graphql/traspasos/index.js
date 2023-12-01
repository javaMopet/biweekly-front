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

export const TRASPASO_UPDATE = gql`
  mutation traspasoUpdate(
    $id: ID!
    $input: TraspasoInput!
    $inputDetalle: [TraspasoDetalleInput!]!
  ) {
    traspasoUpdate(
      id: $id
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
export const LISTA_TRASPASOS = gql`
  query listaTraspasos($id: ID) {
    listaTraspasos(id: $id) {
      id
      fecha
      observaciones
      traspasoDetalles {
        id
        tipoCuentaTraspasoId
        importe
        cuenta {
          id
          nombre
          identificador
        }
        registro {
          id
          fecha
          importe
        }
      }
      createdAt
    }
  }
`
