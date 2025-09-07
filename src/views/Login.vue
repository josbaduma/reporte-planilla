<template>
  <v-row justify="center" class="mt-5">
    <v-col cols="12" sm="8" md="6" xl="4">
      <v-card>
        <v-card-item class="bg-info mb-4">
          <v-card-title class="text-uppercase text-center" dark>
            <span>Ingreso</span>
          </v-card-title>
        </v-card-item>
        <v-card-text>
          <v-form @submit.prevent="onSubmit" validate-on="input,blur">
            <v-text-field
              label="Usuario"
              v-model="username"
              :error-messages="usernameErrors"
              placeholder="Ingrese su usuario"
              required
              density="comfortable"
              variant="outlined"
              autocomplete="username"
            />
            <v-text-field
              label="Contraseña"
              v-model="pass"
              :error-messages="passErrors"
              type="password"
              placeholder="Ingrese su contraseña"
              required
              density="comfortable"
              variant="outlined"
              autocomplete="current-password"
            />
            <v-btn
              type="submit"
              color="secondary"
              :disabled="v$.$invalid"
              class="mt-3"
              block
            >
              Acceder
            </v-btn>
          </v-form>
          <v-alert
            v-if="error === 'auth/user-not-found'"
            type="error"
            class="mt-3"
            dense
          >
            Usuario incorrecto
          </v-alert>
          <v-alert
            v-if="error === 'auth/wrong-password'"
            type="error"
            class="mt-3"
            dense
          >
            Contraseña incorrecta
          </v-alert>
          <v-alert
            v-if="error === 'auth/admin-permission'"
            type="error"
            class="mt-3"
            dense
          >
            El usuario no tiene permisos de administrador.
          </v-alert>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, minLength, email } from "@vuelidate/validators";
import { useStore } from "vuex";

const store = useStore();
const username = ref("");
const pass = ref("");

const rules = {
  username: { required, email, minLength: minLength(6) },
  pass: { required, minLength: minLength(6) },
};

const v$ = useVuelidate(rules, { username, pass });

const error = computed(() => store.state.error);

const usernameErrors = computed(() => {
  const errors = [];
  if (!v$.value.username.required) errors.push("Campo requerido");
  if (!v$.value.username.email) errors.push("Correo no válido");
  if (!v$.value.username.minLength) errors.push("Mínimo 6 caracteres");
  return errors;
});

const passErrors = computed(() => {
  const errors = [];
  if (!v$.value.pass.required) errors.push("Campo requerido");
  if (!v$.value.pass.minLength) errors.push("Mínimo 6 caracteres");
  return errors;
});

function onSubmit() {
  v$.value.$touch();
  if (!v$.value.$invalid) {
    try {
      store.dispatch("ingresoUsuario", {
        email: username.value,
        pass: pass.value,
      });
    } catch (err) {
      console.error("Error en ingresoUsuario:", err);
    }
  }
}
</script>
