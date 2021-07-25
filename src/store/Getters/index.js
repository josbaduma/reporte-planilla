const existeUsuario = (state) => {
  if (state.usuario === null) {
    return false;
  } else {
    return true;
  }
};

export default { existeUsuario };