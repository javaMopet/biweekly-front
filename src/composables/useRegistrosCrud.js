import { useMutation } from '@vue/apollo-composable'
import { ref } from 'vue'
import { INGRESO_CREATE } from 'src/graphql/ingresos'
import { EGRESO_CREATE } from 'src/graphql/egresos'
import { TRANSFERENCIA_CREATE } from 'src/graphql/transferencias'

export function useRegistrosCrud() {
  /**
   * GRAPHQL
   */
  const options = ref({
    fetchPolicy: 'network-only'
  })

  const {
    mutate: createIngreso,
    onDone: onDoneCreateIngreso,
    onError: onErrorCreateIngreso
  } = useMutation(INGRESO_CREATE)
  const {
    mutate: createEgreso,
    onDone: onDoneCreateEgreso,
    onError: onErrorCreateEgreso
  } = useMutation(EGRESO_CREATE)
  const {
    mutate: createTransferencia,
    onDone: onDoneCreateTransferencia,
    onError: onErrorCreateTransferencia
  } = useMutation(TRANSFERENCIA_CREATE)

  return {
    createIngreso,
    createEgreso,
    createTransferencia,
    onDoneCreateIngreso,
    onDoneCreateEgreso,
    onDoneCreateTransferencia,
    onErrorCreateIngreso
  }
}
