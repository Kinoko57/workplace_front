<template>
  <div>
    <div class="approval_page_bg">
      <div class="fifter">
        <my-tabs
          :active-name="'all'"
          :page-name="page_name"
          :module-name="module_name"
          :allow-fifter="false"
          :tabs-list="typeList"
          :other="modelType=='approval'"
          :other-text="'审核'"
          :return-show="true"
          @actionClick="showApproval"
          @returnAction="returnPage"/>
      </div>
      <div class="approval_body">
        <el-form
          v-if="(modelType=='new'||modelType=='edit')"
          ref="dailyForm"
          :model="dailyForm"
          :rules="rules"
          class="approval_form_info">
          <p class="form_title">日报信息</p>
          <table class="approval_table" cellpadding="0" cellspacing="0">
            <tr>
              <td class="table_title">填写人</td>
              <td class="table_form_block table_form_block_padding">{{ accountInfo.name }}</td>
              <td class="table_title">填写日期</td>
              <td class="table_form_block table_form_block_padding">
                <my-form-item prop="startDate">
                  <el-date-picker
                    v-model="dailyForm.startDate"
                    type="date"
                    readonly
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd" />
                    <!-- {{ dailyForm.startDate|parseTime('{y}-{m}-{d} {h}:{i}') }} -->
                </my-form-item>

              </td>
              <td class="table_title">上传附件</td>
              <td class="table_form_block table_form_block_padding">
                <my-form-item>
                  <el-button size="mini" type="primary" plain @click="showRefundDialog(dailFilesArr, 'procurementForm')">管理附件({{ dailFilesArr.length }})</el-button>
                </my-form-item>
              </td>
            </tr>
            <tr>
              <td class="table_title">今日任务</td>
              <td class="table_form_block" colspan="7">
                <my-form-item prop="content">
                  <el-input
                    v-model.trim="dailyForm.content"
                    :rows="5"
                    size="mini"
                    type="textarea"
                    placeholder="请输入今日任务,最大长度为500个字" />
                </my-form-item>
              </td>
            </tr>
          </table>
          <my-form-item class="form_btn">
            <el-button v-if="modelType!='edit'" @click="resetForm">重 置</el-button>
            <el-button :loading="submitting" type="primary" @click="saveModel">保存</el-button>
          </my-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :visible.sync="refund_dialog"
      class="small_dialog"
      title="管理附件">
      <div class="file_style" style="padding:20px 30px;overflow-y:scroll;height:360px;">
        <el-upload
          v-if="refund_dialog"
          ref="upload"
          :on-preview="handlePreview"
          :on-exceed="handleExceed"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
          :name="'files'"
          :action="uploadUrl"
          :file-list="fileList"
          class="upload-demo"
          multiple>
          <el-button size="small" type="primary">上 传</el-button>
          <div slot="tip" class="el-upload__tip">请上传压缩包、word文档、excel文档、ppt演示文稿、pdf文档、图片文件</div>
        </el-upload>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refund_dialog = false">取 消</el-button>
        <el-button type="primary" @click="sureRefundFile">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  saveDaily,
  updateDaily,
  getDailyInfo,
  doApproveDaily
} from '@/api/office'
// import {
//   getDepList
// } from '@/api/system'
import {
  // eslint-disable-next-line no-unused-vars
  btnPermission
} from '@/permission.js' // 按钮权限和页面权限
export default {
  name: 'DailyViewManage',
  data() {
    return {
      accountInfo: {},
      page_name: 'daily',
      module_name: 'oa',
      choseTotal: 0,
      dataChange: {},
      typeList: [{
        label: '新增日报',
        name: 'all'
      }],
      approveForm: {
        id: 0,
        result: 1,
        postil: ''
      },
      uploadUrl: '',
      inputName: '不选则通知整个集团',
      tableData: [],
      loading: true,
      modelType: 'new',
      modelTitle: '',
      modelShow: false,
      sureBtn: '确 定',
      showDate: new Date(),
      dailyForm: {
        startDate: '',
        content: ''
      },
      viewForm: {},
      rules: {
        startDate: [{
          required: true,
          message: '日报时间不能为空',
          trigger: 'change'
        }],
        content: [{
          required: true,
          message: '今日任务不能为空',
          trigger: 'change'
        }, { min: 1, max: 500, message: '今日任务长度超出范围1-500位之间', trigger: 'blur' }]
      },
      searchInfo: {
        mode: 'all', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      submitting: false,
      dailFilesArr: [],
      filesArr: [],
      fileList: [],
      refund_dialog: false,
      tableHeight: 250,
      total: 0 // 总条数
    }
  },
  mounted() {
    this.uploadUrl = process.env.BASE_API + 'sys/file-upload'
    // 获取列表
    // this.getList()
    if (this.modelType == 'new') {
      this.addReport()
    } else if (this.modelType == 'edit') {
      this.addReport()
    }
  },
  created() {
    this.accountInfo.name = JSON.parse(window.localStorage.getItem('userinfo')).realname
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  methods: {
    sureRefundFile() {
      console.log(this.filesArr)
      this.refund_dialog = false
      this.dailFilesArr = this.filesArr
    },
    showRefundDialog(list, index) {
      // 采购单
      this.filesArr = []
      this.fileList = []
      this.fileList = list
      this.filesArr = list
      this.refund_dialog = true
      this.file_index = index
    },
    beforeUpload(file, fileList) {
      if (file.name.indexOf('.png') === -1 && file.name.indexOf('.jpg') === -1 && file.name.indexOf('.bmp') === -1 && file.name.indexOf('.doc') === -1 && file.name.indexOf('.docx') === -1 && file.name.indexOf('.ppt') === -1 && file.name.indexOf('.pdf') === -1 && file.name.indexOf('.zip') === -1 && file.name.indexOf('.rar') === -1 &&
          file.name.indexOf('.xls') === -1 && file.name.indexOf('.xlsx') === -1 && file.name.indexOf('.csv') === -1) {
        this.$message.warning('文件格式不正确！')
        return false
      }
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning('当前限制选择 1 个文件，请删除后继续上传')
    },
    handleSuccess(res, file, fileList) {
      this.uploadFile = ''
      console.log(res)
      console.log(fileList)
      this.filesArr = []
      if (res.code == 200 || res.code == '200') {
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].response == undefined) {
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
      console.log(this.filesArr)
    },
    handleRemove(file, fileList) {
      console.log(file)
      console.log(fileList)
      this.filesArr = []
      if (fileList.length > 0) {
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].response == undefined) {
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
    returnPage() {
      this.$router.back(-1)
    },
    showApproval() {

    },
    getList() {
      const that = this
      getDailyInfo(this.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          that.tableData = res.data.dailys
          that.total = res.data.pager.recTotal // 总条数
        }
      })
    },
    choseType(value) {
      console.log(this.searchInfo.mode)
      this.searchInfo.pageID = 1
      this.searchInfo.mode = value
      if ((this.$refs.table) !== undefined) {
        this.resetTable()
      }
      this.tableData = []
      this.loading = true
      this.getList()
    },
    resetTable() {
      for (let i = 0; i < (this.$refs.table).length; i++) {
        (this.$refs.table)[i].clearSort()
      }
    },
    fifterSearch(event) {
      if (event) {
        this.searchInfo.search = 'bySearch'
        this.tableData = []
        this.loading = true
        this.searchInfo.pageID = 1
        this.getList()
      } else {
        this.searchInfo.search = ''
        // this.getList()
      }
    },
    fifterTable(event) {
      console.log(event.prop)
      console.log(event.order)
      this.loading = true
      if (event.order === 'ascending') {
        this.searchInfo.orderBy = event.prop + '_asc'
      } else if (event.order === 'descending') {
        this.searchInfo.orderBy = event.prop + '_desc'
      } else {
        this.searchInfo.orderBy = ''
      }
      this.searchInfo.pageID = 1
      this.tableData = []
      this.getList()
    },
    addReport() {
      this.dailyForm.startDate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1) + '-' + (new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate())
      this.modelTitle = '创建日报'
      this.modelType = 'new'
      this.modelShow = true
      this.sureBtn = '保 存'
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.searchInfo.pageID = 1
      this.searchInfo.recPerPage = val
      this.tableData = []
      this.loading = true
      this.getList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.searchInfo.pageID = val
      this.loading = true
      this.getList()
    },
    showModel(data, type) {
      console.log(data, 'sgfdsagfdhg')
      if (type === 'view') {
        this.modelTitle = '查看'
        // 根据id查询后台接口获取查看的详细内容
        this.viewForm = data
        this.sureBtn = '保 存'
      } else if (type === 'edit') {
        this.modelTitle = '编辑'
        this.dailyForm = {
          'id': data.id,
          'startDate': data.startDate,
          'content': data.content
        }
        this.sureBtn = '保 存'
      } else {
        this.modelTitle = '审阅日报'
        this.viewForm = data
        this.approveForm.id = data.id
        this.sureBtn = '审 阅'
      }
      this.modelType = type
      this.modelShow = true
    },

    saveModel() {
      const that = this
      this.$refs['dailyForm'].validate((valid) => {
        if (valid) {
          this.submitting = true
          if (this.modelType === 'new') {
            console.log(this.dailyForm)
            const obj = {
              ...that.dailyForm,
              file: that.filesArr.length > 0 ? JSON.stringify(that.filesArr) : ''
            }
            // 新增日报
            saveDaily(obj).then(res => {
              that.submitting = false
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '日报添加成功！',
                  type: 'success'
                })
                that.resetModel()
                that.loading = true
                that.$router.back(-1)
              } else {
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
          } else {
            // 更新日报
            const obj = {
              ...that.dailyForm,
              file: that.filesArr.length > 0 ? JSON.stringify(that.filesArr) : ''
            }
            updateDaily(obj).then(res => {
              console.log(res)
              that.submitting = false
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '日报更新成功！',
                  type: 'success'
                })
                that.resetModel()
                that.loading = true
                that.getList()
              } else {
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
          }
        } else {
          console.log('error submit!!')
          //   // this.$message.warning('信息填写不完整或者信息填写有误！')
          // this.$nextTick(() => {
          //   this.checkFormErr()
          // })
          return false
        }
      })
    },
    approvalModel() {
      const that = this
      // 审批日报
      doApproveDaily(this.approveForm).then(res => {
        if (res.code === 200 || res.code === '200') {
          that.$message({
            message: '日报审批成功！',
            type: 'success'
          })
          that.resetModel()
          that.loading = true
          that.getList()
        } else {
          that.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
      this.modelShow = false
    },
    resetModel() {
      if (this.modelType === 'new' || this.modelType === 'edit') {
        console.log('重置表单')
        this.$refs['dailyForm'].resetFields()
        this.dailyForm = {}
      // eslint-disable-next-line no-empty
      } else if (this.modelType === 'approval') {

      }
      this.modelShow = false
    },
    resetForm() {
      if (this.modelType === 'new' || this.modelType === 'edit') {
        console.log('重置表单')
        this.$refs['dailyForm'].resetFields()
        this.dailyForm = {}
        this.dailyForm.startDate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1) + '-' + (new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate())
      // eslint-disable-next-line no-empty
      } else if (this.modelType === 'approval') {

      }
    }
  }
}

</script>
<style lang="less" scoped>
  .approval_page_bg {
    background: #fff;
    height: calc(100vh - 84px);

    .approval_body {
      padding: 20px 16px;
      height: calc(100vh - 132px);
      overflow-y: scroll
    }
  }

  .dialogModel {
    .modelForm {
      margin: 0 10px;
      .checkDep {
        position: relative;

        .red_star {
          position: absolute;
          left: -90px;
          font-size: 13px;
          font-family: 'Arial Normal', 'Arial';
          color: #f56c6c;
        }
      }

      .fifter_down {
        position: relative;

        .chose_dep {
          background: transparent;
          // border-color: #c0c4cc;
          // border-radius: 4px;
          // border: 1px solid #dcdfe6;
          // height: 36px;
          // line-height: 36px;
          // display: flex;
          // align-items: center;
          // justify-content: space-between;
          // padding: 0 10px;
        }

        .tag_list {
          position: absolute;
          top: 0;
          left: 5px;
          width: 310px;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          height: 36px;
          line-height: 36px;

          span {
            margin-right: 5px;
          }
        }
      }

      .scroll_tree {
        .fifter_input {
          width: 400px;
          padding-top: 5px;
          padding-left: 5px;
          padding-bottom: 5px;
        }
      }
    }
    /deep/ .el-scrollbar__wrap{
      margin: 0
    }
    .view_daily {
      .view_line {
        overflow: hidden;
        padding: 10px 0;

        span {
          font-family: '微软雅黑 Regular', '微软雅黑';
          font-weight: 400;
          font-size: 14px;
          color: #999999;
          float: left;
          width: 460px;
        }

        .line_title {
          font-weight: 400;
          color: #666666;
          width: 80px;
          text-align: right;
        }

        .first_line {
          font-weight: 700;
          font-size: 16px;
          color: #999999;
        }

        .second_line {
          color: #000000;
        }

        .small_font {
          font-size: 12px;
          padding-left: 10px;
        }
      }
    }

    .center {
      margin: 0 70px;
    }

    .conversionHistory {

      .his_list {
        list-style: none;
      }
    }
  }

</style>
