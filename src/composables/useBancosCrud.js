import { useMutation, useQuery } from '@vue/apollo-composable'
import { logErrorMessages } from '@vue/apollo-util'
import {
  LISTA_BANCOS,
  BANCO_CREATE,
  BANCO_UPDATE,
  BANCO_DELETE
} from 'src/graphql/bancos'

import { ref, computed } from 'vue'

export function useBancosCrud() {
  /**
   * graphql
   */
  const graphql_options = ref({
    // fetchPolicy: 'network-only'
    fetchPolicy: 'cache-first'
  })
  const {
    result: resultadoLista,
    onError: onErrorListaBancos
    // refetch: refetchListaBancos
  } = useQuery(LISTA_BANCOS, null, graphql_options)

  const {
    mutate: createBanco,
    onDone: onDoneCreateBanco,
    onError: onErrorCreateBanco
  } = useMutation(BANCO_CREATE)

  const {
    mutate: updateBanco,
    onDone: onDoneUpdateBanco,
    onError: onErrorUpdateBanco
  } = useMutation(BANCO_UPDATE)

  const {
    mutate: deleteBanco,
    onDone: onDoneDeleteBanco,
    onError: onErrorDeleteBanco
  } = useMutation(BANCO_DELETE)

  const listaBancos = computed({
    get() {
      return resultadoLista.value?.listaBancos ?? []
    }
  })

  onDoneCreateBanco(({ data }) => {
    console.log('refrescando bancos')
    // refetchListaBancos()
  })
  onErrorCreateBanco((error) => {
    console.log('error', error.graphQLErrors[0])
    console.log('error', error.graphQLErrors[0].extensions)
  })

  onErrorListaBancos((error) => {
    logErrorMessages(error)
  })

  onDoneUpdateBanco(({ data }) => {
    // refetchListaBancos()
  })

  onErrorUpdateBanco((error) => {
    logErrorMessages(error)
  })

  onErrorDeleteBanco((error) => {
    logErrorMessages(error)
  })

  return {
    listaBancos,
    createBanco,
    updateBanco,
    deleteBanco,
    onDoneCreateBanco,
    onDoneUpdateBanco,
    onDoneDeleteBanco,
    onErrorListaBancos,
    onErrorCreateBanco,
    onErrorUpdateBanco,
    onErrorDeleteBanco
    // refetchListaBancos
  }
}
