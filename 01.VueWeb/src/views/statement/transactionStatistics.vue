<template>
  <div class="transaction_bg">
    <div class="transaction_tab">
      <span class="activity_tab">经销商统计</span>
    </div>
    <div class="transaction_scroll">
      <div class="transaction_show">
        <div class="transaction_card_list">
          <div class="transaction_card">
            <div class="card_icon">
              <svg-icon icon-class="statistics_08" />
            </div>
            <div class="card_tips">
              <p class="title">经销商总数</p>
              <p class="num">{{ seasNum }}</p>
            </div>
          </div>
          <div class="transaction_card">
            <div class="card_icon">
              <svg-icon icon-class="statistics_02" />
            </div>
            <div class="card_tips">
              <p class="title">商机转化</p>
              <p class="num">{{ sitcNum }}</p>
            </div>
          </div>
          <div class="transaction_card">
            <div class="card_icon">
              <svg-icon icon-class="statistics_06" />
            </div>
            <div class="card_tips">
              <p class="title">直接成交</p>
              <p class="num">{{ directNum }}</p>
            </div>
          </div>
          <div class="transaction_card">
            <div class="card_icon">
              <svg-icon icon-class="statistics_07" />
            </div>
            <div class="card_tips">
              <p class="title">二次销售</p>
              <p class="num">{{ againNum }}</p>
            </div>
          </div>
          <div class="transaction_card">
            <div class="card_icon">
              <svg-icon icon-class="statistics_04" />
            </div>
            <div class="card_tips">
              <p class="title">今日新增</p>
              <p class="num">{{ todayNew }}</p>
            </div>
          </div>
          <div class="transaction_card">
            <div class="card_icon">
              <svg-icon icon-class="statistics_03" />
            </div>
            <div class="card_tips">
              <p class="title">今日流失</p>
              <p class="num">{{ todayAway }}</p>
            </div>
          </div>
          <div class="transaction_card">
            <div class="card_icon">
              <svg-icon icon-class="statistics_05" />
            </div>
            <div class="card_tips">
              <p class="title">今日跟进</p>
              <p class="num">{{ todayFollow }}</p>
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
            <div id="transactionChart" class="echars_style"/>
            <div id="levelChart" class="echars_style echars_style_short"/>
            <div id="sourceChart" class="echars_style echars_style_short"/>
          </div>
        </div>
        <div class="transaction_table">
          <div class="table_export">
            <search-fifter :add="false" :fifter="false" :upload-url="uploadUrl" :export-all="false" :export-type="moduleType" :export-show="true" :export-name="'经销商统计'" style="display:inline-block;position: absolute;right: 10px" @exportAction="bussinessExport"/>
          </div>
          <div>
            <el-table :data="tableData" border tooltip-effect="light">
              <el-table-column label="时间" align="center" prop="fields" />
              <el-table-column label="新增经销商数" align="center" prop="seasAdd"/>
              <el-table-column prop="seasFollow" label="跟进经销商数" align="center"/>
              <el-table-column label="流失经销商数" align="center" prop="seasLost"/>
              <el-table-column label="二次销售" align="center" prop="seasAgain"/>
              <el-table-column prop="seasSitc" label="商机转化" align="center"/>
              <el-table-column prop="seasDirect" label="直接成交" align="center"/>
              <el-table-column label="跟进次数" prop="seasNum" align="center"/>
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
let choiceDate = ''
import { exportTransactionStatementInfo, getTitleInfo, getTransactionStatementInfo } from '@/api/statement'
export default {
  name: 'TransactionStatistics',
  data() {
    return {
      date: [],
      charts: [],
      ishow: false,
      timesize: 'hours',
      timeRange: [],
      agentInfoCreate: [],
      agentInfoRetain: [],
      agentInfoAssign: [],
      agentInfoResale: [],
      agentName: { agentInfoCreate: '', agentInfoRetain: '', agentInfoAssign: '', agentInfoResale: '' },
      agentpiechartname: {},
      agentotherpiechart: [],
      agentpiechart: [],
      againNum: 0,
      directNum: 0,
      sitcNum: 0,
      todayAway: 0,
      todayFollow: 0,
      todayNew: 0,
      seasNum: 0,
      title: {},
      uploadUrl: '',
      piechart: {
        name: '',
        type: 'bar',
        data: '',
        smooth: true
      },
      piechart1: {
        name: '',
        type: 'bar',
        data: '',
        smooth: true
      },
      tableHeight: 250,
      moduleType: '/statistics/statistics-agentexport',
      loading: true,
      radiodate: 'today',
      dateTime: '',
      startDate: '',
      endDate: '',
      chartsData: {},
      levelData: {},
      sourceData: {},
      tableData: [],
      typedate: [
        { text: '今日', time: 'today' },
        { text: '近7天', time: 'sevendays' },
        { text: '近30天', time: 'thirtydays' },
        { text: '当月', time: 'month' },
        { text: '自定义', time: 'diy' }
      ],
      bg_color_list: ['#36CBCB', '#3AA1FF', '#4ECB73', '#435188', '#FF9966', '#FBD437', '#975FE5', '#993366'],
      pie_color_list: ['#3aa1ff', '#fbd437', '#36cbcb', '#82dfbe', '#4ecb73', '#acdf82', '#9dd9ed', '#eaa674', '#eaa674', '#f2637b', '#dc81d2', '#975fe5', '#9f8bf0'],
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
      }
    }
  },
  watch: {
    date(val) { // 监听数据发生改变 刷新图表数据
      // this.initCharts()
    }
  },
  mounted() {
    this.timeRange = [{ text: '时', time: 'hours' }]
    this.getList()
    window.onresize = () => {
      this.initCharts()
    }
    // this.getTitle()
    // this.initCharts()
    // this.uploadUrl = process.env.BASE_API + 'agent/service-import.json'
  },
  created() {
    this.tableHeight = document.body.offsetHeight - 330
  },
  beforeDestroy() {
    this.destoryEcharts(['transactionChart', 'levelChart', 'sourceChart'], 3)
  },
  methods: {
    choseSize() {
      this.getList()
    },
    bussinessExport() {
      const info = {
        mode: this.radiodate,
        startDate: this.startDate,
        endDate: this.endDate,
        xtype: this.timesize
      }
      exportTransactionStatementInfo(info).then(res => {
        let filename = ''
        filename = '经销商统计导出' + new Date().getTime()
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
    initCharts() {
      // 折线图
      let transaction_option = {}
      const ledge = []
      for (const i in this.chartsData.data) {
        ledge.push(i)
      }
      transaction_option = {
        title: [{
          text: '经销商统计'
        }],
        legend: {// 提示条
          data: ledge,
          left: 'center',
          bottom: '3%'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
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
        transaction_option.series.push({ name: i, type: 'line', smooth: true, data: this.chartsData.data[i], itemStyle: { color: this.bg_color_list[k] }})
        ++k
      }
      // 饼图
      const that = this
      // 判断值是否为空，显示不同的饼图
      // 等级饼图
      let level_option = {}
      let source_option = {}
      if (that.levelData != undefined) {
        const ledged1 = []
        const data = []
        for (const i in that.levelData) {
          ledged1.push(that.levelData[i].name)
          data.push({ name: that.levelData[i].name, value: that.levelData[i].c })
        }
        // 经销商等级
        level_option = {
          title: [{
            text: '经销商等级'
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
        level_option.legend.data = ledged1
        level_option.series.push({
          name: '经销商来源',
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
      } else {
        level_option = {
          title: [{
            text: '经销商等级'
          }],
          tooltip: {
            trigger: 'item',
            formatter: '暂无数据'
          },
          legend: {
            left: 'center',
            bottom: '5%',
            data: []
          },
          series: [
            {
              name: '经销商来源',
              type: 'pie',
              radius: '50%',
              data: [],
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
      }
      // 来源饼图
      if (that.sourceData != undefined) {
        const ledged = []
        const data = []
        for (const i in that.sourceData) {
          ledged.push(that.sourceData[i].title)
          data.push({ name: that.sourceData[i].title, value: that.sourceData[i].c })
        }
        source_option = {
          title: [{
            text: '经销商来源'
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
        source_option.legend.data = ledged
        source_option.series.push({
          name: '经销商等级',
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
      } else {
        source_option = {
          title: [{
            text: '经销商来源'
          }],
          tooltip: {
            trigger: 'item',
            formatter: '暂无数据'
          },
          legend: {
            bottom: '5%',
            data: []
          },
          series: [
            {
              name: '经销商来源',
              type: 'pie',
              radius: '50%',
              data: [],
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
      }
      const domList = ['transactionChart', 'levelChart', 'sourceChart']
      this.drawEcharts(domList, [transaction_option, level_option, source_option], domList.length)
    },
    getList() {
      const that = this
      const info = {
        mode: this.radiodate,
        startDate: this.startDate,
        endDate: this.endDate,
        xtype: this.timesize
      }
      this.destoryEcharts(['transactionChart', 'levelChart', 'sourceChart'], 3)
      getTransactionStatementInfo(info).then(res => {
        if (res.code == 200) {
          that.againNum = res.data.againNum
          that.directNum = res.data.directNum
          that.sitcNum = res.data.sitcNum
          that.todayAway = res.data.todayAway
          that.todayFollow = res.data.todayFollow
          that.todayNew = res.data.todayNew
          that.seasNum = res.data.seasNum
          that.chartsData = res.data.reportData.reportData
          that.tableData = res.data.reportData.tableData
          that.levelData = res.data.seasLevel
          that.sourceData = res.data.seasSource
          that.initCharts()
        }
      })
    },
    getTitle() {
      const that = this
      getTitleInfo().then(res => {
        if (res.code === 200 || res.code === 'code') {
          that.title = res.data[0]
        }
      })
    },
    quest(tab) {
      // 判断是哪个时间段的信息
      if (tab === 'today') {
        this.ishow = false
        this.radiodate = 'today'
        this.timesize = 'hours'
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
          padding: 8px 12px;
          margin-right: 8px;

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
            height: 260px;
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

