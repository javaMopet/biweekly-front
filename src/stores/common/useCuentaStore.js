import { useLazyQuery, useQuery } from '@vue/apollo-composable'
import { defineStore } from 'pinia'
import { useCuentasCrud } from 'src/composables/useCuentasCrud'
import { LISTA_CUENTAS } from 'src/graphql/cuentas'
import { computed, reactive, ref } from 'vue'

export const useCuentaStore = defineStore('cuentaStore', () => {
  /**
   * composables
   */
  const cuentasCrud = useCuentasCrud()
  /**
   * graphql
   */
  //fetchPolicy: 'no-cache'
  const graphqlOptions = ref({
    fetchPolicy: 'no-cache'
    // fetchPolicy: 'network-only'
  })

  const {
    // load: loadListaCuentas,
    onError: onErrorListaCuentas,
    refetch: refetchListaCuentas,
    // onResult: onResultListaCuentas
    result: resultListaCuentas
  } = useQuery(LISTA_CUENTAS, null, graphqlOptions)

  // onResultListaCuentas(({ data }) => {
  //   if (!!data) {
  //     console.log('Se obtuvo la lista de cuentas', data)
  //     listaCuentas.value = JSON.parse(JSON.stringify(data?.listaCuentas ?? []))
  //   }
  // })

  onErrorListaCuentas((error) => {
    // console.log('error', error)
  })

  function loadOrRefetchListaCuentas() {
    // loadListaCuentas() ||
    refetchListaCuentas()
  }
  /**
   * state
   */
  // const listaCuentas = ref([])
  /**
   * computed
   */
  const listaCuentas = computed({
    get() {
      console.log(resultListaCuentas.value?.listaCuentas?.length || 0)
      return resultListaCuentas.value?.listaCuentas ?? []
    }
  })
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

  function actualizarSaldoCuenta(cuenta_id, saldo) {
    const cuentaIndex = listaCuentas.value.findIndex((c) => c.id === cuenta_id)
    const cuentaModificar = listaCuentas.value[cuentaIndex]
    cuentaModificar.saldo = saldo
  }

  /**
   * Manejo de errores
   */

  return {
    listaCuentas,
    listaCuentasTarjeta,
    listaCuentasAhorro,
    loadOrRefetchListaCuentas,
    actualizarSaldoCuenta
  }
})
