<template>
  <q-card flat>
    <q-toolbar class="bg-grey-1 text-primary" fit dense>
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
      <div class="row cuenta__title inline">Cuenta {{ cuenta.nombre }}</div>
    </div>
  </q-card>
  <div class="main-content">
    <div class="cuenta-content">
      <q-toolbar class="">
        <div class="row q-gutter-x-sm">
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
          <!-- <q-select
          v-model="mes"
          :options="mesOptions"
          option-label="nombre"
          label="Mes"
          dense
          outlined
          color="secondary"
          label-color="dark"
          @update:model-value="onChangeMes"
        >
          <template #prepend>
            <q-icon name="calendar_month" />
          </template>
        </q-select> -->
          <MesSelect
            v-model="mes"
            @update:model-value="onChangeMes"
          ></MesSelect>
        </div>
        <q-toolbar-title> </q-toolbar-title>
      </q-toolbar>

      <q-card flat>
        <q-card-section>
          <div class="row">
            <div class="col column items-center">
              <span class="tarjeta__resumen-etiqueta"> Periodo </span>
              <span class="tarjeta__resumen-valor">
                {{ periodoInicio }} - {{ periodoFin }}</span
              >
            </div>
            <q-separator spaced inset vertical />
            <div class="col column items-center">
              <span class="tarjeta__resumen-etiqueta">
                Suma de movimientos del periodo
              </span>
              <span class="tarjeta__resumen-valor-importante">
                {{ formato.toCurrency(sumaMovimientos) }}</span
              >
            </div>
          </div>
          <q-separator spaced inset horizontal />
          <div class="row">
            <div class="col column items-center">
              <span class="tarjeta__resumen-etiqueta">
                Saldo al final del periodo</span
              >
              <span class="tarjeta__resumen-valor">
                {{ formato.toCurrency(saldo_final_periodo) }}
              </span>
            </div>
            <q-separator spaced inset vertical />
            <div class="col column items-center">
              <span class="tarjeta__resumen-etiqueta"> Saldo final</span>
              <span class="tarjeta__resumen-valor">
                {{ formato.toCurrency(parseFloat(cuenta.saldo)) }}
              </span>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-separator spaced inset vertical />
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
                <div class="table-title">Movimientos del periodo</div>
              </q-tr>
            </template>
            <template #top-right>
              <q-tr>
                <div class="q-gutter-x-md">
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
                    @click="importarMovimientos"
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
              </q-tr>
            </template>

            <template #body-cell-categoria="props">
              <q-td key="categoria" :props="props">
                {{ props.row.categoria?.nombre }}
                <q-popup-edit
                  v-model="props.row.categoria"
                  title="Editar categoria"
                  buttons
                  @save="saveObs(props)"
                  label-set="Guardar"
                  label-cancel="Cancelar"
                  v-slot="scope"
                >
                  <q-checkbox
                    left-label
                    v-model="props.row.todo"
                    label="Todos"
                  />
                  <CategoriaSelect
                    v-model="scope.value"
                    autofocus
                  ></CategoriaSelect>
                </q-popup-edit>
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
                  @save="saveObs(props)"
                  v-slot="scope"
                  max-width="150px"
                >
                  <!-- @before-hide="actualizarObservaciones(props)"
              -->
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
      <RegistroMovimiento
        :cuenta-id="cuenta.id"
        :edited-item="registroEditedItem"
        @item-saved="registroCreated"
        @item-updated="registroUpdated"
      ></RegistroMovimiento>
    </q-dialog>
  </Teleport>
  <Teleport to="#modal">
    <q-dialog v-model="showFormCarga" persistent>
      <ImportarRegistrosCuenta
        :cuenta="cuenta"
        @items-saved="itemsSaved"
      ></ImportarRegistrosCuenta>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DateTime } from 'luxon'
import { api } from 'src/boot/axios'
import { LISTA_REGISTROS } from 'src/graphql/registros'
import { useLazyQuery, useQuery } from '@vue/apollo-composable'
import { useFormato } from 'src/composables/utils/useFormato'
import { useRegistrosCrud } from 'src/composables/useRegistrosCrud'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { useQuasar } from 'quasar'
import CategoriaSelect from 'src/components/formComponents/CategoriaSelect.vue'
import RegistroMovimiento from 'src/components/movimientos/RegistroMovimiento.vue'
import MesSelect from 'src/components/formComponents/MesSelect.vue'
import { OBTENER_SALDO_A_FECHA } from 'src/graphql/cuentas'
import ImportarRegistrosCuenta from 'src/components/cuentas/ImportarRegistrosCuenta.vue'

const route = useRoute()
const router = useRouter()
const formato = useFormato()
const notificacion = useNotificacion()
const registrosCrud = useRegistrosCrud()
const $q = useQuasar()

/**
 * state
 */
const fecha_inicio = ref('1900-01-01')
const fecha_fin = ref('1900-01-01')
const dia_corte = ref(0)

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

const cuenta = ref({})
const ejercicio_fiscal = ref(0)
const mes = ref({})
const saldo_anterior = ref(0)
const editRegistroItem = ref(null)

const graphql_options = ref({
  fetchPolicy: 'network-only'
})

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

  api.get(`/cuentas/${route.params.id}`).then((response) => {
    cuenta.value = response?.data.data ?? {}
    dia_corte.value = cuenta.value.dia_corte
    obtener_fecha_inicio()
    obtener_fecha_fin()
    // console.log('fecha_inicio', fecha_inicio.value)
    // console.log('fecha_fin', fecha_fin.value)
    cargaListaRegistros(
      null,
      {
        cuentaId: route.params.id.toString(),
        categoriaId: null,
        fechaInicio: fecha_inicio.value,
        fechaFin: fecha_fin.value
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
    return listaRegistros.value.reduce((accumulator, registro) => {
      return accumulator + registro.importe
    }, 0)
  }
})

const saldo_final = computed({
  get() {
    return parseFloat(saldo_anterior.value) + parseFloat(sumaMovimientos.value)
  }
})

const mes_inicial_id = computed({
  get() {
    return mes.value.id
  }
})

const ejercicio_final_id = computed({
  get() {
    return ejercicio_fiscal.value
  }
})

const dia_corte_final = computed({
  get() {
    const fechaString = `${ejercicio_fiscal.value}-${(
      '0' + mes_inicial_id.value
    ).slice(-2)}-01`
    // console.log('mes para buscar ultimo dia', fechaString)
    let fecha = DateTime.fromISO(fechaString)
    fecha = fecha.endOf('month')
    return fecha.day
  }
})
const mes_final_id = computed({
  get() {
    return mes.value.id
  }
})

const fecha_fin_periodo = computed({
  get() {
    return `${ejercicio_final_id.value}-${('0' + mes_final_id.value).slice(
      -2
    )}-${dia_corte_final.value}`
  }
})
const periodoInicio = computed({
  get() {
    const mes = mesOptions.value.find(
      (option) => option.id === mes_inicial_id.value
    )
    if (!!mes) {
      return `01/${mes.nombre.substring(0, 3)}/${ejercicio_fiscal.value}`
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
const isCuentaAhorros = computed({
  get() {
    return cuenta.value?.tipo_cuenta_id === 1
  }
})
/**
 * graphql
 */
const graphqlOptions = reactive({
  fetchPolicy: 'no-cache'
})
const {
  onError: onErrorListaRegistros,
  onResult: onResultListaRegistros,
  load: cargaListaRegistros,
  refetch: refetchListaRegistros
} = useLazyQuery(LISTA_REGISTROS)

onResultListaRegistros(({ data }) => {
  // console.log('lista de registros', data)
  listaRegistros.value = data?.obtenerRegistros ?? []
  console.log(listaRegistros.value)
})

onErrorListaRegistros((error) => {
  console.error('response', error)
})

const { result: resultSaldoAFecha, onError: onErrorObtenerSaldo } = useQuery(
  OBTENER_SALDO_A_FECHA,
  {
    cuentaId: route.params.id,
    fechaFin: fecha_fin_periodo
  },
  graphqlOptions
)

const saldo_final_periodo = computed({
  get() {
    console.log(resultSaldoAFecha.value)
    return resultSaldoAFecha.value?.obtenerSaldoAFecha ?? 0
  }
})
onErrorObtenerSaldo((error) => {
  console.log(error)
})
/**
 * functions
 */

function editItem(item) {
  console.log('editando item...', item.rowIndex, item.row)
  registroEditedItem.value = JSON.parse(JSON.stringify(item.row))
  registroEditedItem.value.importe = (
    registroEditedItem.value.categoria.tipoMovimientoId === '2'
      ? registroEditedItem.value.importe * -1
      : registroEditedItem.value.importe
  ).toString()
  console.log('fecha', registroEditedItem.value.fecha)
  registroEditedItem.value.fecha = formato.convertDateFromIsoToInput(
    registroEditedItem.value.fecha
  )
  registroEditedItem.value.tipoMovimientoId =
    registroEditedItem.value.categoria?.tipoMovimientoId || '3'
  showForm.value = true
}

function deleteItem(props_row) {
  const item = props_row.row
  deleteItem.value = $q
    .dialog({
      title: 'Confirmar',
      style: 'width:500px',
      message: `Va a eliminar un movimiento con un importe de: ${formato.toCurrency(
        item.importe
      )} ¿Desea continuar con la eliminación?`,
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
      registrosCrud.deleteRegistro({
        id: item.id
      })
    })
    .onCancel(() => {})
    .onDismiss(() => {})
}

registrosCrud.onDoneDelete(({ data }) => {
  loadOrRefetchListaRegistros()
  notificacion.mostrarNotificacionPositiva(
    'Registro eliminado correctamente.',
    1000
  )
})

function obtener_fecha_inicio() {
  fecha_inicio.value = `${ejercicio_fiscal.value}-${('0' + mes.value.id).slice(
    -2
  )}-01`
}
function obtener_fecha_fin() {
  fecha_fin.value = `${ejercicio_fiscal.value}-${('0' + mes.value.id).slice(
    -2
  )}-${dia_corte_final.value}`
}

function onChangeMes(mes) {
  console.log('Cambiando mes', mes.id)
  obtenerListaRegistros()
}
function onChangeEjercicio(ejercicio_fiscal) {
  console.log('cambio de ejercicio', ejercicio_fiscal)
  obtenerListaRegistros()
}
/**
 * Lista de registros de la tarjeta
 */
function obtenerListaRegistros() {
  const fechaInicio = `${ejercicio_fiscal.value}-${(
    '0' + mes_inicial_id.value
  ).slice(-2)}-01`
  const fechaFin = `${ejercicio_final_id.value}-${(
    '0' + mes_final_id.value
  ).slice(-2)}-${dia_corte_final.value}`
  // console.log('fechaInicio', fechaInicio)
  // console.log('fechaFin', fechaFin)
  cargaListaRegistros(
    null,
    {
      categoriaId: null,
      cuentaId: route.params.id,
      fechaInicio,
      fechaFin,
      isMsi: null
    },
    graphqlOptions
  )
}

function importarMovimientos() {
  showFormCarga.value = true
}
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

function mesesSinInteres(item) {
  showFormMSI.value = true
  editRegistroItem.value = item.row
}

function saveObs(props) {
  console.log('actualizando.....', props)
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

function registroCreated(registro) {
  console.log('El registro fue guardardo correctamente', registro)
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
function itemsSaved() {
  showFormCarga.value = false
  loadOrRefetchListaRegistros()
}
function loadOrRefetchListaRegistros() {
  cargaListaRegistros() || refetchListaRegistros()
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
    name: 'tipomovimeinto',
    label: 'TMovId',
    field: 'registrableType',
    sortable: true,
    align: 'left',
    style: 'width: 10%'
  },
  {
    name: 'categoria',
    label: 'Concepto',
    field: (row) => row.categoria.nombre,
    sortable: true,
    align: 'left',
    style: 'width:30%'
  },
  {
    name: 'importe',
    label: 'Importe',
    field: 'importe',
    sortable: true,
    align: 'right',
    format: (val, row) => formato.toCurrency(val),
    style: 'width:15%;color: red'
  },
  {
    name: 'observaciones',
    label: 'Observaciones',
    field: 'observaciones',
    sortable: true,
    align: 'left',
    style: 'width: 40%'
  },
  {
    name: 'tarjetaCredito',
    label: 'Tarjeta de Crédito',
    field: (row) => row.registroTarjeta?.cuenta.nombre,
    sortable: true,
    align: 'left',
    style: 'width: 40%'
  },
  {
    name: 'tarjetaCredito',
    label: 'Tarjeta de Crédito',
    field: (row) => row.registroTarjeta?.fecha,
    sortable: true,
    align: 'left',
    style: 'width: 40%',
    format: (val, row) => (val ? formato.formatoFechaFromISO(val) : '')
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
  font-family: 'Cousine', monospace;
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: -0.025rem;
  color: #813333;
  &-importante {
    font-family: 'Cousine', monospace;
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
.registros__columna--importe {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: -0.025rem;
}

.table-title {
  font-family: 'Raleway', sans-serif;
  font-weight: 500;
  font-feature-settings: 'lnum';
  font-size: 1.4rem;
  color: #212934;
  letter-spacing: -0.035rem;
}
</style>
