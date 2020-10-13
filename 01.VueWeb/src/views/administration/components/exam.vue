<template>
  <div>
    <div class="exam_bg">
      <div class="fifter">
        <!-- <search-fifter
          :add="btnPermission('dailypaper_create')"
          :module-name="'dailypaper'"
          :fifter="true"
          :delay-fifter="loading==false"
          :download-url="downloadUrl"
          :upload-url="uploadUrl"
          :add-text="'创建试卷'"
          @addAction="addexam"
          @search="fifterSearch" /> -->
        <my-tabs
          :active-name="'all'"
          :add="btnPermission('dailypaper_create')"
          :page-name="page_name"
          :module-name="module_name"
          :tabs-list="typeList"
          @addAction="addexam"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)" />
      </div>
      <div class="exam_table">
        <!-- <el-tabs v-model="searchInfo.mode" type="card" class="tabs_table" @tab-click="choseType">
          <el-tab-pane label="全部试卷" name="all"> -->
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}个记录，已选中{{ choseTotal }}条</span>
            <el-button v-if="btnPermission('dailypaper_cancellations')" plain size="mini" @click="batchstop('remover')">批量作废</el-button>
          </div>
        </div>
        <el-table v-loading="loading" ref="table" :data="tableData" :max-height="tableHeight" border row-key="id" style="width: 100%" tooltip-effect="light" @selection-change="handleSelectionChange" @sort-change="fifterTable">
          <!-- <el-table-column type="selection" /> -->
          <el-table-column type="selection" min-width="40" fixed="left" align="center"/>
          <!-- <el-table-column prop="id" label="编号" /> -->
          <el-table-column prop="title" label="主题" show-overflow-tooltip min-width="200" >
            <template slot-scope="scope">
              <span class="text_color">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createdBy" label="创建人" min-width="100"/>
          <el-table-column prop="startTime" label="开始时间" min-width="150" />
          <el-table-column prop="endTime" label="结束时间" min-width="150" />
          <el-table-column prop="createdDate" label="创建时间" min-width="150"/>
          <el-table-column prop="isPublish" label="状态" min-width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isPublish==0" type="info">未发布</el-tag>
              <el-tag v-if="scope.row.isPublish==1">已发布</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="tableData.length>0" label="操作" min-width="200" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('dailypaper_edit')" :disabled="scope.row.isPublish==1" type="text" size="small" @click="editexam(scope.row, 'edit')">编辑</el-button>
              <el-button v-if="btnPermission('dailypaper_copy')" type="text" size="small" @click="editexam(scope.row, 'copy')">复制</el-button>
              <el-button v-if="btnPermission('dailypaper_publish')" :disabled="scope.row.isPublish==1" type="text" size="small" @click="changeStates(scope.row, 'release')">发布</el-button>
              <el-button v-if="btnPermission('dailypaper_cancellation')" :disabled="scope.row.isPublish==1" type="text" size="small" @click="changeStates(scope.row,'ban')">作废</el-button>
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
  getExamInfo,
  banExam,
  releaseExam,
  examIndexbatchCancel,
  copyExam
} from '@/api/administration'
export default {
  name: 'Exam',
  data() {
    return {
      typeList: [
        { label: '全部试卷', name: 'all' }
      ],
      page_name: 'dailypaper',
      module_name: 'ad',
      choseTotal: 0,
      modelShow: false,
      downloadUrl: '',
      uploadUrl: '',
      modelTitle: '',
      tableData: [],
      loading: true,
      examList: [],
      searchInfo: {
        mode: 'all', // 类型 全部 all 正常 normal 封禁 ban
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      tableHeight: 250,
      total: 10, // 总条数
      selectArr: [],
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
    this.getList()
  },
  methods: {
    batchstop(type) {
      const that = this
      console.log('askldjslkdf', that.selectArr.length)
      if (that.selectArr.length > 0) {
        const obj = {
          ids: this.selectArr.join(',')
        }
        this.$confirm('试卷一旦作废，不可以恢复哦，确定要批量“作废”吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          examIndexbatchCancel(obj).then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                type: 'success',
                message: res.data.message
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
    // 方法
    getList() {
      const that = this
      getExamInfo(this.searchInfo).then(res => {
        if (res.code === 200 || res.code === '200') {
          this.loading = false
          that.tableData = res.data.dailyPapers
          that.total = res.data.pager.recTotal
        }
      })
    },
    editexam(event, type) {
      const that = this
      if (type === 'edit') {
        this.$router.push({
          path: '/administration/examIndex/examInfo?type=edit&id=' + event.id
        })
      } else if (type === 'copy') {
        copyExam(event.id).then(res => {
          if (res.code === '200' || res.code === 200) {
            const view = res.data.dailypaper
            that.$message({
              type: 'success',
              message: '复制成功，跳转编辑'
            })
            that.$router.push({
              path: '/administration/examIndex/examInfo?type=copy&id=' + view.id
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
    addexam() {
      this.$router.push({
        path: '/administration/examIndex/examInfo?type=new&id='
      })
    },
    changeStates(event, type) {
      let msg = ''
      if (type === 'ban') {
        msg = '日常考试试卷一旦作废不可恢复，确定要“作废”吗？'
      } else {
        msg = '日常考试试卷一旦发布不可编辑和作废，确定要“发布”吗？'
      }
      const that = this
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type === 'ban') {
          banExam(event.id).then(res => {
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
        } else {
          releaseExam(event.id).then(res => {
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
        }
      }).catch(() => {
        console.log('用户点击了取消')
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
      this.searchInfo.pageID = 1
      this.searchInfo.mode = value
      this.tableData = []
      this.loading = true
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
    // .text_color {
    //   color: #409EFF;
    // }

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
