<template>
  <div>
    <div class="edithelp_bg">
      <div class="fifter">
        <my-tabs
          :allow-fifter="false"
          :return-show="true"
          :active-name="'all'"
          :tabs-list="tabsList"
          @returnAction="returnPage"/>
      </div>
      <el-form
        ref="editHelpForm"
        :rules="rules"
        :model="editHelpForm"
        class="modelForm"
        label-width="100px"
        label-position="right">
        <el-form-item label="标题：" prop="title">
          <el-input v-model.trim="editHelpForm.title" style="width:400px" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容：" prop="content" class="rich_input">
          <!-- <rich-text v-if="modelShow" ref="myQuillEditor" :can-crop="canCrop" :upload-url="uploadUrl" v-model="reportForm.content" @getValue="getValue"/> -->
          <my-Editor ref="myQuillEditor" :items="editorConfig" :content="editHelpForm.content" height="400" @on-content-change="getValue"/>
          <!-- <el-input v-model="reportForm.content" :rows="3" type="textarea" style="width:400px" placeholder="请输入公告内容" /> -->
        </el-form-item>
        <el-form-item label="上传附件：">
          <el-upload
            ref="upload"
            :on-preview="handlePreview"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :name="'files'"
            :limit="1"
            :file-list="fileList"
            :action="uploadUrl1"
            class="upload-demo">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">请上传压缩包、word文档、excel文档、ppt演示文稿、pdf文档、图片文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer mar-r">
        <el-button @click="resetForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">保 存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
// import { userInfo } from '@/api/usercontent'
// 修改资料问题未解决
// import { editPerson } from '@/api/system'
import store from '@/store/index'
import { getHelpWord, saveHelpWord, editHelpWord } from '@/api/common'
import myEditor from '@/components/myEditor/index'
export default {
  name: 'EditHelpWord',
  components: {
    myEditor
  },
  data() {
    return {
      tabsList: [{ label: '帮助文档', name: 'all' }],
      editHelpForm: {
        title: '',
        content: '',
        file: ''
      },
      filesArr: [],
      fileList: [],
      submitting: false,
      isAdd: true,
      uploadUrl1: '',
      editId: 0,
      rules: {
        title: [{
          required: true,
          message: '标题不能为空',
          trigger: 'blur'
        }, {
          min: 6,
          max: 50,
          message: '标题长度在6-50位之间',
          trigger: 'blur'
        }],
        content: [{
          required: true,
          message: '内容不能为空',
          trigger: 'change'
        }]
      },
      editorConfig: [
        'undo', 'redo', '|',
        '|', 'formatblock', 'fontname', 'fontsize', '|',
        'justifyleft', 'justifycenter', 'justifyright',
        'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', '|', 'forecolor',
        'hilitecolor', 'bold',
        'italic', 'underline', 'lineheight', 'removeformat', '|', 'image', 'table', 'hr', 'pagebreak'
      ]
    }
  },
  mounted() {
    this.getList()
    this.uploadUrl1 = process.env.BASE_API + 'sys/file-upload'
  },
  methods: {
    returnPage() {
      this.$router.back(-1)
    },
    getList() {
      const that = this
      getHelpWord().then(res => {
        console.log(res, 'ddddddddd')
        if (res.data.document[0] === false) {
          store.commit('SET_HELPSHOW', false)
        } else {
          store.commit('SET_HELPSHOW', true)
        }
        if (res.data.document[0] !== false) {
          that.isAdd = false
          that.editHelpForm.title = res.data.document.title
          that.editHelpForm.content = res.data.document.content
          that.editId = res.data.document.id
          console.log(that.editHelpForm.content, 'fff')
          that.editHelpForm.file = res.data.document.file
          if (this.editHelpForm.file !== undefined && that.editHelpForm.file !== '') {
            that.fileList = JSON.parse(that.editHelpForm.file)
          }
          // window.localStorage.setItem('helpWorld', JSON.stringify(false))
        }
      })
    },
    getValue(e) {
      this.editHelpForm.content = e.html
      this.editHelpForm.content = e.replace(/(^&nbsp;)|(&nbsp;$)/g, '')
    },
    saveModel() {
      const that = this
      this.$refs['editHelpForm'].validate((valid) => {
        if (valid) {
          if (this.filesArr.length > 0) {
            this.editHelpForm.file = JSON.stringify(this.filesArr)
          }
          console.log(this.editHelpForm.file)
          that.submitting = true
          if (this.isAdd) {
            console.log(this.editHelpForm, 'fffff')
            saveHelpWord(this.editHelpForm).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '帮助文档添加成功！',
                  type: 'success'
                })
                that.submitting = false
                store.commit('SET_HELPSHOW', true)
                that.$router.back(-1)
              } else {
                that.submitting = false
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
          } else {
            console.log(that.editHelpForm, that.editId, 'jh')
            that.editHelpForm.id = that.editId
            editHelpWord(that.editId, that.editHelpForm).then(res => {
              console.log(res, 'lll')
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '帮助文档更新成功！',
                  type: 'success'
                })
                that.submitting = false
                store.commit('SET_HELPSHOW', true)
                that.$router.back(-1)
              } else {
                that.submitting = false
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
          }
        }
      })
    },
    resetForm() {
      this.$refs['editHelpForm'].resetFields()
      this.editHelpForm = {
        title: '',
        content: '',
        file: ''
      }
      this.isAdd = false
      this.fileList = []
      this.filesArr = []
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning('当前限制选择 1 个文件，请删除后继续上传')
    },
    beforeUpload(file, fileList) {
      console.log(file)
      if (file.name.indexOf('.png') === -1 && file.name.indexOf('.jpg') === -1 && file.name.indexOf('.bmp') === -1 && file.name.indexOf('.doc') === -1 && file.name.indexOf('.docx') === -1 && file.name.indexOf('.ppt') === -1 && file.name.indexOf('.pdf') === -1 && file.name.indexOf('.zip') === -1 && file.name.indexOf('.rar') === -1 &&
          file.name.indexOf('.xls') === -1 && file.name.indexOf('.xlsx') === -1 && file.name.indexOf('.csv') === -1) {
        // this.$message.warning('文件格式必须是.png或.jpg或.bmp或.doc或.docx或.ppt或.pdf或.zip或.rar的后缀名！')
        this.$message.warning('文件格式不正确！')
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        this.$message.warning('文件最大只能为5MB!')
        return false
      }
    },
    handleSuccess(res, file, fileList) {
      if (res.code === 200 || res.code === '200') {
        this.filesArr = []
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].response === undefined) {
            this.filesArr.push({
              name: fileList[i].name,
              url: fileList[i].url
            })
          } else {
            this.filesArr.push({
              name: fileList[i].name,
              url: fileList[i].response.data.data[0].pathname
            })
          }
        }
      }
    },
    handleRemove(file, fileList) {
      console.log(fileList)
      this.filesArr = []
      if (fileList.length > 0) {
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].response === undefined) {
            this.filesArr.push({
              name: fileList[i].name,
              url: fileList[i].url
            })
          } else {
            this.filesArr.push({
              name: fileList[i].name,
              url: fileList[i].response.data.data[0].pathname
            })
          }
        }
      } else {
        this.editHelpForm.file = ''
      }
      console.log(this.filesArr)
    }
  }
}
</script>
<style lang="less" scoped>
  .edithelp_bg{
    background: #fff;
    padding: 0 10px;
    padding-bottom: 20px;
    position: absolute;
    width: 100%;
    top: 0;
    height: 100vh;
    overflow-y: scroll;
    .modelForm{
      padding-top: 20px;
    }
    .mar-r{
      margin-left: 100px;
    }
  }
</style>
