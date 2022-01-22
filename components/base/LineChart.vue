<script>
import { Line } from 'vue-chartjs' // eslint-disable-line
export default {
  extends: Line,
  props: ['data', 'options'],
  mounted() {
    this.renderChart(this.data, this.options)
  },
}
</script>
