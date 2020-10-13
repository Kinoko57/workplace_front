<template>
  <div>
    <!-- <common-header :h_title="h_title" :showmore="true"></common-header> -->
    <!-- 返回顶部按钮 -->
    <return-top @returnTop='goTop'></return-top>
    <div id='top'></div>
    <div class='pro_information' v-if="sharePro==1">
      <div class="pro_information_block">
        <div class="pro_information_blockInfo">
          <img :src="shareInfo.image" class='image' />
          <text>来自{{shareInfo.nickname}}的分享</text>
        </div>
      </div>
    </div>
    <div :class="(!modelShow)||(!servershow)?'pro_detail pro_detail_fixed':'pro_detail'" v-if='isShow' id='detail'>
      <div class='goIndex' @click="goIndex('/index')">
        <i class='iconfont icon-home'></i>
      </div>
      <div class='pro_header'>
        <div class='pro_header_left head_between'>
          <i @click="tohome" class="iconfont icon-jiantouarrowhead7"></i>
        </div>
        <div class='pro_header_nav'>
          <span :class="choseName=='pro'?'text_active':''" @click="chose('pro')">商品</span>
          <span :class="choseName=='com'?'text_active':''" @click="chose('com')">评价</span>
          <span :class="choseName=='more'?'text_active':''" @click="chose('more')">详情</span>
          <span :class="choseName=='recommend'?'text_active':''" @click="chose('recommend')"
            v-if="recomList.length>0">推荐</span>
        </div>
        <div class='pro_header_icon head_between'>
          <!-- <mt-button v-if="(isColl==''&&proType!='birthday')?true:false" @click='addColl(proInfo.goods_id)'>
            <i class='iconfont icon-shoucang'></i>
          </mt-button>
          <mt-button v-if="(isColl!=''&&proType!='birthday')?true:false" @click='addColl(isColl)' style="color:#ff4e79">
            <i class='iconfont icon-yishoucang' style="color:#ff4e79"></i>
          </mt-button>
          <mt-button @click="zipImg">
            <i class='iconfont icon-iconfontfenxiang3'></i>
          </mt-button> -->
        </div>
      </div>
      <div class='head_top' id="pro"></div>
      <div class='pro_body' v-if='!allCom' id='top'>
        <div class='pro_info'>
          <div class='pro_swiper'>
            <mt-swipe :auto="3000" :speed='1000' :defaultIndex='0' :continuous='true' class='swiper_bg'
              :stopPropagation="true">
              <mt-swipe-item v-for="(item,index) in imgUrls" :key='index'>
                <img :src="item" class='slide-img' :style="{transform:'translate(0px,' + top / 1.5 + 'px)'}">
              </mt-swipe-item>
            </mt-swipe>
          </div>
          <div class='pro_down_sale' v-if="isFlash==1&&(proType=='normal'||proType=='flash')">
            <div class='pro_price'>
              <div style='display:flex;align-items:center;'>
                <span class='peo_nowprice' v-if='price_type==1'>￥{{default_spec.price_sell}}</span>
                <span class='peo_nowprice' v-if='price_type==4'>￥{{default_spec.price_combine}}+</span>
                <div class='pro_inter_img' v-if='price_type!=1'>
                  <i class='iconfont icon-jifen1'></i>
                </div>
                <span class='pro_integral' v-if='price_type==4'>{{default_spec.point_combine}}</span>
                <span class='pro_integral' v-if='price_type==2'>{{default_spec.point}}</span>
              </div>
              <div>
                <span>{{price_market_from}}</span>
                <span class='pro_orig'>￥{{price_market}}</span>
                <span class='pro_num'>已抢{{activity.count_num}}件</span>
              </div>
            </div>
            <div class='pro_right'>
              <div class='pro_time'>
                <span class='title'>距结束还剩:</span>
                <span class='time'>{{saleTime.day}}</span>
                <span class='text'>天</span>
                <span class='time'>{{saleTime.hou}}</span>
                <span class='text'>:</span>
                <span class='time'>{{saleTime.min}}</span>
                <span class='text'>:</span>
                <span class='time'>{{saleTime.sec}}</span>
              </div>
              <div class='pro_prop'>
                <div class='prop_bg'>
                  <span :style="{width:activity.count_num/totalNum*100+'%'}"
                    v-if='activity.count_num/totalNum*100<100'></span>
                  <span style='width:100%' v-if='activity.count_num/totalNum*100>=100'></span>
                </div>
              </div>
            </div>
          </div>
          <div class='pro_title'>
            <div class='pro_price' v-if="isFlash==0&&(proType=='normal'||proType=='flash')">
              <!-- <div class='pro_price_left'>
                  <span class='peo_nowprice' v-if='price_type==1'>￥{{default_spec.price_sell}}</span>
                  <span class='peo_nowprice' v-if='price_type==4'>￥{{default_spec.price_combine}}+</span>
                  <div class='pro_inter_img' v-if='price_type!=1'>
                    <i class='iconfont icon-jifen1'></i>
                  </div>
                  <span class='pro_integral' v-if='price_type==4&&isFlash==0'>{{default_spec.point_combine}}</span>
                  <span class='pro_integral' v-if='price_type==2&&isFlash==0'>{{default_spec.point}}</span>
                  <span>{{price_market_from}}</span>
                  <span class='pro_orig'>￥{{price_market}}</span>
                </div> -->
              <div>
                <span v-if="proInfo.is_third>0" class='pro_price_third'>{{proInfo.third_name}}</span>
                <span v-else class='pro_price_third'>平台自营</span>
                <span v-if="proInfo.is_gift_zone==1" class='pro_price_gift'>{{proInfo.gift_title}}</span>
              </div>
              <div class='pro_sale_num'>已售出{{proInfo.buy_count}}件</div>
            </div>
            <div class='pro_price' v-if="proType=='point'||proType=='birthday'">
              <!-- <div class='pro_price_left'>
                  <span class='peo_nowprice' v-if='price_type==1'>￥{{default_spec.price_sell}}</span>
                  <span class='peo_nowprice' v-if='price_type==4'>￥{{default_spec.price_combine}}+</span>
                  <div class='pro_inter_img' v-if='price_type!=1'>
                    <i class='iconfont icon-jifen1'></i>
                  </div>
                  <span class='pro_integral' v-if='price_type==4'>{{default_spec.point_combine}}</span>
                  <span class='pro_integral' v-if='price_type==2'>{{default_spec.point}}</span>
                  <span>{{price_market_from}}</span>
                  <span class='pro_orig'>￥{{price_market}}</span>
                </div> -->
              <div>
                <span v-if="proInfo.is_third>0" class='pro_price_third'>{{proInfo.third_name}}</span>
                <span v-else class='pro_price_third'>平台自营</span>
                <span v-if="proInfo.is_gift_zone==1" class='pro_price_gift'>{{proInfo.gift_title}}</span>
              </div>
              <div class='pro_sale_num'>已售出{{proInfo.buy_count}}件</div>
            </div>
            <div class="pro_name_block" :class="proType=='group'?' group_top':''">
              <div class="pro_name">
                <div class='pro_name_icon' v-if="isFlash==1&&(proType=='normal'||proType=='flash')||proType=='group'">
                  <img :src="imgPath+'pro/group_pro.png'" style='width:0.65rem;height:0.29rem;'
                    v-if="proType=='group'" />
                  <img :src="imgPath+'pro/sale_pro.png'" style='width:0.65rem;height:0.29rem;'
                    v-if="isFlash==1&&(proType=='normal'||proType=='flash')" />
                </div>
                <span>{{proInfo.name}}</span>
              </div>
              <div class="pro_name_right">
                <mt-button v-if="(isColl=='')?true:false" @click='addColl(proInfo.goods_id)'>
                  <i class='iconfont icon-shoucang'></i>
                </mt-button>
                <mt-button v-if="(isColl!='')?true:false" @click='addColl(isColl)' style="color:#ff4e79">
                  <i class='iconfont icon-yishoucang' style="color:#ff4e79"></i>
                </mt-button>
                <span v-if="isColl!=''?false:true">收藏</span>
                <span v-if="isColl==''?false:true">取消</span>
              </div>
            </div>
            <div class='pro_tips' v-if="proType!='group'">
              <span>{{summary}}</span>
            </div>
            <div class='pro_pay_type' v-if="(isFlash==0&&(proType=='normal'||proType=='flash'))||proType=='birthday'">
              <div class='pay_spec' v-if="proType=='group'&&buyType!=-2">
                <mt-button size='small' v-if='sale_type>=4' :class="price_type==4? 'button_click': ''"
                  @click='chosePriceType(0,4)'>
                  ￥{{activity.price_combine}}+<i class='iconfont icon-jifen1'></i>{{activity.point_combine}}</mt-button>
                <mt-button size='small' v-if='sale_type!=2&&sale_type!=6&&sale_type!=4'
                  :class="price_type==1? 'button_click': ''" @click='chosePriceType(0,1)'>￥{{activity.price}}
                </mt-button>
                <mt-button size='small' v-if='sale_type!=1&&sale_type!=5&&sale_type!=4'
                  :class="price_type==2? 'button_click': ''" @click='chosePriceType(0,2)'>
                  <i class='iconfont icon-jifen1'></i>{{activity.point}}</mt-button>
              </div>
              <div class='pay_spec' v-else>
                <mt-button size='small' v-if='sale_type>=4' :class="default_price_type==4? 'button_click': ''"
                  @click='chosePriceType(1,4)' data-type='1'>
                  ￥{{default_spec.price_combine}}+<i class='iconfont icon-jifen1'></i>{{default_spec.point_combine}}
                </mt-button>
                <mt-button size='small' v-if='sale_type!=2&&sale_type!=6&&sale_type!=4'
                  :class="default_price_type==1? 'button_click': ''" @click='chosePriceType(1,1)' data-type='1'>
                  ￥{{default_spec.price_sell}}</mt-button>
                <mt-button size='small' v-if='sale_type!=1&&sale_type!=5&&sale_type!=4'
                  :class="default_price_type==2? 'button_click': ''" @click='chosePriceType(1,2)'>
                  <i class='iconfont icon-jifen1'></i> {{default_spec.point}}</mt-button>
              </div>
            </div>
            <div class="pro_market" v-if="(isFlash==0&&(proType=='normal'||proType=='flash'))||proType=='birthday'">
              <span>{{price_market_from}}</span>
              <span class='pro_orig'>￥{{price_market}}</span>
            </div>
            <div class='pro_price pro_price_group' v-if="proType=='group'">
              <div style='display:flex;align-items:center;justify-content:space-between;margin:0.2rem 0;'>
                <div style='display:inline-flex;align-items:center;background:#f9f9f9;padding:0.08rem 0;'>
                  <span class='pro_nowprice' v-if='activity.deal_type==1'>￥{{activity.price}}</span>
                  <span class='pro_nowprice' v-if='activity.deal_type>=4'>￥{{activity.price_combine}}+</span>
                  <div class='pro_group_img' v-if='activity.deal_type!=1'>
                    <i class='iconfont icon-jifen1'></i>
                  </div>
                  <span class='pro_integral_group' v-if='activity.deal_type>=4'>{{activity.point_combine}}</span>
                  <span class='pro_integral_group'
                    v-if='activity.deal_type==2||activity.deal_type==3'>{{activity.point}}</span>
                  <span class='pro_orig_group'>￥{{price_market}}</span>
                </div>
                <div style='display:inline-flex;align-items:center;font-size:0.24rem;color:#777777;'>{{success_num}}人已成功
                </div>
              </div>
              <div>
                <span class='group_num'>{{activity.startnum}}人团</span>
                <span class='group_tags'>·NEW</span>
              </div>
            </div>
          </div>
          <div class='pro_title_tips' v-if="(proType=='normal'||proType=='flash')&&title_tips!=''">
            <span>{{title_tips}}</span>
          </div>
          <div class="pro_spec" id='com'>
            <div style='display:inline-flex;width:1rem;color:#444;align-items: center;'>
              <i class='iconfont icon-guige'
                style='padding-right:0.1rem;color:#222;font-size:0.32rem;margin-top: -0.05rem;'></i>默认
            </div>
            <div style='display:inline-flex;width:4rem;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;'>
              <span v-for='(item,index) in showSpec' :key='index'>{{item}}</span>
            </div>
            <div style='display:inline-flex;width:0.8rem;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;'>
              <span>{{specNum}}件</span>
            </div>
            <div class='spec_icon' @click='showModel'>
              <i class='iconfont icon-yuandianzhong'></i>
              <i class='iconfont icon-yuandianzhong'></i>
              <i class='iconfont icon-yuandianzhong'></i>
            </div>
          </div>
          <div class="pro_service" @click='showService'>
            <div class='pro_service_t'>
              <div style='display:inline-flex'>
                <i class='iconfont icon-fuwumb'
                  style='padding-right:0.1rem;display:inline-block;margin-top:-0.06rem/100rem;'></i> 服务
              </div>
              <div class='pro_service_t_r'>
                <span>详情</span>
                <i class='iconfont icon-iconfontjiantou5'></i>
              </div>
            </div>
            <div class='pro_service_b'>
              {{ serviceTitle }}
            </div>
          </div>
        </div>
        <div class='pro_group_title' v-if="proType=='group'&&groupList.length>0">
          <span>{{groupTotal}}人在拼单</span>
          <div @click='moreGroup'>
            <span>查看更多</span>
            <i class='iconfont icon-iconfontjiantou5'></i>
          </div>
        </div>
        <div class='pro_group' v-if="proType=='group'&&groupList.length>0">
          <div v-for='(item,index) in groupList' :key='index'>
            <div class='group' style='padding:0.2rem 0;' v-if='index<2&&endTimeList[index]!=0'>
              <div class='group_user'>
                <img :src='item.image' class='group_img' />
                <span>{{item.nickname}}</span>
              </div>
              <div>
                <div>
                  <span>还差</span>
                  <span class='group_num'>{{item.need_num}}</span>
                  <span>人拼成</span>
                </div>
                <div>
                  <span class='title'>剩余</span>
                  <span class='time'>{{saleTimeList[index].hou}}</span>
                  <span class='text'>:</span>
                  <span class='time'>{{saleTimeList[index].min}}</span>
                  <span class='text'>:</span>
                  <span class='time'>{{saleTimeList[index].sec}}</span>
                </div>
              </div>
              <!-- data-link='../groupResult/groupResult?type=payshare&orderId=item.id'  -->
              <mt-button @click="golink('/groupResult?type=payshare&orderId=',item.id)" size='small'>去拼单</mt-button>
            </div>
          </div>
        </div>
        <div class='pro_group_tips' v-if="activity.rule!=''&&activity.rule!=null">
          <div class=' group_head'>
            <span>团购规则</span>
          </div>
          <div class='group_text'>
            <span>{{activity.rule}}</span>
          </div>
        </div>
        <div class='pro_com'>
          <div class='com_head'>
            <span>精选评价</span>
            <div class='head_right' @click='viewAllCom' v-if='comList.length>0'>
              好评度
              <span>{{rate}}</span>
              <i class='iconfont icon-iconfontjiantou5'></i>
            </div>
          </div>
          <div class='com_list' v-if='comList.length==0' id='more'>
            <div class='com_tips'>暂无评价</div>
          </div>
          <div class='com_list' v-if='comList.length>0' id='more'>
            <div class='com_info' v-for='(item,index) in comList' :key='index' v-show="index<2">
              <div class='com_info_head'>
                <div class='user_info'>
                  <img :src='item.image' v-lazy="item.image" />
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
                <img :src='com' v-for='(com,index) in item.pic' :key='index' @click='previewImg(com)'
                  data-comid='item.id' v-lazy="com" />
              </div>
            </div>
            <div class='com_btn' @click='viewAllCom'>
              <mt-button size='normal'>查看全部评价</mt-button>
            </div>
          </div>
        </div>
        <div class='pro_show'>
          <div class='show_head'>
            <div class='header_nav'>
              <span :class="choseid=='p'?'nav_text_active':''" id='p' @click="choseTab('p')">商品介绍</span>
              <!-- |<span :class="choseid=='s'?'nav_text_active':''" id='s' @click="choseTab('s')">规格参数</span>
              |<span :class="choseid=='a'?'nav_text_active':''" id='a' @click="choseTab('a')">包装售后</span> -->
            </div>
          </div>
          <div class='pro_img'>
            <div v-html='proDetail' class='pro_html'></div>
            <div v-html='proBuy' class='pro_html' v-if="proBuy!=''"></div>
            <div id='recommend' :hidden="recomList.length<=0" style="height:0.94rem;position: absolute;bottom: 0;">
            </div>
          </div>
        </div>
        <div class='pro_recomm' :hidden="recomList.length<=0">
          <span class='i_title'>—————— 你可能还喜欢 ——————</span>
          <div class='recom_list'>
            <div class='i_pro' v-for="(item,index) in recomList" :key="index" @click='goPro(item.goods_id)'>
              <!-- data-link='../proDetail/proDetail?type=normal&id={{item.goods_id" id="item.goods_id"/ -->
              <div class='pro_img'>
                <img :src="item.img" />
              </div>
              <!-- data-link='../proDetail/proDetail?type=normal&id={{item.goods_id" id="item.goods_id" -->
              <div class='pro_title pro_line_two'>
                <div class='pro_level' v-if="item.promotion==1">
                  <img :src="imgPath+'member/cu.png'" />
                  <span>限时购</span>
                </div>
                {{item.name}}
              </div>
              <div class='pro_price'>
                <div style='display:flex;align-items:center;line-height:0.48rem;'>
                  <div class='pro_flex' :hidden="item.deal_type==2">
                    <span class='peo_nowprice' v-if="item.deal_type==1">￥{{item.price_sell}}<span
                        style="color:#ff4e79;font-size:0.23rem" v-if="isMember"> / 赚{{item.back_rebate}}</span></span>
                    <span class='peo_nowprice' v-if="item.deal_type>=4">￥{{item.price_sell}}<span
                        style="color:#ff4e79;font-size:0.23rem" v-if="isMember"> / 赚{{item.back_rebate}}</span>+</span>
                  </div>
                  <div class='pro_flex' :hidden="item.deal_type==1">
                    <div class='pro_inter_img'>
                      <i class='iconfont icon-jifen1'></i>
                    </div>
                    <span class='pro_integral' v-if="item.deal_type==2||item.deal_type==3">{{item.point}}</span>
                    <span class='pro_integral'
                      v-if="item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3">{{item.point}}</span>
                  </div>
                </div>
                <div style='display:flex;align-items:center;justify-content:space-between;'>
                  <div style='display:inline-flex;align-items:center;'>
                    <span class='pro_bg'>{{item.price_market_from}}</span>
                    <span class='pro_orig line'>￥{{item.price_market}}</span>
                  </div>
                  <div class='pro_count'>销量:{{item.buy_count}}</div>
                </div>
                <!-- <div class='pro_flex'>
                <icon class='iconfont icon-car' bindtap='addPro' id="item.product_id" data-type="item.deal_type"></icon>
              </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='pro_com_detail' v-if="allCom">
        <div class='com_detail_head'>
          <div class='com_head_left'>
            <span>共{{comTotal}}条评论</span>
          </div>
          <div class='com_head_right'>
            <span>好评{{rate}}</span> </div>
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

      <div class='null_view'></div>
      <div class="" v-if="isShare==0">
        <div class='pro_btn' v-if="(proType=='normal'||proType=='flash')" :hidden='hiddenFix'>
          <div class='btn_blcok pro_server'>
            <mt-button class='show_car' @click="goIndex('/car')">
              <div class='badge' v-if="$store.state.home.carnum>0">
                <span v-if="$store.state.home.carnum<99">{{$store.state.home.carnum}}</span>
                <span v-else>···</span>
              </div>
              <!-- <div class='radios' v-if="redShow"></div> -->
              <i class='iconfont icon-car'></i>
              <span class="btn_text">购物车</span>
            </mt-button>
            <mt-button class='show_share' @click="zipImg">
              <i class='iconfont icon-fenxiang1'></i>
              <span class="btn_text">分享</span>
            </mt-button>
          </div>
          <mt-button class='btn_blcok width pro_buy left_none border-radius' @click='showModel'
            v-if="maxNum>0&&is_up=='true'&&is_retail==1">立即购买</mt-button>
          <mt-button class='btn_blcok width pro_buy_dis left_none border-radius'
            v-if="maxNum<=0&&is_up=='true'&&isFlash!=1&&is_retail==1">已售完</mt-button>
          <mt-button class='btn_blcok width pro_buy_dis left_none border-radius'
            v-if="maxNum<=0&&is_up=='true'&&isFlash==1&&is_retail==1">已抢完</mt-button>
          <mt-button class='btn_blcok width pro_buy_dis left_none border-radius' v-if="is_up=='true'&&is_retail==0">未开启零售</mt-button>
          <mt-button class='btn_blcok width pro_buy_dis left_none border-radius' v-if="is_up=='false'">已下架</mt-button>
        </div>
        <div class='pro_btn' v-else :hidden='hiddenFix'>
          <div class='btn_blcok pro_server pro_one'>
            <mt-button class='show_car' @click="goIndex('/car')">
              <div class='badge' v-if="$store.state.home.carnum>0">
                <span v-if="$store.state.home.carnum<99">{{$store.state.home.carnum}}</span>
                <span v-else>···</span>
              </div>
              <!-- <div class='radios' v-if="redShow"></div> -->
              <i class='iconfont icon-car'></i>
              <span class="btn_text">购物车</span>
            </mt-button>
          </div>
          <mt-button class="pro_buy_dis border-left group_buy right_none" v-if="proType=='group'&&maxNum>0&&is_up=='true'&&is_retail==0">未开启零售</mt-button>
          <mt-button class="add_car_group border-left group_buy" @click='buyNow(10)'
            v-if="proType=='group'&&maxNum>0&&is_up=='true'&&is_retail==1">单独购买</mt-button>
          <mt-button class="pro_buy_group border-right group_buy" @click='buyNow(0)'
            v-if="proType=='group'&&addgroup==''&&maxNum>0&&is_up=='true'&&endTime>0">开启拼团</mt-button>
          <mt-button class="group_buy pro_buy pro_buy_dis border-right"
            v-if="proType=='group'&&addgroup==''&&maxNum>0&&is_up=='true'&&group_start==1&&endTime<=0">拼团已结束</mt-button>
          <mt-button class="group_buy pro_buy pro_buy_dis border-right"
            v-if="proType=='group'&&addgroup==''&&maxNum>0&&is_up=='true'&&group_start==0">团购未开始</mt-button>
          <mt-button class="group_buy pro_buy_group border-right" @click='buyNow(0)'
            v-if="proType=='group'&&addgroup!=''&&maxNum>0&&is_up=='true'">立即参团</mt-button>
          <mt-button :class="activity.is_qualification?'btn_blcok width pro_buy border-radius left_none right_none':'btn_blcok width pro_buy_dis border-radius left_none right_none'"
            @click='buyNow(0)' v-if="(proType=='point'||proType=='birthday')&&maxNum>0&&is_up=='true'&&is_retail==1">立即兑换</mt-button>
          <mt-button :class=" activity.is_qualification?'pro_buy btn_blcok width':'pro_buy_dis btn_blcok width'"
            @click='buyNow(0)'
            v-if="proType!='group'&&proType!='point'&&proType!='birthday'&&activity.is_qualification&&maxNum>0&&is_up=='true'&&is_retail==1">
            立即购买</mt-button>
          <mt-button :class="activity.is_qualification?'btn_blcok width pro_buy':'btn_blcok width pro_buy_dis'"
            v-if="activity.is_qualification==false&&isFlash==1&&maxNum>0&&is_up=='true'&&proType!='birthday'&&proType!='point'&&is_retail==1"
            @click='buyNow(0)'>立即购买</mt-button>
          <mt-button class='btn_blcok width_long pro_buy pro_buy_dis left_none border-radius'
            v-if="maxNum<=0&&is_up=='true'&&isFlash!=1&&is_retail==1">已售完
          </mt-button>
          <mt-button class='btn_blcok width_long pro_buy pro_buy_dis left_none border-radius' v-if="is_up=='false'">已下架</mt-button>
        </div>
      </div>

      <div class="" v-if="isShare==1">
        <div class='pro_btn' v-if="(proType=='normal'||proType=='flash')" :hidden='hiddenFix'>
          <section v-if="isMember" style="width: 100%;display: flex;height:1.28rem;align-items: center;">
            <div class='btn_blcok pro_one'>
              <mt-button class='show_car' @click="goIndex('/car')">
                <div class='badge' v-if="$store.state.home.carnum>0">
                  <span v-if="$store.state.home.carnum<99">{{$store.state.home.carnum}}</span>
                  <span v-else>···</span>
                </div>
                <!-- <div class='radios' v-if="redShow"></div> -->
                <i class='iconfont icon-car'></i>
                <span class="btn_text">购物车</span>
              </mt-button>
            </div>
            <mt-button class='add_car share_save border-left' @click='showModel(1)'
              v-if="price_type==1&&maxNum>0&&is_up=='true'&&isMember&&is_retail==1">
              <span class="show_span">自购省</span>
              <span class="litle_span">至少￥{{default_spec.back_rebate}}</span>
            </mt-button>
            <mt-button class='pro_buy share_save border-right' @click='toshare'
              v-if="price_type==1&&maxNum>0&&is_up=='true'&&isMember&&is_retail==1">
              <span class="show_span">分享赚</span>
              <span class="litle_span">至少￥{{default_spec.back_rebate}}</span>
            </mt-button>
            <mt-button class='add_car share_save border-left' @click='showModel(1)'
              v-if="price_type!=1&&maxNum>0&&is_up=='true'&&isMember&&is_retail==1">购买</mt-button>
            <mt-button class='pro_buy share_save border-right' @click='toshare'
              v-if="price_type!=1&&maxNum>0&&is_up=='true'&&isMember&&is_retail==1">
              分享</mt-button>
            <mt-button class='btn_blcok width_long pro_buy_dis left_none border-radius'
              v-if="maxNum<=0&&is_up=='true'&&isFlash!=1&&is_retail==1">已售完</mt-button>
            <mt-button class='btn_blcok width_long pro_buy_dis left_none border-radius'
              v-if="maxNum<=0&&is_up=='true'&&isFlash==1&&is_retail==1">已抢完</mt-button>
            <mt-button class='btn_blcok width_long pro_buy_dis left_none border-radius' v-if="is_up=='true'&&is_retail==0">未开启零售</mt-button>
            <mt-button class='btn_blcok width_long pro_buy_dis left_none border-radius' v-if="is_up=='false'">已下架</mt-button>
          </section>
          <section v-else style="width: 100%;display: flex;height:1.28rem;align-items: center;">
            <div class='btn_blcok pro_server'>
              <mt-button class='show_car' @click="goIndex('/car')">
                <div class='badge' v-if="$store.state.home.carnum>0">
                  <span v-if="$store.state.home.carnum<99">{{$store.state.home.carnum}}</span>
                  <span v-else>···</span>
                </div>
                <!-- <div class='radios' v-if="redShow"></div> -->
                <i class='iconfont icon-car'></i>
                <span class="btn_text">购物车</span>
              </mt-button>
              <mt-button class='show_share' @click="zipImg">
                <i class='iconfont icon-fenxiang1'></i>
                <span class="btn_text">分享</span>
              </mt-button>
            </div>
            <mt-button class='pro_buy width btn_blcok left_none border-radius' @click='showModel(1)'
              v-if="price_type==1&&maxNum>0&&is_up=='true'&&!isMember&&is_retail==1">购买</mt-button>
            <mt-button class='pro_buy width btn_blcok left_none border-radius' @click='showModel(1)'
              v-if="price_type!=1&&maxNum>0&&is_up=='true'&&!isMember&&is_retail==1">购买</mt-button>
            <mt-button class='btn_blcok width pro_buy_dis left_none border-radius'
              v-if="maxNum<=0&&is_up=='true'&&isFlash!=1&&is_retail==1">已售完</mt-button>
            <mt-button class='btn_blcok width pro_buy_dis left_none border-radius'
              v-if="maxNum<=0&&is_up=='true'&&isFlash==1&&is_retail==1">已抢完</mt-button>
            <mt-button class='btn_blcok width pro_buy_dis left_none border-radius' v-if="is_up=='true'&&is_retail==0">未开启零售</mt-button>
            <mt-button class='btn_blcok width pro_buy_dis left_none border-radius' v-if="is_up=='false'">已下架</mt-button>
          </section>
        </div>
        <div class='pro_btn' v-else :hidden='hiddenFix'>
          <div class='btn_blcok pro_one'>
            <mt-button class='show_car' @click="goIndex('/car')">
              <div class='badge' v-if="$store.state.home.carnum>0">
                <span v-if="$store.state.home.carnum<99">{{$store.state.home.carnum}}</span>
                <span v-else>···</span>
              </div>
              <i class='iconfont icon-car'></i>
              <span class="btn_text">购物车</span>
            </mt-button>
          </div>
          <!-- lv1显示按钮 -->
          <mt-button class="pro_buy_dis border-left group_buy right_none" v-if="price_type==1&&proType=='group'&&maxNum>0&&is_up=='true'&&isMember&&is_retail==0">
            <span class="show_span">未开启零售</span>
          </mt-button>
          <mt-button class="add_car_group border-left group_buy" @click='buyNow(10)'
            v-if="price_type==1&&proType=='group'&&maxNum>0&&is_up=='true'&&isMember&&is_retail==1">
            <span class="show_span">单独购买</span>
            <span class="litle_span">至少￥{{default_spec.back_rebate}}</span>
          </mt-button>
          <mt-button class="pro_buy_group border-right group_buy" @click='buyNow(0)'
            v-if="price_type==1&&proType=='group'&&addgroup==''&&maxNum>0&&is_up=='true'&&endTime>0&&isMember">
            <span class="show_span">开启拼团</span>
            <span class="litle_span">至少￥{{activity.back_rebate}}</span>
          </mt-button>
          <mt-button class="pro_buy_group border-right group_buy" @click='buyNow(0)'
            v-if="price_type==1&&proType=='group'&&addgroup!=''&&maxNum>0&&is_up=='true'&&isMember">
            <span class="show_span">立即参团</span>
            <span class="litle_span">至少￥{{activity.back_rebate}}</span></mt-button>

          <mt-button class="pro_buy_group border-right group_buy" @click='buyNow(10)'
            v-if="price_type!=1&&proType=='group'&&maxNum>0&&is_up=='true'&&isMember&&is_retail==1">单独购买</mt-button>
          <mt-button class="pro_buy_dis border-right group_buy right_none" v-if="price_type!=1&&proType=='group'&&maxNum>0&&is_up=='true'&&isMember&&is_retail==0">未开启零售</mt-button>
          <mt-button class="pro_buy_group border-right group_buy" @click='buyNow(0)'
            v-if="price_type!=1&&proType=='group'&&addgroup==''&&maxNum>0&&is_up=='true'&&endTime>0&&isMember">开启拼团
          </mt-button>
          <mt-button class="pro_buy_group border-right group_buy" @click='buyNow(0)'
            v-if="price_type!=1&&proType=='group'&&addgroup!=''&&maxNum>0&&is_up=='true'&&isMember">立即参团</mt-button>

          <!-- lv0显示按钮 -->
          <mt-button class="add_car_group border-left group_buy" @click='buyNow(10)'
            v-if="price_type==1&&proType=='group'&&maxNum>0&&is_up=='true'&&!isMember&&is_retail==1">单独购买</mt-button>
          <mt-button class="pro_buy_dis border-left group_buy right_none" v-if="price_type==1&&proType=='group'&&maxNum>0&&is_up=='true'&&!isMember&&is_retail==0">未开启零售</mt-button>
          <mt-button class="pro_buy_group border-right group_buy" @click='buyNow(0)'
            v-if="price_type==1&&proType=='group'&&addgroup==''&&maxNum>0&&is_up=='true'&&endTime>0&&!isMember">开启拼团
          </mt-button>
          <mt-button class="pro_buy_group border-right group_buy" @click='buyNow(0)'
            v-if="price_type==1&&proType=='group'&&addgroup!=''&&maxNum>0&&is_up=='true'&&!isMember">立即参团</mt-button>

          <mt-button class="add_car_group border-left group_buy" @click='buyNow(10)'
            v-if="price_type!=1&&proType=='group'&&maxNum>0&&is_up=='true'&&!isMember&&is_retail==1">单独购买</mt-button>
          <mt-button class="pro_buy_dis border-left group_buy right_none" v-if="price_type!=1&&proType=='group'&&maxNum>0&&is_up=='true'&&!isMember&&is_retail==0">未开启零售</mt-button>
          <mt-button class="pro_buy_group border-right group_buy" @click='buyNow(0)'
            v-if="price_type!=1&&proType=='group'&&addgroup==''&&maxNum>0&&is_up=='true'&&endTime>0&&!isMember">开启拼团
          </mt-button>
          <mt-button class="pro_buy_group border-right group_buy" @click='buyNow(0)'
            v-if="price_type!=1&&proType=='group'&&addgroup!=''&&maxNum>0&&is_up=='true'&&!isMember">立即参团</mt-button>

          <!-- 公共显示按钮 -->
          <mt-button class="group_buy pro_buy pro_buy_dis border-right"
            v-if="proType=='group'&&addgroup==''&&maxNum>0&&is_up=='true'&&group_start==1&&endTime<=0">拼团已结束</mt-button>
          <mt-button class="group_buy pro_buy pro_buy_dis border-right"
            v-if="proType=='group'&&addgroup==''&&maxNum>0&&is_up=='true'&&group_start==0">团购未开始</mt-button>
          <mt-button :class="activity.is_qualification?'btn_blcok width pro_buy border-radius left_none right_none':'btn_blcok width pro_buy_dis border-radius left_none right_none'"
            @click='buyNow(0)' v-if="(proType=='point'||proType=='birthday')&&maxNum>0&&is_up=='true'&&is_retail==1">立即兑换</mt-button>
          <mt-button :class=" activity.is_qualification?'pro_buy btn_blcok width':'pro_buy_dis btn_blcok width'"
            @click='buyNow(0)'
            v-if="proType!='group'&&proType!='point'&&proType!='birthday'&&activity.is_qualification&&maxNum>0&&is_up=='true'&&is_retail==1">
            立即购买</mt-button>
          <mt-button :class="activity.is_qualification?'btn_blcok width pro_buy':'btn_blcok width pro_buy_dis'"
            v-if="activity.is_qualification==false&&isFlash==1&&maxNum>0&&is_up=='true'&&proType!='birthday'&&proType!='point'&&is_retail==1"
            @click='buyNow(0)'>立即购买</mt-button>
          <!-- <mt-button class='btn_blcok width pro_buy' v-if="maxNum<=0&&is_up=='true'&&isFlash==1">已抢完</mt-button> -->
          <mt-button class='btn_blcok width_long pro_buy_dis left_none border-radius'
            v-if="maxNum<=0&&is_up=='true'&&isFlash!=1&&is_retail==1">已售完</mt-button>
            <!-- <mt-button class='btn_blcok width_long pro_buy pro_buy_dis left_none border-radius' v-if="is_up=='true'&&is_retail==0">未开启零售</mt-button> -->
          <mt-button class='btn_blcok width_long pro_buy_dis left_none border-radius' v-if="is_up=='false'">已下架</mt-button>
        </div>
      </div>

      <div class='pro_spec_model' v-if='!modelShow' @click='closeModel'>
      </div>
      <div class='pro_spec_detail' v-if='!modelShow'
        :class="{'animated slideOutDown':modelShow,'animated slideInUp':!modelShow}">
        <div class='spec_head'>
          <div class='spec_pro_img' @click='previewImg(staticImg)'>
            <img :src='staticImg' mode='widthFix' />
          </div>
          <div class='spec_close' @click='closeModel'>
            <i class='iconfont icon-guanbi'></i>
          </div>
          <div class='spec_pro_price' v-if="proType=='group'&&buyType!=-2">
            <span class='spec_pro_nowprice' v-if='price_type==1'>￥{{activity.price}}<span v-if="isShare==1&&isMember"> /
                返￥{{activity.back_rebate}}</span></span>
            <span class='spec_pro_nowprice' v-if='price_type==4'>￥{{activity.price_combine}}+</span>
            <div class='spec_pro_inter_img' v-if='price_type!=1'>
              <i class='iconfont icon-jifen1'></i>
            </div>
            <span class='spec_pro_integral' v-if='price_type==4'>{{activity.point_combine}}</span>
            <span class='spec_pro_integral' v-if='price_type==2'>{{activity.point}}</span>
          </div>
          <div class='spec_pro_price' v-else>
            <span class='spec_pro_nowprice' v-if='default_price_type==1'>￥{{default_spec.price_sell}}<span
                v-if="isShare==1&&isMember"> / 返￥{{default_spec.back_rebate}}</span></span>
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
        <div class='spec_body'>
          <div :hidden="(isFlash==0&&(proType=='normal'||proType=='flash'))||proType=='birthday'">
            <div class='spec_title'>
              结算方式
            </div>
            <div class='spec_type' v-if="proType=='group'&&buyType!=-2">
              <mt-button size='small' v-if='sale_type>=4' :class="price_type==4? 'button_click': ''"
                @click='chosePriceType(0,4)'>
                ￥{{activity.price_combine}}+<i class='iconfont icon-jifen1'></i>{{activity.point_combine}}</mt-button>
              <mt-button size='small' v-if='sale_type!=2&&sale_type!=6&&sale_type!=4'
                :class="price_type==1? 'button_click': ''" @click='chosePriceType(0,1)'>￥{{activity.price}}</mt-button>
              <mt-button size='small' v-if='sale_type!=1&&sale_type!=5&&sale_type!=4'
                :class="price_type==2? 'button_click': ''" @click='chosePriceType(0,2)'>
                <i class='iconfont icon-jifen1'></i>{{activity.point}}</mt-button>
            </div>
            <div class='spec_type' v-else>
              <mt-button size='small' v-if='sale_type>=4' :class="default_price_type>=4? 'button_click': ''"
                @click='chosePriceType(1,4)'>￥{{default_spec.price_combine}}+<i
                  class='iconfont icon-jifen1'></i>{{default_spec.point_combine}}</mt-button>
              <mt-button size='small' v-if='sale_type!=2&&sale_type!=6&&sale_type!=4'
                :class="default_price_type==1? 'button_click': ''" @click='chosePriceType(1,1)'>
                ￥{{default_spec.price_sell}}</mt-button>
              <mt-button size='small' v-if='sale_type!=1&&sale_type!=5&&sale_type!=4'
                :class="default_price_type==2? 'button_click': ''" @click='chosePriceType(1,2)'>
                <i class='iconfont icon-jifen1'></i> {{default_spec.point}}</mt-button>
            </div>
          </div>
          <div v-for='(item,index) in specList' :key='index' :hidden='!hasSpec'>
            <div class='spec_title'>
              {{item.name}}
            </div>
            <div class='spec_type'>
              <mt-button size='small' @click="choseType(item.tid,item.pid)" v-for="(item,index) in item.list"
                :key='index' :class="item.ischose? 'button_click': ''">{{item.name}}</mt-button>
            </div>
          </div>
          <div class='spec_num' v-if="proType!='birthday'">
            <span>数量</span>
            <div class='pro_icon'>
              <mt-button size='small' class='pro_spec_btn' id='0' @click='lessNum' data-value='less' :disabled="specNum==1">-</mt-button>
              <input v-model='specNum' @blur='changeValue(specNum)' type='text' />
              <mt-button size='small' class='pro_spec_btn' id='1' @click='addNum' data-value='add' :disabled="specNum>=99||specNum==maxNum">+</mt-button>
            </div>
          </div>
        </div>
        <div v-if="maxNum>0&&is_up=='true'&&spec_up==true&&is_retail==1" class="spec_btn_bg">
          <div class='spec_btn' v-if="buyType==0&&proType!='birthday'">
            <mt-button class='add_car border-left' @click='addCar(0)' id='0'>加入购物车</mt-button>
            <mt-button class='pro_buy border-right' @click='addCar(1)' id='1'>立即购买</mt-button>
          </div>
          <div class='spec_btn' v-else>
            <mt-button @click='addCar(1)' class='surebtn border-radius' id='1' v-if="proType!='normal'||isFlash==1">确认
            </mt-button>
            <mt-button @click='addCar' class='surebtn border-radius' v-else>确认</mt-button>
          </div>
        </div>
        <div v-if="(maxNum<=0||spec_up==false)&&is_up=='true'&&is_retail==1" class="spec_btn_bg">
          <div class='spec_btn'>
            <mt-button class='surebtn_false border-radius'>已售完</mt-button>
          </div>
        </div>
        <div v-if="is_up=='true'&&is_retail==0" class="spec_btn_bg">
          <div class='spec_btn'>
            <mt-button @click='addCar(1)' class='surebtn border-radius' id='1' v-if="proType=='group'">确认</mt-button>
            <mt-button class='surebtn_false border-radius' v-else>未开启零售</mt-button>
          </div>
        </div>
        <div v-if="is_up=='false'" class="spec_btn_bg">
          <div class='spec_btn'>
            <mt-button class='surebtn_false border-radius'>已下架</mt-button>
          </div>
        </div>

      </div>
      <!--服务详情弹出框-->
      <div class='pro_server_bg' :hidden="servershow" @click='closeserver'>
      </div>
      <div class='pro_server_detail' :hidden="servershow"
        :class="{'animated slideOutDown':servershow,'animated slideInUp':!servershow}">
        <div class='pro_server_detail_t'>服务</div>
        <div class='pro_server_detail_c'>
          <div style="height:6.6rem;overflow-y:scroll;overflow-x:hidden">
            <div v-html='serviceDetail' class='pro_html'></div>
          </div>
        </div>
      </div>
      <div class='group_model_bg' :hidden='groupShow' @click='closeGroup'></div>
      <div class='group_model' :hidden='groupShow'>
        <div class='group_model_body'>
          <div class='group_model_icon' @click='closeGroup'>
            <img :src="imgPath+'pro/close.png'" style='width:0.62rem;height:0.62rem;' />
          </div>
          <div class='group_model_title'>正在拼单</div>
          <div class='group_model_list' scroll-y :style="{height:g_list_height+'rem'}">
            <div v-for='(item,index) in groupList' :key='index'>
              <div class='group_block' v-if='endTimeList[index]!=0'>
                <div class='group_block_left'>
                  <img :src='item.image' class='group_img' />
                  <div class='group_right'>
                    <div style='display:flex;align-items:center;'>
                      <span class='group_name'>{{item.nickname}}</span>
                      <span class='group_num'>还差{{item.need_num}}人拼成</span>
                    </div>
                    <div class='group_right_time'>
                      <span class='title'>剩余</span>
                      <span class='time'>{{saleTimeList[index].hou}}</span>
                      <span class='text'>:</span>
                      <span class='time'>{{saleTimeList[index].min}}</span>
                      <span class='text'>:</span>
                      <span class='time'>{{saleTimeList[index].sec}}</span>
                    </div>
                  </div>
                </div>
                <div class='group_block_right'>
                  <mt-button @click="golink('/groupResult?type=payshare&orderId=',item.id)" size='small'>去拼单</mt-button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div class='pro_com_img_bg' v-if='imgShow' catchtouchmove="ture" @click="hiddenImg"></div>
      <div class='pro_com_img' v-if='imgShow' catchtouchmove="ture" @click="hiddenImg">
        <img :src="img_show_big" alt="" @click="hiddenImg">
      </div>
    </div>
    <div class='s_share' :hidden="showShare">
      <div class='s_share_bg' :hidden="showShare" @click='closeShare'></div>
      <div class='share_content'>
        <div class="share_content_canvas" ref="imageTofile">
          <div class='s_con_user'>
            <img class='s_con_user_img' :src="canvas_avatar" ref="share_head" />
            <!-- <img class='s_con_user_img' :src="userInfo.avatar" ref="share_head" /> -->
            <div class='s_con_use_tit'>
              <span>{{userInfo.nickname}}</span>
              <span>推荐给你一个好商品</span>
            </div>
          </div>
          <div class='s_con_showImg'>
            <img :src="canvas_pro_img" ref="share_pro_code" v-if="showPro"/>
            <img :src="proInfo.img" ref="share_pro" class='s_pro_img' v-else/>
          </div>
          <div class='s_con_price'>
            <div class="s_con_price_l">
              <span>￥</span>
              <span>{{proInfo.price_sell}}</span>
            </div>
            <div class="s_con_price_r">
              <span>￥</span>
              <span>{{proInfo.price_market}}</span>
              <span class="xiexian" :style="{width:FontWidth+'rem'}"></span>
            </div>
          </div>
          <div class='s_con_title'>
            <span v-for="(item,index) in canvas_title" :key="index">{{item}}</span>
            <!-- <span>{{proInfo.name}}</span> -->
          </div>
          <!-- <div class='s_con_new' v-if="price_type==1&&isMember">
            <span>分享赚￥{{default_spec.back_rebate}}</span>
          </div> -->
          <div class='wx_sao'>
            <img :src="erweimasrc" ref="share_qrcode" class='s_code_img'/>
            <!-- <div id="qrcode" ref="qrcode"></div> -->
          </div>
        </div>
        <div class='close' @click='closeShare'>
          <i class='iconfont icon-close'></i>
        </div>
      </div>
      <!-- :class="is_iphonex?'share_b_bottom':''" -->
      <!-- <div class="share_b ">
        <mt-button class="share_wx" @click="zipImg">分享到微信</mt-button>
        <mt-button class="save_img" @click='saveImg'>保存图片</mt-button>
      </div> -->
      <mt-button class="share_wx" @click="zipImg">
        <i class="iconfont icon-wecaht"></i>
        <span>分享到微信</span>
      </mt-button>
      <mt-button class="save_img" @click='toImage'>
        <i class="iconfont icon-xiazai"></i>
        <span>保存图片</span>
      </mt-button>
    </div>

    <!-- <img :src="htmlUrl"> -->
    <!-- <canvas id="sharePro" width="6.2rem" height="9.2rem" style="width:6.2rem;height:9.6rem;background: #fff;z-index: 2000;position: absolute;top:0;"></canvas> -->
    <!-- <div class='goShare' @click='toshare'>
      <i class='iconfont icon-fenxiang2'></i>
    </div> -->
  </div>

</template>

<script>
import QRCode from 'qrcodejs2'
import html2canvas from 'html2canvas'
import commonHeader from 'common/common-header'
import {
  Toast,
  Indicator,
  Button,
  Swipe,
  SwipeItem,
  Lazyload,
  Field
} from 'mint-ui'
import {
  mapMutations,
  mapGetters
} from 'vuex'
import returnTop from '@/components/return-top'
import {
  countDown,
  countDownList,
  // getBase64Image,
  transformArrayBufferToBase64
} from '@/store/pubilc.js'
import {
  getProDetail,
  getComList,
  getRecommByPro,
  getProduct,
  addCarofPro,
  addCarofGroup,
  addCarofPoint,
  addCarofNormal,
  collPro,
  cancleColl,
  getCarList
} from '@/api/index'
import {
  getQRcode,
  getAvatarBy64
} from '@/api/share'
export default {
  name: 'ProDetail',
  components: {
    QRCode,
    html2canvas,
    commonHeader,
    Toast,
    Indicator,
    Button,
    Swipe,
    SwipeItem,
    Lazyload,
    returnTop,
    Field
  },
  data() {
    return {
      FontWidth: 0,
      imgPath: process.env.FilE_URL,
      sharePro: 0,
      isMember: this.$store.state.home.is_member,
      // isMember: false,
      isShare: this.$store.state.home.is_share,
      h_title: '商品详情',
      bindtop: 0,
      top: 0,
      allowbind: true,
      success_num: 0,
      userInfo: {},
      title_tips: '',
      g_list_height: 350 / 100,
      groupTotal: 0,
      comHeight: 0,
      moreHeight: 0,
      proHeight: 0,
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
      choseName: 'pro',
      rate: '',
      chosecap: true,
      modelShow: true,
      groupShow: true,
      specNum: 1,
      isColl: false,
      allow_coll: true,
      isSign: true,
      page: 1,
      is_up: '', // 是否上架
      is_retail: true, // 是否上架
      limit: 10,
      buyType: 0,
      product_id: null,
      redShow: false,
      // usepoint: 0,
      default_spec: {},
      maxNum: 0,
      totalNum: 0,
      summary: '', // 商品简介
      proInfo: [],
      recomList: [], // 推荐商品
      goods_info: [],
      comList: [],
      comDetail: [],
      comTotal: 0,
      specNameList: [],
      specDetailList: [],
      specList: [],
      showSpec: [],
      // isnormal: true,
      toView: '',
      proType: 'normal',
      proDetail: '',
      proBuy: '', // 购买须知
      intrDetail: '',
      specDetail: '',
      afterDetail: '',
      serviceTitle: '',
      serviceDetail: '',
      servershow: true,
      choseid: 'p',
      allCom: false,
      activity: {},
      endTime: null,
      saleTime: [],
      time: null,
      timeList: [],
      endTimeList: [],
      canvas_pro_img: '',
      canvas_title: [],
      canvas_avatar: '',
      canvas_qrcode: '',
      saleTimeList: [{
        hou: 0,
        min: 0,
        sec: 0
      }],
      addgroup: '',
      groupId: '',
      isgroup: 0,
      goods_id: '',
      type: '', // 商品类型，normal普通
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
      imgShow: false,
      img_show_big: '',
      sharewx: '',
      shareUrl: '',
      spec_up: true,
      showShare: true,
      allShare: true,
      erweima: '',
      codeOk: 0,
      shareInfo: {},
      erweimasrc: '',
      saveImgBtnHidden: false,
      htmlUrl: '',
      codeShow: false,
      showAvatar: false,
      showPro: false,
      loading: true,
      autoOpen: false,
      timer: ''

    }
  },
  mounted() {
    let storage = window.localStorage
    console.log(storage.getItem('isLogin'))
    // this.isShow = true
    Indicator.open('加载中...')
    this.goods_id = this.$route.query.id // 普通商品的商品id
    this.type = this.$route.query.type
    if (this.type !== 'normal') {
      if (this.type === 'group' && this.$route.query.gid !== undefined) {
        this.proType = this.$route.query.type
        this.groupId = this.$route.query.id // 团购活动的id
        this.addgroup = this.$route.query.gid // 开团的id
      } else {
        this.groupId = this.$route.query.goods_id // 团购商品的商品id
        this.goods_id = this.$route.query.id // 团购活动的id
        this.proType = this.$route.query.type
        this.addgroup = ''
      }
    }
    let uid = ''
    if (storage.getItem('isLogin') === true || storage.getItem('isLogin') === 'true') {
      uid = storage.getItem('token').split(';')[0].split('=')[1]
    }
    switch (this.type) {
      case 'normal':
        this.shareUrl =
            '/pages/proDetail/proDetail?type=normal&id=' + this.goods_id + '&uid=' + uid
        break
      case 'flash':
        this.shareUrl =
            '/pages/proDetail/proDetail?type=flash&id=' + this.goods_id + '&uid=' + uid
        break
      case 'birthday':
        this.shareUrl =
            '/pages/proDetail/proDetail?type=birthday&id=' + this.goods_id + '&uid=' + uid
        break
      case 'group':
        if (this.addgroup !== '') {
          // 参团
          this.shareUrl =
              '/pages/proDetail/proDetail?type=group&id=' +
              this.groupId +
              '&gid=' +
              this.addgroup
        } else {
          this.shareUrl =
              '/pages/proDetail/proDetail?type=group&id=' +
              this.goods_id +
              '&goods_id=' +
              this.groupId
        }
        break
    }
    this.userInfo = this.$store.state.home.userInfo
    // var arr = this.userInfo.avatar.split('.')
    if (storage.getItem('isLogin') === true || storage.getItem('isLogin') === 'true') {
      if (this.userInfo.avatar != '') {
        console.log('转换用户头像')
        this.getAvatarBy64(this.userInfo.avatar, 'avatar')
      }
      this.getShareCode()
    }
    if (this.$store.state.home.carnum > 0) {
      this.redShow = true
    }
    const that = this
    this.getPro()
    this.getCom()
    this.getRecomm()
    this.tabScroll()
    if (window.plus) {
      let System = window.plus
      System.share.getServices(
        function (s) {
          let shares = {}
          for (var i in s) {
            var t = s[i]
            shares[t.id] = t
          }
          that.sharewx = shares['weixin']
          console.log(that.sharewx)
        },
        function (e) {
          console.log('获取分享服务列表失败：' + e.message)
        }
      )
    }
  },
  methods: {
    ...mapMutations({
      setCarnum: 'SET_CARNUM'
    }),
    getAvatarBy64(imgUrl, type) {
      const that = this
      getAvatarBy64({
        url: imgUrl
      }).then(res => {
        if (res.isSuccess) {
          console.log(res)
          if (type == 'avatar') {
            that.showAvatar = true
            that.canvas_avatar = res.data
          } else {
            that.showPro = true
            that.canvas_pro_img = res.data
          }
        }
      })
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
            that.$router.replace({
              path: '/proDetailRec?type=normal&id=' + id
            })
          }
        })
      } else {
        that.$router.replace({
          path: '/proDetailRec?type=normal&id=' + id
        })
      }
    },
    // toImage() {
    //   console.log(document.getElementsByClassName('share_content_canvas')[0])
    //   console.log(document.getElementsByClassName('share_content_canvas')[0].offsetWidth)
    //   console.log(document.getElementsByClassName('share_content_canvas')[0].offsetHeight)
    //   const that = this
    //   Indicator.close()
    //   that.showShare = false
    //   var dom = document.getElementsByClassName('share_content_canvas')[0]
    //   console.log(this.$refs.imageTofile)
    //   var getPixelRatio = function (context) { // 获取设备的PixelRatio
    //     var backingStore = context.backingStorePixelRatio ||
    //         context.webkitBackingStorePixelRatio ||
    //         context.mozBackingStorePixelRatio ||
    //         context.msBackingStorePixelRatio ||
    //         context.oBackingStorePixelRatio ||
    //         context.backingStorePixelRatio || 1
    //     return (window.devicePixelRatio || 1) / backingStore
    //   }
    //   var _canvas = document.createElement('canvas')
    //   var ctx = _canvas.getContext('2d')
    //   var ratio = getPixelRatio(ctx)
    //   ctx.scale(ratio, ratio)
    //   var w = dom.offsetWidth
    //   var h = dom.offsetHeight
    //   console.log(w, h)
    //   // _canvas.width = w
    //   // _canvas.height = h
    //   _canvas.style.width = w * ratio + 'px'
    //   _canvas.style.height = h * ratio + 'px'
    //   console.log(dom)
    //   console.log(w, h)
    //   console.log(_canvas)
    //   that.$nextTick(() => {
    //     // 第一个参数是需要生成截图的元素,第二个是自己需要配置的参数,宽高等
    //     html2canvas(this.$refs.imageTofile, {
    //       backgroundColor: null,
    //       allowTaint: true,
    //       useCORS: true,
    //       logging: true,
    //       canvas: _canvas
    //     }).then((canvas) => {
    //       console.log(canvas)
    //       let url = canvas.toDataURL('image/png')
    //       that.htmlUrl = url
    //     })
    //   })
    //   // that.$nextTick(() => {
    //   //   // 加载头像图片
    //   //   // 图片地址 后面加时间戳是为了避免缓存
    //   //   var imgUrl = that.canvas_avatar
    //   //   // 创建对象
    //   //   var img = new Image()
    //   //   // 改变图片的src
    //   //   img.src = imgUrl

    //   //   // 加载完成执行
    //   //   img.onload = function() {
    //   //     // 加载产品图片
    //   //     var imgPro = that.canvas_pro_img
    //   //     // 创建对象
    //   //     var imgpro = new Image()
    //   //     // 改变图片的src
    //   //     imgpro.src = imgPro

    //   //     // 加载完成执行
    //   //     imgpro.onload = function() {

    //   //     }
    //   //   }
    //   // })
    // },
    goTop() {
      console.log('回到顶部')
      document.getElementById('pro').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
      this.choseName = 'pro'
    },
    // getShareCode() {
    //   let baseURL = ''
    //   let storage = window.localStorage
    //   if (process.env.NODE_ENV === 'development') {
    //     baseURL = '/api'
    //   } else {
    //     baseURL = process.env.BASE_URL
    //   }
    //   let url = baseURL + '/proDetail?uid=' + storage.getItem('token').split(';')[0].split('=')[1]
    //   let qrcode = new QRCode('qrcode', {
    //     width: 60, // 设置宽度
    //     height: 60, // 设置高度
    //     text: url
    //   })
    //   console.log(qrcode)
    // },
    getShareCode() {
      const that = this
      console.log(this.$route)
      let urlWithArgs = ''
      let options = this.$route.query
      let storage = window.localStorage
      for (var key in options) {
        var value = options[key]
        if (key == 'type') {
          key = 't'
          value = value.substring(0, 1)
        }
        console.log(storage.getItem('token'))
        if (key == 'uid') {
          if (storage.getItem('isLogin') === true || storage.getItem('isLogin') === 'true') {
            value = storage.getItem('token').split(';')[0].split('=')[1]
          } else {
            value = ''
          }
        }
        urlWithArgs += key + '=' + value + '&'
      }
      if (urlWithArgs.indexOf('uid=') == -1) {
        urlWithArgs += 'uid=' + storage.getItem('token').split(';')[0].split('=')[1]
      }
      var obj = {
        path: 'pages/proDetail/proDetail',
        url: urlWithArgs
      }
      console.log(obj)
      getQRcode(obj).then(res => {
        console.log('二维码成功加载')
        console.log(res)
        that.erweimasrc = 'data:image/png;base64,' + transformArrayBufferToBase64(res)
        that.codeShow = true
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
        if (this.allCom == false) {
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
          this.choseName = 'com'
        }
      } else {
        // document.querySelector('.pro_swiper').style.transform = 'translate(0px,' + (scrollTop) / 1.5 + 'px)'
        // document.querySelector('.pro_swiper .slide-img').style.transform = 'translate(0px,' + (scrollTop) / 1.5 + 'px)'
        // document.querySelector('.pro_swiper').style.transform('transform', 'translate(0px,' + (scrollTop) / 1.5 + 'px)')
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
        } else {

        }
      }
    },
    tohome() {
      // document.getElementById('pro').scrollIntoView(false)
      window.localStorage.setItem('backDetail', true)
      this.isShow = false
      // console.log(document.getElementsByTagName('canvas'))
      // if (document.getElementsByTagName('canvas').length > 0) {
      //   console.log(document.getElementsByTagName('canvas')[0])
      //   document.getElementsByTagName('canvas')[0].removeChild()
      // }
      // this.$router.replace({
      //   path: '/index'
      // })
      this.$router.goBack()
    },
    golink(url, id) {
      this.$router.togo({
        path: url + id
      })
    },
    goIndex(url) {
      this.$router.replace({
        path: url
      })
    },
    openCar(id) {
      if (this.activity.is_qualification) {
        if (id === 1) {
          this.buyType = 1
          this.modelShow = false
          document.querySelector('.pro_detail').style.top = -this.top + 'px'
          this.bindtop = -document.querySelector('.pro_detail').offsetTop
        }
      } else {
        Toast({
          message: '您不符合兑换/购买资格！',
          duration: 1000
        })
      }
    },
    buyNow(id) {
      console.log(this.activity.is_qualification)
      if (this.proType === 'group' || this.activity.is_qualification) {
        if (id === 0) {
          this.buyType = -1
          this.isgroup = 1
          this.modelShow = false
          document.querySelector('.pro_detail').style.top = -this.top + 'px'
          this.sale_type = this.activity_price_type
        } else if (id === 10) {
          this.buyType = -2
          this.modelShow = false
          this.isgroup = 0
          document.querySelector('.pro_detail').style.top = -this.top + 'px'
          this.sale_type = this.normal_price_type
          // 原价购商品默认选中
          if (this.default_chose_paytype === false) {
            if (parseInt(this.sale_type) >= 4) {
              this.default_price_type = 4
            } else if (parseInt(this.sale_type) === 2) {
              this.default_price_type = 2
            } else {
              this.default_price_type = 1
            }
          }
        }
        if (this.price_type === '' && id !== 10) {
          // 普通商品先选中支付方式再选择规格
          if (parseInt(this.sale_type) >= 4) {
            this.price_type = 4
          } else if (parseInt(this.sale_type) === 2) {
            this.price_type = 2
          } else {
            this.price_type = 1
          }
        }
        console.log(document.querySelector('.pro_detail').offsetTop)
        this.bindtop = -document.querySelector('.pro_detail').offsetTop
      } else {
        Toast({
          message: '您不符合兑换/购买资格！',
          duration: 1000
        })
      }
    },
    addColl(id) {
      var that = this
      if (window.localStorage.getItem('isLogin') === 'true' || window.localStorage.getItem('isLogin') === true) {
        if (this.allow_coll == true) {
          if (this.isColl === '') {
            that.allow_coll = false
            // 加入收藏
            collPro(id).then(res => {
              if (res.isSuccess) {
                that.isColl = res.data.collect_id
                Toast({
                  message: '收藏成功',
                  iconClass: 'iconfont icon-dui1',
                  duration: 1000
                })
                setTimeout(() => {
                  that.allow_coll = true
                }, 1000)
              } else {
                Toast({
                  message: res.msg,
                  duration: 1000
                })
                setTimeout(() => {
                  that.allow_coll = true
                }, 1000)
              }
            })
          } else {
            // 取消收藏
            cancleColl(id).then(res => {
              if (res.isSuccess) {
                that.isColl = ''
                Toast({
                  message: '取消收藏成功',
                  duration: 1000
                })
                setTimeout(() => {
                  that.allow_coll = true
                }, 1000)
              } else {
                Toast({
                  message: res.msg,
                  duration: 1000
                })
                setTimeout(() => {
                  that.allow_coll = true
                }, 1000)
              }
            })
          }
        }
      } else {
        let that = this
        window.plus.nativeUI.confirm('您当前未登录，是否立即前往登录', function (e) {
          if (e.index === 0 || e.index === '0') {
            that.$router.togo({
              path: '/login?back=1'
            })
          }
        }, {
          'title': '提示',
          'buttons': ['确定', '取消'],
          'verticalAlign': 'center'
        })
      }
    },
    share(img) {
      console.log('判断是否授权')
      let that = this
      let System = window.plus
      console.log(that.sharewx)
      if (img === false) {
        img = '_www/img/mp.png'
      }
      console.log('压缩后' + img)
      // let img = '_www/img/mp.png'
      // 正式 gh_a0cfbcaf8fa2 测试 gh_05718de312bd
      let linkURL = ''
      if (process.env.NODE_ENV === 'development') {
        linkURL = '/api'
      } else {
        linkURL = process.env.BASE_URL
      }
      let url = linkURL + 'downApp/downApp.html'
      let msg = {
        type: 'miniProgram',
        title: that.goods_info.name,
        thumbs: [img],
        content: '公主购：一个专注省钱的会员制电商平台~',
        miniProgram: {
          id: 'gh_a0cfbcaf8fa2',
          path: that.shareUrl,
          webUrl: url,
          type: 0 // 0-正式版； 1-测试版； 2-体验版
        },
        extra: {
          scene: 'WXSceneSession'
        }
      }
      console.log(msg)
      this.sharewx
        ? this.isAuth(msg)
        : System.nativeUI.alert('当前环境不支持微信分享操作!')
    },
    zipImg() {
      let that = this
      let System = window.plus
      if (that.goods_info.img !== '') {
        let downloadImg = System.downloader.createDownload(
          that.goods_info.img, {},
          function (d, status) {
            // 下载完成
            if (status === 200) {
              console.log(d)
              console.log('Download success: ' + d.filename)
              // let imgZip = System.io.convertLocalFileSystemURL(d.filename)
              let imgZip = '_doc/shareImg' + new Date().getTime() + '.jpg'
              console.log('压缩后的文件名' + imgZip)
              System.zip.compressImage({
                src: d.filename,
                dst: imgZip,
                quality: 50,
                format: 'jpg',
                width: '50%',
                height: '50%'
              },
              function (e) {
                console.log(e)
                console.log('压缩成功')
                that.share(e.target)
                // return '_www/img/mp.png'
              },
              function (err) {
                console.log(err)
                that.share(false)
                // return false
              }
              )
            } else {
              console.log('下载失败: ' + status)
              that.share(false)
              // return false
            }
          }
        )
        downloadImg.start()
      } else {
        that.share(false)
      }
    },
    saveImg(url) {
      console.log('测试保存图片')
      let type = 'png'
      let that = this
      let imgData = url
      var bitmap = new plus.nativeObj.Bitmap()
      let filename = 'news_picture_' + (new Date()).getTime() + '.' + type
      bitmap.loadBase64Data(imgData)
      // 保存Bitmap图片
      bitmap.save(
        '_doc/' + filename, {
          overwrite: true
        },
        function (i) {
          // 保存到系统相册
          plus.gallery.save(
            i.target,
            function (d) {
              Indicator.close()
              console.log('保存图片成功：' + JSON.stringify(d))
              // 销毁Bitmap图片
              that.fileUrl = '_doc/' + filename
              bitmap.clear()
              Toast({
                message: '图片已保存到相册',
                iconClass: 'iconfont icon-dui1',
                duration: 2000
              })
            },
            function (e) {
              Indicator.close()
              // 销毁Bitmap图片
              console.log('加载Base64图片数据失败：' + JSON.stringify(e))
              bitmap.clear()
              console.log('保存失败', i)
            }
          )
        },
        function () {
          bitmap.clear()
        }
      )
    },
    toImage() {
      const that = this
      console.log(this.htmlUrl)
      Indicator.open('图片保存中...')
      if (this.htmlUrl == '') {
        let headImg = that.$refs.share_head
        let code = that.$refs.share_qrcode
        let proImg = ''
        if (this.showPro) {
          proImg = that.$refs.share_pro_code
          that.drawCanvas(headImg, code, proImg)
        } else {
          // proImg = that.$refs.share_pro
          let proImg = new Image()
          proImg.src = that.proInfo.img
          proImg.onload = function() {
            that.drawCanvas(headImg, code, proImg)
          }
        }
      } else {
        console.log(this.htmlUrl)
        this.saveImg(this.htmlUrl)
      }
    },
    drawCanvas(headImg, code, proImg) {
      let that = this
      var _canvas = document.createElement('canvas')
      // var _canvas = document.getElementById('sharePro')
      var ctx = _canvas.getContext('2d')
      var getPixelRatio = function (context) { // 获取设备的PixelRatio
        var backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1
        return (window.devicePixelRatio || 1) / backingStore
      }
      var ratio = getPixelRatio(ctx)
      ctx.scale(ratio, ratio)
      // var w = dom.offsetWidth
      // var h = dom.offsetHeight
      _canvas.width = 308 * ratio
      _canvas.height = 448 * ratio
      _canvas.style.width = 308 * ratio + 'px'
      _canvas.style.height = 448 * ratio + 'px'
      // let bgImg = that.$refs.active_bg_img[that.$refs.mySwiper.swiper.realIndex]
      console.log(headImg)
      console.log(proImg)
      console.log(code)
      // let princessImg = that.$refs.active_princess[that.$refs.mySwiper.swiper.realIndex]
      // 绘制海报底部背景图
      // ctx.drawImage(bgImg, 0, 0, 307 * ratio, 380 * ratio)
      // 绘制白色底部
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, 308 * ratio, 448 * ratio)
      // 绘制头像
      var width = 58
      var height = 58
      var circle = {
        x: width / 2,
        y: height / 2,
        r: width / 2
      }
      // ctx.clearRect(circle.x * ratio, 4 * ratio, width * ratio, height * ratio)
      // 开始路径画圆,剪切处理
      ctx.save()
      ctx.beginPath()
      ctx.arc(circle.x * ratio + 15 * ratio, circle.y * ratio + 15 * ratio, circle.r * ratio, 0, Math.PI * 2, false)
      // 剪切路径
      ctx.clip()
      ctx.drawImage(headImg, 15 * ratio, 15 * ratio, width * ratio, height * ratio)
      // 恢复状态
      ctx.restore()

      // 绘制昵称
      // 文字填充颜色
      ctx.fillStyle = '#000'
      ctx.lineWidth = 1 * ratio
      ctx.font = 16 * ratio + 'px Adobe Ming Std'
      console.log(that.userInfo.nickname)
      var arr = that.userInfo.nickname.split('')
      let nameArr = ''
      if (arr.length > 11) {
        for (let i = 0; i < arr.length; i++) {
          if (i < 11) {
            nameArr += arr[i]
          }
        }
        nameArr += '...'
      } else {
        nameArr = that.userInfo.nickname
      }
      ctx.fillText(nameArr, 81 * ratio, 40 * ratio)
      // 文字填充颜色
      ctx.fillStyle = '#999'
      ctx.lineWidth = 1 * ratio
      ctx.font = 12 * ratio + 'px Adobe Ming Std'
      console.log(that.userInfo.nickname)
      ctx.fillText('推荐给你一个商品', 81 * ratio, 60 * ratio)

      // 绘制商品主图
      ctx.drawImage(proImg, 42 * ratio, 88 * ratio, 225 * ratio, 225 * ratio)

      // 绘制商品价格

      ctx.fillStyle = '#e13816'
      ctx.lineWidth = 1 * ratio
      ctx.font = 14 * ratio + 'px Adobe Ming Std'
      ctx.fillText('￥', 21 * ratio, 340 * ratio)

      ctx.fillStyle = '#e13816'
      ctx.lineWidth = 1 * ratio
      ctx.font = 30 * ratio + 'px Adobe Ming Std'
      ctx.fillText(that.proInfo.price_sell, 34 * ratio, 340 * ratio)
      let len = ctx.measureText('￥' + that.proInfo.price_sell).width

      // 绘制商品划线价
      ctx.fillStyle = '#bbb'
      ctx.lineWidth = 1 * ratio
      ctx.font = 16 * ratio + 'px Adobe Ming Std'
      ctx.fillText('￥' + that.proInfo.price_market, 34 * ratio + len, 340 * ratio)

      // 绘制商品划线
      let pricelen = ctx.measureText('￥' + that.proInfo.price_market).width
      ctx.strokeStyle = '#bbb'
      ctx.lineWidth = 1 * ratio
      ctx.moveTo(34 * ratio + len, 334 * ratio)
      ctx.lineTo(34 * ratio + len + pricelen, 334 * ratio)
      ctx.stroke()

      // 绘制商品标题that.canvas_title
      ctx.fillStyle = '#333'
      ctx.lineWidth = 1 * ratio
      ctx.font = 16 * ratio + 'px Adobe Ming Std'
      var text = that.proInfo.name // 这是要绘制的文本
      var chr = text.split('')
      var temp = ''
      var row = []
      console.log(chr)
      for (var a = 0; a < chr.length; a++) {
        if (ctx.measureText(temp).width < (200 * ratio)) {
          temp += chr[a]
        } else {
          a-- // 这里添加了a-- 是为了防止字符丢失，效果图中有对比
          row.push(temp)
          temp = ''
        }
      }
      console.log(ctx.measureText(temp).width)
      row.push(temp)
      if (row.length > 2) {
        var rowCut = row.slice(0, 2)
        var rowPart = rowCut[1]
        var test = ''
        var empty = []
        for (var a = 0; a < rowPart.length; a++) {
          if (ctx.measureText(test).width < (170 * ratio)) {
            test += rowPart[a]
          } else {
            break
          }
        }
        empty.push(test)
        var group = empty[0] + '...' // 这里只显示两行，超出的用...表示
        rowCut.splice(1, 1, group)
        row = rowCut
      }
      console.log(row)
      for (var b = 0; b < row.length; b++) {
        ctx.fillText(row[b], 18 * ratio, (b * 20 + 374) * ratio)
      }
      // if (that.canvas_title.length > 1) {
      //   ctx.fillText(that.canvas_title[0], 18 * ratio, 364 * ratio)
      //   ctx.fillText(that.canvas_title[1], 18 * ratio, 396 * ratio)
      // } else {
      //   ctx.fillText(that.canvas_title[0], 18 * ratio, 364 * ratio)
      // }
      let titleLen = ctx.measureText(row[0]).width

      // 绘制商品分享二维码
      ctx.drawImage(code, 20 * ratio + titleLen, 364 * ratio, 70 * ratio, 70 * ratio)
      let url = _canvas.toDataURL('image/png')
      that.htmlUrl = url
      that.saveImg(that.htmlUrl)
    },
    isAuth(msg) {
      console.log('判断是否授权')
      console.log(msg)
      if (this.sharewx.authenticated) {
        this.shareAction(msg)
      } else {
        this.sharewx.authorize(
          function () {
            this.shareAction(msg)
          },
          function (e) {
            console.log(e)
            if (e.code == -8) {
              Toast({
                message: '检测到您未安装微信，请通过应用商店下载',
                duration: 1000
              })
            }
            console.log('认证授权失败')
          }
        )
      }
    },
    shareAction(msg) {
      console.log('开始分享')
      console.log(msg)
      this.sharewx.send(
        msg,
        function () {
          console.log('分享成功')
          // Toast({
          //   message: '分享成功',
          //   iconClass: 'iconfont icon-dui1',
          //   duration: 1000
          // })
        },
        function (e) {
          console.log('失败失败啊' + e.message)
        }
      )
    },
    chose(type) {
      window.removeEventListener('scroll', this.handleScroll)
      this.choseName = type
      this.allCom = false
      console.log(type, this.choseName, '类型')
      this.$nextTick(() => {
        document.getElementById(type).scrollIntoView({
          block: 'start',
          behavior: 'smooth'
        })
      })
      clearInterval(this.timer)
      if (type === 'recommend') {
        this.timer = setTimeout(() => {
          this.tabScroll()
        }, 4000)
      } else {
        this.timer = setTimeout(() => {
          this.tabScroll()
        }, 1000)
      }
    },
    chosePriceType(type, id) {
      if (type === 0) {
        this.price_type = id
        this.chose_paytype = true
      } else {
        this.default_price_type = id
        this.default_chose_paytype = true
      }
    },
    closeModel() {
      this.modelShow = !this.modelShow
      document.querySelector('.pro_detail').style.top = ''
      window.scrollTo(0, this.bindtop)
      // this.tabScroll()
    },
    closeShare: function () {
      this.showShare = true
      this.allShare = true
      Indicator.close()
      document.querySelector('.pro_detail').style.top = ''
      window.scrollTo(0, this.bindtop)
    },
    toshare() {
      let that = this
      document.querySelector('.pro_detail').style.top = -this.top + 'px'
      this.bindtop = -document.querySelector('.pro_detail').offsetTop
      // if (this.htmlUrl == '') {
      //   Indicator.open('图片生成中...')
      // }
      console.log('二维码是否加载成功' + this.codeShow)
      console.log('产品主图是否加载成功' + this.showPro)
      console.log('头像是否加载成功' + this.showAvatar)
      if (this.allShare) {
        this.allShare = false
        if (this.codeShow) {
          console.log('二维码加载成功显示分享图')
          console.log('关闭加载中')
          that.showShare = false
          that.allShare = true
        } else {
          Indicator.open('加载中...')
          let urlWithArgs = ''
          let options = this.$route.query
          let storage = window.localStorage
          for (var key in options) {
            var value = options[key]
            if (key == 'type') {
              key = 't'
              value = value.substring(0, 1)
            }
            console.log(storage.getItem('token'))
            console.log(storage.getItem('token').split(';')[0].split('=')[1])
            if (key == 'uid') {
              if (storage.getItem('isLogin') === true || storage.getItem('isLogin') === 'true') {
                value = storage.getItem('token').split(';')[0].split('=')[1]
              } else {
                value = ''
              }
            }
            urlWithArgs += key + '=' + value + '&'
          }
          if (urlWithArgs.indexOf('uid=') == -1) {
            urlWithArgs += 'uid=' + storage.getItem('token').split(';')[0].split('=')[1]
          }
          var obj = {
            path: 'pages/proDetail/proDetail',
            url: urlWithArgs
          }
          getQRcode(obj).then(res => {
            console.log('请求内关闭加载中')
            that.erweimasrc = 'data:image/png;base64,' + transformArrayBufferToBase64(res)
            that.codeShow = true
            that.showShare = false
            that.allShare = true
            Indicator.close()
          })
          console.log('请求外关闭加载中')
          Indicator.close()
        }
      } else {
        console.log('不允许重复点击')
      }

      // if (this.allShare) {
      //   this.allShare = false
      //   console.log(this.allShare)
      //   if (this.showAvatar && this.codeShow && this.showPro) {
      //     if (this.htmlUrl == '') {
      //       this.$nextTick(() => {
      //         that.saveImg()
      //         this.toImage()
      //         that.saveImg()
      //       })
      //     } else {
      //       console.log('展示图片')
      //       that.showShare = false
      //       Indicator.close()
      //       that.saveImg()
      //     }
      //   } else if (!this.codeShow) {
      //     let urlWithArgs = ''
      //     let options = this.$route.query
      //     let storage = window.localStorage
      //     for (var key in options) {
      //       var value = options[key]
      //       if (key == 'type') {
      //         key = 't'
      //         value = value.substring(0, 1)
      //       }
      //       console.log(storage.getItem('token'))
      //       console.log(storage.getItem('token').split(';')[0].split('=')[1])
      //       if (key == 'uid') {
      //         if (storage.getItem('isLogin') === true || storage.getItem('isLogin') === 'true') {
      //           value = storage.getItem('token').split(';')[0].split('=')[1]
      //         } else {
      //           value = ''
      //         }
      //       }
      //       urlWithArgs += key + '=' + value + '&'
      //     }
      //     if (urlWithArgs.indexOf('uid=') == -1) {
      //       urlWithArgs += 'uid=' + storage.getItem('token').split(';')[0].split('=')[1]
      //     }
      //     var obj = {
      //       path: 'pages/proDetail/proDetail',
      //       url: urlWithArgs
      //     }
      //     console.log(obj)
      //     if (this.showAvatar && this.showPro) {
      //       console.log('主图和头像已经显示')
      //       getQRcode(obj).then(res => {
      //         that.erweimasrc = 'data:image/png;base64,' + transformArrayBufferToBase64(res)
      //         that.codeShow = true
      //         if (that.htmlUrl == '') {
      //           that.$nextTick(() => {
      //             that.toImage()
      //             that.saveImg()
      //           })
      //         } else {
      //           console.log('展示图片')
      //           Indicator.close()
      //           that.showShare = false
      //           that.saveImg()
      //         }
      //       })
      //     } else if (this.showAvatar && !this.showPro) {
      //       console.log('头像已经显示')
      //       getAvatarBy64({
      //         url: that.proInfo.img
      //       }).then(req => {
      //         if (req.isSuccess) {
      //           that.showPro = true
      //           that.canvas_pro_img = req.data
      //           getQRcode(obj).then(res => {
      //             that.erweimasrc = 'data:image/png;base64,' + transformArrayBufferToBase64(res)
      //             that.codeShow = true
      //             if (that.htmlUrl == '') {
      //               that.$nextTick(() => {
      //                 that.toImage()
      //                 that.saveImg()
      //               })
      //             } else {
      //               console.log('展示图片')
      //               Indicator.close()
      //               that.showShare = false
      //               that.saveImg()
      //             }
      //           })
      //         }
      //       })
      //     } else if (!this.showAvatar && this.showPro) {
      //       getAvatarBy64({
      //         url: that.userInfo.avatar
      //       }).then(req => {
      //         if (req.isSuccess) {
      //           that.showAvatar = true
      //           that.canvas_avatar = req.data
      //           getQRcode(obj).then(res => {
      //             that.erweimasrc = 'data:image/png;base64,' + transformArrayBufferToBase64(res)
      //             that.codeShow = true
      //             if (that.htmlUrl == '') {
      //               that.$nextTick(() => {
      //                 that.toImage()
      //                 that.saveImg()
      //               })
      //             } else {
      //               console.log('展示图片')
      //               Indicator.close()
      //               that.showShare = false
      //               that.saveImg()
      //             }
      //           })
      //         }
      //       })
      //     } else {
      //       getAvatarBy64({
      //         url: that.userInfo.avatar
      //       }).then(req => {
      //         if (req.isSuccess) {
      //           that.showAvatar = true
      //           that.canvas_avatar = req.data
      //           getAvatarBy64({
      //             url: that.proInfo.img
      //           }).then(e => {
      //             if (e.isSuccess) {
      //               that.showPro = true
      //               that.canvas_pro_img = e.data
      //               getQRcode(obj).then(res => {
      //                 that.erweimasrc = 'data:image/png;base64,' + transformArrayBufferToBase64(res)
      //                 that.codeShow = true
      //                 if (that.htmlUrl == '') {
      //                   that.$nextTick(() => {
      //                     that.toImage()
      //                     that.saveImg()
      //                   })
      //                 } else {
      //                   console.log('展示图片')
      //                   Indicator.close()
      //                   that.showShare = false
      //                   that.saveImg()
      //                 }
      //               })
      //             }
      //           })
      //         }
      //       })
      //     }
      //   } else {
      //     console.log(that.userInfo.avatar)
      //     getAvatarBy64({
      //       url: that.userInfo.avatar
      //     }).then(req => {
      //       if (req.isSuccess) {
      //         that.showAvatar = true
      //         that.canvas_avatar = req.data
      //         getAvatarBy64({
      //           url: that.proInfo.img
      //         }).then(e => {
      //           if (e.isSuccess) {
      //             that.showPro = true
      //             that.canvas_pro_img = e.data
      //             if (that.htmlUrl == '') {
      //               that.$nextTick(() => {
      //                 that.toImage()
      //                 that.saveImg()
      //               })
      //             } else {
      //               console.log('展示图片')
      //               Indicator.close()
      //               that.showShare = false
      //               that.saveImg()
      //             }
      //           }
      //         })
      //       }
      //     })
      //   }
      // } else {
      //   console.log('不允许重复点击')
      // }
    },
    showModel() {
      document.querySelector('.pro_detail').style.top = -this.top + 'px'
      this.bindtop = -document.querySelector('.pro_detail').offsetTop
      if (this.proType === 'group') {
        if (this.endTime != null && this.endTime <= 0) {
          // 团购已结束
          this.buyType = -2
          this.modelShow = false
          this.sale_type = this.normal_price_type
          if (this.default_chose_paytype === false) {
            if (parseInt(this.sale_type) >= 4) {
              this.default_price_type = 4
            } else if (parseInt(this.sale_type) === 2) {
              this.default_price_type = 2
            } else {
              this.default_price_type = 1
            }
          }
        } else {
          // 团购价
          this.buyType = -1
          this.modelShow = false
          this.sale_type = this.activity_price_type
          if (this.chose_paytype === false) {
            if (parseInt(this.sale_type) >= 4) {
              this.price_type = 4
            } else if (parseInt(this.sale_type) === 2) {
              this.price_type = 2
            } else {
              this.price_type = 1
            }
          }
        }
      } else if (this.isFlash === 1) {
        this.modelShow = false
        this.buyType = -1
      } else {
        this.modelShow = false
        this.buyType = 0
      }
    },
    choseType(id, pid) {
      var spec = []
      var specshow = []
      var slist = this.specList
      for (var i = 0; i < slist.length; i++) {
        if (slist[i].id === pid) {
          for (let j = 0; j < slist[i].list.length; j++) {
            slist[i].list[j].ischose = false
          }
          for (let j = 0; j < slist[i].list.length; j++) {
            if (slist[i].list[j].tid === id) {
              slist[i].list[j].ischose = true
            }
          }
        }
      }
      for (let i = 0; i < slist.length; i++) {
        for (let j = 0; j < slist[i].list.length; j++) {
          if (slist[i].list[j].ischose) {
            spec.push(slist[i].list[j].tid)
            specshow.push(slist[i].list[j].name)
          }
        }
      }
      let groupId = ''
      let getType = ''
      console.log(this.isgroup)
      if (this.isgroup == 1) {
        groupId = this.groupId
        getType = 'group'
      } else {
        getType = ''
      }
      console.log(groupId)
      var info = {
        goods_id: this.proInfo.goods_id,
        marketing_type: 0,
        group_id: groupId,
        get_type: getType,
        spec: spec.join(';')
      }
      var that = this
      getProduct(info).then(res => {
        if (res.isSuccess) {
          that.proInfo = res.data.product
          that.product_id = res.data.product.product_id
          that.maxNum = res.data.product.store
          that.default_spec = res.data.product
          that.spec_up = res.data.is_up
          if (res.data.product.price_market_from !== undefined) {
            that.price_market_from = res.data.product.price_market_from
            that.price_market = res.data.product.price_market
          }
          if (that.isgroup == 1) {
            that.activity.back_rebate = res.data.back_rebate
          }
          if (res.data.product.img !== '' && res.data.product.img !== null) {
            that.staticImg = res.data.product.img
          } else {
            that.staticImg = that.data.firstImg
          }
        }
      })
    },
    addNum: function (event) {
      let value = parseInt(this.specNum)
      value++
      this.specNum = value
    },
    changeValue(val) {
      console.log(this.specNum)
      var regu = '^[ ]+$'
      var re = new RegExp(regu)
      if (re.test(this.specNum)) {
        this.specNum = 1
      }
      if (this.specNum != '') {
        if (this.specNum.length > 0 && (typeof parseInt(this.specNum) !== 'number' || isNaN(parseInt(this
          .specNum)))) {
          Toast({
            message: '价格只能为数字',
            duration: 1000
          })
          this.specNum = 1
        } else {
          if (this.specNum > 99) {
            if (this.specNum > this.maxNum) {
              if (this.maxNum > 99) {
                Toast({
                  message: '该商品最多可购买99件~',
                  duration: 1000
                })
                this.specNum = 99
              } else {
                Toast({
                  message: '库存不足',
                  duration: 1000
                })
                this.specNum = this.maxNum
              }
            } else {
              Toast({
                message: '该商品最多可购买99件~',
                duration: 1000
              })
              this.specNum = 99
            }
          } else {
            if (this.specNum > this.maxNum) {
              this.specNum = this.maxNum
            } else {
              this.specNum = parseInt(this.specNum)
            }
          }
        }
        if (this.specNum <= 1) {
          this.specNum = 1
        }
      } else {
        this.specNum = 1
      }
    },
    lessNum: function (event) {
      let value = parseInt(this.specNum)
      if (value <= 1) {
        this.specNum = 1
      } else {
        value--
      }
      this.specNum = value
    },
    addCar: function (e) {
      var that = this
      if (window.localStorage.getItem('isLogin') === 'true' || window.localStorage.getItem('isLogin') === true) {
        if (that.allowbind) {
          that.allowbind = false
          if (
            that.$store.state.home.isbind === 'false' ||
              that.$store.state.home.isbind === false
          ) {
            // var pages = getCurrentPages() // 获取加载的页面
            // var currentPage = pages[pages.length - 1] // 获取当前页面的对象
            // var url = currentPage.route // 当前页面url
            // var options = currentPage.options
            // // 拼接url的参数
            // if (JSON.stringify(options) !== '{}') {
            //   var urlWithArgs = url + '?'
            //   for (var key in options) {
            //     var value = options[key]
            //     urlWithArgs += key + '=' + value + '&'
            //   }
            // } else {
            //   urlWithArgs = url
            // }
            // getApp().globalData.backUrl = urlWithArgs
            that.$router.togo({
              path: '/bind?visit=4'
            })
          } else {
            if (this.proType !== 'group' && !this.activity.is_qualification) {
              Toast({
                message: '您不符合兑换/购买资格！',
                duration: 1000
              })
              that.allowbind = true
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
                if (typelist[k] === false) {
                  flag = false
                }
              }
              if (this.buyType === 1 || e === 0) {
                // if (util.isLogin()) {
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
                    var info = {
                      pid: that.product_id,
                      quantity: that.specNum,
                      checked: 0,
                      deal_type: that.default_price_type
                    }
                    addCarofPro(info).then(res => {
                      if (res.isSuccess) {
                        Toast({
                          message: '加入购物车成功',
                          iconClass: 'iconfont icon-dui1',
                          duration: 1000
                        })
                        getCarList().then(req => {
                          that.setCarnum(req.data.rows_total)
                        })
                        // that.redShow = true
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
                // }
              } else if (this.buyType === -1 || e === 1) {
                // if (util.isLogin()) {
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
                    if (that.proType === 'group' && this.buyType === -1) {
                      let info = {
                        id: that.addgroup,
                        group_id: that.groupId,
                        product_id: that.product_id,
                        num: that.specNum,
                        deal_type: that.price_type
                      }
                      addCarofGroup(info).then(res => {
                        if (res.isSuccess) {
                          that.allowbind = true
                          window.localStorage.setItem('neworder', true)
                          this.$router.togo({
                            path: '/sureOrder?addType=2&proType=group&id=' +
                                that.product_id
                          })
                        } else {
                          Toast({
                            message: res.msg,
                            duration: 1000
                          })
                          setTimeout(function () {
                            that.modelShow = true
                            that.allowbind = true
                          }, 1000)
                        }
                      })
                    } else if (
                      that.proType === 'point' ||
                        that.proType === 'birthday'
                    ) {
                      // 生日兑换
                      that.isFlash = -2
                      let info = {
                        active: that.activity.id,
                        checked: that.product_id,
                        quantity: that.specNum,
                        deal_type: that.default_price_type
                      }
                      addCarofPoint(info).then(res => {
                        if (res.isSuccess) {
                          that.allowbind = true
                          window.localStorage.setItem('neworder', true)
                          this.$router.togo({
                            path: '/sureOrder?addType=3&proType=birthday&id=' +
                                that.product_id
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
                      var groupNormal = 1
                      console.log(e)
                      console.log(that.isFlash)
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
                        console.log(111)
                        // 普通商品立即购买，同时加入购物车，并结算，若未支付则留在购物车中
                        // let info = {
                        //   pid: that.product_id,
                        //   quantity: that.specNum,
                        //   checked: 0,
                        //   deal_type: that.default_price_type
                        // }
                        // addCarofPro(info).then(res => {
                        //   if (res.isSuccess) {
                        //     that.allowbind = true
                        //     window.localStorage.setItem('neworder', true)
                        //     this.$router.togo({
                        //       path: '/sureOrder?addType=0&id=' +
                        //           that.product_id +
                        //           '&group_normal=' +
                        //           groupNormal
                        //     })
                        //   } else {
                        //     Toast({
                        //       message: res.msg,
                        //       duration: 1000
                        //     })
                        //     setTimeout(function () {
                        //       that.allowbind = true
                        //     }, 1000)
                        //   }
                        // })
                        let info = {
                          pid: that.product_id,
                          num: that.specNum,
                          goods_id: that.goods_id,
                          deal_type: that.default_price_type
                        }
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
                      }
                    }
                  }
                }
                // }
              }
            }
            // }
          }
        }
      } else {
        let that = this
        window.plus.nativeUI.confirm('您当前未登录，是否立即前往登录', function (e) {
          if (e.index === 0 || e.index === '0') {
            that.$router.togo({
              path: '/login?back=1'
            })
          }
        }, {
          'title': '提示',
          'buttons': ['确定', '取消'],
          'verticalAlign': 'center'
        })
      }
    },
    moreGroup: function () {
      this.groupShow = false
    },
    closeGroup() {
      this.groupShow = true
    },
    viewAllCom() {
      //       wx.showLoading({
      //   title: '加载中',
      // })
      this.allCom = true
      this.choseName = 'com'
      this.loading = false
      this.autoOpen = true
      this.getCom()
    },
    viewImg() {},
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
    showService: function () {
      document.querySelector('.pro_detail').style.top = -this.top + 'px'
      this.bindtop = -document.querySelector('.pro_detail').offsetTop
      this.servershow = false
    },
    closeserver: function () {
      this.servershow = true
      document.querySelector('.pro_detail').style.top = ''
      window.scrollTo(0, this.bindtop)
    },
    previewImg(url) {
      this.imgShow = true
      this.img_show_big = url
    },
    hiddenImg() {
      this.imgShow = false
    },
    getPro() {
      let that = this
      var info = {
        id: this.goods_id,
        type: this.type
      }
      getProDetail(info).then(res => {
        Indicator.close()
        if (res.isSuccess) {
          that.proInfo = res.goods_info
          var numSize = Number(that.proInfo.price_market.length)
          that.FontWidth = numSize * 0.15 + 0.48
          // if (that.proInfo.img != '') {
          //   console.log('转换商品主图')
          //   that.getAvatarBy64(that.proInfo.img, 'pro_img')
          // }
          let proname = ''
          proname = that.proInfo.name.replace(/\s*/g, '')
          let arr = []
          if (proname.length > 0) {
            let str = ''
            // let strlen = 0
            // for (let i = 0; i < proname.length; i++) {
            //   let a = proname.charAt(i)
            //   if (a.match(/[^\x00-\xff]/ig) != null) {
            //     strlen += 2
            //   } else {
            //     strlen += 1
            //   }
            // }
            // console.log(strlen)
            let len = 0
            for (let i = 0; i < proname.length; i++) {
              let a = proname.charAt(i)
              if (a.match(/[^\x00-\xff]/ig) != null) {
                len += 2
              } else {
                len += 1
              }
              str += a
              if ( len % 26 == 0) {
                arr.push(str)
                str = ''
              }
            }
            if (str.length > 0) {
              arr.push(str)
            }
            console.log(arr)
            if (arr.length > 2) {
              arr[1] = arr[1].substring(0, 10)
              arr[1] += '...'
              that.canvas_title.push(arr[0])
              that.canvas_title.push(arr[1])
            } else {
              that.canvas_title = arr
            }
            console.log(arr)
          }
          // var arr = that.proInfo.img.split('.')
          // getBase64Image(that.proInfo.img, arr[arr.length - 1], function (base64) {
          //   console.log(base64) // base64编码值
          //   that.canvas_pro_img = base64
          // })
          that.sale_type = res.goods_info.deal_type
          that.goods_info = res.goods_info
          that.summary = res.goods_info.summary
          that.staticImg = res.product_default.img
          that.isColl = res.is_collect
          that.imgUrls = res.pic
          that.activity = res.marketing
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
          that.serviceTitle = res.goods_info.service_title
          if (res.goods_info.service_note != null) {
            let arrEntities = {
              'lt': '<',
              'gt': '>',
              'nbsp': ' ',
              'amp': '&',
              'quot': '"'
            }
            let str = res.goods_info.service_note
            that.serviceDetail = str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
              return arrEntities[t]
            })
          } else {
            that.serviceDetail = ''
          }
          that.proBuy = res.goods_info.purchase_note
          that.firstImg = res.goods_info.img
          that.activity_price_type = res.marketing.deal_type
          that.normal_price_type = res.goods_info.deal_type
          that.title_tips = res.site_exemption
          that.proDetail = that.intrDetail
          if (parseInt(res.goods_info.deal_type) >= 4) {
            that.price_type = 4
            that.default_price_type = 4
          } else if (parseInt(res.goods_info.deal_type) === 2) {
            that.price_type = 2
            that.default_price_type = 2
          } else {
            that.price_type = 1
            that.default_price_type = 1
          }
          if (res.product_default.price_market_from !== undefined) {
            that.price_market_from = res.product_default.price_market_from
            that.price_market = res.product_default.price_market
          }
          if (that.type === 'group') {
            if (res.allow_group.length > 0) {
              that.time = ''
              that.endTimeList = []
              that.endTime = ''
              var timearr = []
              for (var i = 0; i < res.allow_group.length; i++) {
                timearr.push(res.allow_group[i].countdown)
              }
              that.endTimeList = timearr
              var sectimeList = countDownList(timearr)
              that.time = setInterval(function () {
                for (var k = 0; k < timearr.length; k++) {
                  if (timearr[k] > 0) {
                    timearr[k] = --timearr[k]
                  } else {
                    timearr[k] = 0
                  }
                }
                that.endTimeList = timearr
                sectimeList = countDownList(timearr)
                that.saleTimeList = sectimeList
              }, 1000)
            }
            that.endTime = res.marketing.countdown
            that.groupTotal = res.allow_total
            that.groupList = res.allow_group
            that.isFlash = -1
            that.sale_type = res.marketing.deal_type
            that.group_start = res.marketing.status
            that.success_num = res.join_num
            if (res.allow_total >= 4) {
              that.g_list_height = 6.4
            } else {
              var height = 1.54 * res.allow_total
              that.g_list_height = height
            }
            if (parseInt(res.marketing.deal_type) >= 4) {
              that.price_type = 4
            } else if (parseInt(res.marketing.deal_type) === 2) {
              that.price_type = 2
            } else {
              this.price_type = 1
            }
            that.isShow = true
          } else {
            that.isShow = true
          }
          if (res.marketing === undefined) {
            that.groupId = ''
          } else {
            if (res.marketing.id !== undefined) {
              that.groupId = res.marketing.id
            } else {
              that.groupId = ''
            }
          }
          if (that.isFlash === 1 || that.isFlash === '1') {
            console.log('进入促销')
            that.time = ''
            that.endTime = ''
            that.saleTime = []
            var secTime = countDown(res.marketing.countdown)
            that.endTime = res.marketing.countdown
            that.saleTime = secTime
            that.time = setInterval(function () {
              secTime = countDown(--that.endTime)
              that.saleTime = secTime
            }, 1000)
          }
          if (
            res.spec_key_name !== undefined &&
              res.spec_key_nameval !== undefined
          ) {
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
            for (let item in that.specDetailList) {
              let dlist = []
              for (var key in that.specDetailList[item]) {
                dlist.push({
                  tid: item + ':' + key,
                  pid: item,
                  name: that.specDetailList[item][key],
                  ischose: false
                })
              }
              list.push({
                id: item,
                list: dlist
              })
            }
            for (let i = 0; i < arr.length; i++) {
              for (let j = 0; j < list.length; j++) {
                if (arr[i].id === list[j].id) {
                  arr[i].list = list[j].list
                }
              }
            }
            var spec = res.product_default.spec.split(';')
            for (let k = 0; k < spec.length; k++) {
              for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr[i].list.length; j++) {
                  if (arr[i].list[j].tid === spec[k]) {
                    arr[i].list[j].ischose = true
                    that.showSpec.push(arr[i].list[j].name)
                  }
                }
              }
            }
            that.proInfo.price_sell = res.product_default.price_sell
            if (
              res.product_default.bn !== '' &&
                res.product_default.bn != null
            ) {
              that.proInfo.bn = res.product_default.bn
            }
            that.specList = arr
          } else {
            that.flag = false
            that.product_id = res.product_info.product_id
            that.hasSpec = false
          }
          document.getElementById('top').scrollIntoView(false)
          // WxParse.wxParse('proDetail', 'html', proDetail, this, 10)
        }
      })
    },
    getRecomm() {
      let that = this
      getRecommByPro(this.goods_id).then(res => {
        if (res.isSuccess) {
          if (res.data.rows == null) {
            res.data.rows = []
          }
          that.recomList = res.data.rows
        }
      })
    },
    getCom() {
      let that = this
      var info = {
        goods_id: this.goods_id,
        page: this.page,
        limit: this.limit
      }
      getComList(info).then(res => {
        if (res.isSuccess) {
          // 商品详情少量评价
          that.comList = res.rows
          that.rate = res.rate
          that.comTotal = res.total
          // 全部评价
          this.comDetail = res.rows
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
    }
  },
  beforeDestroy() {
    // this.$refs.slider.$emit('autoplayStop')
    this.isShow = false
    Indicator.close()
    window.removeEventListener('scroll', this.handleScroll)
    clearInterval(this.time)
    this.time = ''
    this.endTimeList = []
    this.endTime = ''
  },
  computed: {
    ...mapGetters([
      'number',
      'carnum',
      'isbind',
      'score',
      'news',
      'newsnum',
      'issign'
    ])
  }
  // beforeDestroy() {
  //   this.$refs.slider.$emit('autoplayStop')
  //   clearInterval(this.time)
  // },
  // destroyed: function() {
  //   window.removeEventListener('scroll', this.handleScroll)
  // }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import "~styles/index.less";
  @import "~styles/variable.less";
  /*评论信息轮动*/

  .pro_information {
    position: fixed;
    z-index: 1;
    top: 140/100rem;
    width: 480/100rem;
    border-radius: 25/100rem;
    height: 50/100rem;
    background: rgba(255, 96, 96, 0.6);
    overflow: hidden;
  }

  .pro_information .pro_information_block {
    width: 480/100rem;
    height: 50/100rem;
    overflow: hidden;
  }

  .pro_information .pro_information_block .pro_information_blockInfo {
    width: 100%;
    padding-left: 6/100rem;
    height: 50/100rem;
    overflow: hidden;
  }

  .pro_information .pro_information_block .pro_information_blockInfo img {
    float: left;
    width: 40/100rem;
    height: 40/100rem;
    border-radius: 50%;
    margin-top: 5/100rem;
  }

  .pro_information .pro_information_block .pro_information_blockInfo span {
    float: left;
    padding-left: 10/100rem;
    width: 380/100rem;
    height: 50/100rem;
    line-height: 50/100rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 22/100rem;
    color: #fff;
  }

  .pro_detail {
    position: relative;
    background: #f0eff1;
    overflow-x: hidden;

    .head_top {
      height: 98/100rem;
      background: transparent;
      z-index: 10;
    }

    .pro_header {
      text-align: center;
      background: #f7f7f7;
      height: 94/100rem;
      line-height: 94/100rem;
      position: fixed;
      width: 100%;
      z-index: 100;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .pro_header_left {
        margin-left: 0.1rem;

        .iconfont {
          font-size: 0.42rem;
        }
      }

      .head_between {
        width: 10%;
      }

      .pro_header_nav {
        position: relative;

        span {
          font-size: 38/100rem;
          color: #393939;
          padding: 0 28/100rem;
          line-height: 94/100rem;
          display: inline-flex;
        }

        .text_active {
          border-bottom: 5/100rem solid #ff4e79;
          color: #ff4e79;
        }
      }

      .pro_header_icon {
        color: #707070;
        font-size: 38/100rem;
        overflow: hidden;
        display: flex;
        margin-right: 0.1rem;
        justify-content: center;

        button {
          float: left;
          padding: 0;
          background: transparent;
          outline: none;
          box-shadow: none;
          margin: 0 0.1rem;

          .iconofnt {
            padding: 0;
            padding-right: 26/100rem;
          }
        }
      }
    }

    .pro_body {
      .pro_info {
        margin-bottom: 10/100rem;

        .pro_swiper {
          width: 100%;
          height: 750/100rem;

          .slide-img {
            width: 750/100rem;
            height: 750/100rem;
          }
        }

        .pro_title {
          background: #fff;
          // margin-bottom: 10/100rem;

          .pro_price {
            font-family: "DIN";
            /* width: 280/100rem; */
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10/100rem 26/100rem;
            background: #fff;

            .pro_price_third {
              /* font-size: 24/100rem;
  color: #b8b8b8; */
              /* width: 68/100rem; */
              // height: 24/100rem;
              // line-height: 24/100rem;
              border: 2/100rem solid #ff4e79;
              font-size: 20/100rem;
              color: #ff4e79;
              border-radius: 5/100rem;
              display: inline-block;
              text-align: center;
              padding: 2/100rem 6/100rem;
              /* margin-left: 52/100rem; */
            }

            .pro_price_gift {
              // height: 24/100rem;
              // line-height: 24/100rem;
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

            .pro_sale_num {
              font-size: 24/100rem;
              color: #b8b8b8;
            }
          }

          .pro_name_block {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .pro_name {
              font-size: 38/100rem;
              background: #fff;
              padding: 0 26/100rem;
              padding-bottom: 10/100rem;

              .pro_name_icon {
                position: relative;
                float: left;
                margin-right: 10/100rem;

                span {
                  position: absolute;
                  font-size: 12/100rem;
                  color: #fff;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 64/100rem;
                  top: 27%;
                  text-align: center;
                }
              }

              .iconfont {
                color: #e2002e;
                font-size: 66/100rem;
                margin-right: 5px;
              }
            }

            .pro_name_right {
              text-align: center;
              width: 1rem;
              position: relative;

              button {
                display: inline-block;
                padding: 0;
                margin: 0;
                line-height: normal;
                z-index: 20;
                background: transparent;
                outline: none;
                box-shadow: none;
                margin-bottom: -10/100rem;

                i {
                  font-size: 38/100rem;
                }
              }

              span {
                color: #474747;
                font-size: 22/100rem;
                display: block;
                z-index: 30;
                text-align: center;
                margin-top: -0.1rem;
              }
            }
          }

          .group_top {
            padding-top: 40/100rem;
          }

          .pro_tips {
            font-size: 28/100rem;
            color: #707070;
            padding: 0 26/100rem;
            background: #fff;
          }

          .pro_pay_type {
            padding: 16/100rem 26/100rem;
            background: #fff;

            .pay_spec {
              button {
                margin-right: 20/100rem;
                color: #555;
                font-size: 24/100rem;
                background: #fff;
                border: 2/100rem solid #777;
                line-height: 0.52rem;
                height: 0.52rem;
                border-radius: 20/100rem;

                .iconfont {
                  display: inline-flex;
                  font-size: 24/100rem;
                }
              }

              button::after {
                border: none;
                box-shadow: none;
              }

              .button_click {
                color: #ff4e79;
                border: 2/100rem solid #ff4e79;

                .iconfont {
                  color: #ff4e79;
                }
              }
            }
          }

          .pro_price_group {
            /* justify-content: space-between; */
            display: block;
            background: #fff;
            padding: 0 26/100rem;
            padding-bottom: 10/100rem;

            .group_tags {
              font-size: 0.24rem;
              color: #121212;
              margin-right: 0.14rem;
            }

            .group_num {
              font-size: 24/100rem;
              color: #ff4e79;
              margin-right: 0;
            }
          }

          .pro_nowprice {
            font-size: 34/100rem;
            color: #313131;
            margin-right: 0;
          }

          .pro_group_img {
            margin-top: -6/100rem;

            .iconfont {
              font-size: 30/100rem;
              display: inline-flex;
              align-items: center;
            }
          }

          .pro_integral_group {
            font-size: 30/100rem;
            color: #313131;
          }

          .pro_orig_group {
            font-size: 24/100rem;
            color: #979797;
            text-decoration: line-through;
          }

          .i_level {
            position: relative;

            img {
              width: 38/100rem;
              height: 41/100rem;
            }
          }

          .pro_market {
            font-size: 28/100rem;
            color: #707070;
            padding: 0 26/100rem;
            background: #fff;
            padding-bottom: 10/100rem;
          }
        }

        .pro_title_tips {
          margin-top: -10/100rem;
          color: #666;
          font-size: 26/100rem;
          padding: 26/100rem;
          border-top: 1px solid #e0e0e0;
          background: #fff;
          margin-bottom: 10/100rem;
        }

        .pro_spec {
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

          span {
            color: #444;
            margin-left: 10/100rem;
            /* margin-right: -20/100rem; */
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 80/100rem;
          }

          .spec_icon {
            float: right;
            font-size: 30/100rem;
            font-weight: bold;

            /* width: 100/100rem; */
            i:nth-child(1) {
              color: #dcdcdc;
            }

            i:nth-child(2) {
              color: #bfbfbf;
            }

            i:nth-child(3) {
              color: #a8a8a8;
            }
          }
        }

        .pro_down_sale {
          width: 100%;
          font-size: 30/100rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-image: linear-gradient(to left, #ab0023 0%, #e4002f 100%);
          overflow: hidden;

          .pro_price {
            font-family: "DIN";
            width: 380/100rem;
            color: #fff;
            padding: 14/100rem 0;
            padding-left: 36/100rem;

            .iconfont {
              font-size: 30/100rem;
              font-weight: bold;
              display: inline-flex;
              color: #ffe790;
            }

            .group_num {
              font-size: 26/100rem;
              margin-right: 26/100rem;
            }

            .i_level {
              position: relative;

              img {
                width: 38/100rem;
                height: 41/100rem;
              }

              span {
                color: #fff;
                position: absolute;
                left: 50%;
                top: 35%;
                transform: translate(-50%, -50%);
                font-size: 18/100rem;
                font-weight: bold;
                font-family: "DIN";
              }
            }

            .peo_nowprice {
              font-size: 30/100rem;
              margin-right: 6/100rem;
            }

            .pro_integral {
              font-size: 30/100rem;
            }

            .pro_inter_img {
              display: inline-flex;

              .iconfont {
                color: #ffe790;
                font-size: 30/100rem;
                font-weight: bold;
              }
            }

            span {
              font-size: 24/100rem;
            }

            .pro_orig {
              font-size: 24/100rem;
              text-decoration: line-through;
            }

            .pro_num {
              font-size: 24/100rem;
              margin-left: 20/100rem;
              /* margin-right: 14/100rem; */
            }
          }

          .pro_right {
            background: #f7f7f7;
            padding: 20/100rem 30/100rem;

            .pro_time {
              text-align: center;

              .title {
                display: block;
                color: #e2002e;
                font-size: 24/100rem;
              }

              .time {
                color: #fff;
                background: #e2002e;
                min-width: 24/100rem;
                padding: 0 4/100rem;
                height: 32/100rem;
                display: inline-flex;
                align-content: center;
                justify-content: center;
                border-radius: 6/100rem;
                font-family: "DIN";
                margin: 0 4/100rem;
                font-size: 24/100rem;
              }

              .text {
                /* color: #ff4e79; */
                color: #e2002e;
                font-size: 26/100rem;
              }
            }

            .pro_prop {
              .prop_bg {
                width: 96%;
                height: 10/100rem;
                border-radius: 10/100rem;
                margin-top: 6/100rem;
                background: #efefef;

                span {
                  background: #ff4e79;
                  width: 60%;
                  height: 10/100rem;
                  display: flex;
                  border-radius: 10/100rem;
                }
              }
            }
          }
        }
      }

      /* 团购规则 */

      .pro_group_tips {
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

      .pro_group {
        padding: 0 26/100rem;
        background: #fff;
        margin-bottom: 10/100rem;

        .group {
          display: flex;
          align-items: center;
          justify-content: space-between;

          div {
            font-size: 24/100rem;
            color: #313131;

            .group_img {
              width: 80/100rem;
              height: 80/100rem;
              border-radius: 50%;
              margin-right: 14/100rem;
            }

            .group_num {
              font-size: 24/100rem;
              color: #ff4e79;
            }

            .time {
              width: 28/100rem;
              display: inline-flex;
            }
          }

          .group_user {
            display: inline-flex;
            align-items: center;
            width: 340/100rem;

            span {
              color: #313131;
              font-size: 28/100rem;
            }
          }

          button {
            background: #ff4e79;
            color: #fff;
            font-size: 0.24rem;
            border-radius: 0.2rem;
            margin: 0;
          }

          button::after {
            border: none;
          }
        }
      }

      .pro_group_title {
        padding: 30/100rem 26/100rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #fff;
        border-bottom: 1px solid #e0e0e0;

        span {
          font-size: 30/100rem;
          color: #333;
        }

        div {
          display: inline-flex;
          align-items: center;

          span {
            font-size: 0.24rem;
            color: #989898;
          }

          .iconfont {
            color: #989898;
            display: inline-flex;
            align-items: center;
          }
        }
      }
    }

    .pro_com {
      background: #fff;

      .com_head {
        padding: 0 26/100rem;
        height: 80/100rem;
        line-height: 80/100rem;
        border-bottom: 1px solid #eae8eb;
        display: flex;
        align-items: center;
        justify-content: space-between;

        span {
          font-size: 26/100rem;
          color: #adadad;
        }

        .head_right {
          float: right;
          font-size: 24/100rem;
          color: #525252;

          span {
            color: #ff4e79;
            font-family: "DIN";
          }

          i {
            color: #979797;
            // margin-left: 16/100rem;
          }
        }
      }

      .com_list {
        margin-bottom: 10/100rem;

        .com_tips {
          font-size: 26/100rem;
          padding: 26/100rem;
        }

        .com_info {
          padding: 0 26/100rem;
          border-bottom: 1px solid #eae8eb;

          .com_info_head {
            margin-top: 30/100rem;
            margin-bottom: 20/100rem;
            display: flex;
            justify-content: space-between;
            align-content: center;
            height: 52/100rem;
            line-height: 52/100rem;

            .user_info {
              display: flex;
              align-items: center;
              img {
                width: 42/100rem;
                height: 42/100rem;
                border-radius: 50%;
                vertical-align: middle;
              }

              span {
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
            }

            .star_level {
              i {
                color: #ff4e79;
              }

              .light {
                color: #ff4e79;
              }
            }
          }

          .com_content {
            span {
              font-size: 24/100rem;
              color: #555;
              word-wrap: break-word;
            }
          }

          .com_img {
            margin-top: 38/100rem;
            margin-bottom: 43/100rem;

            img {
              width: 176/100rem;
              height: 176/100rem;
              margin-right: 12/100rem;
            }
          }
        }

        .com_btn {
          text-align: center;
          padding: 30/100rem 26/100rem;

          button {
            color: #868686;
            font-size: 26/100rem;
            border: 1px solid #cbcbcb;
            background: #fff;
            width: 100%;
            height: 0.7rem;
          }

          button::after {
            border: none;
            box-shadow: none;
          }
        }
      }
    }

    .pro_show {
      background: #fff;
      padding: 20/100rem 0;
      min-height: 11rem;

      .show_head {
        text-align: center;
        color: #949494;
        font-size: 28/100rem;

        .header_nav {
          margin: 42/100rem 0;
          text-align: center;

          span {
            color: #949494;
            font-size: 26/100rem;
            padding: 0 44/100rem;
          }

          .nav_text_active {
            color: #ff4e79;
          }
        }
      }

      .pro_img {
        text-align: center;
        // padding: 0 20/100rem;
        position: relative;

        .pro_html {
          img {
            width: 100px;
          }
        }
      }
    }

    /* 推荐商品 */

    // .pro_recomm {}

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
      margin-bottom: 0.5rem;
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
      padding: 2/100rem 8/100rem;
    }

    .recom_list .pro_price .line {
      text-decoration: line-through;
      /* margin-left: 14/100rem; */
    }

    .recom_list .pro_price .pro_count {
      font-size: 23/100rem;
      color: #888;
    }

    // .recom_list .pro_price .pro_flex {
    // }

    .recom_list .pro_price .pro_flex i {
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
    // .pro_com_detail_bg {
    // }

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
      width: 5.6rem;
    }

    .com_detail_name .com_detail_star {
      display: flex;
      align-items: center;
    }

    .com_detail_name .com_detail_star .iconofnt {
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
      font-family: "DIN";
      display: block;
    }

    .com_detail_info .com_detaul_oper {
      font-size: 28/100rem;
      color: #373737;
      font-family: "DIN";
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

    .null_view {
      height: 100/100rem;
      background: #f2f2f2;
    }

    .pro_btn {
      box-shadow: 0 0.08rem 0.2rem 0.1rem #E8E8E8;
      position: fixed;
      bottom: 0;
      height: 128/100rem;
      display: flex;
      align-items: center;
      width: 100%;
      background: #fff;

      .btn_blcok {
        width: 34%;
        display: flex;
        justify-content: center;

        .btn_text {
          font-size: 18/100rem;
          color: rgba(0, 0, 0, .5);
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100/100rem;
          text-align: center;
          font-family: 'DIN';
        }

        button {
          width: 50%;
          background: #fff;
          border: none;
          box-shadow: none;
          padding: 0;
        }

        .show_car {
          width: 1.2rem;
          height: 1rem;
          padding: 0;

          i {
            color: #333;
            font-size: 48/100rem;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 15%;
          }

          .badge {
            position: absolute;
            margin: 0;
            top: 0;
            right: 10%;
            padding: 0.03rem;
            text-align: center;
            width: 0.3rem;
            height: 0.3rem;
            border-radius: 50%;
            background: #f43530;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;

            span {
              font-size: 0.18rem;
              color: #fff;
              font-family: "DIN";
            }
          }

        }

        .show_share {
          height: 1rem;
          padding: 0;

          i {
            color: #333;
            font-size: 48/100rem;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 15%;
          }
        }

      }

      .share_save {
        width: 2.8rem;
        display: flex;
        justify-content: center;

        .show_span {
          display: block;
          color: #fff;
          width: 100%;
          margin-top: -0.1rem;
          text-align: center;
        }

        .litle_span {
          font-size: 0.24rem;
          display: block;
          color: #fff;
          width: 100%;
          height: 0.3rem;
          text-align: center;
        }
      }

      .border-radius {
        border-radius: 0.5rem;
      }

      .pro_server {
        width: 34%;
        overflow: hidden;
        height: 100/100rem;
      }

      .pro_one {
        width: 1.5rem !important;
        margin-right: 0.2rem;
      }

      .width {
        width: 4.64rem !important;
      }

      .width_long {
        width: 5.64rem !important;
      }

      button::after {
        border: none;
        box-shadow: none;
      }

      button {
        color: #fff;
        height: 88/100rem;
        // line-height: 100/100rem;
        border-radius: 0;
        font-size: 32/100rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .pro_buy {
        background-image: linear-gradient(to left, #FF2B90 0%, #FF4E79 100%);
        margin-right: 20/100rem;
        margin-left: -20/100rem;
      }

      .pro_buy_dis {
        background: #d3d3d3;
        margin-right: 20/100rem;
        margin-left: -20/100rem;
      }

      .add_car {
        background-image: linear-gradient(to left, #000000 0%, #373B44 100%);
        margin-right: 0;
      }

      .add_car_group {
        background-image: linear-gradient(to left, #000000 0%, #373B44 100%);
        margin-right: 0;
      }

      .pro_buy_group {
        background-image: linear-gradient(to left, #FF2B90 0%, #FF4E79 100%);
        margin-left: 0;
      }

      .border-left {
        border-top-left-radius: 0.5rem !important;
        border-bottom-left-radius: 0.5rem !important;
      }

      .border-right {
        border-top-right-radius: 0.5rem !important;
        border-bottom-right-radius: 0.5rem !important;
      }

      .group_buy {
        width: 2.82rem !important;
        display: flex;
        justify-content: center;

        .show_span {
          display: block;
          color: #fff;
          width: 100%;
          margin-top: -0.1rem;
          text-align: center;
        }

        .litle_span {
          font-size: 0.24rem;
          display: block;
          color: #fff;
          width: 100%;
          height: 0.3rem;
          text-align: center;
        }
      }
      .left_none {
        margin-left: 0;
      }
      .right_none {
        margin-right: 0;
      }
    }
  }

  .pro_detail_fixed {
    position: fixed;
    width: 100%;
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

    .spec_head {
      height: 162/100rem;
      padding: 0 26/100rem;

      .spec_close {
        position: absolute;
        right: 26/100rem;
        top: 6/100rem;
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

        img {
          width: 140/100rem;
          vertical-align: middle;
        }
      }

      .spec_pro_price {
        font-family: "DIN";
        display: flex;
        align-items: center;
        margin-left: 180/100rem;
        margin-top: 24/100rem;

        .spec_pro_nowprice {
          color: #ff4e79;
          font-size: 30/100rem;
          font-weight: bold;
        }

        .spec_pro_integral {
          font-size: 30/100rem;
          color: #ff4e79;
          font-weight: bold;
        }

        .spec_pro_inter_img {
          display: flex;
          align-items: flex-end;
          margin-left: 9/100rem;

          .iconfont {
            font-size: 30/100rem;
            display: inline-flex;
            color: #ff4e79;
            font-weight: bold;
          }
        }

        span {
          font-size: 24/100rem;
          color: #b8b8b8;
        }
      }

      .spec_pro_code {
        font-size: 26/100rem;
        color: #9d9d9d;
        margin-left: 186/100rem;
        margin-top: 10/100rem;
        display: flex;
        justify-content: space-between;

        .spec_pro_orig {
          font-size: 24/100rem;
          color: #b8b8b8;
          text-decoration: line-through;
        }
      }
    }

    .spec_body {
      padding: 0 26/100rem;
      overflow-y: scroll;
      width: 700/100rem;
      height: calc(80vh - 160px);

      .spec_title {
        color: #9d9d9d;
        font-size: 24/100rem;
        margin-bottom: 20/100rem;
      }

      .spec_type {
        margin-bottom: 30/100rem;

        button {
          margin-right: 20/100rem;
          margin-bottom: 10/100rem;
          color: #555;
          font-size: 24/100rem;
          background: #fff;
          border: 2/100rem solid #777;
          // line-height: 2;
          min-width: 116/100rem;

          .iconfont {
            display: inline-flex;
            font-size: 24/100rem;
          }
        }

        button::after {
          border: none;
          box-shadow: none;
        }

        .button_click {
          color: #ff4e79;
          border: 2/100rem solid #ff4e79;

          .iconfont {
            color: #ff4e79;
          }
        }
      }

      .spec_num {
        margin-bottom: 62/100rem;

        span {
          color: #9d9d9d;
          font-size: 24/100rem;
          margin-bottom: 20/100rem;
        }

        .pro_icon {
          margin-right: 4/100rem;
          display: flex;
          border: 1px solid #ccc;
          border-radius: 6/100rem;
          float: right;
          width: 164/100rem;

          button {
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
            // background: #f3f3f3;
            background: transparent;
          }
          .mint-button.is-disabled{
            background: #f3f3f3 !important;
          }
          button::after {
            border: none;
            box-shadow: none;
          }

          input {
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
            font-family: "DIN";
          }
        }
      }
    }

    .spec_btn_bg {
      padding: 0 30/100rem;
      padding-bottom: 60/100rem;

      .spec_btn {
        display: flex;
        align-items: center;
        width: 100%;

        .pro_buy {
          width: 50%;
          background-image: linear-gradient(to left, #FF2B90 0%, #FF4E79 100%);
          color: #fff;
          font-size: 32/100rem;
          border-radius: 0;
          height: 88/100rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .add_car {
          width: 50%;
          background-image: linear-gradient(to left, #000000 0%, #373B44 100%);
          color: #fff;
          height: 88/100rem;
          font-size: 32/100rem;
          border-radius: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .surebtn {
          width: 100%;
          background-image: linear-gradient(to left, #FF2B90 0%, #FF4E79 100%);
          color: #fff;
          height: 88/100rem;
          font-size: 32/100rem;
          border-radius: 50/100rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .surebtn_false {
          width: 100%;
          background: #d3d3d3;
          color: #fff;
          font-size: 32/100rem;
          border-radius: 50/100rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        button::after {
          border: none;
          box-shadow: none;
        }

        .border-left {
          border-top-left-radius: 0.5rem !important;
          border-bottom-left-radius: 0.5rem !important;
        }

        .border-right {
          border-top-right-radius: 0.5rem !important;
          border-bottom-right-radius: 0.5rem !important;
        }
      }
    }

  }

  .pro_service {
    padding: 0 26/100rem;
    font-size: 26/100rem;
    color: #444;
    /* border-top: 1px solid #eae8eb; */
    background: #fff;
    margin-top: 10/100rem;
  }

  .pro_service_t {
    height: 60/100rem;
    line-height: 60/100rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pro_service_t .pro_service_t_r {
    color: #979797;
  }

  .pro_service_t .pro_service_t_r i {
    margin-left: 16/100rem;
    font-size: 24/100rem;
    color: #979797;
  }

  .pro_service_b {
    font-size: 22/100rem;
    padding-bottom: 20/100rem;
    color: #333;
  }

  .pro_service_b span {
    display: inline-block;
    padding: 0 10/100rem;
  }

  /*服务弹框*/

  .pro_server_bg {
    position: fixed;
    z-index: 202;
    width: 100%;
    height: 100%;
    top: 0;
    background: rgba(0, 0, 0, 0.4);
  }

  .pro_server_detail {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 804/100rem;
    background: #fff;
    padding-top: 10/100rem;
    border-radius: 20/100rem 20/100rem 0 0;
    z-index: 203;
  }

  .pro_server_detail .pro_server_detail_t {
    font-size: 42/100rem;
    color: #333;
    line-height: 126/100rem;
    border-bottom: 1/100rem solid #bfbfbf;
    text-align: center;
  }

  .pro_server_detail .pro_server_detail_c {
    padding: 0 48/100rem;
  }

  .pro_server_detail .pro_server_detail_c div {
    padding: 25/100rem 0 30/100rem 0;
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
    width: 100%;
    height: 100%;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 202;
    max-height: 880/100rem;

    .group_model_body {
      background: #fff;
      width: 640/100rem;
      max-height: 820/100rem;
      border-radius: 20/100rem;
      // margin: 31/100rem 60/100rem;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      .group_model_icon {
        /* float: right; */
        position: absolute;
        top: -5%;
        right: -5%;
        height: 0.62rem;
        z-index: 10;
      }

      .group_model_title {
        text-align: center;
        font-size: 32/100rem;
        color: #040404;
        padding: 30/100rem 0;
        border-bottom: 1px solid #e0e0e0;
      }

      .group_model_list {
        padding: 0 20/100rem;
        width: 600/100rem;

        .group_block {
          height: 154/100rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e0e0e0;

          .group_block_left {
            display: inline-flex;
            align-items: center;

            .group_img {
              width: 98/100rem;
              height: 98/100rem;
              border-radius: 50%;
              margin-right: 14/100rem;
            }

            .group_name {
              display: inline-block;
              font-size: 28/100rem;
              color: #333;
              margin-right: 14/100rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              max-width: 180/100rem;
            }

            .group_num {
              font-size: 20/100rem;
              color: #666;
            }

            .group_right_time {
              font-size: 22/100rem;
              color: #666;
            }
          }

          .group_block_right {
            button {
              background: #ff4e79;
              color: #fff;
              font-size: 24/100rem;
              border-radius: 20/100rem;
              margin: 0;
            }
          }
        }
      }
    }
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

  /*分享连接*/
  .model_share {
    position: fixed;
    top: 0/100rem;
    width: 100%;
    height: 100%;
    z-index: 1001;
  }

  .s_share_bg {
    position: fixed;
    top: 0/100rem;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999;
  }

  .s_share {
    position: fixed;
    top: 0/100rem;
    width: 100%;
    height: 100%;
    z-index: 998;
    overflow: hidden;
  }

  .s_share button {
    background: transparent;
    position: absolute;
    width: 2rem;
    bottom: 0.5rem;
    z-index: 999;
    height: 2rem;
    border: none;
    box-shadow: none;
  }

  .share_content {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -551/100rem);
    width: 616/100rem;
    position: absolute;
    z-index: 1000;
    background: #fff;
  }

  .share_content_canvas {
    padding-bottom: 60/100rem;
  }

  .share_content .s_con_user {
    clear: both;
    overflow: hidden;
    padding: 30/100rem 0 24/100rem 30/100rem;
  }

  .s_con_user .s_con_user_img {
    float: left;
    width: 116/100rem;
    height: 116/100rem;
    border-radius: 50%;
  }

  .s_con_user .s_con_use_tit {
    float: left;
    padding: 22/100rem 0 0 16/100rem;
  }

  .s_con_user .s_con_use_tit span:nth-child(1) {
    display: block;
    font-size: 33/100rem;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 390/100rem;
  }

  .s_con_user .s_con_use_tit span:nth-child(2) {
    display: block;
    font-size: 24/100rem;
    color: #999;
    line-height: 44/100rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 390/100rem;
  }

  .s_con_showImg {
    width: 450/100rem;
    margin: 0 auto;
  }

  .s_con_showImg img {
    width: 450/100rem;
    height: 450/100rem;
  }

  .s_con_price {
    clear: both;
    overflow: hidden;
    font-size: 30/100rem;
    color: #bbb;
    padding: 18/100rem 42/100rem 0;
  }

  .s_con_price .s_con_price_l {
    float: left;
    color: #e13816;
  }

  .s_con_price .s_con_price_r {
    float: left;
    position: relative;
    padding: 26/100rem 0 0 20/100rem;
    // text-decoration: line-through;
  }

  .s_con_price .s_con_price_l span:nth-child(2) {
    display: inline-block;
    font-size: 60/100rem;
    color: #e13816;
    line-height: 67/100rem;
  }

  .s_con_price .s_con_price_r span.xiexian {
    position: absolute;
    height: 0.02rem;
    top: 70%;
    background: #bbb;
  }

  .s_con_title {
    font-size: 30/100rem;
    color: #333;
    // display: -webkit-box;
    // -webkit-box-orient: vertical;
    // -webkit-line-clamp: 2;
    // overflow: hidden;
    padding: 10/100rem 0 0 44/100rem;
    line-height: 44/100rem;
    margin-bottom: 20/100rem;
    width: 420/100rem;

    span {
      display: block;
    }
  }

  .s_con_new {
    padding: 0 44/100rem 0;
  }

  .s_con_new span {
    display: inline-block;
    padding: 0 22/100rem;
    height: 44/100rem;
    border-radius: 22/100rem;
    background: #ff8383;
    color: #fff;
    font-size: 24/100rem;
    line-height: 42/100rem;
    text-align: center;
  }

  .wx_sao {
    position: absolute;
    bottom: 30/100rem;
    right: 20/100rem;
  }

  .wx_sao img {
    width: 126/100rem;
    height: 126/100rem;
  }

  .share_b {
    position: fixed;
    bottom: 0;
    display: flex;
    width: 100%;
    font-size: 35/100rem;
    z-index: 999;
    background: #fff;
  }

  .share_wx {
    // width: 50%;
    // border-radius: 0;
    // background: #ff4e79;
    // color: #fff;
    left: 1.4rem;
  }

  .s_share button i {
    font-size: 0.88rem;
    color: #fff;
  }

  .s_share button span {
    font-size: 0.24rem;
    color: #fff;
    position: absolute;
    transform: translateX(-50%);
    left: 50%;
    bottom: 0.1rem;
    width: 1.5rem;
    text-align: center;
  }

  .share_b_bottom {
    padding-bottom: 68/100rem;
  }

  .save_img {
    // width: 50%;
    // border-radius: 0;
    // background: #f2f2f2;
    // color: #333;
    right: 1.4rem;
  }

  .s_share .close {
    position: absolute;
    top: 0.1rem;
    right: 10/100rem;
  }

  .s_share .close i {
    font-size: 34/100rem;
  }

  .can_content {
    position: absolute;
    width: 616/100rem;
    height: 918/100rem;
    /* display: none; */
  }

</style>
