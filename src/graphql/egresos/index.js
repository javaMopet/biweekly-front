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
    $categoriaId: ID
    $cuentaId: ID
    $fechaInicio: ISO8601Date!
    $fechaFin: ISO8601Date!
  ) {
    obtenerEgresos(
      categoriaId: $categoriaId
      cuentaId: $cuentaId
      fechaInicio: $fechaInicio
      fechaFin: $fechaFin
    ) {
      id
      categoria {
        id
        nombre
      }
      registro {
        estadoRegistroId
        registrableType
        registrableId
        importe
        fecha
        observaciones
        cuenta {
          id
          nombre
          identificador
        }
      }
    }
  }
`
