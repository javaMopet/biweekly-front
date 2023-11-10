import { useQuery } from '@vue/apollo-composable'
import { defineStore } from 'pinia'
import { LISTA_BANCOS } from 'src/graphql/bancos'
import { ref, reactive } from 'vue'

export const useBancoStore = defineStore('bancoStore', () => {
  const listaBancos = ref([])

  /**
   * graphql
   */
  const options = reactive({
    fetchPolicy: 'cache-first'
    // fetchPolicy: 'cache-and-network'
  })

  const { onResult: onResultListaBancos, onError: onErrorListaBancos } =
    useQuery(LISTA_BANCOS, null, options)

  onResultListaBancos(({ data }) => {
    if (!!data) {
      console.log('data', data)
      listaBancos.value = JSON.parse(JSON.stringify(data.listaBancos)) ?? []
    }
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
    console.log('index', index)
    listaBancos.value[index] = bancoUpdated
  }
  function bancoDeleted(bancoDeleted) {
    const index = listaBancos.value.findIndex(
      (banco) => banco.id === bancoDeleted.id
    )
    listaBancos.value.splice(index, 1)
  }

  return {
    listaBancos,
    bancoCreated,
    bancoUpdated,
    bancoDeleted
  }
})
