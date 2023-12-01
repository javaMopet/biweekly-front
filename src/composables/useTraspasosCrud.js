import { useLazyQuery, useMutation } from '@vue/apollo-composable'
import {
  LISTA_TRASPASOS,
  TRASPASO_CREATE,
  TRASPASO_DELETE,
  TRASPASO_UPDATE
} from 'src/graphql/traspasos'

export function useTraspasosCrud() {
  const {
    mutate: traspasoCreate,
    onDone: onDoneTraspasoCreate,
    onError: onErrorTraspasoCreate
  } = useMutation(TRASPASO_CREATE)

  const {
    mutate: traspasoUpdate,
    onDone: onDoneTraspasoUpdate,
    onError: onErrorTraspasoUpdate
  } = useMutation(TRASPASO_UPDATE)

  const {
    mutate: traspasoDelete,
    onDone: onDoneTraspasoDelete,
    onError: onErrorTraspasoDelete
  } = useMutation(TRASPASO_DELETE)

  const { load: loadListaTraspasos, onResult: onResultListaTraspasos } =
    useLazyQuery(LISTA_TRASPASOS)

  return {
    traspasoCreate,
    traspasoUpdate,
    onDoneTraspasoCreate,
    onDoneTraspasoUpdate,
    onErrorTraspasoCreate,
    onErrorTraspasoUpdate,
    traspasoDelete,
    onDoneTraspasoDelete,
    onErrorTraspasoDelete,
    loadListaTraspasos,
    onResultListaTraspasos
  }
}
