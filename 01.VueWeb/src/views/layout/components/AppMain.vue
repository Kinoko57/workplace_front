<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
      <!-- </transition> -->
    </transition>
  </section>

</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  }
}

</script>

<style scoped lang="less">

  // min-width: 1000px;
  .app-main {
    /*84 = navbar + tags-view = 50 +34 */
    /* min-height: calc(100vh - 84px);
  width: 100%;
  position: relative; */
    /* overflow: hidden; */
    /* min-height: calc(100vh - 84px); */
    width: 100%;
    position: relative;
    // height: calc(100vh - 90px);
    // min-width: 1000px;
  }
// }

</style>
