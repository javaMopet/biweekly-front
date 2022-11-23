<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card
          class="bg-color"
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
        >
          <q-card-section>
            <q-avatar
              size="103px"
              class="absolute-center shadow-10"
              icon="security"
              font-size="103px"
              text-color="primary"
            >
            </q-avatar>
          </q-card-section>
          <q-card-section class="q-pt-xl">
            <q-btn-toggle
              v-model="loginAction"
              class="my-custom-toggle"
              spread
              no-caps
              rounded
              unelevated
              toggle-color="primary"
              color="white"
              text-color="primary"
              :options="[
                { label: 'Entrar', value: 'one' },
                { label: 'Registrar', value: 'two' },
              ]"
            />
          </q-card-section>
          <q-card-section>
            <q-form @submit.prevent="submitForm" class="q-gutter-md">
              <q-input
                v-if="isRegistration"
                v-model="form.fullname"
                filled
                lazy-rules
                type="text"
                label="Nombre Completo"
                class="q-pb-md"
              >
                <template v-slot:prepend>
                  <q-icon name="badge" />
                </template>
              </q-input>
              <q-input
                filled
                v-model="form.email"
                label="Correo"
                lazy-rules
                type="email"
                :rules="[(val) => !!val || 'Correo es requerido']"
              >
                <template v-slot:prepend>
                  <q-icon name="mail" />
                </template>
              </q-input>

              <q-input
                type="password"
                filled
                v-model="form.password"
                label="Contraseña"
                lazy-rules
                :rules="[(val) => !!val || 'Contraseña es requerida']"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
              <q-input
                type="password"
                filled
                v-model="form.password_confirmation"
                label="Confirmación Contraseña"
                lazy-rules
                :rules="[(val) => !!val || 'Contraseña es requerida']"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>

              <div class="row justify-center">
                <q-btn :label="btnLabel" type="submit" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar } from "quasar";
import { ref, reactive, computed } from "vue";
import { useSessionStore } from "src/stores/sessionStore";
import { useRouter } from "vue-router";

const username = ref(null);
const password = ref(null);
const returnUrl = ref(null);

const $q = useQuasar();

const router = useRouter();

const sessionStore = useSessionStore();

/**
 * state
 */
const form = reactive({
  fullname: "Horacio Peña Mendoza",
  email: "hpenam@uaemex.mx",
  password: "123456",
  password_confirmation: "1234856",
});
const loginAction = ref("one");
// const btnLabel = ref("Entrar");

/**
 * computed
 */
const btnLabel = computed(() =>
  loginAction.value == "one" ? "Entrar" : "Registrar"
);
const isRegistration = computed(() =>
  loginAction.value == "two" ? true : false
);

function submitForm() {
  const payload = {
    user: {
      // fullname: form.fullname,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
    },
  };
  const promise = sessionStore.registerUser(payload);
  promise.then(
    (result) => {
      console.log("terminó la instruccion");
      console.log("resultado", result);
      console.log(result.data.id);
      // $q.notify({
      //   type: "positive",
      //   message: `Se registro correctamente el usuario`,
      //   timeout: 1500,
      // });
    },
    (e) => {
      console.log("Ocurrió un error al intentar registrar el usuario.");
      console.error(e);
    }
  );
}

function showNotification(error) {
  $q.notify({
    type: "negative",
    message: error,
  });
}
</script>

<style lang="scss" scoped>
.my-custom-toggle {
  border: 1px solid #027be3;
}
.bg-color {
  background-color: rgb(223, 223, 228);
  box-shadow: 0 50px 70px -20px rgba(0, 0, 0, 0.85);
}
</style>
