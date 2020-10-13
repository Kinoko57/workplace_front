<template>
  <div>
    <div class="performance_bg">
      <div class="fifter">
        <!-- <search-fifter
          :add="btnPermission('performance_create')"
          :module-name="'performance'"
          :fifter="true"
          :delay-fifter="loading==false"
          :download-url="downloadUrl"
          :upload-url="uploadUrl"
          :add-text="'创建试卷'"
          @search="fifterSearch"
          @addAction="addPaper" /> -->
        <my-tabs
          :active-name="'all'"
          :add="btnPermission('performance_create')"
          :page-name="page_name"
          :module-name="module_name"
          :tabs-list="typeList"
          :fifter-open="false"
          @addAction="addPaper"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)" />
      </div>
      <div class="performance_table">
        <!-- <el-tabs v-model="searchInfo.mode" type="card" class="tabs_table" @tab-click="choseType">
          <el-tab-pane label="全部试卷" name="all"> -->
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}个记录，已选中{{ choseTotal }}条</span>
            <el-button v-if="btnPermission('performance_cancellations')" plain size="mini" @click="batchstop('remover')">批量作废</el-button>
          </div>
        </div>
        <el-table v-loading="loading" ref="multipleTable" :data="tableData" :max-height="tableHeight" border row-key="id" style="width: 100%" tooltip-effect="light" @sort-change="fifterTable" @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" /> -->
          <!-- <el-table-column prop="id" label="编号" /> -->
          <el-table-column  type="selection" min-width="40" fixed="left" align="center"/>
          <el-table-column prop="title" label="主题" show-overflow-tooltip min-width="200" >
            <template slot-scope="scope">
              <span class="text_color">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="accountName" label="创建人" min-width="100" />
          <el-table-column prop="startTime" label="开始时间" min-width="140"/>
          <el-table-column prop="endTime" label="结束时间" min-width="140"/>
          <el-table-column prop="createdDate" label="创建时间" min-width="140"/>
          <el-table-column v-if="tableData.length>0" label="操作" min-width="200" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('performance_edit')" type="text" size="small" @click="editexam(scope.row, 'edit')">编辑</el-button>
              <el-button v-if="btnPermission('performance_copy')" type="text" size="small" @click="editexam(scope.row, 'copy')">复制</el-button>
              <el-button v-if="btnPermission('performance_cancellation')" type="text" size="small" @click="changeStates(scope.row)">作废</el-button>
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
  getPerformanceInfo,
  banPerformance,
  performancebatchCancel,
  copyPerformance
} from '@/api/administration'
export default {
  name: 'Performances',
  data() {
    return {
      page_name: 'performance',
      module_name: 'ad',
      choseTotal: 0,
      typeList: [{
        label: '全部试卷',
        name: 'all'
      }],
      downloadUrl: '',
      loading: true,
      total: 20,
      uploadUrl: '',
      tableData: [],
      searchInfo: {
        mode: 'all', // 类型 全部 all 正常 normal 封禁 ban
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      tableHeight: 250,
      selectArr: []
    }
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  mounted() {
    // 页面第一个渲染的函数
    this.getList()
  },
  methods: {
    batchstop(type) {
      const that = this
      if (that.selectArr.length > 0) {
        const obj = {
          ids: this.selectArr.join(',')
        }
        this.$confirm('绩效一旦作废，不可以恢复哦,确定要批量“作废”吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          performancebatchCancel(obj).then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                type: 'success',
                message: res.data.message
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
      getPerformanceInfo(this.searchInfo).then(res => {
        if (res.code === 200 || res.code === '200') {
          this.loading = false
          that.tableData = res.data.performances
          that.total = res.data.pager.recTotal
        }
      })
    },
    editexam(event, type) {
      const that = this
      if (type === 'edit') {
        this.$router.push({
          path: '/administration/performanceIndex/performanceInfo?type=edit&id=' + event.id
        })
      } else if (type === 'copy') {
        copyPerformance(event.id).then(res => {
          if (res.code === '200' || res.code === 200) {
            const view = res.data.performance
            that.$message({
              type: 'success',
              message: '复制成功，跳转编辑'
            })
            this.$router.push({
              path: '/administration/performanceIndex/performanceInfo?type=edit&id=' + view.id
            })
          } else {
            that.$message({
              type: 'warning',
              message: res.data.message
            })
          }
        })
      }
    },
    changeStates(event) {
      const that = this
      const msg = '绩效考核试卷一旦作废不可恢复，确定要“作废”吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        banPerformance(event.id).then(res => {
          if (res.code === 200 || res.code === '200') {
            that.$message({
              type: 'success',
              message: res.data.message
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
    choseType() {
      this.searchInfo.pageID = 1
      this.tableData = []
      this.getList()
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
      padding: 20px 10px
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
