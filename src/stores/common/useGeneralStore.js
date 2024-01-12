import { DateTime } from 'luxon'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGeneralStore = defineStore('useGeneralStore', () => {
  const meses = ref([
    { id: 1, nombre: 'Enero' },
    { id: 2, nombre: 'Febrero' },
    { id: 3, nombre: 'Marzo' },
    { id: 4, nombre: 'Abril' },
    { id: 5, nombre: 'Mayo' },
    { id: 6, nombre: 'Junio' },
    { id: 7, nombre: 'Julio' },
    { id: 8, nombre: 'Agosto' },
    { id: 9, nombre: 'Septiembre' },
    { id: 10, nombre: 'Octubre' },
    { id: 11, nombre: 'Noviembre' },
    { id: 12, nombre: 'Diciembre' }
  ])

  const anios = ref([])

  const inicio = 2023
  const fin = DateTime.now().year

  for (let index = inicio; index <= fin; index++) {
    anios.value.push(index)
  }
  return { meses, anios }
})
