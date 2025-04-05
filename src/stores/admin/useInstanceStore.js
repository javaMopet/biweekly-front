import { useQuery } from '@vue/apollo-composable'
import { defineStore } from 'pinia'
import { INSTANCE_LIST } from 'src/graphql/operations/admin/instance'
import { ref } from 'vue'

export const useInstanceStore = defineStore('instanceStore', () => {
  /**
   * state
   */
  const instanceList = ref([])
  /**
   * composables
   */

  /**
   * graphql
   */
  const graphql_options = ref({
    fetchPolicy: 'no-cache'
  })

  const { onResult: onResultInstanceList, onError: onErrorInstanceList } =
    useQuery(INSTANCE_LIST, null, graphql_options)

  onResultInstanceList(({ data }) => {
    if (!!data) {
      instanceList.value = JSON.parse(JSON.stringify(data.instanceList ?? []))
    }
  })

  onErrorInstanceList((error) => {
    console.error(error)
  })

  function instanceCreated(itemCreated) {
    instanceList.value.push(itemCreated)
  }
  function instanceUpdated(itemUpdated) {
    const index = instanceList.value.findIndex(
      (item) => item.id === itemUpdated.id
    )
    instanceList.value[index] = itemUpdated
  }
  function instanceDeleted(itemDeleted) {
    const index = instanceList.value.findIndex(
      (item) => item.id === itemDeleted.id
    )
    instanceList.value.splice(index, 1)
  }

  return {
    instanceList,
    onResultInstanceList,
    onErrorInstanceList,
    instanceCreated,
    instanceUpdated,
    instanceDeleted
  }
})
