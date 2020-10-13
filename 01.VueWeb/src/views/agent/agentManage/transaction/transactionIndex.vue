<template>
  <div>
    <transaction v-if="$route.path ==='/agent/transactionIndex'"/>
    <router-view v-else/>
  </div>
</template>

<script>
import transaction from './index'

export default {
  name: 'TransactionIndex',
  components: {
    transaction
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

