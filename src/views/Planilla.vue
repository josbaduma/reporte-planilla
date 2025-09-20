<template>
  <v-layout>
    <v-container class="grey lighten-5">
      <v-row>
        <v-col cols="12" md="12" sm="12" lg="12" xl="12">
          <h3 class="m-0">Planilla Restaurante Fogoncito</h3>
        </v-col>
        <v-col cols="12" md="12" sm="12" lg="12" xl="12">
          <v-row class="align-center">
            <v-col cols="12">
              <h4 class="m-0">Exportar reporte de horas por rango de fecha</h4>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-menu
                ref="menu_inicio"
                v-model="menu_inicio"
                :close-on-content-click="false"
                :return-value.sync="filtro_fecha_inicio"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="filtro_fecha_inicio"
                    label="Fecha Inicio"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="filtro_fecha_inicio"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu_inicio = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menu_inicio.save(filtro_fecha_inicio)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-menu
                ref="menu_final"
                v-model="menu_final"
                :close-on-content-click="false"
                :return-value.sync="filtro_fecha_final"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="filtro_fecha_final"
                    label="Fecha Final"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="filtro_fecha_final" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu_final = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menu_final.save(filtro_fecha_final)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-btn color="primary" class="m-0" @click="exportarReporte">
                Exportar
              </v-btn>
            </v-col>
          </v-row>
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
                  <v-dialog v-model="dialog" max-width="720px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        dark
                        class="mb-2 mr-3"
                        v-bind="attrs"
                        v-on="on"
                        >Nuevo Empleado</v-btn
                      >
                      <v-btn
                        color="blue-grey darken-1"
                        outlined
                        dark
                        class="mb-2 mr-3"
                        to="/archivados"
                        >Archivados
                      </v-btn>
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
                                ref="menu"
                                v-model="menu"
                                :close-on-content-click="false"
                                :return-value.sync="editedItem.fecha_inicio"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    v-model="editedItem.fecha_inicio"
                                    label="Fecha de Ingreso"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  v-model="editedItem.fecha_inicio"
                                  no-title
                                  scrollable
                                >
                                  <v-spacer></v-spacer>
                                  <v-btn
                                    text
                                    color="primary"
                                    @click="menu = false"
                                  >
                                    Cancel
                                  </v-btn>
                                  <v-btn
                                    text
                                    color="primary"
                                    @click="
                                      $refs.menu.save(editedItem.fecha_inicio)
                                    "
                                  >
                                    OK
                                  </v-btn>
                                </v-date-picker>
                              </v-menu>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.tipo_colaborador"
                                label="Tipo de Colaborador"
                              >
                              </v-text-field>
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
                        <v-btn color="blue darken-1" text @click="close"
                          >Cancelar</v-btn
                        >
                        <v-btn color="blue darken-1" text @click="save"
                          >Guardar</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn
                  class="mr-4"
                  outlined
                  color="teal lighten-1"
                  @click="archiveEmployee(item)"
                  >Archivar</v-btn
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
import * as XLSX from "xlsx";

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
    filtro_fecha_inicio: null,
    filtro_fecha_final: null,
    menu_inicio: false,
    menu_final: false,
    registrosExport: [],
  }),
  created() {
    this.getPlanilla(false);
    this.getEmpleadosConRegistros();
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  computed: {
    ...mapState([
      "planilla",
      "error",
      "registros",
      "allRegistros",
      "empleadosConRegistros",
    ]),
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
      "getEmpleadosConRegistros",
      "agregarEmpleado",
      "eliminarEmpleado",
      "editarEmpleado",
    ]),
    // Convierte fecha firestore, Date o string a 'YYYY-MM-DD'
    toDateString(date) {
      if (!date) return "";
      if (typeof date === "string") return date.substr(0, 10);
      if (date.toDate) return date.toDate().toISOString().substr(0, 10);
      if (date instanceof Date) return date.toISOString().substr(0, 10);
      return "";
    },
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
    archiveEmployee(employee) {
      employee.fecha_inicio = Timestamp.fromDate(
        new Date(employee.fecha_inicio)
      );
      employee.archive = true;
      this.editarEmpleado(employee);
    },

    exportarReporte() {
      if (!this.filtro_fecha_inicio || !this.filtro_fecha_final) {
        this.snackbar = true;
        this.error = "Debe seleccionar ambas fechas para exportar.";
        return;
      }
      const fechaInicio = this.filtro_fecha_inicio;
      const fechaFinal = this.filtro_fecha_final;

      // Formatea fecha a DD-MM-YYYY
      const formatFecha = (fecha) => {
        if (!fecha) return "";
        const [y, m, d] = fecha.split("-");
        return `${d}-${m}-${y}`;
      };

      const empleados = {};
      this.empleadosConRegistros.forEach((empleado) => {
        const nombre = empleado.nombre || "";
        const apellidos = empleado.apellidos || "";
        if (!empleado.registros || !Array.isArray(empleado.registros)) return;
        empleado.registros.forEach((reg) => {
          const fechaReg = this.toDateString(reg.fecha_inicio);
          if (fechaReg >= fechaInicio && fechaReg <= fechaFinal) {
            const key = nombre;
            if (!empleados[key]) {
              empleados[key] = {
                nombre: nombre + " " + apellidos,
                horas: 0,
              };
            }
            empleados[key].horas += Number(reg.horas || 0);
          }
        });
      });
      const data = [
        ["Reporte de Horas"],
        [
          `Rango de fechas: ${formatFecha(fechaInicio)} al ${formatFecha(
            fechaFinal
          )}`,
        ],
        [],
        ["Nombre", "Horas Totales"],
        ...Object.values(empleados).map((e) => [e.nombre, e.horas]),
      ];
      const ws = XLSX.utils.aoa_to_sheet(data);

      // Autoajuste de ancho de columnas
      const colWidths = data[3].map((_, colIdx) => {
        // Empieza en la fila 3 (índice 3) porque ahí están los headers
        let maxLen = 0;
        for (let row = 3; row < data.length; row++) {
          const cell = data[row][colIdx];
          const len = cell ? cell.toString().length : 0;
          if (len > maxLen) maxLen = len;
        }
        // Considera también el header
        const headerLen = data[3][colIdx]
          ? data[3][colIdx].toString().length
          : 0;
        maxLen = Math.max(maxLen, headerLen);
        // Un mínimo razonable
        return { wch: Math.max(maxLen + 2, 12) };
      });
      ws["!cols"] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Reporte Horas");
      XLSX.writeFile(wb, `reporte_horas_${fechaInicio}_a_${fechaFinal}.xlsx`);
    },
  },
};
</script>
