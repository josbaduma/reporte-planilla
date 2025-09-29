<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        ref="document"
        id="registro-impreso"
        class="pa-0"
        style="color: #000000"
      >
        <div class="pa-0">
          <table class="tg" id="toExcel" data-cols-width="7,7,8,7,7,7,7,7,7,,6">
            <thead>
              <tr>
                <th
                  data-b-a-s="thin"
                  data-f-bold="true"
                  class="tg-eqm3"
                  colspan="6"
                >
                  <span style="font-weight: bold">Recibo de Pago</span>
                </th>
                <th
                  data-b-a-s="thin"
                  data-f-bold="true"
                  class="tg-0pky"
                  colspan="2"
                >
                  <span style="font-weight: bold">Fecha:</span>
                </th>
                <th
                  data-b-a-s="thin"
                  data-a-h="right"
                  class="tg-0pky"
                  colspan="2"
                >
                  {{ hoy }}
                </th>
                <th
                  data-b-a-s="thin"
                  data-a-h="right"
                  class="tg-0pky"
                  colspan="2"
                >
                  N° {{ registro.index }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
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
                </td>
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
              </tr>
              <tr>
                <td
                  data-b-a-s="thin"
                  data-f-bold="true"
                  class="tg-0pky"
                  colspan="3"
                >
                  <span style="font-weight: bolder; font-style: normal"
                    >Nombre:</span
                  >
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
                  <span style="font-weight: bolder">Tipo de Colaborador:</span>
                </td>
                <td data-b-a-s="thin" class="tg-0pky" colspan="9">
                  <span style="font-weight: 400; font-style: normal">{{
                    empleado.tipo_colaborador
                  }}</span>
                </td>
                <!--<td
                  data-b-a-s="thin"
                  data-f-bold="true"
                  class="tg-0pky"
                  colspan="3"
                >
                  <span style="font-weight:bolder">Fecha de Ingreso:</span>
                </td>
                <td data-b-a-s="thin" class="tg-0pky" colspan="3">
                  <span style="font-weight:400;font-style:normal">{{
                    empleado.fecha_inicio
                  }}</span>
                </td>-->
              </tr>
              <tr>
                <td
                  data-b-a-s="thin"
                  data-f-bold="true"
                  class="tg-0pky"
                  colspan="3"
                >
                  <span style="font-weight: 700; font-style: normal"
                    >Periodo Laborado:</span
                  >
                </td>
                <td data-b-a-s="thin" class="tg-0pky" colspan="3">
                  <span style="font-weight: 400; font-style: normal">{{
                    registro.fecha_inicio
                  }}</span>
                </td>
                <td
                  data-b-a-s="thin"
                  data-f-bold="true"
                  class="tg-0pky"
                  colspan="3"
                >
                  <span style="font-weight: bold; font-style: normal">Al:</span>
                </td>
                <td data-b-a-s="thin" class="tg-0pky" colspan="3">
                  <span style="font-weight: 400; font-style: normal">{{
                    registro.fecha_final
                  }}</span>
                </td>
              </tr>
              <tr>
                <td
                  data-b-a-s="thin"
                  data-f-bold="true"
                  data-a-h="center"
                  class="tg-gmla"
                  colspan="12"
                >
                  <span style="font-weight: 700; font-style: normal"
                    >Desglose</span
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
                  <span style="font-weight: 700; font-style: normal"
                    >Horas Laboradas:</span
                  >
                </td>
                <td data-b-a-s="thin" class="tg-0pky" colspan="3">
                  <span style="font-weight: 400; font-style: normal">{{
                    registro.horas
                  }}</span>
                </td>
                <td
                  data-b-a-s="thin"
                  data-f-bold="true"
                  class="tg-0pky"
                  colspan="3"
                >
                  <span style="font-weight: 700; font-style: normal"
                    >Salario Bruto:</span
                  >
                </td>
                <td data-b-a-s="thin" class="tg-0pky" colspan="3">
                  <span style="font-weight: 400; font-style: normal">{{
                    convertMoney(registro.horas * registro.salario_hora)
                  }}</span>
                </td>
              </tr>
              <tr>
                <td
                  data-b-a-s="thin"
                  data-f-bold="true"
                  data-a-h="center"
                  class="tg-gmla"
                  colspan="12"
                >
                  <span style="font-weight: 700; font-style: normal"
                    >Deducciones</span
                  >
                </td>
              </tr>
              <tr>
                <td
                  data-b-a-s="thin"
                  data-f-bold="true"
                  class="tg-0pky"
                  colspan="2"
                >
                  <span style="font-weight: 700; font-style: normal"
                    >Seguro:</span
                  >
                </td>
                <td data-b-a-s="thin" class="tg-0pky" colspan="2">
                  <span style="font-weight: 400; font-style: normal">{{
                    convertMoney(registro.seguro)
                  }}</span>
                </td>
                <td
                  data-b-a-s="thin"
                  data-f-bold="true"
                  class="tg-fymr"
                  colspan="2"
                >
                  <span style="font-weight: 700; font-style: normal"
                    >Alimentación:</span
                  >
                </td>
                <td data-b-a-s="thin" class="tg-0pky" colspan="2">
                  <span style="font-weight: 400; font-style: normal">{{
                    convertMoney(registro.alimentacion)
                  }}</span>
                </td>
                <td
                  data-b-a-s="thin"
                  data-f-bold="true"
                  class="tg-0pky"
                  colspan="2"
                >
                  <span style="font-weight: 700; font-style: normal"
                    >Vales:</span
                  >
                </td>
                <td data-b-a-s="thin" class="tg-0pky" colspan="2">
                  <span style="font-weight: 400; font-style: normal">{{
                    convertMoney(registro.vales)
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
                    >Total a pagar:</span
                  >
                </td>
                <td data-b-a-s="thin" class="tg-0pky" colspan="9">
                  {{
                    convertMoney(
                      registro.horas * registro.salario_hora -
                        registro.alimentacion -
                        registro.seguro -
                        registro.vales
                    )
                  }}
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
          @click="exportTableToExcel('toExcel', `${hoy}-${empleado.nombre}`)"
          >Exportar a Excel</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TableToExcel from "@linways/table-to-excel";
import { mapState } from "vuex";
import moment from "moment";
import _ from "lodash";

export default {
  name: "Colilla",
  data() {
    moment.locale("es");
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
    convertMoney(value) {
      const formatterPeso = new Intl.NumberFormat("es-CR", {
        style: "currency",
        currency: "CRC",
        minimumFractionDigits: 0,
      });
      let valueFinal = formatterPeso.format(value);

      return valueFinal;
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
  },
};
</script>
<style>
.bordered-line .col:not(:last-child) {
  border: 1px solid black;
  padding: 2px;
  margin: 0px;
}
.bordered-line .col:last-child {
  border: 1px solid black;
  padding: 0px;
  margin: 0px;
}
table {
  width: 100%;
  table-layout: fixed;
  overflow-wrap: break-word;
}
.tg {
  border-collapse: collapse;
  border-spacing: 0;
}
.tg td {
  border-color: black;
  border-style: solid;
  border-width: 1px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  overflow: hidden;
  padding: 10px 5px;
  word-break: normal;
}
.tg th {
  border-color: black;
  border-style: solid;
  border-width: 1px;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: normal;
  overflow: hidden;
  padding: 10px 5px;
  word-break: normal;
}
.tg .tg-gmla {
  border-color: inherit;
  font-size: 16px;
  text-align: center;
  vertical-align: top;
}
.tg .tg-eqm3 {
  border-color: inherit;
  font-size: 20px;
  text-align: left;
  vertical-align: top;
}
.tg .tg-0pky {
  border-color: inherit;
  text-align: left;
  vertical-align: top;
}
.tg .tg-fymr {
  border-color: inherit;
  font-weight: bold;
  text-align: left;
  vertical-align: top;
}
</style>
