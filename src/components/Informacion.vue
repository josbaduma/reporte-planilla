<template>
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
      <v-dialog v-model="dialog" max-width="720px">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ formTitle }}</span>
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
                      <v-btn text color="primary" @click="menu = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(editedItem.fecha_inicio)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="editedItem.tipo_colaborador"
                    label="Tipo de colaborador"
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
            <v-btn color="blue darken-1" text @click="close">
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" text @click="save">
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>

    <v-card-actions class="pt-0 px-5">
      <v-btn text color="amber accent-4" x-large @click="editItem">
        Editar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { Timestamp } from "../../firebase";

export default {
  computed: {
    ...mapState(["empleado"]),
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Editar Empleado";
    },
  },
  methods: {
    ...mapActions(["getEmpleado", "editarEmpleado"]),
    editItem(item) {
      this.editedIndex = 0;
      this.editedItem = this.empleado;
      this.dialog = true;
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
      if (this.editedIndex > -1) {
        this.editarEmpleado(this.editedItem);
      } else {
        this.empleado.push(this.editedItem);
      }
      this.close();
    },
  },
  props: ["id"],
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  data: () => ({
    dialog: false,
    menu: false,
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
  }),
};
</script>
