import { useQuery } from '@vue/apollo-composable'
import { defineStore } from 'pinia'
import { useUserService } from 'src/composables/admin/useUserService'
import { USERS_LIST } from 'src/graphql/operations/users'
import { ref } from 'vue'

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

  const {
    onResult: onResultUsersList,
    onError: onErrorUsersList,
    loading: loadingListaUsuarios,
    refetch: refetchUsersList
  } = useQuery(USERS_LIST, null, graphql_options)

  onResultUsersList(({ data }) => {
    if (!!data) {
      listaUsuarios.value = JSON.parse(JSON.stringify(data.usersList ?? []))
      console.log('listaUsuarios.value:', listaUsuarios.value)
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
