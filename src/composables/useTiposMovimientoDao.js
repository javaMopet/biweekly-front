import { useQuery } from '@vue/apollo-composable'
import { LISTA_TIPOS_MOVIMIENTO } from 'src/graphql/movimientos'

import { ref, reactive, computed } from 'vue'

export function useTiposMovimientoDao() {
  /**
   * graphql
   */
  const graphql_options = reactive({
    fetchPolicy: 'cache-first'
    // fetchPolicy: 'cache-and-network'
  })

  const {
    onResult: onResultListaTiposMovimiento,
    onError: onErrorListaTiposMovimiento
  } = useQuery(LISTA_TIPOS_MOVIMIENTO, null, graphql_options)

  onErrorListaTiposMovimiento((error) => {
    console.trace(error)
  })

  return {
    onResultListaTiposMovimiento,
    onErrorListaTiposMovimiento
  }
}
