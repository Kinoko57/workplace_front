<template>
  <div>
    <return-top @returnTop='goTop'></return-top>
    <div id='top'></div>
    <!-- <common-header :h_title="h_title" :showback="true" :bgcolor='head_color'></common-header> -->
    <div class='pro_detail' v-if='isShow'>
      <div class='pro_header'>
        <div class='pro_header_left head_between'>
          <i @click="tohome" class="iconfont icon-jiantouarrowhead7" style="font-size: 0.42rem;"></i>
        </div>
        <div class='pro_header_nav'>
          <span :class="choseName=='pro'?'text_active':''" @click="chose('pro')" data-value='pro'>商品</span>
          <span :class="choseName=='com'?'text_active':''" @click="chose('com')" data-value='com'>评价</span>
          <span :class="choseName=='more'?'text_active':''" @click="chose('more')" data-value='more'>详情</span>
          <span :class="choseName=='recommend'?'text_active':''" @click="chose('recommend')" data-value='recommend'
            v-if="recomList.length>0">推荐</span>
        </div>
      </div>
      <div>
        <div class='head_top'></div>
        <div class='pro_body' v-if='!allCom' id='top'>
          <div class='pro_info' id="pro">
            <div class='pro_swiper'>
              <mt-swipe :auto="3000" :speed='1000' :defaultIndex='0' :continuous='true' class='swiper_bg'>
                <mt-swipe-item v-for="(item,index) in imgUrls" :key='index' class="swipe_item_bg">
                  <img :src="item" class='slide-image' :style="{transform:'translate(0px,' + top / 1.5 + 'px)'}">
                </mt-swipe-item>
              </mt-swipe>
            </div>
            <div class='pro_title'>
              <div class='pro_price'>
                <div class="pro_sale_pt">
                  <span v-if="proInfo.is_third>0" class='pro_price_third'>{{proInfo.third_name}}</span>
                  <span v-if="proInfo.is_third<=0" class='pro_price_third'>平台自营</span>
                  <span v-if="proInfo.is_gift_zone==1" class='pro_price_gift'>{{proInfo.gift_title}}</span>
                </div>
                <div class='pro_sale_num'>已售出{{proInfo.buy_count}}件</div>
              </div>
              <div class="pro_name">
                <span>{{proInfo.name}}</span>
              </div>
              <div class='pro_tips' v-if="proType!='group'">
                <span>{{summary}}</span>
              </div>
              <div class='pro_pay_type'>
                <div class='pay_spec' v-if="proType=='group'&&buyType!=-2">
                  <mt-button v-if='sale_type>=4' id='4' :class="price_type==4? 'button_click': ''"
                    @click='chosePriceType("4","-1")'>￥{{activity.price_combine}}+<i
                      class='iconfont icon-jifen1'></i>{{activity.point_combine}}</mt-button>
                  <mt-button v-if='sale_type!=2&&sale_type!=6&&sale_type!=4' id='1'
                    :class="price_type==1? 'button_click': ''" @click='chosePriceType("1","-1")'>￥{{activity.price}}
                  </mt-button>
                  <mt-button v-if='sale_type!=1&&sale_type!=5&&sale_type!=4' id='2'
                    :class="price_type==2? 'button_click': ''" @click='chosePriceType("2","-1")'>
                    <i class='iconfont icon-jifen1'></i>{{activity.point}}
                  </mt-button>
                </div>
                <div class='pay_spec' wx:else>
                  <mt-button v-if='sale_type>=4' id='4' :class="default_price_type==4? 'button_click': ''"
                    @click='chosePriceType("4","1")' data-type='1'>
                    ￥{{default_spec.price_combine}}+
                    <i class='iconfont icon-jifen1'></i>{{default_spec.point_combine}}</mt-button>
                  <mt-button v-if='sale_type!=2&&sale_type!=6&&sale_type!=4' id='1'
                    :class="default_price_type==1 ? 'button_click': ''" @click='chosePriceType("1","1")' data-type='1'>
                    ￥{{default_spec.price_sell}}</mt-button>
                  <mt-button v-if='sale_type!=1&&sale_type!=5&&sale_type!=4' id='2'
                    :class="default_price_type==2 ? 'button_click': ''" @click='chosePriceType("2","1")' data-type='1'>
                    <i class='iconfont icon-jifen1'></i> {{default_spec.point}}</mt-button>
                </div>
              </div>
              <div class="pro_market">
                <span>{{price_market_from}}</span>
                <span class='pro_orig'>￥{{price_market}}</span>
              </div>
            </div>
            <div class="pro_sup_tag" v-if="proInfo.view_third_intro==1">
              <span>{{proInfo.third_intro}}</span>
            </div>
            <div class='pro_title_tips' v-if="title_tips!=''">
              <span>{{title_tips}}</span>
            </div>
            <div class="pro_spec">
              <div style='display:inline-flex;'>
                已选
              </div>
              <div style='display:inline-flex;width:4rem;overflow: hidden;text-overflow:ellipsis;white-space: nowrap'>
                <span v-for='(item,index) in showSpec' :key='index'>{{item}}</span>
              </div>
              <div style='display:inline-flex;width:0.8rem;'>
                <span>{{specNum}}件</span>
              </div>
              <div class='spec_icon' @click='showModel'>
                <i class='iconfont icon-yuandianzhong'></i>
                <i class='iconfont icon-yuandianzhong'></i>
                <i class='iconfont icon-yuandianzhong'></i>
              </div>
            </div>
          </div>
          <div class='pro_com' id='com'>
            <div class='com_head'>
              <span>精选评价</span>
              <div class='head_right' @click='viewAllCom' v-if='comList.length>0'>
                好评度
                <span>{{rate}}</span>
                <i class='iconfont icon-iconfontjiantou5'></i>
              </div>
            </div>
            <div class='com_list' v-if='comList.length==0'>
              <div class='com_tips'>暂无评价</div>
            </div>
            <div class='com_list' v-if='comList.length>0'>
              <div class='com_info' v-for='(item,index) in comList' :key='index'>
                <div class='com_info_head'>
                  <div class='user_info'>
                    <img :src='item.image' />
                    <span>{{item.nickname}}</span>
                  </div>
                  <div class='star_level'>
                    <i class='iconfont icon-star' v-if="item.score<1"></i>
                    <i class='iconfont icon-xingping light' v-if="item.score>=1"></i>
                    <i class='iconfont icon-star' v-if="item.score<2"></i>
                    <i class='iconfont icon-xingping light' v-if="item.score>=2"></i>
                    <i class='iconfont icon-star' v-if="item.score<3"></i>
                    <i class='iconfont icon-xingping light' v-if="item.score>=3"></i>
                    <i class='iconfont icon-star' v-if="item.score<4"></i>
                    <i class='iconfont icon-xingping light' v-if="item.score>=4"></i>
                    <i class='iconfont icon-star' v-if="item.score<5"></i>
                    <i class='iconfont icon-xingping light' v-if="item.score>=5"></i>
                  </div>
                </div>
                <div class='com_content'>
                  <span>{{item.comment}}</span>
                </div>
                <div class='com_img'>
                  <img :src='com' v-for='(com,index) in item.pic' :key='index' @click='previewImg(com)' />
                </div>
              </div>
              <div class='com_btn' @click='viewAllCom'>
                <mt-button>查看全部评价</mt-button>
              </div>
            </div>
          </div>
          <div class='pro_show' id='more'>
            <div class='show_head'>
              <div class='header_nav'>
                <span :class="choseid=='p'?'nav_text_active':''" id='p' @click='choseTab("p")'>商品介绍</span>
              </div>
            </div>
            <div class='pro_img'>
              <div v-html='proDetail' class='pro_html'></div>
              <div v-html='proBuy' class='pro_html' v-if="proBuy!=''"></div>
              <div id='recommend' :hidden="recomList.length<=0" style="height:0.94rem;position: absolute;bottom: 0;"></div>
            </div>
          </div>
          <div class='pro_recomm' v-if="recomList.length>0">
            <span class='i_title'>—————— 你可能还喜欢 ——————</span>
            <div class='recom_list'>
              <div class='i_pro' v-for="(item,index) in recomList" :key="index">
                <div class='pro_img' @click='goPro(item.goods_id)'>
                  <img :src='item.img' />
                </div>
                <div class='pro_title pro_line_two' @click='goPro(item.goods_id)'>
                  <div class='pro_level' v-if='item.promotion==1'>
                    <img :src="imgPath+'member/cu.png'" mode='aspectFit' />
                    <span>限时购</span>
                  </div>
                  {{item.name}}
                </div>
                <div class='pro_price'>
                  <div style='display:flex;align-items:center;line-height:0.48rem;'>
                    <div class='pro_flex' v-if='item.deal_type!=2'>
                      <span class='peo_nowprice' v-if='item.deal_type==1'>￥{{item.price_sell}}<span
                          style="color:#ff4e79;font-size:0.23rem" v-if="isMember"> / 赚{{item.back_rebate}}</span></span>
                      <span class='peo_nowprice' v-if='item.deal_type>=4'>￥{{item.price_sell}}<span
                          style="color:#ff4e79;font-size:0.23rem" v-if="isMember"> /
                          赚{{item.back_rebate}}</span>+</span>
                    </div>
                    <div class='pro_flex' v-if='item.deal_type!=1'>
                      <div class='pro_inter_img'>
                        <i class='iconfont icon-jifen1'></i>
                      </div>
                      <span class='pro_integral' v-if='item.deal_type==2||item.deal_type==3'>{{item.point}}</span>
                      <span class='pro_integral'
                        v-if='item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3'>{{item.point}}</span>
                    </div>
                  </div>
                  <div style='display:flex;align-items:center;justify-content:space-between;'>
                    <div style='display:inline-flex;align-items:center;'>
                      <span class='pro_bg'>{{item.price_market_from}}</span>
                      <span class='pro_orig line'>￥{{item.price_market}}</span>
                    </div>
                    <div class='pro_count'>销量:{{item.buy_count}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div style='height:1.01rem;' class="null_height"></div> -->
        </div>
        <div class='pro_com_detail' v-if="allCom">
          <div class='com_detail_head'>
            <div class='com_head_left'>
              <span>共{{comDetail.length}}条评论</span>
            </div>
            <div class='com_head_right'>
              <span>好评{{rate}}</span>
            </div>
          </div>
        <div class='com_detail_list' v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
          infinite-scroll-distance="30">
          <div class='com_detail_info' v-for='(item,index) in comDetail' :key='index'>
            <div class='com_detail_userinfo'>
              <img :src='item.image' v-lazy="item.image" />
              <div class='com_detail_name'>
                <span>{{item.nickname}}</span>
                <div class='com_detail_star'>
                  <i class='iconfont icon-star' v-if="item.score<1"></i>
                  <i class='iconfont icon-xingping light' v-if="item.score>=1"></i>
                  <i class='iconfont icon-star' v-if="item.score<2"></i>
                  <i class='iconfont icon-xingping light' v-if="item.score>=2"></i>
                  <i class='iconfont icon-star' v-if="item.score<3"></i>
                  <i class='iconfont icon-xingping light' v-if="item.score>=3"></i>
                  <i class='iconfont icon-star' v-if="item.score<4"></i>
                  <i class='iconfont icon-xingping light' v-if="item.score>=4"></i>
                  <i class='iconfont icon-star' v-if="item.score<5"></i>
                  <i class='iconfont icon-xingping light' v-if="item.score>=5"></i>
                </div>
              </div>
            </div>
            <div class='com_detail_com'>
              {{item.comment}}
            </div>
            <div class='com_detail_imglist'>
              <img :src='com' v-for='(com,index) in item.pic' :key='index' @click='previewImg(com)' v-lazy="com" />
            </div>
            <div class='com_detail_pro'>
              <div class='com_detail_pro_info'>
                <span v-if="item.title!=null&&item.title!=''">规格：{{item.title}}</span>
                <span>购买日期：{{item.date}}</span>
              </div>
              <div class='com_detaul_oper'>
              </div>
            </div>
            <div class='com_replay' v-if="item.reply!=null&&item.reply!=''">
              <div class='replay_info'>卖家回复:{{item.reply}}</div>
              <div class='replay_time'>{{item.reply_date}}</div>
            </div>
          </div>
          <div class="more_load" v-if="!loading">
            <mt-spinner type="fading-circle"></mt-spinner>
          </div>
        </div>
        </div>
      </div>
      <div class='null_view'></div>
      <div class="pro_btn" v-if='!hiddenFix'>
        <div class='btn_blcok pro_one' v-if="proType=='newpeople'">
          <mt-button class='show_car' @click='goIndex("/Car")'>
            <div class='carNum' v-if='total_amout>0'>
              <span v-if='total_amout<99'>{{total_amout}}</span>
              <span v-else>···</span>
            </div>
            <i class='iconfont icon-car'></i>
            <span class="btn_text">购物车</span>
          </mt-button>
        </div>
        <div class='btn_blcok width pro_buy btn_save' @click="buyNow('0')"
          v-if="maxNum>0&&is_up=='true'&&isMember && proType=='newpeople'">
          <div class='new_wraper'>
            <div class='z_buy'>自购省</div>
            <div class='z_save'>至少￥{{back_rebate}}</div>
          </div>
        </div>
        <mt-button class='btn_blcok width pro_buy' @click="buyNow('0')"
          v-if="maxNum>0&&is_up=='true'&&!isMember&&proType=='newpeople'">立即购买</mt-button>
        <div v-if="maxNum>0&&is_up=='true' && proType!='newpeople'&&formShare=='gift'" class="gift_buy"
          @click="buyNow('0')">
          <img :src="imgPath+'pro/gift_buy.jpg'" mode='aspectFit' />
        </div>
        <div v-if="maxNum>0&&is_up=='true' && proType!='newpeople'&&formShare=='share'" class="gift_buy" @click='share'>
          <img :src="imgPath+'pro/gift_share.png'" mode='aspectFit' />
        </div>
        <mt-button class='btn_blcok width pro_buy pro_buy_dis' v-if="maxNum<=0&&is_up=='true'">已售完</mt-button>
        <!-- <mt-button class='btn_blcok width pro_buy pro_buy_dis' v-if="is_up=='true'&&is_retail==0">未开启零售</mt-button> -->
        <mt-button class='btn_blcok width pro_buy pro_buy_dis' v-if="is_up=='false'">已下架</mt-button>
      </div>
      <!-- 规格弹框 -->
      <div class='pro_spec_model' v-if='!modelShow' @click='closeModel' catchtouchmove="ture">
      </div>
      <div class='pro_spec_detail animated slideInUp' v-if='!modelShow' catchtouchmove="ture">
        <div class='spec_head'>
          <div class='spec_pro_img' @click='previewImg(staticImg)'>
            <img :src='staticImg' mode='widthFix'>
          </div>
          <div class='spec_close' @click='closeModel'>
            <i class='iconfont icon-guanbi'></i>
          </div>
          <div class='spec_pro_price' v-if="proType=='group'&&buyType!=-2">
            <span class='spec_pro_nowprice' v-if='price_type==1'>￥{{activity.price}}</span>
            <span class='spec_pro_nowprice' v-if='price_type==4'>￥{{activity.price_combine}}+</span>
            <div class='spec_pro_inter_img' v-if='price_type!=1'>
              <i class='iconfont icon-jifen1'></i>
            </div>
            <span class='spec_pro_integral' v-if='price_type==4'>{{activity.point_combine}}</span>
            <span class='spec_pro_integral' v-if='price_type==2'>{{activity.point}}</span>
          </div>
          <div class='spec_pro_price' wx:else>
            <span class='spec_pro_nowprice' v-if='default_price_type==1'>￥{{default_spec.price_sell}} <span
                class="spec_pro_nowprice_f" v-if="isShare==1&&isMember&&proType=='newpeople'"> / 返￥{{back_rebate}}</span></span>
            <span class='spec_pro_nowprice' v-if='default_price_type>=4'>￥{{default_spec.price_combine}}+</span>
            <div class='spec_pro_inter_img' v-if='default_price_type!=1'>
              <i class='iconfont icon-jifen1'></i>
            </div>
            <span class='spec_pro_integral' v-if='default_price_type>=4'>{{default_spec.point_combine}}</span>
            <span class='spec_pro_integral'
              v-if='default_price_type==2||default_price_type==3'>{{default_spec.point}}</span>
          </div>
          <div class='spec_pro_code'>
            <div>
              <span>{{price_market_from}}</span>
              <span class='spec_pro_orig'>￥{{price_market}}</span>
            </div>
          </div>
        </div>
        <div class='spec_body' scroll-y scroll-with-animation='true'>
          <div v-if="hasSpec" v-for='(item,index) in specList' :key='index'>
            <div class='spec_title'>
              {{item.name}}
            </div>
            <div class='spec_type'>
              <mt-button @click="choseType(item.pid,item.tid)" v-for="(item,index) in item.list" :key='index'
                :class="item.ischose? 'button_click': ''">{{item.name}}</mt-button>
            </div>
          </div>
          <div class='spec_num' v-if="proType!='birthday'">
            <span>数量</span>
            <div class='pro_icon'>
              1
            </div>
          </div>
        </div>
        <div v-if="maxNum>0&&is_up=='true'&&spec_up==true&&proType=='newpeople'">
          <div class="spec_btn">
            <mt-button @click='addCar("-1")' class='surebtn'>确认</mt-button>
          </div>
        </div>
        <div v-if="maxNum>0&&is_up=='true'&&spec_up==true&&proType!='newpeople'">
          <div class="spec_btn_gift">
            <img :src="imgPath+'pro/gift_buy.jpg'" mode='aspectFit' @click='addCar("-1")' class='surebtn'
              v-if="formShare=='gift'">
            <img :src="imgPath+'pro/gift_share.png'" mode='aspectFit' class='surebtn' v-else @click='share'>
          </div>
        </div>
        <div v-if="(maxNum<=0||spec_up==false)&&is_up=='false'">
          <div class="spec_btn">
            <mt-button class='surebtn_false'>已售完</mt-button>
          </div>
        </div>
        <div v-if="is_up=='false'">
          <div class="spec_btn">
            <mt-button class='surebtn_false'>已下架</mt-button>
          </div>
        </div>
        <!-- <div v-if="is_up=='true'&&is_retail==0">
          <div class="spec_btn">
            <mt-button class='surebtn_false'>未开启零售</mt-button>
          </div>
        </div> -->
      </div>
      <!-- 查看大图 -->
      <div class='pro_com_img_bg' v-if='imgShow' catchtouchmove="ture" @click="hiddenImg"></div>
      <div class='pro_com_img' v-if='imgShow' catchtouchmove="ture" @click="hiddenImg">
        <img :src="img_show_big" alt="" @click="hiddenImg">
      </div>
      <!-- <div class="pro_invite_bg" v-if="showInvite" catchtouchmove="ture"></div> -->
      <!-- <div class="pro_invite" v-if="showInvite" catchtouchmove="ture">
        <div class="invite_info">
          <img src="../../assets/img/asShoper/invite_bg.png" class="bg">
          <div class="show_info" v-if="showInviteInfo">
            <div class="invite_title">确认您的邀请人</div>
            <div class="invite_user">
              <div class="user_img">
                <img :src="inviteInfo.image" alt="" srcset="">
              </div>
              <div class="user_info">
                <p class="line_one_overflow">{{inviteInfo.nickname}}</p>
                <p class="phone">手机号：{{inviteInfo.mobile}}</p>
              </div>
            </div>
          </div>
          <div class="show_info" v-if="!showInviteInfo">
            <div class="invite_title">修改您的邀请人</div>
            <div class="invite_phone">
              <img :src="phoneImg" class="firstIcon">
              <input type='number' style="padding-left: 0.16rem" @blur="noClose" v-model="phoneNumber"
                placeholder="请输入11位手机号" :class="phoneNumber!=''?'black_text':''">
              <div class="close" v-show="phoneNumber!==''" @click="clearInfo">
                <img :src="clearImg" alt="" class="clear">
              </div>
            </div>
            <div class="input_line"></div>
          </div>
          <div class="invite_btn" v-if="showInviteInfo">
            <button class="change btn_width" @click="showEditInvite">修改</button>
            <button class="sure btn_width" @click="sureInvite">确认</button>
          </div>
          <div class="invite_btn" v-if="!showInviteInfo">
            <button class="sure_change" :class="allChange ? 'all_click':'' " @click="editInviteInfo">确认</button>
          </div>
        </div>
        <div class='invite_close' @click='hiddenInvite'>
          <img src="../../assets/img/asShoper/gift_close.png">
        </div>
      </div> -->
    </div>
    <div class='goIndex' @click="goIndex('/index')">
      <i class='iconfont icon-home'></i>
    </div>
  </div>
</template>
<script>
import {
  Indicator,
  Button,
  Swipe,
  Toast,
  SwipeItem
} from 'mint-ui'
import commonHeader from 'common/common-header'
import returnTop from '@/components/return-top'
import {
  newDetaailMenu,
  newDetaailcomment,
  findDetaailcar,
  getDetaailProduct,
  getDetaailAdd,
  getInviteInfo,
  editInvite
} from '@/api/share'
import {
  mapMutations
} from 'vuex'
import {
  getProDetail,
  getComList,
  addCarofPro,
  addCarofNormal,
  getCarList
} from '@/api/index'
import {
  countDown
} from '@/store/pubilc.js'
import phoneIcon from '@/assets/img/asShoper/left_icon.png'
import clearIcon from '@/assets/img/clear.png'
export default {
  name: 'NewPeopleDetail',
  data() {
    return {
      proDetail: '',
      proBuy: '',
      h_title: '新人详情',
      head_color: {
        background: '#fff',
        color: '#000'
      },
      inviteInfo: {},
      showInvite: false,
      giftInfo: {},
      showInviteInfo: true,
      phoneImg: phoneIcon,
      clearImg: clearIcon,
      gift_group: '',
      total_amout: 0,
      imgShow: false,
      img_show_big: '',
      isMember: false,
      imgPath: process.env.FilE_URL,
      allowbind: true,
      success_num: 0,
      title_tips: '',
      g_list_height: 350,
      groupTotal: 0,
      comHeight: 0,
      moreHeight: 0,
      proHeight: 0,
      top: 0,
      topNum: 0,
      hiddenFix: false,
      isShow: false,
      imgUrls: [],
      height: '',
      min_height: 0,
      sale_type: '',
      price_type: '',
      default_price_type: '',
      default_chose_paytype: false,
      chose_paytype: false,
      //   apiUrl: app.globalData.apiUrl,
      choseName: 'pro',
      rate: '',
      chosecap: true,
      modelShow: true,
      groupShow: true,
      specNum: 1,
      isColl: false,
      isSign: true,
      page: 1,
      is_up: '', // 是否上架
      is_retail: 1,
      limit: 10,
      buyType: 0,
      product_id: '',
      // usepoint: 0,
      default_spec: {},
      maxNum: 0,
      totalNum: 0,
      summary: '', // 商品简介
      recomList: [], // 推荐商品
      proInfo: [],
      goods_info: [],
      comList: [],
      comDetail: [],
      specNameList: [],
      specDetailList: [],
      specList: [],
      showSpec: [],
      // isnormal: true,
      toView: '',
      proType: 'newpeople',
      intrDetail: '',
      specDetail: '',
      afterDetail: '',
      choseid: 'p',
      allCom: false,
      activity: {},
      endTime: null,
      saleTime: [],
      time: null,
      endTimeList: [],
      saleTimeList: [],
      addgroup: '',
      groupId: '',
      hasSpec: true,
      groupList: [],
      isFlash: 0,
      firstImg: '',
      price_market_from: '',
      price_market: 0,
      staticImg: '',
      activity_price_type: '',
      normal_price_type: '',
      group_start: 0,
      //   is_iphonex: app.globalData.phoneType,
      spec_up: true,
      comTotal: 0,
      openLoad: false,
      imgPreview: true,
      back_rebate: '',
      isShare: 0,
      type: '', // 商品类型，normal普通
      goods_id: '', // 商品id
      phoneNumber: '', // 新邀请人手机号
      allChange: false,
      formShare: 'gift',
      loading: true,
      autoOpen: false
    }
  },
  components: {
    Indicator,
    Button,
    Swipe,
    SwipeItem,
    commonHeader,
    returnTop,
    Toast
  },
  mounted() {
    // 是否显示自购省
    var that = this
    this.isShare = this.$store.state.home.is_share
    this.isMember = this.$store.state.home.is_member
    Indicator.open('加载中...')
    // this.goods_id = this.$route.query.id // 普通商品的商品id
    this.type = this.$route.query.type
    var storage = window.localStorage
    if (storage.getItem('isLogin') === true || storage.getItem('isLogin') === 'true') {
      that.getInfo()
      that.goods_id = this.$route.query.id // 普通商品的商品id
      that.allowbind = true
      if (that.type === 'newpeople') {
        that.proType = that.type
        that.addgroup = ''
      } else {
        that.proType = that.type
        if (this.$route.query.form != undefined && this.$route.query.form == 'share') {
          that.formShare = 'share'
        }
      }
      var obj = {
        id: this.$route.query.id,
        type: this.$route.query.type
      }
      newDetaailMenu(obj).then(res => {
        if (res.isSuccess) {
          that.proInfo = res.goods_info
          that.sale_type = res.goods_info.deal_type
          that.goods_info = res.goods_info
          that.summary = res.goods_info.summary
          that.staticImg = res.product_default.img
          that.isColl = res.is_collect
          that.imgUrls = res.pic
          that.default_spec = res.product_default
          that.maxNum = res.product_default.store
          that.totalNum = res.goods_info.store
          that.product_id = res.product_default.product_id
          that.isFlash = res.goods_info.promotion
          that.is_up = res.goods_info.is_up
          that.is_retail = res.goods_info.is_retail
          that.intrDetail = res.goods_info.intro
          that.specDetail = res.goods_info.specification
          that.afterDetail = res.goods_info.packaging
          that.firstImg = res.goods_info.img
          that.normal_price_type = res.goods_info.deal_type
          that.title_tips = res.site_exemption
          that.back_rebate = res.product_default.back_rebate
          that.proDetail = that.intrDetail
          that.proBuy = res.goods_info.purchase_note
          if (res.goods_info.deal_type >= 4) {
            that.price_type = 4
            that.default_price_type = 4
          } else if (res.goods_info.deal_type === 2 || res.goods_info.deal_type === '2') {
            that.price_type = 2
            that.default_price_type = 2
          } else {
            that.price_type = 1
            that.default_price_type = 1
          }
          if (res.product_default.price_market_from !== undefined || res.product_default.price_market_from !==
              'undefined') {
            that.price_market_from = res.product_default.price_market_from
            that.price_market = res.product_default.price_market
          }
          that.isShow = true
          Indicator.close()
          if (res.marketing === undefined || res.marketing === 'undefined') {
            that.groupId = ''
          } else {
            if (res.marketing.id !== undefined || res.marketing.id !== 'undefined') {
              that.groupId = res.marketing.id
            } else {
              that.groupId = ''
            }
          }
          if (that.isFlash === 1 || that.isFlash === '1') {
            var secTime = countDown(res.marketing.countdown)
            that.endTime = res.marketing.countdown
            that.saleTime = secTime
            that.time = setInterval(function () {
              secTime = countDown(--that.endTime)
              that.saleTime = secTime
            }, 1000)
            that.time = that.time
          }
          if ((res.spec_key_name !== undefined || res.spec_key_name !== 'undefined') && (res.spec_key_nameval !==
                undefined || res.spec_key_nameval !== 'undefined')) {
            that.specNameList = res.spec_key_name
            that.specDetailList = res.spec_key_nameval
            var arr = []
            var list = []
            for (var item in that.specNameList) {
              arr.push({
                id: item,
                name: that.specNameList[item],
                list: []
              })
            }
            // eslint-disable-next-line no-redeclare
            for (var item in that.specDetailList) {
              // eslint-disable-next-line camelcase
              var d_list = []
              for (var key in that.specDetailList[item]) {
                d_list.push({
                  tid: item + ':' + key,
                  pid: item,
                  name: that.specDetailList[item][key],
                  ischose: false
                })
              }
              list.push({
                id: item,
                list: d_list
              })
            }
            for (var i = 0; i < arr.length; i++) {
              for (var j = 0; j < list.length; j++) {
                if (arr[i].id === list[j].id) {
                  arr[i].list = list[j].list
                }
              }
            }
            var spec = res.product_default.spec.split(';')
            for (var k = 0; k < spec.length; k++) {
              // eslint-disable-next-line no-redeclare
              for (var i = 0; i < arr.length; i++) {
                // eslint-disable-next-line no-redeclare
                for (var j = 0; j < arr[i].list.length; j++) {
                  if (arr[i].list[j].tid == spec[k]) {
                    arr[i].list[j].ischose = true
                    that.showSpec.push(arr[i].list[j].name)
                  }
                }
              }
            }
            that.proInfo.price_sell = res.product_default.price_sell
            if (res.product_default.bn !== '' && res.product_default.bn != null) {
              that.proInfo.bn = res.product_default.bn
            }
            that.specList = arr
            that.showSpec = that.showSpec
            that.proInfo = that.proInfo
          } else {
            that.flag = false
            that.product_id = res.product_info.product_id
            that.hasSpec = false
          }

          document.getElementById('top').scrollIntoView(false)
          console.log('dasdas' + that.price_type)
        } else {
          that.isShow = true
          Indicator.close()
        }
      })
      var id = ''
      if (that.proType === 'group') {
        id = this.$route.query.goods_id
      } else {
        id = this.$route.query.id
      }
      var obj1 = {
        goods_id: id,
        page: 1,
        limit: 2
      }
      newDetaailcomment(obj1).then(res => {
        if (res.isSuccess === true || res.isSuccess === 'true') {
          if (res.isSuccess) {
            that.comList = res.rows
            that.rate = res.rate
          }
        }
      })
      // 查询购物车数量
      getCarList().then(res => {
        if (res.isSuccess) {
          that.setCarNum(res.data.rows_total)
          if (res.data.rows_total > 0) {
            that.total_amout = that.$store.state.home.carnum
          }
        }
      })
      // 查询购物车推荐商品
      var obj2 = {
        id: that.goods_id
      }
      findDetaailcar(obj2).then(res => {
        if (res.isSuccess) {
          if (res.data.rows == null) {
            res.data.rows = []
          }
          that.recomList = res.data.rows
        }
      })
    }
    if (this.imgPreview === false) {
      this.imgPreview = true
    }
    this.tabScroll()
    let System = window.plus
    if (System !== undefined || System !== 'undefined') {
      System.share.getServices(function (s) {
        let shares = {}
        for (var i in s) {
          var t = s[i]
          shares[t.id] = t
        }
        that.sharewx = shares['weixin']
        console.log(that.sharewx)
      }, function (e) {
        console.log('获取分享服务列表失败：' + e.message)
      })
    }
  },
  beforeDestroy() {
    // this.$refs.slider.$emit('autoplayStop')
    this.isShow = false
    window.removeEventListener('scroll', this.handleScroll)
    clearInterval(this.time)
  },
  methods: {
    ...mapMutations({
      setCarNum: 'SET_CARNUM'
    }),
    getInfo() {
      let that = this
      getInviteInfo().then(res => {
        if (res.isSuccess === true || res.isSuccess === 'true') {
          that.inviteInfo = res.data
        }
      })
    },
    goTop() {
      console.log('回到顶部')
      document.getElementById('pro').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
      this.choseName = 'pro'
    },
    hiddenImg() {
      this.imgShow = false
    },
    previewImg(url) {
      this.imgShow = true
      this.img_show_big = url
    },
    hiddenInvite() {
      this.showInvite = false
      this.allowbind = true
      this.showInviteInfo = true
    },
    noClose() {
      if (this.phoneNumber !== '' && this.phoneNumber.length === 11 && /^1[3|4|5|6|7|8|9]\d{9}$/.test(this.phoneNumber)) {
        this.allChange = true
      } else {
        this.allChange = false
      }
    },
    clearInfo() {
      this.phoneNumber = ''
      this.allChange = false
    },
    goPro(id) {
      const that = this
      var obj = {
        id: id
      }
      if (id !== '') {
        getProDetail(obj).then(res => {
          if (res.isSuccess == false) {
            Toast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          } else {
            that.$router.togo({
              path: '/proDetail?type=normal&id=' + id
            })
          }
        })
      } else {
        that.$router.togo({
          path: '/proDetail?type=normal&id=' + id
        })
      }
    },
    goIndex(url) {
      this.$router.replace({
        path: url
      })
    },
    tabScroll() {
      window.addEventListener('scroll', this.handleScroll)
    },
    handleScroll() {
      let scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop
      this.top = scrollTop
      let browserHeight = window.outerHeight // 浏览器高度
      if (scrollTop > browserHeight) {
        let recomHeight = document.getElementsByClassName('pro_show')[0].offsetHeight + document
          .getElementsByClassName('pro_info')[0].offsetHeight + document.getElementsByClassName('pro_com')[0]
          .offsetHeight
        if (this.recomList.length > 0) {
          if (scrollTop > recomHeight) {
            this.choseName = 'recommend'
          } else {
            this.choseName = 'more'
          }
        } else {
          this.choseName = 'more'
        }
      } else {
        if (this.allCom === false) {
          if (scrollTop < 500) {
            this.choseName = 'pro'
          } else if (scrollTop > 500) {
            if (this.comList.length <= 0) {
              if (scrollTop > 684) {
                this.choseName = 'more'
              } else {
                this.choseName = 'com'
              }
            } else {
              this.choseName = 'com'
            }
          }
        }
      }
    },
    closeModel() {
      this.modelShow = !this.modelShow
    },
    showModel() {
      this.modelShow = false
      this.buyType = -1
    },
    closeGroup() {
      this.groupShow = !this.groupShow
    },
    moreGroup() {
      this.groupShow = false
    },
    chose(value) {
      this.choseName = value
      this.allCom = false
      //   this.toView = value
      document.getElementById(value).scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    choseTab(type) {
      this.choseid = type
      if (type === 'p') {
        this.proDetail = this.intrDetail
      } else if (type === 's') {
        this.proDetail = this.specDetail
      } else {
        this.proDetail = this.afterDetail
      }
    },
    viewAllCom() {
      this.allCom = true
      this.choseName = 'com'
      this.loading = false
      this.autoOpen = true
      this.getCom()
    },
    getCom() {
      let that = this
      var info = {
        goods_id: this.goods_id,
        page: this.page,
        limit: this.limit
      }
      newDetaailcomment(info).then(res => {
        Indicator.close()
        if (res.isSuccess === true || res.isSuccess === 'true') {
          if (res.isSuccess) {
            that.comDetail = res.rows
            that.comTotal = res.total
            that.openLoad = true
          }
        }
      })
    },
    loadMore() {
      let that = this
      that.loading = true
      // 加载更多数据
      that.page = ++that.page
      console.log('更多架子啊')
      var info = {
        goods_id: that.goods_id,
        page: that.page,
        limit: that.limit
      }
      getComList(info).then(res => {
        if (res.isSuccess) {
          // 全部评价
          that.comDetail = that.comDetail.concat(res.rows)
          that.comTotal = res.total
          that.loading = false
          that.choseName = 'com'
          if (res.rows.length < that.limit) {
            that.loading = true
          }
        }
      })
    },
    choseType(pid, tid) {
      var spec = []
      var specshow = []
      var slist = this.specList
      for (var i = 0; i < slist.length; i++) {
        if (slist[i].id == pid) {
          for (var j = 0; j < slist[i].list.length; j++) {
            slist[i].list[j].ischose = false
          }
          for (var j = 0; j < slist[i].list.length; j++) {
            if (slist[i].list[j].tid == tid) {
              slist[i].list[j].ischose = true
            }
          }
        }
      }
      for (var i = 0; i < slist.length; i++) {
        for (var j = 0; j < slist[i].list.length; j++) {
          if (slist[i].list[j].ischose) {
            spec.push(slist[i].list[j].tid)
            specshow.push(slist[i].list[j].name)
          }
        }
      }
      this.specList = slist
      this.showSpec = specshow
      var that = this
      var obbj = {
        goods_id: that.proInfo.goods_id,
        marketing_type: 0,
        group_id: '',
        get_type: 'newpeople',
        spec: spec.join(';')
      }

      getDetaailProduct(obbj).then(res => {
        if (res.isSuccess) {
          that.product_id = res.data.product.product_id
          that.maxNum = res.data.product.store
          console.log(that.proType)
          if (that.proType != 'newpeople') {
            that.default_spec = res.data.product
          } else {
            that.back_rebate = res.data.back_rebate
          }
          that.spec_up = res.data.is_up
          if (res.data.product.price_market_from != undefined) {
            that.price_market_from = res.data.product.price_market_from
            that.price_market = res.data.product.price_market
          }

          if (res.data.product.img != '' && res.data.product.img != null) {
            that.staticImg = res.data.product.img
          } else {
            that.staticImg = that.firstImg
          }
        }
      })
    },
    chosePriceType(id, type) {
      if (type == 0) {
        this.price_type = id
        this.default_chose_paytype = true
      } else {
        this.default_price_type = id
        this.chose_paytype = true
      }
    },
    choseCap: function () {
      this.chosecap = !this.chosecap
    },
    tohome() {
      this.isShow = false
      this.$router.goBack()
    },
    buyNow(id) {
      this.modelShow = false
      this.buyType = -1
      if (this.price_type === '' && (id !== '10' || id !== 10)) { // 普通商品先选中支付方式再选择规格
        if (this.sale_type >= 4) {
          this.price_type = 4
        } else if (this.sale_type === 2 || this.sale_type === '2') {
          this.price_type = 2
        } else {
          this.price_type = 1
        }
      }
    },
    addCar(e) {
      console.log(this.allowbind)
      var that = this
      //   wx.showLoading({
      //     mask: true
      //   })
      if (that.allowbind === true || that.allowbind === 'true') {
        that.allowbind = false
        if (that.$store.state.home.isbind === 'false' || that.$store.state.home.isbind === false) {
          that.$router.togo({
            path: '/bind?visit=4'
          })
        } else {
          var flag = true
          var typelist = []
          var slist = this.specList
          for (var i = 0; i < slist.length; i++) {
            typelist.push(false)
            for (var j = 0; j < slist[i].list.length; j++) {
              if (slist[i].list[j].ischose) {
                typelist[i] = true
              }
            }
          }
          for (var k = 0; k < typelist.length; k++) {
            if (typelist[k] === false || typelist[k] === 'false') {
              flag = false
            }
          }
          if (this.buyType === 1 || this.buyType === '1' || e === '0' || e === 0) {
            if (!flag) {
              Toast({
                message: '未选择规格',
                duration: 1000
              })
              that.allowbind = true
            } else {
              if (Number(that.specNum) > Number(that.maxNum)) {
                Toast({
                  message: '库存不足',
                  duration: 1000
                })
                if (Number(that.maxNum) <= 0) {
                  that.specNum = 1
                  that.allowbind = true
                } else {
                  that.specNum = that.maxNum
                  that.allowbind = true
                }
              } else {
                var info1 = {
                  pid: that.product_id,
                  quantity: that.specNum,
                  checked: 0,
                  deal_type: that.default_price_type
                }
                addCarofPro(info1).then(res => {
                  if (res.isSuccess) {
                    Toast({
                      message: '加入购物车成功',
                      iconClass: 'iconfont icon-dui1',
                      duration: 1000
                    })
                    that.allowbind = true
                  } else {
                    Toast({
                      message: res.msg,
                      duration: 1000
                    })
                    that.allowbind = true
                  }
                })
              }
            }
          } else if (this.buyType === -1 || this.buyType === '-1' || e === '1' || e === 1) {
            if (!flag) {
              Toast({
                message: '未选择规格',
                duration: 1000
              })
              that.allowbind = true
            } else {
              if (Number(that.specNum) > Number(that.maxNum)) {
                Toast({
                  message: '库存不足',
                  duration: 1000
                })
                if (Number(that.maxNum) <= 0) {
                  that.specNum = 1
                  that.allowbind = true
                } else {
                  that.specNum = that.maxNum
                  that.allowbind = true
                }
              } else {
                var groupNormal = 1
                console.log(e)
                if (that.isFlash === 1 || that.isFlash === '1') {
                  // 促销商品
                  groupNormal = 0
                }
                let info = {
                  pid: that.product_id,
                  num: that.specNum,
                  goods_id: that.goods_id,
                  deal_type: that.default_price_type
                }
                console.log(groupNormal)
                if (groupNormal === 0) {
                  addCarofNormal(info).then(res => {
                    if (res.isSuccess) {
                      that.allowbind = true
                      window.localStorage.setItem('neworder', true)
                      this.$router.togo({
                        path: '/sureOrder?addType=3&id=' +
                            that.product_id +
                            '&group_normal=' +
                            groupNormal
                      })
                    } else {
                      Toast({
                        message: res.msg,
                        duration: 1000
                      })
                      setTimeout(function () {
                        that.allowbind = true
                      }, 1000)
                    }
                  })
                } else {
                  if (that.proType == 'newpeople') {
                    console.log('新人专享下单')
                    var info2 = {
                      pid: that.product_id,
                      num: that.specNum,
                      goods_id: that.goods_id,
                      deal_type: that.default_price_type
                    }
                    getDetaailAdd(info2).then(res => {
                      if (res.isSuccess) {
                        this.$router.togo({
                          path: '/sureOrder?addType=3&proType=newpeople&id=' + that.product_id
                        })
                      } else {
                        Toast({
                          message: res.msg,
                          duration: 1000
                        })
                        setTimeout(function () {
                          Indicator.close()
                          that.allowbind = true
                        }, 1000)
                      }
                    })
                  } else {
                    this.giftInfo = {
                      pid: that.product_id,
                      num: that.specNum,
                      goods_id: that.goods_id,
                      deal_type: that.default_price_type
                    }
                    this.gift_group = groupNormal
                    // 礼包专区购买
                    addCarofNormal(this.giftInfo).then(res => {
                      if (res.isSuccess) {
                        that.allowbind = true
                        window.localStorage.setItem('neworder', true)
                        this.$router.togo({
                          path: '/sureOrder?addType=3&id=' + that.product_id + '&group_normal=' + that.gift_group
                        })
                      } else {
                        Toast({
                          message: res.msg,
                          duration: 1000
                        })
                        setTimeout(function () {
                          that.allowbind = true
                        }, 1000)
                      }
                    })
                    // 判断是否是直邀用户
                    // if (this.$store.state.home.userInfo.inviter == -1) {
                    //   let that = this
                    //   addCarofNormal(this.giftInfo).then(res => {
                    //     if (res.isSuccess) {
                    //       that.allowbind = true
                    //       window.localStorage.setItem('neworder', true)
                    //       this.$router.togo({
                    //         path: '/sureOrder?addType=3&id=' + that.product_id + '&group_normal=' + that.gift_group
                    //       })
                    //     } else {
                    //       Toast({
                    //         message: res.msg,
                    //         duration: 1000
                    //       })
                    //       setTimeout(function () {
                    //         that.allowbind = true
                    //       }, 1000)
                    //     }
                    //   })
                    // } else {
                    //   that.modelShow = true // 隐藏规格弹框
                    //   that.showInvite = true // 显示邀请人信息
                    // }
                  }
                }
              }
            }
          }
        }
      }
    },
    showEditInvite() {
      // 显示修改有邀请人页面
      console.log('显示修改')

      this.showInviteInfo = false
    },
    editInviteInfo() {
      // 修改邀请人接口
      if (this.allChange) {
        let info = {
          mobile: this.phoneNumber
        }
        let that = this
        editInvite(info).then(res => {
          if (res.isSuccess) {
            // that.sureInvite()
            getInviteInfo().then(res => {
              if (res.isSuccess === true || res.isSuccess === 'true') {
                that.inviteInfo = res.data
                that.showInviteInfo = true
              }
            })
          } else {
            Toast({
              message: res.msg,
              duration: 1000
            })
          }
        })
      }
    },
    sureInvite() {
      let that = this
      addCarofNormal(this.giftInfo).then(res => {
        if (res.isSuccess) {
          that.allowbind = true
          window.localStorage.setItem('neworder', true)
          this.$router.togo({
            path: '/sureOrder?addType=3&id=' + that.product_id + '&group_normal=' + that.gift_group
          })
        } else {
          Toast({
            message: res.msg,
            duration: 1000
          })
          setTimeout(function () {
            that.allowbind = true
          }, 1000)
        }
      })
    },
    share() {
      let System = window.plus
      // 正式 gh_a0cfbcaf8fa2 测试 gh_05718de312bd
      // if (img === false) {
      let img = '_www/img/mp.png'
      // }
      let storage = window.localStorage
      // eslint-disable-next-line camelcase
      let baseURL = ''
      if (process.env.NODE_ENV === 'development') {
        baseURL = '/api'
      } else {
        baseURL = process.env.BASE_URL
      }
      let url = baseURL + 'share/index.html?uid='
      let shareId = storage.getItem('token').split(';')[0].split('=')[1]
      // eslint-disable-next-line camelcase
      let shareUrl = url + shareId + '&time=' + new Date().getTime()
      let msg = {
        type: 'web',
        title: '您的好友诚邀你成为公主购VIP会员，开通会员可享更多优惠权益。',
        thumbs: [img],
        content: '公主购：一个专注省钱的会员制电商平台~',
        href: shareUrl,
        // miniProgram: {
        //   id: 'gh_a0cfbcaf8fa2',
        //   path: shareUrl,
        //   webUrl: 'http://uniapp.dcloud.io',
        //   type: 0
        // },
        extra: {
          scene: 'WXSceneSession'
        }
      }
      this.sharewx ? this.isAuth(msg) : System.nativeUI.alert('当前环境不支持微信分享操作!')
    },
    isAuth(msg) {
      console.log('判断是否授权')
      console.log(msg)
      if (this.sharewx.authenticated) {
        this.shareAction(msg)
      } else {
        this.sharewx.authorize(function () {
          this.shareAction(msg)
        }, function (e) {
          console.log(e)
          if (e.code == -8) {
            Toast({
              message: '检测到您未安装微信，请通过应用商店下载',
              duration: 1000
            })
          }
          console.log('认证授权失败')
        })
      }
    },
    shareAction(msg) {
      console.log('开始分享')
      console.log(msg)
      this.sharewx.send(msg, function () {
        console.log('分享成功！')
        // Toast({
        //   message: '分享成功',
        //   iconClass: 'iconfont icon-dui1',
        //   duration: 1000
        // })
      }, function (e) {
        console.log('失败失败啊' + e.message)
      })
    }
  }
}

</script>
<style lang="less" scoped>
  @import '~styles/index.less';
  @import '~styles/variable.less';

  .gift_buy {
    width: 100%;
    text-align: center;
    line-height: 110/100rem;
    height: 100/100rem;
  }

  .gift_buy img {
    /* background: #f20; */
    width: 672/100rem;
    height: 90/100rem;
    display: inline-block;
    margin-top: 8/100rem;
  }

  .spec_btn_gift {
    /* display: flex; */
    /* align-items: center; */
    position: absolute;
    width: 100%;
    bottom: 0;
    text-align: center;
  }

  .spec_btn_gift img {
    /* background: #f20; */
    width: 672/100rem;
    height: 90/100rem;
    display: inline-block;
    margin-top: 5/100rem;
  }

  .head_top {
    height: 98/100rem;
    background: transparent;
    z-index: 10;
  }

  .null_height {
    // height: 1.01rem;
  }

  .pro_detail {
    /* font-family: SimHei; */
    position: relative;
    background: #f0eff1;
    overflow-x: hidden;
    /* font-family: 'DIN'; */
  }

  .pro_header_left {
    margin-left: 0.1rem;
    height: 0.94rem;
    line-height: 0.94rem;
  }

  .pro_header {
    text-align: center;
    background: #fff;
    height: 94/100rem;
    line-height: 94/100rem;
    position: fixed;
    width: 100%;
    z-index: 100;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pro_header .pro_header_nav {
    position: relative;
    text-align: center;
    width: 100%;
  }

  .pro_header_nav span {
    font-size: 36/100rem;
    color: #393939;
    padding: 0 28/100rem;
    line-height: 94/100rem;
    display: inline-flex;
  }

  .pro_header_nav .text_active {
    border-bottom: 5/100rem solid #ff4e79;
    color: #ff4e79;
  }

  .pro_header .pro_header_icon {
    color: #707070;
    font-size: 38/100rem;
    /* margin-left: -26/100rem; */
    /* width: 116/100rem; */
    position: absolute;
    top: 0;
    right: 0;
    overflow: hidden;
    display: flex;
  }

  .pro_header_icon button {
    float: left;
    padding: 0;
  }

  .pro_header_icon i {
    padding: 0;
    padding-right: 26/100rem;
  }

  /* 商品详情 */

  scroll-view {
    /* margin-top: -98/100rem; */
  }

  .pro_body {}

  .pro_body .pro_info {
    /* background: #fff; */
    margin-bottom: 10/100rem;
    /* position: absolute; */
  }

  /* 商品轮播 */

  .pro_info .pro_swiper {
    width: 100%;
    height: 750/100rem;
  }

  .pro_swiper /deep/.swiper_bg {
    width: 100%;
    height: 100%;
    text-align: center;
  }

  .pro_swiper /deep/.swipe_item_bg {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pro_swiper .slide-image {
    width: 750/100rem;
    height: 750/100rem;
    /* height: 540/100rem; */
  }

  /* 拼团倒计时 */

  .pro_info .pro_down {
    /* position: absolute; */
    width: 92%;
    /* height: 100/100rem; */
    /*line-height: 70/100rem; */
    color: #ff4e79;
    font-size: 30/100rem;
    /* font-weight: bold; */
    /* bottom: 35%;
  text-align: center; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20/100rem 4%;
    background-color: #ffe53b;
    background-image: linear-gradient(267deg, #ab0023 0%, #e4002f 74%);
  }

  /*  促销，拼团价格 */

  .pro_down .pro_price {
    /* font-family: 'DIN'; */
    width: 380/100rem;
    /* display: flex;
  align-items: center; */
    color: #fff;
  }

  .pro_down .pro_price .iconfont {
    font-size: 30/100rem;
    font-weight: bold;
    display: inline-flex;
    color: #fff;
  }

  .pro_down .pro_price .group_num {
    font-size: 26/100rem;
    margin-right: 26/100rem;
  }

  .pro_down .pro_price .i_level {
    position: relative;
  }

  .pro_down .pro_price .i_level img {
    width: 38/100rem;
    height: 41/100rem;
  }

  .pro_down .pro_price .i_level span {
    color: #fff;
    position: absolute;
    left: 50%;
    top: 35%;
    transform: translate(-50%, -50%);
    font-size: 18/100rem;
    font-weight: bold;
    font-family: 'DIN';
  }

  .pro_down .pro_price .peo_nowprice {
    /* color: #ff4e79; */
    /* font-size: 60/100rem; */
    font-size: 34/100rem;
    /* font-weight: bold; */
    /* margin-right: 16/100rem; */
  }

  .pro_down .pro_price .pro_integral {
    font-size: 34/100rem;
    /* font-weight: bold; */
    color: #fff;
  }

  .pro_down .pro_price .pro_inter_img {
    display: inline-flex;
    align-items: center;
  }

  .pro_down .pro_price span {
    font-size: 24/100rem;
  }

  .pro_down .pro_price .pro_orig {
    font-size: 24/100rem;
    /* color: #b8b8b8; */
    text-decoration: line-through;
    margin-right: 14/100rem;
  }

  /* 倒计时 */

  .pro_down .pro_time {
    text-align: center;
  }

  .pro_down .pro_time .title {
    display: block;
    color: #fff;
    font-size: 24/100rem;
    margin-bottom: 10/100rem;
    text-align: right;
  }

  .pro_down .pro_time .time {
    color: #fff;
    /* background: #ff4e79; */
    /* padding: 4/100rem 6/100rem; */
    /* border-radius: 6/100rem; */
    background: #000;
    font-family: 'DIN';
    margin: 0 4/100rem;
    font-size: 24/100rem;
    width: 32/100rem;
    height: 32/100rem;
    display: inline-flex;
    align-content: center;
    justify-content: center;
  }

  .pro_down .pro_time .text {
    color: #fff;
    font-size: 26/100rem;
  }

  /* 团购已结束 */

  .pro_end_time {
    display: inline-flex;
    align-items: center;
    color: #fff;
    font-size: 30/100rem;
    /* font-weight: bold; */
  }

  /* 限时促销倒计时 */

  .pro_info .pro_down_sale {
    width: 100%;
    /* height: 120/100rem; */
    font-size: 30/100rem;
    /* font-weight: bold; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* background-color: #fa709a;
  background-image: linear-gradient(127deg, #fa709a 0%, #ff4e79 50%, #fff 100%); */
    /* background-image: linear-gradient(-225deg, #ffe29f 0%, #ffa99f 48%, #ff719a 100%); */
    /* background-image: linear-gradient(to right, #f77062 0%, #fe5196 100%); */
    background-image: linear-gradient(to left, #ab0023 0%, #e4002f 100%);
    overflow: hidden;
  }

  .pro_down_sale .pro_price {
    font-family: 'DIN';
    width: 380/100rem;
    /* display: flex;
  align-items: center; */
    color: #fff;
    padding: 14/100rem 0;
    padding-left: 36/100rem;
  }

  .pro_down_sale .pro_price .iconfont {
    font-size: 30/100rem;
    font-weight: bold;
    display: inline-flex;
    color: #ffe790;
  }

  .pro_down_sale .pro_price .group_num {
    font-size: 26/100rem;
    margin-right: 26/100rem;
  }

  .pro_down_sale .pro_price .i_level {
    position: relative;
  }

  .pro_down_sale .pro_price .i_level img {
    width: 38/100rem;
    height: 41/100rem;
  }

  .pro_down_sale .pro_price .i_level span {
    color: #fff;
    position: absolute;
    left: 50%;
    top: 35%;
    transform: translate(-50%, -50%);
    font-size: 18/100rem;
    font-weight: bold;
    font-family: 'DIN';
  }

  .pro_down_sale .pro_price .peo_nowprice {
    /* color: #ff4e79; */
    /* font-size: 60/100rem; */
    font-size: 30/100rem;
    margin-right: 6/100rem;
  }

  .pro_down_sale .pro_price .pro_integral {
    font-size: 30/100rem;
    /* color: #ff4e79; */
  }

  .pro_down_sale .pro_price .pro_inter_img {
    display: inline-flex;
    /* align-items: flex-end; */
  }

  .pro_down_sale .pro_price .pro_inter_img .iconfont {
    /* width: 24/100rem;
  height: 20/100rem; */
    color: #ffe790;
    font-size: 30/100rem;
    font-weight: bold;
  }

  .pro_down_sale .pro_price span {
    font-size: 24/100rem;
  }

  .pro_down_sale .pro_price .pro_orig {
    font-size: 24/100rem;
    text-decoration: line-through;
  }

  .pro_down_sale .pro_price .pro_num {
    font-size: 24/100rem;
    margin-left: 20/100rem;
    /* margin-right: 14/100rem; */
  }

  .pro_down_sale .pro_right {
    /* height: 120/100rem; */
    background: #f7f7f7;
    padding: 14/100rem 30/100rem;
  }

  .pro_down_sale .pro_right .pro_time {
    /* padding-top: 12/100rem; */
    text-align: center;
  }

  .pro_down_sale .pro_right .pro_time .title {
    display: block;
    /* color: #ff4e79; */
    color: #e2002e;
    font-size: 24/100rem;
    /* margin-bottom: 10/100rem; */
  }

  .pro_down_sale .pro_right .pro_time .time {
    color: #fff;
    /* background: #ff4e79; */
    background: #e2002e;
    min-width: 24/100rem;
    padding: 0 4/100rem;
    height: 32/100rem;
    display: inline-flex;
    align-content: center;
    justify-content: center;
    border-radius: 6/100rem;
    font-family: 'DIN';
    margin: 0 4/100rem;
    font-size: 24/100rem;
  }

  .pro_down_sale .pro_right .pro_time .text {
    /* color: #ff4e79; */
    color: #e2002e;
    font-size: 26/100rem;
  }

  .pro_down_sale .pro_prop {}

  .pro_down_sale .pro_prop .prop_bg {
    /* border: 2/100rem solid #ff4e79; */
    width: 96%;
    height: 10/100rem;
    border-radius: 10/100rem;
    margin-top: 6/100rem;
    /* background: #ffc4d5; */
    background: #efefef;
  }

  .pro_down_sale .pro_prop .prop_bg span {
    background: #ff4e79;
    width: 60%;
    height: 10/100rem;
    display: flex;
    border-radius: 10/100rem;
  }

  /* 商品价格和名称 */

  .pro_body .pro_title {
    /* padding: 10/100rem 0; */
    /* padding-bottom: 10/100rem; */
    /* padding-top: 40/100rem; */
    background: #fff;
    padding-bottom: 10/100rem;
    /* margin-bottom: 10/100rem; */
    /* background: #fff; */
    /* padding-bottom: 42/100rem; */
    /* border-bottom: 1px solid #eae8eb; */
  }

  .pro_body .pro_title .pro_price {
    overflow: hidden;
    /*增加销量然后右对齐，自成一行*/
    padding: 10/100rem 26/100rem;
    background: #fff;

  }

  .pro_body .pro_title .pro_price .pro_sale_num {
    font-size: 24/100rem;
    color: #b8b8b8;
    float: right
  }

  .pro_body .pro_title .pro_price .pro_sale_pt {
    float: left;
  }

  .pro_body .pro_title .pro_price_group {
    /* justify-content: space-between; */
    display: block;
    background: #fff;
    padding: 0 26/100rem;
    padding-bottom: 10/100rem;
  }

  .pro_title .pro_price_group .pro_nowprice {
    font-size: 34/100rem;
    color: #313131;
    margin-right: 0;
  }

  .pro_title .pro_price_group .pro_group_img {
    margin-top: -6/100rem;
  }

  .pro_title .pro_price_group .pro_group_img .iconfont {
    font-size: 30/100rem;
    display: inline-flex;
    align-items: center;
  }

  .pro_title .pro_price_group .pro_integral_group {
    font-size: 30/100rem;
    color: #313131;
  }

  .pro_title .pro_price_group .pro_orig_group {
    font-size: 24/100rem;
    color: #979797;
    text-decoration: line-through;
  }

  .pro_title .pro_price_group .group_num {
    font-size: 24/100rem;
    color: #ff4e79;
    margin-right: 0;
  }

  .pro_price_third {
    height: 24/100rem;
    line-height: 24/100rem;
    border: 2/100rem solid #ff4e79;
    font-size: 20/100rem;
    color: #ff4e79;
    border-radius: 5/100rem;
    display: inline-block;
    text-align: center;
    padding: 2/100rem 6/100rem;
  }

  .pro_price_gift {
    height: 24/100rem;
    line-height: 24/100rem;
    font-size: 22/100rem !important;
    color: #fff !important;
    background: #ff4e79;
    border: 2/100rem solid #ff4e79;
    border-radius: 5/100rem;
    display: inline-block;
    text-align: center;
    padding: 2/100rem 6/100rem !important;
    margin-left: 10/100rem;
  }

  .pro_price_left {
    /* display: flex; */
    /* align-items: center; */
    display: none;
  }

  .pro_title .pro_price .i_level {
    position: relative;
  }

  .pro_title .pro_price .i_level img {
    width: 38/100rem;
    height: 41/100rem;
  }

  .pro_title .pro_price .i_level span {
    color: #fff;
    position: absolute;
    left: 50%;
    top: 35%;
    transform: translate(-50%, -50%);
    font-size: 18/100rem;
    font-weight: bold;
    font-family: 'DIN';
  }

  .pro_title .pro_price .peo_nowprice {
    color: #ff4e79;
    font-size: 50/100rem;
    margin-right: 16/100rem;
  }

  .pro_title .pro_price .pro_integral {
    font-size: 30/100rem;
    font-weight: bold;
    color: #ff4e79;
  }

  .pro_title .pro_price .pro_inter_img {
    display: flex;
    align-items: flex-end;
  }

  .pro_title .pro_price .pro_inter_img .iconfont {
    display: inline-flex;
    align-items: center;
    /* color: #ffe790; */
    font-size: 40/100rem;
  }

  .pro_title .pro_price span {
    /* font-size: 24/100rem;
  color: #121212;
  margin-right: 14/100rem; */
    font-size: 22/100rem;
    color: #ff4e79;
    // margin-right: 14/100rem;
    padding: 2/100rem 4/100rem;
  }

  .pro_title .pro_price .pro_orig {
    font-size: 24/100rem;
    color: #b8b8b8;
    text-decoration: line-through;
  }

  .pro_title .pro_price .pro_sale_num {
    font-size: 24/100rem;
    color: #b8b8b8;
  }

  .pro_title .pro_name {
    font-size: 34/100rem;
    color: #444;
  }

  .pro_title .pro_name {
    font-size: 38/100rem;
    background: #fff;
    padding: 0 26/100rem;
    padding-bottom: 10/100rem;
    /* margin-bottom: 10/100rem; */
    /* color: #444; */
    /* display: flex;
  align-items: center; */
    /* margin-bottom: 42/100rem; */
  }

  .pro_title .group_top {
    padding-top: 40/100rem;
  }

  .pro_title .pro_name_icon {
    position: relative;
    float: left;
    margin-right: 10/100rem;
  }

  .pro_title .pro_name_icon span {
    position: absolute;
    font-size: 12/100rem;
    color: #fff;
    left: 50%;
    transform: translateX(-50%);
    width: 64/100rem;
    top: 27%;
    text-align: center;
  }

  .pro_name .iconfont {
    color: #e2002e;
    font-size: 66/100rem;
    margin-right: 5px;
  }

  .pro_title .pro_tips {
    font-size: 28/100rem;
    color: #707070;
    padding: 0 26/100rem;
    background: #fff;
  }

  .pro_title .pro_pay_type {
    padding: 16/100rem 26/100rem;
    background: #fff;
  }

  .pro_pay_type .pay_spec button {
    display: inline-block;
    margin-right: 20/100rem;
    color: #555;
    font-size: 24/100rem;
    background: #fff;
    border: 2/100rem solid #777;
    line-height: 0.52rem;
    height: 0.52rem;
    border-radius: 20/100rem;
  }

  .pro_pay_type .pay_spec button .iconfont {
    display: inline-flex;
    font-size: 24/100rem;
  }

  .pro_pay_type .pay_spec button::after {
    border: none;
    box-shadow: none;
  }

  .pro_pay_type .pay_spec .button_click {
    color: #ff4e79;
    border: 2/100rem solid #ff4e79;
  }

  .pro_title .pro_market {
    font-size: 28/100rem;
    color: #707070;
    padding: 0 26/100rem;
    background: #fff;
    padding-bottom: 10/100rem;
  }

  .pro_info .pro_sup_tag {
    color: #666;
    font-size: 26/100rem;
    /* margin-top: -10/100rem; */
    padding: 10/100rem 26/100rem;
    background: #fff;
    border-top: 1px solid #e0e0e0;
  }

  .pro_info .pro_sup_tag span {
    padding-bottom: 10/100rem;
  }

  .pro_info .pro_title_tips {
    /* margin-top: -10/100rem; */
    color: #666;
    font-size: 26/100rem;
    padding: 26/100rem;
    border-top: 1px solid #e0e0e0;
    background: #fff;
    margin-bottom: 10/100rem;
  }

  /* 商品选择规格 */

  .pro_info .pro_spec {
    height: 80/100rem;
    line-height: 80/100rem;
    padding: 0 26/100rem;
    font-size: 26/100rem;
    color: #adadad;
    /* border-top: 1px solid #eae8eb; */
    display: flex;
    justify-content: space-between;
    background: #fff;
    align-items: center;
  }

  /* .pro_info .pro_top {
  margin-top: 42/100rem;
} */

  .pro_spec span {
    color: #444;
    margin-left: 10/100rem;
    /* margin-right: -20/100rem; */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 80/100rem;
  }

  .pro_spec .spec_icon {
    float: right;
    font-size: 30/100rem;
    font-weight: bold;
    /* width: 100/100rem; */
  }

  .spec_icon i:nth-child(1) {
    color: #dcdcdc;
  }

  .spec_icon i:nth-child(2) {
    color: #bfbfbf;
  }

  .spec_icon i:nth-child(3) {
    color: #a8a8a8;
  }

  /* 团购列表 */

  .pro_body .pro_group {
    padding: 0 26/100rem;
    background: #fff;
    margin-bottom: 10/100rem;
  }

  .pro_body .pro_group_title {
    padding: 30/100rem 26/100rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    border-bottom: 1px solid #e0e0e0;
  }

  .pro_body .pro_group_title span {
    font-size: 30/100rem;
    color: #333;
  }

  .pro_body .pro_group_title div {
    display: inline-flex;
    align-items: center;
  }

  .pro_body .pro_group_title div span {
    font-size: 24/100rem;
    color: #989898;
  }

  .pro_body .pro_group_title div .iconfont {
    color: #989898;
    display: inline-flex;
    align-items: center;
  }

  .pro_group .group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* padding: 10/100rem 0; */
  }

  .group div {
    font-size: 24/100rem;
    color: #313131;
  }

  .group view .group_num {
    font-size: 24/100rem;
    color: #ff4e79;
  }

  .group view .time {
    width: 28/100rem;
    display: inline-flex;
  }

  .group .group_user {
    display: inline-flex;
    align-items: center;
    width: 340/100rem;
  }

  .group .group_user span {
    color: #313131;
    font-size: 28/100rem;
  }

  view .group_img {
    width: 80/100rem;
    height: 80/100rem;
    border-radius: 50%;
    margin-right: 14/100rem;
  }

  .group button {
    background: #ff4e79;
    color: #fff;
    font-size: 24/100rem;
    border-radius: 20/100rem;
    margin: 0;
  }

  .group button::after {
    border: none;
  }

  /* 团购规则 */

  .pro_body .pro_group_tips {
    background: #fff;
  }

  .pro_group_tips .group_head {
    padding: 0 26/100rem;
    height: 80/100rem;
    line-height: 80/100rem;
    border-bottom: 1px solid #eae8eb;
  }

  .group_head span {
    font-size: 26/100rem;
    color: #adadad;
  }

  .pro_group_tips .group_text {
    margin-bottom: 10/100rem;
  }

  .group_text span {
    font-size: 26/100rem;
    padding: 26/100rem;
    display: block;
    word-wrap: break-word;
    color: #333;
  }

  /* 商品评价 */

  .pro_body .pro_com {
    background: #fff;
  }

  /* 评价标题 */

  .pro_com .com_head {
    padding: 0 26/100rem;
    height: 80/100rem;
    line-height: 80/100rem;
    border-bottom: 1px solid #eae8eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .com_head span {
    font-size: 26/100rem;
    color: #adadad;
  }

  .com_head .head_right {
    float: right;
    font-size: 24/100rem;
    color: #525252;
  }

  .head_right sapn {
    color: #ff4e79;
    font-family: 'DIN';
  }

  .head_right i {
    color: #979797;
    margin-left: 16/100rem;
  }

  /* 评价内容列表 */

  .pro_com .com_list {
    margin-bottom: 10/100rem;
  }

  .com_list .com_tips {
    font-size: 26/100rem;
    padding: 26/100rem;
  }

  .com_list .com_info {
    padding: 0 26/100rem;
    border-bottom: 1px solid #eae8eb;
  }

  .com_info .com_info_head {
    margin-top: 30/100rem;
    margin-bottom: 20/100rem;
    display: flex;
    justify-content: space-between;
    align-content: center;
    height: 52/100rem;
    line-height: 52/100rem;
  }
.com_info_head .user_info{
    display: flex;
    align-items: center;
}
  .com_info_head .user_info img {
    width: 42/100rem;
    height: 42/100rem;
    border-radius: 50%;
    vertical-align: middle;
  }

  .com_info_head .user_info span {
    font-size: 20/100rem;
    color: #777;
    margin-left: 12/100rem;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    width: 4rem;
  }

  .com_info_head .star_level i {
    color: #ff4e79;
  }

  .com_info_head .star_level .light {
    color: #ff4e79;
  }

  .com_content span {
    font-size: 24/100rem;
    color: #555;
    word-wrap: break-word;
  }

  .com_img {
    margin-top: 38/100rem;
    margin-bottom: 43/100rem;
  }

  .com_img img {
    width: 176/100rem;
    height: 176/100rem;
    margin-right: 12/100rem;
  }

  .com_btn {
    text-align: center;
    padding: 30/100rem 26/100rem;
  }

  .com_btn button {
    color: #868686;
    font-size: 0.26rem;
    border: 1px solid #cbcbcb;
    background: #fff;
    width: 100%;
    height: 0.7rem;
  }

  .com_btn button::after {
    border: none;
  }

  /* 商品详情 */

  .pro_body .pro_show {
    background: #fff;
    min-height: 11rem;
    // margin-bottom: 1.05rem;
    /* padding: 20/100rem 0; */
    /* padding-top: 20/100rem; */
  }

  .pro_show .show_head {
    text-align: center;
    color: #949494;
    font-size: 28/100rem;
  }

  .show_head .header_nav {
    padding: 42/100rem 0;
    text-align: center
  }

  .show_head .header_nav span {
    color: #949494;
    font-size: 26/100rem;
    padding: 0 44/100rem;
  }

  .show_head .header_nav .nav_text_active {
    color: #ff4e79;
  }

  .pro_show .pro_img {
    text-align: center;
    /* padding: 0 20/100rem; */
  }

  .pro_img img {}

  /* 详情 */

  .pro_info_detail {
    background: #fff;
    height: 100vh;
    text-align: center;
  }

  /* 推荐商品 */

  .pro_recomm {
    // margin-bottom:1.01rem
  }

  .i_pro_content_null {
    font-size: 25/100rem;
    color: #555;
    text-align: center;
    background: #f2f2f2;
    padding: 30px 0;
  }

  .pro_recomm .i_title {
    font-size: 25/100rem;
    color: #bebebe;
    text-align: center;
    display: block;
    height: 99/100rem;
    line-height: 99/100rem;
    background: #f2f2f2;
  }

  .recom_list {
    background: #f2f2f2;
    overflow: hidden;
  }

  .recom_list .i_pro {
    width: 370/100rem;
    height: 560/100rem;
    float: left;
    background: #fff;
    /* padding: 0 26/100rem; */
    /* margin-right: 7/100rem; */
    margin-bottom: 13/100rem;
    position: relative;
    padding-bottom: 10/100rem;

  }

  .recom_list .i_pro:nth-child(even) {
    float: right;
  }

  .recom_list .i_pro .pro_img {
    /* margin-top: 40/100rem;
  margin-left: 18/100rem;
  margin-right: 30/100rem; */
    position: relative;
  }

  .recom_list .pro_img img {
    width: 370/100rem;
    height: 370/100rem;
  }

  .recom_list .i_pro .pro_title {
    font-size: 24/100rem;
    color: #333;
    /* margin: 10/100rem 0; */
    margin-top: 10/100rem;
    padding: 0 16/100rem;
    /* width: 320/100rem;
  font-size: 24/100rem;
  color: #333;
  margin-top: 20/100rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  height: 70/100rem;
  padding: 0 26/100rem; */
  }

  .recom_list .i_pro .pro_title img {
    width: 68/100rem;
    height: 24/100rem;
  }

  .recom_list .i_pro .pro_line_two {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    height: 70/100rem;
  }

  .recom_list .pro_title .pro_level {
    width: 68/100rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 24/100rem;
  }

  .recom_list .pro_title .pro_level span {
    font-size: 16/100rem;
    color: #fefefe;
    position: absolute;
    left: 46%;
    top: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap;
  }

  .recom_list .pro_level .iconfont {
    color: #ff4e79;
    display: inline-flex;
  }

  .pro_level span {
    font-size: 20/100rem;
  }

  .recom_list .i_pro .pro_price {
    margin-top: 10/100rem;
    font-family: 'DIN';
    /* width: 280/100rem; */
    /* display: flex;
  justify-content: space-between;
  align-items: center; */
    padding: 0 16/100rem;
  }

  .recom_list .pro_price .pro_bg {
    background: #ff4e79;
    color: #fff;
    border-radius: 8/100rem;
    text-align: center;
    font-size: 20/100rem;
    margin-right: 10/100rem;
    /* width: 100/100rem; */
    padding: 0 8/100rem;
  }

  .recom_list .pro_price .line {
    text-decoration: line-through;
    /* margin-left: 14/100rem; */
  }

  .recom_list .pro_price .pro_count {
    font-size: 23/100rem;
    color: #888;
  }

  .recom_list .pro_price .pro_flex {
    /* display: inline-flex;
  align-items: center; */
  }

  .recom_list .pro_price .pro_flex .iconfont {
    color: #ff4e79;
    font-size: 30/100rem;
    font-weight: bold;
    display: inline-flex;
  }

  .recom_list .pro_price .i_level {
    position: relative;
  }

  .recom_list .pro_price .i_level img {
    width: 38/100rem;
    height: 41/100rem;
  }

  .recom_list .pro_price .i_level span {
    color: #fff;
    position: absolute;
    left: 50%;
    top: 35%;
    transform: translate(-50%, -50%);
    font-size: 18/100rem;
    font-weight: bold;
    font-family: 'DIN';
  }

  .recom_list .pro_price .peo_nowprice {
    color: #ff4e79;
    font-size: 30/100rem;
    font-weight: bold;
  }

  .recom_list .pro_price .pro_integral {
    font-size: 30/100rem;
    font-weight: bold;
    color: #ff4e79;
  }

  .recom_list .pro_price .pro_inter_img {
    display: inline-flex;
    align-items: flex-end;
    /* margin-left: 10/100rem; */
  }

  .recom_list .pro_price .pro_inter_img .iconfont {
    font-size: 30/100rem;
    font-weight: bold;
    color: #ff4e79;
    display: inline-flex;
  }

  /* .recom_list .pro_price .pro_inter_img image {
  width: 24/100rem;
  height: 20/100rem;
} */

  .recom_list .pro_price .pro_orig {
    font-size: 22/100rem;
    color: #7c7c7c;
    text-decoration: line-through;
  }

  /* 商品评价详细 */

  .pro_com_detail {
    /* height: 80/100rem; */
    background: #f2f2f2;
  }

  .pro_com_detail .com_detail_head {
    padding: 0 26/100rem;
    height: 80/100rem;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 22/100rem;
  }

  .com_detail_head .com_head_left span {
    font-size: 24/100rem;
    color: #414141;
  }

  .com_detail_head .com_head_right {
    font-size: 24/100rem;
    color: #414141;
  }

  .com_detail_head .com_head_right span {
    color: #ff4e79;
  }

  .pro_com_detail .com_detail_list {
    background: #fff;
    height: calc(100vh - 3.06rem);
    overflow-y: scroll;
  }

  .com_detail_list .com_detail_info {
    padding: 40/100rem 26/100rem;
    border-bottom: 2/100rem solid #ebebeb;
  }

  .com_detail_info .com_detail_userinfo {
    /* padding-top: 55/100rem; */
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }

  .com_detail_userinfo img {
    width: 64/100rem;
    height: 64/100rem;
    border-radius: 50%;
  }

  .com_detail_userinfo .com_detail_name {
    margin-left: 10/100rem;
  }

  .com_detail_name span {
      font-size: 26/100rem;
      color: #686868;
      font-family: "DIN";
      line-height: 1.4;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      width: 5.6rem;;
  }

  .com_detail_name .com_detail_star {
    display: flex;
    align-items: center;
  }

  .com_detail_name .com_detail_star i {
    color: #ff4e79;
    font-size: 22/100rem;
    display: inline-flex;
  }

  .com_detail_name .com_detail_star .light {
    color: #ff4e79;
  }

  .com_detail_info .com_detail_com {
    padding-left: 80/100rem;
    padding-top: 30/100rem;
  }

  .com_detail_com {
    font-size: 28/100rem;
    color: #505050;
  }

  .com_detail_info .com_detail_imglist {
    padding-left: 80/100rem;
    padding-top: 30/100rem;
  }

  .com_detail_imglist img {
    width: 200/100rem;
    height: 200/100rem;
    margin-right: 6/100rem;
  }

  .com_detail_info .com_detail_pro {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
  }

  .com_detail_pro .com_detail_pro_info {
    padding-left: 80/100rem;
  }

  .com_detail_pro_info span {
    font-size: 22/100rem;
    color: #a4a4a4;
    font-family: 'DIN';
    display: block;
  }

  .com_detail_info .com_detaul_oper {
    font-size: 28/100rem;
    color: #373737;
    font-family: 'DIN';
    display: flex;
    /* justify-content: space-between; */
    align-items: center;
  }

  .com_detaul_oper img {
    margin-left: 36/100rem;
    margin-right: 12/100rem;
    width: 38/100rem;
    height: 30/100rem;
  }

  .com_replay {
    border: 1/100rem solid #e0e0e0;
    /* margin: 0 80/100rem; */
    /* padding: 10px; */
    font-size: 24/100rem;
    color: #666;
    margin-left: 40px;
    padding: 10/100rem;
  }

  /* 底部固定栏 */

  .null_view {
    height: 128/100rem;
    background: #f2f2f2;
  }

  .pro_btn {
    box-shadow: 0 8/100rem 20/100rem 10/100rem #dadada;
    position: fixed;
    bottom: 0;
    height: 128/100rem;
    /* line-height: 100/100rem; */
    display: flex;
    justify-content: space-between;
    // /* align-items: center; */
    width: 100%;
    background: #fff;
    z-index: 2;
    align-items: center;
  }

  .iphone_height {
    height: 168/100rem;
    background: #fff;
  }

  .pro_btn .btn_blcok {
    width: 34%;
    display: flex;
    background: #fff;
    justify-content: center;
    border-radius: 44/100rem;
    margin-right: 30/100rem;
  }

  .pro_btn .pro_one {
    width: 150/100rem !important;
  }

  .pro_btn /deep/ .show_car {
    height: 100/100rem;
    padding: 0;
    width: 120/100rem;
    border: 0;
    box-shadow: none;
    margin-left: 30/100rem;
  }

  .width {
    width: 560/100rem !important;
  }

  .btn_blcok button {
    width: 50%;
    background: #fff;
  }

  .btn_blcok .contact i {
    color: #666;
    font-size: 48/100rem;
    /* 客服图标按钮较小，加大到效果和购物车一致 */
  }

  .pro_btn button::after {
    border: none;
  }

  .pro_btn button {
    color: #fff;
    height: 88/100rem;
    line-height: 88/100rem;
    border-radius: 0;
    font-size: 34/100rem;
  }

  .pro_btn .pro_buy {
    /* width: 300/100rem; */
    background-image: linear-gradient(to left, #FF2B90 0%, #FF4E79 100%);
  }

  .pro_btn .pro_buy_dis {
    /* width: 300/100rem; */
    background: #d3d3d3;
    margin: 0 auto;
  }

  .pro_btn .add_car {
    /* width: 300/100rem; */
    background: #ff8a00;
  }

  .pro_btn .add_car_group {
    /* width: 300/100rem; */
    background: #000;
  }

  .btn_blcok .contact_group {
    width: auto;
  }

  .btn_blcok .contact_group i {
    color: #666;
    font-size: 48/100rem;
  }

  .show_car i {
    color: #333;
    font-size: 48/100rem;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: -4%
  }

  .btn_blcok .btn_text {
    font-size: 24/100rem;
    color: rgba(0, 0, 0, .5);
    position: absolute;
    bottom: -12/100rem;
    left: 50%;
    transform: translateX(-50%);
    width: 100/100rem;
    top: 39%;
    text-align: center
  }

  .show_car .carNum {
    position: absolute;
    top: 0;
    left: 8%;
    width: 36/100rem;
    height: 36/100rem;
    background: #f43530;
    border-radius: 50%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .show_car .carNum text {
    color: #fff;
    font-size: 24/100rem;
  }

  .show_car span {
    position: absolute;
    color: #fff;
    // top: -24/100rem;
    // right: 47/100rem;
    font-size: 18/100rem;
    font-family: 'DIN';
  }

  /* checkbox样式 */

  checkbox .wx-checkbox-input {
    border-radius: 50%;
    width: 34/100rem;
    height: 34/100rem;
    /* border: 1px solid #d8d8d8;
  background: #484848; */
  }

  checkbox .wx-checkbox-input.wx-checkbox-input-checked {
    border: 1px solid transparent;
    background: #ff4e79;
  }

  checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
    border-radius: 50%;
    width: 34/100rem;
    height: 34/100rem;
    line-height: 34/100rem;
    text-align: center;
    font-size: 30/100rem;
    color: #fff;
    background: transparent;
    transform: translate(-50%, -50%) scale(1);
    -webkit-transform: translate(-50%, -50%) scale(1);
  }

  .pro_spec_model {
    position: fixed;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 201;
  }

  .pro_spec_detail {
    width: 100%;
    background: #fff;
    position: fixed;
    bottom: 0;
    z-index: 202;
    min-height: 80vh;
  }

  .spec_head {
    height: 162/100rem;
    padding: 0 26/100rem;
  }

  .spec_pro_img {
    position: absolute;
    width: 170/100rem;
    height: 170/100rem;
    text-align: center;
    line-height: 170/100rem;
    top: -35/100rem;
    border: 2/100rem solid #e0e0e0;
    border-radius: 10/100rem;
    background: #fff;
  }

  .spec_pro_img img {
    width: 140/100rem;
    /* height: 140/100rem; */
    vertical-align: middle;
  }

  .pro_spec_detail .spec_pro_price {
    font-family: 'DIN';
    /* width: 280/100rem; */
    display: flex;
    align-items: center;
    margin-left: 180/100rem;
    margin-top: 24/100rem;
  }

  .spec_pro_price .spec_pro_nowprice {
    color: #ff4e79;
    /* font-size: 60/100rem; */
    font-size: 30/100rem;
    font-weight: bold;
    /* margin-right: 16/100rem; */
  }

  .spec_pro_price .spec_pro_nowprice .spec_pro_nowprice_f {
    font-size: 24/100rem;
    color: #ff4e79;
    font-weight: normal;
  }

  .spec_pro_price .spec_pro_integral {
    font-size: 30/100rem;
    color: #ff4e79;
    font-weight: bold;
    /* margin-left: 8/100rem; */
  }

  .spec_pro_price .spec_pro_inter_img {
    display: flex;
    align-items: flex-end;
    margin-left: 9/100rem;
    /* margin-right: 30/100rem; */
  }

  .spec_pro_price .spec_pro_inter_img .iconfont {
    font-size: 30/100rem;
    display: inline-flex;
    color: #ff4e79;
    font-weight: bold;
  }

  /* .spec_pro_price .spec_pro_inter_img image {
  width: 36/100rem;
  height: 30/100rem;
} */

  .spec_pro_price span {
    font-size: 24/100rem;
    color: #b8b8b8;
    /* margin-left: 14/100rem; */
  }

  .spec_pro_code {
    font-size: 26/100rem;
    color: #9d9d9d;
    margin-left: 186/100rem;
    margin-top: 10/100rem;
    display: flex;
    justify-content: space-between;
  }

  .spec_pro_code .spec_pro_orig {
    font-size: 24/100rem;
    color: #b8b8b8;
    text-decoration: line-through;
  }

  .spec_head .spec_close {
    position: absolute;
    right: 26/100rem;
    top: 6/100rem;
  }

  .spec_body {
    padding: 0 26/100rem;
    overflow-y: scroll;
    width: 700/100rem;
    height: calc(80vh - 160px);
  }

  .spec_title {
    color: #9d9d9d;
    font-size: 24/100rem;
    margin-bottom: 20/100rem;
  }

  .spec_body .spec_type {
    margin-bottom: 30/100rem;
  }

  .spec_type button {
    margin-right: 20/100rem;
    margin-bottom: 10/100rem;
    color: #555;
    font-size: 24/100rem;
    background: #fff;
    border: 2/100rem solid #777;
    // line-height: 2.0;
    min-width: 116/100rem;
  }

  .spec_type button .iconfont {
    display: inline-flex;
    font-size: 24/100rem;
  }

  .spec_type button::after {
    border: none;
  }

  .spec_type .button_click {
    color: #ff4e79;
    border: 2/100rem solid #ff4e79;
  }

  .spec_capacity {
    margin-bottom: 30/100rem;
  }

  .spec_capacity button {
    margin-right: 20/100rem;
    color: #555;
    font-size: 24/100rem;
    background: #fff;
    border: 2/100rem solid #777;
  }

  .spec_capacity button::after {
    border: none;
  }

  .spec_capacity .button_click {
    color: #ff4e79;
    border: 2/100rem solid #ff4e79;
  }

  .spec_num {
    /* position: relative; */
    margin-bottom: 62/100rem;
    line-height: 50/100rem;
  }

  .spec_num span {
    color: #9d9d9d;
    font-size: 24/100rem;
    margin-bottom: 20/100rem;
  }

  .spec_num .pro_icon {
    /* border: 1px solid #ccc; */
    border-radius: 6/100rem;
    float: right;
    width: 140/100rem;
    font-size: 30/100rem;
    /* font-weight: bold; */
    color: #565656;
    text-align: center;
    margin-right: 15/100rem;
    padding-top: 8/100rem
  }

  /*
.pro_icon button {
  width: 44/100rem;
  height: 44/100rem;
  line-height: 42/100rem;
  padding: 0 22/100rem;
  margin: 0;
  color: #9f9f9f;
  font-size: 38/100rem;
  display: flex;
  justify-content: center;
  border-radius: 0;
  background: #f3f3f3;
}

.pro_icon  button::after {
  border: none;
}

.pro_icon input {
  width: 70/100rem;
  height: 44/100rem;
  min-height: 44/100rem;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  padding: 0;
  font-size: 30/100rem;
  color: #565656;
  text-align: center;
  display: flex;
  align-items: center;
  font-family: 'DIN';
} */

  .spec_btn {
    display: flex;
    align-items: center;
    position: absolute;
    width: 80%;
    bottom: 0.6rem;
    height: 88/100rem;
    border-radius: 44/100rem;
    // bottom:20/100rem;
    transform: translate(-50%);
    left: 50%;
  }

  .spec_btn_height {
    bottom: 68/100rem;
  }

  .spec_btn .pro_buy {
    width: 50%;
    background: #ff4e79;
    color: #fff;
    font-size: 34/100rem;
    border-radius: 0;
    height: 100/100rem;
    line-height: 100/100rem;
  }

  .spec_btn .add_car {
    width: 50%;
    background: #ff8a00;
    color: #fff;
    height: 100/100rem;
    font-size: 34/100rem;
    border-radius: 0;
    line-height: 100/100rem;
  }

  .spec_btn .surebtn {
    width: 100%;
    background-image: linear-gradient(to left, #FF2B90 0%, #FF4E79 100%);
    color: #fff;
    font-size: 34/100rem;
    border-radius: 44/100rem;
    height: 88/100rem;
  }

  .spec_btn .surebtn_false {
    width: 100%;
    background: #d3d3d3;
    color: #fff;
    font-size: 34/100rem;
    border-radius: 0.44rem;
  }

  .spec_btn button::after {
    border: none;
  }

  .group_model_bg {
    position: fixed;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 201;
  }

  .group_model {
    width: 690/100rem;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 202;
    max-height: 880/100rem;
  }

  .group_model .group_model_icon {
    /* float: right; */
    position: absolute;
    top: 0;
    right: 0;
    height: 62/100rem;
  }

  .group_model .group_model_body {
    background: #fff;
    width: 600/100rem;
    max-height: 820/100rem;
    border-radius: 20/100rem;
    margin: 31/100rem 60/100rem;
  }

  .group_model_body .group_model_title {
    text-align: center;
    font-size: 32/100rem;
    color: #040404;
    padding: 30/100rem 0;
    border-bottom: 1px solid #e0e0e0;
  }

  .group_model_body .group_model_list {
    padding: 0 20/100rem;
    width: 560/100rem;
  }

  .group_model_list .group_block {
    height: 154/100rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e0e0e0;
  }

  .group_block .group_block_left {
    display: inline-flex;
    align-items: center;
  }

  .group_block_left .group_img {
    width: 98/100rem;
    height: 98/100rem;
    border-radius: 50%;
    margin-right: 14/100rem;
  }

  .group_block_left .group_name {
    display: inline-block;
    font-size: 28/100rem;
    color: #333;
    margin-right: 14/100rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 180/100rem;
  }

  .group_block_left .group_num {
    font-size: 20/100rem;
    color: #666;
  }

  .group_block_left .group_right_time {
    font-size: 22/100rem;
    color: #666;
  }

  .group_block .group_block_right button {
    background: #ff4e79;
    color: #fff;
    font-size: 24/100rem;
    border-radius: 20/100rem;
    margin: 0;
  }

  // .goTop {
  //   position: fixed;
  //   width: 80/100rem;
  //   height: 80/100rem;
  //   background: rgba(0, 0, 0, 0.5);
  //   right: 16/100rem;
  //   bottom: 30%;
  //   border-radius: 50%;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  //   z-index: 200;
  // }
  /*底部栏修改为自购省*/
  .pro_btn .btn_save {
    color: #fff;
    height: 88/100rem;
    line-height: 88/100rem;
    font-size: 34/100rem;
  }

  .new_wraper {
    width: 100%;
    background-image: linear-gradient(to left, #FF2B90 0%, #FF4E79 100%);
    border-radius: 44/100rem;
  }

  .z_buy {
    color: #fff;
    width: 100%;
    text-align: center;
    font-size: 30/100rem;
    height: 52/100rem;
    line-height: 52/100rem;
  }

  .z_save {
    color: #fff;
    font-size: 24/100rem;
    width: 100%;
    height: 30/100rem;
    line-height: 40/100rem;
    text-align: center;
    margin-top: -10/100rem;
  }

  .pro_com_img_bg {
    position: fixed;
    background: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 202;
  }

  .pro_com_img {
    width: 100%;
    height: 100%;
    position: fixed;
    bottom: 0;
    z-index: 203;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 80%;
      vertical-align: middle;
    }
  }

  .pro_header_lef .icon-jiantouarrowhead7 {
    display: inline-block;
    font-size: 0.42rem;
  }

  .head_between {
    width: 10%;
  }

  .pro_invite_bg {
    position: fixed;
    background: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 202;
  }

  .pro_invite {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 203;

    .invite_info {
      width: 6.4rem;
      height: 4.9rem;
      position: relative;

      .bg {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: -1;
      }

      .show_info {
        .invite_title {
          font-size: 0.4rem;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.85);
          text-align: center;
          padding-top: 0.6rem;
        }

        .invite_user {
          height: 1.12rem;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 0.44rem;

          .user_img {
            width: 1.12rem;
            height: 1.12rem;
            border: 1px solid rgba(223, 174, 115, 1);
            border-radius: 50%;
            margin-right: 0.2rem;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }

          .user_info {
            p {
              font-size: 0.28rem;
              font-weight: 500;
              color: rgba(0, 0, 0, 0.85);
            }

            .line_one_overflow {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              max-width: 1.8rem;
            }

            .phone {
              font-size: 0.24rem;
              font-weight: 400;
              color: rgba(0, 0, 0, 0.5);
              margin-top: 0.16rem;
            }
          }
        }

        .invite_phone {
          height: 140/100rem;
          box-sizing: border-box;
          padding-top: 70/100rem;
          padding-left: 98/100rem;
          position: relative;

          input {
            // width: 100%;
            height: 70/100rem;
            background: none;
            outline: none;
            border: 0px;
            font-size: 0.28rem;
            font-weight: 300;
            color: rgba(0, 0, 0, 0.5);
          }

          .black_text {
            color: rgba(0, 0, 0, 0.85);
          }

          .firstIcon {
            position: absolute;
            left: 0.5rem;
            bottom: 14/100rem;
            width: 48/100rem;
            height: 48/100rem;
          }

          .close {
            position: absolute;
            right: 0.63rem;
            width: 32/100rem;
            bottom: 14/100rem;

            .clear {
              width: 32/100rem;
              height: 32/100rem;
            }
          }
        }

        .input_line {
          width: 5.6rem;
          height: 0.02rem;
          background: #DFAE73;
          margin: 0 auto;
        }
      }

      .invite_btn {
        margin: 0 0.6rem;
        margin-top: 0.88rem;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: space-between;

        button {
          background: transparent;
          outline: none;
          box-shadow: none;
        }

        .btn_width {
          width: 2.28rem;
          height: 0.7rem;
          border-radius: 0.44rem;
        }

        .change {
          border: 0.02rem solid rgba(219, 159, 86, 1);
          font-size: 0.32rem;
          font-weight: 400;
          color: rgba(223, 174, 115, 1);
        }

        .sure {
          background: linear-gradient(90deg, rgba(250, 224, 193, 1) 0%, rgba(232, 193, 146, 1) 100%);
          font-size: 0.32rem;
          font-weight: 400;
          color: rgba(79, 43, 0, 1);
        }

        .sure_change {
          width: 5.2rem;
          height: 0.7rem;
          background: rgba(232, 232, 239, 1);
          border-radius: 0.44rem;
          font-size: 0.32rem;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.4);
        }

        .all_click {
          background: linear-gradient(90deg, rgba(250, 224, 193, 1) 0%, rgba(232, 193, 146, 1) 100%);
        }
      }
    }

    .invite_close {
      margin-top: 1.2rem;
      text-align: center;

      img {
        width: 0.64rem;
        height: 0.64rem;
      }
    }
  }

</style>
