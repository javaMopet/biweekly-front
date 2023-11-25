import gql from 'graphql-tag'

export const LISTA_CUENTAS = gql`
  query listaCuentas {
    listaCuentas {
      id
      nombre
      identificador
      diaCorte
      cuentaContableId
      cuentaContable {
        id
        nombre
        nombreCompleto
      }
      tipoCuenta {
        id
        nombre
        label
        value
        icon
      }
      banco {
        id
        nombre
        icono
      }
      saldo
      propietario
      diasGracia
    }
  }
`
export const LISTA_CUENTAS_REDUCED = gql`
  query listaCuentas {
    listaCuentas {
      id
      nombre
      tipoCuenta {
        id
        nombre
      }
    }
  }
`
export const LISTA_TIPOS_CUENTA = gql`
  query listaTiposCuenta {
    listaTiposCuenta {
      id
      nombre
      label
      value
      icon
    }
  }
`
export const OBTENER_SALDO_A_FECHA = gql`
  query saldoAFecha($cuentaId: ID!, $fechaFin: ISO8601Date!) {
    obtenerSaldoAFecha(cuentaId: $cuentaId, fechaFin: $fechaFin)
  }
`

export const CUENTA_CREATE = gql`
  mutation cuentaCreate($input: CuentaInput!) {
    cuentaCreate(cuentaInput: $input) {
      cuenta {
        id
        nombre
        identificador
        cuentaContableId
        diaCorte
        cuentaContable {
          id
          nombre
          nombreCompleto
        }
        tipoCuenta {
          id
          nombre
          label
          value
          icon
        }
        banco {
          id
          nombre
          icono
        }
        saldo
        propietario
        diasGracia
      }
    }
  }
`
export const CUENTA_UPDATE = gql`
  mutation cuentaUpdate($id: ID!, $input: CuentaInput!) {
    cuentaUpdate(id: $id, cuentaInput: $input) {
      cuenta {
        id
        nombre
        identificador
        cuentaContableId
        diaCorte
        cuentaContable {
          id
          nombre
          nombreCompleto
        }
        tipoCuenta {
          id
          nombre
          label
          value
          icon
        }
        banco {
          id
          nombre
          icono
        }
        saldo
        propietario
        diasGracia
      }
    }
  }
`
export const CUENTA_SALDO_UPDATE = gql`
  mutation cuentaSaldoUpdate($cuentaId: ID!) {
    cuentaSaldoUpdate(cuentaId: $cuentaId) {
      cuenta {
        id
        saldo
      }
    }
  }
`

export const CUENTA_DELETE = gql`
  mutation cuentaDelete($id: ID!) {
    cuentaDelete(id: $id) {
      cuenta {
        id
        nombre
        identificador
        cuentaContableId
        diaCorte
        cuentaContable {
          id
          nombre
          nombreCompleto
        }
        tipoCuenta {
          id
          nombre
          label
          value
          icon
        }
        banco {
          id
          nombre
          icono
        }
        saldo
        diasGracia
      }
    }
  }
`

export const SALDO_TARJETA_CREDITO = gql`
  query saldoTarjetaCredito(
    $cuentaId: ID!
    $fechaFin: ISO8601Date
    $isDetalle: Int!
  ) {
    saldoTarjetaCredito(
      cuentaId: $cuentaId
      fechaFin: $fechaFin
      isDetalle: $isDetalle
    )
  }
`

export const SALDO_PAGAR_TARJETA_CREDITO = gql`
  query saldoPagarTarjetaCredito(
    $cuentaId: ID!
    $fechaFin: ISO8601Date
    $isDetalle: Int!
  ) {
    saldoPagarTarjetaCredito(
      cuentaId: $cuentaId
      fechaFin: $fechaFin
      isDetalle: $isDetalle
    )
  }
`
