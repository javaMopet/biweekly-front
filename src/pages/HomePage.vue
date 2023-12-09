<template>
  <q-card class="my-card" flat>
    <div class="column justify-center items-center">DASHBOARD</div>
    <q-card-section>
      <div class="row q-gutter-x-lg">
        <div class="col">
          <Bar :data="dataBar" :options="options" aria-label="mititulo" />
        </div>
        <div class="col">
          <Doughnut :data="dataDoughnut" :options="options" />
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row full-width">
        <q-list borderless>
          <q-item clickable v-ripple to="/admin/categorias">
            <q-item-section avatar>
              <q-icon color="primary" name="category" />
            </q-item-section>
            <q-item-section>Categorias</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/admin/cuentas">
            <q-item-section avatar>
              <q-icon color="primary" name="wallet" />
            </q-item-section>
            <q-item-section>Cuentas</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/admin/cuentas_contables">
            <q-item-section avatar>
              <q-icon color="primary" name="list_alt" />
            </q-item-section>
            <q-item-section>Cuentas Contables</q-item-section>
          </q-item>
          <!-- <q-item clickable v-ripple>
      <q-item-section avatar>
        <q-icon color="primary" name="bluetooth" />
      </q-item-section>
      <q-item-section>Categorias</q-item-section>
    </q-item> -->
        </q-list>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
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

const mititulo = ref('asdfjalskdj aksdjf asd')

const dataBar = ref({
  labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
  datasets: [
    {
      label: 'Ingresos',
      backgroundColor: [
        '#f87979'
        // '#f85079',
        // '#AA5079',
        // '#11aabb',
        // '#acbdaa',
        // '#ba1991'
      ],
      data: [40, 20, 12, 50, 15, 35]
    },
    {
      label: 'Egresos',
      backgroundColor: [
        // '#f87979',
        // '#f85079',
        // '#AA5079',
        // '#11aabb',
        '#acbdaa'
        // '#ba1991'
      ],
      data: [100, 60, 40, 20, 30, 24]
    }
  ]
})
const dataDoughnut = ref({
  labels: ['Netflix', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
  datasets: [
    {
      backgroundColor: [
        '#f87979',
        '#f85079',
        '#AA5079',
        '#11aabb',
        '#acbdaa',
        '#ba1991'
      ],
      data: [100, 60, 40, 20, 30, 24]
    }
  ]
})
const options = ref({
  responsive: true,
  plugins: {
    title: {
      position: 'top',
      text: 'Algun titulo'
    },
    subtitle: {
      display: true,
      text: 'Custom Chart Subtitle'
    }
  }
})

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
  color: $secondary;
  font-weight: bold;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  background-color: $primary-light;
}
</style>
