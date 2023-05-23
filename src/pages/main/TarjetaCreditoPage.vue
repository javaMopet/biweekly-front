<template>
  <q-card class="my-card">
    <!-- <q-toolbar class="bg-purple text-white">
      <q-btn-dropdown stretch flat label="Dropdown">
        <q-list>
          <q-item-label header>Folders</q-item-label>
          <q-item
            v-for="n in 3"
            :key="`x.${n}`"
            clickable
            v-close-popup
            tabindex="0"
          >
            <q-item-section avatar>
              <q-avatar icon="folder" color="secondary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Photos</q-item-label>
              <q-item-label caption>February 22, 2016</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" />
            </q-item-section>
          </q-item>
          <q-separator inset spaced />
          <q-item-label header>Files</q-item-label>
          <q-item
            v-for="n in 3"
            :key="`y.${n}`"
            clickable
            v-close-popup
            tabindex="0"
          >
            <q-item-section avatar>
              <q-avatar icon="assignment" color="primary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Vacation</q-item-label>
              <q-item-label caption>February 22, 2016</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="info" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-toolbar> -->
    <q-card-section>
      <q-btn
        color="primary"
        label="Cargar movimientos"
        @click="cargarMovimientos"
        flat
      />
      <div>tarjeta id: {{ route.params.id }}</div>

      <!-- @update:model-value="cargarExcel" -->
      <!-- <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <q-table
            :rows="registroEditedItem"
            :columns="columns"
            row-key="name"
            dense
            hide-bottom
            hide-header
            hide-no-data
            class="no-border"
            flat
          >
            <template #body-cell-fecha="props">
              <q-td :props="props">
                <DateInput v-model="props.row.fecha"></DateInput>
              </q-td>
            </template>
            <template #body-cell-concepto="props">
              <q-td :props="props">
                <q-input
                  v-model="props.row.concepto"
                  type="textarea"
                  label="Concepto"
                  rows="1"
                  outlined
                  dense
                  lazy-rules
                  :rules="[(val) => !!val || 'Favor de ingresar el concepto']"
                />
              </q-td>
            </template>
            <template #body-cell-categoria="props">
              <q-td :props="props">
                <CategoriaSelect
                  v-model="props.row.categoria"
                  :readonly="true"
                ></CategoriaSelect>
              </q-td>
            </template>
            <template #body-cell-importe="props">
              <q-td :props="props">
                <PriceInput v-model="props.row.importe"></PriceInput>
              </q-td>
            </template>
            <template #body-cell-acciones="props">
              <q-td :props="props" fit class="bg-white">
                <q-btn icon="add" type="submit" color="primary" outline round />
              </q-td>
            </template>
          </q-table>
        </div>
        <div>
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form> -->
    </q-card-section>
  </q-card>

  <Teleport to="#modal">
    <q-dialog v-model="showForm" persistent>
      <RegistroMovimientoTarjeta></RegistroMovimientoTarjeta>
    </q-dialog>
  </Teleport>
  <Teleport to="#modal">
    <q-dialog v-model="showFormCarga" persistent>
      <CargaRegistrosTarjeta></CargaRegistrosTarjeta>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import { DateTime } from 'luxon'
import RegistroMovimientoTarjeta from 'src/components/tarjetasCredito/RegistroMovimientoTarjeta.vue'
import DateInput from 'src/components/formComponents/DateInput.vue'
import CategoriaSelect from 'src/components/formComponents/CategoriaSelect.vue'
import PriceInput from 'src/components/formComponents/PriceInput.vue'

import CargaRegistrosTarjeta from 'src/components/tarjetasCredito/CargaRegistrosTarjeta.vue'

const route = useRoute()

/**
 * state
 */

const registroEditedItem = ref([
  {
    concepto: 'mi concepto',
    fecha: '10/05/2013',
    importe: '500.20'
  }
])

const categoriaOptions = ref([])
const showForm = ref(false)
const showFormCarga = ref(false)

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
  const item = { ...registroEditedItem.value[0] }
  listaRegistrosTarjeta.value.push(item)
}

function onSubmit() {}

const defaultItem = {
  fecha: DateTime.now,
  concepto: '',
  categoria: {},
  importe: 0.0
}

function cargarExcel() {
  archivoExcel.value
  console.log('excel cargado', archivoExcel.value)
  const reader = new FileReader()

  reader.onload = (event) => {
    const data = event.target.result
    const workbook = read(data, { type: 'array' })
    const firstSheedName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheedName]
    const rows = XLSX.utils.sheet_to_json(worksheet)
    for (const row of rows) {
      for (const key in row) {
        console.log('data cell', row[key])
      }
    }
  }
  reader.readAsArrayBuffer(archivoExcel.value)
}

function cargarMovimientos() {
  showFormCarga.value = true
}
</script>

<style lang="scss" scoped></style>
