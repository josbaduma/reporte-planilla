import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getFirestore,
} from "firebase/firestore";
import router from "../../router";
import { auth, db, Timestamp } from "../../../firebase";

/* ------------------ Planilla General --------------------------------- */
const getPlanilla = (context, archive) => {
  const q = query(collection(db, "planilla"), where("archive", "==", archive));
  onSnapshot(q, (querySnapshot) => {
    const planilla = [];
    querySnapshot.forEach((docSnap) => {
      let dato = docSnap.data();
      let date = dato.fecha_inicio.toDate();
      dato.id = docSnap.id;
      dato.fecha_inicio = date.toISOString().substr(0, 10);
      planilla.push(dato);
    });
    context.commit("setPlanilla", planilla);
  });
};

/* ------------------- Funciones del Empleado ---------------------------- */
const getEmpleado = (context, id) => {
  const docRef = doc(db, "planilla", id);
  onSnapshot(docRef, (docSnap) => {
    let empleado = docSnap.data();
    empleado.fecha_inicio = empleado.fecha_inicio
      .toDate()
      .toISOString()
      .substr(0, 10);
    empleado.id = docSnap.id;
    context.commit("setEmpleado", empleado);
  });
};

const editarEmpleado = (context, empleado) => {
  const docRef = doc(db, "planilla", empleado.id);
  updateDoc(docRef, {
    cedula: empleado.cedula,
    nombre: empleado.nombre,
    apellidos: empleado.apellidos,
    fecha_inicio: empleado.fecha_inicio,
    puesto: empleado.puesto,
    tipo_colaborador: empleado.tipo_colaborador,
    ultima_liquidacion: empleado.ultima_liquidacion,
    ultima_liquidacion_vacaciones: empleado.ultima_liquidacion_vacaciones,
    archive: empleado.archive,
  });
};

const agregarEmpleado = async (context, empleado) => {
  await addDoc(collection(db, "planilla"), {
    cedula: empleado.cedula,
    nombre: empleado.nombre,
    apellidos: empleado.apellidos,
    fecha_inicio: empleado.fecha_inicio,
    puesto: empleado.puesto,
    tipo_colaborador: empleado.tipo_colaborador,
    ultima_liquidacion: empleado.ultima_liquidacion,
    ultima_liquidacion_vacaciones: empleado.ultima_liquidacion_vacaciones,
    archive: false,
  });
};

const eliminarEmpleado = async (context, id) => {
  await deleteDoc(doc(db, "planilla", id));
  context.commit("eliminarEmpleado", id);
};

/* ----------------- Funciones de Registros Empleado ---------------------- */
const getRegistrosEmpleado = (context, id) => {
  setTimeout(() => {
    const liquidacion = context.state.empleado.ultima_liquidacion;
    const registrosRef = collection(db, "planilla", id, "registros");
    const q = query(
      registrosRef,
      orderBy("fecha_inicio"),
      where("fecha_inicio", ">=", liquidacion)
    );
    onSnapshot(q, (querySnapshot) => {
      const registros = [];
      let index = 1;
      querySnapshot.forEach((docSnap) => {
        let dato = docSnap.data();
        dato.id = docSnap.id;
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
      context.commit("setRegistros", registros);
    });
  }, 500);
};

const getRegistrosEmpleadoVacaciones = (context, id) => {
  setTimeout(() => {
    const liquidacion = context.state.empleado.ultima_liquidacion_vacaciones;
    const registrosRef = collection(db, "planilla", id, "registros");
    const q = query(
      registrosRef,
      orderBy("fecha_inicio"),
      where("fecha_inicio", ">=", liquidacion)
    );
    onSnapshot(q, (querySnapshot) => {
      const registros = [];
      let index = 1;
      querySnapshot.forEach((docSnap) => {
        let dato = docSnap.data();
        dato.id = docSnap.id;
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
      context.commit("setRegistrosVacaciones", registros);
    });
  }, 500);
};

const getAllRegistrosEmpleado = (context, id) => {
  setTimeout(() => {
    const registrosRef = collection(db, "planilla", id, "registros");
    const q = query(registrosRef, orderBy("fecha_inicio"));
    onSnapshot(q, (querySnapshot) => {
      const registros = [];
      let index = 1;
      querySnapshot.forEach((docSnap) => {
        let dato = docSnap.data();
        dato.id = docSnap.id;
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
      context.commit("setAllRegistros", registros);
    });
  }, 500);
};

const agregarRegistro = async (context, registro) => {
  await addDoc(collection(db, "planilla", registro.id_empleado, "registros"), {
    horas: parseFloat(registro.horas),
    alimentacion: parseFloat(registro.alimentacion),
    seguro: parseFloat(registro.seguro),
    salario_hora: parseFloat(registro.salario_hora),
    fecha_inicio: registro.fecha_inicio,
    fecha_final: registro.fecha_final,
    vales: parseFloat(registro.vales),
  });
};

const editarRegistro = async (context, registro) => {
  const docRef = doc(
    db,
    "planilla",
    registro.id_empleado,
    "registros",
    registro.id
  );
  await updateDoc(docRef, {
    horas: parseFloat(registro.horas),
    alimentacion: parseFloat(registro.alimentacion),
    seguro: parseFloat(registro.seguro),
    salario_hora: parseFloat(registro.salario_hora),
    fecha_inicio: registro.fecha_inicio,
    fecha_final: registro.fecha_final,
    vales: parseFloat(registro.vales),
  });
};

const eliminarRegistro = async (context, registro) => {
  const docRef = doc(
    db,
    "planilla",
    registro.id_empleado,
    "registros",
    registro.id
  );
  await deleteDoc(docRef);
};

/* ---------------- Funciones de Inicio de Sesion ------------------------- */
const ingresoUsuario = (context, payload) => {
  signInWithEmailAndPassword(auth, payload.email, payload.pass)
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
  signOut(auth).then(() => {
    context.commit("setUsuario", null);
    router.push("/login");
  });
};

export default {
  getPlanilla,
  getEmpleado,
  editarEmpleado,
  agregarEmpleado,
  eliminarEmpleado,
  getRegistrosEmpleado,
  getRegistrosEmpleadoVacaciones,
  getAllRegistrosEmpleado,
  agregarRegistro,
  editarRegistro,
  eliminarRegistro,
  ingresoUsuario,
  detectarUsuario,
  cerrarSesion,
};
