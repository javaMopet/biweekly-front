import { useLazyQuery, useMutation, useQuery } from '@vue/apollo-composable'
import { logErrorMessages } from '@vue/apollo-util'
import {
  ARBOL_CUENTAS_CONTABLES,
  LISTA_CUENTAS_CONTABLES,
  CUENTA_CONTABLE_CREATE,
  CUENTA_CONTABLE_UPDATE,
  CUENTA_CONTABLE_DELETE
} from 'src/graphql/cuentasContables'

import { ref, computed, reactive } from 'vue'

export function useCuentasContablesCrud() {
  /**
   * graphql
   */
  const graphql_options = ref({
    fetchPolicy: 'cache-and-network'
  })
  const options = reactive({
    fetchPolicy: 'cache-first'
  })

  const {
    onResult: onResultArbolCuentas,
    loading: loadingArbolCuentas,
    onError: onErrorArbolCuentasContables
  } = useQuery(ARBOL_CUENTAS_CONTABLES, null, options)

  const {
    load: loadList,
    onResult: onResultListaCuentasContables,
    onError: onErrorListaCuentasContables,
    refetch: refetchList
  } = useLazyQuery(LISTA_CUENTAS_CONTABLES, null, graphql_options)

  const {
    mutate: createCuentaContable,
    onDone: onDoneCreateCuentaContable,
    onError: onErrorCreateCuentaContable
  } = useMutation(CUENTA_CONTABLE_CREATE)

  const {
    mutate: updateCuentaContable,
    onDone: onDoneUpdateCuentaContable,
    onError: onErrorUpdateCuentaContable
  } = useMutation(CUENTA_CONTABLE_UPDATE)

  const {
    mutate: deleteCuentaContable,
    onDone: onDoneDeleteCuentaContable,
    onError: onErrorDeleteCuentaContable
  } = useMutation(CUENTA_CONTABLE_DELETE)

  onErrorCreateCuentaContable((error) => {
    console.log('surgio un error')
    logErrorMessages(error)
    console.log('error', error.graphQLErrors[0])
    console.log('error', error.graphQLErrors[0]?.extensions)
  })

  function loadListaCuentas(variables) {
    loadList(null, variables, options)
  }

  function loadOrRefetchListaCuentas(variables) {
    loadList(null, variables, graphql_options) ||
      refetchList(null, variables, graphql_options)
  }

  onDoneUpdateCuentaContable(({ data }) => {
    console.log('refrescando cuentasContables en el crud')
  })

  onErrorUpdateCuentaContable((error) => {
    logErrorMessages(error)
    console.log('error', error.graphQLErrors[0])
    console.log('error', error.graphQLErrors[0]?.extensions)
  })

  return {
    onResultArbolCuentas,
    loadingArbolCuentas,
    loadListaCuentas,
    loadOrRefetchListaCuentas,
    onResultListaCuentasContables,
    createCuentaContable,
    updateCuentaContable,
    deleteCuentaContable,
    onDoneCreateCuentaContable,
    onDoneUpdateCuentaContable,
    onDoneDeleteCuentaContable,
    onErrorListaCuentasContables,
    onErrorCreateCuentaContable,
    onErrorUpdateCuentaContable,
    onErrorDeleteCuentaContable
  }
}
