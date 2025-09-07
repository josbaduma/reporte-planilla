<template>
  <v-app id="inspire">
    <v-layout>
      <v-app-bar
        id="top-bar"
        app
        color="secondary"
        density="compact"
        dark
        class="px-4 py-2"
      >
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="drawer = !drawer"
          v-if="!mobile"
        ></v-app-bar-nav-icon>
        <div class="d-flex align-center">
          <v-img
            alt="Restaurante Logo"
            class="shrink mr-2"
            contain
            :src="logo"
            transition="scale-transition"
            width="40"
          />
          <h3 id="title-restaurante">Restaurante Fogoncito</h3>
        </div>
      </v-app-bar>
      <v-navigation-drawer
        id="sidebar"
        v-model="drawer"
        v-if="existeUsuario"
        app
        :mini-variant.sync="!mobile"
        :expand-on-hover="!mobile"
        :permanent="mobile"
        theme="dark"
      >
        <v-img
          :aspect-ratio="16 / 9"
          src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
        >
          <v-row align="end" class="lightbox white--text py-2 fill-height">
            <v-col>
              <v-list dense nav class="py-0">
                <v-list-item two-line :class="mobile && 'px-0'">
                  <template #prepend>
                    <v-icon dark size="large">fa fa-user-circle</v-icon>
                  </template>
                  <template #title>
                    {{ usuario.nombre }}
                  </template>
                  <template #subtitle>
                    {{ usuario.email }}<br />
                    Administrador
                  </template>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-img>
        <v-list theme="dark" color="black" nav dense>
          <v-list-item
            link
            :to="{ name: 'Planilla', params: { id: 1 } }"
            prepend-icon="fa fa-home"
            title="Inicio"
          ></v-list-item>
        </v-list>
        <template v-slot:append>
          <div class="pa-2">
            <v-btn block @click="cerrarSesion" v-if="existeUsuario">
              <v-icon icon="fas fa-external-link-alt"></v-icon>
              Cerrar Sesión
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
      <v-main>
        <router-view color="blue-grey lighten-1" :key="$route.fullPath" />
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useDisplay } from "vuetify";
import logo from "./assets/logo.jpg";

// Store
const store = useStore();
const existeUsuario = computed(() => store.getters.existeUsuario);
const usuario = computed(() => store.state.usuario);

// Vuetify breakpoint
const { mdAndUp } = useDisplay();
const mobile = computed(() => mdAndUp.value);

// Drawer
const drawer = ref(true);

// Métodos
function cerrarSesion() {
  store.dispatch("cerrarSesion");
}
</script>

<style>
.v-list .v-list-item--active {
  color: whitesmoke !important;
}
.v-main {
  background-color: #f9f9f9;
}
a:hover,
a:focus,
.md-theme-default a:not(.md-button) {
  color: white !important;
}
a {
  text-decoration: none;
}

.v-navigation-drawer {
  transition: none !important;
}

.lightbox {
  box-shadow: 0 0 20px inset rgba(0, 0, 0, 0.2);
  background-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.4) 0%,
    transparent 72px
  );
}
#title-restaurante {
  font-weight: bold;
}
@media only screen and (max-width: 800px) {
  #title-restaurante {
    font-size: 22px;
  }
  #top-bar {
    min-height: 70px;
  }
}
</style>
