import gql from 'graphql-tag'

export const LISTA_REGISTROS_TARJETA = gql`
  query listaRegistrosTarjeta(
    $cuentaId: ID
    $fechaInicio: ISO8601Date!
    $fechaFin: ISO8601Date!
    $isMsi: Boolean
  ) {
    listaRegistrosTarjeta(
      cuentaId: $cuentaId
      fechaInicio: $fechaInicio
      fechaFin: $fechaFin
      isMsi: $isMsi
    ) {
      id
      cuentaId
      categoriaId
      importe
      fecha
      concepto
      isMsi
      numeroMsi
      estadoRegistroTarjeta {
        id
        nombre
      }
      cuenta {
        id
        nombre
      }
      categoria {
        id
        nombre
        tipoMovimientoId
      }
    }
  }
`
