import gql from 'graphql-tag'

export const LISTA_REGISTROS = gql`
  query obtenerRegistros(
    $cuentaId: ID!
    $fechaInicio: ISO8601Date!
    $fechaFin: ISO8601Date!
  ) {
    obtenerRegistros(
      cuentaId: $cuentaId
      fechaInicio: $fechaInicio
      fechaFin: $fechaFin
    ) {
      id
      estadoRegistroId
      fecha
      importe
      observaciones
      registrableType
      categoria {
        id
        nombre
      }
    }
  }
`

export const REGISTRO_DELETE = gql`
  mutation registroDelete($id: ID!) {
    registroDelete(id: $id) {
      registro {
        id
        cuentaId
        estadoRegistroId
      }
    }
  }
`
