import { useMutation } from '@vue/apollo-composable'
import { CUENTA_SALDO_UPDATE } from 'src/graphql/cuentas'

export function useCuentasCrud() {
  /**
   * composables
   */

  const {
    mutate: cuentaSaldoUpdate,
    onDone: onDoneCuentaSaldoUpdate,
    onError: onErrorCuentaSaldoUpdate
  } = useMutation(CUENTA_SALDO_UPDATE)

  onDoneCuentaSaldoUpdate(({ data }) => {
    // console.log('Se actualizo el saldo de la cuenta', data)
    // console.log('Actualizar en la interfaz')
    const saldoUpdated = data.cuentaSaldoUpdate.cuenta
    updateCuentaInterfaz(saldoUpdated)
  })

  function updateCuentaInterfaz(saldoUpdated) {
    // console.log('Se actualiza el saldo de la cuenta interfaz', saldoUpdated)
    // const index = cuentaStore.listaCuentas.findIndex(
    //   (c) => c.id === saldoUpdated.id
    // )
    // cuentaStore.listaCuentas[index].saldo = saldoUpdated.saldo
  }

  onErrorCuentaSaldoUpdate((error) => {
    console.trace(error)
  })
  // onErrorSaldoTarjetaCredito((error) => {
  //   console.trace(error)
  // })

  return {
    cuentaSaldoUpdate,

    onDoneCuentaSaldoUpdate

    // loadSaldoTarjetaCredito,
    // onResultSaldoTarjetaCredito,
    // onErrorSaldoTarjetaCredito
  }
}
