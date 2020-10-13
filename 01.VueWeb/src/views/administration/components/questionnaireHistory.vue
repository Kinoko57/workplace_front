<template>
  <div>
    <div class="quesHistory_bg">
      <div class="fifter">
        <!-- <change-fifter
          ref="change"
          :fifter="true"
          :fifter-show="fifterShow"
          :module-name="'surveyexam'"
          :delay-fifter="loading==false"
          :download-url="downloadUrl"
          :export-show="btnPermission('surveyexam_export')"
          :export-type="moduleType"
          :export-name="'问卷记录列表'"
          @search="fifterSearch" /> -->
        <my-tabs
          :active-name="searchInfo.mode"
          :page-name="page_name"
          :module-name="module_name"
          :tabs-list="typeList"
          @handleClick="choseType"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)" />
      </div>
      <div class="quesHistory_table">
        <!-- <el-tabs v-model="searchInfo.mode" type="card" class="tabs_table" @tab-click="choseType">
          <el-tab-pane v-for="(item,index) in typeList" :key="index" :label="item.text" :name="item.name"> -->
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}个记录</span>
            <!-- <el-button plain size="mini">批量作废</el-button> -->
          </div>
          <div class="export_btn">
            <search-fifter
              :download-url="downloadUrl"
              :export-show="btnPermission('surveyexam_export')"
              :export-type="moduleType"
              :export-name="'问卷记录列表'"
              :module-name="'surveyexam'"
              @importAction="importAction"/>
          </div>
        </div>
        <el-table
          v-loading="loading"
          v-show="searchInfo.mode!='statistics'"
          ref="table"
          :data="tableData"
          :max-height="tableHeight"
          border
          row-key="id"
          style="width: 100%"
          tooltip-effect="light"
          @sort-change="fifterTable"
          @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" /> -->
          <!-- <el-table-column  type="selection" min-width="40" fixed="left" align="center"/> -->
          <el-table-column prop="title" label="问卷主题" show-overflow-tooltip min-width="200">
            <template slot-scope="scope">
              <span class="text_color">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="accountName" label="填写人" min-width="120"/>
          <el-table-column prop="startTime" label="问卷开始时间" min-width="140" />
          <el-table-column prop="endTime" label="问卷结束时间" min-width="140"/>
          <el-table-column prop="organizeName" label="调查部门" min-width="150" />
          <el-table-column prop="status" label="状态" >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status==1" type="info">未开始</el-tag>
              <el-tag v-if="scope.row.status==2">考试中</el-tag>
              <el-tag v-if="scope.row.status==3" type="warning">待审阅</el-tag>
              <el-tag v-if="scope.row.status==4" type="success">已完成</el-tag>
              <el-tag v-if="scope.row.status==5" type="danger">未参与</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="tableData.length>0" label="操作" min-width="200" fixed="right" align="center">
            <template slot-scope="scope">
              <span v-if="showBotton">
                <el-button
                  v-if="btnPermission('surveyexam_view')"
                  :disabled="scope.row.status!=4"
                  type="text"
                  size="small"
                  @click="answerquesHistory(scope.row, 'view')">查看结果</el-button>
                <el-button
                  v-if="btnPermission('surveyexam_answer')&&searchInfo.mode=='my'"
                  :disabled="scope.row.status!=2"
                  type="text"
                  size="small"
                  @click="answerquesHistory(scope.row, 'answer')">前往填写</el-button>
              </span>
              <span v-else>
                <el-button
                  v-if="btnPermission('surveyexam_statistics')"
                  type="text"
                  size="small"
                  @click="answerquesHistory(scope.row, 'detail')">查看统计</el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <el-table v-loading="loading" v-show="searchInfo.mode=='statistics'" ref="table" :data="tableData" border row-key="id" style="width: 100%" tooltip-effect="light" @sort-change="fifterTable" @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" /> -->
          <el-table-column type="selection" min-width="40"/>
          <el-table-column prop="title" label="问卷主题" show-overflow-tooltip min-width="200" >
            <template slot-scope="scope">
              <span class="text_color">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="问卷开始时间" min-width="150"/>
          <el-table-column prop="endTime" label="问卷结束时间" min-width="150"/>
          <el-table-column label="操作" min-width="200" align="center">
            <template slot-scope="scope">
              <span v-if="showBotton">
                <el-button
                  v-if="btnPermission('surveyexam_view')"
                  :disabled="scope.row.status!=4"
                  type="text"
                  size="small"
                  @click="answerquesHistory(scope.row, 'view')">查看结果</el-button>
                <el-button
                  v-if="btnPermission('surveyexam_answer')&&searchInfo.mode=='my'"
                  :disabled="scope.row.status!=2"
                  type="text"
                  size="small"
                  @click="answerquesHistory(scope.row, 'answer')">前往填写</el-button>
              </span>
              <span v-else>
                <el-button
                  v-if="btnPermission('surveyexam_statistics')&&scope.row.isAnswer=='0'"
                  disabled
                  type="text"
                  size="small"
                  @click="answerquesHistory(scope.row, 'detail')">查看统计</el-button>
                <el-button
                  v-if="btnPermission('surveyexam_statistics')&&scope.row.isAnswer=='1'"
                  type="text"
                  size="small"
                  @click="answerquesHistory(scope.row, 'detail')">查看统计</el-button>
              </span>
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
            aligin="center"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
        <!-- </el-tab-pane>
        </el-tabs> -->
      </div>
    </div>
  </div>
</template>
<script>
import {
  questionnaireHistory
} from '@/api/administration'
import {
  // eslint-disable-next-line no-unused-vars
  btnPermission
} from '@/permission.js' // 按钮权限和页面权限
import changeFifter from '@/components/changeFifter/index'
export default {
  name: 'QuestionnaireHistory',
  components: {
    changeFifter
  },
  data() {
    return {
      page_name: 'surveyexam',
      module_name: 'ad',
      choseTotal: 0,
      choseTypeShow: false,
      fifterShow: false,
      showBotton: true,
      modelShow: false,
      downloadUrl: '',
      uploadUrl: '',
      modelTitle: '',
      typeList: [],
      moduleType: '/ad/surveyexam-export',
      tableData: [],
      loading: true,
      quesHistoryList: [],
      searchInfo: {
        mode: 'all', // 类型 全部 all 正常 normal 封禁 ban
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      total: 10, // 总条数
      tableHeight: 250,
      ruleForm: {
        code: '1',
        people: '',
        bumen: '',
        gangwei: '',
        type: '',
        card: '',
        jineng: '',
        createdDate: ''
      }
    }
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  mounted() {
    // 页面第一个渲染的函数
    console.log(this.$route.query.tab)
    if (this.btnPermission('surveyexam_all') == false && this.btnPermission('surveyexam_statistics') == false) {
      this.typeList = [{
        label: '我的问卷',
        name: 'my'
      }, {
        label: '我发起的',
        name: 'sponsor'
      }]
      this.searchInfo.mode = 'my'
    } else if (this.btnPermission('surveyexam_all') == false && this.btnPermission('surveyexam_statistics') == true) {
      this.typeList = [{
        label: '我的问卷',
        name: 'my'
      }, {
        label: '我发起的',
        name: 'sponsor'
      }, {
        label: '问卷统计',
        name: 'statistics'
      }]
      this.searchInfo.mode = 'my'
    } else if (this.btnPermission('surveyexam_statistics') == false && this.btnPermission('surveyexam_all') == true) {
      this.typeList = [{
        label: '全部问卷',
        name: 'all'
      }, {
        label: '我的问卷',
        name: 'my'
      }, {
        label: '我发起的',
        name: 'sponsor'
      }]
      this.searchInfo.mode = 'all'
    } else {
      this.typeList = [{
        label: '全部问卷',
        name: 'all'
      }, {
        label: '我的问卷',
        name: 'my'
      }, {
        label: '我发起的',
        name: 'sponsor'
      }, {
        label: '问卷统计',
        name: 'statistics'
      }]
      this.searchInfo.mode = 'all'
    }
    if (this.$route.query.tab === 'my') {
      const activeTab = this.$route.query.tab
      console.log(this.$route.query.tab)
      this.searchInfo.mode = activeTab
    // this.getList()
    }
    if (window.localStorage.getItem('activetab') != '' && window.localStorage.getItem('activetab') != undefined) {
      const activeTab = window.localStorage.getItem('activetab')
      console.log(window.localStorage.getItem('activetab'))
      this.searchInfo.mode = activeTab
      window.localStorage.setItem('activetab', '')
    }
    this.getList()
    this.uploadUrl = process.env.BASE_API + 'agent/service-import.json'
  },
  methods: {
    handleSelectionChange(val) {
      console.log(val)
      this.choseTotal = val.length
      if (val.length > 0) {
        console.log('本页选择了')
      } else {
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
    importAction() {
      if (event) {
        this.getList()
      }
    },
    // 方法
    getList() {
      const that = this
      console.log(this.searchInfo)
      questionnaireHistory(this.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200 || res.code === '200') {
          // if (that.choseTypeShow) {
          //   if (that.$refs.change.innerShow) {
          //     that.fifterShow = true
          //     that.$refs.change.tabFifter()
          //     that.choseTypeShow = false
          //   }
          // }
          that.tableData = res.data.surveyexams
          that.total = res.data.pager.recTotal
        }
      })
    },
    answerquesHistory(event, type) {
      if (type === 'answer') {
        this.$router.push({
          path: '/administration/questionnaireHistory/questionnaireHistoryAnswer?type=answer&id=' + event.id
        })
      } else if (type === 'view') {
        console.log(type)
        this.$router.push({
          path: '/administration/questionnaireHistory/questionnaireHistoryAnswer?type=view&id=' + event.id
        })
      } else {
        this.$router.push({
          path: '/administration/questionnaireHistory/questionnaireHistoryAnswer?type=detail&id=' + event.id
        })
      }
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
    // changFiFter() {
    //   this.fifterShow = !this.fifterShow
    //   console.log(this.fifterShow)
    // },
    choseType(value) {
      this.searchInfo.pageID = 1
      this.searchInfo.mode = value
      this.tableData = []
      if (this.searchInfo.mode === 'statistics') {
        this.showBotton = false
      } else {
        this.showBotton = true
      }
      this.searchInfo.search = ''
      this.choseTypeShow = true
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
      this.getList()
    },
    handleCurrentChange(val) {
      this.searchInfo.pageID = val
      this.tableData = []
      this.getList()
    }

  }
}

</script>
<style lang="less" scoped>
  .quesHistory_bg {
    // background: #fff;
    // padding: 10px;
    position: absolute;
    width: 100%;
    top: 0;
    .quesHistory_table{
      background: #fff;
      padding: 20px 10px
    }
    // .quesHistory_btn {
    //   display: flex;
    //   align-items: center;
    //   justify-content: space-between;
    // }
    .text_color {
      color: #409EFF;
    }

    .quesHistory_page {
      text-align: center;
      padding: 10px 0;
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
  }

</style>
