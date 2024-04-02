import { useMutation } from '@vue/apollo-composable'
import {
  REGISTRO_TARJETA_CREATE,
  REGISTRO_TARJETA_UPDATE,
  REGISTRO_TARJETA_DELETE,
  REGISTROS_TARJETA_DELETE,
  REGISTRO_TARJETA_PAGO_DELETE
  // IMPORTAR_REGISTROS_TARJETA
} from 'src/graphql/registrosTarjeta'

import { useCuentasCrud } from './useCuentasCrud'

export function useRegistrosTarjetaCrud() {
  /**
   * composables
   */
  const cuentaCrud = useCuentasCrud()
  /**
   * GRAPHQL
   */
  // const options = ref({
  //   fetchPolicy: 'network-only'
  // })

  const {
    mutate: createRegistroTarjeta,
    onDone: onDoneRegistroTarjetaCreate,
    onError: onErrorRegistroTarjetaCreate
  } = useMutation(REGISTRO_TARJETA_CREATE)

  const {
    mutate: registroTarjetaUpdate,
    onDone: onDoneRegistroTarjetaUpdate,
    onError: onErrorRegistroTarjetaUpdate
  } = useMutation(REGISTRO_TARJETA_UPDATE)

  const {
    mutate: registroTarjetaDelete,
    onDone: onDoneRegistroTarjetaDelete,
    onError: onErrorRegistroTarjetaDelete
  } = useMutation(REGISTRO_TARJETA_DELETE)

  const {
    mutate: registrosTarjetaDelete,
    onDone: onDoneRegistrosTarjetaDelete,
    onError: onErrorRegistrosTarjetaDelete
  } = useMutation(REGISTROS_TARJETA_DELETE)

  const {
    mutate: registroTarjetaPagoDelete,
    onDone: onDoneRegistroTarjetaPagoDelete,
    onError: onErrorRegistroTarjetaPagoDelete
  } = useMutation(REGISTRO_TARJETA_PAGO_DELETE)

  onDoneRegistroTarjetaCreate(({ data }) => {
    console.log('registroTarjeta creado', data)
    const itemCreated = data.registroTarjetaCreate.registroTarjeta
    cuentaCrud.cuentaSaldoUpdate({ cuentaId: itemCreated.cuenta.id })
  })
  onDoneRegistroTarjetaUpdate(({ data }) => {
    console.log('registroTarjeta actualizado', data)
    const itemUpdated = data.registroTarjetaUpdate.registroTarjeta
    cuentaCrud.cuentaSaldoUpdate({ cuentaId: itemUpdated.cuenta.id })
  })
  onDoneRegistroTarjetaDelete(({ data }) => {
    console.log('registroTarjeta actualizado', data)
    const itemDeleted = data.registroTarjetaDelete.registroTarjeta
    cuentaCrud.cuentaSaldoUpdate({ cuentaId: itemDeleted.cuenta.id })
  })

  onDoneRegistrosTarjetaDelete(({ data }) => {
    console.log(
      'registroTarjeta actualizado',
      data.registrosTarjetaDelete.saldo
    )
  })
  onDoneRegistroTarjetaPagoDelete(({ data }) => {
    console.log('[ {data} ] >', { data })
  })
  onErrorRegistroTarjetaPagoDelete((response) => {
    console.log('[ response ] >', response)
  })

  return {
    createRegistroTarjeta,
    onDoneRegistroTarjetaCreate,
    registroTarjetaDelete,
    onDoneRegistroTarjetaDelete,
    onErrorRegistroTarjetaDelete,
    registroTarjetaUpdate,
    onDoneRegistroTarjetaUpdate,
    onErrorRegistroTarjetaCreate,
    onErrorRegistroTarjetaUpdate,
    // importarRegistrosTarjeta,
    // onDoneImportarRegistrosTarjeta,
    // onErrorImportarRegistrosTarjeta,
    registrosTarjetaDelete,
    onDoneRegistrosTarjetaDelete,
    registroTarjetaPagoDelete,
    onDoneRegistroTarjetaPagoDelete,
    onErrorRegistroTarjetaPagoDelete
  }
}
