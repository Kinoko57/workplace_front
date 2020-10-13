<template>
  <div class="steps_block" :class="{'success':data.auditStatus==2,'process':data.auditStatus==1,'wait':data.auditStatus==0,'danger':data.auditStatus==-2}" v-if="data.auditStatus!=0&&data.auditStatus!=1">
    <span class="step_status" v-if="data.auditStatus==2"><i></i>已通过</span>
    <span class="step_status" v-if="data.auditStatus==-2"><i></i>已驳回</span>
    <div class="step_view">
      <div class="user_img">
        <img src="@/assets/index/person.png" alt="">
      </div>
      <div class="user_info">
        <p>
          <span class="name">{{data.auditer}}</span><span class="role">{{data.groupName}}</span>
        </p>
        <p>
          节点名称：<span>{{data.name}}</span>
        </p>
        <p>审批时间：<span>{{data.auditDate}}</span></p>
        <p v-if="data.auditRemark!=''">
          备注：{{data.auditRemark}}
        </p>
        <p v-else>
          备注：暂无
        </p>
      </div>
    </div>
    <!-- <span v-if="data.auditStatus!=2&&data.auditStatus!=-2" class="status_style">
      <i class="iconfont iconyuanhuan"></i>
      <i class="text_style">{{ index }}</i>
    </span>
    <span class="status_style" v-else>
      <i class="iconfont icontishichenggong" v-if="data.auditStatus==2"></i>
      <i class="iconfont iconfuhao-zhuangtai-cuowu" v-if="data.auditStatus==-2"></i>
    </span>
    <div class="steps_right">
      <p class="step_title">{{data.auditDate}}，{{data.name}}</p>
      <p class="step_text" v-show="data.auditRemark!=''">备注：{{data.auditRemark}}</p>
    </div> -->

  </div>
</template>
<script>
  export default {
    name: 'MyStep',
    props: {
      data: {
        type: Object,
        default: {}
      },
      index: {
        type: Number,
        default: 1
      }
    }
  }

</script>
<style lang="less" scoped>
  .steps_block {
    font-size: 0.24rem;
    position: relative;
    padding: 0.3rem 0.2rem;
    // border-left: 1px solid #c0c4cc;
    box-shadow: 1px 0px 8px rgba(215, 215, 215, 0.349019607843137);
    background-color: rgba(255, 255, 255, 1);
    border-radius: 0.1rem;
    margin-bottom: 0.2rem;
    .step_status{
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.24rem;
      position: absolute;
      right: 0.2rem;
      top: 0.2rem;
      i{
        width: 0.1rem;
        height: 0.1rem;
        border-radius: 50%;
        display: inline-flex;
        background: #fff;
        margin-right: 0.05rem;
      }
    }
    .step_view{
      display: flex;
      font-family: '微软雅黑';
      font-weight: 400;
      color:#666;
      .user_img{
        margin-right: 0.2rem;
      }
      .user_info{
        .name{
          font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
          font-weight: 700;
          color: #333;
          font-size: 0.26rem;
          margin-right: 0.2rem;
        }
        .role{
          color: #999999;
        }
        p{
          word-break: break-all;
        }
      }
    }
  }

  .steps_block:last-child {
    border-left: none;
  }

  .success {

    .step_status {
      i{
        background: #67c23a;
      }
    }
  }

  .danger {

    .step_status {
      i{
        background: #f56c6c;
      }
    }
  }

</style>
