<template>
  <div>
    <div class="course_bg">
      <div class="fifter">
        <my-tabs
          :page-name="page_name"
          :module-name="module_name"
          :add="btnPermission('offlinecourse_create')"
          :active-name="searchInfo.mode"
          :tabs-list="tabsList"
          @addAction="addCourse"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)"/>
          <!-- <search-fifter :add="btnPermission('offlinecourse_create')" :module-name="'offlinecourse'" :fifter="true" :add-text="'创建课程'" @addAction="addCourse" @search="fifterSearch" /> -->
      </div>
      <div class="bussiness_info">
        <!-- <el-tabs type="card" class="tabs_table">
          <el-tab-pane label="全部课程"> -->
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}条内容，已选中{{ choseTotal }}条</span>
            <el-button v-if="btnPermission('offlinecourse_batchbanned')" plain size="mini" @click="batchstop('stop')">批量停用</el-button>
            <el-button v-if="btnPermission('offlinecourse_batchcancellation')" plain size="mini" @click="batchstop('remover')">批量作废</el-button>
            <el-button v-if="btnPermission('offlinecourse_batchenable')" plain size="mini" @click="batchstop('start')">批量启用</el-button>
          </div>
        </div>
        <el-table
          v-loading="loading"
          ref="table"
          :data="tableData"
          :max-height="tableHeight"
          border
          row-key="id"
          tooltip-effect="light"
          @sort-change="fifterTable"
          @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" width="55" /> -->
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column prop="name" label="课程名称" show-overflow-tooltip min-width="100"/>
          <el-table-column prop="content" label="课程简介" show-overflow-tooltip min-width="100">
            <template slot-scope="scope">
              <!-- <el-tooltip :content="scope.row.content" placement="top" effect="light"> -->
              <span :title="scope.row.content" class="over_line_two">{{ scope.row.content }}</span>
              <!-- </el-tooltip> -->
            </template>
          </el-table-column>
          <el-table-column prop="createdDate" label="创建时间" show-overflow-tooltip min-width="100"/>
          <el-table-column prop="editedDate" label="更新时间" show-overflow-tooltip min-width="100"/>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status==1" type="success">启用</el-tag>
              <el-tag v-if="scope.row.status==2" type="danger">停用</el-tag>
              <el-tag v-if="scope.row.status==99" type="warning">作废</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('offlinecourse_edit')" type="text" size="small" @click="showModel(scope.row,'edit')">编辑</el-button>
              <el-button v-if="btnPermission('offlinecourse_banned')&&scope.row.status==1" type="text" size="small" @click="changeStates(scope.row,'2')">停用</el-button>
              <el-button v-if="btnPermission('offlinecourse_banned')&&scope.row.status==2" type="text" size="small" @click="changeStates(scope.row,'1')">启用</el-button>
              <el-button v-if="btnPermission('offlinecourse_cancellation')" type="text" size="small" @click="changeDelet(scope.row,'99')">作废</el-button>
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
      <!-- 新建/编辑课程 -->
      <el-scrollbar class="fixed_scroll">
        <el-form
          v-if="modelShow"
          ref="courseForm"
          :model="courseForm"
          :rules="rules"
          class="modelForm center"
          label-width="100px"
          label-position="right">
          <el-form-item label="课程：" prop="name">
            <el-input v-model.trim="courseForm.name" style="width:500px" placeholder="请输入课程名称" />
          </el-form-item>
          <el-form-item label="课程简介：" prop="content">
            <el-input v-model.trim="courseForm.content" :rows="3" type="textarea" style="width:500px" placeholder="请输入课程相关介绍，最大长度为120个字"/>
          </el-form-item>
          <el-form-item label="上传课件：">
            <el-upload
              ref="upload"
              :on-preview="handlePreview"
              :on-exceed="handleExceed"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :file-list="fileList"
              :name="'files'"
              :action="uploadUrl"
              style="width:500px"
              class="upload-demo"
              multiple>
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请上传压缩包、word文档、excel文档、ppt演示文稿、pdf文档、图片文件</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="modelType=='new'" @click="resetsubmit">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">{{ sureBtn }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getCourseInfo,
  changeCourse,
  saveCourse,
  updateCourse,
  coursebatchCancel,
  coursebatchStart,
  coursebatchStop,
  courseCancelLation
} from '@/api/training'
// import axios from 'axios'
export default {
  name: 'Course',
  data() {
    return {
      filesArr: [],
      uploadUrl: '',
      tableData: [],
      page_name: 'offlinecourse',
      module_name: 'ofs',
      choseTotal: 0,
      tabsList: [
        { label: '全部课程', name: 'all' }
      ],
      loading: true,
      modelType: '',
      modelTitle: '',
      modelShow: false,
      sureBtn: '确 定',
      courseForm: {
        name: '',
        content: '',
        file: ''
      },
      fileList: [],
      files: [],
      tableHeight: 250,
      rules: {
        name: [{
          required: true,
          message: '课程名称不能为空',
          trigger: 'blur'
        }, { min: 1, max: 50, message: '课程名称长度超出范围1-50位之间', trigger: 'blur' }],
        content: [{
          required: true,
          message: '课程简介不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '课程简介长度超出范围1-120位之间', trigger: 'blur' }]
      },
      searchInfo: {
        mode: 'all', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
        search: '', // 搜索关键字
        orderBy: 'id_desc', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      submitting: false,
      selectArr: [],
      total: 0 // 总条数
    }
  },
  mounted() {
    this.fileUrl = process.env.FILE_API
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
    batchstop(type) {
      const that = this
      if (that.selectArr.length > 0) {
        const obj = {
          ids: this.selectArr.join(',')
        }
        if (type == 'stop') {
          this.$confirm('确定要批量停用该课程吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            coursebatchStop(obj).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  type: 'success',
                  message: '操作成功'
                })
                that.getList()
                that.selectArr = []
                that.$refs.table.clearSelection()
              } else {
                that.$message({
                  type: 'warning',
                  message: res.data.message
                })
                console.log('没有成功')
              }
            })
          }).catch(() => {
            console.log('用户点击了取消')
          })
        } else if (type == 'remover') {
          this.$confirm('课程一旦作废不可恢复，确定要批量“作废”吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            coursebatchCancel(obj).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  type: 'success',
                  message: '操作成功'
                })
                that.getList()
                that.selectArr = []
                that.$refs.table.clearSelection()
              } else {
                that.$message({
                  type: 'warning',
                  message: res.data.message
                })
                console.log('没有成功')
              }
            })
          }).catch(() => {
            console.log('用户点击了取消')
          })
        } else {
          this.$confirm('确定要批量启用该课程吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            coursebatchStart(obj).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  type: 'success',
                  message: '操作成功'
                })
                that.getList()
                that.selectArr = []
                that.$refs.table.clearSelection()
              } else {
                that.$message({
                  type: 'warning',
                  message: res.data.message
                })
                console.log('没有成功')
              }
            })
          }).catch(() => {
            console.log('用户点击了取消')
          })
        }
      }
    },
    handleSelectionChange(val) {
      console.log(val)
      this.choseTotal = val.length
      if (val.length > 0) {
        const arr = []
        for (let i = 0; i < val.length; i++) {
          arr.push(val[i].id)
        }
        this.selectArr = arr
        console.log('本页选择了')
      } else {
        this.selectArr = []
        console.log('取消选择')
      }
    },
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
    resetsubmit() {
      this.$refs['courseForm'].resetFields()
      this.courseForm = {}
      this.fileList = []
      this.submitting = false
    },
    fifterTable(event) {
      console.log(event.order)
      if (event.order === 'ascending') {
        this.searchInfo.orderBy = event.prop + '_asc'
      } else if (event.order === 'descending') {
        this.searchInfo.orderBy = event.prop + '_desc'
      } else {
        this.searchInfo.orderBy = ''
      }
      this.loading = true
      this.searchInfo.pageID = 1
      this.tableData = []
      this.getList()
    },
    getList() {
      const that = this
      getCourseInfo(this.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          that.tableData = res.data.offlinecourse
          that.total = res.data.pager.recTotal // 总条数
        }
      })
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
    addCourse() {
      this.modelTitle = '创建课程'
      this.modelType = 'new'
      this.modelShow = true
      this.sureBtn = '保 存'
    },
    choseType() {
      this.searchInfo.pageID = 1
      this.tableData = []
      if ((this.$refs.table) !== undefined) {
        this.resetTable()
      }
      this.loading = true
      this.getList()
    },
    resetTable() {
      for (let i = 0; i < (this.$refs.table).length; i++) {
        (this.$refs.table)[i].clearSort()
      }
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
    changeStates(event, states) {
      const that = this
      let msg = ''
      if (states === '1') {
        msg = '确定启用该课程吗？'
      } else if (states === '2') {
        msg = '确定停用该课程吗？'
      }
      // else {
      //   msg = '课程一旦作废不可恢复，确定要“作废”吗？'
      // }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeCourse(event.id, states).then(res => {
          if (res.code === 200 || res.code === '200') {
            that.$message({
              type: 'success',
              message: res.data.msg
            })
            this.modelShow = false
            that.getList()
          } else {
            that.$message({
              type: 'warning',
              message: res.data.msg
            })
          }
        })
      }).catch(() => {
        console.log('用户点击了取消')
      })
    },
    changeDelet(event, states) {
      const that = this
      this.$confirm('课程一旦作废不可恢复，确定要“作废”吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        courseCancelLation(event.id, states).then(res => {
          if (res.code === 200 || res.code === '200') {
            that.$message({
              type: 'success',
              message: res.msg
            })
            this.modelShow = false
            that.getList()
          } else {
            that.$message({
              type: 'warning',
              message: res.data.msg
            })
          }
        })
      }).catch(() => {
        console.log('用户点击了取消')
      })
    },
    showModel(data, type) {
      this.courseForm = { ...data }
      if (this.courseForm.file === null || this.courseForm.file === '') {
        this.fileList = []
        this.courseForm.file = []
      } else {
        const file = JSON.parse(this.courseForm.file)
        this.fileList = file
      }
      this.modelType = type
      this.modelShow = true
      this.modelTitle = '编辑课程'
    },
    // sureSave() {
    //   this.$refs.upload.submit()
    //   if (this.files.length === 0) {
    //     this.saveModel()
    //   }
    // },
    saveModel() {
      const that = this
      this.$refs['courseForm'].validate((valid) => {
        if (valid) {
          if (this.filesArr.length > 0) {
            this.courseForm.file = JSON.stringify(this.filesArr)
          }
          this.submitting = true
          if (this.modelType === 'new') {
            console.log(this.courseForm)
            // 新增公告
            saveCourse(this.courseForm).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '课程新增成功！',
                  type: 'success'
                })
                that.resetModel()
                that.loading = true
                that.getList()
              } else {
                that.submitting = false
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
          } else {
            // 更新公告
            updateCourse(this.courseForm).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '课程更新成功！',
                  type: 'success'
                })
                that.resetModel()
                that.loading = true
                that.getList()
              } else {
                that.submitting = false
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
    resetModel() {
      console.log('重置表单')
      this.$refs['courseForm'].resetFields()
      this.courseForm = {}
      this.fileList = []
      this.filesArr = []
      this.modelShow = false
      this.submitting = false
    },
    beforeUpload(file, fileList) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (file.name.indexOf('.png') === -1 && file.name.indexOf('.jpg') === -1 && file.name.indexOf('.bmp') === -1 && file.name.indexOf('.doc') === -1 && file.name.indexOf('.docx') === -1 && file.name.indexOf('.ppt') === -1 && file.name.indexOf('.pdf') === -1 && file.name.indexOf('.zip') === -1 && file.name.indexOf('.rar') === -1 &&
          file.name.indexOf('.xls') === -1 && file.name.indexOf('.xlsx') === -1 && file.name.indexOf('.csv') === -1) {
        // this.$message.warning('文件格式必须是.png或.jpg或.bmp或.doc或.docx或.ppt或.pdf或.zip或.rar的后缀名！')
        this.$message.warning('文件格式不正确！')
        return false
      }
      // if (!isLt5M) {
      //   this.$message.warning('文件大小不能超过5M！')
      //   return false
      // }
    },
    handlePreview(file) {
      console.log(file)
      const url = process.env.FILE_API + file.url
      window.open(url)
    },
    handleSuccess(res, file, fileList) {
      // let list = {}
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
        this.courseForm.file = ''
      }
      console.log(this.filesArr)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleExceed(files, fileList) {
      this.$message.warning('当前限制选择 1 个文件，请删除后继续上传')
    }
  }
}

</script>
<style lang="less" scoped>
  .course_bg {
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

    .bussiness_info {
      background: #fff;
      padding: 20px 10px;
      .tabs_table {
        // .over_line_one {
        //   overflow: hidden;
        //   text-overflow: ellipsis;
        //   white-space: nowrap
        // }

        // .over_line_two {
        //   overflow: hidden;
        //   text-overflow: ellipsis;
        //   display: -webkit-box;
        //   -webkit-line-clamp: 2;
        //   -webkit-box-orient: vertical;
        // }
        .over_line_two:hover{
          cursor: pointer;
        }
      }
    }

    .bussiness_page {
      text-align: center;
      padding: 10px 0;
    }
  }

  .dialogModel {
    .modelForm {
      margin: 0 10px;
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
