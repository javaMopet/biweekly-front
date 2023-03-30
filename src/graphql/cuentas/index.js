import gql from 'graphql-tag'

export const LISTA_CUENTAS = gql`
  query listaCuentas {
    listaCuentas {
      id
      nombre
      descripcion
      cuentaContableId
      cuentaContable {
        id
        nombre
        nombreCompleto
      }
    }
  }
`

export const CUENTA_CREATE = gql`
  mutation cuentaCreate($input: CuentaInput!) {
    cuentaCreate(cuentaInput: $input) {
      cuenta {
        id
        nombre
        descripcion
        cuentaContableId
        cuentaContable {
          id
          nombre
          nombreCompleto
        }
      }
    }
  }
`
export const CUENTA_UPDATE = gql`
  mutation cuentaUpdate($id: ID!, $input: CuentaInput!) {
    cuentaUpdate(id: $id, cuentaInput: $input) {
      cuenta {
        id
        nombre
        descripcion
        cuentaContableId
        cuentaContable {
          id
          nombre
          nombreCompleto
        }
      }
    }
  }
`

export const CUENTA_DELETE = gql`
  mutation cuentaDelete($id: ID!) {
    cuentaDelete(id: $id) {
      cuenta {
        id
        nombre
        descripcion
        cuentaContableId
        cuentaContable {
          id
          nombre
          nombreCompleto
        }
      }
    }
  }
`
