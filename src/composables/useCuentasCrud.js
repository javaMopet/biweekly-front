import { useMutation, useQuery } from '@vue/apollo-composable'
import {
  LISTA_CUENTAS_REDUCED,
  LISTA_CUENTAS,
  CUENTA_CREATE,
  CUENTA_UPDATE,
  CUENTA_DELETE
} from 'src/graphql/cuentas'
import { useCuentaStore } from 'src/stores/common/useCuentaStore'

import { ref, computed, reactive } from 'vue'

export function useCuentasCrud() {
  /**
   * composables
   */
  const cuentaStore = useCuentaStore()
  /**
   * graphql
   */
  const graphql_options = ref({
    fetchPolicy: 'network-only'
  })

  const {
    // result: resultadoListaReduced,
    onResult: onResultListaReduced,
    onError: onErrorListaCuentasReduced
  } = useQuery(
    LISTA_CUENTAS_REDUCED,
    null, //arguments
    graphql_options
  )
  const graphql_opciones = reactive({
    fetchPolicy: 'no-cache'
  })

  const { onResult: onResultListaCuentas, onError: onErrorListaCuentas } =
    useQuery(LISTA_CUENTAS, null, graphql_opciones)

  const {
    mutate: cuentaCreate,
    onDone: onDoneCuentaCreate,
    onError: onErrorCuentaCreate
  } = useMutation(CUENTA_CREATE)

  const {
    mutate: cuentaUpdate,
    onDone: onDoneCuentaUpdate,
    onError: onErrorCuentaUpdate
  } = useMutation(CUENTA_UPDATE)

  const {
    mutate: cuentaDelete,
    onDone: onDoneCuentaDelete,
    onError: onErrorCuentaDelete
  } = useMutation(CUENTA_DELETE)

  // const listaCuentasReduced = computed({
  //   get() {
  //     return resultadoListaReduced.value?.listaCuentas ?? []
  //   }
  // })

  onErrorListaCuentas((error) => {
    console.log('error', error)
  })

  onDoneCuentaCreate(({ data }) => {
    const itemSaved = data.cuentaCreate.cuenta
    cuentaStore.listaCuentas.push(itemSaved)
  })
  onDoneCuentaUpdate(({ data }) => {
    if (!!data) {
      console.log('ejecutando onDonecuentaUpdate useCuentaCrud', data)
      const itemUpdated = data.cuentaUpdate.cuenta
      console.log('itemUpdated... ', itemUpdated)
      const index = cuentaStore.listaCuentas.findIndex(
        (c) => c.id === itemUpdated.id
      )
      console.log('index updated', index)
      cuentaStore.listaCuentas[index] = itemUpdated
    }
  })
  onDoneCuentaDelete(({ data }) => {
    const itemDeleted = data.cuentaDelete.cuenta
    const index = cuentaStore.listaCuentas.findIndex(
      (c) => c.id === itemDeleted.id
    )
    console.log('index item deleted', index)
    cuentaStore.listaCuentas.splice(index, 1)
  })

  onErrorListaCuentas((error) => {
    logErrorMessages(error)
  })

  onErrorCuentaCreate((error) => {
    console.trace(error)
    // console.log('error', error.graphQLErrors[0])
    // console.log('error', error.graphQLErrors[0]?.extensions)
  })

  onErrorCuentaUpdate((error) => {
    console.trace(error)
    // console.log('error', error.graphQLErrors[0])
    // console.log('error', error.graphQLErrors[0]?.extensions)
  })

  return {
    onResultListaReduced,
    onResultListaCuentas,
    cuentaCreate,
    cuentaUpdate,
    cuentaDelete,
    onDoneCuentaCreate,
    onDoneCuentaUpdate,
    onDoneCuentaDelete,
    onErrorCuentaCreate,
    onErrorCuentaUpdate,
    onErrorCuentaDelete
  }
}
