<template>
  <vue-crop v-model="show" :width="width" :height="height" :url="uploadUrl" :field="fileName" img-format="png" @crop-upload-success="uploadSuccess" />
</template>

<script>
import VueCrop from 'vue-image-crop-upload/upload-2.vue'
export default {
  components: {
    VueCrop
  },
  props: {
    value: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 200
    },
    /* 上传图片的地址*/
    uploadUrl: {
      type: String,
      default: ''
    },
    /* 上传图片的file控件name*/
    fileName: {
      type: String,
      default: 'avatar'
    }
  },
  data() {
    return {
      show: false
    }
  },
  watch: {
    value(newv) {
      this.show = newv
    },
    show(newv) {
      if (!this.show) {
        this.$emit('input', false)
      }
    }
  },
  mounted() {
    this.show = this.value
  },
  methods: {
    uploadSuccess(res, field) {
      this.$emit('uploadSuccess', res)
    }
  }
}
</script>

<style>
</style>
