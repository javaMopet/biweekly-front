import { useQuery } from '@vue/apollo-composable'
import { defineStore } from 'pinia'
import { SessionStorage } from 'quasar'
import { ARBOL_MENUS, MENUS_LIST } from 'src/graphql/menus'
import { ref, reactive } from 'vue'

export const useMenuStore = defineStore('menuStore', () => {
  /**
   * state
   */
  const arbolMenus = ref([])
  const listaMenus = ref([])

  /**
   * graphql
   */
  const graphql_options = ref({
    fetchPolicy: 'no-cache'
  })
  const menuVariables = reactive({
    usuarioId: SessionStorage.getItem('current_user')?.id || 1
  })

  const { onResult: onResultListaMenus, onError: onErrorListaMenus } = useQuery(
    ARBOL_MENUS,
    menuVariables,
    graphql_options
  )
  const { onResult: onResultMenusList, onError: onErrorMenusList } = useQuery(
    MENUS_LIST,
    menuVariables,
    graphql_options
  )

  onResultListaMenus(({ data }) => {
    if (!!data) {
      arbolMenus.value = JSON.parse(JSON.stringify(data.menuLevels))
    }
  })

  onResultMenusList(({ data }) => {
    if (!!data) {
      // console.log('data:', data.menusList)
      listaMenus.value = JSON.parse(JSON.stringify(data.menusList))
    }
  })

  onErrorListaMenus((error) => {
    console.error(error)
  })
  onErrorMenusList((error) => {
    console.log('error:', error)
  })

  /**
   * return
   */
  return {
    arbolMenus,
    onErrorListaMenus,
    listaMenus
  }
})
