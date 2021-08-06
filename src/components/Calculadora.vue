<template>
  <v-card elevation="2" outlined shaped>
    <v-card-text class="py-0">
      <v-container>
        <v-row>
          <v-col>
            <h4 class="font-weight-medium black--text">Última Liquidación</h4>
            <p>
              {{
                empleado.ultima_liquidacion
                  .toDate()
                  .toISOString()
                  .substr(0, 10)
              }}
            </p>
          </v-col>
          <v-col>
            <h4 class="font-weight-medium black--text">Aguinaldo</h4>
            <p>{{ calculateAguinaldo }}</p>
          </v-col>
          <v-col>
            <h4 class="font-weight-medium black--text">Vacaciones</h4>
            <p>{{ calculateVacation }}</p>
          </v-col>
          <v-col>
            <v-btn color="error" class="mt-6" @click="liquidar">Liquidar</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";
import _ from "lodash";
import { Timestamp } from "../../firebase";

export default {
  name: "Calculadora",
  data() {
    return {};
  },
  methods: {
    ...mapActions(["editarEmpleado"]),
    convertMoney(value) {
      const formatterPeso = new Intl.NumberFormat("es-CR", {
        style: "currency",
        currency: "CRC",
        minimumFractionDigits: 2,
      });
      let valueFinal = formatterPeso.format(value);

      return valueFinal;
    },
    liquidar() {
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
      this.$router.go();
    },
  },
  computed: {
    ...mapState(["empleado", "registros"]),
    calculateMeses() {
      return this.registros.length * 0.230137;
    },
    salario_semana() {
      return (
        this.registros[0].horas * this.registros[0].salario_hora +
        this.registros[0].vales -
        this.registros[0].alimentacion -
        this.registros[0].seguro
      );
    },
    calculateVacation() {
      return this.convertMoney((this.salario_semana / 6) * this.calculateMeses);
    },
    calculateAguinaldo() {
      const a = _.reduce(
        this.registros,
        function(sum, n) {
          return (
            sum + n.horas * n.salario_hora + n.vales - n.alimentacion - n.seguro
          );
        },
        0
      );
      return this.convertMoney(a / 12);
    },
  },
};
</script>
