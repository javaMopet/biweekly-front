import gql from 'graphql-tag'

export const LISTA_CUENTAS_CONTABLES = gql`
  query listaCuentasContables($subnivel: Int!, $clasificacion: String!) {
    listaCuentasContables(subnivel: $subnivel, clasificacion: $clasificacion) {
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
        tipoAfectacion
        subnivel
        padreId
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
        tipoAfectacion
        subnivel
        padreId
      }
    }
  }
`

export const ITEM_DELETE = gql`
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
