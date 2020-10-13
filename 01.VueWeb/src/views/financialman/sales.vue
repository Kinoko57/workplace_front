<template>
  <div>
    <div class="sales_bg">
      <div class="fifter">
        <change-fifter
          ref="change"
          :fifter-show="fifterShow"
          :delay-fifter="loading==false"
          :download-url="downloadUrl"
          :module-name="'turnover'"
          :upload-url="uploadUrl"
          :fifter="true"
          :import-show="btnPermission('turnover_import')"
          :export-show="btnPermission('turnover_export')"
          :export-type="moduleType"
          :export-name="'营业额列表'"
          @search="fifterSearch"
          @importAction="importAction"/>
      </div>
      <div class="sales_table">
        <el-tabs v-model="searchInfo.mode" type="card" class="tabs_table" @tab-click="choseType">
          <el-tab-pane label="详细流水" name="all">
            <el-table v-loading="loading" ref="table" :data="tableData" :max-height="tableHeight" style="width: 100%" tooltip-effect="light" @sort-change="fifterTable">
              <el-table-column width="20"/>
              <!-- <el-table-column type="selection" width="50"/> -->
              <el-table-column prop="date" label="日期" sortable="custom" show-overflow-tooltip min-width="150"/>
              <el-table-column prop="order" label="订单号" show-overflow-tooltip min-width="150"/>
              <el-table-column prop="amount" label="订单金额" show-overflow-tooltip min-width="150" sortable="custom">
                <template slot-scope="scope">
                  <span class="text_color">{{ scope.row.amount }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="detail" label="订单详细" show-overflow-tooltip min-width="200"/>
              <el-table-column label="操作" align="center" width="120">
                <template slot-scope="scope">
                  <el-button v-if="btnPermission('turnover_edit')" type="text" size="small" @click="editsales(scope.row)">编辑</el-button>
                  <el-button v-if="btnPermission('turnover_cancel')" type="text" size="small" @click="deletesales(scope.row,'99')">作废</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="日统计" name="day">
            <el-table v-loading="loading" ref="table1" :data="tableData" :max-height="tableHeight" style="width: 100%" tooltip-effect="light" @sort-change="fifterTable">
              <el-table-column type="selection" width="50"/>
              <el-table-column prop="date" label="日期" min-width="200" sortable="custom"/>
              <el-table-column prop="num" label="订单数" min-width="200" sortable="custom"/>
              <el-table-column prop="sum" label="订单金额" show-overflow-tooltip min-width="200" sortable="custom"/>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="月统计" name="month">
            <el-table v-loading="loading" ref="table2" :data="tableData" :max-height="tableHeight" style="width: 100%" tooltip-effect="light" @sort-change="fifterTable">
              <el-table-column type="selection" width="50"/>
              <el-table-column prop="date" label="日期" min-width="200" sortable="custom"/>
              <el-table-column prop="num" label="订单数" min-width="200" sortable="custom"/>
              <el-table-column prop="sum" label="订单金额" show-overflow-tooltip min-width="200" sortable="custom"/>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
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
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :title="modelTitle" :visible.sync="modelShow" class="dialog" width="600px" @close="resetmodel">
      <el-form v-if="modelShow" ref="salesForm" :label-position="labelPosition" :rules="rules" :model="salesForm" label-width="120px" class="sales_form center">
        <el-form-item label="订单号：" prop="order">
          <el-input v-model="salesForm.order" placeholder="请输入订单号"/>
        </el-form-item>
        <el-form-item label="订单金额：" prop="amount" class="amount">
          <template >
            <el-row>
              <el-col :span="2">
                <span class="moneyIcon">￥</span>
              </el-col>
              <el-col :span="22">
                <el-input v-model="salesForm.amount" class="iptnum" placeholder="请输入订单金额" style="width:100%" type="Number" @blur="iptNum" />
            </el-col></el-row>
          </template>
        </el-form-item>
        <el-form-item label="订单详细：" prop="detail">
          <el-input v-model="salesForm.detail" placeholder="请填写订单详情"/>
        </el-form-item>
        <el-form-item label="日期：" prop="date">
          <el-date-picker v-model="salesForm.date" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="submitting" type="primary" @click="savemodel">保存</el-button>
        <!-- <el-button @click="resetmodel">取消</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getSalesInfo, editSales, changeSales } from '@/api/agreement'
import changeFifter from '@/components/changeFifter/index'
export default {
  name: 'Sales',
  components: {
    changeFifter
  },
  data() {
    const checkNum = (rule, value, callback) => {
      // console.log(value)
      if (!value) {
        return new Error('请输入订单金额')
      } else {
        if (value < 0) {
          callback(new Error('输入的订单金额不能为负数'))
        } else {
          callback()
        }
      }
    }
    return {
      choseTypeShow: false,
      fifterShow: false,
      uploadUrl: '',
      downloadUrl: '',
      moduleType: '/fi/turnover-export',
      loading: false,
      activeName2: 'first',
      modelShow: false,
      modelTitle: '',
      sureBtn: '保 存',
      submitting: false,
      labelPosition: 'right',
      tableData: [
        {
          createdDate: '',
          order: '',
          amount: '',
          detail: '',
          data: '',
          sum: '',
          num: ''
        }
      ],
      typeList: [
        { text: '详细流水', name: 'all' },
        { text: '日统计', name: 'day' },
        { text: '月统计', name: 'month' }
      ],
      searchInfo: {
        mode: 'all', // 类型
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      tableHeight: 250,
      total: 0, // 总条数
      salesForm: {
        createdDate: '',
        order: '',
        amount: '',
        detail: ''

      },
      rules: {
        order: [{
          required: true,
          message: '订单号不能为空',
          trigger: 'blur'
        }, {
          pattern: /^[a-zA-Z0-9_]{2,25}$/,
          message: '订单号为数字、字符、_',
          trigger: 'blur' }],
        amount: [
          { required: true, message: '订单金额号不能为空', trigger: 'change' },
          {
            validator: checkNum, trigger: 'blur' }
          // { validator: amount, trigger: 'blur' }
        ],
        detail: [{
          required: true,
          message: '订单详情不能为空',
          trigger: 'blur'
        }],
        createdDate: [{
          required: true,
          message: '日期不能为空',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  mounted() {
    this.uploadUrl = process.env.BASE_API + 'fi/turnover-import.json'
    this.downloadUrl = process.env.BASE_API + 'data/download/营业额模板.xls'
    // 页面第一个渲染的函数
    this.getList()
  },
  methods: {
    fifterTable(event) {
      console.log(event.prop)
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
    iptNum(e) {
      if (parseInt(e.target.value) < 0) {
        this.salesForm.amount = e.target.value
      } else {
        this.salesForm.amount = parseFloat(e.target.value).toFixed(2)
      }
    },
    getList() {
      const that = this
      getSalesInfo(that.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          if (that.choseTypeShow) {
            if (that.$refs.change.innerShow) {
              that.fifterShow = true
              that.$refs.change.tabFifter()
              that.choseTypeShow = false
            }
          }
          that.tableData = res.data.turnovers
          that.total = res.data.pager.recTotal// 总条数
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
    importAction() {
      if (event) {
        this.getList()
      }
    },
    addsales() {
      this.modelShow = true
      this.modelTitle = '创建营业额'
    },
    savemodel() {
      const that = this
      // 保存合同协议
      this.$refs['salesForm'].validate((valid) => {
        if (valid) {
          that.submitting = true
          editSales(that.salesForm).then(res => {
            console.log(res)
            if (res.code === 200 || res.code === '200') {
              that.$message({
                message: '营业额更新成功！',
                type: 'success'
              })
              that.resetmodel()
              that.loading = true
              that.getList()
            }
          })
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
      this.$forceUpdate()
    },
    resetmodel() {
      console.log('重置表单')
      this.$refs['salesForm'].resetFields()
      this.submitting = false
      this.salesForm = {
        name: '',
        money: '',
        detail: '',
        date: ''
      }
      this.modelShow = false
    },
    editsales(event) {
      this.modelShow = true
      this.modelTitle = '编辑营业额信息'
      this.salesForm = { ...event }
      this.salesForm.amount = this.salesForm.amount.split('￥')[1]
      editSales(event).then(res => {
        this.loading = false
        if (res.code === 200) {
          console.log(res)
        }
      })
    },
    deletesales(event, status) {
      const that = this
      let msg = ''
      if (status !== '1' && status !== '2') {
        msg = '确定作废此首咖营业额？'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeSales(event.id, status).then(res => {
          console.log(res)
          if (res.code === 200 || res.code === '200') {
            that.$message({
              type: 'success',
              message: res.data.message
            })
            this.modelShow = false
            that.loading = true
            that.getList()
          } else {
            that.$message({
              type: 'warning',
              message: res.data.message
            })
          }
        })
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
    choseType() {
      // const that = this
      this.searchInfo.pageID = 1
      this.tableData = []
      this.searchInfo.orderBy = ''
      if ((this.$refs.table) !== undefined || (this.$refs.table1) !== undefined || (this.$refs.table1) !== undefined) {
        this.resetTable()
      }
      this.searchInfo.search = ''
      // if (that.$refs.change.innerShow) {
      //   that.fifterShow = true
      //   that.$refs.change.tabFifter()
      // }
      this.loading = true
      this.getList()
      this.choseTypeShow = true
    },
    resetTable() {
      const arr = [this.$refs.table, this.$refs.table1, this.$refs.table2]
      for (let i = 0; i < arr.length; i++) {
        arr[i].clearSort()
      }
    }
  }
}

</script>
<style lang="less" scoped>
  .sales_bg {
    background: #fff;
    padding: 10px 10px;
    .amount{
      clear:both;
      // .moneyfu{
      //   float:left;
      // }
      // .iptnum{
      //   float:right

      // }
    }
    .sales_btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sales_page {
      text-align: center;
      padding: 10px 0;
    }
  }
.dialog{
    // .el-dialog__body{
    //     padding-bottom:10px;
    // }
    .dialog-footer{
        margin-top:-25px;
        margin-right: 30px;
    }
   .sales_form{
       margin: 0 10px;
      //   .input_tips{
      //   font-size: 12px;
      //   color: #AEAEAE;
      //   font-family: '微软雅黑 Regular', '微软雅黑';
      // }
    }
    .moneyIcon{
      width: 100%;
      display:inline-block;
      text-align: center;
    }
    .center{
       margin:0 70px;
    }
}
</style>
