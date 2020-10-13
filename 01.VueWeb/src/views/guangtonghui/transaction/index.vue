<template>
  <div>
    <router-view />
    <div v-if="isShow" class="transaction_bg">
      <div class="fifter">
        <search-fifter
          :fifter="true"
          :delay-fifter="loading==false"
          :add-text="'创建客户'"
          :add="true"
          :module-name="'gthagentbusiness'"
          :export-show="btnPermission('gthagentbusiness_export')"
          :export-type="moduleType"
          :export-name="'客户列表'"
          @addAction="addProxy"
          @search="fifterSearch" />
      </div>
      <div class="transaction_info">
        <el-tabs v-model="searchInfo.mode" type="card" class="tabs_table" @tab-click="choseType">
          <el-tab-pane v-for="(item,index) in typeList" :key="index" :label="item.text" :name="item.name">
            <el-table v-loading="loading" ref="table" :data="tableData" :max-height="tableHeight" style="width: 100%" tooltip-effect="light" @sort-change="fifterTable">
              <el-table-column width="20" />
              <el-table-column prop="name" label="客户" show-overflow-tooltip width="200" >
              </el-table-column>
              <el-table-column prop="phone" show-overflow-tooltip label="手机号码" min-width="100px"/>
              <el-table-column prop="wechat" show-overflow-tooltip label="微信号码" />
              <el-table-column prop="salesId" show-overflow-tooltip label="归属人" min-width="100px"/>
              <el-table-column prop="deffassignDate" label="距上次跟进" min-width="120px"/>
              <el-table-column prop="auth_code" label="授权号" min-width="100px" show-overflow-tooltip/>
              <el-table-column prop="levleId" label="客户类型" min-width="100px"/>
              <el-table-column prop="createdDate" show-overflow-tooltip label="创建时间" sortable="custom" min-width="100px"/>
              <el-table-column prop="assignDate" show-overflow-tooltip label="上次跟进时间" sortable="custom" min-width="130px"/>
              <el-table-column prop="nextDate" show-overflow-tooltip label="下次跟进时间" sortable="custom" min-width="130px"/>
              <el-table-column label="操作" min-width="180px" >
                <template slot-scope="scope">
                  <el-button
                    v-if="btnPermission('gthagentbusiness_gthagentbusinessview')"
                    type="text"
                    size="small"
                    @click="viewInfo(scope.row)">查看</el-button>
                  <el-button
                    v-if="btnPermission('gthagentbusiness_assign')&&searchInfo.mode!='blacklist'"
                    type="text"
                    size="small"
                    @click="goFllow(scope.row)">跟进</el-button>
                  <el-button
                    v-if="btnPermission('gthagentbusiness_appoint')&&searchInfo.mode!='blacklist'"
                    type="text"
                    size="small"
                    @click="showModel(scope.row,'assign')">指派</el-button>
                  <!-- <el-button
                    v-if="btnPermission('gthagentbusiness_removeblacklist')&&searchInfo.mode=='blacklist'"
                    type="text"
                    size="small"
                    @click="showMessage(scope.row,'removeblack')">移除黑名单</el-button> -->
                  <el-dropdown
                    v-if="searchInfo.mode!='blacklist'"
                    trigger="click"
                    style="margin-left:10px"
                    class="right_menu">
                    <span class="el-dropdown-link">
                      <el-button type="text" size="small">
                        <svg-icon icon-class="omit" />
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown" class="">
                      <!-- <el-dropdown-item v-if="btnPermission('agent_delete')">
                        <el-button type="text" size="small" class="menu_btn" @click="showMessage(scope.row,'del')">作废
                        </el-button>
                      </el-dropdown-item> -->
                      <el-dropdown-item v-if="btnPermission('gthagentbusiness_closegthagentbusiness')">
                        <el-button type="text" size="small" class="menu_btn" @click="showMessage(scope.row,'close')">作废
                        </el-button>
                      </el-dropdown-item>
                      <el-dropdown-item v-if="btnPermission('gthagentbusiness_editadress')">
                        <el-button type="text" size="small" class="menu_btn" @click="showModel(scope.row,'addr')">修改地址
                        </el-button>
                      </el-dropdown-item>
                      <!-- <el-dropdown-item v-if="btnPermission('agent_bindwx')">
                        <el-button type="text" size="small" class="menu_btn" @click="showModel(scope.row,'wechat')">
                          添加微信小号</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item v-if="btnPermission('agent_bindwx')">
                        <el-button type="text" size="small" class="menu_btn" @click="showModel(scope.row,'chain')">
                          添加微连锁号</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item v-if="btnPermission('agent_addblacklist')">
                        <el-button type="text" size="small" class="menu_btn" @click="showMessage(scope.row,'addblack')">
                          加入黑名单</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item v-if="btnPermission('agent_addicon')">
                        <el-button type="text" size="small" @click="showModel(scope.row,'addproxy')">添加标签</el-button>
                      </el-dropdown-item>
                      <el-dropdown-item v-if="btnPermission('agent_grantwelfare')">
                        <el-button type="text" size="small" @click="showModel(scope.row,'addwelfare')">添加福利</el-button>
                      </el-dropdown-item> -->
                    </el-dropdown-menu>
                  </el-dropdown>
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
      <!-- 添加经销商 -->
      <div v-if="modelType=='proxy'" class="show_scroll">
        <el-form
          v-if="modelShow"
          ref="proxyInfoForm"
          :model="proxyInfoForm"
          :rules="proxyInfoRules"
          class="modelForm"
          label-width="100px"
          label-position="right">
          <el-form-item label="关联商机：" prop="businessId">
            <el-select v-model="proxyInfoForm.businessId" placeholder="请选择关联商机" style="width:300px" clearable @change="choseBussiness">
              <el-option v-for="(item,index) in bussinessShowList" :label="item.label" :value="item.value" :key="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="姓名：" prop="name">
            <el-input v-model.trim="proxyInfoForm.name" :disabled="proxyInfoForm.businessId!==''" autocomplete="off" style="width:300px" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="性别：" prop="sex">
            <el-radio-group v-model="proxyInfoForm.sex" :disabled="proxyInfoForm.businessId!==''">
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="手机号：" prop="phone">
            <el-input v-model.trim="proxyInfoForm.phone" :disabled="proxyInfoForm.businessId!==''" autocomplete="off" style="width:300px" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="微信号：" prop="wechat">
            <el-input v-model.trim="proxyInfoForm.wechat" :disabled="proxyInfoForm.businessId!==''" autocomplete="off" style="width:300px" placeholder="请输入微信号" />
          </el-form-item>
          <el-form-item label="来源：" prop="source">
            <el-input v-model.trim="proxyInfoForm.source" :disabled="isdisable" autocomplete="off" style="width:300px" placeholder="请输入来源" />
          </el-form-item>
          <el-form-item label="QQ号：" prop="qq">
            <el-input v-model.trim="proxyInfoForm.qq" :disabled="isdisable2" autocomplete="off" style="width:300px" placeholder="请输入QQ号" />
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model.trim="proxyInfoForm.email" :disabled="isdisable3" autocomplete="off" style="width:300px" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="客户类型：" prop="levleId">
            <el-select v-model="proxyInfoForm.levleId" placeholder="请选择客户类型" style="width:300px">
              <el-option v-for="(item,index) in options" :label="item.label" :value="item.value" :key="index"/>
            </el-select>
          </el-form-item>
          <el-form-item label="授权号：" prop="contractCode">
            <!-- <el-input v-model="proxyInfoForm.contractCode" autocomplete="off" placeholder="请输入授权号" style="width:300px" /> -->
            <el-select v-model.trim="proxyInfoForm.contractCode" clearable filterable placeholder="请输入授权号" style="width:300px">
              <el-option v-for="item in contractList" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="省市区：" prop="areas">
            <el-cascader ref="areasName" :options="areaList" v-model="proxyInfoForm.areas" style="width:300px" placeholder="请选择省市区" @change="getAreasValue"/>
          </el-form-item>
          <el-form-item label="详细地址：" prop="address">
            <el-input :rows="4" v-model.trim="proxyInfoForm.address" type="textarea" style="width:400px" placeholder="请输入详细地址" />
          </el-form-item>
        </el-form>
      </div>
      <!-- 指派 -->
      <el-form
        v-if="modelType=='assign'&&modelShow"
        ref="assignForm"
        :model="assignForm"
        :rules="assignRules"
        class="modelForm"
        label-width="100px"
        label-position="left">
        <el-form-item label="原归属人：">
          <el-input v-model="assignForm.oldsald" autocomplete="off" disabled="disabled" style="width:400px" />
        </el-form-item>
        <el-form-item label="指派：" prop="salesId">
          <el-select v-model.trim="assignForm.salesId" placeholder="请选择指派人" style="width:400px">
            <el-option v-for="(item,index) in selectList" :label="item.label" :value="item.value" :key="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="指派原因：" prop="remarks">
          <el-input :rows="4" v-model.trim="assignForm.remarks" type="textarea" placeholder="请输指派原因" />
        </el-form-item>
      </el-form>
      <!-- 添加标签 -->
      <el-form
        v-if="modelType=='addproxy'&&modelShow"
        ref="proxyForm"
        :model="proxyForm"
        :rules="proxyRules"
        class="modelForm"
        label-width="100px"
        label-position="left">
        <el-form-item label="标签：" prop="iconId">
          <el-select v-model.trim="proxyForm.iconId" placeholder="请选择标签" style="width:400px">
            <el-option v-for="(item,index) in iconList" :label="item.label" :value="item.value" :key="index" />
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 添加福利 -->
      <el-form
        v-if="modelType=='addwelfare'&&modelShow"
        ref="welfareForm"
        :model="welfareForm"
        :rules="welfareRules"
        class="modelForm"
        label-width="100px"
        label-position="left">
        <el-form-item label="福利：" prop="welfareId">
          <el-select v-model.trim="welfareForm.welfareId" placeholder="请选择标签" style="width:400px">
            <el-option v-for="(item,index) in welfareList" :label="item.label" :value="item.value" :key="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="数量：" prop="number">
          <el-input
            v-model.trim="welfareForm.number"
            autocomplete="off"
            style="width:400px"
            type="number"
            placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input :rows="6" v-model.trim="welfareForm.remarks" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <!-- 添加微信小号 -->
      <el-form
        v-if="modelType=='wechat'&&modelShow"
        ref="wechatForm"
        :model="wechatForm"
        :rules="wechatRules"
        class="modelForm"
        label-width="100px"
        label-position="left">
        <el-form-item label="微信号：" prop="wechat">
          <el-input v-model="wechatForm.wechat" placeholder="请输入微信小号" style="width:300px" />
          <el-button type="primary" @click="addWechat">添加</el-button>
        </el-form-item>
        <el-form-item label="已添加小号：">
          <el-tag
            v-for="tag in wechatList"
            :key="tag"
            :disable-transitions="false"
            closable
            style="margin-right:10px;"
            @close="removeWechat(tag)">
            {{ tag }}
          </el-tag>
        </el-form-item>
      </el-form>
      <!-- 添加微连锁号 -->
      <el-form
        v-if="modelType=='chain'&&modelShow"
        ref="wechatLinkForm"
        :model="wechatLinkForm"
        :rules="wechatLinkRules"
        class="modelForm"
        label-width="100px"
        label-position="left">
        <el-form-item label="微信号：" prop="wechat">
          <el-input v-model.trim="wechatLinkForm.wechat" placeholder="请输入微联锁号" style="width:300px" />
          <el-button type="primary" @click="addWechat">添加</el-button>
        </el-form-item>
        <el-form-item label="已添加锁号：">
          <el-tag
            v-for="tag in wechatList"
            :key="tag"
            :disable-transitions="false"
            closable
            style="margin-right:10px;"
            @close="removeWechat(tag)">
            {{ tag }}
          </el-tag>
        </el-form-item>
      </el-form>
      <!-- 修改地址 -->
      <el-form
        v-if="modelType=='addr'&&modelShow"
        ref="addrForm"
        :model="addrForm"
        :rules="addrRules"
        class="modelForm"
        label-width="100px"
        label-position="left">
        <el-form-item label="省市区：" prop="areas">
          <el-cascader ref="areaName" :options="areaList" v-model="addrForm.areas" style="width:400px" placeholder="请选择省市区" @change="getAreaValue"/>
        </el-form-item>
        <el-form-item label="详细地址：" prop="address">
          <el-input :rows="4" v-model.trim="addrForm.address" type="textarea" placeholder="请输入详细地址" />
        </el-form-item>
      </el-form>
      <div v-if="modelType!='chain'&&modelType!='wechat'" slot="footer" class="dialog-footer">
        <el-button v-show="modelType!='addr'" @click="restForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">保 存</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import {
  // getAgentInfo,
  // addagentAppointLabel,
  // saveagentAppoint,
  // editAdress,
  // AddWxchat,
  getWxchatList,
  // deleteOneById,
  // closeAgent,
  AddblackList,
  RmoveblackList,
  // getagenticon,
  addagenticon,
  // getwelfarelist,
  grantwelfare
  // addTransformationLabel,
  // getBussinessList,
  // getBussinessById,
  // saveBusinessInfo
  // saveBusiness
} from '@/api/agent'
import {
  gthAgentLevel,
  addgthAppointLabel,
  savegthAppoint,
  gthEditAdress,
  gthDeleteOneById,
  gthCloseAgent,
  gthBussinessById,
  gthAddBusinessInfo,
  gthBussinessList,
  getContractList
} from '@/api/guangtonghui'
import {
  getAreaList
} from '@/api/public'
export default {
  name: 'Transaction',
  data() {
    return {
      assignId: '',
      selectList: [],
      moduleType: '/gth/gthagentbusiness-export',
      tableData: [],
      isShow: true,
      modelType: 'transaction',
      modelShow: false,
      modelTitle: '',
      typeList: [{
        text: '全部客户',
        name: 'all'
      },
      {
        text: '急需联系',
        name: 'inneed'
      },
      {
        text: '今日联系',
        name: 'today'
      },
      {
        text: '本周内联系',
        name: 'week'
      },
      {
        text: '本月内联系',
        name: 'month'
      }
      ],
      wechatList: [],
      proxyInfoForm: {
        businessId: '',
        salesId: '',
        name: '',
        sex: '1',
        phone: '',
        wechat: '',
        source: '',
        qq: '',
        email: '',
        levleId: '',
        contractCode: '',
        address: '',
        areas: []
      },
      tableHeight: 250,
      loading: true,
      bussinessList: [],
      options: [{
        value: '1',
        label: '潜在客户'
      }, {
        value: '2',
        label: '意向客户'
      }, {
        value: '3',
        label: '成交客户'
      }],
      bussinessShowList: [],
      proxyInfoRules: {
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
          required: true,
          message: '手机号不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^[1][0-9]{10}$/,
          message: '手机号格式错误',
          trigger: 'blur'
        }],
        wechat: [{
          required: true,
          message: '微信号不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/,
          message: '微信号以字母开头，包含6-20个字母、数字、下划线和减号',
          trigger: 'blur'
        }],
        qq: [{
          required: true,
          message: 'QQ号不能为空',
          trigger: 'blur'
        }, {
          pattern: /^[1-9][0-9]{4,}$/,
          message: 'QQ号格式错误',
          trigger: 'blur'
        }],
        email: [{
          required: true,
          message: '邮箱不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
          message: '邮箱格式错误',
          trigger: 'blur'
        }],
        levleId: [{
          required: true,
          message: '客户类型不能为空',
          trigger: 'change'
        }],
        contractCode: [{
          required: true,
          message: '授权号不能为空',
          trigger: 'change'
        }, {
          pattern: /^[a-zA-Z0-9_]+$/,
          message: '授权号格式错误，只能由字符，数字，下划线组成',
          trigger: 'blur'
        }],
        areas: [{
          required: true,
          message: '省市区不能为空',
          trigger: 'change'
        }],
        address: [{
          required: true,
          message: '详细地址不能为空',
          trigger: 'blur'
        }]
      },
      // 指派表单
      assignForm: {
        oldsald: '',
        salesId: '',
        remarks: ''
      },
      assignRules: {
        salesId: [{
          required: true,
          message: '指派人不能为空',
          trigger: 'change'
        }],
        remarks: [{
          required: true,
          message: '指派原因不能为空',
          trigger: 'blur'
        }]
        // newperson: [{
        //   required: true,
        //   message: '指派人不能为空',
        //   trigger: 'change'
        // }],
        // result: [{
        //   required: true,
        //   message: '指派原因不能为空',
        //   trigger: 'blur'
        // }]
      },
      // 客服表单
      wechatForm: {
        wechat: '',
        type: ''
      },
      wechatLinkForm: {
        wechat: '',
        type: ''
      },
      proxyForm: {
        iconId: ''
      },

      iconList: [],
      wechatRules: {
        wechat: [{
          required: true,
          message: '微信名不能为空',
          trigger: 'blur'
        },
        // {
        //   pattern: /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/,
        //   message: '微信号以字母开头，包含6-20个字母、数字、下划线和减号',
        //   trigger: 'blur'
        // }
        ]
      },
      wechatLinkRules: {
        wechat: [{
          required: true,
          message: '微信名不能为空',
          trigger: 'blur'
        },
        // {
        //   pattern: /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/,
        //   message: '微信号以字母开头，包含6-20个字母、数字、下划线和减号',
        //   trigger: 'blur'
        // }
        ]
      },
      addrForm: {
        address: '',
        areas: []
      },
      isdisable2: false,
      isdisable3: false,
      isdisable: false,
      addrRules: {
        areas: [{
          required: true,
          message: '省市区不能为空',
          trigger: 'change'
        }],
        address: [{
          required: true,
          message: '地址不能为空',
          trigger: 'blur'
        }]
      },
      proxyRules: {
        iconId: [{
          required: true,
          message: '标签不能为空',
          trigger: 'change'
        }]
      },
      welfareList: [],
      welfareForm: {
        welfareId: '',
        number: '',
        remarks: ''
      },
      welfareRules: {
        welfareId: [{
          required: true,
          message: '福利不能为空',
          trigger: 'change'
        }],
        number: [{
          required: true,
          message: '数量不能为空',
          trigger: 'blur'
        }],
        remarks: [{
          required: true,
          message: '备注不能为空',
          trigger: 'blur'
        }]
      },
      areaList: [],
      agentLevelList: [],
      searchInfo: {
        type: 'agentbusiness',
        mode: 'all', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      total: 0,
      submitting: false
    }
  },
  // mounted() {
  //   // 获取列表
  //   this.getList()
  // },
  mounted() {
    this.uploadUrl = process.env.BASE_API + 'agent/agent-import-agent.json'
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
    restForm() {
      if (this.modelType === 'proxy') {
        this.$refs['proxyInfoForm'].resetFields()
        this.proxyInfoForm = {
          businessId: '',
          salesId: '',
          name: '',
          sex: '1',
          phone: '',
          wechat: '',
          source: '',
          qq: '',
          email: '',
          levleId: '',
          contractCode: '',
          address: '',
          areas: []
        }
        this.isdisable = false
        this.isdisable2 = false
        this.isdisable3 = false
      } else if (this.modelType === 'addproxy') {
        this.$refs['proxyForm'].resetFields()
        this.proxyForm = {}
      } else if (this.modelType === 'assign') {
        this.$refs['assignForm'].resetFields()
        this.assignForm = {
          oldsald: this.assignForm.oldsald,
          salesId: '',
          remarks: ''
        }
      } else if (this.modelType === 'addwelfare') {
        this.$refs['welfareForm'].resetFields()
        this.welfareForm = {}
      }
    },
    getList() {
      const that = this
      gthAgentLevel(this.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200 || res.code === '200') {
          that.tableData = res.data.gthagentbusiness
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
      // // 获取标签列表
      // getagenticon().then(res => {
      //   console.log(res)
      //   that.iconList = res.data
      // })
      // // 获取福利列表
      // getwelfarelist().then(res => {
      //   console.log(res)
      //   that.welfareList = res.data
      // })
      // // 获取经销商等级
      // addTransformationLabel().then(res => {
      //   if (res.code === 200) {
      //     that.agentLevelList = res.data
      //   }
      // })
      // 获取全部商机列表
      gthBussinessList().then(res => {
        if (res.code === 200) {
          that.bussinessList = res.data
          that.bussinessShowList = res.data
        }
      })
      // 授权号下拉框的列表
      getContractList().then(res => {
        console.log(res, 'fdsaf')
        if (res.code === 200) {
          this.contractList = res.data
        }
      })
    },
    // choseCourse(e) {
    //   console.log(e, 'hdzg')
    //   searchContract(e).then(res => {
    //     console.log(res, 'fdsafsag')
    //     // this.proxyInfoForm.levleId = res.data.level
    //   })
    // },
    resetModel() {
      if (this.modelType === 'proxy') {
        console.log('重置表单')
        // this.$refs['proxyInfoForm'].resetFields()
        this.proxyInfoForm = {
          businessId: '',
          salesId: '',
          name: '',
          sex: '1',
          phone: '',
          wechat: '',
          source: '',
          qq: '',
          email: '',
          levleId: '',
          contractCode: '',
          address: '',
          areas: []
        }
        this.proxyInfoForm.businessId = ''
        this.isdisable = false
        this.isdisable2 = false
        this.isdisable3 = false
      } else {
        // this.$refs['assignForm'].resetFields()
        this.assignForm = {
        }
      }
      this.modelShow = false
      this.submitting = false
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
    // close() {
    //   console.log(1)
    // },
    addProxy() {
      this.modelType = 'proxy'
      this.modelShow = true
      this.modelTitle = '新增'
    },
    choseBussiness(e) {
      console.log(e)
      const that = this
      if (e !== '') {
      // 获取对应商机的详细信息
        gthBussinessById(e).then(res => {
          console.log(res)
          if (res.code === 200 || res.code === '200') {
            const data = res.data
            that.proxyInfoForm = {
              businessId: e,
              salesId: data.salesId,
              name: data.name,
              sex: data.sex,
              phone: data.phone,
              wechat: data.wechat,
              source: data.source,
              qq: data.qq,
              email: data.email,
              levleId: '',
              contractCode: '',
              address: '',
              areas: []
            }
            if (that.proxyInfoForm.source !== '' && that.proxyInfoForm.businessId !== '') {
              this.isdisable = true
            }
            if (that.proxyInfoForm.qq !== '' && that.proxyInfoForm.businessId !== '') {
              this.isdisable2 = true
            }
            if (that.proxyInfoForm.email !== '' && that.proxyInfoForm.businessId !== '') {
              this.isdisable3 = true
            }
          }
        })
        that.$refs['proxyInfoForm'].resetFields()
        this.isdisable3 = false
        this.isdisable2 = false
        this.isdisable = false
      } else {
        that.proxyInfoForm = {
          businessId: '',
          salesId: '',
          name: '',
          sex: '',
          phone: '',
          wechat: '',
          source: '',
          qq: '',
          email: '',
          levleId: '',
          contractCode: '',
          address: '',
          areas: []
        }
        that.$refs['proxyInfoForm'].resetFields()
      }
    },
    getAreasValue() {
      console.log(this.$refs['areasName'].currentLabels)
      const arr = this.$refs['areasName'].currentLabels
      this.proxyInfoForm.areasName = arr.join(',')
    },
    getAreaValue() {
      console.log(this.$refs['areaName'].currentLabels)
      const arr = this.$refs['areaName'].currentLabels
      this.addrForm.areasName = arr.join(',')
    },
    saveModel() {
      const that = this
      if (this.modelType === 'assign') {
        // 指派
        this.$refs['assignForm'].validate((valid) => {
          if (valid) {
            console.log(this.assignForm)
            that.submitting = true
            savegthAppoint(this.assignId, this.assignForm).then(res => {
              console.log(res)
              that.submitting = false
              if (res.code === 200 || res.code === '200') {
                this.$message({
                  message: '指派成功！',
                  type: 'success'
                })
                that.$refs['assignForm'].resetFields()
                that.modelShow = false
                that.assignForm = {
                  oldsald: '',
                  salesId: '',
                  remarks: ''
                }
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
      } else if (this.modelType === 'addr') {
        console.log(this.addrForm)
        this.$refs['addrForm'].validate((valid) => {
          if (valid) {
            console.log(this.addrForm)
            that.submitting = true
            gthEditAdress(this.assignId, this.addrForm).then(res => {
              console.log(res)
              that.submitting = false
              if (res.code === 200 || res.code === '200') {
                this.$message({
                  message: '地址修改成功！',
                  type: 'success'
                })
                that.$refs['addrForm'].resetFields()
                that.modelShow = false
                that.getList()
                that.addrForm = {
                  address: '',
                  areas: []
                }
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
      } else if (this.modelType === 'addproxy') {
        this.$refs['proxyForm'].validate((valid) => {
          if (valid) {
            console.log(this.proxyForm)
            that.submitting = true
            addagenticon(this.assignId, this.proxyForm).then(res => {
              console.log(res)
              that.submitting = false
              if (res.code === 200 || res.code === '200') {
                this.$message({
                  message: '标签添加成功！',
                  type: 'success'
                })
                that.$refs['proxyForm'].resetFields()
                that.modelShow = false
                that.getList()
                that.proxyForm = {
                  iconId: ''
                }
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
      } else if (this.modelType === 'addwelfare') {
        this.$refs['welfareForm'].validate((valid) => {
          if (valid) {
            console.log(this.welfareForm)
            that.submitting = true
            grantwelfare(this.assignId, this.welfareForm).then(res => {
              console.log(res)
              that.submitting = false
              if (res.code === 200 || res.code === '200') {
                this.$message({
                  message: '添加福利成功！',
                  type: 'success'
                })
                that.$refs['welfareForm'].resetFields()
                that.welfareForm = {
                  welfareId: '',
                  number: '',
                  remarks: ''
                }
                that.modelShow = false
                that.getList()
              } else {
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
                that.welfareForm = {
                  welfareId: '',
                  number: '',
                  remarks: ''
                }
                that.modelShow = false
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
      } else if (this.modelType === 'proxy') {
        this.$refs['proxyInfoForm'].validate((valid) => {
          if (valid) {
            console.log(this.proxyInfoForm)
            that.submitting = true
            gthAddBusinessInfo(this.proxyInfoForm).then(res => {
              that.submitting = false
              if (res.code === 200 || res.code === '200') {
                this.$message({
                  message: '客户添加成功！',
                  type: 'success'
                })
                that.$refs['proxyInfoForm'].resetFields()
                that.modelShow = false
                that.getList()
                that.proxyInfoForm = {
                  businessId: '',
                  salesId: '',
                  name: '',
                  sex: '',
                  phone: '',
                  wechat: '',
                  source: '',
                  qq: '',
                  email: '',
                  levleId: '',
                  contractCode: '',
                  address: '',
                  areas: []
                }
                this.isdisable = false
                this.isdisable2 = false
                this.isdisable3 = false
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
    // addWechat() {
    //   const that = this
    //   if (this.modelType === 'wechat') {
    //     this.wechatForm.type = 1
    //     // 添加微信小号
    //     this.$refs['wechatForm'].validate((valid) => {
    //       if (valid) {
    //         AddWxchat(this.assignId, this.wechatForm).then(res => {
    //           console.log(res)
    //           // this.wechatForm.type = 1;
    //           if (res.code === 200 || res.code === '200') {
    //             that.$message({
    //               message: '添加微信小号成功！',
    //               type: 'success'
    //             })
    //             getWxchatList('small', this.assignId).then(res => {
    //               that.wechatList = res.data
    //               console.log(that.wechatList)
    //             })
    //             that.$refs['wechatForm'].resetFields()
    //             that.wechatForm = {}
    //             // that.modelShow = false
    //             // that.getList()
    //           } else {
    //             that.$message({
    //               message: res.data.msg,
    //               type: 'warning'
    //             })
    //           }
    //         })
    //       } else {
    //         console.log('error submit!!')
              // this.$message.warning('信息填写不完整或者信息填写有误！')
            this.$nextTick(() => {
              this.checkFormErr()
            })
    //         return false
    //       }
    //     })
    //   } else if (this.modelType === 'chain') {
    //     this.wechatLinkForm.type = 2
    //     this.$refs['wechatLinkForm'].validate((valid) => {
    //       if (valid) {
    //         console.log(this.wechatLinkForm)
    //         AddWxchat(this.assignId, this.wechatLinkForm).then(res => {
    //           if (res.code === 200 || res.code === '200') {
    //             this.$message({
    //               message: '添加微联锁号成功',
    //               type: 'success'
    //             })
    //             getWxchatList('link', this.assignId).then(res => {
    //               that.wechatList = res.data
    //               console.log(that.wechatList)
    //             })
    //             that.$refs['wechatLinkForm'].resetFields()
    //             that.wechatLinkForm = {}
    //             // setTimeout();
    //             // that.modelShow = false
    //             // that.getList()
    //           } else {
    //             that.$message({
    //               message: res.data.msg,
    //               type: 'warning'
    //             })
    //           }
    //         })
    //       } else {
    //         console.log('error submit!!')
              // this.$message.warning('信息填写不完整或者信息填写有误！')
            this.$nextTick(() => {
              this.checkFormErr()
            })
    //         return false
    //       }
    //     })
    //   }
    // },
    viewInfo(data) {
      this.isShow = false
      this.$router.push({
        path: '/guangtonghui/transactionIndex/info?id=' + data.id
      })
    },
    goFllow(data) {
      this.isShow = false
      this.$router.push({
        path: '/guangtonghui/transactionIndex/follow?id=' + data.id
      })
    },
    choseType() {
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
    },
    savePublic() {
      this.$confirm('转入公海的客户商将会被其它销售领走，客户3天后才可见，确定要“放入公海”吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('确定')
      }).catch(() => {
        console.log('取消')
      })
    },
    delInfo() {
      this.$confirm('客户一旦作废不可恢复，确定要“作废”吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log('确定')
      }).catch(() => {
        console.log('取消')
      })
    },
    showMessage(data, type) {
      const that = this
      console.log(type)
      let title = ''
      switch (type) {
        case 'close':
          title = '客户一旦作废不可恢复，确定要“作废”吗？'
          break
        case 'del':
          title = '客户一旦作废不可恢复，确定要“作废”吗？'
          break
        case 'addblack':
          title = '确定将客户“加入黑名单”吗？'
          break
        case 'removeblack':
          title = '确定将客户“移出黑名单”吗？'
          break
      }
      if (type === 'del') {
        this.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          gthDeleteOneById(data.id).then(res => {
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
      } else if (type === 'close') {
        this.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          gthCloseAgent(data.id).then(res => {
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
      } else if (type === 'addblack') {
        this.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          AddblackList(data.id).then(res => {
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
      } else if (type === 'removeblack') {
        this.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          RmoveblackList(data.id).then(res => {
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
      }
    },
    showModel(data, type) {
      const that = this
      this.modelType = type
      this.modelShow = true
      this.assignId = data.id
      if (type === 'assign') {
        this.modelTitle = '指派'
        addgthAppointLabel(data.id).then(res => {
          console.log(res)
          if (res.code === 200) {
            that.assignForm.oldsald = res.data.agentInfo
            that.selectList = res.data.selectList
          }
        })
      } else if (type === 'wechat') {
        this.modelTitle = '微信小号'
        getWxchatList('small', this.assignId).then(res => {
          that.wechatList = res.data
          console.log(that.wechatList)
        })
      } else if (type === 'chain') {
        getWxchatList('link', this.assignId).then(res => {
          that.wechatList = res.data
          console.log(that.wechatList)
        })
        this.modelTitle = '微连锁号'
      } else if (type === 'addr') {
        this.modelTitle = '修改地址'
        this.addrForm.areas = [data.provinceId, data.cityId, data.areaId]
        this.addrForm.address = data.address
      } else if (type === 'addproxy') {
        this.modelTitle = '添加标签'
      } else {
        this.modelTitle = '添加福利'
      }
    },
    removeWechat(data) {
      // const that = this
      console.log(1)
    }
  }
}

</script>
<style lang="less" scoped>
  .transaction_bg {
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

    .transaction_info {
      margin: 10px 0;

      .overline_one {
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
        // width: 100px;
        // display: inline-block;
        margin-right: 5px;
      }

    }

    .transaction_page {
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
  }

</style>
