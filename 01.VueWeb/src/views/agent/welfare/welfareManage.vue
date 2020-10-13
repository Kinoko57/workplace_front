<template>
  <div>
    <div class="welfare_bg">
      <div class="welfare_fifter">
        <my-tabs
          :active-name="'all'"
          :add="btnPermission('welfare_create')"
          :page-name="page_name"
          :module-name="module_name"
          :tabs-list="tabsList"
          @addAction="addReport"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)" />
      </div>
      <div class="welfare_info">
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}条福利，已选中{{ choseTotal }}条</span>
            <el-button v-if="btnPermission('welfare_batchbanned')" plain size="mini" @click="batchstop('banned')">批量停用</el-button>
            <el-button v-if="btnPermission('welfare_batchenable')" plain size="mini" @click="batchstop('up')">批量启用</el-button>
            <el-button v-if="btnPermission('welfare_batchcancellation')" plain size="mini" @click="batchstop('remover')">批量作废</el-button>
          </div>
        </div>
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="tableData"
          :max-height="tableHeight"
          row-key="id"
          highlight-current-row
          border
          tooltip-effect="light"
          @sort-change="fifterTable"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" min-width="40" fixed="left" align="center"/>
          <el-table-column prop="code" label="福利编号" min-width="120px" center />
          <el-table-column prop="title" label="标题" show-overflow-tooltip min-width="100px">
            <template slot-scope="scope">
              <span class="over_line_one">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="startDate" label="开始时间" min-width="160px" show-overflow-tooltip />
          <el-table-column prop="endDate" label="结束时间" sortable="custom" min-width="160px" show-overflow-tooltip />
          <el-table-column prop="count" label="已发放数量" min-width="120px" center />
          <el-table-column prop="organizeName" label="执行部门" show-overflow-tooltip min-width="200px" />
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <!-- <el-tag v-if="scope.row.status==5||scope.row.status==1">未开始</el-tag>
              <el-tag v-if="scope.row.status==2" type="success">进行中</el-tag>
              <el-tag v-if="scope.row.status==4" type="warning">已过期</el-tag>
              <el-tag v-if="scope.row.status==3" type="danger">已停用</el-tag> -->
              <el-tag v-if="scope.row.status==2" type="danger">已停用</el-tag>
              <el-tag v-if="scope.row.status==1" type="success">已启用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="170" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showModel(scope.row,'view')">查看</el-button>
              <el-button
                v-if="btnPermission('welfare_edit')"
                type="text"
                size="small"
                @click="showModel(scope.row,'edit')">编辑</el-button>
              <el-button
                v-if="btnPermission('welfare_banned')&&scope.row.status==1"
                type="text"
                size="small"
                @click="banWelfare(scope.row,'2')">停用</el-button>
              <el-button
                v-if="btnPermission('welfare_banned')&&scope.row.status==2"
                type="text"
                size="small"
                @click="banWelfare(scope.row,'1')">启用</el-button>
              <el-button
                v-if="btnPermission('welfare_cancellation')"
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
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :visible.sync="modelShow"
      :title="modelTitle"
      width="600px"
      class="dialogModel"
      @close="resetModel">
      <div v-show="depTree" class="model_layer" @click="hiddenDepTree" />
      <!-- 新建/编辑福利 -->
      <!-- over_scroll -->
      <el-scrollbar class="fixed_scroll">
        <el-form
          v-show="modelType!='view'&&modelShow"
          ref="welfareForm"
          :model="welfareForm"
          :rules="rules"
          class="modelForm"
          label-width="100px"
          label-position="right">
          <el-form-item label="福利编号：" label-width="106px" prop="code">
            <el-input v-model.trim="welfareForm.code" :disabled="welfareForm.count>0" style="width:500px" placeholder="请输入福利编号" />
          </el-form-item>
          <el-form-item label="福利标题：" label-width="106px" prop="title">
            <el-input v-model.trim="welfareForm.title" :disabled="welfareForm.count>0" style="width:500px" placeholder="请输入福利标题" />
          </el-form-item>
          <el-form-item label="福利内容：" label-width="106px" prop="content">
            <el-input
              v-model.trim="welfareForm.content"
              :disabled="welfareForm.count>0"
              :rows="3"
              type="textarea"
              style="width:500px"
              placeholder="请输入福利内容,最大长度为120个字" />
          </el-form-item>
          <el-form-item label="执行部门：" prop="organizeId" label-width="106px" class="checkDep">
            <el-select
              v-model="welfareForm.organizeId"
              filterable
              multiple
              placeholder="请选择执行部门"
              style="width:500px"
              @change="choseDepList">
              <el-option v-for="item in depList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间：" label-width="106px" prop="startDate">
            <el-date-picker
              v-model="welfareForm.startDate"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:500px" />
          </el-form-item>
          <el-form-item label="结束时间：" label-width="106px" prop="endDate">
            <el-date-picker
              v-model="welfareForm.endDate"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:500px" />
          </el-form-item>
        </el-form>
        <div v-show="modelType=='view'">
          <table class="view_dialog view_dialog_find" cellpadding="0" cellspacing="0">
            <tr class="view_line">
              <td class="line_title">福利编号：</td>
              <td class="second_line">{{ viewForm.code }}</td>
            </tr>
            <tr class="view_line">
              <td class="line_title">福利标题：</td>
              <td class="second_line">{{ viewForm.title }}</td>
            </tr>
            <tr class="view_line">
              <td class="line_title">发布人：</td>
              <td class="second_line">{{ viewForm.createdBy }}</td>
            </tr>
            <tr class="view_line">
              <td class="line_title">发布时间：</td>
              <td class="second_line">{{ viewForm.createdDate }}</td>
            </tr>
            <tr class="view_line">
              <td class="line_title">福利内容：</td>
              <td class="second_line">{{ viewForm.content }}</td>
            </tr>
            <tr class="view_line">
              <td class="line_title">执行部门：</td>
              <td class="second_line">{{ viewForm.organizeName }}</td>
            </tr>
            <tr class="view_line">
              <td class="line_title">已发放数量：</td>
              <td class="second_line">{{ viewForm.count }}</td>
            </tr>
            <tr class="view_line">
              <td class="line_title">开始时间：</td>
              <td class="second_line">{{ viewForm.startDate }}</td>
            </tr>
            <tr class="view_line">
              <td class="line_title">结束时间：</td>
              <td class="second_line">{{ viewForm.endDate }}</td>
            </tr>
          </table>
        </div>
      </el-scrollbar>
      <div v-show="modelType!='view'" slot="footer" class="dialog-footer">
        <el-button v-show="modelType!='view' && modelType!='edit'" @click="restForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">{{ sureBtn }}</el-button>
      </div>
      <div v-show="modelType=='view'" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modelShow=false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  // getReportInfo,
  // banReport,
  // saveReport,
  // updateReport
  welfarelist,
  addwelfare,
  editwelfare,
  changewelfareLabel,
  cancellationwelfareLabel,
  stopBanned,
  upBanned,
  batchCancel
} from '@/api/agent'
// import {
//   getWefareThirdList
// } from '@/api/system'
import {
  getExecutiveOrg
} from '@/api/public'
  // import axios from 'axios'
export default {
  name: 'WelfareManage',
  data() {
    return {
      id: '',
      uploadUrl: '',
      page_name: 'welfare',
      module_name: 'agent',
      tabsList: [{
        label: '全部福利',
        name: 'all'
      }],
      choseTotal: 0,
      inputName: '不选则默认选中整个部门',
      tableData: [],
      loading: true,
      modelType: '',
      modelTitle: '',
      modelShow: false,
      sureBtn: '确 定',
      showFifter: false,
      welfareForm: {
        title: '',
        code: '',
        content: '',
        organizeId: [],
        organizeName: [],
        startDate: '',
        endDate: ''
      },
      viewForm: {},
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      depList: [],
      depTree: false,
      depText: '',
      depIdList: [],
      depNameList: [],
      depId: 0,
      fileList: [],
      files: [],
      tableHeight: 250,
      rules: {
        code: [{
          required: true,
          message: '福利编号不能为空',
          trigger: 'blur'
        }],
        title: [{
          required: true,
          message: '福利标题不能为空',
          trigger: 'blur'
        }],
        content: [{
          required: true,
          message: '福利内容不能为空',
          trigger: 'blur'
        }, {
          min: 1,
          max: 120,
          message: '福利内容长度超出范围1-120位之间',
          trigger: 'blur'
        }],
        organizeId: [{
          required: true,
          message: '执行部门不能为空',
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
        }]
        // allowDepartment: [{
        //   required: true,
        //   message: '发放部门不能为空',
        //   trigger: 'blur'
        // }]
      },
      arrId2: [],
      searchInfo: {
        mode: 'all', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      total: 0, // 总条数
      submitting: false,
      search_key: '',
      fifter_key: '',
      selectArr: [],
      show_fifter: false

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
    // 获取默认信息
    this.getDefault()
    // 获取列表
    this.getList()
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  methods: {
    batchstop(type) {
      const that = this
      console.log('askldjslkdf')
      if (that.selectArr.length > 0) {
        if (type === 'banned') {
          var obj = {
            welfareIds: that.selectArr.join(','),
            status: '3'
          }
          this.$confirm('确定要批量停用福利吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            stopBanned(obj).then(res => {
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
        } else if (type === 'remover') {
          const obj = {
            welfareIds: this.selectArr.join(',')
          }
          this.$confirm('福利一旦作废，不可以恢复哦,确定要批量“作废”吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            batchCancel(obj).then(res => {
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
        } else {
          const obj = {
            welfareIds: this.selectArr.join(',')
          }
          this.$confirm('确定要批量启用福利吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            upBanned(obj).then(res => {
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
      }
    },
    getDefault() {
      const that = this
      getExecutiveOrg().then(res => {
        console.log(res, 1)
        if (res.code === 200 || res.code === '200') {
          const arr = res.data
          // that.formatDep(arr)
          // arr.unshift({
          //   id: '0',
          //   label: '所有部门'
          // })
          that.depList = arr
        }
        console.log(that.depList, 2)
      })
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
    restForm() {
      this.$refs['welfareForm'].resetFields()
      this.welfareForm = {
        title: '',
        content: '',
        organizeId: [],
        organizeName: [],
        startDate: '',
        endDate: ''
      }
      this.depNameList = []
      this.inputName = '不选则默认选中整个部门'
      this.depTree = false
      this.depIdList = []
    },
    // choseDepList(e) {
    //   console.log(e[e.length - 1], 1)
    //   const idr2 = e[e.length - 1]
    //   const arr = this.depList.filter(item => item.id === idr2) || []
    //   console.log(arr, 2)
    //   console.log(arr.length, 'arr.length')
    //   if (arr.length > 0) {
    //     var arr1 = []
    //     arr1.push(arr[0].name)
    //     this.welfareForm.organizeName = arr1
    //   }
    //   console.log(this.welfareForm.organizeName, 3)
    // },
    choseDepList(e) {
      console.log(this.welfareForm.organizeId)
      console.log(e)
      console.log()
      // console.log(e[e.length - 1], 1)
      // const idr2 = e[e.length - 1]
      // const arr = this.depList.filter(item => item.id === idr2) || []
      // console.log(arr, 2)
      // if (arr.length > 0) {
      //   this.welfareForm.organizeName.push(arr[0].name)
      // }
      // console.log(this.welfareForm.organizeName, 3)
    },
    getList() {
      const that = this
      welfarelist(this.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          that.tableData = res.data.welfare
          that.total = res.data.pager.recTotal // 总条数
        }
      })
    },
    fifterTable(event) {
      console.log(event.prop, 'fsagdfg')
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
    addReport() {
      this.modelTitle = '创建福利'
      this.modelType = 'new'
      this.modelShow = true
      this.sureBtn = '保 存'
    },
    choseType() {
      this.searchInfo.pageID = 1
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
    banWelfare(event, states) {
      const that = this
      var msg = ''
      if (states == '1') {
        msg = '确定要启用福利吗'
      } else {
        msg = '确定要停用福利吗'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changewelfareLabel(event.id, states).then(res => {
          console.log(res)
          if (res.code === 200 || res.code === '200') {
            that.$message({
              type: 'success',
              message: res.msg
            })
            that.modelShow = false
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
    changeStates(event) {
      const that = this
      const msg = '福利一旦作废不可恢复，确定要“作废”吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancellationwelfareLabel(event.id).then(res => {
          if (res.code === 200 || res.code === '200') {
            that.$message({
              type: 'success',
              message: res.data.message
            })
            that.modelShow = false
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
      console.log(data, 111)
      if (type === 'view') {
        this.modelTitle = '查看'
        this.viewForm = data
      } else {
        data = {
          ...data
        }
        const idw = data.organizeId.split(',')
        const idna = data.organizeName.split(',')
        this.welfareForm = {
          id: data.id,
          code: data.code,
          title: data.title,
          content: data.content,
          organizeId: idw,
          organizeName: idna,
          startDate: data.startDate,
          endDate: data.endDate,
          count: data.count
        }
        console.log(this.welfareForm)
        this.depIdList = []
        this.depNameList = []
        if (data.organizeId !== '' && (data.organizeId !== 0 || data.organizeId !== '0')) {
          const ids = data.organizeId.split(',')
          const names = data.organizeName.split(',')
          for (let i = 0; i < ids.length; i++) {
            this.depIdList[i] = parseInt(ids[i])
            this.depNameList.push({
              id: ids[i],
              name: names[i]
            })
          }
          this.inputName = ''
        }
        this.modelTitle = '编辑福利'
      }
      this.modelType = type
      this.modelShow = true
      this.id = data.id
    },
    saveModel() {
      // debugger
      console.log(this.welfareForm.organizeId, '32')
      // if (this.welfareForm.organizeId.length === 0 || this.welfareForm.organizeId.length === '0') {
      //   this.$message.warning('执行部门不能为空！')
      //   return
      // }
      const that = this
      this.$refs['welfareForm'].validate((valid) => {
        if (valid) {
          // if (this.depNameList.length !== 0) {
          //   const ids = []
          //   const names = []
          //   for (let i = 0; i < this.depNameList.length; i++) {
          //     ids.push(this.depNameList[i].id)
          //     names.push(this.depNameList[i].name)
          //   }
          //   this.welfareForm.organizeId = ids.join(',')
          //   this.welfareForm.organizeName = names.join(',')
          // }
          const startTime = new Date(this.welfareForm.startDate)
          const endTime = new Date(this.welfareForm.endDate)
          console.log(endTime - startTime)
          if (endTime - startTime <= 0) {
            that.$message.warning('开始时间必须小于结束时间！')
          } else {
            that.submitting = true
            // that.welfareForm.organizeName = JSON.stringify(that.welfareForm.organizeName)
            if (this.modelType === 'new') {
              // this.welfareForm.organizeId = this.welfareForm.organizeId.join(',')
              // console.log(this.welfareForm,"2132213")
              // console.log(this.welfareForm.organizeName, 22)
              // 新增福利
              addwelfare(this.welfareForm).then(res => {
                this.submitting = false
                if (res.code === 200 || res.code === '200') {
                  that.$message({
                    message: '福利添加成功！',
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
              // 更新福利+
              console.log(this.welfareForm, 'edit')
              const info = {
                id: this.welfareForm.id,
                title: this.welfareForm.title,
                content: this.welfareForm.content,
                organizeId: this.welfareForm.organizeId,
                organizeName: this.welfareForm.organizeName,
                startDate: this.welfareForm.startDate,
                endDate: this.welfareForm.endDate
              }
              editwelfare(this.id, info).then(res => {
                this.submitting = false
                if (res.code === 200 || res.code === '200') {
                  that.$message({
                    message: '福利更新成功！',
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
      console.log('重置表单')
      this.$refs['welfareForm'].resetFields()
      this.welfareForm = {
        title: '',
        code: '',
        content: '',
        organizeId: [],
        organizeName: [],
        startDate: '',
        endDate: ''
      }
      this.modelShow = false
      this.depNameList = []
      this.inputName = '不选则默认选中整个部门'
      this.depTree = false
      this.depIdList = []
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning('当前限制选择 1 个文件，请删除后继续上传')
    },
    // 过滤
    filterDepNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 显示部门列表
    showDepTree() {
      document.getElementById('focusInput').focus()
      const that = this
      this.depTree = true
      console.log(this.depIdList)
      this.$nextTick(function() {
        that.$refs.deptree.setCheckedKeys(that.depIdList)
      })
    },
    // 隐藏部门列表
    hiddenDepTree() {
      this.depTree = false
    },
    // 选择部门
    choseDep() {
      const ids = []
      document.getElementById('focusInput').focus()
      const choseDepList = this.$refs.deptree.getCheckedNodes()
      console.log(choseDepList)
      this.depNameList = []
      for (let i = 0; i < choseDepList.length; i++) {
        this.depNameList.push({
          id: choseDepList[i].id,
          name: choseDepList[i].name
        })
        ids.push(choseDepList[i].id)
      }
      if (this.depNameList.length > 0) {
        this.inputName = ''
      } else {
        this.inputName = '不选则默认选中整个部门'
      }
      this.$nextTick(function() {
        this.$refs.deptree.setCheckedKeys(ids)
        this.depIdList = ids
      })
      this.depTree = true
      this.depText = ''
    },
    handleClose(item, index) {
      this.depNameList.splice(index, 1)
      const ids = []
      for (let i = 0; i < this.depNameList.length; i++) {
        ids.push(this.depNameList[i].id)
      }
      this.$refs.deptree.setCheckedKeys(ids)
      if (this.depNameList.length > 0) {
        this.inputName = ''
      } else {
        this.inputName = '不选则默认选中整个部门'
      }
    }
  }
}

</script>
<style lang="less" scoped>
  .welfare_bg {
    // background: #fff;
    // padding: 10px;
    position: absolute;
    width: 100%;
    top: 0;

    .welfare_fifter {
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

    .welfare_info {
      background: #fff;
      padding: 20px 10px;
      .welfare_total{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding-bottom: 10px;
        span{
          font-size: 13px;
          color: #333333;
          margin-right: 6px;
        }
      }
    }

  }

  .dialogModel {
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

      .checkDep {
        position: relative;

        .red_star {
          position: absolute;
          left: -90px;
          font-size: 13px;
          font-family: 'Arial Normal', 'Arial';
          color: #f56c6c;
        }

        .red_star-l {
          left: -105px;
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
          max-width: 310px;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          height: 36px;
          line-height: 36px;
          z-index: 101;

          span {
            margin-right: 5px;
          }
        }

        .tag_list_layer {
          position: absolute;
          top: 0;
          left: 5px;
          width: 100%;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          height: 36px;
          line-height: 36px;
          z-index: 100;
        }

        .layer_hidden {
          display: none;
        }
      }

      .scroll_tree {
        .fifter_input {
          width: 500px;
          padding-top: 5px;
          padding-left: 5px;
          padding-bottom: 5px;
        }
      }
    }

    // .view_welfare {
    //   .view_line {
    //     overflow: hidden;
    //     padding: 10px 0;

    //     span {
    //       font-family: '微软雅黑 Regular', '微软雅黑';
    //       font-weight: 400;
    //       font-size: 14px;
    //       color: #999999;
    //       float: left;
    //       width: 460px;
    //     }

    //     .line_title {
    //       font-weight: 400;
    //       color: #666666;
    //       width: 100px;
    //       text-align: right;
    //       // margin-right: 10px;
    //     }

    //     .first_line {
    //       font-weight: 700;
    //       font-size: 16px;
    //       color: #999999;
    //     }

    //     .second_line {
    //       color: #000000;
    //       // margin-left:10px;
    //       padding-left: 10px;
    //     }

    //     .small_font {
    //       font-size: 12px;
    //     }
    //   }
    // }

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
