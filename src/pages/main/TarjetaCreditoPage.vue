<template>
  <q-card class="my-card">
    <q-toolbar class="bg-grey-2 text-primary" fit dense>
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

      <!-- <q-btn flat round dense icon="apps" class="q-mr-xs" /> -->
      <q-btn outline dense icon="more_vert" flat>
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
      </q-btn>
    </q-toolbar>
    <q-toolbar inset class="bg-grey-2" dense>
      <q-btn
        color="toolbar-button"
        text-color="white"
        label="Cargar movimientos"
        @click="cargarMovimientos"
        icon="upload"
        dense
      />
    </q-toolbar>
    <q-card-section>
      <!-- @update:model-value="cargarExcel" -->
    </q-card-section>
  </q-card>

  <Teleport to="#modal">
    <q-dialog v-model="showForm" persistent>
      <RegistroMovimientoTarjeta></RegistroMovimientoTarjeta>
    </q-dialog>
  </Teleport>
  <Teleport to="#modal">
    <q-dialog v-model="showFormCarga" persistent>
      <CargaRegistrosTarjeta :cuenta="cuenta"></CargaRegistrosTarjeta>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DateTime } from 'luxon'
import RegistroMovimientoTarjeta from 'src/components/tarjetasCredito/RegistroMovimientoTarjeta.vue'
import DateInput from 'src/components/formComponents/DateInput.vue'
import CategoriaSelect from 'src/components/formComponents/CategoriaSelect.vue'
import PriceInput from 'src/components/formComponents/PriceInput.vue'
import { api } from 'src/boot/axios'

import CargaRegistrosTarjeta from 'src/components/tarjetasCredito/CargaRegistrosTarjeta.vue'

const route = useRoute()
const router = useRouter()

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
const cuenta = ref({})
/**
 * onMounted
 */
onMounted(() => {
  console.log('buscando los datos de la tarjeta de crédito', route.params.id)
  api.get(`/cuentas/${route.params.id}`).then((response) => {
    console.log('response', response.data)
    cuenta.value = response?.data ?? {}
  })
})

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
