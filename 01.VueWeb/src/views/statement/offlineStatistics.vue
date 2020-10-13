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
      <div v-if="choseTab=='offline'" class="bussiness_show">
        <div class="bussiness_card_list">
          <div class="bussiness_card">
            <div class="card_icon">
              <svg-icon icon-class="train" />
            </div>
            <div class="card_tips">
              <p class="title">培训场数</p>
              <p class="num">{{ courseLabel.totalTrainNum }}</p>
            </div>
          </div>
          <div class="bussiness_card">
            <div class="card_icon">
              <svg-icon icon-class="train_01" />
            </div>
            <div class="card_tips">
              <p class="title">总培训人数</p>
              <p class="num">{{ courseLabel.totalMemNum }}</p>
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
            <!-- <div class="fifter_select">
              <span>时间粒度：</span>
              <el-select v-model="timesize" placeholder="请选择" size="mini" style="width:80px" @change="choseSize">
                <el-option
                  v-for="item in timeRange"
                  :key="item.time"
                  :label="item.text"
                  :value="item.time"/>
              </el-select>
            </div> -->
          </div>
          <div class="charts_block">
            <div id="bussinessLine" class="echars_style"/>
            <div id="levelChart" class="echars_style echars_style_short"/>
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
              <el-table-column label="月份" align="center" prop="date" />
              <el-table-column label="培训场次" align="center" prop="trainNum"/>
              <el-table-column label="培训人数" align="center" prop="memNum"/>
            </el-table>
          </div>
        </div>
      </div>
      <div v-if="choseTab=='offlineTeacherList'" class="bussiness_show" style="padding: 0 20px;">
        <div class="bussiness_charts">
          <div class="charts_fifter">
            <div style="color: #333333;font-size: 16px;font-weight: 700;font-family: 'Arial Negreta', 'Arial Normal', 'Arial';">
              讲师排行
            </div>
            <div style="display:inline-flex;align-items:center;width: 420px;">
              <el-date-picker
                :picker-options="pickerOptions"
                v-model="dateTime"
                size="mini"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="dateChange"/>
              <search-fifter :add="false" :fifter="false" :export-all="false" :export-type="moduleType" :export-show="true" :export-name="'商机统计'" style="display:inline-block;position: absolute;right: 22px" @exportAction="bussinessExport"/>
            </div>
          </div>
        </div>
        <div class="bussiness_table">
          <div class="table_data">
            <el-table :data="tableData" border tooltip-effect="light">
              <el-table-column label="月份" align="center" prop="date" />
              <el-table-column label="姓名" prop="name" align="center"/>
              <el-table-column label="培训场次" align="center" prop="trainNum"/>
              <el-table-column label="培训人数" align="center" prop="memNum"/>
            </el-table>
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
      </div>
      <div v-if="choseTab=='offlineCourseList'" class="bussiness_show" style="padding: 0 20px;">
        <div class="bussiness_charts">
          <div class="charts_fifter">
            <div style="color: #333333;font-size: 16px;font-weight: 700;font-family: 'Arial Negreta', 'Arial Normal', 'Arial';">
              课程排行
            </div>
            <div style="display:inline-flex;align-items:center;width: 420px;">
              <el-date-picker
                :picker-options="pickerOptions"
                v-model="dateTime"
                size="mini"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="dateChange"/>
              <search-fifter :add="false" :fifter="false" :export-all="false" :export-type="moduleType" :export-show="true" :export-name="'商机统计'" style="display:inline-block;position: absolute;right: 22px" @exportAction="bussinessExport"/>
            </div>
          </div>
        </div>
        <div class="bussiness_table">
          <div class="table_data">
            <el-table :data="tableData" border tooltip-effect="light">
              <el-table-column label="月份" align="center" prop="date" />
              <el-table-column label="群名" prop="name" align="center"/>
              <el-table-column label="培训场次" align="center" prop="courNum"/>
              <el-table-column label="培训人数" align="center" prop="studyNum"/>
            </el-table>
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
      </div>
      <div v-if="choseTab=='offlineCourse'" class="bussiness_show" style="padding: 0 20px;">
        <div class="bussiness_charts">
          <div class="charts_fifter">
            <div style="color: #333333;font-size: 16px;font-weight: 700;font-family: 'Arial Negreta', 'Arial Normal', 'Arial';">
              课程统计
            </div>
            <div style="display:inline-flex;align-items:center;width: 420px;">
              <el-date-picker
                :picker-options="pickerOptions"
                v-model="dateTime"
                size="mini"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="dateChange"/>
              <search-fifter :add="false" :fifter="false" :export-all="false" :export-type="moduleType" :export-show="true" :export-name="'课程统计'" style="display:inline-block;position: absolute;right: 22px" @exportAction="bussinessExport"/>
            </div>
          </div>
        </div>
        <div class="bussiness_table">
          <div class="table_data">
            <el-table :data="tableData" border tooltip-effect="light">
              <el-table-column label="培训课程" align="center" prop="name"/>
              <el-table-column label="培训时间" prop="studyDate" align="center"/>
              <el-table-column label="报名人数" align="center" prop="countAll"/>
              <el-table-column label="到场人数" align="center" prop="count"/>
              <el-table-column label="小样领取数" align="center" prop="welfareNum"/>
              <el-table-column label="到场率" align="center" prop="ratio"/>
            </el-table>
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
      </div>
    </div>
  </div>
</template>
<script>
var echarts = require('echarts')
import { parseTime } from '@/utils/index'
import { getOnlineInfo, exportOnlineInfo, courseImportant } from '@/api/statement'
export default {
  name: 'OfflineStatistics',
  data() {
    return {
      choseTab: 'offline',
      radiodate: 'month',
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
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      courseLabel: {
        totalMemNum: 0,
        totalTrainNum: 0
      },
      tabList: [{
        label: '线下统计',
        name: 'offline'
      }, {
        label: '讲师排行',
        name: 'offlineTeacherList'
      }, {
        label: '课程排行',
        name: 'offlineCourseList'
      }, {
        label: '课程统计',
        name: 'offlineCourse'
      }],
      typedate: [
        { text: '近12月', time: 'month' },
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
      pieDate: [],
      chartsLedged: [],
      tableData: [],
      moduleType: '/statistics/statistics-agentbusinessexport',
      searchInfo: {
        pageID: 1,
        recPerPage: 10
      },
      total: 0
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
    if (this.choseTab == 'online') {
      this.destoryEcharts(['bussinessLine', 'levelChart'], 2)
    }
  },
  methods: {
    bussinessExport() {
      if (this.choseTab == 'offlineCourse') {
        const info = {
          startDate: this.startDate,
          endDate: this.endDate
        }
        courseImportant(info).then(res => {
          let filename = ''
          filename = '商学院统计导出' + new Date().getTime()
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
          type: this.choseTab == 'offline' ? 'offline' : (this.choseTab == 'offlineTeacherList' ? 'offlineTeacher' : 'offlineCourse'),
          startDate: this.startDate,
          endDate: this.endDate
        }
        exportOnlineInfo(info).then(res => {
          let filename = ''
          filename = '商学院统计导出' + new Date().getTime()
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
      const info = {
        type: this.choseTab,
        startDate: this.startDate,
        endDate: this.endDate,
        page: this.searchInfo.pageID,
        size: this.searchInfo.recPerPage
      }
      const that = this
      this.destoryEcharts(['bussinessLine', 'levelChart'], 2)
      getOnlineInfo(info).then(res => {
        if (res.code == 200) {
          that.tableData = []
          if (that.choseTab == 'offline') {
            that.chartsData = res.data.courseBLData
            that.courseLabel = res.data.courseLabel
            that.chartsLedged = res.data.courseBLName
            that.pieDate = res.data.pieData
            const k = 0
            for (const i in res.data.courseList) {
              that.tableData.push(res.data.courseList[i])
            }
            that.initCharts(that.choseTab)
          } else {
            that.tableData = res.data.rows
            that.total = parseInt(res.data.total)
          }
        }
      })
    },
    choseTabsType(value) {
      setTimeout(() => {
        this.choseTab = value
        this.tableData = []
        this.chartsData = {}
        if (value == 'offline') {
          this.radiodate = 'month'
          this.startDate = ''
          this.endDate = ''
          this.dateTime = ''
          this.destoryEcharts(['bussinessLine', 'levelChart'], 2)
        } else {
          this.startDate = new Date(parseTime(new Date(), '{y}-{m}-') + '01 00:00:00').getTime() / 1000
          this.endDate = new Date(parseTime(new Date(), '{y}-{m}-{d}') + ' 23:59:59').getTime() / 1000
          this.dateTime = [new Date(parseTime(new Date(), '{y}-{m}-') + '01 00:00:00'), new Date(parseTime(new Date(), '{y}-{m}-{d}') + ' 23:59:59')]
          this.radiodate = 'month'
        }
        this.getList()
      }, 50)

      // this.initCharts(value)
    },
    initCharts(value) {
      const that = this
      if (value == 'offline') {
        let option = {}
        const ledged = []
        for (const i in this.chartsLedged) {
          ledged.push(this.chartsLedged[i])
        }
        option = {
          title: {
            text: '培训统计'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ledged,
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
            data: this.chartsData.date
          },
          yAxis: {
            type: 'value',
            splitLine: { lineStyle: { type: 'dashed' }}
          },
          series: []
        }
        let k = 0
        for (const i in this.chartsLedged) {
          option.series.push({ name: this.chartsLedged[i], type: 'line', smooth: true, data: this.chartsData[i], itemStyle: { color: this.bg_color_list[k] }})
          ++k
        }
        let pie_option = {}
        const pie_ledged = []
        const data = []
        for (const i in that.pieDate) {
          pie_ledged.push(that.pieDate[i].name)
          data.push({ name: that.pieDate[i].name, value: that.pieDate[i].trainNum })
        }
        pie_option = {
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
        pie_option.legend.data = pie_ledged
        pie_option.series.push({
          name: '课程统计',
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
        const domList = ['bussinessLine', 'levelChart']
        this.drawEcharts(domList, [option, pie_option], domList.length)
        // this.drawEcharts('bussinessLine', option)
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
    quest(tab) {
      this.dateTime = ''
      this.startDate = ''
      this.endDate = ''
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
          // if (ttime > 60) {
          //   this.timesize = 'month'
          //   this.timeRange = [
          //     { text: '月', time: 'month' }
          //   ]
          // } else {
          //   this.timesize = 'day'
          //   this.timeRange = [
          //     { text: '日', time: 'day' }
          //   ]
          // }
          this.searchInfo = {
            pageID: 1,
            recPerPage: 10
          }
          this.total = 0
          this.startDate = parseInt(new Date(parseTime(start.getTime(), '{y}-{m}-{d}') + ' 00:00:00') / 1000)
          this.endDate = parseInt(new Date(parseTime(end.getTime(), '{y}-{m}-{d}') + ' 23:59:59') / 1000)
          this.getList()
        }
      } else {
        console.log('没有任何日期')
      }
    },
    handleSizeChange(val) {
      this.searchInfo.pageID = 1
      this.searchInfo.recPerPage = val
      this.tableData = []
      this.getList()
    },
    handleCurrentChange(val) {
      this.searchInfo.pageID = val
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
