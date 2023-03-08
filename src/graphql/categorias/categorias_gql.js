import gql from 'graphql-tag'

export const LISTA_CATEGORIAS = gql`
  query listaCategorias {
    listaCategorias {
      id
      nombre
      descripcion
      icono
      color
      tipoCategoria {
        id
        nombre
        tipoAfectacion
      }
      cuentaContable {
        id
        nombre
        subnivel
      }
      createdAt
    }
  }
`
export const LISTA_TIPOS_CATEGORIA = gql`
  query listaTiposCategoria {
    listaTiposCategoria {
      id
      nombre
      tipoAfectacion
    }
  }
`
