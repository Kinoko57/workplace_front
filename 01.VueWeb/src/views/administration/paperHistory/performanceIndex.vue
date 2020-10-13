<template>
  <div>
    <performance v-if="$route.path ==='/administration/performanceHistory'"/>
    <router-view v-else/>
  </div>
</template>

<script>
import performance from '../components/performanceHistory'

export default {
  name: 'PerformanceHistory',
  components: {
    performance
  },
  data() {
    return {

    }
  },
  mounted() {
    // console.log(this.$router.path)

  }
}
</script>

