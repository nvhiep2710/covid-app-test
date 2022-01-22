export const state = () => ({
  data: null,
  open: false,
  loading: false,
  error: null,
})

export const mutations = {
  LOADING: (s) => (s.loading = true),
  SET_DATA: (s, data) => (s.data = data),
  OPEN_MODAL: (s) => (s.open = true),
  SET_ERROR: (s, err) => (s.error = err),
  LOADED: (s) => (s.loading = false),
  RESET: (s) => Object.assign(s, state()),
}

export const actions = {
  async getAsync({ commit }, payload) {
    commit('OPEN_MODAL')
    commit('LOADING')
    try {
      const { data } = await this.$axios.get(
        `https://restcountries.com/v3.1/alpha/${payload}`
      )
      if (!data) return
      commit('SET_DATA', data[0] || {})
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
