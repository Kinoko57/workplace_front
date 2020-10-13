<template>
  <div>
    <div class="performance_bg">
      <div class="fifter">
        <!-- <search-fifter
          :fifter="true"
          :module-name="'performanceexam'"
          :delay-fifter="loading==false"
          :download-url="downloadUrl"
          :export-show="btnPermission('performanceexam_export')"
          :export-type="moduleType"
          :export-name="'绩效记录列表'"
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
      <div class="performance_table">
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}条内容</span>
          </div>
          <div class="export_btn">
            <search-fifter
              :download-url="downloadUrl"
              :export-show="btnPermission('performanceexam_export')"
              :export-type="moduleType"
              :export-name="'绩效记录列表'"
              :module-name="'performanceexam'"
              @importAction="importAction"/>
          </div>
        </div>
        <el-table v-loading="loading" ref="table" :data="tableData" :max-height="tableHeight" border row-key="id" style="width: 100%" tooltip-effect="light" @sort-change="fifterTable">
          <el-table-column prop="title" label="绩效主题" show-overflow-tooltip min-width="200">
            <template slot-scope="scope">
              <span class="text_color">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="accountName" label="考核人" min-width="100"/>
          <el-table-column prop="organizeName" label="考核部门" min-width="100"/>
          <el-table-column prop="year" label="考核年份" min-width="100"/>
          <el-table-column prop="month" label="考核月份" min-width="100"/>
          <el-table-column prop="score" label="最终得分" min-width="100" >
            <template slot-scope="scope">
              <span v-if="scope.row.status==4" >{{ scope.row.score }}</span>
              <span v-else >——</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status==1" type="info">未开始</el-tag>
              <el-tag v-if="scope.row.status==2">考核中</el-tag>
              <el-tag v-if="scope.row.status==3" type="warning">待审核</el-tag>
              <el-tag v-if="scope.row.status==4" type="success">已完成</el-tag>
              <el-tag v-if="scope.row.status==5" type="danger">未参与</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="tableData.length>0" label="操作" align="center" min-width="200" fixed="right">
            <template slot-scope="scope">
              <el-button
                v-if="btnPermission('performanceexam_view')"
                :disabled="scope.row.status!=3&&scope.row.status!=4"
                type="text"
                size="small"
                @click="answerExam(scope.row, 'view')">查看结果</el-button>
              <el-button
                v-if="searchInfo.mode=='my'&&btnPermission('performanceexam_answer')"
                :disabled="scope.row.iscan==0"
                type="text"
                size="small"
                @click="answerExam(scope.row, 'answer')">开始考核</el-button>
              <el-button
                v-if="(searchInfo.mode=='sponsor'||searchInfo.mode=='finish')&&btnPermission('performanceexam_approve')&&scope.row.status!=4"
                :disabled="scope.row.status!=3"
                type="text"
                size="small"
                @click="answerExam(scope.row, 'super')">立即审批</el-button>
              <el-button
                v-if="searchInfo.mode=='finish'&&group_type==2"
                type="text"
                size="small"
                @click="answerExam(scope.row, 'approval')">负责人审批</el-button>
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
  performanceExamList
} from '@/api/administration'
import {
  // eslint-disable-next-line no-unused-vars
  btnPermission
} from '@/permission.js' // 按钮权限和页面权限
export default {
  name: 'PerformanceHistory',
  data() {
    return {
      page_name: 'performanceexam',
      module_name: 'ad',
      choseTotal: 0,
      moduleType: '/ad/performanceexam-export',
      downloadUrl: '',
      loading: true,
      total: 20,
      tableHeight: 250,
      tableData: [],
      typeList: [],
      group_type: 0,
      searchInfo: {
        mode: 'all', // 类型 全部 all 我的绩效 my 待我审核 sponsor 考核完成 finish
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      }
    }
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  mounted() {
    if (this.btnPermission('performanceexam_all') === false) {
      this.typeList = [
        {
          label: '我的绩效',
          name: 'my'
        },
        {
          label: '待我审核',
          name: 'sponsor'
        },
        {
          label: '考核完成',
          name: 'finish'
        }
      ]
      this.searchInfo.mode = 'my'
    } else {
      this.typeList = [{
        label: '全部绩效',
        name: 'all'
      },
      {
        label: '我的绩效',
        name: 'my'
      },
      {
        label: '待我审核',
        name: 'sponsor'
      },
      {
        label: '考核完成',
        name: 'finish'
      }
      ]
    }
    if (this.$route.query.tab === 'my') {
      const activeTab = this.$route.query.tab
      console.log(this.$route.query.tab)
      this.searchInfo.mode = activeTab
    }
    if (window.localStorage.getItem('activetab') != '' && window.localStorage.getItem('activetab') != undefined) {
      const activeTab = window.localStorage.getItem('activetab')
      console.log(window.localStorage.getItem('activetab'))
      this.searchInfo.mode = activeTab
      window.localStorage.setItem('activetab', '')
    }
    // 页面第一个渲染的函数
    this.getList()
  },
  methods: {
    importAction() {
      if (event) {
        this.getList()
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
      performanceExamList(this.searchInfo).then(res => {
        if (res.code === 200 || res.code === '200') {
          this.loading = false
          that.tableData = res.data.performanceexams
          that.total = res.data.pager.recTotal
          this.group_type = res.data.group_type
        }
      })
    },
    answerExam(event, type) {
      if (type === 'answer') {
        this.$router.push({
          path: '/administration/performanceHistory/performanceAnswer?type=answer&id=' + event.id
        })
      } else if (type === 'view') {
        this.$router.push({
          path: '/administration/performanceHistory/performanceAnswer?type=view&id=' + event.id
        })
      } else if (type === 'super') {
        this.$router.push({
          path: '/administration/performanceHistory/performanceAnswer?type=super&id=' + event.id
        })
      } else {
        this.$router.push({
          path: '/administration/performanceHistory/performanceAnswer?type=approval&id=' + event.id
        })
      }
    },
    // 方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.searchInfo.pageID = 1
      this.searchInfo.recPerPage = val
      this.tableData = []
      // this.loading = true
      this.getList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.searchInfo.pageID = val
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
    choseType(value) {
      this.loading = true
      this.searchInfo.pageID = 1
      this.searchInfo.mode = value
      this.tableData = []
      if ((this.$refs.table) !== undefined) {
        this.resetTable()
      }
      this.getList()
    },
    resetTable() {
      for (let i = 0; i < (this.$refs.table).length; i++) {
        (this.$refs.table)[i].clearSort()
      }
    },
    addPaper() {
      this.$router.push({
        path: '/administration/performanceIndex/performanceInfo?type=new&id='
      })
    }

  }
}

</script>
<style lang="less" scoped>
  .performance_bg {
    // background: #fff;
    // padding: 10px;
    position: absolute;
    width: 100%;
    top: 0;
    .performance_table{
      background: #fff;
      padding: 20px 10px;
    }
    .text_color {
      color: #409EFF;
    }

    .performance_page {
      text-align: center;
      padding: 10px 0;
    }
  }

</style>
