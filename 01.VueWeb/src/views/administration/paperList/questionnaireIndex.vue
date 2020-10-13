<template>
  <div>
    <questionnaire v-if="$route.path ==='/administration/questionnaireIndex'"/>
    <router-view v-else/>
  </div>
</template>

<script>
import questionnaire from '../components/questionnaire'

export default {
  name: 'QuestionnaireIndex',
  components: {
    questionnaire
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

