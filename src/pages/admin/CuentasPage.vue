<template>
  <div class="row">Cuentas</div>
  <div class="row fit" style="border: 0px solid red">
    <q-table
      grid
      style="width: 100%"
      dense
      :rows="lista_cuentas"
      :columns="columns"
      row-key="id"
      :filter="filter"
      :rows-per-page-options="[15, 30, 45]"
    >
      <template v-slot:top-left>
        <q-btn
          label="Nueva cuenta"
          color="primary"
          class=""
          @click="addRow()"
          icon="queue"
        />
      </template>

      <template v-slot:top-right>
        <q-input
          outlined
          dense
          debounce="300"
          v-model="filter"
          placeholder="Buscar"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template #item="props">
        <q-card class="my-card q-ma-sm">
          <q-card-section>
            <div class="text-h6">
              {{ props.row.nombre }}
            </div>
            <div class="text-subtitle2">
              {{ props.row.cuentaContable.id }} -
              {{ props.row.cuentaContable.nombre }}
            </div>
          </q-card-section>
          <q-card-section>
            <q-btn icon="edit" size="sm" flat dense @click="editRow(props)" />
            <q-btn
              icon="delete"
              size="sm"
              class="q-ml-sm"
              flat
              dense
              @click="deleteRow(props)"
            />
          </q-card-section>
        </q-card>
      </template>
      <template #body-cell-icono="props">
        <q-icon :name="props.row.icono" size="35px" color="cyan" />
      </template>
      <template v-slot:body-cell-acciones="props">
        <q-td :props="props" fit>
          <q-btn icon="edit" size="sm" flat dense @click="editRow(props)" />
          <q-btn
            icon="delete"
            size="sm"
            class="q-ml-sm"
            flat
            dense
            @click="deleteRow(props)"
          />
        </q-td>
      </template>
    </q-table>
  </div>

  <Teleport to="#modal">
    <q-dialog v-model="showFormItem" persistent>
      <RegistroCuenta></RegistroCuenta>
    </q-dialog>
  </Teleport>
</template>

<script setup>
import { useLazyQuery } from '@vue/apollo-composable'
import { ref, onMounted } from 'vue'
import { LISTA_CUENTAS } from '/src/graphql/cuentas'
import RegistroCuenta from 'src/components/cuentas/RegistroCuenta.vue'

/**
 * state
 */
const lista_cuentas = ref([])
const filter = ref()
const showFormItem = ref(false)

const columns = [
  // { name: 'id', label: 'Id', field: 'id', sortable: true, align: 'left' },
  {
    name: 'nombre',
    label: 'Nombre',
    field: 'nombre',
    sortable: true,
    align: 'left'
  },

  {
    name: 'descripcion',
    label: 'Descripción',
    field: 'descripcion',
    sortable: true,
    align: 'left'
  },

  {
    name: 'cuenta_contable',
    label: 'Cuenta Contable',
    field: (row) => `${row.cuentaContable.id} - ${row.cuentaContable.nombre}`,
    sortable: true,
    align: 'left'
  },
  {
    name: 'acciones',
    label: 'Acciones',
    field: 'action',
    sortable: false,
    align: 'center'
  }
]
/**
 * onMounted
 */
onMounted(() => {
  cargarCuentas()
})

const { onResult: onResultCuentas, load: cargarCuentas } =
  useLazyQuery(LISTA_CUENTAS)

onResultCuentas(({ data }) => {
  if (!!data) {
    // console.log('response', data)
    lista_cuentas.value = JSON.parse(JSON.stringify(data.listaCuentas))
  }
})

function addRow() {
  showFormItem.value = true
}
</script>

<style lang="scss" scoped></style>
