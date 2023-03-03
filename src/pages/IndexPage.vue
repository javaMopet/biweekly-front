<template>
  <q-page class="flex flex-center"> Indice </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import { exportFile } from 'quasar'

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
