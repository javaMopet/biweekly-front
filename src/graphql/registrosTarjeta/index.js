import gql from 'graphql-tag'

export const LISTA_REGISTROS_TARJETA = gql`
  query listaRegistrosTarjeta(
    $cuentaId: ID
    $fechaInicio: ISO8601Date!
    $fechaFin: ISO8601Date!
    $isMsi: Boolean
    $estadoRegistroTarjetaId: ID
  ) {
    listaRegistrosTarjeta(
      cuentaId: $cuentaId
      fechaInicio: $fechaInicio
      fechaFin: $fechaFin
      isMsi: $isMsi
      estadoRegistroTarjetaId: $estadoRegistroTarjetaId
    ) {
      id
      cuentaId
      categoriaId
      importe
      fecha
      concepto
      isMsi
      numeroMsi
      tipoAfectacion
      cargo
      abono
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

export const DELETE_REGISTRO_TARJETA = gql`
  mutation registroTarjetaDelete($id: ID!) {
    registroTarjetaDelete(id: $id) {
      registroTarjeta {
        id
        cuentaId
        categoriaId
        importe
        fecha
        concepto
        isMsi
        numeroMsi
      }
    }
  }
`
