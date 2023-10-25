import { useMutation, useQuery } from '@vue/apollo-composable'
import {
  LISTA_CUENTAS_REDUCED,
  LISTA_CUENTAS,
  CUENTA_CREATE,
  CUENTA_UPDATE
} from 'src/graphql/cuentas'

import { ref, computed } from 'vue'

export function useCuentaCrud() {
  /**
   * graphql
   */
  const graphql_options = ref({
    fetchPolicy: 'network-only'
  })

  const { result: resultadoListaReduced, onError: onErrorListaCuentasReduced } =
    useQuery(
      LISTA_CUENTAS_REDUCED,
      null, //arguments
      graphql_options
    )

  const {
    result: resultadoLista,
    onError: onErrorListaCuentas,
    refetch: refetchListaCuentas
  } = useQuery(LISTA_CUENTAS, null, graphql_options)

  const {
    mutate: createCuenta,
    onDone: onDoneCreate,
    onError: onErrorCreate
  } = useMutation(CUENTA_CREATE)

  const {
    mutate: updateCuenta,
    onDone: onDoneUpdate,
    onError: onErrorUpdateCuenta
  } = useMutation(CUENTA_UPDATE)

  const listaCuentas = computed({
    get() {
      return resultadoLista.value?.listaCuentas ?? []
    }
  })
  const listaCuentasReduced = computed({
    get() {
      return resultadoListaReduced.value?.listaCuentas ?? []
    }
  })

  onErrorListaCuentas((error) => {
    console.log('error', error)
  })

  onDoneCreate(({ data }) => {
    refetchListaCuentas()
  })
  onErrorCreate((error) => {
    console.log('error', error.graphQLErrors[0])
    console.log('error', error.graphQLErrors[0].extensions)
  })

  onErrorListaCuentas((error) => {
    console.log(error)
  })

  onDoneUpdate(({ data }) => {
    refetchListaCuentas()
  })
  onErrorUpdateCuenta((error) => {
    console.log('error', error.graphQLErrors[0])
    console.log('error', error.graphQLErrors[0].extensions)
  })

  return {
    listaCuentas,
    listaCuentasReduced,
    createCuenta,
    updateCuenta,
    onDoneCreate,
    onDoneUpdate
  }
}
