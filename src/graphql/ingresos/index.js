import gql from 'graphql-tag'

export const INGRESO_CREATE = gql`
  mutation ingresoCreate($input: IngresoInput!) {
    ingresoCreate(ingresoInput: $input) {
      ingreso {
        id
        observaciones
      }
    }
  }
`
export const OBTENER_INGRESOS = gql`
  query obtenerIngresos(
    $categoriaId: ID!
    $fechaInicio: ISO8601Date!
    $fechaFin: ISO8601Date!
  ) {
    obtenerIngresos(
      categoriaId: $categoriaId
      fechaInicio: $fechaInicio
      fechaFin: $fechaFin
    ) {
      id
      categoriaId
      observaciones
      registro {
        fecha
        importe
        importeString
        registrableId
        registrableType
        estadoRegistroId
        cuentaId
        cuenta {
          id
          nombre
          cuentaContableId
        }
      }
    }
  }
`
