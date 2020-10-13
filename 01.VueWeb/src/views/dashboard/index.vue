<template>
  <div v-loading="loading" class="dashboard-container">
    <el-row :gutter="10" class="dashboard_row">
      <el-col :span="24">
        <div class="grid-content bg-purple">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix title">
              <span class="title_color">最近</span>
              <el-tabs v-model="activeTab" class="tabs_line_card" @tab-click="choseSales">
                <el-tab-pane v-for="(item,index) in tabsList" :key="index" :label="item.label" :name="item.name"/>
              </el-tabs>
            </div>
            <div class="text">
              <el-table :data="tabsData" border tooltip-effect="light" >
                <el-table-column :label="activeTab == 'proxy'?'商机名称':'经销商名称'" prop="name" min-width="100" show-overflow-tooltip>
                  <template slot-scope="scope">{{ scope.row.business_name }}</template>
                </el-table-column>
                <el-table-column prop="name" label="姓名" min-width="100" show-overflow-tooltip>
                  <template slot-scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column prop="sex" label="性别" min-width="50">
                  <template slot-scope="scope">{{ scope.row.sex==1?'男':'女' }}</template>
                </el-table-column>
                <el-table-column prop="phone" label="联系方式" min-width="100" show-overflow-tooltip/>
                <el-table-column prop="wechat" label="微信号" min-width="100" show-overflow-tooltip/>
                <el-table-column prop="qq" label="QQ" min-width="100" show-overflow-tooltip/>
                <el-table-column prop="email" label="邮箱" min-width="100" show-overflow-tooltip/>
                <el-table-column prop="source" label="来源" show-overflow-tooltip min-width="100"/>
                <el-table-column prop="salesId" label="归属人" min-width="100" show-overflow-tooltip/>
                <el-table-column prop="createdBy" label="创建人" min-width="100" show-overflow-tooltip/>
                <el-table-column prop="appointDate" label="指派时间" min-width="140" show-overflow-tooltip/>
                <el-table-column prop="cDate" label="上次跟进时间" min-width="140" show-overflow-tooltip/>
              </el-table>
            </div>
            <div class="more" >
              <span @click="fintMore"><span>查看更多<i class="el-icon-arrow-right"/></span></span>
            </div>
            <!-- <div v-if="tabsData.length<=0" class="more">
              <span>暂无数据~</span>
            </div> -->
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="dashboard_row">
      <el-col :span="12" :offset="0">
        <div class="grid-content bg-purple">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix title">
              <span class="title_color">待办理事务</span>
            </div>
            <div class="item">
              <div class="block" @click="change('4')">
                <p :class="{active:matterList.workflowinfocount.count>0}" class="num ">{{ matterList.workflowinfocount.count }}</p>
                <p class="num_text">待审核单据</p>
              </div>
              <!-- <div class="block" @click="change('5')">
                <p :class="{active:matterList.agentassigncount.count>0}" class="num">{{ matterList.agentassigncount.count }}</p>
                <p class="num_text">待跟进经销商</p>
              </div> -->
              <div class="block" @click="change('5')">
                <p :class="{active:matterList.businesscount.count>0}" class="num">{{ matterList.businesscount.count }}</p>
                <p class="num_text">待跟进商机</p>
              </div>
              <div class="block" @click="change('6')">
                <p :class="{active:matterList.agentbusinesspubliccount.count>0}" class="num">{{ matterList.agentbusinesspubliccount.count!=null?matterList.agentbusinesspubliccount.count:0 }}</p>
                <p class="num_text">即将流入公海商机</p>
              </div>
              <div class="block" @click="change('7')">
                <p :class="{active:matterList.complaininfocount.count>0}" class="num">{{ matterList.complaininfocount.count }}</p>
                <p class="num_text">待处理投诉</p>
              </div>
            </div>
          </el-card>
        </div>
        <div class="grid-content bg-purple" style="min-height:200px">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="title space_between">
              <span class="title_color">公告动态</span>
              <span class="title_more" @click="skip('inform')">查看更多<i class="el-icon-arrow-right"/></span>
            </div>
            <div v-if="tableData.length>0" class="text item">
              <ul class="notice_list" style="min-height: 118px;">
                <li v-for="(item,index) in tableData" :key="index" @click="showInfo(item)">
                  <span class="notice_title">{{ item.title }}</span>
                  <span class="notice_user">{{ item.createdBy }}</span>
                  <span class="notice_time">{{ item.createdDate }}</span>
                </li>
              </ul>
            </div>
            <div v-if="tableData.length<=0" class="more">
              <span>暂无数据~</span>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col v-if="carStep.length>0" :span="12" style="min-height:350px">
        <div class="grid-content bg-purple">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="title space_between">
              <span class="title_color">事项通知</span>
              <span class="title_more" @click="skip('progress')">查看更多<i class="el-icon-arrow-right"/></span>
            </div>
            <div v-if="matter.length!==0" class="text progressBar" style="min-height:270px">
              <div v-for="(item,index) of carStep" :key="index" class="progressBar_first" style="margin-bott om:15px;">
                <div class="proClear">
                  <span class="proCode">事项{{ index==0?'一':'二' }}</span>
                  <span class="proTitle">{{ item.title }}</span>
                  <span class="propub">发起人:{{ item.createdBy }}</span>
                </div>
                <div class="progress_barInfo" style="margin-top:26px;">
                  <my-steps :active="activeStep" class="view_step" align-center>
                    <my-step
                      v-for="(item,index) of item.nodeList"
                      :status="item.status>1?(item.status==2?'process':'success'):'wait'"
                      :title="item.name"
                      :key="index"
                      :tip-user="item.status>1?(item.status==2?'进行中':'已完成'):'未开始'"
                      :tip-time="item.overtime"
                      :tip-text="item.remark"
                      :user-text="'状态'"
                      :time-text="'完成时间'"
                      :remark-text="'备注说明'"
                      :hover-status="item.status>1?false:true"/>
                  </my-steps>
                </div>
              </div>
            </div>
            <div v-else class="more" style="min-height:261px">
              <span>暂无通知~</span>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="dashboard_row">
      <!-- 销售简报 -->
      <el-col v-if="easyList.isShow" :span="24">
        <div class="grid-content bg-purple">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="title space_between">
              <span class="title_color">销售简报</span>
              <el-tabs v-model="activeSaleTab" class="tabs_line_card" @tab-click="changeCharts('easy')">
                <el-tab-pane v-for="(item,index) in salesList" :key="index" :label="item.label" :name="item.name"/>
              </el-tabs>
            </div>
            <div class="sale_summary">
              <ul class="sale_block">
                <li>
                  <div class="sale_icon" style="background:rgba(88, 163, 247, 1)">
                    <svg-icon icon-class="index_01"/>
                  </div>
                  <div class="sale_info">
                    <p class="tips">新增商机（个）</p>
                    <p style="padding-left:10px;">{{ easyList.addBusiness }}</p>
                  </div>
                </li>
                <li>
                  <div class="sale_icon" style="background:rgba(82, 193, 245, 1)"><svg-icon icon-class="index_01"/></div>
                  <div class="sale_info">
                    <p class="tips">新增经销商（个）</p>
                    <p style="padding-left:10px;">{{ easyList.addAgent }}</p>
                  </div>
                </li>
                <li>
                  <div class="sale_icon" style="background:rgba(75, 206, 208, 1)"><svg-icon icon-class="index_02"/></div>
                  <div class="sale_info">
                    <p class="tips">商机跟进（次）</p>
                    <p style="padding-left:10px;">{{ easyList.assignBusiness }}</p>
                  </div>
                </li>
                <li>
                  <div class="sale_icon" style="background:rgba(251, 98, 96, 1)"><svg-icon icon-class="index_03"/></div>
                  <div class="sale_info">
                    <p class="tips">经销商跟进（个）</p>
                    <p style="padding-left:10px;">{{ easyList.assignAgent }}</p>
                  </div>
                </li>
              </ul>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="dashboard_row charts">
      <!-- 商机跟进 -->
      <el-col v-if="bussinessData.isShow" :span="24">
        <div class="grid-content bg-purple">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="title space_between">
              <span class="title_color">商机跟进<span>（近30天）</span></span>
              <!-- <el-date-picker
                v-model="date"
                :picker-options="pickerOptions"
                style="width:230px"
                size="mini"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="一"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/> -->
            </div>
            <div class="charts_line">
              <div v-if="bussinessData.hasCharts" id="business_follow" class="echars_style"/>
              <div v-else class="echars_style more" style="margin-top:0;padding-top: 100px;">
                暂无数据~
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
      <!-- 部门商机排行榜 -->
      <el-col v-if="orgbussinessData.isShow" :span="12">
        <div class="grid-content bg-purple">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="title space_between">
              <span class="title_color">部门商机排行榜Top10<span>（近15天）</span></span>
              <!-- <el-date-picker
                v-model="date"
                :picker-options="pickerOptions"
                style="width:230px"
                size="mini"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="一"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/> -->
            </div>
            <div class="charts_line">
              <div v-if="orgbussinessData.hasCharts" id="org_business" class="echars_style"/>
              <div v-else class="echars_style more" style="margin-top:0;padding-top: 100px;">
                暂无数据~
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
      <!-- 个人商机Top10 -->
      <el-col v-if="userbussinessData.isShow" :span="12">
        <div class="grid-content bg-purple">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="title space_between">
              <span class="title_color">个人商机排行榜Top10<span>（近15天）</span></span>
              <!-- <el-date-picker
                v-model="date"
                :picker-options="pickerOptions"
                style="width:230px"
                size="mini"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="一"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/> -->
            </div>
            <div class="charts_line">
              <div v-if="userbussinessData.hasCharts" id="business_top" class="echars_style"/>
              <div v-else class="echars_style more" style="margin-top:0;padding-top: 100px;">
                暂无数据~
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
      <!-- 经销商来源 -->
      <el-col v-if="sourceData.isShow" :span="12">
        <div class="grid-content bg-purple">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="title space_between">
              <span class="title_color">经销商来源<span>（全部）</span></span>
              <!-- <el-date-picker
                v-model="date"
                :picker-options="pickerOptions"
                style="width:230px"
                size="mini"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="一"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/> -->
            </div>
            <div class="charts_line">
              <div v-if="sourceData.hasCharts" id="bussiness_source" class="echars_style"/>
              <div v-else class="echars_style more" style="margin-top:0;padding-top: 100px;">
                暂无数据~
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
      <!-- 经销商等级 -->
      <el-col v-if="levelData.isShow" :span="12">
        <div class="grid-content bg-purple">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="title space_between">
              <span class="title_color">经销商等级<span>（全部）</span></span>
              <!-- <el-date-picker
                v-model="date"
                :picker-options="pickerOptions"
                style="width:230px"
                size="mini"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="一"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/> -->
            </div>
            <div class="charts_line">
              <div v-if="levelData.hasCharts" id="agent_level" class="echars_style"/>
              <div v-else class="echars_style more" style="margin-top:0;padding-top: 100px;">
                暂无数据~
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
      <!-- 经销商标签 -->
      <el-col v-if="tagData.isShow" :span="12">
        <div class="grid-content bg-purple">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="title space_between">
              <span class="title_color">经销商标签<span>（全部）</span></span>
              <!-- <el-date-picker
                v-model="date"
                :picker-options="pickerOptions"
                style="width:230px"
                size="mini"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="一"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/> -->
            </div>
            <div class="charts_line">
              <div v-if="tagData.hasCharts" id="agent_label" class="echars_style"/>
              <div v-else class="echars_style more" style="margin-top:0;padding-top: 100px;">
                暂无数据~
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
      <!-- 经销商统计 -->
      <el-col v-if="proxyData.isShow" :span="12">
        <div class="grid-content bg-purple">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="title space_between">
              <span class="title_color">经销商统计<span>（近15天）</span></span>
              <!-- <el-date-picker
                v-model="date"
                :picker-options="pickerOptions"
                style="width:230px"
                size="mini"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="一"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/> -->
            </div>
            <div class="charts_line">
              <div v-if="proxyData.hasCharts" id="agent_statistics" class="echars_style"/>
              <div v-else class="echars_style more" style="margin-top:0;padding-top: 100px;">
                暂无数据~
              </div>
            </div>
          </el-card>
        </div>
      </el-col>

    </el-row>
    <el-dialog :visible.sync="modelShow" title="查看" width="860px" @close="resetModel" >
      <!-- <div class="view_report">
        <div class="show_scroll2">
          <div class="view_line">
            <span class="line_title">标题：</span>
            <span class="first_line">{{ viewForm.title }}</span>
          </div>
          <div class="view_line">
            <span class="line_title">发布人：</span>
            <span class="second_line">{{ viewForm.createdBy }}</span>
          </div>
          <div class="view_line">
            <span class="line_title">发布时间：</span>
            <span class="small_font">{{ viewForm.createdDate }}</span>
          </div>
          <div class="view_line">
            <span class="line_title">公告内容：</span>
            <span class="rich_show ql-snow" v-html="viewForm.content">{{ viewForm.content }}</span>
          </div>
          <div class="view_line">
            <span class="line_title">针对部门：</span>
            <span v-if="viewForm.organizeName!=''" class="small_font">{{ viewForm.organizeName }}</span>
            <span v-else class="small_font">全部部门</span>
          </div>
          <div v-if="viewForm.file[0].name !== ''" class="view_line">
            <span class="line_title">附件：</span>
            <a href="http://baodu.com"/>
            <span v-if="viewForm.file.length>0" class="download_style">
              <a :href="pathUrl + viewForm.file[0].url" download="" target="_blank">{{ viewForm.file[0].name }}</a>
            </span>
            <span v-if="viewForm.file.length==0"/>
          </div>
        </div>
      </div> -->
      <el-scrollbar class="fixed_scroll over_scroll">
        <table class="view_dialog view_dialog_find" cellpadding="0" cellspacing="0">
          <tr class="view_line">
            <td class="line_title">标题：</td>
            <td class="second_line">{{ viewForm.title }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">发布人：</td>
            <td class="second_line">{{ viewForm.createdBy }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">发布时间：</td>
            <td class="second_line">{{ viewForm.createdDate }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">公告内容：</td>
            <td class="rich_show ql-snow second_line" v-html="viewForm.content">{{ viewForm.content }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">针对部门：</td>
            <td v-if="viewForm.organizeName!=''" class="second_line">{{ viewForm.organizeName }}</td>
            <td v-else class="second_line">全部部门</td>
          </tr>
          <tr v-if="viewForm.file.length>0" class="view_line">
            <td class="line_title">附件：</td>
            <td v-if="viewForm.file.length>0" class="download_style second_line">
              <a v-for="(item,index) in viewForm.file" :key="index" :href="pathUrl + item.url" download="" target="_blank" class="file_a file_a_long">{{ item.name }}</a>
            </td>
            <td v-if="viewForm.file.length==0"/>
          </tr>
        </table>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modelShow=false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
var echarts = require('echarts')
import { parseTime } from '@/utils/index'
import {
  getindexinfo,
  getBusinessFollow,
  getIndexChartsInfo
} from '@/api/statement'
import {
  viewReport
} from '@/api/office'
export default {
  name: 'Dashboard',
  data() {
    return {
      fifter_type: '',
      fifter_data: '',
      activeTab: 'proxy',
      activeSaleTab: 'today',
      activeTypeTab: 'seven',
      date: '',
      bussinessType: [{ label: '七日内', name: 'seven' }, { label: '半年内', name: 'half_year' }, { label: '一年内', name: 'year' }],
      tabsList: [{ label: '跟进商机', name: 'proxy' }, { label: '跟进经销商', name: 'follow' }],
      salesList: [{ label: '今日', name: 'today' }, { label: '本周', name: 'week' }, { label: '本月', name: 'month' }, { label: '本季', name: 'quarter' }, { label: '本年', name: 'year' }],
      easyList: { addAgent: 0, addBusiness: 0, assignAgent: 0, assignBusiness: 0, isShow: false }, // 销售简报
      bg_color_list: ['#36CBCB', '#3AA1FF', '#4ECB73', '#435188', '#FF9966', '#FBD437', '#975FE5', '#993366'],
      pie_color_list: ['#3aa1ff', '#fbd437', '#36cbcb', '#82dfbe', '#4ecb73', '#acdf82', '#9dd9ed', '#eaa674', '#eaa674', '#f2637b', '#dc81d2', '#975fe5', '#9f8bf0'],
      orgbussinessData: {
        data: [],
        legend: [],
        xAxis: [],
        isShow: false,
        hasCharts: false
      }, // 新增商机
      userbussinessData: {
        data: [],
        legend: [],
        xAxis: [],
        isShow: false,
        hasCharts: false
      }, // 新增商机
      bussinessData: {
        data: [],
        legend: [],
        xAxis: [],
        isShow: false,
        hasCharts: false
      }, // 商机跟进
      proxyData: {
        data: [],
        legend: [],
        xAxis: [],
        isShow: false,
        hasCharts: false
      }, // 经销商统计
      sourceData: {
        data: [],
        legend: [],
        isShow: false,
        hasCharts: false
      }, // 商机来源
      levelData: {
        data: [],
        legend: [],
        isShow: false,
        hasCharts: false
      }, // 经销商等级
      tagData: {
        data: [],
        legend: [],
        isShow: false,
        hasCharts: false
      }, // 经销商标签
      pathUrl: process.env.FILE_API,
      showColor: false,
      showNumber: false,
      showNumber1: false,
      modelShow: false,
      matter: [],
      activeStep: 0,
      createBy: '',
      loading: true,
      carStep: [{ title: '', createdBy: '', nodeList: [] }], // 步骤条
      tabsData: [],
      tableData: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      searchInfo: {
        mode: 'sevendays',
        startDate: '', // 类型
        type: 'agentbusiness',
        endDate: ''
      },
      viewForm: {
        file: [{ name: '', url: '' }]
      },
      matterList: {
        performanceInfo: {},
        dailyInfo: {},
        surveyInfo: {},
        complaininfocount: { count: 0 },
        agentbusinesspubliccount: { count: 0 },
        agentassigncount: { count: 0 },
        businesscount: { count: 0 },
        workflowinfocount: { count: 0 }
      }
    }
  },
  created() {
    // console.log(this.$route)
  },
  beforeDestroy() {
    window.onresize = ''
    const domList = ['org_business', 'business_top', 'my_business', 'bussiness_source', 'agent_level', 'agent_label', 'agent_statistics', 'business_follow']
    this.destoryEcharts(domList)
  },
  mounted() {
    // console.log(window.localStorage.getItem('reload'))
    // if (window.localStorage.getItem('reload') === '1') {
    //   window.location.reload()
    //   window.localStorage.setItem('reload', '0')
    // }
    console.log(this.btnPermission('agentcount_latelist'))
    if (this.btnPermission('agentcount_latelist')) {
      this.getList()
    }
    if (this.btnPermission('agentcount_busienss') || this.btnPermission('agentcount_easy') || this.btnPermission('agentcount_level') || this.btnPermission('agentcount_my') || this.btnPermission('agentcount_proxy') || this.btnPermission('agentcount_source') || this.btnPermission('agentcount_tag') || this.btnPermission('agentcount_top') || this.btnPermission('agentcount_topstaff')) {
      this.getCharts()
    }
    this.matterListInfo()
    window.onresize = () => {
      this.initCharts()
    }
  },
  methods: {
    fintMore() {
      if (this.activeTab == 'proxy') {
        // 经销商
        this.$router.push({
          path: '/agent/bussinessIndex'
        })
      } else {
        this.$router.push({
          path: '/agent/transactionIndex'
        })
      }
    },
    getList() {
      const that = this
      getBusinessFollow().then(res => {
        if (res.code == 200) {
          that.tableList = res.data
          that.tabsData = that.tableList.business
        }
      })
    },
    choseSales() {
      if (this.activeTab == 'proxy') {
        // 经销商
        this.tabsData = this.tableList.business
      } else {
        this.tabsData = this.tableList.agent
      }
    },
    changeCharts(type) {
      if (type == 'easy') {
        // 更新销售简报
        const that = this
        this.fifter_data = this.activeSaleTab
        getIndexChartsInfo('easy', this.fifter_data).then(res => {
          if (res.code == 200) {
          // 销售简报
            if (res.data.easy != undefined) {
              that.easyList = res.data.easy
              that.easyList.isShow = true
            } else {
              that.easyList.isShow = false
            }
          }
        })
      }
    },
    getCharts() {
      const that = this
      getIndexChartsInfo(this.fifter_type, this.fifter_data).then(res => {
        if (res.code == 200) {
          // 销售简报
          if (res.data.easy != undefined) {
            that.easyList = res.data.easy
            that.easyList.isShow = true
          } else {
            that.easyList.isShow = false
          }
          // 部门商机排行
          if (res.data.top != undefined) {
            that.orgbussinessData.xAxis = res.data.top.x
            const info = res.data.top.data
            for (const i in info) {
              that.orgbussinessData.data.push(info[i])
              that.orgbussinessData.legend.push(i)
              that.orgbussinessData.hasCharts = true
            }
            that.orgbussinessData.isShow = true
          } else {
            that.orgbussinessData.isShow = false
          }
          // 个人商机排行
          if (res.data.topStaff != undefined) {
            that.userbussinessData.xAxis = res.data.topStaff.x
            const info = res.data.topStaff.data
            for (const i in info) {
              that.userbussinessData.data.push(info[i])
              that.userbussinessData.legend.push(i)
              that.userbussinessData.hasCharts = true
            }
            that.userbussinessData.isShow = true
          } else {
            that.userbussinessData.isShow = false
          }

          // 商机跟进
          if (res.data.busienss != undefined) {
            that.bussinessData.xAxis = res.data.busienss.x
            const info = res.data.busienss.data
            for (const i in info) {
              that.bussinessData.data.push(info[i])
              that.bussinessData.legend.push(i)
              that.bussinessData.hasCharts = true
            }
            that.bussinessData.isShow = true
          } else {
            that.bussinessData.isShow = false
          }
          // 经销商统计
          if (res.data.proxy != undefined) {
            this.proxyData.xAxis = res.data.proxy.x
            const info = res.data.proxy.data
            for (const i in info) {
              that.proxyData.data.push(info[i])
              that.proxyData.legend.push(i)
              that.proxyData.hasCharts = true
            }
            that.proxyData.isShow = true
          } else {
            that.proxyData.hasCharts = false
            that.proxyData.isShow = false
          }
          // 商机来源
          if (res.data.source != undefined) {
            const info = res.data.source
            for (const i in info) {
              that.sourceData.data.push({ name: info[i].title, value: parseInt(info[i].c) })
              that.sourceData.legend.push(info[i].title)
              that.sourceData.hasCharts = true
            }
            that.sourceData.isShow = true
          } else {
            that.sourceData.isShow = false
          }
          // 经销商等级
          if (res.data.level != undefined) {
            const info = res.data.level
            for (let i = 0; i < info.length; i++) {
              that.levelData.data.push({ name: info[i].name, value: parseInt(info[i].c) })
              that.levelData.legend.push(info[i].name)
              that.levelData.hasCharts = true
            }
            that.levelData.isShow = true
          } else {
            that.levelData.isShow = false
          }
          // 经销商标签
          if (res.data.tag != undefined) {
            const info = res.data.tag
            for (let i = 0; i < info.length; i++) {
              that.tagData.data.push({ name: info[i].name, value: parseInt(info[i].c) })
              that.tagData.legend.push(info[i].name)
              that.tagData.hasCharts = true
            }
            that.tagData.isShow = true
          } else {
            that.tagData.isShow = false
          }
        }
        if (that.tagData.isShow || that.levelData.isShow || that.sourceData.isShow || that.proxyData.isShow || that.bussinessData.isShow || that.userbussinessData.isShow || that.orgbussinessData.isShow) {
          this.initCharts()
        }
      })
    },
    initCharts() {
      const that = this
      // 绘制图表
      let org_option = {}
      const domClassList = []
      const domList = []
      if (this.orgbussinessData.hasCharts) {
        org_option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: 100
          },
          legend: {
            data: this.orgbussinessData.legend,
            bottom: 10,
            left: 'center'
          },
          xAxis: {
            type: 'category',
            data: this.orgbussinessData.xAxis
          },
          yAxis: {
            type: 'value',
            splitLine: { lineStyle: { type: 'dashed' }}
          },
          series: []
        }
        for (let i = 0; i < this.orgbussinessData.legend.length; i++) {
          org_option.series.push({
            itemStyle: {
              color: this.bg_color_list[i]
            },
            barWidth: '10',
            name: this.orgbussinessData.legend[i],
            type: 'bar',
            stack: '部门商机',
            data: this.orgbussinessData.data[i]
          })
        }
        domClassList.push('org_business')
        domList.push(org_option)
      }
      let business_top_option = {}
      if (this.userbussinessData.hasCharts) {
        business_top_option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: 100
          },
          legend: {
            data: this.userbussinessData.legend,
            bottom: 10,
            left: 'center'
          },
          xAxis: {
            type: 'category',
            data: this.userbussinessData.xAxis
          },
          yAxis: {
            type: 'value',
            splitLine: { lineStyle: { type: 'dashed' }}
          },
          series: []
        }
        for (let i = 0; i < this.userbussinessData.legend.length; i++) {
          business_top_option.series.push({
            itemStyle: {
              color: this.bg_color_list[i]
            },
            barWidth: '10',
            name: this.userbussinessData.legend[i],
            type: 'bar',
            stack: '个人商机',
            data: this.userbussinessData.data[i]
          })
        }
        domClassList.push('business_top')
        domList.push(business_top_option)
      }
      let bussiness_source_option = {}
      if (this.sourceData.hasCharts) {
      // 商机来源
        bussiness_source_option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '5%',
            data: this.sourceData.legend
          },
          series: [
            {
              type: 'pie',
              radius: '55%',
              center: ['50%', '40%'],
              data: this.sourceData.data,
              label: {
                normal: {
                  formatter: '{b}:{d}%'
                }
              },
              itemStyle: {
                normal: {
                  color: function(params) {
                  // 自定义颜色
                    var colorList = that.bg_color_list
                    return colorList[params.dataIndex]
                  }
                },
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        domClassList.push('bussiness_source')
        domList.push(bussiness_source_option)
      }
      let agent_level_option = {}
      if (this.levelData.hasCharts) {
      // 经销商等级
        agent_level_option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '5%',
            data: this.levelData.legend
          },
          series: [
            {
              type: 'pie',
              radius: '55%',
              center: ['50%', '40%'],
              data: this.levelData.data,
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
            }
          ]
        }
        domClassList.push('agent_level')
        domList.push(agent_level_option)
      }
      let agent_label_option = {}
      if (this.tagData.hasCharts) {
      // 经销商标签
        agent_label_option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '5%',
            data: this.tagData.legend
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '40%'],
              data: this.tagData.data,
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
            }
          ]
        }
        domClassList.push('agent_label')
        domList.push(agent_label_option)
      }
      let agent_statistics_option = {}
      if (this.proxyData.hasCharts) {
      // 经销商统计
        agent_statistics_option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: 100
          },
          legend: {
            data: this.proxyData.legend,
            bottom: 10,
            left: 'center'
          },
          xAxis: {
            type: 'category',
            data: this.proxyData.xAxis
          },
          yAxis: {
            type: 'value',
            splitLine: { lineStyle: { type: 'dashed' }}
          },
          series: []
        }
        for (let i = 0; i < this.proxyData.legend.length; i++) {
          agent_statistics_option.series.push({
            itemStyle: {
              color: this.bg_color_list[i]
            },
            name: this.proxyData.legend[i],
            type: 'line',
            smooth: true,
            data: this.proxyData.data[i]
          })
        }
        domClassList.push('agent_statistics')
        domList.push(agent_statistics_option)
      }
      let business_follow_options = {}
      if (this.proxyData.hasCharts) {
      // 商机跟进
        business_follow_options = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: 100
          },
          legend: {
            data: this.bussinessData.legend,
            bottom: 10,
            left: 'center'
          },
          xAxis: {
            type: 'category',
            data: this.bussinessData.xAxis
          },
          yAxis: {
            type: 'value',
            splitLine: { lineStyle: { type: 'dashed' }}
          },
          series: []
        }
        for (let i = 0; i < this.bussinessData.legend.length; i++) {
          business_follow_options.series.push({
            itemStyle: {
              color: this.bg_color_list[i]
            },
            smooth: true,
            name: this.bussinessData.legend[i],
            type: 'line',
            data: this.bussinessData.data[i]
          })
        }
        domClassList.push('business_follow')
        domList.push(business_follow_options)
      }
      console.log(domClassList)
      console.log(domList)
      this.drawEcharts(domClassList, domList, domClassList.length)
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
        }, 0)
      }
    },
    destoryEcharts(domList, length) {
      for (let i = 0; i < length; i++) {
        setTimeout(() => {
          const echart = echarts.init(document.getElementById(domList[i]))
          echart.dispose()
        }, 0)
      }
    },
    showInfo(e) {
      const that = this
      // console.log(e)
      viewReport(e.id).then(res => {
        if (res.code === 200) {
          that.viewForm = res.data.notice
          if (that.viewForm.file !== '') {
            that.viewForm.file = JSON.parse(that.viewForm.file)
          } else {
            that.viewForm.file = [{ name: '', url: '' }]
          }
        }
      })
      that.modelShow = true
      this.$forceUpdate()
    },
    matterListInfo() {
      const that = this
      getindexinfo().then(res => {
        if (res.code === 200 || res.code === '200') {
          that.loading = false
          // console.log(res, 66)
          if (res.data.matterinfolist !== null && res.data.matterinfolist.length !== 0) {
            // var arrmat = []
            // for (var i = 0; i < 1; i++) {
            //   arrmat.push(res.data.matterinfolist[i])
            // }
            that.carStep = res.data.matterinfolist
          }
          // console.log(that.carStep)
          that.matter = res.data.matterinfolist
          // console.log(res.data.matterinfolist, 'car')
          that.matterList = res.data.todo
          // that.createBy = res.data.matterinfolist[0].createdBy
          if (res.data.noticeinfolist.length !== 0) {
            var arr = []
            var k = 5
            for (var j = 0; j < res.data.noticeinfolist.length; j++) {
              if (j < k) {
                arr.push(res.data.noticeinfolist[j])
              }
            }
            that.tableData = arr
          }
          // console.log(that.tableData, 11)
        }
      })
    },
    skip(type) {
      if (type === 'inform') {
        this.$router.push({
          path: '/office/report'
        })
      } else {
        this.$router.push({
          path: '/office/matterProgress'
        })
      }
    },
    resetModel() {
      this.viewForm = []
      this.viewForm.file = [{ name: '', url: '' }]
    },
    change(type, id) {
      if (type === '1') {
        if (this.btnPermission('performanceexam_browse') === false) {
          this.$message({
            message: '你当前没有查看权限,请联系管理员',
            type: 'warning'
          })
        } else {
          this.$router.push({
            path: '/administration/performanceHistory?tab=my'
          })
        }
      } else if (type === '2') {
        if (this.btnPermission('surveyexam_browse') === false) {
          this.$message({
            message: '你当前没有查看权限,请联系管理员',
            type: 'warning'
          })
        } else {
          this.$router.push({
            path: '/administration/questionnaireHistory?tab=my'
          })
        }
      } else if (type === '3') {
        if (this.btnPermission('dailyexam_browse') === false) {
          this.$message({
            message: '你当前没有查看权限,请联系管理员',
            type: 'warning'
          })
        } else {
          this.$router.push({
            path: '/administration/examHistory?tab=my'
          })
        }
      } else if (type === '4') {
        if (this.btnPermission('index_index') === false) {
          // 审批
          this.$message({
            message: '你当前没有查看权限,请联系管理员',
            type: 'warning'
          })
        } else {
          this.$router.push({
            path: '/office/approval?tab=wait'
          })
        }
      } else if (type === '5') {
        if (this.btnPermission('agent_agentbrowse') === false) {
          // 经销商
          this.$message({
            message: '你当前没有查看权限,请联系管理员',
            type: 'warning'
          })
        } else {
          this.$router.push({
            path: '/agent/bussinessIndex?tab=assign'
          })
        }
      } else if (type === '6') {
        // 流入公海
        if (this.btnPermission('agent_agentbusinessbrowse') === false) {
          this.$message({
            message: '你当前没有查看权限,请联系管理员',
            type: 'warning'
          })
        } else {
          this.$router.push({
            path: '/agent/bussinessIndex?tab=assign'
          })
        }
      } else if (type === '7') {
        // 投诉
        if (this.btnPermission('complain_browse') === false) {
          this.$message({
            message: '你当前没有查看权限,请联系管理员',
            type: 'warning'
          })
        } else {
          this.$router.push({
            path: '/office/complaint?tab=waitdeal'
          })
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
ul{
  list-style: none;
  margin: 0;
  padding:0;
  li{
      list-style: none;
     padding:0;
     font-size: 14px;
    a:hover{
       color:#409EFF
    }
  }

}
.noTip{
  margin-top: 10px;
  display: inline-block;
}
.dashboard-container{
    // padding:15px 20px 0 15px;
    // background: #fff;
  .dashboard_row{
    // margin-bottom: 15px;
    .grid-content{
      margin-bottom: 15px;
    }
    .more{
      margin-top: 10px;
      text-align: center;
      color: #909399;
      font-size: 14px;
      cursor: pointer;
      &:hover{
        color: #409EFF;
      }
    }
    // 待办理事务
    .item{
      display: flex;
      align-items: center;
      .block{
        width: 25%;
        text-align: center;
        cursor: pointer;
        .num{
          font-family: '微软雅黑 Bold', '微软雅黑';
          font-weight: 700;
          font-size: 16px;
          color:#666666;
          margin: 0;
        }
        .active{
          color: #3C8EE9;
        }
        .num_text{
          font-family: '微软雅黑';
          font-weight: 400;
          font-size: 12px;
          color: #666666;
          height: 13px;
        }
      }
    }
    // 公告
    .notice_list{
      padding: 0 14px;
      width: 100%;
      li{
        padding: 10px 0;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #e0e0e0;
        cursor: pointer;
        span{
          display: inline-block;
        }
        .notice_title{
          width: 40%;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        .notice_user{
          width:100px;
          text-align: left;
        }
        .notice_time{
          width: 160px;
          text-align: right;
        }
      }
      li:hover{
      color: #3C8EE9;
      }
      li:last-child{
        border-bottom: none;
      }
    }
    // 销售简报
    .sale_summary{
      padding: 10px 0;
      .sale_block{
        display: flex;
        align-items: center;
        li{
          display: inline-flex;
          width: 25%;
          justify-content: center;
          .sale_icon{
            width: 50px;
            height: 50px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 5px;
            .svg-icon{
              font-size: 36px;
            }
          }
          .sale_info{
            margin-left: 6px;
            p{
              margin: 0;
              font-family: '微软雅黑 Bold', '微软雅黑';
              font-weight: 700;
              color: #666666;
              font-size: 28px;
            }
            .tips{
              font-family: '微软雅黑 Regular', '微软雅黑';
              font-weight: 410;
              font-style: normal;
              color: #999999;
              font-size: 12px;
              padding-bottom: 6px;
              padding-top: 2px;
            }
          }
        }
      }
    }
    // 图表区域
    .charts_line{
      .echars_style{
          // margin:20px 0;
          // padding: 20px 0 0 20px;
          // width: 540px;
          height: 300px;
          overflow: auto;
          background:#fff;
      }
    }

  }

  .box-card{
    // min-height:355px;
  }
  .top_color{
    color: #f20
  }
    .wx{
      text-align: center;
    }
    .progressBar_first{
      min-height: 135px;
      // background-color: rgba(242, 242, 242, 1);
      padding: 10px;
      border-bottom:1px solid #e0e0e0;
      // width: 500px;
      margin: 0 auto;
      overflow-x: scroll;
      overflow-y: hidden;
      .proClear{
         clear: both;
        //  padding: 5px 0 20px 20px;
         display: flex;
         align-items: center;
         font-family: 'Arial Normal', 'Arial';
         font-weight: 400;
         font-size: 12px;
         .proCode{
          float: left;
          margin-right: 20px;
          font-weight: 700;
          font-style: normal;
          font-size: 12px;

         }
         .proTitle{
          float: left;
          margin-right: 20px;

         }
         .propub{
           float: left;
         }
      }
      .view_step {
            margin-top: 20px;
            margin-bottom: -10px;
          }
    }
    .progressBar_first:last-child{
      border-bottom:none;
    }
    .el-scrollbar__wrap{
      overflow-x: hidden;
    }

    .view_report {
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

          a{
            color: #409eff;
            text-decoration: underline;
          }

        }

        .line_title {
          font-weight: 400;
          color: #666666;
          width: 80px;
          text-align: right;
          margin-right:10px;
        }

        .first_line {
          font-size: 16px;
          color: #000000;
        }

        .second_line {
          font-size: 16px;
          color: #000000;
        }

        .small_font {
           font-size: 16px;
          color: #000000;
        }
      }
    }

    .public_text{
      .board-item{
         cursor: pointer;
      }
    }

}
</style>

