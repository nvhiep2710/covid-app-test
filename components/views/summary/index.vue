<template>
  <div class="summary-page">
    <!-- sort by -->
    <div class="summary-page__sort">
      <div class="input">
        <v-select
          v-model="sortBySelected"
          :items="sortByList"
          item-text="label"
          item-value="value"
          label="Sort by"
          clearable
        >
        </v-select>
      </div>
    </div>
    <!-- heading -->
    <div class="summary-page__feedback">
      <h2>{{ errorMsg }}</h2>
      <div class="date">{{ displayDateTime }}</div>
    </div>
    <!-- table -->
    <v-data-table
      :headers="headers"
      :items="listFilterSummary"
      item-key="name"
      class="table-gm"
      :search="search"
      :loading="loading"
      loading-text="Loading... Please wait"
      @click:row="handleShowCountry"
    >
      <template #top>
        <v-text-field
          v-model="search"
          label="Search"
          class="mx-4"
        ></v-text-field>
      </template>
      <template #[`item.totalConfirmed`]="{ item }">
        <span>{{ item.totalConfirmed | numberWithCommas }}</span>
      </template>
      <template #[`item.totalDeaths`]="{ item }">
        <span>{{ item.totalDeaths | numberWithCommas }}</span>
      </template>
      <template #[`item.totalRecovered`]="{ item }">
        <span>{{ item.totalRecovered | numberWithCommas }}</span>
      </template>
    </v-data-table>
    <!-- country detail -->
    <CountryInfoModal />
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import CountryInfoModal from '@/components/modal/CountryInfoModal'

const SORT_BY = {
  TOP_TOTAL_CONFIRMED_CASES: 1,
  HIGHEST_DEATHS: 2,
  LEAST_RECOVERED: 3,
}

export default {
  components: {
    CountryInfoModal,
  },
  data() {
    return {
      search: '',
      sortByList: [
        {
          value: SORT_BY.TOP_TOTAL_CONFIRMED_CASES,
          label: 'The most total confirmed cases',
        },
        {
          value: SORT_BY.HIGHEST_DEATHS,
          label: 'The highest number of deaths',
        },
        {
          value: SORT_BY.LEAST_RECOVERED,
          label: 'The least number of recovered cases',
        },
      ],
      sortBySelected: '',
    }
  },
  async fetch() {
    await this.getListSummary()
  },
  computed: {
    ...mapState('summary/list', {
      listSummary: 'data',
      loading: 'loading',
      errorMsg: 'error',
      totalGlobal: 'totalGlobal',
    }),
    ...mapState('summary/list', {
      listSummary: 'data',
      loading: 'loading',
      errorMsg: 'error',
      totalGlobal: 'totalGlobal',
    }),

    displayDateTime() {
      if (!this.listSummary.length) return
      return this.listSummary[0].date || ''
    },
    listFilterSummary() {
      const newSummaryArray = [...this.listSummary]
      return newSummaryArray
        .sort((a, b) => {
          switch (this.sortBySelected) {
            case SORT_BY.TOP_TOTAL_CONFIRMED_CASES:
              return b.totalConfirmed - a.totalConfirmed
            case SORT_BY.HIGHEST_DEATHS:
              return b.totalDeaths - a.totalDeaths
            case SORT_BY.LEAST_RECOVERED:
              return b.totalRecovered - a.totalRecovered
            default:
              return 1
          }
        })
        .filter((v) => {
          if (!this.search) return true
          const countryName = v.country.toLocaleUpperCase()
          const countryCode = v.country.toLocaleUpperCase()
          const txtSearch = this.search.toString().toLocaleUpperCase()
          return (
            countryName.includes(txtSearch) || countryCode.includes(txtSearch)
          )
        })
    },
    headers() {
      return [
        {
          text: 'country',
          align: 'start',
          value: 'country',
        },
        { text: 'Total Confirmed', align: 'center', value: 'totalConfirmed' },
        { text: 'Total Deaths', align: 'center', value: 'totalDeaths' },
        { text: 'Total Recovered', align: 'center', value: 'totalRecovered' },
        { text: 'New Confirmed', align: 'center', value: 'newConfirmed' },
        { text: 'New Deaths', align: 'center', value: 'newDeaths' },
        { text: 'New Recovered', align: 'center', value: 'newRecovered' },
      ]
    },
  },
  destroyed() {
    this.resetListSummary()
  },
  methods: {
    ...mapActions({
      getListSummary: 'summary/list/getAsync',
      resetListSummary: 'summary/list/reset',
      getInfoCountry: 'country/get-info-by-name/getAsync',
      getInfoCountryDetail: 'summary/get-chart/getAsync',
    }),
    async handleShowCountry(item) {
      const { countryCode } = item
      await this.getInfoCountryDetail(countryCode)
      await this.getInfoCountry(countryCode)
    },
  },
}
</script>
<style lang="scss" scoped>
.summary-page {
  display: grid;
  grid: auto-flow min-content / 1fr;
  gap: 10px;
  padding: 10px 40px;

  &__sort {
    display: flex;
    justify-content: flex-end;

    > .input {
      width: 300px;
    }
  }

  &__feedback {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    > h2 {
      padding: 10px 0;
    }

    .date {
      font-size: 18px;
    }
  }
}
</style>

<style>
.table-gm tbody tr:hover {
  cursor: pointer;
}
</style>
