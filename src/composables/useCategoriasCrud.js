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
    onError: onErrorUpdateCategoria
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
  onErrorCategoriaCreate((error) => {
    logErrorMessages(error)
    console.log('error', error.graphQLErrors[0])
    console.log('error', error.graphQLErrors[0]?.extensions)
  })

  onDoneCategoriaUpdate(({ data }) => {
    // refetchListaCategorias()
  })

  onErrorUpdateCategoria((error) => {
    console.dir(error)
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
    onErrorUpdateCategoria,
    onErrorCategoriaDelete
  }
}
