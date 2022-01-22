import Vue from 'vue'

Vue.filter('numberWithCommas', (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

Vue.filter('emptyString', (string) => {
  return string || '-'
})
