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
    cuentaContableCreate(input: $input) {
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
