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
      <div v-if="choseTab=='mystatistics'" class="bussiness_show">
        <div class="bussiness_card_list">
          <div class="bussiness_card">
            <div class="card_icon">
              <svg-icon icon-class="statistics_01" />
            </div>
            <div class="card_tips">
              <p class="title">商机总数</p>
              <p class="num">{{ sticCount }}</p>
            </div>
          </div>
          <div class="bussiness_card">
            <div class="card_icon">
              <svg-icon icon-class="statistics_02" />
            </div>
            <div class="card_tips">
              <p class="title">商机转换</p>
              <p class="num">{{ sticNum }}</p>
            </div>
          </div>
          <div class="bussiness_card">
            <div class="card_icon">
              <svg-icon icon-class="statistics_03" />
            </div>
            <div class="card_tips">
              <p class="title">流入公海</p>
              <p class="num">{{ seasNum }}</p>
            </div>
          </div>
          <div class="bussiness_card">
            <div class="card_icon">
              <svg-icon icon-class="statistics_04" />
            </div>
            <div class="card_tips">
              <p class="title">今日新增</p>
              <p class="num">{{ todayNum }}</p>
            </div>
          </div>
          <div class="bussiness_card">
            <div class="card_icon">
              <svg-icon icon-class="statistics_05" />
            </div>
            <div class="card_tips">
              <p class="title">今日跟进</p>
              <p class="num">{{ todayFollowNum }}</p>
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
              <el-select v-model="timesize" placeholder="请选择" size="mini" style="width:80px" @change="choseSize">
                <el-option
                  v-for="item in timeRange"
                  :key="item.time"
                  :label="item.text"
                  :value="item.time"/>
              </el-select>
            </div>
          </div>
          <div class="charts_block">
            <div id="bussinessLine" class="echars_style"/>
          </div>
        </div>
        <div class="bussiness_table">
          <!-- <div class="table_title">
            新增经销商：200，跟进经销商：200
          </div> -->
          <div class="table_export">
            <search-fifter :add="false" :fifter="false" :export-all="false" :export-type="moduleType" :export-show="true" :export-name="'商机统计'" style="display: inline-block;position: absolute;right: 10px" @exportAction="bussinessExport"/>
          </div>
          <div class="table_data">
            <el-table :data="tableData" border tooltip-effect="light">
              <el-table-column label="时间" align="center" prop="fields" />
              <el-table-column label="新增商机数" align="center" prop="newBus"/>
              <el-table-column label="成为经销商数" align="center" prop="agency"/>
              <el-table-column label="跟进次数" prop="followNum" align="center"/>
              <el-table-column prop="folBus" label="跟进商机数" align="center"/>
              <el-table-column prop="seas" label="流入公海" align="center"/>
            </el-table>
          </div>
        </div>
      </div>
      <div v-if="choseTab=='departmentstatisticstop'" class="bussiness_show">
        <div class="bussiness_charts">
          <div class="charts_fifter">
            <div class="fifter_span agency">
              <el-radio-group v-model="radiodate" size="mini" @change="quest">
                <el-radio-button v-for="item of typedate" :label="item.time" :key="item.time" border style="margin-right:20px;">{{ item.text }}</el-radio-button>
              </el-radio-group>
              <transition name="el-fade-in-linear">
                <el-date-picker
                  v-if="ishow"
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
            <div id="bussinessOrg" class="echars_style"/>
          </div>
        </div>
        <div class="bussiness_table">
          <div class="table_export">
            <search-fifter :add="false" :fifter="false" :export-all="false" :export-type="moduleType" :export-show="true" :export-name="'商机统计'" style="display:inline-block;position: absolute;right: 10px" @exportAction="bussinessExport"/>
          </div>
          <div class="table_data">
            <el-table :data="tableData" border tooltip-effect="light">
              <el-table-column label="部门名称" align="center" prop="deptName" />
              <el-table-column label="商机数" prop="countNum" align="center"/>
            </el-table>
          </div>
        </div>
      </div>
      <div v-if="choseTab=='staffstatisticstop'" class="bussiness_show">
        <div class="bussiness_charts">
          <div class="charts_fifter">
            <div class="fifter_span agency">
              <el-radio-group v-model="radiodate" size="mini" @change="quest">
                <el-radio-button v-for="item of typedate" :label="item.time" :key="item.time" border style="margin-right:20px;">{{ item.text }}</el-radio-button>
              </el-radio-group>
              <transition name="el-fade-in-linear">
                <el-date-picker
                  v-if="ishow"
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
            <div v-show="tableData.length>0" id="bussinessUser" class="echars_style"/>
            <div v-show="tableData.length<=0" class="echars_style no_data">
              暂无数据~
            </div>
          </div>
        </div>
        <div class="bussiness_table">
          <div class="table_export">
            <search-fifter :add="false" :fifter="false" :export-all="false" :export-type="moduleType" :export-show="true" :export-name="'商机统计'" style="display:inline-block;position: absolute;right: 10px" @exportAction="bussinessExport"/>
          </div>
          <div class="table_data">
            <el-table :data="tableData" border tooltip-effect="light">
              <el-table-column label="姓名" align="center" prop="realName" />
              <el-table-column label="商机数" align="center" prop="countNum"/>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
var echarts = require('echarts')
import { parseTime } from '@/utils/index'
import { getBusinessStatementInfo, exportBusinessStatementInfo, exportBusinessStatement } from '@/api/statement'
let choiceDate = ''
export default {
  name: 'BusinessStatistics',
  data() {
    return {
      choseTab: 'mystatistics',
      radiodate: 'today',
      timesize: 'hours',
      dateTime: '',
      startDate: '',
      endDate: '',
      ishow: false,
      seasNum: 0,
      sticCount: 0,
      sticNum: 0,
      todayFollowNum: 0,
      todayNum: 0,
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
      tabList: [{
        label: '商机统计',
        name: 'mystatistics'
      }, {
        label: '部门商机',
        name: 'departmentstatisticstop'
      }, {
        label: '个人商机',
        name: 'staffstatisticstop'
      }],
      typedate: [
        { text: '今日', time: 'today' },
        { text: '近7天', time: 'sevendays' },
        { text: '近30天', time: 'thirtydays' },
        { text: '当月', time: 'month' },
        { text: '自定义', time: 'diy' }
      ],
      bg_color_list: ['#36CBCB', '#3AA1FF', '#4ECB73', '#435188', '#FF9966', '#FBD437', '#975FE5', '#993366'],
      pie_color_list: ['#3aa1ff', '#fbd437', '#36cbcb', '#82dfbe', '#4ecb73', '#acdf82', '#9dd9ed', '#eaa674', '#eaa674', '#f2637b', '#dc81d2', '#975fe5', '#9f8bf0'],
      timeRange: [],
      // timeRange: [
      //   { text: '时', time: 'hours' },
      //   { text: '日', time: 'day' },
      //   { text: '月', time: 'month' }
      // ],
      chartsData: {},
      tableData: [],
      moduleType: '/statistics/statistics-agentbusinessexport'
    }
  },
  watch: {
    date(val) { // 监听数据发生改变 刷新图表数据
      //   this.initCharts()
    }
  },
  mounted() {
    this.timeRange = [{ text: '时', time: 'hours' }]
    this.getList()
    window.onresize = () => {
      this.initCharts(this.choseTab)
    }
  },
  created() {

  },
  beforeDestroy() {
    window.onresize = ''
    if (this.choseTab == 'mystatistics') {
      this.destoryEcharts(['bussinessLine'], 1)
    } else if (this.choseTab == 'departmentstatisticstop') {
      this.destoryEcharts(['bussinessOrg'], 1)
    } else {
      this.destoryEcharts(['bussinessUser'], 1)
    }
  },
  methods: {
    bussinessExport() {
      if (this.choseTab == 'mystatistics') {
        const info = {
          mode: this.radiodate,
          startDate: this.startDate,
          endDate: this.endDate,
          xtype: this.timesize
        }
        console.log(info)
        exportBusinessStatementInfo(info).then(res => {
          let filename = ''
          filename = '新增商机导出' + new Date().getTime()
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
          type: this.choseTab,
          mode: this.radiodate,
          startDate: this.startDate,
          endDate: this.endDate,
          getType: 'export'
        }
        const that = this
        exportBusinessStatement(info).then(res => {
          let filename = ''
          if (this.choseTab == 'departmentstatisticstop') {
            filename = '部门商机导出' + new Date().getTime()
          } else {
            filename = '个人商机导出' + new Date().getTime()
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
      }
    },
    destoryEcharts(domList, length) {
      for (let i = 0; i < length; i++) {
        setTimeout(() => {
          if (document.getElementById(domList[i]) != null) {
            const echart = echarts.init(document.getElementById(domList[i]))
            if (echart) {
              console.log('销毁' + domList[i])
              echart.dispose()
            }
          }
        }, 0)
      }
    },
    getList() {
      const info = {
        type: this.choseTab,
        mode: this.radiodate,
        startDate: this.startDate,
        endDate: this.endDate,
        xtype: this.timesize,
        getType: ''
      }
      const that = this
      if (this.choseTab == 'mystatistics') {
        this.destoryEcharts(['bussinessLine'], 1)
      } else if (this.choseTab == 'departmentstatisticstop') {
        this.destoryEcharts(['bussinessOrg'], 1)
      } else {
        this.destoryEcharts(['bussinessUser'], 1)
      }
      getBusinessStatementInfo(info).then(res => {
        if (res.code == 200) {
          if (that.choseTab == 'mystatistics') {
            that.seasNum = res.data.seasNum
            that.sticCount = res.data.sticCount
            that.sticNum = res.data.sticNum
            that.todayFollowNum = res.data.todayFollowNum
            that.todayNum = res.data.todayNum
          }
          that.tableData = []
          that.tableData = res.data.reportData.tableData
          console.log(that.tableData)
          if (that.tableData.length > 0) {
            if (that.choseTab != 'mystatistics') {
              for (let i = 0; i < res.data.reportData.reportData.x.length; i++) {
                if (i % 2 != 0) {
                  res.data.reportData.reportData.x[i] = '\n' + res.data.reportData.reportData.x[i]
                }
              }
            }
            console.log(this.chartsData.x)
            that.chartsData = res.data.reportData.reportData
            that.initCharts(that.choseTab)
          }
        }
      })
    },
    choseTabsType(value) {
      this.destoryEcharts(['bussinessLine', 'bussinessOrg', 'bussinessUser'], 3)
      setTimeout(() => {
        this.choseTab = value
        this.dateTime = ''
        this.ishow = false
        if (value == 'mystatistics') {
          this.radiodate = 'today'
          this.timeRange = [{ text: '时', time: 'hours' }]
          this.timesize = 'hours'
        } else {
          this.radiodate = 'today'
          this.timesize = ''
        }
        this.tableData = []
        this.chartsData = {}
        this.getList()
      }, 50)
      // this.initCharts(value)
    },
    initCharts(value) {
      if (value == 'mystatistics') {
        let option = {}
        const legend = []
        for (const i in this.chartsData.data) {
          legend.push(i)
        }
        option = {
          title: {
            text: '新增商机'
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
            data: this.chartsData.x
          },
          yAxis: {
            type: 'value',
            splitLine: { lineStyle: { type: 'dashed' }}
          },
          series: []
        }
        let k = 0
        for (const i in this.chartsData.data) {
          option.series.push({ name: i, type: 'line', smooth: true, data: this.chartsData.data[i], itemStyle: { color: this.bg_color_list[k] }})
          ++k
        }
        this.drawEcharts('bussinessLine', option)
      } else if (value == 'departmentstatisticstop') {
        // 部门top10
        let option = {}
        const legend = []
        for (const i in this.chartsData.data) {
          legend.push(i)
        }
        option = {
          title: {
            text: '部门商机'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: legend,
            left: 'center',
            bottom: '0%'
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
        let k = 0
        for (const i in this.chartsData.data) {
          option.series.push({ name: i, type: 'bar', data: this.chartsData.data[i], itemStyle: { color: this.bg_color_list[k] }})
          ++k
        }
        this.drawEcharts('bussinessOrg', option)
      } else {
        // 个人top10
        let option = {}
        if (this.chartsData == null || this.chartsData.length == 0) {
          option = {
            xAxis: {
              type: 'category',
              data: []
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              data: [],
              type: 'bar'
            }]
          }
        } else {
          const legend = []
          for (const i in this.chartsData.data) {
            legend.push(i)
          }
          option = {
            title: {
              text: '个人商机排行'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            legend: {
              data: legend,
              left: 'center',
              bottom: '0%'
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
          let k = 0
          for (const i in this.chartsData.data) {
            option.series.push({ name: i, type: 'bar', data: this.chartsData.data[i], itemStyle: { color: this.bg_color_list[k] }})
            ++k
          }
        }
        this.drawEcharts('bussinessUser', option)
      }
    },
    drawEcharts(domName, option) {
      setTimeout(() => {
        const echart = echarts.init(document.getElementById(domName))
        if (echart) {
          echart.resize()
        }
        echart.clear()
        echart.setOption(option)
      }, 0)
    },
    quest(tab) {
      // 判断是哪个时间段的信息
      if (tab === 'today') {
        this.ishow = false
        this.radiodate = 'today'
        this.timeRange = [
          { text: '时', time: 'hours' }
        ]
        this.getList()
      } else if (tab === 'sevendays') {
        this.ishow = false
        this.radiodate = 'sevendays'
        this.timesize = 'day'
        this.timeRange = [
          { text: '时', time: 'hours' },
          { text: '日', time: 'day' }
        ]
        this.getList()
      } else if (tab === 'thirtydays') {
        this.ishow = false
        this.radiodate = 'thirtydays'
        this.timeRange = [
          { text: '日', time: 'day' }
        ]
        this.timesize = 'day'
        this.getList()
      } else if (tab === 'month') {
        this.ishow = false
        this.radiodate = 'month'
        this.timesize = 'day'
        this.timeRange = [
          { text: '日', time: 'day' }
        ]
        this.getList()
      } else {
        this.ishow = true
        this.dateTime = ''
        this.startDate = ''
        this.endDate = ''
      }
    },
    choseSize() {
      this.getList()
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
          padding: 10px 18px;
          margin-right: 10px;

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
        .charts_fifter{
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 60px;
            .fifter_span{
            height: 60px;

            }
            .fifter_select{
                width: 180px;
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
          .echars_style{
            height: 360px;
            overflow: auto;
            background:#fff;
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
        }
        .table_data{

        }
      }
    }
    }

  }

</style>
