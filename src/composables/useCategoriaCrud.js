import { useMutation, useQuery } from '@vue/apollo-composable'
import {
  LISTA_CATEGORIAS,
  CATEGORIA_CREATE,
  CATEGORIA_UPDATE
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
    onError: onErrorListaCuentas,
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

  const listaCategorias = computed({
    get() {
      return resultadoLista.value?.listaCategorias ?? []
    }
  })
  onDoneCreate(({ data }) => {
    refetchListaCategorias()
  })
  onErrorCreate((error) => {
    console.log('error', error.graphQLErrors[0])
    console.log('error', error.graphQLErrors[0].extensions)
  })

  onErrorListaCuentas((error) => {
    console.log(error)
  })

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
    onDoneUpdate
  }
}
