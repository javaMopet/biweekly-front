import { useQuasar } from 'quasar'

export function useNotificacion() {
  const $q = useQuasar()

  const mostrarNotificacionPositiva = (message, timeout) => {
    $q.notify({
      position: 'center',
      type: 'positive',
      message,
      timeout,
      progress: true,
      color: 'positive',
      textColor: 'white',
      classes: 'glossy'
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
