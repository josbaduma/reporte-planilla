<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        ref="document"
        id="liquidacion-impreso"
        class="pa-0"
        style="color:#000000;"
      >
        <div class="pa-0">
          <v-row class="bordered-line pa-0">
            <v-col cols="5" class="pa-1" style="font-size:18px;">
              <b>Recibo Liquidación</b>
            </v-col>
            <v-col cols="2" class="pa-1">
              <b>Periodo Del:</b>
            </v-col>
            <v-col cols="2" class="pa-1">
              {{
                empleado.ultima_liquidacion
                  .toDate()
                  .toISOString()
                  .substr(0, 10)
              }}
            </v-col>
            <v-col cols="1" class="pa-1">
              <b>Al:</b>
            </v-col>
            <v-col cols="2" class="pa-1">
              {{ hoy }}
            </v-col>

            <!-- Informacion de Empleado -->
            <v-col cols="3" class="pa-1"> <b>Número de Indentidad</b>: </v-col>
            <v-col cols="3" class="pa-1">
              {{ empleado.cedula }}
            </v-col>
            <v-col cols="3" class="pa-1">
              <b>Nombre:</b>
            </v-col>
            <v-col cols="3" class="pa-1">
              {{ empleado.nombre }} {{ empleado.apellidos }}
            </v-col>
            <v-col cols="1" class="pa-1">
              <b>Puesto:</b>
            </v-col>
            <v-col cols="5" class="pa-1">
              {{ empleado.puesto }}
            </v-col>

            <v-col cols="3" class="pa-1">
              <b>Tipo de Colaborador:</b>
            </v-col>
            <v-col cols="3" class="pa-1">
              {{ empleado.tipo_colaborador }}
            </v-col>

            <v-col cols="3" class="pa-1">
              <b>Horas Laboradas:</b>
            </v-col>
            <v-col cols="9" class="pa-1">
              {{ calcHours }}
            </v-col>

            <v-col cols="3" class="pa-1">
              <b>Aguinaldo:</b>
            </v-col>
            <v-col cols="3" class="pa-1">
              {{ aguinaldo }}
            </v-col>
            <v-col cols="3" class="pa-1">
              <b>Vacaciones:</b>
            </v-col>
            <v-col cols="3" class="pa-1">
              {{ vacaciones }}
            </v-col>
          </v-row>
        </div>
      </v-col>

      <v-col cols="12">
        <v-btn color="primary" @click="exportToPDF">Exportar a PDF</v-btn>
        <v-btn color="primary" class="ml-4" @click="liquidar">Liquidar</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import html2pdf from "html2pdf.js";
import { mapState } from "vuex";
import moment from "moment";
import _ from "lodash";

export default {
  name: "Vale",
  data() {
    moment.locale("es");
    return {
      hoy: moment().format("YYYY-MM-DD"),
    };
  },
  props: {
    aguinaldo: String,
    vacaciones: String,
  },
  computed: {
    ...mapState(["empleado", "registros"]),
    calcHours() {
      return _.reduce(
        this.registros,
        (sum, n) => {
          return sum + n.horas;
        },
        0
      );
    },
  },
  methods: {
    exportToPDF() {
      const a = document.getElementById("liquidacion-impreso");
      html2pdf(a, {
        margin: 0,
        filename: `${this.hoy}-liquidacion-${this.empleado.nombre}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { dpi: 192, letterRendering: true, removeContainer: true },
        jsPDF: { unit: "in", format: [12, 2.835], orientation: "landscape" },
      });
    },
    convertMoney(value) {
      const formatterPeso = new Intl.NumberFormat("es-CR", {
        style: "currency",
        currency: "CRC",
        minimumFractionDigits: 0,
      });
      let valueFinal = formatterPeso.format(value);

      return valueFinal;
    },
    async liquidar() {
      const a = {
        id: this.empleado.id,
        cedula: this.empleado.cedula,
        nombre: this.empleado.nombre,
        apellidos: this.empleado.apellidos,
        fecha_inicio: Timestamp.fromDate(new Date(this.empleado.fecha_inicio)),
        tipo_colaborador: this.empleado.tipo_colaborador,
        puesto: this.empleado.puesto,
        ultima_liquidacion: Timestamp.now(),
      };
      this.editarEmpleado(a);
      await this.sleep(750);
      this.$router.go();
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
  },
};
</script>

<style></style>
