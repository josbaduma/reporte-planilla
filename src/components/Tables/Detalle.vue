<template>
  <div>
    <v-row>
      <v-col>
        <p class="text-center">
          <strong>Monto Total:</strong>
          {{getTotal}}
        </p>
      </v-col>
      <v-col>
        <p class="text-center">
          <strong>Impuestos:</strong>
          {{getImpuestos}}
        </p>
      </v-col>
      <v-col>
        <p class="text-center">
          <strong>Monto Total Restaurante:</strong>
          {{getTotalMesas}}
        </p>
      </v-col>
      <v-col>
        <p class="text-center">
          <strong>Monto Total Express:</strong>
          {{getTotalExpress}}
        </p>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="filteredItems"
      hide-default-footer
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      :page.sync="page"
      item-key="id"
      show-expand
      sort-by="fecha"
      class="elevation-1"
      @page-count="pageCount = $event"
    >
      <template v-slot:expanded-item="{ item }">
        <table class="table t">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Precio</th>
            </tr>
          </thead>
          <tbody>
            <tr v-bind:key="pedido.id" v-for="pedido in item.pedidos">
              <td>{{pedido.nombre}}</td>
              <td>{{pedido.cant}}</td>
              <td>{{convertMoney(pedido.precio)}}</td>
            </tr>
          </tbody>
        </table>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination color="green" v-model="page" :length="pageCount"></v-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
export default {
  data() {
    return {
      page: 1,
      pageCount: 0,
      expanded: [],
      singleExpand: true,
      headers: [
        { text: "#", value: "" },
        { text: "Fecha", value: "fecha" },
        { text: "Tipo", value: "tipo" },
        { text: "Mesero", value: "empleado" },
        { text: "Sub total", value: "subtotal" },
        { text: "Impuesto", value: "impuesto" },
        { text: "Total", value: "total" },
        { text: "", value: "data-table-expand" },
      ],
    };
  },
  props: {
    start: {
      type: String,
      default: moment().subtract(7, "d").format("DD/MM/YYYY"),
    },
    end: {
      type: String,
      default: moment().format("DD/MM/YYYY"),
    },
  },
  computed: {
    ...mapState(["ventas"]),
    filteredItems() {
      let ventas = [];

      ventas = _.filter(this.ventas, (data) => {
        const start = moment(this.start, "YYYY-MM-DD 00:00:00");
        const date = moment(data.fecha, "DD/MM/YYYY HH:mm:ss");
        const end = moment(this.end, "YYYY-MM-DD").hour(23);
        return date.diff(start) > 0 && end.diff(date) > 0;
      });

      return ventas;
    },
    getTotal() {
      let total = 0;
      this.filteredItems.map((data) => {
        total = total + data.total;
      });
      return this.convertMoney(total);
    },
    getTotalMesas() {
      let total = 0;
      this.filteredItems.map((data) => {
        if (data.tipo === "Restaurante") {
          total = total + data.total;
        }
      });
      return this.convertMoney(total);
    },
    getTotalExpress() {
      let total = 0;
      this.filteredItems.map((data) => {
        if (data.tipo === "Express") {
          total = total + data.total;
        }
      });
      return this.convertMoney(total);
    },
    getImpuestos() {
      let total = 0;
      this.filteredItems.map((data) => {
        total = total + data.impuesto;
      });
      return this.convertMoney(total);
    },
  },
  methods: {
    convertMoney(value) {
      const formatterPeso = new Intl.NumberFormat("es-CR", {
        style: "currency",
        currency: "CRC",
        minimumFractionDigits: 0,
      });
      let valueFinal = formatterPeso.format(value);

      return valueFinal;
    },
  },
};
</script>