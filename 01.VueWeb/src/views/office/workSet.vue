<template>
  <div>
    <div class="work_bg">
      <div class="fifter">
        <!-- <search-fifter :return-show="true" @returnAction="returnBack" /> -->
        <my-tabs
          :add-text="'创建审批类型'"
          :add="btnPermission('processtype_create')"
          :allow-fifter="false"
          :active-name="model"
          :tabs-list="tabsList"
          :return-show="true"
          @addAction="addType"
          @returnAction="returnBack"/>
      </div>
      <div class="work_info">
        <el-table v-loading="loading" :data="tableData" :max-height="tableHeight" border>
          <el-table-column prop="id" label="序号" width="100"/>
          <el-table-column prop="name" label="流程" min-width="150"/>
          <el-table-column prop="createdDate" label="创建时间" min-width="120"/>
          <el-table-column prop="editedDate" label="更新时间" min-width="120"/>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('processtype_edit')" type="text" size="small" @click="showModel(scope.row, 'edit')">编辑</el-button>
              <el-button v-if="btnPermission('processtype_delete')" type="text" size="small" @click="changeStates(scope.row)">作废</el-button>
              <el-button v-if="btnPermission('process_edit')" type="text" size="small" @click="showModel(scope.row, 'set')">配置</el-button>
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
      <!-- 新建/编辑工作流 :rules="rules"-->
      <el-scrollbar v-if="modelShow&&modelType=='set'" class="fixed_scroll over_scroll">
        <el-form v-if="modelShow&&modelType=='set'" ref="workForm" :model="workForm" class="modelForm" label-width="88px" label-position="right">
          <el-form-item label="流程名称：">
            <el-input v-model="workForm.title" style="width:320px" disabled />
          </el-form-item>
          <div v-for="(item,index) in workForm.nodeList" :key="item.key">
            <div v-show="item.depTree||item.roleTree" class="model_layer" @click="hiddenTree(index)" />
            <div class="node_list">
              <div :class="index!=0?'list_border':''" class="node_left">
                <el-form-item v-if="typeId==1&&item.type=='condition'" class="node_left_top">
                  <el-input placeholder="采购金额" style="width:130px;margin-right: 16px;" class="view_right" disabled />
                  <el-input placeholder="大于等于" style="width:140px;margin-right: 16px" class="view_right" disabled />
                  <el-input
                    v-model="item.condition"
                    style="width:140px"
                    class="view_right"
                    placeholder="请输入金额"
                    min="0"
                    type="number"
                    @change="updateValue"
                    @input="updateValue"
                    @blur="checkValue(item.condition,index)" />
                </el-form-item>
                <el-form-item v-if="typeId==6&&item.type=='condition'" class="node_left_top">
                  <el-input placeholder="请假天数" style="width:130px;margin-right: 16px;" class="view_right" disabled />
                  <el-input placeholder="大于等于" style="width:140px;margin-right: 16px" class="view_right" disabled />
                  <el-input
                    v-model="item.condition"
                    style="width:140px"
                    class="view_right"
                    placeholder="请输入天数"
                    min="0"
                    type="number"
                    @change="updateValue"
                    @input="updateValue"
                    @blur="checkValue(item.condition,index)" />
                </el-form-item>
                <el-form-item v-if="typeId==4&&item.type=='condition'" class="node_left_top">
                  <el-input placeholder="报销金额" style="width:130px;margin-right: 16px;" class="view_right" disabled />
                  <el-input placeholder="大于" style="width:140px;margin-right: 16px" class="view_right" disabled />
                  <el-input
                    v-model="item.condition"
                    style="width:140px"
                    class="view_right"
                    placeholder="请输入金额"
                    min="0"
                    type="number"
                    @change="updateValue"
                    @input="updateValue"
                    @blur="checkValue(item.condition,index)" />
                </el-form-item>
                <el-form-item v-if="typeId==11&&item.type=='condition'" class="node_left_top">
                  <el-input placeholder="申请金额" style="width:130px;margin-right: 16px;" class="view_right" disabled />
                  <el-input placeholder="大于" style="width:140px;margin-right: 16px" class="view_right" disabled />
                  <el-input
                    v-model="item.condition"
                    style="width:140px"
                    class="view_right"
                    placeholder="请输入金额"
                    min="0"
                    type="number"
                    @change="updateValue"
                    @input="updateValue"
                    @blur="checkValue(item.condition,index)" />
                </el-form-item>
                <el-form-item v-if="typeId==3&&item.type=='condition'" class="node_left_top">
                  <el-input placeholder="用章类型" style="width:130px;margin-right: 16px;" class="view_right" disabled />
                  <el-input placeholder="等于" style="width:140px;margin-right: 16px" class="view_right" disabled />
                  <el-select v-model="item.condition" placeholder="请选择类型" style="width:130px" class="view_right" @change="choseZhangType(item.condition,index)">
                    <el-option v-for="(item,index) in chapterType" :key="index" :label="item" :value="index">{{ item }}</el-option>
                  </el-select>
                </el-form-item>
                <div class="node_left_top">
                  <el-form-item style="width:150px">
                    <el-input v-model="item.name" style="width:130px" class="view_right" placeholder="请输入名称" @input="inputChange" />
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
            <el-button type="primary" @click="addWorkNode('normal')">添加普通节点</el-button>
            <el-button v-if="typeId==1||typeId==3||typeId==4||typeId==6||typeId==11" type="primary" @click="addWorkNode('condition')">添加条件节点</el-button>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <el-scrollbar v-if="modelShow&&modelType!='set'" class="fixed_scroll">
        <el-form v-if="modelShow&&modelType!='set'" ref="typeForm" :rules="typeRules" :model="typeForm" class="modelForm" label-width="100px" label-position="right">
          <el-form-item label="所属流程：">
            <el-input v-model="typeName" style="width:400px" disabled />
          </el-form-item>
          <el-form-item label="类型名称：" prop="name">
            <el-input v-model="typeForm.name" style="width:400px" placeholder="请输入类型名称"/>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetModel">取 消</el-button>
        <el-button type="primary" @click="saveModel">{{ sureBtn }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getWorkDetail,
  getChaptertype,
  getWorkTypeList,
  saveWorkType,
  updateWorkType,
  banWorkType,
  getSystemUserList
} from '@/api/office'
// import {
//   getOrgList
// } from '@/api/system'
import {
  getExecutiveOrg
} from '@/api/public'
import {
  getRoleList
} from '@/api/common'
import axios from 'axios'
import Qs from 'qs'
export default {
  name: 'WorkSetManage',
  data() {
    var checkSet = (rule, value, callback) => {
      for (let i = 0; i < this.$refs.name.length; i++) {
        console.log(this.$refs.name[i].value)
        if (this.$refs.name[i].value !== undefined) {
          callback()
        } else {
          callback(new Error('此项不能为空'))
        }
      }
      if (value !== undefined) {
        callback()
      } else {
        callback(new Error('此项不能为空'))
      }
    }
    return {
      shows: false,
      depTree: '',
      roleTree: '',
      value: '',
      tableData: [],
      loading: true,
      modelTitle: '',
      modelShow: false,
      modelType: 'new',
      typeName: '',
      typeId: '',
      sureBtn: '确 定',
      workId: '',
      workTitle: '',
      model: 'all',
      tabsList: [
        { label: '工作流类型', name: 'all' }
      ],
      typeForm: {
        name: ''
      },
      workForm: {
        title: '',
        nodeList: []
      },
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      app_type: 0,
      chapterType: [],
      roleList: [],
      userList: [],
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
          message: '类型名称不能为空',
          trigger: 'blur'
        }]
      },
      searchInfo: {
        mode: '', // 类型id
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
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
    console.log(this.$route.query)
    this.typeName = this.$route.query.name
    this.typeId = this.$route.query.id
    this.searchInfo.mode = this.$route.query.id
    // 获取列表
    this.getList()
    // 获取部门列表和角色列表,所有审批人列表
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
      // getWorkInfo().then(res => {
      //   that.loading = false
      //   if (res.code === 200) {
      //     that.tableData = res.data.process
      //   }
      // })
      getWorkTypeList(this.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          that.tableData = res.data.processtype
          that.total = res.data.pager.recTotal // 总条数
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
    changeStates(event) {
      const that = this
      const msg = '审批类型一旦作废不可恢复，确定要“作废”吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        banWorkType(event.id).then(res => {
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
    addType() {
      this.modelTitle = '创建审批类型'
      this.modelType = 'new'
      this.modelShow = true
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
        depName: '',
        roleText: '',
        roleName: '',
        userText: '',
        userName: '',
        condition: '',
        type: 'normal',
        roleList: []
      }
      if (type !== 'normal') {
        info.type = 'condition'
      }
      if (this.workForm.nodeList.length === 0) {
        this.workForm.nodeList.push(info)
      } else {
        let flag = true
        const list = this.workForm.nodeList
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
          this.workForm.nodeList.push(info)
        }
      }
      this.$forceUpdate()
    },
    removeWorkNode(item) {
      if (this.workForm.nodeList.length <= 1) {
        this.$message.warning('节点最少存在一个，不能删除！')
      } else {
        var index = this.workForm.nodeList.indexOf(item)
        if (index !== -1) {
          this.workForm.nodeList.splice(index, 1)
        }
        this.$forceUpdate()
      }
    },
    checkValue(val, index) {
      console.log(val)
      console.log(index)
      if (parseInt(val) < 0) {
        this.$message.warning('条件不能为负值')
        this.workForm.nodeList[index].condition = ''
      }
      this.$forceUpdate()
    },
    updateValue() {
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
      this.workForm.nodeList[index].depTree = true
      this.workForm.nodeList[index].roleTree = false
      this.shows = true
      this.$forceUpdate()
    },
    hiddenTree(index) {
      this.workForm.nodeList[index].depTree = false
      this.workForm.nodeList[index].roleTree = false
      this.$forceUpdate()
    },
    hidenDepTree(index) {
      this.workForm.nodeList[index].depTree = false
      this.workForm.nodeList[index].roleTree = false
      this.$forceUpdate()
    },
    // 显示角色列表
    showRoleTree(id, index) {
      this.shows = true
      this.workForm.nodeList[index].depTree = false
      this.workForm.nodeList[index].roleTree = true
      if (parseInt(this.workForm.nodeList[index].roleId) < 0) {
        this.workForm.nodeList[index].roleDepList = [{ id: '-1', name: '直属上级' }, { id: '-3', name: '主要负责人' }]
      }
      this.$forceUpdate()
    },
    // 选择部门
    choseDep(val, index) {
      const len = val.depName.length - 1
      console.log(val, '111')
      console.log(index)
      console.log(this.workForm.nodeList)
      if (this.workForm.nodeList.length === 1) {
        index = 0
      }
      this.workForm.nodeList[index].depName = val.depName
      console.log(val.depName[len])
      if (val.depName[len] === 0 || val.depName[len] === '0') {
        this.workForm.nodeList[index].roleList = [{ id: '-1', name: '直属上级' }, { id: '-3', name: '主要负责人' }]
        this.workForm.nodeList[index].roleName = '直属上级'
        this.workForm.nodeList[index].groupId = '-1'
        this.workForm.nodeList[index].userId = '-1'
      } if (val.depName[len] === -1 || val.depName[len] === '-1') {
        this.workForm.nodeList[index].roleName = '指定人审核'
        this.workForm.nodeList[index].groupId = '-4'
        this.workForm.nodeList[index].userId = ''
        this.workForm.nodeList[index].userList = this.userList
      } else {
        for (let j = 0; j < this.roleList.length; j++) {
          if (val.depName[len] === this.roleList[j].organize_id) {
            this.workForm.nodeList[index].roleList = this.roleList[j].data
          }
        }
        this.workForm.nodeList[index].userId = '-1'
        console.log(this.workForm.nodeList[index].roleList)
        this.workForm.nodeList[index].groupId = this.workForm.nodeList[index].roleList[0].id
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
      console.log(this.workForm.nodeList)
      if (this.workForm.nodeList.length === 1) {
        index = 0
      }
      this.workForm.nodeList[index].depName = val.depName
      // console.log(val.depName[len])
      if (val.depName === -2 || val.depName === '-2') {
        this.workForm.nodeList[index].roleList = [{ id: '-1', name: '直属上级' }, { id: '-3', name: '主要负责人' }]
        this.workForm.nodeList[index].roleName = '直属上级'
        this.workForm.nodeList[index].groupId = '-1'
        this.workForm.nodeList[index].userId = '-1'
      } if (val.depName === -1 || val.depName === '-1') {
        this.workForm.nodeList[index].roleName = '指定人审核'
        this.workForm.nodeList[index].groupId = '-4'
        this.workForm.nodeList[index].userId = ''
        this.workForm.nodeList[index].userList = this.userList
      } else {
        for (let j = 0; j < this.roleList.length; j++) {
          if (val.depName === this.roleList[j].organize_id) {
            this.workForm.nodeList[index].roleList = this.roleList[j].data
          }
        }
        this.workForm.nodeList[index].userId = '-1'
        console.log(this.workForm.nodeList[index].roleList)
        this.workForm.nodeList[index].groupId = this.workForm.nodeList[index].roleList[0].id
      }
      this.$forceUpdate()
    },
    inputChange() {
      this.$forceUpdate()
    },
    choseRole(index) {
      console.log(index, '11111')
      console.log(this.workForm.nodeList[index].groupId)
      this.$forceUpdate()
    },
    choseZhangType(val, index) {
      this.workForm.nodeList[index].condition = val
      this.$forceUpdate()
    },
    showModel(data, type) {
      this.modelType = type
      const that = this
      if (type == 'set') {
        that.modelTitle = '配置工作流'
        this.workId = data.id
        this.workTitle = data.name
        this.workForm = {
          title: data.name
        }
        if (this.typeId === '3') {
          getChaptertype().then(res => {
            if (res.code === 200) {
              that.chapterType = res.data.typeList
            }
          })
        }
        getWorkDetail(that.typeId, that.workId).then(res => {
          if (res.code === 200 || res.code === '200') {
            that.workForm.nodeList = res.data.node
            for (let i = 0; i < that.workForm.nodeList.length; i++) {
              that.workForm.nodeList[i].depTree = false
              that.workForm.nodeList[i].roleTree = false
              that.workForm.nodeList[i].roleName = that.workForm.nodeList[i].group_name
              that.workForm.nodeList[i].roleId = that.workForm.nodeList[i].groupId
              that.workForm.nodeList[i].userId = that.workForm.nodeList[i].userId == 0 ? '-1' : that.workForm.nodeList[i].userId
              // if (that.workForm.nodeList[i].organize_id === '0') {
              //   that.workForm.nodeList[i].depName = ['0']
              // } else {
              //   console.log(that.workForm.nodeList[i].organize_id)
              //   that.workForm.nodeList[i].depName = that.workForm.nodeList[i].organize_id.split(',')
              // }
              that.workForm.nodeList[i].depName = that.workForm.nodeList[i].organize_id
              // const len = that.workForm.nodeList[i].depName.length - 1
              that.workForm.nodeList[i].type = ''
              if (that.workForm.nodeList[i].groupId < 0) {
                that.workForm.nodeList[i].roleList = [{ id: '-1', name: '直属上级' }, { id: '-3', name: '主要负责人' }]
              } else {
                for (let j = 0; j < this.roleList.length; j++) {
                  if (that.workForm.nodeList[i].depName === this.roleList[j].organize_id) {
                    console.log(that.workForm.nodeList[i].groupId)
                    that.workForm.nodeList[i].roleList = this.roleList[j].data
                  }
                }
              }
              if (that.workForm.nodeList[i].userId != -1) {
                that.workForm.nodeList[i].userList = that.userList
              }
              switch (that.workForm.nodeList[i].groupId) {
                case '-1':that.workForm.nodeList[i].roleName = '直属上级'; break
                case '-3':that.workForm.nodeList[i].roleName = '主要负责人'; break
              }
              if (that.workForm.nodeList[i].condition !== '') {
                that.workForm.nodeList[i].type = 'condition'
              } else {
                that.workForm.nodeList[i].type = 'normal'
              }
            }
            that.modelShow = true
          }
        })
      } else {
        // 编辑审批类型
        that.typeForm = {
          id: data.id,
          name: data.name
        }
        that.modelShow = true
        that.modelTitle = '编辑审批类型'
      }
    },
    saveModel() {
      const that = this
      if (this.modelType == 'set') {
      // 判断配置明细
        let flag = true
        if (this.workForm.nodeList.length > 0) {
          const block = this.workForm.nodeList
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
        console.log(this.workForm.nodeList)
        if (flag) {
          this.$refs['workForm'].validate((valid) => {
            if (valid) {
              console.log(that.workForm, '1111')
              const data = that.workForm.nodeList
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
                  groupId: data[i].groupId,
                  userId: data[i].userId == '-1' ? 0 : data[i].userId,
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
              console.log(this.typeId)
              const submitUrl = baseURL + '/sys/process-edit-' + this.typeId + '-' + this.workId + '.json'
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
                      message: '工作流保存成功！',
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
      } else {
        // 新增，编辑类型
        this.$refs['typeForm'].validate((valid) => {
          if (valid) {
            if (this.modelType == 'new') {
              console.log('新增')
              const info = {
                name: that.typeForm.name,
                processTypeId: that.typeId
              }
              saveWorkType(info).then(res => {
                console.log(res)
                if (res.code == 200) {
                  that.$message({
                    message: '审批类型保存成功！',
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
              const info = {
                name: that.typeForm.name,
                processTypeId: that.typeId
              }
              updateWorkType(info, that.typeForm.id).then(res => {
                console.log(res)
                if (res.code == 200) {
                  that.$message({
                    message: '审批类型保存成功！',
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
      }
    },
    resetModel() {
      console.log('重置表单')
      if (this.modelType == 'new' || this.modelType == 'edit') {
        this.$refs['typeForm'].resetFields()
        this.typeForm = {}
      } else {
        this.$refs['workForm'].resetFields()
        this.workForm = {}
      }
      this.modelShow = false
    }
  }
}

</script>
<style lang="less" scoped>
  .work_bg {
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

    .work_info {
      margin: 20px 10px;

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
        // margin-left: 90px;
        width: 100%;
        justify-content: flex-end;

        .node_left {
          width: 74%;

          .node_left_top {
            display: inline-flex;
            margin-bottom: 0;

            .view_right {
              margin-right: 10px;
            }
          }
        }
        .list_border{
          border-top: 1px solid #eee;
        }

        .node_right {
          width: 14.5%;
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
