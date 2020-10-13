<template>
  <div>
    <exam v-if="$route.path ==='/administration/examHistory'"/>
    <router-view v-else/>
  </div>
</template>

<script>
import exam from '../components/examHistory'

export default {
  name: 'ExamHistory',
  components: {
    exam
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

