<template>
  <q-card class="my-card">
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
      <div class="row items-center">
        <q-icon name="print" size="35px" />
        <div class="q-ml-md text-h6">{{ categoria.nombre_categoria }}</div>
      </div>
    </q-card-section>

    <q-card-section>
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
          <!-- <PriceInput v-model="importe"></PriceInput> -->
        </div>
        <div align="center">
          <q-btn label="Agregar" type="submit" color="accent" />
        </div>
      </q-form>
    </q-card-section>
    <q-card-section>
      <q-table
        :rows="listaIngresos"
        :columns="columns"
        row-key="name"
        :rows-per-page-options="[0]"
        hide-pagination
        dense
      />
    </q-card-section>
    <pre>  {{ categoria.fecha_inicio }}</pre>
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
  {
    name: 'categoria_id',
    label: 'Id',
    field: 'id',
    sortable: true,
    align: 'left'
  },
  {
    name: 'categoria_id',
    label: 'Id',
    field: 'categoriaId',
    sortable: true,
    align: 'left'
  },
  {
    name: 'nombre_categoria',
    label: 'Nombre',
    field: 'cuentaId',
    sortable: true,
    align: 'left'
  },
  {
    name: 'columna_8',
    label: 'Columna_8',
    field: (row) => row.registro.fecha,
    sortable: true,
    align: 'left'
  },
  {
    name: 'columna_9',
    label: 'Columna_9',
    field: (row) => row.registro.importe,
    sortable: true,
    align: 'left'
  }
]

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
    return resultListaIngresos.value
      ? resultListaIngresos.value?.obtenerIngresos ?? []
      : resultListaEgresos.value?.obtenerEgresos ?? []
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
function onSubmit() {
  console.log('agregar nuevo movimiento')
}
function onReset() {}
</script>

<style lang="scss" scoped></style>
