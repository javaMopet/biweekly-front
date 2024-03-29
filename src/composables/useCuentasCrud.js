import { useMutation } from '@vue/apollo-composable'
import {
  CUENTA_CREATE,
  CUENTA_UPDATE,
  CUENTA_DELETE,
  CUENTA_SALDO_UPDATE
} from 'src/graphql/cuentas'
import { useCuentaStore } from 'src/stores/common/useCuentaStore'

export function useCuentasCrud() {
  /**
   * composables
   */
  const cuentaStore = useCuentaStore()

  const {
    mutate: cuentaUpdate,
    onDone: onDoneCuentaUpdate,
    onError: onErrorCuentaUpdate
  } = useMutation(CUENTA_UPDATE)

  const {
    mutate: cuentaDelete,
    onDone: onDoneCuentaDelete,
    onError: onErrorCuentaDelete
  } = useMutation(CUENTA_DELETE)

  const {
    mutate: cuentaSaldoUpdate,
    onDone: onDoneCuentaSaldoUpdate,
    onError: onErrorCuentaSaldoUpdate
  } = useMutation(CUENTA_SALDO_UPDATE)

  onDoneCuentaUpdate(({ data }) => {
    if (!!data) {
      // console.log('ejecutando onDonecuentaUpdate useCuentaCrud', data)
      // const itemUpdated = data.cuentaUpdate.cuenta
      // console.log('itemUpdated... ', itemUpdated)
      // const index = cuentaStore.listaCuentas.findIndex(
      //   (c) => c.id === itemUpdated.id
      // )
      // console.log('index updated', index)
      // cuentaStore.listaCuentas[index] = itemUpdated
    }
  })
  onDoneCuentaDelete(({ data }) => {
    // const itemDeleted = data.cuentaDelete.cuenta
    // const index = cuentaStore.listaCuentas.findIndex(
    //   (c) => c.id === itemDeleted.id
    // )
    // console.log('index item deleted', index)
    // cuentaStore.listaCuentas.splice(index, 1)
  })

  onDoneCuentaSaldoUpdate(({ data }) => {
    console.log('Se actualizo el saldo de la cuenta', data)
    // console.log('Actualizar en la interfaz')
    const saldoUpdated = data.cuentaSaldoUpdate.cuenta
    updateCuentaInterfaz(saldoUpdated)
  })

  function updateCuentaInterfaz(saldoUpdated) {
    // console.log('Se actualiza el saldo de la cuenta interfaz', saldoUpdated)
    // const index = cuentaStore.listaCuentas.findIndex(
    //   (c) => c.id === saldoUpdated.id
    // )
    // cuentaStore.listaCuentas[index].saldo = saldoUpdated.saldo
  }

  onErrorCuentaUpdate((error) => {
    console.trace(error)
    // console.log('error', error.graphQLErrors[0])
    // console.log('error', error.graphQLErrors[0]?.extensions)
  })
  onErrorCuentaSaldoUpdate((error) => {
    console.trace(error)
  })
  // onErrorSaldoTarjetaCredito((error) => {
  //   console.trace(error)
  // })

  return {
    cuentaUpdate,
    cuentaDelete,
    cuentaSaldoUpdate,
    onDoneCuentaUpdate,
    onDoneCuentaDelete,
    onDoneCuentaSaldoUpdate,
    onErrorCuentaUpdate,
    onErrorCuentaDelete
    // loadSaldoTarjetaCredito,
    // onResultSaldoTarjetaCredito,
    // onErrorSaldoTarjetaCredito
  }
}
