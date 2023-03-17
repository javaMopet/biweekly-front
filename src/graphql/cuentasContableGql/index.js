import gql from 'graphql-tag'

export const LISTA_CUENTAS_CONTABLES = gql`
  query listaCuentasContables($subnivel: Int!) {
    listaCuentasContables(subnivel: $subnivel) {
      id
      nombre
      nombreCompleto
      padreId
      subnivel
      tipoAfectacion
    }
  }
`
