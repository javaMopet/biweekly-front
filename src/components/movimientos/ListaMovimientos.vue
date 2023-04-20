<template>
  <q-card class="my-card">
    <q-card-section avatar>
      <q-icon name="print" size="35px" />
    </q-card-section>
    <q-card-section>
      <div class="text-h6">{{ categoria.nombre_categoria }}</div>
      <div class="text-subtitle2">by John Doe</div>
    </q-card-section>
    <q-card-section>
      <q-table
        title="Table Title"
        :rows="listaIngresos"
        :columns="columns"
        row-key="name"
      />
    </q-card-section>
    <q-card-section>
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <div class="">
          <DateInput v-model="fecha" lbl_field="Precio"></DateInput>
        </div>
        <div class="">
          <!-- <PriceInput v-model="importe"></PriceInput> -->
        </div>
        <div>
          <q-btn label="Submit" type="submit" color="primary" />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </q-card-section>
    <q-card-section>
      {{ categoria }}
    </q-card-section>

    <q-card-section>
      <q-btn color="primary" icon="check" label="OK" v-close-popup />
    </q-card-section>
    <pre>  {{ listaIngresos }}</pre>
    <pre>  {{ listaEgresos }}</pre>
  </q-card>
</template>

<script setup>
import { ref, computed, defineProps, onMounted } from 'vue'
import DateInput from '../formComponents/DateInput.vue'
import { DateTime } from 'luxon'
import { OBTENER_INGRESOS } from 'src/graphql/ingresos'
import { OBTENER_EGRESOS } from 'src/graphql/egresos'
import { useQuery } from '@vue/apollo-composable'

/**
 * state
 */
const fecha = ref('')
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
function onSubmit() {}
function onReset() {}
</script>

<style lang="scss" scoped></style>
