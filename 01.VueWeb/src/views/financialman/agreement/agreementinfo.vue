<template>
  <div>
    <agreement v-if="$route.path ==='/financialman/agreement'"/>
    <router-view v-else/>
  </div>
</template>

<script>
import agreement from './agreement'

export default {
  name: 'Agreement',
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
