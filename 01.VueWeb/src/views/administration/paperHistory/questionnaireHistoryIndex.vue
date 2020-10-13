<template>
  <div>
    <questionnaireHistory v-if="$route.path ==='/administration/questionnaireHistory'"/>
    <router-view v-else/>
  </div>
</template>

<script>
import questionnaireHistory from '../components/questionnaireHistory'

export default {
  name: 'QuestionnaireHistory',
  components: {
    questionnaireHistory
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

