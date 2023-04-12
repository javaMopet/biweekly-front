<template>
  <div class="column">
    <q-list borderless>
      <q-item clickable v-ripple to="/movimientos">
        <q-item-section avatar>
          <q-icon color="primary" name="dashboard" />
        </q-item-section>
        <q-item-section>Dashboard</q-item-section>
      </q-item>
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
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import { exportFile } from 'quasar'
import { useRouter } from 'vue-router'

const $router = useRouter()

const file = ref([])

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
