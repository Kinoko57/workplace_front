<template>
    <div>
       <common-header :h_title="h_title" :bgcolor='head_color'></common-header>
       <div class="customerDetail_bg" v-if="showCustomDetail">
           <div id='customer' style="height:0.9rem"></div>
           <div class="userInfo">
               <div class="img_box">
                   <img :src="custonInfon.img" alt="" v-if="custonInfon.img!=null&&custonInfon.img!=''">
                   <img :src="headPic" alt="" v-else>
               </div>
               <div class="userInfo_content">
                   <div class="userInfo_content_wraper">
                    <p class="title" v-if="custonInfon.remark!=null&&custonInfon.remark!=''">
                        <span>直邀</span>{{custonInfon.remark}}
                    </p>
                    <p class="title">昵称：{{custonInfon.nickname}}</p>
                    <p class="time"><span>成为粉丝: </span><span>{{custonInfon.inviter_time}}</span></p>
                   </div>
               </div>
           </div>
           <div class="order_info">
               <div class="order_info_c">
                    <div class="orderNum" @click="goOrderDetail">
                        <p class="num">{{orderInfo.number}}</p>
                        <p class="num_title">累计下单/单</p>
                    </div>
                    <div class="money">
                        <p class="num">{{orderInfo.money}}</p>
                        <p class="num_title">贡献佣金/元</p>
                    </div>
               </div>
           </div>
           <div class="phone">
               <div class="phone_img">
                   <img :src="phoneIcon" alt="">
               </div>
               <div class="phone_num">
                   <span>手机号</span>
                   <p>{{custonInfon.mobile}}</p>
               </div>
               <div class="copy_btn" @click="copyBtn(custonInfon.mobile)">
                   <button>复制</button>
               </div>
           </div>
           <div class="note" @click="gonChange('remarks','/editInfo?code=remarks&codename=修改备注&isInput=0&value=',custonInfon.remark)">
               <div class="note_img">
                   <img :src="editor" alt="">
               </div>
               <div class="note_name">
                   备注
               </div>
               <div class="note_i">
                   <i class="iconfont icon-iconfontjiantou5"></i>
               </div>
           </div>
       </div>
    </div>
</template>

<script>
import commonHeader from 'common/common-header'
import phoneIcon from '@/assets/img/phone.png'
import userImg from '@/assets/img/login.png'
import editor from '@/assets/img/editor.png'
import {
  InfiniteScroll,
  Indicator,
  Toast
} from 'mint-ui'
import {
  getCustonInfo
} from '@/api/share'
export default {
  name: 'CustomerDetail',
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    Toast
  },
  data() {
    return {
      h_title: '粉丝详情',
      head_color: {
        background: '#ffffff',
        color: '#000'
      },
      showCustomDetail: false,
      time: '2019-08-19',
      phoneIcon: phoneIcon,
      editor: editor,
      headPic: userImg,
      phone: '15735170000',
      orderNum: '888',
      money: '58,902.00',
      custonInfon: {},
      orderInfo: {},
      hasName: false,
      uid: '',
      custonInfo: {}
    }
  },
  mounted() {
    this.uid = this.$route.query.uid
    var storage = window.localStorage
    storage.setItem('type', this.$route.query.type)
    this.getCustonInfo()
  },
  methods: {
    goOrderDetail() {
      this.$router.togo({
        path: '/saleOrder?type=' + this.uid
      })
    },
    gonChange(type, url, value) {
      console.log(type)
      if (value !== '') {
        url = url + value
      }
      this.$router.togo({
        path: url + '&uid=' + this.uid
      })
    },
    getCustonInfo() {
      const that = this
      Indicator.open('加载中...')
      var obj = {
        uid: this.uid
      }
      getCustonInfo(obj).then(res => {
        if (res.isSuccess) {
          Indicator.close()
          that.showCustomDetail = true
          that.custonInfon = res.data.member
          that.orderInfo = res.data.shop
        } else {
          console.log('请求接口数据错误')
        }
      })
    },
    copyBtn(code) {
      this.$copyText(code).then(function (e) {
        Toast({
          message: '已成功复制手机号,快去联系他吧',
          duration: 1000
        })
        console.log(e)
      }, function (e) {
        console.log('复制失败')
        console.log(e)
      })
    }
  }

}
</script>

<style lang="less" scoped>

    .customerDetail_bg{
        width:100%;
        height: 100vh;
        background:rgba(250,250,252,1);
        overflow-x: hidden;
        overflow: scroll;

        .userInfo{
            background: #fff;
            padding: 20/100rem 30/100rem;
            padding-bottom: 0;
            box-sizing: border-box;
            height: 316/100rem;
            display: flex;
            .img_box{
                height: 136/100rem;
                width: 136/100rem;
                border-radius: 50%;
                margin-right: 20/100rem;
                img{
                 height: 136/100rem;
                 width: 136/100rem;
                 border-radius: 50%;
                }
            }
            .userInfo_content{
                width: 100%;
                position: relative;
                height: 1.38rem;
                .userInfo_content_wraper{
                    position: relative;
                    top: 50%;
                    transform: translateY(-50%);
                    .title{
                        font-size: 28/100rem;
                        font-weight:500;
                        color:rgba(0,0,0,0.85);
                        line-height: 0.4rem;
                        margin-bottom: 12/100rem;
                        width: 5.2rem;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        span{
                            width:54/100rem;
                            height:30/100rem;
                            text-align: center;
                            border:1/100rem solid rgba(223,182,143,1);
                            display: inline-block;
                            border-radius: 0.05rem;
                            font-size:20/100rem;
                            font-weight:500;
                            color:rgba(223,182,143,1);
                            line-height:32/100rem;
                            margin-right: 0.1rem
                        }
                        // margin-top: 26/100rem;
                    }
                    .time{
                        height:34/100rem;
                        font-size:28/100rem;
                        font-weight:400;
                        color:rgba(0,0,0,0.5);
                        line-height:34/100rem;
                    }
                }

            }
        }

        .order_info{
            width: 100%;
            margin-top: -1.4rem;
            .order_info_c{
                // width: 100%;
                width: 690/100rem;
                height:164/100rem;
                margin: 40/100rem auto;
                background:rgba(255,255,255,1);
                box-shadow:0 4/100rem 40/100rem 0 rgba(202,204,218,0.25);
                border-radius:8/100rem;
                display: flex;

                .orderNum,
                .money{
                    flex: 1;
                    text-align: center;
                    padding-top: 40/100rem;
                    .num{
                        color:rgba(0,0,0,0.85);
                        font-size: 36/100rem;
                        font-weight:bold;
                        line-height:42/100rem;
                        margin-bottom: 4/100rem;
                    }

                    .num_title{
                        height:34/100rem;
                        font-size:24/100rem;
                        font-weight:400;
                        color:rgba(0,0,0,0.5);
                        line-height:34/100rem;
                    }
                }

            }
        }

        .phone{
            width: 100%;
            height: 88/100rem;
            padding-left: 72/100rem;
            padding-right: 166/100rem;
            position: relative;
            box-sizing: border-box;
            background:rgba(255,255,255,1);

            .phone_img{
                padding-top: 28/100rem;
                height: 100%;
                width: 72/100rem;
                position: absolute;
                left: 0;
                top: 0;
                padding-left: 40/100rem;
                box-sizing: border-box;
                img{
                    height: 32/100rem;
                    width: 32/100rem;
                }
            }

            .phone_num{
                line-height: 88/100rem;
                width: 100%;
                font-size: 28/100rem;
                margin-left: 20/100rem;
                span{
                    display: inline-block;
                    width: 128/100rem;
                    color:rgba(0,0,0,0.85);
                }
                p{
                    display: inline-block;
                    color:rgba(0,0,0,0.5);
                }
            }

            .copy_btn{
                width: 136/100rem;
                height: 56/100rem;
                position: absolute;
                top: 16/100rem;
                right: 30/100rem;
                button{
                    width: 136/100rem;
                    height: 56/100rem;
                    border-radius:28/100rem;
                    border:2/100rem solid rgba(151,151,151,1);
                    background:rgba(255,255,255,1);
                }
            }
        }

        .note{
            width: 100%;
            height: 88/100rem;
            padding-left: 72/100rem;
            padding-right: 62/100rem;
            position: relative;
            box-sizing: border-box;
            background:rgba(255,255,255,1);
            margin-top: 20/100rem;

            .note_img{
                padding-top: 28/100rem;
                height: 100%;
                width: 72/100rem;
                position: absolute;
                left: 0;
                top: 0;
                padding-left: 40/100rem;
                box-sizing: border-box;
                img{
                    height: 32/100rem;
                    width: 32/100rem;
                }
            }

            .note_name{
                margin-left: 20/100rem;
                height: 100%;
                line-height: 88/100rem;
                font-size: 28/100rem;
                color:rgba(0,0,0,0.85);
            }

            .note_i{
                width: 32/100rem;
                height: 88/100rem;
                position: absolute;
                top: 0;
                right: 30/100rem;
                padding-top: 23/100rem;
                box-sizing: border-box;
            }
        }

    }
</style>
