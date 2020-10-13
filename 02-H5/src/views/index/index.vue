<template>
  <!-- <common-header :h_title="h_title" :showback="false"></common-header> -->
  <div :class="red_show?'index_bg index_fixed':'index_bg'">
    <!-- 签到按钮 -->
    <div class='sign_bg' @click="goSign" v-if='!isSign'>
      <img :src='imgPath+"pro/signIn.png"'/>
    </div>
    <!-- 返回顶部按钮 -->
    <return-top @returnTop='goTop'></return-top>
    <!-- 首页顶部搜索框 -->
    <div :class="top?'fixed_head i_header_bg':'fixed_head'">
      <div class='icon_bg' @click="goProtype">
        <i class='iconfont  icon-kuaijiecaidan'></i>
      </div>
      <div :class="top?'search search_bg':'search'">
        <i class='iconfont icon-search'></i>
        <span @click='searchHis'>搜索喜欢的商品</span>
        <i class='iconfont icon-saoma' @click='scan' style='float:right'></i>
      </div>
      <div class='icon_bg' @click="goLink('/news')">
        <div class='icon_radio' v-if='$store.state.home.news'>
          <span>{{$store.state.home.newsnum}}</span>
        </div>
        <i class='iconfont icon-xiaoxioff'></i>
      </div>
    </div>
    <!-- 首页轮播图 -->
    <div class='index_head' id="top" ref='top' :style="{height:swiper_height+'rem'}">
      <mt-swipe :auto="3000" :speed='500' :defaultIndex='0' :continuous='true' class='swiper_bg'>
        <mt-swipe-item v-for="(item,index) in headBg" :key='index'>
          <img :src="item.image_pc" class='swiper_bg_img' @click="imgLink(item)">
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <!-- <div class='index_head' id="top" ref='top' :style="{height:swiper_height+'rem'}">
      <swiper :options="swiperOption">
        <swiper-slide v-for="(item,index) in headBg" :key='index'>
          <img :src="item.image_pc" class='swiper_bg_img' @click="imgLink(item)">
        </swiper-slide>
      </swiper>
    </div> -->
    <!-- 首页菜单栏 -->
    <ul class='index_nav'>
      <li v-for="(navItem,index) in comNav" :key='index' @click="goPage(navItem)">
        <a href="javascript:void(0);">
          <img :src="navItem.img" alt="" srcset="">
          <span>{{navItem.title}}</span>
        </a>
      </li>
    </ul>
    <!--新人专享福利-->
    <div class='i_newPeople_bg' v-if="shownewpeople!=0">
    <!-- <div class='i_newPeople_bg'> -->
      <img :src='newPeopleImg' @click="goLink('/newPeople')" />
    </div>
    <!-- 水果专区banner -->
    <div class='i_banner_bg' v-if="showFruit=='true'">
      <img :src='fruitImg' @click="goLink('/fruitArea')" />
    </div>
    <!-- 首页中奖列表 -->
    <div class='index_win_bg' v-if="haswinList&&showWin=='true'">
      <div class='index_win'>
        <div class='win_bg_left'>
          <img :src='imgPath+"pro/i_w_left.png"' class='i_win_left' />
        </div>
        <div class='win_bg_right'>
          <slider ref="slider" :options="options" @slide='slide'>
            <slideritem v-for="(item,index) in winList" :key="index" class='win_block' catchtouchmove='catchTouchMove'>
              <div class='win_block_info'>
                <span class='i_win_mobile'>{{item.mobile}}</span>
                <span class='i_win_name'>{{item.name}}</span>
                <span class='i_win_time'>{{item.lottery_time}}</span>
              </div>
            </slideritem>
          </slider>
        </div>
      </div>
    </div>
    <!-- 限时促销倒计时 -->
    <div class='index_pro_block i_flash_sale' v-if='isSale'>
      <div class='pro_block_head i_sale_head'>
        <div class='i_sale_head_left'>
          <img :src='sale_img' class='f_sale_bg'/>
          <div>
            <span class='sale_time_style'>{{saleTime.hou}}</span>
            <span class='sale_icon_style'>：</span>
            <span class='sale_time_style'>{{saleTime.min}}</span>
            <span class='sale_icon_style'>：</span>
            <span class='sale_time_style'>{{saleTime.sec}}</span>
          </div>
        </div>
        <div class='i_more_right' @click="goLink('/flashSale?type=1')">
          <span>查看更多</span>
          <i class='iconfont icon-iconfontjiantou5'></i>
        </div>
      </div>
      <div class='pro_block_body i_sale_body'>
        <div class='i_sale_info'>
          <div class='i_sale_info_pro' v-for='(item,index) in saleList' :key="index"
            @click="goPro('normal',item.goods_id)">
            <div class='i_sale_info_pro_top'>
              <img :src='item.img' />
            </div>
            <div class='i_sale_info_pro_bottom'>
              <div class='pro_price'>
                <div class='pro_price_line'>
                  <div class='pro_flex'>
                    <span class='peo_nowprice' v-if='item.deal_type==1||item.deal_type==3'>￥{{item.price_sell}}<span style="color:#ff4e79;font-size:0.23rem" v-if="isMember"> / 赚{{item.back_rebate}}</span></span>
                    <span class='peo_nowprice' v-if='item.deal_type>=4'>￥{{item.price_combine}}<span style="color:#ff4e79;font-size:0.23rem" v-if="isMember"> / 赚{{item.back_rebate}}</span></span>
                    <span class='peo_nowprice' v-if='item.deal_type>=4'>+</span>
                  </div>
                  <div class='pro_flex'>
                    <div class='pro_inter_img' v-if='item.deal_type!=1&&item.deal_type!=3'>
                      <i class='iconfont icon-jifen1'></i>
                    </div>
                    <span class='pro_integral' v-if='item.deal_type==2'>{{item.point}}</span>
                    <span class='pro_integral'
                      v-if='item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3'>{{item.point_combine}}</span>
                  </div>
                </div>
              </div>
              <div class='pro_title'>{{item.name}}</div>
            </div>
          </div>
        </div>
        <!-- </scroll-div> -->
      </div>
    </div>
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="30">
      <!-- 本周上新 -->
      <div class='index_pro_block i_new' v-if='loadingNew==1'>
        <div class='pro_block_head i_new_head' v-if="newList.module.view_type!=2&&newList.module.view_type!=3">
          <div class='i_new_head_left'>
            <span v-if="newList.module.title_img==''">{{newList.module.title}}</span>
            <img v-else :src='newList.module.title_img' />
          </div>
          <div class='i_more_right' @click="goLink('/activityList?id=' + newList.module.id)">
            <span>查看更多</span>
            <i class='iconfont icon-iconfontjiantou5'></i>
          </div>
        </div>
        <div class='pro_block_body i_new_body'>
          <div class='i_adv' @click="goLink('/activityList?id=' + newList.module.id)"
            v-if='newList.module.view_type!=1&&newList.module.view_type!=3'>
            <img :src='newList.module.banner_img' />
          </div>
          <div class='i_new_list'>
            <div class='i_new_block' v-for="(item,index) in newList.list" :key="index"
              @click="goPro('normal',item.goods_id)">
              <div class='pro_img'>
                <img :src='item.gimg' v-lazy="item.gimg" />
              </div>
              <div class='pro_title pro_line_two'>
                <div class='pro_level' v-if='item.promotion==1'>
                  <img :src='imgPath+"member/cu.png"' />
                  <span>限时购</span>
                </div>
                {{item.name}}
              </div>
              <div class='pro_price'>
                <div class='pro_price_line'>
                  <div class='pro_flex'>
                    <span class='peo_nowprice' v-if='item.deal_type==1||item.deal_type==3'>￥{{item.price_sell}}<span style="color:#ff4e79;font-size:0.23rem" v-if="isMember"> / 赚{{item.back_rebate}}</span></span>
                    <span class='peo_nowprice' v-if='item.deal_type>=4'>￥{{item.price_combine}}<span style="color:#ff4e79;font-size:0.23rem" v-if="isMember"> / 赚{{item.back_rebate}}</span></span>
                    <span class='peo_nowprice' v-if='item.deal_type>=4'>+</span>
                  </div>
                  <div class='pro_flex'>
                    <div class='pro_inter_img' v-if='item.deal_type>=4'>
                      <i class='iconfont icon-jifen1'></i>
                    </div>
                    <span class='pro_integral'
                      v-if='item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3'>{{item.point_combine}}</span>
                  </div>
                </div>
                <div style='display:flex;align-items:center;justify-content:space-between;'>
                  <div style='display:inline-flex;align-items:center;'>
                    <span class='pro_orig pro_bg'>{{item.price_market_from}}</span>
                    <span class='pro_orig line'>￥{{item.price_market}}</span>
                  </div>
                  <div class='pro_count'>销量:{{item.buy_count}}</div>
                </div>
                <!-- <div style='display:flex;align-items:center;' v-if='item.deal_type!=1&&item.point>0'>
                <span class='pro_orig pro_bg'>积分兑换</span>
                <span class='pro_orig'>{{item.point}}</span>
              </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 积分专区-->
      <div class='index_pro_block i_redeem' v-if='loadingPoint==1'>
        <div class='pro_block_head i_redeem_head' v-if="redeemList.module.view_type!=2&&redeemList.module.view_type!=3">
          <div class='i_redeem_head_left'>
            <span v-if="redeemList.module.title_img==''">{{redeemList.module.title}}</span>
            <img v-else :src='redeemList.module.title_img' />
          </div>
          <div class='i_more_right' @click="goLink('/activityList?id=' + redeemList.module.id)">
            <span>查看更多</span>
            <i class='iconfont icon-iconfontjiantou5'></i>
          </div>
        </div>
        <div class='pro_block_body i_redeem_body'>
          <div class='i_adv' @click="goLink('/activityList?id=' + redeemList.module.id)"
            v-if='redeemList.module.view_type!=1&&redeemList.module.view_type!=3'>
            <img :src='redeemList.module.banner_img' />
          </div>
          <div class='i_prolist'>
            <div class='i_pro' v-for="(item,index) in redeemList.list" :key="index"
              @click="goPro('normal',item.goods_id)">
              <div class='pro_img'>
                <img :src='item.gimg' v-lazy="item.gimg" />
              </div>
              <div class='pro_tag'>
                <span>积分兑换</span>
              </div>
              <div class='pro_title pro_line_two'>
                <div class='pro_level' v-if='item.promotion==1'>
                  <img :src='imgPath+"member/cu.png"' />
                  <span>限时购</span>
                </div>
                {{item.name}}
              </div>
              <div class='pro_price'>
                <div class='pro_price_line'>
                  <div class='pro_flex'>
                    <div class='pro_inter_img'>
                      <i class='iconfont icon-jifen1'></i>
                    </div>
                    <span class='pro_integral'>{{item.point}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 活动专区 -->
      <div v-for="(listblock,listindex) in activityShowList" :key="listindex" class="i_activity"
        v-if="loadingActivity!=0">
        <div class='index_pro_block i_shop' v-for="(block,blockindex) in listblock" :key="blockindex"
          v-if="block.module.view_type!=3">
          <div class='pro_block_head i_shop_head' v-if="block.module.view_type!=2&&block.module.view_type!=3">
            <div class='i_shop_head_left'>
              <span v-if="block.module.title_img==''">{{block.module.title}}</span>
              <img v-else :src='block.module.title_img' />
            </div>
            <div class='i_more_right' @click="goLink('/activityList?id=' + block.module.id)">
              <span>查看更多</span>
              <i class='iconfont icon-iconfontjiantou5'></i>
            </div>
          </div>
          <div class='pro_block_body i_shop_body'>
            <div class='i_adv' @click="goLink('/activityList?id=' + block.module.id)"
              v-if='block.module.view_type!=1&&block.module.view_type!=3'>
              <img :src='block.module.banner_img' />
            </div>
            <div class='i_prolist'>
              <div class='i_pro' v-for="(item,index) in block.list" :key="index" @click="goPro('normal',item.goods_id)">
                <div class='pro_img'>
                  <img :src='item.gimg' v-lazy="item.gimg" />
                </div>
                <div class='pro_title pro_line_two'>
                  <div class='pro_level' v-if='item.promotion==1'>
                    <img :src='imgPath+"member/cu.png"' />
                    <span>限时购</span>
                  </div>
                  {{item.name}}
                </div>
                <div class='pro_price'>
                  <div class='pro_price_line'>
                    <div class='pro_flex'>
                      <div class='pro_flex'>
                        <span class='peo_nowprice' v-if='item.deal_type==1||item.deal_type==3'>￥{{item.price_sell}}<span style="color:#ff4e79;font-size:0.23rem" v-if="isMember"> / 赚{{item.back_rebate}}</span>
                        </span>
                        <span class='peo_nowprice' v-if='item.deal_type>=4'>￥{{item.price_sell}}<span style="color:#ff4e79;font-size:0.23rem" v-if="isMember"> / 赚{{item.back_rebate}}</span></span>
                        <span class='peo_nowprice' v-if='item.deal_type>=4'>+</span>
                      </div>
                      <div class='pro_inter_img' v-if='item.deal_type!=1&&item.deal_type!=3'>
                        <i class='iconfont icon-jifen1'></i>
                      </div>
                      <span class='pro_integral' v-if='item.deal_type==2'>{{item.point}}</span>
                      <span class='pro_integral'
                        v-if='item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3'>{{item.point}}</span>
                    </div>
                  </div>
                  <div style='display:flex;align-items:center;justify-content:space-between;'>
                    <div style='display:inline-flex;align-items:center;'>
                      <span class='pro_orig pro_bg'>{{item.price_market_from}}</span>
                      <span class='pro_orig line'>￥{{item.price_market}}</span>
                    </div>
                    <div class='pro_count'>销量:{{item.buy_count}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 热门推荐 -->
      <div class='index_pro_block i_recom' v-if='recomShowList.length>0'>
        <div class='pro_block_head i_recom_head'>
          <div class='i_recom_head_left'>
            <img :src='recom_img' />
          </div>
        </div>
        <div class='pro_block_body i_recom_body'>
          <!-- <div class='i_adv' @click='goUrl(recomList.advert.href_type,recomList.advert.href_id)' v-if='recomList.advert!=undefined'
          style='box-shadow:none;'>
          <img :src='recomList.advert.img' />
        </div> -->
          <div class='i_prolist'>
            <div class="i_pro_block" v-for="(listblock,blockindex) in recomShowList" :key="blockindex">
              <div class='i_pro' v-for="(item,index) in listblock" :key="index" @click="goPro('normal',item.goods_id)">
                <div class='pro_img'>
                  <img :src='item.gimg' v-lazy="item.gimg" />
                </div>
                <div class='pro_title pro_line_two'>
                  <div class='pro_level' v-if='item.promotion==1'>
                    <img :src='imgPath+"member/cu.png"' />
                    <span>限时购</span>
                  </div>
                  {{item.gname}}
                </div>
                <div class='pro_price'>
                  <div class='pro_price_line'>
                    <div class='pro_flex'>
                      <span class='peo_nowprice' v-if='item.deal_type==1||item.deal_type==3'>￥{{item.price_sell}}<span style="color:#ff4e79;font-size:0.23rem" v-if="isMember"> / 赚{{item.back_rebate}}</span>
                      </span>
                      <span class='peo_nowprice' v-if='item.deal_type>=4'>￥{{item.price_sell}}<span style="color:#ff4e79;font-size:0.23rem" v-if="isMember"> / 赚{{item.back_rebate}}</span></span>
                      <span class='peo_nowprice' v-if='item.deal_type>=4'>+</span>
                    </div>
                    <div class='pro_flex'>
                      <div class='pro_inter_img' v-if='item.deal_type!=1&&item.deal_type!=3'>
                        <i class='iconfont icon-jifen1'></i>
                      </div>
                      <span class='pro_integral' v-if='item.deal_type==2'>{{item.point}}</span>
                      <span class='pro_integral'
                        v-if='item.deal_type!=1&&item.deal_type!=2&&item.deal_type!=3'>{{item.point}}</span>
                    </div>
                  </div>
                  <div style='display:flex;align-items:center;justify-content:space-between;'>
                    <div style='display:inline-flex;align-items:center;'>
                      <span class='pro_orig pro_bg'>{{item.price_market_from}}</span>
                      <span class='pro_orig line'>￥{{item.price_market}}</span>
                    </div>
                    <div class='pro_count'>销量:{{item.buy_count}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='order-foot' v-if='loading==true'>
        <span>—————— 我是有底线的 ——————</span>
      </div>
      <div class='more_load' v-if='!loading'>
        <mt-spinner type="fading-circle"></mt-spinner>
      </div>
    </div>
    <div class='open_model_bg' v-if="red_show&&boxType=='cou'"></div>
    <div class='open_model' v-if="red_show&&boxType=='cou'">
      <div class='cou_list'>
        <div class='cou_info' v-for="(item,index) in redInfo" :key="index">
          <div class='line_radio left'>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div :class="item.isget?'cou_left cou_left_get':'cou_left'">
            <div class='cou_amount'>
              ¥
              <span class='price'>{{item.cashworth}}</span>
              <span class='type'>{{item.type_name}}</span> 购物券
            </div>
            <div class='cou_max' v-if='item.order_price>0'>
              满{{item.order_price}}元可用{{item.content}}
            </div>
            <div v-if='item.order_price<=0' class='cou_max'>无门槛通用</div>
            <div class='cou_time' v-if="item.is_new!=1">
              有效期：{{item.fromtime}}-{{item.totime}} 可用
            </div>
            <div class='cou_time' v-if="item.is_new==1">
              有效期：自领取日起{{item.new_day}}天内有效
            </div>
          </div>
          <div :class="item.isget?'cou_line cou_line_get':'cou_line'"></div>
          <div :class="item.isget?'cou_right cou_right_get':'cou_right'" @click='getCou(item.isget,item.id)'>
            <span v-if='!item.isget'>立即领取</span>
            <i class='iconfont icon-get isget' v-else></i>
          </div>
          <div class='line_radio right'>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      <div class='cou_close'>
        <i class='iconfont icon-close' @click='closeModel'></i>
      </div>
      <!-- <img src='@/assets/img/member/r_01.png' class='package' />
      <i class='iconfont icon-guanbi2' @click='closeModel'></i>
      <div class='model_info'>
        <div class='top_title'>
          {{redInfo.title}}
        </div>
        <div class='title'>
          恭喜您获得
        </div>
        <div class='price'>
          <span>¥{{redInfo.cashworth}}</span>
          <span class='price_max'>满{{redInfo.order_price}}可用</span>
        </div>
        <div class='time'>
          即日起至{{redInfo.totime}}
        </div>
      </div>
      <img src='@/assets/img/member/r_btn.png' class='open_btn' @click='getCou(redInfo.id)' /> -->
    </div>
    <!-- 首页引导大转盘弹框 -->
    <div class='open_model_bg' v-if="red_show&&boxType=='lottery'" catchtouchmove="ture"></div>
    <div class='open_model' v-if="red_show&&boxType=='lottery'" catchtouchmove="ture">
      <img :src='lotteryImg' class='lottery_img' @click="goLottery('/lottery')" />
      <i class='iconfont icon-guanbi2' @click='closeModel'></i>
    </div>
    <!-- 首页新人专享弹框 -->
    <!-- <div  class='new_bg' v-if="isFirst==1" catchtouchmove="ture"  @click='closeNew'></div> -->
    <!-- <div class="new_scro" v-if="isFirst==1" catchtouchmove="ture"> -->
      <div  class='new_bg' v-if="isFirst==1" catchtouchmove="ture"  @click='closeNew'></div>
      <div class="new_scro" v-if="isFirst==1" catchtouchmove="ture" >
        <div class='news_t' :class="active?'animated slideInLeft active':''">
          <div class='new_t_list' :class="active?'animated slideInLeft active':''">
            <img :src="shareInfo.image" class='n_left'>
            <div class='n_right'>
              <span>{{shareInfo.nickname}}</span>
              <div class='n_right_content'>
                  <span>{{desc_text}}</span>
              </div>
              <div class='sanjiao'></div>
            </div>
          </div>
          <div class='new_t_list1 new_t_list' :class="active1?'animated slideInLeft active1':''">
            <img :src="shareInfo.image" class='n_left'/>
            <div class='n_right'>
              <span>{{shareInfo.nickname}}</span>
              <div class='n_right_content'>
                  <span>{{desc_content}}</span>
              </div>
              <div class='sanjiao'></div>
            </div>
          </div>
          <div class='news_b' :class="active2?'animated slideInLeft active2':''">
            <img :src='newPeople_bg' mode="widthFix" class='news_b_bg'/>
            <i class='iconfont icon-bohui' @click='closeNew'></i>
            <div class='news_b_content'>
              <img :src="imgPath+'shop/newpeople.png'" class='newpeople'/>
              <div class='news_more' @click='goNewpeo'>
                <!-- <div class='news_more_content' > -->
                <span>更多</span>
                <i class='iconfont icon-youjiantou1'></i>
                <!-- </div> -->
              </div>
              <div class='news_free_shipping'>
                <img :src='new_goods.img' class='news_free_shipping_img'/>
                <div class='news_free_shipping_r'>
                    <div class='news_free_shipping_r_t'>
                        {{new_goods.name}}
                    </div>
                    <div class='news_free_shipping_r_c'>
                        ￥{{new_goods.price_sell}}
                    </div>
                    <div class='news_free_shipping_r_b'>
                        <div class='news_free_shipping_r_b_pri'>
                          ￥<span>{{new_goods.sale}}</span>
                        </div>
                        <div class='news_free_shipping_r_b_user'>
                          <span>你的专属价</span>
                          <span v-if="new_goods.is_pinkage==1">包邮</span>
                        </div>
                    </div>
                </div>
              </div>
              <!-- 跳到详情页 -->
              <div class='news_rightNow' @click='goProDetail(new_goods.goods_id)' >
                <span>立即领取</span><span>（仅限1份）</span>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import {
  InfiniteScroll,
  Indicator,
  Swipe,
  SwipeItem,
  Lazyload,
  Toast
} from 'mint-ui'
import {
  slider,
  slideritem
} from 'vue-concise-slider' // 竖直滚动列表
import {
  swiper,
  swiperSlide
} from 'vue-awesome-swiper'
import {
  mapMutations,
  mapGetters
} from 'vuex'
import returnTop from '@/components/return-top'
import {
  countDown,
  parseTime
} from '@/store/pubilc.js'
import {
  checkLogin,
  getBanner,
  getWin,
  getProList,
  getActivityList,
  getRecomType,
  getRecomProList,
  getLikeList,
  getFlashList,
  getNewsRead,
  getCarList,
  getPersonInfo,
  getShowShare,
  getIndexModel,
  rceiveCou,
  setBannerClick
} from '@/api/index'
import {
  getNewDialog, getNewPeople, getInviteInfo, bindCid
} from '@/api/share'
export default {
  name: 'Index',
  components: {
    swiper,
    swiperSlide,
    Swipe,
    SwipeItem,
    slider,
    slideritem,
    returnTop,
    Lazyload,
    Toast,
    InfiniteScroll,
    Indicator
  },
  data() {
    return {
      swiperOption: {
        autoplay: false,
        speed: 500,
        loop: false
      },
      imgPath: process.env.FilE_URL,
      isMember: this.$store.state.home.is_member, // 是否是会员
      isShare: this.$store.state.home.is_share, // 是否显示分享
      swiper_height: 8,
      isFirst: 0,
      headBg: [],
      result: [],
      value: '',
      fruitImg: '',
      shownewpeople: 0,
      showFruit: false,
      newPeopleImg: '',
      comNav: [],
      loading: true,
      haswinList: false,
      showWin: false,
      winList: [],
      win_list_num: 8,
      options: {
        currentPage: 0, // 默认开始页
        thresholdDistance: 500, // 滑动距离阈值判定
        thresholdTime: 100, // 滑动时间阈值判定
        autoplay: 3000, // 自动播放:时间[ms]
        itemAnimation: true,
        centeredSlides: true,
        direction: 'vertical', // 垂直滚动
        loop: true, // 无限循环
        loopedSlides: 8, // 多级滚动时，需要添加前后遍历数
        slidesToScroll: 4, // 需要滚动页面的数量
        timingFunction: 'ease', // 滑动方式
        speed: 1000, // 滑动速度
        pagination: false // 不显示滑动圆点
      },
      time: '', // 定时器
      endTime: '', // 倒计时秒数
      saleTime: {hou: '00', min: '00', sec: '00'}, // 倒计时时分秒数组
      isSale: false, // 是否凶案是促销模块
      isTop: false, // 显示返回顶部按钮
      dataCopy: false, // 滑动赋值商品列表
      top: false,
      isSign: true,
      isShow: false, // 是否显示整体区域
      like_page: 1, // 猜你喜欢第n页
      proList: [], // 首页商品列表
      // redeemList: {}, // 积分专区
      // shopList: {}, // 购物商城
      // newList: {}, // 本周上新
      // hotList: {}, // 热销商品
      // recomList: {}, // 热推商品
      // downList: [], // 精品分类
      // likeList: [], // 猜你喜欢
      remProList: {}, // 列表总数据
      loadingNew: 0,
      loadingPoint: 0,
      loadingActivity: 0,
      remPro_requst: false, // 是否加载过积分专区和本周上新
      new_loading: false,
      redeem_loading: false,
      newList: {
        module: {
          view_type: 3
        },
        list: []
      }, // 本周上新
      redeemList: {
        module: {
          view_type: 3
        },
        list: []
      }, // 积分专区
      activityList: [], // 活动专区全部数据
      activityShowList: [],
      acticity_requst: false, // 是否加载过活动列表数据
      activity_page: 0,
      recomShowList: [], // 推荐商品显示瀑布流
      recomList: [], // 推荐商品瀑布流
      recom_title: '',
      recom_color: '',
      recom_page: 1,
      recom_total: 0,
      recom_limit: 10,
      recom_img: '',
      recom_request: false,
      boxType: '',
      red_show: false,
      lotteryImg: '',
      redInfo: {},
      get_cou: true,
      newPeople_bg: '',
      desc_text: '',
      desc_content: '',
      new_goods: {},
      active: false,
      active1: false,
      active2: false,
      sale_img: '',
      // imgPath: process.env.FilE_URL,
      shareInfo: {
        image: process.env.FilE_URL + 'shoper/qr.png',
        nickname: '燕子'
      }
    }
  },
  created() {},
  mounted() {
    // document.getElementById('top').scrollIntoView(false)
    // this.$router.options.routes = []
    // this.$router.addRoutes([])
    Indicator.open('加载中...')
    // 获取轮播图
    this.getBanner()
    // 获取中奖名单
    // this.getWinList()
    // 获取促销商品
    if (this.time != '' && this.time != null) {
      clearInterval(this.time)
      this.time = ''
      this.endTime = ''
      this.saleTime = {hou: '00', min: '00', sec: '00'}
    }
    this.getFlash()
    // 获取首页商品列表
    this.getList()
    // 监听滚动条高度
    this.tabScroll()
  },
  methods: {
    ...mapMutations({
      setCarnum: 'SET_CARNUM',
      setIsbind: 'SET_ISBIND',
      setScore: 'SET_SCORE',
      setNews: 'SET_NEWS',
      setNewsnum: 'SET_NEWSNUM',
      setIssign: 'SET_ISSIGN',
      setUserInfo: 'SET_USERINFO',
      setInviter: 'SET_INVITER',
      setMember: 'SET_MEMBER',
      setShowShare: 'SET_SHARE',
      setFirst: 'SET_FIRST'
    }),
    // 绑定cid
    bindCidToAlias() {
      let info = {
        alias: window.localStorage.getItem('token').split(';')[0].split('=')[1],
        cid: window.localStorage.getItem('cid')
      }
      bindCid(info).then(res => {
        if (res.isSuccess) {
          window.localStorage.setItem('bindCid', true)
        }
      })
    },
    // 获取首页新人广告位
    getNewPeople() {
      var that = this
      getNewPeople().then(res => {
        // Indicator.open('加载中...')
        if (res.isSuccess) {
          // Indicator.close()
          // 如果显示新人列表专区再赋值
          if (res.data.newpeople.is_new_people != 0) {
            console.log(res, '我是新人')
            let storage = window.localStorage
            storage.setItem('is_newShow', res.data.newpeople.is_new_people)
            that.shownewpeople = res.data.newpeople.is_new_people
            that.newPeopleImg = res.data.newpeople.new_banner_img
          }
        }
      })
    },
    getNewBanner() {
      const that = this
      getNewDialog().then(res => {
      // wx.hideLoading()
        if (res.isSuccess === true || res.isSuccess === 'true') {
          that.desc_text = res.data.desc_text
          that.desc_content = res.data.desc_content
          // 获取分享人信息
          that.shareInfo = JSON.parse(window.localStorage.getItem('share'))
          that.new_goods = res.data.new_goods
          that.newPeople_bg = res.data.title_img
          // 当新人专享的弹框已经弹过之后不需要再弹了
          this.setFirst(0)
        }
      })
      that.showDia()
    },
    showDia() {
      console.log('过渡效果')
      const that = this
      that.isFirst = 1
      that.active = true
      setTimeout(function(res) {
        that.active1 = true
      }, 500)
      setTimeout(function(res) {
        that.active2 = true
      }, 1000)
    },
    goNewpeo() {
      window.localStorage.setItem('backDetail', false)
      this.$router.togo({
        path: '/newPeople'
      })
    },
    // 首页新人弹框进入详情页
    goProDetail(id) {
      this.$router.togo({
        path: '/newPeopleDetail?type=newpeople&id=' + id
      })
    },
    // 首页新人弹框 关闭
    closeNew() {
      this.isFirst = 0
      this.active = false
      this.active1 = false
      this.active2 = false
      this.setFirst(0)
      // 获取新人弹框 查询购物车数量
      this.getAlaways()
    },
    tabScroll() {
      window.addEventListener('scroll', this.handleScroll)
    },
    getAlaways() {
      let that = this
      getCarList({
        p: 1,
        limit: 10
      }).then(res => {
        if (res.isSuccess) {
          that.setCarnum(res.data.rows_total)
        }
      })
      getIndexModel().then(res => {
        if (res.isSuccess) {
          if (res.data.lottery !== '' && res.data.lottery !== undefined) {
            that.boxType = 'lottery'
            that.red_show = true
            that.lotteryImg = res.data.lottery
          } else {
            if (res.data.coupon.length > 0) {
              for (var i = 0; i < res.data.coupon.length; i++) {
                res.data.coupon[i].isget = false
              }
              that.boxType = 'cou'
              that.red_show = true
              that.redInfo = res.data.coupon
            } else {
              that.red_show = false
            }
          }
        }
      })
      getPersonInfo().then(res => {
        if (res.isSuccess) {
          let userInfo = {}
          userInfo.avatar = res.data.image
          userInfo.uid = res.data.uid
          userInfo.level = res.data.rankName
          userInfo.isShow = 1
          userInfo.nickname = res.data.nickname
          userInfo.isbind = res.data.bindPhone
          userInfo.level_id = res.data.level_id
          userInfo.level_name = res.data.levelName
          userInfo.inviter = res.data.inviter
          userInfo.is_first = res.data.is_first
          that.setUserInfo(userInfo)
          that.setInviter(res.data.inviter)
          if (res.data.level_id !== 0 && res.data.level_id !== '0') {
            that.setMember(true)
            that.isMember = true
          } else {
            that.setMember(false)
            that.isMember = false
          }
          if (res.data.mobile !== '' && res.data.mobile !== null) {
            that.setIsbind(true)
          } else {
            that.setIsbind(false)
          }
          that.userInfo = that.$store.state.home.userInfo
        }
      })
      getShowShare().then(res => {
        if (res.isSuccess) {
          if (res.data.status == 0) {
            that.setShowShare(0)
            that.isShare = 0
          } else {
            that.setShowShare(1)
            that.isShare = 1
          }
        } else {
          console.log('判断用户是否是直邀失败')
        }
      })
    },
    getNews() {
      let that = this
      getNewsRead().then(res => {
        if (res.isSuccess) {
          // 判断是否签到
          if (res.data.is_sign === 1) {
            // that.isSign = true
            that.setIssign(true)
          } else {
            that.setIssign(false)
            // that.isSign = false
          }
          that.isSign = that.$store.state.home.issign
          // 判断是否有新消息
          if (res.data.num > 0) {
            that.setNews(true)
            that.setNewsnum(res.data.num)
          } else {
            that.setNews(false)
            that.setNewsnum(0)
          }
        }
      })
    },
    handleScroll() {
      var scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop
      var browserHeight = window.outerHeight // 浏览器高度
      if (window.localStorage.getItem('leaveIndex') !== 'false') {
        scrollTop = 0
        window.localStorage.setItem('leaveIndex', false)
      }
      if (scrollTop > 0) {
        if (!this.top) {
          this.top = true
        }
        if (scrollTop > browserHeight) {
          // console.log(scrollTop)
          // console.log(browserHeight)
          if (this.isTop) {
            this.isTop = false
          }
          // if (this.dataCopy === false) {
          //   // 给本周上新，热销商品，热推商品赋值
          //   this.newList = this.proList.new // 本周上新
          //   this.hotList = this.proList.buy // 热销商品
          //   this.recomList = this.proList.hot // 热推商品
          //   // 获取猜你喜欢
          //   this.getLike()
          //   // 获取精品分类
          //   this.getTypeList()
          //   this.dataCopy = true
          // }
          if (this.dataCopy === false && this.acticity_requst === true) {
            this.dataCopy = true
            // // 获取精品分类
            // this.getTypeList()
          }
        } else {
          if (!this.isTop) {
            this.isTop = true
          }
        }
      } else {
        this.isTop = false
        this.top = false
      }
    },
    goSign() {
      let that = this
      if (that.$store.state.home.isbind === 'false' || that.$store.state.home.isbind === false) {
        that.$router.togo({
          path: '/bind?visit=3'
        })
      } else {
        that.$router.togo({
          path: '/mySignIn'
        })
      }
    },
    goTop() {
      console.log('回到顶部')
      document.getElementById('top').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    getBanner() {
      const that = this
      getBanner().then(res => {
        Indicator.close()
        if (res.isSuccess) {
          that.headBg = res.data.rows
          that.showWin = res.data.fitter.is_lottery
          that.comNav = res.data.icon
          that.loadingNew = res.data.is_new // 是否显示本周上新
          that.loadingPoint = res.data.is_point // 是否显示积分专区
          that.loadingActivity = res.data.is_module // 是否显示活动列表
          that.isShow = true

          if (res.data.fitter.is_fruits) {
            that.showFruit = res.data.fitter.is_fruits
            that.fruitImg = res.data.fitter.fruits_adv_img
          }
          if (res.data.fitter.is_lottery === 'true') {
            that.getWinList()
          }
          that.$nextTick(() => {
            // 图片地址 后面加时间戳是为了避免缓存
            var imgUrl = that.headBg[0].image_pc + '?' + Date.parse(new Date())
            // 创建对象
            var img = new Image()
            // 改变图片的src
            img.src = imgUrl

            // 加载完成执行
            img.onload = function() {
              // 打印
              console.log(img.height)
              console.log(img.width)
              let unit = 750 / window.screen.width
              that.swiper_height = img.height * (window.screen.width * unit / img.width) / 100
              console.log(that.swiper_height)
            }
          })
        }
      })
    },
    getWinList() {
      const that = this
      getWin(this.win_list_num).then(res => {
        if (res.isSuccess) {
          // var list = []
          // for (var i = 0; i < res.data.length; i++) {
          //   list.push(res.data[i])
          //   if ((i + 1) % 4 === 0) {
          //     this.winList.push({ list: list })
          //     list = []
          //   }
          // }
          // if (res.data.length < 4) {
          //   this.winList.push(list)
          // }
          that.winList = res.data
          that.haswinList = true
        }
      })
    },
    getList() {
      const that = this
      getProList().then(res => {
        if (res.isSuccess) {
          // this.proList = res.data
          // this.redeemList = res.data.list
          // this.shopList = res.data.money
          that.remProList = {}
          that.remProList = res.data
          that.remPro_requst = true
          console.log(that.loadingNew)
          console.log(that.loadingPoint)
          if (that.loadingNew === 1) {
            that.new_loading = true
            that.newList = res.data.new // 本周上新
            that.isShow = true
          } else if (that.loadingPoint === 1) {
            that.redeem_loading = true
            that.redeemList = res.data.point // 积分专区
            that.isShow = true
          } else {

          }
          that.loading = false
          console.log(that.redeemList)
          console.log(that.newList)
        } else {
          that.isShow = true
        }
      })
    },
    // 获取活动的全部数据
    getActivity: function () {
      var that = this
      getActivityList().then(res => {
        that.acticity_requst = true
        if (res.isSuccess) {
          if (res.data.length > 0) {
            that.activityList = []
            that.activityList = res.data
            for (let i = 0; i < that.activityList.length; i++) {
              if (that.activityList[i].module.view_type != 3) {
                that.activity_page = i
                that.activityShowList[i] = [that.activityList[i]]
                that.loading = false
                break
              }
            }
          } else {
            that.activityList = []
          }
        } else {
          console.log('活动列表请求出错')
        }
      })
    },
    getRecomList() {
      const that = this
      getRecomProList().then(res => {
        if (res.isSuccess) {
          that.recomList = []
          if (res.data.rows.length > 0) {
            that.recomList = res.data.rows
            that.recom_total = res.data.total
            that.recom_limit = res.data.limit
            that.recom_img = res.data.title_img
            that.recomShowList[that.recom_page] = that.recomList[0]
            // that.setData({
            //   recom_img: res.data.title_img,
            //   ['recomShowList[' + that.recom_page + ']']: that.recomList[0]
            // })
            that.recom_request = true
            that.loading = false
          } else {
            that.loading = true
          }
        } else {
          console.log('活动列表请求出错')
        }
      })
    },
    loadMore() {
      console.log('触发滚动加载')
      var that = this
      this.timeout = setTimeout(function () {
        that.loading = true
        console.log('延时300秒')
        if ((this.loadingNew == 1 || this.loadingPoint == 1) && this.remPro_requst == false) {
          // 获取本周上新，积分专区
          this.getList()
        } else {
          console.log(this.loadingNew)
          console.log(this.loadingPoint)
          console.log(this.redeem_loading)
          if (this.loadingNew == 1 && that.redeem_loading == false) {
            that.redeem_loading = true
            that.redeemList = that.remProList.point
            // that.setData({
            //   redeemList: that.remProList.point // 积分专区
            // })
          }
          // 如果本周上新等有数据并且活动列表为空
          if (this.loadingActivity == 1 && this.acticity_requst == false) {
            // 获取15个商品
            this.getActivity()
          } else {
            console.log('获取活动列表')
            if (this.loadingActivity == 1 && that.activityList.length > 0) {
              if (that.activity_page < that.activityList.length - 1) {
                ++that.activity_page
                for (let i = that.activity_page; i < that.activityList.length; i++) {
                  if (that.activityList[i].module.view_type != 3) {
                    that.activityShowList[i] = [that.activityList[i]]
                    that.activity_page = i
                    that.loading = false
                    // that.setData({
                    //   ['activityShowList[' + i + ']']: [that.activityList[i]],
                    //   activity_page: i
                    // })
                    break
                  }
                }
                console.log(that.activityShowList)
              } else {
                if (this.recom_request == false) {
                  // 加载热门推荐
                  this.getRecomList()
                } else {
                  console.log(that.recom_page)
                  console.log(that.recomList.length - 1)
                  if (that.recom_page < that.recomList.length - 1) {
                    ++that.recom_page
                    that.recomShowList[that.recom_page] = that.recomList[that.recom_page]
                    that.loading = false
                    // that.setData({
                    //   ['recomShowList[' + that.recom_page + ']']: that.recomList[that.recom_page]
                    // })
                    // 判断最后一次商品数量是不是和limit一样大，小就说明是最后一条
                    if (that.recomList[that.recom_page].length < that.recom_limit) {
                      that.loading = true
                    }
                  } else {
                    that.loading = true
                  }
                }
              }
            } else {
              if (this.recom_request == false) {
                // 加载热门推荐
                this.getRecomList()
              } else {
                if (that.recom_page < that.recomList.length - 1) {
                  ++that.recom_page
                  that.recomShowList[that.recom_page] = that.recomList[that.recom_page]
                  that.loading = false
                  // that.setData({
                  //   ['recomShowList[' + that.recom_page + ']']: that.recomList[that.recom_page]
                  // })
                  // 判断最后一次商品数量是不是和limit一样大，小就说明是最后一条
                  if (that.recomList[that.recom_page].length < that.recom_limit) {
                    that.loading = true
                  }
                } else {
                  that.loading = true
                }
              }
            }
          }
        }
      }.bind(this), 300)
    },
    searchHis() {
      this.$router.togo({
        path: '/search'
      })
    },
    // 猜你喜欢换一换
    changeLike() {
      ++this.like_page
      this.getLike()
    },
    // 获取猜你喜欢
    getLike() {
      getLikeList(this.like_page).then(res => {
        if (res.isSuccess) {
          this.likeList = res.data
        } else {
          this.isShow = true
        }
      })
    },
    // 获取顶部分类
    getTypeList() {
      getRecomType().then(res => {
        this.downList = res.top
      })
    },
    // 获取促销商品
    getFlash() {
      getFlashList().then(res => {
        Indicator.close()
        if (res.isSuccess) {
          if (res.data.length > 0) {
            this.isSale = true
            this.isShow = true
            this.saleList = res.data
            this.sale_img = res.title_img
            console.log(this.time)
            console.log(this.endTime)
            console.log(this.saleTime)
            clearInterval(this.time)
            this.time = ''
            this.endTime = ''
            this.saleTime = {hou: '00', min: '00', sec: '00'}
            // console.log(res.title_img, 'title_img')
            if (res.countdown > 0) {
              this.endTime = res.countdown
              this.saleTime = countDown(res.countdown)
              this.time = setInterval(
                function () {
                  --res.countdown
                  this.saleTime = countDown(res.countdown)
                }.bind(this), 1000)
            } else {
              this.time = ''
              this.endTime = ''
              this.saleTime = {hou: '00', min: '00', sec: '00'}
            }
          } else {
            this.isSale = false
            this.isShow = true
          }
        } else {
          this.isSale = false
          this.isShow = true
        }
      })
    },
    imgLink(e) {
      let that = this
      setBannerClick(e.id).then(res => {
        if (res.isSuccess) {
          console.log(res)
        }
      })
      let pageLink = ''
      console.log(e)
      switch (e.type) {
        // 1 商品，3是试用，4是团购，5 文章，6 大转盘
        case '1':
          pageLink = '/proDetail?type=normal&id=' + e.relevance_id
          break
        case '3':
          pageLink = '/tryOutdetail?id=' + e.activity_id
          break
        case '4':
          pageLink =
              '/proDetail?type=group&id=' + e.activity_id + '&goods_id=' + e.relevance_id
          break
        case '5':
          pageLink = '/hotArticle?id=' + e.relevance_id + '&name=文章详情'
          break
        case '6':
          pageLink = '/lottery'
          break
            // case '7':
            //   pageLink = '/fruitDetail?type=fruits&id=' + e.relevance_id
            //   break
      }
      if (pageLink.indexOf('/activityList') != -1 || pageLink.indexOf('/newPeople') != -1) {
        window.localStorage.setItem('backDetail', false)
      }
      if (e.type == '6') {
        that.$router.replace({
          path: pageLink
        })
      } else if (e.type == '8') {
        let path = e.href
        var arr = path.split('/')
        console.log('/' + arr[arr.length - 1])
        if (path.indexOf('hotPush') != -1 || path.indexOf('index') != -1 || path.indexOf('myCar') != -1 || path
          .indexOf('proType') != -1 || path.indexOf('memberCenter') != -1 || path.indexOf('shoper') != -1) {
          that.$router.replace({
            path: '/' + arr[arr.length - 1]
          })
        } else if (path.indexOf('lottery') != -1) {
          that.$router.replace({
            path: '/' + arr[arr.length - 1]
          })
        } else {
          that.$router.togo({
            path: '/' + arr[arr.length - 1]
          })
        }
      } else {
        that.$router.togo({
          path: pageLink
        })
      }
    },
    // 跳转商品分类
    goProtype() {
      this.$router.togo({
        path: '/typeList'
      })
    },
    goTypeList(id, typeid) {
      this.$router.togo({
        path: '/type?id=' + (id + 1) + '&typeid=' + typeid
      })
    },
    // 拉起摄像头扫码
    scan() {
      let that = this
      let storage = window.localStorage
      checkLogin().then(res => {
        if (res.isSuccess) {
          storage.setItem('isLogin', true)
          that.$router.togo({
            path: '/scan?type=scan'
          })
        } else {
          console.log(res)
          if (res.isLogin == false) {
            storage.setItem('isLogin', false)
            window.plus.nativeUI.confirm('您当前未登录，是否立即前往登录', function (e) {
              if (e.index === 0 || e.index === '0') {
                that.$router.push({
                  path: '/login?back=1'
                })
              }
            }, {
              'title': '提示',
              'buttons': ['确定', '取消'],
              'verticalAlign': 'center'
            })
          }
        }
      })
      // if (storage.getItem('isLogin') === 'true' || storage.getItem('isLogin') === true) {
      //   that.$router.togo({
      //     path: '/scan?type=scan'
      //   })
      // } else {
      //   storage.setItem('isLogin', false)
      //   window.plus.nativeUI.confirm('您当前未登录，是否立即前往登录', function (e) {
      //     if (e.index === 0 || e.index === '0') {
      //       that.$router.replace({
      //         path: '/login?back=1'
      //       })
      //     }
      //   }, {
      //     'title': '提示',
      //     'buttons': ['确定', '取消'],
      //     'verticalAlign': 'center'
      //   })
      // }
    },
    closeModel() {
      this.red_show = false
    },
    getCou(isget, id) {
      let that = this
      console.log('领取优惠券')
      console.log(that.get_cou)
      if (that.get_cou) {
        that.get_cou = false
        if (isget === false) {
          rceiveCou(id).then(res => {
            if (res.isSuccess) {
              Toast({
                message: '领取成功',
                iconClass: 'iconfont icon-dui1',
                duration: 1000
              })
              for (var i = 0; i < that.redInfo.length; i++) {
                if (that.redInfo[i].id === id) {
                  that.redInfo[i].isget = true
                }
              }
              setTimeout(function () {
                that.get_cou = true
              }, 1000)
            } else {
              Toast({
                message: res.msg,
                duration: 1000
              })
              setTimeout(function () {
                that.red_show = false
              }, 1000)
            }
          })
        }
      }
    },
    goLottery(url) {
      this.$router.replace({
        path: url
      })
    },
    // Listener event
    slide(data) {},
    goPage(value) {
      console.log(value)
      var arr = value.href.split('/')
      console.log(arr)
      if (arr[1] != 'lottery') {
        window.localStorage.setItem('backDetail', false)
        this.$router.togo({
          path: arr[2]
        })
      } else {
        this.$router.replace({
          path: arr[2]
        })
      }
    },
    goPro(type, id) {
      this.$router.togo({
        path: '/proDetail?type=' + type + '&id=' + id
      })
    },
    goLink(url) {
      let that = this
      if (url === '/news') {
        let storage = window.localStorage
        if (storage.getItem('isLogin') === 'true' || storage.getItem('isLogin') === true) {
          that.$router.togo({
            path: url
          })
        } else {
          window.plus.nativeUI.confirm('您当前未登录，是否立即前往登录', function (e) {
            if (e.index === 0 || e.index === '0') {
              that.$router.replace({
                path: '/login?back=1'
              })
            }
          }, {
            'title': '提示',
            'buttons': ['确定', '取消'],
            'verticalAlign': 'center'
          })
        }
        console.log('没登录不能进消息列表')
      } else {
        if (url.indexOf('activityList') != -1 || url.indexOf('newPeople') != -1) {
          window.localStorage.setItem('backDetail', false)
        }
        that.$router.togo({
          path: url
        })
      }
    },
    goUrl(type, id) {
      if (type === 1 || type === '1') {
        this.$router.togo({
          path: '/proDetail?type=normal' + '&id=' + id
        })
        // 商品详情
      } else {
        // 跳转分类
        if (id !== 0) {
          let tid = 0
          for (let i = 0; i < this.downList.length; i++) {
            if (this.downList[i].id === id) {
              tid = i
            }
          }
          this.$router.replace({
            path: '/type?id=' + (tid + 1) + '&typeid=' + id
          })
        }
      }
    }
  },
  beforeDestroy() {
    // this.$refs.slider.$emit('autoplayStop')
    window.localStorage.setItem('leaveIndex', true)
    window.removeEventListener('scroll', this.handleScroll)
    clearInterval(this.time)
  },
  activated() {
    // if (this.endTime <= 0) {
    //   this.getFlash()
    // }
    let storage = window.localStorage
    if (storage.getItem('isLogin') === true || storage.getItem('isLogin') === 'true') {
      // 判断是否绑定过cid
      console.log('判断是否绑定过cid' + storage.getItem('bindCid'))
      if (storage.getItem('bindCid') == 'false' || storage.getItem('bindCid') == undefined || storage.getItem('bindCid') == 'null') {
        this.bindCidToAlias()
      }
      // 获取消息是否已读,是否可以签到,是否会员生日
      this.getNews()
      // 获取新人专享
      this.getNewPeople()
      // 获取邀请人信息和用户信息
      console.log(this.$store.state.home.userInfo.inviter, '111')
      if ((storage.getItem('is_newShow') === 1 || storage.getItem('is_newShow') === '1') && (storage.getItem('share') == undefined || storage.getItem('share') === '')) {
        console.log(this.$store.state.home.userInfo.inviter)
        if (this.$store.state.home.userInfo.inviter === -1 || this.$store.state.home.userInfo.inviter === '-1') {
          console.log('直邀用户，不需要上级')
          // 直邀用户，不需要上级
          let info = { image: process.env.FilE_URL + 'member/new_people_static.png', nickname: '公主购' }
          storage.setItem('share', JSON.stringify(info))
          console.log('11111')
        } else if (this.$store.state.home.userInfo.inviter !== 0 || this.$store.state.home.userInfo.inviter !== '0') {
          getInviteInfo().then(res => {
            if (res.isSuccess === true || res.isSuccess === 'true') {
              storage.setItem('share', JSON.stringify(res.data.share))
            }
          })
        }
      }
      // 获取优惠券弹框
      this.getAlaways()
    }
    // 获取显示促销
    if ((this.time != '' && this.time != null) || this.endTime <= 0) {
      console.log('清除定时器')
      clearInterval(this.time)
      this.time = ''
      this.endTime = ''
      this.saleTime = {hou: '00', min: '00', sec: '00'}
      getFlashList().then(res => {
        Indicator.close()
        if (res.isSuccess) {
          if (res.data.length > 0) {
            this.isSale = true
            this.isShow = true
            this.saleList = res.data
            this.sale_img = res.title_img
            // console.log(res.title_img, 'title_img')
            if (res.countdown > 0) {
              this.endTime = res.countdown
              this.saleTime = countDown(res.countdown)
              this.time = setInterval(
                function () {
                  --res.countdown
                  this.saleTime = countDown(res.countdown)
                }.bind(this), 1000)
            } else {
              this.isSale = false
            }
          } else {
            this.isSale = false
            this.isShow = true
          }
        } else {
          this.isShow = true
        }
      })
    }

    // this.loading = true
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
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import "~styles/index.less";
//新人弹框样式
.new_bg{
  position: fixed;
  background: rgba(0, 0, 0, .5);
  top: 0/100rem;
  width: 100%;
  height: 100%;
  z-index: 199;
}
.new_scro{
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 999;
}
.new_scro .news_t{
  position: fixed;
  overflow: hidden;
  z-index:1000;
  width: 100%;
  left:-110%;
  bottom: 10%;
  min-height:60%;
  padding:0 18/100rem 0 18/100rem;
}
.new_scro .active{
  position: fixed;
  z-index:1000;
  width: 100%;
  left:0%;
  bottom: 10%;
  padding:0 18/100rem 0 18/100rem
}
.new_scro .news_t .new_t_list{
  overflow: hidden;
  position: relative;
  left:-110%;
  padding-bottom: 20/100rem;
}
 .new_scro .news_t .active{
  left: 0%;
  padding: 0;
  padding-bottom:0.2rem;
}
 .new_scro .news_t .active1{
  left: 0%;
}
.new_scro .news_t .new_t_list .n_left{
  width: 80/100rem;
  height: 80/100rem;
  border-radius: 10/100rem;
  float: left;
  margin-top: 10/100rem;
  margin-right: 26/100rem;
}
.new_scro .news_t .new_t_list .n_right{
  float: left;
  position: relative;
  font-size: 30/100rem;
}
.sanjiao{
  position: absolute;
  left:-10/100rem;
  bottom: 50/100rem;
  z-index: 200;
  border-right: 16/100rem solid #fff;
  border-top: 16/100rem solid transparent;
  border-bottom: 16/100rem solid transparent;
}
.new_scro .news_t .new_t_list .n_right span{
  color: #c5c5c5;
}
.new_scro .news_t .new_t_list .n_right .n_right_content{
  background: #fff;
  width:500/100rem;
  border-radius: 6/100rem;
  padding: 20/100rem 25/100rem 20/100rem 20/100rem;
}
.new_scro .news_t .new_t_list .n_right .n_right_content span{
  color: #333;
  display: inline-block;
  line-height: 45/100rem;
}
.news_b{
  border-radius: 10/100rem;
  position: relative;
  width: 720/100rem;
  margin-top:0.2rem;
  left: -110%;
}
.active2{
  left: 0%;
}
.news_b .icon-bohui{
  position: absolute;
  right: 0;
  top: -70/100rem;
  font-size:55/100rem;
  color: #dddddd;
}
.news_b .news_b_bg{
 width: 100%;
}
.news_b_content{
  position: absolute;
  top: 20/100rem;
  width: 100%;
}
.news_b_content .newpeople{
  position: relative;
  left: 50%;
  transform: translate(-50%);
  width: 224/100rem;
  height: 70/100rem;
}
.news_more{
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(125/100rem);
  width: 100/100rem;
  font-size: 22/100rem;
  background: #b16e45;
  height: 34/100rem;
  border-radius: 17/100rem;
  /* padding-left:10/100rem; */
  line-height: 34/100rem;
  color: #fad5b7;
  display:flex;
  align-items:center;
  justify-content: center;

}
.news_more_content{
}
.news_more i{
  font-size: 20/100rem;
  display: inline-flex;
 color: #fad5b7
  /* margin-top: -20/100rem; */
}
.news_free_shipping{
  overflow: hidden;
  margin-top: 60/100rem;
  padding-left:50/100rem;
}
.news_free_shipping_img{
  float: left;
  width:180/100rem;
  height:180/100rem;
}
.news_free_shipping_r{
  float: left;
  padding-left:20/100rem;
  width:440/100rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden
}
.news_free_shipping_r_t{
  font-size: 30/100rem;
  width: 360/100rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.news_free_shipping_r_c{
  font-size: 46/100rem;
  color: #a30000;
  text-decoration: line-through;
}
.news_free_shipping_r_b{
  overflow: hidden;
  margin-top: -10/100rem;
}
.news_free_shipping_r_b_pri{
  float: left;
  font-size: 46/100rem;
  color: #a30000;
}
.news_free_shipping_r_b_pri span{
  font-size: 80/100rem;
}
.news_free_shipping_r_b_user{
  float: left;
  padding-top: 20/100rem;
  padding-left:10/100rem;
}
.news_free_shipping_r_b_user span{
  display: block;
}
.news_free_shipping_r_b_user span:nth-child(1){
  font-size: 20/100rem;
  width: 130/100rem;
  height: 32/100rem;
  border-radius: 16/100rem 16/100rem 16/100rem 0;
  background: #a30000;
  color: #fff;
  text-align: center;
}
.news_free_shipping_r_b_user span:nth-child(2){
  font-size: 26/100rem;
  color: #a30000
}
.news_rightNow{
  color: #fff;
  width: 360/100rem;
  line-height: 70/100rem;
  border-radius:35/100rem;
  background: -webkit-linear-gradient(left,#f3c2a4,#fbd7b9) ;
  font-size: 32/100rem;
  text-align: center;
  position: relative;
  left: 50%;
  top: 15/100rem;
  transform: translateX(-50%)
}
.news_rightNow span:nth-child(2){
  font-size: 28/100rem;
}
  // @import '~styles/variabl less';
  .index_bg {
    background: #f2f2f2;
    padding-bottom: 0.98rem;
    position: relative;
    width: 100%;

    .sign_bg {
      position: fixed;
      right: 16/100rem;
      top: 60%;
      z-index: 100;

      img {
        width: 88/100rem;
        height: 88/100rem;
      }
    }

    .fixed_head {
      padding: 0 0.3rem;
      height: 0.9rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      top: 0;
      width: 94%;
      z-index: 50;
      position: fixed;
      background: transparent;

      .icon_bg {
        width: 0.6rem;
        height: 0.6rem;
        line-height: 0.6rem;
        text-align: center;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        position: relative;

        .iconfont {
          color: #fff;
        }

        .icon_radio {
          position: absolute;
          margin: 0;
          top: 4/100rem;
          right: -2/100rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 26/100rem;
          height: 26/100rem;
          border-radius: 50%;
          background: #f00;

          span {
            font-size: 0.14rem;
            color: #fff;
            display: inline-flex;
            align-items: center;
          }
        }
      }

      .search {
        width: 64%;
        height: 0.56rem;
        line-height: 0.56rem;
        border-radius: 0.5rem;
        background: rgba(255, 255, 255, 0.7);
        padding: 0 0.3rem;

        .iconfont {
          color: #9b9b9b;
          font-size: 0.3rem;
          font-weight: bold;
          float: left;
          display: flex;
        }

        span {
          font-size: 0.24rem;
          color: #9b9b9b;
          float: left;
          width: 70%;
          text-align: left;
        }
      }

      .search_bg {
        background: #f2f2f2;
      }
    }

    .i_header_bg {
      background: #fff;
    }

    .index_head {
      // height: 8rem;
      width: 100%;

      .swiper_bg_img {
        // height: 8rem;
        width: 100%;
        // height: auto;
        display: block;
        font-size: 0px;
      }
    }

    .index_nav {
      height: 3.08rem;
      width: 100%;
      white-space: nowrap;
      padding: 0.3rem 0;
      text-align: center;
      background: #fff;

      li {
        width: 25%;
        padding: 0.1rem 0;
        position: relative;
        float: left;
        text-align: center;

        a {
          display: inline-block;

          img {
            width: 0.88rem;
            height: 0.88rem;
          }

          span {
            width: 1.3rem;
            font-size: 0.25rem;
            color: #555;
            display: block;
            text-align: center;
          }
        }
      }
    }

    .index_win_bg {
      height: 1.84rem;
      background: #f6f6f6;

      .index_win {
        height: 1.52rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        padding: 0.16rem 0.22rem;

        .win_bg_left {
          img {
            width: 1.68rem;
            // height: 0.7rem;
          }
        }

        .win_bg_right {
          font-size: 0.2rem;
          color: #767676;
          padding: 0.16rem 0.22rem;
          z-index: 10;
          height: 1.2rem;
          width: 4.86rem;
          background: #fff;
          border-radius: 0.08rem;

          .win_block {
            display: block;
            height: 0.3rem !important;

            .win_block_info {
              display: flex;
              justify-content: space-between;
              width: 4.9rem !important;
              height: 0.3rem !important;
              align-items: center;
              color: #000;

              .i_win_mobile {
                width: 1.3rem;
                text-align: left;
              }

              .i_win_name {
                width: 1.86rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .i_win_time {
                width: 1.5rem;
              }
            }
          }
        }
      }
    }

    .index_pro_block {
      background: #fff;

      .pro_block_head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 34/100rem 30/100rem 34/100rem 32/100rem;
        padding-bottom: 0;

        /* 上右下左 */
        .i_redeem_head_left {
          img {
            height: 70/100rem;
            width: 200/100rem;
          }
        }

        .i_shop_head_left {
          img {
            width: 200/100rem;
            height: 70/100rem;
          }
        }

        .i_sale_head_left {
          font-size: 26/100rem;
          color: #343434;
          z-index: 10;
          display: inline-flex;
          justify-content: flex-start;
          align-items: flex-end;

          .f_sale_bg {
            height: 70/100rem;
            width: 200/100rem;
          }

          .sale_time_style {
            display: inline-block;
            text-align: center;
            height: 48/100rem;
            line-height: 48/100rem;
            width: 34/100rem;
            padding: 0 4/100rem;
            background: #000;
            font-size: 24/100rem;
            color: #fff;
            margin: 0 5/100rem;
          }
        }

        .i_new_head_left {
          img {
            width: 200/100rem;
            height: 70/100rem;
          }
        }

        .i_hot_head_left {
          img {
            width: 200/100rem;
            height: 70/100rem;
          }
        }

        .i_recom_head_left {
          img {
            width: 200/100rem;
            height: 70/100rem;
          }
        }

        .i_like_head_left {
          img {
            width: 200/100rem;
            height: 70/100rem;
          }
        }

        .i_more_right {
          display: inline-flex;
          align-items: center;

          span {
            color: #989898;
            font-size: 24/100rem;
          }

          .iconfont {
            display: inline-flex;
            align-items: center;
            color: #989898;
          }
        }
      }

      .i_sale_head {
        padding-bottom: 0.34rem;
      }

      .pro_block_body {
        padding: 0 30/100rem;

        .i_adv {
          width: 690/100rem;
          min-height: 260/100rem;
          // border-radius: 26/100rem;
          // box-shadow: 0/100rem 6/100rem 10/100rem 0/100rem #bdbdbd;
          margin: 20/100rem 0;

          img {
            height: 100%;
            width: 100%;
          }
        }

        .i_hot_top_block {
          background: #fff;
          box-shadow: 0/100rem 6/100rem 10/100rem 0/100rem #bdbdbd;
          margin-bottom: 20/100rem;
          border-radius: 20/100rem;

          .i_hot_img {
            img {
              height: 280/100rem;
              width: 100%;
              border-top-left-radius: 20/100rem;
              border-top-right-radius: 20/100rem;
            }
          }

          .i_hot_pro {
            height: 100/100rem;
            background: #fff;
            padding: 0 22/100rem;
            border-bottom-left-radius: 20/100rem;
            border-bottom-right-radius: 20/100rem;

            .i_hot_pro_name {
              width: 50%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              color: #989898;
              font-size: 28/100rem;
            }

            .i_hot_pro_market {
              font-size: 30/100rem;
              font-weight: bold;
              color: #979797;
              text-decoration: line-through;
            }

            .i_hot_show_title {
              font-size: 24/100rem;
              color: #ff4e79;
            }

            .i_hot_pro_point {
              font-size: 36/100rem;
              font-weight: bold;
              color: #666;
            }

            .i_hot_pro_price {
              font-size: 36/100rem;
              font-weight: bold;
              color: #2f2f2f;
            }
          }
        }

        .i_sale_info {
          min-height: 358/100rem;
          width: 100%;
          white-space: nowrap;
          overflow-x: scroll;
          overflow-y: hidden;

          .i_sale_info_pro {
            width: 262/100rem;
            min-height: 328/100rem;
            background: #fff;
            display: inline-block;
            margin-right: 26/100rem;

            .i_sale_info_pro_top {
              img {
                width: 238/100rem;
                height: 238/100rem;
              }
            }

            .i_sale_info_pro_bottom {
              .pro_title {
                font-size: 26/100rem;
                color: #999;
                overflow: hidden;
                text-overflow: ellipsis;
                // white-space: nowrap;
              }
              .pro_line_two {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                height: 70/100rem;
              }
              .pro_price {
                align-items: center;
                justify-content: center;

                .pro_price_line {
                  display: flex;
                  align-items: center;
                  line-height: 0.48rem;

                  .pro_flex {
                    display: inline-flex;
                    align-items: center;

                    .pro_inter_img {
                      color: #ff4e79;

                      .iconfont {
                        font-size: 30/100rem;
                        font-weight: bold;
                        color: #ff4e79;
                      }
                    }

                    .pro_integral {
                      font-size: 30/100rem;
                      font-weight: bold;
                      color: #ff4e79;
                    }

                    .peo_nowprice {
                      color: #ff4e79;
                      font-size: 30/100rem;
                      font-weight: bold;
                    }

                    .pro_orig {
                      font-size: 30/100rem;
                      font-weight: bold;
                      color: #9d9d9d;
                      text-decoration: line-through;
                    }
                    .line{
                      text-decoration: line-through;
                    }
                  }
                }

                .pro_count {
                  font-size: 23/100rem;
                  color: #888;
                }
              }
            }
          }
        }
      }

      .i_prolist {
        background: #fff;
        overflow: hidden;

        .i_pro {
          width: 336/100rem;
          float: left;
          background: #fff;
          margin-bottom: 24/100rem;
          position: relative;

          .pro_img {
            position: relative;

            img {
              width: 336/100rem;
              height: 336/100rem;
            }
          }

          .pro_tag {
            margin-top: 0.2rem;
            font-size: 0.2rem;
            /* width: 1rem; */
            background: #ff4e79;
            color: #fff;
            border-radius: 0.1rem;
            margin-right: 0.06rem;
            text-align: center;
            padding: 0.02rem 0.06rem;
            display: inline-block;
          }

          .pro_title {
            font-size: 24/100rem;
            color: #333;
            margin-top: 10/100rem;

            img {
              width: 88/100rem;
              height: 30/100rem;
            }

            .pro_level {
              width: 88/100rem;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              position: relative;
              height: 30/100rem;

              span {
                font-size: 16/100rem;
                color: #fefefe;
                position: absolute;
                left: 44%;
                top: 50%;
                transform: translate(-50%, -50%);
                white-space: nowrap;
              }

              .iconfont {
                color: #ff4e79;
                display: inline-flex;
              }
            }
          }

          .pro_line_two {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            height: 70/100rem;
          }

          .pro_price {
            .pro_price_line {
              display: flex;
              align-items: center;
              line-height: 0.48rem;
            }

            .pro_count {
              font-size: 23/100rem;
              color: #888;
            }

            .pro_flex {
              display: inline-flex;
              align-items: center;
            }

            .peo_nowprice {
              color: #ff4e79;
              font-size: 30/100rem;
              font-weight: bold;
            }

            .pro_integral {
              font-size: 30/100rem;
              color: #ff4e79;
              font-weight: bold;
            }

            .pro_integral_add {
              font-size: 30/100rem;
              color: #333;
            }

            .pro_inter_img {
              display: flex;
              align-items: flex-end;

              .iconfont {
                display: inline-flex;
                font-size: 30/100rem;
                color: #ff4e79;
                font-weight: bold;
              }
            }

            .pro_orig {
              font-size: 24/100rem;
              color: #888;
              /* width: 80/100rem; */
            }
            .line{
              text-decoration: line-through;
            }

            .pro_bg {
              background: #ff4e79;
              color: #fff;
              border-radius: 8/100rem;
              text-align: center;
              font-size: 20/100rem;
              // margin-right: 10/100rem;
              /* width: 100/100rem; */
              padding: 2/100rem 8/100rem;
              // line-height: 1.4;
            }

            .line {
              text-decoration: line-through;
              /* margin-left: 14/100rem; */
            }

            .pro_count {
              font-size: 23/100rem;
              color: #888;
            }
          }

          .pro_line_one {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: left;
          }

          .pro_line_two {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            min-height: 70/100rem;
            text-align: left;
          }
        }

        .i_pro:nth-child(even) {
          float: right;
        }
      }

      .i_new_list {
        overflow: hidden;

        .i_new_block {
          width: 336/100rem;
          // margin-right: 14/100rem;
          margin-bottom: 12/100rem;
          float: left;
          min-height: 368/100rem;

          .pro_img {
            img {
              width: 336/100rem;
              height: 336/100rem;
            }
          }

          .pro_title {
            overflow: hidden;
            text-overflow: ellipsis;
            // white-space: nowrap;
            font-size: 26/100rem;
            color: #333;
            margin-top: 20/100rem;
            text-align: left;

            img {
              width: 88/100rem;
              height: 30/100rem;
            }

            .pro_level {
              width: 88/100rem;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              position: relative;
              height: 30/100rem;

              span {
                font-size: 16/100rem;
                color: #fefefe;
                position: absolute;
                left: 44%;
                top: 50%;
                transform: translate(-50%, -50%);
                white-space: nowrap;
              }

              .iconfont {
                color: #ff4e79;
                display: inline-flex;
              }
            }
          }

          .pro_line_two {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            height: 70/100rem;
          }

          .pro_price {
            min-height: 80/100rem;

            .pro_price_line {
              display: flex;
              align-items: center;
              line-height: 0.48rem;
            }

            .pro_count {
              font-size: 23/100rem;
              color: #888;
            }

            .pro_flex {
              display: inline-flex;
              align-items: center;
            }

            .pro_level {
              position: relative;

              image {
                width: 38/100rem;
                height: 41/100rem;
              }

              text {
                color: #fff;
                position: absolute;
                left: 50%;
                top: 35%;
                transform: translate(-50%, -50%);
                font-size: 18/100rem;
                font-weight: bold;
              }
            }

            .peo_nowprice {
              color: #ff4e79;
              font-weight: bold;
              font-size: 26/100rem;
            }

            .pro_integral {
              font-size: 26/100rem;
              color: #ff4e79;
              font-weight: bold;
            }

            .pro_inter_img {
              display: flex;
              align-items: flex-end;

              .iconfont {
                font-size: 26/100rem;
                color: #ff4e79;
                font-weight: bold;
              }
            }

            .pro_orig {
              font-size: 24/100rem;
              color: #888;
            }
            .line{
              text-decoration: line-through;
            }

            .pro_bg {
              background: #ff4e79;
              color: #fff;
              border-radius: 8/100rem;
              text-align: center;
              font-size: 20/100rem;
              // margin-right: 10/100rem;
              /* width: 100/100rem; */
              padding: 0 8/100rem;
              line-height: 1.4;
            }
          }
        }

        .i_new_block:nth-child(even) {
          float: right;
        }
      }

      .i_like_bottom {
        background: #fff;
        padding: 20/100rem 0;
        text-align: center;

        img {
          width: 264/100rem;
          height: 54/100rem;
        }
      }
    }

    .order-foot {
      height: 84/100rem;
      line-height: 84/100rem;
      /* background: #fff; */
      text-align: center;
      margin-top: -20/100rem;
    }

    .order-foot span {
      font-size: 23.97/100rem;
      color: #bebebe;
    }

    .more_load {
      display: flex;
      justify-content: center;
    }

    .i_type {
      background: #fff;
      padding: 34/100rem 30/100rem 34/100rem 32/100rem;

      .i_type_head {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .i_type_head_left {
          img {
            width: 210/100rem;
            height: 70/100rem;
          }
        }

        .i_more_right {
          display: inline-flex;
          align-items: center;

          span {
            color: #989898;
            font-size: 24/100rem;
          }

          .iconfont {
            display: inline-flex;
            align-items: center;
            color: #989898;
          }
        }
      }

      .i_type_body {
        .i_type_block {
          width: 220/100rem;
          display: inline-block;
          height: 224/100rem;
          margin-right: 14/100rem;

          img {
            height: 224/100rem;
            width: 100%;
          }
        }

        .i_type_block:last-child {
          margin-right: 0;
        }

        .i_type_block:nth-child(1) {
          width: 380/100rem;

          img {
            width: 380/100rem;
          }
        }

        .i_type_block:nth-child(2) {
          width: 294/100rem;
          margin-right: 0;

          img {
            width: 294/100rem;
          }
        }
      }
    }

    .open_model_bg {
      position: fixed;
      z-index: 200;
      background: rgba(0, 0, 0, 0.4);
      width: 100%;
      height: 100%;
      top: 0;
    }

    .open_model {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 201;
      text-align: center;

      .package {
        width: 660/100rem;
        height: 757/100rem;
      }

      .lottery_img {
        width: 645/100rem;
        height: 645/100rem;
      }

      // i {
      //   position: absolute;
      //   right: 8/100rem;
      //   top: 3%;
      //   font-size: 58/100rem;
      //   color: #ffea00;
      // }
      .cou_close {
        text-align: center;

        i {
          font-size: 58/100rem;
          color: #fff;
        }
      }

      .model_info {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%);

        .top_title {
          font-size: 40/100rem;
          color: #ffe790;
          margin-bottom: 38/100rem;
          font-weight: bold;
          text-align: center;
        }

        .title {
          color: #d72a19;
          font-size: 30/100rem;
          font-weight: bold;
          text-align: center;
        }

        .price {
          color: #cf1202;
          margin-bottom: 18/100rem;
          text-align: center;

          span {
            font-size: 66/100rem;
            margin: -10/100rem 0;
          }

          .price_max {
            font-size: 22/100rem;
            display: block;
            text-align: center;
          }
        }

        .time {
          font-size: 16/100rem;
          color: #774022;
          text-align: center;
        }
      }

      .open_btn {
        position: absolute;
        width: 225/100rem;
        height: 56/100rem;
        left: 51%;
        transform: translateX(-50%);
        bottom: 5%;
      }

      .cou_list {
        width: 600/100rem;
        min-height: 180/100rem;
        background: #f4f4f4;
        padding: 30/100rem;
        margin-bottom: 40/100rem;
        border-radius: 10/100rem;

        .cou_info {
          height: 180/100rem;
          margin-bottom: 30/100rem;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;

          .line_radio {
            position: absolute;
          }

          .left {
            left: -7/100rem;
          }

          .right {
            right: -7/100rem;
          }

          .line_radio {
            span {
              background: #f4f4f4;
              width: 14/100rem;
              border-radius: 50%;
              height: 14/100rem;
              display: block;
              margin: 5/100rem 0;
            }
          }

          .cou_left {
            width: 76%;
            color: #fff;
            font-size: 22/100rem;
            padding-left: 20/100rem;
            text-align: left;
            background: #ff4e79;
            height: 180/100rem;

            .cou_amount {
              font-size: 26/100rem;
              margin-top: 18/100rem;
              margin-bottom: 4/100rem;
            }

            .cou_max {
              font-size: 18/100rem;
              margin-bottom: 10/100rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .cou_time {
              font-size: 18/100rem;
            }
          }

          .cou_line {
            border-left: 4/100rem dashed #f4f4f4;
            height: 180/100rem;
            background: #ff4e79;
          }

          .cou_line_get {
            background: transparent;
          }

          .cou_right {
            color: #fff;
            font-size: 24/100rem;
            width: 21%;
            background: #ff4e79;
            height: 180/100rem;

            .isget {
              color: #c9c9c9;
              font-size: 124/100rem;
              // margin-top: 13/100rem;
            }

            span {
              width: 40/100rem;
              display: block;
              margin: 0 auto;
              margin-top: 34/100rem;
              line-height: 1.2;
            }
          }

          .cou_right_get {
            background: #fff;
          }
        }

        .cou_left_get {
          background: #c9c9c9 !important;
        }

        .cou_info:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  .index_fixed {
    position: fixed;
  }
.i_newPeople_bg {
  margin:10/100rem 0;
  width: 750/100rem;
  // height: 222/100rem;
  background: #fff;
}

.i_newPeople_bg img {
  width: 750/100rem;
  // height: 222/100rem;
}
</style>
