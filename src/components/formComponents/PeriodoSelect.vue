<template>
  <div class="" style="border: 1px solid #cccccc; width: 365px">
    <div class="row q-pl-md q-gutter-x-xs">
      <q-select
        v-model="year"
        :options="yearOptions"
        option-label="nombre"
        label="Año"
        dense
        color="secondary"
        label-color="dark"
        @update:model-value="onChangeYear"
        :disable="props.disable"
        borderless
      >
        <template #before>
          <q-btn
            color="accent"
            icon="arrow_left"
            @click="onClickPrevious"
            dense
            :disable="props.disable"
            size="sm"
          />
        </template>
        <template #prepend>
          <q-icon name="calendar_month" />
        </template>
      </q-select>
      <q-select
        v-model="month"
        :options="monthOptions"
        option-label="nombre"
        label="Mes"
        dense
        color="secondary"
        label-color="dark"
        @update:model-value="onChangeMonth"
        use-input
        hide-selected
        fill-input
        style="width: 200px"
        :disable="props.disable"
        borderless
      >
        <template #prepend>
          <q-icon name="calendar_month" />
        </template>
        <template #after>
          <q-btn
            color="accent"
            icon="arrow_right"
            dense
            @click="onClickNext"
            :disable="props.disable"
            size="sm"
          />
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup>
import { useGeneralStore } from 'src/stores/common/useGeneralStore'
import { onMounted } from 'vue'

/**
 * composables
 */

const generalStore = useGeneralStore()
/**
 * state
 */

const year = defineModel('year')
const month = defineModel('month')

const monthOptions = generalStore.meses

const emit = defineEmits(['onChangePeriodo', 'onChangeMonth'])
/**
 * properties
 */
const props = defineProps({
  disable: {
    type: Boolean,
    required: false,
    default: false
  }
})
/**
 * cambiar el metodo de obtener ejercicios
 */
const yearOptions = generalStore.anios

/**
 * onMounted
 */
onMounted(() => {
  // month.value = monthOptions.value.find(
  //   (mesOption) => mesOption.id === DateTime.now().month
  // )
})

/**
 * methods
 */
function onChangeYear() {
  emit('onChangeYear')
  emit('onChangePeriodo')
}
function onChangeMonth() {
  emit('onChangeMonth')
  emit('onChangePeriodo')
}

function onClickPrevious() {
  const mesPrevio = month.value.id - 1
  if (!!mesPrevio) {
    month.value = generalStore.meses.find((option) => option.id === mesPrevio)
  } else {
    console.log('mes doce ')
    year.value -= 1
    month.value = generalStore.meses.find((mes) => mes.id === 12)
  }
  emit('onChangePeriodo')
}
function onClickNext() {
  // console.log(mes.value)
  const mesSiguiente = month.value.id + 1
  if (!!mesSiguiente && mesSiguiente < 13) {
    month.value = generalStore.meses.find(
      (option) => option.id === mesSiguiente
    )
  } else {
    year.value += 1
    month.value = generalStore.meses.find((mes) => mes.id === 1)
  }
  emit('onChangePeriodo')
}
</script>

<style lang="scss" scoped></style>
