import { useQuery } from '@vue/apollo-composable'
import { defineStore } from 'pinia'
import { LISTA_CUENTAS } from 'src/graphql/cuentas'
import { computed, reactive, ref } from 'vue'

export const useCuentaStore = defineStore('cuentaStore', () => {
  /**
   * state
   */
  const listaCuentas = ref([])
  const listaCuentasReduced = ref([])
  /**
   * composables
   */

  const graphql_opciones = reactive({
    fetchPolicy: 'no-cache'
  })

  const { onResult: onResultListaCuentas, onError: onErrorListaCuentas } =
    useQuery(LISTA_CUENTAS, null, graphql_opciones)

  onResultListaCuentas(({ data }) => {
    console.log('Guardando cuentas en el store')
    listaCuentas.value = JSON.parse(JSON.stringify(data.listaCuentas))
  })
  onErrorListaCuentas((error) => {
    console.log('error', error)
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
   * Manejo de errores
   */

  return {
    listaCuentas,
    listaCuentasReduced,
    listaCuentasAhorro,
    listaCuentasTarjeta
  }
})
