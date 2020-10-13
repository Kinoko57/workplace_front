<template>
  <div class="message_bg">
     <div is-link class="message_wraper" @click="goView('notice')">
        <div class="img_bg" style="background:rgb(253,180,96)">
          <img src="@/assets/index/notice.png" alt="" srcset="">
        </div>
         <div class="message_center">
           <span class="message_center_t">系统公告</span>
           <span class="message_center_b">系统相关公告通知</span>
         </div>
        <div class="message_right">
           <span v-if="numInfo.matter>0">{{numInfo.matter}}</span>
           <i class="iconfont iconyoujiantou"></i>
         </div>
     </div>
     <div is-link class="message_wraper" @click="goView('news')">
       <div class="img_bg"  style="background:rgb(69,221,164)">
         <img src="@/assets/index/news.png" alt="" srcset="">
        </div>
         <div class="message_center">
           <span class="message_center_t">站内通知</span>
           <span class="message_center_b">全部待办消息提醒</span>
         </div>
         <div class="message_right">
           <span v-if="numInfo.message>0">{{numInfo.message}}</span>
           <i class="iconfont iconyoujiantou"></i>
         </div>
     </div>
  </div>
</template>

<script>
  import {
    getSum
  } from '@/api/public'
import { Badge} from 'vux'
  export default {
    name: 'Message',
    components: {
      Badge
    },
    data() {
      return {
       numInfo:{}
      }
    },
    mounted() {
      // 页面第一个渲染的函数
      this.getList()
    },
    methods: {
      // 方法
      getList() {
        const that = this
         getSum().then(res=>{
          console.log(res, 'fddddd')
          this.numInfo = res.data.matterInfo
        })
 
      },
      goView(type){
        if(type==='news'){
           this.$router.push({
            path: "/main/messageNews"
          });
        }else{
           this.$router.push({
            path: "/main/messageNotice"
          });
        }
        // console.log(this.listType)
        // this.$router.push({
        //   path: "/main/messageView?id=" + id + '&type=' + this.listType
        // });
      },
    }
  }
</script>
<style lang="less" scoped>
  .message_bg {
    background: #fff;
    .message_wraper{
      border-bottom:0.01rem solid rgba(242, 242, 242, 1);
      padding: 0.2rem 0.3rem;
      display: flex;
      align-items: center;
      .img_bg{
        // float: left;
        width: 0.64rem;
        height: 0.64rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        img{
         width: 0.32rem;
         height: 0.32rem;
        }
      }
      .message_center{
        // float: left;
        font-size: 0.28rem;
        padding-left: 0.2rem;
        width:4.6rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
         font-weight: 400;
        .message_center_t{
          color: #333333;
          display: block;
          font-weight: bold;
        }
        .message_center_b{
          display: block;
          font-size: 0.24rem;
          color: #999;
        }
      }
      .message_right{
          line-height: 0;
          display: flex;
          width: 1.4rem;
          align-items: center;
          justify-content: flex-end;
          span{
              display: inline-block;
              text-align: center;
              background: #f74c31;
              color: #fff;
              font-size: 0.20rem;
              height: 0.32rem;
              min-width: 0.32rem;
              line-height: 0.32rem;
              border-radius: 0.16rem;
              padding: 0 0.06rem;
              background-clip: padding-box;
              vertical-align: middle;
          }
       }
    }

  }

</style>
