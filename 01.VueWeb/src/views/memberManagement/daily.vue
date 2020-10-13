<template>
  <div>
    <div class="daily_bg">
      <div class="fifter">
        <my-tabs
          :active-name="searchInfo.mode"
          :add="btnPermission('daily_create')"
          :page-name="page_name"
          :module-name="module_name"
          :tabs-list="typeList"
          @addAction="addReport"
          @handleClick="choseType"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)" />
          <!-- <search-fifter :add="btnPermission('daily_create')" :module-name="'daily'" :fifter="true" :add-text="'创建日报'" @addAction="addReport" @search="fifterSearch" /> -->
      </div>
      <div class="daily_info">
        <!-- <el-tabs v-model="searchInfo.mode" type="card" class="tabs_table" @tab-click="choseType">
          <el-tab-pane v-for="(item,index) in typeList" :key="index" :label="item.text" :name="item.name"> -->
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}条记录</span>
            <!-- <el-button plain size="mini">批量停用</el-button>
            <el-button plain size="mini">批量作废</el-button> -->
          </div>
        </div>
        <el-table v-loading="loading" ref="table" :data="tableData" :max-height="tableHeight" border row-key="id" style="width: 100%" tooltip-effect="light" @sort-change="fifterTable">
          <!-- <el-table-column type="selection" width="55" /> -->
          <!-- <el-table-column  type="selection" min-width="40" fixed="left" align="center"/> -->
          <el-table-column prop="accountName" label="员工"/>
          <el-table-column prop="organizeName" label="所属部门" min-width="150" >
            <template slot-scope="scope">
              <!-- <span v-if="scope.row.organizeId==0">顶级部门</span> -->
              <span>{{ scope.row.organizeName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="startDate" label="日期" min-width="150"/>
          <el-table-column prop="content" label="日报内容" min-width="220" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.content }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status==1">待审阅</el-tag>
              <el-tag v-if="scope.row.status==2" type="success">已审阅</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="tableData.length>0" label="操作" width="200" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('daily_view')" type="text" size="small" @click="showModel(scope.row,'view')">查看</el-button>
              <el-button v-if="btnPermission('daily_edit') && searchInfo.mode=='my'" :disabled="scope.row.status==2||scope.row.disabled==0" type="text" size="small" @click="showModel(scope.row,'edit')">编辑</el-button>
              <el-button v-if="btnPermission('daily_review') && searchInfo.mode=='wait'" :disabled="scope.row.status==2||scope.row.isHidden==1" type="text" size="small" @click="showModel(scope.row,'approval')">审阅</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="info_page">
          <el-pagination
            :current-page="searchInfo.pageID"
            :page-sizes="[5, 10, 50, 100]"
            :page-size="searchInfo.recPerPage"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
        <!-- </el-tab-pane>
        </el-tabs> -->
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="modelShow" :title="modelTitle" width="600px" class="dialogModel" @close="resetModel">
      <!-- 新建/编辑日报 -->
      <el-scrollbar v-if="(modelType=='new'||modelType=='edit')&&modelShow" class="fixed_scroll">
        <el-form
          ref="dailyForm"
          :model="dailyForm"
          :rules="rules"
          class="modelForm"
          label-width="100px"
          label-position="right">
          <el-form-item label="时间：" prop="startDate">
            <el-date-picker
              v-model="dailyForm.startDate"
              :picker-options="dataChange"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd"
              style="width:500px"
              readonly/>
          </el-form-item>
          <el-form-item label="事由：" prop="content">
            <el-input v-model.trim="dailyForm.content" :rows="5" type="textarea" style="width:500px" placeholder="请输入日报内容,最大长度为500个字" />
          </el-form-item>
          <el-form-item class="itemFrom" label="附件：" prop="file">
            <el-upload
              ref="upload"
              :disabled="modelType=='change'"
              :on-preview="handlePreview"
              :on-exceed="handleExceed"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :file-list="fileList"
              :name="'files'"
              :action="uploadUrl"
              class="upload-demo"
              style="width:500px;"
              multiple>
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请上传压缩包、word文档、excel文档、ppt演示文稿、pdf文档、图片文件</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <el-scrollbar v-if="modelType=='view'&&modelShow" :class="viewForm.status == 2?'fixed_scroll over_scroll':'fixed_scroll'" >
        <div>
          <table class="view_dialog view_dialog_find" cellpadding="0" cellspacing="0" >
            <tr class="view_line">
              <td class="line_title">员工</td>
              <td class="second_line">{{ viewForm.accountName }}</td>
            </tr>
            <tr class="view_line">
              <td class="line_title">所属部门</td>
              <td class="second_line">{{ viewForm.organizeName }}</td>
            </tr>
            <tr class="view_line">
              <td class="line_title">时间</td>
              <td class="second_line">{{ viewForm.startDate }}</td>
            </tr>
            <tr class="view_line">
              <td class="line_title">内容</td>
              <td class="second_line">{{ viewForm.content }}</td>
            </tr>
            <tr class="view_line">
              <td class="line_title">附件</td>
              <td class="second_line">
                <div v-for="(item,index) of viewForm.file" v-show="viewForm.file!=''" :key="index" class="fileStyle">
                  <a :title="item.name" :href="fileUrl + item.url" download="" class="file" target="_blank">{{ item.name }}</a>
                </div>
                <div v-show="viewForm.file==''"/>
              </td>
            </tr>
            <tr v-if="viewForm.status==2" class="view_line">
              <td class="line_title">审阅人</td>
              <td class="second_line">{{ viewForm.checkAccount }}</td>
            </tr>
            <tr v-if="viewForm.status==2" class="view_line">
              <td class="line_title">审阅时间</td>
              <td class="second_line">{{ viewForm.auditDate }}</td>
            </tr>
            <tr v-if="viewForm.status==2" class="view_line">
              <td class="line_title">审阅结果</td>
              <td v-if="viewForm.checkResult=='1'" class="second_line">好</td>
              <td v-if="viewForm.checkResult=='2'" class="second_line">一般</td>
              <td v-if="viewForm.checkResult=='3'" class="second_line">差</td>
            </tr>
            <tr v-if="viewForm.status==2" class="view_line">
              <td class="line_title">批注</td>
              <td class="second_line">{{ viewForm.checkPostil }}</td>
            </tr>
          </table>
        </div>
      </el-scrollbar>
      <el-scrollbar v-if="modelType=='approval'&&modelShow" class="fixed_scroll over_scroll">
        <table class="view_dialog view_dialog_find" cellpadding="0" cellspacing="0" >
          <tr class="view_line">
            <td class="line_title">员工</td>
            <td class="second_line">{{ viewForm.accountName }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">所属部门</td>
            <td class="second_line">{{ viewForm.organizeName }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">时间</td>
            <td class="second_line">{{ viewForm.startDate }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">内容</td>
            <td class="second_line">{{ viewForm.content }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">附件</td>
            <td class="second_line">
              <div v-for="(item,index) of viewForm.file" v-show="viewForm.file!=''" :key="index" class="fileStyle">
                <a :title="item.name" :href="fileUrl + item.url" download="" class="file" target="_blank">{{ item.name }}</a>
              </div>
              <div v-show="viewForm.file==''"/>
            </td>
          </tr>
        </table>
        <el-form
          ref="viewForm"
          :model="approveForm"
          style="margin: 0 auto;width: 700px;"
          label-width="100px"
          label-position="right">
          <el-form-item label="审阅结果：">
            <el-radio-group v-model="approveForm.result">
              <el-radio :label="1" >好</el-radio>
              <el-radio :label="2" >一般</el-radio>
              <el-radio :label="3" >差</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="批注：">
            <el-input :rows="4" v-model.trim="approveForm.postil" style="width:500px" type="textarea" placeholder="请填写批注" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div v-if="modelType=='new'||modelType=='edit'" slot="footer" class="dialog-footer">
        <el-button v-if="modelType=='new'" @click="resetForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">{{ sureBtn }}</el-button>
      </div>
      <div v-if="modelType=='view'" slot="footer" class="dialog-footer">
        <el-button :loading="submitting" type="primary" @click="resetModel">确 定</el-button>
      </div>
      <div v-if="modelType=='approval'" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="approvalModel">确 定</el-button>
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
  name: 'DailyManage',
  data() {
    return {
      page_name: 'daily',
      module_name: 'oa',
      fileUrl: '',
      dataChange: {},
      typeList: [],
      approveForm: {
        id: 0,
        result: 1,
        postil: ''
      },
      uploadUrl: '',
      inputName: '不选则通知整个集团',
      tableData: [],
      loading: true,
      modelType: '',
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
          message: '日报内容不能为空',
          trigger: 'change'
        }, { min: 1, max: 500, message: '日报内容长度超出范围1-500位之间', trigger: 'blur' }]
      },
      searchInfo: {
        mode: 'all', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      filesArr: [],
      fileList: [],
      submitting: false,
      tableHeight: 250,
      total: 0 // 总条数
    }
  },
  mounted() {
    if (this.btnPermission('daily_all') === false) {
      this.typeList = [{
        label: '待我审阅',
        name: 'wait'
      },
      {
        label: '我已审阅',
        name: 'mobile'
      },
      {
        label: '我的日报',
        name: 'my'
      }]
      this.searchInfo.mode = 'wait'
    } else {
      this.typeList = [{
        label: '全部日报',
        name: 'all'
      },
      {
        label: '待我审阅',
        name: 'wait'
      },
      {
        label: '我已审阅',
        name: 'mobile'
      },
      {
        label: '我的日报',
        name: 'my'
      }]
      this.fileUrl = process.env.FILE_API
      this.searchInfo.mode = 'all'
    }
    this.uploadUrl = process.env.BASE_API + 'sys/file-upload'
    // 获取列表
    this.getList()
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  methods: {
    searchShowAction(value) {
      console.log('switch改变了')
      console.log(value)
      if (value) {
        this.$nextTick(res => {
          var elementHeight = parseInt(document.getElementsByClassName('search_style')[0].clientHeight)
          this.tableHeight = document.body.offsetHeight - 330 - elementHeight
          console.log(this.tableHeight)
        })
      } else {
        this.tableHeight = document.body.offsetHeight - 330
      }
    },
    fuzzyQueryAction(value) {
      // table表格重置高度
      this.tableHeight = document.body.offsetHeight - 330
      // 模糊查询搜索
      console.log(value)
      if (value) {
        this.tableData = []
        this.searchInfo.search = 'bySearch'
        this.total = 0
        this.searchInfo.pageID = 1
        this.loading = true
        this.getList()
      }
    },
    searchQueryAction(value) {
      // 高级搜索
      console.log(value)
      if (value) {
        this.tableData = []
        this.searchInfo.search = 'bySearch'
        this.total = 0
        this.searchInfo.pageID = 1
        this.loading = true
        this.getList()
      }
    },
    filterQueryAction(value) {
      // 筛选查询
      console.log(value)
      if (value) {
        this.tableData = []
        this.searchInfo.search = 'bySearch'
        this.total = 0
        this.searchInfo.pageID = 1
        this.loading = true
        this.getList()
      }
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
      // this.dailyForm.startDate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1) + '-' + (new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate())
      // this.modelTitle = '创建日报'
      // this.modelType = 'new'
      // this.modelShow = true
      // this.sureBtn = '保 存'
      this.$router.push({
        name: 'DailyViewManage',
        path: '/memberManagement/daily'
      })
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
        console.log(data, typeof data.file)
        const flag = typeof data.file
        if (data.file != '' && flag == 'string') {
          data.file = JSON.parse(data.file)
        }
        this.viewForm = data
        this.sureBtn = '保 存'
      } else if (type === 'edit') {
        this.modelTitle = '编辑'
        console.log(data)
        const flag = typeof data.file
        if (data.file != '' && flag == 'string') {
          data.file = JSON.parse(data.file)
        }
        this.dailyForm = {
          'id': data.id,
          'startDate': data.startDate,
          'content': data.content
        }
        console.log(data.file, data.file != '')
        this.fileList = data.file != '' ? data.file : []
        this.filesArr = data.file != '' ? data.file : []
        this.sureBtn = '保 存'
      } else {
        console.log(data, typeof data.file)
        const flag = typeof data.file
        if (data.file != '' && flag == 'string') {
          data.file = JSON.parse(data.file)
        }
        this.modelTitle = '审阅日报'
        this.viewForm = data
        this.approveForm.id = data.id
        this.sureBtn = '审 阅'
      }
      this.modelType = type
      this.modelShow = true
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
    saveModel() {
      const that = this
      this.$refs['dailyForm'].validate((valid) => {
        if (valid) {
          this.submitting = true
          if (this.modelType === 'new') {
            console.log(this.dailyForm)
            // 新增日报
            const obj = {
              ...that.dailyForm,
              file: that.filesArr.length > 0 ? JSON.stringify(that.filesArr) : ''
            }
            saveDaily(obj).then(res => {
              that.submitting = false
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '日报添加成功！',
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
          } else {
            // 更新日报
            const obj = {
              ...that.dailyForm,
              file: that.filesArr.length > 0 ? JSON.stringify(that.filesArr) : ''
            }
            console.log(obj, 'aklsfjlsdkf')
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
          // this.$message.warning('信息填写不完整或者信息填写有误！')
          this.$nextTick(() => {
            this.checkFormErr()
          })
          return false
        }
      })
    },
    approvalModel() {
      const that = this
      // 审阅日报
      doApproveDaily(this.approveForm).then(res => {
        if (res.code === 200 || res.code === '200') {
          that.$message({
            message: '日报审阅成功！',
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
.view_dialog .view_line .second_line{
  .fileStyle{
     margin-bottom: 6px;
    a{
       width: auto;
      display: block;
      font-size: 12px;
      color: #409eff;
      text-decoration: underline;
    }
  }
}
  .daily_bg {
    // background: #fff;
    // padding: 10px;
    position: absolute;
    width: 100%;
    top: 0;
    // .search_btn {
    //   display: flex;
    //   align-items: center;
    //   justify-content: space-between;
    // }

    .daily_info {
     padding: 20px 10px;
     background: #fff;

      .tabs_table {
        .over_line_one {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap
        }

        .over_line_two {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }

    .daily_page {
      text-align: center;
      padding: 10px 0;
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
