import { useQuery } from '@vue/apollo-composable'
import { defineStore } from 'pinia'
import { LISTA_CUENTAS } from 'src/graphql/cuentas'
import { computed, reactive, ref } from 'vue'

export const useCuentaStore = defineStore('useCuentaStore', () => {
  /**
   * state
   */
  const listaCuentas = ref([])

  /**
   * composables
   */

  /**
   * graphql
   */
  const graphqlOptions = reactive({
    fetchPolicy: 'no-cache'
    // fetchPolicy: 'network-only'
  })

  const { onResult: onResultListaCuentas, onError: onErrorListaCuentas } =
    useQuery(LISTA_CUENTAS, null, graphqlOptions)

  onResultListaCuentas(({ data }) => {
    if (!!data) {
      console.log('Se obtuvo la lista de cuentas', data)
      listaCuentas.value = JSON.parse(JSON.stringify(data?.listaCuentas ?? []))
    }
  })

  onErrorListaCuentas((error) => {
    // console.log('error', error)
  })

  /**
   * computed
   */

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
    actualizarSaldoCuenta
  }
})
