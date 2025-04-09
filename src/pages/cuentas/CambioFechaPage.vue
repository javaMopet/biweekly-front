<template>
  <q-card class="my-card">
    <DialogTitle>Cambio de fecha</DialogTitle>
    <q-card-section>
      <q-form @submit="cambiarFechaRegistros()" class="q-gutter-md">
        <div class="">
          <DateInput
            v-model="fechaForm"
            lbl_field="Fecha"
            :opcional="false"
            :rules="[(val) => !!val || 'Favor de ingresar la fecha']"
          ></DateInput>
        </div>
        <div align="right" class="q-gutter-x-sm">
          <q-btn
            label="Cancelar"
            color="negative"
            flat
            class="q-ml-sm"
            no-caps
            v-close-popup
          />
          <q-btn label="Aceptar" type="submit" color="primary-button" />
        </div>
      </q-form>
    </q-card-section>
    <q-card-section> </q-card-section>
  </q-card>
  <div></div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import DateInput from 'src/components/formComponents/DateInput.vue'
import DialogTitle from 'src/components/formComponents/modal/DialogTitle.vue'
import { useRegistrosCrud } from 'src/composables/useRegistrosCrud'
import { useFormato } from 'src/composables/utils/useFormato'
import { useNotificacion } from 'src/composables/utils/useNotificacion'
import { onMounted, ref } from 'vue'

const formato = useFormato()
const $q = useQuasar()
const registrosCrud = useRegistrosCrud()
const {
  // mostrarNotificacionInformativa,
  mostrarNotificacionNegativa,
  mostrarNotificacionPositiva
} = useNotificacion()

const fechaForm = ref('01/01/1900')

const props = defineProps({
  registro: { type: Object, required: false, default: null }
})
const emit = defineEmits(['dateUpdated'])

onMounted(() => {
  const datea = formato.convertDateFromIsoToInput(props.registro?.fecha)
  console.log('[ datea ] >', datea)
  fechaForm.value = datea
})

function cambiarFechaRegistros() {
  console.log('[ cambiando fecha de registros ] >', props.registro)
  const fechaNueva = formato.convertDateFromInputToIso(fechaForm.value)
  if (fechaNueva === props.registro.fecha) {
    return
  } else {
    $q.dialog({
      title: 'Confirmar',
      style: 'width:500px',
      message: `Se cambiará la fecha de todos los movimientos correspondientes al pago ¿Desea continuar con la modificación?`,
      ok: {
        push: true,
        color: 'positive',
        label: 'Aceptar'
      },
      cancel: {
        push: true,
        color: 'negative',
        flat: true,
        label: 'cancelar'
      },
      persistent: true
    })
      .onOk(() => {
        confirmarCambiarFecha(
          fechaNueva,
          props.registro.registroTarjeta.pagoTarjetaId
        )
      })
      .onCancel(() => {})
      .onDismiss(() => {})
  }
}
function confirmarCambiarFecha(fechaNueva, pagoTarjetaId) {
  console.log('[ fechaNueva ] >', fechaNueva)
  console.log('[ pagoTarjetaId ] >', pagoTarjetaId)
  registrosCrud.registroDateUpdate({
    pagoTarjetaId,
    fecha: fechaNueva
  })
}

registrosCrud.onDoneRegistroDateUpdate(({ data }) => {
  console.log('[ data ] >', data)
  mostrarNotificacionPositiva('Se actualizó la fecha correctamente', 1800)
  emit('dateUpdated')
})

registrosCrud.onErrorRegistroDateUpdate((error) => {
  mostrarNotificacionNegativa(
    `Imposible actualizar la fecha de los registros. ${error.message}`,
    2100
  )
})
</script>

<style lang="scss" scoped></style>
