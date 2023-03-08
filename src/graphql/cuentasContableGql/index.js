import gql from 'graphql-tag'

export const LISTA_CUENTAS_CONTABLES = gql`
  query listaCuentasContables {
    listaCuentasContables(subnivel: 0) {
      id
      nombre
      nombreCompleto
      padreId
      subnivel
      tipoAfectacion
    }
  }
`
