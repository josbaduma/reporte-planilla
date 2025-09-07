<template>
  <v-layout>
    <v-container class="grey lighten-5">
      <v-row>
        <v-col cols="12">
          <h3>Planilla Restaurante Fogoncito</h3>
        </v-col>
        <v-col cols="12">
          <div>
            <v-data-table
              :headers="headers"
              :items="planilla"
              :sort-by="['cedula']"
              class="elevation-1 overflow-div"
              v-model:page="page"
              :items-per-page="10"
              :hide-default-footer="true"
              @update:page-count="pageCount = $event"
            >
              <template #top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>Empleados</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="dialog" max-width="720px">
                    <template #activator="{ props }">
                      <v-btn
                        color="primary"
                        variant="outlined"
                        class="mb-2 mr-3"
                        v-bind="props"
                        >Nuevo Empleado</v-btn
                      >
                      <v-btn
                        color="secondary"
                        variant="outlined"
                        class="mb-2 mr-3"
                        to="/archivados"
                        >Archivados</v-btn
                      >
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                      </v-card-title>
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.id"
                                label="Id"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.cedula"
                                label="Cédula"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.nombre"
                                label="Nombre"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.apellidos"
                                label="Apellidos"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-menu
                                v-model="menu"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                              >
                                <template #activator="{ props }">
                                  <v-text-field
                                    v-model="editedItem.fecha_inicio"
                                    label="Fecha de Ingreso"
                                    readonly
                                    v-bind="props"
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  v-model="editedItem.fecha_inicio"
                                  scrollable
                                >
                                  <v-spacer></v-spacer>
                                  <v-btn
                                    variant="text"
                                    color="primary"
                                    @click="menu = false"
                                    >Cancelar</v-btn
                                  >
                                  <v-btn
                                    variant="text"
                                    color="primary"
                                    @click="menu = false"
                                    >OK</v-btn
                                  >
                                </v-date-picker>
                              </v-menu>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.tipo_colaborador"
                                label="Tipo de Colaborador"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.puesto"
                                label="Puesto"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue" variant="text" @click="close"
                          >Cancelar</v-btn
                        >
                        <v-btn color="blue" variant="text" @click="save"
                          >Guardar</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <template #item.actions="{ item }">
                <v-btn
                  class="mr-4"
                  variant="outlined"
                  color="teal"
                  @click="archiveEmployee(item)"
                  >Archivar</v-btn
                >
                <v-icon
                  class="mr-2"
                  color="blue-grey"
                  icon="fas fa-arrow-circle-right"
                  size="large"
                  @click="goEmployeePage(item)"
                ></v-icon>
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
      {{ localError }}
      <template #actions>
        <v-btn color="blue" variant="text" @click="snackbar = false"
          >Cerrar</v-btn
        >
      </template>
    </v-snackbar>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Timestamp } from "../../firebase";
import router from "../router";
import _ from "lodash";

export default {
  name: "Planilla",
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
    localError: "", // propiedad local para el mensaje
    headers: [
      { text: "Cédula", align: "start", value: "cedula" },
      { text: "Nombre", value: "nombre", sortable: false },
      { text: "Apellidos", value: "apellidos", sortable: false },
      { text: "Fecha de Ingreso", value: "fecha_inicio", sortable: false },
      { text: "Acciones", value: "actions", sortable: false },
    ],
  }),
  created() {
    try {
      this.getPlanilla(false);
    } catch (err) {
      this.snackbar = true;
      this.localError = err.message || "Error al cargar la planilla";
    }
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
      if (!this.registros || !Array.isArray(this.registros)) return 0;
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
      return formatterPeso.format(value);
    },
    goEmployeePage(item) {
      if (item && item.id) {
        router.push({ name: "Empleado", params: { id: item.id } });
      } else {
        this.snackbar = true;
        this.localError = "El empleado no tiene un ID válido.";
      }
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
        // Editar empleado
      } else {
        this.agregarEmpleado(this.editedItem);
      }
      this.close();
    },
    archiveEmployee(employee) {
      employee.fecha_inicio = Timestamp.fromDate(
        new Date(employee.fecha_inicio)
      );
      employee.archive = true;
      this.editarEmpleado(employee);
    },
  },
};
</script>
