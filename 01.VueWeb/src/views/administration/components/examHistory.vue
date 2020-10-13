<template>
  <div>
    <div class="exam_bg">
      <div class="fifter">
        <!-- <search-fifter
          :fifter="true"
          :module-name="'dailyexam'"
          :delay-fifter="loading==false"
          :download-url="downloadUrl"
          :export-show="btnPermission('dailyexam_export')"
          :export-type="moduleType"
          :export-name="'考试记录列表'"
          @search="fifterSearch"/> -->
        <my-tabs
          :active-name="searchInfo.mode"
          :add="false"
          :page-name="page_name"
          :module-name="module_name"
          :tabs-list="typeList"
          @handleClick="choseType"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)" />
      </div>
      <div class="exam_table">
        <!-- <el-tabs v-model="searchInfo.mode" type="card" class="tabs_table" @tab-click="choseType">
          <el-tab-pane v-for="(item,index) in typeList" :key="index" :label="item.text" :name="item.name"> -->
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}个记录</span>
            <!-- <el-button plain size="mini">批量作废</el-button> -->
          </div>
          <div class="export_btn">
            <search-fifter
              :export-show="btnPermission('dailyexam_export')"
              :export-type="moduleType"
              :export-name="'考试记录列表'"
              :module-name="'dailyexam'"
              @importAction="importAction"/>
          </div>
        </div>
        <el-table v-loading="loading" ref="table" :data="tableData" :max-height="tableHeight" border row-key="id" style="width: 100%" tooltip-effect="light" @sort-change="fifterTable" @selection-change="handleSelectionChange">
          <el-table-column prop="title" label="考试主题" show-overflow-tooltip min-width="200">
            <template slot-scope="scope">
              <span class="text_color">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="account" label="考试人" />
          <el-table-column prop="startTime" min-width="140" label="开始时间"/>
          <el-table-column prop="endTime" min-width="140" label="结束时间" />
          <el-table-column v-if="searchInfo.mode=='all'" prop="score" label="得分"/>>
          <el-table-column prop="status" label="状态">
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
              <el-button
                v-if="btnPermission('dailyexam_view')"
                :disabled="scope.row.status!=4"
                type="text"
                size="small"
                @click="answerExam(scope.row, 'view')">查看结果</el-button>
              <el-button
                v-if="btnPermission('dailyexam_answer')&&searchInfo.mode=='my'"
                :disabled="scope.row.status!=2"
                type="text"
                size="small"
                @click="answerExam(scope.row, 'answer')">前往答题</el-button>
              <el-button
                v-if="searchInfo.mode=='sponsor'&&btnPermission('dailyexam_approve')"
                :disabled="scope.row.status!=3"
                type="text"
                size="small"
                @click="answerExam(scope.row, 'approval')">审批</el-button>
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
  dailyexamList
} from '@/api/administration'
import {
  // eslint-disable-next-line no-unused-vars
  btnPermission
} from '@/permission.js' // 按钮权限和页面权限
export default {
  name: 'Exam',
  data() {
    return {
      modelShow: false,
      page_name: 'dailyexam',
      module_name: 'ad',
      choseTotal: 0,
      moduleType: '/ad/dailyexam-export',
      downloadUrl: '',
      uploadUrl: '',
      modelTitle: '',
      tableData: [],
      loading: true,
      examList: [],
      typeList: [],
      tableHeight: 250,
      searchInfo: {
        mode: 'all', // 类型 全部 all 正常 normal 封禁 ban
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      total: 10 // 总条数
    }
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  mounted() {
    if (this.btnPermission('dailyexam_all') === false) {
      this.typeList = [
        {
          label: '我的考试',
          name: 'my'
        },
        {
          label: '我发起的',
          name: 'sponsor'
        }
      ]
      this.searchInfo.mode = 'my'
    } else {
      this.typeList = [{
        label: '全部考试',
        name: 'all'
      },
      {
        label: '我的考试',
        name: 'my'
      },
      {
        label: '我发起的',
        name: 'sponsor'
      }
      ]
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
    // 页面第一个渲染的函数
    this.getList()
  },
  methods: {
    importAction() {
      if (event) {
        this.getList()
      }
    },
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
    // 方法
    getList() {
      const that = this
      dailyexamList(this.searchInfo).then(res => {
        if (res.code === 200 || res.code === '200') {
          this.loading = false
          that.tableData = res.data.dailyexams
          that.total = res.data.pager.recTotal
        }
      })
    },
    answerExam(event, type) {
      if (type === 'answer') {
        this.$router.push({
          path: '/administration/examHistory/examAnswer?type=answer&id=' + event.id
        })
      } else if (type === 'view') {
        this.$router.push({
          path: '/administration/examHistory/examAnswer?type=view&id=' + event.id
        })
      } else {
        this.$router.push({
          path: '/administration/examHistory/examAnswer?type=approval&id=' + event.id
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
      this.searchInfo.pageID = 1
      this.tableData = []
      this.getList()
    },
    choseType(value) {
      this.searchInfo.mode = value
      this.searchInfo.pageID = 1
      this.loading = true
      if ((this.$refs.table) !== undefined) {
        this.resetTable()
      }
      this.tableData = []
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
  .exam_bg {
    // background: #fff;
    // padding: 10px;
    position: absolute;
    width: 100%;
    top: 0;
  .exam_table{
    background: #fff;
    padding: 20px 10px;
  }
    // .exam_btn {
    //   display: flex;
    //   align-items: center;
    //   justify-content: space-between;
    // }
    .text_color {
      color: #409EFF;
    }

    .exam_page {
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
