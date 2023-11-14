import { defineStore } from 'pinia'
import { useCuentasCrud } from 'src/composables/useCuentasCrud'

import { computed, ref } from 'vue'
export const useCuentaStore = defineStore('cuentaStore', () => {
  /**
   * state
   */
  const listaCuentas = ref([])
  const listaCuentasReduced = ref([])
  /**
   * composables
   */
  const cuentasCrud = useCuentasCrud()

  const { onResultListaReduced, onResultListaCuentas } = cuentasCrud

  onResultListaReduced(({ data }) => {
    console.dir(data)
    listaCuentasReduced.value = JSON.parse(JSON.stringify(data.listaCuentas))
  })

  onResultListaCuentas(({ data }) => {
    console.log('Guardando cuentas en el store')
    listaCuentas.value = JSON.parse(JSON.stringify(data.listaCuentas))
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
