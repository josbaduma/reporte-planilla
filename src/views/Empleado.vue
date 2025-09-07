<template>
  <v-layout>
    <v-container class="grey lighten-5">
      <v-row>
        <v-col cols="12" md="12" sm="12" lg="12" xl="12">
          <Informacion :id="id" />
        </v-col>

        <v-col cols="12" md="12" sm="12" lg="12" xl="12">
          <HorasLaboradas />
        </v-col>

        <v-col cols="12" md="12" sm="12" lg="12" xl="12">
          <Calculadora />
        </v-col>
        <v-col cols="12" md="12" sm="12" lg="12" xl="12">
          <div>
            <v-data-table
              :headers="headers"
              :items="allRegistros"
              sort-by="fecha_inicio"
              class="elevation-1 overflow-div"
              :page.sync="page"
              :items-per-page="5"
              hide-default-footer
              @page-count="pageCount = $event"
              :sort-desc="[true]"
              :sort-by="['fecha_inicio']"
            >
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>Registros Semanales</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="dialog" max-width="720px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        dark
                        class="mb-2"
                        v-bind="attrs"
                        v-on="on"
                        >Nuevo Registro</v-btn
                      >
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6">
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
                                    label="Fecha Inicio"
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
                            <v-col cols="12" sm="6">
                              <v-menu
                                ref="menu_final"
                                v-model="menu_final"
                                :close-on-content-click="false"
                                :return-value.sync="editedItem.fecha_final"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                    v-model="editedItem.fecha_final"
                                    label="Fecha Final"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                  ></v-text-field>
                                </template>
                                <v-date-picker
                                  v-model="editedItem.fecha_final"
                                  no-title
                                  scrollable
                                >
                                  <v-spacer></v-spacer>
                                  <v-btn
                                    text
                                    color="primary"
                                    @click="menu_final = false"
                                  >
                                    Cancel
                                  </v-btn>
                                  <v-btn
                                    text
                                    color="primary"
                                    @click="
                                      $refs.menu_final.save(
                                        editedItem.fecha_final
                                      )
                                    "
                                  >
                                    OK
                                  </v-btn>
                                </v-date-picker>
                              </v-menu>
                            </v-col>
                            <v-col cols="12">
                              <div class="mb-2">
                                <h4>
                                  <strong>Horas Totales: </strong
                                  >{{ editedItem.horas }}
                                </h4>
                              </div>
                            </v-col>
                            <v-col
                              v-for="(dia, idx) in diasSemana"
                              :key="dia.nombre"
                              cols="12"
                              sm="6"
                              md="4"
                            >
                              <v-card outlined class="mb-2">
                                <v-card-title class="py-2">
                                  <strong>{{ dia.nombre }}</strong>
                                  <span
                                    v-if="
                                      editedItem.horasPorDia[idx].inicio &&
                                      editedItem.horasPorDia[idx].final
                                    "
                                    style="
                                      margin-left: 8px;
                                      color: #1976d2;
                                      font-weight: normal;
                                      font-size: 0.95em;
                                    "
                                  >
                                    {{
                                      calcularHorasDia(
                                        editedItem.horasPorDia[idx].inicio,
                                        editedItem.horasPorDia[idx].final
                                      )
                                    }}
                                    h
                                  </span>
                                </v-card-title>
                                <v-card-text>
                                  <v-row>
                                    <v-col cols="6">
                                      <v-menu
                                        v-model="
                                          editedItem.horasPorDia[idx].menuInicio
                                        "
                                        :close-on-content-click="false"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="auto"
                                      >
                                        <template
                                          v-slot:activator="{ on, attrs }"
                                        >
                                          <v-text-field
                                            v-model="
                                              editedItem.horasPorDia[idx].inicio
                                            "
                                            label="Inicio"
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                          ></v-text-field>
                                        </template>
                                        <v-time-picker
                                          v-model="
                                            editedItem.horasPorDia[idx].inicio
                                          "
                                          format="24hr"
                                        >
                                          <v-spacer></v-spacer>
                                          <v-btn
                                            text
                                            color="primary"
                                            @click="
                                              editedItem.horasPorDia[
                                                idx
                                              ].menuInicio = false
                                            "
                                            >Cancelar</v-btn
                                          >
                                          <v-btn
                                            text
                                            color="primary"
                                            @click="
                                              editedItem.horasPorDia[
                                                idx
                                              ].menuInicio = false
                                            "
                                            >OK</v-btn
                                          >
                                        </v-time-picker>
                                      </v-menu>
                                    </v-col>
                                    <v-col cols="6">
                                      <v-menu
                                        v-model="
                                          editedItem.horasPorDia[idx].menuFinal
                                        "
                                        :close-on-content-click="false"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="auto"
                                      >
                                        <template
                                          v-slot:activator="{ on, attrs }"
                                        >
                                          <v-text-field
                                            v-model="
                                              editedItem.horasPorDia[idx].final
                                            "
                                            label="Final"
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                          ></v-text-field>
                                        </template>
                                        <v-time-picker
                                          v-model="
                                            editedItem.horasPorDia[idx].final
                                          "
                                          format="24hr"
                                        >
                                          <v-spacer></v-spacer>
                                          <v-btn
                                            text
                                            color="primary"
                                            @click="
                                              editedItem.horasPorDia[
                                                idx
                                              ].menuFinal = false
                                            "
                                            >Cancelar</v-btn
                                          >
                                          <v-btn
                                            text
                                            color="primary"
                                            @click="
                                              editedItem.horasPorDia[
                                                idx
                                              ].menuFinal = false
                                            "
                                            >OK</v-btn
                                          >
                                        </v-time-picker>
                                      </v-menu>
                                    </v-col>
                                  </v-row>
                                </v-card-text>
                              </v-card>
                            </v-col>
                            <v-col cols="12">
                              <v-row>
                                <v-col cols="12" sm="6" md="3">
                                  <v-text-field
                                    v-model="editedItem.salario_hora"
                                    label="Salario por hora"
                                    type="number"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                  <v-text-field
                                    v-model="editedItem.vales"
                                    label="Vales"
                                    type="number"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                  <v-text-field
                                    v-model="editedItem.seguro"
                                    label="Seguro"
                                    type="number"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                  <v-text-field
                                    v-model="editedItem.alimentacion"
                                    label="Alimentación"
                                    type="number"
                                  ></v-text-field>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-btn color="blue darken-1" text @click="close"
                          >Cancelar</v-btn
                        >
                        <v-btn color="blue darken-1" text @click="save"
                          >Guardar</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                      <v-card-title class="text-h5"
                        >¿Seguro que desea borrar el registro?</v-card-title
                      >
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="closeDelete"
                          >Cancel</v-btn
                        >
                        <v-btn
                          color="blue darken-1"
                          text
                          @click="deleteItemConfirm"
                          >OK</v-btn
                        >
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <template v-slot:[`item.horas`]="{ item }">
                <span>{{ item.horas }}</span>
              </template>
              <template v-slot:[`item.salario_hora`]="{ item }">
                <span>{{
                  convertMoney(
                    item.horas * item.salario_hora +
                      item.vales -
                      item.alimentacion -
                      item.seguro
                  )
                }}</span>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="printItem(item)"
                  >fas fa-print</v-icon
                >
                <v-icon small class="mr-2" @click="editItem(item)"
                  >fas fa-edit</v-icon
                >
                <v-icon small @click="deleteItem(item)">fas fa-trash</v-icon>
              </template>
            </v-data-table>
            <div class="text-center pt-2">
              <v-pagination v-model="page" :length="pageCount"></v-pagination>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-dialog v-model="dialog_print" width="1100">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Colilla de Pago
          </v-card-title>

          <v-card-text>
            <Colilla :registro="editedItem" />
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog_print = false">
              Cerrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Timestamp } from "../../firebase";
import Informacion from "../components/Informacion.vue";
import Colilla from "../components/Colilla.vue";
import Calculadora from "../components/Calculadora.vue";
import HorasLaboradas from "../components/HorasLaboradas.vue";

export default {
  name: "Empleado",
  components: {
    Informacion,
    Colilla,
    Calculadora,
    HorasLaboradas,
    HorasLaboradas,
  },
  data() {
    return {
      id: this.$route.params.id,
      menu: false,
      menu_final: false,
      dialog: false,
      dialog_print: false,
      dialogDelete: false,
      page: 1,
      pageCount: 0,
      headers: [
        { text: "#", value: "index", sortable: false },
        { text: "Fecha Inicial", value: "fecha_inicio", sortable: true },
        { text: "Fecha Final", value: "fecha_final", sortable: true },
        { text: "Horas Trabajadas", value: "horas", sortable: false },
        { text: "Salario semanal", value: "salario_hora", sortable: false },
        { text: "Acciones", value: "actions", sortable: false },
      ],
      diasSemana: [
        { nombre: "Domingo" },
        { nombre: "Lunes" },
        { nombre: "Martes" },
        { nombre: "Miércoles" },
        { nombre: "Jueves" },
        { nombre: "Viernes" },
        { nombre: "Sábado" },
      ],
      editedIndex: -1,
      editedItem: {
        id: 0,
        horas: 0,
        alimentacion: 0,
        seguro: 0,
        salario_hora: 0,
        vales: 0,
        horasPorDia: [
          { inicio: "", final: "", horasDia: 0 },
          { inicio: "", final: "", horasDia: 0 },
          { inicio: "", final: "", horasDia: 0 },
          { inicio: "", final: "", horasDia: 0 },
          { inicio: "", final: "", horasDia: 0 },
          { inicio: "", final: "", horasDia: 0 },
          { inicio: "", final: "", horasDia: 0 },
        ],
      },
      defaultItem: {
        id: 0,
        horas: 0,
        alimentacion: 0,
        seguro: 0,
        salario_hora: 0,
        vales: 0,
        horasPorDia: [
          { inicio: "", final: "", horasDia: 0 },
          { inicio: "", final: "", horasDia: 0 },
          { inicio: "", final: "", horasDia: 0 },
          { inicio: "", final: "", horasDia: 0 },
          { inicio: "", final: "", horasDia: 0 },
          { inicio: "", final: "", horasDia: 0 },
          { inicio: "", final: "", horasDia: 0 },
        ],
      },
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  async mounted() {
    await this.getEmpleado(this.id);
    await this.getRegistrosEmpleado(this.id);
    await this.getAllRegistrosEmpleado(this.id);
    await this.getRegistrosEmpleadoVacaciones(this.id);
  },
  computed: {
    ...mapState(["registros", "allRegistros", "registrosVacaciones"]),
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Registro" : "Editar Registro";
    },
  },
  methods: {
    ...mapActions([
      "getEmpleado",
      "getRegistrosEmpleado",
      "getAllRegistrosEmpleado",
      "agregarRegistro",
      "editarRegistro",
      "eliminarRegistro",
      "getRegistrosEmpleadoVacaciones",
    ]),
    convertMoney(value) {
      const formatterPeso = new Intl.NumberFormat("es-CR", {
        style: "currency",
        currency: "CRC",
        minimumFractionDigits: 0,
      });
      let valueFinal = formatterPeso.format(value);
      return valueFinal;
    },
    calcularHorasDia(inicio, final) {
      if (!inicio || !final) return 0;
      const [hIni, mIni] = inicio.split(":").map(Number);
      const [hFin, mFin] = final.split(":").map(Number);
      let inicioMin = hIni * 60 + mIni;
      let finalMin = hFin * 60 + mFin;
      let diff = finalMin - inicioMin;
      return diff > 0 ? Math.round((diff / 60) * 100) / 100 : 0;
    },
    editItem(item) {
      this.editedIndex = this.allRegistros.indexOf(item);
      // Copia profunda y asegura estructura de horasPorDia
      const dias = 7;
      let horasPorDia = Array.isArray(item.horasPorDia)
        ? item.horasPorDia.slice()
        : [];
      for (let i = 0; i < dias; i++) {
        if (!horasPorDia[i])
          horasPorDia[i] = { inicio: "", final: "", horasDia: 0 };
        if (horasPorDia[i].inicio === undefined) horasPorDia[i].inicio = "";
        if (horasPorDia[i].final === undefined) horasPorDia[i].final = "";
        if (horasPorDia[i].horasDia === undefined) horasPorDia[i].horasDia = 0;
      }
      // Asegura que fecha_inicio y fecha_final sean string para VDatePicker
      let fecha_inicio = typeof item.fecha_inicio === "string"
        ? item.fecha_inicio
        : item.fecha_inicio && typeof item.fecha_inicio.toDate === "function"
          ? item.fecha_inicio.toDate().toISOString().substr(0, 10)
          : "";
      let fecha_final = typeof item.fecha_final === "string"
        ? item.fecha_final
        : item.fecha_final && typeof item.fecha_final.toDate === "function"
          ? item.fecha_final.toDate().toISOString().substr(0, 10)
          : "";
      this.editedItem = { ...item, horasPorDia, fecha_inicio, fecha_final };
      this.dialog = true;
    },
    printItem(item) {
      this.editedIndex = this.registros.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog_print = true;
    },
    deleteItem(item) {
      this.editedIndex = this.registros.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      const reg = {
        id: this.editedItem.id,
        id_empleado: this.id,
      };
      this.eliminarRegistro(reg);
      this.closeDelete();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      this.editedItem.id_empleado = this.id;
      this.editedItem.fecha_inicio = Timestamp.fromDate(
        new Date(this.editedItem.fecha_inicio)
      );
      this.editedItem.fecha_final = Timestamp.fromDate(
        new Date(this.editedItem.fecha_final)
      );
      // Calcular horas totales de la semana y horas por día
      let totalHoras = 0;
      this.editedItem.horasPorDia.forEach((dia) => {
        if (dia.inicio && dia.final) {
          // Formato HH:mm
          const [hIni, mIni] = dia.inicio.split(":").map(Number);
          const [hFin, mFin] = dia.final.split(":").map(Number);
          let inicioMin = hIni * 60 + mIni;
          let finalMin = hFin * 60 + mFin;
          let diff = finalMin - inicioMin;
          if (diff > 0) {
            const horasDia = Math.round((diff / 60) * 100) / 100;
            dia.horasDia = horasDia;
            totalHoras += horasDia;
          } else {
            dia.horasDia = 0;
          }
        } else {
          dia.horasDia = 0;
        }
      });
      this.editedItem.horas = Math.round(totalHoras * 100) / 100;
      if (this.editedIndex > -1) {
        this.editarRegistro(this.editedItem);
      } else {
        this.agregarRegistro(this.editedItem);
      }
      this.close();
    },
  },
};
</script>
