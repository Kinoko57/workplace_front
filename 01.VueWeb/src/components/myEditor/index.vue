<template>
  <div>
    <editor
      id="editor_id"
      ref="kingEditor"
      :height="height"
      :content="content"
      :items="items"
      :upload-json="uploadJson"
      :allow-file-manager="false"
      :allow-image-upload="true"
      :paste-type="1"
      :allow-image-remote="false"
      :resize-type="0"
      :z-index="zIndex"
      :load-style-mode="false"
      :after-focus="onEditorFocus"
      class="editor"
      width="100%"
      plugins-path="/static/kindeditor/plugins/"
      file-post-name="files"
      @on-content-change="onContentChange"/>
  </div>
</template>

<script>
import Vue from 'vue'
import VueKindEditor from 'vue-kindeditor'
import 'kindeditor/kindeditor-all.js'
// import 'kindeditor/themes/default/default.css'
import './image.js'
Vue.use(VueKindEditor)
export default {
  name: 'Kingeditor',
  props: {
    content: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '500px'
    },
    zIndex: {
      type: Number,
      default: 3000
    },
    items: {
      type: Array,
      default: function() {
        // 不传则用这个作为默认值
        return [
          'undo', 'redo', '|', 'preview', 'print', 'cut', 'copy', 'paste',
          '|', 'formatblock', 'fontname', 'fontsize', '|',
          'justifyleft', 'justifycenter', 'justifyright',
          'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
          'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen',
          '|', 'forecolor', 'hilitecolor', 'bold',
          'italic', 'underline', 'lineheight', 'removeformat', '|', 'image', 'table', 'hr', 'pagebreak',
          'anchor', 'link', 'unlink'
        ]
      }
    }
  },
  data() {
    return {
      uploadJson: process.env.BASE_API + 'sys/file-upload'
      // uploadJson: `${process.env.UPLOAD_URL}/comm/uploadCsFile`

    }
  },

  mounted() {},

  methods: {
    onContentChange(val) {
      // this.content = val
      this.$emit('on-content-change', val)
    },
    afterChange(val) {
      // debugger
      // this.content = val
    },
    onEditorFocus() {
      // 获得焦点事件
      // this.$emit('on-content-change')
    }
  }
}

</script>
<style lang='scss' scoped>
</style>
