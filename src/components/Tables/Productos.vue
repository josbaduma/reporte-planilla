<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="prodAgrupados"
      :page.sync="page"
      :items-per-page="5"
      hide-default-footer
      sort-by="nombre"
      class="elevation-1 overflow-div"
      @page-count="pageCount = $event"
    ></v-data-table>
    <div class="text-center pt-2">
      <v-pagination :color="tableHeaderColor" v-model="page" :length="pageCount"></v-pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";

export default {
  name: "productos",
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
    start: {
      type: String,
      default: moment().subtract(7, "d").format("DD/MM/YYYY"),
    },
    end: {
      type: String,
      default: moment().format("DD/MM/YYYY"),
    },
  },
  data() {
    return {
      page: 1,
      pageCount: 0,
      headers: [
        { text: "#", value: "id", sortable: false },
        { text: "Nombre", value: "nombre", sortable: true },
        { text: "Cantidad", value: "cantidad" },
      ],
    };
  },
  methods: {},
  computed: {
    ...mapState(["ventas"]),
    prodAgrupados() {
      let productos = [];
      let ventas = [];

      ventas = _.filter(this.ventas, (data) => {
        const start = moment(this.start, "YYYY-MM-DD 00:00:00");
        const date = moment(data.fecha, "DD/MM/YYYY HH:mm:ss");
        const end = moment(this.end, "YYYY-MM-DD").hour(23);
        return date.diff(start) > 0 && end.diff(date) > 0;
      });

      ventas.forEach((venta) => {
        venta.pedidos.forEach((pedido) => {
          let producto = {
            id: pedido.id,
            nombre: pedido.nombre,
            cantidad: pedido.cant,
          };
          productos.push(producto);
        });
      });

      return _(productos)
        .groupBy("nombre")
        .map((producto) => ({
          id: producto[0].id,
          nombre: producto[0].nombre,
          cantidad: _.sumBy(producto, "cantidad"),
        }))
        .value();
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