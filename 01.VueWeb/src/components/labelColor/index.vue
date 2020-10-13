<template>
  <div style="display:inline">
    <span :style="styleObject" class="label_text">{{ text }}</span>
  </div>
</template>
<script>
export default {
  name: 'LabelColor',
  props: {
    text: {
      type: String,
      default: '默认'
    },
    color: {
      type: String,
      default: 'rgba(0,0,0)'
    }
  },
  data() {
    return {
      styleObject: {
        color: '',
        background: '',
        borderColor: ''
      }
    }
  },
  watch: {
    color() {
      this.styleObject.color = this.hexToRgba(this.color, 1).rgba
      this.styleObject.background = this.hexToRgba(this.color, 0.1).rgba
      this.styleObject.borderColor = this.hexToRgba(this.color, 0.8).rgba
    }
  },
  mounted() {
    this.styleObject.color = this.hexToRgba(this.color, 1).rgba
    this.styleObject.background = this.hexToRgba(this.color, 0.1).rgba
    this.styleObject.borderColor = this.hexToRgba(this.color, 0.8).rgba
  },
  methods: {
    hexToRgba(hex, opacity) {
      var RGBA = 'rgba(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ',' + parseInt(
        '0x' + hex.slice(5, 7)) + ',' + opacity + ')'
      return {
        red: parseInt('0x' + hex.slice(1, 3)),
        green: parseInt('0x' + hex.slice(3, 5)),
        blue: parseInt('0x' + hex.slice(5, 7)),
        rgba: RGBA
      }
    }
  }
}

</script>

<style lang="less" scoped>
  .label_text {
    min-width: 54px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    font-size: 12px;
    border-radius: 4px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-width: 1px;
    border-style: solid;
    white-space: nowrap;
    display: inline-block;
  }

</style>
