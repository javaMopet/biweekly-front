export function useFormato() {
  function toCurrency(val) {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(val);
  }

  function toPercentage(val) {
    return val * 100 + '%';
  }

  function formatoFecha(val) {
    var today = new Date(val);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    return today;
  }

  function formatoHoraAMPM(val) {
    var date = new Date(val);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  return {
    toCurrency,
    toPercentage,
    formatoFecha,
    formatoHoraAMPM
  };
}
