<template>
  <div>
    <div class="member_bg">
      <div class="fifter">
        <!-- <search-fifter :fifter="true" :module-name="'cradlegroupdmlist'" @search="fifterSearch"/> -->
        <my-tabs
          :page-name="page_name"
          :module-name="module_name"
          :active-name="searchInfo.mode"
          :tabs-list="typeList"
          :fifter-open="isOpen"
          @handleClick="choseType"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)"/>
      </div>
      <div class="member_info">
        <!-- <el-tabs type="card" class="tabs_table" >
          <el-tab-pane label="全部批次" > -->
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}个记录</span>
          </div>
        </div>
        <el-table v-loading="loading" v-if="searchInfo.mode=='all'" ref="tabel" :data="tableData" :max-height="tableHeight" border row-key="id" style="width: 100%" tooltip-effect="light" @sort-change="fifterTable">
          <!-- <el-table-column  type="selection" min-width="40" fixed="left" align="center"/> -->
          <el-table-column label="批次名称" prop="batch" min-width="120" show-overflow-tooltip align="center"/>
          <el-table-column label="群人员" prop="number" min-width="120" />
          <el-table-column label="创建时间" prop="createdDate" min-width="120" show-overflow-tooltip/>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('cradlegroupdmmember_browse')" type="text" size="small" @click="showMemberList(scope.row)">成员管理</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          v-loading="loading"
          v-if="searchInfo.mode=='member'"
          :max-height="tableHeight"
          :data="tableData"
          border
          row-key="id"
          tooltip-effect="light">
          <el-table-column label="编号" min-width="100" >
            <template slot-scope="scope">
              <span class="text_color">{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="授权号" prop="auth_code" min-width="120"/>
          <el-table-column prop="name" label="姓名" min-width="200" >
            <template slot-scope="scope">
              <div style="display: inline-flex;">
                <span class="overline_one" style="margin-right:6px">{{ scope.row.name }}</span>
                <label-color v-if="scope.row.iconname!=''" :color="scope.row.iconcolor" :text="scope.row.iconname"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="联系电话" prop="phone" min-width="120"/>
          <el-table-column label="群员等级" prop="leavelname" min-width="100"/>
          <el-table-column label="摇篮群" prop="groupName" min-width="140"/>
          <el-table-column label="摇篮群（批次）" prop="groupListName" min-width="140"/>
          <el-table-column prop="createdDate" label="创建时间" min-width="140"/>
          <el-table-column label="类型" prop="typeName" min-width="100"/>
          <!-- <el-table-column v-if="tableData.length>0" label="操作" min-width="140" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('cradlegroupmember_edit')" type="text" size="small" @click="editMember(scope.row)">修改等级</el-button>
              <el-button v-if="btnPermission('cradlegroupmember_updatestatus')" type="text" size="small" @click="changeStates(scope.row,'99')">移除</el-button>
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
  getcradlegrouplist, getcradlegroupmemberByNew
} from '@/api/excellentAgent'
import {
  // eslint-disable-next-line no-unused-vars
  btnPermission
} from '@/permission.js' // 按钮权限和页面权限
export default {
  name: 'MemberManage',
  data() {
    return {
      page_name: 'cradlegroupdmlist',
      module_name: 'olsdm',
      typeList: [{ label: '全部批次', name: 'all' }, { label: '群员列表', name: 'member' }],
      isOpen: false,
      loading: false,
      tableData: [],
      searchInfo: {
        mode: 'all', // 类型
        search: '', // 搜索关键字
        orderBy: 'id_desc', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      total: 0, // 总条数
      modelShow: false,
      modelTitle: '',
      tableHeight: 250
    }
  },
  mounted() {
    console.log(this.btnPermission('cradlegroupdmmember_getmember'))
    if (this.btnPermission('cradlegroupdmmember_getmember') == false) {
      this.typeList = [{
        label: '全部批次',
        name: 'all'
      }]
      this.searchInfo.mode = 'all'
    } else if (this.btnPermission('cradlegroupdmmember_getmember') == true) {
      this.typeList = [{ label: '全部批次', name: 'all' }, { label: '群员列表', name: 'member' }]
      this.searchInfo.mode = 'all'
    }
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
    getList() {
      const that = this
      if (that.searchInfo.mode == 'all') {
        getcradlegrouplist(that.searchInfo).then(res => {
          that.loading = false
          if (res.code === 200) {
          // console.log(res)
            that.tableData = res.data.cradlegroupdmlist
            that.total = res.data.pager.recTotal// 总条数
          }
        })
      } else {
        getcradlegroupmemberByNew(that.searchInfo).then(res => {
          that.loading = false
          if (res.code === 200) {
            that.tableData = res.data.member
            that.total = res.data.pager.recTotal// 总条数
          }
        })
      }
    },
    choseType(value) {
      this.searchInfo.pageID = 1
      this.tableData = []
      this.searchInfo.orderBy = ''
      this.searchInfo.mode = value
      if (this.searchInfo.mode == 'all') {
        this.module_name = 'olsdm'
        this.page_name = 'cradlegroupdmlist'
        this.isOpen = false
      } else {
        this.module_name = 'olsdm'
        this.page_name = 'cradlegroupdmmember'
        this.isOpen = true
      }
      this.loading = true
      this.getList()
    },
    showMemberList(data) {
      console.log(1)
      this.$router.push({
        path: '/excellentAgent/memberlist?id=' + data.id
      //   path: '/online/memberlist',
      //   name: 'MemberListManage',
      //   params: {
      //     id: data.id
      //   }
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
  .member_bg {
    position: absolute;
    width: 100%;
    top: 0;
    // background: #fff;
    // padding: 10px;
    .member_info{
      padding: 20px 10px;
      background: #fff;
      .text_color{
        color: #409EFF;
      }
    }
    .member_page {
      text-align: center;
      padding: 10px 0;
    }
  }
    .dialogModel {
    .modelForm {
      margin: 0 10px;
      .input_tips{
        font-size: 12px;
        color: #AEAEAE;
        font-family: '微软雅黑 Regular', '微软雅黑';
      }
    }
    .center{
      margin:0 70px;
    }
  }

</style>
