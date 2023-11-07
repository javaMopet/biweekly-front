<template>
  <div>
    <div v-if="children.length == 0">
      <q-item
        clickable
        v-ripple
        :inset-level="nivel / 2"
        dense
        :to="'/' + ruta"
        active-class="bg-white q-py-sm q-mx-xs main-menu__active"
        class="text-main-menu q-py-sm q-mx-xs"
      >
        <q-item-section avatar>
          <!-- <div class="menu__icon--background text-white" align="center"> -->
          <q-icon :name="icono" size="27px" />
          <!-- </div> -->
        </q-item-section>
        <q-item-section class="menu__link--name">{{ nombre }}</q-item-section>
      </q-item>
    </div>
    <div v-else>
      <div v-if="children.length > 0">
        <!-- {{children}} -->

        <q-expansion-item
          expand-separator
          :icon="icono"
          :label="nombre"
          :caption="caption"
          :header-inset-level="nivel / 2"
          :content-inset-level="0.1"
          default-closed
          class="q-mx-xs q-pb-xs"
        >
          <template v-slot:header>
            <q-item-section avatar>
              <!-- <div class="menu__icon--background text-white"> -->
              <q-icon :name="icono" size="27px" color="main-menu" />
              <!-- </div> -->
            </q-item-section>
            <q-item-section class="menu__link--name">
              {{ nombre }}
            </q-item-section>
          </template>
          <q-card class="bg-menu">
            <q-card-section>
              <EssentialLink
                v-for="child in children"
                :key="child"
                v-bind="child"
              >
              </EssentialLink>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
      <!--div v-else>
        <q-item clickable v-ripple :inset-level="nivel">
          <q-item-section>{{nombre}}</q-item-section>
        </q-item>
      </div-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'EssentialLink',
  props: {
    nombre: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    ruta: {
      type: String,
      default: '#'
    },

    icono: {
      type: String,
      default: ''
    },

    nivel: {
      type: Number,
      default: 0
    },

    children: {
      type: Array
    }
  }
}
</script>
<style lang="scss">
.menu__icon--background {
  background-image: linear-gradient(310deg, #ff8f6d 0%, #6f2fb4 100%);
  padding: 10px;
  border-radius: 0.5rem !important;
  // width: 20px;
  // height: 30px;
}
.menu__link--name {
  font-size: 0.9rem !important;
  font-weight: 300 !important;
  letter-spacing: -0.025rem;
  color: $main-menu;
}
.main-menu__active {
  // color: $secondary !important;
  color: $secondary !important;
}

.main-menu__active .menu__link--name {
  // color: $secondary !important;
  color: $input-label !important;
  font-weight: 400 !important;
  font-size: 0.9rem !important;
}
</style>
