import { useQuery } from '@vue/apollo-composable'
import { defineStore } from 'pinia'
import { ROLE_LIST } from 'src/graphql/operations/admin/role'
import { ref } from 'vue'

export const useRoleStore = defineStore('roleStore', () => {
  /**
   * state
   */
  const roleList = ref([])
  /**
   * composables
   */

  /**
   * graphql
   */
  const graphql_options = ref({
    fetchPolicy: 'no-cache'
  })

  const { onResult: onResultRoleList, onError: onErrorRoleList } = useQuery(
    ROLE_LIST,
    null,
    graphql_options
  )

  onResultRoleList(({ data }) => {
    if (!!data) {
      roleList.value = JSON.parse(JSON.stringify(data.roleList ?? []))
    }
  })

  onErrorRoleList((error) => {
    console.error(error)
  })

  function roleCreated(itemCreated) {
    roleList.value.push(itemCreated)
  }
  function roleUpdated(itemUpdated) {
    const index = roleList.value.findIndex((item) => item.id === itemUpdated.id)
    roleList.value[index] = itemUpdated
  }
  function roleDeleted(itemDeleted) {
    const index = roleList.value.findIndex((item) => item.id === itemDeleted.id)
    roleList.value.splice(index, 1)
  }

  return {
    roleList,
    onResultRoleList,
    onErrorRoleList,
    roleCreated,
    roleUpdated,
    roleDeleted
  }
})
