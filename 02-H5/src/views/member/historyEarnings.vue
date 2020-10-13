<template>
    <div>
        <common-header :h_title="h_title" :bgcolor='head_color'></common-header>
        <div class="earnings_bg" v-if="showHistory">
            <div style="height:0.9rem"></div>
            <div class="earnings_h" v-for="(item, index) in arrList" :key="index" @click="openInfo(item.id)">
                <div class="earnings_title">
                    <span class="earnings_title_time">{{item.time}}</span>
                    <span class="earnings_title_earn">￥{{item.sum}}</span>
                    <div class="earnings_title_icon">
                        <i :class="item.isOpen?'iconfont icon-xiala iconopen':'iconfont icon-xiala'"></i>
                    </div>
                </div>
                <div class="earnings_info" v-if="item.isOpen">
                    <div class="earnings_info_list"  v-for="(item, index) in item.list" :key="index">
                        <div class="round"></div>
                        <span class="list_title">{{item.tltle}}</span>
                        <span class="money">￥{{item.money}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import commonHeader from 'common/common-header'
import {
  getHistoryInfo
} from '@/api/share'
import {
  InfiniteScroll,
  Indicator
} from 'mint-ui'
export default {
  name: 'HistoryEarnings',
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator
  },
  data() {
    return {
      h_title: '历史收益',
      head_color: {
        background: '#ffffff',
        color: '#000'
      },
      earnAllInfo: {},
      showHistory: false,
      isOpen: false,
      arrList: []
    }
  },
  mounted() {
    this.getHistoryInfo()
  },
  methods: {
    openInfo(id) {
      const that = this
      console.log(that.arrList)
      for (var i = 0; i < that.arrList.length; i++) {
        if (that.arrList[i].id === id) {
          that.arrList[i].isOpen = !that.arrList[i].isOpen
          console.log(that.isOpen)
        }
      }
      this.$forceUpdate(function() {
        this.arrList = this.arrList
      })
    },
    getHistoryInfo() {
      const that = this
      Indicator.open('加载中...')
      getHistoryInfo().then(res => {
        if (res.isSuccess) {
          console.log(res)
          Indicator.close()
          that.showHistory = true
          that.earnAllInfo = res.data
          var arr = []
          for (let index in that.earnAllInfo) {
            arr.push(that.earnAllInfo[index])
          }
          that.arrList = arr
          console.log(that.arrList, '我是数组')
          for (let i = 0; i < that.arrList.length; i++) {
            that.arrList.isOpen = false
          }
          if (that.arrList.length > 0) {
            that.arrList[0].isOpen = true
          }
          console.log(that.earnAllInfo, res.data, 'aslkfjl')
        } else {
          console.log('接口请求错误')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .earnings_bg{
        width:100%;
        // height:100%;
        // background:rgba(250,250,252,1);
        padding: 30/100rem 40/100rem;
        box-sizing: border-box;
        // overflow: scroll;
        overflow-x: hidden;
    }

    .earnings_h{
        width:670/100rem;
        // height:484/100rem;
        background:rgba(255,255,255,1);
        box-shadow:0 4/100rem 40/100rem 0 rgba(202,204,218,0.25);
        border-radius:4/100rem;
        padding: 0 30/100rem;
        box-sizing: border-box;
        margin-bottom: 26/100rem;
        overflow: hidden;

        .earnings_title{
            height: 92/100rem;
            line-height: 92/100rem;
            position: relative;
            padding-right: 52/100rem;
            .earnings_title_time{
                font-size:28/100rem;
                font-weight:500;
                color:rgba(0,0,0,0.85);
                float: left;
            }
            .earnings_title_earn{
                font-size:28/100rem;
                font-weight:bold;
                color:rgba(0,0,0,0.85);
                float: right;
            }
            .earnings_title_icon{
                width: 52/100rem;
                position: absolute;
                right: 0;
                top: 0;
                line-height: 92/100rem;
                text-align: right;

                .iconopen {
                    display: inline-block;
                    transform: rotate(180deg);
                }
            }
        }

        .earnings_info{
            width:608/100rem;
            height:362/100rem;
            background:rgba(250,250,252,1);
            border-radius:4/100rem;
            padding: 36/100rem;
            box-sizing: border-box;
            margin-bottom: 30/100rem;

            .earnings_info_list{
                height: 70/100rem;
                width: 100%;
                line-height: 70/100rem;
                padding-left: 22/100rem;
                box-sizing: border-box;
                position: relative;
                display: flex;
                .round{
                    position: absolute;
                    left:0;
                    top:33/100rem;
                    width:4/100rem;
                    height:4/100rem;
                    background:rgba(0,0,0,0.91);
                }

                .list_title{
                    font-size:28/100rem;
                    font-weight:500;
                    color:rgba(0,0,0,0.5);
                    flex: 1;
                }

                .money{
                    font-size:28/100rem;
                    font-weight:bold;
                    color:rgba(0,0,0,0.85);
                    flex: 1;
                    text-align: right;
                }
            }

        }

    }
</style>
