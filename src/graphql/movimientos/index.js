import gql from 'graphql-tag'

export const LISTA_MOVIMIENTOS = gql`
  query listaMovimientos {
    listaMovimientos {
      id
      numero
      estadoMovimientoId
      tipoMovimientoId
      fecha
      observaciones
      userId
      tipoMovimiento {
        id
        value
        nombre
      }
      detallesMovimiento {
        categoria {
          id
          nombre
        }
        cuenta {
          id
          nombre
        }
        importe
        tipoAfectacion
        tipoDetalle
        cuentaContable {
          id
          nombre
          nombreCompleto
        }
      }
    }
  }
`

export const LISTA_DETALLES_MOVIMIENTO = gql`
  query listaDetallesMovimiento {
    listaDetallesMovimiento {
      id
      movimiento {
        id
        numero
        observaciones
        fecha
        estadoMovimiento {
          id
          nombre
        }
        tipoMovimiento {
          id
          nombre
        }
      }
      categoria {
        id
        nombre
        descripcion
      }
      cuenta {
        id
        nombre
        descripcion
      }
      importe
      tipoAfectacion
      tipoDetalle
    }
  }
`
export const LISTA_TIPOS_MOVIMIENTO = gql`
  query listaTiposMovimiento {
    listaTiposMovimiento {
      id
      nombre
      label
      value
    }
  }
`

export const MOVIMIENTO_CREATE = gql`
  mutation movimientoCreate($input: MovimientoInput!) {
    movimientoCreate(movimientoInput: $input) {
      movimiento {
        id
        movimiento {
          id
          numero
          obsevaciones
        }
        categoria {
          id
          nombre
          descripcion
        }
        cuenta {
          id
          nombre
          descripcion
        }
        importe
        tipoAfectacion
      }
    }
  }
`
export const MOVIMIENTO_UPDATE = gql`
  mutation movimientoUpdate($id: ID!, $input: MovimientoInput!) {
    movimientoUpdate(id: $id, movimientoInput: $input) {
      movimiento {
        id
        movimiento {
          id
          numero
          obsevaciones
        }
        categoria {
          id
          nombre
          descripcion
        }
        cuenta {
          id
          nombre
          descripcion
        }
        importe
        tipoAfectacion
      }
    }
  }
`

export const MOVIMIENTO_DELETE = gql`
  mutation movimientoDelete($id: ID!) {
    movimientoDelete(id: $id) {
      movimiento {
        id
        movimiento {
          id
          numero
          obsevaciones
        }
        categoria {
          id
          nombre
          descripcion
        }
        cuenta {
          id
          nombre
          descripcion
        }
        importe
        tipoAfectacion
      }
    }
  }
`
