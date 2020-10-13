<template>
    <div class="warning">
        <!-- <div class="warning_content"> -->
            <img src="@/assets/icon/warning.png" alt="">
        <!-- </div> -->
    </div>
</template>

<script>
export default {
  name: 'warning',
  data () {
    return {}
  },
  watch: {},
  methods: {},
  mounted () {}
}
</script>

<style lang="less" scoped>
.warning {
  overflow: hidden;
  height: 100vh;
  width: 100%;
  background: #fff;
  text-align: center;
  // .warning_content {
    img {
      // width: 7.5rem;
      height: 100%;
    }
  // }
}
</style>
