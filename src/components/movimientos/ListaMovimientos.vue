<template>
  <q-card
    class="my-card no-shadow no-border"
    flat
    style="width: 920px; min-width: 980px; border: 0px solid red"
  >
    <q-card-section
      class="bg-main-menu row inline fit q-py-sm justify-between items-center"
    >
      <div class="row items-center q-gutter-x-md">
        <q-avatar
          size="38px"
          font-size="23px"
          text-color="white"
          :icon="categoria.icono"
          :style="`background-color: ${categoria.color} !important`"
        />
        <div class="text-subtitle1 text-accent-light">
          {{ categoria.nombre }}
        </div>
      </div>
      <div class="">
        <q-btn
          round
          flat
          dense
          icon="close"
          class="float-right"
          color="accent"
          v-close-popup
          vertical-top
        ></q-btn>
      </div>
      <!-- <pre>{{ categoria }}</pre> -->
    </q-card-section>
    <transition name="fade">
      <div class="row bg-pink-1" v-if="errorsList.length > 0">
        <div class="column">
          <div class="row q-gutter-x-md q-pl-sm q-pt-sm">
            <q-icon name="warning" size="1.5rem" color="negative" />
            <span class="text-caption text-dark"
              >Los datos ingresados contienen errores:</span
            >
          </div>
          <q-list dense>
            <q-item
              :inset-level="0.5"
              dense
              v-for="error in errorsList"
              :key="error.code"
            >
              <q-item-section
                avatar
                dense
                style="min-width: 25px !important; width: 25px !important"
              >
                <q-icon color="primary" name="arrow_right" />
              </q-item-section>
              <q-item-section class="errors__list--subtitle">{{
                error.message
              }}</q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </transition>
    <q-card-section style="border: 0px solid red">
      <q-table
        style="width: 100%; border: 0px solid red"
        :rows="listaRegistros"
        :columns="columns"
        row-key="name"
        :rows-per-page-options="[0]"
        hide-pagination
        hide-header
        dense
        separator="none"
        flat
        table-class="myClass"
      >
        <template #body-cell-estatus="props">
          <q-td class="" style="border: 0px solid red">
            <q-icon
              v-if="props.row.saved"
              name="done"
              color="positive"
              size="20px"
            />
            <q-icon v-else name="close" color="negative" size="20px" />
          </q-td>
        </template>
        <template #body-cell-fecha="props">
          <q-td style="width: 150px" class="bg-white">
            <DateInput
              v-model="props.row.registro.fecha"
              lbl_field="Fecha"
              :optional="false"
              :rango-fecha-inicio="categoria.fecha_inicio_formato"
              :rango-fecha-fin="categoria.fecha_fin_formato"
              v-if="!props.row.saved"
            ></DateInput>
            <!-- v-model="props.row.registro.fecha_formato" -->
            <q-item-label v-else>{{ props.row.registro.fecha }}</q-item-label>
          </q-td>
        </template>
        <template #body-cell-importe="props">
          <q-td style="width: 160px">
            <PriceInput
              v-model="props.row.registro.importe"
              :readonly="props.row.saved"
              :autofocus="true"
            ></PriceInput>
          </q-td>
          <!-- " -->
        </template>
        <template #body-cell-cuenta="props">
          <q-td style="width: 240px; min-width: 240px; max-width: 240px">
            <CuentaSelect
              v-model="props.row.registro.cuenta"
              :agregar="false"
              :readonly="props.row.saved"
            ></CuentaSelect>
          </q-td>
          <!-- :is-valid="isCuentaValida(props.row.cuentaValida)" -->
        </template>
        <template #body-cell-observaciones="props">
          <q-td>
            <q-input
              v-model="props.row.registro.observaciones"
              type="textarea"
              label="observaciones"
              dense
              outlined
              color="secondary"
              :readonly="props.row.saved"
              rows="1"
              lazy-rules
            />
          </q-td>
        </template>
        <template #body-cell-acciones="props">
          <q-td
            class=""
            style="width: 110px; height: 50px; border: 0px solid green"
            :props="props"
          >
            <div class="row inline items-start justify-start">
              <div class="col justify-start items-start">
                <q-btn
                  v-if="props.row.saved"
                  color="contrast"
                  flat
                  icon="edit"
                  @click="editItem(props.row)"
                />
                <q-btn
                  v-else
                  color="info"
                  flat
                  icon="save"
                  @click="saveItem(props.row)"
                />
              </div>
              <div class="col">
                <q-btn
                  color="negative"
                  icon="delete"
                  flat
                  @click="deleteItem(props)"
                />
              </div>
            </div>
          </q-td>
        </template>
        <!-- <template #bottom="props">
          <div class="col" align="right" style="border: 0px solid red">
            <q-btn
              color="secondary"
              icon="add"
              @click="addItem(props)"
              dense
              push
              class="shadow-3"
            />
          </div>
        </template> -->
      </q-table>
    </q-card-section>
    <q-card-section>
      <!-- <pre>{{ listaRegistros }}</pre> -->
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DateInput from '../formComponents/DateInput.vue'
import { DateTime } from 'luxon'
import { OBTENER_INGRESOS } from 'src/graphql/ingresos'
import { OBTENER_EGRESOS } from 'src/graphql/egresos'
import { CATEGORIA_BY_ID } from 'src/graphql/categorias'
import { useLazyQuery, useQuery } from '@vue/apollo-composable'
import PriceInput from '../formComponents/PriceInput.vue'
import { useFormato } from 'src/composables/utils/useFormato'
import CuentaSelect from '../formComponents/CuentaSelect.vue'
import { useRegistrosCrud } from 'src/composables/useRegistrosCrud'
import { routerViewLocationKey } from 'vue-router'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { ErrorLink } from '@apollo/client/link/error'

/**
 * composables
 */
const formato = useFormato()
const registrosCrud = useRegistrosCrud()
const notificacion = useNotificacion()

/**
 * state
 */
const categoria = ref({})
const listaRegistros = ref([])
const errorsList = ref([])

const props = defineProps({
  cellData: {
    type: Object,
    required: true,
    default: () => {
      return {}
    }
  }
})

const emit = defineEmits(['registroCreated'])

onMounted(() => {})

const columns = [
  {
    name: 'estatus',
    label: '',
    field: '',
    sortable: true,
    align: 'left'
  },
  {
    name: 'fecha',
    label: 'Fecha',
    field: (row) => formato.formatoFecha(row.registro.fecha),
    sortable: true,
    align: 'center'
  },
  {
    name: 'importe',
    label: 'Importe',
    // field: (row) => row.registro.importe,
    sortable: true,
    align: 'left'
  },
  {
    name: 'cuenta',
    label: 'Cuenta',
    field: 'cuenta',
    sortable: true,
    align: 'left'
  },
  {
    name: 'observaciones',
    label: 'Observaciones',
    field: (row) => row.registro.observaciones,
    sortable: true,
    align: 'left'
  },
  {
    name: 'acciones',
    label: 'Acciones',
    field: '',
    sortable: false,
    align: 'center'
  }
]

function addItem() {
  const fecha = obtenerFechaDefault()
  const importe = !!categoria.value.importeDefault
    ? categoria.value.importeDefault.toString()
    : ''

  const item = {
    categoriaId: props.cellData.categoriaId,
    cuentaValida: true,
    registro: {
      estadoRegistroId: 1,
      importe,
      fecha,
      cuenta: categoria.value.cuentaDefault,
      observaciones: ''
    }
  }
  listaRegistros.value.push(item)
}

function obtenerFechaDefault() {
  const fechaInicio = DateTime.fromISO(props.cellData.fecha_inicio)
  const fechaFin = DateTime.fromISO(props.cellData.fecha_fin)
  const now = DateTime.now()
  const diff1 = now.diff(fechaInicio, ['days'])
  const diff2 = fechaFin.diff(now, ['days'])
  let fecha = null
  if (diff1 > 0 && diff2 > 0) {
    fecha = formato.dateNowToInput()
  } else {
    fecha = formato.convertDateTimeToInput(fechaInicio)
  }
  return fecha
}
/**
 * Methods
 */
const row_to_insert = ref(null)

function saveItem(row) {
  const fecha = row.registro.fecha_formato
  row.registro.importeValido = !!row.registro.importeString
  if (isInputItemValid(row)) {
    const input = {
      categoriaId: row.categoriaId,
      registro: {
        estadoRegistroId: 2,
        cuentaId: parseInt(row.registro.cuenta.id),
        importe: parseFloat(row.registro.importe),
        fecha: formato.convertDateFromInputToIso(row.registro.fecha),
        observaciones: row.observaciones
      }
    }
    row_to_insert.value = row
    saveByTipoMovimiento(input)
  }
}

function isInputItemValid(row) {
  errorsList.value.length = 0
  if (!row.registro.fecha) {
    addError(1, 'Favor de ingresar la fecha del registro')
  }
  if (!row.registro.importe) {
    addError(2, 'Ingresar un importe mayo a cero')
  }
  if (!row.registro.cuenta) {
    addError(3, 'Favor de seleccionar una cuenta de gasto')
  }
  return errorsList.value.length <= 0
}
function addError(code, message) {
  errorsList.value.push({
    code,
    message
  })
}

function saveByTipoMovimiento(input) {
  switch (props.cellData.tipo_movimiento_id) {
    case '1':
      registrosCrud.createIngreso({ input })
      break
    case '2':
      registrosCrud.createEgreso({ input })
      break
    case '3':
      registrosCrud.createTransferencia({ input })
      break
    default:
      break
  }
}

registrosCrud.onDoneCreateIngreso(({ data }) => {
  afterSaveItem('Ingreso', data.ingresoCreate)
})
registrosCrud.onDoneCreateEgreso(({ data }) => {
  afterSaveItem('Egreso', data.egresoCreate)
})
function afterSaveItem(tipoRegistro, itemSaved) {
  row_to_insert.value.saved = true
  notificacion.mostrarNotificacionPositiva(`${tipoRegistro} guardado.`, 1000)
  emit('registroCreated', itemSaved)
}

registrosCrud.onErrorCreateIngreso((error) => {
  console.error(error)
})
function obtenerFechaISO(fecha_formato) {
  const date = !!fecha_formato
    ? DateTime.fromFormat(fecha_formato, 'dd/MM/yyyy')
    : null
  return date?.toISODate()
}
function editItem(row) {
  row.saved = false
}

function deleteItem(item) {
  // console.log('item', item)
  // console.log('item index', item.rowIndex)
}

function validarPrecio(value) {
  // console.log('validar precio', value)
}
/**
 * graphql
 */
const graphql_options = ref({
  fetchPolicy: 'network-only'
})

const {
  result: resultCategoria,
  onError: onErrorCategoriaById,
  onResult: onResultCategoriaById
} = useQuery(
  CATEGORIA_BY_ID,
  {
    id: props.cellData.categoriaId
  },
  graphql_options
)

const {
  onError: onErrorListaIngresos,
  onResult: onResultListaIngresos,
  load: cargaListaIngresos
} = useLazyQuery(
  OBTENER_INGRESOS,
  {
    categoriaId: props.cellData.categoriaId,
    fechaInicio: props.cellData.fecha_inicio,
    fechaFin: props.cellData.fecha_fin
  },
  graphql_options
)
const {
  onError: onErrorListaEgresos,
  onResult: onResultListaEgresos,
  load: cargaListaEgresos
} = useLazyQuery(
  OBTENER_EGRESOS,
  {
    categoriaId: props.cellData.categoriaId,
    fechaInicio: props.cellData.fecha_inicio,
    fechaFin: props.cellData.fecha_fin,
    cuentaId: null
  },
  graphql_options
)

onResultListaIngresos(({ data }) => {
  // console.log('data ingresos', data.obtenerIngresos)
  if (data.obtenerIngresos.length > 0) {
    listaRegistros.value = JSON.parse(JSON.stringify(data.obtenerIngresos))
    listaRegistros.value.forEach((element) => {
      element.registro.fecha_formato = formato.formatoFechaFromISO(
        element.registro.fecha
      )
      element.saved = true
    })
  } else {
    addItem()
  }
})

onResultListaEgresos(({ data }) => {
  // console.log('data egresos', data.obtenerEgresos)
  if (data.obtenerEgresos.length > 0) {
    listaRegistros.value = JSON.parse(JSON.stringify(data.obtenerEgresos))
    listaRegistros.value.forEach((element) => {
      element.registro.fecha_formato = formato.formatoFechaFromISO(
        element.registro.fecha
      )
      element.registro.importeString = element.registro.importe.toString()
      element.saved = true
    })
  } else {
    addItem()
  }
})

onResultCategoriaById(({ data }) => {
  // console.log('data', data)
  categoria.value = data.categoriaById
  buscarMovimientos()
})

onErrorListaIngresos((error) => {
  console.error('error', error)
})

onErrorListaEgresos((error) => {
  console.error('error', error)
})

onErrorCategoriaById((error) => {
  console.error('error', error)
})

/**
 * computed
 */
// const importeValido = ref(true)

const isImporteValido = (importeValido) => {
  return importeValido
}
const isCuentaValida = (cuentaValida) => {
  return cuentaValida
}

// const listaRegistros = computed({
//   get() {
//     const listaRetorno =
//       props.categoria.tipo_movimiento_id === '1'
//         ? resultListaIngresos.value?.obtenerIngresos ?? []
//         : resultListaEgresos.value?.obtenerEgresos ?? []

//     listaRetorno.forEach((element) => {
//       element.registro.fecha_formato = formato.formatoFechaFromISO(
//         element.registro.fecha
//       )
//       element.registro.date = DateTime.fromISO(element.registro.fecha)
//       element.saved = true
//     })
//     return listaRetorno
//   }
// })
// const listaEgresos = computed({
//   get() {
//     return resultListaEgresos.value?.obtenerEgresos ?? []
//   }
// })

/**
 * Buscar movimientos de acuerdo a la categoria y perido ingresados como propiedades
 */
function buscarMovimientos() {
  switch (props.cellData.tipo_movimiento_id) {
    case '1':
      cargaListaIngresos()
      break
    case '2':
      cargaListaEgresos()
      break
    default:
      break
  }
}
</script>

<style lang="scss" scoped>
.myClass {
  &:hover {
    background-color: white;
  }
}
.errors__list--subtitle {
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: -0.025rem;
}
/**
* transition fade
 */
.fade-enter-from {
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}
.fade-enter-active {
  transition: all 2s ease;
}
.fade-leave-from {
  opacity: 1;
}
.fade-leave-to {
  opacity: 0;
}
.fade-leave-active {
  transition: all 0.5s ease-out;
}
</style>
