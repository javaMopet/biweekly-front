import { useMutation } from '@vue/apollo-composable'
import { TRASPASO_CREATE } from 'src/graphql/traspasos'

export function useTraspasosCrud() {
  const {
    mutate: traspasoCreate,
    onDone: onDoneTraspasoCreate,
    onError: onErrorTraspasoCreate
  } = useMutation(TRASPASO_CREATE)

  return {
    traspasoCreate,
    onDoneTraspasoCreate,
    onErrorTraspasoCreate
  }
}
