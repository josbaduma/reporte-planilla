<template>
  <v-container>
    <v-row>
      <v-col cols="12" ref="document" id="registro-impreso" class="pa-0">
        <div class="pa-0">
          <v-row class="bordered-line pa-0">
            <v-col cols="6" class="pa-1" style="font-size:18px;">
              <b>Recibo de Pago</b>
            </v-col>
            <v-col cols="2" class="pa-1">
              Fecha
            </v-col>
            <v-col cols="3" class="pa-1">
              {{ hoy }}
            </v-col>
            <v-col cols="1" class="pa-1">
              N° {{registro.index}}
            </v-col>

            <!-- Informacion de Empleado -->
            <v-col cols="3" class="pa-1"> <b>Número de Indentidad</b>: </v-col>
            <v-col cols="3" class="pa-1">
              {{ empleado.cedula }}
            </v-col>
            <v-col cols="1" class="pa-1">
              <b>Puesto:</b>
            </v-col>
            <v-col cols="5" class="pa-1">
              {{ empleado.puesto }}
            </v-col>

            <v-col cols="3" class="pa-1">
              <b>Nombre:</b>
            </v-col>
            <v-col cols="9" class="pa-1">
              {{ empleado.nombre }} {{ empleado.apellidos }}
            </v-col>

            <v-col cols="3" class="pa-1">
              <b>Tipo de Colaborador:</b>
            </v-col>
            <v-col cols="3" class="pa-1">
              {{ empleado.tipo_colaborador }}
            </v-col>
            <v-col cols="2" class="pa-1">
              <b>Fecha de Ingreso:</b>
            </v-col>
            <v-col cols="4" class="pa-1">
              {{ empleado.fecha_inicio }}
            </v-col>

            <v-col cols="3" class="pa-1">
              <b>Periodo Laborado:</b>
            </v-col>
            <v-col cols="3" class="pa-1">
              {{ registro.fecha_inicio }}
            </v-col>
            <v-col cols="2" class="pa-1">
              Al:
            </v-col>
            <v-col cols="4" class="pa-1">
              {{ registro.fecha_final }}
            </v-col>

            <!-- Desglose -->
            <v-col
              cols="12"
              class="pa-1"
              style="text-align:center;font-size:18px;"
            >
              <b>Desglose</b>
            </v-col>

            <v-col cols="3" class="pa-1">
              <b>Horas Laboradas:</b>
            </v-col>
            <v-col cols="3" class="pa-1">
              {{ registro.horas }}
            </v-col>

            <v-col cols="3" class="pa-1">
              <b>Salario Bruto:</b>
            </v-col>
            <v-col cols="3" class="pa-1">
              {{ convertMoney(registro.horas * registro.salario_hora) }}
            </v-col>

            <v-col
              cols="12"
              class="pa-1"
              style="text-align:center;font-size:18px;"
            >
              <b>Deducciones</b>
            </v-col>

            <v-col cols="2" class="pa-1">
              <b>Seguro:</b>
            </v-col>
            <v-col cols="2" class="pa-1">
              {{ convertMoney(registro.seguro) }}
            </v-col>
            <v-col cols="2" class="pa-1">
              <b>Alimentación:</b>
            </v-col>
            <v-col cols="2" class="pa-1">
              {{ convertMoney(registro.alimentacion) }}
            </v-col>
            <v-col cols="2" class="pa-1">
              <b>Vales:</b>
            </v-col>
            <v-col cols="2" class="pa-1">
              {{ convertMoney(registro.vales) }}
            </v-col>

            <v-col cols="2" class="pa-1">
              <b>Total a pagar:</b>
            </v-col>
            <v-col cols="10" class="pa-1">
              {{ convertMoney((registro.horas * registro.salario_hora) - registro.alimentacion - registro.seguro + registro.vales) }}
            </v-col>
          </v-row>
        </div>
      </v-col>

      <v-col cols="12">
        <v-btn color="primary" @click="exportToPDF">Exportar a PDF</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import html2pdf from "html2pdf.js";
import { mapState } from "vuex";
import moment from "moment";

export default {
  name: "Colilla",
  data() {
    moment.locale('es')
    return {
      hoy: moment().format("DD-MM-YYYY"),
    };
  },
  props: {
    registro: Object,
  },
  computed: {
    ...mapState(["empleado"]),
  },
  methods: {
    exportToPDF() {
      const a = document.getElementById("registro-impreso");
      html2pdf(a, {
        margin: 0,
        filename: `${this.hoy}-${this.empleado.nombre}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { dpi: 192, letterRendering: true, removeContainer: true },
        jsPDF: { unit: "in", format: [14, 3.125], orientation: "landscape" },
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
  },
};
</script>
<style>
.bordered-line .col {
  border: 1px solid black;
  padding: 2px;
  margin: 0px;
}
</style>
