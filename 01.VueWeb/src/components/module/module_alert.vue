<template>
  <div v-show="visible" class="module_alert">
    <div class="Cozy one">
      <div data-v-d0e8b18e="" role="alert" class="el-alert el-alert--warning">
        <i class="el-alert__icon el-icon-warning fl"/>
        <div class="el-alert__content">
          <span class="el-alert__title" v-html="title"/>
          <span :style="{color:btnColor}" class="btn-style" @click="btnClick">{{ clickContent }}</span>
          <i v-show="closable" class="el-alert__closebtn el-icon-close" @click="close()"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*
   *<my-alert
     type="warning"
     title="友情提示：体验操作是在真实的媒体上进行投放，将会消耗您的一点点费用。请您慎重考虑好后，再进行操作体验。"
     @warning_close="warning_close"
     ></my-alert>
   * */
/*
  * type:提示的类型
  * title：提示的文字
  * warning_close:自定义事件，当错误提示关闭后执行
  * */

export default {
  name: 'ModuleAlert',
  components: {

  },
  props: {
    type: {
      type: String,
      default: 'cozy'
    },
    title: {
      type: String,
      default: '温馨提示：体验操作是在真实的媒体上进行投放，将会消耗您的一点点费用。请您慎重考虑好后，再进行操作体验。'
    },
    clickContent: {
      type: String,
      default: ''
    },
    btnColor: {
      type: String,
      default: '#f00'
    },
    closable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: true
    }
  },
  computed: {

  },

  mounted() {

  },

  methods: {
    warning_close() {
      this.$emit('warning_close')
    },
    btnClick() {
      this.$emit('btnClick')
    },
    close() {
      this.visible = false
      this.$emit('close')
    }
  }

}

</script>

<style scoped>
.module_alert{
    margin-left: 10px;
    margin-bottom: 10px;
    border: 1px solid #e6a23c;
    border-radius: 5px;
}
.el-alert__title{
  font-family: '微软雅黑 Regular', '微软雅黑';
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
}
  .line{
    margin-bottom:20px;
  }
  .lineTitle{
    height:30px;
    font-size: 12px;
    line-height:30px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .btn-style{
    text-decoration: underline;
    cursor: pointer;
  }
  .el-alert{
    align-items: initial;
    color: #e6a23c;
  }
  .el-alert__icon{
    margin-top: 2px;
  }
</style>
