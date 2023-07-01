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
    onDone: onDoneCreateRegistro,
    onError: onErrorCreateRegistro
  } = useMutation(REGISTRO_CREATE)

  const {
    mutate: updateItem,
    onDone: onDoneUpdate,
    onError: onErrorUpdate
  } = useMutation(REGISTRO_UPDATE)

  const {
    mutate: deleteRegistro,
    onDone: onDoneDeleteRegistro,
    onError: onErrorDeleteRegistro
  } = useMutation(REGISTRO_DELETE)

  return {
    createRegistro,
    onDoneCreateRegistro,
    onErrorCreateRegistro,
    deleteRegistro,
    onDoneDeleteRegistro,
    onErrorDeleteRegistro,
    updateItem,
    onDoneUpdate,
    onErrorUpdate
  }
}
