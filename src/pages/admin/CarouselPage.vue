<template>
  <div class="card-carousel-wrapper">
    <!-- <div
      class="card-carousel--nav__left"
      @click="moveCarousel(-1)"
      v-if="!atHeadOfList"
    ></div> -->
    <q-btn
      flat
      color="primary"
      icon="navigate_before"
      @click="moveCarousel(-1)"
      :disable="atHeadOfList"
    />
    <!-- v-if="!atHeadOfList" -->
    <div class="card-carousel">
      <div class="card-carousel--overflow-container">
        <div
          class="card-carousel-cards"
          :style="{
            transform: 'translateX' + '(' + currentOffset + 'px' + ')'
          }"
        >
          <q-card
            :class="[
              { active: item.name === nombreActivo },
              'card-carousel--card'
            ]"
            style="width: 200px; min-width: 200px"
            v-for="item in items"
            :key="item.name"
            @click="activar(item.name)"
          >
            <q-card-section>
              <div class="text-h6">{{ item.name }}</div>
              <div class="text-subtitle2">by John Doe</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <!-- <div
      class="card-carousel--nav__right"
      @click="moveCarousel(1)"
      v-if="!atEndOfList"
    ></div> -->
    <q-btn
      flat
      color="primary"
      icon="navigate_next"
      @click="moveCarousel(1)"
      :disable="atEndOfList"
    />
    <!-- v-if="atEndOfList" -->
  </div>
  <pre>{{ nombreActivo }}</pre>
</template>

<script setup>
import { ref, computed } from 'vue'
/**
 * state
 */
const currentOffset = ref(0)
const windowSize = ref(3)
const paginationFactor = ref(220)
const items = ref([
  { name: 'Kin Khao', tag: ['Thai'] },
  { name: 'Jū-Ni', tag: ['Sushi', 'Japanese', '$$$$'] },
  { name: 'Delfina', tag: ['Pizza', 'Casual'] },
  { name: 'San Tung', tag: ['Chinese', '$$'] },
  { name: 'Anchor Oyster Bar', tag: ['Seafood', 'Cioppino'] },
  { name: 'Locanda', tag: ['Italian'] },
  { name: 'Garden Creamery', tag: ['Ice cream'] }
])

const nombreActivo = ref('')
/**
 * computed
 */
const atEndOfList = computed({
  get() {
    return (
      currentOffset.value <=
      paginationFactor.value * -1 * (items.value.length - windowSize.value)
    )
  }
})
const atHeadOfList = computed({
  get() {
    return currentOffset.value === 0
  }
})

/**
 *
 * @param {} direction
 */

function moveCarousel(direction) {
  // Find a more elegant way to express the :style. consider using props to make it truly generic
  if (direction === 1 && !this.atEndOfList) {
    this.currentOffset -= this.paginationFactor
  } else if (direction === -1 && !this.atHeadOfList) {
    this.currentOffset += this.paginationFactor
  }
}
function activar(nombre) {
  nombreActivo.value = nombre
}
</script>

<style lang="scss">
$vue-navy: #2c3e50;
$vue-navy-light: #3a5169;
$vue-teal: #42b883;
$vue-teal-light: #42b983;
$gray: #666a73;
$light-gray: #f8f8f8;

body {
  background: $light-gray;
  color: $vue-navy;
  font-family: 'Source Sans Pro', sans-serif;
}

.card-carousel-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0 40px;
  color: $gray;
}

.card-carousel {
  display: flex;
  justify-content: center;
  width: 640px;

  &--overflow-container {
    overflow: hidden;
  }

  &--nav__left,
  &--nav__right {
    display: inline-block;
    width: 15px;
    height: 15px;
    padding: 10px;
    box-sizing: border-box;
    border-top: 2px solid $vue-teal;
    border-right: 2px solid $vue-teal;
    cursor: pointer;
    margin: 0 20px;
    transition: transform 150ms linear;
    &[disabled] {
      opacity: 0.2;
      border-color: black;
    }
  }

  &--nav__left {
    transform: rotate(-135deg);
    &:active {
      transform: rotate(-135deg) scale(0.9);
    }
  }

  &--nav__right {
    transform: rotate(45deg);
    &:active {
      transform: rotate(45deg) scale(0.9);
    }
  }
}

.card-carousel-cards {
  display: flex;
  transition: transform 150ms ease-out;
  transform: translatex(0px);

  .card-carousel--card {
    margin: 0 10px;
    cursor: pointer;
    box-shadow: 0 4px 15px 0 rgba(40, 44, 53, 0.06),
      0 2px 2px 0 rgba(40, 44, 53, 0.08);
    background-color: #ebf0f5;
    border-radius: 4px;
    z-index: 3;
    margin-bottom: 2px;
    opacity: 0.5 !important;

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }
    &:hover {
      box-shadow: 0 8px 35px 0 rgba(40, 44, 53, 0.06),
        0 10px 2px 0 rgba(40, 44, 53, 0.08) !important;
      background-color: #e1e4ec !important;
      color: $primary;
    }

    img {
      vertical-align: bottom;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      transition: opacity 150ms linear;
      user-select: none;

      &:hover {
        opacity: 0.5;
      }
    }

    &--footer {
      border-top: 0;
      padding: 7px 15px;

      p {
        padding: 3px 0;
        margin: 0;
        margin-bottom: 2px;
        font-size: 19px;
        font-weight: 500;
        color: $vue-navy;
        user-select: none;

        &.tag {
          font-size: 11px;
          font-weight: 300;
          padding: 4px;
          background: rgba(40, 44, 53, 0.06);
          display: inline-block;
          position: relative;
          margin-left: 4px;
          color: $gray;

          &:before {
            content: '';
            float: left;
            position: absolute;
            top: 0;
            left: -12px;
            width: 0;
            height: 0;
            border-color: transparent rgba(40, 44, 53, 0.06) transparent
              transparent;
            border-style: solid;
            border-width: 8px 12px 12px 0;
          }
          &.secondary {
            margin-left: 0;
            border-left: 1.45px dashed white;
            &:before {
              display: none !important;
            }
          }

          &:after {
            content: '';
            position: absolute;
            top: 8px;
            left: -3px;
            float: left;
            width: 4px;
            height: 4px;
            border-radius: 2px;
            background: white;
            box-shadow: -0px -0px 0px #004977;
          }
        }
      }
    }
  }
}

h1 {
  font-size: 3.6em;
  font-weight: 100;
  text-align: center;
  margin-bottom: 0;
  color: $vue-teal;
}

.active {
  background-color: #e1e4ec !important;
  color: $primary;
  opacity: 1 !important;
  box-shadow: rgba(152, 136, 161, 0.25) 2px 7px 14px,
    rgba(158, 137, 185, 0.22) 2px 15px 15px !important;
  transform: translate(-1px, -2px);
  transition: all 0.45s ease;
}
</style>
