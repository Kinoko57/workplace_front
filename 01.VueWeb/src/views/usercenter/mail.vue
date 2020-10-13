<template>
  <div>
    <div class="mail_bg">
      <div class="fifter">
        <my-tabs
          :active-name="'all'"
          :page-name="page_name"
          :module-name="module_name"
          :tabs-list="tabsList"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)" />
          <!-- <search-fifter :fifter="true" :module-name="'message'" @search="fifterSearch"/> -->
      </div>
      <div class="mail_info">
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}条站内信，已选中{{ choseTotal }}条</span>
            <el-button size="mini" plain @click="delSelectAll()">批量删除</el-button>
          </div>
        </div>
        <el-table v-loading="loading" ref="multipleTable" :data="tableData" :max-height="tableHeight" row-key="id" border style="width: 100%" tooltip-effect="light" @selection-change="handleSelectionChange" @sort-change="fifterTable">
          <el-table-column type="selection" min-width="40" fixed="left" align="center"/>
          <el-table-column class="title" label="标题" prop="title" sortable="custom" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="内容" prop="content" sortable="custom" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="content_color">{{ scope.row.content }}</span>
            </template>
          </el-table-column>
          <el-table-column label="发布时间" prop="releaseDate" sortable="custom" min-width="120" show-overflow-tooltip/>
          <el-table-column label="状态" min-width="120" prop="readed" sortable="custom">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.readed=='1'" type="danger">未读</el-tag>
              <el-tag v-if="scope.row.readed=='2'" type="success">已读</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="findinfo(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="info_page">
          <el-pagination
            :current-page="searchInfo.pageID"
            :page-sizes="[5, 10, 15,20]"
            :page-size="searchInfo.recPerPage"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            aligin="center"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"/>
        </div>
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :title="modelTitle" :visible.sync="onShow" class="mail_dialog" @close="findmodel">
      <el-scrollbar class="fixed_scroll">
        <table class="view_dialog view_dialog_find" cellpadding="0" cellspacing="0">
          <tr class="view_line">
            <td class="line_title">标题：</td>
            <td class="second_line">{{ detailInfo.title }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">发布时间：</td>
            <td class="second_line">{{ detailInfo.releaseDate }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">内容：</td>
            <td class="second_line">{{ detailInfo.content }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">阅读数：</td>
            <td class="second_line">{{ detailInfo.readNum }}</td>
          </tr>
        </table>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>
<script>
import { getMailInfo, findMailInfo } from '@/api/usercontent'
import {
  getUnRead,
  delSelect
} from '@/api/public'
import store from '@/store/index'
export default {
  name: 'Mail',
  data() {
    return {
      page_name: 'message',
      module_name: 'sys',
      choseTotal: 0,
      tabsList: [{
        label: '全部站内信',
        name: 'all'
      }],
      loading: true,
      activeName2: 'first',
      onShow: false,
      labelPosition: 'right',
      modelTitle: '',
      tableData: [],
      detailInfo: {},
      selectArr: [],
      multipleSelection: [],
      tableHeight: 250,
      type: 1,
      total: 0,
      searchInfo: {
        mode: 'all', // 类型
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      }
    }
  },
  mounted() {
    this.getList()
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
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
    fifterTable(event) {
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
        console.log(event, 'bysearch')
        this.searchInfo.search = 'bySearch'
        this.tableData = []
        this.loading = true
        this.searchInfo.pageID = 1
        this.getList()
        this.type = 1
      } else {
        this.searchInfo.search = ''
        // this.getList()
      }
    },
    findinfo(event) {
      const that = this
      findMailInfo(event).then(res => {
        if (res.code === 200 || res.code === '200') {
          console.log(res.data.message)
          that.onShow = true
          that.detailInfo = res.data.message
          that.modelTitle = '查看'
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
    findmodel() {
      this.onShow = false
      this.loading = true
      this.tableData = []
      this.getList()
    },
    getList() {
      const that = this
      // 获取站内信列表
      getMailInfo(that.searchInfo).then(res => {
        that.loading = false
        if (res.code == 200) {
          console.log(res, '433')
          that.tableData = res.data.messages
          that.total = res.data.pager.recTotal
          console.log(that.tableData, 1)
          // that.searchInfo.recTotal = res.data.pager.recTotal// 总条数
        }
      })
      // 获取未读数量条数
      getUnRead().then(res => {
        if (res.code === 200) {
          const num = parseInt(res.data.unread)
          store.commit('SET_UNREADS', num)
        }
      })
    },
    toggleSelection(rows) {
      // console.log(rows)
      if (this.tableData.length === 0) {
        this.$message({
          message: '没有可选择的内容了',
          type: 'warning'
        })
        return
      }
      this.type = 2
      console.log(rows, this.$refs.multipleTable)
      rows.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row, true)
      })
    },
    setCurrent() {
      this.type = 1
      this.$refs.multipleTable.clearSelection()
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
    delSelectAll() {
      const that = this
      const selectId2 = {
        ids: this.selectArr.join(',')
      }
      if (this.selectArr.length == 0) {
        this.$message({
          message: '请选择要批量删除的站内信',
          type: 'warning'
        })
        return
      } else {
        that.$confirm('站内信一旦批量删除不可恢复，确定要“删除”吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delSelect(selectId2).then(res => {
            console.log(res, 11)
            if (res.code == 200) {
              that.$message({
                type: 'success',
                message: '操作成功'
              })
              that.getList()
              that.type = 1
              that.selectArr = []
              that.$refs.multipleTable.clearSelection()
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
      }
    }
  }
}
</script>
<style lang="less">
 .mail_bg{
    position: absolute;
    width: 100%;
    top: 0;
    .mail_info{
     background: #fff;
     padding: 20px 10px;
    }
  //  background: #fff;
  //   padding: 0 10px;
    .editprofile_pagination{
       text-align: center;
       padding: 10px 0;
    }
    .el-tab-pane{
      .el-table_1_column_1{
        text-align: center;
      }
      .number_color{
        color: #409EFF;
      }
      .content_color{
        color: hsl(29, 94%, 46%);
      }
    }
 }
 .mail_dialog{
     .el-dialog{
       width: 570px;
     .el-form-item{
       margin-bottom: 0px;
       width: 500px;
        // .tit{
        //   font: 600 16px "";
        // }
        .publish{
          color: #409EFF;
        }
        .text_area{
            width: 400px;
            display: inline-block;
            // padding:0 10px;
        }
        .second_line{
          color: #000;
        }
      }
     }
      span {
        font-family: '微软雅黑 Regular', '微软雅黑';
        font-weight: 400;
        width: 460px;
      }

    .title{
      padding: 20px 20px 10px;
      span{
        font-size: 16px;
        color:#000;
      }
    }
 }

</style>
