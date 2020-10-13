<template>
  <!-- <div>
    <quill-editor ref="myQuillEditor" v-model="content" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @change="onEditorChange($event)" />
  </div> -->
  <div>
    <quill-editor ref="myQuillEditor" v-model="content" :value="value" :options="editorOption" @change="onEditorChange($event)">
      <div id="toolbar" slot="toolbar">
        <span class="ql-formats">
          <button type="button" class="ql-bold" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-italic" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-underline" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-strike" />
        </span>
        <!-- <span class="ql-formats">
          <button type="button" class="ql-blockquote" />
        </span> -->
        <span class="ql-formats">
          <button type="button" class="ql-code-block" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-header" value="1" @click="getIndex" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-header" value="2" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-list" value="ordered" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-list" value="bullet" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-script" value="sub" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-script" value="super" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-indent" value="-1" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-indent" value="+1" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-direction" value="rtl" />
        </span>

        <span class="ql-formats">
          <select class="ql-size">
            <option value="small" />
            <option selected />
            <option value="large" />
            <option value="huge" />
          </select>
        </span>
        <span class="ql-formats">
          <select class="ql-header">
            <option value="1" />
            <option value="2" />
            <option value="3" />
            <option value="4" />
            <option value="5" />
            <option value="6" />
            <option selected="selected" />
          </select>
        </span>
        <span class="ql-formats">
          <select class="ql-color">
            <option selected="selected" />
            <option value="#e60000" />
            <option value="#ff9900" />
            <option value="#ffff00" />
            <option value="#008a00" />
            <option value="#0066cc" />
            <option value="#9933ff" />
            <option value="#ffffff" />
            <option value="#facccc" />
            <option value="#ffebcc" />
            <option value="#ffffcc" />
            <option value="#cce8cc" />
            <option value="#cce0f5" />
            <option value="#ebd6ff" />
            <option value="#bbbbbb" />
            <option value="#f06666" />
            <option value="#ffc266" />
            <option value="#ffff66" />
            <option value="#66b966" />
            <option value="#66a3e0" />
            <option value="#c285ff" />
            <option value="#888888" />
            <option value="#a10000" />
            <option value="#b26b00" />
            <option value="#b2b200" />
            <option value="#006100" />
            <option value="#0047b2" />
            <option value="#6b24b2" />
            <option value="#444444" />
            <option value="#5c0000" />
            <option value="#663d00" />
            <option value="#666600" />
            <option value="#003700" />
            <option value="#002966" />
            <option value="#3d1466" />
          </select>
        </span>
        <span class="ql-formats">
          <select class="ql-background">
            <option value="#000000" />
            <option value="#e60000" />
            <option value="#ff9900" />
            <option value="#ffff00" />
            <option value="#008a00" />
            <option value="#0066cc" />
            <option value="#9933ff" />
            <option selected="selected" />
            <option value="#facccc" />
            <option value="#ffebcc" />
            <option value="#ffffcc" />
            <option value="#cce8cc" />
            <option value="#cce0f5" />
            <option value="#ebd6ff" />
            <option value="#bbbbbb" />
            <option value="#f06666" />
            <option value="#ffc266" />
            <option value="#ffff66" />
            <option value="#66b966" />
            <option value="#66a3e0" />
            <option value="#c285ff" />
            <option value="#888888" />
            <option value="#a10000" />
            <option value="#b26b00" />
            <option value="#b2b200" />
            <option value="#006100" />
            <option value="#0047b2" />
            <option value="#6b24b2" />
            <option value="#444444" />
            <option value="#5c0000" />
            <option value="#663d00" />
            <option value="#666600" />
            <option value="#003700" />
            <option value="#002966" />
            <option value="#3d1466" />
          </select>
        </span>
        <span class="ql-formats">
          <select class="ql-font">
            <option selected="selected" />
            <option value="serif" />
            <option value="monospace" />
          </select>
        </span>
        <span class="ql-formats">
          <select class="ql-align">
            <option selected="selected" />
            <option value="center" />
            <option value="right" />
            <option value="justify" />
          </select>
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-clean" />
        </span>
        <span class="ql-formats">
          <button type="button" class="ql-link" @click="getLink" />
        </span>
        <span class="ql-formats">
          <button type="button" @click="imgClick">
            <svg viewBox="0 0 18 18">
              <rect class="ql-stroke" height="10" width="12" x="3" y="4" />
              <circle class="ql-fill" cx="6" cy="7" r="1" />
              <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12" />
            </svg>
          </button>
        </span>
        <!-- <span class="ql-formats">
          <button type="button" class="ql-video" />
        </span> -->
      </div>
    </quill-editor>
    <!-- <crop-upload v-model="showCrop" :width="width" :height="height" :file-name="fileName" :upload-url="uploadUrl" @uploadSuccess="onUploadSuccess" /> -->
  </div>
</template>
<script>
import { VueKindEditor } from 'vue-kindeditor'
import CropUpload from './CropUpload'
import axios from 'axios'
export default {
  components: { VueKindEditor, CropUpload },
  // props: {
  //   content: {
  //     type: String,
  //     default: ''
  //   }
  // },
  props: {
    /* 编辑器的内容*/
    value: {
      type: String,
      default: ''
    },
    /* 上传图片的地址*/
    uploadUrl: {
      type: String,
      default: ''
    },
    /* 上传图片的file控件name*/
    fileName: {
      type: String,
      default: 'files'
    },
    /* 图片大小*/
    maxSize: {
      type: Number,
      default: 400 // kb
    },
    /* 使用使用裁切*/
    canCrop: {
      type: Boolean,
      default: false
    },
    /* 裁切的最小尺寸*/
    width: {
      type: Number,
      default: 200
    },
    /* 裁切的最小尺寸*/
    height: {
      type: Number,
      default: 200
    }
  },
  data() {
    return {
      content: null,
      axios: axios,
      editorOption: {
        modules: {
          toolbar: '#toolbar'
        },
        placeholder: ''
      },
      /* 显示裁切控件*/
      showCrop: false
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  watch: {
    value(newVal, oldVal) {
      if (this.editor) {
        if (newVal !== this.content) {
          this.content = newVal
        }
      }
    }
  },
  mounted() {
    this.content = this.value
  },
  methods: {
    onFileChange(e) {
      var self = this
      var fileInput = e.target
      if (fileInput.files.length === 0) {
        return
      }
      this.editor.focus()
      if (fileInput.files[0].size > 1024 * 1024 * 100) {
        this.$alert('图片不能大于600KB', '图片尺寸过大', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
      var data = new FormData()
      data.append(this.fileName, fileInput.files[0])
      this.axios.post(this.uploadUrl, data).then(function(res) {
        console.log(res.data)
        if (res.data.code === 200) {
          self.editor.insertEmbed(
            self.editor.getSelection().index,
            'image',
            res.data.data.path + res.data.data.data[0].pathname
          )
        }
      })
    },
    /* 裁切上传成功 res根据上传接口值获取*/
    onUploadSuccess: function(res) {
      this.editor.focus()
      this.editor.insertEmbed(
        this.editor.getSelection().index,
        'image',
        res.url
      )
    },
    /* 点击上传图片按钮*/
    imgClick() {
      if (this.canCrop) {
        this.showCrop = true
      } else {
        /* 创建input file 不裁切，自己控制*/
        var input = document.createElement('input')
        input.type = 'file'
        input.name = this.fileName
        input.accept = 'image/jpeg,image/png,image/jpg,image/gif'
        input.onchange = this.onFileChange
        input.click()
      }
    },
    onEditorChange(html) {
      console.log(html)
      this.$emit('getValue', html)
      // 内容改变事件
    },
    getIndex(html) {
      console.log(html)
    },
    getLink(html) {
      console.log(html, 'vdsGVBFsd')
    }
  }
}
</script>
