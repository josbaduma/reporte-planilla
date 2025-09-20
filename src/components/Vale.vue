<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        ref="document"
        id="liquidacion-impreso"
        class="pa-0"
        style="color: #000000"
      >
        <div class="pa-0">
          <table class="tg" id="tableLiquidacion">
            <thead>
              <tr>
                <th
                  data-height="32"
                  data-f-sz="16"
                  data-b-a-s="thin"
                  data-f-bold="true"
                  data-a-wrap="true"
                  class="tg-eqm3"
                  colspan="12"
                >
                  <span style="font-weight: bold"
                    >Pago de
                    {{ vacaciones === undefined ? "Aguinaldo" : "Vacaciones" }}
                    2021</span
                  >
                </th>
                <!-- <th
                  data-b-a-s="thin"
                  data-f-bold="true"
                  class="tg-0pky"
                  colspan="2"
                >
                  <span style="font-weight: bold">Periodo del:</span>
                </th>
                <th
                  data-b-a-s="thin"
                  data-a-h="right"
                  class="tg-0pky"
                  colspan="2"
                >
                  {{
                    vacaciones === undefined
                      ? empleado.ultima_liquidacion
                          .toDate()
                          .toISOString()
                          .substr(0, 10)
                      : empleado.ultima_liquidacion_vacaciones
                          .toDate()
                          .toISOString()
                          .substr(0, 10)
                  }}
                </th>
                <th
                  data-b-a-s="thin"
                  data-a-h="right"
                  class="tg-0pky"
                  colspan="2"
                >
                  Al:
                </th>
                <th
                  data-b-a-s="thin"
                  data-a-h="right"
                  class="tg-0pky"
                  colspan="2"
                >
                  {{ hoy }}
                </th> -->
              </tr>
            </thead>
            <tbody>
              <tr>
                <!-- <td
                  data-b-a-s="thin"
                  data-f-bold="true"
                  class="tg-0pky"
                  colspan="3"
                >
                  <span style="font-weight: bold"
                    >Número de identificación:</span
                  >
                </td>
                <td data-b-a-s="thin" class="tg-0pky" colspan="3">
                  {{ empleado.cedula }}
                </td> -->
                <td
                  data-b-a-s="thin"
                  data-f-bold="true"
                  class="tg-0pky"
                  colspan="3"
                >
                  <span style="font-weight: bold">Nombre:</span>
                </td>
                <td data-b-a-s="thin" class="tg-0pky" colspan="9">
                  <span style="font-weight: 400; font-style: normal"
                    >{{ empleado.nombre }} {{ empleado.apellidos }}</span
                  >
                </td>
              </tr>
              <tr>
                <td
                  data-b-a-s="thin"
                  data-f-bold="true"
                  class="tg-0pky"
                  colspan="3"
                >
                  <span style="font-weight: bold">Puesto:</span>
                </td>
                <td data-b-a-s="thin" class="tg-0pky" colspan="3">
                  <span style="font-weight: 400; font-style: normal">{{
                    empleado.puesto
                  }}</span>
                </td>
                <td
                  data-b-a-s="thin"
                  data-f-bold="true"
                  class="tg-0pky"
                  colspan="3"
                >
                  <span style="font-weight: bolder">Tipo de Colaborador:</span>
                </td>
                <td data-b-a-s="thin" class="tg-0pky" colspan="3">
                  <span style="font-weight: 400; font-style: normal">{{
                    empleado.tipo_colaborador
                  }}</span>
                </td>
              </tr>
              <tr>
                <td
                  data-b-a-s="thin"
                  data-f-bold="true"
                  class="tg-0pky"
                  colspan="3"
                >
                  <span style="font-weight: 700; font-style: normal"
                    >Horas Laboradas:</span
                  >
                </td>
                <td data-b-a-s="thin" class="tg-0pky" colspan="9">
                  <span style="font-weight: 400; font-style: normal">{{
                    calcHours
                  }}</span>
                </td>
              </tr>
              <tr>
                <td
                  v-if="vacaciones === undefined"
                  data-b-a-s="thin"
                  data-f-bold="true"
                  class="tg-0pky"
                  colspan="3"
                >
                  <span style="font-weight: 700; font-style: normal"
                    >Aguinaldo:</span
                  >
                </td>
                <td
                  v-if="vacaciones === undefined"
                  data-b-a-s="thin"
                  class="tg-0pky"
                  colspan="9"
                >
                  <span style="font-weight: 400; font-style: normal">{{
                    aguinaldo
                  }}</span>
                </td>
                <td
                  v-if="aguinaldo === undefined"
                  data-b-a-s="thin"
                  data-f-bold="true"
                  class="tg-0pky"
                  colspan="3"
                >
                  <span style="font-weight: 700; font-style: normal"
                    >Vacaciones:</span
                  >
                </td>
                <td
                  v-if="aguinaldo === undefined"
                  data-b-a-s="thin"
                  class="tg-0pky"
                  colspan="9"
                >
                  <span style="font-weight: 400; font-style: normal">{{
                    vacaciones
                  }}</span>
                </td>
              </tr>
              <tr data-height="32">
                <td
                  data-b-a-s="thin"
                  data-a-wrap="true"
                  data-a-v="top"
                  class="tg-0pky"
                  colspan="3"
                  rowspan="2"
                >
                  <span style="font-weight: 700; font-style: normal"
                    >Firma del colaborador:</span
                  >
                </td>
                <td
                  data-b-a-s="thin"
                  data-a-wrap="true"
                  class="tg-0pky"
                  colspan="3"
                  rowspan="2"
                ></td>
                <td
                  data-b-t-s="thin"
                  data-b-l-s="thin"
                  data-b-r-s="thin"
                  data-a-wrap="true"
                  data-a-v="top"
                  class="tg-0pky"
                  colspan="3"
                >
                  <b>Firma del empleador:</b>
                </td>
                <td
                  data-b-a-s="thin"
                  data-a-wrap="true"
                  class="tg-0pky"
                  colspan="3"
                  rowspan="2"
                ></td>
              </tr>
              <tr>
                <td
                  data-b-b-s="thin"
                  data-b-l-s="thin"
                  data-b-r-s="thin"
                  class="tg-0lax"
                  colspan="3"
                >
                  <span style="font-weight: 400; font-style: normal"
                    >Alejandro León Villegas</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-col>

      <v-col cols="12">
        <v-btn
          color="primary"
          @click="
            exportTableToExcel(
              'tableLiquidacion',
              `${hoy}-liquidacion-${
                vacaciones === undefined ? 'aguinaldo' : 'vacaciones'
              }-${empleado.nombre}`
            )
          "
          >Exportar a Excel</v-btn
        >
        <v-btn color="primary" class="ml-4" @click="liquidar">Liquidar</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import html2pdf from "html2pdf.js";
import { mapActions, mapState } from "vuex";
import moment from "moment";
import _ from "lodash";
import { Timestamp } from "../../firebase";

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
    ...mapState(["empleado", "registros", "registrosVacaciones"]),
    calcHours() {
      return _.reduce(
        this.vacaciones === undefined
          ? this.registros
          : this.registrosVacaciones,
        (sum, n) => {
          return sum + n.horas;
        },
        0
      );
    },
  },
  methods: {
    ...mapActions(["editarEmpleado"]),
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
    exportTableToExcel(tableID, filename = "") {
      filename = filename ? filename + ".xlsx" : "excel_data.xlsx";

      let table = document.getElementById(tableID);
      TableToExcel.convert(table, {
        name: filename,
        sheet: {
          name: "Recibo Empleado",
        },
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
      try {
        const a = {
          id: this.empleado.id,
          cedula: this.empleado.cedula,
          nombre: this.empleado.nombre,
          apellidos: this.empleado.apellidos,
          fecha_inicio: Timestamp.fromDate(
            new Date(this.empleado.fecha_inicio)
          ),
          tipo_colaborador: this.empleado.tipo_colaborador,
          puesto: this.empleado.puesto,
          ultima_liquidacion:
            this.vacaciones === undefined
              ? Timestamp.now()
              : this.empleado.ultima_liquidacion,
          ultima_liquidacion_vacaciones:
            this.aguinaldo === undefined
              ? Timestamp.now()
              : this.empleado.ultima_liquidacion_vacaciones,
          archive: this.empleado.archive,
        };
        this.editarEmpleado(a);
        await this.sleep(750);
        this.$router.go();
      } catch (error) {
        console.error(error);
      } finally {
        //this.$router.go();
      }
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
  },
};
</script>

<style></style>
