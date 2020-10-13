<template>
  <div>
    <div class="log_bg">
      <div class="fifter">
        <!-- <search-fifter :fifter="true" :module-name="'log'" @search="fifterSearch" /> -->
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
      <div class="bussiness_info">
        <!-- <el-tabs v-model="searchInfo.mode" type="card" class="tabs_table" @tab-click="choseType">
          <el-tab-pane v-for="(item,index) in typeList" :key="index" :label="item.text" :name="item.name"> -->
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}条数据</span>
            <!-- <el-button plain size="mini">批量导出</el-button> -->
          </div>
          <!-- <div class="export_btn">
            <search-fifter
              :export-type="moduleType"
              :export-name="'日志列表'"
              :export-show="true"
            />
          </div> -->
        </div>
        <el-table v-loading="loading" :data="tableData" :max-height="tableHeight" border row-key="id" tooltip-effect="light" style="width: 100%">
          <!-- <el-table-column  type="selection" min-width="40" fixed="left"/> -->
          <el-table-column prop="id" label="序号" width="180"/>
          <el-table-column prop="createdDate" label="时间" show-overflow-tooltip />
          <el-table-column prop="account" label="操作人" show-overflow-tooltip width="180" />
          <el-table-column prop="action" label="操作类型" show-overflow-tooltip width="180" />
          <el-table-column prop="module" label="模块" show-overflow-tooltip width="180" />
          <el-table-column label="日志简要内容" show-overflow-tooltip >
            <template slot-scope="scope">
              <span>{{ scope.row.content }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="editedDate" label="附件"/>
              <el-table-column label="备注" width="200">
                <template slot-scope="scope">
                  <span v-if="scope.row.remarks==''">---</span>
                  <span v-else>{{ scope.row.remarks }}</span>
                </template>
              </el-table-column> -->
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
  </div>
</template>
<script>
import {
  getLogInfo
//   changeLog
} from '@/api/system'
// import axios from 'axios'
export default {
  name: 'LogManage',
  data() {
    return {
      moduleType: '/oa/attendance-export',
      page_name: 'log',
      module_name: 'sys',
      choseTotal: 0,
      tableData: [],
      loading: true,
      typeList: [
        { label: '当前日志', name: 'today' },
        { label: '近七天', name: 'week' },
        { label: '近一个月', name: 'month' },
        { label: '全部', name: 'all' }
      ],
      tableHeight: 250,
      searchInfo: {
        deptID: '',
        mode: 'today', // 类型 today 今天，week 7天，month 30天， all全部
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
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
  },
  methods: {
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
    getList() {
      const that = this
      that.loading = false
      getLogInfo(this.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          that.tableData = res.data.log
          that.total = res.data.pager.recTotal // 总条数
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
    }
  }
}

</script>
<style lang="less" scoped>
  .log_bg {
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

    .bussiness_info {
     background: #fff;
     padding:20px 10px;
    }

    .bussiness_page {
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
