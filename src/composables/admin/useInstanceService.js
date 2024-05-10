import { useMutation } from '@vue/apollo-composable'
import {
  INSTANCE_CREATE,
  INSTANCE_DELETE,
  INSTANCE_UPDATE
} from 'src/graphql/instances'
import { useInstanceStore } from 'src/stores/admin/useInstanceStore'

export function useInstanceService() {
  /**
   * store
   */
  const instanceStore = useInstanceStore()

  /**
   * graphql
   */
  const {
    mutate: createInstance,
    onDone: onDoneInstanceCreate,
    onError: onErrorInstanceCreate
  } = useMutation(INSTANCE_CREATE)

  const {
    mutate: updateInstance,
    onDone: onDoneInstanceUpdate,
    onError: onErrorInstanceUpdate
  } = useMutation(INSTANCE_UPDATE)

  const {
    mutate: instanceDelete,
    onDone: onDoneInstanceDelete,
    onError: onErrorInstanceDelete
  } = useMutation(INSTANCE_DELETE)

  /**
   * onDone
   */
  onDoneInstanceCreate(({ data }) => {
    const itemCreated = data.instanceCreate.instance
    instanceStore.instanceCreated(itemCreated)
  })

  onDoneInstanceUpdate(({ data }) => {
    const itemUpdated = data.instanceUpdate.instance
    instanceStore.instanceUpdated(itemUpdated)
  })

  onDoneInstanceDelete(({ data }) => {
    const itemDeleted = data.instanceDelete.instance
    instanceStore.instanceDeleted(itemDeleted)
  })

  /**
   * onError
   */
  onErrorInstanceCreate((error) => {
    console.log('error.toString():', error.toString())
  })
  onErrorInstanceUpdate((error) => {
    console.log('error.toString():', error.toString())
  })
  onErrorInstanceDelete((error) => {
    console.log('error.toString():', error.toString())
  })

  return {
    createInstance,
    updateInstance,
    instanceDelete,
    onDoneInstanceCreate,
    onDoneInstanceUpdate,
    onDoneInstanceDelete,
    onErrorInstanceCreate,
    onErrorInstanceUpdate,
    onErrorInstanceDelete
  }
}
