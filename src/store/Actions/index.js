import router from "../../router";
import { auth, db, Timestamp } from "../../../firebase";

/* ------------------ Planilla General --------------------------------- */
const getPlanilla = (context) => {
  db.collection("planilla").onSnapshot((querySnapshot) => {
    const planilla = [];
    querySnapshot.forEach((doc) => {
      let dato = doc.data();
      let date = dato.fecha_inicio.toDate();
      dato.id = doc.id;
      dato.fecha_inicio = date.toISOString().substr(0, 10);
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
      empleado.fecha_inicio = empleado.fecha_inicio
        .toDate()
        .toISOString()
        .substr(0, 10);
      empleado.id = doc.id;
      context.commit("setEmpleado", empleado);
    });
};

const editarEmpleado = (context, empleado) => {
  db.collection("planilla")
    .doc(empleado.id)
    .update({
      cedula: empleado.cedula,
      nombre: empleado.nombre,
      apellidos: empleado.apellidos,
      fecha_inicio: empleado.fecha_inicio,
      puesto: empleado.puesto,
      tipo_colaborador: empleado.tipo_colaborador,
      ultima_liquidacion: empleado.ultima_liquidacion,
    })
    .then(() => {});
};

const agregarEmpleado = (context, empleado) => {
  db.collection("planilla")
    .add({
      cedula: empleado.cedula,
      nombre: empleado.nombre,
      apellidos: empleado.apellidos,
      fecha_inicio: empleado.fecha_inicio,
      puesto: empleado.puesto,
      tipo_colaborador: empleado.tipo_colaborador,
      ultima_liquidacion: empleado.fecha_inicio,
    })
    .then((doc) => {});
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
  setTimeout(() => {
    const liquidacion = context.state.empleado.ultima_liquidacion;
    db.collection("planilla")
      .doc(id)
      .collection("registros")
      .orderBy("fecha_inicio")
      .where("fecha_inicio", ">=", liquidacion)
      .onSnapshot((querySnapshot) => {
        const registros = [];
        let index = 1;
        querySnapshot.forEach((doc) => {
          let dato = doc.data();
          dato.id = doc.id;
          dato.horas = sumHours(dato);
          dato.fecha_inicio = dato.fecha_inicio
            .toDate()
            .toISOString()
            .substr(0, 10);
          dato.fecha_final = dato.fecha_final
            .toDate()
            .toISOString()
            .substr(0, 10);
          dato.index = index;
          index++;
          registros.push(dato);
        });
        return context.commit("setRegistros", registros);
      });
  }, 500);
};

const agregarRegistro = (context, registro) => {
  db.collection("planilla")
    .doc(registro.id_empleado)
    .collection("registros")
    .add({
      domingo: parseFloat(registro.domingo),
      lunes: parseFloat(registro.lunes),
      martes: parseFloat(registro.martes),
      miercoles: parseFloat(registro.miercoles),
      jueves: parseFloat(registro.jueves),
      viernes: parseFloat(registro.viernes),
      sabado: parseFloat(registro.sabado),
      alimentacion: parseFloat(registro.alimentacion),
      seguro: parseFloat(registro.seguro),
      salario_hora: parseFloat(registro.salario_hora),
      fecha_inicio: registro.fecha_inicio,
      fecha_final: registro.fecha_final,
      vales: parseFloat(registro.vales),
    })
    .then((doc) => {});
};

const editarRegistro = (context, registro) => {
  db.collection("planilla")
    .doc(registro.id_empleado)
    .collection("registros")
    .doc(registro.id)
    .update({
      domingo: parseFloat(registro.domingo),
      lunes: parseFloat(registro.lunes),
      martes: parseFloat(registro.martes),
      miercoles: parseFloat(registro.miercoles),
      jueves: parseFloat(registro.jueves),
      viernes: parseFloat(registro.viernes),
      sabado: parseFloat(registro.sabado),
      alimentacion: parseFloat(registro.alimentacion),
      seguro: parseFloat(registro.seguro),
      salario_hora: parseFloat(registro.salario_hora),
      fecha_inicio: registro.fecha_inicio,
      fecha_final: registro.fecha_final,
      vales: parseFloat(registro.vales),
    })
    .then(() => {});
};

const eliminarRegistro = (context, registro) => {
  db.collection("planilla")
    .doc(registro.id_empleado)
    .collection("registros")
    .doc(registro.id)
    .delete()
    .then(() => {});
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
  eliminarRegistro,
  ingresoUsuario,
  detectarUsuario,
  cerrarSesion,
};
