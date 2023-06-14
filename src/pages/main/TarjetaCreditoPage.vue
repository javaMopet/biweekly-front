<template>
  <q-card flat>
    <q-toolbar class="bg-grey-1 text-primary" fit dense>
      <!-- arrow_back_ios -->
      <q-btn
        icon="navigate_before"
        flat
        round
        @click="router.push('/tarjetas_credito')"
        dense
        size="1rem"
      />
      <span class="text-h6">{{ cuenta.nombre }}</span>

      <q-toolbar-title>
        <!-- Tarjeta de crédito {{ route.params.id }} -->
      </q-toolbar-title>

      <q-btn flat round dense icon="apps" class="q-mr-xs" />
      <!-- <q-btn outline dense icon="more_vert" flat>
        <q-menu>
          <q-list dense style="min-width: 100px">
            <q-item clickable v-close-popup>
              <q-item-section>Open...</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>New</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable>
              <q-item-section>Preferences</q-item-section>
              <q-item-section side>
                <q-icon name="keyboard_arrow_right" />
              </q-item-section>

              <q-menu anchor="top end" self="top start">
                <q-list>
                  <q-item v-for="n in 3" :key="n" dense clickable>
                    <q-item-section>Submenu Label</q-item-section>
                    <q-item-section side>
                      <q-icon name="keyboard_arrow_right" />
                    </q-item-section>
                    <q-menu auto-close anchor="top end" self="top start">
                      <q-list>
                        <q-item v-for="n in 3" :key="n" dense clickable>
                          <q-item-section>3rd level Label</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-item>
                </q-list>
              </q-menu>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup>
              <q-item-section>Quit</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn> -->
    </q-toolbar>
    <q-toolbar inset class="bg-grey-1">
      <!-- <q-btn
        outline
        rounded
        dense
        icon="upload"
        label="Importar Movimimientos"
        color="toolbar-button"
        @click="cargarMovimientos"
      /> -->
      <div class="row q-gutter-x-md">
        <q-btn-dropdown
          label="AGREGAR"
          color="primary-button"
          class=""
          no-caps
          icon="add_circle"
        >
          <q-list>
            <q-item clickable v-close-popup @click="addItem">
              <q-item-section
                avatar
                style="min-width: 45px !important; width: 45px !important"
                class="items-start"
              >
                <q-avatar
                  icon="assignment"
                  text-color="secondary"
                  outlined
                  font-size="40px"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>Nuevo registro</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="cargarMovimientos" dense>
              <q-item-section
                avatar
                style="min-width: 45px !important; width: 45px !important"
              >
                <!-- <q-icon name="format_list_bulleted" /> -->

                <q-avatar text-color="white" square>
                  <q-img src="/icons/excel.png" width="35px" height="35px" />
                </q-avatar>
                <!-- spinner-color="primary"
                spinner-size="82px"
              :ratio="16 / 9"-->
              </q-item-section>
              <q-item-section>
                <q-item-label>Importar Movimientos</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn
          icon="payments"
          color="toolbar-button"
          label="pagos"
          @click="pagosTarjeta"
          push
        />
      </div>
      <q-toolbar-title> </q-toolbar-title>
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
        <q-select
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
        </q-select>
      </div>
    </q-toolbar>
    <!-- <q-toolbar inset class="bg-grey-2 q-gutter-x-l" dense fit>
      <q-btn
        color="toolbar-button"
        text-color="white"
        label="Cargar movimientos"

        icon="upload"
        dense
      />


    </q-toolbar> -->
  </q-card>
  <q-card flat>
    <q-card-section>
      <div class="row">
        <div class="col column items-center">
          <span class="tarjeta__resumen-etiqueta"> Día de corte </span>
          <span class="tarjeta__resumen-valor"> {{ cuenta.dia_corte }}</span>
        </div>
        <q-separator spaced inset vertical />
        <div class="col column items-center">
          <span class="tarjeta__resumen-etiqueta"> Periodo </span>
          <span class="tarjeta__resumen-valor">
            {{ periodoInicio }} - {{ periodoFin }}</span
          >
        </div>
        <q-separator spaced inset vertical />
        <div class="col column items-center">
          <span class="tarjeta__resumen-etiqueta">
            Saldo del periodo anterior
          </span>
          <span class="tarjeta__resumen-valor">
            {{ formato.toCurrency(saldo_anterior) }}</span
          >
        </div>
        <!-- <q-separator spaced inset vertical />
        <div class="col column items-center">
          <span class="tarjeta__resumen-etiqueta"> Suma movimientos </span>
          <span class="tarjeta__resumen-valor">
            {{ formato.toCurrency(sumaMovimientos) }}</span
          >
        </div> -->
      </div>
      <q-separator spaced inset horizontal />
      <div class="row">
        <div class="col column items-center">
          <span class="tarjeta__resumen-etiqueta">
            Suma de movimientos de meses sin intereses
          </span>
          <span class="tarjeta__resumen-valor">
            {{ formato.toCurrency(suma_msi) }}</span
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
        <q-separator spaced inset vertical />
        <div class="col column items-center">
          <span class="tarjeta__resumen-etiqueta"> Saldo Final </span>
          <span class="tarjeta__resumen-valor">
            {{ formato.toCurrency(saldo_final) }}
          </span>
        </div>
        <q-separator spaced inset vertical />
        <div class="col column items-center">
          <span class="tarjeta__resumen-etiqueta"> Saldo Total </span>
          <span class="tarjeta__resumen-valor">
            {{ formato.toCurrency(saldo_total) }}
          </span>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
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
                    <q-item clickable v-close-popup @click="editItem(props)">
                      <q-item-section>Editar...</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="quitarMsi(props)">
                      <q-item-section>Quitar MSI</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-close-popup>
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
        table-header-class="bg-accent text-dark"
        separator="horizontal"
        hide-bottom
      >
        <template #top-left>
          <q-tr class="cuenta__data-subtitle"> Movimientos </q-tr>
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
                    <q-item clickable v-close-popup @click="editItem(props)">
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
                    <q-item clickable v-close-popup>
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
      <CargaRegistrosTarjeta :cuenta="cuenta"></CargaRegistrosTarjeta>
    </q-dialog>
  </Teleport>
  <Teleport to="#modal">
    <q-dialog v-model="showPagosTarjeta" persistent>
      <PagosTarjeta
        :cuenta="cuenta"
        :saldo-periodo-anterior="parseFloat(saldo_anterior)"
        :suma-movimientos="parseFloat(sumaMovimientos)"
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
import { LISTA_REGISTROS_TARJETA } from 'src/graphql/registrosTarjeta'
import CargaRegistrosTarjeta from 'src/components/tarjetasCredito/CargaRegistrosTarjeta.vue'
import { useLazyQuery } from '@vue/apollo-composable'
import { useFormato } from 'src/composables/utils/useFormato'
import { useRegistrosCrud } from 'src/composables/useRegistrosCrud'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import RegistroMesesSinInteres from 'src/components/tarjetasCredito/RegistroMesesSinInteres.vue'
import { useQuasar } from 'quasar'
import PagosTarjeta from 'src/components/tarjetasCredito/PagosTarjeta.vue'

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
    cuenta.value = response?.data ?? {}
    dia_corte.value = cuenta.value.dia_corte
    obtenerSaldoAnterior()
    obtener_fecha_inicio()
    obtener_fecha_fin()
    // variables.fechaInicio = fecha_inicio.value
    // variables.fechaFin = fecha_fin.value
    cargaListaRegistros(
      null,
      {
        cuentaId: route.params.id,
        fechaInicio: fecha_inicio.value,
        fechaFin: fecha_fin.value,
        isMsi: null
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
  load: cargaListaRegistros,
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
/**
 * functions
 */
function editItem(item) {
  console.log('editando item...', item.rowIndex, item.row)
  registroEditedItem.value = JSON.parse(JSON.stringify(item.row))
  registroEditedItem.value.importe = registroEditedItem.value.importe.toString()
  console.log('fecha', registroEditedItem.value.fecha)
  registroEditedItem.value.fecha = formato.convertDateFromIsoToInput(
    registroEditedItem.value.fecha
  )
  showForm.value = true
}

function obtener_fecha_inicio() {
  fecha_inicio.value = `${ejercicio_fiscal.value}-${(
    '0' +
    (mes.value.id - 1)
  ).slice(-2)}-${cuenta.value.dia_corte}`
}
function obtener_fecha_fin() {
  fecha_fin.value = `${ejercicio_fiscal.value}-${('0' + mes.value.id).slice(
    -2
  )}-${cuenta.value.dia_corte}`
}

function obtenerSaldoAnterior() {
  const fecha = `${ejercicio_inicial_id.value}-${(
    '0' + mes_inicial_id.value
  ).slice(-2)}-${cuenta.value.dia_corte}`
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
  const fechaInicio = `${ejercicio_inicial_id.value}-${(
    '0' + mes_inicial_id.value
  ).slice(-2)}-${dia_corte_inicial.value}`
  const fechaFin = `${ejercicio_final_id.value}-${(
    '0' + mes_final_id.value
  ).slice(-2)}-${dia_corte_final.value}`
  console.log('fechaInicio', fechaInicio)
  console.log('fechaFin', fechaFin)
  cargaListaRegistros(
    null,
    {
      cuentaId: route.params.id,
      fechaInicio,
      fechaFin,
      isMsi: null
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

registroCrud.onDoneDeleteRegistro((response) => {
  notificacion.mostrarNotificacionInformativa('Registro eliminado')
  console.log('response', response)
})
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
