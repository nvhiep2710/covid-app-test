import { camelizeKeys } from 'humps'

export default function ({ $axios, env }, inject) {
  const baseURL = env.NUXT_ENV_BASE_API_URL
  const api = $axios.create({ baseURL })

  // Request intercepter
  api.interceptors.request.use((config) => {
    return config
  })

  // Response pre-processing
  api.interceptors.response.use(
    (response) => {
      const camelizedJson = camelizeKeys(response.data)
      return camelizedJson
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  inject('api', api)
}
