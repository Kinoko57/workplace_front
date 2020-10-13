<template>
  <div>
    <div class="attend_bg">
      <div class="fifter">
        <!-- <search-fifter
          :fifter="true"
          :delay-fifter="loading==false"
          :module-name="moduleName"
          :upload-url="uploadUrl"
          :import-show="btnPermission('attendance_import')&&searchInfo.mode=='all'"
          :export-show="btnPermission('attendance_export')&&searchInfo.mode=='all'"
          :download-url="downloadUrl"
          :export-type="moduleType"
          :export-name="'考勤列表'"
          @search="fifterSearch"
          @importAction="importAttend" /> -->
        <my-tabs
          :allow-fifter="searchInfo.mode!='attendance'"
          :active-name="searchInfo.mode"
          :page-name="page_name"
          :module-name="module_name"
          :tabs-list="typeList"
          :add="searchInfo.mode=='attendance'&&btnPermission('attendance_insertatttime')"
          @addAction="addTime"
          @handleClick="choseType"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)" />
      </div>
      <div class="attend_info">
        <div class="info_total">
          <div class="data_total">
            <span v-if="searchInfo.mode!='attendance'" class="total_text">共{{ total }}条数据</span>
            <span v-else class="total_text">共{{ tableData.length }}条数据</span>
          </div>
          <div class="export_btn">
            <search-fifter
              ref="attendance"
              :module-name="moduleName"
              :upload-url="uploadUrl"
              :import-show="btnPermission('attendance_import')&&searchInfo.mode=='all'"
              :export-show="exportShow"
              :download-url="downloadUrl"
              :export-type="moduleType"
              :export-name="'考勤列表'"
              @importAction="importAttend" />
          </div>
        </div>
        <el-table v-loading="loading" v-if="searchInfo.mode=='all'" :key="Math.random()" :data="tableData" :max-height="tableHeight" border row-key="id" style="width: 100%" tooltip-effect="light" >
          <el-table-column prop="attendDate" label="日期" min-width="120" />
          <el-table-column prop="realName" label="员工" min-width="120" />
          <el-table-column prop="organizeName" label="所属部门" min-width="150" show-overflow-tooltip />
          <el-table-column prop="groupName" label="岗位" min-width="150" show-overflow-tooltip />
          <el-table-column prop="weeksName" label="星期" />
          <el-table-column prop="status" label="外出状态" min-width="120">
            <template slot-scope="scope">
              <!-- <span v-if="scope.row.outStatus==0">无</span> -->
              <el-tag v-if="scope.row.outStatus==1" type="danger">请假</el-tag>
              <el-tag v-if="scope.row.outStatus==2" type="danger">请假未审批</el-tag>
              <el-tag v-if="scope.row.outStatus==3" type="danger">公出</el-tag>
              <el-tag v-if="scope.row.outStatus==4" type="danger">公出未审批</el-tag>
              <el-tag v-if="scope.row.outStatus==5" type="danger">公出未签到</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="100">
            <template slot-scope="scope">
              <el-tag v-for="(item,index) in statusList" v-if="scope.row.status==item.key" :key="index" :type="item.status">{{ item.name }}</el-tag>
              <!-- <el-tag v-if="scope.row.status==1">正常</el-tag>
              <el-tag v-if="scope.row.status==2" type="danger">迟到</el-tag>
              <el-tag v-if="scope.row.status==3" type="danger">早退</el-tag>
              <el-tag v-if="scope.row.status==4" type="danger">旷工</el-tag>
              <el-tag v-if="scope.row.status==6" type="success">加班</el-tag> -->
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
          <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip />
          <el-table-column prop="status" label="操作" min-width="120" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('attendance_attedit')" :disabled="scope.row.firstTime!=''&&scope.row.endTime!=''||scope.row.status==1" type="text" size="small" @click="handlingExceptions(scope.row)">处理</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table v-loading="loading" v-if="btnPermission('attendance_overtimebrowse')&&searchInfo.mode=='overtime'" :key="Math.random()" :data="tableData" :max-height="tableHeight" border row-key="id" style="width: 100%" tooltip-effect="light" >
          <el-table-column prop="title" label="单据名称" min-width="150" show-overflow-tooltip/>
          <el-table-column prop="organizeName" label="所属部门" min-width="120" show-overflow-tooltip />
          <el-table-column label="申请人（职位）" min-width="120" >
            <template slot-scope="scope">
              <span>{{ scope.row.accountName }}({{ scope.row.groupName }})</span>
            </template>
          </el-table-column>
          <el-table-column prop="startDate" label="计划开始时间" min-width="120" show-overflow-tooltip/>
          <el-table-column prop="endDate" label="计划结束时间" min-width="120" show-overflow-tooltip/>
          <el-table-column prop="hours" label="计划加班时长" min-width="120" >
            <template slot-scope="scope">
              <span>{{ scope.row.hours }}小时</span>
            </template>
          </el-table-column>
          <el-table-column prop="is_check_startDate" label="实际开始时间" min-width="120" show-overflow-tooltip/>
          <el-table-column prop="is_check_endDate" label="实际结束时间" min-width="120" show-overflow-tooltip/>
          <el-table-column prop="is_check_hours" label="实际加班时长" min-width="120" >
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
          <el-table-column prop="status" label="操作" min-width="120" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="scope.row.is_check_status==1&&btnPermission('attendance_overtimeedit')" type="text" size="small" @click="verifyinfo(scope.row)">核实</el-button>
              <el-button v-if="scope.row.is_check_status==2&&btnPermission('attendance_overtimeedit')" type="text" size="small" @click="verifyinfo(scope.row)">调整</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table v-loading="loading" v-if="searchInfo.mode=='attendance'" :key="Math.random()" :data="tableData" :max-height="tableHeight" border row-key="id" style="width: 100%" tooltip-effect="light" >
          <el-table-column prop="title" label="上班时间" min-width="110" show-overflow-tooltip>
            <template slot-scope="scope">
              <span style="margin-right:6px">上午{{ scope.row.am_on }}-{{ scope.row.am_off }}</span>
              <span>下午{{ scope.row.pm_on }}-{{ scope.row.pm_off }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="所属执行部门" min-width="150" show-overflow-tooltip />
          <!-- <el-table-column prop="abnormal" label="异常人数" min-width="120" show-overflow-tooltip/> -->
          <el-table-column prop="status" label="操作" min-width="120" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('attendance_insertatttime')" type="text" size="small" @click="editTime(scope.row)">编辑</el-button>
              <el-button v-if="btnPermission('attendance_delatttime')" type="text" size="small" @click="delTime(scope.row)">作废</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="searchInfo.mode!='attendance'" class="info_page">
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
      <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="modelShow" :title="modelTitle" width="800px" class="dialogModel" @close="closeModel">
        <!-- 加班审批单 -->
        <el-scrollbar v-if="modelShow&&searchInfo.mode=='overtime'" class="fixed_scroll over_scroll">
          <div class="approval_form">
            <div class="car_view">
              <table class="view_table">
                <tr>
                  <td class="td_title">申请单号</td>
                  <td>{{ viewInfo.code }}</td>
                  <td class="td_title">申请时间</td>
                  <td>{{ viewInfo.createdDate }}</td>
                </tr>
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
                  style="width:760px;margin:0 auto;padding:20px 0;"
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
                      style="width:240px"
                      @change="checkValueStart"/>
                    <el-time-picker
                      v-model="overtime_start"
                      :clearable="false"
                      format="HH:mm"
                      value-format="HH:mm"
                      placeholder="开始时间"
                      style="width:240px"
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
                      style="width:240px"
                      @change="checkValue"/>
                    <el-time-picker
                      v-model="overtime_end"
                      :clearable="false"
                      format="HH:mm"
                      value-format="HH:mm"
                      placeholder="结束时间"
                      style="width:240px"
                      @change="checkValue"/>
                  </el-form-item>
                  <el-form-item label="实际加班时长：" prop="hours">
                    <!-- :precision="1"  -->
                    <el-input-number v-model.trim="overtimeForm.hours" :min="0" :precision="1" :step="0.5" size="large" controls-position="right" style="width:240px"/>
                    <!-- <el-input v-model="overtimeForm.hours" type="number" style="width:100px" min="0" @blur="checkValue"/> -->
                    <span style="margin-left:10px">小时</span>
                  </el-form-item>
                  <el-form-item label="备注：" prop="remark">
                    <el-input v-model.trim="overtimeForm.remark" :rows="3" type="textarea" style="width:480px" placeholder="请输入备注,最大长度为120个字" />
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
        </el-scrollbar>
        <div v-if="modelShow&&searchInfo.mode=='overtime'" slot="footer" class="dialog-footer">
          <el-button @click="resetModel">重 置</el-button>
          <el-button :loading="submitting" type="primary" @click="saveVerify">保存</el-button>
        </div>
        <el-scrollbar v-if="modelShow&&searchInfo.mode=='attendance'" class="fixed_scroll over_scroll">
          <my-alert :closable="false" title="未单独配置的部门，默认上班时间为：9:00-12:00 13:30-18:30" style="width: 80%;margin: 0 auto;margin-top: 20px;"/>
          <el-form
            ref="attendanceForm"
            :model="attendanceForm"
            :rules="attendanceRules"
            class="modelForm"
            label-width="130px"
            label-position="right">
            <el-form-item label="上午工作时间：" prop="am_on" style="float:left;margin-right: 6px;">
              <el-time-select
                v-model="attendanceForm.am_on"
                :picker-options="{
                  start: '06:00',
                  step: '00:15',
                  end: '12:30'
                }"
                style="width:240px"
                format="HH:mm:ss"
                placeholder="起始时间"/>
            </el-form-item>
            <span style="float:left;margin-right: 6px;line-height: 40px;">~</span>
            <el-form-item prop="am_off" style="float: left;margin-left: -130px;">
              <el-time-select
                v-model="attendanceForm.am_off"
                :disabled="attendanceForm.am_on==''"
                :picker-options="{
                  start: '06:00',
                  step: '00:15',
                  end: '12:30',
                  minTime: attendanceForm.am_on
                }"
                style="width:240px"
                format="HH:mm:ss"
                placeholder="结束时间"/>
            </el-form-item>
            <el-form-item label="下午工作时间：" prop="pm_on" style="float:left;margin-right: 6px;">
              <el-time-select
                v-model="attendanceForm.pm_on"
                :disabled="attendanceForm.am_on==''||attendanceForm.am_off==''"
                :picker-options="{
                  start: attendanceForm.am_off==''?'12:00':attendanceForm.am_off,
                  step: '00:15',
                  end: '23:45'
                }"
                style="width:240px"
                format="HH:mm:ss"
                placeholder="起始时间"/>
            </el-form-item>
            <span style="float:left;margin-right: 6px;line-height: 40px;">~</span>
            <el-form-item prop="pm_off" style="float: left;margin-left: -130px;">
              <el-time-select
                :disabled="attendanceForm.pm_on==''"
                v-model="attendanceForm.pm_off"
                :picker-options="{
                  start: attendanceForm.am_off,
                  step: '00:15',
                  end: '23:45',
                  minTime: attendanceForm.pm_on
                }"
                style="width:240px"
                format="HH:mm:ss"
                placeholder="结束时间"/>
            </el-form-item>
            <el-form-item label="执行部门：" prop="organize_idslist" style="float: left;">
              <el-select v-model="attendanceForm.organize_idslist" filterable style="width:500px" multiple placeholder="请选择部门">
                <el-option
                  v-for="item in orgThirdList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-form>
        </el-scrollbar>
        <div v-if="modelShow&&searchInfo.mode=='attendance'" slot="footer" class="dialog-footer">
          <el-button v-if="attendanceForm.type=='insert'" @click="resetModel">重 置</el-button>
          <el-button :loading="submitting" type="primary" @click="saveVerify">保存</el-button>
        </div>
        <el-scrollbar v-if="modelShow&&searchInfo.mode=='all'" class="fixed_scroll over_scroll">
          <div class="approval_form">
            <div class="car_view">
              <table class="view_table">
                <tr>
                  <td class="td_title">考勤日期</td>
                  <td>{{ viewInfo.attendDate }}</td>
                  <td class="td_title">姓名</td>
                  <td>{{ viewInfo.realName }}</td>
                </tr>
                <tr>
                  <td class="td_title">部门</td>
                  <td>{{ viewInfo.organizeName }}</td>
                  <td class="td_title">岗位</td>
                  <td>{{ viewInfo.groupName }}</td>
                </tr>
                <tr>
                  <td class="td_title">星期</td>
                  <td>{{ viewInfo.weeksName }}</td>
                  <td class="td_title">签入时间</td>
                  <td>{{ viewInfo.firstTime }}</td>
                </tr>
                <tr>
                  <td class="td_title">签出时间</td>
                  <td>{{ viewInfo.endTime }}</td>
                  <td class="td_title">异常状态</td>
                  <td>
                    <el-tag v-for="(item,index) in statusList" v-if="viewInfo.status==item.key" :key="index" :type="item.status">{{ item.name }}</el-tag>
                  </td>
                </tr>
              </table>
              <div class="view_comments">
                <el-form
                  ref="handlingForm"
                  :model="handlingForm"
                  :rules="handlingRules"
                  style="margin: 0 auto;width:760px;padding:20px 0;"
                  label-width="130px"
                  label-position="right">
                  <el-form-item label="核实状态：" prop="status">
                    <el-select v-model="handlingForm.status" filterable placeholder="请选择核实状态">
                      <el-option
                        v-for="(item, index) in statusList"
                        v-show="item.key!=1&&item.key!=5&&item.key!=6&&item.key!=7"
                        :key="index"
                        :label="item.name"
                        :value="item.key"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="备注：" prop="remark">
                    <el-input v-model.trim="handlingForm.remark" :rows="3" type="textarea" style="width:486px" placeholder="请输入备注,最大长度为120个字" />
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
        </el-scrollbar>
        <div v-if="modelShow&&searchInfo.mode=='all'" slot="footer" class="dialog-footer">
          <el-button @click="resetModel">重 置</el-button>
          <el-button :loading="submitting" type="primary" @click="saveVerify">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getAttendanceInfo,
  getAttendanceTimeInfo,
  getoverTimeInfo,
  verifyOverTime,
  saveAttendanceTime,
  getAttendanceOrg,
  delAttendanceTime,
  handlingAttendance,
  calcTime // 计算请假加班时长
} from '@/api/office'
import {
  getExecutiveOrg
} from '@/api/public'
export default {
  name: 'AttendanceManage',
  data() {
    return {
      page_name: 'attendance',
      module_name: 'oa',
      choseTotal: 0,
      typeList: [],
      statusList: [],
      moduleName: 'attendance',
      moduleType: '/oa/attendance-export',
      uploadUrl: '',
      downloadUrl: '',
      tableData: [],
      loading: true,
      modelShow: false,
      modelTitle: '核实',
      modeType: 'new',
      submitting: false,
      viewInfo: {},
      exportShow: false,
      overtimeForm: {
        type: '',
        startDate: '',
        endDate: '',
        hours: '',
        remark: ''
      },
      handlingForm: {
        id: '',
        status: '',
        remark: ''
      },
      attendanceForm: {
        type: 'insert',
        organize_idslist: [],
        organize_ids: [],
        am_on: '',
        am_off: '',
        pm_on: '',
        pm_off: ''
      },
      orgList: [{
        id: '',
        name: ''
      }], // 组织架构列表
      orgThirdList: [],
      num: 0,
      defaultNode: {
        value: 'id',
        label: 'name',
        children: 'children',
        multiple: true,
        checkStrictly: false
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
      handlingRules: {
        status: [{
          required: true,
          message: '请选择核实状态',
          trigger: 'change'
        }],
        remark: [{
          required: true,
          message: '备注不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '备注长度超出范长度超出范围1-120位之间围', trigger: 'blur' }]
      },
      attendanceRules: {
        am_on: [{
          required: true,
          message: '上午开始时间不能为空',
          trigger: 'change'
        }],
        am_off: [{
          required: true,
          message: '上午结束时间不能为空',
          trigger: 'change'
        }],
        pm_on: [{
          required: true,
          message: '下午开始时间不能为空',
          trigger: 'change'
        }],
        pm_off: [{
          required: true,
          message: '下午结束时间不能为空',
          trigger: 'change'
        }],
        organize_idslist: [{
          required: true,
          message: '执行部门不能为空',
          trigger: 'change'
        }]
      },
      pickerOptions: {
        disabledDate(time) {
          console.log(time.getTime())
          return time.getTime() < Date.now()
        }
      },
      searchInfo: {
        mode: 'all', // 类型
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
    // 监听浏览器返回
    // if (window.history && window.history.pushState) {
    //   history.pushState(null, null, document.URL)
    //   window.addEventListener('popstate', this.goBack, false)
    // }
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    this.uploadUrl = process.env.BASE_API + 'oa/attendance-import.json'
    this.downloadUrl = process.env.BASE_API + 'oa/attendance-phpexcelexport'
    if (this.btnPermission('attendance_overtimebrowse') == false) {
      this.typeList = [{
        label: '正常考勤',
        name: 'all'
      }, {
        label: '考勤时间',
        name: 'attendance'
      }]
    } else {
      this.typeList = [{
        label: '正常考勤',
        name: 'all'
      }, {
        label: '加班考勤',
        name: 'overtime'
      }, {
        label: '考勤时间',
        name: 'attendance'
      }]
    }
    this.exportShow = this.btnPermission('attendance_export') && this.searchInfo.mode != 'attendance'
    // 获取列表
    this.getList()
    this.getDefault()
  },
  destroyed() {
    window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
    // window.removeEventListener('popstate', this.goBack, false)
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  methods: {
    beforeunloadHandler(e) {
      console.log(e)
      console.log(this.searchInfo.mode == 'all')
      console.log(this.$refs.attendance.showModel == false)
      console.log(this.$refs.attendance.submitting == false)
      if (this.searchInfo.mode == 'all' && this.$refs.attendance.showModel == true && this.$refs.attendance.submitting == false) {
        if (this.$route.path === '/memberManagement/attendance') {
          e = e || window.event
          if (e) {
            e.returnValue = '关闭提示'
          }
          return '关闭提示'
        }
      }
    },
    goBack() {
      this.$confirm('是否离开当前页面，离开页面会导致已输入内容丢失?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.$router.go(-1)
      }).catch(() => {
        console.log('用户点击了取消')
      })
    },
    getDefault() {
      const that = this
      // 获取三级组织架构部门
      getExecutiveOrg().then(res => {
        if (res.code == 200) {
          const info = res.data
          for (let i = 0; i < info.length; i++) {
            info[i].label = info[i].pname + '-' + info[i].name
          }
          that.orgThirdList = [...info]
        }
      })
    },
    addTime() {
      console.log('显示弹框')
      this.modelShow = true
      this.modelTitle = '新增考勤时间'
    },
    editTime(data) {
      console.log('显示弹框')
      console.log(data)
      this.attendanceForm = {
        id: data.id,
        type: 'update',
        organize_idslist: data.organize_id.split(','),
        organize_ids: data.organize_ids,
        am_on: data.am_on,
        am_off: data.am_off,
        pm_on: data.pm_on,
        pm_off: data.pm_off
      }
      this.modelShow = true
      this.modelTitle = '编辑考勤时间'
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
      if (this.searchInfo.mode == 'all') {
        getAttendanceInfo(this.searchInfo).then(res => {
          that.loading = false
          that.submitting = false
          if (res.code === 200) {
            that.tableData = res.data.attendances
            that.statusList = []
            const statusList = res.data.statusList
            for (const i in statusList) {
              that.statusList.push({ name: statusList[i], key: i, status: i == 1 ? 'success' : (i == 4 ? 'danger' : 'warning') })
            }
            that.total = res.data.pager.recTotal // 总条数
            console.log(that.statusList)
          }
        })
      } else if (this.searchInfo.mode == 'overtime') {
        getoverTimeInfo(this.searchInfo).then(res => {
          that.loading = false
          that.submitting = false
          if (res.code == 200) {
            that.tableData = res.data.leaves
            that.total = res.data.pager.recTotal // 总条数
            console.log(that.tableData)
          }
        })
      } else {
        getAttendanceTimeInfo().then(res => {
          that.loading = false
          that.submitting = false
          if (res.code == 200) {
            that.tableData = res.data
            // that.total = res.data.pager.recTotal // 总条数
          }
        })
      }
    },
    choseType(value) {
      this.searchInfo.pageID = 1
      this.searchInfo.mode = value
      console.log(this.searchInfo.mode)
      this.tableData = []
      this.searchInfo.orderBy = ''
      if (this.searchInfo.mode == 'all') {
        this.moduleName = 'attendance'
        this.moduleType = 'oa/attendance-export'
        this.exportShow = this.btnPermission('attendance_export') && this.searchInfo.mode != 'attendance'
      } else if (this.searchInfo.mode == 'overtime') {
        this.moduleName = 'overtime'
        this.moduleType = 'oa/attendance-workexport'
        this.exportShow = this.btnPermission('attendance_workexport') && this.searchInfo.mode != 'attendance'
      } else {
        this.exportShow = false
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
    delTime(data) {
      const that = this
      this.$confirm('是否要作废此条考勤时间，一旦作废无法恢复？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delAttendanceTime(data.id).then(res => {
          if (res.code == 200 || res.code == '200') {
            that.$message({
              type: 'success',
              message: '作废成功!'
            })
            that.getList()
          } else {
            that.$message({
              type: 'warning',
              message: res.data.msg
            })
          }
        })
      }).catch(() => {
        console.log('用户点击了取消')
      })
    },
    saveVerify() {
      const that = this
      if (this.searchInfo.mode == 'attendance') {
        this.$refs['attendanceForm'].validate(valid => {
          if (valid) {
            this.attendanceForm.organize_ids = this.attendanceForm.organize_idslist.join(',')
            console.log(this.attendanceForm)
            let info = {}
            if (this.attendanceForm.type == 'insert') {
              info = {
                type: this.attendanceForm.type,
                am_on: this.attendanceForm.am_on,
                am_off: this.attendanceForm.am_off,
                pm_on: this.attendanceForm.pm_on,
                pm_off: this.attendanceForm.pm_off,
                organize_ids: this.attendanceForm.organize_ids
              }
            } else {
              info = {
                id: this.attendanceForm.id,
                type: this.attendanceForm.type,
                am_on: this.attendanceForm.am_on,
                am_off: this.attendanceForm.am_off,
                pm_on: this.attendanceForm.pm_on,
                pm_off: this.attendanceForm.pm_off,
                organize_ids: this.attendanceForm.organize_ids
              }
            }
            console.log(info)
            saveAttendanceTime(info).then(res => {
              console.log(res)
              if (res.code == 200) {
                if (info.type == 'insert') {
                  that.$message({
                    message: '考勤时间新增成功！',
                    type: 'success'
                  })
                } else {
                  that.$message({
                    message: '考勤时间更新成功！',
                    type: 'success'
                  })
                }
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
          } else {
            console.log('error submit!!')
            // this.$message.warning('信息填写不完整或者信息填写有误！')
            this.$nextTick(() => {
              this.checkFormErr()
            })
            return false
          }
        })
      } else if (this.searchInfo.mode == 'overtime') {
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
      } else {
        console.log('正常考勤')
        this.$refs['handlingForm'].validate(valid => {
          if (valid) {
            const info = {
              id: this.viewInfo.id,
              status: this.handlingForm.status,
              remark: this.handlingForm.remark
            }
            this.submitting = true
            handlingAttendance(info).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '异常考勤处理完成！',
                  type: 'success'
                })
                that.closeModel()
                that.loading = true
                that.tableData = []
                that.getList()
              } else {
                that.submitting = false
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
    handlingExceptions(data) {
      this.viewInfo = {}
      this.viewInfo = data
      this.handlingForm.remark = this.viewInfo.remark
      this.modelShow = true
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
    importAttend(event) {
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
      if (this.searchInfo.mode == 'attendance') {
        this.$refs['attendanceForm'].resetFields()
        this.attendanceForm = {
          type: 'insert',
          am_on: '',
          am_off: '',
          pm_on: '',
          pm_off: '',
          organize_ids: '',
          organize_idslist: []
        }
        this.$forceUpdate()
      } else if (this.searchInfo.mode == 'overtime') {
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
      } else {
        this.$refs['handlingForm'].resetFields()
        this.handlingForm = {
          id: '',
          status: '',
          remark: ''
        }
      }
    },
    closeModel() {
      if (this.searchInfo.mode == 'attendance') {
        this.viewInfo = {}
        this.$refs['attendanceForm'].resetFields()
        this.attendanceForm = {
          type: 'insert',
          am_on: '',
          am_off: '',
          pm_on: '',
          pm_off: '',
          organize_ids: '',
          organize_idslist: []
        }
      } else if (this.searchInfo.mode == 'overtime') {
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
      } else {
        this.viewInfo = {}
        this.$refs['handlingForm'].resetFields()
        this.handlingForm = {
          id: '',
          status: '',
          remark: ''
        }
      }
      this.modelShow = false
    }
  }
}

</script>
<style lang="less" scoped>
  .attend_bg {
    // background: #fff;
    // padding: 10px;
    position: absolute;
    width: 100%;
    top: 0;

    .attend_info {
      background: #fff;
      padding:20px 10px;
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
      height: 240px;
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
      padding: 20px 0;
      .car_view {

        .view_table {
          border-collapse: collapse;
          margin: 0 auto;
          width: 760px;

          td {
            border: 1px solid #e0e0e0;
            padding: 10px 5px;
            text-align: left;
            padding-left: 16px;
            color: #333;
            font-family: '微软雅黑 Regular', '微软雅黑';
            font-size: 12px;
            line-height: 1.5;

            a {
              color: #409eff;
              text-decoration: underline;
            }
          }

          .td_title {
            font-size: 13px;
            width: 120px;
            text-align: left;
            background-color: rgba(249, 250, 252, 1);
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
