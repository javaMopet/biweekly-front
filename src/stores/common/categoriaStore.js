import { defineStore } from 'pinia'
import { useCategoriasCrud } from 'src/composables/useCategoriasCrud'
import { ref } from 'vue'
export const useCategoriaStore = defineStore('categoriaStore', () => {
  /**
   * state
   */
  const listaCategorias = ref([])
  /**
   * composables
   */
  const categoriasCrud = useCategoriasCrud()

  categoriasCrud.onResultListaCategorias(({ data }) => {
    if (!!data) {
      console.log('recuperando datos desde el store', data)
      listaCategorias.value = JSON.parse(
        JSON.stringify(data.listaCategorias ?? [])
      )
    }
  })

  const {
    onDoneCategoriaCreate,
    // onDoneCategoriaUpdate,
    onDoneCategoriaDelete,
    onErrorCategoriaCreate,
    onErrorCategoriaDelete
  } = categoriasCrud

  categoriasCrud.loadOrRefetch()

  function categoriaCreate(input) {
    categoriasCrud.createCategoria({ input })
  }

  function categoriaDelete(id) {
    categoriasCrud.deleteCategoria({ id })
  }

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

  categoriasCrud.onDoneCategoriaDelete

  return {
    listaCategorias,
    categoriaCreate,
    categoriaUpdate,
    categoriaDelete,
    onDoneCategoriaCreate,
    // onDoneCategoriaUpdate,
    onDoneCategoriaDelete,
    onErrorCategoriaDelete
  }
})
