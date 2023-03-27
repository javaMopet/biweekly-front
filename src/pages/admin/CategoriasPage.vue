<template>
  <div class="row">Categorias</div>
  <div class="row fit" style="border: 0px solid red">
    <q-table
      grid
      style="width: 100%"
      dense
      :rows="lista_categorias"
      :columns="columns"
      row-key="id"
      :filter="filter"
      :rows-per-page-options="[15, 30, 45]"
    >
      <template v-slot:top-left>
        <q-btn
          label="Nueva categoria"
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

  <teleport to="body">
    <q-dialog v-model="showFormItem" persistent>
      <CategoriaForm></CategoriaForm>
    </q-dialog>
  </teleport>
</template>

<script setup>
import { useQuery, useLazyQuery } from '@vue/apollo-composable'
import { ref, onMounted } from 'vue'
import { LISTA_CATEGORIAS } from '/src/graphql/categorias/categorias_gql.js'
// import { LISTA_CUENTAS_CONTABLES } from '/src/graphql/cuentasContableGql'
import CategoriaForm from 'src/components/categorias/CategoriaForm.vue'

/**
 * state
 */
const lista_categorias = ref([])
const filter = ref()
const showFormItem = ref(false)

const columns = [
  // { name: 'id', label: 'Id', field: 'id', sortable: true, align: 'left' },
  {
    name: 'icono',
    label: '',
    field: 'icono',
    sortable: true,
    align: 'left'
  },
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
    name: 'color',
    label: 'Color',
    field: 'color',
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
    name: 'tipo_categoria',
    label: 'Tipo Categoria',
    field: (row) => `${row.tipoCategoria.nombre}`,
    sortable: true,
    align: 'left'
  },
  {
    name: 'creacion',
    label: 'Fecha Creación',
    field: 'createdAt',
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
 * onMount
 */
onMounted(() => {})

const { onResult: onResultCategorias } = useQuery(LISTA_CATEGORIAS)

onResultCategorias(({ data }) => {
  console.log('response', data)
  lista_categorias.value = JSON.parse(JSON.stringify(data.listaCategorias))
})

function addRow() {
  showFormItem.value = true
}
/**
 * graphql
 */
// const { load: cargarCuentasContables, onResult: onResultCuentasContables } =
//   useLazyQuery(LISTA_CUENTAS_CONTABLES)

// onResultCuentasContables(({ data }) => {
//   if (!!data) {
//     console.log('data', data.listaCuentasContables)
//     cuentasContablesOptions.value = JSON.parse(
//       JSON.stringify(data.listaCuentasContables)
//     )
//   }
// })
</script>

<style lang="scss" scoped></style>
