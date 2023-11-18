<template>
  <q-card class="my-card" style="width: 500px">
    <DialogTitle>{{ cuenta.nombre }}</DialogTitle>
    <q-card-section>
      <q-form @submit="generarPago" class="q-px-lg">
        <transition name="fade">
          <div class="row bg-pink-1" v-if="isNotPagable">
            <div class="column">
              <div class="row q-gutter-x-md q-pl-sm q-pt-sm">
                <q-icon name="warning" size="1.5rem" color="negative" />
                <span class="text-caption text-dark"
                  >No se ha realizado el cierre del periodo anterior:</span
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
                    >Saldo pendiente por un monto de
                    {{
                      formato.toCurrency(props.saldoPeriodoAnterior)
                    }}</q-item-section
                  >
                </q-item>
              </q-list>
            </div>
          </div>
        </transition>
        <q-separator spaced horizontal v-if="isNotPagable" />
        <div class="row q-mt-lg">
          <div class="col column q-mr-sm">
            <div class="row input-label">Fecha de pago:</div>
            <DateInput
              v-model="formItem.fecha"
              label="Introduce una fecha válida"
              :rules="[(val) => !!val || 'Favor de ingresar la fecha']"
            ></DateInput>
          </div>
          <div class="col column q-ml-sm">
            <div class="row input-label">Saldo del periodo:</div>
            <PriceInput
              v-model="formItem.saldo_periodo"
              :readonly="true"
              :rules="[
                (val) =>
                  (!!val && val !== '0' && val !== '$0.00') ||
                  'Favor de ingresar un valor mayor a cero'
              ]"
            ></PriceInput>
          </div>
        </div>
        <div class="column">
          <div class="row input-label">Cuenta de egreso:</div>
          <CuentaSelect
            v-model="formItem.cuenta_egreso"
            :rules="[(val) => !!val || 'Favor de ingresar la cuenta de egreso']"
          ></CuentaSelect>
        </div>
        <div align="right">
          <q-btn
            label="Cancelar"
            color="primary"
            flat
            class="q-ml-sm"
            v-close-popup
          />
          <q-btn
            label="Pagar"
            type="submit"
            color="primary-button"
            :disable="isNotPagable"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useLazyQuery } from '@vue/apollo-composable'
import CuentaSelect from '../formComponents/CuentaSelect.vue'
import DateInput from '../formComponents/DateInput.vue'
import PriceInput from '../formComponents/PriceInput.vue'
import { useFormato } from 'src/composables/utils/useFormato'
import { LISTA_REGISTROS_TARJETA } from 'src/graphql/registrosTarjeta'
import { DateTime } from 'luxon'
import { api } from 'src/boot/axios'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { SessionStorage } from 'quasar'
import DialogTitle from '../formComponents/modal/DialogTitle.vue'

/**
 * composables
 */
const notificacion = useNotificacion()
const formato = useFormato()
/**
 * graphql
 */
const graphqlOptions = reactive({
  // fetchPolicy: 'network-only'
  fetchPolicy: 'no-cache'
})
const {
  onError: onErrorListaRegistros,
  onResult: onResultListaRegistros,
  load: cargaListaRegistrosTarjeta,
  refetch: refetchListaRegistros
} = useLazyQuery(LISTA_REGISTROS_TARJETA)

/**
 * state
 */
const formItem = ref({
  fecha: '',
  cuenta_egreso: null,
  saldo_periodo: ''
})
/**
 * props
 */
const props = defineProps({
  cuenta: {
    type: Object,
    required: true
  },
  fecha_inicio: {
    type: String,
    required: true
  },
  fecha_fin: {
    type: String,
    required: true
  },
  saldoPeriodoAnterior: {
    type: Number,
    required: true
  },
  sumaMovimientos: {
    type: Number,
    required: true
  }
})
/**
 * emits
 */
const emit = defineEmits(['itemsSaved'])
/**
 * onMounted
 */
onMounted(() => {
  formItem.value.saldo_periodo = props.sumaMovimientos.toString()
  formItem.value.fecha = DateTime.now().toFormat('dd/MM/yyyy')
})
/**
 * funciones
 */
function generarPago() {
  cargaListaRegistrosTarjeta(
    null,
    {
      cuentaId: props.cuenta.id,
      fechaInicio: props.fecha_inicio,
      fechaFin: props.fecha_fin,
      isMsi: false,
      estadoRegistroTarjetaId: 1
    },
    graphqlOptions
  )
}
onResultListaRegistros(({ data }) => {
  const listaRegistros = data?.listaRegistrosTarjeta ?? []
  const fecha = formato.convertDateFromInputToIso(formItem.value.fecha)
  const user_id = SessionStorage.getItem('user').id

  console.dir(user_id)
  var lista_registros = []
  listaRegistros.forEach((item) => {
    const registro = {
      estado_registro_id: 2, //cerrado
      tipo_afectacion: item.tipoAfectacion,
      cuenta_id: formItem.value.cuenta_egreso.id,
      categoria_id: item.categoriaId,
      importe: parseFloat(item.importe),
      fecha,
      observaciones: item.concepto,
      registro_id: item.id,
      user_id
    }
    lista_registros.push(registro)
  })
  console.table(lista_registros)

  api
    .post('/registros_tarjeta/create_pago', {
      lista_registros,
      fecha_fin: props.fecha_fin,
      cuenta_id: props.cuenta.id
    })
    .then((response) => {
      console.log('guardado correctamente')
      console.log('response', response)
      notificacion.mostrarNotificacionPositiva(
        'Los registros han sido guardados correctamente.',
        1200
      )
      emit('itemsSaved')
    })
    .catch(function (error) {
      console.log(error.response.data)
      console.log(error.response.status)
      console.log(error.response.data.exception)
    })
})
onErrorListaRegistros((error) => {
  console.error(error)
})
/**
 * computed
 */
const isNotPagable = computed({
  get() {
    return props.saldoPeriodoAnterior > 0 || formItem.value.saldo_periodo <= 0
  }
})
</script>

<style lang="scss" scoped></style>
