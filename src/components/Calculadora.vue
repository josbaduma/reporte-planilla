<template>
  <v-card elevation="2" outlined shaped>
    <v-card-text class="py-0">
      <v-container>
        <v-row>
          <v-col cols="4">
            <h4 class="font-weight-medium black--text">
              Última Liquidación Aguinaldo
            </h4>
            <p>
              {{
                empleado
                  ? empleado.ultima_liquidacion
                      .toDate()
                      .toISOString()
                      .substr(0, 10)
                  : ""
              }}
            </p>
          </v-col>
          <v-col cols="4">
            <h4 class="font-weight-medium black--text">Monto</h4>
            <p>{{ calculateAguinaldo }}</p>
          </v-col>
          <v-col cols="4">
            <v-dialog v-model="dialog_print_aguinaldo" width="1100">
              <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                  Colilla de Pago
                </v-card-title>

                <v-card-text>
                  <Vale
                    :aguinaldo="calculateAguinaldo"
                  />
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="dialog_print_aguinaldo = false">
                    Cerrar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-btn
              color="error"
              class="mt-6"
              @click="dialog_print_aguinaldo = !dialog_print_aguinaldo"
              >Liquidar</v-btn
            >
          </v-col>
          <v-col cols="4">
            <h4 class="font-weight-medium black--text">
              Última Liquidación Vacaciones
            </h4>
            <p>
              {{
                empleado
                  ? empleado.ultima_liquidacion_vacaciones
                      .toDate()
                      .toISOString()
                      .substr(0, 10)
                  : ""
              }}
            </p>
          </v-col>
          <v-col cols="4">
            <h4 class="font-weight-medium black--text">Monto</h4>
            <p>{{ calculateVacation }}</p>
          </v-col>
          <v-col cols="4">
            <v-dialog v-model="dialog_print_vacations" width="1100">
              <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                  Colilla de Pago
                </v-card-title>

                <v-card-text>
                  <Vale
                    :vacaciones="calculateVacation"
                  />
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="dialog_print_vacations = false">
                    Cerrar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-btn
              color="error"
              class="mt-6"
              @click="dialog_print_vacations = !dialog_print_vacations"
              >Liquidar</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";
import _ from "lodash";
import Vale from "./Vale.vue";

export default {
  name: "Calculadora",
  data() {
    return {
      dialog_print_aguinaldo: false,
      dialog_print_vacations: false,
    };
  },
  components: {
    Vale,
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
  },
  computed: {
    ...mapState(["empleado", "registros", "registrosVacaciones"]),
    calculateMeses() {
      return this.registrosVacaciones.length * 0.230137;
    },
    salario_semana() {
      if (this.registrosVacaciones.length === 0) {
        return 0;
      }
      return (
        this.registrosVacaciones[0].horas * this.registrosVacaciones[0].salario_hora
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
            sum + n.horas * n.salario_hora
          );
        },
        0
      );
      return this.convertMoney(a / 12);
    },
  },
};
</script>
