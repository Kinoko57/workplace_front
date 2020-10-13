<template >
  <div>
    <div class="intent_bg">
      <!-- <my-alert title="警告：你的经销商<a style='text-decoration: underline; cursor: pointer;font-weight: 700;'>O-20180005</a>有已经有29天没有跟进了，请尽快跟进联系，否则该经销商将直接进入公海。" @warning_close="close"/> -->
      <div class="fifter">
        <my-tabs
          :page-name="page_name"
          :module-name="module_name"
          :module-type="'2'"
          :active-name="searchInfo.mode"
          :tabs-list="tabsList"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)"/>
          <!-- <search-fifter :fifter="true" :export-show="btnPermission('agent_grantwelfare')" :export-type="moduleType" :module-name="'agent'" :export-name="'流失经销商'" @search="fifterSearch"/> -->
      </div>
      <div class="intent_info">
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}个经销商，已选中{{ choseTotal }}条</span>
            <el-button plain size="mini">加入黑名单</el-button>
          </div>
          <div class="export_btn">
            <search-fifter :export-show="btnPermission('agent_grantwelfare')" :export-type="moduleType" :module-name="'agent'" :export-name="'流失经销商'"/>
          </div>
        </div>
        <el-table
          v-loading="loading"
          :data="tableData"
          :max-height="tableHeight"
          border
          row-key="id"
          @sort-change="fifterTable"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" min-width="40" fixed="left" align="center"/>
          <el-table-column prop="business_name" label="经销商名称" min-width="120" show-overflow-tooltip/>
          <el-table-column prop="name" label="姓名" min-width="200" >
            <template slot-scope="scope">
              <div style="display: inline-flex;">
                <span class="overline_one">{{ scope.row.name }}</span>
                <label-color v-if="scope.row.iconname!=''&&btnPermission('agent_isseeagentprox')" :color="scope.row.iconcolor" :text="scope.row.iconname"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号码" min-width="180" show-overflow-tooltip/>
          <el-table-column prop="wechat" label="微信号" min-width="120" show-overflow-tooltip/>
          <el-table-column prop="salesId" label="原所属销售" min-width="120px" show-overflow-tooltip/>
          <el-table-column v-if="btnPermission('agent_isseeagentleavel')" prop="levleId" label="原经销商等级" min-width="120" show-overflow-tooltip/>
          <el-table-column v-if="!btnPermission('agent_isseeagentleavel')" label="原经销商等级" min-width="120">
            <template>
              <span>****</span>
            </template>
          </el-table-column>
          <el-table-column prop="editedDate" label="流失时间" sortable="custom" min-width="150" show-overflow-tooltip/>
          <el-table-column label="操作" width="200" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('agent_resale')" type="text" size="small" @click="showModel(scope.row,'resale')">二次销售</el-button>
              <!-- <el-button type="text" sze="small" @click="goFllow(scope.row)">领取</el-button> -->
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
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="modelShow" :title="modelTitle" class="dialogModel" @close="resetModel" >
      <!-- 二次销售 -->
      <el-scrollbar class="fixed_scroll">
        <el-form
          v-if="modelType=='resale'&&modelShow"
          ref="resaleForm"
          :model="resaleForm"
          :rules="resalerules"
          class="modelForm"
          label-width="100px"
          label-position="right">
          <el-form-item label="原归属人：">
            <el-input v-model="resaleForm.oldsald" autocomplete="off" disabled="disabled" style="width:500px" />
          </el-form-item>
          <el-form-item label="指派：" prop="salesId">
            <el-select v-model="resaleForm.salesId" placeholder="请选择指派对象" style="width:500px">
              <el-option v-for="(item,index) in selectList" :label="item.label" :value="item.value" :key="index"/>
            </el-select>
          </el-form-item>
          <el-form-item label="指派原因：" prop="remarks">
            <el-input :rows="4" v-model="resaleForm.remarks" type="textarea" style="width:500px" placeholder="请输人内容,最大长度为120个字" />
          </el-form-item>
        </el-form>
      </el-scrollbar>

      <div slot="footer" class="dialog-footer">
        <el-button :loading="submitting" @click="restForm">重 置</el-button>
        <el-button type="primary" @click="saveModel">保 存</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import {
  getLoseagent,
  LoseAgentResale,
  getReSaleAppointLabel,
  saveReSaleAppoint
} from '@/api/agent'
export default {
  name: 'Loss',
  data() {
    return {
      assignId: '',
      moduleType: '/agent/agent-export-loseagent',
      activeName2: 'first',
      tableData: [],
      currentPage4: 1,
      isShow: true,
      modelType: '',
      modelShow: false,
      modelTitle: '',
      selectList: [],
      page_name: 'agent',
      module_name: 'agent',
      choseTotal: 0,
      tabsList: [
        { label: '全部经销商', name: 'all' }
      ],
      resaleForm: {
        oldsald: '',
        salesId: '',
        remarks: ''
      },
      searchInfo: {
        type: 'agent',
        mode: 'all', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      total: 0,
      loading: true,
      tableHeight: 250,
      resalerules: {
        salesId: [{
          required: true,
          message: '指派人不能为空',
          trigger: 'change'
        }],
        remarks: [{
          required: true,
          message: '指派原因不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '指派原因长度超出范围1-120位之间', trigger: 'blur' }]
      },
      submitting: false
    }
  },
  mounted() {
    //  this.uploadUrl = process.env.BASE_API + 'agent/agent-import-agentbusiness.json'
    // 获取列表
    this.getList()
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
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
    restForm() {
      this.$refs['resaleForm'].resetFields()
      // this.resaleForm = {
      //   oldsald: '',
      //   salesId: '',
      //   remarks: ''
      // }
      this.resaleForm.salesId = ''
      this.resaleForm.remarks = ''
    },
    getList() {
      const that = this
      getLoseagent(this.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200 || res.code === '200') {
          that.tableData = res.data.agent
          that.total = res.data.pager.recTotal // 总条数
        }
      })
    },
    close() {
      console.log(1)
    },
    resetModel() {
      console.log('重置表单')
      this.$refs['resaleForm'].resetFields()
      this.resaleForm.salesId = ''
      this.resaleForm.remarks = ''
      this.modelShow = false
      this.submitting = false
    },
    saveModel(data, type) {
      const that = this
      if (this.modelType === 'resale') {
        // 指派
        this.$refs['resaleForm'].validate((valid) => {
          console.log(this.resaleForm)
          if (valid) {
            console.log(that.resaleForm)
            that.submitting = true
            saveReSaleAppoint(that.assignId, that.resaleForm).then(res => {
              console.log(res)
              that.submitting = false
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '操作成功！',
                  type: 'success'
                })
                that.$refs['resaleForm'].resetFields()
                that.modelShow = false
                that.getList()
              } else {
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
          } else {
            console.log('error submit!!')
            // this.$message.warning('信息填写不完整或者信息填写有误！')
            this.$nextTick(() => {
              this.checkFormErr()
            })
            return false
          }
        })
      }
    },
    showModel(data, type) {
      const that = this
      this.modelType = type
      this.modelShow = true
      this.assignId = data.id
      if (type === 'resale') {
        // this.modelTitle = '二次销售'
        this.modelTitle = '二次销售'
        getReSaleAppointLabel(data.id).then(res => {
          // console.log(res)
          if (res.code === 200) {
            that.resaleForm.oldsald = res.data.agentInfo
            that.selectList = res.data.selectList
          }
        })
      }
    },
    fifterTable(event) {
      console.log(event.prop)
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
    viewInfo(data) {
      const that = this
      this.$confirm('确定此操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        LoseAgentResale(data.id).then(res => {
          if (res.code === 200 || res.code === '200') {
            that.$message({
              message: '操作成功',
              type: 'success'
            })
            that.getList()
          } else {
            that.$message({
              message: '操作失败',
              type: 'warning'
            })
          }
        })
      })
    },

    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    handleChange(value) {
      console.log(value)
    }
  }
}
</script>
<style lang="less" scoped>
.intent_bg{
    padding: 10px;
    position: absolute;
    width: 100%;
    top: 0;
    // .search_btn {
    //   display: flex;
    //   align-items: center;
    //   justify-content: space-between;
    // }

    .intent_info {
      padding: 20px 10px;
      background: #fff;
    }

    .intent_page {
      text-align: center;
      padding: 10px 0;
    }
}
.dialogModel{
    .modelForm {
      margin: 0 10px;
    }
    .center{
      margin:0 70px;
    }
}
.overline_one{
  margin-right:5px;
}
</style>

