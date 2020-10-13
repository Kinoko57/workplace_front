<template>
  <div class="steps_block" :class="{'success':data.auditStatus==2,'process':data.auditStatus==1,'wait':data.auditStatus==0,'danger':data.auditStatus==-2}" v-if="data.auditStatus!=0&&data.auditStatus!=1">
    <span v-if="data.auditStatus!=2&&data.auditStatus!=-2" class="status_style">
      <i class="iconfont iconyuanhuan"></i>
      <i class="text_style">{{ index }}</i>
    </span>
    <!-- <img src="@/assets/icon/step_icon.png" alt class="radio_status" v-else> -->
    <span class="status_style" v-else>
      <i class="iconfont icontishichenggong" v-if="data.auditStatus==2"></i>
      <i class="iconfont iconfuhao-zhuangtai-cuowu" v-if="data.auditStatus==-2"></i>
    </span>
    <div class="steps_right">
      <p class="step_title">{{data.auditDate}}，{{data.name}}</p>
      <p class="step_text" v-show="data.auditRemark!=''">备注：{{data.auditRemark}}</p>
    </div>
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
    padding-bottom: 0.3rem;
    border-left: 1px solid #c0c4cc;


    .status_style {
      width: 0.34rem;
      height: 0.34rem;
      border-radius: 50%;
      position: absolute;
      top: 0;
      left: 0;
      transform: translateX(-50%);
      background: #f3f3f3;
      display: flex;
      align-items: center;
      justify-content: center;

      .iconfont {
        font-size: 0.44rem;
      }
      .text_style{
        position: absolute;
        font-style: normal;
      }
    }

    // .text_style {
    //   width: 0.34rem;
    //   height: 0.34rem;
    //   border-radius: 50%;
    //   position: absolute;
    //   border: 2px solid;
    //   border-color: inherit;
    //   top: 0;
    //   left: 0;
    //   transform: translate(-50%, -50%);
    //   background: #f3f3f3;
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    // }

    .radio_status {
      width: 0.34rem;
      height: 0.34rem;
      border-radius: 50%;
      position: absolute;
      top: 0;
      left: 0;
      transform: translateX(-50%);
      background: #f3f3f3;
    }

    .steps_right {
      border: 1px solid #e0e0e0;
      position: relative;
      min-height: 0.7rem;
      margin-left: 0.58rem;
      border-radius: 0.14rem;
      background: #ffffff;
      padding: 0.1rem;

      .step_text {
        font-size: 0.18rem;
        color: #666666;
        margin-left: 1rem;
      }
    }
  }

  .steps_block:last-child {
    border-left: none;
  }

  .success {
    color: #1ba4fa;
    border-color: #1ba4fa;
    border-left-color: #c0c4cc;


    .step_title {
      columns: #1ba4fa;
    }
  }

  .process {
    color: #303133;
    border-color: #303133;
    border-left-color: #c0c4cc;

    .step_title {
      columns: #303133;
    }
  }

  .danger {
    color: #f56c6c;
    border-color: #f56c6c;
    border-left-color: #c0c4cc;

    .step_title {
      columns: #f56c6c;
    }
  }

  .wait {
    color: #c0c4cc;
    border-color: #c0c4cc;
    border-left-color: #c0c4cc;

    .step_title {
      columns: #c0c4cc;
    }
  }

</style>
