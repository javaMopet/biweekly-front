import { useQuery } from '@vue/apollo-composable'
import { defineStore } from 'pinia'
import { LISTA_CATEGORIAS } from 'src/graphql/categorias'
import { ref, reactive, computed } from 'vue'
import { SessionStorage } from 'quasar'

export const useCategoriaStore = defineStore('categoriaStore', () => {
  /**
   * state
   */
  const listaCategorias = ref([])
  /**
   * composables
   */

  /**
   * graphql
   */
  // fetchPolicy: 'network-only'
  // fetchPolicy: 'cache-first'
  const graphql_options = ref({
    fetchPolicy: 'no-cache'
  })

  const variablesListados = reactive({
    instanceId: SessionStorage.getItem('current_instance').id ?? '-1'
  })

  const {
    onResult: onResultListaCategorias,
    onError: onErrorListaCategorias,
    loading: loadingListaCategorias
  } = useQuery(LISTA_CATEGORIAS, variablesListados, graphql_options)

  onResultListaCategorias(({ data }) => {
    if (data) {
      listaCategorias.value = JSON.parse(
        JSON.stringify(data.listaCategorias ?? [])
      )
    }
  })

  onErrorListaCategorias((error) => {
    console.error(error)
  })

  // const {
  //   onDoneCategoriaCreate,
  //   onDoneCategoriaDelete,
  //   onErrorCategoriaCreate,
  //   onErrorCategoriaDelete
  // } = categoriasCrud

  // categoriasCrud.onDoneCategoriaCreate(({ data }) => {
  //   if (data) {
  //     const itemSaved = data.categoriaCreate.categoria
  //     listaCategorias.value.push(itemSaved)
  //   }
  // })

  // onDoneCategoriaDelete(({ data }) => {
  //   console.log('aqui eliminar elemento de la lista', data)
  //   const id = data.categoriaDelete.categoria.id
  //   const index = listaCategorias.value.findIndex((c) => c.id === id)
  //   console.dir(index)
  //   listaCategorias.value.splice(index, 1)
  // })

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
    loadingListaCategorias,
    onErrorListaCategorias,
    // onErrorCategoriaDelete,
    listaCategoriasIngresos,
    listaCategoriasEgresos
  }
})
