import { useMutation } from '@vue/apollo-composable'
import { logErrorMessages } from '@vue/apollo-util'
import { BANCO_CREATE, BANCO_UPDATE, BANCO_DELETE } from 'src/graphql/bancos'
import { useBancoStore } from 'src/stores/common/useBancoStore'

import { ref, computed } from 'vue'

export function useBancosCrud() {
  /**
   * store
   */
  const bancoStore = useBancoStore()
  /**
   * graphql
   */
  const graphql_options = ref({
    fetchPolicy: 'cache-and-network'
  })

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

  onDoneCreateBanco(({ data }) => {
    console.log('refrescando bancos')
    const itemCreated = data.bancoCreate.banco
    bancoStore.bancoCreated(itemCreated)
  })

  onErrorCreateBanco((error) => {
    console.trace(error)
    // console.log('error', error.graphQLErrors[0])
    // console.log('error', error.graphQLErrors[0].extensions)
  })

  onDoneUpdateBanco(({ data }) => {
    const itemUpdated = data.bancoUpdate.banco
    console.log('itemUpdated', itemUpdated)
    bancoStore.bancoUpdated(itemUpdated)
  })

  onDoneDeleteBanco(({ data }) => {
    const itemDeleted = data.bancoDelete.banco
    bancoStore.bancoDeleted(itemDeleted)
  })

  onErrorUpdateBanco((error) => {
    logErrorMessages(error)
  })

  onErrorDeleteBanco((error) => {
    // logErrorMessages(error)
    console.trace(error)
    // if (!!error.graphQLErrors[0]) {
    //   console.trace(error.graphQLErrors[0])
    // }
  })

  return {
    createBanco,
    updateBanco,
    deleteBanco,
    onDoneCreateBanco,
    onDoneUpdateBanco,
    onDoneDeleteBanco,
    onErrorCreateBanco,
    onErrorUpdateBanco,
    onErrorDeleteBanco
  }
}
