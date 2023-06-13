import gql from 'graphql-tag'

export const LISTA_REGISTROS_TARJETA = gql`
  query listaRegistrosTarjeta(
    $cuentaId: ID
    $fechaInicio: ISO8601Date!
    $fechaFin: ISO8601Date!
    $isMsi: Boolean
  ) {
    listaRegistrosTarjeta(
      cuentaId: $cuentaId
      fechaInicio: $fechaInicio
      fechaFin: $fechaFin
      isMsi: $isMsi
    ) {
      id
      cuentaId
      categoriaId
      importe
      fecha
      concepto
      isMsi
      numeroMsi
      estadoRegistroTarjeta {
        id
        nombre
      }
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
`

export const CREATE_REGISTRO_TARJETA = gql`
  mutation registroTarjetaCreate($input: RegistroTarjetaInput!) {
    registroTarjetaCreate(registroTarjetaInput: $input) {
      registroTarjeta {
        id
        cuentaId
        categoriaId
        importe
        fecha
        concepto
        isMsi
        numeroMsi
        estadoRegistroTarjeta {
          id
          nombre
        }
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

export const UPDATE_REGISTRO_TARJETA = gql`
  mutation registroTarjetaUpdate($id: ID!, $input: RegistroTarjetaInput!) {
    registroTarjetaUpdate(id: $id, registroTarjetaInput: $input) {
      registroTarjeta {
        id
        cuentaId
        categoriaId
        importe
        fecha
        concepto
        isMsi
        numeroMsi
        estadoRegistroTarjeta {
          id
          nombre
        }
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
