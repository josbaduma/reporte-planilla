import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { auth } from "../firebase";
import "vuetify/styles";
import "@fortawesome/fontawesome-free/css/all.css";

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
});

const app = createApp(App);
app.use(router).use(store).use(vuetify);
app.mount("#app");
