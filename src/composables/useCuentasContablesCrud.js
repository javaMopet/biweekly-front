import { useMutation, useQuery } from '@vue/apollo-composable'
import {
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
  // const {
  //   result: resultadoListaCuentasContables,
  //   onError: onErrorListaCuentasContables,
  //   refetch: refetchListaCuentasContables
  // } = useQuery(LISTA_CUENTAS_CONTABLES, null, graphql_options)

  const {
    mutate: createCuentaContable,
    onDone: onDoneCreate,
    onError: onErrorCreateCuentaContable
  } = useMutation(CUENTA_CONTABLE_CREATE)

  const {
    mutate: updateCuentaContable,
    onDone: onDoneUpdate,
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

  onDoneCreate(({ data }) => {
    console.log('refrescando cuentasContables')
    refetchListaCuentasContables()
  })
  onErrorCreateCuentaContable((error) => {
    console.log('error', error.graphQLErrors[0])
    console.log('error', error.graphQLErrors[0].extensions)
  })

  // onErrorListaCuentas((error) => {
  //   console.log(error)
  // })

  onDoneUpdate(({ data }) => {
    refetchListaCuentasContables()
  })
  onErrorUpdateCuentaContable((error) => {
    console.dir(error)
    // const problems = error.graphQLErrors[0].extensions.problems
    // if (!!problems) {
    //   console.table(problems)
    // }
  })

  return {
    // listaCuentasContables,
    // onErrorListaCuentasContables,
    createCuentaContable,
    updateCuentaContable,
    onDoneCreate,
    onDoneUpdate,
    onDoneDeleteCuentaContable,
    onErrorCreateCuentaContable,
    onErrorUpdateCuentaContable,
    onErrorDeleteCuentaContable
  }
}
