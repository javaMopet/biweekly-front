import { defineStore } from 'pinia'
import { useCuentasCrud } from 'src/composables/useCuentasCrud'

import { ref } from 'vue'
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
    console.dir(data)
    listaCuentas.value = JSON.parse(JSON.stringify(data.listaCuentas))
  })

  /**
   * Manejo de errores
   */

  return {
    listaCuentas,
    listaCuentasReduced
  }
})
