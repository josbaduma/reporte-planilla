<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="clientes_unicos"
      :page.sync="page"
      :items-per-page="5"
      hide-default-footer
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

export default {
  name: "clientes",
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      page: 1,
      pageCount: 0,
      headers: [
        { text: "Nombre", value: "nombre" },
        { text: "Cédula", value: "cedula" },
        { text: "Teléfono", value: "telefono" },
        { text: "Dirección", value: "direccion" },
      ],
    };
  },
  methods: {},
  computed: {
    ...mapState(["clientes"]),
    clientes_unicos() {
      return _.uniqWith(this.clientes, _.isEqual);
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