<template>
  <div class="News_bg">
    <div class="return_top" @click="returnTop" v-if="showTop">
      <i class="iconfont icontop"></i>
    </div>
    <my-scroller class="scroll_bg" lock-x :height="listHeight" use-pullup :pullup-config="config" :bounce="false" ref="loadingMore" @on-pullup-loading="loadMoreFollow" @on-scroll="watchScroll">
      <div>
        <div is-link class="News_wraper" v-for="(item,index) in list" :key="index" @click="goView(item.id)">
            <div class="News_content">
                <div class="News_content_t">
                    <div class="News_content_t_l">
                        <!-- <img src="@/assets/icon/notice1.png" alt="" srcset=""> -->
                        <img class="img" src="@/assets/icon/news1.png" alt="" srcset="">
                        <!-- <span class="img"></span> -->
                        <span class="tit">{{item.title}}</span>
                    </div>
                   <span class="yes_read" v-if="item.readed=='1'"><i></i>未读</span>
                   <span class="no_read" v-if="item.readed=='2'"><i></i>已读</span>
                </div>
                <div class="News_content_b">
                  <div class="img_wraper">
                    <img src="@/assets/icon/notice1.png" alt="" srcset="">
                  </div>
                  <span>{{item.releaseDate}}</span>
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
    getMessageInfo,
  } from '@/api/public'
  export default {
    name: 'MessageNews',
    data() {
      return {
        list: [],
        total:0,
        showTop:false,
        config: {
          content: '请上拉刷新数据...',
          pullUpHeight: 60,
          height: 40,
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
        getMessageInfo(this.searchInfo).then(res => {
            that.loading = false
            if (res.code === 200) {
              for (let i = 0; i < res.data.messages.length; i++) {
                res.data.messages[i].releaseDate = res.data.messages[i].releaseDate.substring(0, 10)
              }
              that.list = res.data.messages
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
      loadMoreFollow() {
          console.log("hahaha")
        const that = this
        ++this.searchInfo.pageID
        getMessageInfo(this.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
            if (res.data.messages.length == 0) {
            that.$refs.loadingMore.disablePullup() // 禁用上拉
            that.loadMore = true
            return false
            } else {
            for (let i = 0; i < res.data.messages.length; i++) {
                res.data.messages[i].releaseDate = res.data.messages[i].releaseDate.substring(0, 10)
            }
            that.list = that.list.concat(res.data.messages)
            that.total = res.data.pager.recTotal // 总条数
            if (that.total === 0 || that.list.length === that.total) {
                // 禁用上拉加载更多
                that.$refs.loadingMore.disablePullup()
            } else {
                // 启用上拉加载更多
                that.$refs.loadingMore.enablePullup()
            }
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
      returnTop() {
        this.$nextTick(() => {
          this.$refs.loadingMore.reset({
            top: 0
          })
          this.showTop = false
        })
      },
      watchScroll(position){
        console.log(position.top)
        console.log(window.screen.height/2)
        if(position.top>window.screen.height/2) {
          this.showTop = true
        } else {
          this.showTop = false
        }
      },
      goView(id){
        this.$router.push({
          path: "/main/messageView?id=" + id + '&type=message'
        });
      },
    }
  }
</script>
<style lang="less" scoped>
  .News_bg {
    padding:0.3rem;
    .News_wraper{
        border-radius: 0.1rem;
        margin-bottom: 0.2rem;
        background: #fff;
        box-shadow: 0.02rem 0 0.16rem rgba(215, 215, 215, 0.349019607843137);
        .News_content{
            padding: 0.3rem;
            .News_content_t{
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-weight: 400;
                font-style: normal;
                font-size: 0.28rem;
                color: #666666;
                margin-bottom: 0.2rem;
                .News_content_t_l{
                   display: flex;
                   align-items: center;
                    .img{
                       display: inline-flex;
                       width: 0.4rem;
                       height: 0.4rem;
                       margin-right: 0.1rem;
                    }
                    .tit{
                        overflow: hidden;
                        display: inline-block;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        width: 5rem;
                        overflow: hidden;
                    }
                }
                .yes_read{
                  font-size: 0.24rem;
                    i{
                        background: #FC737B;
                    }
                }
                .no_read{
                  font-size: 0.24rem;
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
            .News_content_b{
                font-weight: 400;
                font-style: normal;
                font-size:0.24rem;
                display: flex;
                align-items: center;
                color: #999999;
                .img_wraper{
                    width: 0.44rem;
                    height: 0.44rem;
                    text-align: center;
                    margin-right: 0.1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    img{
                        display: inline-block;
                        width: 0.32rem;
                        height: 0.32rem; 
                    }
                }
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
