import { useMutation } from '@vue/apollo-composable'
import { ref } from 'vue'
import {
  REGISTRO_CREATE,
  REGISTRO_UPDATE,
  REGISTRO_DELETE,
  REGISTROS_DELETE,
  IMPORTAR_REGISTROS
} from 'src/graphql/registros'
import { useCuentasCrud } from './useCuentasCrud'

export function useRegistrosCrud() {
  /**
   * composables
   */
  const cuentaCrud = useCuentasCrud()
  /**
   * GRAPHQL
   */
  const options = ref({
    fetchPolicy: 'network-only'
  })

  const {
    mutate: createRegistro,
    onDone: onDoneRegistroCreate,
    onError: onErrorRegistroCreate
  } = useMutation(REGISTRO_CREATE)

  const {
    mutate: registroUpdate,
    onDone: onDoneRegistroUpdate,
    onError: onErrorRegistroUpdate
  } = useMutation(REGISTRO_UPDATE)

  const {
    mutate: deleteRegistro,
    onDone: onDoneRegistroDelete,
    onError: onErrorRegistroDelete
  } = useMutation(REGISTRO_DELETE)

  const {
    mutate: registrosDelete,
    onDone: onDoneRegistrosDelete,
    onError: onErrorRegistrosDelete
  } = useMutation(REGISTROS_DELETE)

  const {
    mutate: importarRegistros,
    onDone: onDoneImportarRegistros,
    onError: onErrorImportarRegistros
  } = useMutation(IMPORTAR_REGISTROS)

  onDoneRegistroCreate(({ data }) => {
    console.log('registro creado', data)
    const itemCreated = data.registroCreate.registro
    cuentaCrud.cuentaSaldoUpdate({ cuentaId: itemCreated.cuenta.id })
  })
  onDoneRegistroUpdate(({ data }) => {
    console.log('registro actualizado', data)
    const itemUpdated = data.registroUpdate.registro
    cuentaCrud.cuentaSaldoUpdate({ cuentaId: itemUpdated.cuenta.id })
  })
  onDoneRegistroDelete(({ data }) => {
    console.log('registro actualizado', data)
    const itemDeleted = data.registroDelete.registro
    cuentaCrud.cuentaSaldoUpdate({ cuentaId: itemDeleted.cuenta.id })
  })
  return {
    createRegistro,
    importarRegistros,
    onDoneRegistroCreate,
    onDoneImportarRegistros,
    onErrorImportarRegistros,
    deleteRegistro,
    onDoneRegistroDelete,
    onErrorRegistroDelete,
    registroUpdate,
    onDoneRegistroUpdate,
    onErrorRegistroCreate,
    onErrorRegistroUpdate,
    registrosDelete,
    onDoneRegistrosDelete,
    onErrorRegistrosDelete
  }
}
