<template>
  <div class="steps_bg">
    <div v-for="(item,index) in StepList" :key="index" class="step_block">
      <div v-if="StepType=='approval'" class="step_left">
        <div class="step_icon">
          <img v-if="item.auditStatus!=2" src="@/assets/step/waiting.png" alt="" srcset="">
          <img v-else src="@/assets/step/success.png" alt="" srcset="">
        </div>
        <div :title="item.name" :class="item.auditStatus!=2?'step_name':'step_name step_name_active'">{{ item.name }}</div>
        <div v-if="index<StepList.length-1" class="step_line">
          <span class="line_long"/>
          <span :class="item.auditStatus==2?'line_active line_long':'line_short'"/>
        </div>
      </div>
      <div v-if="StepType=='approval'" class="step_middle">
        <span v-if="index==0&&item.auditStatus==2" class="step_status">发起申请</span>
        <span v-if="item.auditStatus==2&&index!=0&&item.isend != 1" class="step_status" style="color:#4BD863">已同意</span>
        <span v-if="item.auditStatus==1" class="step_status" style="color:#3C8EE9">审批中</span>
        <!-- <span v-if="item.auditStatus==0" class="step_status" style="color:#3C8EE9">等待审批</span> -->
        <span v-if="item.auditStatus==-2" class="step_status" style="color:#FF0000">驳回</span>
      </div>
      <div v-if="StepType=='matter'" class="step_middle">
        <span v-if="index==0&&item.status==3" class="step_status">发起事项</span>
        <span v-if="item.status==1" class="step_status">未开始</span>
        <span v-if="item.status==2" class="step_status" style="color:#3C8EE9">进行中</span>
        <span v-if="item.status==3&&index!=0" class="step_status" style="color:#4BD863">已完成</span>
      </div>
      <div v-if="StepType=='approval'" class="step_right">
        <span class="step_text">
          <p v-if="item.auditStatus!=0&&item.auditStatus!=1&&index!=0">
            <span v-if="item.isend != 1">审批人：</span>
            <span v-if="item.auditStatus!=-3" class="step_user">{{ item.auditer }}</span>
            <span v-if="item.auditStatus==-3" class="step_user">系统</span>
          </p>
          <p v-if="index==0">
            <span>发起人：</span>
            <span class="step_user">{{ item.auditer }}</span>
          </p>
          <p v-if="item.auditStatus!=-3&&item.auditRemark!=''" class="step_remark">
            <!-- <span></span> -->
            <span class="remarks">留言备注：{{ item.auditRemark }}</span>
          </p>
          <p v-if="item.auditStatus==-3" class="step_remark">
            <span>留言备注：自动跳过</span>
          </p>
        </span>
        <span v-if="item.auditStatus!=0&&item.auditStatus!=1" class="step_time">{{ item.auditDate }}</span>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'ApprovalStep',

  props: {
    StepList: {
      type: Array,
      default: () => []
    },
    activeStep: {
      type: Boolean,
      default: true
    },
    StepType: {
      type: String,
      default: 'approval'
    }
  },

  data() {
    return {
      index: -1,
      lineStyle: {},
      internalStatus: ''
    }
  },

  mounted() {
    console.log(this.StepList)
  },

  methods: {}
}

</script>

<style lang="less" scoped>
  .steps_bg{
      padding: 20px 10px;
      .step_block{
          display: flex;
          justify-content: space-between;
          min-height: 80px;
          .step_left{
              position: relative;
              width: 110px;
              .step_icon{
                position: absolute;
                z-index: 10;
                img{
                    width: 83px;
                    height: 24px;
                }
              }
              .step_name{
                position: absolute;
                font-family: '微软雅黑';
                font-weight: 410;
                font-size: 13px;
                color: #333333;
                line-height: 24px;
                height: 24px;
                width: 83px;
                text-align: center;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                padding: 0 4px;
                z-index: 11;
              }
              .step_name_active{
                font-size: 12px;
                color: #FFFFFF;
              }
              .step_line{
                  width: 83px;
                  position: absolute;
                  left: 0;
                  top: 2px;
                  height: 100%;
                  z-index: 9;
                  span{
                      width: 4px;
                      position: absolute;
                      top: 0;
                      left: 50%;
                      transform: translateX(-50%);
                      background: rgba(242, 242, 242, 1);
                  }
                  .line_long{
                      height: 100%;
                  }
                  .line_short{
                      height: 65%;
                  }
                  .line_active{
                      background: rgba(60, 142, 233, 1);
                  }
              }
          }
          .step_middle{
            font-family: '微软雅黑 Regular', '微软雅黑';
            font-weight: 410;
            font-size: 12px;
            color: #666;
            padding: 6px 0;
            width: 80px;
          }
          .step_right{
            font-family: '微软雅黑 Regular', '微软雅黑';
            font-weight: 410;
            font-size: 12px;
            color: #666;
            display: inline-flex;
            justify-content: space-between;
            width: 80%;
            p{
                padding: 0;
                margin: 6px 0;
                display: flex;
            }
            .step_remark{
              span{
                width: 66px;
                display: inline-flex;
              }
              .remarks{
                display: inline-flex;
                width: 500px;
                line-height: 1.5;
              }
            }
          }
          .step_time{
            width: 120px;
          }
      }
  }

</style>
