<template>
  <div>
    <div class="attend_bg">
      <div class="fifter">
        <search-fifter
          :fifter="true"
          :delay-fifter="loading==false"
          :module-name="moduleName"
          :import-show="btnPermission('attendance_import')&&searchInfo.mode=='all'"
          :export-show="btnPermission('attendance_export')&&searchInfo.mode=='all'"
          :download-url="downloadUrl"
          :upload-url="uploadUrl"
          :export-type="moduleType"
          :export-name="'考勤列表'"
          @search="fifterSearch"
          @importAction="importAttend" />
      </div>
      <div class="attend_info">
        <el-tabs v-model="searchInfo.mode" type="card" class="tabs_table" @tab-click="choseType">
          <el-tab-pane label="全部考勤" name="all">
            <el-table v-loading="loading" :data="tableData" :max-height="tableHeight" style="width: 100%" tooltip-effect="light" >
              <!-- <el-table-column type="selection" width="55" /> -->
              <el-table-column width="20" />
              <el-table-column prop="attendDate" label="日期" min-width="120" />
              <el-table-column prop="realName" label="员工" min-width="120" />
              <el-table-column prop="organizeName" label="所属部门" min-width="150" show-overflow-tooltip />
              <el-table-column prop="weeksName" label="星期" />
              <el-table-column prop="status" label="状态" min-width="150">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.status==1">正常</el-tag>
                  <el-tag v-if="scope.row.status==2" type="danger">迟到</el-tag>
                  <el-tag v-if="scope.row.status==3" type="danger">早退</el-tag>
                  <el-tag v-if="scope.row.status==4" type="danger">旷工</el-tag>
                  <el-tag v-if="scope.row.status==6" type="success">加班</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="firstTime" label="签到时间" min-width="120">
                <template slot-scope="scope">
                  <span class="text_color">{{ scope.row.firstTime }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="endTime" label="签退时间" min-width="120">
                <template slot-scope="scope">
                  <span class="text_color">{{ scope.row.endTime }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane v-if="btnPermission('overtime_browse')" label="核实加班" name="overtime">
            <el-table v-loading="loading" :data="tableData" :max-height="tableHeight" style="width: 100%" tooltip-effect="light" >
              <!-- <el-table-column type="selection" width="55" /> -->
              <el-table-column width="20" />
              <el-table-column prop="title" label="单据名称" min-width="150" show-overflow-tooltip />
              <el-table-column prop="organizeName" label="所属部门" min-width="120" show-overflow-tooltip />
              <el-table-column label="申请人（职位）" min-width="120" >
                <template slot-scope="scope">
                  <span>{{ scope.row.accountName }}({{ scope.row.groupName }})</span>
                </template>
              </el-table-column>
              <el-table-column prop="startDate" label="计划开始时间" min-width="120" show-overflow-tooltip/>
              <el-table-column prop="endDate" label="计划结束时间" min-width="120" show-overflow-tooltip/>
              <el-table-column prop="hours" label="计划加班时长" min-width="80" >
                <template slot-scope="scope">
                  <span>{{ scope.row.hours }}小时</span>
                </template>
              </el-table-column>
              <el-table-column prop="is_check_startDate" label="实际开始时间" min-width="120" show-overflow-tooltip/>
              <el-table-column prop="is_check_endDate" label="实际结束时间" min-width="120" show-overflow-tooltip/>
              <el-table-column prop="is_check_hours" label="实际加班时长" min-width="80" >
                <template slot-scope="scope">
                  <span v-if="scope.row.is_check_hours!=''">{{ scope.row.is_check_hours }}小时</span>
                </template>
              </el-table-column>
              <el-table-column prop="is_check_status" label="状态" min-width="80">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.is_check_status==1">未核实</el-tag>
                  <el-tag v-if="scope.row.is_check_status==2" type="success">已核实</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="操作" min-width="120" align="center">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.is_check_status==1&&btnPermission('overtime_overtimeedit')" type="text" size="small" @click="verifyinfo(scope.row)">核实</el-button>
                  <el-button v-if="scope.row.is_check_status==2&&btnPermission('overtime_overtimeedit')" type="text" size="small" @click="verifyinfo(scope.row)">调整</el-button>
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
      <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="modelShow" :title="modelTitle" width="800px" class="dialogModel" @close="closeModel">
        <!-- 加班审批单 -->
        <div v-if="modelShow" class="approval_form">
          <h1>加班申请单</h1>
          <div class="car_view">
            <p class="view_tips">
              <span>申请单号：{{ viewInfo.code }}</span>
              <span>申请时间：{{ viewInfo.createdDate }}</span>
            </p>
            <table class="view_table">
              <tr>
                <td class="td_title">申请单名称</td>
                <td>{{ viewInfo.title }}</td>
                <td class="td_title">申请人</td>
                <td>{{ viewInfo.accountName }}</td>
              </tr>
              <tr>
                <td class="td_title">申请人部门</td>
                <td>{{ viewInfo.organizeName }}</td>
                <td class="td_title">申请人岗位</td>
                <td>{{ viewInfo.groupName }}</td>
              </tr>
              <tr>
                <td class="td_title">加班类型</td>
                <td>{{ viewInfo.typeName }}</td>
                <td class="td_title">开始时间</td>
                <td>{{ viewInfo.startDate }}</td>
              </tr>
              <tr>
                <td class="td_title">结束时间</td>
                <td>{{ viewInfo.endDate }}</td>
                <td class="td_title">加班时长</td>
                <td>{{ viewInfo.hours }}小时</td>
              </tr>
              <tr>
                <td class="td_title">申请原因</td>
                <td colspan="3">{{ viewInfo.remark }}</td>
              </tr>
            </table>
            <div class="view_comments">
              <el-form
                ref="overtimeForm"
                :model="overtimeForm"
                :rules="overtimeRules"
                class="modelForm"
                label-width="130px"
                label-position="right">
                <el-form-item label="实际开始时间：" prop="startDate">
                  <el-date-picker
                    v-model="overday_start"
                    :clearable="false"
                    type="date"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    placeholder="开始日期"
                    style="width:140px"
                    @change="checkValueStart"/>
                  <el-time-picker
                    v-model="overtime_start"
                    :clearable="false"
                    format="HH:mm"
                    value-format="HH:mm"
                    placeholder="开始时间"
                    style="width:140px"
                    @change="checkValueStart"/>
                </el-form-item>
                <el-form-item label="实际结束时间：" prop="endDate">
                  <el-date-picker
                    v-model="overday_end"
                    :clearable="false"
                    type="date"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    placeholder="结束日期"
                    style="width:140px"
                    @change="checkValue"/>
                  <el-time-picker
                    v-model="overtime_end"
                    :clearable="false"
                    format="HH:mm"
                    value-format="HH:mm"
                    placeholder="结束时间"
                    style="width:140px"
                    @change="checkValue"/>
                </el-form-item>
                <el-form-item label="实际加班时长：" prop="hours">
                  <!-- :precision="1"  -->
                  <el-input-number v-model.trim="overtimeForm.hours" :min="0" :precision="1" :step="0.5" controls-position="right" style="width:140px"/>
                  <!-- <el-input v-model="overtimeForm.hours" type="number" style="width:100px" min="0" @blur="checkValue"/> -->
                  <span style="margin-left:10px">小时</span>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input v-model.trim="overtimeForm.remark" :rows="3" type="textarea" style="width:400px" placeholder="请输入备注,最大长度为120个字" />
                </el-form-item>
              </el-form>
            </div>
            <div class="view_btn">
              <!-- @click="sureSave('overtimeForm')" -->
              <el-button @click="resetModel">重 置</el-button>
              <el-button :loading="submitting" type="primary" @click="saveVerify">保存</el-button>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getAttendanceInfo,
  getoverTimeInfo,
  verifyOverTime,
  calcTime // 计算请假加班时长
} from '@/api/office'
export default {
  name: 'AttendanceManage',
  data() {
    return {
      moduleName: 'attendance',
      moduleType: '/oa/attendance-export',
      uploadUrl: '',
      downloadUrl: '',
      tableData: [],
      loading: true,
      modelShow: false,
      modelTitle: '核实',
      submitting: false,
      viewInfo: {},
      overtimeForm: {
        type: '',
        startDate: '',
        endDate: '',
        hours: '',
        remark: ''
      },
      overday_start: '',
      overtime_start: '',
      overday_end: '',
      overtime_end: '',
      max_date: '',
      min_date: '',
      max_hours: '',
      overtimeRules: {
        startDate: [{
          required: true,
          message: '实际开始时间不能为空',
          trigger: 'change'
        }],
        endDate: [{
          required: true,
          message: '实际结束时间不能为空',
          trigger: 'change'
        }],
        hours: [{
          required: true,
          message: '实际加班时长不能为空',
          trigger: 'change'
        }],
        remark: [{
          required: true,
          message: '备注不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '备注长度超出范围1-120位之间', trigger: 'blur' }]
      },
      pickerOptions: {
        disabledDate(time) {
          console.log(time.getTime())
          return time.getTime() < Date.now()
        }
      },
      searchInfo: {
        mode: 'all', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      tableHeight: 250,
      total: 0 // 总条数
    }
  },
  mounted() {
    this.uploadUrl = process.env.BASE_API + 'oa/attendance-import.json'
    this.downloadUrl = process.env.BASE_API + 'oa/attendance-phpexcelexport'
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
      if (this.searchInfo.mode === 'all') {
        getAttendanceInfo(this.searchInfo).then(res => {
          that.loading = false
          that.submitting = false
          if (res.code === 200) {
            that.tableData = res.data.attendances
            that.total = res.data.pager.recTotal // 总条数
          }
        })
      } else {
        getoverTimeInfo(this.searchInfo).then(res => {
          that.loading = false
          that.submitting = false
          if (res.code === 200) {
            that.tableData = res.data.leaves
            that.total = res.data.pager.recTotal // 总条数
          }
        })
      }
    },
    choseType() {
      this.searchInfo.pageID = 1
      this.tableData = []
      this.searchInfo.orderBy = ''
      if (this.searchInfo.mode === 'all') {
        this.moduleName = 'attendance'
      } else {
        this.moduleName = 'overtime'
      }
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
    verifyinfo(data) {
      const that = this
      that.viewInfo = { ...data }
      that.max_date = data.endDate
      that.min_date = data.startDate
      that.max_hours = data.hours
      that.modelShow = true
      this.overtimeForm = {
        type: '',
        startDate: '',
        endDate: '',
        hours: '',
        remark: ''
      }
      this.overday_start = ''
      this.overtime_start = ''
      this.overday_end = ''
      this.overtime_end = ''
      if (data.is_check_status === '2') {
        this.overtimeForm = {
          id: data.id,
          startDate: data.is_check_startDate,
          endDate: data.is_check_endDate,
          hours: data.is_check_hours,
          remark: data.is_check_remarks
        }
        var over_start = data.is_check_startDate.split(' ')
        this.overday_start = over_start[0]
        this.overtime_start = over_start[1]
        var over_end = data.is_check_endDate.split(' ')
        this.overday_end = over_end[0]
        this.overtime_end = over_end[1]
      }
    },
    saveVerify() {
      var flag = true
      var overhour_str = parseFloat(this.overtimeForm.hours).toFixed(1) + ''
      if (overhour_str[overhour_str.length - 1] !== '0' && overhour_str[overhour_str.length - 1] !== '5') {
        this.$message({
          message: '加班时长只能是.5或整数',
          type: 'warning'
        })
        flag = false
      }
      if (this.overtimeForm.hours > 10) {
        this.$message({
          message: '加班时长最多10小时',
          type: 'warning'
        })
        flag = false
      }
      console.log(this.overtimeForm)
      this.$refs['overtimeForm'].validate(valid => {
        if (valid) {
          const info = {
            id: this.viewInfo.id,
            is_check_startDate: this.overtimeForm.startDate,
            is_check_endDate: this.overtimeForm.endDate,
            is_check_hours: this.overtimeForm.hours,
            is_check_remarks: this.overtimeForm.remark
          }
          console.log(info)
          if (flag) {
            this.submitting = true
            const that = this
            verifyOverTime(info).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '加班单核实成功！',
                  type: 'success'
                })
                that.closeModel()
                that.loading = true
                that.getList()
              } else {
                that.submitting = false
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
          }
        } else {
          console.log('error submit!!')
          // this.$message.warning('信息填写不完整或者信息填写有误！')
          this.$nextTick(() => {
            this.checkFormErr()
          })
          return false
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
    importAttend() {
      if (event) {
        this.getList()
      }
    },
    checkValueStart() {
      const that = this
      // 核实加班
      if (this.overday_start !== '' && this.overtime_start === '') {
        this.overtime_start = '09:00:00'
      }
      this.overtimeForm.startDate = this.overday_start + ' ' + this.overtime_start
      const startTime = new Date(this.overtimeForm.startDate).getTime()
      let minTime = new Date(this.min_date)
      minTime.setHours(0)
      minTime.setMinutes(0)
      minTime.setSeconds(0)
      minTime = minTime.getTime()
      const maxTime = (new Date(this.max_date).getTime() + 86399999)
      if (this.overday_start !== '' && this.overtime_start !== '' && this.overtimeForm.startDate !== ' ') {
        if (startTime < minTime) {
          this.$message({
            message: '销假开始时间不能小于加班开始时间',
            type: 'warning'
          })
          that.overtime_start = ''
          that.overday_start = ''
          this.overtimeForm.startDate = ''
        } else if (startTime > maxTime) {
          this.$message({
            message: '销假开始时间不能大于加班结束时间',
            type: 'warning'
          })
          that.overtime_start = ''
          that.overday_start = ''
          this.overtimeForm.startDate = ''
        }
      } else {
        this.$message({
          message: '请选择开始日期',
          type: 'warning'
        })
        this.overtimeForm.startDate = ''
        this.overday_start = ''
        this.overtime_start = ''
      }
      if (this.overday_start !== '' && this.overtime_start !== '' && this.overtimeForm.endDate !== '' && this.overtimeForm.startDate !== '') {
        const endTime = new Date(this.overtimeForm.endDate).getTime()
        if (startTime >= endTime) {
          this.$message({
            message: '结束时间不能小于开始时间',
            type: 'warning'
          })
          this.overtimeForm.endDate = ''
          this.overtime_end = ''
          this.overday_end = ''
        } else {
          console.log(this.overtimeForm.endDate)
          console.log(this.overtimeForm.startDate)
          calcTime('/oa/overtime-working-' + this.viewInfo.type, { start: this.overtimeForm.startDate, end: this.overtimeForm.endDate }).then(res => {
            if (res.code === 200) {
              that.overtimeForm.hours = res.data.hours
              if (!res.data.hours) {
                that.$message({
                  message: res.data,
                  type: 'warning'
                })
                that.overtimeForm.startDate = ''
                that.overtimeForm.endDate = ''
                that.overday_end = ''
                that.overtime_end = ''
                that.overtime_start = ''
                that.overday_start = ''
                that.overtimeForm.hours = 0
              }
            }
          })
        }
      }
    },
    checkValue() {
      const that = this
      // 核实加班
      if (this.overday_end !== '' && this.overtime_end === '') {
        this.overtime_end = '23:00'
      }
      this.overtimeForm.endDate = this.overday_end + ' ' + this.overtime_end
      const endTime = new Date(this.overtimeForm.endDate).getTime()
      let minTime = new Date(this.min_date)
      minTime.setHours(0)
      minTime.setMinutes(0)
      minTime.setSeconds(0)
      minTime = minTime.getTime()
      const maxTime = (new Date(this.max_date).getTime() + 86399999)
      if (this.overday_end !== '' && this.overtime_end !== '' && this.overtimeForm.endDate !== ' ') {
        if (endTime > maxTime) {
          this.$message({
            message: '核实结束时间不能大于加班结束时间',
            type: 'warning'
          })
          that.overday_end = ''
          that.overtime_end = ''
          this.overtimeForm.endDate = ''
        } else if (endTime < minTime) {
          this.$message({
            message: '核实结束时间不能小于加班开始时间',
            type: 'warning'
          })
          that.overday_end = ''
          that.overtime_end = ''
          this.overtimeForm.endDate = ''
        }
      } else {
        this.$message({
          message: '请选择结束日期',
          type: 'warning'
        })
        this.overtimeForm.endDate = ''
        this.overtime_end = ''
        this.overday_end = ''
      }
      if (this.overday_end !== '' && this.overtime_end !== '' && this.overtimeForm.endDate !== '' && this.overtimeForm.startDate !== '') {
        const startTime = new Date(this.overtimeForm.startDate).getTime()
        if (startTime >= endTime) {
          this.$message({
            message: '结束时间不能小于开始时间',
            type: 'warning'
          })
          this.overtimeForm.endDate = ''
          this.overtime_end = ''
          this.overday_end = ''
        } else {
          console.log(this.overtimeForm.endDate)
          console.log(this.overtimeForm.startDate)
          calcTime('/oa/overtime-working-' + this.viewInfo.type, { start: this.overtimeForm.startDate, end: this.overtimeForm.endDate }).then(res => {
            if (res.code === 200) {
              that.overtimeForm.hours = res.data.hours
              if (!res.data.hours) {
                that.$message({
                  message: res.data,
                  type: 'warning'
                })
                that.overtimeForm.startDate = ''
                that.overtimeForm.endDate = ''
                that.overday_end = ''
                that.overtime_end = ''
                that.overtime_start = ''
                that.overday_start = ''
                that.overtimeForm.hours = 0
              }
            }
          })
        }
      }
    },
    resetModel() {
      // this.viewInfo = {}
      this.$refs['overtimeForm'].resetFields()
      this.overtimeForm = {
        startDate: '',
        endDate: '',
        hours: '',
        remark: ''
      }
      this.overday_start = ''
      this.overtime_start = ''
      this.overday_end = ''
      this.overtime_end = ''
      this.submitting = false
    },
    closeModel() {
      this.viewInfo = {}
      this.$refs['overtimeForm'].resetFields()
      this.overtimeForm = {
        startDate: '',
        endDate: '',
        hours: '',
        remark: ''
      }
      this.overday_start = ''
      this.overtime_start = ''
      this.overday_end = ''
      this.overtime_end = ''
      this.modelShow = false
    }
  }
}

</script>
<style lang="less" scoped>
  .attend_bg {
    background: #fff;
    padding: 10px;
    position: absolute;
    width: 100%;
    top: 0;

    .attend_info {
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

        .text_color {
          color: #FF0000;
          font-weight: 700;
          font-size: 12px;
        }
      }
    }

    .attend_page {
      text-align: center;
      padding: 10px 0;
    }
  }
    .dialogModel {
    .short_scroll{
      height: 480px;
    }
    .small_scroll{
      height: 360px;
    }
    .new_form {
      height: 600px;
      overflow: scroll;
      overflow-x: hidden;
    }

    .view_info {
      height: 650px;
      overflow: scroll;
      overflow-x: hidden;
      padding: 10px 15px;
      position: relative;

      .status_icon {
        position: absolute;
        font-size: 120px;
        right: 100px;
        top: 90px;
      }

      .view_user {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e0e0e0;
        // margin: -30px 0;
        padding: 20px 10px;

        .view_user_img {
          width: 100px;
          height: 100px;
          margin: 0 10px;

          img {
            border-radius: 50%;
            width: 100%;
            height: 100%;
          }
        }

        .view_user_info {
          margin-left: 20px;

          h2 {
            font-size: 20px;
            color: #434343;
          }

          p {
            font-size: 14px;
          }

          .blue {
            color: rgba(51, 153, 255, 0.6);
          }

          .green {
            color: rgba(0, 153, 51, 0.6);
          }

          .red {
            color: rgba(255, 51, 102, 0.6);
          }
        }
      }

      .view_detail {
        margin: 20px 0;
        padding-bottom: 20px;
        border-bottom: 1px solid #e0e0e0;

        ul {
          list-style: none;
          padding: 0;
          padding-left: 20px;
          margin: 0;
          margin-top: 10px;

          li {
            padding: 5px 0;
            display: flex;

            .left_title {
              width: 100px;
            }
          }
        }
      }

      .view_steps {
        padding: 0 20px;

        .view_steps_block {
          border-left: 1px solid #e0e0e0;
          position: relative;
          min-height: 70px;

          .radio_status {
            width: 20px;
            height: 20px;
            background: #e4e4e4;
            border-radius: 50%;
            position: absolute;
            top: 0;
            left: 0;
            transform: translateX(-50%);
          }

          .green {
            background: #33cc66;
          }

          p {
            overflow: hidden;
            margin: 0;
            padding-bottom: 10px;

            .blue {
              color: #3399ff;
            }

            .red {
              color: rgba(255, 51, 102, 0.6);
            }

            span {
              font-size: 12px;
              color: #333333;
            }

            span:first-child {
              padding-left: 30px;
              padding-right: 10px;
            }

            span:last-child {
              float: right;
            }

            .view_remark {
              color: #868686;
              font-size: 14px;
              float: left;
              display: block;
            }
          }
        }

        .view_steps_block:last-child {
          border-left: none;
        }
      }
    }

    .modelForm {
      margin: 0 10px;

      .checkDep {
        position: relative;

        .red_star {
          position: absolute;
          left: -76px;
          font-size: 13px;
          font-family: "Arial Normal", "Arial";
          color: #f56c6c;
        }
      }

      .radio_list {
        .el-radio+.el-radio {
          margin-left: 0;
        }

        .el-radio {
          margin-right: 30px;
          width: 60px;
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

      .order_proList {
        padding: 10px 0;
        display: flex;
        align-items: center;

        .view_right {
          margin-right: 5px;
        }

        i {
          color: #999;
          font-size: 26px;
          margin: 0 5px;
        }

        .red {
          color: #ff2f2f;
        }

        .upload-demo {
          display: flex;
          align-items: center;
        }

        .el-upload-list__item:first-child {
          margin-top: 0 !important;
        }
      }
    }

    .view_approval {
      .view_line {
        overflow: hidden;
        padding: 10px 0;

        span {
          font-family: "微软雅黑 Regular", "微软雅黑";
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
        }
      }
    }

    .approval_form {
      margin: 0 15px;
      h1 {
        text-align: center;
        margin: 0;
        margin-bottom: 20px;
      }

      .car_view {
        .view_tips {
          display: flex;
          justify-content: space-between;

          span {
            font-family: "微软雅黑 Bold", "微软雅黑";
            font-size: 14px;
            font-weight: 700;
          }
        }

        .view_table {
          border-collapse: collapse;
          margin: 0 auto;
          width: 100%;

          td {
            border: 1px solid #333333;
            padding: 10px 5px;
            text-align: center;

            a {
              color: #409eff;
              text-decoration: underline;
            }
          }

          .td_title {
            color: #333333;
            font-size: 13px;
            font-weight: 700;
            width: 200px;
            text-align: center;
          }

        }

        .view_step {
          margin: 10px 0;
        }

        .view_comments {
          display: flex;
          align-items: center;
          margin: 20px 0;

          span {
            width: 100px;
          }
        }

        .view_btn {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-top: 30px;
        }
      }
    }

    .form_btn {
      text-align: right;
      padding-top: 20px;
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
