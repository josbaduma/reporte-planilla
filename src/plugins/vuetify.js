import { createVuetify } from "vuetify";
import "vuetify/styles";
import { es } from "vuetify/locale";
import { aliases, fa } from "vuetify/iconsets/fa";

export default createVuetify({
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          primary: "#ff9633",
          primary_darken: "#bb7f46",
          secondary: "#424242",
          accent: "#82B1FF",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
        },
      },
    },
  },
  locale: {
    locale: "es",
    messages: { es },
  },
  icons: {
    defaultSet: "fa",
    aliases,
    sets: { fa },
  },
});
