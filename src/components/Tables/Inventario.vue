<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="inventario"
      sort-by="index"
      class="elevation-1 overflow-div"
      :page.sync="page"
      :items-per-page="5"
      hide-default-footer
      @page-count="pageCount = $event"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Items</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Nuevo Item</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="2">
                      <v-text-field v-model="editedItem.index" label="Id"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.nombre" label="Nombre"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field v-model="editedItem.cantidad" label="Cantidad" type="number"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field v-model="editedItem.relacion" label="Relación" type="number"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        v-model="editedItem.productos"
                        :items="productos"
                        :menu-props="{ maxHeight: '400' }"
                        label="Productos"
                        multiple
                        hint="Selecciones los productos"
                        persistent-hint
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">fas fa-edit</v-icon>
        <v-icon small @click="deleteItem(item)">fas fa-trash</v-icon>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import _ from "lodash";

export default {
  name: "inventario",
  data() {
    return {
      dialog: false,
      page: 1,
      pageCount: 0,
      editedIndex: -1,
      editedItem: {
        id: 0,
        index: 0,
        cantidad: 0,
        nombre: "",
        productos: [],
        relacion: 0,
      },
      defaultItem: {
        id: 0,
        index: 0,
        cantidad: 0,
        nombre: "",
        productos: [],
        relacion: 0,
      },
      headers: [
        {
          text: "#",
          align: "start",
          value: "index",
        },
        { text: "Nombre", value: "nombre", sortable: false },
        { text: "Cantidad", value: "cantidad", sortable: false },
        { text: "Acciones", value: "actions", sortable: false },
      ],
    };
  },
  created() {
    this.getInventario(this.restaurante);
    this.getProductos(this.restaurante);
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  props: {
    restaurante: {
      type: String,
      default: "fogoncito1",
    },
  },
  methods: {
    ...mapActions([
      "getInventario",
      "editInventario",
      "deleteInventario",
      "addInventario",
      "getProductos",
    ]),
    editItem(item) {
      this.editedIndex = this.inventario.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.inventario.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.deleteInventario({ username: this.restaurante, id: item.id });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      this.editedItem.username = this.restaurante;
      this.editedItem.cantidad = parseFloat(this.editedItem.cantidad);
      this.editedItem.relacion = parseFloat(this.editedItem.relacion);
      if (this.editedIndex > -1) {
        this.editInventario(this.editedItem);
      } else {
        this.addInventario(this.editedItem);
      }
      this.close();
    },
  },
  computed: {
    ...mapState(["inventario", "productos"]),
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Item" : "Editar Item";
    },
    listaInventario() {
      
    },
  },
};
</script>
<style>
.overflow-div {
  overflow: auto;
  max-height: 50vh;
}
</style>