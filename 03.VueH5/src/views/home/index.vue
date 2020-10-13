<template>
  <div class="index_bg">
    <div class="index_add" @click="show=true">
      <i class="iconfont iconjia"></i>
    </div>
    <div class="index_head">
      <div class="head_left">
        <img src="@/assets/icon/logo.png" alt srcset class="work_logo">
        神首集团
      </div>
      <div>
        <div class="index_user">
          <span style="padding-top: 0.08rem;">{{infoMessage[0]}} {{infoMessage[1]}} {{infoMessage[2]}}</span>
          <span>
            <i class='iconfont icondingwei'></i>
            <!-- 上海市虹口区 -->
            <iframe id="geoPage" width=0 height=0 frameborder=0 style="display:none;" scrolling="no"
              src="https://apis.map.qq.com/tools/geolocation?search=0&type=1&mapdraggable=0&radius=1500&tota=20&key=34IBZ-ZTRRG-WI4Q2-IYFXG-MBRUO-FEBVC&referer=myapp">
            </iframe>
            <span>{{loc}}</span>
          </span>
        </div>
      </div>
    </div>
    <div class="index_main">
      <ul class="index_block">
        <!-- <li>
          <img src="@/assets/index/todo.png" alt="">
          <p>待办事项<span>(0)</span></p>
        </li> -->
        <li @click="goSchedulePage">
          <div class="green">
            <img src="@/assets/index/index_01.png" alt="">
          </div>
          <p>待我审核(<span>{{processnodeInfoNum}}</span>)</p>
        </li>
        <li @click="goOtherPage">
          <div class="blue">
            <img src="@/assets/index/index_02.png" alt="">
          </div>
          <p>日报查看(<span>{{dailyNum}}</span>)</p>
        </li>
        <li @click="goProcessnodePage">
          <div class="yellow">
            <img src="@/assets/index/index_03.png" alt="">
          </div>
          <p>今日拜访(<span>{{visitNum}}</span>)</p>
        </li>
        <!-- <li>
          <img src="@/assets/index/review.png" alt="">
          <p>事项进度<span>(0)</span></p>
        </li> -->
        <li @click="goReportPage">
          <div class="red">
            <img src="@/assets/index/index_04.png" alt="">
          </div>
          <p>公告消息(<span>{{matterInfoNum}}</span>)</p>
        </li>

      </ul>
    </div>
    <div class="index_charts">
      <div class="charts_block sale_report">
        <p class="p_title" style="padding: 0;">
          <span class="title">销售简报</span>
          <span class="right_icon">
            <popup-radio :options="salesArr" v-model="fifter_name" @on-hide="changeCharts"></popup-radio>
            <i class="iconfont iconyoujiantou"></i>
          </span>
        </p>
        <ul class="sale_block">
          <li>
            <div class="sale_icon">
              <img src="@/assets/index/index_05.png" alt="">
            </div>
            <div class="sale_info">
              <p style="padding-left:0.01rem">{{ easyList.addBusiness }}</p>
              <p class="tips">新增商机（个）</p>
            </div>
          </li>
          <li>
            <div class="sale_icon">
              <img src="@/assets/index/index_06.png" alt="">
            </div>
            <div class="sale_info">
              <p style="padding-left:0.01rem">{{ easyList.addAgent }}</p>
              <p class="tips">新增经销商（个）</p>
            </div>
          </li>
          <li>
            <div class="sale_icon">
              <img src="@/assets/index/index_07.png" alt="">
            </div>
            <div class="sale_info">
              <p style="padding-left:0.01rem">{{ easyList.assignBusiness }}</p>
              <p class="tips">商机跟进（次）</p>
            </div>
          </li>
          <li>
            <div class="sale_icon">
              <img src="@/assets/index/index_08.png" alt="">
            </div>
            <div class="sale_info">
              <p style="padding-left:0.01rem">{{ easyList.assignAgent }}</p>
              <p class="tips">经销商跟进（次）</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="charts_block bussiness_agent" v-if="bussinessData.isShow">
        <p class="p_title"><span class="title">商机跟进</span><span>近15天</span></p>
        <v-chart ref="bussiness" v-if="bussinessData.hasCharts" :data="bussinessData.data">
          <v-scale x field="date" alias="日期" :tick-count="8" />
          <v-scale y field="num" alias="数量" />
          <v-line series-field="name" shape="smooth"/>
          <!-- <v-point :style="{ stroke: '#fff', lineWidth: 1 }"/> -->
          <v-tooltip show-crosshairs />
        </v-chart>
      </div>
    </div>
    <div v-transfer-dom>
      <popup v-model="show" style="background: #fff;height:1.8rem">
        <div class="work_add">
          <ul>
            <li v-for="(item,index) in workList" :key="index" @click="goPage(item.link)">
              <img slot="icon" :src="item.imgUrl">
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>
      </popup>
    </div>

  </div>
</template>

<script>
  import {
    getUnRead,
    getReportInfo,
    getSum,
    getLoacl,
    getIndexChartsInfo
  } from '@/api/public'
  import {
    setCookie,
    getCookie
  } from '@/utils/auth.js' // getToken from cookie
  import {
    mapMutations
  } from 'vuex'
  import {
    Swiper,
    SwiperItem,
    PopupRadio,
    VChart,
    VLine,
    VArea,
    VBar,
    VPie,
    VPoint,
    VScale,
    VAxis,
    VGuide,
    VTooltip,
    VLegend,
    Popup,
    TransferDomDirective as TransferDom
  } from 'vux'
  export default {
    components: {
      Swiper,
      SwiperItem,
      PopupRadio,
      VChart,
      VLine,
      VArea,
      VBar,
      VPie,
      VPoint,
      VScale,
      VAxis,
      VGuide,
      VTooltip,
      VLegend,
      VGuide,
      Popup
    },
    directives: {
      TransferDom
    },
    name: 'Index',
    data() {
      return {
        show: false,
        workList: [
          {
            id: 5,
            name: "申请加班",
            imgUrl: "./static/office/overtime.png",
            link: "/main/new?show=add&type=5&infoId="
          },
          {
            id: 6,
            name: "申请请假",
            imgUrl: "./static/office/leave.png",
            link: "/main/new?show=add&type=6&infoId="
          },
          {
            id: 2,
            name: "申请外出",
            imgUrl: "./static/office/goingout.png",
            link: "/main/new?show=add&type=2&infoId="
          },
          {
            id: 10,
            name: "申请销假",
            imgUrl: "./static/office/baoxiao.png",
            link: "/main/new?show=add&type=10&infoId="
          }
        ],
        bussinessData: {
          data: [],
          isShow: false,
          hasCharts: false,
        },
        loc: '',
        fifter_data: 'today',
        fifter_name: '今日',
        easyList: {
          addAgent: 0,
          addBusiness: 0,
          assignAgent: 0,
          assignBusiness: 0,
          isShow: false
        }, // 销售简报
        salesArr: ['今日', '本周', '本月', '本季', '本年'],
        salesList: [{
          label: '今日',
          name: 'today'
        }, {
          label: '本周',
          name: 'week'
        }, {
          label: '本月',
          name: 'month'
        }, {
          label: '本季',
          name: 'quarter'
        }, {
          label: '本年',
          name: 'year'
        }],
        publicInfo: [],
        matterInfoNum: 0,
        processnodeInfoNum: 0,
        visitNum: 0,
        dailyNum: 0,
        infoMessage: [],
        clickInfo: [],
        listType: 'report',
        searchInfo: {
          mode: 'all', // 类型 全部 all 正常 normal 封禁 ban
          search: '', // 搜索关键字
          orderBy: '', // 排序字段
          pageID: 1, // 第几页
          recPerPage: 3, // 每页显示条数
          recTotal: 3 // 总条数
        },
        showDate: false,
      }
    },
    created() {},
    mounted() {
      // setCookie('crm_token', '358dafe786e7a5d18b58b5e1ae962dbe')
      // setCookie('crm_account', 'Jessica')
      // 页面第一个渲染的函数
      this.getNum()
      // this.getReportInformation()
      this.getBannerSum()
      // 获取经经纬度
      this.Tmap()

      // this.$nextTick(()=>{
      // this.getCharts()
      // })
      // 获取首页图表
    },
    methods: {
      goPage(link){
        this.$router.push({
          path: link
        })
      },
      Tmap() {
        const that = this
        window.addEventListener('message', function (event) {
          if (event.data) {
            if (event.data.module === 'geolocation') {
              console.log(event.data.addr, 1)
              const locStr = event.data.lat + ',' + event.data.lng
              getLoacl(locStr).then(res => {
                if (res.code === 200) {
                  that.loc = res.data.result.addressComponent.district
                }
              })
            }
          }
        }, false)
        // 设置6s超时，防止定位组件长时间获取位置信息未响应
        // setTimeout(function() {
        //     if (!this.loc) {
        //         console.log('定位超时')
        //     }
        // }, 6000) // 6s为推荐值，业务调用方可根据自己的需求设置改时间，不建议太短
      },
      getCharts() {
        let that = this
        getIndexChartsInfo('', '').then(res => {
          if (res.code == 200) {
            // 销售简报
            if (res.data.easy != undefined) {
              that.easyList = res.data.easy
              that.easyList.isShow = true
            } else {
              that.easyList.isShow = false
            }
            // 商机跟进
            if (res.data.busienss != undefined) {
              const xAxis = res.data.busienss.x
              const info = res.data.busienss.data
              let data = []
              for (const i in info) {
                let arr = []
                for (let j in info[i]) {
                  arr.push({
                    name: i,
                    date: '',
                    num: parseInt(info[i][j])
                  })
                }
                data.push(arr)
                that.bussinessData.hasCharts = true
              }
              for (let i = 0; i < data.length; i++) {
                for (let j in xAxis) {
                  data[i][j].date = xAxis[j]
                }
              }
              let arr = data[0].concat(data[1]).concat(data[2]).concat(data[3])
              that.bussinessData.data = arr
              that.bussinessData.hasCharts = true
              that.bussinessData.isShow = true
            } else {
              that.bussinessData.isShow = false
            }
          }
        })
      },
      changeCharts() {
        const that = this
        console.log(this.fifter_data)
        console.log(this.fifter_name)
        for (let i = 0; i < this.salesList.length; i++) {
          if (this.salesList[i].label == this.fifter_name) {
            //获取选中值的key
            if (this.salesList[i].name != this.fifter_data) {
              // 更新销售简报
              this.fifter_data = this.salesList[i].name
              getSum(this.fifter_data).then(res => {
                if (res.code == 200) {
                  // 销售简报
                  if (res.data.easy != undefined) {
                    that.easyList = res.data.easy
                    that.easyList.isShow = true
                  } else {
                    that.easyList.isShow = false
                  }
                }
              })
            }
          }
        }

      },
      getInfo(e) {
        console.log(e, 'dsadsa')
        // const arr = this.clickInfo.find(item => item.title == e)
        // console.log(id, 'fff')
        this.$router.push({
          path: "/main/messageView?id=" + e + '&type=' + this.listType
        })
      },
      // 方法
      getNum() {

        const that = this
        getUnRead().then(res => {
          if (res.code === 200) {
            console.log('请求未读')
            this.$store.commit('app/ADD_UNREAD', res.data.unread)
            // that.addUnread(res.data.unread)
            // setCookie('unread',res.data.unread)
          }
        })
      },
      // 获取公告信息
      getReportInformation() {
        const that = this
        getReportInfo(this.searchInfo).then(res => {
          this.clickInfo = res.data.notices
          console.log(res, 'fdsfds333')
          // this.publicInfo = res.notices
          for (var i = 0; i < res.data.notices.length; i++) {
            console.log(res.data.notices[i].title, 'fff')
            that.publicInfo.unshift({
              title: res.data.notices[i].title,
              id: res.data.notices[i].id
            })
          }
          if (res.data.notices.length == 2) {
            that.publicInfo.push({
              title: res.data.notices[1].title,
              id: res.data.notices[i].id
            })
            that.publicInfo.push({
              title: res.data.notices[0].title,
              id: res.data.notices[i].id
            })
          }
          console.log(that.publicInfo, 'fdsfsdf')
        })
      },

      // 获取数字信息
      getBannerSum() {
        getSum('').then(res => {
          let that = this
          console.log(res, 'fddddd')
          this.matterInfoNum = parseInt(res.data.matterInfo.matter) + parseInt(res.data.matterInfo.message)
          this.processnodeInfoNum = res.data.processnodeInfo
          this.visitNum = res.data.visit
          this.dailyNum = res.data.daily
          this.infoMessage = res.data.index.split(',')
          console.log(this.infoMessage, 'fsdfds')
          // 销售简报
            if (res.data.easy != undefined) {
              that.easyList = res.data.easy
              that.easyList.isShow = true
            } else {
              that.easyList.isShow = false
            }
            // 商机跟进
            if (res.data.busienss != undefined) {
              const xAxis = res.data.busienss.x
              const info = res.data.busienss.data
              let data = []
              for (const i in info) {
                let arr = []
                for (let j in info[i]) {
                  arr.push({
                    name: i,
                    date: '',
                    num: parseInt(info[i][j])
                  })
                }
                data.push(arr)
                that.bussinessData.hasCharts = true
              }
              for (let i = 0; i < data.length; i++) {
                for (let j in xAxis) {
                  data[i][j].date = xAxis[j]
                }
              }
              let arr = data[0].concat(data[1]).concat(data[2]).concat(data[3])
              that.bussinessData.data = arr
              that.bussinessData.hasCharts = true
              that.bussinessData.isShow = true
            } else {
              that.bussinessData.isShow = false
            }
        })
      },
      //跳转页面
      goOtherPage() {
        this.$router.push({
          path: '/main/dailyList?type=wait'
        })
      },
      goProcessnodePage() {
        console.log(111)
        this.$router.push({
          path: '/main/list?id=2'
        })
      },
      goSchedulePage() {
        this.$router.push({
          path: '/main/workbench'
        })
      },
      goReportPage() {
        this.$router.push({
          path: '/main/message'
        })
      }
    }
  }

</script>
<style lang="less" scoped>
  .index_bg {
    overflow: auto;
    // height: 100vh;
    // padding-top: 44px;
    // -webkit-overflow-scrolling: touch;
    font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
    .index_add {
      position: fixed;
      right: 0.35rem;
      bottom: 14%;
      z-index: 100;

      i {
        font-size: 0.8rem;
        color: #3e8afd;
      }
    }
    .index_head {
      // margin: 0.3rem 0;
      height: 1.06rem;
      font-size: 0.28rem;
      color: #fff;
      display: flex;
      align-items: center;
      background-color: rgba(73, 73, 73, 1);
      justify-content: space-between;
      padding: 0 0.2rem;

      .head_left {
        display: inline-flex;
        align-items: center;

        img {
          width: 0.72rem;
          margin-right: 0.1rem;
        }
      }

      .index_user {
        display: flex;
        align-items: center;
        font-size: 0.24rem;
        color: #fff;
        justify-content: space-between;

        // border-bottom: 1px solid #e4e4e4;
        i {
          font-size: 0.3rem;
        }
      }
    }

    .index_main {
      background: #fff;
      border-radius: 0.14rem;
      padding: 0.3rem;
      margin-bottom: 0.1rem;

      .index_block {
        list-style: none;
        overflow: hidden;
        display: flex;
        align-items: center;
        box-shadow: 1px 0px 8px rgba(215, 215, 215, 0.349019607843137);
        border-radius: 0.06rem;
        padding: 0.2rem 0;

        li {
          width: 33%;
          text-align: center;

          div {
            width: 0.72rem;
            height: 0.72rem;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            border-radius: 0.1rem;

            img {
              width: 0.44rem;
              height: 0.44rem;
            }
          }

          .green {
            background-color: rgba(54, 203, 203, 1);
          }

          .blue {
            background-color: rgba(58, 161, 255, 1);
          }

          .yellow {
            background-color: rgba(251, 212, 55, 1);
          }

          .red {
            background-color: rgba(255, 153, 102, 1);
          }

          p {
            margin-top: 0.2rem;
            display: block;
            font-size: 0.24rem;
            color: #666666;

            span {
              color: #FC737B;
            }
          }
        }
      }
    }

    .index_charts {
      margin-bottom: 1rem;

      .charts_block {
        background: #fff;
        box-shadow: 1px 0px 8px rgba(215, 215, 215, 0.349019607843137);
        margin-bottom: 0.1rem;

        .p_title {
          color: #333;
          font-size: 0.24rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.2rem 0;
          border-bottom: 0.02rem solid #f2f2f2;
          margin: 0 0.2rem;

          .title {
            font-weight: 700;
            font-size: 0.26rem;
          }
          .right_icon{
            display: inline-flex;
            align-items: center;
            .weui-cell{
              padding-right: 0;
            }
            /deep/.weui-cell_access{
              .weui-cell__ft{
                padding-right: 0;
              }
              .weui-cell__ft:after{
                display: none;
              }
            }
            .iconfont{
              transform: rotate(90deg);
            }
          }
        }
      }

      .sale_report {
        .sale_block {
          list-style: none;
          overflow: hidden;

          li {
            float: left;
            width: 40%;
            display: inline-flex;
            align-items: center;
            padding: 0.2rem 0;
            padding-left: 8%;

            .sale_icon {
              display: inline-flex;

              img {
                // width: 0.62rem;
                // height: 0.62rem;
                font-size: 0;
              }
            }

            .sale_info {
              margin-left: 0.12rem;
              font-family: 'Arial Negreta', 'Arial Normal', 'Arial';

              p {
                font-weight: 700;
                color: #333;
                font-size: 0.32rem;
              }

              .tips {
                color: #666666;
                font-size: 0.24rem;
                font-weight: normal;
              }
            }
          }
        }
      }
    }

    .text-scroll {
      height: 30px;
      width: 100%;
      line-height: 30px;

      .nowarp {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap
      }

      .vux-swiper {
        height: 100%;
        width: 100%;

        .vux-swiper-item {
          width: 100%;
          height: 100%;
        }
      }
    }

  }

</style>
