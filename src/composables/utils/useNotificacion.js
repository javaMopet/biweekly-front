import { useQuasar } from 'quasar'

export function useNotificacion() {
  const $q = useQuasar()

  const mostrarNotificacionPositiva = (message, timeout) => {
    $q.notify({
      position: 'top',
      type: 'positive',
      message,
      timeout,
      progress: true,
      // color: 'cyan-9',
      color: 'green-7',
      textColor: 'green-1'
      // classes: 'glossy'
    })
  }

  const mostrarNotificacionNegativa = (message, timeout) => {
    $q.notify({
      position: 'center',
      type: 'negative',
      message,
      timeout
    })
  }

  const mostrarNotificacionInformativa = (message, timeout) => {
    $q.notify({
      position: 'center',
      type: 'info',
      message,
      timeout
    })
  }

  return {
    mostrarNotificacionPositiva,
    mostrarNotificacionNegativa,
    mostrarNotificacionInformativa
  }
}
