<template>
  <div class="dialog-title row fit justify-between items-center">
    <div class="dialog-title__nombre"><slot></slot></div>
    <div class="dialog-title__buttonClose">
      <q-btn
        color="primary"
        icon="close"
        v-close-popup
        class="button-close"
        round
        dense
        glossy
      ></q-btn>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.dialog-title {
  // background: $main-background;
  height: 50px !important;
  box-shadow: rgba(226, 226, 245, 0.459) 0px 1px 0px,
    rgba(107, 107, 165, 0.404) 0px 0px 8px;

  &__nombre {
    color: $accent;
    padding-left: 15px !important;
    font-weight: 700 !important;
    font-size: 0.9rem;
  }
  &__buttonClose {
    padding-right: 15px !important;
  }
}

.button-close {
  opacity: 0.8;
  font-size: 0.55rem !important;
  // color: #bdccae !important;
  &:hover {
    opacity: 1;
    color: white !important;
    background: lighten($color: $primary, $amount: 3);
    transition: all 0.05 ease;
  }
}
</style>
