<template>
  <div>
    <div class="work_bg">
      <div class="fifter">
        <my-tabs
          :add="btnPermission('qualitylevel_create')"
          :allow-fifter="false"
          :return-show="true"
          :active-name="'all'"
          :tabs-list="tabsList"
          @addAction="addType"
          @returnAction="returnBack"/>
          <!-- <search-fifter :add="btnPermission('qualitylevel_create')" :add-text="'创建质量件类型'" :return-show="true"  @returnAction="returnBack" /> -->
      </div>
      <div class="work_info">
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}个记录</span>
          </div>
        </div>
        <el-table v-loading="loading" :data="tableData" :max-height="tableHeight" tooltip-effect="light" border>
          <el-table-column prop="name" label="类型名称" min-width="150" show-overflow-tooltip/>
          <el-table-column prop="remarks" label="备注" min-width="150" show-overflow-tooltip/>
          <el-table-column prop="createdDate" label="创建时间" sortable />
          <el-table-column prop="editedDate" label="更新时间" sortable />
          <el-table-column label="操作" align="center" min-width="140">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('qualitylevel_edit')" type="text" size="small" @click="showModel(scope.row,'edit')">编辑</el-button>
              <el-button v-if="btnPermission('qualitylevel_delete')" type="text" size="small" @click="changeStates(scope.row)">作废</el-button>
              <el-button v-if="btnPermission('qualityprocessnode_edit')" type="text" size="small" @click="showModel(scope.row,'set')">配置工作流</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="modelShow" :title="modelTitle" width="800px" class="dialogModel" @close="resetModel">
      <el-scrollbar v-if="modelShow&&modelType!='set'" class="fixed_scroll">
        <div v-if="modelShow&&modelType!='set'" class="type_info">
          <el-form
            ref="typeInfo"
            :model="typeInfo"
            :rules="typeRules"
            class="modelForm"
            label-width="100px"
            label-position="right">
            <el-form-item label="类型名称：" prop="name">
              <el-input v-model="typeInfo.name" style="width:500px" placeholder="请输入质量件类型标题" />
            </el-form-item>
            <el-form-item label="备注：" prop="remarks">
              <el-input
                v-model="typeInfo.remarks"
                :rows="3"
                type="textarea"
                style="width:500px"
                placeholder="请输入备注，最大长度为120个字" />
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
      <el-scrollbar v-if="modelShow&&modelType=='set'" class="fixed_scroll over_scroll">
        <div v-if="modelShow&&modelType=='set'" class="type_set">
          <!-- 新建/编辑工作流 :rules="rules"-->
          <el-form ref="typeSetForm" :model="typeSetForm" class="modelForm" label-width="98px" label-position="right">
            <el-form-item label="质量件类型：">
              <span> {{ setName }} </span>
            <!-- <el-input v-model="typeSetForm.title" style="width:400px" disabled /> -->
            </el-form-item>
            <div v-for="(item,index) in typeSetForm.nodeList" :key="item.key">
              <div v-show="item.depTree||item.roleTree" class="model_layer" @click="hiddenTree(index)" />
              <div class="node_list">
                <div class="node_left">
                  <el-form-item v-if="workId==1&&item.type=='condition'" class="node_left_top">
                    <el-input placeholder="采购金额" style="width:140px" class="view_right" disabled />
                    <el-input placeholder="大于等于" style="width:140px" class="view_right" disabled />
                    <el-input
                      ref="name"
                      v-model="item.condition"
                      style="width:140px"
                      class="view_right"
                      placeholder="请输入金额"
                      min="0"
                      type="number"
                      @blur="checkValue(item.condition,index)" />
                  </el-form-item>
                  <el-form-item v-if="workId==6&&item.type=='condition'" class="node_left_top">
                    <el-input placeholder="请假天数" style="width:130px;margin-right: 16px;" class="view_right" disabled />
                    <el-input placeholder="大于等于" style="width:140px;margin-right: 16px;" class="view_right" disabled />
                    <el-input
                      ref="name"
                      v-model="item.condition"
                      style="width:140px"
                      class="view_right"
                      placeholder="请输入天数"
                      min="0"
                      type="number"
                      @blur="checkValue(item.condition,index)" />
                  </el-form-item>
                  <el-form-item v-if="workId==4&&item.type=='condition'" class="node_left_top">
                    <el-input placeholder="报销金额" style="width:130px;margin-right: 16px;" class="view_right" disabled />
                    <el-input placeholder="大于" style="width:140px;margin-right: 16px;" class="view_right" disabled />
                    <el-input
                      ref="name"
                      v-model="item.condition"
                      style="width:140px"
                      class="view_right"
                      placeholder="请输入金额"
                      min="0"
                      type="number"
                      @blur="checkValue(item.condition,index)" />
                  </el-form-item>
                  <el-form-item v-if="workId==3&&item.type=='condition'" class="node_left_top">
                    <el-input placeholder="用章类型" style="width:130px;margin-right: 16px;" class="view_right" disabled />
                    <el-input placeholder="等于" style="width:140px;margin-right: 16px;" class="view_right" disabled />
                    <el-select v-model="item.condition" placeholder="请选择类型" style="width:130px" class="view_right" @change="choseZhangType(item.condition,index)">
                      <el-option v-for="(item,index) in chapterType" :key="index" :label="item" :value="index">{{ item }}</el-option>
                    </el-select>
                  </el-form-item>
                  <div class="node_left_top">
                    <el-form-item style="width:150px">
                      <el-input ref="name" v-model="item.name" style="width:130px" class="view_right" placeholder="请输入名称" @input="inputChange"/>
                    </el-form-item>
                    <el-form-item class="fifter_tree view_right" style="width:150px">
                      <!-- <el-cascader
                        ref="orgLabel"
                        :options="depList"
                        v-model="item.depName"
                        :props="defaultNode"
                        :show-all-levels="false"
                        :change-on-select="true"
                        style="width:140px"
                        placeholder="请选择部门"
                        filterable
                        @change="choseDep(item, index)" /> -->
                      <el-select v-model="item.depName" filterable placeholder="请选择审核主体" style="width:140px" @change="choseDepType(item, index)">
                        <el-option
                          v-for="(select,index) in depList"
                          :label="select.label"
                          :value="select.id"
                          :key="index"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="item.userId=='-1'" class="fifter_tree view_right" style="width:140px">
                      <el-select v-model="item.groupId" placeholder="请选择角色" style="width:140px" @change="choseRole(index)">
                        <el-option v-for="(select,index) in item.roleList" :label="select.name" :value="select.id" :key="index" />
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="item.userId!='-1'" class="fifter_tree view_right" style="width:140px">
                      <el-select v-model="item.userId" placeholder="请选择人员" style="width:140px" filterable @change="choseRole(index)">
                        <el-option v-for="(select,index) in item.userList" :label="select.realname+'-'+select.group_name" :value="select.id" :key="index" />
                      </el-select>
                    </el-form-item>
                  </div>
                </div>
                <div class="node_right">
                  <i class="el-icon-remove" @click="removeWorkNode(item)" />
                </div>
              </div>
            </div>
            <el-form-item>
              <el-button type="primary" @click="addWorkNode('normal')">添加流程节点</el-button>
            <!-- <el-button v-if="workId==1||workId==3||workId==4||workId==6" type="primary" @click="addWorkNode('condition')">添加条件节点</el-button> -->
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetModel">取 消</el-button>
        <el-button type="primary" @click="saveModel">{{ sureBtn }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import {
//   getOrgList
// } from '@/api/system'
import {
  getExecutiveOrg
} from '@/api/public'
import {
  getSystemUserList
} from '@/api/office'
import {
  getRoleList,
  getComplaintList,
  saveComplaint,
  updateComplaint,
  getComplaintDetail,
  banComplaintType
} from '@/api/quality'
import axios from 'axios'
import Qs from 'qs'
export default {
  name: 'ComplaintSetManage',
  data() {
    return {
      page_name: 'knowledge',
      module_name: 'oa',
      choseTotal: 0,
      tabsList: [
        { label: '全部类型', name: 'all' }
      ],
      shows: false,
      depTree: '',
      roleTree: '',
      value: '',
      tableData: [],
      loading: false,
      modelTitle: '新增质量件类型',
      modelShow: false,
      modelType: 'new',
      sureBtn: '确 定',
      workId: '',
      workTitle: '',
      typeSetForm: {
        nodeList: []
      },
      setName: '',
      typeInfo: {
        name: '',
        remarks: ''
      },
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      chapterType: [],
      roleList: [],
      roleDepList: [],
      depList: [{
        id: '',
        name: ''
      }],
      defaultNode: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      // depTree: false,
      depText: '',
      depName: [],
      roleText: '',
      roleName: '',
      tableHeight: 250,
      typeRules: {
        name: [{
          required: true,
          message: '标题不能为空',
          trigger: 'blur'
        }, {
          min: 2,
          max: 20,
          message: '标题长度在2-20位之间',
          trigger: 'blur'
        }],
        remarks: [{
          min: 1,
          max: 120,
          message: '长度超出范围1-120位之间',
          trigger: 'blur'
        }]
      },
      searchInfo: {
        mode: 'all', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 100, // 每页显示条数
        recTotal: 0 // 总条数
      },
      num: 1,
      total: 0 // 总条数
    }
  },
  watch: {
    depText(val) {
      console.log(val)
      if (this.modelShow) {
        console.log(this.$refs.deptree, 'refs')
        for (var i = 0; i < this.$refs.deptree.length; i++) {
          this.$refs.deptree[i].filter(val)
        }
      }
    },
    roleText(val) {
      console.log(val)
      if (this.modelShow) {
        for (var i = 0; i < this.$refs.roleTree.length; i++) {
          this.$refs.roleTree[i].filter(val)
        }
      }
    }
  },
  mounted() {
    // 获取列表
    this.getList()
    // 获取部门列表和角色列表
    this.getDefault()
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  methods: {
    getList() {
      const that = this
      getComplaintList().then(res => {
        that.loading = false
        if (res.code === 200) {
          that.tableData = res.data.agent
          that.total = res.data.pager.recTotal // 总条数
        }
      })
    },
    inputChange() {
      this.$forceUpdate()
    },
    addType() {
      // 新增
      this.modelTitle = '新增质量件类型'
      this.modelType = 'new'
      this.modelShow = true
    },
    getDefault() {
      const that = this
      getExecutiveOrg().then(res => {
        if (res.code === 200 || res.code === '200') {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].label = res.data[i].pname + '-' + res.data[i].name
          }
          const arr = res.data
          // that.formatDep(arr)
          arr.unshift({
            id: '-2',
            label: '所属部门'
          })
          arr.unshift({
            id: '-1',
            label: '指定人审核'
          })
          that.depList = arr
          console.log(that.depList)
        }
      })
      // 获取角色列表
      getRoleList().then(res => {
        if (res.code === 200 || res.code === '200') {
          that.roleList = res.data
        }
      })
      // 获取审批人列表
      getSystemUserList().then(res => {
        if (res.code === 200 || res.code === '200') {
          that.userList = res.data.users
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
    returnBack() {
      this.$router.go(-1)
    },
    addWorkNode(type) {
      const info = {
        key: Date.now(),
        name: '',
        depTree: false,
        roleTree: false,
        depText: '',
        depName: [],
        roleText: '',
        roleName: '',
        userText: '',
        userName: '',
        condition: '',
        type: 'normal',
        roleList: [],
        userList: []

      }
      if (type !== 'normal') {
        info.type = 'condition'
      }
      if (this.typeSetForm.nodeList.length === 0) {
        this.typeSetForm.nodeList.push(info)
      } else {
        let flag = true
        const list = this.typeSetForm.nodeList
        for (let i = 0; i < list.length; i++) {
          for (const item in list[i]) {
            if (list[i]['type'] === 'normal') {
              if (['name', 'key', 'depName'].includes(item)) {
                if (list[i][item] === '' || list[i][item] === null || list[i][item] === '') {
                  this.$message.warning('节点内容不能为空')
                  flag = false
                  break
                }
              }
            } else {
              if (['name', 'key', 'depName', 'condition'].includes(item)) {
                if (list[i][item] === '' || list[i][item] === null || list[i][item] === '') {
                  this.$message.warning('节点内容不能为空')
                  flag = false
                  break
                }
              }
            }
          }
        }
        if (flag) {
          this.typeSetForm.nodeList.push(info)
        }
      }
      this.$forceUpdate()
    },
    removeWorkNode(item) {
      if (this.typeSetForm.nodeList.length <= 1) {
        this.$message.warning('节点最少存在一个，不能删除！')
      } else {
        var index = this.typeSetForm.nodeList.indexOf(item)
        if (index !== -1) {
          this.typeSetForm.nodeList.splice(index, 1)
        }
        this.$forceUpdate()
      }
    },
    checkValue(val, index) {
      console.log(val)
      console.log(index)
      if (parseInt(val) < 0) {
        this.$message.warning('条件不能为负值')
        this.typeSetForm.nodeList[index].condition = ''
      }
      this.$forceUpdate()
    },
    // 过滤
    filterDepNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    filterRoleNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 显示部门列表
    showDepTree(id, index) {
      this.typeSetForm.nodeList[index].depTree = true
      this.typeSetForm.nodeList[index].roleTree = false
      this.shows = true
      this.$forceUpdate()
    },
    hiddenTree(index) {
      this.typeSetForm.nodeList[index].depTree = false
      this.typeSetForm.nodeList[index].roleTree = false
      this.$forceUpdate()
    },
    hidenDepTree(index) {
      this.typeSetForm.nodeList[index].depTree = false
      this.typeSetForm.nodeList[index].roleTree = false
      this.$forceUpdate()
    },
    // 显示角色列表
    showRoleTree(id, index) {
      this.shows = true
      this.typeSetForm.nodeList[index].depTree = false
      this.typeSetForm.nodeList[index].roleTree = true
      if (parseInt(this.typeSetForm.nodeList[index].roleId) < 0) {
        this.typeSetForm.nodeList[index].roleDepList = [{ id: '-1', name: '直属上级' }, { id: '-3', name: '主要负责人' }]
      }
      this.$forceUpdate()
    },
    // 选择部门
    choseDep(val, index) {
      const len = val.depName.length - 1
      if (this.typeSetForm.nodeList.length === 1) {
        index = 0
      }
      this.typeSetForm.nodeList[index].depName = val.depName
      if (val.depName === 0 || val.depName === '0') {
        this.typeSetForm.nodeList[index].roleList = [{ id: '-1', name: '直属上级' }, { id: '-3', name: '主要负责人' }]
        this.typeSetForm.nodeList[index].roleName = '直属上级'
        this.typeSetForm.nodeList[index].groupId = '-1'
        this.typeSetForm.nodeList[index].userId = '-1'
      } if (val.depName === -1 || val.depName === '-1') {
        this.typeSetForm.nodeList[index].roleName = '指定人审核'
        this.typeSetForm.nodeList[index].groupId = '-4'
        this.typeSetForm.nodeList[index].userId = ''
        this.typeSetForm.nodeList[index].userList = this.userList
      } else {
        for (let j = 0; j < this.roleList.length; j++) {
          if (val.depName === this.roleList[j].organize_id) {
            this.typeSetForm.nodeList[index].roleList = this.roleList[j].data
          }
        }
        this.typeSetForm.nodeList[index].userId = '-1'
        console.log(this.typeSetForm.nodeList[index].roleList)
        this.typeSetForm.nodeList[index].groupId = this.typeSetForm.nodeList[index].roleList[0].id
      }
      this.$forceUpdate()
    },
    // 新部门选择
    choseDepType(val, index) {
      // -1指定人审核，-2是所属部门
      console.log(val)
      // const len = val.depName.length - 1
      console.log(val, '111')
      console.log(index)
      console.log(this.typeSetForm.nodeList)
      if (this.typeSetForm.nodeList.length === 1) {
        index = 0
      }
      this.typeSetForm.nodeList[index].depName = val.depName
      // console.log(val.depName)
      if (val.depName === -2 || val.depName === '-2') {
        this.typeSetForm.nodeList[index].roleList = [{ id: '-1', name: '直属上级' }, { id: '-3', name: '主要负责人' }]
        this.typeSetForm.nodeList[index].roleName = '直属上级'
        this.typeSetForm.nodeList[index].groupId = '-1'
        this.typeSetForm.nodeList[index].userId = '-1'
      } if (val.depName === -1 || val.depName === '-1') {
        this.typeSetForm.nodeList[index].roleName = '指定人审核'
        this.typeSetForm.nodeList[index].groupId = '-4'
        this.typeSetForm.nodeList[index].userId = ''
        this.typeSetForm.nodeList[index].userList = this.userList
      } else {
        for (let j = 0; j < this.roleList.length; j++) {
          if (val.depName === this.roleList[j].organize_id) {
            this.typeSetForm.nodeList[index].roleList = this.roleList[j].data
          }
        }
        this.typeSetForm.nodeList[index].userId = '-1'
        console.log(this.typeSetForm.nodeList[index].roleList)
        this.typeSetForm.nodeList[index].groupId = this.typeSetForm.nodeList[index].roleList[0].id
      }
      this.$forceUpdate()
    },
    choseRole(index) {
      this.$forceUpdate()
    },
    choseZhangType(val, index) {
      this.typeSetForm.nodeList[index].condition = val
      this.$forceUpdate()
    },
    changeStates(event) {
      const that = this
      const msg = '质量件类型一旦作废不可恢复，确定要“作废”吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        banComplaintType(event.id).then(res => {
          if (res.code == 200 || res.code == '200') {
            that.$message({
              type: 'success',
              message: '作废成功~'
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
      }).catch(() => {
        console.log('用户点击了取消')
      })
    },
    showModel(data, type) {
      this.modelType = type
      // 设置工作流
      if (type === 'set') {
        const that = this
        this.workId = data.id
        this.workTitle = data.name
        this.modelTitle = '配置投诉工作流'
        this.setName = data.name
        // this.typeSetForm = {
        //   title: data.name
        // }
        // if (this.workId === '3') {
        //   getChaptertype().then(res => {
        //     if (res.code === 200) {
        //       that.chapterType = res.data.typeList
        //     }
        //   })
        // }
        getComplaintDetail(data.id).then(res => {
          if (res.code === 200 || res.code === '200') {
            that.typeSetForm.nodeList = res.data.node
            for (let i = 0; i < that.typeSetForm.nodeList.length; i++) {
              that.typeSetForm.nodeList[i].depTree = false
              that.typeSetForm.nodeList[i].roleTree = false
              that.typeSetForm.nodeList[i].roleName = that.typeSetForm.nodeList[i].group_name
              that.typeSetForm.nodeList[i].roleId = that.typeSetForm.nodeList[i].groupId
              that.typeSetForm.nodeList[i].userId = that.typeSetForm.nodeList[i].userId == 0 ? '-1' : that.typeSetForm.nodeList[i].userId
              // if (that.typeSetForm.nodeList[i].organize_id === '0') {
              //   that.typeSetForm.nodeList[i].depName = ['0']
              // } else {
              //   console.log(that.typeSetForm.nodeList[i].organize_id)
              //   that.typeSetForm.nodeList[i].depName = that.typeSetForm.nodeList[i].organize_id.split(',')
              // }
              // const len = that.typeSetForm.nodeList[i].depName.length - 1
              that.typeSetForm.nodeList[i].depName = that.typeSetForm.nodeList[i].organize_id
              that.typeSetForm.nodeList[i].type = ''
              if (that.typeSetForm.nodeList[i].groupId < 0) {
                that.typeSetForm.nodeList[i].roleList = [{ id: '-1', name: '直属上级' }, { id: '-3', name: '主要负责人' }]
              } else {
                for (let j = 0; j < this.roleList.length; j++) {
                  if (that.typeSetForm.nodeList[i].depName === this.roleList[j].organize_id) {
                    console.log(that.typeSetForm.nodeList[i].groupId)
                    that.typeSetForm.nodeList[i].roleList = this.roleList[j].data
                  }
                }
              }
              if (that.typeSetForm.nodeList[i].userId != -1) {
                that.typeSetForm.nodeList[i].userList = that.userList
              }
              switch (that.typeSetForm.nodeList[i].groupId) {
                case '-1':that.typeSetForm.nodeList[i].roleName = '直属上级'; break
                case '-3':that.typeSetForm.nodeList[i].roleName = '主要负责人'; break
              }
              if (that.typeSetForm.nodeList[i].condition !== '') {
                that.typeSetForm.nodeList[i].type = 'condition'
              } else {
                that.typeSetForm.nodeList[i].type = 'normal'
              }
            }
            that.modelShow = true
          }
        })
      } else {
        // 编辑
        this.typeInfo = {
          id: data.id,
          name: data.name,
          remarks: data.remarks
        }
        this.modelTitle = '编辑质量件类型'
        this.modelShow = true
        this.sureBtn = '保 存'
      }
    },
    // changeStates(event) {
    //   // const that = this
    //   const msg = '质量件类型一旦作废不可恢复，确定要“作废”吗？'
    //   this.$confirm(msg, '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     console.log(' 操作 ')
    //   }).catch(() => {
    //     console.log('用户点击了取消')
    //   })
    // },
    saveModel() {
      const that = this
      // 判断节点明细
      if (this.modelType === 'new') {
        this.$refs['typeInfo'].validate((valid) => {
          if (valid) {
            console.log(that.typeInfo, '1111')
            saveComplaint(that.typeInfo).then(res => {
              if (res.code === '200' || res.code === 200) {
                that.$message({
                  message: '质量件类型添加成功！',
                  type: 'success'
                })
                that.resetModel()
                that.loading = true
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
      } else if (this.modelType === 'edit') {
        this.$refs['typeInfo'].validate((valid) => {
          if (valid) {
            console.log(that.typeInfo, '1111')
            const info = {
              id: that.typeInfo.id,
              name: that.typeInfo.name,
              remarks: that.typeInfo.remarks
            }
            updateComplaint(info).then(res => {
              if (res.code === '200' || res.code === 200) {
                that.$message({
                  message: '质量件类型更新成功！',
                  type: 'success'
                })
                that.resetModel()
                that.loading = true
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
      } else {
        let flag = true
        if (this.typeSetForm.nodeList.length > 0) {
          const block = this.typeSetForm.nodeList
          for (let i = 0; i < block.length; i++) {
            for (const item in block[i]) {
              if (block[i]['type'] === 'normal') {
                if (['name', 'key', 'depName'].includes(item)) {
                  if (block[i][item] === '' || block[i][item] === null || block[i][item] === 'null' || block[i][item].length === 0) {
                    this.$message.warning('节点内容不能为空')
                    flag = false
                    break
                  }
                }
              } else {
                if (['condition', 'name', 'key', 'depName'].includes(item)) {
                  if (block[i][item] === 'null' || block[i][item] === null || block[i][item] === '' || block[i][item].length === 0) {
                    this.$message.warning('节点内容不能为空')
                    flag = false
                    break
                  }
                }
              }
            }
          }
        }
        if (flag) {
          this.$refs['typeSetForm'].validate((valid) => {
            if (valid) {
              console.log(that.typeSetForm, '1111')
              const data = that.typeSetForm.nodeList
              let info = {
                name: '',
                userId: '',
                groupId: '',
                organize_id: '',
                condition: '',
                rejectType: ''
              }
              const list = []
              for (let i = 0; i < data.length; i++) {
                info = {
                  name: data[i].name,
                  userId: data[i].userId == '-1' ? 0 : data[i].userId,
                  groupId: data[i].groupId,
                  organize_id: data[i].depName,
                  condition: data[i].condition
                }
                list.push(info)
              }
              let baseURL = ''
              if (process.env.NODE_ENV === 'development') {
                baseURL = '/index.php'
              } else {
                baseURL = ''
              }
              const submitUrl = baseURL + '/oa/qualityprocessnode-edit-' + this.workId + '.json'
              const config = {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              }
              const formdata = Qs.stringify({
                node: list
              })
              axios.post(submitUrl, formdata, config)
                .then(response => {
                // console.log(response)
                  if (response.data.code === 200 || response.data.code === '200') {
                  // console.log(response, 'response')
                  // 提交成功将要执行的代码
                    that.$message({
                      message: '质量件类型工作流保存成功！',
                      type: 'success'
                    })
                    that.resetModel()
                    that.getList()
                  } else {
                    that.$message({
                      message: response.data.msg,
                      type: 'warning'
                    })
                  }
                })
              this.$forceUpdate()
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
      }
    },
    resetModel() {
      console.log('重置表单')
      if (this.modelType === 'set') {
        this.$refs['typeSetForm'].resetFields()
        this.typeSetForm = {}
      } else {
        this.$refs['typeInfo'].resetFields()
        this.typeInfo = {}
      }
      this.modelShow = false
    }
  }
}

</script>
<style lang="less" scoped>
  .work_bg {

    position: absolute;
    width: 100%;
    top: 0;
    // .search_btn {
    //   display: flex;
    //   align-items: center;
    //   justify-content: space-between;
    // }

    .work_info {
      background: #fff;
      padding: 20px 10px;

      .tabs_table {
        .over_line_one {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap
        }

        .over_line_two {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }

    .work_page {
      text-align: center;
      padding: 10px 0;
    }
  }

  .dialogModel {

    .model_layer {
      width: 100%;
      height:800px;
      // height: calc(100% - 60px);
      background: transparent;
      position: absolute;
      left: 0;
      top: 60px;
      z-index: 100;
      }
    .modelForm {
      margin: 0 10px;

      .node_list {
        display: flex;
        align-items: center;
        margin-left: 100px;

        .node_left {
          width: 85%;

          .node_left_top {
            display: inline-flex;
            margin-bottom: 0;

            .view_right {
              margin-right: 10px;
            }
          }
        }

        .node_right {
          i {
            font-size: 28px;
          }
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
          .overflow_text{
            overflow: hidden;
            display: inline-block;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .text_placeholder{
            color: #c0c4cc;
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

      .center {
        margin: 0 70px;
      }

    }
  }

</style>
