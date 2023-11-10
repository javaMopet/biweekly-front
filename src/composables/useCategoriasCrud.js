import { useLazyQuery, useMutation, useQuery } from '@vue/apollo-composable'
import { logErrorMessages } from '@vue/apollo-util'
import {
  LISTA_CATEGORIAS,
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
  const graphql_options = ref({
    // fetchPolicy: 'network-only'
    fetchPolicy: 'cache-first'
  })

  const {
    onResult: onResultListaCategorias,
    onError: onErrorListaCategorias,
    load,
    refetch
    // refetch: refetchListaCategorias
  } = useLazyQuery(LISTA_CATEGORIAS, null, graphql_options)

  const {
    mutate: createCategoria,
    onDone: onDoneCategoriaCreate,
    onError: onErrorCategoriaCreate
  } = useMutation(CATEGORIA_CREATE)

  const {
    mutate: updateCategoria,
    onDone: onDoneCategoriaUpdate,
    onError: onErrorUpdateCategoria
  } = useMutation(CATEGORIA_UPDATE)

  const {
    mutate: deleteCategoria,
    onDone: onDoneCategoriaDelete,
    onError: onErrorCategoriaDelete
  } = useMutation(CATEGORIA_DELETE)

  /**
   * state
   */

  // watch(resultadoLista, (value) => {
  //   console.dir(value)
  //   listaCategorias.value = JSON.parse(JSON.stringify(value?.listaCategorias))
  //   console.dir(listaCategorias.value.length)
  // })

  onDoneCategoriaCreate(({ data }) => {
    if (!!data) {
      console.log('refrescando categorias', data)
      // console.dir(listaCategorias.value.length)
      // listaCategorias.value.push(data.categoriaCreate.categoria)
      // console.dir(listaCategorias.value.length)
    }
  })
  onErrorCategoriaCreate((error) => {
    logErrorMessages(error)
    console.log('error', error.graphQLErrors[0])
    console.log('error', error.graphQLErrors[0]?.extensions)
  })

  // onErrorListaCuentas((error) => {
  //   console.log(error)
  // })

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

  function loadOrRefetch() {
    load() || refetch()
  }

  return {
    onResultListaCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    onDoneCategoriaCreate,
    onDoneCategoriaUpdate,
    onDoneCategoriaDelete,
    onErrorListaCategorias,
    onErrorCategoriaCreate,
    onErrorUpdateCategoria,
    onErrorCategoriaDelete,
    loadOrRefetch
    // refetchListaCategorias
  }
}
