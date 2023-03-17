import gql from 'graphql-tag'

export const LISTA_CUENTAS = gql`
  query listaCuentas {
    listaCuentas {
      id
      nombre
      nombreCompleto
      padreId
      subnivel
      tipoAfectacion
    }
  }
`
