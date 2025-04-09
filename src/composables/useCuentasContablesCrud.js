import { useMutation } from '@vue/apollo-composable'
import {
  CUENTA_CONTABLE_CREATE,
  CUENTA_CONTABLE_UPDATE,
  CUENTA_CONTABLE_DELETE
} from 'src/graphql/cuentasContables'
import { useCuentaContableStore } from 'src/stores/common/useCuentaContableStore'

export function useCuentasContablesCrud() {
  /**
   * composables
   */
  const cuentaContableStore = useCuentaContableStore()
  /**
   * graphql
   */

  const {
    mutate: cuentaContableCreate,
    onDone: onDoneCuentaContableCreate,
    onError: onErrorCuentaContableCreate
  } = useMutation(CUENTA_CONTABLE_CREATE)

  const {
    mutate: cuentaContableUpdate,
    onDone: onDoneCuentaContableUpdate,
    onError: onErrorCuentaContableUpdate
  } = useMutation(CUENTA_CONTABLE_UPDATE)

  const {
    mutate: cuentaContableDelete,
    onDone: onDoneCuentaContableDelete,
    onError: onErrorCuentaContableDelete
    // error
  } = useMutation(CUENTA_CONTABLE_DELETE)

  onDoneCuentaContableCreate(({ data }) => {
    if (data) {
      const itemCreated = JSON.parse(
        JSON.stringify(data.cuentaContableCreate.cuentaContable)
      )
      itemCreated.id = Number(itemCreated.id)
      itemCreated.label = `${itemCreated.id} - ${itemCreated.nombre}`
      itemCreated.selectable = true
      if (cuentaContableStore.listaCuentasContables.length > 0) {
        cuentaContableStore.listaCuentasContables.push(itemCreated)
      }
      const padreId = itemCreated.padreId
      const itemPadre = cuentaContableStore.findTreeElementById(padreId)
      itemPadre.children.push(itemCreated)
    }
  })

  onDoneCuentaContableUpdate(({ data }) => {
    console.log('refrescando cuentasContables en el crud')
    if (data) {
      const itemUpdated = data.cuentaContableUpdate.cuentaContable
      itemUpdated.label = `${itemUpdated.id} - ${itemUpdated.nombre}`
      itemUpdated.selectable = itemUpdated.subnivel === 0
      const itemPadre = cuentaContableStore.findTreeElementById(
        itemUpdated.padreId
      )
      const itemIndex = itemPadre.children.findIndex(
        (cc) => cc.id === Number(itemUpdated.id)
      )
      console.log('itemIndex', itemIndex)
      itemPadre.children[itemIndex].nombre = itemUpdated.nombre
      itemPadre.children[itemIndex].label = itemUpdated.nombreCompleto
      itemPadre.children[itemIndex].selectable = itemUpdated.selectable
      console.log('itemUpdated', itemUpdated)
      console.log('itemUpdated origen', itemPadre.children[itemIndex])
    }
  })

  onDoneCuentaContableDelete(({ data }) => {
    const itemDeleted = data.cuentaContableDelete.cuentaContable
    const id = itemDeleted.id
    const indice = cuentaContableStore.listaCuentasContables.findIndex(
      (cc) => cc.id === id
    )
    cuentaContableStore.listaCuentasContables.splice(indice, 1)

    /* eliminar del arbol de cuentas */
    const padreId = itemDeleted.padreId
    const itemPadre = cuentaContableStore.findTreeElementById(padreId)
    const childrenIndex = itemPadre.children.findIndex(
      (child) => child.id.toString() === id.toString()
    )
    itemPadre.children.splice(childrenIndex, 1)
  })

  onErrorCuentaContableCreate((error) => {
    console.trace(error)
  })

  onErrorCuentaContableUpdate((error) => {
    console.trace(error)
  })
  onErrorCuentaContableDelete((error) => {
    // logErrorMessages(error)
    // console.trace(error)
    console.log(error)
    // console.log(graphQLErrors)
    // console.log('error', error.graphQLErrors[0])
    // console.log('error', error.graphQLErrors[0]?.extensions)
  })
  // watch(error, (newVAlue, oldvalue) => {
  // console.trace(error)
  // console.log(error.result)
  // console.log(error._value)
  // })

  return {
    cuentaContableCreate,
    cuentaContableUpdate,
    cuentaContableDelete,
    onDoneCuentaContableCreate,
    onDoneCuentaContableUpdate,
    onDoneCuentaContableDelete,
    onErrorCuentaContableCreate,
    onErrorCuentaContableUpdate,
    onErrorCuentaContableDelete
  }
}
