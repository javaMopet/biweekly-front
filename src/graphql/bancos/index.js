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
export const BANCO_CREATE = gql`
  mutation bancoCreate($input: CuentaInput!) {
    bancoCreate(cuentaInput: $input) {
      banco {
        id
        nombre
        icono
      }
    }
  }
`
export const BANCO_UPDATE = gql`
  mutation bancoUpdate($input: CuentaInput!) {
    bancoUpdate(cuentaInput: $input) {
      banco {
        id
        nombre
        icono
      }
    }
  }
`
export const BANCO_DELETE = gql`
  mutation bancoDelete($id: ID!) {
    bancoDelete(id: $id) {
      banco {
        id
        nombre
        icono
      }
    }
  }
`
