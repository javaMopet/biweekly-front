import { useQuery } from '@vue/apollo-composable'
import { defineStore } from 'pinia'
import { useCategoriasCrud } from 'src/composables/useCategoriasCrud'
import { LISTA_CATEGORIAS } from 'src/graphql/categorias'
import { ref, computed } from 'vue'
export const useCategoriaStore = defineStore('categoriaStore', () => {
  /**
   * state
   */
  const listaCategorias = ref([])
  /**
   * composables
   */
  const categoriasCrud = useCategoriasCrud()

  /**
   * graphql
   */
  // fetchPolicy: 'network-only'
  // fetchPolicy: 'cache-first'
  const graphql_options = ref({
    fetchPolicy: 'no-cache'
  })

  const { onResult: onResultListaCategorias, onError: onErrorListaCategorias } =
    useQuery(LISTA_CATEGORIAS, null, graphql_options)

  onResultListaCategorias(({ data }) => {
    if (!!data) {
      console.log('recuperando datos desde el store', data)
      listaCategorias.value = JSON.parse(
        JSON.stringify(data.listaCategorias ?? [])
      )
    }
  })

  const {
    onDoneCategoriaCreate,
    onDoneCategoriaDelete,
    onErrorCategoriaCreate,
    onErrorCategoriaDelete
  } = categoriasCrud

  categoriasCrud.onDoneCategoriaCreate(({ data }) => {
    if (!!data) {
      const itemSaved = data.categoriaCreate.categoria
      listaCategorias.value.push(itemSaved)
    }
  })

  onDoneCategoriaDelete(({ data }) => {
    console.log('aqui eliminar elemento de la lista', data)
    const id = data.categoriaDelete.categoria.id
    const index = listaCategorias.value.findIndex((c) => c.id === id)
    console.dir(index)
    listaCategorias.value.splice(index, 1)
  })

  const listaCategoriasIngresos = computed({
    get() {
      return (
        listaCategorias.value.filter(
          (categoria) => categoria.tipoMovimientoId === '1'
        ) ?? []
      )
    }
  })

  const listaCategoriasEgresos = computed({
    get() {
      return listaCategorias.value.filter(
        (categoria) => categoria.tipoMovimientoId === '2'
      )
    }
  })

  return {
    listaCategorias,
    onErrorCategoriaDelete,
    listaCategoriasIngresos,
    listaCategoriasEgresos
  }
})
