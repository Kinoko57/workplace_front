<template>
  <div>
    <div class="daily_bg">
      <div class="fifter">
        <search-fifter :add="btnPermission('daily_create')" :module-name="'daily'" :fifter="true" :add-text="'创建日报'" @addAction="addReport" @search="fifterSearch" />
      </div>
      <div class="daily_info">
        <el-tabs v-model="searchInfo.mode" type="card" class="tabs_table" @tab-click="choseType">
          <el-tab-pane v-for="(item,index) in typeList" :key="index" :label="item.text" :name="item.name">
            <el-table v-loading="loading" ref="table" :data="tableData" :max-height="tableHeight" style="width: 100%" tooltip-effect="light" @sort-change="fifterTable">
              <!-- <el-table-column type="selection" width="55" /> -->
              <el-table-column width="20" />
              <el-table-column prop="accountName" label="员工" />
              <el-table-column prop="organizeName" label="所属部门" min-width="150" >
                <template slot-scope="scope">
                  <!-- <span v-if="scope.row.organizeId==0">顶级部门</span> -->
                  <span>{{ scope.row.organizeName }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="startDate" label="日期" min-width="150"/>
              <el-table-column prop="content" label="日报内容" min-width="220" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{ scope.row.content }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" min-width="100">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.status==1">待审阅</el-tag>
                  <el-tag v-if="scope.row.status==2" type="success">已审阅</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                  <el-button v-if="btnPermission('daily_view')" type="text" size="small" @click="showModel(scope.row,'view')">查看</el-button>
                  <el-button v-if="btnPermission('daily_edit') && searchInfo.mode=='my'" :disabled="scope.row.status==2||scope.row.disabled==0" type="text" size="small" @click="showModel(scope.row,'edit')">编辑</el-button>
                  <el-button v-if="btnPermission('daily_review') && searchInfo.mode!=='my'" :disabled="scope.row.status==2||scope.row.isHidden==1" type="text" size="small" @click="showModel(scope.row,'approval')">审阅</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
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
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="modelShow" :title="modelTitle" width="600px" class="dialogModel" @close="resetModel">
      <!-- 新建/编辑日报 -->
      <el-form
        v-if="(modelType=='new'||modelType=='edit')&&modelShow"
        ref="dailyForm"
        :model="dailyForm"
        :rules="rules"
        class="modelForm"
        label-width="100px"
        label-position="right">
        <el-form-item label="时间：" prop="startDate">
          <el-date-picker
            v-model="dailyForm.startDate"
            :picker-options="dataChange"
            type="date"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd"
            style="width:400px"
            readonly/>
        </el-form-item>
        <el-form-item label="事由：" prop="content">
          <el-input v-model.trim="dailyForm.content" :rows="5" type="textarea" style="width:400px" placeholder="请输入日报内容,最大长度为500个字" />
        </el-form-item>
      </el-form>
      <div v-if="modelType=='view'&&modelShow" class="view_daily">
        <div class="view_line">
          <span class="line_title">员工：</span>
          <span class="small_font">{{ viewForm.accountName }}</span>
        </div>
        <div class="view_line">
          <span class="line_title">所属部门：</span>
          <span class="small_font">{{ viewForm.organizeName }}</span>
        </div>
        <div class="view_line">
          <span class="line_title">时间：</span>
          <span class="small_font">{{ viewForm.startDate }}</span>
        </div>
        <div class="view_line">
          <span class="line_title">内容：</span>
          <span class="small_font" style="line-height: 20px">{{ viewForm.content }}</span>
        </div>
        <template v-if="viewForm.status == 2">
          <div class="view_line" style="margin-top:10px;">
            <span class="line_title">审批人：</span>
            <span class="small_font">{{ viewForm.checkAccount }}</span>
          </div>
          <div class="view_line">
            <span class="line_title">审阅时间：</span>
            <span class="small_font">{{ viewForm.auditDate }}</span>
          </div>
          <div class="view_line">
            <span class="line_title">审阅结果：</span>
            <span v-if="viewForm.checkResult == 1" class="small_font">好</span>
            <span v-if="viewForm.checkResult == 2" class="small_font">一般</span>
            <span v-if="viewForm.checkResult == 3" class="small_font">差</span>
          </div>
          <div class="view_line">
            <span class="line_title">批注：</span>
            <span class="small_font">{{ viewForm.checkPostil }}</span>
          </div>
        </template>
      </div>
      <div v-if="modelType=='approval'&&modelShow" class="view_daily">
        <div class="view_line">
          <span class="line_title">员工：</span>
          <span class="small_font">{{ viewForm.accountName }}</span>
        </div>
        <div class="view_line">
          <span class="line_title">所属部门：</span>
          <span class="small_font">{{ viewForm.organizeName }}</span>
        </div>
        <div class="view_line">
          <span class="line_title">时间：</span>
          <span class="small_font">{{ viewForm.startDate }}</span>
        </div>
        <div class="view_line">
          <span class="line_title">内容：</span>
          <span class="small_font" style="line-height: 20px">{{ viewForm.content }}</span>
        </div>
        <div class="view_line" style="margin-top:10px;">
          <span class="line_title">审阅结果：</span>
          <el-radio-group v-model="approveForm.result">
            <el-radio :label="1">好</el-radio>
            <el-radio :label="2">一般</el-radio>
            <el-radio :label="3">差</el-radio>
          </el-radio-group>
        </div>
        <div class="view_line" style="margin-top:10px;">
          <span class="line_title">批注：</span>
          <el-input v-model="approveForm.postil" :rows="2" type="textarea" style="width:300px" placeholder="请输入批注内容" />
        </div>
      </div>
      <div v-if="modelType=='new'||modelType=='edit'" slot="footer" class="dialog-footer">
        <el-button v-if="modelType=='new'" @click="resetForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">{{ sureBtn }}</el-button>
      </div>
      <div v-if="modelType=='approval'" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="approvalModel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  saveDaily,
  updateDaily,
  getDailyInfo,
  doApproveDaily
} from '@/api/office'
// import {
//   getDepList
// } from '@/api/system'
import {
  // eslint-disable-next-line no-unused-vars
  btnPermission
} from '@/permission.js' // 按钮权限和页面权限
export default {
  name: 'DailyManage',
  data() {
    return {
      dataChange: {},
      typeList: [],
      approveForm: {
        id: 0,
        result: 1,
        postil: ''
      },
      uploadUrl: '',
      inputName: '不选则通知整个集团',
      tableData: [],
      loading: true,
      modelType: '',
      modelTitle: '',
      modelShow: false,
      sureBtn: '确 定',
      showDate: new Date(),
      dailyForm: {
        startDate: '',
        content: ''
      },
      viewForm: {},
      rules: {
        startDate: [{
          required: true,
          message: '日报时间不能为空',
          trigger: 'change'
        }],
        content: [{
          required: true,
          message: '日报内容不能为空',
          trigger: 'change'
        }, { min: 1, max: 500, message: '日报内容长度超出范围1-120位之间', trigger: 'blur' }]
      },
      searchInfo: {
        mode: 'all', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      submitting: false,
      tableHeight: 250,
      total: 0 // 总条数
    }
  },
  mounted() {
    if (this.btnPermission('daily_all') === false) {
      this.typeList = [{
        text: '待我审批',
        name: 'wait'
      },
      {
        text: '我的日报',
        name: 'my'
      }]
      this.searchInfo.mode = 'wait'
    } else {
      this.typeList = [{
        text: '全部日报',
        name: 'all'
      },
      {
        text: '待我审批',
        name: 'wait'
      },
      {
        text: '我的日报',
        name: 'my'
      }]
      this.searchInfo.mode = 'all'
    }
    this.uploadUrl = process.env.BASE_API + 'sys/file-upload'
    // 获取列表
    this.getList()
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  methods: {
    getList() {
      const that = this
      getDailyInfo(this.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          that.tableData = res.data.dailys
          that.total = res.data.pager.recTotal // 总条数
        }
      })
    },
    choseType() {
      console.log(this.searchInfo.mode)
      this.searchInfo.pageID = 1
      if ((this.$refs.table) !== undefined) {
        this.resetTable()
      }
      this.tableData = []
      this.loading = true
      this.getList()
    },
    resetTable() {
      for (let i = 0; i < (this.$refs.table).length; i++) {
        (this.$refs.table)[i].clearSort()
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
    addReport() {
      this.dailyForm.startDate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1) + '-' + (new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate())
      this.modelTitle = '创建日报'
      this.modelType = 'new'
      this.modelShow = true
      this.sureBtn = '保 存'
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
    showModel(data, type) {
      console.log(data, 'sgfdsagfdhg')
      if (type === 'view') {
        this.modelTitle = '查看'
        // 根据id查询后台接口获取查看的详细内容
        this.viewForm = data
        this.sureBtn = '保 存'
      } else if (type === 'edit') {
        this.modelTitle = '编辑'
        this.dailyForm = {
          'id': data.id,
          'startDate': data.startDate,
          'content': data.content
        }
        this.sureBtn = '保 存'
      } else {
        this.modelTitle = '审阅日报'
        this.viewForm = data
        this.approveForm.id = data.id
        this.sureBtn = '审 阅'
      }
      this.modelType = type
      this.modelShow = true
    },

    saveModel() {
      const that = this
      this.$refs['dailyForm'].validate((valid) => {
        if (valid) {
          this.submitting = true
          if (this.modelType === 'new') {
            console.log(this.dailyForm)
            // 新增日报
            saveDaily(this.dailyForm).then(res => {
              that.submitting = false
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '日报添加成功！',
                  type: 'success'
                })
                that.resetModel()
                that.loading = true
                that.getList()
              } else {
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
          } else {
            // 更新日报
            updateDaily(this.dailyForm).then(res => {
              console.log(res)
              that.submitting = false
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '日报更新成功！',
                  type: 'success'
                })
                that.resetModel()
                that.loading = true
                that.getList()
              } else {
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
          }
        } else {
          console.log('error submit!!')
          //   // this.$message.warning('信息填写不完整或者信息填写有误！')
          // this.$nextTick(() => {
          //   this.checkFormErr()
          // })
          return false
        }
      })
    },
    approvalModel() {
      const that = this
      // 审批日报
      doApproveDaily(this.approveForm).then(res => {
        if (res.code === 200 || res.code === '200') {
          that.$message({
            message: '日报审批成功！',
            type: 'success'
          })
          that.resetModel()
          that.loading = true
          that.getList()
        } else {
          that.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
      this.modelShow = false
    },
    resetModel() {
      if (this.modelType === 'new' || this.modelType === 'edit') {
        console.log('重置表单')
        this.$refs['dailyForm'].resetFields()
        this.dailyForm = {}
      // eslint-disable-next-line no-empty
      } else if (this.modelType === 'approval') {

      }
      this.modelShow = false
    },
    resetForm() {
      if (this.modelType === 'new' || this.modelType === 'edit') {
        console.log('重置表单')
        this.$refs['dailyForm'].resetFields()
        this.dailyForm = {}
        this.dailyForm.startDate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1) + '-' + (new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate())
      // eslint-disable-next-line no-empty
      } else if (this.modelType === 'approval') {

      }
    }
  }
}

</script>
<style lang="less" scoped>
  .daily_bg {
    background: #fff;
    padding: 10px;
    position: absolute;
    width: 100%;
    top: 0;
    // .search_btn {
    //   display: flex;
    //   align-items: center;
    //   justify-content: space-between;
    // }

    .daily_info {
      margin: 10px 0;

      .tabs_table {
        .over_line_one {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap
        }

        .over_line_two {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }

    .daily_page {
      text-align: center;
      padding: 10px 0;
    }
  }

  .dialogModel {
    .modelForm {
      margin: 0 10px;

      .checkDep {
        position: relative;

        .red_star {
          position: absolute;
          left: -90px;
          font-size: 13px;
          font-family: 'Arial Normal', 'Arial';
          color: #f56c6c;
        }
      }

      .fifter_down {
        position: relative;

        .chose_dep {
          background: transparent;
          // border-color: #c0c4cc;
          // border-radius: 4px;
          // border: 1px solid #dcdfe6;
          // height: 36px;
          // line-height: 36px;
          // display: flex;
          // align-items: center;
          // justify-content: space-between;
          // padding: 0 10px;
        }

        .tag_list {
          position: absolute;
          top: 0;
          left: 5px;
          width: 310px;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          height: 36px;
          line-height: 36px;

          span {
            margin-right: 5px;
          }
        }
      }

      .scroll_tree {
        .fifter_input {
          width: 400px;
          padding-top: 5px;
          padding-left: 5px;
          padding-bottom: 5px;
        }
      }
    }

    .view_daily {
      .view_line {
        overflow: hidden;
        padding: 10px 0;

        span {
          font-family: '微软雅黑 Regular', '微软雅黑';
          font-weight: 400;
          font-size: 14px;
          color: #999999;
          float: left;
          width: 460px;
        }

        .line_title {
          font-weight: 400;
          color: #666666;
          width: 80px;
          text-align: right;
        }

        .first_line {
          font-weight: 700;
          font-size: 16px;
          color: #999999;
        }

        .second_line {
          color: #000000;
        }

        .small_font {
          font-size: 12px;
          padding-left: 10px;
        }
      }
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
