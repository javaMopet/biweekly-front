import { useMutation } from '@vue/apollo-composable'
import { TRASPASO_CREATE, TRASPASO_DELETE } from 'src/graphql/traspasos'

export function useTraspasosCrud() {
  const {
    mutate: traspasoCreate,
    onDone: onDoneTraspasoCreate,
    onError: onErrorTraspasoCreate
  } = useMutation(TRASPASO_CREATE)

  const {
    mutate: traspasoDelete,
    onDone: onDoneTraspasoDelete,
    onError: onErrorTraspasoDelete
  } = useMutation(TRASPASO_DELETE)

  return {
    traspasoCreate,
    onDoneTraspasoCreate,
    onErrorTraspasoCreate,
    traspasoDelete,
    onDoneTraspasoDelete,
    onErrorTraspasoDelete
  }
}
