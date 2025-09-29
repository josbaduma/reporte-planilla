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
  state.planilla = state.planilla.filter((doc) => {
    return doc.id != id;
  });
};
const setRegistros = (state, payload) => {
  state.registros = payload;
};

const setAllRegistros = (state, payload) => {
  state.allRegistros = payload;
};

const setRegistrosVacaciones = (state, payload) => {
  state.registrosVacaciones = payload;
};

// Guarda el array de empleados con sus registros asociados
const setEmpleadosConRegistros = (state, payload) => {
  state.empleadosConRegistros = payload;
};

export default {
  setUsuario,
  setError,
  setPlanilla,
  setEmpleado,
  eliminarEmpleado,
  setRegistros,
  setAllRegistros,
  setRegistrosVacaciones,
  setEmpleadosConRegistros,
};
