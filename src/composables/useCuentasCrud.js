import { useMutation, useLazyQuery } from '@vue/apollo-composable'
import { CUENTA_SALDO_UPDATE, CUENTA_BY_ID } from 'src/graphql/cuentas'
import { useCuentaStore } from 'src/stores/common/useCuentaStore'
import { reactive } from 'vue'

export function useCuentasCrud() {
  /**
   * composables
   */
  const cuentaStore = useCuentaStore()

  const graphql_options = reactive({
    fetchPolicy: 'no-cache'
  })

  const {
    // onResult: onResultCuentaById,
    load: loadCuentaById,
    onError: onErrorCuentaById,
    onResult: onResultCuentaById,
    refetch: refetchCuentaById
    // loading: loadingCuentaById
  } = useLazyQuery(CUENTA_BY_ID, null, graphql_options)

  function fetchOrRefetchCuentaById(id) {
    loadCuentaById(CUENTA_BY_ID, { id: id }, graphql_options) ||
      refetchCuentaById(CUENTA_BY_ID, { id: id }, graphql_options)
  }

  const {
    mutate: cuentaSaldoUpdate,
    onDone: onDoneCuentaSaldoUpdate,
    onError: onErrorCuentaSaldoUpdate
  } = useMutation(CUENTA_SALDO_UPDATE)

  onDoneCuentaSaldoUpdate(({ data }) => {
    const saldoUpdated = data.cuentaSaldoUpdate.cuenta
    cuentaStore.actualizarSaldoCuenta(saldoUpdated.id, saldoUpdated.saldo)
  })

  onErrorCuentaSaldoUpdate((error) => {
    console.trace(error)
  })
  // onErrorSaldoTarjetaCredito((error) => {
  //   console.trace(error)
  // })

  return {
    cuentaSaldoUpdate,
    onDoneCuentaSaldoUpdate,
    fetchOrRefetchCuentaById,
    onErrorCuentaById,
    onResultCuentaById
    // loadingCuentaById

    // loadSaldoTarjetaCredito,
    // onResultSaldoTarjetaCredito,
    // onErrorSaldoTarjetaCredito
  }
}
