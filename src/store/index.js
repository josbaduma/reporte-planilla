import Vue from "vue";
import Vuex from "vuex";
import _ from "lodash";
import { Timestamp } from "../../firebase";

import actions from "./Actions";
import getters from "./Getters";
import mutations from "./Mutations";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    usuario: null,
    error: null,
    planilla: [],
    empleado: {
      id: 0,
      cedula: "",
      nombre: "",
      apellidos: "",
      fecha_inicio: Timestamp.fromDate(new Date("01-01-2020")),
      tipo_colaborador: "",
      puesto: "",
      ultima_liquidacion: Timestamp.fromDate(new Date("01-01-2020")),
      ultima_liquidacion_vacaciones: Timestamp.fromDate(new Date("01-01-2020")),
    },
    registros: [],
    allRegistros: [],
    registrosVacaciones: [],
    empleadosConRegistros: [],
  },
  mutations,
  actions,
  getters,
  modules: {},
});
