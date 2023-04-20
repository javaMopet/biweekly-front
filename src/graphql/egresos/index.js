import gql from 'graphql-tag'

export const EGRESO_CREATE = gql`
  mutation egresoCreate($input: EgresoInput!) {
    egresoCreate(egresoInput: $input) {
      egreso {
        id
        observaciones
      }
    }
  }
`
export const OBTENER_EGRESOS = gql`
  query obtenerEgresos(
    $categoriaId: ID!
    $fechaInicio: ISO8601Date!
    $fechaFin: ISO8601Date!
  ) {
    obtenerEgresos(
      categoriaId: $categoriaId
      fechaInicio: $fechaInicio
      fechaFin: $fechaFin
    ) {
      id
      categoriaId
      cuentaId
      observaciones
      registro {
        fecha
        importe
        registrableId
        registrableType
        estadoRegistroId
      }
    }
  }
`
