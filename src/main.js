import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import Vuelidate from "vuelidate";
import VueAutosuggest from "vue-autosuggest";
import VueMaterial from "vue-material";

Vue.config.productionTip = false;

import { auth } from "../firebase";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import "vue-material/dist/vue-material.css";
import "./assets/scss/material-dashboard.scss";

Vue.use(VueAutosuggest);
Vue.use(BootstrapVue)
Vue.use(Vuelidate);
Vue.use(VueMaterial);

auth.onAuthStateChanged((user) => {
  if (user) {
    const detectoUsuario = {
      email: user.email,
      uid: user.uid,
    };
    store.dispatch("detectarUsuario", detectoUsuario);
  } else {
    store.dispatch("detectarUsuario", user);
  }
  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount("#app");
});