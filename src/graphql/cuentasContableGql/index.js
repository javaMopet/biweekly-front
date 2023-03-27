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
