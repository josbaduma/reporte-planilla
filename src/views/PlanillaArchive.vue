<template>
  <v-layout>
    <v-container class="grey lighten-5">
      <v-row>
        <v-col cols="12" md="12" sm="12" lg="12" xl="12">
          <h3>Planilla Archivados</h3>
        </v-col>
        <v-col cols="12" md="12" sm="12" lg="12" xl="12">
          <div>
            <v-data-table
              :headers="headers"
              :items="planilla"
              sort-by="cedula"
              class="elevation-1 overflow-div"
              :page.sync="page"
              :items-per-page="10"
              hide-default-footer
              @page-count="pageCount = $event"
            >
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>Empleados</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                </v-toolbar>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn
                  class="mr-4"
                  outlined
                  color="teal lighten-1"
                  @click="dearchiveEmployee(item)"
                  >Desarchivar</v-btn
                >
                <v-btn
                  class="mr-4"
                  outlined
                  color="red lighten-1"
                  @click="eliminarEmpleado(item.id)"
                  >Borrar</v-btn
                >
                <v-icon
                  class="mr-2"
                  color="blue-grey darken-1"
                  @click="goEmployeePage(item)"
                  >fas fa-arrow-circle-right
                </v-icon>
              </template>
            </v-data-table>
            <div class="text-center pt-2">
              <v-pagination v-model="page" :length="pageCount"></v-pagination>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-snackbar v-model="snackbar" :timeout="duration">
      {{ error }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Timestamp } from "../../firebase";
import router from "../router";

export default {
  name: "Archivados",
  data: () => ({
    menu: false,
    dialog: false,
    page: 1,
    pageCount: 0,
    editedIndex: -1,
    editedItem: {
      id: 0,
      cedula: null,
      nombre: null,
      apellidos: null,
      fecha_inicio: null,
      tipo_colaborador: null,
      puesto: null,
      ultima_liquidacion: null,
    },
    defaultItem: {
      id: 0,
      cedula: null,
      nombre: null,
      apellidos: null,
      fecha_inicio: null,
      tipo_colaborador: null,
      puesto: null,
      ultima_liquidacion: null,
    },
    snackbar: false,
    duration: 4000,
    headers: [
      {
        text: "Cédula",
        align: "start",
        value: "cedula",
      },
      { text: "Nombre", value: "nombre", sortable: false },
      { text: "Apellidos", value: "apellidos", sortable: false },
      { text: "Fecha de Ingreso", value: "fecha_inicio", sortable: false },
      { text: "Acciones", value: "actions", sortable: false },
    ],
  }),
  created() {
    this.getPlanilla(true);
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  computed: {
    ...mapState(["planilla", "error", "registros"]),
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Item" : "Editar Item";
    },
    calculateAguinaldo() {
      const a = _.reduce(
        this.registros,
        function (sum, n) {
          return (
            sum + n.horas * n.salario_hora + n.vales - n.alimentacion - n.seguro
          );
        },
        0
      );
      return this.convertMoney(a / 12);
    },
  },
  methods: {
    ...mapActions([
      "getPlanilla",
      "agregarEmpleado",
      "eliminarEmpleado",
      "editarEmpleado",
    ]),
    convertMoney(value) {
      const formatterPeso = new Intl.NumberFormat("es-CR", {
        style: "currency",
        currency: "CRC",
        minimumFractionDigits: 2,
      });
      let valueFinal = formatterPeso.format(value);

      return valueFinal;
    },
    goEmployeePage(item) {
      router.push({ name: "Empleado", params: { id: item.id } });
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      this.editedItem.fecha_inicio = Timestamp.fromDate(
        new Date(this.editedItem.fecha_inicio)
      );
      this.editedItem.ultima_liquidacion = this.editedItem.fecha_inicio;
      this.editedItem.ultima_liquidacion_vacaciones =
        this.editedItem.fecha_inicio;

      if (this.editedIndex > -1) {
        console.log("Editar");
      } else {
        this.agregarEmpleado(this.editedItem);
      }
      this.close();
    },
    dearchiveEmployee(employee) {
      employee.fecha_inicio = Timestamp.fromDate(
        new Date(employee.fecha_inicio)
      );
      employee.archive = false;
      this.editarEmpleado(employee);
    },
  },
};
</script>
