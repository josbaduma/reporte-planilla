<template>
  <v-layout justify-center mt-5>
    <v-flex xs12 sm8 md6 xl4>
      <v-card>
        <v-card-text class="info display-1 text-uppercase white--text text-xs-center">
          <span>Ingreso</span>
        </v-card-text>
        <v-card-text>
          <v-form class="mb-3">
            <v-text-field
              label="Usuario"
              type="text"
              v-model="$v.username.$model"
              class="form-control my-2"
              placeholder="Ingrese su usuario"
            />

            <small class="text-danger d-block" v-if="!$v.username.email">Correo no válido</small>
            <small class="text-danger d-block" v-if="!$v.username.required">Campo Requerido</small>
            <small class="text-danger d-block" v-if="!$v.username.minLength">Mínimo 6 carácteres</small>

            <v-text-field
              label="Contraseña"
              type="password"
              v-model="$v.pass.$model"
              class="form-control my-2"
              placeholder="Ingrese su contraseña"
            />

            <small class="text-danger d-block" v-if="!$v.pass.required">Campo Requerido</small>
            <small class="text-danger d-block" v-if="!$v.pass.minLength">Mínimo 6 carácteres</small>

            <v-btn
              @click="ingresoUsuario({email:$v.username.$model,pass:$v.pass.$model})"
              color="secondary"
              :disabled="$v.$invalid"
            >Acceder</v-btn>
          </v-form>
          <p class="red--text" v-if="error === 'auth/user-not-found'">Usuario incorrecto</p>
          <p class="red--text" v-if="error === 'auth/wrong-password'">Contraseña incorrecta</p>
          <p class="red--text" v-if="error === 'auth/admin-permission'">El usuario no tiene permisos de administrador.</p>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { required, minLength, email } from "vuelidate/lib/validators";
export default {
  name: "Login",
  data() {
    return {
      username: "",
      pass: "",
    };
  },
  methods: {
    ...mapActions(["ingresoUsuario"]),
  },
  computed: {
    ...mapState(["error"]),
  },
  validations: {
    username: { required, email, minLength: minLength(6) },
    pass: { required, minLength: minLength(6) },
  },
};
</script>
