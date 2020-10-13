<template>
  <div class="app-main">
      <!--消息页面加入缓存 include="message"-->
      <!--<keep-alive></keep-alive>-->
      <router-view></router-view>
    <my-footer></my-footer>
  </div>
</template>

<script>
import myFooter from '@/components/footer/index'

export default {
  name: 'Mains',
  components: {
    myFooter
  },
  data () {
    return {
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>

</style>
