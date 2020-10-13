<template>
  <div class="transaction_bg">
    <div class="transaction_tab">
      <span class="activity_tab">投诉统计</span>
    </div>
    <div class="transaction_scroll">
      <div class="transaction_show">
        <div class="transaction_card_list">
          <div class="transaction_card">
            <div class="card_icon">
              <svg-icon icon-class="complain" />
            </div>
            <div class="card_tips">
              <p class="title">投诉总数</p>
              <p class="num">{{ sum }}</p>
            </div>
          </div>
          <div class="transaction_card">
            <div class="card_icon">
              <svg-icon icon-class="complain" />
            </div>
            <div class="card_tips">
              <p class="title">已处理</p>
              <p class="num">{{ alreadysum }}</p>
            </div>
          </div>
          <div class="transaction_card">
            <div class="card_icon">
              <svg-icon icon-class="complain" />
            </div>
            <div class="card_tips">
              <p class="title">未处理</p>
              <p class="num">{{ readysum }}</p>
            </div>
          </div>
          <div class="transaction_card">
            <div class="card_icon">
              <svg-icon icon-class="complain" />
            </div>
            <div class="card_tips">
              <p class="title">今日已处理</p>
              <p class="num">{{ todaysum }}</p>
            </div>
          </div>
        </div>
        <div class="transaction_charts">
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
            <div id="complainCharts" class="echars_style"/>
            <div id="pieCharts" class="echars_style echars_style_short"/>
            <div id="resultCharts" class="echars_style echars_style_short"/>
          </div>
        </div>
        <div class="transaction_table">
          <div class="table_export">
            <search-fifter :add="false" :fifter="false" :export-show="true" :export-all="false" :export-type="moduleType" :export-name="'投诉统计'" style="display:inline-block;position: absolute;right: 10px" @exportAction="bussinessExport"/>
          </div>
          <div>
            <el-table :data="tableData" border tooltip-effect="light">
              <el-table-column label="时间" align="center" prop="time" />
              <el-table-column label="新增投诉数" align="center" prop="ready"/>
              <el-table-column label="处理投诉数" align="center" prop="already"/>
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
import { getComplainTotalInfo, getComplainChartInfo, getComplainPieInfo, exportComplainStatementInfo } from '@/api/statement'
export default {
  name: 'ComplainStatistics',
  data() {
    return {
      date: [],
      charts: [],
      ishow: false,
      timesize: 'hours',
      startDate: '',
      endDate: '',
      alreadysum: 0,
      readysum: 0,
      sum: 0,
      todaysum: 0,
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
      timeRange: [],
      agentInfoCreate: [],
      agentInfoRetain: [],
      agentInfoAssign: [],
      agentInfoResale: [],
      agentName: { agentInfoCreate: '', agentInfoRetain: '', agentInfoAssign: '', agentInfoResale: '' },
      agentpiechartname: {},
      agentotherpiechart: [],
      agentpiechart: [],
      title: {},
      uploadUrl: '',
      piechart: {},
      piechart1: {},
      tableHeight: 250,
      moduleType: '/statistics/statistics-agentexport',
      loading: true,
      radiodate: 'today',
      dateTime: '',
      chartsData: {},
      typePie: {},
      resultPie: {},
      tableData: [],
      typedate: [
        { text: '今日', time: 'today' },
        { text: '近7天', time: 'sevendays' },
        { text: '近30天', time: 'thirtydays' },
        { text: '当月', time: 'month' },
        { text: '自定义', time: 'diy' }
      ],
      bg_color_list: ['#36CBCB', '#3AA1FF', '#4ECB73', '#435188', '#FF9966', '#FBD437', '#975FE5', '#993366'],
      pie_color_list: ['#3aa1ff', '#9dd9ed', '#36cbcb', '#82dfbe', '#4ecb73', '#acdf82', '#fbd437', '#eaa674', '#eaa674', '#f2637b', '#dc81d2', '#975fe5', '#9f8bf0']
    }
  },
  watch: {
    // date(val) { // 监听数据发生改变 刷新图表数据
    //   this.initCharts()
    // }
  },
  mounted() {
    this.timeRange = [{ text: '时', time: 'hours' }]
    this.getList()
    this.uploadUrl = process.env.BASE_API + 'agent/service-import.json'
    window.onresize = () => {
      this.initCharts()
      this.initPie()
    }
  },
  created() {
    this.tableHeight = document.body.offsetHeight - 330
  },
  beforeDestroy() {
    this.destoryEcharts(['complainCharts', 'pieCharts', 'resultCharts'], 3)
  },
  methods: {
    bussinessExport() {
      const info = {
        mode: this.radiodate,
        startDate: this.startDate,
        endDate: this.endDate,
        xtype: this.timesize
      }
      console.log(info)
      exportComplainStatementInfo(info).then(res => {
        let filename = ''
        filename = '投诉统计导出' + new Date().getTime()
        var csvContent = 'data:text/csv;charset=utf-8,\ufeff'
        csvContent += res.data
        var encodedUri = encodeURI(csvContent)
        var link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', filename + '.csv')
        document.body.appendChild(link)
        link.click()
      })
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
    drawEcharts(dom, options) {
      setTimeout(() => {
        const echart = echarts.init(document.getElementById(dom))
        echart.clear()
        echart.setOption(options)
      }, 0)
    },
    initCharts() {
      const ledge = []
      for (const i in this.chartsData.data) {
        ledge.push(i)
      }
      const options = {
        title: [{
          text: '投诉统计'
        }],
        legend: {// 提示条
          data: ledge,
          left: 'center',
          bottom: '2%'
        },
        tooltip: {
          trigger: 'axis'
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
        options.series.push({ name: i, type: 'line', smooth: true, data: this.chartsData.data[i], itemStyle: { color: this.bg_color_list[k] }})
        ++k
      }
      this.drawEcharts('complainCharts', options)
    },
    initPie() {
      // 饼图
      const that = this
      // 判断值是否为空，显示不同的饼图
      // 等级饼图
      let type_option = {}
      let result_option = {}
      const ledged = this.typePie['list']
      const data = []
      for (const i in that.typePie) {
        if (i != 'list') {
          data.push({ name: that.typePie[i].name, value: that.typePie[i].sum })
        }
      }
      // 经销商等级
      type_option = {
        title: [{
          text: '投诉类型'
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
        name: '投诉类型',
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
      this.drawEcharts('pieCharts', type_option)
      const ledged1 = this.resultPie['list']
      const data1 = []
      for (const i in that.resultPie) {
        if (i != 'list') {
          data1.push({ name: that.resultPie[i].name, value: that.resultPie[i].sum })
        }
      }
      // 经销商等级
      result_option = {
        title: [{
          text: '投诉状态结果'
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
      result_option.legend.data = ledged1
      result_option.series.push({
        name: '投诉状态结果',
        type: 'pie',
        radius: '50%',
        data: data1,
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
      this.drawEcharts('resultCharts', result_option)
    },
    getList() {
      const that = this
      const info = {
        mode: this.radiodate,
        xtype: this.timesize,
        startDate: this.startDate,
        endDate: this.endDate
      }
      this.destoryEcharts(['complainCharts', 'pieCharts', 'resultCharts'], 3)
      getComplainChartInfo(info).then(res => {
        if (res.code == 200) {
          // 汇总数据
          that.alreadysum = res.data.complainsum.alreadysum
          that.readysum = res.data.complainsum.readysum
          that.sum = res.data.complainsum.sum
          that.todaysum = res.data.complainsum.todaysum
          // 折线和表格
          that.tableData = res.data.complainBLData.list
          that.chartsData = res.data.complainBLData.data
          that.initCharts()
          // 饼图
          that.typePie = res.data.pieData.type
          that.resultPie = res.data.pieData.result
          that.initPie()
        }
      })
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
    },
    resetCharts() {
      this.agentInfoAppoint = []
      this.agentInfoCreate = []
      this.agentInfoRetain = []
      this.agentInfoTransPublic = []
      this.agentInfoTransformation = []
    }
  }
}
</script>
<style lang="less" scoped>
  .transaction_bg {
    position: absolute;
    width: 100%;
    top: 0;

    .transaction_tab {
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
    .transaction_scroll{
     height: calc( 100vh - 170px );
     overflow-y: scroll;

    .transaction_show {
        background: #fff;
        padding: 20px;
      .transaction_card_list {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 20px;

        .transaction_card {
          display: inline-flex;
          align-items: center;
          border: 1px solid rgba(228, 228, 228, 1);
          min-width: 130px;
          padding: 10px;
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
      .transaction_charts{
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
          height: 620px;
          .echars_style{
            height: 360px;
            overflow: auto;
            background:#fff;
          }
          .echars_style_short{
            width: 50%;
            float: left;
            height: 320px;
          }
        }
      }
      .transaction_table{
        margin-top:30px;
        margin-bottom:100px;
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
      }
    }
    }

  }

</style>

