import gql from 'graphql-tag'

export const LISTA_CUENTAS_CONTABLES = gql`
  query listaCuentasContables(
    $subnivel: Int
    $clasificacion: String
    $tipoAfectacion: String
  ) {
    listaCuentasContables(
      subnivel: $subnivel
      clasificacion: $clasificacion
      tipoAfectacion: $tipoAfectacion
    ) {
      id
      nombre
      nombreCompleto
      padreId
      subnivel
      tipoAfectacion
    }
  }
`

export const ARBOL_CUENTAS_CONTABLES = gql`
  query arbolCuentasContables {
    arbolCuentasContables
  }
`

export const CUENTA_CONTABLE_CREATE = gql`
  mutation cuentaContableCreate($input: CuentaContableInput!) {
    cuentaContableCreate(cuentaContableInput: $input) {
      cuentaContable {
        id
        nombre
        nombreCompleto
        tipoAfectacion
        subnivel
        padreId
        padre {
          id
          nombre
          nombreCompleto
        }
      }
    }
  }
`
export const CUENTA_CONTABLE_UPDATE = gql`
  mutation cuentaContableUpdate($id: ID!, $input: CuentaContableInput!) {
    cuentaContableUpdate(id: $id, cuentaContableInput: $input) {
      cuentaContable {
        id
        nombre
        nombreCompleto
        tipoAfectacion
        subnivel
        padreId
        padre {
          id
          nombre
          nombreCompleto
        }
      }
    }
  }
`

export const CUENTA_CONTABLE_DELETE = gql`
  mutation cuentaContableDelete($id: ID!) {
    cuentaContableDelete(id: $id) {
      cuentaContable {
        id
        nombre
        nombreCompleto
        tipoAfectacion
        subnivel
        padreId
      }
    }
  }
`
