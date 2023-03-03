import gql from 'graphql-tag'

export const LISTA_MENUS = gql`
  query menuLevels($usuarioId: Int) {
    menuLevels(usuarioId: $usuarioId)
  }
`
