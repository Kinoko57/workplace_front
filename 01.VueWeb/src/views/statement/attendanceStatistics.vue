<template>
  <div class="bussiness_bg">
    <div class="bussiness_tab">
      <span
        v-for="(item,index) in tabList"
        :key="index"
        :class="{activity_tab:item.name==choseTab}"
        @click="choseTabsType(item.name)">{{ item.label }}</span>
    </div>
    <div class="bussiness_scroll">
      <div v-if="choseTab=='daily'" class="bussiness_show">
        <div class="bussiness_charts">
          <div class="charts_fifter">
            <div class="fifter_span agency">
              <el-radio-group v-model="radiotype" size="mini" @change="choseDaily">
                <el-radio-button v-for="item of typeList" :label="item.name" :key="item.name" border style="margin-right:20px;">{{ item.label }}</el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </div>
        <div v-if="radiotype=='daily'" class="bussiness_table">
          <div class="table_export">
            <div class="daily_fifter">
              <el-date-picker
                v-model="daily_date"
                :picker-options="pickerOptions"
                :clearable="false"
                size="mini"
                type="date"
                placeholder="选择日期"
                @change="changeDate"/>
            </div>
            <search-fifter :add="false" :fifter="false" :export-all="false" :export-show="true" :export-type="moduleType" :export-name="'考勤统计'" style="display:inline-block;position: absolute;right: 10px" @exportAction="bussinessExport"/>
          </div>
          <div>
            <el-table
              v-if="choseTab=='daily'"
              :data="dailyData"
              border
              tooltip-effect="light"
              style="width: 100%">
              <el-table-column
                :key="Math.random()"
                prop="date"
                label="日期"
                align="center"
                width="150"/>
              <el-table-column
                :key="Math.random()"
                label="出勤（人数）"
                align="center">
                <el-table-column
                  :key="Math.random()"
                  prop="whole"
                  label="应勤人数"
                  align="center"
                />
                <el-table-column
                  :key="Math.random()"
                  prop="chuqin"
                  label="实际出勤"
                  align="center"
                />
                <el-table-column
                  :key="Math.random()"
                  prop="chidao"
                  label="迟到"
                  align="center"/>
                <el-table-column
                  :key="Math.random()"
                  prop="zaotui"
                  align="center"
                  label="早退"
                />
                <el-table-column
                  :key="Math.random()"
                  prop="chidaozaotui"
                  align="center"
                  label="迟到早退"
                />
                <el-table-column
                  :key="Math.random()"
                  prop="queqin"
                  align="center"
                  label="缺勤"
                />
                <el-table-column
                  :key="Math.random()"
                  label="漏签"
                  align="center"
                  prop="louqian"
                  min-width="100"/>
                <el-table-column
                  :key="Math.random()"
                  prop="weidaka"
                  align="center"
                  label="未打卡"
                />
              </el-table-column>
              <el-table-column
                :key="Math.random()"
                label="公出（人数）"
                align="center">
                <el-table-column
                  :key="Math.random()"
                  prop="gongchu"
                  label="外出"
                  align="center"
                />
              </el-table-column>
              <el-table-column
                :key="Math.random()"
                label="请假（人数）"
                align="center">
                <el-table-column
                  :key="Math.random()"
                  prop="shijia"
                  label="事假"
                  align="center"
                />
                <el-table-column
                  :key="Math.random()"
                  prop="nianjia"
                  label="年假"
                  align="center"
                />
                <el-table-column
                  :key="Math.random()"
                  prop="bingjia"
                  label="病假"
                  align="center"
                />
                <el-table-column
                  :key="Math.random()"
                  prop="qingjiaElse"
                  label="其他"
                  align="center"
                />
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div v-else class="bussiness_table">
          <div class="table_export">
            <div class="daily_fifter">
              <el-date-picker
                v-model="daily_date"
                :clearable="false"
                :picker-options="pickerOptions"
                size="mini"
                style="width:150px;"
                type="date"
                value-format="timestamp"
                placeholder="选择日期"
                @change="changeDate"/>
              <!-- <el-select v-model="daily_org" size="mini" style="width:150px;" placeholder="请选择部门">
                <el-option
                  v-for="item in orgList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select> -->
              <!-- <el-cascader
                ref="orgLabel"
                :options="orgList"
                v-model="daily_org"
                :props="defaultNode"
                :show-all-levels="false"
                :change-on-select="true"
                style="width:140px"
                size="mini"
                placeholder="请选择部门"
                filterable
                @change="choseDep"/> -->
              <el-select v-model="daily_org" size="mini" filterable placeholder="请选择部门" style="width:140px" @change="choseDep">
                <el-option
                  v-for="(select,index) in orgList"
                  :label="select.pname+'-'+select.name"
                  :value="select.id"
                  :key="index"
                />
              </el-select>
            </div>
            <search-fifter :add="false" :fifter="false" :export-all="false" :export-type="moduleType" :export-show="true" :export-name="'考勤统计'" style="display:inline-block;position: absolute;right: 10px" @exportAction="bussinessExport"/>
          </div>
          <div>
            <el-table
              :data="dailyData"
              border
              tooltip-effect="light"
              style="width: 100%">
              <el-table-column
                :key="Math.random()"
                prop="date"
                label="序号"
                align="center"
                width="150"/>
              <el-table-column
                :key="Math.random()"
                label="员工信息"
                align="center">
                <el-table-column
                  :key="Math.random()"
                  prop="realname"
                  label="姓名"
                  align="center"
                />
                <el-table-column
                  :key="Math.random()"
                  prop="organize"
                  label="部门"
                  align="center"
                />
                <el-table-column
                  :key="Math.random()"
                  prop="position"
                  label="职位"
                  align="center"/>
              </el-table-column>
              <el-table-column
                :key="Math.random()"
                label="异常详情"
                align="center">
                <el-table-column
                  :key="Math.random()"
                  prop="date"
                  label="日期"
                  align="center"
                />
                <el-table-column
                  :key="Math.random()"
                  prop="firstTime"
                  label="签入时间"
                  align="center"
                />
                <el-table-column
                  :key="Math.random()"
                  prop="endTime"
                  label="签出时间"
                  align="center"
                />
              </el-table-column>
              <el-table-column
                :key="Math.random()"
                label="异常结果"
                align="center" >
                <el-table-column
                  :key="Math.random()"
                  prop="status"
                  align="center"
                />
              </el-table-column>
              <!-- <el-table-column
                :key="Math.random()" label="异常结果" align="center" prop="status"/> -->
            </el-table>
          </div>
          <div class="info_page">
            <el-pagination
              :current-page="searchInfo.page"
              :page-sizes="[5, 10, 50, 100]"
              :page-size="searchInfo.size"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange" />
          </div>
        </div>
      </div>
      <div v-if="choseTab=='checkingin'" class="bussiness_show">
        <div class="bussiness_card_list">
          <div class="bussiness_card">
            <div class="card_icon">
              <svg-icon icon-class="statistics_09" />
            </div>
            <div class="card_tips">
              <p class="title">应出勤</p>
              <p class="num">{{ checkInfoCount.headcount }}</p>
            </div>
          </div>
          <div class="bussiness_card">
            <div class="card_icon">
              <svg-icon icon-class="statistics_09" />
            </div>
            <div class="card_tips">
              <p class="title">昨日出勤</p>
              <p class="num">{{ checkInfoCount.chuqin }}</p>
            </div>
          </div>
          <div class="bussiness_card">
            <div class="card_icon">
              <svg-icon icon-class="statistics_09" />
            </div>
            <div class="card_tips">
              <p class="title">昨日迟到</p>
              <p class="num">{{ checkInfoCount.chidao }}</p>
            </div>
          </div>
          <div class="bussiness_card">
            <div class="card_icon">
              <svg-icon icon-class="statistics_14" />
            </div>
            <div class="card_tips">
              <p class="title">昨日请假</p>
              <p class="num">{{ checkInfoCount.qingjia }}</p>
            </div>
          </div>
          <div class="bussiness_card">
            <div class="card_icon">
              <svg-icon icon-class="statistics_11" />
            </div>
            <div class="card_tips">
              <p class="title">昨日缺勤</p>
              <p class="num">{{ checkInfoCount.queqin }}</p>
            </div>
          </div>
          <div class="bussiness_card">
            <div class="card_icon">
              <svg-icon icon-class="statistics_12" />
            </div>
            <div class="card_tips">
              <p class="title">昨日早退</p>
              <p class="num">{{ checkInfoCount.zaotui }}</p>
            </div>
          </div>
          <div class="bussiness_card">
            <div class="card_icon">
              <svg-icon icon-class="statistics_10" />
            </div>
            <div class="card_tips">
              <p class="title">昨日公出</p>
              <p class="num">{{ checkInfoCount.gongchu }}</p>
            </div>
          </div>
        </div>
        <div class="bussiness_charts">
          <div class="charts_fifter">
            <div class="fifter_span agency">
              <el-radio-group v-model="radiodate" size="mini" @change="quest">
                <el-radio-button v-for="item of typedate" :label="item.time" :key="item.time" border style="margin-right:20px;">{{ item.text }}</el-radio-button>
              </el-radio-group>
              <transition name="el-fade-in-linear">
                <el-date-picker
                  v-if="ishow"
                  :clearable="false"
                  :picker-options="pickerOptions"
                  v-model="dateTime"
                  size="mini"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="dateChange"/>
              </transition>
            </div>
            <div class="fifter_select">
              <span>时间粒度：</span>
              <el-select v-model="timesize" placeholder="请选择" size="mini" style="width:80px">
                <el-option
                  v-for="item in timeRange"
                  :key="item.time"
                  :label="item.text"
                  :value="item.time"/>
              </el-select>
            </div>
          </div>
          <div class="charts_block">
            <div id="attendanceLine" class="echars_style" style="margin-bottom:20px"/>
            <div id="typeChart" class="echars_style echars_style_short"/>
            <!-- <div id="abnormalChart" class="echars_style echars_style_short"/> -->
            <div id="outChart" class="echars_style echars_style_short"/>
          </div>
        </div>
        <div class="bussiness_table">
          <div class="table_export">
            <search-fifter :add="false" :fifter="false" :export-all="false" :export-type="moduleType" :export-show="true" :export-name="'考勤统计'" style="display:inline-block;position: absolute;right: 10px" @exportAction="bussinessExport"/>
          </div>
          <div>
            <el-table v-if="choseTab=='checkingin'" :data="tableData" border tooltip-effect="light">
              <el-table-column
                :key="Math.random()"
                label="部门名称"
                align="center"
                prop="name" />
              <el-table-column
                :key="Math.random()"
                label="在职人数"
                align="center"
                prop="staffNum"/>
              <el-table-column
                :key="Math.random()"
                label="正常打卡人数"
                align="center"
                prop="zhengchang"/>
              <el-table-column
                :key="Math.random()"
                label="迟到"
                align="center"
                prop="chidao"/>
              <el-table-column
                :key="Math.random()"
                label="迟到早退"
                align="center"
                prop="chidaozaotui"/>
              <el-table-column
                :key="Math.random()"
                label="未打卡"
                align="center"
                prop="weidaka"/>
              <el-table-column
                :key="Math.random()"
                label="早退"
                align="center"
                prop="zaotui"/>
              <el-table-column
                :key="Math.random()"
                label="公出"
                align="center"
                prop="gongchu"/>
              <el-table-column
                :key="Math.random()"
                label="请假"
                align="center"
                prop="qingjia"/>
              <el-table-column
                :key="Math.random()"
                label="缺勤"
                align="center"
                prop="queqin"/>
              <el-table-column
                :key="Math.random()"
                label="漏签"
                align="center"
                prop="louqian"/>
              <el-table-column
                :key="Math.random()"
                label="公出未签到"
                align="center"
                prop="gongchuweiqiandao"/>
              <el-table-column
                :key="Math.random()"
                label="公出未审批"
                align="center"
                prop="gongchuweishenpi"/>
              <el-table-column
                :key="Math.random()"
                label="请假未审批"
                align="center"
                prop="qingjiaweishenpi"/>
              <el-table-column
                :key="Math.random()"
                prop="date"
                label="时间"
                align="center"/>
            </el-table>
          </div>
          <!-- <div class="info_page">
            <el-pagination
              :current-page="searchInfo.page"
              :page-sizes="[5, 10, 50, 100]"
              :page-size="searchInfo.size"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange" />
          </div> -->
        </div>
      </div>
      <div v-if="choseTab=='departmentList'" class="bussiness_show">
        <div class="bussiness_charts">
          <div class="charts_fifter">
            <div class="fifter_span agency">
              <el-radio-group v-model="radiodate" size="mini" @change="quest">
                <el-radio-button v-for="item of typedate" :label="item.time" :key="item.time" border style="margin-right:20px;">{{ item.text }}</el-radio-button>
              </el-radio-group>
              <transition name="el-fade-in-linear">
                <el-date-picker
                  v-if="ishow"
                  :clearable="false"
                  :picker-options="pickerOptions"
                  v-model="dateTime"
                  size="mini"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="dateChange"/>
              </transition>
            </div>
          </div>
          <div class="charts_block">
            <div v-if="tableDatas.length>0" id="bussinessOrg" class="echars_style"/>
            <div v-else class="echars_style no_data">
              暂无数据~
            </div>
          </div>
        </div>
        <div class="bussiness_table">
          <!-- <div class="table_title">
            新增经销商：200，跟进经销商：200
          </div> -->
          <div class="table_export">
            <search-fifter :add="false" :fifter="false" :export-all="false" :export-type="moduleType" :export-show="true" :export-name="'考勤统计'" style="display:inline-block;position: absolute;right: 10px" @exportAction="bussinessExport"/>
          </div>
          <div>
            <el-table v-if="choseTab=='departmentList'" :data="tableDatas" border>
              <el-table-column
                :key="Math.random()"
                label="部门名称"
                align="center"
                prop="name"
                min-width="100"/>
              <el-table-column
                :key="Math.random()"
                label="在职人数"
                align="center"
                prop="staffNum"
                min-width="100"/>
              <el-table-column
                :key="Math.random()"
                label="异常打卡人数"
                align="center"
                prop="yichang"
                min-width="100"/>
              <el-table-column
                :key="Math.random()"
                label="迟到"
                align="center"
                prop="chidao"
                min-width="100"/>
              <el-table-column
                :key="Math.random()"
                label="迟到早退"
                align="center"
                prop="chidaozaotui"
                min-width="100"/>
              <el-table-column
                :key="Math.random()"
                label="未打卡"
                align="center"
                prop="weidaka"
                min-width="100"/>
              <el-table-column
                :key="Math.random()"
                label="早退"
                align="center"
                prop="zaotui"
                min-width="100"/>
              <el-table-column
                :key="Math.random()"
                label="缺勤"
                align="center"
                prop="queqin"
                min-width="100"/>
              <el-table-column
                :key="Math.random()"
                label="漏签"
                align="center"
                prop="louqian"
                min-width="100"/>
              <el-table-column
                :key="Math.random()"
                label="公出未签到"
                align="center"
                prop="gongchuweiqiandao"
                min-width="100"/>
              <el-table-column
                :key="Math.random()"
                label="公出未审批"
                align="center"
                prop="gongchuweishenpi"
                min-width="100"/>
              <el-table-column
                :key="Math.random()"
                label="请假未审批"
                align="center"
                prop="qingjiaweishenpi"
                min-width="100"/>
              <el-table-column
                :key="Math.random()"
                prop="date"
                label="时间"
                align="center"
                min-width="100"/>
            </el-table>
          </div>
        </div>
      </div>
      <div v-if="choseTab=='personalList'" class="bussiness_show" style="padding:0 20px">
        <div class="bussiness_charts">
          <div class="charts_fifter">
            <div class="fifter_span agency" style="display:inline-flex;align-items: center;">
              <el-radio-group v-model="radiodate" size="mini" @change="quest">
                <el-radio-button v-for="item of typedate" :label="item.time" :key="item.time" border style="margin-right:20px;">{{ item.text }}</el-radio-button>
              </el-radio-group>
              <transition name="el-fade-in-linear">
                <el-date-picker
                  v-if="ishow"
                  :clearable="false"
                  :picker-options="pickerOptions"
                  v-model="dateTime"
                  size="mini"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="dateChange"/>
              </transition>
            </div>
            <!-- <el-cascader
              ref="orgLabel"
              :options="orgList"
              v-model="daily_org"
              :props="defaultNode"
              :show-all-levels="false"
              :change-on-select="true"
              style="width:140px"
              size="mini"
              placeholder="请选择部门"
              filterable
              @change="choseDep"/> -->
            <el-select v-model="daily_org" size="mini" filterable placeholder="请选择部门" style="width:140px" @change="choseDep">
              <el-option
                v-for="(select,index) in orgList"
                :label="select.pname+'-'+select.name"
                :value="select.id"
                :key="index"
              />
            </el-select>
          </div>
          <div class="charts_block">
            <div v-if="tableDatas.length>0" id="bussinessUser" class="echars_style"/>
            <div v-else class="echars_style no_data">
              暂无数据~
            </div>
          </div>
        </div>
        <div class="bussiness_table">
          <!-- <div class="table_title">
            新增经销商：200，跟进经销商：200
          </div> -->
          <div class="table_export">
            <search-fifter :add="false" :fifter="false" :export-all="false" :export-show="true" :export-type="moduleType" :export-name="'考勤统计'" style="display:inline-block;position: absolute;right: 10px" @exportAction="bussinessExport"/>
          </div>
          <div>
            <el-table v-if="choseTab=='personalList'" :data="tableDatas" border>
              <el-table-column
                :key="Math.random()"
                label="姓名"
                align="center"
                prop="realName"
                min-width="100"/>
              <el-table-column
                :key="Math.random()"
                label="异常次数"
                align="center"
                prop="yichang"
                min-width="100"/>
              <el-table-column
                :key="Math.random()"
                label="迟到"
                align="center"
                prop="chidao"
                min-width="100"/>
              <el-table-column
                :key="Math.random()"
                label="未打卡"
                align="center"
                prop="weidaka"
                min-width="100"/>
              <el-table-column
                :key="Math.random()"
                label="早退"
                align="center"
                prop="zaotui"
                min-width="100"/>
              <el-table-column
                :key="Math.random()"
                label="迟到早退"
                align="center"
                prop="chidaozaotui"
                min-width="100"/>
              <el-table-column
                :key="Math.random()"
                label="缺勤"
                align="center"
                prop="queqin"
                min-width="100"/>
              <el-table-column
                :key="Math.random()"
                label="漏签"
                align="center"
                prop="louqian"
                min-width="100"/>
              <el-table-column
                :key="Math.random()"
                label="公出未签到"
                align="center"
                prop="gongchuweiqiandao"
                min-width="100"/>
              <el-table-column
                :key="Math.random()"
                label="公出未审批"
                align="center"
                prop="gongchuweishenpi"
                min-width="100"/>
              <el-table-column
                :key="Math.random()"
                label="请假未审批"
                align="center"
                prop="qingjiaweishenpi"
                min-width="100"/>
              <el-table-column
                :key="Math.random()"
                prop="date"
                label="时间"
                align="center"
                min-width="100"/>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let choiceDate = ''
var echarts = require('echarts')
import { parseTime } from '@/utils/index'
import { getAttendanceDaily, exportAttendanceDaily, getAttendanceChartInfo } from '@/api/statement'
// import { getOrgList } from '@/api/system'
import {
  getExecutiveOrg
} from '@/api/public'
export default {
  name: 'BusinessStatistics',
  data() {
    return {
      choseTab: 'daily',
      radiodate: 'yesterday',
      radiotype: 'daily',
      typeList: [{
        label: '日报统计',
        name: 'daily'
      }, {
        label: '异常统计',
        name: 'abnormal'
      }],
      checkInfoCount: {
        chidao: '0',
        gongchu: '0',
        headcount: '0',
        qingjia: '0',
        queqin: '0',
        zaotui: '0'
      },
      orgList: [{
        id: '',
        name: ''
      }], // 组织架构列表
      defaultNode: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      timesize: 'hours',
      dateTime: '',
      startDate: '',
      endDate: '',
      ishow: false,
      tabList: [
        {
          label: '考勤日报',
          name: 'daily'
        }, {
          label: '考勤统计',
          name: 'checkingin'
        }, {
          label: '部门排行',
          name: 'departmentList'
        }, {
          label: '个人排行',
          name: 'personalList'
        }],
      bg_color_list: ['#36CBCB', '#3AA1FF', '#4ECB73', '#435188', '#FF9966', '#FBD437', '#975FE5', '#993366'],
      pie_color_list: ['#3aa1ff', '#fbd437', '#36cbcb', '#82dfbe', '#4ecb73', '#acdf82', '#9dd9ed', '#eaa674', '#eaa674', '#f2637b', '#dc81d2', '#975fe5', '#9f8bf0'],
      typedate: [
        { text: '昨日', time: 'yesterday' },
        { text: '近7天', time: 'sevendays' },
        { text: '近30天', time: 'thirtydays' },
        { text: '当月', time: 'month' },
        { text: '自定义', time: 'diy' }
      ],
      timeRange: [],
      tableData: [],
      tableDatas: [],
      chartsData: {
        x: [],
        data: []
      }, // 折线数据
      typePie: {},
      abnormalPie: {},
      outPie: {},
      dailyData: [],
      lineLegend: {},
      moduleType: '/statistics/statistics-agentbusinessexport',
      daily_date: new Date(),
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          choiceDate = minDate.getTime()
          if (maxDate) {
            choiceDate = ''
          }
        },
        disabledDate(time) {
          if (choiceDate != '' && choiceDate != null) {
            const one = 365 * 24 * 3600 * 1000
            const minTime = choiceDate - one
            const maxTime = choiceDate + one
            return time.getTime() < minTime || time.getTime() > maxTime || time.getTime() > Date.now()
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      daily_org: ['1'],
      num: 1,
      searchInfo: {
        page: 1,
        size: 10
      },
      total: 0
    }
  },
  mounted() {
    // this.initCharts('my')
    this.getList()
    this.getDefault()
    window.onresize = () => {
      this.initCharts(this.choseTab)
    }
  },
  created() {

  },
  beforeDestroy() {
    if (this.choseTab != 'daily') {
      if (this.choseTab == 'checkingin') {
        this.destoryEcharts(['attendanceLine', 'typeChart', 'outChart'], 4)
      } else if (this.choseTab == 'departmentList') {
        this.destoryEcharts(['bussinessOrg'], 1)
      } else if (this.choseTab == 'personalList') {
        this.destoryEcharts(['bussinessUser'], 1)
      }
    }
  },
  methods: {
    changeDate() {
      this.getList()
    },
    bussinessExport() {
      if (this.choseTab == 'daily') {
        const info = {
          type: this.radiotype,
          date: parseInt(this.daily_date / 1000),
          organizeId: this.daily_org.length > 0 ? this.daily_org[this.daily_org.length - 1] : ''
        }
        exportAttendanceDaily(info).then(res => {
          let filename = ''
          if (this.radiotype == 'daily') {
            filename = '考勤日报统计导出' + new Date().getTime()
          } else {
            filename = '考勤异常统计导出' + new Date().getTime()
          }
          var csvContent = 'data:text/csv;charset=utf-8,\ufeff'
          csvContent += res.data
          var encodedUri = encodeURI(csvContent)
          var link = document.createElement('a')
          link.setAttribute('href', encodedUri)
          link.setAttribute('download', filename + '.csv')
          document.body.appendChild(link)
          link.click()
        })
      } else if (this.choseTab != 'checkingin') {
        const info = {
          type: this.choseTab == 'departmentList' ? 'department' : 'personal',
          date: parseInt(this.daily_date / 1000),
          organizeId: this.daily_org.length > 0 ? this.daily_org[this.daily_org.length - 1] : ''
        }
        console.log(info)
        exportAttendanceDaily(info).then(res => {
          let filename = ''
          if (this.choseTab == 'departmentList') {
            filename = '部门排行导出' + new Date().getTime()
          } else {
            filename = '个人排行导出' + new Date().getTime()
          }
          var csvContent = 'data:text/csv;charset=utf-8,\ufeff'
          csvContent += res.data
          var encodedUri = encodeURI(csvContent)
          var link = document.createElement('a')
          link.setAttribute('href', encodedUri)
          link.setAttribute('download', filename + '.csv')
          document.body.appendChild(link)
          link.click()
        })
      } else {
        const info = {
          type: 'checkingin',
          date: '',
          organizeId: ''
        }
        exportAttendanceDaily(info).then(res => {
          let filename = ''
          filename = '考勤统计导出' + new Date().getTime()
          var csvContent = 'data:text/csv;charset=utf-8,\ufeff'
          csvContent += res.data
          var encodedUri = encodeURI(csvContent)
          var link = document.createElement('a')
          link.setAttribute('href', encodedUri)
          link.setAttribute('download', filename + '.csv')
          document.body.appendChild(link)
          link.click()
        })
      }
    },
    destoryEcharts(domList, length) {
      for (let i = 0; i < length; i++) {
        setTimeout(() => {
          if (document.getElementById(domList[i]) != null) {
            const echart = echarts.init(document.getElementById(domList[i]))
            echart.dispose()
          }
        }, 0)
      }
    },
    getList() {
      const that = this
      this.destoryEcharts(['attendanceLine', 'typeChart', 'outChart', 'bussinessOrg', 'bussinessUser'], 6)
      if (this.choseTab == 'daily') {
        console.log(this.daily_org)
        const info = {
          type: this.radiotype,
          date: parseInt(this.daily_date / 1000),
          organizeId: this.daily_org.length > 0 ? this.daily_org[this.daily_org.length - 1] : '',
          page: this.searchInfo.page,
          size: this.searchInfo.size
        }
        console.log(info)
        getAttendanceDaily(info).then(res => {
          console.log(res)
          if (res.code == 200) {
            that.dailyData = []
            if (this.radiotype == 'daily') {
              that.dailyData = res.data
            } else {
              that.dailyData = res.data.rows
              that.total = parseInt(res.data.total)
            }
          }
        })
      } else {
        let info = {}
        if (that.choseTab != 'personalList') {
          info = {
            type: this.choseTab,
            mode: this.radiodate,
            startDate: this.startDate,
            endDate: this.endDate,
            xtype: this.timesize
          }
        } else {
          info = {
            type: this.choseTab,
            mode: this.radiodate,
            startDate: this.startDate,
            endDate: this.endDate,
            xtype: this.daily_org.length > 0 ? this.daily_org[this.daily_org.length - 1] : ''
          }
        }
        console.log(info)
        console.log(this.daily_org)
        getAttendanceChartInfo(info).then(res => {
          if (res.code == 200) {
            that.tableData = []
            that.tableDatas = []
            that.chartsData = {
              x: [],
              data: []
            }
            that.typePie = {}
            that.abnormalPie = {}
            that.outPie = {}
            if (that.choseTab == 'checkingin') {
              that.checkInfoCount = res.data.checkInfoCount
              // 表格数据
              that.tableData = res.data.checkinList.rows
              // 处理折线图数据
              const lineData = res.data.checkInfoData
              // 折现x轴图例checkChartName
              that.lineLegend = res.data.checkChartName
              for (const i in lineData) {
                if (i == 'date') {
                  that.chartsData.x = lineData[i]
                } else if (i != 'chuqin') {
                  that.chartsData.data.push({ key: i, value: lineData[i] })
                }
              }
              for (const i in that.chartsData.data) {
                for (const j in that.lineLegend) {
                  if (j == that.chartsData.data[i].key) {
                    that.chartsData.data[i].name = that.lineLegend[j]
                  }
                }
              }
              // 处理饼图数据 考勤类型checkPieChart，异常占比checkAbnormalPieChart 公出和请假checkPieChartVV
              // typePie  abnormalPie outPie
              that.typePie = res.data.pieData.checkPieChart
              that.abnormalPie = res.data.pieData.checkAbnormalPieChart
              that.outPie = res.data.pieData.checkPieChartVV
              console.log(that.chartsData)
              that.initCharts(that.choseTab)
            } else {
              //  if(that.choseTab=='departmentList'||that.choseTab=='personalList')
              // 个人排行和部门排行
              let info = []
              if (that.choseTab == 'departmentList') {
                info = res.data.departmentList
                if (info.length > 0) {
                // 处理表格数据
                  that.tableDatas = res.data.departmentList
                  // that.chartsData.data.push({key:info[i].yichang, name:'总异常', data:[]})
                  for (let i = 0; i < info.length; i++) {
                    that.chartsData.x.push(info[i].name)
                  }
                  for (let i = 0; i < that.chartsData.x.length; i++) {
                    if (i % 2 != 0) {
                      that.chartsData.x[i] = '\n' + that.chartsData.x[i]
                    }
                  }
                  console.log(that.chartsData.x)
                  that.chartsData.data = [
                  // { name: '总异常', key: 'yichang', data: [] },
                    { name: '迟到', key: 'chidao', data: [] },
                    { name: '早退', key: 'zaotui', data: [] },
                    { name: '请假未审批', key: 'qingjiaweishenpi', data: [] },
                    { name: '缺勤', key: 'queqin', data: [] },
                    { name: '公出未审批', key: 'gongchuweishenpi', data: [] },
                    { name: '未打卡', key: 'weidaka', data: [] },
                    { name: '漏签', key: 'louqian', data: [] }
                  ]
                  console.log(that.chartsData)
                  for (const j in info) {
                    for (const k in info[j]) {
                      for (const i in that.chartsData.data) {
                        if (that.chartsData.data[i].key == k) {
                          that.chartsData.data[i].data.push(info[j][k])
                        }
                      }
                    }
                  }
                  console.log(that.chartsData)
                  that.initCharts(that.choseTab)
                } else {
                  that.destoryEcharts(['bussinessOrg'], 1)
                  that.tableDatas = []
                }
              } else {
                info = res.data.personalList
                if (info.length > 0) {
                // 处理表格数据
                  that.tableDatas = res.data.personalList
                  // that.chartsData.data.push({key:info[i].yichang, name:'总异常', data:[]})
                  for (let i = 0; i < info.length; i++) {
                    that.chartsData.x.push(info[i].realName)
                  }
                  for (let i = 0; i < that.chartsData.x.length; i++) {
                    if (i % 2 != 0) {
                      that.chartsData.x[i] = '\n' + that.chartsData.x[i]
                    }
                  }
                  that.chartsData.data = [
                  // { name: '总异常', key: 'yichang', data: [] },
                    { name: '迟到', key: 'chidao', data: [] },
                    { name: '早退', key: 'zaotui', data: [] },
                    { name: '请假未审批', key: 'qingjiaweishenpi', data: [] },
                    { name: '缺勤', key: 'queqin', data: [] },
                    { name: '公出未审批', key: 'gongchuweishenpi', data: [] },
                    { name: '未打卡', key: 'weidaka', data: [] },
                    { name: '漏签', key: 'louqian', data: [] }
                  ]
                  console.log(that.chartsData)
                  for (const j in info) {
                    for (const k in info[j]) {
                      for (const i in that.chartsData.data) {
                        if (that.chartsData.data[i].key == k) {
                          that.chartsData.data[i].data.push(info[j][k])
                        }
                      }
                    }
                  }
                  console.log(that.chartsData)
                  that.initCharts(that.choseTab)
                } else {
                  that.destoryEcharts(['bussinessUser'], 1)
                  that.tableDatas = []
                }
              }
            }
          }
        })
      }
    },
    getDefault() {
      const that = this
      getExecutiveOrg().then(res => {
        if (res.code === 200 || res.code === '200') {
          // const arr = res.data.organize
          // that.formatDep(arr)
          that.orgList = res.data
          console.log(that.orgList)
        }
      })
    },
    formatDep(data) {
      data.forEach(e => {
        if (e.child && e.child.length > 0) {
          e.children = e.child
        }
        if (e.child.length > 0 && this.num < 4) {
          this.num++
          this.formatDep(e.child)
        } else {
          this.num = 1
        }
      })
    },
    choseTabsType(value) {
      this.destoryEcharts(['attendanceLine', 'typeChart', 'outChart', 'bussinessOrg', 'bussinessUser'], 6)
      this.dateTime = ''
      this.ishow = false
      setTimeout(() => {
        this.choseTab = value
        this.daily_org = ['1']
        if (this.choseTab == 'personalList') {
          this.typedate = [
            { text: '近7天', time: 'sevendays' },
            { text: '近30天', time: 'thirtydays' },
            { text: '当月', time: 'month' },
            { text: '自定义', time: 'diy' }
          ]
          this.radiodate = 'sevendays'
          this.timesize = this.daily_org.length > 0 ? this.daily_org[this.daily_org.length - 1] : ''
        } else {
          this.typedate = [
            { text: '昨日', time: 'yesterday' },
            { text: '近7天', time: 'sevendays' },
            { text: '近30天', time: 'thirtydays' },
            { text: '当月', time: 'month' },
            { text: '自定义', time: 'diy' }
          ]
          this.radiodate = 'yesterday'
          if (this.choseTab == 'departmentList') {
            this.timesize = ''
          }
          if (this.choseTab == 'checkingin') {
            this.timesize = 'day'
            this.timeRange = [
              { text: '日', time: 'day' }
            ]
          }
        }
        this.tableData = []
        this.getList()
      // this.initCharts(value)
      }, 50)
    },
    initCharts(value) {
      const that = this
      if (value == 'checkingin') {
        const optionList = []
        const ids = []
        // 考勤统计
        const legend = []
        for (const i in that.chartsData.data) {
          legend.push(that.chartsData.data[i].name)
        }
        const line_option = {
          title: {
            text: '考勤统计'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: legend,
            left: 'center',
            bottom: '1%'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: that.chartsData.x
          },
          yAxis: {
            type: 'value',
            splitLine: { lineStyle: { type: 'dashed' }}
          },
          series: []
        }
        let k = 0
        for (const i in that.chartsData.data) {
          line_option.series.push({ name: that.chartsData.data[i].name, type: 'line', smooth: true, data: that.chartsData.data[i].value, itemStyle: { color: this.bg_color_list[k] }})
          ++k
        }
        optionList.push(line_option)
        ids.push('attendanceLine')
        // 考勤类型
        let type_option = {}
        const ledged = []
        const data = []
        for (const i in that.typePie) {
          ledged.push(that.typePie[i].status)
          data.push({ name: that.typePie[i].status, value: that.typePie[i].value })
        }
        type_option = {
          title: [{
            text: '考勤类型'
          }],
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          legend: {
            bottom: '5%',
            data: []
          },
          series: []
        }
        type_option.legend.data = ledged
        type_option.series.push({
          name: '考勤类型',
          type: 'pie',
          radius: '50%',
          data: data,
          label: {
            normal: {
              formatter: '{b}:{d}%'
            }
          },
          itemStyle: {
            normal: {
              color: function(params) {
                // 自定义颜色
                var colorList = that.pie_color_list
                return colorList[params.dataIndex]
              }
            },
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        })
        optionList.push(type_option)
        ids.push('typeChart')
        // 异常类型
        // let abnormal_option = {}
        // const ledged1 = []
        // const data1 = []
        // for (const i in that.abnormalPie) {
        //   ledged1.push(that.abnormalPie[i].name)
        //   data1.push({ name: that.abnormalPie[i].name, value: that.abnormalPie[i].totalAbnormalCount })
        // }
        // abnormal_option = {
        //   title: [{
        //     text: '考勤异常数据占比'
        //   }],
        //   tooltip: {
        //     trigger: 'item',
        //     formatter: '{b} : {c} ({d}%)'
        //   },
        //   legend: {
        //     bottom: '5%',
        //     data: []
        //   },
        //   series: []
        // }
        // abnormal_option.legend.data = ledged1
        // abnormal_option.series.push({
        //   name: '考勤类型',
        //   type: 'pie',
        //   radius: '55%',
        //   center: ['50%', '40%'],
        //   data: data1,
        //   label: {
        //     normal: {
        //       formatter: '{b}:{d}%'
        //     }
        //   },
        //   itemStyle: {
        //     normal: {
        //       color: function(params) {
        //         // 自定义颜色
        //         var colorList = that.pie_color_list
        //         return colorList[params.dataIndex]
        //       }
        //     },
        //     emphasis: {
        //       shadowBlur: 10,
        //       shadowOffsetX: 0,
        //       shadowColor: 'rgba(0, 0, 0, 0.5)'
        //     }
        //   }
        // })
        // optionList.push(abnormal_option)
        // ids.push('abnormalChart')
        // 公出和请假
        let out_option = {}
        const ledged2 = []
        const data2 = []
        for (const i in that.outPie) {
          ledged2.push(that.outPie[i].status)
          data2.push({ name: that.outPie[i].status, value: that.outPie[i].value })
        }
        // 经销商等级
        out_option = {
          title: [{
            text: '公出和请假'
          }],
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          legend: {
            bottom: '5%',
            data: []
          },
          series: []
        }
        out_option.legend.data = ledged2
        out_option.series.push({
          name: '公出和请假',
          type: 'pie',
          radius: '50%',
          data: data2,
          label: {
            normal: {
              formatter: '{b}:{d}%'
            }
          },
          itemStyle: {
            normal: {
              color: function(params) {
                // 自定义颜色
                var colorList = that.pie_color_list
                return colorList[params.dataIndex]
              }
            },
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        })
        optionList.push(out_option)
        ids.push('outChart')
        this.drawEcharts(ids, optionList, optionList.length)
      } else if (value == 'departmentList') {
        // 部门统计
        const legend = []
        for (const i in this.chartsData.data) {
          legend.push(that.chartsData.data[i].name)
        }
        const org_option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            top: 0,
            left: 100
          },
          legend: {
            data: legend,
            bottom: 0,
            left: 'center'
          },
          xAxis: {
            type: 'category',
            'axisLabel': { 'interval': 0 },
            data: this.chartsData.x
          },
          yAxis: {
            type: 'value',
            splitLine: { lineStyle: { type: 'dashed' }}
          },
          series: []
        }
        for (let i = 0; i < this.chartsData.data.length; i++) {
          org_option.series.push({
            itemStyle: {
              color: this.bg_color_list[i]
            },
            barWidth: '10',
            name: this.chartsData.data[i].name,
            type: 'bar',
            stack: '部门统计',
            data: this.chartsData.data[i].data
          })
        }
        console.log(org_option)
        this.drawEcharts(['bussinessOrg'], [org_option], 1)
      } else {
        // 个人top10
        // 部门统计
        const legend1 = []
        for (const i in this.chartsData.data) {
          legend1.push(that.chartsData.data[i].name)
        }
        const user_option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            top: 0,
            left: 100
          },
          legend: {
            data: legend1,
            bottom: 0,
            left: 'center'
          },
          xAxis: {
            type: 'category',
            'axisLabel': { 'interval': 0 },
            data: this.chartsData.x
          },
          yAxis: {
            type: 'value',
            splitLine: { lineStyle: { type: 'dashed' }}
          },
          series: []
        }
        for (let i = 0; i < this.chartsData.data.length; i++) {
          user_option.series.push({
            itemStyle: {
              color: this.bg_color_list[i]
            },
            barWidth: '10',
            name: this.chartsData.data[i].name,
            type: 'bar',
            stack: '个人统计',
            data: this.chartsData.data[i].data
          })
        }
        this.drawEcharts(['bussinessUser'], [user_option], 1)
      }
    },
    drawEcharts(domList, optionsList, length) {
      for (let i = 0; i < length; i++) {
        setTimeout(() => {
          const echart = echarts.init(document.getElementById(domList[i]))
          if (echart) {
            echart.resize()
          }
          echart.clear()
          echart.setOption(optionsList[i])
        }, 50)
      }
    },
    choseDaily(tab) {
      console.log(tab)
      this.dailyData = []
      this.total = 0
      this.getList()
    },
    choseDep(value) {
      console.log(value)
      console.log(this.daily_org)
      this.dailyData = []
      this.total = 0
      this.getList()
    },
    quest(tab) {
      // 判断是哪个时间段的信息
      this.startDate = ''
      this.endDate = ''
      if (tab === 'yesterday') {
        this.ishow = false
        this.radiodate = 'yesterday'
        this.timeRange = [
          { text: '日', time: 'day' }
        ]
        if (this.choseTab == 'departmentList') {
          this.timesize = ''
        } else if (this.choseTab == 'personalList') {
          this.timesize = this.daily_org.length > 0 ? this.daily_org[this.daily_org.length - 1] : ''
        } else if (this.choseTab == 'checkingin') {
          this.timesize = 'day'
        }
        this.getList()
      } else if (tab === 'sevendays') {
        this.ishow = false
        this.radiodate = 'sevendays'
        this.timesize = 'day'
        this.timeRange = [
          { text: '日', time: 'day' }
        ]
        if (this.choseTab == 'departmentList') {
          this.timesize = ''
        } else if (this.choseTab == 'personalList') {
          this.timesize = this.daily_org.length > 0 ? this.daily_org[this.daily_org.length - 1] : ''
        }
        this.getList()
      } else if (tab === 'thirtydays') {
        this.ishow = false
        this.radiodate = 'thirtydays'
        this.timeRange = [
          { text: '日', time: 'day' }
        ]
        this.timesize = 'day'
        if (this.choseTab == 'departmentList') {
          this.timesize = ''
        } else if (this.choseTab == 'personalList') {
          this.timesize = this.daily_org.length > 0 ? this.daily_org[this.daily_org.length - 1] : ''
        }
        this.getList()
      } else if (tab === 'month') {
        this.ishow = false
        this.radiodate = 'month'
        this.timesize = 'day'
        this.timeRange = [
          { text: '日', time: 'day' }
        ]
        if (this.choseTab == 'departmentList') {
          this.timesize = ''
        } else if (this.choseTab == 'personalList') {
          this.timesize = this.daily_org.length > 0 ? this.daily_org[this.daily_org.length - 1] : ''
        }
        this.getList()
      } else {
        this.ishow = true
        this.dateTime = ''
      }
    },
    dateChange(date) {
      const that = this
      if (date) {
        const start = new Date(date[0])
        const end = new Date(date[1])
        const tend = parseInt(end / (24 * 3600000))
        const tstart = parseInt(start / (24 * 3600000))
        const ttime = tend - tstart
        if (ttime > 365) {
          that.$message({
            showClose: true,
            message: '时间跨度不可以超过365天，请重新选择',
            type: 'warning'
          })
        } else {
          this.radiodate = 'diy'
          if (ttime > 60) {
            this.timesize = 'month'
            this.timeRange = [
              { text: '月', time: 'month' }
            ]
          } else {
            this.timesize = 'day'
            this.timeRange = [
              { text: '日', time: 'day' }
            ]
          }
          this.startDate = parseInt(new Date(parseTime(start.getTime(), '{y}-{m}-{d}') + ' 00:00:00') / 1000)
          this.endDate = parseInt(new Date(parseTime(end.getTime(), '{y}-{m}-{d}') + ' 23:59:59') / 1000)
          this.getList()
        }
      } else {
        console.log('没有任何日期')
      }
    },
    handleSizeChange(val) {
      console.log(val, 'aslkdjad分页在这里')
      this.searchInfo.page = 1
      this.searchInfo.size = val
      this.dailyData = []
      this.getList()
    },
    handleCurrentChange(val) {
      this.searchInfo.page = val
      this.getList()
    }
  }
}

</script>
<style lang="less" scoped>
  .bussiness_bg {
    position: absolute;
    width: 100%;
    top: 0;

    .bussiness_tab {
      height: 49px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0 10px;
      background: #fff;
      margin-bottom: 10px;

      span {
        font-family: '微软雅黑 Bold', '微软雅黑';
        font-weight: 700;
        font-style: normal;
        color: #666666;
        font-size: 13px;
        padding: 0 10px;

        &:hover {
          color: #3C8EE9;
          cursor: pointer;
        }
      }

      .activity_tab {
        color: #3C8EE9;
      }
    }
    .bussiness_scroll{
     height: calc( 100vh - 160px );
     overflow-y: scroll;
     background: #fff;

    .bussiness_show {
        background: #fff;
        padding: 20px;
      .bussiness_card_list {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 20px;

        .bussiness_card {
          display: inline-flex;
          align-items: center;
          border: 1px solid rgba(228, 228, 228, 1);
          min-width: 130px;
          padding: 8px 14px;
          margin-right: 8px;
          height: 54px;

          .card_icon {
            .svg-icon {
              color: #3C8EE9;
              font-size: 34px;
            }
            margin-right: 8px;
          }
          .card_tips{
              p{
                  padding: 0;
                  margin: 0;
              }
              .title{
                color: #666666;
                font-size: 14px;
              }
              .num{
                color: #3C8EE9;
                padding-top: 2px;
                padding-left: 2px;
              }
          }
        }

      }
      .bussiness_charts{
        overflow: hidden;
        .charts_fifter{
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 60px;
            .fifter_span{
            height: 60px;

            }
            .fifter_select{
                width: 200px;
                text-align: right;
            height: 60px;

                span{
                    font-size: 12px;
                    color: #666666;
                    display: inline-block;
                    width: 80px;
                }
            }
        }
        .charts_block{
          width: 100%;
          min-height: 360px;
          // height: 620px;
          .echars_style{
            height: 360px;
            overflow: auto;
            background:#fff;
          }
          .echars_style_short{
            width: 50%;
            float: left;
            height: 340px;
          }
        }
      }
      .bussiness_table{
        padding-bottom: 40px;
        .table_title{
          text-align:center;
          color: #333333;
          font-size:14px;
          margin-top:40px;
        }
        .table_export{
          height:50px;
          position: relative;
          .daily_fifter{
            position: absolute;
            left: 10px;
          }
        }
      }
    }
    }

  }

</style>
