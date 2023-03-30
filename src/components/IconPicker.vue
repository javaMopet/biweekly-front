<template>
  <div class="q-pa-lg row">
    <div>
      <q-input v-model="filter" filled label="Filtro" outlined clearable />
      <q-separator />

      <div class="doc-container" style="width: 800px">
        <div class="row">
          <div class="col-3">
            <q-select
              v-model="tags"
              :options="categoriesMaterial"
              label="Categorias"
              filled
              multiple
            />
          </div>
          <div class="col-9">
            <q-icon-picker
              tooltips
              v-model="data.value"
              v-model:model-pagination="data.pagination"
              icon-set="material-icons"
              sected-color="orange-8"
              :filter="filter"
              style="height: 637px"
              :tags="tags"
              @tags="onTags"
            >
              <template #icon="name">
                <q-btn @click="setValue(name)">
                  <q-icon color="dark" :name="name" size="2.5em" />
                </q-btn>
              </template>
            </q-icon-picker>
          </div>
        </div>
        <div class="column items-end">
          <q-btn color="primary" label="Cancelar" @click="close" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
const data = ref({
  value: '',
  paginationColor: 'secondary',
  pagination: {
    itemsPerPage: 99,
    page: 0
  }
})
// const tags = ref(['food', 'calendar']);
const loaded = ref(false)
const categories = ref([])
const tags = ref([])
const filter = ref('')

class onTags {
  constructor(tags) {
    if (loaded.value !== true) {
      console.log('tags', tags)
      let cats = []
      let t = [...tags]
      cats.splice(0, 0, ...t)
      categories.value.splice(0, this.categories.length, ...cats)
      categories.value.concat(...cats)
      categories.value.forEach((cat) => {
        this.$set(this.selected, cat, false)
      })
      this.loaded = true
    }
  }
}
const emit = defineEmits(['onClose', 'onIconSelected'])

function setValue(name) {
  console.log('setting value', name)
  data.value.value = name
  emit('onIconSelected', name)
}

const categorias = ref([
  'calendar',
  'accessibility',
  'arrow',
  'art',
  'brand',
  'buildings',
  'computer',
  'editor',
  'emotions',
  'family',
  'food',
  'health',
  'home',
  'media',
  'money',
  'nature',
  'office',
  'other',
  'people',
  'religion',
  'science',
  'social',
  'sport',
  'technology',
  'travel',
  'weather',
  'web'
])
const categoriesMaterial = ref([
  'accessibility',
  'arrow',
  'brand',
  'calendar',
  'editor',
  'file',
  'food',
  'health',
  'map',
  'media',
  'money',
  'nature',
  'other',
  'people',
  'sport',
  'technology',
  'travel',
  'weather',
  'web'
])
function close() {
  emit('onClose')
}
</script>
<style lang="scss" scoped>
// .q-icon {
//   font-size: 2.71em !important;
// }
</style>
