import gql from 'graphql-tag'

export const LISTA_REGISTROS = gql`
  query obtenerRegistros(
    $cuentaId: ID
    $categoriaId: ID
    $fechaInicio: ISO8601Date!
    $fechaFin: ISO8601Date!
  ) {
    obtenerRegistros(
      cuentaId: $cuentaId
      categoriaId: $categoriaId
      fechaInicio: $fechaInicio
      fechaFin: $fechaFin
    ) {
      id
      estadoRegistroId
      tipoAfectacion
      fecha
      importe
      observaciones
      importe
      cargo
      abono
      tipoCuentaTraspasoId
      disable
      cuenta {
        id
        nombre
      }
      categoria {
        id
        nombre
        tipoMovimientoId
      }
      registroTarjeta {
        id
        fecha
        pagoTarjetaId
        cuenta {
          id
          nombre
        }
      }
      traspasoDetalle {
        id
        traspasoId
        tipoCuentaTraspasoId
        importe
      }
      traspaso {
        id
        fecha
        observaciones
        userId
        traspasoDetalles {
          id
          tipoCuentaTraspasoId
          cuenta {
            id
            nombre
          }
        }
      }
      userId
    }
  }
`
export const REGISTRO_CREATE = gql`
  mutation registroCreate($input: RegistroInput!) {
    registroCreate(registroInput: $input) {
      registro {
        id
        estadoRegistroId
        tipoAfectacion
        fecha
        importe
        observaciones
        importe
        cuenta {
          id
          nombre
        }
        categoria {
          id
          nombre
          tipoMovimientoId
        }
      }
    }
  }
`
export const REGISTRO_UPDATE = gql`
  mutation registroUpdate($id: ID!, $input: RegistroInput!) {
    registroUpdate(id: $id, registroInput: $input) {
      registro {
        id
        estadoRegistroId
        tipoAfectacion
        fecha
        importe
        observaciones
        importe
        cuenta {
          id
          nombre
        }
        categoria {
          id
          nombre
          tipoMovimientoId
        }
      }
    }
  }
`
export const REGISTRO_PARCIAL_UPDATE = gql`
  mutation registroParcialUpdate($id: ID!, $observaciones: String!) {
    registroParcialUpdate(id: $id, observaciones: $observaciones) {
      registro {
        id
        estadoRegistroId
        tipoAfectacion
        fecha
        importe
        observaciones
        importe
        cuenta {
          id
          nombre
        }
        categoria {
          id
          nombre
          tipoMovimientoId
        }
      }
    }
  }
`

export const REGISTRO_DELETE = gql`
  mutation registroDelete($id: ID!) {
    registroDelete(id: $id) {
      registro {
        id
        cuenta {
          id
          nombre
        }
        estadoRegistroId
      }
    }
  }
`
export const REGISTROS_DELETE = gql`
  mutation registrosDelete($ids: String!) {
    registrosDelete(ids: $ids) {
      cuentasIds
    }
  }
`

export const IMPORTAR_REGISTROS = gql`
  mutation importarRegistros(
    $registrosInput: [RegistroInput!]!
    $traspasosInput: [TraspasoInput!]!
  ) {
    importarRegistros(
      registrosInput: $registrosInput
      traspasosInput: $traspasosInput
    ) {
      registros {
        id
        estadoRegistroId
        tipoAfectacion
        fecha
        importe
        observaciones
        importe
        cuenta {
          id
          nombre
        }
        categoria {
          id
          nombre
          tipoMovimientoId
        }
      }
    }
  }
`

export const REGISTRO_DATE_UPDATE = gql`
  mutation registroTarjetaDateUpdate(
    $pagoTarjetaId: ID!
    $fecha: ISO8601Date!
  ) {
    registroTarjetaDateUpdate(pagoTarjetaId: $pagoTarjetaId, fecha: $fecha) {
      fechaNueva
    }
  }
`
