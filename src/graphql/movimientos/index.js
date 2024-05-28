import gql from 'graphql-tag'

export const LISTA_TIPOS_MOVIMIENTO = gql`
  query listaTiposMovimiento {
    listaTiposMovimiento {
      id
      nombre
      label
      value
      icon
      icono
    }
  }
`
