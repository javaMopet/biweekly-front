<template>
  <q-card
    class="my-card no-shadow no-border"
    flat
    style="width: 920px; min-width: 980px; border: 0px solid red"
  >
    <!-- <pre>{{ listaRegistros }}</pre> -->
    <pre>{{ categoriaResultado }}</pre>
    <q-card-section class="bg-dark text-white">
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
      <div class="row items-center text-accent-contrast">
        <q-icon :name="categoria.icono" size="35px" />
        <div class="q-ml-md text-h6">{{ categoria.nombre_categoria }}</div>
      </div>
    </q-card-section>
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
          <q-td style="width: 150px">
            <DateInput
              v-model="props.row.registro.fecha_formato"
              lbl_field="Fecha"
              :optional="false"
              :rango-fecha-inicio="categoria.fecha_inicio_formato"
              :rango-fecha-fin="categoria.fecha_fin_formato"
              :readonly="props.row.saved"
            ></DateInput>
          </q-td>
        </template>
        <template #body-cell-importe="props">
          <q-td style="width: 160px">
            <PriceInput
              v-model="props.row.registro.importeString"
              :opcional="true"
              :readonly="props.row.saved"
              :autofocus="true"
              :is-valid="isImporteValido(props.row.registro.importeValido)"
              @blur="validarPrecio"
            ></PriceInput>
          </q-td>
        </template>
        <template #body-cell-cuenta="props">
          <q-td style="width: 250px">
            <CuentaSelect
              v-model="props.row.cuenta"
              :agregar="false"
              :readonly="props.row.saved"
              :is-valid="isCuentaValida(props.row.cuentaValida)"
            ></CuentaSelect>
          </q-td>
        </template>
        <template #body-cell-observaciones="props">
          <q-td>
            <q-input
              v-model="props.row.observaciones"
              type="text"
              label="observaciones"
              dense
              lazy-rules
              :rules="[(val) => !!val || 'Favor de ingresar el precio.']"
              outlined
              color="secondary"
              :readonly="props.row.saved"
            />
          </q-td>
        </template>
        <template #body-cell-acciones="props">
          <q-td
            class=""
            style="width: 110px; height: 50px; border: 0px solid green"
          >
            <div class="row inline">
              <div class="col">
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
        <template #bottom="props">
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
        </template>
      </q-table>
    </q-card-section>

    <!-- <pre>  {{ categoria.fecha_inicio }}</pre> -->
    <!-- <pre>  {{ listaEgresos }}</pre> -->
    <!-- <q-card-section align="center">
      <q-btn color="positive" outline label="Cerrar" v-close-popup />
    </q-card-section> -->
  </q-card>
</template>

<script setup>
import { ref, computed, defineProps, onMounted } from 'vue'
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

/**
 * composables
 */
const formato = useFormato()
const registrosCrud = useRegistrosCrud()

/**
 * state
 */
const dateForm = ref('')
const listaRegistros = ref([])

// const fecha = computed({
//   get() {
//     return !!dateForm.value && dateForm.value != ''
//       ? dateForm.value
//       : props.categoria.fecha_inicio
//   },
//   set(val) {
//     dateForm.value = val
//   }
// })
const importe = ref('')

const props = defineProps({
  categoria: {
    type: Object,
    required: true,
    default: () => {
      return {}
    }
  }
})
onMounted(() => {
  buscarMovimientos()
  dateForm.value = props.categoria.fecha_inicio
})

const columns = [
  // {
  //   name: 'categoria_id',
  //   label: 'Id',
  //   field: 'id',
  //   sortable: true,
  //   align: 'left'
  // },
  // {
  //   name: 'categoria_id',
  //   label: 'Id',
  //   field: 'categoriaId',
  //   sortable: true,
  //   align: 'left'
  // },
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
    field: 'observaciones',
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

function addItem(props_row) {
  const fechaInicio = DateTime.fromISO(props.categoria.fecha_inicio)
  const fechaFin = DateTime.fromISO(props.categoria.fecha_fin)
  const now = DateTime.now()
  const diff1 = now.diff(fechaInicio, ['days'])
  const diff2 = fechaFin.diff(now, ['days'])
  // const diff2 = now.diff(fechaFin, ['days'])
  console.log('now', now.toISODate())
  console.log('fechaInicio', fechaInicio.toISODate())
  console.log('fechaFin', fechaFin.toISODate())
  console.log('diff1', diff1.toObject())
  console.log('diff2', diff2.toObject())
  let fecha_formato = null
  if (diff1 > 0 && diff2 > 0) {
    fecha_formato = now.toFormat('dd/MM/yyyy')
  } else {
    fecha_formato = fechaInicio.toFormat('dd/MM/yyyy')
  }

  const item = {
    categoriaId: props.categoria.id,
    cuenta: null,
    cuentaValida: true,
    observaciones: '',
    registro: {
      importe: null,
      importeString: '',
      fecha_formato,
      importeValido: true
    }
  }
  console.log('adding item0', item)
  listaRegistros.value.push(item)
}
/**
 * Methods
 */
function saveItem(row) {
  console.log('Saving item', row)
  console.log('importe', row.registro.importeString)
  console.log('cuenta', row.cuenta)
  const fecha = row.registro.fecha_formato
  const cuenta = row.cuenta ?? null
  row.registro.importeValido = !!row.registro.importeString
  row.cuentaValida = !!cuenta
  if (row.registro.importeValido && !!cuenta && !!fecha) {
    console.log('Guardando item', row)
    const input = {
      categoriaId: row.categoriaId,
      cuentaId: parseInt(cuenta.id),
      observaciones: row.observaciones,
      registro: {
        estadoRegistroId: 2,
        importe: parseFloat(row.registro.importeString),
        fecha: obtenerFechaISO(fecha)
      }
    }
    registrosCrud.createIngreso({ input })
    row.saved = true
  }
}

registrosCrud.onDoneCreateIngreso((response) => {
  console.log('saved', response)
})
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
  console.log('item', item)
  console.log('item index', item.rowIndex)
}

function validarPrecio(value) {
  console.log('validar precio', value)
}
/**
 * graphql
 */
const graphql_options = ref({
  fetchPolicy: 'network-only'
})

const { result: resultCategoria, onError: onErrorCategoriaById } = useQuery(
  CATEGORIA_BY_ID,
  {
    id: props.categoria.id
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
    categoriaId: props.categoria.id,
    fechaInicio: props.categoria.fecha_inicio,
    fechaFin: props.categoria.fecha_fin
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
    categoriaId: props.categoria.id,
    fechaInicio: props.categoria.fecha_inicio,
    fechaFin: props.categoria.fecha_fin
  },
  graphql_options
)
onResultListaIngresos(({ data }) => {
  console.log('data ingresos', data.obtenerIngresos)
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
  console.log('data egresos', data.obtenerEgresos)
  listaRegistros.value = JSON.parse(JSON.stringify(data.obtenerEgresos))
  listaRegistros.value.forEach((element) => {
    element.registro.fecha_formato = formato.formatoFechaFromISO(
      element.registro.fecha
    )
    element.saved = true
  })
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

const categoriaResultado = computed({
  get() {
    return resultCategoria.value?.categoriaById
  }
})

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
  console.log('buscando movimientos', props.categoria.tipo_movimiento_id)
  switch (props.categoria.tipo_movimiento_id) {
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

<style lang="scss" scoped></style>
