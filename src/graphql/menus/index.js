import gql from 'graphql-tag'

export const ARBOL_MENUS = gql`
  query menuLevels {
    menuLevels
  }
`
export const MENUS_LIST = gql`
  query menusList {
    menusList {
      id
      nombre
      icono
      padre
      activo
      padre
      ruta
    }
  }
`
