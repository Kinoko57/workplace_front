<template>
  <div>
    <div class="level_bg">
      <div class="fifter">
        <my-tabs
          :page-name="page_name"
          :module-name="module_name"
          :add="btnPermission('onlinecourseagentlevel_create')"
          :active-name="searchInfo.mode"
          :tabs-list="typeList"
          @addAction="addProxyLabel"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)"/>
      </div>
      <div class="level_info">
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}个等级，已选中{{ choseTotal }}条</span>
            <el-button v-if="btnPermission('onlinecourseagentlevel_batchdown')" plain size="mini" @click="batchstop('stop')">批量停用</el-button>
            <el-button v-if="btnPermission('onlinecourseagentlevel_batchabolish')" plain size="mini" @click="batchstop('remover')">批量作废</el-button>
            <el-button v-if="btnPermission('onlinecourseagentlevel_batchup')" plain size="mini" @click="batchstop('start')">批量启用</el-button>
          </div>
        </div>
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="tableData"
          :max-height="tableHeight"
          border
          row-key="id"
          tooltip-effect="light"
          @sort-change="fifterTable"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" min-width="40" fixed="left" align="center"/>
          <el-table-column label="等级名称" min-width="200" prop="name" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="text_color">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createdDate" label="创建时间" min-width="200"/>
          <el-table-column prop="status" label="状态" width="200">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status==1" type="success">启用</el-tag>
              <el-tag v-if="scope.row.status==2" type="danger">停用</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="tableData.length>0" label="操作" min-width="200" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('onlinecourseagentlevel_edit')" type="text" size="small" @click="editProxyLabel(scope.row)">编辑</el-button>
              <el-button v-if="btnPermission('onlinecourseagentlevel_banned')&&scope.row.status==2" type="text" size="small" @click="changeStates(scope.row,'1')">启用</el-button>
              <el-button v-if="btnPermission('onlinecourseagentlevel_banned')&&scope.row.status==1" type="text" size="small" @click="changeStates(scope.row,'2')">停用</el-button>
              <el-button v-if="btnPermission('onlinecourseagentlevel_cancellation')" type="text" size="small" @click="deleteSelect(scope.row,'99')">作废</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="info_page">
          <el-pagination
            :current-page="searchInfo.pageID"
            :page-sizes="[5, 10, 15,20]"
            :page-size="searchInfo.recPerPage"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            aligin="center"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"/>
        </div>
      </div>

    </div>
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="modelShow" :title="modelTitle" width="550px" class="dialogModel" @close="resetModel">
      <el-scrollbar class="fixed_scroll">
        <!-- 新建等级 -->
        <el-form
          v-if="modelShow"
          ref="levelForm"
          :model="levelForm"
          :rules="rules"
          class="modelForm"
          label-width="100px"
          label-position="right">
          <el-form-item label="等级名称：" prop="name">
            <el-input v-model.trim="levelForm.name" autocomplete="off" style="width:500px" placeholder="请输入等级名称"/>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input :rows="4" v-model.trim="levelForm.remarks" style="width:500px" maxlength="120" type="textarea" placeholder="请输入备注,最大长度为120个字" />
          </el-form-item>
        </el-form>
      </el-scrollbar>

      <div slot="footer" class="dialog-footer">
        <el-button v-show="modelType === 'new'" @click="restForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getonlinecourseagentlevel,
  addonlinecourseagentlevel,
  updateonlinecourseagentlevel,
  changeonlinecourseagentlevel,
  deleteonlinecourseagentlevel,
  levelbatchCancel,
  levelbatchStart,
  levelbatchStop
} from '@/api/online'
export default {
  name: 'LevelManage',
  data() {
    return {
      submitting: false,
      loading: true,
      page_name: 'onlinecourseagentlevel',
      module_name: 'ols',
      typeList: [{ label: '全部等级', name: 'all' }],
      choseTotal: 0,
      tableData: [],
      modelType: '',
      searchInfo: {
        mode: 'all', // 类型
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      total: 0, // 总条数
      levelForm: {
        name: '',
        remarks: ''
      },
      tableHeight: 250,
      rules: {
        name: [{
          required: true,
          message: '等级名称不能为空',
          trigger: 'blur'
        },
        {
          min: 2,
          max: 20,
          message: '等级名称长度在2-20位',
          trigger: 'blur'
        }]
      },
      modelShow: false,
      modelTitle: '',
      selectArr: []
    }
  },
  mounted() {
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
          this.$confirm('确定要批量停用此经销商等级吗', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            levelbatchStop(obj).then(res => {
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
          this.$confirm('确定要批量作废此经销商等级吗', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            levelbatchCancel(obj).then(res => {
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
          this.$confirm('确定要批量启用此经销商等级吗', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            levelbatchStart(obj).then(res => {
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
      this.$refs['levelForm'].resetFields()
      this.levelForm = {}
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
      getonlinecourseagentlevel(that.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          console.log(res)
          that.tableData = res.data.onlinecourseagentlevel
          that.total = res.data.pager.recTotal// 总条数
        }
      })
    },
    addProxyLabel() {
      this.modelShow = true
      this.modelType = 'new'
      this.modelTitle = '创建等级'
    },
    editProxyLabel(event) {
      const data = { ...event }
      this.modelType = 'edit'
      // this.levelForm = data
      this.levelForm = {
        id: data.id,
        name: data.name,
        remarks: data.remarks
      }
      this.modelShow = true
      this.modelTitle = '编辑等级'
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
        msg = '确定启用此经销商等级吗？'
      } else if (states === '2') {
        msg = '确定停用此经销商等级吗？'
      }
      // else {
      //   msg = '确定作废此经销商等级吗？'
      // }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeonlinecourseagentlevel(event.id, states).then(res => {
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
    deleteSelect(event, states) {
      const that = this
      this.$confirm('确定作废此经销商等级吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteonlinecourseagentlevel(event.id, states).then(res => {
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
      // 保存经销商等级
      this.$refs['levelForm'].validate((valid) => {
        if (valid) {
          that.submitting = true
          console.log(this.levelForm)
          console.log(that.levelForm.id)
          if (that.levelForm.id === undefined) {
            // 新增
            addonlinecourseagentlevel(that.levelForm).then(res => {
              console.log(res)
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '经销商等级添加成功！',
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
            updateonlinecourseagentlevel(that.levelForm).then(res => {
              console.log(res)
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '经销商等级更新成功！',
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
      this.$refs['levelForm'].resetFields()
      this.levelForm = {}
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
  .level_bg {
    position: absolute;
    width: 100%;
    top: 0;
    .level_info{
      background: #fff;
      padding: 20px 10px;
    }
    .level_page {
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
