import { logErrorMessages } from '@vue/apollo-util'
import { defineStore } from 'pinia'
import { useTiposMovimientoDao } from 'src/composables/useTiposMovimientoDao'

import { computed, ref } from 'vue'
export const useTipoMovimientoStore = defineStore('tipoMovimientoStore', () => {
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
    if (!!data) {
      // console.dir(data)
      listaTiposMovimiento.value = JSON.parse(
        JSON.stringify(data.listaTiposMovimiento)
      )
    }
  })
  /**
   * computed
   */
  const tiposMovimientoCuenta = computed({
    get() {
      return listaTiposMovimiento.value.filter(
        (tipoMovimiento) => tipoMovimiento.id !== '3'
      )
    }
  })

  const tiposMovimientoTarjeta = computed({
    get() {
      return listaTiposMovimiento.value.filter(
        (tipoMovimiento) => tipoMovimiento.id !== '3'
      )
    }
  })

  /**
   * Manejo de errores
   */
  onErrorListaTiposMovimiento((error) => {
    logErrorMessages(error)
  })

  return { listaTiposMovimiento, tiposMovimientoCuenta, tiposMovimientoTarjeta }
})
