<template>
  <div>
    <div class="type_bg">
      <div class="fifter">
        <my-tabs
          :page-name="page_name"
          :module-name="module_name"
          :add="btnPermission('onlinedmcourse_create')"
          :active-name="searchInfo.mode"
          :tabs-list="typeList"
          @addAction="addProxyLabel"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)"/>
          <!-- <search-fifter :add="btnPermission('onlinedmcourse_create')" :module-name="'onlinedmcourse'" :fifter="true" :add-text="'创建分类'" @search="fifterSearch" @addAction="addProxyLabel"/> -->
      </div>
      <div class="type_info">
        <!-- <el-tabs type="card" class="tabs_table" >
          <el-tab-pane label="全部分类" > -->
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}条数据，已选中{{ choseTotal }}条</span>
            <el-button v-if="btnPermission('onlinedmcourse_cancellations')" plain size="mini" @click="batchstop('remover')">批量作废</el-button>
            <el-button v-if="btnPermission('onlinedmcourse_banneds')" plain size="mini" @click="batchstop('stop')">批量停用</el-button>
            <el-button v-if="btnPermission('onlinedmcourse_bannedsup')" plain size="mini" @click="batchstop('start')">批量启用</el-button>
          </div>
        </div>
        <el-table v-loading="loading" ref="multipleTable" :data="tableData" :max-height="tableHeight" border row-key="id" style="width: 100%" tooltip-effect="light" @sort-change="fifterTable" @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" width="100" /> -->
          <el-table-column type="selection" min-width="40" fixed="left" align="center"/>
          <el-table-column label="分类名称" min-width="150" prop="name">
            <template slot-scope="scope">
              <span class="text_color">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="上级分类" min-width="150" prop="lastname">
            <template slot-scope="scope">
              <span class="text_color">{{ scope.row.lastname }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createdDate" label="创建时间" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="status" label="状态" min-width="160" >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status==1" type="success">启用</el-tag>
              <el-tag v-if="scope.row.status==2" type="danger">停用</el-tag>
              <!-- <el-tag v-show="scope.row.status==99" type="warning">作废</el-tag> -->
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="200" align="center">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('onlinedmcourse_edit')" type="text" size="small" @click="editProxyLabel(scope.row)">编辑</el-button>
              <el-button v-if="btnPermission('onlinedmcourse_banned')&&scope.row.status==2" type="text" size="small" @click="changeStates(scope.row,'1')">启用</el-button>
              <el-button v-if="btnPermission('onlinedmcourse_banned')&&scope.row.status==1" type="text" size="small" @click="changeStates(scope.row,'2')">停用</el-button>
              <el-button v-if="btnPermission('onlinedmcourse_cancellation')" type="text" size="small" @click="deleteStates(scope.row,'99')">作废</el-button>
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
      <!-- 新建分类 -->
      <el-scrollbar class="fixed_scroll">
        <el-form
          v-if="modelShow"
          ref="typeForm"
          :model="typeForm"
          :rules="rules"
          class="modelForm"
          label-width="100px"
          label-position="right">
          <el-form-item label="分类名称：" prop="name">
            <el-input v-model.trim="typeForm.name" autocomplete="off" style="width:500px" placeholder="请输入分类名称"/>
          </el-form-item>
          <el-form-item label="上级分类：" prop="lastleavel">
            <el-select v-model="typeForm.lastleavel" filterable placeholder="请选择上级分类,若不选则默认顶级分类" style="width:500px">
              <el-option v-for="item in optionsList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="课程简介：">
            <el-input :rows="4" v-model.trim="typeForm.remarks" type="textarea" placeholder="请输入课程相关简介" style="width:500px"/>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="modelType=='new'" @click="restForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getonlinecourse,
  addonlinecourse,
  typebatchCancel,
  typebatchStart,
  typebatchStop,
  editonlinecourse,
  onlinecourseupdateStatus,
  onlinecoursedeleteStatus,
  getonline
} from '@/api/excellentAgent'
export default {
  name: 'TypeManage',
  data() {
    return {
      page_name: 'onlinedmcourse',
      module_name: 'olsdm',
      choseTotal: 0,
      typeList: [{ label: '全部分类', name: 'all' }],
      submitting: false,
      loading: true,
      tableData: [],
      modelType: '',
      optionsList: [
      ],
      searchInfo: {
        mode: 'all', // 类型
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      total: 0, // 总条数
      typeForm: {
        name: '',
        lastleavel: '',
        remarks: ''
      },
      tableHeight: 250,
      rules: {
        name: [{
          required: true,
          message: '分类名称不能为空',
          trigger: 'blur'
        }, { min: 2, max: 20, message: '分类名称长度在2-20位之间', trigger: 'blur' }]
      },
      modelShow: false,
      selectArr: [],
      modelTitle: ''
    }
  },
  mounted() {
    this.getList()
    this.getLine()
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
          this.$confirm('确定要批量停用此课程分类吗', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            typebatchStop(obj).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  type: 'success',
                  message: '操作成功'
                })
                that.getList()
                that.selectArr = []
                that.$refs.multipleTable.clearSelection()
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
          this.$confirm('课程分类一旦作废，不可恢复哦，确定要批量“作废”吗', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            typebatchCancel(obj).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  type: 'success',
                  message: '操作成功'
                })
                that.getList()
                that.selectArr = []
                that.$refs.multipleTable.clearSelection()
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
          this.$confirm('确定要批量启用此课程分类吗', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            typebatchStart(obj).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  type: 'success',
                  message: '操作成功'
                })
                that.getList()
                that.selectArr = []
                that.$refs.multipleTable.clearSelection()
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
        this.tableHeight = document.body.offsetHeight - 360
      }
    },
    fuzzyQueryAction(value) {
      // table表格重置高度
      this.tableHeight = document.body.offsetHeight - 360
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
      console.log('重置表单')
      this.$refs['typeForm'].resetFields()
      this.typeForm = {}
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
      getonlinecourse(that.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          // console.log(res)
          that.tableData = res.data.onlinedmcourse
          that.total = res.data.pager.recTotal// 总条数
        }
      })
    },
    getLine() {
      const that = this
      getonline().then(res => {
        // eslint-disable-next-line no-undef
        that.loading = false
        if (res.code === 200) {
          // eslint-disable-next-line no-undef
          that.optionsList = res.data
        }
      })
    },
    addProxyLabel() {
      this.modelType = 'new'
      this.modelShow = true
      this.modelTitle = '新增课程分类'
      this.getLine()
    },
    editProxyLabel(event) {
      const data = { ...event }
      // this.typeForm = data
      this.modelType = 'edit'
      this.typeForm = {
        id: data.id,
        name: data.name,
        lastleavel: data.lastleavel,
        remarks: data.remarks
      }
      this.modelShow = true
      this.modelTitle = '编辑课程分类'
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
    changeStates(event, states) {
      const that = this
      let msg = ''
      if (states === '1') {
        msg = '确定启用此课程分类吗？'
      } else if (states === '2') {
        msg = '确定停用此课程分类吗？'
      }
      // else {
      //   msg = '确定作废此课程分类吗？'
      // }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        onlinecourseupdateStatus(event.id, states).then(res => {
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
    deleteStates(event, states) {
      const that = this
      this.$confirm('确定启用此课程分类吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        onlinecoursedeleteStatus(event.id, states).then(res => {
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
      // 保存经销商分类
      this.$refs['typeForm'].validate((valid) => {
        if (valid) {
          that.submitting = true
          // console.log(this.typeForm)
          // console.log(that.typeForm.id)
          if (that.typeForm.id === undefined) {
            // 新增
            addonlinecourse(that.typeForm).then(res => {
              // console.log(res)
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '课程分类添加成功！',
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
            editonlinecourse(that.typeForm).then(res => {
              console.log(res)
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '课程分类更新成功！',
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
      this.submitting = false
      console.log('重置表单')
      this.$refs['typeForm'].resetFields()
      this.typeForm = {}
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
    }
  }
}

</script>
<style lang="less" scoped>
  .type_bg {
    position: absolute;
    width: 100%;
    top: 0;
    .type_info{
      background: #fff;
      padding: 20px 10px;
    }
    .type_page {
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
    .center{
      margin:0 70px;
    }
  }

</style>
