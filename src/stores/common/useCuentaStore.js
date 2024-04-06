import { useLazyQuery, useQuery } from '@vue/apollo-composable'
import { defineStore } from 'pinia'
import { LISTA_CUENTAS } from 'src/graphql/cuentas'
import { ref, reactive, onMounted } from 'vue'

export const useCuentaStore = defineStore('cuentaStore', () => {
  const listaCuentas = ref([])
  /**
   * composables
   */
  /**
   * grapqhl
   */
  // const graphql_options = reactive({
  //   // fetchPolicy: 'no-cache'
  //   // pollInterval: 1000
  //   // fetchPolicy: 'cache-and-network'
  //   fetchPolicy: 'network-only'
  // })

  onMounted(() => {
    console.log('On mounted cuenta Store')
  })

  const variables = reactive({
    instanceId: 1
  })

  const {
    onResult: onResultListaCuentas,
    onError: onErrorListaCuentas,
    // load: loadListaCuentas,
    refetch: refetchListaCuentas
    // result: resultListaCuentas,
    // loading: loadingListaCuentas
  } = useQuery(LISTA_CUENTAS, variables)

  onResultListaCuentas(({ data }) => {
    if (!!data) {
      console.log('recupeando datos desde el store', 'color: #007acc;', data)
      listaCuentas.value = JSON.parse(JSON.stringify(data.listaCuentas ?? []))
    }
  })
  onErrorListaCuentas((error) => {
    console.error(error)
  })
  function fetchOrRefetch() {
    // loadListaCuentas() ||
    refetchListaCuentas()
  }
  // onMounted(() => {
  //   if (listaCuentas.value.length <= 0) {
  //     console.log('Refetching lista de cuentas')
  //     refetchListaCuentas()
  //   }
  // })
  // const {
  //   onResultListaCuentas,
  //   onErrorListaCuentas,
  //   loadingListaCuentas
  //   // loadOrRefetchListaCuentas
  // } = useCuentaService()
  /**
   * onMoun
   */
  // onMounted(() => {
  //   console.log('Iniciando el store')
  //   console.log(
  //     '%csrc/stores/common/useCuentaStore.js:24 listaCuentas.value',
  //     'color: #007acc;',
  //     listaCuentas.value
  //   )
  //   // loadOrRefetchListaCuentas()
  // })
  /**
   * state
   */

  // const listaCuentasAhorro = ref([])
  /**
   * graphql
   */
  //fetchPolicy: 'no-cache'
  // const graphqlOptions = ref({
  //   fetchPolicy: 'no-cache'
  //   // fetchPolicy: 'network-only'
  // })
  // const listaCuentas = computed(
  //   () => resultListaCuentas.value?.listaCuentas ?? []
  // )
  // const listaCuentasAhorro = computed(
  //   () =>
  //     resultListaCuentas.value?.listaCuentas.filter(
  //       (c) => c.tipoCuenta.id !== '3'
  //     ) ?? []
  // )

  // watch(resultListaCuentas, (value) => {
  //   console.log(
  //     '%csrc/stores/common/useCuentaStore.js:58 value',
  //     'color: #007acc;',
  //     value.listaCuentas
  //   )
  //   listaCuentas.value = JSON.parse(JSON.stringify(value.listaCuentas ?? []))
  //   listaCuentasAhorro.value =
  //     listaCuentas.value.filter((c) => c.tipoCuenta.id !== '3') ?? []
  // })

  // function loadOrRefetchListaCuentas() {
  //   // loadListaCuentas() ||
  //   // refetchListaCuentas()
  // }

  /**
   * computed
   */
  // const listaCuentas = computed({
  //   get() {
  //     console.log(resultListaCuentas.value?.listaCuentas?.length || 0)
  //     return resultListaCuentas.value?.listaCuentas ?? []
  //   }
  // })
  // const listaCuentasAhorro = computed({
  //   get() {
  //     console.log('calculando lista de cuentas de ahorro', listaCuentas.value)
  //     return listaCuentas.value.filter((c) => c.tipoCuenta.id !== '3') ?? []
  //   }
  // })
  // const listaCuentasTarjeta = computed({
  //   get() {
  //     return listaCuentas.value.filter((c) => c.tipoCuenta.id === '3') ?? []
  //   }
  // })
  /**
   * methods
   */

  // function actualizarSaldoCuenta(cuenta_id, saldo) {
  //   const cuentaIndex = listaCuentas.value.findIndex((c) => c.id === cuenta_id)
  //   const cuentaModificar = listaCuentas.value[cuentaIndex]
  //   cuentaModificar.saldo = saldo
  // }

  /**
   * Manejo de errores
   */

  return {
    listaCuentas,
    fetchOrRefetch
    // loadOrRefetchListaCuentas
    // onResultListaCuentas,
    // loadOrRefetchListaCuentas
    // listaCuentasTarjeta,
    // listaCuentasAhorro,
    // loadOrRefetchListaCuentas,
    // actualizarSaldoCuenta
    // loadingListaCuentas
  }
})
