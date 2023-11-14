import { useLazyQuery, useMutation, useQuery } from '@vue/apollo-composable'
import { logErrorMessages } from '@vue/apollo-util'
import {
  ARBOL_CUENTAS_CONTABLES,
  CUENTA_CONTABLE_CREATE,
  CUENTA_CONTABLE_UPDATE,
  CUENTA_CONTABLE_DELETE
} from 'src/graphql/cuentasContables'
import { useCuentaContableStore } from 'src/stores/common/useCuentaContableStore'

import { ref, computed, reactive } from 'vue'

export function useCuentasContablesCrud() {
  /**
   * composables
   */
  const cuentaContableStore = useCuentaContableStore()
  /**
   * graphql
   */

  const options = reactive({
    fetchPolicy: 'cache-first'
  })
  const {
    onResult: onResultArbolCuentas,
    loading: loadingArbolCuentas,
    onError: onErrorArbolCuentasContables
  } = useQuery(ARBOL_CUENTAS_CONTABLES, null, options)

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

  onDoneUpdateCuentaContable(({ data }) => {
    console.log('refrescando cuentasContables en el crud')
  })

  onDoneDeleteCuentaContable(({ data }) => {
    console.log(data)
    if (!!data) {
      console.log(
        'onDoneDeleteCuentaContable data useCuentasContablesCrud.js',
        data
      )
      // const index = cuentaContableStore.listaCuentasContables.findIndex(cc =>
      //   cc.id === data.)
    }
  })

  onErrorUpdateCuentaContable((error) => {
    logErrorMessages(error)
    console.log('error', error.graphQLErrors[0])
    console.log('error', error.graphQLErrors[0]?.extensions)
  })

  return {
    onResultArbolCuentas,
    createCuentaContable,
    updateCuentaContable,
    deleteCuentaContable,
    onDoneCreateCuentaContable,
    onDoneUpdateCuentaContable,
    onDoneDeleteCuentaContable,
    onErrorCreateCuentaContable,
    onErrorUpdateCuentaContable,
    onErrorDeleteCuentaContable
  }
}
