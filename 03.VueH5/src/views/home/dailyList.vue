<template>
  <div class="daily_bg">
    <div class="return_top" @click="returnTop" v-if="showTop">
      <i class="iconfont icontop"></i>
    </div>
    <ul class="search_type">
      <li :class="{'active':searchInfo.mode==item.name}" v-for="(item,index) in typeList" :key="index"
        @click="searchList(item.name)"><span>{{item.text}}</span>
      </li>
    </ul>
    <my-scroller lock-x :height="listHeight" use-pullup :pullup-config="config" :bounce="false" ref="loadingMore"
      @on-pullup-loading="loadMoreFollow" @on-scroll="watchScroll">
      <div class="info_list">
        <div v-for="(item,index) in tableData" :key="index" class="info_block" v-show="tableData.length>0" @click="goView(item.id,'view',item.status)">
          <div class="info_left">
            <p class="info_title"><span>【{{item.startDate}}】</span>{{item.accountName}}日报</p>
            <!-- <p class="info_user">
              <span class="user_name">创建人：{{item.accountName}}</span>
              <span class="info_time">{{item.createdDate}}</span>
            </p> -->
          </div>
          <div class="info_right">
            <!-- <span class="success" v-if="item.status==4&&searchInfo.mode!='wait'">完成</span>
            <span class="fail" v-if="item.status==2&&searchInfo.mode!='wait'">驳回</span>
            <span class="info" v-if="item.status==1&&searchInfo.mode!='wait'">审阅中</span>
            <span class="info" v-if="item.status==0&&searchInfo.mode!='wait'">待审阅</span> -->
            <span class="info" v-if="item.status==1"><i></i>待审阅</span>
            <span class="success" v-if="item.status==2"><i></i>已审阅</span>
          </div>
        </div>
        <load-more :show-loading="false" tip="到底啦" background-color="#fbf9fe" v-if="total>0&&tableData.length==total"></load-more>
        <load-more :show-loading="false" tip="暂无数据" background-color="#fbf9fe" v-if="total==0"></load-more>
      </div>

    </my-scroller>
  </div>
</template>

<script>
  import {
    getDailyInfo
  } from "@/api/public"
  export default {
    name: 'DailyList',
    data() {
      return {
        tableData: '',
        total: '',
        showTop:false,
        searchInfo: {
          mode: 'mobile', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
          search: '', // 搜索关键字
          orderBy: '', // 排序字段
          pageID: 1, // 第几页
          recPerPage: 10, // 每页显示条数
          recTotal: 0 // 总条数
        },
        typeList: [{
            text: "待我审阅",
            name: "wait"
          },
          {
            text: "我已审阅",
            name: "mobile"
          }
        ],
        listHeight: 'calc(100vh - 2.4rem)',
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
        loadMore: true,
        isLoading: false,
      }
    },
    created() {

    },
    mounted() {
      setTimeout(() => {
        this.remainder();
      }, 20)
      // 页面第一个渲染的函数
      this.$nextTick(() => {
        this.$refs.loadingMore.disablePullup()
        this.$refs.loadingMore.reset({
          top: 0
        })
      })
      if(this.$route.query.type != undefined && this.$route.query.type == 'wait'){
        this.searchInfo.mode = 'wait'
      }
      this.getList()
    },
    methods: {
      // 计算可滚动区域高度
      remainder() {
        // 获取屏幕可视区域
        console.log(window.innerHeight)
        // 获取顶部tab高度
        let tab_height = document.getElementsByClassName('search_type')[0].clientHeight
        console.log(document.getElementsByClassName('search_type')[0].clientHeight)
        // 获取底部导航高度
        let foot_height = document.getElementsByClassName('weui-tabbar')[0].clientHeight
        console.log(document.getElementsByClassName('weui-tabbar')[0].clientHeight)
        // 设置可滚动区域高度
        console.log(window.innerHeight - tab_height - foot_height - 15)
        this.listHeight = window.innerHeight - tab_height - foot_height - 15 + 'px'
      },
      searchList(data) {
        this.searchInfo.pageID = 1
        this.searchInfo.mode = data;
        this.isLoading = true;
        this.tableData = [];
        this.$nextTick(() => {
          this.$refs.loadingMore.reset({
            top: 0
          })
        })
        this.getList();
      },
      // 方法
      getList() {
        const that = this
        getDailyInfo(this.searchInfo).then(res => {
          console.log(res, 'gfffffffff')
          if (res.code === 200) {
            that.tableData = res.data.dailys
            that.total = res.data.pager.recTotal // 总条数
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
      loadMoreFollow() {
        const that = this
          ++this.searchInfo.pageID
        getDailyInfo(this.searchInfo).then(res => {
          if (res.code === 200) {
            if (res.data.dailys.length == 0) {
              that.$refs.loadingMore.disablePullup() // 禁用上拉
              that.loadMore = true
              return false
            } else {
              that.tableData = that.tableData.concat(res.data.dailys);
              that.total = res.data.pager.recTotal; // 总条数
              if (that.tableData.length === that.total) {
                that.$refs.loadingMore.disablePullup() // 禁用上拉
                that.loadMore = true
              } else {
                that.loadMore = false
                that.$refs.loadingMore.donePullup()
              }
            }
          }
        });
      },
      goView(id, type, status) {
        console.log(status, 'fsdgfs')
        this.$router.push({
          path: "/main/dailyDetail?id=" + id
        });
      },
    }
  }

</script>
<style lang="less" scoped>
  .daily_bg {
    // background: #f3f3f3;
    // padding: 0.3rem;

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
    .search_type {
      list-style: none;
      display: flex;
      align-items: center;
      margin-bottom: 0.25rem;
      background: #fff;

      li {
        padding: 0.18rem 0;
        // margin-right: 0.04rem;
        // border-radius: 0.14rem;
        width: 50%;
        text-align: center;
        color: #333333;
        font-size: 0.22rem;
        border-bottom: 0.02rem solid #f2f2f2;

      }


      .active {
        color: #3e8afd;
        border-bottom: 0.04rem solid #3e8afd;
        padding-bottom: 0.16rem;
      }

    }

    .info_list {
      padding: 0 0.3rem;
      list-style: none;

      .info_block {
        display: flex;
        height: 1.2rem;
        background: #ffffff;
        margin-bottom: 0.16rem;
        justify-content: space-between;
        align-items: center;
        padding: 0 0.1rem;
        border-radius: 0.14rem;
        box-shadow: 1px 0px 8px rgba(215, 215, 215, 0.349019607843137);

        .info_left {
          width: 66%;

          .info_title {
            color: #333333;
            font-size: 0.24rem;
            width: 100%;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap
          }

          .info_user {
            font-size: 0.18rem;
            color: #666;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }
        }

        .info_right {
          display: inline-flex;
          z-index: 100;
          margin-right: 0.1rem;
          span {
            // width: 1.08rem;
            // height: 0.6rem;
            font-size: 0.24rem;
            // border-radius: 0.14rem;
            // display: inline-flex;
            // align-items: center;
            // justify-content: center;
            // border: 1px solid;
            // color: #fff;
            // background-color: #409eff;
            // border-color: #409eff;
            display: inline-flex;
            align-items: center;
            justify-content: center;

            i {
              width: 0.1rem;
              height: 0.1rem;
              border-radius: 50%;
              display: inline-flex;
              background: #fff;
              margin-right: 0.05rem;
            }
          }

          span.success {

            // background-color: rgba(103, 194, 58, 0.1);
            // border-color: rgba(103, 194, 58, 0.2);
            // color: #67c23a;
            i {
              background: #67c23a;
            }
          }

          span.info {

            // border: 1px solid rgba(64, 158, 255, 0.2);
            // color: #409eff;
            // background-color: rgba(64, 158, 255, 0.1);
            i {
              background: #409eff;
            }
          }
        }
      }
    }

  }

</style>
