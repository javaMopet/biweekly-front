<template>
  <q-card class="my-card" style="width: 300px">
    <q-card-section>
      <q-form @submit="cambiarMovimientoAMsi" class="q-gutter-md">
        <div class="column">
          <div class="row inline items-center q-gutter-x-md">
            <div class="row input-label">Número de meses sin intereses:</div>
            <q-input
              v-model="editedFormItem.numeroMeses"
              type="number"
              style="width: 60px"
              outlined
              dense
            />
          </div>
        </div>
        <div align="right">
          <q-btn
            label="Cancelar"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
            v-close-popup
          />
          <q-btn label="Aceptar" type="submit" color="primary" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import { useNotificacion } from 'src/composables/utils/useNotificacion'

/**
 * composables
 */
const notificacion = useNotificacion()

const editedFormItem = ref({
  numeroMeses: 3
})
/**
 * props
 */
const props = defineProps({
  registroTarjeta: {
    type: Object,
    required: true,
    default: () => {
      return {}
    }
  }
})
const emit = defineEmits(['registroUpdated'])

function cambiarMovimientoAMsi() {
  const item = { ...editedFormItem }
  console.log('Cambiando a meses sin interes', props.registroTarjeta, item)
  api
    .put(`/registros_tarjeta/${props.registroTarjeta.id}`, {
      registro_tarjeta: {
        is_msi: true,
        numero_msi: editedFormItem.value.numeroMeses
      }
    })
    .then(({ data }) => {
      console.log('actualizado', data)
      notificacion.mostrarNotificacionInformativa(
        'Registro modificado a meses sin intereses.',
        1500
      )
      emit('registroUpdated', data)
    })
    .catch((error) => {
      console.error(error)
    })
}
</script>

<style lang="scss" scoped></style>
