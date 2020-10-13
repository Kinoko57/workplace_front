<template>
  <div>
    <common-header :h_title="h_title" :showback="true" :bgcolor='head_color'></common-header>
    <div style='height:0.9rem'></div>
    <div class="protocol_bg">
      <!-- <div class="title">公主购服务协议</div> -->
      <div class="info hot_rich">
        <div v-html='content' class='pro_html'></div>
      </div>
    </div>
  </div>

</template>
<script>
import commonHeader from 'common/common-header'
import {
  getSetInfo
} from '@/api/index'
export default {
  name: 'Protocol',
  components: {
    commonHeader
  },
  data() {
    return {
      head_color: {
        background: '#f9f9f9',
        color: '#000'
      },
      h_title: '服务协议',
      content: ''
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      let that = this
      getSetInfo().then(res => {
        console.log(res)
        if (res.isSuccess) {
          that.content = res.data.statement
        }
      })
    }
  }
}

</script>
<style lang="less" scoped>
  .protocol_bg {
    width: 100%;
    // height: 100%;
    background: #fff;
    padding-top: 50/100rem;
  }

  .protocol_bg .title {
    font-size: 40/100rem;
    font-weight: bold;
    margin-bottom: 30/100rem;
    padding: 0 30/100rem;
  }

  .protocol_bg .info {
    font-size: 26/100rem;
    padding: 0 30/100rem;
    line-height: 2;
    overflow-x: hidden;
  }

</style>
