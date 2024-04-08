import { useQuery } from '@vue/apollo-composable'
import { logErrorMessages } from '@vue/apollo-util'
import { defineStore } from 'pinia'
import { useCuentasContablesCrud } from 'src/composables/useCuentasContablesCrud'
import {
  ARBOL_CUENTAS_CONTABLES,
  LISTA_CUENTAS_CONTABLES
} from 'src/graphql/cuentasContables'

import { reactive, ref } from 'vue'
export const useCuentaContableStore = defineStore('cuentaContableStore', () => {
  /**
   * state
   */
  const arbolCuentasContables = ref([])
  const listaCuentasContables = ref([])

  /**
   * composables
   */
  const cuentasContablesCrud = useCuentasContablesCrud()

  const options = reactive({
    fetchPolicy: 'cache-first'
  })
  const {
    onResult: onResultArbolCuentas,
    loading: loadingArbolCuentas,
    onError: onErrorArbolCuentasContables
  } = useQuery(ARBOL_CUENTAS_CONTABLES, null, options)
  /**
   * graphql
   */
  const variablesLista = reactive({
    subnivel: null,
    clasificacion: null,
    tipoAfectacion: null
  })
  const graphql_options = ref({
    fetchPolicy: 'no-cache'
  })
  const {
    onResult: onResultListaCuentasContables,
    onError: onErrorListaCuentasContables,
    loading: loadingListaCuentasContables
  } = useQuery(LISTA_CUENTAS_CONTABLES, variablesLista, graphql_options)

  /**
   * methods
   */
  function findTreeElementById(id) {
    return searchTree(arbolCuentasContables.value[0], id)
  }

  function searchTree(element, id) {
    if (element.id == id) {
      return element
    } else if (element.children != null) {
      var i
      var result = null
      for (i = 0; result == null && i < element.children.length; i++) {
        result = searchTree(element.children[i], id)
      }
      return result
    }
    return null
  }

  /**
   * graphql
   */

  onResultArbolCuentas(({ data }) => {
    if (!!data) {
      arbolCuentasContables.value = JSON.parse(
        JSON.stringify(data.arbolCuentasContables)
      )
    }
  })

  onResultListaCuentasContables(({ data }) => {
    if (!!data) {
      // console.log('loading lista de cuentas contables...', data)
      listaCuentasContables.value = JSON.parse(
        JSON.stringify(data.listaCuentasContables ?? [])
      )
    }
  })

  /**
   * Manejo de errores
   */
  onErrorListaCuentasContables((error) => {
    logErrorMessages(error)
  })

  return {
    arbolCuentasContables,
    loadingArbolCuentas,
    findTreeElementById,
    listaCuentasContables
  }
})
