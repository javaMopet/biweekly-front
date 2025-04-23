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

  const mostrarNotificacionAdvertencia = (
    message,
    caption,
    timeout,
    position,
    textColor
  ) => {
    $q.notify({
      position: position || 'top-right',
      type: 'warning',
      message,
      caption,
      timeout,
      color: 'warning',
      textColor: textColor || 'red'
    })
  }

  return {
    mostrarNotificacionPositiva,
    mostrarNotificacionNegativa,
    mostrarNotificacionInformativa,
    mostrarNotificacionAdvertencia
  }
}
