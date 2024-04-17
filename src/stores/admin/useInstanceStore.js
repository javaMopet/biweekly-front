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
      console.log('instanceList.value:', instanceList.value)
    }
  })

  onErrorInstanceList((error) => {
    console.error(error)
  })

  return {
    instanceList,
    onResultInstanceList,
    onErrorInstanceList
  }
})
