<template>
  <div>
    <loss v-if="$route.path ==='/agent/lossIndex'"/>
    <router-view v-else/>
  </div>
</template>
<script>
import loss from './loss'

export default {
  name: 'LossIndex',
  components: {
    loss
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
