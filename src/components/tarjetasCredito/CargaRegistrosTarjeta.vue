<template>
  <q-card class="my-card" dense style="width: 80vw; min-width: 80vw">
    <q-card-section class="bg-primary row inline fit q-py-sm justify-between">
      <div class="text-h6 text-accent">
        Movimientos de la tarjeta {{ cuenta.nombre }}
      </div>
      <div class="">
        <q-btn
          round
          flat
          dense
          icon="close"
          v-close-popup
          color="accent"
          class="btn-close"
        ></q-btn>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="column justify-between q-gutter-y-sm">
        <!-- <div class="row items-center q-gutter-x-sm">
          <span> Carga tu archivo con movimientos: </span>
        </div> -->
        <div class="row">
          <q-toolbar class="q-gutter-x-md">
            <q-file
              v-model="archivoExcel"
              label="CARGAR"
              accept=".xlsx,.xls"
              @input="updateFile"
              dense
              style="width: 250px"
              max-files="1"
              outlined
              label-color="accent"
              clearable
              bg-color="primary"
              dark
            >
              <template #prepend>
                <!-- <q-icon color="white" name="attach_file" /> -->
                <q-icon color="white" name="cloud_upload" />
                <q-separator spaced inset vertical dark />
              </template>
            </q-file>
            <q-btn
              v-if="isSelected"
              label="Eliminar"
              @click="eliminarSeleccionados"
              outline
              color="primary"
            />
          </q-toolbar>
        </div>
        <transition name="fade">
          <div class="row bg-pink-1" v-if="isErrors">
            <div class="column">
              <div class="row q-gutter-x-md q-pl-sm q-pt-sm">
                <q-icon name="warning" size="1.5rem" color="negative" />
                <span class="text-caption text-dark"
                  >El formulario contiene los siguientes errores:</span
                >
              </div>
              <q-list dense>
                <q-item :inset-level="0.5" dense>
                  <q-item-section
                    avatar
                    dense
                    style="min-width: 25px !important; width: 25px !important"
                  >
                    <q-icon color="primary" name="arrow_right" />
                  </q-item-section>
                  <q-item-section class="text-subtitle2"
                    >Debes seleccionar la categoría en todos los
                    movimientos</q-item-section
                  >
                </q-item>
              </q-list>
            </div>
          </div>
        </transition>
      </div>
    </q-card-section>
    <q-card-section style="max-height: 70vh; height: 70vh" class="scroll">
      <q-table
        :rows="listaRegistrosTarjeta"
        :columns="columns"
        :rows-per-page-options="[0]"
        row-key="consecutivo"
        dense
        selection="multiple"
        v-model:selected="registrosSelected"
      >
        <template #body-cell-categoria="props">
          <q-td :props="props">
            <CategoriaSelect
              :readonly="true"
              v-model="props.row.categoria"
              tipo-movimiento-id="2"
            ></CategoriaSelect>
          </q-td>
        </template>
        <template #body-cell-importe="props">
          <q-td :props="props">
            <span
              :class="[
                props.row.importe > 0 ? 'importe_negativo' : 'importe_positivo'
              ]"
            >
              {{ formato.toCurrency(parseFloat(props.row.importe)) }}
            </span>
          </q-td>
        </template>
        <template #body-cell-acciones="props">
          <q-td :props="props" fit class="bg-white">
            <q-btn
              icon="delete_sweep"
              size="md"
              class="q-ml-sm"
              color="negative"
              dense
              @click="deleteRow(props)"
              flat
            />
          </q-td>
        </template>
      </q-table>
    </q-card-section>

    <q-card-actions align="right">
      <div class="row">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn label="Guardar" color="primary" @click="guardarMovimientos" />
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup>
/**
 * imports
 */
import { ref, computed } from 'vue'
import { read, utils } from 'xlsx'
import CategoriaSelect from '../formComponents/CategoriaSelect.vue'
import { useFormato } from 'src/composables/utils/useFormato'
import { api } from 'src/boot/axios'
import { DateTime } from 'luxon'

/**
 * state
 */
const archivoExcel = ref(null)
const registrosSelected = ref([])
const listaRegistrosTarjeta = ref([])
const todos = ref()
const isErrors = ref(false)
/**
 * composables
 */
const formato = useFormato()
/**
 * defProperties
 */
const props = defineProps({
  cuenta: {
    type: Object,
    required: true,
    default: () => {
      return {}
    }
  }
})
/**
 *
 * @param {*} v
 */
// assuming `todos` is a standard VueJS `ref`
async function updateFile(v) {
  try {
    // `v.target.files[0]` is the desired file object
    const files = v.target.files
    if (!files || files.length == 0) return

    // read first file
    const wb = read(await files[0].arrayBuffer())
    // get data of first worksheet as an array of objects
    const rows = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
      raw: false
    })

    for (const row of rows) {
      for (const key in row) {
        console.log('data cell', row[key])
      }
    }

    // get data of first worksheet as an array of objects
    const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
      header: ['A', 'B', 'C', 'D'],
      skipHeader: true,
      raw: false
    })

    console.log('data', data)
    const monthsMap = new Map()
    monthsMap.set('Ene', '01')
    monthsMap.set('Feb', '02')
    monthsMap.set('Mar', '03')
    monthsMap.set('Abr', '04')
    monthsMap.set('May', '05')

    todos.value = data.map((row) => ({
      fecha: row.A,
      consecutivo: row.B,
      concepto: row.C,
      importe: row.D
    }))
    // console.log('datda', todos.value)
    // console.log('datda', todos.value[5])
    todos.value.forEach((row) => {
      let fecha = row.fecha.toString()
      for (const [key, value] of monthsMap) {
        // console.log(`${key}: ${value}`)
        fecha = fecha.replace(key.toString(), value.toString())
      }
      const item = {
        fecha: fecha,
        consecutivo: row.consecutivo,
        importe: row.importe,
        concepto: row.concepto,
        saved: false
      }
      listaRegistrosTarjeta.value.push(item)
    })
  } catch (e) {
    console.log(e)
  }
}

function guardarMovimientos() {
  console.log('guardando los movimeintos', listaRegistrosTarjeta.value)
  const containsErrors = validarMovimientos()
  if (containsErrors) {
    isErrors.value = true
    setTimeout(() => {
      isErrors.value = false
    }, 6000)
  } else {
    var lista_registros_tarjeta = []

    listaRegistrosTarjeta.value.forEach((item) => {
      console.log('item', item)
      console.log('fecha', item.fecha)
      const fecha = DateTime.fromFormat(item.fecha, 'dd/MM/yyyy')
      const registro = {
        estado_registro_tarjeta_id: 1, //abierto
        cuenta_id: props.cuenta.id,
        categoria_id: item.categoria.id,
        importe: parseFloat(item.importe),
        fecha: fecha.toISODate(),
        concepto: item.concepto
      }
      lista_registros_tarjeta.push(registro)
    })

    api
      .post('/create_multiple_registros_tarjeta', {
        lista_registros_tarjeta
      })
      .then((response) => {
        console.log('guardado correctamente')
        console.log('response', response)
      })
      .catch((error) => {
        console.error(error)
        console.error('esto es un error')
      })
    console.log('items guardados')
  }
}

function validarMovimientos() {
  let containsErrors = false
  containsErrors = listaRegistrosTarjeta.value.length <= 0
  listaRegistrosTarjeta.value.forEach((item) => {
    if (!item.categoria) {
      containsErrors = true
    }
  })
  return containsErrors
}
function eliminarSeleccionados() {
  console.log('eliminar seleccionados', registrosSelected.value)
  registrosSelected.value.forEach((item) => {
    var index = listaRegistrosTarjeta.value.indexOf(item)
    if (index !== -1) {
      listaRegistrosTarjeta.value.splice(index, 1)
    }
  })
}

function deleteRow(props) {
  const rowIndex = props.rowIndex

  listaRegistrosTarjeta.value.splice(rowIndex, 1)
}
/**
 * computed
 */
const isSelected = computed({
  get() {
    return registrosSelected.value.length > 0
  }
})

const columns = [
  // { name: 'id', label: 'Id', field: 'id', sortable: true, align: 'left' },
  {
    name: 'consecutivo',
    label: 'Consecutivo',
    field: 'consecutivo',
    sortable: true,
    align: 'left',
    filter: true,
    style: 'width:100px'
  },
  {
    name: 'fecha',
    label: 'Fecha',
    field: 'fecha',
    sortable: true,
    align: 'left',
    filter: false,
    style: 'width:120px'
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
    align: 'left',
    style: 'width:250px;max-width:250px'
  },
  {
    name: 'importe',
    label: 'Importe',
    field: 'importe',
    sortable: true,
    align: 'right',
    // format: (val, row) => `${formato.toCurrency(parseFloat(val))}`,
    style: 'width:200px'
  },
  {
    name: 'acciones',
    label: '',
    field: 'action',
    sortable: false,
    align: 'center',
    style: 'width:100px'
  }
]
</script>

<style lang="scss">
.btn-close {
  &:hover {
    color: $accent-light !important;
    transition: all ease-in 0.15s;
  }
}
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
.importe_negativo {
  color: red;
}
.importe_positivo {
  color: green;
}
</style>
