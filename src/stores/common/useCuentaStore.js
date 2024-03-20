import { useQuery } from '@vue/apollo-composable'
import { defineStore } from 'pinia'
import { useCuentaService } from 'src/composables/cuentas/useCuentaService'
import { useCuentasCrud } from 'src/composables/useCuentasCrud'
import { LISTA_CUENTAS } from 'src/graphql/cuentas'
import { computed, ref } from 'vue'

export const useCuentaStore = defineStore('cuentaStore', () => {
  /**
   * composables
   */
  // const cuentaService = useCuentaService()

  /**
   * state
   */
  // const listaCuentas = ref([])
  /**
   * graphql
   */
  //fetchPolicy: 'no-cache'
  // const graphqlOptions = ref({
  //   fetchPolicy: 'no-cache'
  //   // fetchPolicy: 'network-only'
  // })

  // cuentaService.onResultListaCuentas(({ data }) => {
  //   if (!!data) {
  //     console.log('Se obtuvo la lista de cuentas', data)
  //     listaCuentas.value = JSON.parse(JSON.stringify(data?.listaCuentas ?? []))
  //   }
  // })

  // cuentaService.onErrorListaCuentas((error) => {
  //   console.error(error)
  // })

  // function loadOrRefetchListaCuentas() {
  //   // loadListaCuentas() ||
  //   cuentaService.refetchListaCuentas()
  // }

  /**
   * computed
   */
  // const listaCuentas = computed({
  //   get() {
  //     console.log(resultListaCuentas.value?.listaCuentas?.length || 0)
  //     return resultListaCuentas.value?.listaCuentas ?? []
  //   }
  // })
  // const listaCuentasAhorro = computed({
  //   get() {
  //     return listaCuentas.value.filter((c) => c.tipoCuenta.id !== '3') ?? []
  //   }
  // })
  // const listaCuentasTarjeta = computed({
  //   get() {
  //     return listaCuentas.value.filter((c) => c.tipoCuenta.id === '3') ?? []
  //   }
  // })
  /**
   * methods
   */

  // function actualizarSaldoCuenta(cuenta_id, saldo) {
  //   const cuentaIndex = listaCuentas.value.findIndex((c) => c.id === cuenta_id)
  //   const cuentaModificar = listaCuentas.value[cuentaIndex]
  //   cuentaModificar.saldo = saldo
  // }

  /**
   * Manejo de errores
   */

  return {
    // listaCuentas,
    // loadOrRefetchListaCuentas
    // listaCuentasTarjeta,
    // listaCuentasAhorro,
    // loadOrRefetchListaCuentas,
    // actualizarSaldoCuenta
    // loadingListaCuentas
  }
})
