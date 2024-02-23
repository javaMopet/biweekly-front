<template>
  <q-card flat class="bg-main-background">
    <q-toolbar class="text-primary" fit dense>
      <div class="row items-center q-ml-sm q-gutter-x-sm">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs class="breadcrum-component">
            <q-breadcrumbs-el icon="home" label="Home" to="/" />
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
          class="shadow-icon"
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
              <PeriodoSelect
                v-model:year="ejercicio_fiscal"
                v-model:month="mes"
                @onChangePeriodo="onChangePeriodo"
              ></PeriodoSelect>
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
        <q-card-actions class="resumen bg-white">
          <q-item-label
            v-if="expanded"
            class="q-pr-md text-primary text-subtitle1 text-bold"
          >
            RESUMEN: &nbsp;
          </q-item-label>
          <!-- -->
          <div class="row text-condensed" v-if="!expanded">
            <div class="column items-center justify-center">
              <span class="tarjeta__resumen-etiqueta">Día de corte:</span
              ><span class="resumen__valor"> {{ cuenta.dia_corte }}</span>
            </div>
            <q-separator spaced vertical />
            <div class="column items-center justify-center">
              <span class="tarjeta__resumen-etiqueta">Periodo:</span
              ><span class="resumen__valor"
                >{{ periodoInicio }} - {{ periodoFin }}</span
              >
            </div>
            <q-separator spaced vertical />
            <div class="column items-center justify-center">
              <span class="tarjeta__resumen-etiqueta"
                >Pago para no generar intereses:</span
              ><span class="resumen__valor">{{
                formato.toCurrency(
                  saldo_pagar_periodo === 0 ? 0 : saldo_pagar_periodo * -1
                )
              }}</span>
            </div>
            <q-separator spaced vertical />
            <div class="column items-center justify-center">
              <span class="tarjeta__resumen-etiqueta"
                >Fecha límite de pago:</span
              ><span class="resumen__valor">{{
                fecha_limite_pago.toFormat('dd/MM/yyyy')
              }}</span>
            </div>
            <q-separator spaced vertical />
            <div class="column items-center justify-center">
              <span class="tarjeta__resumen-etiqueta"
                >Saldo del periodo anterior:</span
              ><span class="resumen__valor">{{
                formato.toCurrency(
                  saldo_final_perido_anterior === 0
                    ? 0
                    : saldo_final_perido_anterior * -1
                )
              }}</span>
            </div>
            <q-separator spaced vertical />
            <div class="column items-center justify-center">
              <span class="tarjeta__resumen-etiqueta">Saldo en tarjeta:</span
              ><span class="resumen__valor">{{
                toCurrencyAbsoluteFormat(cuenta.saldo)
              }}</span>
              <!-- <pre>{{ cuenta.saldo }}</pre> -->
            </div>
          </div>
          <q-space />

          <q-btn
            class="small-button"
            color="primary"
            icon="las la-redo-alt"
            @click="actualizarSaldosResumen"
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
            <q-card-section class="row tarjeta-resumen">
              <div class="col tarjeta-resumen__left q-gutter-y-xs">
                <div class="row">
                  <div class="col column items-center">
                    <span class="tarjeta-resumen__etiqueta">
                      DÍA DE CORTE
                    </span>
                    <span class="tarjeta-resumen__valor">
                      {{ cuenta.dia_corte }}</span
                    >
                  </div>
                </div>
                <div class="">
                  <q-separator spaced vertical />
                  <div class="col column items-center">
                    <span class="tarjeta-resumen__etiqueta">
                      PERIODO DE FACTURACIÓN
                    </span>
                    <span class="tarjeta-resumen__valor">
                      {{ periodoInicio }} - {{ periodoFin }}</span
                    >
                  </div>
                </div>
                <div class="row">
                  <div class="col column items-center">
                    <span class="tarjeta-resumen__etiqueta">
                      PAGO PARA NO GENERAR INTERESES
                    </span>
                    <span class="tarjeta-resumen__valor--importante">
                      {{
                        formato.toCurrency(Math.abs(saldo_pagar_periodo))
                      }}</span
                    >
                  </div>
                </div>
                <div class="row">
                  <div class="col column items-center">
                    <span class="tarjeta-resumen__etiqueta">
                      FECHA LIMITE DE PAGO
                    </span>
                    <span class="tarjeta-resumen__valor--importante">
                      {{ fecha_limite_pago.toFormat('dd/MM/yyyy') }}</span
                    >
                  </div>
                </div>
              </div>
              <div class="col tarjeta-resumen__right q-gutter-y-xs">
                <div class="row">
                  <div class="col column items-center">
                    <span class="tarjeta-resumen__etiqueta"
                      >SALDO EN TARJETA ANTERIOR
                    </span>
                    <span class="tarjeta-resumen__valor">
                      {{
                        formato.toCurrency(
                          saldo_final_perido_anterior === 0
                            ? 0
                            : saldo_final_perido_anterior * -1
                        )
                      }}</span
                    >
                  </div>
                </div>
                <div class="row">
                  <div class="col column items-center">
                    <span class="tarjeta-resumen__etiqueta">
                      COMPRAS Y OTROS CARGOS
                    </span>
                    <span class="tarjeta-resumen__valor">
                      {{ formato.toCurrency(sumaMovimientos + suma_msi) }}</span
                    >
                  </div>
                </div>
                <div class="row">
                  <div class="col column items-center">
                    <span class="tarjeta-resumen__etiqueta">
                      SALDO EN TARJETA AL PERIODO
                    </span>
                    <span class="tarjeta-resumen__valor">
                      {{ formato.toCurrency(Math.abs(saldo_final_periodo)) }}
                    </span>
                  </div>
                </div>
                <div class="row">
                  <div class="col column items-center">
                    <span class="tarjeta-resumen__etiqueta">
                      SALDO EN TARJETA
                    </span>
                    <span class="tarjeta-resumen__valor--importante">
                      {{
                        formato.toCurrency(
                          cuenta.saldo === 0 ? 0 : cuenta.saldo * -1
                        )
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </q-card-section>
          </div>
        </q-slide-transition>
      </q-card>
      <q-card flat>
        <q-card-section>
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
              </q-td>
            </template>
            <template #bottom-row>
              <q-tr class="text-bold bg-table-summary">
                <q-td colspan="2">Total meses sin intereses:</q-td>
                <q-td align="right">{{
                  formato.toCurrencyAbsoluteFormat(suma_msi)
                }}</q-td>
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
                    :disable="selectedItems.length <= 0"
                    class="medium-button"
                    no-caps
                    color="negative-pastel"
                    label="Eliminar"
                    @click="deleteSelectedItems"
                    push
                    icon="las la-trash"
                    rounded
                  />
                  <q-btn
                    no-caps
                    class="medium-button"
                    color="primary-button"
                    label="Agregar"
                    @click="addItem"
                    push
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
                <!-- <q-btn
                  class="button-delete"
                  icon="la la-trash-alt"
                  @click="deleteItem(props)"
                  flat
                  dense
                /> -->
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
  <pre>{{ fechaInicioPeriodo }}</pre>
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
import { useQuasar } from 'quasar'
import PagosTarjeta from 'src/components/tarjetasCredito/PagosTarjeta.vue'
import MesSelect from 'src/components/formComponents/MesSelect.vue'
import ImportarRegistrosTarjeta from 'src/components/tarjetasCredito/ImportarRegistrosTarjeta.vue'
import { useRegistrosTarjetaCrud } from 'src/composables/useRegistrosTarjetaCrud'
import { useCuentasCrud } from 'src/composables/useCuentasCrud'
import {
  SALDO_TARJETA_CREDITO,
  SALDO_PAGAR_TARJETA_CREDITO
} from 'src/graphql/cuentas'
import PeriodoSelect from 'src/components/formComponents/PeriodoSelect.vue'

/**
 * composables
 */
const route = useRoute()
const router = useRouter()
const formato = useFormato()
const notificacion = useNotificacion()
const $q = useQuasar()
const cuentaCrud = useCuentasCrud()
const registrosTarjetaCrud = useRegistrosTarjetaCrud()

const { mostrarNotificacionPositiva, mostrarNotificacionNegativa } =
  useNotificacion()

const { toCurrencyAbsoluteFormat } = useFormato()

/**
 * state
 */
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
const saldo_pagar_periodo = ref(0)
const saldo_anterior = ref(0)
const saldo_final_periodo = ref(0)
const saldo_final_perido_anterior = ref(0)

const listaRegistrosVariables = reactive({
  cuentaId: route.params.id,
  fechaInicio: '',
  fechaFin: '',
  isMsi: null,
  estadoRegistroTarjetaId: null
})

const selectedItems = ref([])
const expanded = ref(false)

/**
 * onMounted
 */
onMounted(() => {
  const dateNow = DateTime.now()
  ejercicio_fiscal.value = dateNow.year
  const mes_id = dateNow.month
  const mes_value = mesOptions.value.find(
    (mesOption) => mesOption.id === mes_id
  )
  mes.value = mes_value

  api.get(`/cuentas/${route.params.id}`).then((response) => {
    cuenta.value = response?.data.data ?? {}

    obtenerFechasInicialFinal()
    loadOrRefetchListaRegistrosTarjeta()
    loadOrRefetchSaldoAnteriorTC()
  })
})
/**
 * graphql
 */
const graphqlOptions = reactive({
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
    listaRegistros.value = data?.listaRegistrosTarjeta.filter(
      (registro) => !registro.isMsi
    )
    listaRegistrosMsi.value = data?.listaRegistrosTarjeta.filter(
      (registro) => registro.isMsi
    )
    console.table(listaRegistrosMsi.value)
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
    let mesInicio = 0
    let anioInicio = 0

    if (mes.value.id - 1 <= 0) {
      mesInicio = 12
      anioInicio = ejercicio_fiscal.value - 1
    } else {
      mesInicio = mes.value.id
      anioInicio = ejercicio_fiscal.value
    }

    const dia_inicio = ('0' + (cuenta.value.dia_corte + 1)).slice(-2)
    return `${anioInicio}-${('0' + mesInicio).slice(-2)}-${dia_inicio}`
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

const fecha_limite_pago = computed({
  get() {
    console.log(cuenta.value.dias_gracia)
    const fecha = DateTime.fromISO(fechaFinPeriodo.value).plus({
      days: cuenta.value.dias_gracia
    })
    return fecha
  }
})

/**
 * graphql
 */
const opcionesGraphql = reactive({
  fetchPolicy: 'network-only'
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
  console.log('resultado', data.saldoTarjetaCredito)
  saldo_final_periodo.value = data.saldoTarjetaCredito
})

onErrorSaldoTarjetaCredito((error) => {
  console.trace(error)
  mostrarNotificacionNegativa('Ocurrió un error al intentar obtener el saldo')
})

const {
  load: loadSaldoAnteriorTC,
  onResult: onResultSaldoAnteriorTC,
  onError: onErrorSaldoAnteriorTC
} = useLazyQuery(SALDO_TARJETA_CREDITO)

function loadOrRefetchSaldoAnteriorTC() {
  const variables = {
    cuentaId: route.params.id,
    fechaFin: DateTime.fromISO(listaRegistrosVariables.fechaInicio)
      .plus({ days: -1 })
      .toISODate(),
    isDetalle: 0
  }
  loadSaldoAnteriorTC(null, variables, opcionesGraphql) /* ||
    refetchSaldoAnteriorTC(null, variables, opcionesGraphql )*/
}

onResultSaldoAnteriorTC(({ data }) => {
  console.log('resultado saldo anterior', data)
  saldo_final_perido_anterior.value = data.saldoTarjetaCredito
})

onErrorSaldoAnteriorTC((error) => {
  console.trace(error)
  mostrarNotificacionNegativa(
    'Ocurrió un error al intentar obtener el saldo anterior'
  )
})

const saldoPagarTarjetaVariables = reactive({
  cuentaId: route.params.id,
  fechaFin: null,
  isDetalle: 0
})

const {
  onResult: onResultSaldoPagarTarjetaCredito,
  onError: onErrorSaldoPagarTarjetaCredito,
  refetch: refetchSaldoPagarTarjetaCredito
} = useQuery(
  SALDO_PAGAR_TARJETA_CREDITO,
  saldoPagarTarjetaVariables,
  opcionesGraphql
)

onResultSaldoPagarTarjetaCredito(({ data }) => {
  console.log('resultado saldo pagar', data.saldoPagarTarjetaCredito)
  saldo_pagar_periodo.value = data.saldoPagarTarjetaCredito
})

onErrorSaldoPagarTarjetaCredito((error) => {
  console.trace(error)
  mostrarNotificacionNegativa('Ocurrió un error al intentar obtener el saldo')
})

registrosTarjetaCrud.onDoneRegistroTarjetaDelete((response) => {
  console.log('registro eliminado', response)
  loadOrRefetchListaRegistrosTarjeta()
  refetchSaldoPagarTarjetaCredito()
  showSuccessMessage('eliminó')
})

registrosTarjetaCrud.onDoneRegistrosTarjetaDelete(({ data }) => {
  mostrarNotificacionPositiva('Los movimientos han sido eliminados.', 2100)
  cuenta.value.saldo = data.registrosTarjetaDelete.saldo
  loadOrRefetchListaRegistrosTarjeta()
  refetchSaldoPagarTarjetaCredito()
})

registrosTarjetaCrud.onErrorRegistroTarjetaDelete((error) => {
  console.error(error)
})

/**
 * functions
 */
function showSuccessMessage(action) {
  notificacion.mostrarNotificacionPositiva(
    `El registro se ${action} correctamente.`,
    1000
  )
}

function editItem(item) {
  registroEditedItem.value = JSON.parse(JSON.stringify(item.row))
  const importe = parseFloat(registroEditedItem.value.importe)
  const importeAEditar =
    registroEditedItem.value.tipoAfectacion === 'C' ? importe * -1 : importe
  registroEditedItem.value.importe = importeAEditar.toString()
  registroEditedItem.value.fecha = formato.convertDateFromIsoToInput(
    registroEditedItem.value.fecha
  )
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
    message: `¿Está seguro que desea eliminar el registro con un monto de ${formato.toCurrencyAbsoluteFormat(
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
}

function obtenerFechasInicialFinal() {
  let mesInicio = mes.value.id - 1
  let ejercicioFiscal = ejercicio_fiscal.value
  if (!mesInicio) {
    mesInicio = 12
    ejercicioFiscal = ejercicio_fiscal.value - 1
  }
  const dia_inicio = ('0' + (cuenta.value.dia_corte + 1)).slice(-2)
  const dia_fin = ('0' + cuenta.value.dia_corte).slice(-2)
  listaRegistrosVariables.fechaInicio = `${ejercicioFiscal}-${(
    '0' + mesInicio
  ).slice(-2)}-${dia_inicio}`
  console.log('fechaInicio', listaRegistrosVariables.fechaInicio)
  listaRegistrosVariables.fechaFin = `${ejercicio_fiscal.value}-${(
    '0' + mes.value.id
  ).slice(-2)}-${dia_fin}`
  console.log('fechaFin', listaRegistrosVariables.fechaFin)
}

function onChangePeriodo() {
  obtenerListaRegistros()
  obtenerSaldoTarjetaAlFinalPeriodo()
  loadOrRefetchSaldoAnteriorTC()
}

function obtenerSaldoTarjetaAlFinalPeriodo() {
  saldoTarjetaVariables.fechaFin = fechaFinPeriodo.value
  saldoPagarTarjetaVariables.fechaFin = fechaFinPeriodo.value
}
/**
 * Lista de registros de la tarjeta
 */
function obtenerListaRegistros() {
  obtenerFechasInicialFinal()
}

function cargarMovimientos() {
  showFormCarga.value = true
}
function addItem() {
  registroEditedItem.value = null
  showForm.value = true
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
  refetchSaldoPagarTarjetaCredito()
  showForm.value = false
}

function registroUpdated() {
  notificacion.mostrarNotificacionPositiva(
    'Se ha actualizado el registro correctamente.',
    1200
  )
  refetchListaRegistros()
  refetchSaldoPagarTarjetaCredito()
  showForm.value = false
}
function cargaMasivaSaved(cuenta_id) {
  showFormCarga.value = false
  cuentaCrud.cuentaSaldoUpdate({ cuentaId: cuenta_id })
  notificacion.mostrarNotificacionPositiva(
    'Los movimientos fueron guardados correctamente.',
    900
  )
  refetchSaldoPagarTarjetaCredito()
  refetchListaRegistros()
}
cuentaCrud.onDoneCuentaSaldoUpdate(({ data }) => {
  cuenta.value.saldo = data.cuentaSaldoUpdate.cuenta.saldo
})
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
    label: 'Importe Total',
    field: 'importe',
    sortable: true,
    align: 'right',
    format: (val, row) => formato.toCurrencyAbsoluteFormat(val),
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

function actualizarSaldosResumen() {
  console.log('actualizar saldo resumen')
}
</script>

<style lang="scss" scoped>
.cuenta__data-subtitle {
  letter-spacing: -0.045rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #7b6992;
}

/* ************************************ */
.resumen {
  color: $primary;
  font-size: 0.8rem;
  font-weight: 300;
  // border: 1px solid green;
  &__etiqueta {
    letter-spacing: -0.025rem;
    font-size: 0.65rem;
    font-weight: 600;
    color: #60665c;
  }
  &__valor {
    // font-family: 'Roboto Slab', sans-serif;
    font-weight: 500;
    color: $input-label;
  }
}
.tarjeta-resumen {
  // border: 0px solid rgb(0, 68, 255);
  // background-color: rgb(230, 250, 230);
  background: white;
  // background-color: rgb(248, 248, 247);
  border-top: 1px solid #d3d6d1;
  &__left {
  }
  &__right {
  }

  &__etiqueta {
    letter-spacing: -0.025rem;
    font-size: 0.65rem;
    font-weight: 700;
    color: $dark;
  }

  &__valor {
    font-family: 'Roboto Slab', monospace;
    font-size: 0.8rem;
    font-weight: 400;
    letter-spacing: 0.0025rem;
    color: $input-label;

    &--importante {
      font-size: 0.9rem;
      font-weight: 500;
      color: $accent !important;
    }
  }
}
</style>
