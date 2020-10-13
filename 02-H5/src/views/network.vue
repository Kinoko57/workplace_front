<template>
  <div>
    <common-header :h_title="h_title" :showback="true" :bgcolor='head_color'></common-header>
    <div style='height:0.9rem'></div>
    <div class="net_bg">
      <div class="net_img">
        <img :src="imgUrl" alt="" srcset="">
      </div>
      <div class="net_tips">
        <span>网络君去外太空啦,尝试去找一下吧～</span>
      </div>
      <div class="net_btn">
        <mt-button @click="openNet">检查网络</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import {
  Button,
  Lazyload,
  Toast
} from 'mint-ui'
import networkImg from '@/assets/img/network.png'

export default {
  name: 'Network',
  components: {
    commonHeader,
    Button,
    Lazyload,
    Toast
  },
  data() {
    return {
      head_color: {
        background: '#f9f9f9',
        color: '#000'
      },
      h_title: '网络',
      imgUrl: networkImg
    }
  },
  mounted() {
    console.log(this.imgUrl)
    if (window.plus) {
      let plus = window.plus
      var types = {}
      types[plus.networkinfo.CONNECTION_UNKNOW] = '未知'
      types[plus.networkinfo.CONNECTION_NONE] = '未连接网络'
      types[plus.networkinfo.CONNECTION_ETHERNET] = '有线网络'
      types[plus.networkinfo.CONNECTION_WIFI] = 'WiFi网络'
      types[plus.networkinfo.CONNECTION_CELL2G] = '2G蜂窝网络'
      types[plus.networkinfo.CONNECTION_CELL3G] = '3G蜂窝网络'
      types[plus.networkinfo.CONNECTION_CELL4G] = '4G蜂窝网络'
      console.log(' 切换网络：' + types[plus.networkinfo.getCurrentType()])
      console.log(plus.networkinfo.CONNECTION_NONE)
      console.log(plus.networkinfo.CONNECTION_CELL4G)
      console.log(plus.networkinfo.CONNECTION_WIFI)
      console.log(plus.networkinfo.CONNECTION_UNKNOW)
      if (plus.networkinfo.getCurrentType() != plus.networkinfo.CONNECTION_UNKNOW && plus.networkinfo.getCurrentType() != plus.networkinfo.CONNECTION_NONE) {
        window.localStorage.setItem('network', true)
      }
    }
  },
  methods: {
    openNet() {
      if (window.plus) {
        let plus = window.plus
        console.log(plus)
        var main = plus.android.runtimeMainActivity() // 获取activity
        var Intent = plus.android.importClass('android.content.Intent')
        var Settings = plus.android.importClass('android.provider.Settings')
        var intent = new Intent(Settings.ACTION_SETTINGS)// 打开网络设置
        main.startActivity(intent)
        // var main = plus.android.runtimeMainActivity()
        // console.log(main)
        // var Intent = plus.android.importClass('android.content.Intent')
        // console.log(Intent)
        // var mIntent = new Intent('android.settings.DATA_ROAMING_SETTINGS')
        // console.log(Intent)
        // main.startActivity(mIntent)
      }
    }
  },
  destroyed() {

  }
}

</script>

<style scoped lang="less">
  @import '~styles/index.less';
  @import '~styles/variable.less';

    .net_bg {
      background: #fff;
      overflow: hidden;
      height: 100%;
      .net_img{
        text-align: center;
        margin-top: 1.06rem;
        img{
          width: 4rem;
          height: 4rem;
        }
      }
      .net_tips{
        text-align: center;
        font-size:0.28rem;
        font-weight:300;
        color:rgba(0,0,0,0.3);
      }
      .net_btn{
        text-align: center;
        margin-top: 1rem;
        button{
          width:2.24rem;
          height:0.72rem;
          border-radius:0.44rem;
          border:1px solid rgba(255,78,121,1);
          font-size:0.28rem;
          font-weight:400;
          color:rgba(255,78,121,1);
          background: transparent;
          box-shadow: none;
          outline: none;
        }
      }
    }

</style>
