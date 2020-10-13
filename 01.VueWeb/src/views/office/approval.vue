<template>
  <div>
    <div class="approval_bg">
      <div class="fifter">
        <my-tabs
          ref="searchAction"
          :page-name="page_name"
          :module-name="module_name"
          :allow-fifter="searchInfo.mode!='new'"
          :other="btnPermission('process_browse')"
          :other-text="'配置工作流'"
          :active-name="searchInfo.mode"
          :tabs-list="typeList"
          @actionClick="goWorkSet"
          @handleClick="choseType"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)"/>
      </div>
      <div class="approval_info">
        <div v-if="searchInfo.mode!='new'" class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}个记录</span>
            <!-- <el-button plain size="mini">批量作废</el-button> -->
          </div>
        </div>
        <ul v-if="searchInfo.mode=='new'" class="add_list">
          <li v-for="(item,index) in newList" :key="index">
            <p class="new_title">{{ item.title }}（<span v-if="Array.isArray(item.children)===true">{{ item.children.length }}</span><span v-if="Array.isArray(item.children)===false">{{ Object.keys(item.children).length }}</span>）</p>
            <p class="new_block">
              <span
                v-for="(item_block,index) in item.children"
                v-show="btnPermission(item_block.group)"
                :key="index"
                class="block_card"
                @click="goApprovalDetail(item_block.id,item_block.url)">
                <img :src="item_block.icon" alt>
                <i>{{ item_block.name }}</i>
              </span>
            </p>
          </li>
        </ul>
        <el-table
          v-loading="loading"
          v-else
          ref="table"
          :data="tableData"
          :max-height="tableHeight"
          border
          row-key="id"
          tooltip-effect="light"
          @sort-change="fifterTable"
          @selection-change="handleSelectionChange">
          <!-- <el-table-column  type="selection" min-width="40" fixed="left"/> -->
          <el-table-column label="类型" prop="processName" >
            <template slot-scope="scope">
              <span>{{ scope.row.processName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="sourceName" label="单据名称" min-width="150" show-overflow-tooltip/>
          <el-table-column prop="organizeName" label="所属部门" min-width="150" show-overflow-tooltip/>
          <el-table-column prop="accountName" label="申请人（职位）" min-width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.accountName }}({{ scope.row.groupName }})</span>
            </template>
          </el-table-column>
          <el-table-column prop="auditDate" label="审批时间" min-width="150" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status==0">待审批</el-tag>
              <el-tag v-if="scope.row.status==1">审批中</el-tag>
              <el-tag v-if="scope.row.status==2" type="danger">驳回</el-tag>
              <el-tag v-if="scope.row.status==4" type="success">通过</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <div v-if="searchInfo.mode=='wait'">
                <el-button type="text" size="small" @click="viewDetail(scope.row,'approval')">审批</el-button>
              </div>
              <div v-if="searchInfo.mode=='audited'">
                <el-button type="text" size="small" @click="viewDetail(scope.row,'view')">查看</el-button>
              </div>
              <div v-if="searchInfo.mode=='all'">
                <el-button type="text" size="small" @click="viewDetail(scope.row,'view')">查看</el-button>
              </div>
              <div v-if="searchInfo.mode=='founding'">
                <el-button type="text" size="small" @click="viewDetail(scope.row,'view')">查看</el-button>
                <el-button :disabled="(scope.row.status!=0&&scope.row.status!=2)||scope.row.sort>1" type="text" size="small" @click="editPage(scope.row)">编辑</el-button>
                <el-button :disabled="(scope.row.status!=0&&scope.row.status!=2)||scope.row.sort>1" type="text" size="small" @click="changeStates(scope.row)">作废</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="searchInfo.mode!='new'" class="info_page">
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
  </div>
</template>
<script>
import {
  getApprovalList, // 获取审批列表
  // getCartype, // 用车
  // getChaptertype, // 用章
  getApprovalInfo,
  getApprovalDetail, // 获取申请单详情
  // getLeavetype, //请假
  // getOvertimetype, //加班
  getWorkTypeById, // 获取审批分类列表
  getWorkflowGet, // 审批通用方法
  getWorkEditInfo, // 编辑方法
  banApproval, // 作废
  getProBySup, // 根据供应商id获取产品
  saveApprovalType, // 保存各种新增申请单
  calcTime, // 计算请假加班时长
  isWorkDay // 判断当前选中日期是否是工作日
} from '@/api/office'
import {
  // eslint-disable-next-line no-unused-vars
  btnPermission
} from '@/permission.js' // 按钮权限和页面权限
import avatar from '@/assets/avatar.png' // 用章
export default {
  name: 'ApprovalManage',
  data() {
    const checkNum = (rule, value, callback) => {
      // console.log(value)
      if (!value) {
        return callback(new Error('折扣金额不能为空'))
      } else {
        if (value < 0) {
          callback(new Error('填写的折后金额不能为负数'))
        } else {
          callback()
        }
      }
    }
    const checkSup = (rule, value, callback) => {
      if (!value && (this.procurementForm.other === '0' || this.procurementForm.other === 0)) {
        console.log(111)
        callback(new Error('供应商不能为空'))
        // return new Error('请选择供应商')
      } else {
        callback()
      }
    }
    return {
      page_name: 'workflow',
      module_name: 'oa',
      choseTotal: 0,
      headImg: avatar,
      input: '',
      opinion: '',
      uploadUrl: '',
      uploadFile: '',
      filesArr: [],
      inputName: '不选则通知整个集团',
      tableData: [],
      loading: false,
      divType: 'new',
      requestUrl: '',
      modelType: '',
      modelTitle: '',
      modelShow: false,
      dialogWidth: '600px',
      newList: [],
      typeList: [],
      showId: 0,
      approvalTitle: '',
      approvalForm: {
        title: '',
        content: '',
        file: '',
        organizeId: '0'
      },
      supplierList: [],
      viewForm: {},
      fileList: [],
      files: [],
      radioList: [], // 用车类型,用章类型
      overtimeForm: {
        processTypeId: '',
        title: '',
        type: '1',
        startDate: '',
        endDate: '',
        hours: '',
        remark: ''
      },
      overday_start: '',
      overtime_start: '',
      overday_end: '',
      overtime_end: '',
      leaveday_start: '',
      leavetime_start: '',
      leaveday_end: '',
      leavetime_end: '',
      time_seting: {},
      timeConfig: {
        start: '08:30',
        step: '00:30',
        end: '18:30'
      },
      overTime: 100,
      leaveForm: {
        processTypeId: '',
        title: '',
        type: '',
        startDate: '',
        endDate: '',
        hours: '',
        contact: '',
        phone: '',
        remark: ''
      },
      leaveTime: 100,
      temporaryTime: 0, // 调休时间
      userList: [],
      accompanyList: [],
      salesLeaveForm: {
        processTypeId: '',
        type: '',
        leaveId: '',
        startDate: '',
        endDate: '',
        hours: '',
        remark: ''
      },
      min_leave: '',
      max_leave: '',
      max_leave_hours: '',
      sales_leave_type: '',
      salesLeaveRules: {
        processTypeId: [{
          required: true,
          message: '请选择销假单类型',
          trigger: 'change'
        }],
        leaveId: [{
          required: true,
          message: '请假单不能为空',
          trigger: 'change'
        }],
        startDate: [{
          required: true,
          message: '开始时间不能为空',
          trigger: 'change'
        }],
        endDate: [{
          required: true,
          message: '结束时间不能为空',
          trigger: 'change'
        }],
        hours: [{
          required: true,
          message: '销假时长不能为空',
          trigger: 'blur'
        }],
        remark: [{
          required: true,
          message: '销假事由不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '销假事由长度超出范围1-120位之间', trigger: 'blur' }]
      },
      visitForm: {
        processTypeId: '',
        title: '',
        customer: '',
        contact: '',
        destination: '',
        accompany: '',
        startDate: '',
        endDate: '',
        remark: ''
      },
      pickerOptions: {
        disabledDate(time) {
          console.log(time.getTime())
          return time.getTime() < Date.now()
        }
      },
      carForm: {
        processTypeId: '',
        // 用车数据
        title: '',
        type: '',
        useDate: '',
        isDriver: '',
        busNum: '',
        remark: ''
      },
      sealForm: {
        processTypeId: '',
        // 用章数据
        title: '',
        type: '',
        useDate: '',
        remark: ''
      },
      refundList: [], // 报销添加的明细
      refundForm: {
        processTypeId: '',
        // 报销数据
        title: '',
        items: [],
        files: '',
        amount: 0.00,
        name: '',
        bank: '',
        card: '',
        remark: ''
      },
      // 采购单的明细
      procurementList1: [],
      proList: [],
      procurementForm: {
        processTypeId: '',
        title: '',
        orderNo: '',
        supplierID: '',
        other: 0,
        items: '',
        amount: 0.00,
        files: '',
        remark: ''
      },
      procurementList: [], // 采购申请单的明细
      procurementapplyForm: {
        title: '',
        items: '',
        remark: ''
      },
      tableHeight: 250,
      applyForm: {
        // 报销数据
        name: '',
        info: [{
          proName: '',
          proPrice: '',
          proNum: '',
          proAmount: 0.0
        },
        {
          proName: '',
          proPrice: '',
          proNum: '',
          proAmount: 0.0
        }
        ],
        total: 0,
        pname: '',
        pbank: '',
        bankcode: '',
        remark: ''
      },
      receiveForm: {
        processTypeId: '',
        title: '',
        type: '',
        receiveDate: '',
        remark: ''
      },
      radioList1: [], // 用章主体类型
      approvalInfo: {
        files: [{ name: '', url: '' }]
      }, // 申请单
      carStep: [], // 步骤条
      activeStep: 0,
      overtimeRules: {
        processTypeId: [{
          required: true,
          message: '请选择审批类型',
          trigger: 'change'
        }],
        title: [{
          required: true,
          message: '申请单名称不能为空',
          trigger: 'blur'
        },
        {
          min: 6,
          max: 15,
          message: '申请单名称长度在 6 到 15 个字符',
          trigger: 'blur'
        }
        ],
        type: [{
          required: true,
          message: '请假类型不能为空',
          trigger: 'change'
        }],
        startDate: [{
          required: true,
          message: '开始时间不能为空',
          trigger: 'change'
        }],
        endDate: [{
          required: true,
          message: '结束时间不能为空',
          trigger: 'change'
        }],
        hours: [{
          required: true,
          message: '加班时长不能为空',
          trigger: 'change'
        }],
        remark: [{
          required: true,
          message: '加班事由不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '加班事由长度超出范围1-120位之间', trigger: 'blur' }]
      },
      leaveRules: {
        processTypeId: [{
          required: true,
          message: '请选择审批类型',
          trigger: 'change'
        }],
        title: [{
          required: true,
          message: '申请单名称不能为空',
          trigger: 'blur'
        },
        {
          min: 6,
          max: 15,
          message: '申请单名称长度在 6 到 15 个字符',
          trigger: 'blur'
        }
        ],
        type: [{
          required: true,
          message: '请假类型不能为空',
          trigger: 'change'
        }],
        startDate: [{
          required: true,
          message: '开始时间不能为空',
          trigger: 'change'
        }],
        endDate: [{
          required: true,
          message: '结束时间不能为空',
          trigger: 'change'
        }],
        hours: [{
          required: true,
          message: '请假时长不能为空',
          trigger: 'blur'
        }],
        contact: [{
          required: true,
          message: '紧急联系人不能为空',
          trigger: 'blur'
        }],
        phone: [{
          required: true,
          message: '紧急联系电话不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^[1][0-9]{10}$/,
          message: '紧急联系电话格式错误',
          trigger: 'blur'
        }
        ],
        remark: [{
          required: true,
          message: '请假事由不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '请假事由长度超出范围1-120位之间', trigger: 'blur' }]
      },
      visitRules: {
        processTypeId: [{
          required: true,
          message: '请选择审批类型',
          trigger: 'change'
        }],
        title: [{
          required: true,
          message: '申请单名称不能为空',
          trigger: 'blur'
        },
        {
          min: 2,
          max: 15,
          message: '申请单名称长度在 2 到 15 个字符',
          trigger: 'blur'
        }
        ],
        customer: [{
          required: true,
          message: '客户名称不能为空',
          trigger: 'blur'
        }],
        contact: [{
          required: true,
          message: '联系人不能为空',
          trigger: 'blur'
        }],
        destination: [{
          required: true,
          message: '目的地不能为空',
          trigger: 'blur'
        }],
        startDate: [{
          required: true,
          message: '开始时间不能为空',
          trigger: 'change'
        }],
        endDate: [{
          required: true,
          message: '结束时间不能为空',
          trigger: 'change'
        }],
        accompany: [{
          required: true,
          message: '陪同人不能为空',
          trigger: 'blur'
        }],
        remark: [{
          required: true,
          message: '拜访目的不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '拜访目的长度超出范围1-120位之间', trigger: 'blur' }]
      },
      carRules: {
        processTypeId: [{
          required: true,
          message: '请选择审批类型',
          trigger: 'change'
        }],
        title: [{
          required: true,
          message: '申请单名称不能为空',
          trigger: 'blur'
        },
        {
          min: 6,
          max: 15,
          message: '申请单名称长度在 6 到 15 个字符',
          trigger: 'blur'
        }
        ],
        type: [{
          required: true,
          message: '用车类型不能为空',
          trigger: 'change'
        }],
        useDate: [{
          required: true,
          message: '用车时间不能为空',
          trigger: 'change'
        }],
        isDriver: [{
          required: true,
          message: '是否需要司机不能为空',
          trigger: 'change'
        }],
        busNum: [{
          required: true,
          message: '乘车人数不能为空',
          trigger: 'blur'
        }],
        remark: [{
          required: true,
          message: '申请原因不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '申请原因长度超出范围1-120位之间', trigger: 'blur' }]
      },
      sealRules: {
        processTypeId: [{
          required: true,
          message: '请选择审批类型',
          trigger: 'change'
        }],
        title: [{
          required: true,
          message: '申请单名称不能为空',
          trigger: 'blur'
        },
        {
          min: 6,
          max: 15,
          message: '申请单名称长度在 6 到 15 个字符',
          trigger: 'blur'
        }
        ],
        subject: [{
          required: true,
          message: '主体类型不能为空',
          trigger: 'change'
        }],
        type: [{
          required: true,
          message: '用章类型不能为空',
          trigger: 'change'
        }],
        useDate: [{
          required: true,
          message: '用章时间不能为空',
          trigger: 'change'
        }],
        remark: [{
          required: true,
          message: '申请原因不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '申请原因长度超出范围1-120位之间', trigger: 'blur' }]
      },
      refundRules: {
        processTypeId: [{
          required: true,
          message: '请选择审批类型',
          trigger: 'change'
        }],
        title: [{
          required: true,
          message: '报销单名称不能为空',
          trigger: 'blur'
        },
        {
          min: 6,
          max: 15,
          message: '报销名称长度在 6 到 15 个字符',
          trigger: 'blur'
        }
        ],
        amount: [{
          required: true,
          message: '总费用不能为空',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '开户姓名不能为空',
          trigger: 'blur'
        }, { min: 2, max: 6, message: '开户姓名长度2-6位', trigger: 'blur' }],
        bank: [{
          required: true,
          message: '开户行不能为空',
          trigger: 'blur'
        }],
        card: [{
          required: true,
          message: '银行卡号不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^([1-9]{1})(\d{15,18})$/,
          message: '银行卡号格式错误，长度在16-19位之间',
          trigger: 'blur'
        }
        ],
        remark: [{
          required: true,
          message: '申请原因说明不能为空',
          trigger: 'blur'
        },
        { min: 1, max: 120, message: '申请原因说明长度超出范围1-120位之间', trigger: 'blur' }],
        files: [{
          required: true,
          message: '报销凭证不能为空不能为空',
          trigger: 'change'
        }],
        items: [{
          required: true,
          message: '报销明细不能为空',
          trigger: 'change'
        }]
      },
      procurementRules: {
        processTypeId: [{
          required: true,
          message: '请选择审批类型',
          trigger: 'change'
        }],
        title: [{
          required: true,
          message: '采购单名称不能为空',
          trigger: 'blur'
        }],
        items: [{
          required: true,
          message: '采购明细不能为空',
          trigger: 'change'
        }],
        remark: [{
          required: true,
          message: '原因说明不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '原因说明长度超出范围1-120位之间', trigger: 'blur' }],
        orderNo: [{
          required: true,
          message: '采购单单号不能为空',
          trigger: 'blur'
        }],
        supplierID: [{ validator: checkSup, trigger: 'change' }],
        amount: [{
          required: true,
          message: '折后金额不能为空',
          trigger: 'blur'
        }, {
          validator: checkNum, trigger: 'blur' }],
        files: [{
          required: true,
          message: '合同凭证不能为空',
          trigger: 'change'
        }]
      },
      procurementapplyRules: {
        processTypeId: [{
          required: true,
          message: '请选择审批类型',
          trigger: 'change'
        }],
        title: [{
          required: true,
          message: '采购申请名称不能为空',
          trigger: 'blur'
        },
        {
          min: 6,
          max: 15,
          message: '采购申请名称长度在 6 到 15 个字符',
          trigger: 'blur'
        }
        ],
        items: [{
          required: true,
          message: '采购申请明细不能为空',
          trigger: 'change'
        }],
        remark: [{
          required: true,
          message: '原因说明不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '原因说明长度超出范围1-120位之间', trigger: 'blur' }]
      },
      receiveRules: {
        processTypeId: [{
          required: true,
          message: '请选择审批类型',
          trigger: 'change'
        }],
        title: [{
          required: true,
          message: '物品领用名称不能为空',
          trigger: 'blur'
        },
        {
          min: 2,
          max: 15,
          message: '物品领用名称长度在 2 到 15 个字符',
          trigger: 'blur'
        }
        ],
        type: [{
          required: true,
          message: '领用类型不能为空',
          trigger: 'change'
        }],
        receiveDate: [{
          required: true,
          message: '领用时间不能为空',
          trigger: 'change'
        }]
      },
      processtypeList: [],
      searchInfo: {
        mode: 'new', // 类型
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      submitting: false,
      total: 0 // 总条数
    }
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  mounted() {
    if (this.btnPermission('workflow_all') === false) {
      this.typeList = [{
        label: '发起审批',
        name: 'new'
      },
      {
        label: '待我审核',
        name: 'wait'
      },
      {
        label: '我已审批',
        name: 'audited'
      },
      {
        label: '我发起的',
        name: 'founding'
      }
      ]
    } else {
      this.typeList = [{
        label: '发起审批',
        name: 'new'
      },
      {
        label: '待我审核',
        name: 'wait'
      },
      {
        label: '我已审批',
        name: 'audited'
      },
      {
        label: '我发起的',
        name: 'founding'
      },
      {
        label: '全部审批',
        name: 'all'
      }
      ]
    }
    this.uploadUrl = process.env.BASE_API + 'sys/file-upload'
    // 获取列表
    if (this.$route.query.tab === 'wait') {
      const activeTab = this.$route.query.tab
      console.log(this.$route.query.tab)
      this.searchInfo.mode = activeTab
      this.$refs.searchAction.getList()
      this.getList()
    } else {
      console.log(window.localStorage.getItem('mode'))
      if (window.localStorage.getItem('mode') != undefined && window.localStorage.getItem('mode') != '') {
        this.searchInfo.mode = window.localStorage.getItem('mode')
        window.localStorage.setItem('mode', '')
        this.$refs.searchAction.getList()
      } else {
        this.searchInfo.mode = 'new'
      }
      this.getList()
    }
  },
  methods: {
    handleSelectionChange(val) {
      console.log(val)
      this.choseTotal = val.length
      if (val.length > 0) {
        console.log('本页选择了')
      } else {
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
    iptNum(e) {
      // const a = parseFloat(e.target.value).toFixed(2)
      if (parseInt(e.target.value) < 0) {
        this.procurementForm.amount = e.target.value
      } else {
        this.procurementForm.amount = parseFloat(e.target.value).toFixed(2)
      }
    },
    getList() {
      const that = this
      console.log(this.searchInfo.mode)
      if (this.searchInfo.mode === 'new') {
        getApprovalList().then(res => {
          console.log(res)
          if (res.code === 200) {
            that.newList = res.data.approval
          }
        })
      } else {
        getApprovalInfo(this.searchInfo).then(res => {
          that.loading = false
          if (res.code === 200) {
            that.tableData = res.data.workflows
            that.total = res.data.pager.recTotal // 总条数
          }
        })
      }

      // getDepList().then(res => {
      //   if (res.code === 200 || res.code === '200') {
      //     this.depList = JSON.parse(JSON.stringify(res.data.organize))
      //   }
      // })
    },
    editType(e) {
      console.log(e, 'f')
      const id = this.overtimeForm.processTypeId
      if (this.overtimeForm.type !== '') {
        this.$refs['overtimeForm'].resetFields()
        this.overday_start = ''
        this.overtime_start = ''
        this.overday_end = ''
        this.overtime_end = ''
        this.overtimeForm.startDate = ''
        this.overtimeForm.endDate = ''
        this.overtimeForm.hours = ''
        this.overtimeForm.remark = ''
        this.overtimeForm.type = e
        this.overtimeForm.processTypeId = id
      }
    },
    choseType(e) {
      console.log('执行了吗')
      this.searchInfo.mode = e
      this.searchInfo.pageID = 1
      this.searchInfo.orderBy = ''
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
    goWorkSet() {
      // this.$router.push({
      //   path: '/office/workSet'
      // })
      this.$router.push({
        path: '/office/typeList'
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
    goApprovalDetail(type, url) {
      this.$router.push({
        path: '/office/approvalPage?type=new&approvalType=' + type + '&url=' + url + '&mode=' + this.searchInfo.mode
      })
    },
    // 新增申请单
    addApproval(type, url) {
      const that = this
      this.divType = 'new'
      this.requestUrl = url
      this.modelType = type
      this.dialogWidth = '600px'
      // 根据审批类型获取审批流分类列表
      getWorkTypeById(type).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.processtypeList = res.data.data
        }
      })
      getWorkflowGet(url).then(res => {
        if (res.code === 200) {
          console.log(res, '154654')
          switch (type) {
            case 1:
              this.dialogWidth = '700px'
              this.modelTitle = '创建采购'
              this.proList = []
              this.procurementList1 = []
              this.supplierList = res.data.supplier
              console.log(this.procurementForm.other)
              break
            case 2: {
              this.modelTitle = '创建拜访'
              const arr = []
              for (let i = 0; i < res.data.escorts.length; i++) {
                arr.push({
                  value: res.data.escorts[i].id,
                  label: res.data.escorts[i].name + '-' + res.data.escorts[i].deptName
                })
              }
              that.radioList = arr
              break
            }
            case 3:
              this.modelTitle = '新增用章申请'
              that.radioList = res.data.typeList
              that.radioList1 = res.data.subjectList
              break
            case 4:
              this.dialogWidth = '700px'
              this.modelTitle = '创建报销'
              break
            case 5:
              this.modelTitle = '创建加班申请'
              that.radioList = res.data.typeList
              that.time_seting = res.data.sign
              that.timeConfig = {
                start: res.data.sign.sign_in,
                step: '00:30',
                end: res.data.sign.sign_out
              }
              break
            case 6:
              this.modelTitle = '创建请假'
              that.radioList = res.data.typeList
              that.time_seting = res.data.sign
              that.timeConfig = {
                start: res.data.sign.sign_in,
                step: '00:30',
                end: res.data.sign.sign_out
              }
              that.temporaryTime = res.data.sign.lastime // 调休时长
              break
            case 7:
              this.modelTitle = '新增用车申请'
              that.radioList = res.data.typeList
              break
            case 8:
              this.modelTitle = '创建物品领用'
              that.radioList = res.data.typeList
              break
            case 9:
              this.dialogWidth = '700px'
              this.procurementList = []
              this.modelTitle = '创建采购申请单'
              break
            case 10:
              this.dialogWidth = '700px'
              this.modelTitle = '创建销假申请单'
              that.radioList = res.data.typeList
              break
          }
          that.modelShow = true
          that.$nextTick(() => {
            that.closeModel()
          })
        } else {
          that.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    changeNum(e) {
      console.log(e)
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
    changeStates(event) {
      const that = this
      const msg = '申请单一旦作废不可恢复，确定要“作废”吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          banApproval(event.id).then(res => {
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
        })
        .catch(() => {
          console.log('用户点击了取消')
        })
    },
    viewDetail(data, type) {
      this.$router.push({
        path: '/office/approvalPage?type=' + type + '&id=' + data.id + '&processId=' + data.processId + '&processTypeId=' + data.processTypeId + '&mode=' + this.searchInfo.mode
      })
    },
    // 查看审批申请单
    showModel(data, type) {
      const that = this
      this.divType = type
      this.dialogWidth = '800px'
      if (type === 'approval') {
        this.modelTitle = '审核'
        switch (parseInt(data.processId)) {
          case 1:
            this.approvalTitle = '采购审批单'
            break
          case 2:
            this.approvalTitle = '拜访审批单'
            break
          case 3:
            this.approvalTitle = '用章审批单'
            break
          case 4:
            this.approvalTitle = '报销审批单'
            break
          case 5:
            this.approvalTitle = '加班审批单'
            break
          case 6:
            this.approvalTitle = '请假审批单'
            break
          case 7:
            // 用车审核
            this.approvalTitle = '用车审批单'
            break
          case 8:
            this.approvalTitle = '物品领用审批单'
            break
          case 9:
            this.approvalTitle = '采购申请审批单'
            break
          case 10:
            this.approvalTitle = '销假申请审批单'
            break
        }
      } else {
        this.modelTitle = '查看'
        switch (parseInt(data.processId)) {
          case 1:
            this.approvalTitle = '采购审批单'
            break
          case 2:
            this.approvalTitle = '拜访审批单'
            break
          case 3:
            this.approvalTitle = '用章审批单'
            break
          case 4:
            this.approvalTitle = '报销审批单'
            break
          case 5:
            this.approvalTitle = '加班审批单'
            break
          case 6:
            this.approvalTitle = '假条审批单'
            break
          case 7:
            // 用车审核
            this.approvalTitle = '用车审批单'
            break
          case 8:
            this.approvalTitle = '物品领用审批单'
            break
          case 9:
            this.approvalTitle = '采购申请审批单'
            break
          case 10:
            this.approvalTitle = '销假申请审批单'
            break
        }
      }
      that.showId = data.id
      getApprovalDetail(data.id, data.processTypeId).then(res => {
        if (res.code === 200) {
          that.approvalInfo = {}
          that.approvalInfo = res.data.apply
          that.carStep = res.data.nodes
          for (let i = 0; i < that.carStep.length; i++) {
            if (that.carStep[i].auditStatus === '1') {
              that.activeStep = i
              break
            }
          }
          if (that.approvalInfo.files !== undefined && that.approvalInfo.files !== '' && that.approvalInfo.files !== 'null' && that.approvalInfo.files !== null) {
            that.approvalInfo.files = JSON.parse(that.approvalInfo.files)
            that.approvalInfo.url = process.env.FILE_API
          } else {
            that.approvalInfo.files = [{ url: '', name: '' }]
            that.approvalInfo.url = ''
          }
          console.log(that.approvalInfo)
          this.modelShow = true
        } else {
          that.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      })
      this.modelType = data.processId
    },
    editPage(data) {
      this.$router.push({
        path: '/office/approvalPage?type=edit&approvalType=' + data.processId + '&id=' + data.sourceId + '&mode=' + this.searchInfo.mode
      })
    },
    // 编辑申请单
    editModel(data) {
      const that = this
      that.dialogWidth = '600px'
      this.divType = 'edit'
      data = {
        ...data
      }
      getWorkTypeById(data.processId).then(req => {
        if (req.code == 200) {
          this.processtypeList = req.data.data
        }
      })
      this.modelType = data.processId
      let editUrl = ''
      switch (parseInt(data.processId)) {
        case 1:
          editUrl = '/oa/procurement-edit-' + data.sourceId
          break
        case 2:
          editUrl = '/oa/visit-edit-' + data.sourceId
          break
        case 3:
          editUrl = '/oa/seal-edit-' + data.sourceId
          break
        case 4:
          editUrl = '/oa/refund-edit-' + data.sourceId
          break
        case 5:
          editUrl = '/oa/overtime-edit-' + data.sourceId
          break
        case 6:
          editUrl = '/oa/leave-edit-' + data.sourceId
          break
        case 7:
          editUrl = '/oa/car-edit-' + data.sourceId
          break
        case 8:
          editUrl = '/oa/receive-edit-' + data.sourceId
          break
        case 9:
          editUrl = '/oa/procurementapply-edit-' + data.sourceId
          break
        case 10:
          editUrl = '/oa/outleave-edit-' + data.sourceId
          break
      }
      this.requestUrl = editUrl
      getWorkEditInfo(editUrl).then(res => {
        if (res.code === 200) {
          // 根据审批类型获取审批流分类列表
          switch (parseInt(data.processId)) {
            case 1:
              that.dialogWidth = '700px'
              that.modelTitle = '编辑采购'
              // that.$refs["procurementForm"].resetFields();
              that.procurementForm = res.data.procurement
              console.log(that.procurementForm.items)
              if (that.procurementForm.items !== '') {
                that.procurementList1 = JSON.parse(
                  that.procurementForm.items
                )
              }
              that.supplierList = res.data.supplier
              if (that.procurementForm.files === '') {
                that.fileList = []
              } else {
                that.fileList = JSON.parse(that.procurementForm.files)
              }
              break
            case 2: {
              that.modelTitle = '编辑拜访'
              // that.$refs["visitForm"].resetFields();
              const arr = []
              for (let i = 0; i < res.data.escorts.length; i++) {
                arr.push({
                  value: res.data.escorts[i].id,
                  label: res.data.escorts[i].name + '-' + res.data.escorts[i].deptName
                })
              }
              that.radioList = arr
              that.accompanyList = []
              that.visitForm = res.data.visit
              if (that.visitForm.accompany !== '') {
                that.accompanyList = that.visitForm.accompany.split(',')
              }
              break
            }
            case 3:
              that.modelTitle = '编辑用章申请'
              // that.$refs["sealForm"].resetFields();
              that.radioList = res.data.typeList
              that.radioList1 = res.data.subjectList
              that.sealForm = res.data.seal
              break
            case 4:
              that.dialogWidth = '700px'
              that.modelTitle = '编辑报销'
              // that.$refs["refundForm"].clearValidate()
              // that.$refs["refundForm"].resetFields();
              that.refundForm = res.data.refund
              that.refundList = JSON.parse(that.refundForm.items)
              if (that.refundForm.files === '') {
                that.fileList = []
              } else {
                that.fileList = JSON.parse(that.refundForm.files)
              }
              break
            case 5:
              that.modelTitle = '编辑加班申请'
              // that.$refs["overtimeForm"].clearValidate();
              // that.$refs["overtimeForm"].resetFields();
              that.radioList = res.data.typeList
              that.overtimeForm = res.data.overtime
              var over_start = res.data.overtime.startDate.split(' ')
              that.overday_start = over_start[0]
              that.overtime_start = over_start[1]
              var over_end = res.data.overtime.endDate.split(' ')
              that.overday_end = over_end[0]
              that.overtime_end = over_end[1]
              break
            case 6:
              that.modelTitle = '编辑假条'
              // that.$refs["leaveForm"].clearValidate();
              // that.$refs["leaveForm"].resetFields();
              that.radioList = res.data.typeList
              that.leaveForm = res.data.leave
              that.temporaryTime = res.data.sign.lastime
              var leave_start = res.data.leave.startDate.split(' ')
              that.leaveday_start = leave_start[0]
              that.leavetime_start = leave_start[1]
              var leave_end = res.data.leave.endDate.split(' ')
              that.leaveday_end = leave_end[0]
              that.leavetime_end = leave_end[1]
              break
            case 7:
              that.modelTitle = '编辑用车申请'
              // that.$refs["carForm"].clearValidate();
              // that.$refs["carForm"].resetFields();
              that.radioList = res.data.typeList
              that.carForm = res.data.car
              break
            case 8:
              that.modelTitle = '编辑物品领用'
              // that.$refs["receiveForm"].resetFields();
              that.radioList = res.data.typeList
              that.receiveForm = res.data.receive
              break
            case 9:
              that.dialogWidth = '700px'
              that.modelTitle = '编辑采购申请单'
              // that.$refs["procurementapplyForm"].clearValidate();
              // that.$refs["procurementapplyForm"].resetFields();
              that.procurementapplyForm = res.data.procurementapply
              // that.$nextTick(() => {
              //   that.$refs['procurementapplyForm'].clearValidate()
              // })
              that.procurementList = JSON.parse(that.procurementapplyForm.items)
              // if (that.procurementapplyForm.files === '') {
              //   that.fileList = []
              // } else {
              //   that.fileList = JSON.parse(that.procurementapplyForm.files)
              // }
              break
            case 10:
              that.modelTitle = '编辑销假'
              // that.$refs["leaveForm"].clearValidate();
              // that.$refs["leaveForm"].resetFields();
              that.radioList = res.data.typeList
              that.salesLeaveForm = res.data.leave
              for (let i = 0; i < that.radioList.length; i++) {
                if (that.salesLeaveForm.leaveId === that.radioList[i].value) {
                  that.min_leave = that.radioList[i].startDate
                  that.max_leave = that.radioList[i].endDate
                  that.max_leave_hours = that.radioList[i].hours
                  that.sales_leave_type = that.radioList[i].type
                }
              }
              var sales_leave_start = res.data.leave.startDate.split(' ')
              that.leaveday_start = sales_leave_start[0]
              that.leavetime_start = sales_leave_start[1]
              var sales_leave_end = res.data.leave.endDate.split(' ')
              that.leaveday_end = sales_leave_end[0]
              that.leavetime_end = sales_leave_end[1]
              break
          }
          if (parseInt(data.processId) === 1) {
            getProBySup(res.data.procurement.supplierID).then(req => {
              if (req.code === 200) {
                console.log(req.data)
                that.proList = req.data
                that.modelShow = true
              }
            })
          } else {
            that.modelShow = true
          }
        } else {
          that.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    calcAmout() {
      this.refundForm.amount = 0.00
      const info = this.refundList
      let flag = true
      for (let i = 0; i < info.length; i++) {
        for (const item in info[i]) {
          if (info[i][item] === '') {
            this.$message.warning('报销明细不能为空')
            flag = false
            break
          }
        }
        if (flag) {
          info[i].proPrice = parseFloat(info[i].proPrice).toFixed(2)
          this.refundForm.amount += info[i].proPrice * info[i].proNum
        }
      }
      this.refundList = info
      this.refundForm.amount = parseFloat(this.refundForm.amount).toFixed(2)
    },
    choseSup() {
      const that = this
      getProBySup(this.procurementForm.supplierID).then(res => {
        if (res.code === 200) {
          that.proList = res.data
          that.procurementList1 = []
        }
      })
    },
    choseOther() {
      console.log(this.procurementForm)
      this.procurementForm.supplierID = ''
      this.procurementList1 = []
    },
    chosePro(index) {
      console.log(this.procurementList1)
      for (let i = 0; i < this.proList.length; i++) {
        if (this.procurementList1[index].proName === this.proList[i].id) {
          this.procurementList1[index].proPrice = parseFloat(this.proList[i].price).toFixed(2)
          this.procurementList1[index].proUnit = this.proList[i].unit
        }
      }
      console.log(this.procurementList1)
      console.log(this.proList)
      this.$forceUpdate()
    },
    addPrice() {
      console.log(this.procurementList1)
      let sum = 0.0
      for (let i = 0; i < this.procurementList1.length; i++) {
        sum += parseFloat(this.procurementList1[i].proPrice).toFixed(2) * parseInt(this.procurementList1[i].proNum)
      }
      this.procurementForm.amount = parseFloat(sum).toFixed(2)
      this.$forceUpdate()
    },
    addApplyInfo(type) {
      if (parseInt(type) === 4) {
        if (this.refundList.length === 0) {
          this.refundList.push({
            proName: '',
            proPrice: 0.00,
            proNum: 1
          })
        } else {
          let flag = true
          const info = this.refundList
          for (let i = 0; i < info.length; i++) {
            for (const item in info[i]) {
              if (info[i][item] === '') {
                this.$message.warning('报销明细不能为空')
                flag = false
                break
              }
            }
          }
          if (flag) {
            this.refundList.push({
              proName: '',
              proPrice: 0.00,
              proNum: 1
            })
          }
        }
      } else if (parseInt(type) === 9) {
        if (this.procurementList.length === 0) {
          this.procurementList.push({
            proName: '',
            proRemark: ''
          })
        } else {
          let flag = true
          const info = this.procurementList
          for (let i = 0; i < info.length; i++) {
            for (const item in info[i]) {
              if (info[i][item] === '') {
                this.$message.warning('采购明细不能为空')
                flag = false
                break
              }
            }
          }
          if (flag) {
            this.procurementList.push({
              proName: '',
              proRemark: ''
            })
          }
        }
      } else {
        if (this.procurementForm.supplierID === undefined || this.procurementForm.supplierID === '') {
          this.$message.warning('请先选择供应商')
        } else {
          if (this.procurementList1.length === 0) {
            this.procurementList1.push({
              proName: '',
              proPrice: 0.00,
              proNum: 0,
              proUnit: ''
            })
          } else {
            let flag = true
            const info = this.procurementList1
            for (let i = 0; i < info.length; i++) {
              for (const item in info[i]) {
                if (info[i][item] === '') {
                  this.$message.warning('采购明细不能为空')
                  flag = false
                  break
                }
              }
            }
            if (flag) {
              this.procurementList1.push({
                proName: '',
                proPrice: 0.00,
                proNum: 0,
                proUnit: ''
              })
            }
          }
        }
      }
      this.$forceUpdate()
    },
    removeApplyInfo(type, item) {
      let index = 0
      if (type === 4) {
        index = this.refundList.indexOf(item)
        if (index !== -1) {
          this.refundList.splice(index, 1)
        }
      } else if (type === 9) {
        index = this.procurementList.indexOf(item)
        if (index !== -1) {
          this.procurementList.splice(index, 1)
        }
      } else {
        index = this.procurementList1.indexOf(item)
        if (index !== -1) {
          this.procurementList1.splice(index, 1)
        }
        this.addPrice()
      }
    },
    passModel(type) {
      const that = this
      console.log(this.opinion)
      saveApprovalType({
        remark: this.opinion
      },
      '/oa/workflow-pass-' + this.showId
      ).then(res => {
        if (res.code === 200 || res.code === '200') {
          console.log(res)
          that.$message({
            message: res.data.message,
            type: 'success'
          })
          that.resetModel()
          that.loading = true
        } else {
          that.$message({
            message: res.data.msg.message,
            type: 'warning'
          })
        }
      })
    },
    rejectedModel(type) {
      const that = this
      saveApprovalType({
        remark: this.opinion
      },
      '/oa/workflow-rejected-' + this.showId
      ).then(res => {
        if (res.code === 200 || res.code === '200') {
          console.log(res)
          that.$message({
            message: res.data.message,
            type: 'success'
          })
          that.resetModel()
          that.loading = true
        } else {
          that.$message({
            message: res.data.msg.message,
            type: 'warning'
          })
        }
      })
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning('当前限制选择 1 个文件，请删除后继续上传')
    },
    handleSuccess(res, file) {
      this.uploadFile = ''
      // let list = {}
      if (res.code === 200 || res.code === '200') {
        this.filesArr.push({
          name: file.name,
          url: res.data.data[0].pathname
        })
        // list = [{
        //   name: file.name,
        //   url: res.data.data[0].pathname
        // }]
        // this.uploadFile = JSON.stringify(list)
        // if (parseInt(this.modelType) === 4) {
        //   this.refundForm.files = this.uploadFile
        // }
        // if (parseInt(this.modelType) === 1) {
        //   this.procurementForm.files = this.uploadFile
        // }
      }
    },
    handleRemove(file, fileList) {
      console.log(file)
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
        if (parseInt(this.modelType) === 4) {
          this.refundForm.files = ''
        }
        if (parseInt(this.modelType) === 1) {
          this.procurementForm.files = ''
        }
      }
    },
    checkValue() {
      const that = this
      if (parseInt(this.modelType) === 5) {
        // 加班
        if (this.overday_start !== '' && this.overtime_start === '') {
          this.overtime_start = '09:00'
        }
        if (this.overday_end !== '' && this.overtime_end === '') {
          this.overtime_end = '23:00'
        }
        this.overtimeForm.startDate = this.overday_start + ' ' + this.overtime_start
        this.overtimeForm.endDate = this.overday_end + ' ' + this.overtime_end
        if (this.overday_start !== '' && this.overtime_start !== '' && this.overday_end !== '' && this.overtime_end !== '') {
          const startTime = new Date(this.overtimeForm.startDate)
          const endTime = new Date(this.overtimeForm.endDate)
          this.overTime = (endTime - startTime) / 3600 / 1000
          if (startTime >= endTime) {
            this.$message({
              message: '结束时间不能小于开始时间',
              type: 'warning'
            })
            this.overtimeForm.endDate = ''
          } else {
            console.log(this.overtimeForm.type, 'd')
            calcTime('/oa/overtime-working-' + this.overtimeForm.type, { start: this.overtimeForm.startDate, end: this.overtimeForm.endDate }).then(res => {
              console.log(res)
              if (res.code === 200) {
                that.overtimeForm.hours = res.data.hours
                console.log(res.data.hours, 'ff')
                console.log(that.overtimeForm.hours, 'df')
                console.log(res.data.hours, 'fff')
                if (!res.data.hours) {
                  that.$message({
                    message: res.data,
                    type: 'warning'
                  })
                  that.overday_end = ''
                  that.overtime_end = ''
                  that.overtime_start = ''
                  that.overday_start = ''
                  that.overtimeForm.hours = 0
                }
              }
            })
          }
        } else {
          this.overTime = 100
        }
      }
    },
    choseLeaveType() {
      console.log(this.salesLeaveForm.leaveId)
      for (let i = 0; i < this.radioList.length; i++) {
        if (this.salesLeaveForm.leaveId === this.radioList[i].value) {
          this.min_leave = this.radioList[i].startDate
          this.max_leave = this.radioList[i].endDate
          this.max_leave_hours = this.radioList[i].hours
          this.sales_leave_type = this.radioList[i].type
        }
      }
      console.log(this.min_leave)
      console.log(this.max_leave)
      console.log(this.max_leave_hours)
    },
    checkSalesLeaveStart() {
      const that = this
      if (parseInt(this.modelType) === 10) {
        // 销假
        if (this.leaveday_start !== '' && this.leavetime_start === '') {
          const timeArr = this.min_leave.split(' ')
          this.leavetime_start = timeArr[1]
        }
        if (this.leaveday_end !== '' && this.leavetime_end === '') {
          const time1Arr = this.max_leave.split(' ')
          this.leavetime_end = time1Arr[1]
        }
        console.log(this.leaveday_start)
        console.log(this.leaveday_end)
        this.salesLeaveForm.startDate = this.leaveday_start + ' ' + this.leavetime_start
        this.salesLeaveForm.endDate = this.leaveday_end + ' ' + this.leavetime_end
        if (this.salesLeaveForm.startDate !== ' ') {
          const startTime = new Date(this.salesLeaveForm.startDate)
          var minTime = new Date(this.min_leave)
          var maxTime = new Date(this.max_leave)
          if (startTime < minTime) {
            this.$message({
              message: '销假开始时间不能小于请假开始时间',
              type: 'warning'
            })
            this.leaveday_start = ''
            this.leavetime_start = ''
            this.salesLeaveForm.startDate = ''
          } else if (startTime > maxTime) {
            this.$message({
              message: '销假开始时间不能大于请假结束时间',
              type: 'warning'
            })
            this.leaveday_start = ''
            this.leavetime_start = ''
            this.salesLeaveForm.startDate = ''
          } else {
            console.log('计算开始时间')
            isWorkDay({ date: this.salesLeaveForm.startDate }).then(res => {
              console.log(res)
              if (res.code === 200) {
                if (res.data.data === 'isnotworksday') {
                  this.$message({
                    message: res.data.msg,
                    type: 'warning'
                  })
                  this.leaveday_start = ''
                  this.leavetime_start = ''
                  this.salesLeaveForm.startDate = ''
                } else {
                  if (this.leaveday_start !== '' && this.leavetime_start !== '' && this.leaveday_end !== '' && this.leavetime_end !== '') {
                    const startTime = new Date(this.salesLeaveForm.startDate)
                    const endTime = new Date(this.salesLeaveForm.endDate)
                    this.leaveTime = (endTime - startTime) / 3600 / 1000
                    if (startTime > endTime) {
                      this.$message({
                        message: '结束时间不能小于开始时间',
                        type: 'warning'
                      })
                      this.salesLeaveForm.endDate = ''
                      this.salesLeaveForm.hours = 0
                    } else {
                      calcTime('/oa/leave-working', { start: this.salesLeaveForm.startDate, end: this.salesLeaveForm.endDate }).then(res => {
                        console.log(res)
                        if (res.code === 200) {
                          that.salesLeaveForm.hours = res.data.hours
                          console.log(that.salesLeaveForm.hours, 'f')
                          console.log(res.data.hours, 'fd')
                        }
                      })
                    }
                  } else {
                  // this.leaveForm.hours = 0
                    this.leaveTime = 100
                  }
                }
              }
            })
          }
        }
      }
    },
    checkSalesLeaveValue() {
      const that = this
      if (parseInt(this.modelType) === 10) {
        // 销假
        if (this.leaveday_start !== '' && this.leavetime_start === '') {
          const timeArr = this.min_leave.split(' ')
          this.leavetime_start = timeArr[1]
        }
        if (this.leaveday_end !== '' && this.leavetime_end === '') {
          const time1Arr = this.max_leave.split(' ')
          this.leavetime_end = time1Arr[1]
        }
        this.salesLeaveForm.startDate = this.leaveday_start + ' ' + this.leavetime_start
        this.salesLeaveForm.endDate = this.leaveday_end + ' ' + this.leavetime_end
        console.log(this.salesLeaveForm.startDate)
        console.log(this.salesLeaveForm.endDate)
        if (this.salesLeaveForm.endDate !== ' ') {
          const endTime = new Date(this.salesLeaveForm.endDate)
          var minTime = new Date(this.min_leave)
          var maxTime = new Date(this.max_leave)
          if (endTime < minTime) {
            this.$message({
              message: '销假开始时间不能小于请假开始时间',
              type: 'warning'
            })
            this.leaveday_end = ''
            this.leavetime_end = ''
            this.salesLeaveForm.endDate = ''
          } else if (endTime > maxTime) {
            this.$message({
              message: '销假开始时间不能大于请假结束时间',
              type: 'warning'
            })
            this.leaveday_end = ''
            this.leavetime_end = ''
            this.salesLeaveForm.endDate = ''
          } else {
            console.log('计算结束时间')
            isWorkDay({ date: this.salesLeaveForm.endDate }).then(res => {
              if (res.code === 200) {
                if (res.data.data === 'isnotworksday') {
                  this.$message({
                    message: res.data.msg,
                    type: 'warning'
                  })
                  this.leaveday_end = ''
                  this.leavetime_end = ''
                  this.salesLeaveForm.endDate = ''
                } else {
                  if (this.leaveday_start !== '' && this.leavetime_start !== '' && this.leaveday_end !== '' && this.leavetime_end !== '') {
                    const startTime = new Date(this.salesLeaveForm.startDate)
                    const endTime = new Date(this.salesLeaveForm.endDate)
                    // this.leaveForm.hours = Math.floor((endTime - startTime) / 3600 / 1000)
                    // this.leaveForm.hours = ((endTime - startTime) / 3600 / 1000).toFixed(2)
                    // this.leaveTime = Math.floor((endTime - startTime) / 3600 / 1000)
                    this.leaveTime = (endTime - startTime) / 3600 / 1000
                    // this.leaveTime = parseFloat(((endTime - startTime) / 3600 / 1000).toFixed(2))
                    if (startTime > endTime) {
                      this.$message({
                        message: '结束时间不能小于开始时间',
                        type: 'warning'
                      })
                      this.salesLeaveForm.endDate = ''
                      this.leaveday_end = ''
                      this.leavetime_end = ''
                      this.salesLeaveForm.hours = 0
                    } else {
                      calcTime('/oa/leave-working', { start: this.salesLeaveForm.startDate, end: this.salesLeaveForm.endDate }).then(res => {
                        console.log(res)
                        if (res.code === 200) {
                          that.salesLeaveForm.hours = res.data.hours
                        }
                      })
                    }
                  } else {
                  // this.leaveForm.hours = 0
                    this.leaveTime = 100
                  }
                }
              }
            })
          }
        }
      }
    },
    checkLeaveValueStart() {
      const that = this
      if (parseInt(this.modelType) === 6) {
        // 请假
        if (this.leaveday_start !== '' && this.leavetime_start === '') {
          this.leavetime_start = this.time_seting.sign_in
        }
        if (this.leaveday_end !== '' && this.leavetime_end === '') {
          this.leavetime_end = this.time_seting.sign_out
        }
        this.leaveForm.startDate = this.leaveday_start + ' ' + this.leavetime_start
        this.leaveForm.endDate = this.leaveday_end + ' ' + this.leavetime_end
        console.log(this.leaveForm.startDate)
        console.log(this.leaveForm.endDate)
        if (this.leaveForm.startDate !== ' ') {
          console.log('计算开始时间')
          isWorkDay({ date: this.leaveForm.startDate }).then(res => {
            console.log(res)
            if (res.code === 200) {
              if (res.data.data === 'isnotworksday') {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
                this.leaveday_start = ''
                this.leavetime_start = ''
                this.leaveForm.startDate = ''
              } else {
                if (this.leaveday_start !== '' && this.leavetime_start !== '' && this.leaveday_end !== '' && this.leavetime_end !== '') {
                  const startTime = new Date(this.leaveForm.startDate)
                  const endTime = new Date(this.leaveForm.endDate)
                  // this.leaveForm.hours = Math.floor((endTime - startTime) / 3600 / 1000)
                  // this.leaveForm.hours = ((endTime - startTime) / 3600 / 1000).toFixed(2)
                  // this.leaveTime = Math.floor((endTime - startTime) / 3600 / 1000)
                  this.leaveTime = (endTime - startTime) / 3600 / 1000
                  // this.leaveTime = parseFloat(((endTime - startTime) / 3600 / 1000).toFixed(2))
                  if (startTime >= endTime) {
                    this.$message({
                      message: '结束时间不能小于开始时间',
                      type: 'warning'
                    })
                    this.leaveForm.endDate = ''
                    this.leaveday_end = ''
                    this.leavetime_end = ''
                    this.leaveForm.hours = 0
                  } else {
                    calcTime('/oa/leave-working', { start: this.leaveForm.startDate, end: this.leaveForm.endDate }).then(res => {
                      console.log(res)
                      if (res.code === 200) {
                        that.leaveForm.hours = res.data.hours
                        console.log(that.leaveForm.hours, 'f')
                        console.log(res.data.hours, 'fd')
                      }
                    })
                  }
                } else {
                  // this.leaveForm.hours = 0
                  this.leaveTime = 100
                }
              }
            }
          })
        }
      }
    },
    checkLeaveValue() {
      const that = this
      if (parseInt(this.modelType) === 6) {
        // 请假
        if (this.leaveday_start !== '' && this.leavetime_start === '') {
          this.leavetime_start = this.time_seting.sign_in
        }
        if (this.leaveday_end !== '' && this.leavetime_end === '') {
          this.leavetime_end = this.time_seting.sign_out
        }
        this.leaveForm.startDate = this.leaveday_start + ' ' + this.leavetime_start
        this.leaveForm.endDate = this.leaveday_end + ' ' + this.leavetime_end
        console.log(this.leaveForm.startDate)
        console.log(this.leaveForm.endDate)
        if (this.leaveForm.endDate !== ' ') {
          console.log('计算结束时间')
          isWorkDay({ date: this.leaveForm.endDate }).then(res => {
            if (res.code === 200) {
              if (res.data.data === 'isnotworksday') {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
                this.leaveday_end = ''
                this.leavetime_end = ''
                this.leaveForm.endDate = ''
              } else {
                if (this.leaveday_start !== '' && this.leavetime_start !== '' && this.leaveday_end !== '' && this.leavetime_end !== '') {
                  const startTime = new Date(this.leaveForm.startDate)
                  const endTime = new Date(this.leaveForm.endDate)
                  // this.leaveForm.hours = Math.floor((endTime - startTime) / 3600 / 1000)
                  // this.leaveForm.hours = ((endTime - startTime) / 3600 / 1000).toFixed(2)
                  // this.leaveTime = Math.floor((endTime - startTime) / 3600 / 1000)
                  this.leaveTime = (endTime - startTime) / 3600 / 1000
                  // this.leaveTime = parseFloat(((endTime - startTime) / 3600 / 1000).toFixed(2))
                  if (startTime >= endTime) {
                    this.$message({
                      message: '结束时间不能小于开始时间',
                      type: 'warning'
                    })
                    this.leaveForm.endDate = ''
                    this.leaveForm.hours = 0
                  } else {
                    calcTime('/oa/leave-working', { start: this.leaveForm.startDate, end: this.leaveForm.endDate }).then(res => {
                      console.log(res)
                      if (res.code === 200) {
                        that.leaveForm.hours = res.data.hours
                      }
                    })
                  }
                } else {
                  // this.leaveForm.hours = 0
                  this.leaveTime = 100
                }
              }
            }
          })
        }
      }
    },
    dateChange(type, date) {
      if (date) {
        const nowTime = new Date().getTime()
        const pickTime = new Date(date).getTime()
        if (pickTime < nowTime) {
          console.log(111)
          if (type === 'start') {
            this.$message({
              message: '开始时间不能小于当前时间',
              type: 'warning'
            })
            this.visitForm.startDate = ''
          } else {
            this.$message({
              message: '结束时间不能小于当前时间',
              type: 'warning'
            })
            this.visitForm.endDate = ''
          }
        }
        if (this.visitForm.startDate !== '' && this.visitForm.endDate !== '') {
          const startTime = new Date(this.visitForm.startDate)
          const endTime = new Date(this.visitForm.endDate)
          if (startTime >= endTime) {
            this.$message({
              message: '结束时间不能小于开始时间',
              type: 'warning'
            })
            this.visitForm.endDate = ''
          }
        }
      }
    },
    sureSave(form) {
      const that = this
      // 判断报销明细
      let flag = true
      if (parseInt(this.modelType) === 4) {
        if (this.refundList.length > 0) {
          const block = this.refundList
          for (let i = 0; i < block.length; i++) {
            for (const item in block[i]) {
              if (block[i][item] === '') {
                this.$message.warning('报销明细不能为空')
                flag = false
                break
              }
            }
          }
          if (flag) {
            this.refundForm.items = JSON.stringify(this.refundList)
          }
        } else if (this.refundList.length <= 0) {
          this.$message.warning('请新增报销明细！')
          flag = false
        }
      }
      if (parseInt(this.modelType) === 9) {
      // 判断采购申请明细
        if (this.procurementList.length > 0) {
          const block = this.procurementList
          for (let i = 0; i < block.length; i++) {
            for (const item in block[i]) {
              if (block[i][item] === '') {
                this.$message.warning('采购申请明细不能为空')
                flag = false
                break
              }
            }
          }
          if (flag) {
            this.procurementapplyForm.items = JSON.stringify(
              this.procurementList
            )
          }
        } else if (this.procurementList.length <= 0) {
          this.$message.warning('请新增采购申请明细！')
          flag = false
        }
      }
      if (parseInt(this.modelType) === 1) {
        if (this.procurementForm.other === '0' || this.procurementForm.other === 0) {
          // 判断采购单明细
          if (this.procurementList1.length > 0) {
            const block = this.procurementList1
            for (let i = 0; i < block.length; i++) {
              for (const item in block[i]) {
                if (block[i][item] === '') {
                  this.$message.warning('采购单明细不能为空')
                  flag = false
                  break
                }
              }
            }
            if (flag) {
              this.procurementForm.items = JSON.stringify(
                this.procurementList1
              )
            }
          } else if (this.procurementList1.length <= 0) {
            this.$message.warning('请新增采购单明细！')
            flag = false
          }
        } else {
          this.procurementForm.items = ''
        }
      }
      if (parseInt(this.modelType) === 5) {
        var overhour_str = parseFloat(this.overtimeForm.hours).toFixed(1) + ''
        if (overhour_str[overhour_str.length - 1] !== '0' && overhour_str[overhour_str.length - 1] !== '5') {
          this.$message({
            message: '加班时长只能是.5或整数',
            type: 'warning'
          })
          flag = false
        }
        if (this.overtimeForm.hours > 10) {
          this.$message({
            message: '加班时长最多10小时',
            type: 'warning'
          })
          flag = false
        }
      }
      if (parseInt(this.modelType) === 6) {
        if (this.leaveForm.type === '3' || this.leaveForm.type === 3) {
          if (this.leaveForm.hours > this.temporaryTime) {
            this.$message({
              message: '请假时长不能大于可调休时长',
              type: 'warning'
            })
            this.leaveday_end = ''
            this.leavetime_end = ''
            this.leaveForm.endDate = ''
            this.leaveForm.hours = 0
          }
        }
        var hour_str = parseFloat(this.leaveForm.hours).toFixed(1) + ''
        console.log(hour_str)
        console.log(hour_str[hour_str.length - 1])
        if (hour_str[hour_str.length - 1] !== '0' && hour_str[hour_str.length - 1] !== '5') {
          this.$message({
            message: '请假时长只能是.5或整数',
            type: 'warning'
          })
          flag = false
        }
      }
      if (parseInt(this.modelType) === 10) {
        var sales_hour_str = parseFloat(this.salesLeaveForm.hours).toFixed(1) + ''
        console.log(sales_hour_str[sales_hour_str.length - 1])
        if (sales_hour_str[sales_hour_str.length - 1] !== '0' && sales_hour_str[sales_hour_str.length - 1] !== '5') {
          this.$message({
            message: '销假时长只能是.5或整数',
            type: 'warning'
          })
          flag = false
        }
        console.log(parseFloat(this.salesLeaveForm.hours))
        console.log(parseFloat(this.max_leave_hours))
        console.log(parseFloat(this.salesLeaveForm.hours) > parseFloat(this.max_leave_hours))
        if (parseFloat(this.salesLeaveForm.hours) > parseFloat(this.max_leave_hours)) {
          this.$message({
            message: '销假时长不能大于请假时长',
            type: 'warning'
          })
          flag = false
        }
        this.salesLeaveForm.type = this.sales_leave_type
      }
      this.$refs[form].validate(valid => {
        console.log(valid)
        if (valid) {
          let info = {}
          let title = ''
          switch (parseInt(this.modelType)) {
            case 1:
              info = this.procurementForm
              this.uploadFile = JSON.stringify(this.filesArr)
              info.files = this.uploadFile
              title = '采购添加成功！'
              console.log(info)
              break
            case 2:
              this.visitForm.accompany = this.accompanyList.join(',')
              info = this.visitForm
              title = '拜访添加成功！'
              break
            case 3:
              info = this.sealForm
              title = '用章申请添加成功！'
              break
            case 4:
            {
              info = this.refundForm
              this.uploadFile = JSON.stringify(this.filesArr)
              info.files = this.uploadFile
              title = '报销申请添加成功！'
              console.log(info)
              break
            }
            case 5:
              info = this.overtimeForm
              title = '加班申请添加成功！'
              break
            case 6:
              info = this.leaveForm
              title = '请假添加成功！'
              break
            case 7:
              info = this.carForm
              title = '用车申请添加成功！'
              break
            case 8:
              info = this.receiveForm
              title = '物品领用添加成功！'
              break
            case 9:
            {
              info = this.procurementapplyForm
              title = '采购申请单添加成功！'
              break
            }
            case 10:
              info = this.salesLeaveForm
              title = '销假添加成功！'
              break
          }
          if (this.divType === 'edit') {
            title = '更新成功！'
            if (parseInt(this.modelType) === 10) {
              info = {
                leaveId: this.salesLeaveForm.leaveId,
                startDate: this.salesLeaveForm.startDate,
                endDate: this.salesLeaveForm.endDate,
                hours: this.salesLeaveForm.hours,
                remark: this.salesLeaveForm.remark
              }
            }
          }
          console.log(info)
          if (flag) {
            this.submitting = true
            saveApprovalType(info, this.requestUrl).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: title,
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
      if (this.divType === 'new' || this.divType === 'edit') {
        console.log('重置表单')
        switch (parseInt(this.modelType)) {
          case 1:
            // title = '采购添加成功！'
            this.$refs['procurementForm'].resetFields()
            this.procurementForm = {
              processTypeId: '',
              title: '',
              orderNo: '',
              supplierID: '',
              other: 0,
              items: '',
              amount: 0,
              files: '',
              remark: ''
            }
            break
          case 2:
            // title = '拜访添加成功！'
            this.$refs['visitForm'].resetFields()
            this.visitForm = {
              processTypeId: '',
              title: '',
              customer: '',
              contact: '',
              destination: '',
              accompany: '',
              startDate: '',
              endDate: '',
              remark: ''
            }
            this.accompanyList = []
            break
          case 3:
            // 用章
            this.$refs['sealForm'].resetFields()
            this.sealForm = {
              processTypeId: '',
              title: '',
              type: '',
              useDate: '',
              remark: ''
            }
            break
          case 4:
            // title = '报销申请添加成功！'
            this.$refs['refundForm'].resetFields()
            this.refundForm = {
              processTypeId: '',
              title: '',
              items: '',
              file: '',
              amount: 0,
              name: '',
              bank: '',
              card: '',
              remark: ''
            }
            this.refundList = []
            break
          case 5:
            // title = '加班申请添加成功！'
            this.$refs['overtimeForm'].resetFields()
            this.overtimeForm = {
              processTypeId: '',
              title: '',
              type: '1',
              startDate: '',
              endDate: '',
              hours: '',
              remark: ''
            }
            this.overday_start = ''
            this.overtime_start = ''
            this.overday_end = ''
            this.overtime_end = ''
            break
          case 6:
            // title = '请假条添加成功！'
            this.$refs['leaveForm'].resetFields()
            this.leaveForm = {
              processTypeId: '',
              title: '',
              type: '',
              startDate: '',
              endDate: '',
              hours: '',
              contact: '',
              phone: '',
              remark: ''
            }
            this.leaveday_start = ''
            this.leavetime_start = ''
            this.leaveday_end = ''
            this.leavetime_end = ''
            break
          case 7:
            // 用车
            this.$refs['carForm'].resetFields()
            this.carForm = {
              processTypeId: '',
              title: '',
              type: '',
              useDate: '',
              isDriver: '',
              busNum: '',
              remark: ''
            }
            break
          case 8:
            // title = '物品领用添加成功！'
            this.$refs['receiveForm'].resetFields()
            this.receiveForm = {
              processTypeId: '',
              title: '',
              type: '',
              receiveDate: '',
              remark: ''
            }
            break
          case 9:
            // title = '采购申请申请单添加成功！'
            this.$refs['procurementapplyForm'].resetFields()
            this.procurementapplyForm = {
              processTypeId: '',
              title: '',
              items: '',
              remark: ''
            }
            this.procurementList = []
            break
          case 10:
            this.$refs['salesLeaveForm'].resetFields()
            this.salesLeaveForm = {
              processTypeId: '',
              leaveId: '',
              startDate: '',
              endDate: '',
              hours: '',
              remark: ''
            }
            this.leaveday_start = ''
            this.leavetime_start = ''
            this.leaveday_end = ''
            this.leavetime_end = ''
            break
        }
      } else {
        this.getList()
      }
      this.filesArr = []
      this.submitting = false
      this.fileList = []
      this.opinion = ''
      this.modelShow = false
    },
    resetForm() {
      if (this.divType === 'new' || this.divType === 'edit') {
        console.log('重置表单')
        switch (parseInt(this.modelType)) {
          case 1:
            // title = '采购添加成功！'
            this.$refs['procurementForm'].resetFields()
            this.procurementForm = {
              processTypeId: '',
              title: '',
              orderNo: '',
              supplierID: '',
              other: 0.00,
              items: '',
              amount: 0.00,
              files: '',
              remark: ''
            }
            this.procurementList1 = []
            break
          case 2:
            // title = '拜访添加成功！'
            this.$refs['visitForm'].resetFields()
            this.visitForm = {
              processTypeId: '',
              title: '',
              customer: '',
              contact: '',
              destination: '',
              accompany: '',
              startDate: '',
              endDate: '',
              remark: ''
            }
            this.accompanyList = []
            break
          case 3:
            // 用章
            this.$refs['sealForm'].resetFields()
            this.sealForm = {
              processTypeId: '',
              title: '',
              type: '',
              useDate: '',
              remark: ''
            }
            break
          case 4:
            // title = '报销申请添加成功！'
            this.$refs['refundForm'].resetFields()
            this.refundForm = {
              processTypeId: '',
              title: '',
              items: '',
              file: '',
              amount: 0,
              name: '',
              bank: '',
              card: '',
              remark: ''
            }
            this.refundList = []
            break
          case 5:
            // title = '加班申请添加成功！'
            this.$refs['overtimeForm'].resetFields()
            this.overtimeForm = {
              processTypeId: '',
              title: '',
              type: '1',
              startDate: '',
              endDate: '',
              hours: '',
              remark: ''
            }
            this.overday_start = ''
            this.overtime_start = ''
            this.overday_end = ''
            this.overtime_end = ''
            break
          case 6:
            // title = '请假条添加成功！'
            this.$refs['leaveForm'].resetFields()
            this.leaveForm = {
              processTypeId: '',
              title: '',
              type: '',
              startDate: '',
              endDate: '',
              hours: '',
              contact: '',
              phone: '',
              remark: ''
            }
            this.leaveday_start = ''
            this.leavetime_start = ''
            this.leaveday_end = ''
            this.leavetime_end = ''
            break
          case 7:
            // 用车
            this.$refs['carForm'].resetFields()
            this.carForm = {
              processTypeId: '',
              title: '',
              type: '',
              useDate: '',
              isDriver: '',
              busNum: '',
              remark: ''
            }
            break
          case 8:
            // title = '物品领用添加成功！'
            this.$refs['receiveForm'].resetFields()
            this.receiveForm = {
              processTypeId: '',
              title: '',
              type: '',
              receiveDate: '',
              remark: ''
            }
            break
          case 9:
            // title = '采购申请申请单添加成功！'
            this.$refs['procurementapplyForm'].resetFields()
            this.procurementapplyForm = {
              processTypeId: '',
              title: '',
              items: '',
              remark: ''
            }
            this.procurementList = []
            break
          case 10:
            this.$refs['salesLeaveForm'].resetFields()
            this.salesLeaveForm = {
              processTypeId: '',
              leaveId: '',
              startDate: '',
              endDate: '',
              hours: '',
              remark: ''
            }
            this.leaveday_start = ''
            this.leavetime_start = ''
            this.leaveday_end = ''
            this.leavetime_end = ''
            break
        }
      } else {
        this.getList()
      }
      this.filesArr = []
      this.submitting = false
      this.opinion = ''
      this.fileList = []
      // this.modelShow = false
    },
    closeModel() {
      if (this.divType === 'new' || this.divType === 'edit') {
        console.log('重置表单')
        switch (parseInt(this.modelType)) {
          case 1:
            // title = '采购添加成功！'
            this.$refs['procurementForm'].resetFields()
            this.procurementForm = {
              processTypeId: '',
              title: '',
              items: [{
                proName: '',
                proPrice: '',
                proNum: '',
                proAmount: 0.0
              },
              {
                proName: '',
                proPrice: '',
                proNum: '',
                proAmount: 0.0
              }
              ],
              orderNo: '',
              supplierID: '',
              other: 0,
              amount: 0,
              files: '',
              remark: ''
            }
            break
          case 2:
            // title = '拜访添加成功！'
            this.$refs['visitForm'].resetFields()
            this.visitForm = {
              processTypeId: '',
              title: '',
              customer: '',
              contact: '',
              destination: '',
              accompany: '',
              startDate: '',
              endDate: '',
              remark: ''
            }
            this.accompanyList = []
            break
          case 3:
            // 用章
            this.$refs['sealForm'].resetFields()
            this.sealForm = {
              processTypeId: '',
              title: '',
              subject: '',
              type: '',
              useDate: '',
              remark: ''
            }
            break
          case 4:
            // title = '报销申请添加成功！'
            this.$refs['refundForm'].resetFields()
            this.refundForm = {
              processTypeId: '',
              title: '',
              items: '',
              files: '',
              amount: 0,
              name: '',
              bank: '',
              card: '',
              remark: ''
            }
            this.refundList = []
            break
          case 5:
            // title = '加班申请添加成功！'
            this.$refs['overtimeForm'].resetFields()
            this.overtimeForm = {
              processTypeId: '',
              title: '',
              type: '1',
              startDate: '',
              endDate: '',
              hours: '',
              remark: ''
            }
            this.overday_start = ''
            this.overtime_start = ''
            this.overday_end = ''
            this.overtime_end = ''
            break
          case 6:
            // title = '请假条添加成功！'
            this.$refs['leaveForm'].resetFields()
            this.leaveForm = {
              processTypeId: '',
              title: '',
              type: '',
              startDate: '',
              endDate: '',
              hours: '',
              contact: '',
              phone: '',
              remark: ''
            }
            this.leaveday_start = ''
            this.leavetime_start = ''
            this.leaveday_end = ''
            this.leavetime_end = ''
            break
          case 7:
            // 用车
            this.$refs['carForm'].resetFields()
            this.carForm = {
              processTypeId: '',
              title: '',
              type: '',
              useDate: '',
              isDriver: '',
              busNum: '',
              remark: ''
            }
            break
          case 8:
            // title = '物品领用添加成功！'
            this.$refs['receiveForm'].resetFields()
            this.receiveForm = {
              processTypeId: '',
              title: '',
              type: '',
              receiveDate: '',
              remark: ''
            }
            break
          case 9:
            // title = '采购申请申请单添加成功！'
            this.$refs['procurementapplyForm'].resetFields()
            this.procurementapplyForm = {
              processTypeId: '',
              title: '',
              items: '',
              remark: ''
            }
            this.procurementList = []
            break
          case 10:
            this.$refs['salesLeaveForm'].resetFields()
            this.salesLeaveForm = {
              processTypeId: '',
              leaveId: '',
              startDate: '',
              endDate: '',
              hours: '',
              remark: ''
            }
            this.leaveday_start = ''
            this.leavetime_start = ''
            this.leaveday_end = ''
            this.leavetime_end = ''
            break
        }
      }
      this.filesArr = []
    }
  }
}

</script>
<style lang="less" scoped>
  .approval_bg {
    position: absolute;
    width: 100%;
    top: 0;
    // .search_btn {
    //   display: flex;
    //   align-items: center;
    //   justify-content: space-between;
    // }

    .approval_info {
      background: #fff;
      padding: 20px 10px;

        .add_list {
          list-style: none;
          padding-left: 18px;
          margin: 0;
          margin-bottom: 40px;
          border-top: 1px solid #fff;

          .new_title {
            font-family: "Arial Normal", "Arial";
            color: #333;
            font-size: 14px;
          }

          .new_block {
            display: flex;
            align-items: center;

            .block_card {
              border: 1px solid #e4e7ed;
              width: 200px;
              height: 70px;
              display: inline-flex;
              align-items: center;
              padding-left: 16px;
              margin-right: 10px;
              border-radius: 4px;

              img {
                width: 40px;
                height: 40px;
                margin-right: 10px;
              }

              .svg-icon {
                font-size: 40px;
              }

              i {
                font-family: "Arial Normal", "Arial";
                color: #333;
                font-size: 14px;
                font-style: normal;
              }
            }

            .block_card:hover {
              cursor: pointer;
              border: 1px solid rgb(64, 158, 255);

              i {
                color: rgb(64, 158, 255);
              }
            }
          }
        }

        .over_line_one {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .over_line_two {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
    }

    .approval_page {
      text-align: center;
      padding: 10px 0;
    }
  }

  .dialogModel {
    .short_scroll{
      height: 480px;
    }
    .small_scroll{
      height: 360px;
    }
    .new_form {
      height: 600px;
      overflow: scroll;
      overflow-x: hidden;
    }

    .view_info {
      height: 650px;
      overflow: scroll;
      overflow-x: hidden;
      padding: 10px 15px;
      position: relative;

      .status_icon {
        position: absolute;
        font-size: 120px;
        right: 100px;
        top: 90px;
      }

      .view_user {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e0e0e0;
        // margin: -30px 0;
        padding: 20px 10px;

        .view_user_img {
          width: 100px;
          height: 100px;
          margin: 0 10px;

          img {
            border-radius: 50%;
            width: 100%;
            height: 100%;
          }
        }

        .view_user_info {
          margin-left: 20px;

          h2 {
            font-size: 20px;
            color: #434343;
          }

          p {
            font-size: 14px;
          }

          .blue {
            color: rgba(51, 153, 255, 0.6);
          }

          .green {
            color: rgba(0, 153, 51, 0.6);
          }

          .red {
            color: rgba(255, 51, 102, 0.6);
          }
        }
      }

      .view_detail {
        margin: 20px 0;
        padding-bottom: 20px;
        border-bottom: 1px solid #e0e0e0;

        ul {
          list-style: none;
          padding: 0;
          padding-left: 20px;
          margin: 0;
          margin-top: 10px;

          li {
            padding: 5px 0;
            display: flex;

            .left_title {
              width: 100px;
            }
          }
        }
      }

      .view_steps {
        padding: 0 20px;

        .view_steps_block {
          border-left: 1px solid #e0e0e0;
          position: relative;
          min-height: 70px;

          .radio_status {
            width: 20px;
            height: 20px;
            background: #e4e4e4;
            border-radius: 50%;
            position: absolute;
            top: 0;
            left: 0;
            transform: translateX(-50%);
          }

          .green {
            background: #33cc66;
          }

          p {
            overflow: hidden;
            margin: 0;
            padding-bottom: 10px;

            .blue {
              color: #3399ff;
            }

            .red {
              color: rgba(255, 51, 102, 0.6);
            }

            span {
              font-size: 12px;
              color: #333333;
            }

            span:first-child {
              padding-left: 30px;
              padding-right: 10px;
            }

            span:last-child {
              float: right;
            }

            .view_remark {
              color: #868686;
              font-size: 14px;
              float: left;
              display: block;
            }
          }
        }

        .view_steps_block:last-child {
          border-left: none;
        }
      }
    }

    .modelForm {
      margin: 0 10px;

      .checkDep {
        position: relative;

        .red_star {
          position: absolute;
          left: -76px;
          font-size: 13px;
          font-family: "Arial Normal", "Arial";
          color: #f56c6c;
        }
      }

      .radio_list {
        .el-radio+.el-radio {
          margin-left: 0;
        }

        .el-radio {
          margin-right: 30px;
          width: 60px;
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

      .order_proList {
        padding: 10px 0;
        display: flex;
        align-items: center;

        .view_right {
          margin-right: 5px;
        }

        i {
          color: #999;
          font-size: 26px;
          margin: 0 5px;
        }

        .red {
          color: #ff2f2f;
        }

        .upload-demo {
          display: flex;
          align-items: center;
        }

        .el-upload-list__item:first-child {
          margin-top: 0 !important;
        }
      }
    }

    .view_approval {
      .view_line {
        overflow: hidden;
        padding: 10px 0;

        span {
          font-family: "微软雅黑 Regular", "微软雅黑";
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
        }
      }
    }

    .approval_form {
      margin: 0 15px;
      h1 {
        text-align: center;
        margin: 0;
        margin-bottom: 20px;
      }

      .car_view {
        .view_tips {
          display: flex;
          justify-content: space-between;

          span {
            font-family: "微软雅黑 Bold", "微软雅黑";
            font-size: 14px;
            font-weight: 700;
          }
        }

        .view_table {
          border-collapse: collapse;
          margin: 0 auto;
          width: 100%;

          td {
            border: 1px solid #333333;
            padding: 10px 5px;
            text-align: center;

            a {
              color: #409eff;
              text-decoration: underline;
            }
          }

          .td_title {
            color: #333333;
            font-size: 13px;
            font-weight: 700;
            width: 200px;
            text-align: center;
          }

        }

        .view_step {
          margin: 10px 0;
        }

        .view_comments {
          display: flex;
          align-items: center;
          margin: 10px 0;

          span {
            width: 100px;
          }
        }

        .view_btn {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-top: 30px;
        }
      }
    }

    .form_btn {
      text-align: right;
      padding-top: 20px;
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
