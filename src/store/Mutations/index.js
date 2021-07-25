const setUsuario = (state, payload) => {
  state.usuario = payload;
};
const setError = (state, payload) => {
  state.error = payload;
};
const setPlanilla = (state, payload) => {
  state.planilla = payload;
};
const setEmpleado = (state, payload) => {
  state.empleado = payload;
};
const eliminarEmpleado = (state, id) => {
  state.empleados = state.empleados.filter((doc) => {
    return doc.id != id;
  });
};
const setRegistros = (state, payload) => {
  state.registros = payload;
};

export default {
  setUsuario,
  setError,
  setPlanilla,
  setEmpleado,
  eliminarEmpleado,
  setRegistros,
};
