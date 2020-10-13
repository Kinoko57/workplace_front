/*
 * @Author: kaker.xutianxing
 * @Date: 2018-08-28 10:22:54
 * @Last Modified by: Jessica
 * @Last Modified time: 2019-03-01 14:56:58
 */
<template>
  <div class="my-footer">
    <tabbar>
      <tabbar-item link="/main/index" :selected="$route.path === '/main/index'">
        <img slot="icon" src="@/assets/icon/index.png">
        <img slot="icon-active" src="@/assets/icon/index2.png">
        <span slot="label">首页</span>
      </tabbar-item>
       <!-- :badge="num != '0' ? num : ''"  -->
      <tabbar-item :show-dot="num != '0'" link="/main/message" :selected="$route.path === '/main/message'">
        <img slot="icon" src="@/assets/icon/message3.png">
        <img slot="icon-active" src="@/assets/icon/message4.png">
        <span slot="label">消息</span>
      </tabbar-item>
      <tabbar-item link="/main/workbench" :selected="$route.path === '/main/workbench'">
        <img slot="icon" src="@/assets/icon/self.png">
        <img slot="icon-active" src="@/assets/icon/self2.png">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vux'
import store from '@/store/index'
import {
  getUnRead
} from '@/api/public'
   import {
    setCookie,
    getCookie
  } from '@/utils/auth.js' // getToken from cookie
export default {
  name: 'MyFooter',
  components: {
    Tabbar,
    TabbarItem
  },
  data () {
    return {
      red: '#fff000',
      num: '0'
    }
  },
  methods: {
    get_message_list () {
      // this.$vux.loading.show({
      //   text: '加载中...'
      // })
      console.log(111)
      const that = this
      getUnRead()
        .then(res => {
          // this.$vux.loading.hide()
          console.log(res, 'fff')
          if (res.code === 200) {
            that.num = res.data.unread
            // console.log(store)
            // that.addUnread(res.data.unread)
            // this.$store.commit('ADD_UNREAD', that.num)
             this.$store.commit('app/ADD_UNREAD', that.num)
          }
        })
        .catch(err => {
          this.$vux.loading.hide()
        })
    }
  },
  watch: {
    '$store.state.app.Unread': {
      handler: function (val, oldVal) {
        console.log(val, 'ddd')
        this.num = val.toString()
      },
      deep: true
    }
  },

  mounted () {
    this.get_message_list()
  }
}
</script>

<style lang="less" scoped>
.weui-tabbar{
  position: fixed;
}
.weui-tabbar__item {
  padding: 0.16rem 0 0.09rem 0;
  & /deep/.weui-tabbar__icon {
    width: 0.5rem;
    height: 0.5rem;
  }
  & /deep/.weui-tabbar__label {
    padding-top: 0.1rem;
    font-size: 0.2rem !important;
    line-height: 1 !important;
    color: #333 !important;
  }
}
.weui-bar__item_on{
& /deep/.weui-tabbar__label {
    padding-top: 0.1rem;
    font-size: 0.2rem !important;
    line-height: 1 !important;
    color: #3e8afd !important;
  }
}
</style>
