import { useLazyQuery, useMutation, useQuery } from '@vue/apollo-composable'
import { defineStore } from 'pinia'
import { SessionStorage } from 'quasar'
import {
  CUENTA_DELETE,
  CUENTA_UPDATE,
  LISTA_CUENTAS
} from 'src/graphql/cuentas'
import { ref, reactive, computed, onMounted } from 'vue'

export const useCuentaStore = defineStore('cuentaStore', () => {
  const listaCuentas = ref([])
  /**
   * composables
   */

  onMounted(() => {
    // console.log('onMounted cuenta Store')
  })
  /**
   * grapqhl
   */
  // pollInterval: 1000
  // fetchPolicy: 'cache-and-network'
  // fetchPolicy: 'network-only'
  const graphql_options = reactive({
    fetchPolicy: 'no-cache'
    // fetchPolicy: 'network-only'
  })

  const {
    onResult: onResultListaCuentas,
    onError: onErrorListaCuentas,
    // load: loadListaCuentas,
    refetch: refetchListaCuentas
    // result: resultListaCuentas,
    // loading: loadingListaCuentas
  } = useQuery(LISTA_CUENTAS, null, graphql_options)

  const {
    mutate: cuentaDelete,
    onDone: onDoneCuentaDelete,
    onError: onErrorCuentaDelete
  } = useMutation(CUENTA_DELETE)

  onResultListaCuentas(({ data }) => {
    if (!!data) {
      listaCuentas.value = JSON.parse(JSON.stringify(data.listaCuentas ?? []))
      // console.log('listaCuentas.value:', listaCuentas.value)
    }
  })

  onErrorListaCuentas((error) => {
    console.error(error)
  })

  onDoneCuentaDelete(({ data }) => {
    if (!!data) {
      const cuentaDeleted = data.cuentaDelete.cuenta
      const index = listaCuentas.value.findIndex(
        (c) => c.id === cuentaDeleted.id
      )
      listaCuentas.value.splice(index, 1)
    }
  })

  onErrorCuentaDelete((error) => {
    console.log('Error al eliminar cuenta')
    console.error(error)
  })

  // function fetchOrRefetchListaCuentas() {
  //   console.log('Refetching lista cuentas')
  //   refetchListaCuentas()
  // console.log('listaCuentas.value.length:', listaCuentas.value.length)
  // const current_user = JSON.parse(SessionStorage.getItem('current_user'))
  // console.log('current_user:', current_user)
  // if (listaCuentas.value.length <= 0) {
  //   listaCuentas.value.length = 0
  //   console.log('lista vacia...')
  //   // refetchListaCuentas()
  //   // graphql_options.fetchPolicy = 'network-only'
  //   // refetchListaCuentas({ instanceId: current_user.instance.id + 1 })
  //   variables.instanceId = 5
  // } else {
  //   // loadListaCuentas()
  // }
  // }
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
  const listaCuentasAhorro = computed({
    get() {
      // console.log('calculando lista de cuentas de ahorro', listaCuentas.value)
      return listaCuentas.value.filter((c) => c.tipoCuenta.id !== '3') ?? []
    }
  })
  const listaCuentasTarjeta = computed({
    get() {
      return listaCuentas.value.filter((c) => c.tipoCuenta.id === '3') ?? []
    }
  })
  /**
   * methods
   */
  function addItem(cuenta) {
    listaCuentas.value.push(cuenta)
  }
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
    refetchListaCuentas,
    cuentaDelete,
    onDoneCuentaDelete,
    onErrorCuentaDelete,
    // loadOrRefetchListaCuentas
    // onResultListaCuentas,
    // loadOrRefetchListaCuentas

    listaCuentasAhorro,
    listaCuentasTarjeta,
    // loadOrRefetchListaCuentas,
    // actualizarSaldoCuenta
    // loadingListaCuentas,
    addItem
  }
})
