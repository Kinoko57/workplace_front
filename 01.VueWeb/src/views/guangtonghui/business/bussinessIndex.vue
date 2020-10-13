<template>
  <div>
    <bussiness v-if="$route.path ==='/guangtonghui/bussinessIndex'"/>
    <router-view v-else/>
  </div>
</template>

<script>
import bussiness from './index'

export default {
  name: 'BussinessIndex',
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

