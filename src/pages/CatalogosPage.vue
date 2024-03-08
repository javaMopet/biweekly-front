<template>
  <div class="row">
    <div class="col-2">
      <q-list>
        <q-item clickable class="GPLAY__drawer-link bg-grey-10 text-grey-3">
          <q-item-section avatar class="text-grey-1">
            <q-icon name="weekend" />
          </q-item-section>
          <q-item-section class="text-grey-3">
            <q-item-label>Menú</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          class="GPLAY__drawer-link GPLAY__drawer-link--apps"
          to="/main/catalogos/cuentas"
        >
          <q-item-section avatar class="bg-green-7 text-grey-1 text-center">
            <q-icon name="fa-solid fa-file-invoice-dollar" />
          </q-item-section>
          <q-item-section class="apps-text">
            <q-item-label>Cuentas</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable class="GPLAY__drawer-link GPLAY__drawer-link--movies">
          <q-item-section
            avatar
            class="movies-icon bg-red-7 text-grey-1 text-center"
          >
            <q-icon name="fa-solid fa-users" />
          </q-item-section>
          <q-item-section class="movies-text">
            <q-item-label>Usuarios</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable class="GPLAY__drawer-link GPLAY__drawer-link--music">
          <q-item-section
            avatar
            class="music-icon bg-orange-7 text-grey-1 text-center"
          >
            <q-avatar
              size="22px"
              color="white"
              text-color="orange-7"
              icon="music_note"
            />
          </q-item-section>
          <q-item-section class="music-text">
            <q-item-label>Music</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable class="GPLAY__drawer-link GPLAY__drawer-link--books">
          <q-item-section
            avatar
            class="books-icon bg-blue-7 text-grey-1 text-center"
          >
            <q-icon name="book" />
          </q-item-section>
          <q-item-section class="books-text">
            <q-item-label>Books</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          class="GPLAY__drawer-link GPLAY__drawer-link--devices"
        >
          <q-item-section
            avatar
            class="devices-icon bg-blue-grey-7 text-grey-1 text-center"
          >
            <q-icon name="devices" />
          </q-item-section>
          <q-item-section class="devices-text">
            <q-item-label>Devices</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="q-mb-md" />

        <q-item
          v-for="link in links1"
          :key="link.text"
          v-ripple
          dense
          clickable
          class="GPLAY__drawer-item"
        >
          <q-item-section class="text-grey-8">
            <q-item-label>{{ link.text }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div class="col-10"><router-view /></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(true)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style lang="sass">
.GPLAY
  &__toolbar
    height: 60px
  &__logo
    width: 183px
    height: 39px
  &__toolbar-input-container
    min-width: 100px
    width: 55%
  &__toolbar-input-btn
    border-radius: 0
    max-width: 60px
    width: 100%
  &__drawer-link
    .q-item__section--avatar
      margin: -8px 0 -8px -16px
      padding: 8px 0 8px 16px
    .q-item__section--main
      margin: -8px -16px -8px 16px
      padding: 8px 16px 8px 2px
      font-size: 18px
      font-weight: 300
    &--apps, &--movies, &--music, &--books, &--devices
      background: #f5f5f5!important
      &:hover
        color: #eee !important
    &--apps:hover
      background: #43a047!important
    &--movies:hover
      background: #e53935!important
    &--music:hover
      background: #fb8c00!important
    &--books:hover
      background: #1e88e5!important
    &--devices:hover
      background: #546e7a!important
  &__drawer-item
    padding: 6px 12px 6px 23px
  &__sticky
    min-height: 49px
    border-bottom: 1px solid rgba(0,0,0,0.12)
  &__sticky-help
    border: 1px solid #ccc
    padding-left: 8px
    padding-right: 8px
  &__sticky-settings
    padding-left: 17px
    padding-right: 17px
    border: 1px solid #ccc
</style>
