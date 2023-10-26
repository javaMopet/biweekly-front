import { useMutation, useQuery } from '@vue/apollo-composable'
import {
  LISTA_CATEGORIAS,
  CATEGORIA_CREATE,
  CATEGORIA_UPDATE,
  CATEGORIA_DELETE
} from 'src/graphql/categorias'

import { ref, computed } from 'vue'

export function useCategoriaCrud() {
  /**
   * graphql
   */
  const graphql_options = ref({
    fetchPolicy: 'network-only'
  })
  const {
    result: resultadoLista,
    onError: onErrorListaCategorias,
    refetch: refetchListaCategorias
  } = useQuery(LISTA_CATEGORIAS, null, graphql_options)

  const {
    mutate: createCategoria,
    onDone: onDoneCreate,
    onError: onErrorCreate
  } = useMutation(CATEGORIA_CREATE)

  const {
    mutate: updateCategoria,
    onDone: onDoneUpdate,
    onError: onErrorUpdateCategoria
  } = useMutation(CATEGORIA_UPDATE)

  const {
    mutate: deleteCategoria,
    onDone: onDoneDeleteCategoria,
    onError: onErrorDeleteCategoria
  } = useMutation(CATEGORIA_DELETE)

  const listaCategorias = computed({
    get() {
      return resultadoLista.value?.listaCategorias ?? []
    }
  })

  onDoneCreate(({ data }) => {
    console.log('refrescando categorias')
    refetchListaCategorias()
  })
  onErrorCreate((error) => {
    console.log('error', error.graphQLErrors[0])
    console.log('error', error.graphQLErrors[0].extensions)
  })

  // onErrorListaCuentas((error) => {
  //   console.log(error)
  // })

  onDoneUpdate(({ data }) => {
    refetchListaCategorias()
  })
  onErrorUpdateCategoria((error) => {
    console.log('error', error.graphQLErrors[0])
    console.log('error', error.graphQLErrors[0].extensions)
  })

  return {
    listaCategorias,
    createCategoria,
    updateCategoria,
    onDoneCreate,
    onDoneUpdate,
    onDoneDeleteCategoria,
    onErrorListaCategorias,
    onErrorDeleteCategoria
  }
}
