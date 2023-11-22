<template>
  <q-card flat class="bg-main-background">
    <q-toolbar class="text-primary" fit dense>
      <div class="row items-center q-ml-sm q-gutter-x-sm">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs class="breadcrum-component">
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el
              label="Tarjetas de crédito"
              icon="credit_card"
              to="/tarjetas_credito"
            />
            <q-breadcrumbs-el
              :label="cuenta.nombre"
              icon="account_balance_wallet"
            />
          </q-breadcrumbs>
        </div>
      </div>
      <q-toolbar-title> </q-toolbar-title>
      <q-btn
        color="primary"
        icon="las la-arrow-circle-left"
        @click="router.go(-1)"
        flat
        rounded
        no-caps
        label="Regresar"
      ></q-btn>
    </q-toolbar>

    <div class="row inline fit items-center justify-between q-px-xl q-pt-md">
      <div class="row items-center q-gutter-md">
        <q-img
          :src="`/icons/${cuenta.banco?.icono ?? 'cash.png'}`"
          width="50px"
          height="50px"
        />
        <span class="cuenta__title">{{ cuenta.nombre }}</span>
      </div>
      <span class="cuenta__title text-accent">Tarjeta de crédito </span>
    </div>
  </q-card>
  <div class="main-content">
    <div class="cuenta-content">
      <q-card class="my-card" flat bordered>
        <q-card-section
          class="q-pa-xs"
          flat
          dense
          style="border: 0px solid red"
        >
          <q-toolbar class="" style="border: 0px solid green">
            <div class="row q-gutter-x-sm">
              <div class="row q-gutter-x-md q-px-md">
                <q-select
                  v-model="ejercicio_fiscal"
                  :options="ejercicioFiscalOptions"
                  option-label="nombre"
                  label="Año"
                  dense
                  outlined
                  color="secondary"
                  label-color="dark"
                  @update:model-value="onChangeEjercicio"
                >
                  <template #prepend>
                    <q-icon name="calendar_month" />
                  </template>
                </q-select>
                <MesSelect
                  v-model="mes"
                  @update:model-value="onChangeMes"
                ></MesSelect>
              </div>
              <q-separator spaced vertical inset />
              <q-btn
                color="toolbar-button"
                label="pagos"
                @click="pagosTarjeta"
                push
              />
            </div>
          </q-toolbar>
        </q-card-section>
        <q-card-actions>
          <!-- <q-btn flat color="primary" label="Share" />
          <q-btn flat color="secondary" label="Book" /> -->
          RESUMEN: &nbsp;

          <div class="row text-condensed" v-if="!expanded">
            <div class="column q-ml-lg items-center justify-center">
              <span class="tarjeta__resumen-etiqueta">Periodo:</span
              >{{ periodoInicio }} - {{ periodoFin }}
            </div>
            <div class="column q-ml-lg items-center justify-center">
              <span class="tarjeta__resumen-etiqueta"
                >Pago p/ no generar intereses):</span
              >{{ formato.toCurrency(saldo_final_periodo) }}
            </div>
            <div class="column q-ml-lg items-center justify-center">
              <span class="tarjeta__resumen-etiqueta"
                >Saldo final en tarjeta:</span
              >{{ formato.toCurrency(saldo_final_periodo) }}
            </div>
          </div>
          <q-space />

          <q-btn
            class="small-button"
            color="primary"
            icon="las la-redo-alt"
            @click="actualizarSaldosTarjeta"
            flat
          />
          <q-btn
            color="grey"
            round
            flat
            dense
            :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
            @click="expanded = !expanded"
          />
        </q-card-actions>
        <q-slide-transition>
          <div v-show="expanded">
            <q-separator />
            <q-card-section>
              <div class="row">
                <div class="col column items-center">
                  <span class="tarjeta__resumen-etiqueta"> Día de corte </span>
                  <span
                    class="tarjeta__resumen-valor"
                    style="font-size: 1rem !important; font-weight: bold"
                  >
                    {{ cuenta.dia_corte }}</span
                  >
                </div>
                <q-separator spaced vertical />
                <div class="col column items-center">
                  <span class="tarjeta__resumen-etiqueta"> Periodo </span>
                  <span class="tarjeta__resumen-valor">
                    {{ periodoInicio }} - {{ periodoFin }}</span
                  >
                </div>
                <q-separator spaced vertical />
                <div class="col column items-center">
                  <span class="tarjeta__resumen-etiqueta">
                    Importe del periodo
                  </span>
                  <span class="tarjeta__resumen-valor-importante">
                    {{ formato.toCurrency(sumaMovimientos) }}</span
                  >
                </div>
                <q-separator spaced vertical />
                <div class="col column items-center">
                  <span class="tarjeta__resumen-etiqueta">
                    Saldo del periodo anterior
                  </span>
                  <span class="tarjeta__resumen-valor">
                    {{ formato.toCurrency(saldo_anterior) }}</span
                  >
                </div>
              </div>
              <q-separator spaced horizontal />
              <div class="row">
                <div class="col column items-center">
                  <span class="tarjeta__resumen-etiqueta">
                    Saldo Final al {{ periodoFin }}
                  </span>
                  <span class="tarjeta__resumen-valor">
                    {{ formato.toCurrency(Math.abs(saldo_final_periodo)) }}
                  </span>
                </div>
                <q-separator spaced vertical />
                <div class="col column items-center">
                  <span class="tarjeta__resumen-etiqueta"> Saldo al Día </span>
                  <span class="tarjeta__resumen-valor">
                    {{ formato.toCurrency(Math.abs(cuenta.saldo)) }}
                  </span>
                </div>
              </div>
            </q-card-section>
          </div>
        </q-slide-transition>
      </q-card>

      <q-card flat>
        <q-card-section>
          <!-- <q-icon name="add_circle" class="btn-add" clickable @click="addItem">
        <q-tooltip :offset="[10, 10]"> Add New </q-tooltip>
      </q-icon> -->
          <q-table
            v-if="listaRegistrosMsi.length > 0"
            :rows="listaRegistrosMsi"
            :columns="columnsMsi"
            dense
            :rows-per-page-options="[0]"
            hide-pagination
            table-header-class="bg-primary-light text-accent text-condensed"
            separator="horizontal"
          >
            <template #top-left>
              <q-tr class="">
                <div class="column q-gutter-y-md">
                  <span class="cuenta__data-subtitle"
                    >Movimientos a meses sin intereses</span
                  >
                </div>
              </q-tr>
            </template>
            <template #top-right>
              <div class="">
                <div class="row q-gutter-x-md">
                  <q-btn
                    color="primary"
                    icon="add_circle"
                    @click="addItem"
                    flat
                    rounded
                  />
                </div>
              </div>
            </template>
            <template #body-cell-acciones="props">
              <q-td :props="props">
                <q-btn
                  class="button-edit"
                  icon="las la-edit"
                  @click="editItem(props)"
                  flat
                  dense
                />
                <q-btn
                  class="button-delete"
                  icon="la la-trash-alt"
                  @click="deleteItem(props)"
                  flat
                  dense
                />

                <!-- <div class="row">
                  <q-btn
                    color="primary"
                    icon="more_vert"
                    flat
                    dense
                    size=".6rem"
                    round
                  >
                    <q-menu style="width: 150px">
                      <q-list>
                        <q-item
                          clickable
                          v-close-popup
                          @click="editItem(props)"
                        >
                          <q-item-section>Editar...</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-close-popup
                          @click="quitarMsi(props)"
                        >
                          <q-item-section>Quitar MSI</q-item-section>
                        </q-item>
                        <q-separator />
                        <q-item
                          clickable
                          v-close-popup
                          @click="deleteItem(props)"
                        >
                          <q-item-section class="text-negative"
                            >Eliminar</q-item-section
                          >
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div> -->
              </q-td>
            </template>
            <template #bottom-row>
              <q-tr class="text-bold bg-table-summary">
                <q-td colspan="2">Total meses sin intereses:</q-td>
                <q-td align="right">{{ formato.toCurrency(suma_msi) }}</q-td>
                <q-td colspan="4"></q-td>
              </q-tr>
            </template>
          </q-table>
          <q-separator spaced inset vertical dark />
          <q-table
            :rows="listaRegistros"
            :columns="columns"
            dense
            :rows-per-page-options="[0]"
            table-header-class="bg-primary-light text-accent text-condensed"
            separator="horizontal"
            :pagination-label="obtenerMensajePaginacion"
            selection="multiple"
            v-model:selected="selectedItems"
            row-key="id"
          >
            <template #top-left>
              <q-tr class="cuenta__data-subtitle">
                <div class="table-title">Movimientos de la tarjeta</div>
              </q-tr>
            </template>

            <template #top-right>
              <div class="">
                <div class="row q-gutter-x-md">
                  <q-btn
                    v-if="selectedItems.length > 0"
                    no-caps
                    color="negative-pastel"
                    label="Eliminar"
                    @click="deleteSelectedItems"
                    push
                    flat
                    icon="las la-trash"
                    rounded
                  />
                  <q-btn
                    no-caps
                    color="primary"
                    label="Agregar"
                    @click="addItem"
                    push
                    flat
                    icon="add_circle"
                    rounded
                  />
                  <q-btn
                    color="primary-button"
                    flat
                    @click="cargarMovimientos"
                    no-caps
                    rounded
                  >
                    <q-avatar square size="24px">
                      <q-img
                        src="/icons/excel.png"
                        width="24px"
                        height="24px"
                      />
                    </q-avatar>
                    <span class="q-ml-sm">Importar</span>
                  </q-btn>
                </div>
              </div>
            </template>
            <template #body-cell-concepto="props">
              <q-td key="concepto" :props="props">
                {{ props.row.concepto }}
                <q-popup-edit
                  v-model="props.row.concepto"
                  title="Editar concepto"
                  buttons
                  label-set="Guardar"
                  label-cancel="Cancelar"
                  @save="saveConcepto(props)"
                  v-slot="scope"
                  max-width="150px"
                >
                  <!-- @before-hide="actualizarObservaciones(props)"
              -->
                  <q-input
                    v-model="scope.value"
                    @keyup.enter="scope.set"
                    type="text"
                    label="Favor de ingresar el concepto"
                    autofocus
                  />
                </q-popup-edit>
              </q-td>
            </template>
            <template #body-cell-acciones="props">
              <q-td :props="props" class="q-gutter-x-sm">
                <q-btn
                  class="button-edit"
                  icon="las la-edit"
                  @click="editItem(props)"
                  flat
                  dense
                />
                <q-btn
                  class="button-delete"
                  icon="la la-trash-alt"
                  @click="deleteItem(props)"
                  flat
                  dense
                />
                <!-- <div class="row">
                  <q-btn
                    color="primary"
                    icon="more_vert"
                    flat
                    dense
                    size=".6rem"
                    round
                  >
                    <q-menu style="width: 200px; min-width: 200px" dense>
                      <q-list dense>
                        <q-item
                          clickable
                          v-close-popup
                          @click="editItem(props)"
                        >
                          <q-item-section>Editar...</q-item-section>
                        </q-item>
                        <q-separator />
                        <q-item
                          clickable
                          v-close-popup
                          @click="deleteItem(props)"
                        >
                          <q-item-section class="text-negative"
                            >Eliminar</q-item-section
                          >
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div> -->
              </q-td>
            </template>
            <template v-slot:bottom-row>
              <q-tr class="text-bold bg-table-summary">
                <q-td colspan="3"> Totales: </q-td>
                <q-td align="right">
                  {{ formato.toCurrency(sumatoriaCargos) }}
                </q-td>
                <q-td align="right">
                  {{ formato.toCurrency(sumatoriaAbonos) }}
                </q-td>
                <q-td colspan="3"></q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
    <!-- <div class="">
      <pre> {{ listaRegistrosVariables }} </pre>
    </div> -->
  </div>

  <Teleport to="#modal">
    <q-dialog
      v-model="showForm"
      persistent
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      <FormRegistroMovimientoTarjeta
        :cuenta-id="cuenta.id"
        :registro-edited-item="registroEditedItem"
        @registro-created="registroCreated"
        @registro-updated="registroUpdated"
        :fecha="fecha_registro"
      ></FormRegistroMovimientoTarjeta>
    </q-dialog>
    <q-dialog
      v-model="showFormMSI"
      persistent
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      <RegistroMesesSinInteres
        :registro-tarjeta="editRegistroItem"
        @registroUpdated="registroMsiUpdated"
      ></RegistroMesesSinInteres>
    </q-dialog>
    <q-dialog
      v-model="showFormCarga"
      persistent
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      <ImportarRegistrosTarjeta
        :cuenta="cuenta"
        @items-saved="cargaMasivaSaved"
        :fecha_desde="fechaInicioPeriodo"
        :fecha_hasta="fechaFinPeriodo"
      ></ImportarRegistrosTarjeta>
    </q-dialog>
    <q-dialog
      v-model="showPagosTarjeta"
      persistent
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      <PagosTarjeta
        :cuenta="cuenta"
        :saldo-periodo-anterior="parseFloat(saldo_anterior)"
        :suma-movimientos="parseFloat(sumaMovimientos)"
        :fecha_inicio="fechaInicioPeriodo"
        :fecha_fin="fechaFinPeriodo"
        @items-saved="pagosRegistrados"
      ></PagosTarjeta>
    </q-dialog>
  </Teleport>
  <!-- <pre>{{ fechaInicioPeriodo }}{{ fecha_inicio }}</pre> -->
  <!-- <pre>dia corte {{ dia_corte }}</pre> -->
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DateTime } from 'luxon'
import FormRegistroMovimientoTarjeta from 'src/components/tarjetasCredito/FormRegistroMovimientoTarjeta.vue'
import { api } from 'src/boot/axios'
import { LISTA_REGISTROS_TARJETA } from 'src/graphql/registrosTarjeta'
import { useLazyQuery, useQuery } from '@vue/apollo-composable'
import { useFormato } from 'src/composables/utils/useFormato'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import RegistroMesesSinInteres from 'src/components/tarjetasCredito/RegistroMesesSinInteres.vue'
import { useQuasar } from 'quasar'
import PagosTarjeta from 'src/components/tarjetasCredito/PagosTarjeta.vue'
import MesSelect from 'src/components/formComponents/MesSelect.vue'
import ImportarRegistrosTarjeta from 'src/components/tarjetasCredito/ImportarRegistrosTarjeta.vue'
import { useRegistrosTarjetaCrud } from 'src/composables/useRegistrosTarjetaCrud'
import { useCuentasCrud } from 'src/composables/useCuentasCrud'
import { SALDO_TARJETA_CREDITO } from 'src/graphql/cuentas'

/**
 * composables
 */
const route = useRoute()
const router = useRouter()
const formato = useFormato()
const notificacion = useNotificacion()
const $q = useQuasar()
const registrosTarjetaCrud = useRegistrosTarjetaCrud()
const cuentasCrud = useCuentasCrud()

const { mostrarNotificacionPositiva, mostrarNotificacionNegativa } =
  useNotificacion()
/**
 * state
 */
// const fecha_inicio = ref('1900-01-01')
// const fecha_fin = ref('1900-01-01')
// const dia_corte = ref(0)

const listaRegistrosMsi = ref([])
const listaRegistros = ref([])

const registroEditedItem = ref([
  {
    concepto: 'mi concepto',
    fecha: '10/05/2013',
    importe: '500.20'
  }
])

const showForm = ref(false)
const showFormMSI = ref(false)
const showFormCarga = ref(false)
const showPagosTarjeta = ref(false)
const cuenta = ref({})
const ejercicio_fiscal = ref(0)
const mes = ref({})
const saldo_anterior = ref(0)
const saldo_final_periodo = ref(0)
const editRegistroItem = ref(null)

const listaRegistrosVariables = reactive({
  cuentaId: route.params.id,
  fechaInicio: '',
  fechaFin: '',
  isMsi: null,
  estadoRegistroTarjetaId: null
})

const selectedItems = ref([])
const expanded = ref(true)

/**
 * onMounted
 */
onMounted(() => {
  // console.log('buscando los datos de la tarjeta de crédito', route.params.id)

  const dateNow = DateTime.now()
  ejercicio_fiscal.value = dateNow.year
  const mes_id = dateNow.month
  const mes_value = mesOptions.value.find(
    (mesOption) => mesOption.id === mes_id
  )
  mes.value = mes_value
  // obtenerFechasInicial()
  // obtenerFechasFinal()

  api.get(`/cuentas/${route.params.id}`).then((response) => {
    cuenta.value = response?.data.data ?? {}
    //   dia_corte.value = cuenta.value.dia_corte
    obtenerFechasInicialFinal()

    loadOrRefetchListaRegistrosTarjeta()

    obtenerSaldoAnterior()
    // obtenerSaldoTarjeta()
    // obtenerSaldoTarjetaAlDia()
    // variables.fechaInicio = fecha_inicio.value
    // variables.fechaFin = fecha_fin.value
    // loadListaRegistros(
    //   null,
    //   {
    //     cuentaId: route.params.id,
    //     fechaInicio: fecha_inicio.value,
    //     fechaFin: fecha_fin.value,
    //     isMsi: null,
    //     estadoRegistroTarjetaId: null
    //   },
    //   graphqlOptions
    // )
  })
})
/**
 * graphql
 */
const graphqlOptions = reactive({
  // fetchPolicy: 'network-only'
  fetchPolicy: 'no-cache'
  // debounce: 10000
})
const {
  load: loadListaRegistrosTarjeta,
  onResult: onResultListaRegistrosTarjeta,
  onError: onErrorListaRegistros,
  refetch: refetchListaRegistros
} = useLazyQuery(
  LISTA_REGISTROS_TARJETA,
  listaRegistrosVariables,
  graphqlOptions
)

function loadOrRefetchListaRegistrosTarjeta() {
  loadListaRegistrosTarjeta() || refetchListaRegistros()
}

onResultListaRegistrosTarjeta(({ data }) => {
  if (!!data) {
    // console.log('lista de registros', data)
    listaRegistros.value = data?.listaRegistrosTarjeta.filter(
      (registro) => !registro.isMsi
    )
    // console.table(listaRegistros.value)
    listaRegistrosMsi.value = data?.listaRegistrosTarjeta.filter(
      (registro) => registro.isMsi
    )
    listaRegistrosMsi.value.forEach((registro) => {
      registro.importe = registro.importe * -1
    })

    // obtenerSaldoTarjeta()
    // obtenerSaldoTarjetaAlDia()
  }
})

onErrorListaRegistros((error) => {
  console.error('response', error)
})
/**
 * computed
 */

const sumaMovimientos = computed({
  get() {
    return Math.abs(
      listaRegistros.value.reduce((accumulator, registro) => {
        return accumulator + registro.importe * -1
      }, 0)
    )
  }
})
const sumatoriaCargos = computed({
  get() {
    return listaRegistros.value
      .filter((registro) => {
        return registro.tipoAfectacion === 'C'
      })
      .reduce((accumulator, registro) => {
        return accumulator + registro.importe * -1
      }, 0)
  }
})
const sumatoriaAbonos = computed({
  get() {
    return listaRegistros.value
      .filter((registro) => {
        return registro.tipoAfectacion === 'A'
      })
      .reduce((accumulator, registro) => {
        return accumulator + registro.importe
      }, 0)
  }
})

const suma_msi = computed({
  get() {
    return listaRegistrosMsi.value.reduce((accumulator, registro) => {
      return accumulator + registro.importe
    }, 0)
  }
})
const saldo_final = computed({
  get() {
    return parseFloat(saldo_anterior.value) + parseFloat(sumaMovimientos.value)
  }
})

const ejercicio_inicial_id = computed({
  get() {
    return mes.value.id - 1 <= 0
      ? ejercicio_fiscal.value - 1
      : ejercicio_fiscal.value
  }
})
const mes_inicial_id = computed({
  get() {
    return mes.value.id - 1 <= 0 ? 12 : mes.value.id - 1
  }
})

const ejercicio_final_id = computed({
  get() {
    return ejercicio_fiscal.value
  }
})
const dia_corte_inicial = computed({
  get() {
    return !!cuenta.value.dia_corte ? cuenta.value.dia_corte + 1 : 28
  }
})
const dia_corte_final = computed({
  get() {
    return !!cuenta.value.dia_corte ? cuenta.value.dia_corte : 28
  }
})
const mes_final_id = computed({
  get() {
    return mes.value.id
  }
})
const fechaInicioPeriodo = computed({
  get() {
    const dia_inicio = ('0' + (cuenta.value.dia_corte + 1)).slice(-2)
    return `${ejercicio_fiscal.value}-${('0' + (mes.value.id - 1)).slice(
      -2
    )}-${dia_inicio}`
  }
})
const fechaFinPeriodo = computed({
  get() {
    const dia_fin = ('0' + cuenta.value.dia_corte).slice(-2)
    return `${ejercicio_fiscal.value}-${('0' + mes.value.id).slice(
      -2
    )}-${dia_fin}`
  }
})

const fecha_registro = computed({
  get() {
    const begin_date = DateTime.fromISO(fechaInicioPeriodo.value)
    const end_date = DateTime.fromISO(fechaFinPeriodo.value)
    const today = DateTime.now()
    console.log(begin_date)
    console.log(end_date)
    return begin_date <= today && today <= end_date
      ? undefined
      : fechaFinPeriodo.value
  }
})
/**
 *
 */
const periodoInicio = computed({
  get() {
    const mes = mesOptions.value.find(
      (option) => option.id === mes_inicial_id.value
    )
    if (!!mes) {
      return `${dia_corte_inicial.value}/${mes.nombre.substring(0, 3)}/${
        ejercicio_inicial_id.value
      }`
    }
    return ''
  }
})
const periodoFin = computed({
  get() {
    const mes = mesOptions.value.find(
      (option) => option.id === mes_final_id.value
    )
    if (!!mes) {
      return `${dia_corte_final.value}/${mes.nombre.substring(0, 3)}/${
        ejercicio_final_id.value
      }`
    }
    return ''
  }
})
/**
 *
 */
const opcionesGraphql = reactive({
  fetchPolicy: 'network-only'
  // fetchPolicy: 'no-cache',
  // debounce: 1000
})

const saldoTarjetaVariables = reactive({
  cuentaId: route.params.id,
  fechaFin: null,
  isDetalle: 0
})

const {
  onResult: onResultSaldoTarjetaCredito,
  onError: onErrorSaldoTarjetaCredito
} = useQuery(SALDO_TARJETA_CREDITO, saldoTarjetaVariables, opcionesGraphql)

onResultSaldoTarjetaCredito(({ data }) => {
  console.log('resultado', data.SaldoTarjetaCredito)
  saldo_final_periodo.value = data.SaldoTarjetaCredito
})

onErrorSaldoTarjetaCredito((error) => {
  console.trace(error)
  mostrarNotificacionNegativa('Ocurrió un error al intentar obtener el saldo')
})
// const {
//   mutate: deleteRegistroTarjeta,
//   onDone: onDoneDeleteRegistroTarjeta,
//   onError: onErrorDeleteRegistroTarjeta
// } = useMutation(DELETE_REGISTRO_TARJETA)

registrosTarjetaCrud.onDoneRegistroTarjetaDelete((response) => {
  console.log('registro eliminado', response)
  loadOrRefetchListaRegistrosTarjeta()
  showSuccessMessage('eliminó')
})

registrosTarjetaCrud.onDoneRegistrosTarjetaDelete(({ data }) => {
  mostrarNotificacionPositiva('Los movimientos han sido eliminados.', 2100)
  cuenta.value.saldo = data.registrosTarjetaDelete.saldo
  loadOrRefetchListaRegistrosTarjeta()
})

registrosTarjetaCrud.onErrorRegistroTarjetaDelete((error) => {
  console.error(error)
})

function showSuccessMessage(action) {
  notificacion.mostrarNotificacionPositiva(
    `El registro se ${action} correctamente.`,
    1000
  )
}

/**
 * functions
 */
function editItem(item) {
  registroEditedItem.value = JSON.parse(JSON.stringify(item.row))
  const importe = parseFloat(registroEditedItem.value.importe)
  const importeAEditar =
    registroEditedItem.value.tipoAfectacion === 'C' ? importe * -1 : importe
  registroEditedItem.value.importe = importeAEditar.toString()
  // console.log('fecha', registroEditedItem.value.fecha)
  registroEditedItem.value.fecha = formato.convertDateFromIsoToInput(
    registroEditedItem.value.fecha
  )
  console.log('editando item...', registroEditedItem.value)
  showForm.value = true
}

function deleteSelectedItems() {
  console.table(selectedItems.value)
  if (selectedItems.value.length > 0) {
    const message = `Esta a punto de eliminar ${selectedItems.value.length} movimientos. ¿Desea continuar?`
    $q.dialog({
      title: 'Confirmar',
      style: 'width:500px',
      message,
      ok: {
        push: true,
        color: 'positive',
        label: 'Continuar'
      },
      cancel: {
        push: true,
        color: 'negative',
        flat: true,
        label: 'cancelar'
      },
      persistent: true
    })
      .onOk(() => {
        onConfirmDeleteItems(selectedItems.value)
      })
      .onCancel(() => {})
      .onDismiss(() => {})
  }
}
function onConfirmDeleteItems(toDelete) {
  console.log(toDelete)
  const eliminar = toDelete.map((item) => item.id)
  console.log('eliminando', eliminar.toString())
  registrosTarjetaCrud.registrosTarjetaDelete({ ids: eliminar.toString() })
}

function deleteItem(props_row) {
  console.log('eliminar')
  const row = props_row.row

  $q.dialog({
    title: 'Confirmar',
    style: 'width:500px',
    message: `¿Está seguro que desea eliminar el registro con un monto de ${formato.toCurrency(
      row.importe
    )}?`,
    ok: {
      push: true,
      color: 'positive',
      label: 'Continuar'
    },
    cancel: {
      push: true,
      color: 'negative',
      flat: true,
      label: 'cancelar'
    },
    persistent: true
  })
    .onOk(() => {
      registrosTarjetaCrud.registroTarjetaDelete({ id: row.id })
    })
    .onCancel(() => {})
    .onDismiss(() => {})
  // deleteRegistroTarjeta({ id: props_row.id })
}
// function obtenerFechaInicial(){

// }

function obtenerFechasInicialFinal() {
  const dia_inicio = ('0' + (cuenta.value.dia_corte + 1)).slice(-2)
  const dia_fin = ('0' + cuenta.value.dia_corte).slice(-2)
  listaRegistrosVariables.fechaInicio = `${ejercicio_fiscal.value}-${(
    '0' +
    (mes.value.id - 1)
  ).slice(-2)}-${dia_inicio}`
  listaRegistrosVariables.fechaFin = `${ejercicio_fiscal.value}-${(
    '0' + mes.value.id
  ).slice(-2)}-${dia_fin}`
}

function obtenerSaldoAnterior() {
  const dia = ('0' + cuenta.value.dia_corte).slice(-2)
  const fecha = `${ejercicio_inicial_id.value}-${(
    '0' + mes_inicial_id.value
  ).slice(-2)}-${dia}`
  api
    .get('/cuentas/obtener_saldo_tarjeta', {
      params: {
        cuenta_id: route.params.id,
        fecha
      }
    })
    .then(({ data }) => {
      // console.log('response', data.suma)
      saldo_anterior.value = data.suma
    })
    .catch((error) => {
      console.error(error)
    })
}

// function obtenerSaldoTarjeta() {
//   // console.log('fecha para obtener saldos', fechaFinPeriodo.value)
//   api
//     .get('/saldo_tarjeta_credito', {
//       params: {
//         cuenta_id: route.params.id,
//         fecha_final: fechaFinPeriodo.value,
//         is_detalle: 0
//       }
//     })
//     .then(({ data }) => {
//       let saldo_data = data.data[0].saldo || 0.0 * -1
//       let saldo = parseFloat(saldo_data) * -1
//       saldo = saldo === -0.0 ? 0.0 : saldo
//       saldo_final_periodo.value = saldo
//     })
//     .catch((error) => {
//       console.error(error)
//     })
// }
// function obtenerSaldoTarjetaAlDia() {
//   const fecha_actual = DateTime.now().toFormat('yyyy-MM-dd')
//   api
//     .get('/saldo_tarjeta_credito', {
//       params: {
//         cuenta_id: route.params.id,
//         fecha_final: fecha_actual,
//         is_detalle: 0
//       }
//     })
//     .then(({ data }) => {
//       let saldo = parseFloat(data.data[0].saldo) * -1 || 0.0
//       // console.log(saldo)
//       saldo_al_dia.value = saldo
//     })
//     .catch((error) => {
//       console.error(error)
//     })
// }

function onChangeMes(mes) {
  // console.log('Cambiando mes', mes.id)
  // obtenerListaRegistros()
  // obtenerSaldoAnterior()
  // obtenerSaldoTarjeta()
  // obtenerSaldoTarjetaAlDia()
  onChangePeriodo()
}
function onChangeEjercicio(ejercicio_fiscal) {
  // console.log('cambio de ejercicio', ejercicio_fiscal)
  // obtenerListaRegistros()
  // obtenerSaldoTarjeta()
  // obtenerSaldoTarjetaAlDia()
  onChangePeriodo()
}
function onChangePeriodo() {
  obtenerListaRegistros()
  obtenerSaldoTarjetaAlFinalPeriodo()
}

function obtenerSaldoTarjetaAlFinalPeriodo() {
  // cuentasCrud.loadSaldoTarjetaCredito(
  //   {
  //     cuentaId: route.params.id,
  //     fechaFin: fechaFinPeriodo.value,
  //     isDetalle: 0
  //   },
  //   graphqlOptions
  // )
  console.log('cambio de fecha final', fechaFinPeriodo.value)
  saldoTarjetaVariables.fechaFin = fechaFinPeriodo.value
}
/**
 * Lista de registros de la tarjeta
 */
function obtenerListaRegistros() {
  obtenerFechasInicialFinal()
  // const dia_inicio = ('0' + (cuenta.value.dia_corte + 1)).slice(-2)
  // const dia_fin = ('0' + cuenta.value.dia_corte).slice(-2)
  // const fechaInicio = `${ejercicio_inicial_id.value}-${(
  //   '0' + mes_inicial_id.value
  // ).slice(-2)}-${dia_inicio}`
  // const fechaFin = `${ejercicio_final_id.value}-${(
  //   '0' + mes_final_id.value
  // ).slice(-2)}-${dia_fin}`
  // loadListaRegistros(
  //   null,
  //   {
  //     cuentaId: route.params.id,
  //     fechaInicio,
  //     fechaFin,
  //     isMsi: null,
  //     estadoRegistroTarjetaId: null
  //   },
  //   graphqlOptions
  // )
}

function cargarMovimientos() {
  showFormCarga.value = true
}
function addItem() {
  registroEditedItem.value = null
  showForm.value = true
}

function mesesSinInteres(item) {
  showFormMSI.value = true
  editRegistroItem.value = item.row
}
function quitarMsi(item) {
  $q.dialog({
    title: 'Confirmar',
    style: 'width:500px',
    message: `¿Está seguro que desea quitar el movimiento de meses sin intereses?`,
    ok: {
      push: true,
      color: 'positive',
      label: 'Continuar'
    },
    cancel: {
      push: true,
      color: 'negative',
      flat: true,
      label: 'cancelar'
    },
    persistent: true
  })
    .onOk(() => {
      confirmQuitarMsi(item.row.id)
    })
    .onCancel(() => {})
    .onDismiss(() => {})
}
function confirmQuitarMsi(id) {
  api
    .put(`/registros_tarjeta/${id}`, {
      registro_tarjeta: {
        is_msi: false,
        numero_msi: 0
      }
    })
    .then(({ data }) => {
      // console.log('actualizado', data)
      notificacion.mostrarNotificacionInformativa(
        'El registro se eliminó de Meses Sin Intereses',
        1200
      )
      refetchListaRegistros()
    })
    .catch((error) => {
      console.error(error)
    })
}

function registroMsiUpdated() {
  showFormMSI.value = false
  // console.log('El registro fue modificado')
  refetchListaRegistros()
}
function pagosTarjeta() {
  console.log('registrando el pago')

  showPagosTarjeta.value = true
}
function registroCreated(registro) {
  notificacion.mostrarNotificacionPositiva(
    'Se ha ingresado un nuevo registro.',
    1200
  )
  refetchListaRegistros()
  showForm.value = false
}

function registroUpdated() {
  notificacion.mostrarNotificacionPositiva(
    'Se ha actualizado el registro correctamente.',
    1200
  )
  refetchListaRegistros()

  showForm.value = false
}
function cargaMasivaSaved() {
  showFormCarga.value = false
  notificacion.mostrarNotificacionPositiva(
    'Los movimientos fueron guardados correctamente.',
    900
  )
  refetchListaRegistros()
}
function pagosRegistrados() {
  showPagosTarjeta.value = false
  loadOrRefetchListaRegistrosTarjeta()
}
function obtenerMensajePaginacion(firstRowIndex, endRowIndex, totalRowsNumber) {
  return `Número de movimientos en el periodo: ${totalRowsNumber}`
}

function saveConcepto(props) {
  console.log('guardando el concepto')
  console.dir(props.row)
}

const mesOptions = ref([
  { id: 1, nombre: 'Enero' },
  { id: 2, nombre: 'Febrero' },
  { id: 3, nombre: 'Marzo' },
  { id: 4, nombre: 'Abril' },
  { id: 5, nombre: 'Mayo' },
  { id: 6, nombre: 'Junio' },
  { id: 7, nombre: 'Julio' },
  { id: 8, nombre: 'Agosto' },
  { id: 9, nombre: 'Septiembre' },
  { id: 10, nombre: 'Octubre' },
  { id: 11, nombre: 'Noviembre' },
  { id: 12, nombre: 'Diciembre' }
])
const ejercicioFiscalOptions = ref([2021, 2022, 2023])
const columns = [
  // { name: 'id', label: 'Id', field: 'id', sortable: true, align: 'left' },
  {
    name: 'fecha',
    label: 'Fecha',
    field: 'fecha',
    sortable: true,
    align: 'left',
    format: (val, row) => formato.formatoFechaFromISO(val),
    style: 'width: 10%'
  },
  {
    name: 'concepto',
    label: 'Concepto',
    field: (row) => row.concepto,
    sortable: true,
    align: 'left',
    style: 'width: 40%'
  },
  {
    name: 'cargo',
    label: 'Cargo',
    field: 'cargo',
    sortable: true,
    align: 'right',
    format: (val, row) => formato.toCurrency(val),
    style: 'width:15%'
  },
  {
    name: 'abono',
    label: 'abono',
    field: 'abono',
    sortable: true,
    align: 'right',
    format: (val, row) => formato.toCurrency(val),
    style: 'width:15%'
  },
  {
    name: 'categoria',
    label: 'Categoria',
    field: (row) => row.categoria?.nombre || 'Pago del periodo',
    sortable: true,
    align: 'left',
    style: 'width:30%'
  },
  {
    name: 'estado',
    label: 'Estado',
    field: (row) => row.estadoRegistroTarjeta?.nombre || 'Error',
    sortable: true,
    align: 'left',
    style: 'width:30%'
  },
  {
    name: 'acciones',
    field: 'action',
    sortable: false,
    align: 'center',
    headerStyle: 'max-width:60px;width:60px;min-width:60px'
    // style: 'width: 5%'
  }
]
const columnsMsi = [
  // { name: 'id', label: 'Id', field: 'id', sortable: true, align: 'left' },
  {
    name: 'fecha',
    label: 'Fecha',
    field: 'fecha',
    sortable: true,
    align: 'left',
    format: (val, row) => formato.formatoFechaFromISO(val),
    style: 'width: 10%'
  },
  {
    name: 'concepto',
    label: 'Concepto',
    field: (row) => row.concepto,
    sortable: true,
    align: 'left',
    style: 'width: 30%'
  },
  {
    name: 'importe',
    label: 'Importe',
    field: 'importe',
    sortable: true,
    align: 'right',
    format: (val, row) => formato.toCurrency(val),
    style: 'width:15%'
  },
  {
    name: 'importeMensual',
    label: 'Importe Mensual',
    field: 'importeMensual',
    sortable: true,
    align: 'right',
    format: (val, row) => formato.toCurrency(val),
    style: 'width:15%'
  },
  {
    name: 'categoria',
    label: 'Categoria',
    field: (row) => row.categoria.nombre,
    sortable: true,
    align: 'left',
    style: 'width:30%'
  },
  {
    name: 'numeroMsi',
    label: 'Número de MSI',
    field: 'numeroMsi',
    sortable: true,
    align: 'left',
    style: 'width:10%'
  },
  {
    name: 'acciones',
    field: 'action',
    sortable: false,
    align: 'center',
    style: 'width: 5%'
  }
]

function actualizarSaldosTarjeta() {}
</script>

<style lang="scss" scoped>
// .tarjeta__resumen-etiqueta {
//   letter-spacing: -0.025rem;
//   font-size: 0.75rem;
//   font-weight: 600;
//   color: #686666;
// }
// .tarjeta__resumen-valor {
//   font-size: 0.85rem;
//   font-weight: 400;
//   color: #888585;
//   &-importante {
//     font-size: 0.85rem;
//     font-weight: 600;
//     letter-spacing: -0.035rem;
//     color: #476d59 !important;
//   }
// }
.cuenta__data-subtitle {
  letter-spacing: -0.045rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #7b6992;
}
</style>
