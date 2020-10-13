<template>
  <div>
    <div class="proxy_bg">
      <!-- <search-fifter :add="btnPermission('agentproxy_create')" :module-name="'agentproxy'" :add-text="'创建标签'" @search="fifterSearch" @addAction="addProxyLabel"/> -->
      <div class="proxy_fifter">
        <my-tabs
          :active-name="'all'"
          :page-name="page_name"
          :module-name="module_name"
          :tabs-list="tabsList"
          :allow-fifter="false"
          :add="btnPermission('agentproxy_create')"
          @addAction="addProxyLabel"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)" />
      </div>
      <div class="proxy_info">
        <div class="proxy_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}个标签，已选中{{ choseTotal }}条</span>
            <!-- <el-button plain size="mini" @click="batchstop('banned')">批量停用</el-button> -->
            <el-button v-if="btnPermission('agentproxy_batchbanned')" plain size="mini" @click="batchstop('remove')">批量作废</el-button>
          </div>
        </div>
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="tableData"
          :max-height="tableHeight"
          highlight-current-row
          border
          row-key="id"
          tooltip-effect="light"
          @sort-change="fifterTable"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" min-width="40" fixed="left" align="center"/>
          <el-table-column prop="name" label="名称" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <label-color :color="scope.row.ico" :text="scope.row.name"/>
            </template>
          </el-table-column>
          <el-table-column prop="createdDate" label="创建时间" show-overflow-tooltip min-width="150"/>
          <el-table-column prop="editedDate" label="更新时间" show-overflow-tooltip min-width="150"/>
          <el-table-column label="操作" width="200" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('agentproxy_edit')" type="text" size="small" @click="editProxyLabel(scope.row)">编辑</el-button>
              <el-button v-if="btnPermission('agentproxy_banned')" type="text" size="small" @click="changeStates(scope.row,'99')">作废</el-button>
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
    <el-dialog
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :visible.sync="modelShow"
      :title="modelTitle"
      class="dialogModel"
      @close="resetModel">
      <!-- 新建标签 -->
      <el-scrollbar class="fixed_scroll">
        <el-form
          v-if="modelShow"
          ref="proxyForm"
          :model="proxyForm"
          :rules="rules"
          class="modelForm center"
          label-width="120px"
          label-position="right">
          <el-form-item label="标签名称：" prop="name">
            <el-input v-model.trim="proxyForm.name" autocomplete="off" style="width:500px" placeholder="请输入标签名称" maxlength="8" />
          </el-form-item>
          <el-form-item label="标签主题色：" prop="ico">
            <div style="display:flex">
              <el-color-picker v-model="proxyForm.ico" />
              <span style="margin-left: 10px;">预览标签：</span>
              <label-color v-if="proxyForm.name!=''" :color="proxyForm.ico" :text="proxyForm.name" />
            </div>
          </el-form-item>
          <el-form-item label="备注：" prop="remarks">
            <el-input :rows="4" v-model="proxyForm.remarks" type="textarea" placeholder="请输入备注，最大长度为120个字" style="width:500px"/>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="modelTitle!='编辑经销商标签'" @click="restForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getProxyLabel, addProxyLabel, updateProxyLabel, changeProxyLabel, proxybatchCancel, supplierBatchCancel
} from '@/api/agent'
export default {
  name: 'ProxyLabel',
  data() {
    return {
      loading: false,
      page_name: 'agentproxy',
      module_name: 'agent',
      tabsList: [{
        label: '全部标签',
        name: 'all'
      }],
      tableData: [],
      searchInfo: {
        mode: 'all', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      total: 0, // 总条数
      proxyForm: {
        name: '',
        ico: '',
        remarks: ''
      },
      tableHeight: 250,
      rules: {
        name: [{
          required: true,
          message: '标签名称不能为空',
          trigger: 'blur'
        }, {
          max: 4,
          min: 2,
          message: '标签名称长度在2-4位之间',
          trigger: 'blur'
        }],
        ico: [{
          required: true,
          message: '标签主题色不能为空',
          trigger: 'blur'
        }, { min: 1, message: '标签主题色不能为空', trigger: 'change' }
        ],
        remarks: [
          { required: true, message: '标签主题不能为空', trigger: 'blur' },
          { min: 1, max: 120, message: '标签备注的长度超出范围1-120位之间', trigger: 'blur' }
        ]
      },
      choseTotal: 0,
      modelShow: false,
      modelTitle: '',
      selectArr: [],
      submitting: false
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
    batchstop() {
      const that = this
      console.log('askldjslkdf')
      if (that.selectArr.length > 0) {
        const obj = {
          ids: this.selectArr.join(',')
        }
        this.$confirm('经销商标签一旦作废，不可以恢复哦,确定要批量“作废”吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          proxybatchCancel(obj).then(res => {
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
      this.$refs['proxyForm'].resetFields()
      this.proxyForm = {
        name: '',
        ico: '',
        remarks: ''
      }
    },
    getList() {
      const that = this
      getProxyLabel(that.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          console.log(res)
          that.tableData = res.data.agentproxy
          that.total = res.data.pager.recTotal// 总条数
        }
      })
    },
    addProxyLabel() {
      this.modelShow = true
      this.modelTitle = '新增经销商标签'
    },
    editProxyLabel(event) {
      const data = { ...event }
      // this.proxyForm = data
      this.proxyForm = {
        id: data.id,
        name: data.name,
        ico: data.ico,
        remarks: data.remarks
      }
      this.modelShow = true
      this.modelTitle = '编辑经销商标签'
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
    changeStates(event, states) {
      const that = this
      let msg = ''
      if (states === '1') {
        msg = '确定启用此经销商标签吗？'
      } else if (states === '2') {
        msg = '确定停用此经销商标签吗？'
      } else {
        msg = '确定作废此经销商标签吗？'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeProxyLabel(event.id, states).then(res => {
          console.log(res)
          if (res.code === 200 || res.code === '200') {
            that.$message({
              type: 'success',
              message: res.msg
            })
            this.modelShow = false
            that.getList()
          } else {
            console.log(111)
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
      // 保存经销商标签
      this.$refs['proxyForm'].validate((valid) => {
        if (valid) {
          console.log(this.proxyForm)
          console.log(that.proxyForm.id)
          that.submitting = true
          if (that.proxyForm.id === undefined) {
            // 新增
            addProxyLabel(that.proxyForm).then(res => {
              that.submitting = false
              console.log(res)
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '经销商标签添加成功！',
                  type: 'success'
                })
                that.resetModel()
                that.getList()
              } else {
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
          } else {
            // 更新
            updateProxyLabel(that.proxyForm).then(res => {
              console.log(res)
              that.submitting = false
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '经销商标签更新成功！',
                  type: 'success'
                })
                that.resetModel()
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
    resetModel() {
      console.log('重置表单')
      this.$refs['proxyForm'].resetFields()
      this.proxyForm = {}
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
  .proxy_bg {
    position: absolute;
    width: 100%;
    top: 0;
    .proxy_info{
      background: #fff;
      padding: 20px 10px;
       .proxy_total{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding-bottom: 10px;
        span{
          font-size: 13px;
          color: #333333;
          margin-right: 6px;
        }
      }
      .proxy_page {
       text-align: right;
        padding: 10px;
    }
      .text_color{
        color: #409EFF;
      }
    }
    .proxy_page {
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
