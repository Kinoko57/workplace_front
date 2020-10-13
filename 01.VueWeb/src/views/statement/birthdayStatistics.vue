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
      <div v-if="choseTab=='statistics'" class="bussiness_show">
        <div class="bussiness_card_list">
          <div class="bussiness_card">
            <div class="card_icon">
              <svg-icon icon-class="birthday" />
            </div>
            <div class="card_tips">
              <p class="title">下月生日员工</p>
              <p class="num">{{ staffCount }}</p>
            </div>
          </div>
          <div class="bussiness_card">
            <div class="card_icon">
              <svg-icon icon-class="birthday" />
            </div>
            <div class="card_tips">
              <p class="title">下月生日客户</p>
              <p class="num">{{ clientNum }}</p>
            </div>
          </div>
        </div>
        <div class="bussiness_charts">
          <div class="charts_fifter">
            <div class="fifter_span agency">
              <el-radio-group v-model="radiodate" size="mini" @change="quest">
                <el-radio-button v-for="item of typedate" :label="item.time" :key="item.time" border style="margin-right:20px;">{{ item.text }}</el-radio-button>
              </el-radio-group>
              <!-- <transition name="el-fade-in-linear">
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
              </transition> -->
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
              <el-table-column label="月份" align="center" prop="fields" />
              <el-table-column label="生日总数" align="center" prop="countNum"/>
              <el-table-column label="员工人数" align="center" prop="staffNum"/>
              <el-table-column prop="clientNum" label="经销商数" align="center"/>
            </el-table>
          </div>
        </div>
      </div>
      <div v-if="choseTab=='detail'" class="bussiness_show" style="padding: 0 20px;">
        <div class="bussiness_charts">
          <div class="charts_fifter">
            <div class="agency">
              <el-radio-group v-model="radioType" size="mini" @change="choseType">
                <el-radio-button v-for="item of typeList" :label="item.time" :key="item.time" border style="margin-right:20px;">{{ item.text }}</el-radio-button>
              </el-radio-group>
            </div>
            <div style="display:inline-flex;align-items:center;width: 290px;justify-content: space-between;">
              <el-select v-model="dateTime" placeholder="选择月" size="mini" style="width:220px;" @change="monthChange">
                <el-option
                  v-for="item in dateMonth"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <!-- <el-date-picker
                :clearable="false"
                v-model="dateTime"
                size="mini"
                type="month"
                value-format="timestamp"
                placeholder="选择月"
                @change="monthChange"/> -->
              <search-fifter :add="false" :fifter="false" :export-all="false" :export-type="moduleType" :export-show="true" :export-name="'商机统计'" style="display:inline-block;position: absolute;right: 22px;" @exportAction="bussinessExport"/>
            </div>
          </div>
        </div>
        <div class="bussiness_table">
          <div class="table_data">
            <el-table :data="tableData" border tooltip-effect="light">
              <el-table-column label="姓名" prop="name" align="center"/>
              <el-table-column label="性别" prop="sex" align="center"/>
              <el-table-column label="出生年份" prop="year" align="center"/>
              <el-table-column label="生日" prop="month" align="center"/>
              <el-table-column v-if="radioType=='staff'" label="部门职务" prop="dept" align="center"/>
              <el-table-column label="手机号" prop="mobile" align="center"/>
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
import { getBirtahdayInfo, exportBirtahdayStatementInfo, exportBirtahdayInfo, getBirtahdayStatementInfo } from '@/api/statement'
export default {
  name: 'BirthdayStatistics',
  data() {
    return {
      choseTab: 'statistics',
      radiodate: 'year',
      dateTime: '',
      choseMonth: '',
      startDate: '',
      endDate: '',
      ishow: false,
      staffCount: 0,
      clientNum: 0,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      courseLabel: {
        courseNum: 0,
        coursewareNum: 0,
        groupNum: 0,
        memberNum: 0
      },
      dateMonth: [{
        value: '1',
        label: '1月'
      }, {
        value: '2',
        label: '2月'
      }, {
        value: '3',
        label: '3月'
      }, {
        value: '4',
        label: '4月'
      }, {
        value: '5',
        label: '5月'
      }, {
        value: '6',
        label: '6月'
      }, {
        value: '7',
        label: '7月'
      }, {
        value: '8',
        label: '8月'
      }, {
        value: '9',
        label: '9月'
      }, {
        value: '10',
        label: '10月'
      }, {
        value: '11',
        label: '11月'
      }, {
        value: '12',
        label: '12月'
      }],
      radioType: 'staff',
      typeList: [
        { text: '员工生日', time: 'staff' },
        { text: '经销商生日', time: 'agent' }
      ],
      tabList: [{
        label: '生日统计',
        name: 'statistics'
      }, {
        label: '生日明细',
        name: 'detail'
      }],

      typedate: [
        { text: '本年', time: 'year' }
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
    if (this.choseTab == 'statistics') {
      this.destoryEcharts(['bussinessLine'], 1)
    }
  },
  methods: {
    bussinessExport() {
      if (this.choseTab == 'statistics') {
        exportBirtahdayStatementInfo().then(res => {
          let filename = ''
          if (this.choseTab == 'statistics') {
            filename = '生日统计导出' + new Date().getTime()
          } else {
            filename = '生日明细导出' + new Date().getTime()
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
          mode: this.radioType,
          month: this.choseMonth,
          page: this.searchInfo.pageID,
          size: this.searchInfo.recPerPage,
          type: 'export'
        }
        exportBirtahdayInfo(info).then(res => {
          let filename = ''
          if (this.choseTab == 'statistics') {
            filename = '生日统计导出' + new Date().getTime()
          } else {
            filename = '生日明细导出' + new Date().getTime()
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
            echart.dispose()
          }
        }, 0)
      }
    },
    getList() {
      const that = this
      this.destoryEcharts(['bussinessLine'], 1)
      if (that.choseTab == 'statistics') {
        getBirtahdayInfo().then(res => {
          if (res.code == 200) {
            that.staffCount = res.data.staffCount
            that.clientNum = res.data.clientNum
            that.tableData = res.data.reportData.tableData
            that.chartsData = res.data.reportData.reportData
            that.initCharts(that.choseTab)
          }
        })
      } else {
        // this.dateTime = new Date(parseTime(new Date(), '{y}-{m}-') + '01').getTime()
        const info = {
          mode: this.radioType,
          month: this.choseMonth,
          page: this.searchInfo.pageID,
          size: this.searchInfo.recPerPage,
          type: ''
        }
        console.log(info)
        getBirtahdayStatementInfo(info).then(res => {
          console.log(res)
          if (res.code == 200) {
            that.tableData = res.data.list
            that.total = parseInt(res.data.total)
          }
        })
      }
    },
    choseTabsType(value) {
      this.destoryEcharts(['bussinessLine'], 1)
      setTimeout(() => {
        this.choseTab = value
        this.tableData = []
        this.chartsData = {}
        console.log(value, 'hahah')
        if (value == 'statistics') {
          this.radiodate = 'year'
          this.startDate = ''
          this.endDate = ''
          this.dateTime = ''
        } else {
          this.startDate = new Date(parseTime(new Date(), '{y}-{m}-') + '01 00:00:00').getTime() / 1000
          this.endDate = new Date(parseTime(new Date(), '{y}-{m}-{d}') + ' 23:59:59').getTime() / 1000
          this.radioType = 'staff'
          this.choseMonth = new Date().getMonth() + 1
          this.dateTime = this.choseMonth + '月'
          console.log(this.dateTime, '选择时间')
        }
        this.getList()
      }, 50)

      // this.initCharts(value)
    },
    initCharts(value) {
      if (value == 'statistics') {
        let option = {}
        const ledged = []
        for (const i in this.chartsData.data) {
          ledged.push(i)
        }
        option = {
          title: {
            text: '生日统计'
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
    choseType(tab) {
      console.log(tab)
      this.tableData = []
      this.total = 0
      this.getList()
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
    monthChange(date) {
      console.log(date, 'askdjasldaksl')
      this.choseMonth = date
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
