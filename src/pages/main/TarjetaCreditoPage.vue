<template>
  <q-card class="my-card">
    <q-card-section>
      <div>tarjeta id: {{ route.params.id }}</div>
      <q-table
        title="Table Title"
        :rows="listaRegistrosTarjeta"
        :columns="columns"
        row-key="name"
        dense
      >
        <template #top-left>
          <q-btn
            color="primary"
            icon="add"
            label="Nuevo Registro"
            outline
            @click="addRow"
          />
        </template>
        <!-- <template #body-cell-categoria="props">
          <q-td :props="props">
            <q-select
              v-model="props.row.categoria"
              :options="categoriaOptions"
              label="Standard"
              filled
            />
          </q-td>
        </template> -->
        <template #body-cell-acciones="props">
          <q-td :props="props" fit class="bg-white">
            <q-btn
              icon="edit"
              size="md"
              dense
              @click="editRow(props)"
              rounded
              color="dark"
              flat
            />
            <q-btn
              icon="delete"
              size="md"
              class="q-ml-sm"
              color="accent"
              rounded
              dense
              @click="deleteRow(props)"
              flat
            />
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>

  <Teleport to="#modal">
    <q-dialog v-model="showForm" persistent>
      <RegistroMovimientoTarjeta></RegistroMovimientoTarjeta>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import { DateTime } from 'luxon'
import RegistroMovimientoTarjeta from 'src/components/tarjetasCredito/RegistroMovimientoTarjeta.vue'

const route = useRoute()

/**
 * state
 */
const listaRegistrosTarjeta = ref([])
const categoriaOptions = ref([])
const showForm = ref(false)

/**
 * computed
 */
const registrosTarjeta = computed({
  get() {
    return []
  }
  // set() {}
})
/**
 * functions
 */
function addRow() {
  const item = { ...defaultItem }
  showForm.value = true
  // listaRegistrosTarjeta.value.push(item)
}

function deleteRow(props) {
  const rowIndex = props.rowIndex

  listaRegistrosTarjeta.value.splice(rowIndex, 1)
}

const defaultItem = {
  fecha: DateTime.now,
  concepto: '',
  categoria: {},
  importe: 0.0
}

const columns = [
  { name: 'id', label: 'Id', field: 'id', sortable: true, align: 'left' },
  {
    name: 'fecha',
    label: 'Fecha',
    field: 'fecha',
    sortable: true,
    align: 'left',
    filter: false
  },
  {
    name: 'concepto',
    label: 'Concepto',
    field: 'concepto',
    sortable: true,
    align: 'left',
    filter: true
  },
  {
    name: 'categoria',
    label: 'Categoria',
    field: 'categoria',
    sortable: true,
    align: 'left'
  },
  {
    name: 'importe',
    label: 'Importe',
    field: 'importe',
    sortable: true,
    align: 'left'
  },
  {
    name: 'acciones',
    label: '',
    field: 'action',
    sortable: false,
    align: 'center'
  }
]
</script>

<style lang="scss" scoped></style>
