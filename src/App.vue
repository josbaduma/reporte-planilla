<template>
  <v-app id="inspire">
    <nav>
      <v-app-bar id="top-bar" app dark>
        <v-app-bar-nav-icon
          @click.stop="drawer = !drawer"
          v-if="!mobile"
        ></v-app-bar-nav-icon>
        <div class="d-flex align-center">
          <v-img
            alt="Restaurante Logo"
            class="shrink mr-2"
            contain
            src="./assets/logo.jpg"
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
        :mini-variant.sync="mobile"
        :expand-on-hover="mobile"
        :permanent="mobile"
        dark
      >
        <v-img
          :aspect-ratio="16 / 9"
          src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
        >
          <v-row align="end" class="lightbox white--text py-2 fill-height">
            <v-col>
              <v-list dense nav class="py-0">
                <v-list-item two-line :class="mobile && 'px-0'">
                  <v-list-item-avatar>
                    <v-icon dark large>fa fa-user-circle</v-icon>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>{{ usuario.nombre }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                      usuario.email
                    }}</v-list-item-subtitle>
                    <v-list-item-subtitle>Administrador</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-img>
        <v-list dark>
          <v-list-item link :to="{ name: 'Planilla', params: { id: 1 } }">
            <v-list-item-action>
              <v-icon>fa fa-home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Inicio</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="mt-15" @click="cerrarSesion" v-if="existeUsuario">
            <v-list-item-action>
              <v-icon>fas fa-external-link-alt</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Cerrar Sesión</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </nav>
    <v-main>
      <router-view color="blue-grey lighten-1" />
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  name: "App",
  props: {
    source: String,
  },
  data: () => ({
    drawer: true,
  }),
  methods: {
    ...mapActions(["cerrarSesion"]),
  },
  computed: {
    ...mapGetters(["existeUsuario"]),
    ...mapState(["usuario"]),
    mobile: {
      get() {
        switch (this.$vuetify.breakpoint.name) {
          case "xs":
            return false;
          case "sm":
            return false;
          case "md":
            return true;
          case "lg":
            return true;
          case "xl":
            return true;
        }
      },
      set(newName) {
        return newName;
      },
    },
  },
};
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