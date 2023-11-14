import { useQuery } from '@vue/apollo-composable'
import { logErrorMessages } from '@vue/apollo-util'
import { defineStore } from 'pinia'
import { useCuentasContablesCrud } from 'src/composables/useCuentasContablesCrud'
import { LISTA_CUENTAS_CONTABLES } from 'src/graphql/cuentasContables'

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

  const {
    onResultArbolCuentas,
    loadingArbolCuentas,
    deleteCuentaContable,
    onDoneDeleteCuentaContable,
    onDoneUpdateCuentaContable,
    onErrorUpdateCuentaContable,
    onErrorDeleteCuentaContable
  } = cuentasContablesCrud

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
      console.log('loading lista de cuentas contables...', data)
      listaCuentasContables.value = JSON.parse(
        JSON.stringify(data.listaCuentasContables ?? [])
      )
    }
  })

  function deleteItem(id) {
    deleteCuentaContable({ id })
  }

  onDoneDeleteCuentaContable(({ data }) => {
    const itemDeleted = data.cuentaContableDelete.cuentaContable
    const id = itemDeleted.id
    const indice = listaCuentasContables.value.findIndex((cc) => cc.id === id)
    listaCuentasContables.value.splice(indice, 1)

    /* eliminar del arbol de cuentas */
    const padreId = itemDeleted.padreId
    const itemPadre = findTreeElementById(padreId)
    const childrenIndex = itemPadre.children.findIndex(
      (child) => child.id.toString() === id.toString()
    )
    itemPadre.children.splice(childrenIndex, 1)
  })

  /**
   * Manejo de errores
   */
  onErrorListaCuentasContables((error) => {
    logErrorMessages(error)
  })
  onErrorDeleteCuentaContable((error) => {
    logErrorMessages(error)
  })

  return {
    arbolCuentasContables,
    loadingArbolCuentas,
    findTreeElementById,
    listaCuentasContables,
    onDoneUpdateCuentaContable,
    deleteItem,
    onDoneDeleteCuentaContable,
    onErrorUpdateCuentaContable
  }
})
