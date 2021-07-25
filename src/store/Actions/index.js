import router from "../../router";
import { auth, db } from "../../../firebase";

/* ------------------ Planilla General --------------------------------- */
const getPlanilla = (context) => {
  db.collection("planilla").onSnapshot((querySnapshot) => {
    const planilla = [];
    querySnapshot.forEach((doc) => {
      let dato = doc.data();
      let date = dato.fecha_inicio.toDate();
      dato.id = doc.id;
      dato.fecha_inicio = date.toLocaleDateString();
      planilla.push(dato);
    });
    context.commit("setPlanilla", planilla);
  });
};

/* ------------------- Funciones del Empleado ---------------------------- */
const getEmpleado = (context, id) => {
  db.collection("planilla")
    .doc(id)
    .onSnapshot((doc) => {
      let empleado = doc.data();
      let date = empleado.fecha_inicio.toDate();
      empleado.id = doc.id;
      empleado.fecha_inicio = date.toLocaleDateString();
      context.commit("setEmpleado", empleado);
    });
};

const editarEmpleado = (context, empleado) => {
  db.collection("planilla")
    .doc(empleado.id)
    .update({
      nombre: empleado.nombre,
    })
    .then(() => {
      router.push({ name: "inicio" });
    });
};

const agregarEmpleado = (context, empleado) => {
  db.collection("planilla")
    .add({
      cedula: empleado.cedula,
      nombre: empleado.nombre,
      apellidos: empleado.apellidos,
      fecha_inicio: empleado.fecha_inicio,
    })
    .then((doc) => {
      router.push({ name: "Planilla" });
    });
};

const eliminarEmpleado = ({ commit, dispatch }, id) => {
  db.collection("planilla")
    .doc(id)
    .delete()
    .then(() => {
      context.commit("eliminarEmpleado", id);
    });
};

/* ----------------- Funciones de Registros Empleado ---------------------- */
const sumHours = (item) => {
  let sum =
    item.domingo +
    item.lunes +
    item.martes +
    item.miercoles +
    item.jueves +
    item.viernes +
    item.sabado;
  return sum;
};

const getRegistrosEmpleado = (context, id) => {
  db.collection("planilla")
    .doc(id)
    .collection("registros")
    .orderBy("fecha_inicio")
    .onSnapshot((querySnapshot) => {
      const registros = [];
      let index = 1;
      querySnapshot.forEach((doc) => {
        let dato = doc.data();
        dato.id = doc.id;
        dato.horas = sumHours(dato);
        dato.fecha_inicio = dato.fecha_inicio.toDate().toLocaleDateString();
        dato.fecha_final = dato.fecha_final.toDate().toLocaleDateString();
        dato.index = index;
        index++;
        registros.push(dato);
      });
      return context.commit("setRegistros", registros);
    });
};

const agregarRegistro = (context, registro) => {
  db.collection("planilla")
    .doc(registro.id_empleado)
    .collection("registros")
    .add({
      domingo: registro.domingo,
      lunes: registro.lunes,
      martes: registro.martes,
      miercoles: registro.miercoles,
      jueves: registro.jueves,
      viernes: registro.viernes,
      sabado: registro.sabado,
      fecha_inicio: registro.fecha_inicio,
      fecha_final: registro.fecha_final,
    })
    .then((doc) => {
      router.push({ name: "Empleado", params: { id: registro.id_empleado } });
    });
};

const editarRegistro = (context, registro) => {
  db.collection("planilla")
    .doc(registro.id_empleado)
    .collection("registros")
    .doc(registro.id)
    .update({
      nombre: registro.nombre,
      domingo: registro.domingo,
      lunes: registro.lunes,
      martes: registro.martes,
      miercoles: registro.miercoles,
      jueves: registro.jueves,
      viernes: registro.viernes,
      sabado: registro.sabado,
      fecha_inicio: registro.fecha_inicio,
      fecha_final: registro.fecha_final,
    })
    .then(() => {
      router.push({ name: "Empleado", params: { id: registro.id_empleado } });
    });
};

/* ---------------- Funciones de Inicio de Sesion ------------------------- */
const ingresoUsuario = (context, payload) => {
  auth
    .signInWithEmailAndPassword(payload.email, payload.pass)
    .then((res) => {
      context.commit("setUsuario", {
        email: res.user.email,
        uid: res.user.uid,
      });
      router.push("/planilla");
    })
    .catch((err) => {
      context.commit("setError", err.code);
    });
};

const detectarUsuario = (context, payload) => {
  if (payload != null) {
    context.commit("setUsuario", { email: payload.email, uid: payload.uid });
  } else {
    context.commit("setUsuario", null);
  }
};

const cerrarSesion = (context) => {
  auth.signOut();
  context.commit("setUsuario", null);
  router.push("/login");
};

export default {
  getPlanilla,
  getEmpleado,
  editarEmpleado,
  agregarEmpleado,
  eliminarEmpleado,
  getRegistrosEmpleado,
  agregarRegistro,
  editarRegistro,
  ingresoUsuario,
  detectarUsuario,
  cerrarSesion,
};
