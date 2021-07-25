<template>
  <v-layout>
    <v-container class="grey lighten-5">
      <v-row>
        <v-col cols="12" md="12" sm="12" lg="12" xl="12">
          <v-card elevation="2" outlined shaped>
            <v-card-title>
              <v-row>
                <v-col cols="1" class="pb-0">
                  <div class="text-center">
                    <v-btn
                      class="mx-2"
                      fab
                      dark
                      color="primary"
                      small
                      @click="$router.go(-1)"
                    >
                      <v-icon dark> fas fa-arrow-left </v-icon>
                    </v-btn>
                  </div>
                </v-col>
                <v-col cols="11" class="pb-0">
                  <h3 class="font-weight-medium black--text ma-0">
                    Información de Empleado
                  </h3>
                </v-col>
              </v-row>
            </v-card-title>

            <v-card-text class="py-0">
              <v-row align="center" class="mx-0">
                <v-col cols="6" md="3">
                  <h4 class="font-weight-medium black--text">Cédula:</h4>
                  <span>{{ empleado.cedula }}</span></v-col
                >
                <v-col cols="6" md="3">
                  <h4 class="font-weight-medium black--text">Nombre:</h4>
                  <span>{{ empleado.nombre }}</span>
                </v-col>
                <v-col cols="6" md="3">
                  <h4 class="font-weight-medium black--text">Apellidos:</h4>
                  <span>{{ empleado.apellidos }}</span>
                </v-col>
                <v-col cols="6" md="3">
                  <h4 class="font-weight-medium black--text">
                    Fecha de ingreso:
                  </h4>
                  <span>{{ empleado.fecha_inicio }}</span>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions class="pt-0 px-5">
              <v-btn text color="amber accent-4" x-large @click="editItem">
                Editar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" md="12" sm="12" lg="12" xl="12">
          <div>
            <v-data-table
              :headers="headers"
              :items="registros"
              sort-by="fecha_inicio"
              class="elevation-1 overflow-div"
              :page.sync="page"
              :items-per-page="10"
              hide-default-footer
              @page-count="pageCount = $event"
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
                            <v-col cols="12" sm="6" md="3">
                              <v-text-field
                                v-model="editedItem.domingo"
                                label="Horas Domingo"
                                type="number"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                              <v-text-field
                                v-model="editedItem.lunes"
                                label="Horas Lunes"
                                type="number"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                              <v-text-field
                                v-model="editedItem.martes"
                                label="Horas Martes"
                                type="number"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                              <v-text-field
                                v-model="editedItem.miercoles"
                                label="Horas Miercoles"
                                type="number"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                              <v-text-field
                                v-model="editedItem.jueves"
                                label="Horas Jueves"
                                type="number"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                              <v-text-field
                                v-model="editedItem.viernes"
                                label="Horas Viernes"
                                type="number"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                              <v-text-field
                                v-model="editedItem.sabado"
                                label="Horas Sábado"
                                type="number"
                              ></v-text-field>
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
                </v-toolbar>
              </template>
              <template v-slot:[`item.horas`]="{ item }">
                <span>{{ item.horas }}</span>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
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
    </v-container>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Timestamp } from "../../firebase";

export default {
  name: "Empleado",
  data() {
    return {
      id: this.$route.params.id,
      menu: false,
      menu_final: false,
      dialog: false,
      page: 1,
      pageCount: 0,
      headers: [
        { text: "#", value: "index", sortable: false },
        { text: "Fecha Inicial", value: "fecha_inicio", sortable: true },
        { text: "Fecha Final", value: "fecha_final", sortable: true },
        { text: "Horas Trabajadas", value: "horas", sortable: false },
        { text: "Acciones", value: "actions", sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        id: 0,
        domingo: 0,
        lunes: 0,
        martes: 0,
        miercoles: 0,
        jueves: 0,
        viernes: 0,
        sabado: 0,
        fecha_inicio: null,
        fecha_final: null,
      },
      defaultItem: {
        id: 0,
        domingo: 0,
        lunes: 0,
        martes: 0,
        miercoles: 0,
        jueves: 0,
        viernes: 0,
        sabado: 0,
        fecha_inicio: null,
        fecha_final: null,
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
  mounted() {
    this.getEmpleado(this.id);
    this.getRegistrosEmpleado(this.id);
  },
  computed: {
    ...mapState(["empleado", "registros"]),
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Registro" : "Editar Registro";
    },
  },
  methods: {
    ...mapActions([
      "getEmpleado",
      "getRegistrosEmpleado",
      "agregarRegistro",
      "editarRegistro",
    ]),
    editItem(item) {
      this.editedIndex = this.registros.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.registros.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.registros.splice(this.editedIndex, 1);
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
      if (this.editedIndex > -1) {
        const splitedFechaInicio = this.editedItem.fecha_inicio.split("/");
        const splitedFechaFinal = this.editedItem.fecha_final.split("/");
        this.editedItem.fecha_inicio = Timestamp.fromDate(
          new Date(
            splitedFechaInicio[2],
            splitedFechaInicio[1] - 1,
            splitedFechaInicio[0]
          )
        );
        this.editedItem.fecha_final = Timestamp.fromDate(
          new Date(
            splitedFechaFinal[2],
            splitedFechaFinal[1] - 1,
            splitedFechaFinal[0]
          )
        );
        this.editarRegistro(this.editedItem);
      } else {
        this.editedItem.fecha_inicio = Timestamp.fromDate(
          new Date(this.editedItem.fecha_inicio)
        );
        this.editedItem.fecha_final = Timestamp.fromDate(
          new Date(this.editedItem.fecha_final)
        );
        this.agregarRegistro(this.editedItem);
      }
      this.close();
    },
  },
};
</script>
