<template>
  <q-card class="my-card" flat>
    <!-- <div class="column justify-center items-center">ESTADISTICAS</div> -->
    <!-- <q-toolbar>
      <PeriodoSelect></PeriodoSelect>
      <q-toolbar-title> Toolbar </q-toolbar-title>
      <q-btn flat round dense icon="apps" class="q-mr-xs" />
      <q-btn flat round dense icon="more_vert" />
    </q-toolbar> -->
    <q-card-section>
      <div>
        <q-splitter v-model="splitterModel" style="height: 750px">
          <template v-slot:before>
            <q-tabs
              v-model="tab"
              vertical
              class="text-"
              @update:model-value="cambioDeTab"
              active-color="secondary"
            >
              <q-tab name="both" icon="analytics" label="Ingresos - Egresos" />
              <q-tab name="ingresos" icon="trending_up" label="INGRESOS" />
              <q-tab name="egresos" icon="trending_down" label="EGRESOS" />
            </q-tabs>
          </template>

          <template v-slot:after>
            <q-tab-panels
              v-model="tab"
              animated
              swipeable
              vertical
              transition-prev="jump-up"
              transition-next="jump-up"
            >
              <q-tab-panel name="both">
                <div class="column q-gutter-x-lg">
                  <div class="text-h6">Ingresos - Egresos</div>
                  <Bar
                    :data="dataBar"
                    :options="options"
                    aria-label="mititulo"
                    v-if="loaded"
                  />
                  <!-- </div> -->
                </div>
              </q-tab-panel>

              <q-tab-panel name="ingresos">
                <div class="column">
                  <div class="text-h6">Ingresos</div>
                  <div
                    class="column"
                    style="border: 0px solid red; height: 600px"
                  >
                    <Doughnut
                      :data="dataDoughnutIngresos"
                      :options="doughnutOptions"
                      :style="doughnutStyle"
                      v-if="ingresoDataLoaded"
                    />
                    <div class="row">
                      Top
                      <ul>
                        <li>1 - Sueldo Mensual $50,000</li>
                        <li>2 - Sueldo Quincenal $40,000</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </q-tab-panel>

              <q-tab-panel name="egresos">
                <!-- <div class="text-h6">Egresos</div> -->
                <div
                  class="column"
                  style="border: 0px solid red; height: 700px"
                >
                  <Doughnut
                    :data="dataDoughnutEgresos"
                    :options="doughnutOptions"
                    :style="doughnutStyle"
                    v-if="egresoDataLoaded"
                  />
                  <div class="row">
                    Top
                    <ul>
                      <li>1 - Crédito Hipotecario $50,000</li>
                      <li>2 - Taos $40,000</li>
                    </ul>
                  </div>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </template>
        </q-splitter>
      </div>
    </q-card-section>
    <!-- <q-card-section>
      <pre>{{ dataDoughnutIngresos }}</pre>
    </q-card-section> -->
  </q-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from 'src/boot/axios'
import { exportFile } from 'quasar'
import { useRouter } from 'vue-router'
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar, Doughnut } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const $router = useRouter()

const file = ref([])

const loaded = ref(false)
const ingresoDataLoaded = ref(false)
const egresoDataLoaded = ref(false)
const tab = ref('mails')
const splitterModel = ref(20)

const dataBar = ref({
  labels: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ],
  datasets: [
    {
      label: 'Ingresos',
      backgroundColor: ['#acbdaa'],
      data: Array(12).fill(0)
    },
    {
      label: 'Egresos',
      backgroundColor: ['#f87979'],
      data: Array(12).fill(0)
    }
  ]
})

onMounted(() => {})

function obtenerDataSetIngresosEgresos() {
  api
    .get('/stats/ingresos_egresos_dataset')
    .then(({ data }) => {
      const ingresosData = Array(12).fill(0)
      const egresosData = Array(12).fill(0)

      data.data.forEach((record) => {
        const monthIndex = record.mes - 1 // Adjust to 0-based index
        if (record.tipo_movimiento_id === 1) {
          // Assuming 1 is for 'Ingresos'
          ingresosData[monthIndex] = record.importe
        } else if (record.tipo_movimiento_id === 2) {
          // Assuming 2 is for 'Egresos'
          egresosData[monthIndex] = record.importe
        }
      })

      dataBar.value.datasets[0].data = ingresosData
      dataBar.value.datasets[1].data = egresosData
      loaded.value = true
    })
    .catch((error) => {
      console.error(error)
    })
}

const dataDoughnutIngresos = ref({
  labels: [],
  datasets: [
    {
      backgroundColor: [],
      data: []
    }
  ]
})
const dataDoughnutEgresos = ref(
  {
    labels: [],
    datasets: [
      {
        backgroundColor: [],
        data: []
      }
    ]
  },
  {
    pieceLabel: {
      mode: 'percentage',
      precision: 1
    }
  }
)
const options = ref({
  responsive: true
})
const doughnutOptions = ref({
  responsive: true,
  layout: {
    padding: {
      left: 10,
      right: 40
    }
  },
  plugins: {
    legend: {
      position: 'left',
      labels: {
        font: {
          size: 12,
          family: 'DM Sans',
          style: 'bold'
        }
      }
      // subtitle: {
      //   display: true,
      //   text: 'Custom Chart Subtitle',
      //   padding: {
      //     top: 10,
      //     bottom: 30
      //   }
      // },
      // title: {
      //   display: true,
      //   text: 'Custom Chart Title',
      //   padding: {
      //     top: 10,
      //     bottom: 30
      //   }
      // }
    },
    tooltip: {
      bodyAlign: 'right'
      //   callbacks: {
      //     label: function (context) {
      //       let label = context.dataset.label || ''

      //       if (label) {
      //         label += ': '
      //       }
      //       if (context.parsed.y !== null) {
      //         label += new Intl.NumberFormat('en-US', {
      //           style: 'currency',
      //           currency: 'USD'
      //         }).format(context.parsed.y)
      //       }
      //       return label
      //     }
      //   }
      // },
      // pieceLabel: {
      //   mode: 'percentage',
      //   precision: 1
    }
  }
})

const doughnutStyle = computed({
  get() {
    return {
      width: `350px`,
      height: `350px`,
      position: 'relative'
    }
  }
})

function cambioDeTab(value) {
  switch (value) {
    case 'both':
      obtenerDataSetIngresosEgresos()
      break
    case 'ingresos':
      obtenerIngresosDataSet()
      break
    case 'egresos':
      obtenerEgresosDataSet()
      break
  }
}
function obtenerIngresosDataSet() {
  ingresoDataLoaded.value = false
  api
    .get('/stats/ingresos_dataset')
    .then(({ data }) => {
      const labels = []
      const colors = []
      const importes = []
      data.retorno.forEach((record, index) => {
        labels[index] = record.categoria
        colors[index] = record.color
        importes[index] = record.importe
      })

      dataDoughnutIngresos.value.labels = labels
      dataDoughnutIngresos.value.datasets[0].backgroundColor = colors
      dataDoughnutIngresos.value.datasets[0].data = importes

      ingresoDataLoaded.value = true
    })
    .catch((error) => {
      console.error(error)
    })
}
function obtenerEgresosDataSet() {
  egresoDataLoaded.value = false
  api
    .get('/stats/egresos_dataset')
    .then(({ data }) => {
      const labels = []
      const colors = []
      const importes = []
      data.retorno.forEach((record, index) => {
        labels[index] = record.categoria
        colors[index] = record.color
        importes[index] = record.importe
      })

      dataDoughnutEgresos.value.labels = labels
      dataDoughnutEgresos.value.datasets[0].backgroundColor = colors
      dataDoughnutEgresos.value.datasets[0].data = importes

      egresoDataLoaded.value = true
    })
    .catch((error) => {
      console.error(error)
    })
}

const showFile = () => {
  console.log(file.value)
}
function obtenerPdf() {
  console.log('obteniendo el pdf')
  api
    .get('/pages/home')
    .then((response) => {
      // window.open(URL.createObjectURL(response.data));
      // var fileURL = window.URL.createObjectURL(new Blob([response.data]));
      // var fileLink = document.createElement("a");
      // fileLink.href = fileURL;
      // fileLink.setAttribute("download", "reporte.pdf");
      // document.body.appendChild(fileLink);
      // fileLink.click();
      const status = exportFile('file.pdf', response.data, {
        encoding: 'utf-8',
        mimeType: 'application/pdf'
      })
      if (status === true) {
        console.log('browser allowed it')
      }
    })
    .catch((error) => {
      console.error(error)
    })
}
</script>
<style lang="scss" scoped>
div {
  color: $dark;
  font-weight: bold;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  background-color: $primary-light;
}
</style>
