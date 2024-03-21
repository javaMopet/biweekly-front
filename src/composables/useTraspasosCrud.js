import { useLazyQuery, useMutation } from '@vue/apollo-composable'
import {
  LISTA_TRASPASOS,
  TRASPASO_CREATE,
  TRASPASO_DELETE,
  TRASPASO_UPDATE
} from 'src/graphql/traspasos'
import { useCuentasCrud } from './useCuentasCrud'
import { useCuentaStore } from 'src/stores/common/useCuentaStore'

export function useTraspasosCrud() {
  /**
   * composition api
   */
  const cuentasCrud = useCuentasCrud()
  const cuentaStore = useCuentaStore()

  /**
   * graphql
   */
  const {
    mutate: traspasoCreate,
    onDone: onDoneTraspasoCreate,
    onError: onErrorTraspasoCreate
  } = useMutation(TRASPASO_CREATE)

  const {
    mutate: traspasoUpdate,
    onDone: onDoneTraspasoUpdate,
    onError: onErrorTraspasoUpdate
  } = useMutation(TRASPASO_UPDATE)

  const {
    mutate: traspasoDelete,
    onDone: onDoneTraspasoDelete,
    onError: onErrorTraspasoDelete
  } = useMutation(TRASPASO_DELETE)

  const { load: loadListaTraspasos, onResult: onResultListaTraspasos } =
    useLazyQuery(LISTA_TRASPASOS)

  onDoneTraspasoCreate(({ data }) => {
    const traspaso = data.traspasoCreate.traspaso
    console.log('onDonetraspasoCreate', traspaso)
    actualizarInterfazCuentas(
      traspaso.detalleOrigen.cuentaId
      // traspaso.detalleDestino.cuentaId
    )
  })

  onDoneTraspasoUpdate(({ data }) => {
    console.log('onDonetraspasoUpdate', data)
    const traspaso = data.traspasoUpdate.traspaso
    const cuentasIds = data.traspasoUpdate.cuentasIds
    const cuentas = data.traspasoUpdate.cuentas

    cuentas.forEach((element) => {
      console.log(element)
      // cuentasCrud.cuentaSaldoUpdate({ cuentaId: element })
      const index = cuentaStore.listaCuentas.findIndex(
        (c) => c.id === element.id
      )
      cuentaStore.listaCuentas[index].saldo = element.saldo
    })
  })

  onDoneTraspasoDelete(({ data }) => {
    const traspaso = data.traspasoDelete.traspaso
    console.log('onDonetraspasoDelete', traspaso)
    actualizarInterfazCuentas(
      traspaso.detalleOrigen.cuentaId
      // traspaso.detalleDestino.cuentaId
    )
  })

  function actualizarInterfazCuentas(cuentaOrigenId, cuentaDestinoId) {
    cuentasCrud.cuentaSaldoUpdate({ cuentaId: cuentaOrigenId })
    cuentasCrud.cuentaSaldoUpdate({ cuentaId: cuentaDestinoId })
  }

  return {
    traspasoCreate,
    traspasoUpdate,
    onDoneTraspasoCreate,
    onDoneTraspasoUpdate,
    onErrorTraspasoCreate,
    onErrorTraspasoUpdate,
    traspasoDelete,
    onDoneTraspasoDelete,
    onErrorTraspasoDelete,
    loadListaTraspasos,
    onResultListaTraspasos
  }
}
