<template>
  <div>
    <performance v-if="$route.path ==='/administration/performanceIndex'"/>
    <router-view v-else/>
  </div>
</template>

<script>
import performance from '../components/performance'

export default {
  name: 'PerformanceIndex',
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

