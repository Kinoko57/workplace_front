<template>
  <div>
    <div class="level_bg">
      <div class="fifter">
        <search-fifter :add="btnPermission('gthlevel_create')" :module-name="'gthlevel'" :fifter="true" :add-text="'创建等级'" @search="fifterSearch" @addAction="addProxyLabel"/>
      </div>
      <div class="level_info">
        <el-tabs type="card" class="tabs_table" >
          <el-tab-pane label="全部等级" >
            <el-table v-loading="loading" :data="tableData" style="width: 100%" tooltip-effect="light" @sort-change="fifterTable">
              <!-- <el-table-column type="selection" width="50" align="center"/> -->
              <el-table-column width="20" />
              <el-table-column label="等级名称" width="100" sortable="custom" min-width="200" prop="name">
                <template slot-scope="scope">
                  <span class="text_color">{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="createdDate" label="创建时间" sortable="custom" min-width="140"/>
              <el-table-column prop="status" label="状态" sortable="custom" width="200">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.status==1" type="success">启用</el-tag>
                  <el-tag v-if="scope.row.status==2" type="danger">停用</el-tag>
                  <!-- <el-tag v-show="scope.row.status==99" type="warning">作废</el-tag> -->
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" min-width="200">
                <template slot-scope="scope">
                  <el-button v-if="btnPermission('gthlevel_edit')" type="text" size="small" @click="editProxyLabel(scope.row)">编辑</el-button>
                  <el-button v-if="btnPermission('gthlevel_banned')&&scope.row.status==2" type="text" size="small" @click="changeStates(scope.row,'1')">启用</el-button>
                  <el-button v-if="btnPermission('gthlevel_banned')&&scope.row.status==1" type="text" size="small" @click="changeStates(scope.row,'2')">停用</el-button>
                  <el-button v-if="btnPermission('gthlevel_cancellation')" type="text" size="small" @click="changeStates2(scope.row)">作废</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
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
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="modelShow" :title="modelTitle" width="550px" class="dialogModel" @close="resetModel">
      <!-- 新建等级 -->
      <el-form
        v-if="modelShow"
        ref="levelForm"
        :model="levelForm"
        :rules="rules"
        class="modelForm"
        label-width="120px"
        label-position="right">
        <el-form-item label="等级名称：" prop="name">
          <el-input v-model="levelForm.name" autocomplete="off" style="width:300px" placeholder="请输入等级名称"/>
        </el-form-item>
        <el-form-item label="备注：" prop="remarks">
          <el-input :rows="4" v-model="levelForm.remarks" maxlength="120" type="textarea" placeholder="请输入备注,最大长度为120个字" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="submitting" type="primary" @click="saveModel">保 存</el-button>
        <el-button v-show="modelTitle!='编辑等级'" @click="resetModel">重 置</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
// getonlinecourseagentlevel,
// addonlinecourseagentlevel,
// updateonlinecourseagentlevel,
// changeonlinecourseagentlevel
} from '@/api/online'
import {
  getgthcourseagentlevel,
  addgthcourseagentlevel,
  updategthcourseagentlevel,
  changegthcourseagentlevel,
  gthcourseagentlevel
} from '@/api/guangtonghui'
export default {
  name: 'LevelManage',
  data() {
    return {
      submitting: false,
      loading: true,
      tableData: [],
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
      rules: {
        name: [{
          required: true,
          message: '等级名称不能为空',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 10,
          message: '等级名称长度在3-10位',
          trigger: 'blur'
        }],
        remarks: [{
          min: 0,
          max: 120,
          message: '等级名称长度在0-120位',
          trigger: 'blur'
        }]
      },
      modelShow: false,
      modelTitle: ''
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
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
      getgthcourseagentlevel(that.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          console.log(res)
          that.tableData = res.data.gthlevel
          that.total = res.data.pager.recTotal// 总条数
        }
      })
    },
    addProxyLabel() {
      this.modelShow = true
      this.modelTitle = '创建等级'
    },
    editProxyLabel(event) {
      const data = { ...event }
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
      console.log(event)
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
      // debugger
      console.log(event)
      const that = this
      let msg = ''
      if (states === '1') {
        msg = '确定启用此经销商等级吗？'
      } else {
        msg = '确定停用此经销商等级吗？'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changegthcourseagentlevel(event.id, states).then(res => {
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
              message: res.msg
            })
          }
        })
      }).catch(() => {
        console.log('用户点击了取消')
      })
    },
    changeStates2(event) {
      const that = this
      const msg = '确定废弃此经销商等级吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        gthcourseagentlevel(event.id).then(res => {
          console.log(res)
          if (res.code === 200 || res.code === '200') {
            that.$message({
              type: 'success',
              message: res.data.message
            })
            this.modelShow = false
            that.getList()
          } else {
            that.$message({
              type: 'warning',
              message: res.data.message
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
            addgthcourseagentlevel(that.levelForm).then(res => {
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
            updategthcourseagentlevel(that.levelForm).then(res => {
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
    background: #fff;
    padding: 0 10px;
    .level_info{
      .text_color{
        color: #409EFF;
      }
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
