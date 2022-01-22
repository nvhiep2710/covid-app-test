<template>
  <div class="text-center">
    <v-dialog v-model="open" width="1100" @click:outside="reset">
      <v-card>
        <v-card-title> Country Information </v-card-title>

        <div v-if="loading" class="loading-box text-center">
          <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>
        <div v-else>
          <v-card-text v-if="errorMsg">
            {{ errorMsg }}
          </v-card-text>
          <div v-if="countryInfo" class="country-info">
            <div class="general">
              <label for="name">Code:</label>
              <span>{{ countryInfo.cca2 }} </span>
              <label for="name">Flag:</label>
              <span class="flag">{{ countryInfo.flag }} </span>
              <label for="name">Name:</label>
              <span
                >{{ countryInfo.name.common }} ({{
                  countryInfo.name.official
                }})</span
              >
              <label for="name">Population:</label>
              <span>{{ countryInfo.population | numberWithCommas }} </span>
              <label for="name">Continent:</label>
              <span>{{ countryInfo.region | emptyString }} </span>
              <label for="name">Subregion:</label>
              <span>{{ countryInfo.subregion | emptyString }} </span>
              <label for="name">Reference:</label>
              <a :href="countryInfo.maps.googleMaps" target="_blank"
                >{{ countryInfo.maps.googleMaps | emptyString }}
              </a>
            </div>

            <div class="chart">
              <LineChart
                :data="lineChartData"
                :options="lineChartOptions"
                :height="400"
              />
            </div>
          </div>
        </div>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="reset">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import LineChart from '~/components/base/LineChart.vue'

export default {
  components: { LineChart },
  data() {
    return {
      lineChartOptions: {
        responsive: true, // Instruct chart js to respond nicely.
        maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
      },
      lineChartData: {},
    }
  },
  computed: {
    ...mapState('country/get-info-by-name', {
      countryInfo: 'data',
      open: 'open',
      loading: 'loading',
      errorMsg: 'error',
    }),
    ...mapState('summary/get-chart', {
      dataChart: 'data',
    }),
  },
  watch: {
    dataChart() {
      this.executeDataChart()
    },
  },
  mounted() {
    this.executeDataChart()
  },
  methods: {
    ...mapActions('country/get-info-by-name', ['reset']),
    executeDataChart() {
      const labels = this.dataChart.map((x) => x.date)
      const totalConfirmData = this.dataChart.map((x) => x.data.confirmed)
      const totalDeathsData = this.dataChart.map((x) => x.data.deaths)
      this.lineChartData = {
        labels,
        datasets: [
          {
            label: 'Total confirmed',
            data: totalConfirmData,
            fill: false,
            borderColor: '#2196f3',
            backgroundColor: '#2196f3',
            borderWidth: 1,
          },
          {
            label: 'Total deaths',
            data: totalDeathsData,
            fill: false,
            borderColor: '#FF6464',
            backgroundColor: '#FF6464',
            borderWidth: 1,
          },
        ],
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.loading-box {
  display: grid;
  place-items: center;
  min-height: 200px;
}

.country-info {
  display: grid;

  grid-template-columns: 1fr;
  gap: 10px;
  padding: 30px;

  // @media screen and (min-width: 992px) {
  //   grid-template-columns: 1fr 1fr;
  // }

  .general {
    display: grid;
    grid: auto-flow min-content / minmax(150px, 1fr) 1fr;
    gap: 10px;
    align-items: center;

    @media screen and (min-width: 992px) {
      grid: auto-flow min-content / 150px 1fr;
    }

    .flag {
      font-size: 24px;
    }
  }
  .chart {
    margin-top: 20px;
  }
}
</style>
