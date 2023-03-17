<template>
  <div class="row bg-primary text-secondary q-pa-sm q-mt-sm text-subtitle1">
    Cuentas Contables
  </div>
  <div class="row fit" style="border: 0px solid red">
    <q-table
      style="width: 100%"
      dense
      :rows="lista_cuentasContables"
      :columns="columns"
      row-key="id"
      :filter="filter"
      :rows-per-page-options="[15, 30, 45]"
    >
      <template v-slot:top-left>
        <q-btn
          label="Nueva cuenta Contable"
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

  <teleport to="body">
    <q-dialog v-model="showFormItem" persistent>
      <CuentaContableForm></CuentaContableForm>
    </q-dialog>
  </teleport>
</template>

<script setup>
import { useQuery, useLazyQuery } from '@vue/apollo-composable'
import { ref, onMounted } from 'vue'
import { LISTA_CUENTAS_CONTABLES } from '/src/graphql/cuentasContableGql'
import CuentaContableForm from 'src/components/cuentasContables/CuentaContableForm.vue'

/**
 * state
 */
const lista_cuentasContables = ref([])
const filter = ref()
const showFormItem = ref(true)

const columns = [
  { name: 'id', label: 'Id', field: 'id', sortable: true, align: 'left' },
  {
    name: 'nombre',
    label: 'Nombre',
    field: 'nombre',
    sortable: true,
    align: 'left'
  },
  {
    name: 'subnivel',
    label: 'Subnivel',
    field: 'subnivel',
    sortable: true,
    align: 'left'
  },
  {
    name: 'padre',
    label: 'Padre',
    field: 'padreId',
    // field: (row) => `${row.cuentaContable.id} - ${row.cuentaContable.nombre}`,
    sortable: true,
    align: 'left'
  },
  {
    name: 'tipoAfectacion',
    label: 'Tipo Afectacion',
    field: 'tipoAfectacion',
    // field: (row) => `${row.tipoCuentaContable.nombre}`,
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

const { load: cargarCuentasContables, onResult: onResultCuentasContables } =
  useLazyQuery(LISTA_CUENTAS_CONTABLES)

onResultCuentasContables(({ data }) => {
  if (!!data) {
    console.log('response', data)
    lista_cuentasContables.value = JSON.parse(
      JSON.stringify(data.listaCuentasContables)
    )
  }
})

function addRow() {
  showFormItem.value = true
}
/**
 * onMounted
 */
onMounted(() => {
  const subnivel = -1
  cargarCuentasContables(null, {
    subnivel
  })
})
</script>

<style lang="scss" scoped></style>
