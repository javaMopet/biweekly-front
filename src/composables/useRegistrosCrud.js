import { useMutation } from '@vue/apollo-composable'
import { ref } from 'vue'
import {
  REGISTRO_CREATE,
  REGISTRO_UPDATE,
  REGISTRO_DELETE,
  IMPORTAR_REGISTROS
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

  const {
    mutate: importarRegistros,
    onDone: onDoneImportarRegistros,
    onError: onErrorImportarRegistros
  } = useMutation(IMPORTAR_REGISTROS)

  return {
    createRegistro,
    importarRegistros,
    onDoneCreate,
    onDoneImportarRegistros,
    onErrorCreate,
    onErrorImportarRegistros,
    deleteRegistro,
    onDoneDelete,
    onErrorDelete,
    updateItem,
    onDoneUpdate,
    onErrorUpdate
  }
}
