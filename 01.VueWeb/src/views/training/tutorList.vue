<template>
  <div>
    <div class="tutor_bg">
      <div class="fifter">
        <!-- <search-fifter
          :add="btnPermission('offlineteacher_create')"
          :download-url="downloadUrl"
          :module-name="'offlineteacher'"
          :upload-url="uploadUrl"
          :fifter="true"
          :delay-fifter="loading==false"
          :add-text="'创建讲师'"
          :import-show="btnPermission('offlineteacher_import')"
          :export-show="btnPermission('offlineteacher_export')"
          :export-type="moduleType"
          :export-name="'讲师列表'"
          @addAction="addTutor"
          @importAction="importAction"
          @search="fifterSearch" /> -->
        <my-tabs
          :page-name="page_name"
          :module-name="module_name"
          :add="btnPermission('offlineteacher_create')"
          :active-name="searchInfo.mode"
          :tabs-list="tabsList"
          @addAction="addTutor"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)"/>
      </div>
      <div class="tutor_info">
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}条内容，已选中{{ choseTotal }}条</span>
            <el-button v-if="btnPermission('offlineteacher_batchbanned')" plain size="mini" @click="batchstop('stop')">批量停用</el-button>
            <el-button v-if="btnPermission('offlineteacher_batchcancellation')" plain size="mini" @click="batchstop('remover')">批量作废</el-button>
            <el-button v-if="btnPermission('offlineteacher_batchenable')" plain size="mini" @click="batchstop('start')">批量启用</el-button>
          </div>
          <div class="export_btn">
            <search-fifter
              :download-url="downloadUrl"
              :upload-url="uploadUrl"
              :import-show="btnPermission('offlineteacher_import')"
              :export-show="btnPermission('offlineteacher_export')"
              :export-type="moduleType"
              :export-name="'讲师列表'"
              :module-name="'offlineteacher'"
              @importAction="importAction"/>
          </div>
        </div>
        <el-table
          v-loading="loading"
          ref="tabel"
          :data="tableData"
          :max-height="tableHeight"
          border
          row-key="id"
          tooltip-effect="light"
          @sort-change="fifterTable"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" min-width="40" fixed="left" align="center"/>
          <el-table-column label="讲师姓名" prop="name" show-overflow-tooltip min-width="120"/>
          <el-table-column label="性别" prop="sex" show-overflow-tooltip min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.sex==1" >男</span>
              <span v-if="scope.row.sex==2" >女</span>
            </template>
          </el-table-column>
          <el-table-column prop="studyNum" label="培训次数" show-overflow-tooltip min-width="100"/>
          <el-table-column prop="createdDate" label="创建时间" show-overflow-tooltip min-width="100"/>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status==1" type="success">启用</el-tag>
              <el-tag v-if="scope.row.status==2" type="danger">停用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="200" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('offlineteacher_edit')" type="text" size="small" @click="editInfo(scope.row)">编辑</el-button>
              <el-button v-if="btnPermission('offlineteacher_banned')&&scope.row.status==1" type="text" size="small" @click="changeStatus(scope.row)">停用</el-button>
              <el-button v-if="btnPermission('offlineteacher_banned')&&scope.row.status==2" type="text" size="small" @click="changeStatus(scope.row)">启用</el-button>
              <el-button v-if="btnPermission('offlineteacher_cancellation')" type="text" size="small" @click="banTutors(scope.row,'99')">作废</el-button>
              <el-button v-if="btnPermission('offlineteacher_getteacherinformationviewlist')" type="text" size="small" @click="showModel(scope.row)">培训记录</el-button>
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
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="modelShow" :title="modelTitle" width="600px" class="dialogModel" @close="resetModel">
      <!-- 新建/编辑讲师 -->
      <!-- over_scroll -->
      <el-scrollbar class="fixed_scroll">
        <el-form
          v-if="modelType!='list'&&modelShow"
          ref="tutorForm"
          :model="tutorForm"
          :rules="rules"
          class="modelForm "
          label-width="100px"
          label-position="right">
          <el-form-item label="讲师姓名：" prop="name">
            <el-input v-model.trim="tutorForm.name" autocomplete="off" style="width:500px" placeholder="请输入讲师姓名"/>
          </el-form-item>
          <el-form-item label="性别：" prop="sex">
            <el-radio-group v-model.trim="tutorForm.sex" placeholder="请选择性别">
              <el-radio :label="'1'">男</el-radio>
              <el-radio :label="'2'">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注：" prop="content">
            <el-input
              v-model.trim="tutorForm.content"
              :rows="3"
              type="textarea"
              style="width:500px"
              placeholder="请输入备注，最大长度为120个字" />
          </el-form-item>
        </el-form>
        <div v-if="modelType=='list'&&modelShow" class="training_list">
          <el-table :data="trainingList" :max-height="200" style="width: 100%" tooltip-effect="light" border>
            <el-table-column label="课程名称" prop="name" show-overflow-tooltip min-width="120"/>
            <el-table-column prop="count" label="参与人次" show-overflow-tooltip min-width="100"/>
            <el-table-column prop="createdDate" label="创建时间" show-overflow-tooltip min-width="140"/>
          </el-table>
          <el-pagination
            :current-page="teacherFifter.page"
            :page-sizes="[5,10]"
            :page-size="teacherFifter.limit"
            :total="teacherFifter.total"
            style="margin-top:10px"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="teacherSizeChange"
            @current-change="teacherCurrentChange" />
        </div>
      </el-scrollbar>
      <div v-if="modelType!='list'&&modelShow" slot="footer" class="dialog-footer">
        <el-button v-show="modelType === 'new'" @click="restForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">保 存</el-button>
      </div>
      <div v-if="modelType=='list'&&modelShow" slot="footer" class="dialog-footer">
        <el-button :loading="submitting" type="primary" @click="modelShow=false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getTutorList,
  saveTutor,
  updateTutor,
  banTutor,
  changeStatusTutor,
  tutorbatchCancel,
  tutorbatchStart,
  tutorbatchStop,
  getTraningListById
} from '@/api/training'
// import { getAreaList } from '@/api/public'
export default {
  name: 'TutorManage',
  data() {
    return {
      submitting: false,
      loading: true,
      uploadUrl: '',
      downloadUrl: '',
      depTree: false,
      page_name: 'offlineteacher',
      module_name: 'ofs',
      choseTotal: 0,
      tabsList: [
        { label: '全部', name: 'all' }
      ],
      modelType: '',
      moduleType: '/ofs/offlineteacher-export',
      tableData: [],
      trainingList: [],
      searchInfo: {
        mode: 'all', // 类型
        search: '', // 搜索关键字
        orderBy: 'id_desc', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      total: 0, // 总条数
      tutorForm: {
        name: '',
        sex: '1',
        content: ''
      },
      tableHeight: 250,
      teacherFifter: {
        id: '',
        page: 1,
        limit: 5,
        total: 0
      },
      rules: {
        name: [{
          required: true,
          message: '讲师姓名不能为空',
          trigger: 'blur'
        }, {
          min: 2, max: 20, message: '讲师姓名长度在2-20位', trigger: 'blur'
        }],
        sex: [{
          required: true,
          message: '性别不能为空',
          trigger: 'change'
        }],
        content: [{
          required: true,
          message: '备注不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '备注长度再1-120字内', trigger: 'blur' }]
      },
      modelShow: false,
      modelTitle: '',
      selectArr: []
    }
  },
  mounted() {
    this.uploadUrl = process.env.BASE_API + 'ofs/offlineteacher-import.json'
    this.downloadUrl = process.env.BASE_API + 'data/download/讲师模板.xls'
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
          that.$confirm('确定要批量停用讲师吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            tutorbatchStop(obj).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  type: 'success',
                  message: '操作成功'
                })
                that.getList()
                that.selectArr = []
                that.$refs.tabel.clearSelection()
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
          that.$confirm('讲师一旦作废，不可以恢复,确定要批量“作废”吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            tutorbatchCancel(obj).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  type: 'success',
                  message: '操作成功'
                })
                that.getList()
                that.selectArr = []
                that.$refs.tabel.clearSelection()
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
          that.$confirm('确定要批量启用讲师吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            tutorbatchStart(obj).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  type: 'success',
                  message: '操作成功'
                })
                that.getList()
                that.selectArr = []
                that.$refs.tabel.clearSelection()
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
    restForm() {
      this.submitting = false
      this.$refs['tutorForm'].resetFields()
      this.tutorForm = {
        name: '',
        sex: '1',
        content: ''
      }
    },
    importAction() {
      if (event) {
        this.getList()
      }
    },
    fifterTable(event) {
      if (event.order === 'ascending') {
        this.searchInfo.orderBy = event.prop + '_asc'
      } else if (event.order === 'descending') {
        this.searchInfo.orderBy = event.prop + '_desc'
      } else {
        this.searchInfo.orderBy = ''
      }
      this.searchInfo.pageID = 1
      this.tableData = []
      this.loading = true
      this.getList()
    },
    getList() {
      const that = this
      getTutorList(that.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          // console.log(res)
          that.tableData = res.data.offlineteacher
          that.total = res.data.pager.recTotal// 总条数
        }
      })
    },
    addTutor() {
      this.modelShow = true
      this.modelType = 'new'
      this.modelTitle = '新增讲师'
    },
    editInfo(event) {
      const data = { ...event }
      this.tutorForm = {
        id: data.id,
        name: data.name,
        sex: data.sex,
        content: data.content
      }
      this.modelType = 'edit'
      this.modelShow = true
      this.modelTitle = '编辑讲师'
    },
    showModel(event) {
      const that = this
      this.modelType = 'list'
      this.modelTitle = '培训记录'
      this.teacherFifter.id = event.id
      getTraningListById(this.teacherFifter).then(res => {
        if (res.code === 200) {
          console.log(res.data)
          that.trainingList = res.data.list
          that.teacherFifter.total = parseInt(parseInt(res.data.pager.recTotal))
          that.modelShow = true
        } else {
          that.$message({
            type: 'warning',
            message: res.data.msg
          })
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
    banTutors(event) {
      const that = this
      const msg = '确定作废此讲师吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        banTutor(event.id).then(res => {
          console.log(res)
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
    changeStatus(event) {
      const that = this
      let msg = ''
      if (event.status === '1') {
        msg = '确定停用此讲师吗？'
      } else {
        msg = '确定启用此讲师吗？'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeStatusTutor(event.id).then(res => {
          console.log(res)
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
    saveModel() {
      const that = this
      // 保存讲师
      this.$refs['tutorForm'].validate((valid) => {
        if (valid) {
          // console.log(this.tutorForm)
          that.submitting = true
          console.log(that.tutorForm.id)
          if (that.tutorForm.id === undefined) {
            // 新增
            saveTutor(that.tutorForm).then(res => {
              // console.log(res)
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '讲师添加成功！',
                  type: 'success'
                })
                that.resetModel()
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
            // 更新
            updateTutor(that.tutorForm).then(res => {
              console.log(res)
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '讲师更新成功！',
                  type: 'success'
                })
                that.resetModel()
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
          that.submitting = false
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
      // console.log('重置表单')
      if (this.modelType === 'list') {
        this.trainingList = []
        this.teacherFifter = {
          id: '',
          page: 1,
          limit: 5,
          total: 0
        }
      } else {
        this.submitting = false
        this.$refs['tutorForm'].resetFields()
        this.tutorForm = {
          name: '',
          sex: '1',
          content: ''
        }
      }
      this.modelShow = false
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
    teacherSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.teacherFifter.page = 1
      this.teacherFifter.limit = val
      this.trainingList = []
      const that = this
      getTraningListById(this.teacherFifter).then(res => {
        if (res.code === 200) {
          console.log(res.data)
          that.trainingList = res.data.list
          that.teacherFifter.total = parseInt(res.data.pager.recTotal)
        } else {
          that.$message({
            type: 'warning',
            message: res.data.msg
          })
        }
      })
    },
    teacherCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.teacherFifter.page = val
      const that = this
      getTraningListById(this.teacherFifter).then(res => {
        if (res.code === 200) {
          console.log(res.data)
          that.trainingList = res.data.list
          that.teacherFifter.total = parseInt(res.data.pager.recTotal)
        } else {
          that.$message({
            type: 'warning',
            message: res.data.msg
          })
        }
      })
    }
  }
}

</script>
<style lang="less" scoped>
  .tutor_bg {
    // background: #fff;
    position: absolute;
    width: 100%;
    top: 0;
    .tutor_info{
      background: #fff;
      padding: 20px 10px;
    }
    .tutor_page {
      text-align: center;
      padding: 10px 0;
    }
  }
    .dialogModel {
    .modelForm {
      margin: 0 10px;
      .input_tips{
        font-size: 12px;
        color: #AEAEAE;
        font-family: '微软雅黑 Regular', '微软雅黑';
      }
    }
    .training_list{
      text-align: center;
      margin: 30px 15px 50px
    }
    .center{
      margin:0 70px;
    }
  }

</style>
