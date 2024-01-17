import { useQuasar } from 'quasar'

export function useNotificacion() {
  const $q = useQuasar()

  const mostrarNotificacionPositiva = (message, timeout) => {
    $q.notify({
      position: 'center',
      type: 'positive',
      message,
      timeout,
      color: 'positive',
      textColor: 'white',
      classes: 'glossy'
    })
  }
  // progress: true,

  const mostrarNotificacionNegativa = (message, timeout, position) => {
    $q.notify({
      position,
      type: 'negative',
      message,
      timeout
    })
  }

  const mostrarNotificacionInformativa = (message, timeout) => {
    $q.notify({
      position: 'bottom',
      type: 'info',
      message,
      timeout,
      color: 'info'
    })
  }

  return {
    mostrarNotificacionPositiva,
    mostrarNotificacionNegativa,
    mostrarNotificacionInformativa
  }
}
