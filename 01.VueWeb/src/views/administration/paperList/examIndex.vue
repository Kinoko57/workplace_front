<template>
  <div>
    <exam v-if="$route.path ==='/administration/examIndex'"/>
    <router-view v-else/>
  </div>
</template>

<script>
import exam from '../components/exam'

export default {
  name: 'ExamIndex',
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

