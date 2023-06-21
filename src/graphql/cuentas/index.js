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
    }
  }
`
export const LISTA_CUENTAS_REDUCED = gql`
  query listaCuentas {
    listaCuentas {
      id
      nombre
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
      }
    }
  }
`
