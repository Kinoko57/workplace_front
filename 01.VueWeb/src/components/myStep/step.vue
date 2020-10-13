<template>
  <el-tooltip :disabled="hoverStatus" placement="top" effect="light">
    <div slot="content" class="tooltip_style">
      <span>{{ userText }}：{{ tipUser }}</span>
      <br>
      <span>{{ timeText }}：{{ tipTime }}</span>
      <br>
      <span>{{ remarkText }}：{{ tipText }}</span>
    </div>
    <div
      :style="style"
      :class="[
        !isSimple && `is-${$parent.direction}`,
        isSimple && 'is-simple',
        isLast && !space && !isCenter && 'is-flex',
        isCenter && !isVertical && !isSimple && 'is-center'
      ]"
      class="el-step">
      <!-- icon & line -->
      <div :class="`is-${currentStatus}`" class="el-step__head">
        <div :style="isLast ? '' : { marginRight: $parent.stepOffset + 'px' }" class="el-step__line">
          <i :style="lineStyle" class="el-step__line-inner" />
        </div>

        <div :class="`is-${icon ? 'icon' : 'text'}`" class="el-step__icon">
          <slot v-if="currentStatus !== 'success' && currentStatus !== 'error'" name="icon">
            <i v-if="icon" :class="[icon]" class="el-step__icon-inner" />
            <div v-if="!icon && !isSimple" class="el-step__icon-inner">{{ index + 1 }}</div>
          </slot>
          <i v-else :class="['el-icon-' + (currentStatus === 'success' ? 'check' : 'close')]" class="el-step__icon-inner is-status" />
        </div>
      </div>
      <!-- title & description -->
      <div class="el-step__main">
        <div ref="title" :class="['is-' + currentStatus]" :title="title" class="el-step__title" style="margin:0 auto;width: 100px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
          <slot name="title">{{ title }}</slot>
        </div>
        <div v-if="isSimple" class="el-step__arrow" />
        <div v-else :class="['is-' + currentStatus]" class="el-step__description">
          <slot name="description">{{ description }}</slot>
        </div>
      </div>
    </div>
  </el-tooltip>

</template>

<script>
export default {
  name: 'MyStep',

  props: {
    // eslint-disable-next-line vue/require-default-prop
    title: String,
    // eslint-disable-next-line vue/require-default-prop
    icon: String,
    // eslint-disable-next-line vue/require-default-prop
    description: String,
    // eslint-disable-next-line vue/require-default-prop
    status: String,
    // eslint-disable-next-line vue/require-default-prop
    tipUser: String,
    // eslint-disable-next-line vue/require-default-prop
    tipTime: String,
    // eslint-disable-next-line vue/require-default-prop
    tipText: String,
    // eslint-disable-next-line vue/require-default-prop
    hoverStatus: Boolean,
    userText: {
      type: String,
      default: '审批人'
    },
    timeText: {
      type: String,
      default: '审批时间'
    },
    remarkText: {
      type: String,
      default: '备注内容'
    }
  },

  data() {
    return {
      index: -1,
      lineStyle: {},
      internalStatus: ''
    }
  },

  computed: {
    currentStatus() {
      return this.status || this.internalStatus
    },
    prevStatus() {
      const prevStep = this.$parent.steps[this.index - 1]
      return prevStep ? prevStep.currentStatus : 'wait'
    },
    isCenter() {
      return this.$parent.alignCenter
    },
    isVertical() {
      return this.$parent.direction === 'vertical'
    },
    isSimple() {
      return this.$parent.simple
    },
    isLast() {
      const parent = this.$parent
      return parent.steps[parent.steps.length - 1] === this
    },
    stepsCount() {
      return this.$parent.steps.length
    },
    space() {
      const {
        isSimple,
        $parent: {
          space
        }
      } = this
      return isSimple ? '' : space
    },
    style: function() {
      const style = {}
      const parent = this.$parent
      const len = parent.steps.length

      const space = (typeof this.space === 'number'
        ? this.space + 'px'
        : this.space
          ? this.space
          : 100 / (len - (this.isCenter ? 0 : 1)) + '%')
      style.flexBasis = space
      if (this.isVertical) return style
      if (this.isLast) {
        style.maxWidth = 100 / this.stepsCount + '%'
      } else {
        style.marginRight = -this.$parent.stepOffset + 'px'
      }
      style.minWidth = '100px'
      return style
    }
  },

  beforeCreate() {
    this.$parent.steps.push(this)
  },

  beforeDestroy() {
    const steps = this.$parent.steps
    const index = steps.indexOf(this)
    if (index >= 0) {
      steps.splice(index, 1)
    }
  },

  mounted() {
    // if (this.tipUser !== '未开始') {
    //   this.hoverStatus = false
    // }
    const unwatch = this.$watch('index', val => {
      this.$watch('$parent.active', this.updateStatus, {
        immediate: true
      })
      unwatch()
    })
  },

  methods: {
    updateStatus(val) {
      const prevChild = this.$parent.$children[this.index - 1]

      if (val > this.index) {
        this.internalStatus = this.$parent.finishStatus
      } else if (val === this.index && this.prevStatus !== 'error') {
        this.internalStatus = this.$parent.processStatus
      } else {
        this.internalStatus = 'wait'
      }

      if (prevChild) prevChild.calcProgress(this.internalStatus)
    },

    calcProgress(status) {
      let step = 100
      const style = {}

      style.transitionDelay = 150 * this.index + 'ms'
      if (status === this.$parent.processStatus) {
        step = this.currentStatus !== 'error' ? 0 : 0
      } else if (status === 'wait') {
        step = 0
        style.transitionDelay = (-150 * this.index) + 'ms'
      }

      style.borderWidth = step ? '1px' : 0
      this.$parent.direction === 'vertical'
        ? style.height = step + '%'
        : style.width = step + '%'

      this.lineStyle = style
    }
  }
}

</script>

<style lang="less" scoped>
  .tooltip_style {
    max-width: 300px;
    font-size: 14px;
    color: #333;
  }

</style>
