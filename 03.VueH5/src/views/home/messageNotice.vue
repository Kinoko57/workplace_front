<template>
  <div class="notice_bg">
    <div class="return_top" @click="returnTop" v-if="showTop">
      <i class="iconfont icontop"></i>
    </div>
    <my-scroller lock-x :height="listHeight" use-pullup :pullup-config="config" :bounce="false" ref="loadingMore" @on-pullup-loading="loadMoreFollow" @on-scroll="watchScroll">
      <div>
        <div class="notice_wraper" v-for="(item,index) in list" :key="index" @click="goView(item.id)">
            <div class="notice_top">
                <span class="notice_top_l">【{{item.title}}】</span>
                <div class="notice_top_r">
                    <span class="yes_read" v-if="item.isTop==1"><i></i>置顶</span>
                    <!-- <span class="no_read" v-if="false"><i></i>未读</span> -->
                </div>
            </div>
            <!-- <div class="notice_center">{{item.content}}</div> 富文本框可能包含图片，直接显示标签很奇怪-->
            <div class="notice_center">创建人：{{item.accountName}}</div>
            <div class="notice_bottom">
                <div class="notice_bottom_l">
                  <img src="@/assets/icon/notice1.png" alt="" srcset="">
                  <span>{{item.createdDate}}</span>
                </div>
                <div class="notice_bottom_r">
                  <span>阅读原文</span>
                  <i class="iconfont iconyoujiantou"></i>
                </div>
            </div>
        </div>
        <load-more :show-loading="false" tip="到底啦" background-color="#fbf9fe" v-if="total>0&&list.length==total">
        </load-more>
        <load-more :show-loading="false" tip="暂无数据" background-color="#fbf9fe" v-if="total==0"></load-more>
      </div>
    </my-scroller>
  </div>
</template>

<script>
  import {
    getReportInfo,
  } from '@/api/public'
  export default {
    name: 'MessageNotice',
    data() {
      return {
        list: [],
        total:0,
        showTop:false,
        config: {
          content: '请上拉刷新数据...',
          pullUpHeight: 60,
          height:40,
          autoRefresh: false,
          downContent: '释放后加载',
          upContent: '请上拉刷新数据...',
          loadingContent: '加载中...',
          clsPrefix: 'xs-plugin-pullup-'
        },
        listHeight: '', // calc(100vh - 1.6rem)
        searchInfo: {
          mode: "all", // 类型
          search: "", // 搜索关键字
          orderBy: "", // 排序字段
          pageID: 1, // 第几页
          recPerPage: 14, // 每页显示条数
          recTotal: 0, // 总条数
          listType: 0 // 总条数
        }
      }
    },
    mounted() {
      setTimeout(() => {
        this.remainder();
      }, 20)
       this.$nextTick(() => {
        this.$refs.loadingMore.disablePullup()
        this.$refs.loadingMore.reset({
          top: 0
        })
      })
      // 页面第一个渲染的函数
      this.getList()
    },
    methods: {
      // 计算可滚动区域高度
      remainder() {
        // 获取屏幕可视区域
        console.log(window.innerHeight)
        // 获取底部导航高度
        let foot_height = document.getElementsByClassName('weui-tabbar')[0].clientHeight
        console.log(document.getElementsByClassName('weui-tabbar')[0].clientHeight)
        // 设置可滚动区域高度
        console.log(window.innerHeight  - foot_height - 30)
        this.listHeight = window.innerHeight  - foot_height - 30 + 'px'
      },
      // 方法
      getList() {
        const that = this
        console.log(this.listType)
        getReportInfo(this.searchInfo).then(res => {
          that.loading = false
          if (res.code === 200) {
            for (let i = 0; i < res.data.notices.length; i++) {
              res.data.notices[i].createdDate = res.data.notices[i].createdDate.substring(0, 10)
            }
            that.list = res.data.notices
            that.total = res.data.pager.recTotal // 总条数
            if (that.total === 0 || that.list.length === that.total) {
              // 禁用上拉加载更多
              that.$refs.loadingMore.disablePullup()
            } else {
              // 启用上拉加载更多
              that.$refs.loadingMore.enablePullup()
            }
          }
        })
      },
      watchScroll(position){
        if(position.top>window.screen.height/2) {
          this.showTop = true
        } else {
          this.showTop = false
        }
      },
     returnTop() {
        this.$nextTick(() => {
          this.$refs.loadingMore.reset({
            top: 0
          })
          this.showTop = false
        })
      },
      loadMoreFollow() {
        console.log("hahaha")
        const that = this
        ++this.searchInfo.pageID
        getReportInfo(this.searchInfo).then(res => {
          that.loading = false
          if (res.code === 200) {
            if (res.data.notices.length == 0) {
              that.$refs.loadingMore.disablePullup() // 禁用上拉
              that.loadMore = true
              return false
            } else {
              for (let i = 0; i < res.data.notices.length; i++) {
                res.data.notices[i].createdDate = res.data.notices[i].createdDate.substring(0, 10)
              }
              that.list = that.list.concat(res.data.notices)
              that.total = res.data.pager.recTotal // 总条数
              if (that.list.length === that.total) {
                that.$refs.loadingMore.disablePullup() // 禁用上拉
                that.loadMore = true
              } else {
                that.loadMore = false
                that.$refs.loadingMore.donePullup()
              }
            }
          }
        })
      },
       goView(id){
        this.$router.push({
          path: "/main/messageView?id=" + id + '&type=report'
        });
      },
    }
  }
</script>
<style lang="less" scoped>
  .notice_bg {
    padding:0.3rem;
    .notice_wraper{
        border-radius: 0.1rem;
        margin-bottom: 0.2rem;
        background: #fff;
        box-shadow: 0.02rem 0 0.16rem rgba(215, 215, 215, 0.349019607843137);
        .notice_top{
            padding: 0.3rem 0.2rem 0;
            display: flex;
            color: #666;
            justify-content: space-between;
          .notice_top_l{
            font-weight: 700;
            overflow: hidden;;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.26rem;
            width: 90%;
          }
         .notice_top_r{
            display: inline-block;
            font-size: 0.24rem;
            width: 14%;
            text-align: right;
            .yes_read{
                i{
                    background: #FC737B;
                }
            }
            .yes_read{
                i{
                    background: #67c23a;
                }
            }
             i {
              width: 0.1rem;
              height: 0.1rem;
              border-radius: 50%;
              display: inline-flex;
              margin-right: 0.05rem;
              vertical-align: middle;
            }
         }
        }
        .notice_center{
            margin: 0.1rem 0.2rem 0.2rem;
            font-size: 0.24rem;
            color: #999999;
            display:-webkit-box;
            overflow:hidden;
            white-space:normal;
            text-overflow:ellipsis;
            word-wrap:break-word;
            -webkit-line-clamp:2;
            -webkit-box-orient:vertical;
            font-weight: 400;
            padding-left: 0.14rem;
        }
        .notice_bottom{
            height: 0.80rem;
            padding: 0 0.2rem;
            border-top:0.01rem solid rgba(242, 242, 242, 1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 400;
            font-size: 0.24rem;
            color: #999999;
            .notice_bottom_l{
                display:inline-flex;
                align-items: center;
               img{
                margin-right: 0.05rem;
                width: 0.32rem;
                height: 0.32rem;
               }
            }
            .notice_bottom_r{
                display: inline-flex;
                align-items: center;
            }
        }
    }
    .return_top {
      position: fixed;
      right: 0.3rem;
      bottom: 10%;
      z-index: 100;

      i {
        text-align: right;
        font-size: 0.9rem;
        color: rgba(0, 0, 0, .4);
      }
    }
  }

</style>
