import gql from 'graphql-tag'

export const LISTA_CATEGORIAS = gql`
  query listaCategorias {
    listaCategorias {
      id
      nombre
      descripcion
      color
      icono
      cuentaContable {
        id
        nombre
        nombreCompleto
      }
      tipoCategoria {
        id
        nombre
        value
      }
    }
  }
`
export const LISTA_TIPOS_CATEGORIA = gql`
  query listaTiposCategoria {
    listaTiposCategoria {
      id
      nombre
      tipoAfectacion
      label
      value
    }
  }
`

export const CATEGORIA_CREATE = gql`
  mutation categoriaCreate($input: CategoriaInput!) {
    categoriaCreate(categoriaInput: $input) {
      categoria {
        id
        nombre
        descripcion
        color
        icono
        cuentaContable {
          id
          nombre
          nombreCompleto
        }
        tipoCategoria {
          id
          nombre
          value
        }
      }
    }
  }
`
export const CATEGORIA_UPDATE = gql`
  mutation categoriaUpdate($id: ID!, $input: CategoriaInput!) {
    categoriaUpdate(id: $id, categoriaInput: $input) {
      categoria {
        id
        nombre
        descripcion
        color
        icono
        cuentaContable {
          id
          nombre
          nombreCompleto
        }
        tipoCategoria {
          id
          nombre
          value
        }
      }
    }
  }
`

export const CATEGORIA_DELETE = gql`
  mutation categoriaDelete($id: ID!) {
    categoriaDelete(id: $id) {
      categoria {
        id
        nombre
        descripcion
        color
        icono
        cuentaContable {
          id
          nombre
          nombreCompleto
        }
        tipoCategoria {
          id
          nombre
          value
        }
      }
    }
  }
`
