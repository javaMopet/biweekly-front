import { useMutation } from '@vue/apollo-composable'
import { logErrorMessages } from '@vue/apollo-util'
import {
  CATEGORIA_CREATE,
  CATEGORIA_UPDATE,
  CATEGORIA_DELETE
} from 'src/graphql/categorias'
import { useCategoriaStore } from 'src/stores/common/categoriaStore'

import { ref, watch } from 'vue'

export function useCategoriasCrud() {
  /**
   * store
   */
  const categoriaStore = useCategoriaStore()

  /**
   * graphql
   */
  const {
    mutate: categoriaCreate,
    onDone: onDoneCategoriaCreate,
    onError: onErrorCategoriaCreate
  } = useMutation(CATEGORIA_CREATE)

  const {
    mutate: categoriaUpdate,
    onDone: onDoneCategoriaUpdate,
    onError: onErrorCategoriaUpdate
  } = useMutation(CATEGORIA_UPDATE)

  const {
    mutate: categoriaDelete,
    onDone: onDoneCategoriaDelete,
    onError: onErrorCategoriaDelete
  } = useMutation(CATEGORIA_DELETE)

  /**
   * state
   */
  onDoneCategoriaCreate(({ data }) => {
    if (!!data) {
      console.log('refrescando categorias', data)
      categoriaStore.listaCategorias.push(data.categoriaCreate.categoria)
    }
  })

  onDoneCategoriaUpdate(({ data }) => {
    if (!!data) {
      console.log('categoria actualizada', data)
      const index = findItemIndexOnList(data.categoriaUpdate.categoria)
      categoriaStore.listaCategorias[index] = {
        ...data.categoriaUpdate.categoria
      }
    }
  })

  onDoneCategoriaDelete(({ data }) => {
    if (!!data) {
      console.log('categoria eliminada', data)
      const index = findItemIndexOnList(data.categoriaDelete.categoria)
      categoriaStore.listaCategorias.splice(index, 1)
    }
  })

  function findItemIndexOnList(item) {
    const index = categoriaStore.listaCategorias.findIndex(
      (c) => c.id === item.id
    )
    return index
  }

  onErrorCategoriaCreate((error) => {
    logErrorMessages(error)
    console.log('error', error.graphQLErrors[0])
    console.log('error', error.graphQLErrors[0]?.extensions)
  })

  onErrorCategoriaUpdate((error) => {
    logErrorMessages(error)
    // console.dir(error)
    // const problems = error.graphQLErrors[0].extensions.problems
    // if (!!problems) {
    //   console.table(problems)
    // }
  })

  return {
    categoriaCreate,
    categoriaUpdate,
    categoriaDelete,
    onDoneCategoriaCreate,
    onDoneCategoriaUpdate,
    onDoneCategoriaDelete,
    onErrorCategoriaCreate,
    onErrorCategoriaUpdate,
    onErrorCategoriaDelete
  }
}
