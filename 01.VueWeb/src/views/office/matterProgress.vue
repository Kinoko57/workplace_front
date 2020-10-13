<template>
  <div>
    <div class="matter_bg">
      <div class="fifter">
        <my-tabs
          :page-name="page_name"
          :module-name="module_name"
          :add="btnPermission('matter_create')"
          :active-name="searchInfo.mode"
          :tabs-list="tabsList"
          @addAction="addReport"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)" />
          <!-- <search-fifter
          :add="btnPermission('matter_create')"
          :module-name="'matter'"
          :fifter="true"
          :delay-fifter="loading==false"
          :add-text="'创建事项'"
          @addAction="addReport"
          @search="fifterSearch" /> -->
      </div>
      <div class="matter_info">
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}个记录，已选中{{ choseTotal }}条</span>
            <el-button v-if="btnPermission('matter_cancellations')" plain size="mini" @click="batchstop('remover')">批量作废</el-button>
          </div>
        </div>
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="tableData"
          :max-height="tableHeight"
          border
          row-key="id"
          tooltip-effect="light"
          @sort-change="fifterTable"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" min-width="40" fixed="left" align="center" />
          <el-table-column prop="title" label="标题" show-overflow-tooltip min-width="200px" />
          <el-table-column prop="createdBy" label="发布人" min-width="100" />
          <el-table-column prop="nowmatter" label="当前进度" min-width="100" />
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status==1" type="info">未开始</el-tag>
              <el-tag v-if="scope.row.status==2">进行中</el-tag>
              <el-tag v-if="scope.row.status==3" type="success">已完成</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdDate" label="创建时间" min-width="150" />
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button
                v-if="btnPermission('matter_view')"
                type="text"
                size="small"
                @click="showModel(scope.row,'view')">查看</el-button>
              <el-button
                v-if="btnPermission('matter_edit')"
                type="text"
                size="small"
                @click="showModel(scope.row,'edit')">编辑</el-button>
              <el-button
                v-if="btnPermission('matter_cancellation')"
                :disabled="scope.row.status==2"
                type="text"
                size="small"
                @click="changeStates(scope.row)">作废</el-button>
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
    <el-dialog
      :visible.sync="modelShow"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :title="modelTitle"
      :width="modelWidth"
      class="dialogModel "
      @close="resetModel">
      <el-scrollbar v-show="modelType!='view'" class="fixed_scroll over_scroll">
        <!-- 新建/编辑事项 -->
        <el-form
          v-if="modelShow"
          ref="matterForm"
          :model="matterForm"
          :rules="rules"
          class="modelForm"
          label-width="94px"
          label-position="right">
          <el-form-item label="事项名称：" prop="title">
            <el-input v-model.trim="matterForm.title" style="width:500px" placeholder="请输入事项名称" />
          </el-form-item>
          <el-form-item label="事项说明：" prop="remark" class="rich_input">
            <el-input
              v-model.trim="matterForm.remark"
              :rows="3"
              type="textarea"
              style="width:500px"
              placeholder="请输入事项说明,最大长度为120个字" />
          </el-form-item>
          <el-form-item label="通知对象：" class="obj_style checkDep">
            <i class="red_star">*</i>
            <div v-for="(item,index) in objList" :key="index" class="show_objs">
              <div class="show_objs_left">
                <!-- <el-cascader
                  ref="orgLabel"
                  :options="orgList"
                  v-model="item.orgName"
                  :props="defaultNode"
                  :show-all-levels="false"
                  :change-on-select="true"
                  style="width:140px"
                  placeholder="请选择部门"
                  filterable
                  @change="choseOrg(index,item)" /> -->
                <el-select v-model="item.orgName" filterable placeholder="请选择部门" style="width:200px" @change="choseOrg(index,item)">
                  <el-option
                    v-for="(select,index) in orgList"
                    :label="select.label"
                    :value="select.id"
                    :key="index"
                  />
                </el-select>
                <el-select v-if="item.orgId==0" v-model="item.roleId" placeholder="请选择角色" style="width:180px">
                  <el-option label="全部成员" value="-1" />
                  <el-option label="管理岗及以上" value="-2" />
                  <el-option label="部门主要负责人" value="-3" />
                </el-select>
                <el-select v-else v-model="item.roleId" placeholder="请选择角色" style="width:180px">
                  <el-option
                    v-for="(select,index) in item.roleList"
                    :label="select.name"
                    :value="select.id"
                    :key="index" />
                </el-select>
              </div>
              <div class="show_objs_right">
                <i class="el-icon-remove" @click="removeObjNode(item)" />
              </div>
            </div>
            <el-button type="primary" size="mini" @click="addObjNode">添加对象</el-button>
          </el-form-item>
          <el-form-item label="事项节点：" class="node_style checkDep">
            <i class="red_star">*</i>
            <div v-for="(item,index) in nodeList" :key="index" class="node_block">
              <div class="node_block_left">
                <el-input v-model="item.name" placeholder="节点名称" style="width:126px; margin-right: -3px;" />
                <el-select v-model="item.status" placeholder="请选择状态" style="width:120px; margin-right: -3px;">
                  <el-option label="未开始" value="1" />
                  <el-option label="进行中" value="2" />
                  <el-option label="已完成" value="3" />
                </el-select>
                <el-date-picker
                  v-model="item.overtime"
                  type="datetime"
                  style="width:200px"
                  placeholder="请选择完成时间"
                  value-format="yyyy-MM-dd HH:mm:ss" />
                <el-input
                  :rows="3"
                  v-model="item.remark"
                  type="textarea"
                  maxlength="120"
                  placeholder="请输入内容，最大长度为120个字"
                  style="width:448px; margin-top: 5px;" />
              </div>
              <div class="node_block_right">
                <i class="el-icon-remove" @click="removeWorkNode(item)" />
              </div>
            </div>
            <el-button type="primary" size="mini" @click="addWorkNode">添加节点</el-button>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <el-scrollbar v-show="modelType=='view'" class="fixed_scroll over_scroll">
        <div v-show="modelType=='view'" class="view_matter">
          <table class="view_dialog view_dialog_find" cellpadding="0" cellspacing="0">
            <tr class="view_line">
              <td class="line_title border_left">事项名称</td>
              <td class="second_line">{{ viewData.title }}</td>
            </tr>
            <tr class="view_line">
              <td class="line_title border_left">发布人</td>
              <td class="second_line">{{ viewData.createdBy }}</td>
            </tr>
            <tr class="view_line">
              <td class="line_title border_left">发布时间</td>
              <td class="second_line">{{ viewData.createdDate }}</td>
            </tr>
            <tr class="view_line">
              <td class="line_title border_left">更新人</td>
              <td :class="{null_data_style:nullStyle(viewData.editedBy)}" class="second_line">{{ viewData.editedBy |textNull }}</td>
            </tr>
            <tr class="view_line">
              <td class="line_title border_left">更新时间</td>
              <td :class="{null_data_style:nullStyle(viewData.editedDate)}" class="second_line">{{ viewData.editedDate |textNull }}</td>
            </tr>
            <tr rowspan="2" class="view_line">
              <td class="line_title border_left">事项说明</td>
              <td colspan="3" class="second_line">{{ viewData.remark }}</td>
            </tr>
          </table>
          <my-steps :active="activeStep" class="car_view" align-center>
            <my-step
              v-for="(item,index) in carStep"
              :status="item.status>1?(item.status==2?'process':'success'):'wait'"
              :title="item.name"
              :key="index"
              :tip-user="item.status>1?(item.status==2?'进行中':'已完成'):'未开始'"
              :tip-time="item.overtime"
              :tip-text="item.remark"
              :user-text="'状态'"
              :time-text="'完成时间'"
              :remark-text="'备注说明'"
              :hover-status="item.status>1?false:true"/>
          </my-steps>
        </div>
      </el-scrollbar>
      <div v-show="modelType!='view'" slot="footer" class="dialog-footer">
        <el-button v-if="modelType=='new'" @click="resetForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">{{ sureBtn }}</el-button>
      </div>
      <div v-show="modelType=='view'" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="resetModel">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import richText from '@/components/richText/richText'
import {
  matterProgressbatchCancel
// getWorkEditInfo // 获取员工列表
} from '@/api/office'
import {
  getRoleList,
  addMatter,
  updateMatter,
  getMatterInfo,
  getMatterView,
  banMatter
} from '@/api/common'
// import {
//   getOrgList
// } from '@/api/system'
import {
  getExecutiveOrg
} from '@/api/public'
  // import axios from 'axios'
export default {
  // name: 'MatterProgress',
  // components: {
  //   richText
  // },
  data() {
    return {
      page_name: 'matter',
      module_name: 'oa',
      choseTotal: 0,
      tabsList: [{
        label: '全部事项',
        name: 'all'
      }],
      canCrop: false,
      uploadUrl: '',
      tableData: [],
      viewData: [],
      loading: true,
      modelType: '',
      modelTitle: '',
      modelShow: false,
      modelWidth: '720px',
      sureBtn: '确 定',
      content: '',
      defaultNode: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      // radioList: [{
      //   value: '',
      //   label: ''
      // }], // 员工列表
      userShow: false,
      orgList: [{
        id: '',
        name: ''
      }], // 组织架构列表
      carStep: [], // 步骤条
      activeStep: 0,
      roleList: [], // 根据id获取角色列表
      objList: [],
      orgShow: false,
      matterForm: {
        title: '',
        remark: '',
        noticeList: '',
        nodeList: ''
      },
      nodeList: [],
      viewForm: {},
      fileList: [],
      files: [],
      tableHeight: 250,
      rules: {
        title: [{
          required: true,
          message: '事项标题不能为空',
          trigger: 'blur'
        }],
        remark: [{
          required: true,
          message: '事项说明不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 120,
          message: '事项说明长度超出范围1-120位之间',
          trigger: 'blur'
        }]
      },
      submitting: false,
      searchInfo: {
        mode: 'all', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      selectArr: [],
      num: 1,
      total: 0 // 总条数
    }
  },
  watch: {
    depText(val) {
      if (this.modelShow) {
        this.$refs.deptree.filter(val)
      }
    }
  },
  mounted() {
    this.uploadUrl = process.env.BASE_API + 'sys/file-upload'
    // 获取数据列表
    this.getList()
    // 初始化获取数据
    this.getDefault()
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
        const msg = '事项一旦作废不可恢复，确定要批量“作废”吗？'
        that.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          matterProgressbatchCancel(obj).then(res => {
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
    getList() {
      const that = this
      getMatterInfo(this.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          that.tableData = res.data.matters
          that.total = res.data.pager.recTotal // 总条数
        }
      })
    },
    getDefault() {
      const that = this
      // 获取组织架构列表
      getExecutiveOrg().then(res => {
        if (res.code === 200 || res.code === '200') {
          const arr = res.data
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].label = res.data[i].pname + '-' + res.data[i].name
          }
          // that.formatDep(arr)
          arr.unshift({
            id: '0',
            label: '所有部门'
          })
          that.orgList = arr
        }
      })
      // 获取角色列表
      getRoleList().then(res => {
        console.log(res, 'fgsdgfs')
        if (res.code === 200 || res.code === '200') {
          that.roleList = res.data
        }
      })
      // 获取员工列表
      // getWorkEditInfo().then(res => {
      //   if (res.code === 200) {
      //     const arr = []
      //     for (let i = 0; i < res.data.escorts.length; i++) {
      //       arr.push({
      //         value: res.data.escorts[i].id,
      //         label: res.data.escorts[i].name + '-' + res.data.escorts[i].deptName
      //       })
      //     }
      //     that.radioList = arr
      //   }
      // })
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
    showUser() {
      this.orgShow = false
      this.userShow = !this.userShow
    },
    choseOrg(key, value) {
      // const that = this
      const len = value.orgName
      this.objList[key].orgId = ''
      this.objList[key].roleId = ''
      this.objList[key].roleList = []
      console.log(this.objList[key])
      if (this.objList[key].orgName !== 0 || this.objList[key].orgName !== '0') {
        if (this.objList[key].roleList.length === 0) {
          for (let i = 0; i < this.roleList.length; i++) {
            this.objList[key].roleList = []
            this.objList[key].roleList.push({
              id: '0',
              name: '全部角色'
            })
            if (this.objList[key].orgName === this.roleList[i].organize_id) {
              let arr = []
              arr = this.objList[key].roleList.concat(this.roleList[i].data)
              this.objList[key].roleList = [...arr]
              break
            }
          }
        }
      }
      this.objList[key].orgId = this.objList[key].orgName
      this.$forceUpdate()
      console.log(this.objList[key])
    },
    showOrg() {
      this.userShow = false
      this.orgShow = !this.orgShow
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
    addReport() {
      this.modelTitle = '创建事项'
      this.modelType = 'new'
      this.modelShow = true
      this.sureBtn = '保 存'
      this.modelWidth = '720px'
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
      const msg = '事项一旦作废不可恢复，确定要“作废”吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        banMatter(event.id).then(res => {
          if (res.code === 200 || res.code === '200') {
            that.$message({
              type: 'success',
              message: res.data.msg
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
      // const that = this
      if (type === 'view') {
        this.modelTitle = '查看事项'
        this.modelWidth = '720px'
        // this.viewForm = data
        const that = this
        getMatterView(data.id).then(res => {
          if (res.code === 200) {
            that.viewData = res.data.matterInfo
            that.carStep = res.data.matterNodeInfo
          }
        })
      } else {
        this.modelWidth = '720px'
        data = {
          ...data
        }
        this.matterForm = {
          id: data.id,
          title: data.title,
          remark: data.remark,
          noticeList: data.noticeList,
          nodeList: data.nodeList
        }
        this.objList = JSON.parse(data.noticeList)
        console.log(this.objList, '11')
        this.nodeList = JSON.parse(data.nodeList)
        console.log(this.nodeList, '22')
        for (let i = 0; i < this.objList.length; i++) {
          this.objList[i].orgName = this.objList[i].orgId
          const len = this.objList[i].orgName.length - 1
          if (this.objList[i].orgName !== 0 || this.objList[i].orgName !== '0') {
            this.objList[i].roleList = []
            if (this.objList[i].roleList.length === 0) {
              this.objList[i].roleList.push({
                id: '0',
                name: '全部角色'
              })
              for (let j = 0; j < this.roleList.length; j++) {
                if (this.objList[i].orgName === this.roleList[j].organize_id) {
                  console.log(this.objList[i].orgName)
                  let arr = []
                  arr = this.objList[i].roleList.concat(this.roleList[j].data)
                  this.objList[i].roleList = [...arr]
                  break
                }
              }
            }
          }
        }
        this.content = data.content
        this.modelTitle = '编辑事项'
      }
      this.modelType = type
      this.modelShow = true
    },
    saveModel() {
      let flag = true
      const that = this
      if (this.objList.length <= 0) {
        this.$message.warning('通知对象不能为空')
      } else if (this.nodeList.length <= 0) {
        this.$message.warning('事项节点不能为空')
      } else {
        const list1 = this.objList
        for (let i = 0; i < list1.length; i++) {
          for (const item in list1[i]) {
            if (list1[i][item] === '') {
              this.$message.warning('通知对象内容不能为空')
              flag = false
              break
            }
          }
        }
        const list = this.nodeList
        console.log(this.nodeList)
        for (let i = 0; i < list.length; i++) {
          for (const item in list[i]) {
            if (list[i][item] === '') {
              this.$message.warning('事项节点内容不能为空')
              flag = false
              break
            }
          }
        }
        if (flag) {
          this.matterForm.nodeList = JSON.stringify(this.nodeList)
          const arr = []
          for (let i = 0; i < this.objList.length; i++) {
            arr.push({
              orgId: this.objList[i].orgId,
              roleId: this.objList[i].roleId
            })
          }
          this.matterForm.noticeList = JSON.stringify(arr)
          if (this.modelType === 'new') {
            this.$refs['matterForm'].validate((valid) => {
              if (valid) {
                // 新增事项
                this.submitting = true
                addMatter(this.matterForm).then(res => {
                  that.submitting = false
                  if (res.code === 200 || res.code === '200') {
                    that.$message({
                      message: '事项添加成功！',
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
              } else {
                console.log('error submit!!')
                // this.$message.warning('信息填写不完整或者信息填写有误！')
                this.$nextTick(() => {
                  this.checkFormErr()
                })
                return false
              }
            })
          } else {
            this.$refs['matterForm'].validate((valid) => {
              if (valid) {
                this.submitting = true
                console.log('更新')
                console.log(this.matterForm)
                // 更新事项
                updateMatter(this.matterForm).then(res => {
                  that.submitting = false
                  if (res.code === 200 || res.code === '200') {
                    that.$message({
                      message: '事项更新成功！',
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
      }
    },
    resetModel() {
      console.log('重置表单')
      this.$refs['matterForm'].resetFields()
      this.matterForm = {
        title: '',
        remark: '',
        noticeList: '',
        nodeList: ''
      }
      this.nodeList = []
      this.objList = []
      this.content = ''
      this.modelShow = false
    },
    resetForm() {
      console.log('重置表单')
      this.$refs['matterForm'].resetFields()
      this.matterForm = {
        title: '',
        remark: '',
        noticeList: '',
        nodeList: ''
      }
      this.nodeList = []
      this.objList = []
      this.content = ''
    },
    addWorkNode() {
      const info = {
        name: '',
        status: '',
        overtime: '',
        remark: ''
      }
      if (this.nodeList.length === 0) {
        this.nodeList.push(info)
      } else {
        let flag = true
        const list = this.nodeList
        for (let i = 0; i < list.length; i++) {
          for (const item in list[i]) {
            if (list[i][item] === '') {
              this.$message.warning('节点内容不能为空')
              flag = false
              break
            }
          }
        }
        if (flag) {
          this.nodeList.push(info)
        }
      }
      this.$forceUpdate()
    },
    removeWorkNode(item) {
      let index = 0
      index = this.nodeList.indexOf(item)
      this.nodeList.splice(index, 1)
    },
    addObjNode() {
      const info = {
        orgId: '',
        orgName: [],
        roleId: '',
        roleList: []
      }
      if (this.objList.length === 0) {
        this.objList.push(info)
      } else {
        let flag = true
        const list = this.objList
        for (let i = 0; i < list.length; i++) {
          for (const item in list[i]) {
            if (list[i][item] === '') {
              this.$message.warning('节点内容不能为空')
              flag = false
              break
            }
          }
        }
        if (flag) {
          this.objList.push(info)
        }
      }
      this.$forceUpdate()
    },
    removeObjNode(item) {
      let index = 0
      index = this.objList.indexOf(item)
      this.objList.splice(index, 1)
    }
  }
}

</script>
<style lang="less" scoped>
  .matter_bg {

    position: absolute;
    width: 100%;
    top: 0;

    // .search_btn {
    //   display: flex;
    //   align-items: center;
    //   justify-content: space-between;
    // }
    .matter_info {
      background: #fff;
      padding: 20px 10px;

      .tabs_table {
        .text_color {
          color: #409EFF;
        }

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

    .matter_page {
      text-align: center;
      padding: 10px 0;
    }
  }

  .dialogModel {

    .modelForm {
      margin: 0 10px;

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

      .obj_style {
        .show_objs {
          display: flex;
          align-items: center;
          margin-bottom: 10px;

          .show_tags {
            min-height: 100px;
            background-color: #fff;
            background-image: none;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            padding: 5px 15px;
            line-height: 1.5;
            margin-bottom: 10px;

            span {
              margin-right: 5px;
              margin-bottom: 5px;
            }
          }

          .show_objs_right {
            display: inline-flex;
            margin-left: 20px;

            i {
              font-size: 26px;
            }
          }
        }
      }

      .node_style {
        .node_block {
          width:90%;
          display: flex;
          padding: 5px;
          margin-bottom: 10px;
          background: #e0e0e0;
          border-radius: 5px;

          .node_block_right {
            i {
              font-size: 26px;
            }
          }
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

    .view_matter {
      padding-top: 20px;
      // 弹框里的查看
      .view_dialog {
        margin: 0 auto;
        border: 1px solid #e4e4e4;
        border-bottom: none;
        // max-width: 520px;
        border-left: none;

        .view_line {

          td {
            font-family: '微软雅黑 Regular', '微软雅黑';
            font-weight: 400;
            font-size: 14px;
            color: #999999;
            width: 350px;
            border-bottom: 1px solid #e4e4e4;
            min-height: 40px;
            align-items: center;
            padding: 16px 0;
            min-width: 100px;
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
            text-align: center;
            vertical-align: middle;
          }

          .border_left {
            border-left: 1px solid #e0e0e0;
          }

          .second_line {
            font-weight: 400;
            font-size: 14px;
            color: #333333;
            padding-left: 10px;
            line-height: 1.2;

            a {
              width: 200px;
              display: block;
              font-size: 12px;
              color: #409eff;
              text-decoration: underline;
            }
          }
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

        .car_info {
          border: 1px solid #e0e0e0;
          margin-top: 20px;
          padding: 14px 10px;

          .info_block {
            margin-bottom: 20px;

            p {
              font-size: 12px;
              color: #666666;
              margin: 0;
              padding-left: 135px;
              margin-top: 10px;
            }

            .blue {
              color: #3366FF;
              font-size: 14px;
              padding-left: 0;
              margin-top: 0;
            }
          }
        }

        .car_form {
          margin-top: 20px;

          .form_inline {
            display: flex;
            align-items: center;
            margin-bottom: 10px;

            .title {
              font-size: 14px;
              color: #333;
              margin-right: 6px;
            }

            .mg {
              margin-left: 6px;
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
        }
      }

      .car_view {
        padding: 20px 10px;
        width: 800px;
        overflow-x: scroll;
        margin: 0 auto;
      }
    }
  }

</style>
