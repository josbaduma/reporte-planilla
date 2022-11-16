<template>
    <v-card elevation="2" outlined shaped>
        <v-card-text class="py-0">
            <v-container>
                <v-row>
                    <v-col cols="4">
                        <h4 class="font-weight-medium black--text">
                            Fecha Inicial
                        </h4>
                        <v-menu v-model="dialog_start_date" :close-on-content-click="false" :nudge-right="40"
                            transition="scale-transition" offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="start_date" prepend-icon="fa-regular fa-calendar" readonly
                                    v-bind="attrs" v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="start_date" @input="menu1 = false"></v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="4">
                        <h4 class="font-weight-medium black--text">
                            Fecha Final
                        </h4>
                        <v-menu v-model="dialog_end_date" :close-on-content-click="false" :nudge-right="40"
                            transition="scale-transition" offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="end_date" prepend-icon="fa-regular fa-calendar" readonly
                                    v-bind="attrs" v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="end_date" @input="menu2 = false"></v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="4">
                        <h4 class="font-weight-medium black--text">
                            Horas laboradas
                        </h4>
                        <br />
                        <p>
                            {{ horas }}
                        </p>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";
import _ from "lodash";

export default {
    name: "HorasLaboradas",
    data() {
        return {
            menu1: false,
            menu2: false,
            dialog_start_date: false,
            dialog_end_date: false,
            start_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            end_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            horas: 0,
        };
    },
    mounted() {
        this.countHours()
    },
    methods: {
        filteredData() {
            var startDate = new Date(this.start_date);
            var endDate = new Date(this.end_date);

            let resultProductData = this.registros.filter((registro) => {
                let date1 = new Date(registro.fecha_inicio);
                let date2 = new Date(registro.fecha_final);

                return (date1 >= startDate && date2 <= endDate);
            });

            return resultProductData;
        },
        countHours() {
            let listReg = this.filteredData();

            let total = 0;

            listReg.map((data) => {
                total = total + data.horas;
            });

            this.horas = total;
        },
    },
    computed: {
        ...mapState(["registros",]),
    },
    watch: {
        start_date: function() {
            this.countHours();
        },

        end_date: function() {
            this.countHours();
        }
    }
};
</script>
