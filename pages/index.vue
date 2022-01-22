<template>
  <Dashboard />
</template>
<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import Dashboard from '@/components/views/dashboard/dashboard.vue'
export default defineComponent({
  components: {
    Dashboard,
  },
})
</script>
