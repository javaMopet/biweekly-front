<template>
  <q-card flat class="bg-main-background">
    <q-toolbar class="text-primary" fit dense>
      <div class="row items-center q-ml-sm q-gutter-x-sm">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs
            class="breadcrum-component"
            active-color="primary"
            separator=">"
            separator-color="primary"
          >
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el
              label="Cuentas"
              icon="account_balance"
              to="/cuentas"
            />
            <q-breadcrumbs-el
              v-if="!!cuenta"
              :label="cuenta.nombre"
              icon="account_balance_wallet"
            />
          </q-breadcrumbs>
        </div>
      </div>
      <q-toolbar-title> </q-toolbar-title>
      <!-- icon="las la-arrow-alt-circle-left" -->
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
          v-if="!!cuenta"
          :src="`/icons/${cuenta.banco?.icono ?? 'cash.png'}`"
          width="50px"
          height="50px"
        />
        <span v-if="!!cuenta" class="cuenta__title">{{ cuenta.nombre }}</span>
      </div>
      <span class="cuenta__title text-accent">Cuenta</span>
    </div>
  </q-card>
  <div class="main-content">
    <div class="cuenta-content">
      <q-card class="my-card" flat bordered>
        <q-toolbar class="">
          <q-toolbar-title>
            <PeriodoSelect
              v-model:year="ejercicio_fiscal"
              v-model:month="mes"
              @onChangePeriodo="onChangePeriodo"
              :disable="loadingRegistros"
            ></PeriodoSelect>
          </q-toolbar-title>
        </q-toolbar>
        <q-card-actions
          class="row bg-white full-width text-accent text-subtitle2 resumen"
          bordered
          style="border: 0px solid red"
        >
          <q-item-label class="q-pr-md"> RESUMEN: &nbsp; </q-item-label>
          <div class="col column items-center">
            <span class="resumen__etiqueta"> Periodo </span>
            <span class="resumen__valor">
              {{ periodoInicioStr }} - {{ periodoFinStr }}</span
            >
          </div>
          <q-separator spaced inset vertical />
          <div class="col column items-center">
            <span class="resumen__etiqueta"> Saldo del periodo anterior</span>
            <span class="resumen__valor">
              {{ formato.toCurrency(saldo_periodo_anterior) }}
            </span>
          </div>
          <q-separator spaced inset vertical />
          <div class="col column items-center">
            <span class="resumen__etiqueta"> Balance del periodo</span>
            <span class="resumen__valor">
              {{ formato.toCurrency(sumaMovimientos) }}
            </span>
          </div>
          <q-separator spaced inset vertical />
          <div class="col column items-center">
            <span class="resumen__etiqueta"> Saldo al final del periodo</span>
            <span class="resumen__valor">
              {{ formato.toCurrency(saldoFinalPeriodo) }}
            </span>
          </div>
          <div class="col column items-center">
            <span class="resumen__etiqueta"> Saldo al día</span>
            <div class="q-gutter-x-sm">
              <span
                v-if="!!cuenta"
                class="resumen__valor"
                style="font-weight: bold !important"
              >
                {{ formato.toCurrency(cuenta.saldo) }}
              </span>
              <q-btn
                class="small-button"
                color="primary"
                icon="las la-redo-alt"
                @click="actualizarSaldoFinal"
                flat
              />
            </div>
          </div>
        </q-card-actions>
      </q-card>
      <div class="sticky-table-container">
        <q-table
          class="q-mt-lg my-sticky-header-table"
          ref="tableRef"
          :rows="listaRegistros"
          :columns="columns"
          dense
          :rows-per-page-options="[0]"
          table-header-class="bg-primary-light text-accent"
          separator="vertical"
          hide-pagination
          selection="multiple"
          :selected="selected"
          :selected-rows-label="getSelectedString"
          row-key="id"
          :filter="filter"
          no-data-label="No se han registrado movimientos"
          :loading="loadingRegistros"
          @selection="onSelection"
        >
          <!-- v-model:selected="selectedItems" -->
          <template v-slot:header-selection="scope">
            <q-checkbox v-model="scope.selected" dense />
          </template>

          <template v-slot:body-selection="scope">
            <q-checkbox
              v-model="scope.selected"
              :disable="scope.row.disable"
              dense
            />
          </template>
          <template #top-left>
            <q-tr class="cuenta__data-subtitle">
              <span>Movimientos del periodo</span>
            </q-tr>
          </template>
          <template #top-right>
            <q-tr>
              <div class="row q-gutter-x-sm">
                <div class="" v-if="isModificable">
                  <q-btn
                    class="medium-button"
                    color="negative-pastel"
                    :disable="selected.length <= 0"
                    no-caps
                    label="Eliminar"
                    @click="deleteSelectedItems"
                    icon="las la-trash"
                    rounded
                    push
                  />
                  <q-btn
                    class="medium-button"
                    color="primary-button"
                    no-caps
                    label="Nuevo"
                    @click="addItem"
                    icon="add_circle"
                    rounded
                    push
                  />
                  <q-btn
                    color="primary-button"
                    @click="importarMovimientos"
                    no-caps
                    rounded
                    outline
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
                <q-input
                  outlined
                  dense
                  debounce="300"
                  v-model="filter"
                  placeholder="Buscar"
                  clearable
                  class="bg-accent-light"
                  style="width: 180px; min-width: 180px"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </q-tr>
          </template>

          <template #body-cell-fecha="props">
            <q-td key="fecha" :props="props">
              <button
                class="link-button"
                @click="cambiarFecha(props.row)"
                v-if="!!props.row.registroTarjeta"
              >
                {{ props.row.fecha }}
              </button>
              <span v-else>{{ props.row.fecha }}</span>
            </q-td>
          </template>
          <template #body-cell-categoria="props">
            <q-td key="categoria" :props="props">
              {{ props.row.categoria?.nombre }}
            </q-td>
          </template>
          <template #body-cell-importe="props">
            <q-td
              class="registros__columna--importe"
              :style="{
                color: props.row.importe < 0 ? 'red' : 'black'
              }"
              align="right"
            >
              {{ formato.toCurrency(props.row.importe) }}
            </q-td>
          </template>
          <template #body-cell-observaciones="props">
            <q-td key="observaciones" :props="props">
              {{ props.row.observaciones }}
              <q-popup-edit
                v-if="!props.row.disable"
                v-model="props.row.observaciones"
                title="Editar observaciones"
                buttons
                label-set="Guardar"
                label-cancel="Cancelar"
                @update:model-value="
                  saveObs(props.row.id, props.row, props.row.observaciones)
                "
                v-slot="scope"
                max-width="150px"
              >
                <q-input
                  v-model="scope.value"
                  @keyup.enter="scope.set"
                  type="text"
                  label="Favor de ingresar observaciones"
                  autofocus
                />
              </q-popup-edit>
            </q-td>
          </template>
          <template #body-cell-acciones="props">
            <q-td :props="props" class="q-gutter-x-md">
              <q-btn
                icon="las la-edit"
                class="button-edit"
                dense
                @click="editItem(props)"
                flat
                v-if="!props.row.disable"
              />
              <!-- <q-btn
                icon="las la-trash-alt"
                class="button-delete"
                dense
                @click="deleteItem(props)"
                flat
              /> -->
            </q-td>
          </template>
          <!-- <template #bottom-row>
            <q-tr>
              <q-td colspan="4" class="text-condensed text-bold"
                >Importe total de movimientos del periodo</q-td
              >
              <q-td class="text-bold" align="right">{{
                formato.toCurrency(sumaMovimientos)
              }}</q-td>
            </q-tr>
          </template> -->
          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>
        </q-table>
      </div>
      <div class="summary">
        Importe total de movimientos:
        <span> {{ toCurrency(sumaMovimientos) }}</span>
      </div>
      <!-- <pre>{{ listaRegistros }}</pre> -->
    </div>
  </div>

  <Teleport to="#modal">
    <q-dialog
      v-model="showForm"
      persistent
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      <!-- style="z-index: 1"
    v-if="showForm"
    class="fixed-center shadow-15" -->
      <FormCuentaRegistro
        :cuenta-id="cuenta.id"
        :edited-item="registroEditedItem"
        @item-saved="itemSaved"
        @item-updated="onItemUpdated"
        :fecha="fecha_registro"
      ></FormCuentaRegistro>
    </q-dialog>
  </Teleport>
  <Teleport to="#modal">
    <q-dialog
      v-model="showFormCarga"
      persistent
      transition-show="jump-down"
      transition-hide="jump-down"
    >
      <ImportarRegistrosCuenta
        :cuenta="cuenta"
        @items-saved="itemsSaved"
        :fecha_desde="detalleVariables.fechaInicio"
        :fecha_hasta="detalleVariables.fechaFin"
      ></ImportarRegistrosCuenta>
    </q-dialog>
    <q-dialog
      v-model="showCambioFecha"
      persistent
      transition-show="jump-down"
      transition-hide="jump-down"
    >
      <CambioFechaPage
        :registro="registroToEdit"
        @date-updated="dateUpdated"
      ></CambioFechaPage>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, onBeforeMount, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DateTime } from 'luxon'
import { LISTA_REGISTROS } from 'src/graphql/registros'
import { useLazyQuery, useQuery } from '@vue/apollo-composable'
import { useFormato } from 'src/composables/utils/useFormato'
import { useRegistrosCrud } from 'src/composables/useRegistrosCrud'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { SessionStorage, useQuasar } from 'quasar'
import FormCuentaRegistro from 'src/components/movimientos/FormCuentaRegistro.vue'
import CambioFechaPage from 'src/pages/cuentas/CambioFechaPage.vue'
import { OBTENER_SALDO_A_FECHA } from 'src/graphql/cuentas'
import ImportarRegistrosCuenta from 'src/components/cuentas/ImportarRegistrosCuenta.vue'
import { useCuentaStore } from 'src/stores/common/useCuentaStore'
import { useCuentasCrud } from 'src/composables/useCuentasCrud'
import PeriodoSelect from 'src/components/formComponents/PeriodoSelect.vue'
import { useGeneralStore } from 'src/stores/common/useGeneralStore'

/**
 * composables
 */
const route = useRoute()
const router = useRouter()
const formato = useFormato()
const registrosCrud = useRegistrosCrud()
const $q = useQuasar()
const cuentaStore = useCuentaStore()
const cuentasCrud = useCuentasCrud()
const generalStore = useGeneralStore()

const { mostrarNotificacionPositiva, mostrarNotificacionNegativa } =
  useNotificacion()

const { toCurrency } = useFormato()

/**
 * state
 */
const detalleVariables = reactive({
  categoriaId: null,
  cuentaId: route.params.id,
  fechaInicio: DateTime.now().startOf('month').toISODate(),
  fechaFin: DateTime.now().endOf('month').toISODate(),
  isMsi: null
})

const variablesSaldoAnterior = reactive({
  cuentaId: route.params.id,
  fechaFin: DateTime.now().startOf('month').plus({ days: -1 }).toISODate()
})
const showCambioFecha = ref(false)
// const loadingRegistros = ref(false)

// const variablesSaldoAlPeriodo = reactive({
//   cuentaId: route.params.id,
//   fechaFin: DateTime.now().endOf('month').toISODate()
// })

const cuenta = ref({})
const listaRegistros = ref([])

const ejercicio_fiscal = ref(DateTime.now().year)
const mes = ref({})
const registroEditedItem = ref(null)
const registroToEdit = ref(null)
const selected = ref([])
const saldo_periodo_anterior = ref(0)
// const saldoFinalPeriodo = ref(0)

const filter = ref()

const showForm = ref(false)
const showFormCarga = ref(false)

/**
 * on before mount
 */
onBeforeMount(() => {
  mes.value = generalStore.meses.find(
    (mesOption) => mesOption.id === DateTime.now().month
  )
  cargarDatosCuenta(route.params.id, true)
})
/**
 * onMounted
 */
onMounted(() => {
  // console.log('On mounted ................')
  /*
  mes.value = generalStore.meses.find(
    (mesOption) => mesOption.id === DateTime.now().month
  )
  cargarDatosCuenta(route.params.id, true)
 */
})

/**
 * Cargar datos de la cuenta desde la api.
 * @author Horacio Peña Mendoza <hpena.dtic@gmail.com>
 * @param {Number} cuenta_id - Id de la cuenta.
 */
function cargarDatosCuenta(cuenta_id) {
  if (cuentaStore.listaCuentas.length > 0) {
    cuenta.value = cuentaStore.listaCuentas.find(
      (cuenta) => cuenta.id === cuenta_id
    )
  } else {
    cuentasCrud.fetchOrRefetchCuentaById(cuenta_id)
    // router.push('/home')
  }
}

cuentasCrud.onResultCuentaById(({ data }) => {
  cuenta.value = data.cuentaById
})
/**
 * GRAPHQL
 */
const graphqlOptions = reactive({
  fetchPolicy: 'no-cache'
})

const {
  load: loadListaRegistros,
  onError: onErrorListaRegistros,
  onResult: onResultListaRegistros,
  refetch: refetchListaRegistros,
  loading: loadingRegistros
} = useLazyQuery(LISTA_REGISTROS, detalleVariables, graphqlOptions)

function fetchOrRefetchListaRegistros() {
  loadListaRegistros() || refetchListaRegistros()
}

onResultListaRegistros(({ data }) => {
  // console.log('[ data ] >', data)
  if (!!data) {
    listaRegistros.value =
      JSON.parse(JSON.stringify(data?.obtenerRegistros)) ?? 0

    let saldoAnterior = saldo_periodo_anterior.value || 0

    listaRegistros.value.forEach((registro) => {
      registro.saldo = saldoAnterior + registro.importe
      saldoAnterior = registro.saldo
    })
  }
})

onErrorListaRegistros((error) => {
  mostrarNotificacionNegativa(
    'Ocurrió un error, no se pueden obtener los detalles de la cuenta'
  )
  if (process.env.NODE_ENV !== 'production') {
    logErrorMessages(error)
  }
})

const {
  onResult: onResultObtenerSaldoAFecha,
  onError: onErrorObtenerSaldo,
  refetch: refetchSaldoAFecha
} = useQuery(OBTENER_SALDO_A_FECHA, variablesSaldoAnterior, graphqlOptions)

onResultObtenerSaldoAFecha(({ data }) => {
  if (!!data) {
    saldo_periodo_anterior.value = data.obtenerSaldoAFecha
    fetchOrRefetchListaRegistros(null, detalleVariables, graphqlOptions)
  }
})

onErrorObtenerSaldo((error) => {
  mostrarNotificacionNegativa('Ocurrió un error, no se puede obtener el saldo')
  if (process.env.NODE_ENV !== 'production') {
    logErrorMessages(error)
  }
})

/**
 * computed
 */
const isModificable = computed({
  get() {
    return SessionStorage.getItem('current_user').canModify
  }
})

const sumaMovimientos = computed({
  get() {
    return listaRegistros.value.reduce((accumulator, registro) => {
      return accumulator + registro.importe
    }, 0)
  }
})

const saldoFinalPeriodo = computed({
  get() {
    // console.log('calculando saldo final periodo')
    return saldo_periodo_anterior.value + sumaMovimientos.value
  }
})

const fecha_registro = computed({
  get() {
    const begin_date = DateTime.fromISO(detalleVariables.fechaInicio)
    const end_date = DateTime.fromISO(detalleVariables.fechaFin)
    const today = DateTime.now()

    return begin_date <= today && today <= end_date
      ? undefined
      : detalleVariables.fechaFin
  }
})
const periodoInicioStr = computed({
  get() {
    return `01/${mes.value?.nombre?.substring(0, 3)}/${ejercicio_fiscal.value}`
  }
})
const periodoFinStr = computed({
  get() {
    const diaFinal = DateTime.fromISO(detalleVariables.fechaFin).day

    return `${diaFinal}/${mes.value?.nombre?.substring(0, 3)}/${
      ejercicio_fiscal.value
    }`
  }
})
/**
 * functions
 */
function refetchDatos() {
  refetchSaldoAFecha()
  actualizarSaldoFinal()
}
/**
 * Iniciar la edición de un elemento de la lista
 * @param {*} item - item de la tabla a editar.
 */
function editItem(item) {
  registroEditedItem.value = JSON.parse(JSON.stringify(item.row))

  registroEditedItem.value.importe = obtenerImporteByTipoMovimiento(
    registroEditedItem.value
  ).toString()

  registroEditedItem.value.fecha = formato.convertDateFromIsoToInput(
    registroEditedItem.value.fecha
  )
  registroEditedItem.value.tipoMovimientoId =
    registroEditedItem.value.categoria?.tipoMovimientoId || '3'

  showForm.value = true
}

/**
 * Obtener importe con el formato adecuado para editar.
 * @param {Object} editedItem - Item a editar.
 * @returns {Float} Retornar el importe formateado de acuerdo al tipo de movimiento
 */
function obtenerImporteByTipoMovimiento(editedItem) {
  if (!!editedItem.categoria) {
    return editedItem.categoria.tipoMovimientoId === '2'
      ? editedItem.importe * -1
      : editedItem.importe
  } else if (!!editedItem.traspasoDetalle) {
    return editedItem.traspasoDetalle.importe
  } else {
    return ''
  }
}

function deleteSelectedItems() {
  if (selected.value.length > 0) {
    const message = `Esta a punto de eliminar ${selected.value.length} movimientos. ¿Desea continuar?`
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
        confirmarEliminarItems(selected.value)
      })
      .onCancel(() => {})
      .onDismiss(() => {})
  }
}
/**
 * Una vez confirmada la eliminación de items
 * @param {Array} toDelete - Items to delete.
 */
function confirmarEliminarItems(toDelete) {
  console.log(toDelete)
  const eliminar = toDelete.map((item) => item.id)
  console.log('eliminando', eliminar.toString())
  registrosCrud.registrosDelete({ ids: eliminar.toString() })
}

registrosCrud.onDoneRegistrosDelete(({ data }) => {
  console.log('Terminó de eliminar registros', data.registrosDelete.cuentasIds)
  // cuenta.value.saldo = data.registrosDelete.saldo
  refetchDatos()
  mostrarNotificacionPositiva(
    'Los movimientos fueron eliminados exitosamente',
    1600
  )
  selected.value.length = 0
})

registrosCrud.onErrorRegistrosDelete(() => {
  mostrarNotificacionNegativa(
    'No es posible eliminar los registros, favor de verificar.',
    2100
  )
})

// function deleteItem(props_row) {
//   const item = props_row.row
//   const message = !item.traspasoDetalle
//     ? `Va a eliminar un movimiento con un importe de: ${formato.toCurrency(
//         item.importe
//       )} ¿Desea continuar con la eliminación?`
//     : `La eliminación del traspaso afectara también la cuenta destino ¿Desea continuar con la eliminación del traspaso?`

//   deleteItem.value = $q
//     .dialog({
//       title: 'Confirmar',
//       style: 'width:500px',
//       message,
//       ok: {
//         push: true,
//         color: 'positive',
//         label: 'Continuar'
//       },
//       cancel: {
//         push: true,
//         color: 'negative',
//         flat: true,
//         label: 'cancelar'
//       },
//       persistent: true
//     })
//     .onOk(() => {
//       confirmarEliminar(item)
//     })
//     .onCancel(() => {})
//     .onDismiss(() => {})
// }
// function confirmarEliminar(item) {
//   if (!item.traspasoDetalle) {
//     registrosCrud.deleteRegistro({
//       id: item.id
//     })
//   } else {
//     traspasosCrud.traspasoDelete({
//       id: item.traspasoDetalle.traspasoId
//     })
//   }
// }

// registrosCrud.onDoneRegistroDelete(({ data }) => {
//   loadOrRefetchListaRegistros()
//   mostrarNotificacionPositiva('Registro eliminado correctamente.', 1000)
//   cargarDatosCuenta(route.params.id, false)
// })
// traspasosCrud.onDoneTraspasoDelete(({ data }) => {
//   loadOrRefetchListaRegistros()
//   mostrarNotificacionPositiva('Registro eliminado correctamente.', 1000)
//   cargarDatosCuenta(route.params.id, false)
// })

/**
 * Al cambiar el mes
 */
function onChangeMes() {
  onChangePeriodo()
}
/**
 * Al cambiar el ejericio
 */
function onChangeEjercicio() {
  onChangePeriodo()
}
/**
 * Lista de registros de la tarjeta
 */
function onChangePeriodo() {
  const fechaString = `${ejercicio_fiscal.value}-${('0' + mes.value.id).slice(
    -2
  )}-01`
  const fecha = DateTime.fromISO(fechaString)
  detalleVariables.fechaInicio = fecha.toISODate()
  detalleVariables.fechaFin = fecha.endOf('month').toISODate()
  // variablesSaldoAlPeriodo.fechaFin = fecha.endOf('month').toISODate()
  variablesSaldoAnterior.fechaFin = fecha
    .startOf('month')
    .plus({ days: -1 })
    .toISODate()
}

/**
 * Muestra el formulario para agregar un registro, ingreso, gasto o traspaso.
 */
function addItem() {
  registroEditedItem.value = {
    tipoMovimientoId: '2',
    tipoAfectacion: 'C',
    categoria: null,
    estadoRegistroId: 2,
    importe: '',
    fecha: formato.formatoFecha(new Date()),
    observaciones: '',
    cuenta: cuenta.value
  }
  showForm.value = true
}

function saveObs(id, row, observaciones) {
  // console.log('observaciones', observaciones)
  // const input = {
  //   ...row,
  //   observaciones: observaciones,
  //   cuentaId: row.cuenta.id,
  //   categoriaId: row.categoria.id,
  //   cuenta: undefined,
  //   categoria: undefined,
  //   __typename: undefined,
  //   registroTarjeta: undefined,
  //   traspasoDetalle: undefined
  // }

  console.log('observaciones', observaciones)
  registrosCrud.registroParcialUpdate({
    id,
    observaciones
  })
}

registrosCrud.onDoneRegistroUpdate((response) => {})

registrosCrud.onErrorRegistroUpdate((response) => {
  console.trace(response)
  mostrarNotificacionNegativa(
    'No fué posible actualizar el registro, favor de verificar.',
    1500
  )
})

registrosCrud.onDoneRegistroParcialUpdate((response) => {
  mostrarNotificacionPositiva('Campo observación actualizado.', 700)
})

registrosCrud.onErrorRegistroParcialUpdate((error) => {
  console.trace(response)
  mostrarNotificacionNegativa(
    'No fué posible actualizar el registro, favor de verificar.',
    1500
  )
})

function itemSaved(registro) {
  refetchDatos()
  // cargarDatosCuenta(route.params.id, false)
  showForm.value = false
}

function onItemUpdated() {
  refetchDatos()
  // cargarDatosCuenta(route.params.id, false)
  showForm.value = false
}

function itemsSaved() {
  showFormCarga.value = false
  refetchDatos()
}
/**
 * Actualizar el saldo final de la cuenta sin importar la fecha y actualizar en interfaz.
 */
function actualizarSaldoFinal() {
  cuentasCrud.cuentaSaldoUpdate({ cuentaId: route.params.id.toString() })
}

cuentasCrud.onDoneCuentaSaldoUpdate(({ data }) => {
  // console.log('cuentasCrud.onDoneCuentaSaldoUpdate ......')
  cuenta.value.saldo = data.cuentaSaldoUpdate.cuenta.saldo
})

/**
 * Iniciar el formulario de importación de movimientos.
 */
function importarMovimientos() {
  showFormCarga.value = true
}

function cambiarFecha(row) {
  console.log('[ row ] >', row)
  registroToEdit.value = row
  fecha_registro.value
  showCambioFecha.value = true
}
function dateUpdated() {
  refetchDatos()
  showCambioFecha.value = false
}

// function onChangePeriodo(){
//   console.log('periodo cambiado',ejercicio_fiscal.value, mes.value)
// }

const columns = [
  // { name: 'id', label: 'Id', field: 'id', sortable: true, align: 'left' },
  {
    name: 'fecha',
    label: 'Fecha',
    field: 'fecha',
    sortable: false,
    align: 'left',
    format: (val, row) => formato.formatoFechaFromISO(val),
    headerStyle: 'width: 90px'
  },
  {
    name: 'categoria',
    label: 'Concepto',
    field: (row) => row.categoria?.nombre,
    sortable: false,
    filter: false,
    align: 'left'
    // style: 'width:20%'
  },
  {
    name: 'cargo',
    label: 'Cargo',
    field: 'cargo',
    sortable: false,
    align: 'right',
    format: (val, row) => formato.toCurrency(val),
    headerStyle: 'width: 100px; min-width:100px'
  },
  {
    name: 'abono',
    label: 'Abono',
    field: 'abono',
    sortable: false,
    align: 'right',
    format: (val, row) => formato.toCurrency(val),
    headerStyle: 'width: 100px; min-width:100px'
  },
  {
    name: 'saldo',
    label: 'Saldo',
    field: 'saldo',
    sortable: false,
    align: 'right',
    format: (val, row) => formato.toCurrency(val),
    headerStyle: 'width: 100px; min-width:100px'
  },
  {
    name: 'observaciones',
    label: 'Observaciones',
    field: 'observaciones',
    sortable: false,
    align: 'left',
    headerStyle: 'width:250px;max-width: 250px',
    style:
      'width:250px;max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis'
  },
  {
    name: 'tarjetaCredito',
    label: 'Tarjeta de Crédito',
    field: (row) => row.registroTarjeta?.cuenta.nombre,
    sortable: false,
    align: 'left',
    headerStyle: 'width: 120px;min-width:120px;max-width:120px'
  },
  // {
  //   name: 'tarjetaCredito',
  //   label: 'Tarjeta de Crédito',
  //   field: (row) => row.registroTarjeta?.fecha,
  //   sortable: true,
  //   align: 'left',
  //   format: (val, row) => (val ? formato.formatoFechaFromISO(val) : ''),
  //   headerStyle: 'width: 120px;min-width:120px;max-width:120px'
  // },
  {
    name: 'acciones',
    field: 'action',
    sortable: false,
    align: 'center',
    headerStyle: 'width: 70px'
  }
]

const tableRef = ref(null)

function onSelection({ rows, added, evt }) {
  if (rows.length === 0 || tableRef.value === void 0) {
    return
  }

  if (added) {
    const filteredRows = rows.filter((row) => !row.disable)
    selected.value = selected.value.concat(filteredRows)
  } else {
    const idsToRemove = new Set(rows.map((obj) => obj.id))
    selected.value = selected.value.filter((obj) => !idsToRemove.has(obj.id))
  }
}
const importe_seleccionado = computed({
  get() {
    return selected.value.reduce((accumulator, registro) => {
      return accumulator + parseFloat(registro.importe)
    }, 0)
  }
})

function getSelectedString() {
  return selected.value.length === 0
    ? ''
    : `${selected.value.length} registro${
        selected.value.length > 1 ? 's' : ''
      } seleccionados - Importe: ${formato.toCurrency(
        importe_seleccionado.value
      )} `
  //de ${listaRegistrosFiltrados.value.length}
}
</script>

<style lang="scss" scoped>
.cuenta__data-subtitle {
  letter-spacing: -0.045rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #7b6992;
}
.registros__columna--importe {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: -0.025rem;
}
.resumen {
  &__etiqueta {
    font-size: 0.75rem !important;
    font-weight: bold;
    font-style: italic;
    color: #7f7988;
  }
  &__valor {
    font-family: 'Roboto Slab', sans-serif;
    font-size: 0.85rem;
    color: #625179;
  }
}
.sticky-table-container {
  // border: 1px solid red;
  height: calc(100vh - 395px) !important;
}
.my-sticky-header-table {
  /* height or max-height is important */
  // height: calc(100vh - 125px);
  height: 100%;

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: $primary-light;
  }
  thead tr th {
    position: sticky;
    z-index: 1;
  }
  thead tr:first-child th {
    top: 0;
  }

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
  }
}
.summary {
  padding: 5px;
  color: $primary;
  font-weight: bold;
  & span {
    font-family: 'Roboto Slab';
    padding-inline: 15px;
    color: #463161;
  }
}
.link-button {
  font-size: 0.8rem;
  cursor: pointer;
  border: 0px solid white;
  background: none;
  text-decoration: underline;
  &:hover {
    text-decoration: none;
    background-color: #cdfeaa;
  }
}
</style>
