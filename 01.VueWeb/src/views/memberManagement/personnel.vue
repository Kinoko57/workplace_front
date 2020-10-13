/* eslint-disable no-empty */
<template>
  <div>
    <div class="person_bg">
      <div class="fifter">
        <my-tabs
          :active-name="searchInfo.mode"
          :add="btnPermission('user_create')"
          :page-name="page_name"
          :module-name="module_name"
          :tabs-list="typeList"
          @addAction="addPerson"
          @handleClick="choseType"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)" />
          <!-- <search-fifter
          :add="btnPermission('user_create')"
          :module-name="'user'"
          :fifter="true"
          :delay-fifter="loading==false"
          :add-text="'创建员工'"
          :export-type="moduleType"
          :export-name="'员工列表'"
          :export-show="true"
          @addAction="addPerson"
          @search="fifterSearch" /> -->
      </div>
      <div class="bussiness_info">
        <!-- <el-tabs type="card" class="tabs_table">
          <el-tab-pane label="全部员工"> -->
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}条数据</span>
          </div>
          <div class="export_btn">
            <search-fifter
              :export-type="moduleType"
              :export-name="'员工列表'"
              :export-show="btnPermission('user_export')"
            />
          </div>
        </div>
        <el-table v-loading="loading" :data="tableData" :max-height="tableHeight" border row-key="id" style="width: 100%" tooltip-effect="light" @sort-change="fifterTable">
          <!-- <el-table-column type="selection" width="55" /> -->
          <!-- <el-table-column  type="selection" min-width="40" fixed="left"/> -->
          <el-table-column prop="id" label="员工编号" width="100"/>
          <el-table-column prop="realname" label="姓名" min-width="150" show-overflow-tooltip />
          <el-table-column prop="mobile" label="联系方式" min-width="150" />
          <el-table-column prop="email" label="邮箱" min-width="180" />
          <el-table-column prop="organize_name" label="所属部门（角色）" min-width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.organize_name }}</span>
              <span v-show="scope.row.group_name!=''">({{ scope.row.group_name }})</span>
            </template>
          </el-table-column>
          <el-table-column prop="account" label="账号" min-width="100" />
          <el-table-column prop="join" label="创建时间" min-width="130" />
          <el-table-column v-if="searchInfo.mode=='normal'" prop="trial_end_time" label="转正时间" min-width="130" />
          <el-table-column prop="status" label="状态" min-width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.deleted=='1'" type="info">已离职</el-tag>
              <el-tag v-if="scope.row.status=='normal' && scope.row.deleted=='0'" type="success">正常</el-tag>
              <el-tag v-if="scope.row.status=='forbidden' && scope.row.deleted=='0'" type="danger">禁用</el-tag>
              <!-- <el-tag v-if="scope.row.status=='delete' && scope.row.deleted=='0'" type="warning">关闭</el-tag> -->
            </template>
          </el-table-column>
          <el-table-column v-if="tableData.length>0" label="操作" min-width="280" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="searchInfo.mode=='trial'&&btnPermission('user_become')"
                type="text"
                size="small"
                @click="changeStates(scope.row,'become')">转正</el-button>
              <el-button
                v-if="scope.row.status=='normal'&&btnPermission('user_forbid')"
                :disabled="scope.row.deleted == '1'"
                type="text"
                size="small"
                @click="changeStates(scope.row,'forbid')">禁用</el-button>
              <el-button
                v-if="scope.row.status=='forbidden'&&btnPermission('user_active')"
                :disabled="scope.row.deleted == '1'"
                type="text"
                size="small"
                @click="changeStates(scope.row,'active')">启用</el-button>
              <el-button
                v-if="btnPermission('user_edit')"
                :disabled="scope.row.deleted == '1'"
                type="text"
                size="small"
                @click="showModel(scope.row,'edit')">编辑</el-button>
              <el-button v-if="btnPermission('user_admindetail')" type="text" size="small" @click="goFllow(scope.row,'100')">查看</el-button>
              <el-button
                v-if="btnPermission('user_dimission')"
                :disabled="scope.row.deleted == '1'"
                type="text"
                size="small"
                @click="showLeave(scope.row,'leave')">离职</el-button>
              <el-button v-if="btnPermission('user_resetpassword')" :disabled="scope.row.deleted == '1'" type="text" size="small" @click="resetPass(scope.row)">
                重置密码</el-button>
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
    <el-dialog
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :visible.sync="modelShow"
      :title="modelTitle"
      width="600px"
      class="dialogModel"
      @close="resetModel">
      <!-- <div v-show="depTree||roleTree||higherTree" class="model_layer" @click="hiddenTree" /> -->
      <!-- 新建/编辑员工 -->
      <el-scrollbar v-if="modelType=='new'||modelType=='edit'&&modelShow" class="fixed_scroll over_scroll">
        <el-form
          ref="personForm"
          :model="personForm"
          :rules="rules"
          class="modelForm center"
          label-width="100px"
          label-position="right">
          <el-form-item label="姓名：" prop="realname">
            <el-input v-model.trim="personForm.realname" style="width:500px" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="性别：" prop="gender">
            <el-radio-group v-model="personForm.gender" style="width:500px" placeholder="请选择性别">
              <!-- <el-radio label="0">保密</el-radio> -->
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="生日：" prop="birthday">
            <el-date-picker
              v-model="personForm.birthday"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              style="width:500px" />
          </el-form-item>
          <el-form-item label="手机号：" prop="mobile">
            <el-input v-model.trim="personForm.mobile" style="width:500px" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model.trim="personForm.email" style="width:500px" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="员工类型：" prop="employee_type">
            <el-select v-model="personForm.employee_type" placeholder="请选择" style="width:500px">
              <el-option
                v-for="item in workType"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门：" prop="organize_id">
            <!-- <i class="red_star">*</i> -->
            <el-select v-model="personForm.organize_id" filterable placeholder="请选择所属部门" style="width:500px" @change="choseOrg(personForm.organize_id)">
              <el-option
                v-for="(select,index) in orgList"
                :label="select.label"
                :value="select.id"
                :key="index"
              />
            </el-select>
            <!-- <el-cascader
              ref="orgLabel"
              :options="orgList"
              v-model="personForm.organize_id"
              :props="defaultNode"
              :show-all-levels="false"
              :change-on-select="true"
              style="width:500px"
              placeholder="请选择所属部门"
              filterable
              @change="choseOrg(personForm.organize_id)" /> -->
          </el-form-item>
          <el-form-item label="所属角色：" prop="group_id">
            <!-- <i class="red_star">*</i> -->
            <el-select v-model="personForm.group_id" placeholder="请选择角色" style="width:500px" @change="choseRole()">
              <el-option
                v-for="(select,index) in roleDepList"
                :label="select.name"
                :value="select.id"
                :key="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="直属上级：" prop="superior_id">
            <!-- <i class="red_star">*</i> -->
            <template>
              <el-select v-model="personForm.superior_id" :disabled="personForm.group_id==1" filterable placeholder="请选择" style="width:500px">
                <el-option
                  v-for="item in higherList"
                  :key="item.id"
                  :label="item.realname"
                  :value="item.id"
                  width="400px"/>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="账号：" prop="account">
            <el-input
              v-model.trim="personForm.account"
              :disabled="modelType=='edit'"
              style="width:500px"
              placeholder="请输入账号" />
            <div class="input_tips">初始密码为账号+123，例：账号为xiaoli，密码为xiaoli123</div>
          </el-form-item>
          <el-form-item label="入职时间：" prop="join">
            <el-date-picker
              v-model="personForm.join"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              style="width:500px" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <el-scrollbar v-show="modelType=='leave'&&modelShow" :native="true" class="fixed_scroll">
        <el-form
          ref="leaveForm"
          :model="leaveForm"
          :rules="rules"
          class="modelForm center"
          label-width="100px"
          label-position="right">
          <el-form-item label="离职时间：" prop="dimission">
            <el-date-picker
              v-model="leaveForm.dimission"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              style="width:500px" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <el-scrollbar v-show="modelType=='view'" class="fixed_scroll over_scroll">
        <table class="view_dialog">
          <tr class="view_line">
            <td class="line_title">姓名：</td>
            <td class="second_line">{{ personForm.realname }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">性别：</td>
            <td class="second_line">
              <span v-if="personForm.gender==0">保密</span>
              <span v-if="personForm.gender==1">男</span>
              <span v-if="personForm.gender==2">女</span>
            </td>
          </tr>
          <tr class="view_line">
            <td class="line_title">生日：</td>
            <td class="second_line">{{ personForm.birthday }}
            </td>
          </tr>
          <tr class="view_line">
            <td class="line_title">手机号：</td>
            <td class="second_line">{{ personForm.mobile }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">邮箱：</td>
            <td class="second_line">{{ personForm.email }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">所属部门：</td>
            <td class="second_line">{{ personForm.organize_name }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">所属角色：</td>
            <td class="second_line">{{ personForm.group_name }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">直属上级：</td>
            <td class="second_line">{{ superiorName }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">账号：</td>
            <td class="second_line">{{ personForm.account }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">入职时间：</td>
            <td class="second_line">{{ personForm.join }}</td>
          </tr>
          <tr v-if="personForm.deleted!='0'" class="view_line">
            <td class="line_title">离职时间：</td>
            <td class="second_line">{{ personForm.dimission }}</td>
          </tr>
        </table>
      </el-scrollbar>
      <div v-show="modelType=='view'" slot="footer" class="dialog-footer">
        <el-button :loading="submitting" type="primary" @click="resetModel">确 定</el-button>
      </div>
      <div v-if="modelType!='view'" slot="footer" class="dialog-footer">
        <el-button v-if="modelType=='new'" @click="resetForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">{{ sureBtn }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getRoleList
} from '@/api/common'

import {
  getPersonInfo,
  changePerson,
  addPerson,
  updatePerson,
  editPerson,
  // getOrgList,
  leaveDate,
  changeHigher
} from '@/api/system'

import {
  getAllOrg
} from '@/api/public'
// import {
//   viewExam
// } from '@/api/administration'
export default {
  name: 'PersonManage',
  data() {
    return {
      orgList: [{
        id: '',
        name: ''
      }], // 组织架构列表
      defaultNode: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      page_name: 'user',
      module_name: 'sys',
      choseTotal: 0,
      typeList: [{
        label: '正式员工',
        name: 'normal'
      }, {
        label: '试用期',
        name: 'trial'
      }, {
        label: '兼职',
        name: 'part_time'
      }, {
        label: '已离职',
        name: 'separated'
      }],
      workType: [
        {
          value: '0',
          label: '全职'
        }, {
          value: '1',
          label: '兼职'
        }
      ],
      moduleType: '/sys/user-export-1',
      tableData: [],
      loading: true,
      modelType: '',
      modelTitle: '',
      modelShow: false,
      sureBtn: '确 定',
      personForm: {
        account: '',
        employee_type: '',
        password: '',
        password1: '',
        organize_id: '', // 部门id
        group_id: '', // 角色id
        realname: '',
        gender: '1', // 性别 0保密 1：男 2：女
        mobile: '',
        birthday: '',
        email: '',
        superior_id: '',
        join: ''
      },
      leaveForm: {},
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      superProps: {
        children: 'child',
        label: 'realname'
      },
      roleList: [],
      roleDepList: [],
      depList: [],
      higherList: [],
      depTree: false,
      roleTree: false,
      higherTree: false,
      depText: '',
      depName: '',
      depId: 0,
      higherText: '',
      higherName: '',
      higherId: 0,
      roleText: '',
      roleName: '',
      roleId: 0,
      value: '',
      tableHeight: 250,
      superiorName: '',
      leaveId: 0,
      rules: {
        dimission: [{
          required: true,
          message: '离职时间不能为空',
          trigger: 'change'
        }],
        realname: [{
          required: true,
          message: '员工姓名不能为空',
          trigger: 'blur'
        }, {
          min: 2,
          max: 20,
          message: '员工名称长度在2-20位',
          trigger: 'blur'
        }],
        employee_type: [{
          required: true,
          message: '员工类型不能为空',
          trigger: 'change'
        }],
        birthday: [{
          required: true,
          message: '生日不能为空',
          trigger: 'change'
        }],
        join: [{
          required: true,
          message: '入职时间不能为空',
          trigger: 'change'
        }],
        gender: [{
          required: true,
          message: '性别不能为空',
          trigger: 'change'
        }],
        account: [{
          required: true,
          message: '账号不能为空',
          trigger: 'blur'
        }, {
          min: 4,
          max: 30,
          message: '账号长度在4-30位',
          trigger: 'blur'
        }],
        mobile: [{
          required: true,
          message: '手机号不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^[1][0-9]{10}$/,
          message: '手机号格式错误',
          trigger: 'blur'
        }
        ],
        email: [{
          required: true,
          message: '邮箱不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
          message: '邮箱格式错误',
          trigger: 'blur'
        }, {
          min: 4,
          max: 32,
          message: '邮箱长度在4-32位',
          trigger: 'blur'
        }
        ],
        organize_id: [{
          required: true,
          message: '请选择部门',
          trigger: 'change'
        }],
        superior_id: [{
          required: true,
          message: '请选择直属上级',
          trigger: 'change'
        }],
        group_id: [{
          required: true,
          message: '请选择角色',
          trigger: 'change'
        }]
      },
      organizeList: [],
      searchInfo: {
        deptID: '',
        mode: 'normal', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
        search: 'id_desc', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      submitting: false,
      objList: [],
      num: 1,
      groupnum: 1,
      total: 0 // 总条数
    }
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  mounted() {
    // 获取列表
    this.getList()
    // 获取初始化数据
    this.getDefault()
  },
  methods: {
    choseOrg(value) {
      const id = value
      // const id = this.personForm.organize_id[this.personForm.organize_id.length - 1]
      this.roleDepList = []
      this.personForm.group_id = ''
      this.personForm.superior_id = ''
      for (var i = 0; i < this.roleList.length; i++) {
        if (id == this.roleList[i].organize_id) {
          this.roleDepList = this.roleList[i].data
        }
      }
      // changeRole(id).then(res => {
      //   if (res.code === 200 || res.code === '200') {
      //     if (res.data.groups.length > 0) {
      //       console.log(res.data)
      //       this.roleDepList = JSON.parse(JSON.stringify(res.data.groups))
      //     } else {
      //       this.personForm.group_id = ''
      //       this.personForm.superior_id = ''
      //       this.roleDepList = []
      //     }
      //   }
      // })
      this.$forceUpdate()
    },
    goFllow(data) {
      this.$router.push({
        path: '/memberManagement/follow',
        name: 'FollowMember',
        params: {
          id: data.id,
          organzie_id: data.id,
          account: data.account
        }
      })
    },
    searchShowAction(value) {
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
    getList() {
      const that = this
      getPersonInfo(this.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          that.tableData = res.data.users
          that.total = res.data.pager.recTotal // 总条数
          if (that.searchInfo.mode == 'normal') {
            that.moduleType = '/sys/user-export-1'
          } else {
            that.moduleType = '/sys/user-export'
          }
        }
      })
    },
    getDefault() {
      const that = this
      getAllOrg().then(res => {
        if (res.code === 200 || res.code === '200') {
          console.log(res.data)
          // const arr = res.data.organize
          // that.formatDep(arr)
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].pname != undefined) {
              res.data[i].label = res.data[i].pname + '-' + res.data[i].name
            } else {
              res.data[i].label = res.data[i].name
            }
          }

          that.orgList = res.data
          console.log(that.orgList, '部门')
        }
      })
      // 获取角色列表
      getRoleList().then(res => {
        if (res.code === 200 || res.code === '200') {
          that.roleList = res.data
        }
      })
    },
    formatDep(data) {
      data.forEach(e => {
        if (e.child && e.child.length > 0) {
          e.children = e.child
        }
        if (e.child.length > 0 && this.num < 4) {
          this.num++
          this.formatDep(e.child)
        } else {
          this.num = 1
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
      if ((this.$refs.table) !== undefined) {
        this.resetTable()
      }
      this.searchInfo.pageID = 1
      this.tableData = []
      this.getList()
    },
    addPerson() {
      this.modelTitle = '创建员工'
      this.modelType = 'new'
      this.modelShow = true
      this.sureBtn = '保 存'
    },
    choseType(value) {
      this.searchInfo.pageID = 1
      this.searchInfo.mode = value
      this.tableData = []
      this.loading = true
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
    resetPass(event) {
      const that = this
      that.$confirm('确定要重置密码吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const info = {
          ...event
        }
        const list = {
          account: info.account,
          password: info.account + '123',
          password1: info.account + '123',
          organize_id: info.organize_id, // 部门id
          group_id: info.group_id, // 角色id
          realname: info.realname,
          gender: info.gender, // 性别 0保密 1：男 2：女
          mobile: info.mobile,
          birthday: info.birthday,
          email: info.email
        }
        updatePerson(list).then(res => {
          if (res.code === 200 || res.code === '200') {
            that.$message({
              type: 'success',
              message: '密码重置成功！'
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
    changeStates(event, states) {
      const that = this
      let msg = ''
      if (states === 'active') {
        msg = '您确定要启用此员工账号吗?'
      } else if (states === 'forbid') {
        msg = '您确定要禁用此员工账号吗?'
      } else if (states === 'become') {
        msg = '您确定要转正此员工吗?'
      } else {
        msg = '您确定要关闭此员工账号吗?'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changePerson(event.account, states).then(res => {
          if (res.code === 200 || res.code === '200') {
            that.$message({
              type: 'success',
              message: '操作成功'
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
    showModel(data, type) {
      this.personForm = {
        account: data.account,
        employee_type: data.employee_type,
        // organize_id: data.organize_ids.split(',').slice(1), // 部门id
        organize_id: data.organize_id, // 部门id
        group_id: data.group_name, // 角色id
        realname: data.realname,
        gender: data.gender, // 性别 0保密 1：男 2：女
        mobile: data.mobile,
        birthday: data.birthday,
        email: data.email,
        superior_id: data.superior_id,
        join: data.join
      }
      this.depName = this.personForm.organize_name
      this.roleName = this.personForm.group_name
      // const id = this.personForm.organize_id[this.personForm.organize_id.length - 1]
      const id = this.personForm.organize_id
      for (var i = 0; i < this.roleList.length; i++) {
        if (id == this.roleList[i].organize_id) {
          this.roleDepList = this.roleList[i].data
        }
      }
      // 根据部门id获取角色列表
      // changeRole(data.organize_id).then(res => {
      //   if (res.code === 200 || res.code === '200') {
      //     if (res.data.groups.length > 0) {
      //       this.roleDepList = JSON.parse(JSON.stringify(res.data.groups))
      //     } else {
      //       // this.personForm.group_id = 0
      //       this.personForm.group_id = ''
      //       this.roleDepList = []
      //       this.roleName = ''
      //     }
      //   }
      // })
      console.log(data.group_id)
      if (data.group_id !== '1' && data.group_id !== 1) {
        // 根据角色id获取直属上级列表
        changeHigher(data.group_id, data.account).then(res => {
          if (res.code === 200 || res.code === '200') {
            if (res.data.length > 0) {
              this.higherList = JSON.parse(JSON.stringify(res.data))
            } else {
              this.personForm.superior_id = ''
              this.higherList = []
            }
          }
        })
      } else {
        console.log(11111)
        this.higherList = [{ id: '1', realname: '无上级' }]
      }
      this.modelType = type
      this.modelShow = true
      this.modelTitle = '编辑员工'
      console.log(this.higherList)
      console.log(data)
    },
    showView(data, type) {
      console.log(data, 'fffdsaw')
      this.personForm = {
        ...data
      }
      if (data.group_id !== '1' && data.group_id !== 1) {
        // 根据角色id获取直属上级列表
        changeHigher(data.group_id, data.account).then(res => {
          if (res.code === 200 || res.code === '200') {
            if (res.data.length > 0) {
              this.higherList = JSON.parse(JSON.stringify(res.data))
              this.superiorName = this.higherList.filter(item => item.id === this.personForm.superior_id)[0].realname
            } else {
              this.personForm.superior_id = ''
              this.higherList = []
            }
          }
        })
      } else {
        console.log(11111)
        // this.personForm.superior_id = '1'
        this.higherList = [{ id: '1', realname: '无上级' }]
        this.superiorName = this.higherList.filter(item => item.id === this.personForm.superior_id)[0].realname
      }
      // this.personForm.superiorName = this.higherList.filter(item => item.id === this.personForm.superior_id)
      this.modelShow = true
      this.modelType = 'view'
      this.modelTitle = '查看'
    },
    showLeave(data, type) {
      console.log(data)
      this.modelShow = true
      this.modelType = 'leave'
      this.modelTitle = '离职时间'
      this.leaveId = data.id
    },
    saveModel() {
      const that = this
      console.log(this.personForm)
      if (that.modelType === 'leave') {
        this.$refs['leaveForm'].validate((valid) => {
          if (valid) {
            that.submitting = true
            console.log(this.leaveForm)
            leaveDate(this.leaveId, this.leaveForm).then(res => {
              console.log(res, 'ddd')
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '离职时间添加成功',
                  type: 'success'
                })
                that.submitting = false
                that.resetModel()
                that.getList()
              } else {
                that.$message({
                  message: res.msg,
                  type: 'warning'
                })
                that.submitting = false
              }
            })
          }
        })
      } else {
        this.$refs['personForm'].validate((valid) => {
          if (valid) {
            that.submitting = true
            if (this.modelType === 'new') {
              // 新增员工
              const info = {
                password: this.personForm.account + '123',
                password1: this.personForm.account + '123',
                account: this.personForm.account,
                // organize_id: this.personForm.organize_id[this.personForm.organize_id.length - 1], // 部门id
                organize_id: this.personForm.organize_id, // 部门id
                group_id: this.personForm.group_id, // 角色id
                realname: this.personForm.realname,
                gender: this.personForm.gender, // 性别 0保密 1：男 2：女
                mobile: this.personForm.mobile,
                birthday: this.personForm.birthday,
                email: this.personForm.email,
                superior_id: this.personForm.superior_id,
                join: this.personForm.join,
                employee_type: this.personForm.employee_type
              }
              // this.personForm.password = this.personForm.account + '123'
              // this.personForm.password1 = this.personForm.account + '123'
              // this.personForm.organize_id = this.organizeList[organizeList.length - 1]
              console.log(this.personForm, 12)
              addPerson(info).then(res => {
                if (res.code === 200 || res.code === '200') {
                  that.$message({
                    message: '员工新增成功',
                    type: 'success'
                  })
                  that.submitting = false
                  that.resetModel()
                  that.getList()
                } else {
                  that.$message({
                    message: res.data.msg,
                    type: 'warning'
                  })
                  that.submitting = false
                }
              })
            } else {
              // 编辑员工
              const info = {
                account: this.personForm.account,
                // organize_id: this.personForm.organize_id[this.personForm.organize_id.length - 1], // 部门id
                organize_id: this.personForm.organize_id, // 部门id
                group_id: this.personForm.group_id, // 角色id
                realname: this.personForm.realname,
                gender: this.personForm.gender, // 性别 0保密 1：男 2：女
                mobile: this.personForm.mobile,
                birthday: this.personForm.birthday,
                email: this.personForm.email,
                superior_id: this.personForm.superior_id,
                join: this.personForm.join,
                employee_type: this.personForm.employee_type
              }
              console.log(info)
              editPerson(info).then(res => {
                if (res.code === 200 || res.code === '200') {
                  that.$message({
                    type: 'success',
                    message: '员工更新成功！'
                  })
                  that.submitting = false
                  that.modelShow = false
                  that.getList()
                } else {
                  that.$message({
                    type: 'warning',
                    message: res.data.msg
                  })
                  that.submitting = false
                }
              })
            }
          } else {
            console.log('error submit!!')
            this.$nextTick(() => {
              this.checkFormErr()
            })
            return false
          }
        })
      }
    },
    resetModel() {
      if (this.modelType === 'new' || this.modelType === 'edit') {
        console.log(this.$refs['reportForm'], 'dd')
        console.log('重置表单')
        this.$refs['personForm'].resetFields()
        this.personForm = {
          account: '',
          password: '',
          password1: '',
          organize_id: '', // 部门id
          group_id: '', // 角色id
          realname: '',
          gender: '1', // 性别 0保密 1：男 2：女
          mobile: '',
          birthday: '',
          employee_type: '',
          email: '',
          join: '',
          superior_id: ''// 直属上级id
        }
        this.depName = ''
        this.depText = ''
        this.roleName = ''
        this.roleText = ''
        this.value = ''
        this.depTree = false
        this.roleTree = false
        this.higherList = []
      } else if (this.modelType === 'view') {
        this.personForm = {}
        this.superiorName = ''
      } else {
        this.leaveForm = {}
        this.$refs['leaveForm'].resetFields()
      }
      this.modelShow = false
    },
    resetForm() {
      console.log('重置表单')
      this.$refs['personForm'].resetFields()
      this.personForm = {
        account: '',
        password: '',
        password1: '',
        organize_id: '', // 部门id
        group_id: '', // 角色id
        realname: '',
        employee_type: '',
        gender: '1', // 性别 0保密 1：男 2：女
        mobile: '',
        birthday: '',
        email: '',
        join: '',
        superior_id: ''// 直属上级id
      }
      this.depName = ''
      this.value = ''
      this.higherList = []
    },
    choseRole() {
      console.log(this.personForm.group_id, '11111111')
      var name = ''
      if (this.modelType === 'edit') {
        name = this.personForm.account
      }
      if (this.personForm.group_id === '1' || this.personForm.group_id === 1) {
        this.higherList = [{ id: '1', realname: '无上级' }]
        this.personForm.superior_id = '1'
      } else {
        changeHigher(this.personForm.group_id, name).then(res => {
          if (res.code === 200 || res.code === '200') {
            if (res.data.length > 0) {
              this.higherList = JSON.parse(JSON.stringify(res.data))
              this.personForm.superior_id = ''
            } else {
              this.personForm.superior_id = ''
              this.higherList = []
              this.higherName = ''
            }
          }
        })
      }
    }
  }
}

</script>
<style lang="less" scoped>
  .person_bg {
    position: absolute;
    width: 100%;
    top: 0;
    .bussiness_info {
     background: #fff;
     padding: 20px 10px;
    }

    .bussiness_page {
      text-align: center;
      padding: 10px 0;
    }
  }

  .dialogModel {
    .view_person {
      .view_line {
        overflow: hidden;
        padding: 10px 0;

        span {
          font-family: '微软雅黑 Regular', '微软雅黑';
          font-weight: 400;
          font-size: 14px;
          color: #999999;
          float: left;
          width: 460px;

          a{
            color: #409eff;
            text-decoration: underline;
          }

        }

        .line_title {
          font-weight: 400;
          color: #666666;
          width: 80px;
          text-align: right;
          margin-right:10px;
        }

        .first_line {
          font-size: 16px;
          color: #000000;
        }

        .second_line {
          font-size: 16px;
          color: #000000;
        }

        .small_font {
          font-size: 16px;
          color: #000000;
        }
      }
    }
    .model_layer {
      width: 100%;
      height: calc(100% - 60px);
      background: transparent;
      position: absolute;
      left: 0;
      top: 60px;
      z-index: 100;
    }

    .modelForm {
      margin: 0 10px;
      .input_tips{
        font-size: 12px;
        color: #AEAEAE;
        font-family: '微软雅黑 Regular', '微软雅黑';
      }
      .checkDep {
        position: relative;

        .red_star {
          position: absolute;
          left: -90px;
          font-size: 13px;
          font-family: 'Arial Normal', 'Arial';
          color: #f56c6c;
        }
      }
    }

    .center {
      margin: 0 70px;
    }

    .conversionHistory {

      .his_list {
        list-style: none;
      }
    }

    .fifter_down {
      position: relative;

      .chose_dep {
        background: transparent;
        border-color: #c0c4cc;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        height: 36px;
        line-height: 36px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;

        .text_placeholder {
          color: #c0c4cc;
        }
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
  }

</style>
