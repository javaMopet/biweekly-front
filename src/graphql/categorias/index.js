import gql from 'graphql-tag'

export const LISTA_CATEGORIAS = gql`
  query listaCategorias($instanceId: ID!) {
    listaCategorias(instanceId: $instanceId) {
      id
      nombre
      descripcion
      color
      icono
      importeDefault
      tipoMovimientoId
      tipoMovimiento {
        id
        nombre
        value
      }
      cuentaDefault {
        id
        nombre
      }
    }
  }
`
// cuentaContable {
//   id
//   nombre
//   nombreCompleto
// }
// instanceId

export const CATEGORIA_BY_ID = gql`
  query categoriaById($id: ID!) {
    categoriaById(id: $id) {
      id
      nombre
      descripcion
      color
      icono
      importeDefault
      tipoMovimiento {
        id
        nombre
      }
      cuentaContable {
        id
        nombre
      }
      cuentaDefault {
        id
        nombre
      }
    }
  }
`

export const CATEGORIA_CREATE = gql`
  mutation categoriaCreate($input: CategoriaInput!, $instanceId: ID!) {
    categoriaCreate(categoriaInput: $input, instanceId: $instanceId) {
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
        tipoMovimientoId
        tipoMovimiento {
          id
          nombre
          value
        }
        cuentaDefault {
          id
          nombre
        }
        importeDefault
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
        importeDefault
        cuentaContable {
          id
          nombre
          nombreCompleto
        }
        tipoMovimientoId
        tipoMovimiento {
          id
          nombre
          value
        }
        cuentaDefault {
          id
          nombre
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
        tipoMovimiento {
          id
          nombre
          value
        }
      }
    }
  }
`
