import gql from 'graphql-tag'

export const LISTA_BANCOS = gql`
  query listaBancos($id: ID) {
    listaBancos(id: $id) {
      id
      nombre
      icono
    }
  }
`
export const BANCO_CREATE = gql`
  mutation bancoCreate($input: BancoInput!) {
    bancoCreate(bancoInput: $input) {
      banco {
        id
        nombre
        icono
      }
    }
  }
`
export const BANCO_UPDATE = gql`
  mutation bancoUpdate($id: ID!, $input: BancoInput!) {
    bancoUpdate(id: $id, bancoInput: $input) {
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
