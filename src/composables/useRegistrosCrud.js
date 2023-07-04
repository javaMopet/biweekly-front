import { useMutation } from '@vue/apollo-composable'
import { ref } from 'vue'
import {
  REGISTRO_CREATE,
  REGISTRO_UPDATE,
  REGISTRO_DELETE
} from 'src/graphql/registros'

export function useRegistrosCrud() {
  /**
   * GRAPHQL
   */
  const options = ref({
    fetchPolicy: 'network-only'
  })

  const {
    mutate: createRegistro,
    onDone: onDoneCreate,
    onError: onErrorCreate
  } = useMutation(REGISTRO_CREATE)

  const {
    mutate: updateItem,
    onDone: onDoneUpdate,
    onError: onErrorUpdate
  } = useMutation(REGISTRO_UPDATE)

  const {
    mutate: deleteRegistro,
    onDone: onDoneDelete,
    onError: onErrorDelete
  } = useMutation(REGISTRO_DELETE)

  return {
    createRegistro,
    onDoneCreate,
    onErrorCreate,
    deleteRegistro,
    onDoneDelete,
    onErrorDelete,
    updateItem,
    onDoneUpdate,
    onErrorUpdate
  }
}
