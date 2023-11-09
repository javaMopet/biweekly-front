import { logErrorMessages } from '@vue/apollo-util'
import { defineStore } from 'pinia'
import { useTiposMovimientoDao } from 'src/composables/useTiposMovimientoDao'

import { ref } from 'vue'
export const useTipoCuentaStore = defineStore('tipoMovimientoStore', () => {
  /**
   * state
   */
  const listaTiposMovimiento = ref([])
  /**
   * composble
   */
  const tipoMovimientoDao = useTiposMovimientoDao()

  const { onResultListaTiposMovimiento, onErrorListaTiposMovimiento } =
    tipoMovimientoDao

  onResultListaTiposMovimiento(({ data }) => {
    console.dir(data)
    listaTiposMovimiento.value = JSON.parse(
      JSON.stringify(data.listaTiposMovimiento)
    )
  })

  /**
   * Manejo de errores
   */
  onErrorListaTiposMovimiento((error) => {
    logErrorMessages(error)
  })

  return { listaTiposMovimiento }
})
