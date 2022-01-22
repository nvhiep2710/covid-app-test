import { format } from 'date-fns'

export const state = () => ({
  data: [],
  totalGlobal: null,
  loading: false,
  error: null,
})

export const getters = {
  summary: (s) => s.data,
}

export const mutations = {
  LOADING: (s) => (s.loading = true),
  SET_DATA: (s, data) => (s.data = [...data]),
  SET_TOTAL_GLOBAL: (s, data) => (s.totalGlobal = { ...data }),
  SET_ERROR: (s, err) => (s.error = err),
  LOADED: (s) => (s.loading = false),
  RESET: (s) => Object.assign(s, state()),
}

export const actions = {
  async getAsync({ commit }) {
    commit('LOADING')
    try {
      const res = await this.$api.get('/summary')
      if (!res) return
      const { countries, global } = res
      const parseData = countries.map((v) => {
        return {
          countryCode: v.countryCode,
          country: v.country,
          date: format(new Date(v.date), 'MM/dd/yyy hh:mm:ss a'),
          totalConfirmed: v.totalConfirmed,
          totalDeaths: v.totalDeaths,
          totalRecovered: v.totalRecovered,
          newConfirmed: v.newConfirmed,
          newDeaths: v.newDeaths,
          newRecovered: v.newRecovered,
        }
      })
      commit('SET_DATA', parseData)
      commit('SET_TOTAL_GLOBAL', global)
    } catch (e) {
      if (!e.response)
        return commit('SET_ERROR', new Error("Server can't be reached"))
      const { code } = e.response.data
      commit('SET_ERROR', { code })
    } finally {
      commit('LOADED')
    }
  },
  reset({ commit }) {
    commit('RESET')
  },
}
