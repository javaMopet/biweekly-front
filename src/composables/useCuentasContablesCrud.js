import { useLazyQuery, useMutation, useQuery } from '@vue/apollo-composable'
import { logErrorMessages } from '@vue/apollo-util'
import {
  ARBOL_CUENTAS_CONTABLES,
  LISTA_CUENTAS_CONTABLES,
  CUENTA_CONTABLE_CREATE,
  CUENTA_CONTABLE_UPDATE,
  CUENTA_CONTABLE_DELETE
} from 'src/graphql/cuentasContables'

import { ref, computed } from 'vue'

export function useCuentasContablesCrud() {
  /**
   * graphql
   */
  const graphql_options = ref({
    fetchPolicy: 'cache-and-network'
  })

  const {
    onResult: onResultArbolCuentas,
    loading: loadingArbolCuentas,
    onError: onErrorArbolCuentasContables
  } = useQuery(ARBOL_CUENTAS_CONTABLES, null, graphql_options)

  const {
    load: loadListaCuentasContables,
    onResult: onResultListaCuentasContables,
    onError: onErrorListaCuentasContables,
    refetch: refetchListaCuentasContables
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

  // const listaCuentasContables = computed({
  //   get() {
  //     return resultadoListaCuentasContables.value?.listaCuentasContables ?? []
  //   }
  // })

  onDoneCreateCuentaContable(({ data }) => {
    console.log('refrescando cuentasContables en el crud')
    // refetchListaCuentasContables()
  })
  onErrorCreateCuentaContable((error) => {
    console.log('surgio un error')
    logErrorMessages(error)
    // console.log('error', error.graphQLErrors[0])
    // console.log('error', error.graphQLErrors[0].extensions)
  })

  // onErrorListaCuentas((error) => {
  //   console.log(error)
  // })

  onDoneUpdateCuentaContable(({ data }) => {
    console.log('refrescando cuentasContables en el crud')
    // refetchListaCuentasContables()
  })

  onErrorUpdateCuentaContable((error) => {
    console.log('error', error.graphQLErrors[0])
    console.log('error', error.graphQLErrors[0].extensions)
    logErrorMessages(error)
  })

  return {
    // listaCuentasContables,
    // onErrorListaCuentasContables,
    onResultArbolCuentas,
    loadingArbolCuentas,
    loadListaCuentasContables,
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
