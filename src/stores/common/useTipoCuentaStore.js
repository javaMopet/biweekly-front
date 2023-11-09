import { logErrorMessages } from '@vue/apollo-util'
import { defineStore } from 'pinia'
import { LISTA_TIPOS_CUENTA } from 'src/graphql/cuentas'

import { ref } from 'vue'
export const useTipoCuentaStore = defineStore('tipoCuentaStore', () => {
  /**
   * state
   */
  const listaTiposCuenta = ref([])
  /**
   * GRAPHQL
   */
  const graphql_options = ref({
    fetchPolicy: 'network-only'
  })

  const { onResult: onResultLista, onError: onErrorLista } = useQuery(
    LISTA_TIPOS_CUENTA,
    null,
    graphql_options
  )
  onResultLista(({ data }) => {
    console.dir(data)
    listaTiposCuenta.value = JSON.parse(JSON.stringify(data.listaTiposCuenta))
  })

  /**
   * Manejo de errores
   */
  onErrorLista((error) => {
    logErrorMessages(error)
  })

  return { listaTiposCuenta }
})
