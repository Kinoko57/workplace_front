<template>
  <div>
    <div v-if="isShow" class="sales_bg">
      <div class="fifter">
        <my-tabs
          :page-name="page_name"
          :module-name="module_name"
          :active-name="searchInfo.mode"
          :supp-text="'录入'"
          :supplement="btnPermission('payment_create')"
          :tabs-list="typeList"
          :fifter-open = "false"
          @supplementAction="addpay"
          @handleClick="choseType"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)"/>
          <!-- <search-fifter :add="btnPermission('payment_create')" :module-name="'payment'" :fifter="true" :add-text="'创建款项'" @search="fifterSearch" @addAction="addpay" /> -->
      </div>
      <div class="proxy_info">
        <!-- <el-tabs v-model="searchInfo.mode" type="card" class="tabs_table" @tab-click="choseType">
          <el-tab-pane v-loading="loading" v-for="(item,index) in typeList" :key="index" :label="item.text" :name="item.name"> -->
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}条内容，已选中{{ choseTotal }}条</span>
            <el-button v-if="btnPermission('payment_cancellations')" plain size="mini" @click="batchstop('remover')">批量作废</el-button>
          </div>
        </div>
        <el-table v-loading="loading" ref="table" :data="tableData" :max-height="tableHeight" border row-key="id" style="width: 100%" tooltip-effect="light" @selection-change="handleSelectionChange" @sort-change="fifterTable">
          <!-- <el-table-column type="selection" width="50" /> -->
          <el-table-column type="selection" min-width="40" fixed="left" align="center"/>
          <el-table-column prop="createdDate" label="日期" sortable="custom" show-overflow-tooltip min-width="150"/>
          <el-table-column label="款项类型" prop="type" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.type==1" >保证金</span>
              <span v-if="scope.row.type==2">报销出款</span>
              <span v-if="scope.row.type==3">采购出款</span>
              <span v-if="scope.row.type==4">货款</span>
            </template>
          </el-table-column>
          <el-table-column label="关联单号" prop="protocolNo" min-width="100" show-overflow-tooltip />
          <el-table-column label="金额" sortable="custom" min-width="100" show-overflow-tooltip prop="amount">
            <template slot-scope="scope">
              <span v-if="scope.row.amountType=='+'" class="text_color" style="color:#67c23a"><i style="font-style:normal;font-size:16px;font-weight: bold;">{{ scope.row.amountType }}</i> {{ scope.row.amount }}</span>
              <span v-if="scope.row.amountType=='-'" class="text_color" style="color:#F56C6C"><i style="font-style:normal;font-size:16px;font-weight: bold;">{{ scope.row.amountType }}</i> {{ scope.row.amount }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结款方式" prop="balance" min-width="100"/>
          <el-table-column label="交易凭证" class="voucher" min-width="100" style="width: 100px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
            <template slot-scope="scope">
              <div v-for="(item,index) of scope.row.voucher" v-show="scope.row.voucher!=''" :key="index" class="fileStyle" >
                <a :href="fileUrl + item.url" :title="item.name" download="" class="file" target="_blank">{{ item.name }}</a>
              </div>
              <div v-show="scope.row.voucher==''"/>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" min-width="200" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" min-width="150">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status==2" type="success">已关联</el-tag>
              <el-tag v-if="scope.row.status==1" type="danger">未关联</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="tableData.length>0" label="操作" width="300" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('payment_view')" type="text" size="small" @click="findInfo(scope.row)">查看</el-button>
              <el-button v-if="(scope.row.status==2?true:false)&&btnPermission('payment_relevance')" type="text" size="small" class="related1" @click="showlink(scope.row,'change')">变更关联</el-button>
              <el-button v-if="(scope.row.status==2?true:false)&&btnPermission('payment_delrelevance')" type="text" size="small" class="related1" @click="removelink(scope.row,'change')">取消关联</el-button>
              <el-button v-if="(scope.row.status==1?true:false)&&btnPermission('payment_relevance')" type="text" size="small" @click="showlink(scope.row,'firstlink')">关联</el-button>
              <el-button v-if="btnPermission('payment_edit')" type="text" size="small" @click="editpayment(scope.row)">编辑</el-button>
              <el-button v-if="btnPermission('payment_cancellation')" type="text" size="small" @click="changepayment(scope.row,'99')">作废</el-button>
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
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :title="modelTitle" :visible.sync="onShow" width="600px" class="dialog agreementS" @close="resetmodel" >
      <el-scrollbar class="fixed_scroll over_scroll">
        <el-form v-if="onShow" ref="ruleForm" :label-position="labelPosition" :rules="ruleFormrules" :model="ruleForm" label-width="100px" class="center payment_form modelForm">
          <el-form-item class="itemFrom" label="类型：" prop="type">
            <el-radio :disabled="showTtpe != 'new'" v-model="ruleForm.type" label="1" @change="radioType">保证金入款</el-radio>
            <el-radio :disabled="showTtpe != 'new'" v-model="ruleForm.type" label="4" @change="radioType">货款入款</el-radio>
            <el-radio :disabled="showTtpe != 'new'" v-model="ruleForm.type" label="2" @change="radioType">报销出款</el-radio>
            <el-radio :disabled="showTtpe != 'new'" v-model="ruleForm.type" label="3" @change="radioType">采购出款</el-radio>
          </el-form-item>
          <el-form-item class="itemFrom" label="单据：">
            <el-select
              :disabled="showTtpe == 'edit'"
              :remote-method="getSelectList"
              :loading="selectLoading"
              v-model="ruleForm.protocolNo"
              remote
              reserve-keyword
              filterable
              placeholder="请选择授权号或者单据号"
              size="mini"
              style="width:500px">
              <el-option v-for="item in radioSelecList" :key="item.label" :label="item.value" :value="item.value"/>
            </el-select>
            <!-- <el-select
              v-model="listForm.agentId"
              :disabled="modelType=='edit'"
              :remote-method="getSelectList"
              :loading="selectLoading"
              placeholder="请选择经销商姓名"
              style="width:500px"
              filterable
              remote
              clearable
              reserve-keyword
              @change="choseBussiness">
              <el-option v-for="item in selectList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select> -->
          </el-form-item>
          <el-form-item class="itemFrom" label="结款方式：" prop="balance" >
            <el-select v-model="ruleForm.balance" filterable placeholder="请选择结款方式" size="mini" style="width:500px">
              <el-option v-for="item in balance" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item >
          <el-form-item class="itemFrom" label="金额：" prop="amount" >
            <template slot-scope="scope">
              <template >
                <el-input v-model.trim="ruleForm.amount" placeholder="请输入金额" style="width:500px" min="0" type="number" @blur="iptNum">
                  <i slot="suffix" class="el-input__icon" style="font-style:normal">￥</i>
                </el-input>
              </template>
            </template>
          </el-form-item>
          <el-form-item class="itemFrom" label="交易凭证：" prop="voucher">
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
          <el-form-item class="itemFrom" label="备注：" prop="remark">
            <el-input :rows="4" v-model.trim="ruleForm.remark" type="textarea" placeholder="请输入备注，最大长度为120个字" style="width:500px"/>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="showTtpe=='new'" @click="resetsubmit">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :title="modelTitle" :visible.sync="onShow1" width="600px" class="dialog" @close="resetmodel">
      <el-scrollbar class="fixed_scroll">
        <el-form ref="linkForm" :label-position="'right'" :rules="linkFormrules" :model="linkForm" label-width="100px" class="center modelForm payment_form findForm">
          <el-form-item class="itemFrom" label="类型：" prop="type">
            <el-radio :disabled="showTtpe != 'new'" v-model="linkForm.type" label="1" >保证金入款</el-radio>
            <el-radio :disabled="showTtpe != 'new'" v-model="linkForm.type" label="4">货款入款</el-radio>
            <el-radio :disabled="showTtpe != 'new'" v-model="linkForm.type" label="2">报销出款</el-radio>
            <el-radio :disabled="showTtpe != 'new'" v-model="linkForm.type" label="3">采购出款</el-radio>
          </el-form-item>
          <el-form-item class="itemFrom" label="单据：" prop="protocolNo" >
            <el-input v-model.trim="linkForm.protocolNo" placeholder="输入授权号或者单据号" style="width:500px"/>
          </el-form-item>
          <el-form-item class="itemFrom" label="备注：" prop="remark">
            <el-input :rows="4" v-model.trim="linkForm.remark" type="textarea" style="width:500px"/>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="showTtpe=='new'" @click="resetsubmit">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saverelate">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :title="modelTitle" :visible.sync="onShow2" class="dialog" @close="findmodel">
      <el-scrollbar class="fixed_scroll over_scroll">
        <table class="view_dialog view_dialog_find" cellpadding="0" cellspacing="0">
          <tr class="view_line">
            <td class="line_title">款项类型</td>
            <td class="second_line">{{ detailInfo.type }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">关联单号</td>
            <td class="second_line">{{ detailInfo.protocolNo }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">金额</td>
            <td class="second_line">{{ detailInfo.amount }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">结款方式</td>
            <td class="second_line">{{ detailInfo.balance }}</td>
          </tr>
          <tr class="view_line" style="overflow:hidden">
            <td class="line_title">交易凭证</td>
            <td class="second_line">
              <div v-if="detailInfo.voucher !== '' && detailInfo.voucher !== '[]' && detailInfo.voucher !== '[object Object]'" class="fileStyle" >
                <span v-for="(item,index) of detailInfo.voucherList" :key="index">
                  <a :href="fileUrl + item.url" download="" class="file_color" target="_blank">{{ item.name }}</a>
                </span>
              </div>
              <div v-else style="color:#999">暂无数据</div>
            </td>
          </tr>
          <tr class="view_line">
            <td class="line_title">备注</td>
            <td class="second_line">{{ detailInfo.remark }}</td>
          </tr>
        </table>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onShow2=false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getPaymentInfo,
  paymentBatchCancel,
  findpaymentInfo,
  editPaymentInfo,
  addPayment,
  changepayment,
  linkPayment,
  editgetPaymentInfo,
  removeSelect } from '@/api/agreement'
import { getAuthCodeListByName } from '@/api/public'
export default {
  name: 'Payment',
  data() {
    const checkNum = (rule, value, callback) => {
      // console.log(value)
      if (!value) {
        return new Error('请输入合同金额')
      } else {
        if (value < 0) {
          callback(new Error('输入的合同金额不能为负数'))
        } else {
          callback()
        }
      }
    }
    return {
      page_name: 'payment',
      module_name: 'fi',
      choseTotal: 0,
      Id: '',
      filesArr: [],
      fileList: [],
      selectLoading: false,
      submitting: false,
      files: [],
      uploadUrl: '',
      fileUrl: '',
      showTtpe: '',
      total: 0,
      disabled: 'false',
      loading: true,
      onShow: false,
      onShow1: false,
      onShow2: false,
      isShow: true,
      modelTitle: '',
      labelPosition: 'right',
      vouchers: [{ name: '', url: '' }],
      detailInfo: {},
      isDisabled: false,
      radioName: '',
      radioSelecList: [],
      tableData: [{
        type: '',
        protocolNo: '',
        amount: '',
        voucher: [{ name: '', url: '' }],
        balance: '',
        remark: '',
        status: ''
      }
      ],
      typeList: [
        { label: '全部款项', name: 'all' },
        { label: '已关联', name: 'relevance' },
        { label: '未关联', name: 'norelevance' }
      ],
      ruleForm: {
        type: '',
        protocolNo: '',
        amount: '',
        voucher: '',
        voucherList: [],
        balance: '',
        remark: '',
        status: ''
      },
      linkForm: {
        type: '',
        protocolNo: '',
        remark: ''
      },
      tableHeight: 250,
      ruleFormrules: {
        type: [{ required: true, message: '类型不能为空', trigger: 'change' }
        ],
        amount: [
          { required: true, message: '金额不能为空', trigger: 'blur' },
          {
            validator: checkNum, trigger: 'blur' }
        ],
        balance: [
          { required: true, message: '结款方式不能为空', trigger: 'blur' }
        ],
        protocolNo: [
          { required: true, message: '单据不能为空', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_]{2,25}$/, message: '单据为数字、字母、_', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '备注不能为空', trigger: 'blur' },
          { min: 1, max: 120, message: '输入备注长度超出范围1-120位之间', trigger: 'blur' }
        ]
      },
      linkFormrules: {
        type: [{ required: true, message: '请选择类型', trigger: 'change' }
        ],
        protocolNo: [
          { required: true, message: '单据不能为空', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_]{2,25}$/, message: '单据为数字、字母、_', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '备注不能为空', trigger: 'blur' },
          { min: 1, max: 120, message: '输入备注长度超出长度超出范围1-120位之间范围', trigger: 'blur' }
        ]
      },
      balance: [],
      searchInfo: {
        mode: 'all', // 类型
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      }
    }
  },
  mounted() {
    this.getList()
    this.fileUrl = process.env.FILE_API
    this.uploadUrl = process.env.BASE_API + 'sys/file-upload'
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  methods: {
    batchstop() {
      const that = this
      if (that.selectArr.length > 0) {
        const obj = {
          ids: this.selectArr.join(',')
        }
        that.$confirm('付款管理一旦作废，不可以恢复,确定要批量“作废”吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          paymentBatchCancel(obj).then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                type: 'success',
                message: res.data.message
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
      if (this.showTtpe === 'link') {
        this.$refs['linkForm'].resetFields()
        this.linkForm = {
        }
      } else {
        this.$refs['ruleForm'].resetFields()
        this.ruleForm = {
          type: '',
          protocolNo: '',
          amount: '',
          voucher: '',
          balance: '',
          remark: '',
          status: ''
        }
        this.radioSelecList = []
        this.fileList = []
      }
      this.submitting = false
    },
    radioType(e) {
      console.log(e, 'fdsgfsgf')
      this.ruleForm.protocolNo = ''
      if (e === '1') {
        this.radioName = 'contract'
      } else if (e === '2') {
        this.radioName = 'refund'
      } else if (e === '3') {
        this.radioName = 'procurement'
      } else if (e === '4') {
        this.radioName = 'payment'
      }
      getAuthCodeListByName(this.radioName, '').then(res => {
        console.log(res, 'gfsgdafhdhy')
        this.radioSelecList = res.data
      })
    },
    getSelectList(query) {
      console.log(query)
      const that = this
      if (query != '') {
        this.selectLoading = true
        setTimeout(() => {
          this.selectLoading = false
          // 获取下拉框的经销商列表
          getAuthCodeListByName(this.radioName, query).then(res => {
            if (res.code == 200) {
              // eslint-disable-next-line no-undef
              that.radioSelecList = res.data
            }
          })
          // this.selectList = this.backList.filter(item => {
          //   return item.label.toLowerCase()
          //     .indexOf(query.toLowerCase()) > -1
          // })
        }, 500)
      } else {
        console.log('输入为空')
        getAuthCodeListByName(this.radioName, '').then(res => {
          if (res.code == 200) {
          // eslint-disable-next-line no-undef
            that.radioSelecList = res.data
          }
        })
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
      this.loading = true
      this.tableData = []
      this.getList()
    },
    iptNum(e) {
      const a = parseFloat(e.target.value).toFixed(2)
      this.ruleForm.amount = a
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
    beforeUpload(file, fileList) {
      console.log(file)
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
    handleSuccess(res, file, fileList) {
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
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
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
        this.ruleForm.voucher = ''
      }
      console.log(this.filesArr)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning('当前限制选择 1 个文件，请删除后继续上传')
    },
    getList() {
      const that = this
      getPaymentInfo(that.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          that.tableData = res.data.payments
          const obj = res.data.balanceList
          // const obj1 = res.data.typeList
          for (var i = 0; i < that.tableData.length; i++) {
            for (const j in obj) {
              if (that.tableData[i].balance === j) {
                that.tableData[i].balance = obj[j]
              }
            }
            // for (const k in obj1) {
            //   if (that.tableData[i].type === k) {
            //     that.tableData[i].type = obj1[k]
            //   }
            // }
            if (that.tableData[i].voucher !== '' && that.tableData[i].voucher !== '[]' && that.tableData[i].voucher !== '[object Object]') {
              that.tableData[i].voucher = JSON.parse(that.tableData[i].voucher)
            } else {
              that.tableData[i].voucher = [{ name: '', url: '' }]
            }
          }
          that.total = res.data.pager.recTotal// 总条数
          const arr = []
          for (const i in obj) {
            arr.push({
              value: i, label: obj[i]
            })
          }
          that.balance = arr
        }
      })
    },
    removelink(delId) {
      const that = this
      console.log(delId, 'FFF')
      this.$confirm('确定取消关联此付款信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeSelect(delId.id).then(res => {
          console.log(res)
          if (res.code === 200 || res.code === '200') {
            that.$message({
              type: 'success',
              message: res.msg
            })
            this.modelShow = false
            that.loading = true
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
    findInfo(event) {
      const that = this
      this.modelTitle = '查看'
      this.showTtpe = 'find'
      this.onShow2 = true
      findpaymentInfo(event.id).then(res => {
        if (res.code === 200 || res.code === '200') {
          that.detailInfo = res.data.payment
          if (that.detailInfo.voucher !== '' && that.detailInfo.voucher !== '[]' && that.detailInfo.voucher !== '[object Object]') {
            that.detailInfo.voucherList = JSON.parse(that.detailInfo.voucher)
          }
          this.$nextTick(() => {
            this.showScroll = document.getElementsByClassName('view_dialog')[0].offsetHeight > 588
          })
        }
      })
    },
    findmodel() {
      this.onShow2 = false
    },
    addpay() {
      this.modelTitle = '创建款项'
      this.onShow = true
      this.showTtpe = 'new'
    },
    choseType(value) {
      this.searchInfo.pageID = 1
      this.searchInfo.mode = value
      this.tableData = []
      this.searchInfo.orderBy = ''
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
    saveModel() {
      const that = this
      // 保存款项信息
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          that.submitting = true
          console.log(that.filesArr)
          if (that.filesArr.length > 0) {
            that.ruleForm.voucher = JSON.stringify(that.filesArr)
          }
          console.log(that.ruleForm)
          debugger
          if (that.showTtpe === 'new') {
            // 新增
            const info = {
              type: that.ruleForm.type,
              protocolNo: that.ruleForm.protocolNo,
              amount: that.ruleForm.amount,
              voucher: that.ruleForm.voucher,
              balance: that.ruleForm.balance,
              remark: that.ruleForm.remark,
              status: that.ruleForm.status
            }
            addPayment(info).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '付款信息添加成功！',
                  type: 'success'
                })
                that.resetmodel()
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
            const info = {
              id: that.ruleForm.id,
              type: that.ruleForm.type,
              protocolNo: that.ruleForm.protocolNo,
              amount: that.ruleForm.amount,
              voucher: that.ruleForm.voucher,
              balance: that.ruleForm.balance,
              remark: that.ruleForm.remark,
              status: that.ruleForm.status
            }
            // 更新
            editPaymentInfo(info).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '付款信息保存成功！',
                  type: 'success'
                })
                console.log(that.ruleForm, 'dfsgfshgfdh44')
                that.resetmodel()
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
    // 关联款项
    saverelate() {
      const that = this
      // 关联款项信息
      this.$refs['linkForm'].validate((valid) => {
        if (valid) {
          that.submitting = true
          linkPayment(this.Id, that.linkForm).then(res => {
            console.log(res)
            that.submitting = false
            if (res.code === 200 || res.code === '200') {
              that.$message({
                type: 'success',
                message: res.data.message
              })
              this.onShow1 = false
              that.resetmodel()
              that.getList()
            } else {
              that.$message({
                type: 'warning',
                message: res.data.message
              })
            }
          })
        }
      })
    },
    resetmodel() {
      console.log('重置表单')
      if (this.showTtpe === 'link' || this.showTtpe === 'changelink') {
        this.$refs['linkForm'].resetFields()
        this.linkForm = {
        }
      } else {
        this.$refs['ruleForm'].resetFields()
        this.ruleForm = {
          type: '',
          protocolNo: '',
          amount: '',
          voucher: '',
          balance: '',
          remark: '',
          status: ''
        }
        this.radioSelecList = []
      }
      this.fileList = []
      this.filesArr = []
      this.submitting = false
      this.onShow = false
      this.onShow1 = false
    },
    editpayment(event) {
      const that = this
      // this.ruleForm = { ...event }
      this.onShow = true
      this.modelTitle = '编辑款项'
      this.showTtpe = 'edit'
      // if (event.type === '合同入款') {
      //   this.radioName = 'contract'
      // } else if (event.type === '报销出款') {
      //   this.radioName = 'refund'
      // } else if (event.type === '采购出款') {
      //   this.radioName = 'procurement'
      // }
      // radioSelect(this.radioName).then(res => {
      //   console.log(res, 'gfsgdafhdhy')
      //   this.radioSelecList = res.data
      // })
      editgetPaymentInfo(event).then(res => {
        this.loading = false
        if (res.code === 200) {
          console.log(res)
          that.ruleForm = res.data.payment
          if (that.ruleForm.voucher === null || that.ruleForm.voucher === '' || that.ruleForm.voucher === '[]' || that.ruleForm.voucher === '[object Object]') {
            that.fileList = []
            that.ruleForm.voucher = []
            that.ruleForm.voucherList = []
          } else {
            that.ruleForm.voucherList = JSON.parse(that.ruleForm.voucher)
            that.fileList = JSON.parse(that.ruleForm.voucher)
          }
        }
      })
    },
    showlink(event, type) {
      this.onShow1 = true
      const that = this
      if (type === 'firstlink') {
        this.modelTitle = '关联'
        this.linkForm = { ...event }
        // if (this.linkForm.type === '合同入款') {
        //   this.linkForm.type = '1'
        // } else if (this.linkForm.type === '报销出款') {
        //   this.linkForm.type = '2'
        // } else {
        //   this.linkForm.type = '3'
        // }
        this.showTtpe = 'link'
      } else {
        this.modelTitle = '变更关联'
        this.isDisabled = true
        findpaymentInfo(event.id).then(res => {
          if (res.code === 200 || res.code === '200') {
            that.linkForm = res.data.payment
            if (that.linkForm.type === '保证金入款') {
              that.linkForm.type = '1'
            } else if (that.linkForm.type === '报销出款') {
              that.linkForm.type = '2'
            } else if (that.linkForm.type === '采购出款') {
              that.linkForm.type = '3'
            } else {
              that.linkForm.type = '34'
            }
          }
        })
        this.showTtpe = 'changelink'
      }
      this.Id = event.id
      console.log(event.id)
    },
    changepayment(event, states) {
      const that = this
      this.modelTitle = '关联'
      let msg = ''
      // eslint-disable-next-line eqeqeq
      if (states != '1' || states != '2') {
        msg = '确定作废此付款信息吗？'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changepayment(event.id, states).then(res => {
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
      }).catch(() => {
        console.log('用户点击了取消')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.sales_bg{
    // background: #fff;
    // padding: 10px 10px;
    position: absolute;
    width: 100%;
    top: 0;
    .proxy_info {
      background: #fff;
      padding: 20px 10px;
    }
  .el-tooltip__popper {
    max-width: 400px;
    line-height: 180%;
  }
    .sales_page{
        text-align: center;
        margin-top: 20px;
    }
       .file{
       text-decoration: underline;
        color:#409EFF;
        font-size: 12px;
    }
}
.dialog{
    .payment_form{
       margin: 0 10px;
       .itemFrom{
        // margin-bottom: 22px;
      }
    }
    .center{
       margin:20px 20px 30px;
    }

       .view_line {
        overflow: hidden;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #e4e4e4;

        span {
          font-family: '微软雅黑 Regular', '微软雅黑';
          font-weight: 400;
          font-size: 14px;
          color: #999999;
          float: left;
          width: 350px;
        }

        .line_title {
          font-weight: 400;
          color: #666666;
          width: 130px;
          text-align: right;
          background: #f9fafc;
          border-right: 1px solid #e4e4e4;
          text-align: center;
          font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
          font-weight: 700;
          font-size: 12px;
          color: #333333;
        }

        .second_line {
          font-weight: 400;
          font-size: 14px;
          color: #333333;
          padding-left: 10px;
          .file_color{
            text-decoration: underline;
            color: #409EFF;
            font-size: 12px;
          }
        }
      }
}

</style>
