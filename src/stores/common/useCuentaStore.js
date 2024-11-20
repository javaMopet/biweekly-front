import { useMutation, useQuery } from '@vue/apollo-composable'
import { defineStore } from 'pinia'

import { CUENTA_DELETE, LISTA_CUENTAS } from 'src/graphql/cuentas'
import { ref, reactive, computed } from 'vue'

export const useCuentaStore = defineStore('cuentaStore', () => {
  const listaCuentas = ref([])
  /**
   * composables
   */

  /**
   * graphql
   */

  const graphql_options = reactive({
    fetchPolicy: 'no-cache'
  })

  const {
    onResult: onResultListaCuentas,
    onError: onErrorListaCuentas,
    refetch: refetchListaCuentas,
    loading: loadingListaCuentas
  } = useQuery(LISTA_CUENTAS, null, graphql_options)

  const {
    mutate: cuentaDelete,
    onDone: onDoneCuentaDelete,
    onError: onErrorCuentaDelete
  } = useMutation(CUENTA_DELETE)

  onResultListaCuentas(({ data }) => {
    if (!!data) {
      listaCuentas.value = JSON.parse(JSON.stringify(data.listaCuentas ?? []))
    }
  })

  onErrorListaCuentas((error) => {
    console.error(error)
  })

  onDoneCuentaDelete(({ data }) => {
    if (!!data) {
      const cuentaDeleted = data.cuentaDelete.cuenta
      const index = listaCuentas.value.findIndex(
        (c) => c.id === cuentaDeleted.id
      )
      listaCuentas.value.splice(index, 1)
    }
  })

  onErrorCuentaDelete((error) => {
    console.error(error)
  })

  /**
   * computed
   */

  const listaCuentasAhorro = computed({
    get() {
      return listaCuentas.value.filter((c) => c.tipoCuenta.id !== '3') ?? []
    }
  })
  const listaCuentasTarjeta = computed({
    get() {
      return listaCuentas.value.filter((c) => c.tipoCuenta.id === '3') ?? []
    }
  })
  /**
   * methods
   */
  function addItem(cuenta) {
    listaCuentas.value.push(cuenta)
  }
  function actualizarSaldoCuenta(cuentaId, saldo) {
    const cuentaIndex = listaCuentas.value.findIndex((c) => c.id === cuentaId)
    const cuentaModificar = listaCuentas.value[cuentaIndex]
    cuentaModificar.saldo = saldo
  }
  // function actualizarSaldoCuenta(cuenta_id, saldo) {
  //   const cuentaIndex = listaCuentas.value.findIndex((c) => c.id === cuenta_id)
  //   const cuentaModificar = listaCuentas.value[cuentaIndex]
  //   cuentaModificar.saldo = saldo
  // }

  /**
   * Manejo de errores
   */

  return {
    listaCuentas,
    refetchListaCuentas,
    loadingListaCuentas,
    cuentaDelete,
    onDoneCuentaDelete,
    onErrorCuentaDelete,
    listaCuentasAhorro,
    listaCuentasTarjeta,
    addItem,
    actualizarSaldoCuenta
  }
})
