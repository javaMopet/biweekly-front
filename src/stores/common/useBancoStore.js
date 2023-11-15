import { useQuery } from '@vue/apollo-composable'
import { defineStore } from 'pinia'
import { LISTA_BANCOS } from 'src/graphql/bancos'
import { ref, reactive } from 'vue'

export const useBancoStore = defineStore('bancoStore', () => {
  const listaBancos = ref([])

  /**
   * graphql
   */
  // fetchPolicy: 'cache-first'
  // fetchPolicy: 'cache-and-network'
  // fetchPolicy: 'network-only'
  // utilizando no-cache se mantiene con el estatus del store
  const options = reactive({
    fetchPolicy: 'no-cache'
  })

  const {
    onResult: onResultListaBancos,
    onError: onErrorListaBancos
    // refetch: refetchListaBancos
  } = useQuery(LISTA_BANCOS, { id: 0 }, options)

  onResultListaBancos(({ data }) => {
    if (!!data) {
      console.log('cargando lista de bancos al store ....')
      listaBancos.value = JSON.parse(JSON.stringify(data.listaBancos)) ?? []
    }
  })
  onErrorListaBancos((error) => {
    console.trace(error)
  })
  /**
   * methods
   */

  function bancoCreated(bancoCreated) {
    listaBancos.value.push(bancoCreated)
  }

  function bancoUpdated(bancoUpdated) {
    const index = listaBancos.value.findIndex(
      (banco) => banco.id === bancoUpdated.id
    )
    listaBancos.value[index] = bancoUpdated
  }
  /**
   *
   * @param {*} bancoDeleted
   */
  function bancoDeleted(bancoDeleted) {
    /**
     * probemos actualizando el elemento con una bandera
     * lo dejamos para futuras referecias
     */
    // const index = listaBancos.value.findIndex(
    //   (banco) => banco.id === bancoDeleted.id
    // )
    // bancoDeleted.deleted = true
    // console.log('index deleted', index)
    // listaBancos.value[index] = bancoDeleted

    /**
     * Aqui es con un refresh
     */

    /**
     * No usando el fetchPolicy: 'no-cache', esta parte no funciona
     * el splice aqui no funciona, al actualizar inmediatamente
     * despues de eliminar se origina un bug
     */
    const index = listaBancos.value.findIndex(
      (banco) => banco.id === bancoDeleted.id
    )
    listaBancos.value.splice(index, 1)
    // refetchListaBancos()
    // Se colocó un refetchQueries al ejecutar deleteMutation de bancos
    // al invocar el useBancoStore se ejecuta en automático el query LISTA_BANCOS
    // sin embargo lo trae de cache y retorna tambien el elemento previamente eliminado
  }

  return {
    listaBancos,
    bancoCreated,
    bancoUpdated,
    bancoDeleted
  }
})
