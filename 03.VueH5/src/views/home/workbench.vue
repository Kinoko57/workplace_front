<template>
  <div class="work_bg">
    <div class="work_head">
      <div class="work_head_top" style="background:#3e8afd">
        <div class='work_right'>
          <i class="iconfont icongerenfill person_icon" @click="goLink('/main/person')"></i>
        </div>
        <img src="@/assets/icon/logo.png" alt srcset class="work_logo">
        <p>神首集团</p>
      </div>
      <div class='work_head_bg'></div>
    </div>
    <!-- <div style="height:1.8rem"></div> -->
    <div class="work_main">
      <grid :cols="4" :show-lr-borders="false" :show-vertical-dividers="false">
        <!-- <span class="vux-reddot-s"></span> -->
        <grid-item v-for="(item,index) in workList" :key="index" :label="item.name"
          @click.native="goDetail('/main/list?id='+item.id,item.id)">
          <img slot="icon" :src="item.imgUrl">
          <span v-if="item.codeNum > 0" class="vux-reddot-s postion-dia"></span>
          <span v-if="dailyCount > 0 && item.id == 10" class="vux-reddot-s postion-dia"></span>
        </grid-item>
      </grid>
    </div>
  </div>
</template>

<script>
  import {
    getApprovalList, // 获取审批列表
    getDayCount
  } from "@/api/public";
  import {
    Grid,
    GridItem
  } from "vux";
  export default {
    name: "Mywork",
    components: {
      Grid,
      GridItem
    },
    data() {
      return {
        blockList: [],
        workList: [],
        isShowRed: 0,
        dailyCount: 0,
        // workList: [{
        //     id: 10,
        //     name: "日报管理",
        //     imgUrl: "./static/office/day.png",
        //     link: "/main/dailyList"
        //   },
        //   {
        //     id: 2,
        //     name: "拜访单",
        //     imgUrl: "./static/office/goingout.png",
        //     link: "/main/list?id=2"
        //   },
        //   {
        //     id: 5,
        //     name: "加班单",
        //     imgUrl: "./static/office/overtime.png",
        //     link: "/main/list?id=5"
        //   },
        //   {
        //     id: 6,
        //     name: "请假单",
        //     imgUrl: "./static/office/leave.png",
        //     link: "/main/list?id=6"
        //   },
        //   {
        //     id: 8,
        //     name: "物料领用",
        //     imgUrl: "./static/office/article.png",
        //     link: "/main/list?id=8"
        //   },
        //   {
        //     id: 4,
        //     name: "报销",
        //     imgUrl: "./static/office/baoxiao.png",
        //     link: "/main/list?id=4"
        //   },
        //   {
        //     id: 7,
        //     name: "用车申请",
        //     imgUrl: "./static/office/car.png",
        //     link: "/main/list?id=7"
        //   },
        //   {
        //     id: 3,
        //     name: "用章申请",
        //     imgUrl: "./static/office/zhang.png",
        //     link: "/main/list?id=3"
        //   },
        //   {
        //     id: 9,
        //     name: "采购申请",
        //     imgUrl: "./static/office/caigou1.png",
        //     link: "/main/list?id=9"
        //   },
        //   {
        //     id: 1,
        //     name: "采购单",
        //     imgUrl: "./static/office/caigou.png",
        //     link: "/main/list?id=1"
        //   }
        // ]
      };
    },
    created() {},
    mounted() {
      // 页面第一个渲染的函数
      this.getList()
      this.getDailyCount()
    },
    methods: {
      // 方法
      getList() {
        const that = this
        getApprovalList().then(res => {
          if (res.code === 200) {
            that.blockList = res.data.approval;
            for (let i = 0; i < that.blockList.length; i++) {
              console.log(that.blockList[i].children,"11")
              console.log(that.blockList[i].children.length,"changdu")z
              for (let j = 0; j < that.blockList[i].children.length; j++) {
                console.log(that.blockList[i].children[j].id,"22")
                if(that.blockList[i].children[j].id){
                  that.workList.push({
                    id: that.blockList[i].children[j].id,
                    name: that.blockList[i].children[j].name,
                    imgUrl: '.' + that.blockList[i].children[j].icon,
                    codeNum: that.blockList[i].children[j].count
                  })
                }
              }
            }
            that.workList.unshift({
              id: 12,
              name: "日报管理",
              imgUrl: "./static/office/day.png",
            })
          }
        });
        console.log(that.workList, 'fff;111')
      },
      getDailyCount() {
        getDayCount().then(res => {
          console.log(res, 'l')
          if (res.code === 200 || res.code === '200') {
            this.dailyCount = res.data.count
          }
        })
      },
      goLink(url) {
        this.$router.push({
          path: url
        })
      },
      goDetail(url, id) {
        console.log(id)
        if (id === 12 || id === '12') {
          this.$router.push({
            path: '/main/dailyList'
          })
        } else {
          this.$router.push({
            path: url
          })
        }

      }
    }
  };

</script>
<style lang="less" scoped>
  .work_bg {
    // background: #f3f3f3;
    // height: 100%;
    // margin-bottom: 2rem;
    background: #fff;
    height: 100%;
    padding-bottom: 2rem;

    .work_head {
      width: 100%;
      height: 4.75rem;
      text-align: center;
      position: relative;
      z-index: 10;

      .work_head_top {
        background: #3e8afd;
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 10;
        .work_right {
          height: 1rem;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-right: 0.4rem;

          .person_icon {
            font-size: 0.6rem;
            color: #fff;
          }
        }


        .work_logo {
          // width: 2.5rem;
          // height: 2.5rem;
          width: 2rem;
          // height: 1.88rem;
          display: block;
          margin: 0 auto;
          // padding-top: 0.5rem;
          margin-bottom: 0.2rem;
        }

        p {
          font-size: 0.38rem;
          font-weight: bold;
          color: #fff;
        }
      }

      .work_head_bg {
        background: #3e8afd;
        border-bottom-left-radius: 50%;
        border-bottom-right-radius: 50%;
        position: absolute;
        top: 2.46rem;
        width: 100%;
        height: 2rem;
        z-index: 1;
      }

    }



    .work_main {
      background: #fff;
      padding-top: 0.1rem;
      position: relative;

      .postion-dia {
        position: absolute;
        right: 0.61rem;
        top: 0.4rem;
      }

      & /deep/.weui-grid:after {
        border-bottom: none;
      }

      & /deep/.weui-grids:before {
        border-top: none;
      }

      & /deep/.weui-grid {
        // padding-top: 0;
        // padding-bottom: 0.7rem;
        padding: 0.3rem;

        .weui-grid__icon {
          width: 0.64rem;
          height: 0.64rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .weui-grid__label {
          font-size: 0.24rem;
          color: #666666;
        }
      }
    }
  }

</style>
