<template>
  <div>
    <div class="business_bg">
      <!-- <my-alert title="温馨提示：被指派的商机如果15天没有跟进则会自动掉入公海，还请及时跟进。" /> -->
      <!-- <el-alert
        title="温馨提示：被指派的商机如果15天没有跟进则会自动掉入公海，还请及时跟进"
        type="warning"/> -->
      <div class="fifter">
        <my-tabs
          :page-name="page_name"
          :module-name="module_name"
          :module-type="'1'"
          :allow-fifter="isFifter"
          :add="btnPermission('agent_agentbusinesscreate')&&isFifter"
          :active-name="searchInfo.mode"
          :tabs-list="tabsList"
          @addAction="addBusiness"
          @handleClick="choseType"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)"/>
          <!-- <search-fifter
          :download-url="downloadUrl"
          :upload-url="uploadUrl"
          :import-show="btnPermission('agent_agentbusinessimport')"
          :export-show="btnPermission('agent_agentbusinessexport')"
          :export-type="moduleType"
          :export-name="'商机列表'"
          :module-name="'agent'"
          @importAction="importAction"/> -->
      </div>
      <div class="bussiness_info">
        <div v-if="searchInfo.mode!='flowingseas'" class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}个商机，已选中{{ choseTotal }}条</span>
            <el-button v-if="(searchInfo.mode=='createbyme'||searchInfo.mode=='public')&&btnPermission('agent_batchreceive')" plain size="mini" @click="batchstop('receive')">批量领取</el-button>
          </div>
          <div class="export_btn">
            <search-fifter
              :download-url="downloadUrl"
              :upload-url="uploadUrl"
              :import-show="btnPermission('agent_agentbusinessimport')"
              :export-show="btnPermission('agent_agentbusinessexport')"
              :export-type="moduleType"
              :export-name="'商机列表'"
              :module-name="'agent'"
              @importAction="importAction"/>
          </div>
        </div>
        <div v-if="searchInfo.mode!='flowingseas'">
          <el-table
            v-loading="loading"
            ref="multipleTable"
            :data="tableData"
            :max-height="tableHeight"
            :default-sort = "{prop: 'id', order: 'descending'}"
            border
            row-key="id"
            tooltip-effect="light"
            @sort-change="fifterTable"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" min-width="40" fixed="left" align="center"/>
            <el-table-column prop="business_name" label="商机名" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.business_name }}</template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column prop="sex" label="性别" min-width="100">
              <template slot-scope="scope">{{ scope.row.sex==1?'男':'女' }}</template>
            </el-table-column>
            <el-table-column prop="phone" label="联系方式" min-width="150px" show-overflow-tooltip/>
            <el-table-column prop="wechat" label="微信号" min-width="120px" show-overflow-tooltip/>
            <el-table-column prop="qq" label="QQ" min-width="120px" show-overflow-tooltip/>
            <el-table-column prop="email" label="邮箱" min-width="140px" show-overflow-tooltip/>
            <el-table-column prop="source" label="来源" ortable show-overflow-tooltip min-width="150px"/>
            <el-table-column prop="salesId" label="归属人" min-width="120" show-overflow-tooltip/>
            <el-table-column prop="createdBy" label="创建人" min-width="120" show-overflow-tooltip/>
            <el-table-column prop="appointDate" label="指派时间" sortable="custom" min-width="140" show-overflow-tooltip/>
            <el-table-column prop="assignDate" label="上次跟进时间" sortable="custom" min-width="140" show-overflow-tooltip/>
            <el-table-column v-if="searchInfo.mode=='ignore'" prop="ignoreDate" label="忽略时间" sortable="custom" min-width="140" show-overflow-tooltip/>
            <el-table-column v-if="searchInfo.mode=='ignore'" label="忽略类型" width="100px">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.ignoreType==0" type="warning">流入公海</el-tag>
                <el-tag v-if="scope.row.ignoreType==1" >主动忽略</el-tag>
              </template>
            </el-table-column>
            <el-table-column v-if="searchInfo.mode!='ignore'&&total>0" label="操作" width="220" align="center" fixed="right">
              <template slot-scope="scope">
                <div v-if="searchInfo.mode=='all'">
                  <el-button v-if="btnPermission('agent_agentbusinessappoint')" type="text" size="small" @click="viewFllow(scope.row,'view')">查看</el-button>
                  <el-button v-if="btnPermission('agent_agentbusinessappoint')" type="text" size="small" @click="showModel(scope.row,'assign')">指派</el-button>
                  <el-button v-if="btnPermission('agent_receive')" :disabled="scope.row.salesId!=''" type="text" size="small" @click="receive(scope.row)">领取</el-button>
                </div>
                <div v-if="searchInfo.mode=='assign'">
                  <el-button v-if="btnPermission('agent_agentbusinessappoint')" type="text" size="small" @click="viewFllow(scope.row,'view')">查看</el-button>
                  <el-button type="text" size="small" @click="goFllow(scope.row)">跟进</el-button>
                  <el-button v-if="btnPermission('agent_agentbusinessappoint')" type="text" size="small" @click="showModel(scope.row,'assign')">指派</el-button>
                  <el-button type="text" size="small" @click="ignoreBussiness(scope.row)">忽略</el-button>
                </div>
                <div v-if="searchInfo.mode=='public'">
                  <el-button v-if="btnPermission('agent_agentbusinessappoint')" type="text" size="small" @click="viewFllow(scope.row,'view')">查看</el-button>
                  <el-button v-if="btnPermission('agent_agentbusinessappoint')" type="text" size="small" @click="showModel(scope.row,'assign')">指派</el-button>
                  <el-button v-if="btnPermission('agent_receive')" type="text" size="small" @click="receive(scope.row)">领取</el-button>
                  <el-button v-if="btnPermission('agent_cancellation')" :disabled="scope.row.isdeleted=='false'" type="text" size="small" @click="changeStates(scope.row, 'public')">作废</el-button>
                </div>
                <div v-if="searchInfo.mode=='createbyme'">
                  <el-button v-if="btnPermission('agent_agentbusinessappoint')" type="text" size="small" @click="viewFllow(scope.row,'view')">查看</el-button>
                  <el-button type="text" size="small" @click="showModel(scope.row,'edit')">编辑</el-button>
                  <el-button v-if="btnPermission('agent_agentbusinessappoint')" type="text" size="small" @click="showModel(scope.row,'assign')">指派</el-button>
                  <el-button :disabled="scope.row.isdeleted=='false'||scope.row.appointDate!=''" type="text" size="small" @click="changeStates(scope.row, 'my')">作废</el-button>
                  <el-button v-if="btnPermission('agent_receive')" :disabled="scope.row.salesId!=''" type="text" size="small" @click="receive(scope.row)">领取</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column v-if="searchInfo.mode=='ignore'&&total>0" label="操作" width="220" align="center" fixed="right">
              <template slot-scope="scope">
                <!-- 权限绑定 是否禁用 -->
                <el-button v-if="btnPermission('agent_receive')" :disabled="scope.row.status!=3" type="text" size="small" @click="receive(scope.row)">领取</el-button>
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
        <div v-if="searchInfo.mode=='flowingseas'">
          <div class="flowing_seas">
            商机<el-input v-model="flowingSeas.alreadyTime" style="width:100px;margin:0 10px" @input="changeIput($event,'already')" />天未跟进 , 流入公海
          </div>
          <div class="flowing_seas">
            商机<el-input v-model="flowingSeas.aboutTime" style="width:100px;margin:0 10px" @input="changeIput($event,'about')"/>天未跟进 , 即将流入公海
          </div>
          <div class="save_seas">
            <el-button :loading="submit" type="primary" @click="saveSeas">保存</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="modelShow" :title="modelTitle" class="dialogModel" @close="resetModel">
      <el-scrollbar class="fixed_scroll over_scroll">
        <!-- 新建商机 -->
        <el-form
          v-if="(modelType=='business'||modelType=='edit')&&modelShow"
          ref="businessForm"
          :model="businessForm"
          :rules="businessRules"
          class="modelForm"
          label-width="110px"
          label-position="right">
          <el-form-item label="商机名称：" prop="business_name">
            <el-input v-model.trim="businessForm.business_name" autocomplete="off" style="width:500px" placeholder="请输入商机名称"/>
          </el-form-item>
          <el-form-item label="姓名：" prop="name">
            <el-input v-model.trim="businessForm.name" autocomplete="off" style="width:500px" placeholder="请输入姓名"/>
          </el-form-item>
          <el-form-item label="性别：" prop="sex">
            <el-radio-group v-model="businessForm.sex" placeholder="请选择性别">
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="手机号：" prop="phone">
            <el-input v-model.trim="businessForm.phone" autocomplete="off" style="width:500px" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="微信号：" prop="wechat">
            <el-input v-model.trim="businessForm.wechat" autocomplete="off" style="width:500px" placeholder="请输入微信号" />
          </el-form-item>
          <el-form-item label="部门职务：" prop="job">
            <el-input v-model.trim="businessForm.job" autocomplete="off" style="width:500px" placeholder="请输入部门职务" />
          </el-form-item>
          <el-form-item label="省市区：">
            <el-cascader ref="areasName" :options="areaList" v-model="businessForm.areas" style="width:500px" placeholder="请选择省市区" @change="getAreasValue"/>
          </el-form-item>
          <el-form-item label="详细地址：">
            <el-input :rows="4" v-model.trim="businessForm.address" type="textarea" style="width:500px" placeholder="请输入详细地址，最大长度为120个字"/>
          </el-form-item>
          <el-form-item label="来源：">
            <el-input v-model.trim="businessForm.source" autocomplete="off" style="width:500px" placeholder="请输入来源"/>
          </el-form-item>
          <el-form-item label="QQ号：" prop="qq">
            <el-input v-model.trim="businessForm.qq" autocomplete="off" style="width:500px" placeholder="请输入QQ号"/>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model.trim="businessForm.email" autocomplete="off" style="width:500px" placeholder="请输入邮箱"/>
          </el-form-item>
          <!-- <el-form-item label="邮箱：" prop="email">
            <el-input v-model.trim="businessForm.email" autocomplete="off" style="width:500px" placeholder="请输入邮箱"/>
          </el-form-item> -->
          <el-form-item label="生日：" prop="birthday">
            <el-date-picker
              v-model="businessForm.birthday"
              style="width:500px"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间"/>
          </el-form-item>
        </el-form>
        <!-- 指派商机 -->
        <el-form
          v-if="modelType=='assign'&&modelShow"
          ref="assignForm"
          :model="assignForm"
          :rules="assignRules"
          class="modelForm"
          label-width="100px"
          label-position="left">
          <el-form-item label="原归属人：">
            <el-input v-model="assignForm.oldsald" autocomplete="off" disabled="disabled" style="width:500px" />
          </el-form-item>
          <el-form-item label="指派：" prop="salesId">
            <el-select v-model="assignForm.salesId" placeholder="请选择指派对象" style="width:500px">
              <el-option v-for="(item,index) in assignList" :label="item.label" :value="item.value" :key="index"/>
            </el-select>
          </el-form-item>
          <el-form-item label="指派原因：" prop="remarks">
            <el-input :rows="4" v-model="assignForm.remarks" type="textarea" placeholder="请输人内容，最大长度为120个字" style="width:500px" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <!-- 转化商机 -->
      <div slot="footer" class="dialog-footer">
        <el-button v-if="modelType!='edit'" @click="restForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">{{ sureBtn }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getBusinessInfo,
  saveBusiness,
  editAgent,
  addAppointLabel,
  saveAppoint,
  addTransformationLabel,
  saveTransformation,
  banAgent,
  banAgentbyMy,
  businessReservice,
  agentreceive,
  agentIngore,
  saveSeas,
  getSeasInfo
  // getsalelist
} from '@/api/agent'
import { getAreaList } from '@/api/public'
// eslint-disable-next-line no-unused-vars
import { btnPermission } from '@/permission.js' // 按钮权限和页面权限
// import list from '@/assets/citys.json'
export default {
  name: 'Business',
  data() {
    return {
      isFifter: true,
      flowingSeas: {
        aboutTime: '',
        alreadyTime: ''
      },
      uploadUrl: '',
      downloadUrl: '',
      moduleType: '/agent/agent-agentbusinessexport',
      page_name: 'agent',
      module_name: 'agent',
      choseTotal: 0,
      tabsList: [
        { label: '全部商机', name: 'all' },
        { label: '指派给我', name: 'assign' },
        { label: '由我忽略', name: 'ignore' },
        { label: '公共线索', name: 'public' },
        { label: '由我创建', name: 'createbyme' },
        { label: '流入公海', name: 'FlowingSeas' }
      ],
      tableData: [],
      isShow: true,
      loading: true,
      modelType: '',
      modelTitle: '',
      modelShow: false,
      sureBtn: '确 定',
      agentLevelList: [],
      assignList: [],
      assignId: '',
      assignForm: {
        oldsald: '',
        salesId: '',
        remarks: ''
      },
      businessForm: {
        business_name: '',
        name: '',
        sex: '1',
        phone: '',
        wechat: '',
        job: '',
        source: '',
        qq: '',
        email: '',
        birthday: ''
      },
      tableHeight: 250,
      assignRules: {
        salesId: [{
          required: true,
          message: '指派对象不能为空',
          trigger: 'change'
        }],
        remarks: [{
          required: true,
          message: '指派原因不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '指派原因长度超出范围1-120位之间', trigger: 'blur' }
        ]
      },
      rules1: {
        levleId: [{
          required: true,
          message: '经销商等级不能为空',
          trigger: 'change'
        }],
        areas: [{
          required: true,
          message: '所在城市不能为空',
          trigger: 'change'
        }]
      },
      businessRules: {
        business_name: [{
          required: true,
          message: '商机名称不能为空',
          trigger: 'blur'
        }, {
          min: 2,
          max: 20,
          message: '商机名称的长度为2-20',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '姓名不能为空',
          trigger: 'blur'
        }, {
          min: 2,
          max: 20,
          message: '姓名的长度为2-20',
          trigger: 'blur'
        }],
        sex: [{
          required: true,
          message: '性别不能为空',
          trigger: 'change'
        }],
        phone: [{
          required: false,
          message: '手机号不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^[1][0-9]{10}$/,
          message: '手机号格式错误',
          trigger: 'blur'
        }],
        wechat: [{
          required: false,
          message: '微信号不能为空',
          trigger: 'blur'
        }],
        job: [{
          required: true,
          message: '部门职务不能为空',
          trigger: 'blur'
        }, {
          min: 2,
          max: 20,
          message: '部门职务的长度为2-20',
          trigger: 'blur'
        }],
        qq: [{
          pattern: /^[1-9][0-9]{4,10}$/,
          message: 'QQ号格式错误',
          trigger: 'blur'
        }],
        email: [
          {
            pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
            message: '邮箱格式错误',
            trigger: 'blur'
          }],
        birthday: [
          {
            required: false,
            message: '请选择生日',
            trigger: 'change'
          }
        ]
      },
      searchInfo: {
        type: 'agent',
        mode: 'all', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      areaList: [],
      total: 0, // 总条数
      submitting: false,
      submit: false,
      selectArr: []
    }
  },
  mounted() {
    this.uploadUrl = process.env.BASE_API + 'agent/agent-import-agentbusiness.json'
    this.downloadUrl = process.env.BASE_API + 'data/download/商机模板.xls'
    if (this.btnPermission('agent_agentbusinessall') === false) {
      this.searchInfo.mode = 'assign'
      if (this.btnPermission('agent_commonalityget') === false) {
        this.tabsList = [
          { label: '指派给我', name: 'assign' },
          { label: '由我忽略', name: 'ignore' },
          { label: '公共线索', name: 'public' },
          { label: '由我创建', name: 'createbyme' }
        ]
      } else {
        this.tabsList = [
          { label: '指派给我', name: 'assign' },
          { label: '由我忽略', name: 'ignore' },
          { label: '公共线索', name: 'public' },
          { label: '由我创建', name: 'createbyme' },
          { label: '流入公海', name: 'flowingseas' }
        ]
      }
    } else {
      if (this.btnPermission('agent_commonalityget') === false) {
        this.tabsList = [
          { label: '全部商机', name: 'all' },
          { label: '指派给我', name: 'assign' },
          { label: '由我忽略', name: 'ignore' },
          { label: '公共线索', name: 'public' },
          { label: '由我创建', name: 'createbyme' }
        ]
        console.log('22')
      } else {
        this.tabsList = [
          { label: '全部商机', name: 'all' },
          { label: '指派给我', name: 'assign' },
          { label: '由我忽略', name: 'ignore' },
          { label: '公共线索', name: 'public' },
          { label: '由我创建', name: 'createbyme' },
          { label: '流入公海', name: 'flowingseas' }
        ]
        console.log('11')
      }
      if (this.$route.query.tab === 'assign') {
        const activeTab = this.$route.query.tab
        console.log(this.$route.query.tab)
        this.searchInfo.mode = activeTab
      } else {
        this.searchInfo.mode = 'all'
      }
    }
    // 获取列表
    this.getList()
    this.getOtherList()
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
        this.$confirm('确定要批量领取商机吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          businessReservice(obj).then(res => {
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
    changeIput(e, type) {
      if (type == 'already') {
        this.flowingSeas.alreadyTime = e.replace(/[^\d]/g, '')
      } else {
        this.flowingSeas.aboutTime = e.replace(/[^\d]/g, '')
      }
      this.$forceUpdate()
    },
    saveSeas() {
      const that = this
      if (this.flowingSeas.alreadyTime != '' && this.flowingSeas.aboutTime != '') {
        if (parseInt(this.flowingSeas.alreadyTime) <= parseInt(this.flowingSeas.aboutTime)) {
          this.$message({
            message: '流入公海天数必须大于即将流入公海天数',
            type: 'warning'
          })
        } else {
          that.submit = true
          var obj = {
            already: that.flowingSeas.alreadyTime,
            soon: that.flowingSeas.aboutTime
          }
          saveSeas(obj).then(res => {
            console.log(res)
            that.submit = false
            if (res.code === 200 || res.code === '200') {
              this.$message({
                message: '流入公海保存成功！',
                type: 'success'
              })
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
        this.$message({
          message: '流入公海和即将流入公海天数都不能为空',
          type: 'warning'
        })
      }
    },
    getAreasValue() {
      console.log(this.$refs['areasName'].getCheckedNodes()[0].pathLabels)
      const arr = this.$refs['areasName'].getCheckedNodes()[0].pathLabels
      this.businessForm.areasName = arr.join(',')
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
      if (this.modelType === 'business') {
        this.$refs['businessForm'].resetFields()
        this.businessForm = {
          business_name: '',
          name: '',
          sex: '1',
          phone: '',
          wechat: '',
          job: '',
          source: '',
          qq: '',
          birthday: '',
          email: ''
        }
      } else if (this.modelType === 'assign') {
        this.$refs['assignForm'].resetFields()
        this.assignForm = {
          oldsald: this.assignForm.oldsald,
          salesId: '',
          remarks: ''
        }
      }
    },
    // resetModel() {
    //   if (this.modelType === 'proxy') {
    //     console.log('重置表单')
    //     // this.$refs['proxyInfoForm'].resetFields()
    //     this.proxyInfoForm = {
    //     }
    //     this.proxyInfoForm.businessId = ''
    //   } else {
    //     // this.$refs['assignForm'].resetFields()
    //     this.assignForm = {
    //     }
    //   }
    //   this.modelShow = false
    //   this.submitting = false
    // },
    getList() {
      const that = this
      // 获取商机列表
      if (that.searchInfo.mode == 'flowingseas') {
        getSeasInfo().then(res => {
          that.loading = false
          if (res.code === 200 || res.code === '200') {
            that.flowingSeas = res.data
          }
        })
      } else {
        getBusinessInfo(this.searchInfo).then(res => {
          console.log(this.searchInfo)
          that.loading = false
          if (res.code === 200 || res.code === '200') {
            that.tableData = res.data.agent
            that.total = res.data.pager.recTotal // 总条数
          }
        })
      }
    },
    getOtherList() {
      const that = this
      // 获取省市区信息
      getAreaList().then(res => {
        console.log(res)
        that.areaList = res.data
      })
      // getsalelist().then(res => {
      //   console.log(res)
      //   that.assignList = res.data
      // })
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
    addBusiness() {
      this.modelTitle = '创建商机'
      this.modelType = 'business'
      this.modelShow = true
      this.sureBtn = '保 存'
    },
    findFifter(value) {
      console.log(value)
    },
    choseType(value) {
      this.searchInfo.mode = value
      this.searchInfo.pageID = 1
      this.tableData = []
      this.searchInfo.orderBy = ''
      this.loading = true
      if (value == 'flowingseas') {
        this.isFifter = false
      } else {
        this.isFifter = true
      }
      this.getList()
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
    changeStates(data, type) {
      const that = this
      this.$confirm('确定要作废此商机吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type === 'public') {
          banAgent(data.id).then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                message: '作废成功',
                type: 'success'
              })
              that.getList()
            } else {
              that.$message({
                message: '作废失败',
                type: 'warning'
              })
            }
          })
        } else {
          // 由我创建的作废
          banAgentbyMy(data.id).then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                message: '作废成功',
                type: 'success'
              })
              that.getList()
            } else {
              that.$message({
                message: '作废失败',
                type: 'warning'
              })
            }
          })
        }
      }).catch(() => {
        console.log('取消')
      })
    },
    receive(data) {
      const that = this
      this.$confirm('确定领取此商机吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        agentreceive(data.id).then(res => {
          if (res.code === 200 || res.code === '200') {
            that.$message({
              message: '操作成功',
              type: 'success'
            })
            that.getList()
          } else {
            that.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    handleChange(value) {
      console.log(value)
    },
    goFllow(data) {
      this.isShow = false
      this.$router.push({
        path: '/agent/bussinessIndex/follow?id=' + data.id + '&choseType=' + this.searchInfo.mode + '&type=' + 'follow'
      })
    },
    ignoreBussiness(data) {
      this.$prompt('忽略的商机将进入公共线索中，确定要“忽略”吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请填写忽略理由',
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '忽略理由不能为空'
      }).then(({ value }) => {
        const info = {
          remark: value
        }
        const that = this
        console.log(info)
        agentIngore(data.id, info).then(res => {
          if (res.code === 200 || res.code === '200') {
            that.$message({
              message: '操作成功',
              type: 'success'
            })
            that.getList()
          } else {
            that.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    viewFllow(data) {
      this.isShow = false
      this.$router.push({
        path: '/agent/bussinessIndex/follow?id=' + data.id + '&choseType=' + this.searchInfo.mode + '&type=' + 'view'
      })
    },
    showModel(data, type) {
      const that = this
      this.modelType = type
      this.modelShow = true
      if (type === 'assign') {
        this.modelTitle = '指派'
        this.assignId = data.id
        addAppointLabel(data.id).then(res => {
          console.log(res, '444')
          if (res.code === 200) {
            that.assignForm.oldsald = res.data.agentInfo
            that.assignList = res.data.selectList
          }
        })
      } else if (type === 'conversion') {
        this.modelTitle = '转换'
        this.assignId = data.id
        addTransformationLabel().then(
          res => {
            if (res.code === 200) {
              that.agentLevelList = res.data
            }
          })
      } else {
        this.modelTitle = '编辑商机'
        this.assignId = data.id
        this.sureBtn = '保 存'
        this.businessForm = {
          id: data.id,
          business_name: data.business_name,
          name: data.name,
          sex: data.sex,
          phone: data.phone,
          wechat: data.wechat,
          job: data.job,
          source: data.source,
          qq: data.qq,
          email: data.email,
          birthday: data.birthday !== '0000-00-00' ? data.birthday : '',
          areas: [data.provinceId, data.cityId, data.areaId],
          address: data.address
        }
      }
    },
    saveModel() {
      const that = this
      if (this.modelType === 'business') {
        // 保存商机
        this.$refs['businessForm'].validate((valid) => {
          if (valid) {
            if (this.businessForm.phone == '' && this.businessForm.wechat == '') {
              that.$message({
                message: '手机号和微信号必须填一个',
                type: 'warning'
              })
            } else {
              that.submitting = true
              console.log(this.businessForm)
              saveBusiness(this.businessForm).then(res => {
                console.log(res)
                that.submitting = false
                if (res.code === 200 || res.code === '200') {
                  this.$message({
                    message: '商机添加成功！',
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
      } else if (this.modelType === 'edit') {
        // 编辑商机
        this.$refs['businessForm'].validate((valid) => {
          if (valid) {
            if (this.businessForm.phone == '' && this.businessForm.wechat == '') {
              that.$message({
                message: '手机号和微信号必须填一个',
                type: 'warning'
              })
            } else {
              console.log(this.businessForm)
              editAgent(this.businessForm).then(res => {
                console.log(res)
                if (res.code === 200 || res.code === '200') {
                  this.$message({
                    message: '更新成功！',
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
      } else if (this.modelType === 'assign') {
        // 指派
        this.$refs['assignForm'].validate((valid) => {
          if (valid) {
            console.log(this.assignForm)
            saveAppoint(this.assignId, this.assignForm).then(res => {
              console.log(res)
              if (res.code === 200 || res.code === '200') {
                this.$message({
                  message: '指派成功！',
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
            console.log('error submit!!')
            // this.$message.warning('信息填写不完整或者信息填写有误！')
            this.$nextTick(() => {
              this.checkFormErr()
            })
            return false
          }
        })
      } else if (this.modelType === 'conversion') {
        this.$refs['conversionForm'].validate((valid) => {
          if (valid) {
            console.log(this.conversionForm)
            saveTransformation(this.assignId, this.conversionForm).then(res => {
              console.log(res)
              if (res.code === 200 || res.code === '200') {
                this.$message({
                  message: '商机转化成功！',
                  type: 'success'
                })
                // that.$refs['conversionForm'].resetFields()
                that.resetModel()
                // that.modelShow = false
                that.getList()
              } else {
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
          } else {
            console.log('error submit!!')
            // this.$message.warning('信息填写不完整或者信息填写有误！')
            this.$nextTick(() => {
              this.checkFormErr()
            })
            return false
          }
        })
      }
    },
    resetModel() {
      console.log(this.modelType)
      if (this.modelType === 'business' || this.modelType === 'edit') {
        this.$refs['businessForm'].resetFields()
        this.businessForm = {
          name: '',
          business_name: '',
          sex: '1',
          phone: '',
          wechat: '',
          job: '',
          source: '',
          qq: '',
          email: '',
          birthday: ''
        }
      } else if (this.modelType === 'assign') {
        this.$refs['assignForm'].resetFields()
        this.assignForm.salesId = ''
        this.assignForm.remarks = ''
      }
      this.modelShow = false
    }
  }
}

</script>
<style lang="less" scoped>
.flowing_seas{
  border:1px solid #e4e4e4;
  background: #f9fafc;
  padding: 30px 20px;
  margin-bottom: 20px;
  color: #777;
}
.save_seas{
  text-align: right
}
  .business_bg {
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
