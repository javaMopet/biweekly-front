import { useMutation } from '@vue/apollo-composable'
import { CUENTA_CREATE, CUENTA_UPDATE } from 'src/graphql/cuentas'
import { useCuentaStore } from 'src/stores/common/useCuentaStore'

export function useCuentaService() {
  const cuentaStore = useCuentaStore()

  const {
    mutate: cuentaCreate,
    onDone: onDoneCuentaCreate,
    onError: onErrorCuentaCreate
  } = useMutation(CUENTA_CREATE)

  const {
    mutate: cuentaUpdate,
    onDone: onDoneCuentaUpdate,
    onError: onErrorCuentaUpdate
  } = useMutation(CUENTA_UPDATE)

  onDoneCuentaCreate(({ data }) => {
    const itemSaved = data.cuentaCreate.cuenta
    cuentaStore.addItem(itemSaved)
  })
  onDoneCuentaUpdate(({ data }) => {
    if (!!data) {
      console.log('ejecutando onDonecuentaUpdate useCuentaCrud', data)
      const itemUpdated = data.cuentaUpdate.cuenta
      // console.log('itemUpdated... ', itemUpdated)
      const index = cuentaStore.listaCuentas.findIndex(
        (c) => c.id === itemUpdated.id
      )
      // console.log('index updated', index)
      cuentaStore.listaCuentas[index] = itemUpdated
    }
  })

  onErrorCuentaCreate((error) => {
    // console.trace(error)
  })
  onErrorCuentaUpdate((error) => {
    // console.log('error', error)
  })

  // function loadOrRefetchListaCuentas() {
  //   loadListaCuentas() || refetchListaCuentas()
  // }

  return {
    // onResultListaCuentas,
    // loadOrRefetchListaCuentas,
    // loadingListaCuentas,
    // onErrorListaCuentas,
    cuentaCreate,
    cuentaUpdate,
    onDoneCuentaCreate,
    onDoneCuentaUpdate,
    onErrorCuentaCreate,
    onErrorCuentaUpdate
  }
}
