<template>
  <div>
    <agreement v-if="$route.path ==='/guangtonghui/agreementIndex'"/>
    <router-view v-else/>
  </div>
</template>

<script>
import agreement from './index'

export default {
  name: 'AgreementIndex',
  components: {
    agreement
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
