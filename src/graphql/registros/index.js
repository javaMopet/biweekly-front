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
        cuenta {
          id
          nombre
        }
      }
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
