<template>
  <div>
    <div class="study_bg">
      <div class="fifter">
        <my-tabs
          :page-name="page_name"
          :module-name="module_name"
          :add="btnPermission('offlinestudy_create')"
          :active-name="searchInfo.mode"
          :tabs-list="tabsList"
          @addAction="addStudy"
          @handleClick="choseType"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)"/>
          <!-- <search-fifter :add="btnPermission('offlinestudy_create')" :module-name="'offlinestudy'" :fifter="true" :add-text="'创建培训'" :export-show="btnPermission('offlinestudy_export')" :export-type="moduleType" :export-name="'培训列表'" @addAction="addStudy" @search="fifterSearch" /> -->
      </div>
      <div class="study_info">
        <!-- <el-tabs v-model="searchInfo.mode" type="card" class="tabs_table" @tab-click="choseType">
          <el-tab-pane v-for="(item,index) in typeList" :key="index" :label="item.text" :name="item.name"> -->
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}条内容，已选中{{ choseTotal }}条</span>
            <!-- <el-button plain size="mini">批量停用</el-button> -->
            <el-button v-if="btnPermission('offlinestudy_batchcancellation')" plain size="mini" @click="batchstop('remover')">批量作废</el-button>
            <!-- <el-button plain size="mini">批量启用</el-button> -->
          </div>
          <div class="export_btn">
            <search-fifter
              :export-show="btnPermission('offlinestudy_export')"
              :export-type="moduleType"
              :export-name="'培训列表'"
              :module-name="'offlinestudy'"/>
          </div>
        </div>
        <el-table
          v-loading="loading"
          ref="table"
          :data="tableData"
          :max-height="tableHeight"
          border
          row-key="id"
          tooltip-effect="light"
          @sort-change="fifterTable"
          @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" width="55" /> -->
          <!-- <el-table-column width="20" /> -->
          <el-table-column type="selection" min-width="40" fixed="left" align="center"/>
          <el-table-column prop="courseName" label="课程名称" show-overflow-tooltip min-width="150">
            <template slot-scope="scope">
              <span class="text_color">{{ scope.row.courseName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="studyDate" label="学习时间" show-overflow-tooltip min-width="100" sortable="custom"/>
          <el-table-column prop="teahcerName" label="讲师" show-overflow-tooltip/>
          <el-table-column label="邀约经销商数量" min-width="120">
            <template slot-scope="scope">
              <span class="text_color">{{ scope.row.offlinestudycount }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="searchInfo.mode=='study'" prop="signupincount" label="签到人数"/>
          <el-table-column v-if="searchInfo.mode=='study'" prop="signinoutcount" label="缺场人数"/>
          <el-table-column v-if="searchInfo.mode=='study'" prop="recordingsigninoutcount" label="补录人数"/>
          <el-table-column prop="createdDate" label="创建时间" show-overflow-tooltip min-width="100" sortable="custom"/>
          <el-table-column prop="source" label="状态" >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status==1" type="danger">未邀约</el-tag>
              <el-tag v-if="scope.row.status==2">已邀约</el-tag>
              <el-tag v-if="scope.row.status==3" type="success">已学习</el-tag>
              <el-tag v-if="scope.row.status==4" type="success">已完成</el-tag>
              <el-tag v-if="scope.row.status==99" type="warning">已作废</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('offlinestudy_edit')" :disabled="scope.row.status==3" type="text" size="small" @click="showModel(scope.row,'edit')">编辑</el-button>
              <el-button v-if="btnPermission('offlinestudy_createcode')" type="text" size="small" @click="download(scope.row)">签到二维码</el-button>
              <el-button v-if="btnPermission('offlinestudymember_browse')" type="text" size="small" @click="goProxy(scope.row)">邀约经销商</el-button>
              <el-button v-if="btnPermission('offlinestudy_cancellation')" type="text" size="small" @click="changeStates(scope.row,'99')">作废</el-button>
              <!-- <el-button v-if="btnPermission('offlinestudy_offlinestudymember')" type="text" size="small" @click="goFllow(scope.row,'100')">培训回访</el-button> -->
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
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="modelShow" :title="modelTitle" width="600px" class="dialogModel" @close="resetModel">
      <!-- 新建培训 -->
      <el-scrollbar class="fixed_scroll">
        <el-form
          v-if="modelShow"
          ref="studyForm"
          :model="studyForm"
          :rules="rules"
          class="modelForm center"
          label-width="100px"
          label-position="right">
          <el-form-item label="选择课程：" prop="courseId">
            <el-select v-model="studyForm.courseId" filterable placeholder="请选择课程" style="width:500px">
              <el-option v-for="item in optionsList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="学习时间：" prop="studyDate">
            <el-date-picker
              v-model="studyForm.studyDate"
              type="datetime"
              placeholder="选择时间日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:500px"

              @change="dateChange"/>
          </el-form-item>
          <el-form-item label="学习地址：" prop="address">
            <el-input v-model.trim="studyForm.address" autocomplete="off" style="width:500px" placeholder="请输入学习地址"/>
          </el-form-item>
          <el-form-item label="选择讲师：" prop="teacher">
            <el-select v-model="studyForm.teacher" filterable placeholder="请选择讲师" style="width:500px">
              <el-option v-for="item in teacherList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="modelType == 'new'" @click="resetsubmit">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">{{ sureBtn }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="imgShow" title="查看签到二维码" class="small_dialog">
      <!--  viewForm.url-->
      <div class="show_img_bg">
        <div style="margin-left: 140px;">
          <p>课程名称：{{ downInfo.courseName }}</p>
          <p>学习时间：{{ downInfo.studyDate }}</p>
          <p>学习地址：{{ downInfo.address }}</p>
        </div>
        <div style="text-align:center;">
          <img :src="codeImg" alt="" srcset="" style="width:220px;height:220px">
        </div>
        <div style="text-align:center;">
          <el-button plain icon="el-icon-download" size="small" @click="downloadCode">下载二维码</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getStudyInfo,
  getStudyCourse,
  getStudyTeacher,
  saveStudy,
  updateStudy,
  studybatchCancel,
  changeStudy
} from '@/api/training'
export default {
  name: 'StudyManage',
  data() {
    return {
      submitting: false,
      tableData: [],
      imgShow: false,
      codeImg: '',
      downInfo: {},
      moduleType: '/ofs/offlinestudy-export',
      courseList: [],
      teacherList: [],
      page_name: 'offlinestudy',
      module_name: 'ofs',
      choseTotal: 0,
      tabsList: [
        { label: '全部', name: 'all' },
        { label: '未邀约', name: 'notInvited' },
        { label: '已邀约', name: 'invited' },
        { label: '已学习', name: 'study' }
      ],
      isShow: true,
      loading: true,
      modelType: '',
      modelTitle: '',
      modelShow: false,
      sureBtn: '确 定',
      optionsList: [],
      studyForm: {
        courseId: '',
        studyDate: '',
        address: '',
        teacher: ''
      },
      tableHeight: 250,
      rules: {
        courseId: [{
          required: true,
          message: '课程不能为空',
          trigger: 'change'
        }],
        studyDate: [{
          required: true,
          message: '学习时间不能为空',
          trigger: 'blur'
        }],
        address: [{
          required: true,
          message: '学习地址不能为空',
          trigger: 'blur'
        }],
        teacher: [{
          required: true,
          message: '讲师不能为空',
          trigger: 'blur'
        }]
      },
      searchInfo: {
        mode: 'all', // 类型  全部 all 未邀约 notInvited 已邀约 invited 已学习 study
        search: '', // 搜索关键字
        orderBy: 'id_desc', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      selectArr: [],
      total: 0 // 总条数
    }
  },
  mounted() {
    // 获取列表
    this.getList()
    // 获取讲师列表和课程列表
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
      console.log('askldjslkdf')
      if (that.selectArr.length > 0) {
        const obj = {
          ids: this.selectArr.join(',')
        }
        this.$confirm('培训一旦作废不可恢复，确定要批量“作废”吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          studybatchCancel(obj).then(res => {
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
          console.log('用户点击了取消')
        })
      }
    },
    // goFllow(data) {
    //   this.$router.push({
    //     path: '/training/studyVisit',
    //     name: 'StudyVisit',
    //     params: {
    //       id: data.id
    //     }
    //   })
    // },
    choseType(value) {
      this.searchInfo.mode = value
      this.searchInfo.pageID = 1
      this.tableData = []
      this.searchInfo.orderBy = ''
      this.loading = true
      console.log(this.searchInfo)
      if ((this.$refs.table) !== undefined) {
        this.resetTable()
      }
      this.getList()
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
    resetsubmit() {
      this.submitting = false
      this.$refs['studyForm'].resetFields()
      this.studyForm = {}
    },
    fifterTable(event) {
      console.log(event.order)
      if (event.order === 'ascending') {
        this.searchInfo.orderBy = event.prop + '_asc'
      } else if (event.order === 'descending') {
        this.searchInfo.orderBy = event.prop + '_desc'
      } else {
        this.searchInfo.orderBy = ''
      }
      this.loading = true
      this.searchInfo.pageID = 1
      this.tableData = []
      this.getList()
    },
    getList() {
      const that = this
      // 获取培训列表
      getStudyInfo(this.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          that.tableData = res.data.offlinestudy
          that.total = res.data.pager.recTotal // 总条数
        }
      })
    },
    getDefault() {
      const that = this
      // 获取课程列表
      getStudyCourse().then(res => {
        if (res.code === 200) {
          console.log(res.data)
          that.optionsList = res.data
          // const obj1 = res.data.offlinecourse
          // for (const i in obj1) {
          //   that.optionsList.push({
          //     label: obj1[i],
          //     value: i
          //   })
          // }
          // that.courseList = obj1
        }
      })
      getStudyTeacher().then(res => {
        if (res.code === 200) {
          console.log(res.data)
          that.teacherList = res.data
          var arr = []
          for (var item in res.data) {
            arr.push({ value: item, label: res.data[item] })
          }
          that.teacherList = arr
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
    addStudy() {
      this.modelTitle = '创建培训'
      this.modelType = 'new'
      this.modelShow = true
      this.sureBtn = '保 存'
    },
    // choseType() {
    //   this.searchInfo.pageID = 1
    //   this.tableData = []
    //   this.searchInfo.orderBy = ''
    //   if ((this.$refs.table) !== undefined) {
    //     this.resetTable()
    //   }
    //   this.loading = true
    //   this.getList()
    // },
    resetTable() {
      for (let i = 0; i < (this.$refs.table).length; i++) {
        (this.$refs.table)[i].clearSort()
      }
    },
    dateChange(date) {
      if (date) {
        const nowTime = new Date()
        const pickTime = new Date(date)
        console.log(nowTime, pickTime)
        if (pickTime < nowTime) {
          this.$message({
            message: '学习时间必须大于当前时间',
            type: 'warning'
          })
          this.studyForm.studyDate = ''
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
    download(data) {
      console.log(data)
      // ofs/offlinestudy-downloadCode
      this.downInfo = data
      this.codeImg = process.env.BASE_API + 'ofs/offlinestudy-downloadCode-' + data.id + '.json'
      this.imgShow = true
      // const url = process.env.BASE_API + 'ofs/offlinestudy-downloadCode-' + data.id + '.json'
      // window.open(url)
    },
    downloadCode() {
      window.open(this.codeImg)
    },
    goProxy(data) {
      this.$router.push({
        path: '/training/proxyList',
        name: 'ProxyListManage',
        params: {
          id: data.id
        }
      })
    },
    showModel(data, type) {
      this.modelType = type
      this.modelShow = true
      this.studyForm = {
        id: data.id,
        courseId: data.courseId,
        studyDate: data.studyDate,
        address: data.address,
        teacher: data.teacher
      }
      this.modelTitle = '编辑培训'
    },
    saveModel() {
      const that = this
      this.$refs['studyForm'].validate((valid) => {
        if (valid) {
          that.submitting = true
          console.log(this.studyForm)
          if (this.modelType === 'new') {
            // 新增培训
            saveStudy(this.studyForm).then(res => {
              console.log(res)
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '培训添加成功！',
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
          } else {
            // 更新培训
            updateStudy(this.studyForm).then(res => {
              console.log(res)
              if (res.code === 200 || res.code === '200') {
                this.$message({
                  message: '培训更新成功！',
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
      console.log('重置表单')
      this.submitting = false
      this.$refs['studyForm'].resetFields()
      this.studyForm = {}
      this.modelShow = false
    },
    changeStates(event, states) {
      // console.log(event, states)
      const that = this
      const msg = '培训一旦作废不可恢复，确定要“作废”吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeStudy(event.id, states).then(res => {
          console.log(res, 222)
          if (res.code === 200 || res.code === '200') {
            that.$message({
              type: 'success',
              message: res.msg
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
    }
  }
}

</script>
<style lang="less" scoped>
  .study_bg {
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

    .study_info {
      background: #fff;
      padding: 20px 10px;
      // margin: 10px 0;
      // .tabs_table{
      //   .text_color{
      //     color: #409EFF;
      //   }
      // }
    }

    .study_page {
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
