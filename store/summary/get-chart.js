import { format } from 'date-fns'
import _ from 'lodash'

export const state = () => ({
  data: [],
  loading: false,
  error: null,
})

export const mutations = {
  LOADING: (s) => (s.loading = true),
  SET_DATA: (s, data) => (s.data = [...data]),
  SET_ERROR: (s, err) => (s.error = err),
  LOADED: (s) => (s.loading = false),
  RESET: (s) => Object.assign(s, state()),
}

export const actions = {
  async getAsync({ commit }, payload) {
    commit('LOADING')
    try {
      const res = await this.$api.get(`/country/${payload}`)
      const parseData = res.map((v) => {
        return {
          date: format(new Date(v.date), 'MM/yyy'),
          deaths: v.deaths,
          // recovered: v.recovered,
          confirmed: v.confirmed,
        }
      })
      const grouping = _.groupBy(parseData, (element) =>
        element.date.substring(0, 10)
      )
      const sections = _.map(grouping, (items, date) => ({
        date,
        data: {
          confirmed: items[items.length - 1].confirmed - items[0].confirmed,
          deaths: items[items.length - 1].deaths - items[0].deaths,
          // confirmed: items.pop().confirmed,
          // deaths: items.pop().deaths,
          // recovered: items.pop().recovered,
        },
      }))
      commit('SET_DATA', sections || {})
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
