<template>
  <q-card
    class="my-card no-shadow no-border"
    flat
    style="width: 920px; min-width: 980px; border: 0px solid red"
  >
    <!-- <pre>{{ listaRegistros }}</pre> -->
    <!-- <pre>{{ categoria }}</pre> -->
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
        <div class="column q-ml-md text-h6">
          <div class="">{{ categoria.nombre_categoria }}</div>
          <div class="">{{ categoria.col.label }}</div>
        </div>
      </div>
      <!-- <pre>{{ categoria }}</pre> -->
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
        <!-- <template #top="props">
          <q-th>
            {{ props.row }}
            <q-btn
              color="secondary"
              rounded
              icon="add"
              @click="addItem(props)"
              dense
              push
            />
          </q-th>
        </template> -->
        <template #body-cell-estatus="props">
          <q-td class="row inline" style="border: 0px solid red">
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
              autofocus
            ></PriceInput>
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
        <template #body-cell-cuenta="props">
          <q-td style="width: 250px">
            <CuentaSelect
              v-model="props.row.cuenta"
              :agregar="false"
              :readonly="props.row.saved"
            ></CuentaSelect>
          </q-td>
        </template>
        <template #body-cell-acciones="props">
          <q-td
            class="row items-top justify-center"
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
import { useLazyQuery } from '@vue/apollo-composable'
import PriceInput from '../formComponents/PriceInput.vue'
import { useFormato } from 'src/composables/utils/useFormato'
import CuentaSelect from '../formComponents/CuentaSelect.vue'

/**
 * composables
 */
const formato = useFormato()

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
  console.log('props', props_row)
  const item = {
    categoriaId: props.categoria.id,
    cuenta: null,
    observaciones: '',
    registro: {
      importe: null,
      importeString: '',
      fecha: '18/04/2023',
      fecha_formato: formato.formatoFechaFromISO(props.categoria.fecha_inicio)
    }
  }
  console.log('adding item0', item)
  listaRegistros.value.push(item)
}
/**
 * graphql
 */
const graphql_options = ref({
  fetchPolicy: 'network-only'
})
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
/**
 * computed
 */
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

/**
 * Methods
 */
function fechaOptionsFn(date) {
  return date >= '2023/04/15' && date <= '2023/04/30'
}
function onSubmit() {
  console.log('agregar nuevo movimiento')
}
function onReset() {}
function saveItem(row) {
  console.log('Saving item', row)
  row.saved = true
}
function editItem(row) {
  row.saved = false
}
function deleteItem(item) {
  console.log('item', item)
  console.log('item index', item.rowIndex)
}
</script>

<style lang="scss" scoped></style>
