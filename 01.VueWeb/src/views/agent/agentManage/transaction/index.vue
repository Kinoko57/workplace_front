<template>
  <div>
    <router-view />
    <div v-if="isShow" class="transaction_bg">
      <div class="fifter">
        <my-tabs
          :page-name="page_name"
          :module-name="module_name"
          :module-type="'2'"
          :add="btnPermission('agent_agentcreate')"
          :active-name="searchInfo.mode"
          :tabs-list="typeList"
          @addAction="addProxy"
          @handleClick="choseType"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)"/>
          <!-- <search-fifter
          :add-text="'创建经销商'"
          :add="true"
          :fifter="true"
          :delay-fifter="loading==false"
          :export-show="btnPermission('agent_agentexport')"
          :export-type="moduleType"
          :export-name="'经销商列表'"
          :module-name="'agent'"
          @addAction="addProxy"
          @search="fifterSearch" /> -->
      </div>
      <div class="transaction_info">
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}个经销商<span v-if="searchInfo.mode!='blacklist'">，已选中{{ choseTotal }}条</span></span>
            <el-button v-if="searchInfo.mode!='blacklist'" plain size="mini" @click="batchstop('black')">加入黑名单</el-button>
          </div>
          <div class="export_btn">
            <search-fifter
              :download-url="downloadUrl"
              :upload-url="uploadUrl"
              :import-show="btnPermission('agent_importagent')"
              :export-show="btnPermission('agent_agentexport')"
              :export-type="moduleType"
              :export-name="'经销商列表'"
              :module-name="'agent'"
              @importAction="importAction"/>
          </div>
        </div>
        <el-table
          v-loading="loading"
          ref="table"
          :data="tableData"
          :max-height="tableHeight"
          border
          row-key="id"
          style="width: 100%"
          tooltip-effect="light"
          @sort-change="fifterTable"
          @selection-change="handleSelectionChange">
          <el-table-column v-show="searchInfo.mode!='blacklist'" type="selection" min-width="40" fixed="left" align="center"/>
          <el-table-column prop="business_name" label="经销商名称" min-width="120" show-overflow-tooltip/>
          <el-table-column prop="name" label="姓名" min-width="210" show-overflow-tooltip>
            <template slot-scope="scope">
              <div style="display: inline-flex;">
                <span class="overline_one">{{ scope.row.name }}</span>
                <label-color
                  v-if="scope.row.iconname!=''&&btnPermission('agent_isseeagentprox')"
                  :color="scope.row.iconcolor"
                  :text="scope.row.iconname" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号码" min-width="120" show-overflow-tooltip/>
          <el-table-column prop="wechat" label="微信号码" min-width="100" show-overflow-tooltip/>
          <el-table-column prop="salesId" label="所属销售" min-width="100px" show-overflow-tooltip/>
          <el-table-column prop="serviceId" label="客服号" min-width="100px" show-overflow-tooltip/>
          <el-table-column prop="deffassignDate" label="距上次跟进" min-width="120px" show-overflow-tooltip/>
          <el-table-column v-if="btnPermission('agent_isseeagentleavel')" prop="levleId" label="经销商等级" min-width="100px" show-overflow-tooltip/>
          <el-table-column v-if="!btnPermission('agent_isseeagentleavel')" label="经销商等级" min-width="120">
            <template>
              <span>****</span>
            </template>
          </el-table-column>
          <el-table-column prop="auth_code" label="授权号" min-width="100px" show-overflow-tooltip/>
          <el-table-column prop="transformationDate" label="成交时间" sortable="custom" min-width="160px" show-overflow-tooltip/>
          <el-table-column prop="assignDate" label="上次跟进时间" sortable="custom" min-width="160px" show-overflow-tooltip/>
          <el-table-column prop="nextDate" label="下次跟进时间" sortable="custom" min-width="160px" show-overflow-tooltip/>
          <el-table-column v-if="tableData.length>0" label="操作" min-width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="goFllow(scope.row,'view')">查看</el-button>
              <el-button
                v-if="btnPermission('agent_agentassign')&&searchInfo.mode!='blacklist'"
                type="text"
                size="small"
                @click="goFllow(scope.row,'follow')">跟进</el-button>
              <el-button v-if="btnPermission('agent_addicon')&&searchInfo.mode!='blacklist'" type="text" size="small" @click="showModel(scope.row,'addproxy')">添加标签</el-button>
              <el-button
                v-if="btnPermission('agent_removeblacklist')&&searchInfo.mode=='blacklist'"
                type="text"
                class="menu_btn"
                size="small"
                @click="showMessage(scope.row,'removeblack')">移出黑名单</el-button>
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
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="btnPermission('agent_closeagent')">
                    <el-button type="text" size="small" class="menu_btn" @click="showMessage(scope.row,'close')">流失经销商
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="btnPermission('agent_editadress')">
                    <el-button type="text" size="small" class="menu_btn" @click="showModel(scope.row,'addr')">修改地址
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="btnPermission('agent_bindwx')">
                    <el-button type="text" size="small" class="menu_btn" @click="showModel(scope.row,'wechat')">
                      管理微信小号</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="btnPermission('agent_bindwx')">
                    <el-button type="text" size="small" class="menu_btn" @click="showModel(scope.row,'chain')">
                      管理微连锁号</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="btnPermission('agent_removeblacklist')&&searchInfo.mode!='blacklist'">
                    <el-button
                      type="text"
                      class="menu_btn"
                      size="small"
                      @click="showMessage(scope.row,'removeblack')">移出黑名单</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="btnPermission('agent_addblacklist')">
                    <el-button type="text" size="small" class="menu_btn" @click="showMessage(scope.row,'addblack')">
                      加入黑名单</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="btnPermission('agent_agentappoint')&&searchInfo.mode!='blacklist'">
                    <el-button
                      type="text"
                      size="small"
                      class="menu_btn"
                      @click="showModel(scope.row,'assign')">分配客服</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="btnPermission('agent_grantwelfare')">
                    <el-button type="text" size="small" class="menu_btn" @click="showModel(scope.row,'addwelfare')">添加福利</el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="modelShow" :title="modelTitle" class="dialogModel" @close="resetModel">
      <!-- 添加经销商 -->
      <el-scrollbar v-if="modelType=='proxy'&& modelShow" class="fixed_scroll over_scroll">
        <el-form
          ref="proxyInfoForm"
          :model="proxyInfoForm"
          :rules="proxyInfoRules"
          class="modelForm"
          label-position="right"
          label-width="120px">
          <el-form-item label="关联商机：" prop="businessId">
            <el-select
              v-model="proxyInfoForm.businessId"
              :loading="selectLoading"
              :disabled="disab"
              :remote-method="getSelectList"
              remote
              filterable
              placeholder="请选择关联商机或输入搜索后选择关联商机"
              style="width:500px"
              clearable
              reserve-keyword
              @clear="resetSearch"
              @change="choseBussiness">
              <el-option v-for="(item,index) in bussinessShowList" :label="item.label" :value="item.value" :key="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="经销商名称：" prop="business_name">
            <el-input v-model.trim="proxyInfoForm.business_name" :disabled="proxyInfoForm.businessId!=''" autocomplete="off" style="width:500px" placeholder="请输入姓名"/>
          </el-form-item>
          <el-form-item label="公主购邀请码：" prop="Invitation_code">
            <el-input v-model.trim="proxyInfoForm.Invitation_code" autocomplete="off" style="width:500px" placeholder="请输入公主购邀请码"/>
          </el-form-item>
          <el-form-item label="姓名：" prop="name">
            <el-input v-model.trim="proxyInfoForm.name" :disabled="proxyInfoForm.businessId!=''" autocomplete="off" style="width:500px" placeholder="请输入姓名"/>
          </el-form-item>
          <el-form-item label="性别：" prop="sex">
            <el-radio-group v-model.trim="proxyInfoForm.sex" :disabled="proxyInfoForm.businessId!=''" placeholder="请选择性别">
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="手机号：" prop="phone">
            <el-input v-model.trim="proxyInfoForm.phone" :disabled="proxyInfoForm.businessId!=''" autocomplete="off" style="width:500px" placeholder="请输入手机号"/>
          </el-form-item>
          <el-form-item label="微信号：" prop="wechat">
            <el-input v-model.trim="proxyInfoForm.wechat" :disabled="proxyInfoForm.businessId!=''" autocomplete="off" style="width:500px" placeholder="请输入微信号"/>
          </el-form-item>
          <el-form-item label="部门职务：" prop="job">
            <el-input v-model.trim="proxyInfoForm.job" autocomplete="off" style="width:500px" placeholder="请输入部门职务" />
          </el-form-item>
          <el-form-item label="来源：">
            <el-input v-model.trim="proxyInfoForm.source" :disabled="isdisable" autocomplete="off" style="width:500px" placeholder="请输入来源"/>
          </el-form-item>
          <el-form-item label="QQ号：" prop="qq">
            <el-input v-model.trim="proxyInfoForm.qq" :disabled="isdisable2" autocomplete="off" style="width:500px" placeholder="请输入QQ号"/>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model.trim="proxyInfoForm.email" :disabled="isdisable3" autocomplete="off" style="width:500px" placeholder="请输入邮箱"/>
          </el-form-item>
          <el-form-item label="授权号：" prop="contractCode">
            <el-select v-model="proxyInfoForm.contractCode" clearable filterable placeholder="请输入授权号" style="width:500px" @change="choseCourse">
              <el-option v-for="(item, index) in contractList" :key="index" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="经销商等级：" prop="levleId">
            <el-select v-model="proxyInfoForm.levleId" filterable disabled placeholder="请选择经销商等级" style="width:500px">
              <el-option v-for="(item,index) in agentLevelList" :label="item.label" :value="item.value" :key="index"/>
            </el-select>
          </el-form-item>
          <el-form-item label="省市区：" prop="areas">
            <el-cascader ref="areasName" :options="areaList" v-model="proxyInfoForm.areas" style="width:500px" placeholder="请选择省市区" @change="getAreasValue"/>
          </el-form-item>
          <el-form-item label="详细地址：" prop="address">
            <el-input :rows="4" v-model.trim="proxyInfoForm.address" type="textarea" style="width:500px" placeholder="请输入详细地址，最大长度为120个字" />
          </el-form-item>
          <el-form-item label="生日：" prop="birthday">
            <el-date-picker
              v-model="proxyInfoForm.birthday"
              style="width:500px"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间"/>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <el-scrollbar v-if="modelType!='proxy'&& modelShow" class="fixed_scroll">
        <!-- 指派 -->
        <el-form
          v-if="modelType=='assign'&&modelShow"
          ref="assignForm"
          :model="assignForm"
          :rules="assignRules"
          class="modelForm"
          label-width="100px"
          label-position="right">
          <el-form-item label="原客服号：" label-width="106px">
            <el-input v-model="assignForm.oldsald" autocomplete="off" disabled="disabled" style="width:500px" />
          </el-form-item>
          <el-form-item label="分配客服号：" prop="serviceId" label-width="106px">
            <el-select v-model="assignForm.serviceId" filterable placeholder="请选择分配人" style="width:500px">
              <el-option v-for="(item,index) in selectList" :label="item.label" :value="item.value" :key="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="分配原因：" prop="remarks" label-width="106px">
            <el-input :rows="4" v-model.trim="assignForm.remarks" type="textarea" style="width:500px" placeholder="请输入内容,最大长度为120个字" />
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
            <el-select v-model="proxyForm.iconId" filterable placeholder="请选择标签" style="width:500px">
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
            <el-select v-model="welfareForm.welfareId" placeholder="请选择福利" filterable style="width:500px">
              <el-option v-for="(item,index) in welfareList" :label="item.label" :value="item.value" :key="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="数量：" prop="number">
            <!-- <el-input
            v-model="welfareForm.number"
            autocomplete="off"
            style="width:500px"
            type="number"
            min="0"
            placeholder="请输入数量" /> -->
            <template>
              <el-input-number v-model.trim="welfareForm.number" :precision="0" :min="1" :max="500" size="large" style="width:500px" controls-position="right" placeholder="请输入数量"/>
            </template>
          </el-form-item>
          <el-form-item label="发放说明：" prop="remarks">
            <el-input :rows="6" v-model.trim="welfareForm.remarks" type="textarea" placeholder="请输入发放说明,最大长度为120个字" style="width:500px"/>
          </el-form-item>
          <el-form-item label="联系人：" prop="shipName">
            <el-input v-model.trim="welfareForm.shipName" autocomplete="off" style="width:500px" placeholder="请输入联系人"/>
          </el-form-item>
          <el-form-item label="联系电话：" prop="mobile">
            <el-input v-model.trim="welfareForm.mobile" autocomplete="off" style="width:500px" placeholder="请输入联系电话"/>
          </el-form-item>
          <el-form-item label="省市区：" prop="shipAreas">
            <el-cascader ref="shipArea" :options="areaList" v-model="welfareForm.shipAreas" style="width:500px" placeholder="请选择省市区" @change="getAreaValues('address')"/>
          </el-form-item>
          <el-form-item label="详细地址：" prop="shipAddr">
            <el-input :rows="4" v-model.trim="welfareForm.shipAddr" type="textarea" style="width:500px" placeholder="请输入详细地址,最大长度为120个字" />
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
            <el-input v-model.trim="wechatForm.wechat" placeholder="请输入微信小号" style="width:500px" />
            <el-button type="primary" @click="addWechat">添加</el-button>
          </el-form-item>
          <el-form-item label="已添加小号：">
            <el-tag
              v-for="(item, index) in wechatList"
              :key="index"
              :disable-transitions="false"
              closable
              style="margin-right:10px;"
              @close="removeWechat(item.value,'small',item.label)">
              {{ item.label }}
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
            <el-input v-model.trim="wechatLinkForm.wechat" placeholder="请输入微连锁号" style="width:500px" />
            <el-button type="primary" @click="addWechat">添加</el-button>
          </el-form-item>
          <el-form-item label="已添加锁号：">
            <el-tag
              v-for="(item, index) in wechatList"
              :key="index"
              :disable-transitions="false"
              closable
              style="margin-right:10px;"
              @close="removeWechat(item.value,'link',item.label)">
              {{ item.label }}
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
            <el-cascader ref="areaNameAdress" :options="areaList" v-model="addrForm.areas" style="width:500px" placeholder="请选择省市区" @change="getAreaValue('address')"/>
          </el-form-item>
          <el-form-item label="详细地址：" prop="address">
            <el-input :rows="4" v-model.trim="addrForm.address" type="textarea" style="width:500px" placeholder="请输入详细地址,最大长度为120个字" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div v-if="modelType!='chain'&&modelType!='wechat'" slot="footer" class="dialog-footer">
        <el-button v-show="modelType!='addr'" @click="restForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAgentInfo,
  addagentAppointLabel,
  saveagentAppoint,
  editAdress,
  AddWxchat,
  getWxchatList,
  deleteOneById,
  closeAgent,
  AddblackList,
  RmoveblackList,
  getagenticon,
  addagenticon,
  getwelfarelist,
  grantwelfare,
  addTransformationLabel,
  getBussinessList,
  getBussinessById,
  saveBusinessInfo,
  deletelWxCode,
  getContractList,
  welfTips,
  searchContract,
  transactionblack
} from '@/api/agent'
import {
  getAreaList
} from '@/api/public'
export default {
  name: 'Transaction',
  data() {
    const checkNum = (rule, value, callback) => {
      if (!value) {
        return new Error('福利不能为空')
      } else {
        if (value < 0) {
          callback(new Error('输入的福利数量不能为负数'))
        } else {
          callback()
        }
      }
    }
    return {
      selectLoading: false,
      downloadUrl: '',
      uploadUrl: '',
      disab: false,
      assignId: '',
      selectList: [],
      page_name: 'agent',
      module_name: 'agent',
      choseTotal: 0,
      moduleType: '/agent/agent-agentexport',
      tableData: [],
      isShow: true,
      modelType: 'transaction',
      modelShow: false,
      modelTitle: '',
      newType: '',
      tableHeight: 250,
      typeList: [],
      wechatList: [],
      bussinessList: [],
      bussinessShowList: [],
      loading: true,
      contractList: [],
      isdisable: false,
      isdisable2: false,
      selectArr: [],
      isdisable3: false,
      proxyInfoForm: {
        business_name: '',
        businessId: '',
        Invitation_code: '',
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
        birthday: '',
        areas: []
      },
      proxyInfoRules: {
        business_name: [{
          required: true,
          message: '经销商名称不能为空',
          trigger: 'blur'
        }, {
          min: 2,
          max: 20,
          message: '经销商名称的长度为2-20',
          trigger: 'blur'
        }],
        Invitation_code: [{
          required: false,
          message: '公主购邀请码不能为空',
          trigger: 'blur'
        }, {
          min: 2,
          max: 50,
          message: '公主购邀请码长度为2-50',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '姓名不能为空',
          trigger: 'blur'
        }, { min: 2, max: 20, message: '姓名在2-20位之间', trigger: 'blur' }],
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
        levleId: [{
          required: true,
          message: '经销商等级不能为空',
          trigger: 'change'
        }],
        contractCode: [
          {
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
          message: '地址不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '地址长度超出范围1-120位之间', trigger: 'blur' }],
        birthday: [
          {
            required: true,
            message: '请选择生日',
            trigger: 'change'
          }
        ]
      },
      // 指派表单
      assignForm: {
        oldsald: '',
        serviceId: '',
        remarks: ''
      },
      assignRules: {
        serviceId: [{
          required: true,
          message: '分配人不能为空',
          trigger: 'change'
        }],
        remarks: [{
          required: true,
          message: '分配原因不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '指派原因长度超出范围1-120位之间', trigger: 'blur' }]
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
          message: '微信小号不能为空',
          trigger: 'blur'
        }
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
          message: '微连锁号不能为空',
          trigger: 'blur'
        }
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
      addrRules: {
        areas: [{
          required: true,
          message: '省市区不能为空',
          trigger: 'change'
        }],
        address: [{
          required: true,
          message: '详细地址不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '地址长度超出范围1-120位之间', trigger: 'blur' }]
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
        number: '1',
        remarks: '',
        mobile: '',
        shipAddr: '',
        shipArea: '',
        shipName: ''
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
          trigger: 'change'
        }, { validator: checkNum, trigger: 'blur' }],
        remarks: [{
          required: true,
          message: '发放说明不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '发放说明长度超出范围1-120位之间', trigger: 'blur' }],
        shipName: [{
          required: false,
          message: '联系人不能为空',
          trigger: 'blur'
        }, { min: 2, max: 20, message: '联系人长度在2-20位之间', trigger: 'blur' }],
        mobile: [{
          required: false,
          message: '联系电话不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^[1][0-9]{10}$/,
          message: '联系电话格式错误',
          trigger: 'blur'
        }],
        shipAreas: [{
          required: false,
          message: '省市区不能为空',
          trigger: 'change'
        }],
        shipAddr: [{
          required: false,
          message: '地址不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '地址长度超出范围1-120位之间', trigger: 'blur' }]
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
  mounted() {
    this.uploadUrl = process.env.BASE_API + 'agent/agent-importAgent'
    this.downloadUrl = process.env.BASE_API + 'data/download/经销商模板.csv'
    // 获取列表
    this.getList()
    this.getOtherList()
  },
  created() {
    if (this.btnPermission('agent_allagent')) {
      this.typeList = [{
        label: '全部经销商',
        name: 'all'
      },
      {
        label: '急需联系',
        name: 'inneed'
      },
      {
        label: '今日联系',
        name: 'today'
      },
      {
        label: '本周内联系',
        name: 'week'
      },
      {
        label: '本月内联系',
        name: 'month'
      },
      {
        label: '黑名单',
        name: 'blacklist'
      }
      ]
    } else {
      this.typeList = [
        {
          label: '急需联系',
          name: 'inneed'
        },
        {
          label: '今日联系',
          name: 'today'
        },
        {
          label: '本周内联系',
          name: 'week'
        },
        {
          label: '本月内联系',
          name: 'month'
        },
        {
          label: '黑名单',
          name: 'blacklist'
        }
      ]
      this.searchInfo.mode = 'inneed'
    }
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
        that.$confirm('确定要批量将经销商“加入黑名单”吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          transactionblack(obj).then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                type: 'success',
                message: '操作成功'
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
          console.log('取消')
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
      if (this.modelType === 'proxy') {
        this.$refs['proxyInfoForm'].resetFields()
        this.proxyInfoForm = {
          businessId: '',
          salesId: '',
          Invitation_code: '',
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
          birthday: '',
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
          serviceId: '',
          remarks: ''
        }
      } else if (this.modelType === 'addwelfare') {
        this.$refs['welfareForm'].resetFields()
        this.welfareForm = {
          welfareId: '',
          number: '1',
          remarks: '',
          mobile: '',
          shipAddr: '',
          shipArea: '',
          shipName: ''
        }
      }
    },
    getList() {
      const that = this
      getAgentInfo(this.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200 || res.code === '200') {
          that.tableData = res.data.agent
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
      // 获取标签列表
      getagenticon().then(res => {
        console.log(res)
        if (res.code === 200) {
          that.iconList = res.data
        }
      })
      // 获取福利列表
      getwelfarelist().then(res => {
        console.log(res)
        if (res.code === 200) {
          that.welfareList = res.data
        }
      })
      // 获取经销商等级
      addTransformationLabel().then(res => {
        if (res.code === 200) {
          that.agentLevelList = res.data
        }
      })
      // 获取全部商机列表
      getBussinessList('').then(res => {
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
    choseCourse(e) {
      for (let i = 0; i < this.contractList.length; i++) {
        if (e == this.contractList[i].label) {
          this.proxyInfoForm.auth_code = this.contractList[i].value
        }
      }
      console.log(e, 'hdzg')
      searchContract(e).then(res => {
        console.log(res, 'fdsafsag')
        this.proxyInfoForm.levleId = res.data.level
      })
    },
    // getFromBussinessList() {
    //   const that = this
    //   // 获取全部商机列表
    //   getBussinessList('').then(res => {
    //     if (res.code === 200) {
    //       that.bussinessList = res.data
    //       that.bussinessShowList = res.data
    //     }
    //   })
    // },
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
    resetModel() {
      if (this.modelType === 'proxy') {
        console.log('重置表单')
        // this.$refs['proxyInfoForm'].resetFields()
        this.proxyInfoForm = {
          businessId: '',
          salesId: '',
          Invitation_code: '',
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
          birthday: '',
          areas: []
        }
        this.proxyInfoForm.businessId = ''
        this.isdisable = false
        this.isdisable2 = false
        this.isdisable3 = false
      } else if (this.modelType === 'addwelfare') {
        this.welfareForm = {
          welfareId: '',
          number: '1',
          remarks: '',
          mobile: '',
          shipAddr: '',
          shipArea: '',
          shipName: ''
        }
      } else if (this.modelType === 'chain') {
        this.wechatLinkForm = {
          wechat: '',
          type: ''
        }
      } else if (this.modelType === 'wechat') {
        this.wechatForm = {
          wechat: '',
          type: ''
        }
      } else if (this.modelType === 'addproxy') {
        this.proxyForm = {
          iconId: ''
        }
      } else {
        // this.$refs['assignForm'].resetFields()
        this.assignForm = {
        }
      }
      this.modelShow = false
      this.submitting = false
    },
    addProxy() {
      this.modelType = 'proxy'
      this.modelShow = true
      this.modelTitle = '新增'
      // this.getFromBussinessList()
    },
    choseBussiness(e) {
      console.log(e)
      const that = this
      if (e !== '') {
      // 获取对应商机的详细信息
        getBussinessById(e).then(res => {
          console.log(res)
          if (res.code === 200 || res.code === '200') {
            console.log(res.data, '关联')
            const data = res.data
            that.proxyInfoForm = {
              business_name: data.business_name,
              Invitation_code: data.Invitation_code,
              job: data.job,
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
              birthday: data.birthday != '0000-00-00' ? data.birthday : '',
              address: data.address,
              areas: [data.provinceId, data.cityId, data.areaId]
            }
            console.log(that.proxyInfoForm.source, that.proxyInfoForm.qq, that.proxyInfoForm.email, 'gfxhfg')
            if (that.proxyInfoForm.source !== '' && that.proxyInfoForm.businessId !== '') {
              that.isdisable = true
            }
            if (that.proxyInfoForm.qq !== '' && that.proxyInfoForm.businessId !== '') {
              that.isdisable2 = true
            }
            if (that.proxyInfoForm.email !== '' && that.proxyInfoForm.businessId !== '') {
              that.isdisable3 = true
            }
          }
        })
        that.$refs['proxyInfoForm'].resetFields()
        that.isdisable = false
        that.isdisable2 = false
        that.isdisable3 = false
      } else {
        that.proxyInfoForm = {
          businessId: '',
          salesId: '',
          Invitation_code: '',
          name: '',
          job: '',
          sex: '1',
          phone: '',
          wechat: '',
          source: '',
          qq: '',
          email: '',
          levleId: '',
          contractCode: '',
          birthday: '',
          address: '',
          areas: []
        }
        that.$refs['proxyInfoForm'].resetFields()
      }
    },
    // 输入筛选下拉款
    getSelectList(query) {
      console.log(query)
      const that = this
      if (query != '') {
        this.selectLoading = true
        setTimeout(() => {
          this.selectLoading = false
          // 获取下拉框的商机列表
          getBussinessList(query).then(res => {
            if (res.code === 200) {
              that.bussinessList = res.data
              that.bussinessShowList = res.data
            }
          })
        }, 500)
      } else {
        console.log('输入为空')
        getBussinessList('').then(res => {
          if (res.code === 200) {
            that.bussinessList = res.data
            that.bussinessShowList = res.data
          }
        })
      }
    },
    resetSearch() {
      // 获取全部商机列表
      const that = this
      getBussinessList('').then(res => {
        if (res.code === 200) {
          that.bussinessList = res.data
          that.bussinessShowList = res.data
        }
      })
    },
    // closeDialog(done) {
    //   this.$confirm('确认关闭？')
    //     .then(_ => {
    //       done()
    //       location.reload()
    //     })
    //     .catch(_ => { })
    // },
    clear() {
      if (this.modelType === 'wechat') {
        this.$refs['wechatForm'].resetFields()
      }
      if (this.modelType === 'chain') {
        this.$refs['wechatLinkForm'].resetFields()
      }
    },
    getAreaValue() {
      console.log(this.$refs['areaNameAdress'].getCheckedNodes()[0].pathLabels)
      const arr = this.$refs['areaNameAdress'].getCheckedNodes()[0].pathLabels
      this.addrForm.areasName = arr.join(',')
    },
    getAreasValue() {
      const arr = this.$refs['areasName'].getCheckedNodes()[0].pathLabels
      this.proxyInfoForm.areasName = arr.join(',')
    },
    getAreaValues() {
      const arr = this.$refs['shipArea'].getCheckedNodes()[0].pathLabels
      this.welfareForm.shipArea = arr.join(',')
    },
    saveModel() {
      const that = this
      if (this.modelType === 'assign') {
        // 分配
        this.$refs['assignForm'].validate((valid) => {
          if (valid) {
            console.log(this.assignForm)
            that.submitting = true
            saveagentAppoint(this.assignId, this.assignForm).then(res => {
              console.log(res)
              that.submitting = false
              if (res.code === 200 || res.code === '200') {
                this.$message({
                  message: '分配成功！',
                  type: 'success'
                })
                that.$refs['assignForm'].resetFields()
                that.modelShow = false
                that.assignForm = {}
                that.getList()
              } else {
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
          }
        })
      } else if (this.modelType === 'addr') {
        this.$refs['addrForm'].validate((valid) => {
          if (valid) {
            console.log(this.addrForm)
            that.submitting = true
            editAdress(this.assignId, this.addrForm).then(res => {
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
                that.addrForm = {}
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
                that.proxyForm = {}
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
            welfTips(this.welfareForm.welfareId, this.assignId).then(res => {
              console.log(res)
              if (res.code === 200 || res.code === '200') {
                if (res.data.number != '') {
                  const msg = '该福利已经发放' + res.data.number + '件，最后一次发放时间是' + res.data.createdDate + '，是否要继续发放'
                  this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    const info = {
                      mobile: this.welfareForm.mobile,
                      number: this.welfareForm.number,
                      remarks: this.welfareForm.remarks,
                      shipAddr: this.welfareForm.shipAddr,
                      shipArea: this.welfareForm.shipArea,
                      shipName: this.welfareForm.shipName,
                      welfareId: this.welfareForm.welfareId
                    }
                    grantwelfare(this.assignId, info).then(res => {
                      console.log(res)
                      that.submitting = false
                      if (res.code === 200 || res.code === '200') {
                        this.$message({
                          message: '添加福利成功！',
                          type: 'success'
                        })
                        that.modelShow = false
                        that.$refs['welfareForm'].resetFields()
                        that.welfareForm = {
                          welfareId: '',
                          number: '1',
                          remarks: ''
                        }
                        that.getList()
                      } else {
                        that.$message({
                          message: res.data.msg,
                          type: 'warning'
                        })
                        that.welfareForm = {
                          welfareId: '',
                          number: '1',
                          remarks: ''
                        }
                        that.modelShow = false
                      }
                    })
                  }).catch(() => {
                    that.submitting = false
                    console.log('取消成功')
                  })
                } else {
                  const info = {
                    mobile: this.welfareForm.mobile,
                    number: this.welfareForm.number,
                    remarks: this.welfareForm.remarks,
                    shipAddr: this.welfareForm.shipAddr,
                    shipArea: this.welfareForm.shipArea,
                    shipName: this.welfareForm.shipName,
                    welfareId: this.welfareForm.welfareId
                  }
                  grantwelfare(this.assignId, info).then(res => {
                    console.log(res)
                    that.submitting = false
                    if (res.code === 200 || res.code === '200') {
                      this.$message({
                        message: '添加福利成功！',
                        type: 'success'
                      })
                      that.modelShow = false
                      that.$refs['welfareForm'].resetFields()
                      that.welfareForm = {
                        welfareId: '',
                        number: '1',
                        remarks: ''
                      }
                      that.getList()
                    } else {
                      that.$message({
                        message: res.data.msg,
                        type: 'warning'
                      })
                      that.welfareForm = {
                        welfareId: '',
                        number: '1',
                        remarks: ''
                      }
                      that.modelShow = false
                    }
                  })
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
      } else if (this.modelType === 'proxy') {
        // 关联商机
        this.$refs['proxyInfoForm'].validate((valid) => {
          if (valid) {
            console.log(this.proxyInfoForm, 'fsdfsdfds')
            if (this.proxyInfoForm.phone == '' && this.proxyInfoForm.wechat == '') {
              that.$message({
                message: '手机号和微信号必须填一个',
                type: 'warning'
              })
            } else {
              that.submitting = true
              console.log(this.proxyInfoForm, 'sldfk')
              saveBusinessInfo(this.proxyInfoForm).then(res => {
                that.submitting = false
                if (res.code === 200 || res.code === '200') {
                  this.$message({
                    message: '经销商添加成功！',
                    type: 'success'
                  })
                  that.$refs['proxyInfoForm'].resetFields()
                  that.modelShow = false
                  that.getList()
                  that.proxyInfoForm = {
                    businessId: '',
                    salesId: '',
                    Invitation_code: '',
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
                  // 获取全部商机列表
                  getBussinessList().then(res => {
                    if (res.code === 200) {
                      that.bussinessList = res.data
                      that.bussinessShowList = res.data
                    }
                  })
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
      }
    },
    addWechat() {
      const that = this
      if (this.modelType === 'wechat') {
        this.wechatForm.type = 1
        // 添加微信小号
        this.$refs['wechatForm'].validate((valid) => {
          if (valid) {
            AddWxchat(this.assignId, this.wechatForm).then(res => {
              console.log(res)
              // this.wechatForm.type = 1;
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '添加微信小号成功！',
                  type: 'success'
                })
                getWxchatList('small', this.assignId).then(res => {
                  that.wechatList = res.data
                  console.log(that.wechatList)
                })
                that.$refs['wechatForm'].resetFields()
                // that.wechatForm = {

                // }
                // that.modelShow = false
                // that.getList()
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
      } else if (this.modelType === 'chain') {
        this.wechatLinkForm.type = 2
        this.$refs['wechatLinkForm'].validate((valid) => {
          if (valid) {
            console.log(valid)
            console.log(this.wechatLinkForm)
            AddWxchat(this.assignId, this.wechatLinkForm).then(res => {
              if (res.code === 200 || res.code === '200') {
                this.$message({
                  message: '添加微连锁号成功',
                  type: 'success'
                })
                getWxchatList('link', this.assignId).then(res => {
                  that.wechatList = res.data
                  console.log(that.wechatList)
                })
                that.$refs['wechatLinkForm'].resetFields()
                // that.wechatLinkForm = {}
                // setTimeout();
                // that.modelShow = false
                // that.getList()
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
    viewInfo(data) {
      this.isShow = false
      this.$router.push({
        path: '/agent/transactionIndex/info?id=' + data.id
      })
    },
    goFllow(data, type) {
      this.isShow = false
      this.$router.push({
        path: '/agent/transactionIndex/follow?id=' + data.id + '&choseType=' + this.searchInfo.mode + '&type=' + type
      })
    },
    choseType(value) {
      this.searchInfo.pageID = 1
      this.searchInfo.orderBy = ''
      this.searchInfo.mode = value
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
      this.$confirm('转入公海的经销商将会被其它销售领走，经销商3天后才可见，确定要“放入公海”吗？', '提示', {
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
      this.$confirm('经销商一旦作废不可恢复，确定要“作废”吗？', '提示', {
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
          title = '关闭的经销商将进入流失经销商中，确定要“关闭”吗？'
          break
        case 'del':
          title = '经销商一旦作废不可恢复，确定要“作废”吗？'
          break
        case 'addblack':
          title = '确定将经销商“加入黑名单”吗？'
          break
        case 'removeblack':
          title = '确定将经销商“移出黑名单”吗？'
          break
      }
      if (type === 'del') {
        this.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteOneById(data.id).then(res => {
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
        this.$prompt(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请填写流失理由',
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
          inputErrorMessage: '流失理由不能为空'
        }).then(({ value }) => {
          var info = {
            content: value
          }
          closeAgent(data.id, info).then(res => {
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
        // this.$confirm(title, '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   closeAgent(data.id).then(res => {
        //     if (res.code === 200 || res.code === '200') {
        //       that.$message({
        //         message: '操作成功',
        //         type: 'success'
        //       })
        //       that.getList()
        //     } else {
        //       that.$message({
        //         message: '操作失败',
        //         type: 'warning'
        //       })
        //     }
        //   })
        // }).catch(() => {
        //   console.log('取消')
        // })
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
      console.log(this.assignId)
      this.newType = type
      if (type === 'assign') {
        this.modelTitle = '分配客服号'
        addagentAppointLabel(data.id).then(res => {
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
        console.log('添加标签 ')
        this.modelTitle = '添加标签'
      } else {
        this.modelTitle = '添加福利'
      }
    },
    removeWechat(value, name, info) {
      const that = this
      console.log(value)
      console.log(name)
      console.log(info)
      if (name === 'small') {
        this.$confirm('你确定要删除微信小号吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log('确定')
          const infoData = {
            info: info,
            id: this.assignId
          }
          deletelWxCode(value, name, infoData).then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                message: '操作成功',
                type: 'success'
              })
              getWxchatList(name, this.assignId).then(res => {
                that.wechatList = res.data
                console.log(that.wechatList)
              })
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
      } else {
        this.$confirm('你确定要删除微连锁号吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const infoData = {
            info: info,
            id: this.assignId
          }
          console.log('确定')
          deletelWxCode(value, name, infoData).then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                message: '操作成功',
                type: 'success'
              })
              getWxchatList(name, this.assignId).then(res => {
                that.wechatList = res.data
                console.log(that.wechatList)
              })
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
    }
  }
}

</script>
<style lang="less" scoped>
  .transaction_bg {
    // background: #fff;
    // padding: 10px;
    position: absolute;
    width: 100%;
    top: 0;
    // .search_btn {
    //   display: flex;
    //   align-items: center;
    //   justify-content: space-between;
    // }

    .transaction_info {
      background: #fff;
      padding: 20px 10px;

      .overline_one {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 120px;
        display: inline-block;
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
      padding:0 40px
    }

    .center {
      margin: 0 70px;
    }
  }

</style>
