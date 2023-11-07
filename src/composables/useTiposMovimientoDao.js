import { useQuery } from '@vue/apollo-composable'
import { LISTA_TIPOS_MOVIMIENTO } from 'src/graphql/movimientos'

import { ref, computed } from 'vue'

export function useTiposMovimientoDao() {
  /**
   * graphql
   */
  const graphql_options = ref({
    fetchPolicy: 'cache-first'
  })

  const {
    result: resultadoListaTiposMovimiento,
    onError: onErrorListaTiposMovimiento,
    refetch: refetchListaTiposMovimiento
  } = useQuery(LISTA_TIPOS_MOVIMIENTO, null, graphql_options)

  const listaTiposMovimiento = computed({
    get() {
      return resultadoListaTiposMovimiento.value?.listaTiposMovimiento ?? []
    }
  })

  return {
    listaTiposMovimiento
  }
}
