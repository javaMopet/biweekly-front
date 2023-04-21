<template>
  <q-card
    class="my-card no-shadow no-border"
    flat
    style="width: 920px; min-width: 920px"
  >
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

    <!-- <q-card-section>
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <div class="">
          <DateInput
            v-model="dateForm"
            lbl_field="Fecha"
            :opcional="false"
          ></DateInput>
          <PriceInput v-model="importe" :opcional="false"></PriceInput>
        </div>
        <div class="">

        </div>
        <div align="center">
          <q-btn label="Agregar" type="submit" color="accent" />
        </div>
      </q-form>
    </q-card-section> -->
    <q-card-section class="no-border">
      <q-table
        :rows="listaIngresos"
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
        <template #body-cell-fecha="props">
          <q-td>
            <DateInput
              v-model="props.row.registro.fecha"
              lbl_field="Fecha"
              :opcional="false"
            ></DateInput>
          </q-td>
        </template>
        <template #body-cell-importe="props">
          <q-td>
            <PriceInput
              v-model="props.row.registro.importeString"
              :opcional="true"
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
            />
          </q-td>
        </template>
        <template #body-cell-cuenta="props">
          <q-td style="width: 200px">
            <CuentaSelect v-model="props.row.cuenta"></CuentaSelect>
          </q-td>
        </template>
        <template #body-cell-acciones="props">
          <q-td style="width: 200px">
            <q-btn color="info" flat icon="save" @click="saveItem(props.row)" />
            <q-btn
              color="contrast"
              flat
              icon="edit"
              @click="saveItem(props.row)"
            />
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
import { useQuery } from '@vue/apollo-composable'
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
  // {
  //   name: 'nombre_categoria',
  //   label: 'Nombre',
  //   field: 'cuentaId',
  //   sortable: true,
  //   align: 'left'
  // },
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
    name: 'observaciones',
    label: 'Observaciones',
    field: 'observaciones',
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
    name: 'acciones',
    label: 'Acciones',
    field: '',
    sortable: false,
    align: 'center'
  }
]

function addItem(props) {
  console.log('props', props)
}
/**
 * graphql
 */
const graphql_options = ref({
  fetchPolicy: 'network-only'
})
const { result: resultListaIngresos, onError: onErrorListaIngresos } = useQuery(
  OBTENER_INGRESOS,
  {
    categoriaId: props.categoria.id,
    fechaInicio: props.categoria.fecha_inicio,
    fechaFin: props.categoria.fecha_fin
  },
  graphql_options
)
const { result: resultListaEgresos, onError: onErrorListaEgresos } = useQuery(
  OBTENER_EGRESOS,
  {
    categoriaId: props.categoria.id,
    fechaInicio: props.categoria.fecha_inicio,
    fechaFin: props.categoria.fecha_fin
  },
  graphql_options
)
onErrorListaIngresos((error) => {
  console.error('error', error)
})
onErrorListaEgresos((error) => {
  console.error('error', error)
})
/**
 * computed
 */
const listaIngresos = computed({
  get() {
    return resultListaIngresos.value?.obtenerIngresos ?? []
  }
})
const listaEgresos = computed({
  get() {
    return resultListaEgresos.value?.obtenerEgresos ?? []
  }
})

/**
 * Buscar movimientos de acuerdo a la categoria y perido ingresados como propiedades
 */
function buscarMovimientos() {
  console.log('')
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
function saveItem(item) {
  console.log('Saving item', item)
}
</script>

<style lang="scss" scoped></style>
