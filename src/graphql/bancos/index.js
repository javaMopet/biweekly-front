import gql from 'graphql-tag'

export const LISTA_BANCOS = gql`
  query listaBancos {
    listaBancos {
      id
      nombre
      icono
    }
  }
`
