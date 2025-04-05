import { useQuery } from '@vue/apollo-composable'
import { defineStore } from 'pinia'
import { SessionStorage } from 'quasar'
import { useUserService } from 'src/composables/admin/useUserService'
import { USERS_LIST } from 'src/graphql/operations/users'
import { ref, reactive } from 'vue'

export const useUsuarioStore = defineStore('usuarioStore', () => {
  /**
   * state
   */
  const listaUsuarios = ref([])
  /**
   * composables
   */
  const userService = useUserService()

  /**
   * graphql
   */
  const graphql_options = ref({
    fetchPolicy: 'no-cache'
  })

  const variablesListados = reactive({
    instanceId: SessionStorage.getItem('current_instance').id ?? '-1'
  })

  const {
    onResult: onResultUsersList,
    onError: onErrorUsersList,
    loading: loadingListaUsuarios,
    refetch: refetchUsersList
  } = useQuery(USERS_LIST, variablesListados, graphql_options)

  onResultUsersList(({ data }) => {
    if (!!data) {
      listaUsuarios.value = JSON.parse(JSON.stringify(data.usersList ?? []))
    }
  })

  onErrorUsersList((error) => {
    console.error(error)
  })

  function loadOrRefetchUsers() {
    refetchUsersList()
  }
  function changeUserIsAdmin(userId, isAdmin) {
    const index = listaUsuarios.value.findIndex((user) => user.id === userId)
    const user = listaUsuarios.value[index]
    user.isAdmin = isAdmin
  }

  return {
    listaUsuarios,
    onResultUsersList,
    onErrorUsersList,
    loadingListaUsuarios,
    loadOrRefetchUsers,
    changeUserIsAdmin
  }
})
