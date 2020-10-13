<template>
  <div class="list_bg">
    <div class="list_add" @click="add" v-if="listId==5||listId==6||listId==2||listId==10">
      <i class="iconfont iconjia"></i>
    </div>
    <div class="return_top" @click="returnTop" v-if="showTop">
      <i class="iconfont icontop"></i>
    </div>
    <div class="search_head">
      <group>
        <x-input placeholder="输入主题搜索" @on-enter="search" placeholder-align="left" v-model="fifterKey.value1"
          @on-focus="fifter" @on-click-clear-icon="resetSearch">
          <img slot="right" style="padding-left:10px;padding-right: 5px;display:block;" src="@/assets/icon/search.png"
            width="14" height="14" @click="search">
        </x-input>
      </group>
    </div>
    <ul v-if="listId!=2" class="search_type">
      <li :class="{'active':searchInfo.mode==item.name}" v-for="(item,index) in typeList" :key="index"
        @click="searchList(item.name)"><span>{{item.text}}</span><span v-if="item.name === 'wait'">({{waitNum}})</span>
      </li>
    </ul>
    <!-- 拜访 -->
    <ul v-if="listId==2" class="search_type">
      <li :class="{'active':searchInfo.mode==item.name}" v-for="(item,index) in visitList" :key="index"
        @click="searchList(item.name)"><span>{{item.text}}</span><span v-if="item.name === 'wait'">({{waitNum}})</span>
      </li>
    </ul>
    <my-scroller lock-x :height="listHeight" use-pullup :pullup-config="config" :bounce="false" ref="loadingMore"
      @on-pullup-loading="loadMoreFollow" @on-scroll="watchScroll">
      <div>
        <!-- 拜访 -->
        <div class="info_list" v-if="listId==2">
          <div v-if="searchInfo.mode !== 'wait'" v-for="(item,index) in tableData" :key="index" class="info_block"
            v-show="tableData.length>0" @click="goView(item.id, item.processTypeId,'view')">
            <div class="info_left" v-if="searchInfo.mode !== 'founding'">
              <p class="info_title">{{item.sourceName}}</p>
              <p class="info_user">
                <span v-if="listId!=2" class="user_name">申请人：{{item.accountName}}</span>
                <span v-if="listId==2" class="user_name">发起人：{{item.accountName}}</span>
                <span class="info_time">{{item.createdDate}}</span>
              </p>
              <p class="info_user"><span class="user_name">审批类型：{{item.processTypeName}}</span></p>
              <!-- <p class="info_user"><span class="info_time">提交时间：{{item.startDate}}</span></p> -->
            </div>
            <!-- 我发起的 -->
            <div class="info_left" v-if="searchInfo.mode == 'founding'">
              <p class="info_title">
                <badge class="tagShow" v-if="item.istoday === '0'" text="今日"></badge><span
                  :class="{'titleSize':listId==2}">{{item.sourceName}}</span>
              </p>
              <p class="info_user">
                <span v-if="listId!=2" class="user_name">申请人：{{item.accountName}}</span>
                <span v-if="listId==2" class="user_name">发起人：{{item.accountName}}</span>
                <span class="user_name">{{item.startDate}}</span>
              </p>
              <!-- <p class="info_user"><span v-if="listId==2" class="user_name">时间：{{item.startDate}}</span></p> -->
              <p class="info_user"><span class="user_name">审批类型：{{item.processTypeName}}</span></p>
              <!-- <p class="info_user"><span class="info_time">提交时间：{{item.startDate}}</span></p> -->
            </div>
            <div class="info_right">
              <span class="success" v-if="item.status==4&&searchInfo.mode!='wait'"><i></i>通过</span>
              <span class="fail" v-if="item.status==2&&searchInfo.mode!='wait'"><i></i>驳回</span>
              <span class="info" v-if="item.status==1&&searchInfo.mode!='wait'"><i></i>审批中</span>
              <span class="info" v-if="item.status==0&&searchInfo.mode!='wait'"><i></i>待审批</span>
              <span v-if="searchInfo.mode=='wait'" @click="goView(item.id, item.processTypeId,'approval')"
                class="wait">审批</span>
            </div>
          </div>
          <!-- 待我审批 -->
          <div v-if="searchInfo.mode === 'wait'" v-for="(item,index) in tableData" :key="index" class="info_block"
            v-show="tableData.length>0" @click="goView(item.id, item.processTypeId, 'approval')">
            <div class="info_left">
              <p class="info_title">{{item.sourceName}}</p>
              <p class="info_user">
                <span v-if="listId!=2" class="user_name">申请人：{{item.accountName}}</span>
                <span v-if="listId==2" class="user_name">发起人：{{item.accountName}}</span>
                <span class="user_name">{{item.startDate}}</span>
              </p>
              <p class="info_user"><span class="user_name">审批类型：{{item.processTypeName}}</span></p>
              <!-- <p class="info_user"><span class="info_time">提交时间：{{item.startDate}}</span></p> -->
            </div>
            <div class="info_right">
              <span v-if="searchInfo.mode=='wait'" class="wait">审批</span>
            </div>
          </div>
        </div>
        <div class="info_list" v-if="listId!=2">
          <div v-if="searchInfo.mode !== 'wait'" v-for="(item,index) in tableData" :key="index" class="info_block"
            v-show="tableData.length>0" @click="goView(item.id, item.processTypeId,'view')">
            <div class="info_left" v-if="searchInfo.mode !== 'founding'">
              <p class="info_title">{{item.accountName}}</p>
              <p class="info_user">
                <span class="user_name">审批类型：{{item.processTypeName}}</span>
              </p>
              <p class="info_user">
                <span class="info_time">提交时间：{{item.createdDate}}</span>
              </p>
            </div>
            <!-- 我发起的 -->
            <div class="info_left" v-if="searchInfo.mode == 'founding'">
              <p class="info_title">{{item.accountName}}</p>
              <p class="info_user">
                <span class="user_name">审批类型：{{item.processTypeName}}</span>
              </p>
              <p class="info_user">
                <span class="info_time">提交时间：{{item.createdDate}}</span>
              </p>
            </div>
            <div class="info_right">
              <span class="success" v-if="item.status==4&&searchInfo.mode!='wait'"> <i></i> 通过</span>
              <span class="fail" v-if="item.status==2&&searchInfo.mode!='wait'"><i></i>驳回</span>
              <span class="info" v-if="item.status==1&&searchInfo.mode!='wait'"><i></i>审批中</span>
              <span class="info" v-if="item.status==0&&searchInfo.mode!='wait'"><i></i>待审批</span>
              <span v-if="searchInfo.mode=='wait'" @click="goView(item.id, item.processTypeId,'approval')"
                class="wait">审批</span>
            </div>
          </div>
          <!-- 待我审批 -->
          <div v-if="searchInfo.mode === 'wait'" v-for="(item,index) in tableData" :key="index" class="info_block"
            v-show="tableData.length>0" @click="goView(item.id, item.processTypeId, 'approval')">
            <div class="info_left">
              <p class="info_title">{{item.accountName}}</p>
              <p class="info_user">
                <span class="user_name">审批类型：{{item.processTypeName}}</span>
              </p>
              <p class="info_user">
                <span class="info_time">提交时间：{{item.createdDate}}</span>
              </p>
            </div>
            <div class="info_right_btn">
              <span v-if="searchInfo.mode=='wait'">审批</span>
            </div>
          </div>
        </div>
        <load-more :show-loading="false" tip="到底啦" background-color="#fbf9fe" v-if="total>0&&tableData.length==total">
        </load-more>
        <load-more :show-loading="false" tip="暂无数据" background-color="#fbf9fe" v-if="total==0"></load-more>
      </div>
    </my-scroller>
  </div>
</template>

<script>
  import {
    getApprovalInfo,
    searchFifter,
    getWorkNum, //获取审批列表数据
    getFifter // 获取审批列表
  } from "@/api/public"
  import {
    Badge,
    Group,
    Cell
  } from 'vux'
  export default {
    components: {
      Badge,
      Group,
      Cell
    },
    name: "List",
    data() {
      return {
        showTop: false,
        listHeight: '',
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
        listId: "",
        results: [],
        tableData: [],
        total: 0,
        value: "",
        waitNum: 0,
        foundingNum: 0,
        modeType: '',
        typeList: [{
            text: "待我审批",
            name: "wait"
          },
          {
            text: "我已审批",
            name: "audited"
          },
          {
            text: "我发起的",
            name: "founding"
          }
          // ,
          // {
          //   text: "全部审批",
          //   name: "all"
          // }
        ],
        visitList: [{
            text: "我的拜访",
            name: "founding"
          },
          {
            text: "待我审批",
            name: "wait"
          },
          {
            text: "我已审批",
            name: "audited"
          }
        ],
        searchInfo: {
          mode: "wait", // 类型
          search: "", // 搜索关键字
          orderBy: "", // 排序字段
          pageID: 1, // 第几页
          recPerPage: 10, // 每页显示条数
          recTotal: 0, // 总条数
          listType: 0 // 总条数
        },
        fifterKey: {
          app: 'oa',
          module: 'workflow',
          field1: 'a.sourceName',
          value1: '',
          count: 1
        }
      };
    },
    created() {

    },
    mounted() {
      setTimeout(() => {
        this.remainder();
      }, 20)
      this.listId = this.$route.query.id;
      this.searchInfo.listType = this.listId;
      // 页面第一个渲染的函数
      if (this.$route.query.id === 2 || this.$route.query.id === '2') {
        this.searchInfo.mode = 'founding'
      }
      this.getList();
      this.getAllNum();
      this.$nextTick(() => {
        this.$refs.loadingMore.disablePullup()
        this.$refs.loadingMore.reset({
          top: 0
        })
      })
    },
    methods: {
      // 计算可滚动区域高度
      remainder() {
        // 获取屏幕可视区域
        console.log(window.innerHeight)
        // 获取搜索框高度
        let search_height = document.getElementsByClassName('search_head')[0].clientHeight
        console.log(document.getElementsByClassName('search_head')[0].clientHeight)
        // 获取顶部tab高度
        let tab_height = document.getElementsByClassName('search_type')[0].clientHeight
        console.log(document.getElementsByClassName('search_type')[0].clientHeight)
        // 获取底部导航高度
        let foot_height = document.getElementsByClassName('weui-tabbar')[0].clientHeight
        console.log(document.getElementsByClassName('weui-tabbar')[0].clientHeight)
        // 设置可滚动区域高度
        console.log(window.innerHeight - search_height - tab_height - foot_height - 15)
        this.listHeight = window.innerHeight - search_height - tab_height - foot_height - 15 + 'px'
      },
      getList() {
        const that = this
        getApprovalInfo(this.searchInfo).then(res => {
          console.log(res, 'fff')
          if (res.code === 200) {
            that.tableData = res.data.workflows;
            that.modeType = res.data.mode
            // if (res.data.mode === 'founding'){
            //   this.foundingNum = res.data.pager.recTotal
            //   console.log(this.foundingNum)
            // }
            console.log(that.tableData, 'fds')
            that.total = res.data.pager.recTotal; // 总条数
            if (that.total == 0 || that.tableData.length == that.total) {
              // 禁用上拉加载更多
              that.$refs.loadingMore.disablePullup()
            } else {
              // 启用上拉加载更多
              that.$refs.loadingMore.enablePullup()

            }
          }
        });
      },
      getAllNum() {
        getWorkNum(this.listId).then(res => {
          console.log(res, '1b1')
          if (res.code === 200) {
            this.waitNum = res.data.count==null?0:res.data.count
            this.foundingNum = res.data.visite==null?0:res.data.visite
          }
        })
      },
      watchScroll(position) {
        if (position.top > window.screen.height / 2) {
          this.showTop = true
        } else {
          this.showTop = false
        }
      },
      loadMoreFollow() {
        console.log("触发了饿吗")
        const that = this
        ++this.searchInfo.pageID
        getApprovalInfo(this.searchInfo).then(res => {
          if (res.code === 200) {
            if (res.data.workflows.length == 0) {
              that.$refs.loadingMore.disablePullup() // 禁用上拉
            } else {
              that.tableData = that.tableData.concat(res.data.workflows);
              that.total = res.data.pager.recTotal; // 总条数
              if (that.tableData.length === that.total) {
                that.$refs.loadingMore.disablePullup() // 禁用上拉
              } else {
                that.$refs.loadingMore.donePullup()
              }
            }
          }
        });
      },
      searchList(data) {
        this.searchInfo.pageID = 1
        this.searchInfo.mode = data;
        this.tableData = [];
        this.$nextTick(() => {
          this.$refs.loadingMore.disablePullup()
          this.$refs.loadingMore.reset({
            top: 0
          })
        })
        setTimeout(() => {
          this.getList();
        }, 20)
      },
      fifter() {
        getFifter('workflow', 'oa').then(res => {})
      },
      search() {
        const that = this
        this.$nextTick(() => {
          this.$refs.loadingMore.reset({
            top: 0
          })
        })
        this.tableData = [];
        searchFifter(this.fifterKey).then(res => {
          if (res.code === 200) {
            that.searchInfo.search = "bySearch"
            that.getList()
          }
        })
      },
      resetSearch() {
        const that = this
        this.$nextTick(() => {
          this.$refs.loadingMore.reset({
            top: 0
          })
        })
        that.searchInfo.search = ""
        that.getList()
      },
      goView(id, processId, type) {
        if (type === 'view') {
          this.$router.push({
            path: "/main/detail?show=view&id=" + id + '&type=' + this.listId + '&mode=' + this.modeType +
              '&processId=' + processId
          });
        } else {
          this.$router.push({
            path: "/main/detail?show=approval&id=" + id + '&type=' + this.listId + '&processId=' + processId
          });
        }
      },
      add() {
        this.$router.push({
          path: "/main/new?show=add&type=" + this.listId + '&infoId='
        });
      },
      returnTop() {
        this.$nextTick(() => {
          this.$refs.loadingMore.reset({
            top: 0
          })
          this.showTop = false
        })
      },
    }
  };

</script>
<style lang="less" scoped>
  .list_bg {

    .list_add {
      position: fixed;
      right: 0.35rem;
      bottom: 20%;
      z-index: 100;

      i {
        font-size: 0.8rem;
        color: #3e8afd;
        background: #fff;
        border-radius: 50%;
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

    .search_head {
      // margin: 0.25rem 0;
      padding: 0.16rem 0.3rem;
      background: #fff;
      border-bottom: 0.02rem solid #f2f2f2;

      & /deep/.weui-cells {
        border-radius: 0.14rem;
        margin-top: 0;

        .weui-cell {
          // border: 1px solid #f3f3f3;
          // border-radius: 0.14rem;
          // padding: 0.1rem 0.15rem;
          border-radius: 0.5rem;
          padding: 0.06rem 0.15rem;
          background: #f3f3f3;

          .weui-input {
            font-size: 0.24rem;
          }
        }
      }

      & /deep/.weui-cells:before {
        border-top: none;
      }

      & /deep/.weui-cells:after {
        border-bottom: none;
      }

      & /deep/.weui-cell__ft {
        display: inline-flex;
        align-items: center;
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
        width: 33.33%;
        text-align: center;
        color: #333333;
        font-size: 0.26rem;
        border-bottom: 0.02rem solid #f2f2f2;

      }

      // li:last-child {
      //   background: transparent;
      //   padding: 0 0.1rem;
      //   width: 5%;
      //   border-radius: 0.14rem;

      //   i {
      //     font-size: 0.5rem;
      //     color: #29a14a;
      //   }
      // }

      .active {
        color: #3e8afd;
        border-bottom: 0.04rem solid #3e8afd;
        padding-bottom: 0.16rem;
      }

    }

    .load_style {
      text-align: center;
      width: 100%;
    }

    .info_list {
      padding: 0 0.2rem;
      list-style: none;

      .tagShow {
        display: inline-block;
        text-align: center;
        background: #fff;
        color: #f74c31;
        font-size: 0.22rem;
        height: 0.32rem;
        line-height: 0.32rem;
        border-radius: 0.05rem;
        padding: 0 0.12rem;
        background-clip: padding-box;
        vertical-align: middle;
        border: 1px solid #f74c31;
        margin-right: 0.2rem;
      }

      .info_block {
        display: flex;
        min-height: 1.2rem;
        background: #ffffff;
        margin-bottom: 0.16rem;
        justify-content: space-between;
        align-items: center;
        padding: 0.1rem 0.2rem;
        border-radius: 0.14rem;

        .info_left {
          width: 66%;

          .info_title {
            color: #333333;
            font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
            font-weight: 700;
            font-size: 0.24rem;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .titleSize {
            font-size: 0.28rem;
            // margin-bottom: 0.1rem;
            // margin-top: 0.1rem;
            // font-weight: 700;
          }

          .info_user {
            font-size: 0.22rem;
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

          span.fail {

            // background-color: rgba(245, 108, 108, 0.1);
            // border-color: rgba(245, 108, 108, 0.2);
            // color: #f56c6c;
            i {
              background: #f56c6c;
            }
          }

          span.wait {
            width: 1.08rem;
            height: 0.6rem;
            font-size: 0.26rem;
            border-radius: 0.14rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: 1px solid;
            color: #fff;
            background-color: #409eff;
            border-color: #409eff;
          }
        }

        .info_right_btn {
          display: inline-flex;
          z-index: 100;

          span {
            width: 1.08rem;
            height: 0.6rem;
            font-size: 0.26rem;
            border-radius: 0.14rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: 1px solid;
            color: #fff;
            background-color: #409eff;
            border-color: #409eff;
          }
        }
      }
    }
  }

</style>
