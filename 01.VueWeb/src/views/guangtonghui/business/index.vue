<template>
  <div>
    <div class="business_bg">
      <!-- <my-alert title="警告：你的商机<a style='text-decoration: underline; cursor: pointer;font-weight: 700;'>O-20180005</a>有已经有29天没有跟进了，请尽快跟进联系，否则该商机将直接进入公海池。" @warning_close="close"/> -->
      <div class="fifter">
        <search-fifter
          :add="btnPermission('gthagent_create')"
          :download-url="downloadUrl"
          :upload-url="uploadUrl"
          :fifter="true"
          :delay-fifter="loading==false"
          :add-text="'创建商机'"
          :import-show="btnPermission('gthagent_import')"
          :export-show="btnPermission('gthagent_export')"
          :export-type="moduleType"
          :export-name="'商机列表'"
          :module-name="'gthagent'"
          @addAction="addBusiness"
          @search="fifterSearch"
          @importAction="importAction" />
      </div>
      <div class="bussiness_info">
        <el-tabs v-model="searchInfo.mode" type="card" class="tabs_table" @tab-click="choseType">
          <el-tab-pane v-if="btnPermission('gthagent_agentbusinessall')" label="全部商机" name="all">
            <el-table v-loading="loading" ref="table1" :data="tableData" :max-height="tableHeight" style="width: 100%" tooltip-effect="light" @sort-change="fifterTable" >
              <!-- <el-table-column type="selection" width="55" /> -->
              <el-table-column width="20" />
              <!-- <el-table-column prop="id" label="编号" width="180"  /> -->
              <!-- <el-table-column prop="name" label="姓名" width="180"  /> -->
              <el-table-column prop="sex" show-overflow-tooltip label="姓名" >
                <template slot-scope="scope">{{ scope.row.name }}</template>
              </el-table-column>
              <el-table-column prop="sex" label="性别" >
                <template slot-scope="scope">{{ scope.row.sex==1?'男':'女' }}</template>
              </el-table-column>
              <el-table-column prop="phone" show-overflow-tooltip label="联系方式" min-width="100px"/>
              <el-table-column prop="wechat" show-overflow-tooltip label="微信号" min-width="100px"/>
              <el-table-column prop="qq" show-overflow-tooltip label="QQ" min-width="100px"/>
              <el-table-column prop="email" show-overflow-tooltip label="邮箱" min-width="100px" />
              <el-table-column prop="source" show-overflow-tooltip label="来源" min-width="100px" />
              <el-table-column prop="salesId" show-overflow-tooltip label="归属人" min-width="100px" />
              <el-table-column prop="assignDate" label="上次跟进时间" sortable="custom" min-width="140px" show-overflow-tooltip/>
              <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                  <!-- <el-button v-if="btnPermission('gthagent_assign')" type="text" size="small" @click="goFllow(scope.row)">跟进</el-button> -->
                  <el-button v-if="btnPermission('gthagent_appoint')" type="text" size="small" @click="showModel(scope.row,'assign')">指派</el-button>
                  <!-- <el-button v-if="btnPermission('agent_transformation')" type="text" size="small" @click="showModel(scope.row,'conversion')">转化</el-button> -->
                  <!-- <el-button type="text" size="small" disabled="disabled" @click="ignoreBy(scope.row)" v-if="btnPermission('agent_agentingore')">忽略</el-button> -->
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="指派给我" name="assign">
            <el-table v-loading="loading" ref="table2" :data="tableData" :max-height="tableHeight" style="width: 100%" tooltip-effect="light" @sort-change="fifterTable" >
              <!-- <el-table-column type="selection" width="55" /> -->
              <el-table-column width="20" />
              <!-- <el-table-column prop="id" label="编号" width="180"  /> -->
              <el-table-column prop="name" show-overflow-tooltip label="姓名" width="180" />
              <el-table-column prop="sex" label="性别" >
                <template slot-scope="scope">{{ scope.row.sex==1?'男':'女' }}</template>
              </el-table-column>
              <el-table-column prop="phone" show-overflow-tooltip label="联系方式" min-width="100px" />
              <el-table-column prop="wechat" show-overflow-tooltip label="微信号" min-width="100px" />
              <el-table-column prop="qq" show-overflow-tooltip label="QQ" />
              <el-table-column prop="email" show-overflow-tooltip label="邮箱" />
              <el-table-column prop="source" label="来源" show-overflow-tooltip min-width="160px" />
              <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                  <el-button v-if="btnPermission('gthagent_assign')" type="text" size="small" @click="goFllow(scope.row)">跟进</el-button>
                  <el-button v-if="btnPermission('gthagent_appoint')" type="text" size="small" @click="showModel(scope.row,'assign')">指派</el-button>
                  <!-- <el-button v-if="btnPermission('agent_transformation')" type="text" size="small" @click="showModel(scope.row,'conversion')">转化</el-button> -->
                  <!-- <el-button v-if="btnPermission('agent_agentingore')" type="text" size="small" @click="ignoreBy(scope.row)">忽略</el-button> -->
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="由我忽略" name="ignore">
            <el-table v-loading="loading" ref="table3" :data="tableData" :max-height="tableHeight" style="width: 100%" tooltip-effect="light" @sort-change="fifterTable" >
              <!-- <el-table-column type="selection" width="55" /> -->
              <el-table-column width="20" />
              <!-- <el-table-column prop="id" label="编号" width="180"  /> -->
              <el-table-column show-overflow-tooltip prop="name" label="姓名" width="180" />
              <el-table-column show-overflow-tooltip prop="sex" label="性别" >
                <template slot-scope="scope">{{ scope.row.sex==1?'男':'女' }}</template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="phone" label="联系方式" min-width="100px"/>
              <el-table-column show-overflow-tooltip prop="wechat" label="微信号" min-width="100px"/>
              <el-table-column show-overflow-tooltip prop="qq" label="QQ" />
              <el-table-column show-overflow-tooltip prop="email" label="邮箱" />
              <el-table-column prop="source" label="来源" show-overflow-tooltip min-width="160px" />
              <!-- <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <el-button v-if="btnPermission('gthagent_assign')" type="text" size="small" @click="goFllow(scope.row)">跟进</el-button>
                  <el-button v-if="btnPermission('gthagent_appoint')" type="text" size="small" @click="showModel(scope.row,'assign')">指派</el-button>
                  <el-button v-if="btnPermission('agent_transformation')" type="text" size="small" @click="showModel(scope.row,'conversion')">转化</el-button>
                </template>
              </el-table-column> -->
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="公共线索" name="public">
            <el-table v-loading="loading" ref="table4" :data="tableData" :max-height="tableHeight" style="width: 100%" tooltip-effect="light" @sort-change="fifterTable">
              <!-- <el-table-column type="selection" width="55" /> -->
              <el-table-column width="20" />
              <!-- <el-table-column prop="id" label="编号" width="180"  /> -->
              <el-table-column prop="name" show-overflow-tooltip label="姓名" width="180" />
              <el-table-column prop="sex" label="性别" >
                <template slot-scope="scope">{{ scope.row.sex==1?'男':'女' }}</template>
              </el-table-column>
              <el-table-column prop="phone" show-overflow-tooltip label="联系方式" min-width="100px"/>
              <el-table-column prop="wechat" show-overflow-tooltip label="微信号" min-width="100px"/>
              <el-table-column prop="qq" show-overflow-tooltip label="QQ" />
              <el-table-column prop="email" show-overflow-tooltip label="邮箱" />
              <el-table-column prop="source" show-overflow-tooltip label="来源" min-width="160px" />
              <el-table-column prop="source" label="操作" width="300" align="center">
                <template slot-scope="scope">
                  <el-button v-if="btnPermission('gthagent_assign')" type="text" size="small" @click="goFllow(scope.row)">跟进</el-button>
                  <el-button v-if="btnPermission('gthagent_appoint')" type="text" size="small" @click="showModel(scope.row,'assign')">指派</el-button>
                  <!-- <el-button v-if="btnPermission('agent_transformation')" type="text" size="small" @click="showModel(scope.row,'conversion')">转化</el-button> -->
                  <el-button v-if="btnPermission('gthagent_receive')" type="text" size="small" @click="receive(scope.row)">领取</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="由我创建" name="createbyme" >
            <el-table v-loading="loading" ref="table5" :data="tableData" :max-height="tableHeight" :default-sort = "{prop: 'id', order: 'descending'}" tooltip-effect="light" style="width: 100%" @sort-change="fifterTable" >
              <el-table-column width="20" />
              <el-table-column show-overflow-tooltip prop="name" label="姓名" width="180" />
              <el-table-column show-overflow-tooltip prop="sex" label="性别" >
                <template slot-scope="scope">{{ scope.row.sex==1?'男':'女' }}</template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="phone" label="联系方式" min-width="100px"/>
              <el-table-column show-overflow-tooltip prop="wechat" label="微信号" min-width="100px"/>
              <el-table-column show-overflow-tooltip prop="qq" label="QQ" />
              <el-table-column show-overflow-tooltip prop="email" label="邮箱" />
              <el-table-column prop="source" label="来源" show-overflow-tooltip min-width="160px" />
              <el-table-column prop="source" label="操作" width="200" align="center">
                <template slot-scope="scope">
                  <el-button v-if="btnPermission('agent_transformation')" type="text" size="small" @click="showModel(scope.row,'edit')">编辑</el-button>
                  <!-- <el-button v-if="btnPermission('agent_agentbusinessassign')" type="text" size="small" @click="goFllow(scope.row)">跟进</el-button> -->
                  <el-button v-if="btnPermission('agent_agentbusinessappoint')" type="text" size="small" @click="showModel(scope.row,'assign')">指派</el-button>
                  <!-- <el-button v-if="btnPermission('agent_transformation')" type="text" size="small" @click="showModel(scope.row,'conversion')">转化</el-button> -->
                  <el-button v-if="btnPermission('agent_cancellation')" :disabled="scope.row.isdeleted=='false'" type="text" size="small" @click="changeStates(scope.row)">作废</el-button>
                  <el-button v-if="btnPermission('agent_receive')" type="text" size="small" @click="receive(scope.row)">领取</el-button>
                </template>
              </el-table-column>
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
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="modelShow" :title="modelTitle" class="dialogModel" @close="resetModel">
      <!-- 新建商机 -->
      <el-form
        v-if="modelType=='business'&&modelShow"
        ref="businessForm"
        :model="businessForm"
        :rules="businessRules"
        class="modelForm"
        label-width="100px"
        label-position="right">
        <el-form-item label="姓名：" prop="name">
          <el-input v-model.trim="businessForm.name" autocomplete="off" style="width:300px" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item label="性别：" prop="sex">
          <el-radio-group v-model="businessForm.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone">
          <el-input v-model.trim="businessForm.phone" autocomplete="off" style="width:300px" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="微信号：" prop="wechat">
          <el-input v-model.trim="businessForm.wechat" autocomplete="off" style="width:300px" placeholder="请输入微信号" />
        </el-form-item>
        <el-form-item label="来源：" prop="source" >
          <el-input v-model.trim="businessForm.source" autocomplete="off" style="width:300px" placeholder="请输入来源"/>
        </el-form-item>
        <el-form-item label="QQ号：" prop="qq">
          <el-input v-model.trim="businessForm.qq" autocomplete="off" style="width:300px" placeholder="请输入QQ号" />
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model.trim="businessForm.email" autocomplete="off" style="width:300px" placeholder="请输入邮箱"/>
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
        label-position="right">
        <el-form-item label="原归属人：">
          <el-input v-model.trim="assignForm.oldsald" autocomplete="off" disabled="disabled" style="width:400px" />
        </el-form-item>
        <el-form-item label="指派：" prop="salesId">
          <el-select v-model="assignForm.salesId" placeholder="请选择指派对象" style="width:400px">
            <el-option v-for="(item,index) in assignList" :label="item.label" :value="item.value" :key="index"/>
          </el-select>
        </el-form-item>
        <el-form-item label="指派原因：" prop="remarks">
          <el-input :rows="4" v-model.trim="assignForm.remarks" type="textarea" placeholder="请输入指派原因" />
        </el-form-item>
      </el-form>
      <!-- 转化商机 -->
      <el-form
        v-if="modelType=='conversion'&&modelShow"
        ref="conversionForm"
        :model="conversionForm"
        :rules="rules1"
        class="modelForm"
        label-width="100px"
        label-position="right"
        @close="resetModel"
      >
        <el-form-item label="客户等级：" prop="levleId">
          <el-select v-model.trim="conversionForm.levleId" placeholder="请选择客户等级" style="width:400px">
            <el-option v-for="(item,index) in agentLevelList" :label="item.label" :value="item.value" :key="index"/>
          </el-select>
        </el-form-item>
        <el-form-item label="授权号：">
          <el-input v-model.trim="conversionForm.auth_code" autocomplete="off" placeholder="请输入授权号" style="width:400px" />
        </el-form-item>
        <el-form-item label="所在城市：" prop="areas">
          <el-cascader :options="areaList" v-model.trim="conversionForm.areas" style="width:400px" @change="handleChange"/>
        </el-form-item>
        <el-form-item label="详细地址：">
          <el-input v-model.trim="conversionForm.address" autocomplete="off" placeholder="请输入详细地址" style="width:400px" />
        </el-form-item>
        <el-form-item label="备注：">
          <el-input :rows="4" v-model.trim="conversionForm.remarks" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="restForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">{{ sureBtn }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getBusinessInfo,
  saveBusiness,
  addAppointLabel,
  saveAppoint,
  addTransformationLabel,
  saveTransformation,
  agentingore,
  agentreceive,
  banAgent
  // getsalelist
} from '@/api/guangtonghui'
import { getAreaList } from '@/api/public'
// eslint-disable-next-line no-unused-vars
import { btnPermission } from '@/permission.js' // 按钮权限和页面权限
// import list from '@/assets/citys.json'
export default {
  name: 'Business',
  data() {
    return {
      uploadUrl: '',
      downloadUrl: '',
      moduleType: '/gth/gthagent-export',
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
      conversionForm: {
        levleId: '',
        auth_code: '',
        areas: [],
        address: '',
        remarks: ''
      },
      businessForm: {
        name: '',
        sex: '1',
        phone: '',
        wechat: '',
        source: '',
        qq: '',
        email: ''
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
        }]
      },
      rules1: {
        levleId: [{
          required: true,
          message: '客户等级不能为空',
          trigger: 'change'
        }],
        areas: [{
          required: true,
          message: '所在城市不能为空',
          trigger: 'change'
        }]
      },
      businessRules: {
        name: [{
          required: true,
          message: '姓名不能为空',
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
        }
        // {
        //   pattern: /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/,
        //   message: '微信号以字母开头，包含6-20个字母、数字、下划线和减号',
        //   trigger: 'blur'
        // }
        ],
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
          }]
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
      submitting: false
    }
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  mounted() {
    this.uploadUrl = process.env.BASE_API + 'gth/gthagent-import.json'
    this.downloadUrl = process.env.BASE_API + 'data/download/广通汇商机模板.xls'
    console.log(this.btnPermission('gthagent_agentbusinessall'))
    if (this.btnPermission('gthagent_agentbusinessall') === false) {
      this.searchInfo.mode = 'assign'
    } else {
      if (this.$route.query.tab === 'public') {
        const activeTab = this.$route.query.tab
        console.log(this.$route.query.tab)
        this.searchInfo.mode = activeTab
        // this.getList()
      } else {
        this.searchInfo.mode = 'all'
      }
    }

    // 获取列表
    this.getList()
    this.getOtherList()
  },
  methods: {
    restForm() {
      if (this.modelType === 'business') {
        this.$refs['businessForm'].resetFields()
        this.businessForm = {
          name: '',
          sex: '1',
          phone: '',
          wechat: '',
          source: '',
          qq: '',
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
    getList() {
      const that = this
      // 获取商机列表
      getBusinessInfo(this.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200 || res.code === '200') {
          that.tableData = res.data.gthagent
          that.total = res.data.pager.recTotal // 总条数
        }
      })
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
    addBusiness() {
      this.modelTitle = '创建商机'
      this.modelType = 'business'
      this.modelShow = true
      this.sureBtn = '保 存'
    },
    choseType() {
      this.searchInfo.pageID = 1
      this.tableData = []
      this.searchInfo.orderBy = ''
      if ((this.$refs.table1) !== undefined) {
        this.resetTable()
      } else if ((this.$refs.table2) !== undefined) {
        this.resetTable()
      } else if ((this.$refs.table3) !== undefined) {
        this.resetTable()
      } else if ((this.$refs.table4) !== undefined) {
        this.resetTable()
      }
      this.loading = true
      this.getList()
    },
    resetTable() {
      const arr = [this.$refs.table1, this.$refs.table2, this.$refs.table3, this.$refs.table4]
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== undefined) {
          arr[i].clearSort()
        }
      }
    },
    handleClick(tab, event) {
      // console.log(tab, event)
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
    ignoreBy(data) {
      const that = this
      this.$confirm('确定要忽略此商机吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        agentingore(data.id).then(res => {
          if (res.code === 200 || res.code === '200') {
            that.$message({
              message: '操作成功',
              type: 'success'
            })
            that.getList()
          } else {
            that.$message({
              message: '操作失败',
              type: 'warning'
            })
          }
        })
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
              message: '操作失败',
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
        path: '/guangtonghui/bussinessIndex/follow?id=' + data.id
      })
    },
    changeStates(data) {
      const that = this
      this.$confirm('确定要作废此客户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        banAgent(data.id).then(res => {
          if (res.code === 200 || res.code === '200') {
            that.$message({
              message: '操作成功',
              type: 'success'
            })
            that.getList()
          } else {
            that.$message({
              message: '操作失败',
              type: 'warning'
            })
          }
        })
      }).catch(() => {
        console.log('取消')
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
          console.log(res)
          if (res.code === 200) {
            that.assignForm.oldsald = res.data.gthagentInfo
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
      }
    },
    saveModel() {
      const that = this
      if (this.modelType === 'business') {
        // 保存商机
        this.$refs['businessForm'].validate((valid) => {
          if (valid) {
            console.log(this.businessForm)
            if (this.businessForm.phone == '' && this.businessForm.wechat == '') {
              that.$message({
                message: '手机号和微信号必须填一个',
                type: 'warning'
              })
            } else {
              that.submitting = true
              saveBusiness(this.businessForm).then(res => {
                console.log(res)
                that.submitting = false
                if (res.code === 200 || res.code === '200') {
                  this.$message({
                    message: '商机添加成功！',
                    type: 'success'
                  })
                  that.$refs['businessForm'].resetFields()
                  that.modelShow = false
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
                that.$refs['assignForm'].resetFields()
                that.modelShow = false
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
      if (this.modelType === 'business') {
        this.$refs['businessForm'].resetFields()
        this.businessForm = {
          name: '',
          sex: '1',
          phone: '',
          wechat: '',
          source: '',
          qq: '',
          email: ''
        }
      } else if (this.modelType === 'assignForm') {
        this.$refs['assignForm'].resetFields()
        this.assignForm = {
          oldsald: '',
          salesId: '',
          remarks: ''
        }
      }
      this.modelShow = false
    }
  }
}

</script>
<style lang="less" scoped>
  .business_bg {
    background: #fff;
    padding: 10px;
    position: absolute;
    width: 100%;
    top: 0;
    // .search_btn {
    //   display: flex;
    //   align-items: center;
    //   justify-content: space-between;
    // }

    .bussiness_info {
      margin: 10px 0;
    }

    .bussiness_page {
      text-align: center;
      padding: 10px 0;
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
