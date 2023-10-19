<template>
  <q-card flat>
    <q-toolbar class="bg-grey-1 text-primary" fit dense>
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
        icon="fa-solid fa-circle-left"
        @click="router.go(-1)"
        flat
        rounded
        no-caps
        label="Regresar"
      ></q-btn>
    </q-toolbar>
    <div class="q-pl-xl q-pt-lg q-gutter-sm row inline items-center">
      <q-img
        :src="`/icons/${cuenta.banco?.icono ?? 'cash.png'}`"
        width="50px"
        height="50px"
      />
      <div class="row cuenta__title inline">Tarjeta {{ cuenta.nombre }}</div>
    </div>
  </q-card>
  <div class="main-content">
    <div class="cuenta-content">
      <q-toolbar>
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
      <q-card flat>
        <q-card-section>
          <div class="row">
            <div class="col column items-center">
              <span class="tarjeta__resumen-etiqueta"> Día de corte </span>
              <span class="tarjeta__resumen-valor">
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
            <div
              class="col column items-center"
              v-if="listaRegistrosMsi.length > 0"
            >
              <span class="tarjeta__resumen-etiqueta">
                Suma de movimientos de meses sin intereses
              </span>
              <span class="tarjeta__resumen-valor">
                {{ formato.toCurrency(suma_msi) }}</span
              >
            </div>
            <q-separator
              spaced
              inset
              vertical
              v-if="listaRegistrosMsi.length > 0"
            />

            <div class="col column items-center">
              <span class="tarjeta__resumen-etiqueta"> Saldo Final </span>
              <span class="tarjeta__resumen-valor">
                {{ formato.toCurrency(saldo_final) }}
              </span>
            </div>
            <q-separator spaced vertical />
            <div class="col column items-center">
              <span class="tarjeta__resumen-etiqueta"> Saldo Total </span>
              <span class="tarjeta__resumen-valor">
                {{ formato.toCurrency(saldo_total) }}
              </span>
            </div>
          </div>
        </q-card-section>
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
            table-header-class="bg-accent text-dark"
            separator="horizontal"
            hide-bottom
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
                    color="primary-button"
                    label="Agregar"
                    @click="addItem"
                    push
                  />
                  <q-btn
                    color="primary-button"
                    flat
                    @click="cargarMovimientos"
                    no-caps
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
            <template #body-cell-acciones="props">
              <q-td :props="props">
                <div class="row">
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
                </div>
              </q-td>
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
            hide-bottom
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
            <template #body-cell-acciones="props">
              <q-td :props="props">
                <div class="row">
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
                        <q-item
                          clickable
                          v-close-popup
                          @click="mesesSinInteres(props)"
                        >
                          <q-item-section>Meses Sin Intereses</q-item-section>
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
                </div>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </div>

  <Teleport to="#modal">
    <q-dialog v-model="showForm" persistent>
      <RegistroMovimientoTarjeta
        :cuenta-id="cuenta.id"
        :registro-edited-item="registroEditedItem"
        @registro-created="registroCreated"
        @registro-updated="registroUpdated"
      ></RegistroMovimientoTarjeta>
    </q-dialog>
  </Teleport>
  <Teleport to="#modal">
    <q-dialog v-model="showFormMSI" persistent>
      <RegistroMesesSinInteres
        :registro-tarjeta="editRegistroItem"
        @registroUpdated="registroMsiUpdated"
      ></RegistroMesesSinInteres>
    </q-dialog>
  </Teleport>
  <Teleport to="#modal">
    <q-dialog v-model="showFormCarga" persistent>
      <CargaRegistrosTarjeta
        :cuenta="cuenta"
        @items-saved="cargaMasivaSaved"
      ></CargaRegistrosTarjeta>
    </q-dialog>
  </Teleport>
  <Teleport to="#modal">
    <q-dialog v-model="showPagosTarjeta" persistent>
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
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DateTime } from 'luxon'
import RegistroMovimientoTarjeta from 'src/components/tarjetasCredito/RegistroMovimientoTarjeta.vue'
import { api } from 'src/boot/axios'
import {
  LISTA_REGISTROS_TARJETA,
  DELETE_REGISTRO_TARJETA
} from 'src/graphql/registrosTarjeta'
import CargaRegistrosTarjeta from 'src/components/tarjetasCredito/CargaRegistrosTarjeta.vue'
import { useLazyQuery, useMutation } from '@vue/apollo-composable'
import { useFormato } from 'src/composables/utils/useFormato'
import { useRegistrosCrud } from 'src/composables/useRegistrosCrud'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import RegistroMesesSinInteres from 'src/components/tarjetasCredito/RegistroMesesSinInteres.vue'
import { useQuasar } from 'quasar'
import PagosTarjeta from 'src/components/tarjetasCredito/PagosTarjeta.vue'
import MesSelect from 'src/components/formComponents/MesSelect.vue'

const route = useRoute()
const router = useRouter()
const formato = useFormato()
const notificacion = useNotificacion()
const registroCrud = useRegistrosCrud()
const $q = useQuasar()

/**
 * state
 */
const fecha_inicio = ref('1900-01-01')
const fecha_fin = ref('1900-01-01')
const dia_corte = ref(0)

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
const editRegistroItem = ref(null)

const graphql_options = ref({
  fetchPolicy: 'network-only'
})

// const variables = reactive({
//   cuentaId: route.params.id,
//   fechaInicio: '',
//   fechaFin: ''
// })
/**
 * onMounted
 */
onMounted(() => {
  console.log('buscando los datos de la tarjeta de crédito', route.params.id)
  const dateNow = DateTime.now()
  ejercicio_fiscal.value = dateNow.year
  const mes_id = dateNow.month
  const mes_value = mesOptions.value.find(
    (mesOption) => mesOption.id === mes_id
  )
  mes.value = mes_value

  api.get(`/cuentas/${route.params.id}`).then((response) => {
    cuenta.value = response?.data.data ?? {}
    console.log('cuenta', cuenta.value)
    dia_corte.value = cuenta.value.dia_corte
    obtenerSaldoAnterior()
    obtener_fecha_inicio()
    obtener_fecha_fin()
    // variables.fechaInicio = fecha_inicio.value
    // variables.fechaFin = fecha_fin.value
    loadListaRegistros(
      null,
      {
        cuentaId: route.params.id,
        fechaInicio: fecha_inicio.value,
        fechaFin: fecha_fin.value,
        isMsi: null,
        estadoRegistroTarjetaId: null
      },
      graphqlOptions
    )
  })
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
const saldo_total = computed({
  get() {
    return 0
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
 * graphql
 */
const graphqlOptions = reactive({
  // fetchPolicy: 'network-only'
  fetchPolicy: 'no-cache'
})
const {
  onError: onErrorListaRegistros,
  onResult: onResultListaRegistros,
  load: loadListaRegistros,
  refetch: refetchListaRegistros
} = useLazyQuery(LISTA_REGISTROS_TARJETA)

onResultListaRegistros(({ data }) => {
  console.log('lista de registros', data)
  listaRegistros.value = data?.listaRegistrosTarjeta.filter(
    (registro) => !registro.isMsi
  )
  listaRegistrosMsi.value = data?.listaRegistrosTarjeta.filter(
    (registro) => registro.isMsi
  )
})
onErrorListaRegistros((error) => {
  console.error('response', error)
})

const {
  mutate: deleteRegistroTarjeta,
  onDone: onDoneDeleteRegistroTarjeta,
  onError: onErrorDeleteRegistroTarjeta
} = useMutation(DELETE_REGISTRO_TARJETA)

onDoneDeleteRegistroTarjeta((response) => {
  console.log('registro eliminado', response)
  loadOrRefetchListaRegistrosTarjeta()
  showSuccessMessage('eliminó')
})
onErrorDeleteRegistroTarjeta((error) => {
  console.error(error)
})
function showSuccessMessage(action) {
  notificacion.mostrarNotificacionPositiva(
    `El registro se ${action} correctamente.`,
    1000
  )
}
function loadOrRefetchListaRegistrosTarjeta() {
  loadListaRegistros() || refetchListaRegistros()
}
/**
 * functions
 */
function editItem(item) {
  console.log('editando item...', item.rowIndex, item.row)
  registroEditedItem.value = JSON.parse(JSON.stringify(item.row))
  const importe = parseFloat(registroEditedItem.value.importe)
  const importeAEditar =
    registroEditedItem.value.tipoAfectacion === 'A' ? importe * -1 : importe
  registroEditedItem.value.importe = importeAEditar.toString()
  console.log('fecha', registroEditedItem.value.fecha)
  registroEditedItem.value.fecha = formato.convertDateFromIsoToInput(
    registroEditedItem.value.fecha
  )
  showForm.value = true
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
      deleteRegistroTarjeta({ id: row.id })
    })
    .onCancel(() => {})
    .onDismiss(() => {})
  // deleteRegistroTarjeta({ id: props_row.id })
}

function obtener_fecha_inicio() {
  const dia_inicio = ('0' + (cuenta.value.dia_corte + 1)).slice(-2)
  fecha_inicio.value = `${ejercicio_fiscal.value}-${(
    '0' +
    (mes.value.id - 1)
  ).slice(-2)}-${dia_inicio}`
  console.log('fecha_inicio', fecha_inicio.value)
}
function obtener_fecha_fin() {
  const dia_fin = ('0' + cuenta.value.dia_corte).slice(-2)
  fecha_fin.value = `${ejercicio_fiscal.value}-${('0' + mes.value.id).slice(
    -2
  )}-${dia_fin}`
}

function obtenerSaldoAnterior() {
  const dia = ('0' + cuenta.value.dia_corte).slice(-2)
  const fecha = `${ejercicio_inicial_id.value}-${(
    '0' + mes_inicial_id.value
  ).slice(-2)}-${dia}`
  console.log('fecha para obtener saldos', fecha)
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
function onChangeMes(mes) {
  console.log('Cambiando mes', mes.id)
  obtenerListaRegistros()
  obtenerSaldoAnterior()
}
function onChangeEjercicio(ejercicio_fiscal) {
  console.log('cambio de ejercicio', ejercicio_fiscal)
  obtenerListaRegistros()
}
/**
 * Lista de registros de la tarjeta
 */
function obtenerListaRegistros() {
  const dia_inicio = ('0' + (cuenta.value.dia_corte + 1)).slice(-2)
  const dia_fin = ('0' + cuenta.value.dia_corte).slice(-2)
  const fechaInicio = `${ejercicio_inicial_id.value}-${(
    '0' + mes_inicial_id.value
  ).slice(-2)}-${dia_inicio}`
  const fechaFin = `${ejercicio_final_id.value}-${(
    '0' + mes_final_id.value
  ).slice(-2)}-${dia_fin}`
  console.log('fechaInicio', fechaInicio)
  console.log('fechaFin', fechaFin)
  loadListaRegistros(
    null,
    {
      cuentaId: route.params.id,
      fechaInicio,
      fechaFin,
      isMsi: null,
      estadoRegistroTarjetaId: null
    },
    graphqlOptions
  )
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
      console.log('actualizado', data)
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
  console.log('El registro fue modificado')
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
    style: 'width: 5%'
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
</script>

<style lang="scss" scoped>
.tarjeta__resumen-etiqueta {
  letter-spacing: -0.025rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #686666;
}
.tarjeta__resumen-valor {
  font-size: 0.85rem;
  font-weight: 400;
  color: #888585;
  &-importante {
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: -0.035rem;
    color: #476d59 !important;
  }
}
.cuenta__data-subtitle {
  letter-spacing: -0.045rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #7b6992;
}
</style>
