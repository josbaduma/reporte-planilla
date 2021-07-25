import Vue from "vue";
import Vuex from "vuex";
import _ from "lodash";

import actions from './Actions';
import getters from './Getters';
import mutations from './Mutations';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    usuario: null,
    error: null,
    planilla: [],
    empleado: [],
    registros: [],
  },
  mutations,
  actions,
  getters,
  modules: {},
});
