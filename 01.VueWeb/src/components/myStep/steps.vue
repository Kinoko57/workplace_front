<template>
  <div
    :class="[
      !simple && 'el-steps--' + direction,
      simple && 'el-steps--simple'
    ]"
    class="el-steps">
    <slot/>
  </div>
</template>

<script>
import Migrating from 'element-ui/src/mixins/migrating'

export default {
  name: 'MySteps',

  mixins: [Migrating],

  props: {
    // eslint-disable-next-line vue/require-default-prop
    space: [Number, String],
    // eslint-disable-next-line vue/require-default-prop
    active: Number,
    direction: {
      type: String,
      default: 'horizontal'
    },
    // eslint-disable-next-line vue/require-default-prop
    alignCenter: Boolean,
    // eslint-disable-next-line vue/require-default-prop
    simple: Boolean,
    finishStatus: {
      type: String,
      default: 'finish'
    },
    processStatus: {
      type: String,
      default: 'process'
    }
  },

  data() {
    return {
      steps: [],
      stepOffset: 0
    }
  },

  watch: {
    active(newVal, oldVal) {
      this.$emit('change', newVal, oldVal)
    },

    steps(steps) {
      steps.forEach((child, index) => {
        child.index = index
      })
    }
  },

  methods: {
    getMigratingConfig() {
      return {
        props: {
          'center': 'center is removed.'
        }
      }
    }
  }
}
</script>
