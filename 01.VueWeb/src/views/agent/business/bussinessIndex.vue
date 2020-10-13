<template>
  <div>
    <bussiness v-if="$route.path ==='/agent/bussinessIndex'"/>
    <router-view v-else/>
  </div>
</template>

<script>
import bussiness from './index'

export default {
  name: 'LimitBuyIndex',
  components: {
    bussiness
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

