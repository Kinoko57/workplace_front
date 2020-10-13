<template>
  <div>
    <knowledgeBase v-if="$route.path ==='/office/knowledgeBaseInfo'"/>
    <router-view v-else/>
  </div>
</template>

<script>
import knowledgeBase from './knowledgeBase'

export default {
  name: 'KnowledgeBaseInfo',
  components: {
    knowledgeBase
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
