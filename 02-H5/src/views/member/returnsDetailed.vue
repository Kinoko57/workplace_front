<template>
  <div>
    <common-header :h_title="h_title" :bgcolor='head_color'></common-header>
    <div class="return_bg">
      <return-top @returnTop='goTop'></return-top>
      <div style="height:0.9rem" id="return_bg"></div>
      <div class='detailed_choseDate'>
        <div class='detailed_choseDate_inner'>
          <div class='detailed_choseDate_show'>
            <div class='detailed_choseDate_show_l' @click='openBirth'>
              <div class='pickDate'>
                <span v-if='birthday!=null'>{{birthday}}</span>
                <i class='iconfont icon-desc'></i>
              </div>
            </div>
            <div class='detailed_choseDate_show_r'>
              <div class='m_income'>
                收入<span class='m_c'>￥{{cashMoney.income}}</span>
              </div>
              <div class='m_waitCash'>
                待结算<span class='m_c'>￥{{cashMoney.stay_wind}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="height:1.16rem"></div>
      <div  v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="30" infinite-scroll-immediate-check='autoOpen' class="return_list_wraper">
        <div class="return_list" v-for="(blockitem,blockindex) in returnsType" :key="blockindex">
          <div class="list_header" @click="openInfo(blockitem.id)">
            <div class="list_left">
              <p class="t_name">{{blockitem.type_title}} <span v-if="blockitem.status==2||blockitem.status==3">退款</span>
              </p>
              <p class="time">{{blockitem.paytime}}</p>
            </div>
            <div class="list_right">
              <p v-if="blockitem.status==2||blockitem.status==3">-{{blockitem.money}}</p>
              <p v-else>+￥{{blockitem.money}}</p>
              <div class="list_right_icon">
                <i :class="blockitem.isopen?'iconfont icon-xiala iconopen':'iconfont icon-xiala'"></i>
              </div>
            </div>
          </div>
          <div class="list_content" v-if="blockitem.isopen">
            <div class="content_title">
              <div class="title_pic">
                <img :src="blockitem.buyer.image" alt="" v-if="blockitem.buyer!=null&&blockitem.buyer.image!=null&&blockitem.buyer.image!=''">
                <img :src="avatarUrl" alt="" v-else>
              </div>
              <p class="title_name">
                <span v-if="blockitem.remark!=null&&blockitem.remark!=''">{{blockitem.remark[0].remark}}</span>
                <span v-if="blockitem.buyer!=null&&blockitem.buyer.nickname!=''&&blockitem.buyer.nickname!=null&&(blockitem.remark==null||blockitem.remark=='')">{{blockitem.buyer.nickname}}</span>
              </p>
            </div>
            <div class="content_goods" v-for="(blockOrder,index) in blockitem.order" :key="index">
              <p class="order_code">订单编号：{{blockitem.order_id}}</p>
              <div class="goods_list" v-for="(item,index) in blockOrder.order_item" :key="index">
                <div class="goods_list_l">
                  <img :src="imgPath+'pro/static.png'" alt="" v-if="item.pic==null||item.pic==''">
                  <img :src="item.pic" alt="" v-else>
                </div>
                <div class="goods_list_r">
                  <div class="goods_list_r_info">
                    <p class="list_r_name">{{item.name}}</p>
                    <!-- <p class="list_r_return">赚¥40</p> -->
                  </div>
                  <p class="goods_list_size">规格：{{item.title}}</p>
                  <div class="goods_list_num">
                    <p class="money">￥{{item.price}}</p>
                    <p class="num">x {{item.nums}}</p>
                  </div>
                </div>
              </div>

            </div>
            <div class="content_money">
                <div class="goods_allCash">
                你赚：<span class="back" v-if="blockitem.status==2||blockitem.status==3">￥{{blockitem.money}}</span><span class="noback" v-else>￥{{blockitem.money}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="margin_bottom">
          <div class='more_load' v-if='!loading'>
            <mt-spinner type="fading-circle"></mt-spinner>
          </div>
          <div class='list_bottom' v-if='total==returnsType.length&&total>0'>—————— 我是有底线的 ——————</div>
          <div class='center' v-if='hasData==false'>
            <!-- <img :src='imgPath+"pro/No_find.png"'/> -->
            <img :src='nullImg' />
            <span>没有发现任何数据哦~</span>
          </div>
        </div>
      </div>
      <mt-datetime-picker
          ref="dataPicker"
          type="date"
          v-model="dateVale"
          year-format="{value} 年"
          month-format="{value} 月"
          date-format="{value} 日"
          @confirm="bindDateChange"
          :startDate = "startDate"
          :endDate = "endDate">
        </mt-datetime-picker>
    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import returnTop from '@/components/return-top'
import nullImg from '@/assets/img/null/sale_order_null.png'
import {
  getIncomeDetailsInfo
} from '@/api/share'
import {
  InfiniteScroll,
  Indicator
} from 'mint-ui'
import {
  parseTime
} from '@/store/pubilc.js'
export default {
  name: 'ReturnsDetailed',
  components: {
    commonHeader,
    returnTop,
    InfiniteScroll,
    Indicator
  },
  data() {
    return {
      h_title: '收益明细',
      nullImg: nullImg,
      head_color: {
        background: '#ffffff',
        color: '#000'
      },
      imgPath: process.env.FilE_URL,
      isShowContent: false,
      total: 0,
      loading: true,
      hasData: true,
      avatarUrl: process.env.FilE_URL + 'member/avatar.png',
      returnsType: [],
      dateVale: parseTime(new Date().getTime(), '{y}-{m}-{d}'),
      startDate: new Date('1971-01-01'),
      endDate: new Date('2019-01-22'),
      nowDate: '',
      birthday: null,
      cashMoney: {
        income: '0.00',
        stay_wind: '0.00'
      },
      page: 1,
      limit: 10
    }
  },
  mounted() {
    var nowDates = parseTime(new Date().getTime())
    var nowDate = nowDates.split(' ')[0]
    var year = nowDate.split('-')[0]
    var month = nowDate.split('-')[1]
    var showDate = year + '年' + month + '月'
    this.endDate = new Date()
    // this.date = nowDates
    this.nowDate = nowDate.substring(0, nowDate.length - 3)
    this.birthday = showDate
    this.getInconDetail()
  },
  methods: {
    goTop() {
      document.getElementById('return_bg').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    openInfo(id) {
      console.log(id)
      const that = this
      for (var i = 0; i < this.returnsType.length; i++) {
        if (that.returnsType[i].id === id) {
          that.returnsType[i].isopen = !that.returnsType[i].isopen
        }
      }
      that.$forceUpdate(function() {
        that.returnsType = that.returnsType
        console.log(that.returnsType)
      })
    },
    getInconDetail() {
      const that = this
      let info = {
        page: that.page,
        limit: that.limit,
        date: that.nowDate
      }
      Indicator.open('加载中...')
      getIncomeDetailsInfo(info).then(res => {
        if (res.isSuccess) {
          that.hasData = false
          Indicator.close()
          if (res.data.money.rows.length > 0) {
            that.hasData = true
            that.total = res.data.money.total
            that.cashMoney = res.data.wind
            that.loading = false
            for (let i = 0; i < res.data.money.rows; i++) {
              res.data.money.rows[i].isopen = false
            }
            that.returnsType = res.data.money.rows
            if (res.data.money.rows.length < that.limit) {
              that.loading = true
            }
          } else {
            that.loading = true
            that.cashMoney = res.data.wind
            that.hasData = false
            that.total = 0
          }
        }
      })
    },
    loadMore() {
      this.loading = true
      var that = this
      let info = {
        page: ++that.page,
        limit: that.limit,
        date: that.nowDate
      }
      getIncomeDetailsInfo(info).then(res => {
        if (res.isSuccess) {
          Indicator.close()
          that.total = res.data.money.total
          if (res.data.money.rows.length > 0) {
            that.loading = false
            that.returnsType = that.returnsType.concat(res.data.money.rows)
            if (res.data.money.rows.length < that.limit) {
              that.loading = true
            }
          } else {

          }
        } else {
          that.total = 0
          that.returnsType = []
          that.loading = true
        }
      })
    },
    openBirth() {
      this.$refs.dataPicker.open()
      let a = document.getElementsByClassName('picker-slot')
      // eslint-disable-next-line no-unmodified-loop-condition
      for (let i = 0; a && i < a.length; i++) {
        if (i === 2) {
          a[i].style.display = 'none'
        }
      }
    },
    // 选择日期
    bindDateChange(e) {
      console.log(e.getTime(), '1111')
      var dateTime = parseTime(e.getTime(), '{y}-{m}-{d}')
      var year = dateTime.split('-')[0]
      var month = dateTime.split('-')[1]
      var showDate = year + '年' + month + '月'
      this.birthday = showDate
      this.nowDate = dateTime.substring(0, dateTime.length - 3)
      this.returnsType = []
      this.page = 1
      this.loading = true
      this.hasData = true
      this.getInconDetail()
    }
  }
}

</script>
<style lang="less" scoped>
  .return_bg {
    width: 100%;
    // height:100%;
    // background:rgba(250,250,252,1);
    // overflow: scroll;
    overflow-x: hidden;

    /*日期下拉框*/
    .m_bg_top {
      position: relative;
      // z-index:99
      // z-index: 100
    }

    .detailed_choseDate {
      position: fixed;
      width: 100%;
      // z-index:999;
      background: #f6f6f6;
      height: 116/100rem;
      /* padding: 0 30/100rem; */
    }

    .detailed_choseDate_inner {
      position: relative;
    }

    .detailed_choseDate_show {
      font-size: 28/100rem;
      color: #090909;
      margin: 0 30/100rem;
      padding-left: 25/100rem;
      overflow: hidden;
    }

    .detailed_choseDate_show_l {
      float: left;
      /* width:200/100rem; */
      line-height: 54/100rem;
      /* background: #fff; */
      text-align: center;
      border-radius: 27/100rem;
      margin-top: 29/100rem;
    }

    .detailed_choseDate_show_r {
      float: right;
      font-size: 24/100rem;
      color: #878787;
      text-align: right;
    }

    .m_income {
      padding-top: 28/100rem;
    }

    .m_c {
      padding-left: 20/100rem;
    }

    .downList_bg {
      position: fixed;
      z-index: 1;
      background: rgba(0, 0, 0, 0.4);
      top: 0;
      width: 100%;
      height: 100%;
    }

    .detailed_choseDate_dowmList {
      position: absolute;
      top: 0;
      /* top:208/100rem; */
      width: 100%;
      background: #fff;
      padding: 20/100rem 0 40/100rem 0;
      z-index: 2;
    }

    .detailed_choseDate_dowmList .dowmlist_content {
      line-height: 75/100rem;
      color: #999;
      font-size: 28/100rem;
      overflow: hidden;
      padding: 0 55/100rem;
    }

    .detailed_choseDate_dowmList .dowmlist_content span {
      float: left;
    }

    .detailed_choseDate_dowmList .dowmlist_content i {
      float: right;
    }

    .detailed_choseDate_dowmList .dowmlist_content_active {
      color: #090909;
    }

    .detailed_choseDate_date .title {
      display: block;
      color: #999;
      font-size: 28/100rem;
      padding: 20/100rem 0 10/100rem 55/100rem;
      /* margin-bottom: -20/100rem; */
      padding-top: 20/100rem;
    }

    .detailed_choseDate_date .pic_float {
      text-align: center;
    }

    .detailed_choseDate_date picker {
      text-align: center;
      color: #999;
      display: inline-block;
      font-size: 28/100rem;
    }

    .detailed_choseDate_date picker .pickDate {
      width: 230/100rem;
      line-height: 42/100rem;
      display: inline-block;
      border: 1/100rem solid #e5e5e5;
      text-align: center;
    }

    .icon_center {
      display: inline-block;
      color: #e5e5e5;
      padding: 0 20/100rem;
    }

    .detailed_choseDate_date picker .pickDate span:nth-child(2) {
      display: inline-block;
      color: #e5e5e5;
    }
    .return_list_wraper{
       height: calc(100vh  - 2.21rem);
       overflow-y: scroll;
       margin-top: 0.15rem;
      .return_list {
        width: 100%;
        background: rgba(255, 255, 255, 1);
        margin-bottom: 24/100rem;

        .list_header {
          width: 100%;
          padding: 30/100rem 0.3rem 0.1rem;
          box-sizing: border-box;
          display: flex;

          .list_left {
            flex: 1;

            .t_name {
              font-size: 28/100rem;
              line-height: 40/100rem;
              color: rgba(0, 0, 0, 0.85);
              margin-bottom: 4/100rem;

              span {
                display: inline-block;
                width: 88/100rem;
                height: 36/100rem;
                border-radius: 4/100rem;
                border: 2/100rem solid rgba(223, 174, 115, 1);
                font-size: 28/100rem;
                color: rgba(223, 174, 115, 1);
                text-align: center;
                line-height: 36/100rem;
              }
            }

            .time {
              font-size: 24/100rem;
              height: 36/100rem;
              line-height: 36/100rem;
            }
          }

          .list_right {
            flex: 1;
            height: 80/100rem;
            padding-right: 48/100rem;
            height: 100%;
            box-sizing: border-box;
            position: relative;

            p {
              line-height: 80/100rem;
              text-align: right;
              font-size: 28/100rem;
              color: #CAA24F;
            }

            .list_right_icon {
              position: absolute;
              right: 0;
              top: 0;
              width: 48/100rem;
              line-height: 80/100rem;
              text-align: right;

              .iconopen {
                display: inline-block;
                transform: rotate(180deg);
              }
            }
          }
        }

        .list_content {
          width: 100%;

          .content_title {
            height: 80/100rem;
            border-bottom: 2/100rem solid rgba(232, 232, 232, 1);
            padding: 18/100rem 30/100rem;
            box-sizing: border-box;
            display: flex;

            .title_pic {
              width: 44/100rem;
              height: 44/100rem;
              border-radius: 50%;
              margin-right: 12/100rem;

              img {
                width: 44/100rem;
                height: 44/100rem;
                border-radius: 50%;
              }
            }

            p {
              font-size: 28/100rem;
              line-height: 40/100rem;
              color: rgba(0, 0, 0, 0.5);
              span{
                width: 4rem;
                display: inline-block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }

          .content_goods {
            width: 100%;
            box-sizing: border-box;
            padding: 24/100rem 30/100rem 0 30/100rem;
            border-bottom: 2/100rem solid rgba(232, 232, 232, 1);
            .order_code {
              font-size: 24/100rem;
              color: rgba(0, 0, 0, 0.5);
              margin-bottom: 6/100rem;
            }

            .goods_list {
              border-bottom: 2/100rem dashed rgba(232, 232, 232, 1);
              // display: flex;
              padding-top: 0.25rem;
              position: relative;
              overflow: hidden;

              // box-sizing: border-box;
              .goods_list_l {
                width: 150/100rem;
                height: 150/100rem;
                float: left;

                img {
                  width: 150/100rem;
                  height: 150/100rem;
                }
              }

              .goods_list_r {
                float: left;
                margin-left: 20/100rem;

                .goods_list_r_info {
                  display: flex;
                  padding-top: 4/100rem;
                  margin-bottom: 34/100rem;

                  .list_r_name {
                    width: 500/100rem;
                    font-size: 28/100rem;
                    color: rgba(0, 0, 0, 0.85);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    margin-right: 20/100rem;
                  }

                  .list_r_return {
                    // text-align: right;
                    font-size: 28/100rem;
                    color: #CAA24F;
                    text-align: right;
                  }
                }

                .goods_list_size {
                  color: rgba(0, 0, 0, 0.4);
                  line-height: 34/100rem;
                  font-size: 28/100rem;
                  margin-bottom: 12/100rem;
                }

                .goods_list_num {
                  display: flex;
                  line-height: 20/100rem;
                  margin-bottom: 34/100rem;

                  .money {
                    flex: 1;
                    font-size: 32/100rem;
                    color: rgba(0, 0, 0, 0.85);
                    font-weight: 600;
                  }

                  .num {
                    flex: 1;
                    font-size: 28/100rem;
                    color: rgba(0, 0, 0, 0.85);
                    text-align: right;
                  }
                }
              }
            }

            .goods_list:last-child {
              border-bottom: none;
            }
          }
          .content_money{
            .goods_allCash{
              // width: 100%;
              font-size:28/100rem;
              font-weight:400;
              text-align: right;
              padding: 0.3rem 0.4rem;
              color:rgba(0,0,0,0.85);
              .back{
                font-weight:bold;
                color:rgba(0,0,0,0.3);
                text-decoration: line-through
              }
              .noback{
              font-weight:bold;
                color:rgba(255,78,121,1);
              }

            }
          }
        }
      }
    }
  }
// 底部样式
  .more_load {
    display: flex;
    justify-content: center;
  }

  .list_bottom {
    height: 84/100rem;
    line-height: 84/100rem;
    text-align: center;
    font-size: 23.97/100rem;
    color: #bebebe;
  }

  .center {
    text-align: center;
    width: 100%;
    padding-top: 0.8rem;
  }

  .center img {
    display: inline-block;
    width: 400/100rem;
    height: 400/100rem;
  }

  .center span {
    width: 100%;
    display: inline-block;
    text-align: center;
    padding-top: 0.1rem;
    color: #999;
    font-size: 0.28rem;
  }

</style>
