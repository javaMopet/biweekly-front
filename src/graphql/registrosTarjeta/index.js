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
      importeMensual
      isPago
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

export const REGISTRO_TARJETA_CREATE = gql`
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

export const REGISTRO_TARJETA_UPDATE = gql`
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

export const REGISTRO_TARJETA_DELETE = gql`
  mutation registroTarjetaDelete($id: ID!) {
    registroTarjetaDelete(id: $id) {
      registroTarjeta {
        id
        cuentaId
        cuenta {
          id
          nombre
        }
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

export const REGISTROS_TARJETA_DELETE = gql`
  mutation registrosTarjetaDelete($ids: String!) {
    registrosTarjetaDelete(ids: $ids) {
      saldo
    }
  }
`
