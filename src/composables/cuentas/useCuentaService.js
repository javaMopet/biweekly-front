import { useQuery, useMutation, useLazyQuery } from '@vue/apollo-composable'
import FormCuentaRegistro from 'src/components/movimientos/FormCuentaRegistro.vue'
import { CUENTA_CREATE, LISTA_CUENTAS } from 'src/graphql/cuentas'
import { useCuentaStore } from 'src/stores/common/useCuentaStore'
import { ref } from 'vue'

export function useCuentaService() {
  const cuentaStore = useCuentaStore()

  const {
    mutate: cuentaCreate,
    onDone: onDoneCuentaCreate,
    onError: onErrorCuentaCreate
  } = useMutation(CUENTA_CREATE)

  onDoneCuentaCreate(({ data }) => {
    const itemSaved = data.cuentaCreate.cuenta
  })

  onErrorCuentaCreate((error) => {
    console.trace(error)
  })

  // function loadOrRefetchListaCuentas() {
  //   loadListaCuentas() || refetchListaCuentas()
  // }

  return {
    // onResultListaCuentas,
    // loadOrRefetchListaCuentas,
    // loadingListaCuentas,
    // onErrorListaCuentas,
    cuentaCreate,
    onDoneCuentaCreate,
    onErrorCuentaCreate
  }
}
