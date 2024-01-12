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
          :src="`/icons/${cuenta.banco?.icono ?? 'cash.png'}`"
          width="50px"
          height="50px"
        />
        <span class="cuenta__title">{{ cuenta.nombre }}</span>
      </div>
      <span class="cuenta__title text-accent">Cuenta</span>
    </div>
  </q-card>
  <div class="main-content">
    <div class="cuenta-content">
      <q-card class="my-card" flat bordered>
        <q-toolbar class="">
          <PeriodoSelect
            v-model:year="ejercicio_fiscal"
            v-model:month="mes"
            @onChangePeriodo="onChangePeriodo"
          ></PeriodoSelect>
          <q-toolbar-title> </q-toolbar-title>
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
              <span class="resumen__valor" style="font-weight: bold !important">
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
          :rows="listaRegistros"
          :columns="columns"
          dense
          :rows-per-page-options="[0]"
          table-header-class="bg-primary-light text-accent"
          separator="vertical"
          hide-pagination
          selection="multiple"
          v-model:selected="selectedItems"
          row-key="id"
          :filter="filter"
          no-data-label="No se han registrado movimientos"
        >
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
              <div class="table-title">Movimientos del periodo</div>
            </q-tr>
          </template>
          <template #top-right>
            <q-tr>
              <div class="row q-gutter-x-sm">
                <q-btn
                  class="medium-button"
                  color="negative-pastel"
                  :disable="selectedItems.length <= 0"
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
                    <q-img src="/icons/excel.png" width="24px" height="24px" />
                  </q-avatar>
                  <span class="q-ml-sm">Importar</span>
                </q-btn>
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
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, onBeforeMount, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DateTime } from 'luxon'
import { api } from 'src/boot/axios'
import { LISTA_REGISTROS } from 'src/graphql/registros'
import { useQuery } from '@vue/apollo-composable'
import { useFormato } from 'src/composables/utils/useFormato'
import { useRegistrosCrud } from 'src/composables/useRegistrosCrud'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { useQuasar } from 'quasar'
import FormCuentaRegistro from 'src/components/movimientos/FormCuentaRegistro.vue'
import MesSelect from 'src/components/formComponents/MesSelect.vue'
import { OBTENER_SALDO_A_FECHA } from 'src/graphql/cuentas'
import ImportarRegistrosCuenta from 'src/components/cuentas/ImportarRegistrosCuenta.vue'
import { useTraspasosCrud } from 'src/composables/useTraspasosCrud'
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
const traspasosCrud = useTraspasosCrud()
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

// const variablesSaldoAlPeriodo = reactive({
//   cuentaId: route.params.id,
//   fechaFin: DateTime.now().endOf('month').toISODate()
// })

const cuenta = ref({})
const listaRegistros = ref([])

const ejercicio_fiscal = ref(DateTime.now().year)
const mes = ref({})
const registroEditedItem = ref(null)
const selectedItems = ref([])
const saldo_periodo_anterior = ref(0)
// const saldoFinalPeriodo = ref(0)

const filter = ref()

const showForm = ref(false)
const showFormCarga = ref(false)

/**
 * on before mount
 */
onBeforeMount(() => {
  console.log('On before mount ..............')
})
/**
 * onMounted
 */
onMounted(() => {
  console.log('On mounted ................')
  mes.value = generalStore.meses.find(
    (mesOption) => mesOption.id === DateTime.now().month
  )
  cargarDatosCuenta(route.params.id, true)
})

/**
 * Cargar datos de la cuenta desde la api.
 * @author Horacio Peña Mendoza <hpena.dtic@gmail.com>
 * @param {Number} cuenta_id - Id de la cuenta.
 */
function cargarDatosCuenta(cuenta_id) {
  api.get(`/cuentas/${cuenta_id}`).then((response) => {
    cuenta.value = response?.data.data ?? {}
  })
}

/**
 * GRAPHQL
 */
const graphqlOptions = reactive({
  fetchPolicy: 'no-cache'
})

const {
  onError: onErrorListaRegistros,
  onResult: onResultListaRegistros,
  refetch: refetchListaRegistros
} = useQuery(LISTA_REGISTROS, detalleVariables, graphqlOptions)

onResultListaRegistros(({ data }) => {
  if (!!data) {
    console.log('on result lista registros.....')
    listaRegistros.value = data?.obtenerRegistros ?? []
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
    console.log('onResultObtenerSaldoAFecha anterior.....')
    // saldoFinalPeriodo.value = data.obtenerSaldoAFecha
    saldo_periodo_anterior.value = data.obtenerSaldoAFecha
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
  refetchListaRegistros()
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

  console.log('item to edit', registroEditedItem.value)
  showForm.value = true
}

/**
 * Obtener importe con el formato adecuado para editar.
 * @param {Object} editedItem - Item a editar.
 * @returns {Float} Retornar el importe formateado de acuerdo al tipo de movimiento
 */
function obtenerImporteByTipoMovimiento(editedItem) {
  console.log('obtenerImporteByTipoMovimiento item...', editedItem)
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
        confirmarEliminarItems(selectedItems.value)
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
  cuentaStore.actualizarSaldoCuenta(
    cuenta.value.id.toString(),
    data.registrosDelete.saldo
  )
  // cuenta.value.saldo = data.registrosDelete.saldo
  refetchDatos()
  mostrarNotificacionPositiva(
    'Los movimientos fueron eliminados exitosamente',
    1600
  )
  selectedItems.value.length = 0
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
  console.log('Periodo cambiado', ejercicio_fiscal.value, mes.value)

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
  const input = {
    ...row,
    observaciones: observaciones,
    cuentaId: row.cuenta.id,
    categoriaId: row.categoria.id,
    cuenta: undefined,
    categoria: undefined,
    __typename: undefined,
    registroTarjeta: undefined,
    traspasoDetalle: undefined
  }

  // console.log('input', input)
  registrosCrud.registroUpdate({
    id,
    input
  })
}

registrosCrud.onDoneRegistroUpdate((response) => {
  mostrarNotificacionPositiva('Campo observación actualizado.', 700)
})

registrosCrud.onErrorRegistroUpdate((response) => {
  console.trace(response)
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

// function onChangePeriodo(){
//   console.log('periodo cambiado',ejercicio_fiscal.value, mes.value)
// }

const columns = [
  // { name: 'id', label: 'Id', field: 'id', sortable: true, align: 'left' },
  {
    name: 'fecha',
    label: 'Fecha',
    field: 'fecha',
    sortable: true,
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
    sortable: true,
    align: 'right',
    format: (val, row) => formato.toCurrency(val),
    headerStyle: 'width: 100px; min-width:100px'
  },
  {
    name: 'abono',
    label: 'Abono',
    field: 'abono',
    sortable: true,
    align: 'right',
    format: (val, row) => formato.toCurrency(val),
    headerStyle: 'width: 100px; min-width:100px'
  },
  {
    name: 'observaciones',
    label: 'Observaciones',
    field: 'observaciones',
    sortable: true,
    align: 'left',
    headerStyle: 'width:250px;max-width: 250px',
    style:
      'width:250px;max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis'
  },
  {
    name: 'tarjetaCredito',
    label: 'Tarjeta de Crédito',
    field: (row) => row.registroTarjeta?.cuenta.nombre,
    sortable: true,
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
</style>
