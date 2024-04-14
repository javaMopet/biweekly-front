import { useMutation } from '@vue/apollo-composable'
import { BANCO_CREATE, BANCO_DELETE, BANCO_UPDATE } from 'src/graphql/bancos'
import { useBancoStore } from 'src/stores/common/useBancoStore'

export function useBancoService() {
  /**
   * store
   */
  const bancoStore = useBancoStore()

  /**
   * graphql
   */
  const {
    mutate: createBanco,
    onDone: onDoneBancoCreate,
    onError: onErrorBancoCreate
  } = useMutation(BANCO_CREATE)

  const {
    mutate: updateBanco,
    onDone: onDoneBancoUpdate,
    onError: onErrorBancoUpdate
  } = useMutation(BANCO_UPDATE)

  const {
    mutate: bancoDelete,
    onDone: onDoneBancoDelete,
    onError: onErrorBancoDelete
  } = useMutation(BANCO_DELETE)

  /**
   * onDone
   */
  onDoneBancoCreate(({ data }) => {
    const itemCreated = data.bancoCreate.banco
    bancoStore.bancoCreated(itemCreated)
  })

  onDoneBancoUpdate(({ data }) => {
    const itemUpdated = data.bancoUpdate.banco
    bancoStore.bancoUpdated(itemUpdated)
  })

  onDoneBancoDelete(({ data }) => {
    const itemDeleted = data.bancoDelete.banco
    bancoStore.bancoDeleted(itemDeleted)
  })

  /**
   * onError
   */
  onErrorBancoCreate((error) => {
    console.log('error.toString():', error.toString())
  })
  onErrorBancoUpdate((error) => {
    console.log('error.toString():', error.toString())
  })
  onErrorBancoDelete((error) => {
    console.log('error.toString():', error.toString())
  })

  return {
    createBanco,
    updateBanco,
    bancoDelete,
    onDoneBancoCreate,
    onDoneBancoUpdate,
    onDoneBancoDelete,
    onErrorBancoCreate,
    onErrorBancoUpdate,
    onErrorBancoDelete
  }
}
