<template>
  <div class="wechat_bg">
    <div class="fifter">
      <my-tabs
        :active-name="searchInfo.mode"
        :add="btnPermission('service_create')"
        :page-name="page_name"
        :module-name="module_name"
        :tabs-list="typeList"
        :fifter-open="false"
        @addAction="addWechat"
        @handleClick="choseType"
        @searchShow="searchShowAction($event)"
        @fuzzyQuery="fuzzyQueryAction($event)"
        @searchQuery="searchQueryAction($event)"
        @filterQuery="filterQueryAction($event)" />
    </div>
    <div class="wechat_table">
      <div class="info_total">
        <div class="data_total">
          <span class="total_text">共{{ total }}条记录，已选中{{ choseTotal }}条</span>
          <el-button v-if="btnPermission('service_batchcancellation')" plain size="mini" @click="batchstop('remover')">批量作废</el-button>
        </div>
        <div class="export_btn">
          <search-fifter
            :download-url="downloadUrl"
            :upload-url="uploadUrl"
            :import-show="btnPermission('service_import')"
            :export-show="btnPermission('service_export')"
            :export-type="moduleType"
            :export-name="'客服列表'"
            :module-name="'service'"
            @importAction="importAction" />
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
        style="width: 100%"
        @sort-change="fifterTable"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" min-width="40" fixed="left" align="center" />
        <el-table-column prop="code" label="工号" min-width="240" show-overflow-tooltip/>
        <el-table-column prop="phone" label="手机号" min-width="200" show-overflow-tooltip/>
        <el-table-column prop="wechat" label="微信号" min-width="180" show-overflow-tooltip/>
        <el-table-column prop="createdDate" label="创建时间" min-width="200" show-overflow-tooltip/>
        <el-table-column prop="status" label="状态" min-width="200">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status==1" type="success">正常</el-tag>
            <el-tag v-if="scope.row.status==2" type="danger">封禁</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="total>0" label="操作" width="150" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="btnPermission('service_edit')" type="text" size="small" @click="editWechat(scope.row)">编辑</el-button>
            <el-button v-if="btnPermission('service_banned')&&scope.row.status==1" type="text" size="small" @click="banWechat(scope.row)">封禁</el-button>
            <el-button v-if="btnPermission('service_banned')&&scope.row.status==2" type="text" size="small" @click="banWechat(scope.row)">启用</el-button>
            <el-button v-if="btnPermission('service_cancellation')" type="text" size="small" @click="deleteWechat(scope.row)">作废</el-button>
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
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="modelShow" :title="modelTitle" width="560px" class="dialogModel" @close="resetModel">
      <!-- 新建/编辑客服号 -->
      <el-scrollbar class="fixed_scroll">
        <el-form
          v-if="modelShow"
          ref="weChatForm"
          :model="weChatForm"
          :rules="rules"
          class="modelForm"
          label-width="100px"
          label-position="right">
          <el-form-item label="工号：" prop="code">
            <el-input v-model.trim="weChatForm.code" autocomplete="off" style="width:500px" placeholder="请输入工号" />
          </el-form-item>
          <el-form-item label="手机号：" prop="phone">
            <el-input v-model.trim="weChatForm.phone" autocomplete="off" style="width:500px" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="微信号：" prop="wechat">
            <el-input v-model.trim="weChatForm.wechat" autocomplete="off" style="width:500px" placeholder="请输入微信号" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="modelTitle!='编辑客服号'" @click="restForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">{{ sureBtn }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getWechatInfo, saveWechat, updateWechat, wechatStates, deletelWxchatCode, wecatbatchCancel
} from '@/api/agent'

export default {
  name: 'WechatManage',
  data() {
    return {
      submitting: false,
      page_name: 'service',
      module_name: 'agent',
      choseTotal: 0,
      downloadUrl: '',
      uploadUrl: '',
      moduleType: '/agent/service-export',
      activeName2: 'first',
      tableData: [],
      loading: true,
      typeList: [
        { label: '全部客服号', name: 'all' },
        { label: '正常', name: 'normal' },
        { label: '封禁', name: 'ban' }
      ],
      searchInfo: {
        mode: 'all', // 类型 全部 all 正常 normal 封禁 ban
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      tableHeight: 250,
      total: 0, // 总条数
      weChatForm: {
        id: '',
        code: '',
        wechat: '',
        phone: ''
      },
      rules: {
        code: [{
          required: true,
          message: '工号不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^([-_a-zA-Z0-9]{2,8})$/,
          message: '工号包含下划线，字母和数字,长度在2到8个字符',
          trigger: 'blur'
        }],
        wechat: [{
          required: true,
          message: '微信号不能为空',
          trigger: 'blur'
        }],
        phone: [{
          required: true,
          message: '手机号不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^[1][0-9]{10}$/,
          message: '手机号格式错误',
          trigger: 'blur'
        }]
      },
      selectArr: [],
      modelShow: false,
      modelTitle: '',
      sureBtn: '保 存'
    }
  },
  mounted() {
    // 页面第一个渲染的函数
    this.uploadUrl = process.env.BASE_API + 'agent/service-import.json'
    this.downloadUrl = process.env.BASE_API + 'data/download/客服列表模板.xls'
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
        this.$confirm('客服手机一旦作废，不可以恢复哦,确定要批量“作废”吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          wecatbatchCancel(obj).then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                type: 'success',
                message: res.data.message
              })
              that.getList()
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
      this.$refs['weChatForm'].resetFields()
      this.weChatForm = {
        id: '',
        code: '',
        wechat: '',
        phone: ''
      }
    },
    importAction() {
      if (event) {
        console.log(event)
        this.getList()
      }
    },
    getList() {
      const that = this
      getWechatInfo(that.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          that.tableData = res.data.services
          that.total = res.data.pager.recTotal
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
    // 添加客服号
    addWechat() {
      this.modelShow = true
      this.modelTitle = '创建客服号'
    },
    editWechat(event) {
      this.modelShow = true
      this.modelTitle = '编辑客服号'
      this.weChatForm = {
        id: event.id,
        code: event.code,
        wechat: event.wechat,
        phone: event.phone
      }
    },
    // 作废客服号
    deleteWechat(event) {
      console.log(event.id)
      const that = this
      const msg = '客服号一旦作废不可恢复，确定要“作废”吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletelWxchatCode(event.id).then(res => {
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
              message: res.data.msg
            })
          }
        })
      }).catch(() => {
        console.log('用户点击了取消')
      })
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
    saveModel() {
      const that = this
      this.$refs['weChatForm'].validate((valid) => {
        if (valid) {
          console.log(this.weChatForm)
          that.submitting = true
          if (this.weChatForm.id !== '') {
            updateWechat(this.weChatForm).then(res => {
              console.log(res)
              that.submitting = false
              if (res.code === 200) {
                that.$message({
                  message: '客服号更新成功！',
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
            saveWechat(this.weChatForm).then(res => {
              console.log(res)
              that.submitting = false
              if (res.code === 200) {
                that.$message({
                  message: '客服号添加成功！',
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
      console.log(this.weChatForm)
    },
    resetModel() {
      this.$refs['weChatForm'].resetFields()
      this.weChatForm = {
        id: '',
        code: '',
        wechat: '',
        phone: ''
      }
      this.modelShow = false
    },
    banWechat(event) {
      const that = this
      // 操作
      var msg = ''
      if (event.status == '2') {
        msg = '确定要启用客服手机号吗'
      } else {
        msg = '确定要封禁客服手机号吗'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        wechatStates(event.id).then(res => {
          console.log(res)
          if (res.code === 200) {
            that.$message({
              message: '状态更新成功',
              type: 'success'
            })
            that.getList()
          }
        })
      }).catch(() => {
        console.log('用户点击了取消')
      })
    },
    choseType(value) {
      this.$nextTick(() => {
        this.searchInfo.mode = value
        this.searchInfo.pageID = 1
        this.searchInfo.orderBy = ''
        if ((this.$refs.table) !== undefined) {
          this.resetTable()
        }
        this.tableData = []
        this.loading = true
        this.getList()
      })
    },
    resetTable() {
      for (let i = 0; i < (this.$refs.table).length; i++) {
        (this.$refs.table)[i].clearSort()
      }
    },
    handleSizeChange(val) {
      this.searchInfo.pageID = 1
      this.searchInfo.recPerPage = val
      this.tableData = []
      this.loading = true
      this.getList()
    },
    handleCurrentChange(val) {
      this.searchInfo.pageID = val
      this.tableData = []
      this.loading = true
      this.getList()
    }
  }
}

</script>
<style lang="less" scoped>
  .wechat_bg {
    position: absolute;
    width: 100%;
    top: 0;
    .wechat_table{
      background: #fff;
      padding: 20px 10px;
    }
    .wechat_btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .dialogModel {

      .conversionHistory {
        .his_list {
          list-style: none;
        }
      }
    }
  }

</style>
