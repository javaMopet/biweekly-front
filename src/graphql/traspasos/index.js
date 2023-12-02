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
        detalleOrigen {
          id
          cuentaId
          tipoCuentaTraspasoId
        }
        detalleDestino {
          id
          cuentaId
          tipoCuentaTraspasoId
        }
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
        detalleOrigen {
          id
          cuentaId
          tipoCuentaTraspasoId
        }
        detalleDestino {
          id
          cuentaId
          tipoCuentaTraspasoId
        }
      }
      cuentasIds
      cuentas {
        id
        nombre
        saldo
      }
    }
  }
`

export const TRASPASO_DELETE = gql`
  mutation traspasoDelete($id: ID!) {
    traspasoDelete(id: $id) {
      traspaso {
        id
        detalleOrigen {
          id
          cuentaId
          tipoCuentaTraspasoId
        }
        detalleDestino {
          id
          cuentaId
          tipoCuentaTraspasoId
        }
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
