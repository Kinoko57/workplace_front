<template>
  <div class="i_performance_bg">
    <my-alert v-if="performanceType=='edit'" title="本次修改的内容，将在下次绩效考核时生效" style="margin-left:0"/>
    <div class="performance_info">
      <div class="performance_info_head">
        <span class="performance_info_title">{{ viewTitle }}</span>
        <span>
          <el-button :loading="submit_loading" type="primary" size="mini" @click="savePerformancePaper">保 存</el-button>
          <el-button plain size="mini" @click="returnBack">返 回</el-button>
        </span>
      </div>
      <div :class="isScroll?'scroll_bar':''" class="exam_scroll">
        <div class="performance_info_detail">
          <div class="performance_form">
            <el-form
              ref="performanceForm"
              :model="performanceForm"
              :rules="rules"
              class="modelForm"
              label-width="100px"
              label-position="right">
              <el-form-item label="绩效主题：" required style="display:inline-block;width:45%;float:left;">
                <el-input v-model.trim="performanceForm.title" style="width:300px" placeholder="请输入绩效主题" />
              </el-form-item>
              <el-form-item label="适用部门：" class="obj_style" required style="display:inline-block;width:50%;float:left;">
                <div class="show_objs">
                  <div class="show_objs_left">
                    <!-- <el-cascader
                      ref="orgLabel"
                      :options="orgList"
                      v-model.trim="orgName"
                      :props="defaultNode"
                      :show-all-levels="false"
                      :change-on-select="true"
                      style="width:400px"
                      placeholder="请选择部门"
                      filterable /> -->
                    <el-select v-model="orgName" filterable placeholder="请选择部门" style="width:400px">
                      <el-option
                        v-for="(select,index) in orgList"
                        :label="select.label"
                        :value="select.id"
                        :key="index"
                      />
                    </el-select>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="考核日期：" required class="score_style" style="display:inline-block;width:45%;float:left;">
                <span>每月</span>
                <el-select v-model="performanceForm.startDate" style="width:80px" placeholder="日期">
                  <el-option label="1号" value="1" />
                  <el-option label="2号" value="2" />
                  <el-option label="3号" value="3" />
                  <el-option label="4号" value="4" />
                  <el-option label="5号" value="5" />
                  <el-option label="6号" value="6" />
                  <el-option label="7号" value="7" />
                  <el-option label="8号" value="8" />
                  <el-option label="9号" value="9" />
                  <el-option label="10号" value="10" />
                  <el-option label="11号" value="11" />
                  <el-option label="12号" value="12" />
                  <el-option label="13号" value="13" />
                  <el-option label="14号" value="14" />
                  <el-option label="15号" value="15" />
                </el-select>
                <!-- <el-input v-model="performanceForm.startDate" style="width:70px" type="number"/> -->
                <span>日——每月</span>
                <!-- <el-input v-model="performanceForm.endDate" style="width:70px" type="number"/> -->
                <el-select v-model="performanceForm.endDate" style="width:80px" placeholder="日期">
                  <el-option label="1号" value="1" />
                  <el-option label="2号" value="2" />
                  <el-option label="3号" value="3" />
                  <el-option label="4号" value="4" />
                  <el-option label="5号" value="5" />
                  <el-option label="6号" value="6" />
                  <el-option label="7号" value="7" />
                  <el-option label="8号" value="8" />
                  <el-option label="9号" value="9" />
                  <el-option label="10号" value="10" />
                  <el-option label="11号" value="11" />
                  <el-option label="12号" value="12" />
                  <el-option label="13号" value="13" />
                  <el-option label="14号" value="14" />
                  <el-option label="15号" value="15" />
                </el-select>
                <span>日</span>
              </el-form-item>
              <el-form-item label="适用时段：" required style="display:inline-block;width:50%;">
                <el-date-picker
                  v-model="performanceForm.time"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"/>
              </el-form-item>
              <el-form-item label="评分标准：" class="score_style" required>
                <span>自评分占比百分之</span>
                <el-input v-model="performanceForm.selfGrade" style="width:80px" type="number" min="0" size="mini" @blur="checkNumSelf" @input="updateValue"/>
                <span>，上级评分占比百分之</span>
                <el-input v-model="performanceForm.superGrade" style="width:80px" type="number" min="0" size="mini" @blur="checkNumSuper" @input="updateValue"/>
              </el-form-item>
              <div class="performance_list">
                <div class="add_btn" style="padding-left:20px;">
                  <el-button type="primary" size="mini" @click="addQuestion">添加试题</el-button>
                </div>
                <ol style="list-style:none;padding:0;margin: 16px;">
                  <li v-for="(performance,index) in performanceShowList" :key="index" class="performance_block">
                    <div class="performance_block_topic">
                      <div class="performance_block_topic_title">评定分</div>
                      <div v-if="performance.type!=4" class="performance_score performance_left">
                        <span v-for="(option,index) in performance.optionsList" :key="index">{{ option.code }}评定分<el-input
                          v-model="option.score"
                          style="width:80px;margin-left:5px"
                          type="number"
                          min="0"
                          size="mini"
                          @blur="checkNumscro"
                          @input="updateValue"/></span>
                      </div>
                      <div v-else class="performance_analysis performance_left">
                        <span>该项满分评定分<el-input
                          v-model="performance.score"
                          style="width:80px;margin-left:5px"
                          type="number"
                          min="0"
                          size="mini"
                          @blur="checkNumscro"
                          @input="updateValue"/></span>
                      </div>
                    </div>
                    <div class="performance_block_topic">
                      <div class="performance_block_topic_title">{{ index+1 }}、</div>
                      <div class="performance_title performance_left">
                        <div class="performance_title_left">
                          <span v-if="performance.type==1">(单选题)</span>
                          <span v-if="performance.type==2">(多选题)</span>
                          <span v-if="performance.type==3">(是非题)</span>
                          <span v-if="performance.type==4">(问答题)</span>
                          <span>{{ performance.title }}</span>
                        </div>
                        <div class="performance_title_right"><i
                          class="el-icon-remove"
                          @click="removeQuestion(performance)" /></div>
                      </div>
                    </div>
                    <div v-if="performance.type!=4" class="performance_block_topic">
                      <div class="performance_block_topic_title">选项</div>
                      <div v-if="performance.type!=4" class="performance_option performance_left">
                        <p v-for="(option,index) in performance.optionsList" :key="index">{{ option.code }}.{{ option.title }}
                        </p>
                      </div>
                    </div>
                    <div class="performance_block_topic">
                      <div class="performance_block_topic_title">备注</div>
                      <div class="performance_analysis performance_left">
                        <el-checkbox v-model="performance.isRemark" true-label="1" false-label="0" @change="changeRemark">
                          自评者需要填写备注说明</el-checkbox>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="performanceShow"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      title="试题库"
      width="1000px"
      class="performanceModel"
      append-to-body
      @close="resetTest">
      <el-scrollbar class="fixed_scroll over_scroll">
        <div class="performance_table">
          <div class="fifter">
            <!-- <search-fifter :fifter="true" @search="fifterSearch" /> -->
            <div class="fifter_block">
              <el-input v-model="fifterKey.value1" placeholder="请输入题目" size="mini" style="width:170px"/>
            </div>
            <div class="fifter_block">
              <el-select v-model="fifterKey.value2" placeholder="请选择类型" size="mini" style="width:170px">
                <el-option
                  v-for="(item,index) in fifterOptions"
                  :key="index"
                  :label="item"
                  :value="index" />
              </el-select>
            </div>
            <div class="fifter_block">
              <el-input v-model="fifterKey.value3" placeholder="请输入创建人" size="mini" style="width:170px"/>
            </div>
            <div class="fifter_block">
              <el-button size="mini" type="primary" round @click="searchTest">搜索</el-button>
              <el-button size="mini" round @click="resetTest">重置</el-button>
            </div>
          </div>
          <el-table ref="exam" :row-key="getRowKeys" :data="tableData" border style="width:720px;margin:0 auto;" @selection-change="choseMoreperformance" >
            <el-table-column type="selection" width="60" align="center"/>
            <el-table-column prop="id" label="题号" width="50" />
            <el-table-column prop="title" label="题目" min-width="140">
              <template slot-scope="scope">
                <span class="over_line_two">{{ scope.row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.type==1">单选题</span>
                <span v-if="scope.row.type==2">多选题</span>
                <span v-if="scope.row.type==3">是非题</span>
                <span v-if="scope.row.type==4">问答题</span>
              </template>
            </el-table-column>
            <el-table-column prop="createdBy" label="创建人" width="80"/>
            <el-table-column prop="createdDate" label="创建时间" width="80"/>
          </el-table>
        </div>
        <div class="info_page" style="padding-right: 72px;">
          <el-pagination
            :current-page="searchInfo.pageID"
            :page-sizes="[5, 10, 50, 100]"
            :page-size="searchInfo.recPerPage"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addperformanceNode('new','')">添加</el-button>
        <!-- <el-button @click="performanceShow=false">取 消</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import {
//   getOrgList
// } from '@/api/system'
import {
  getExecutiveOrg
} from '@/api/public'
import {
  getExamFifter,
  viewPerformance,
  savePerformance,
  updatePerformance
} from '@/api/administration'
import {
  getFifter,
  searchFifter
} from '@/api/public'
export default {
  name: 'PerformanceInfo',
  data() {
    return {
      submit_loading: false,
      isScroll: false,
      orgName: [],
      performanceId: '',
      performanceType: '',
      examIds: '',
      performanceForm: {
        title: '',
        time: [],
        startDate: '',
        endDate: '',
        selfGrade: '',
        superGrade: ''
      },
      getRowKeys(row) {
        return row.id
      },
      rules: {
        title: [{
          required: true,
          message: '绩效主题不能为空',
          trigger: 'blur'
        }],
        time: [{
          required: true,
          message: '适用时段不能为空',
          trigger: 'change'
        }]
      },
      tableData: [],
      viewTitle: '新增/编辑试卷',
      orgList: [{
        id: '',
        name: ''
      }], // 组织架构列表
      defaultNode: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      performanceShowList: [],
      performanceChoseList: [],
      performanceShow: false,
      searchInfo: {
        mode: 'performance', // 类型 日常routine 问卷 survey  绩效 performance
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 5, // 每页显示条数
        recTotal: 0 // 总条数
      },
      fifterKey: { // 选择试题的高级搜索
        app: 'ad',
        module: 'itembank',
        field1: 't1.title',
        field2: 't1.type',
        field3: 't2.realname',
        value1: '',
        value2: '',
        value3: '',
        count: 3
      },
      fifterOptions: [],
      leavePage: 1,
      num: 1,
      total: 0 // 总条数
    }
  },
  mounted() {
    // 监听浏览器返回
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      // window.addEventListener('popstate', e => this.goBack(e))
      window.addEventListener('popstate', this.goBack, false)
    }
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    // 页面第一个渲染的函数
    if (this.$route.query.type === 'new') {
      this.viewTitle = '新增绩效考试试卷'
      this.performanceType = 'new'
    } else if (this.$route.query.type === 'edit') {
      this.viewTitle = '编辑绩效考试试卷'
      this.performanceId = this.$route.query.id
      this.performanceType = 'edit'
    } else if (this.$route.query.type === 'copy') {
      this.viewTitle = '复制绩效考试试卷'
      this.performanceId = this.$route.query.id
      this.performanceType = 'copy'
    }
    this.$route.meta.title = this.viewTitle
    // 获取列表
    this.getList()
    // 获取绩效考核详情中的s筛选条件
    this.getFifterInfo()
    // 根据id获取试卷详情
    if (this.performanceId !== '') {
      this.getDetail(this.performanceType)
    }
  },
  destroyed() {
    window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
    window.removeEventListener('popstate', this.goBack, false)
  },
  methods: {
    updateValue() {
      this.$forceUpdate()
    },
    changeHeight() {
      setTimeout(() => {
        console.log(document.getElementsByClassName('modelForm')[0].offsetHeight)
        console.log(document.getElementsByClassName('exam_scroll')[0].offsetHeight)
        if (document.getElementsByClassName('modelForm')[0].offsetHeight > document.getElementsByClassName('exam_scroll')[0].offsetHeight) {
          this.isScroll = true
        } else {
          this.isScroll = false
        }
      }, 100)
    },
    getList() {
      const that = this
      // 获取组织架构列表
      getExecutiveOrg().then(res => {
        if (res.code === 200 || res.code === '200') {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].label = res.data[i].pname + '-' + res.data[i].name
          }
          const arr = res.data
          // that.formatDep(arr)
          arr.unshift({
            id: '0',
            label: '所有部门'
          })
          that.orgList = arr
        }
      })
    },
    getFifterInfo() {
      getFifter('itembank', 'ad').then(res => {
        const that = this
        if (res.code === 200) {
          that.fifterOptions = res.data.params['t1.type'].values
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
    fifterTable(event) {
      console.log(event.prop)
      console.log(event.order)
      if (event.order === 'ascending') {
        this.searchInfo.orderBy = event.prop + '_asc'
      } else if (event.order === 'descending') {
        this.searchInfo.orderBy = event.prop + '_desc'
      } else {
        this.searchInfo.orderBy = ''
      }
      this.searchInfo.pageID = 1
      this.tableData = []
      this.loading = true
      this.getperformanceList()
    },
    getDetail(type) {
      const that = this
      viewPerformance(this.performanceId).then(res => {
        if (res.code === '200' || res.code === 200) {
          const view = res.data.performance
          const arr = []
          arr.push(view.startTime)
          arr.push(view.endTime)
          that.orgName = view.role
          that.performanceForm = {
            title: view.title,
            time: arr,
            startDate: view.startDate,
            endDate: view.endDate,
            selfGrade: view.selfGrade,
            superGrade: view.superGrade
          }
          that.changeHeight()
          that.changeList(view)
        }
      })
    },
    // 将试题列表进行转换
    changeList(data) {
      // 转换试题库
      this.choseMoreperformance(data.itembank)
      this.addperformanceNode('edit', data.subject)
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
    changeRemark(e) {
      this.$forceUpdate()
    },
    checkNumSelf() {
      console.log(this.performanceForm.selfGrade)
      if (this.performanceForm.selfGrade < 0) {
        this.$message.warning('绩效占比不能为负数！')
        this.performanceForm.selfGrade = 0
        this.performanceForm.superGrade = 100
      } else if (this.performanceForm.selfGrade > 100) {
        this.$message.warning('绩效占比不能大于100！')
        this.performanceForm.selfGrade = 100
        this.performanceForm.superGrade = 0
      } else {
        this.performanceForm.superGrade = 100 - this.performanceForm.selfGrade
      }
      this.$forceUpdate()
    },
    checkNumSuper() {
      if (this.performanceForm.superGrade < 0) {
        this.$message.warning('绩效占比不能为负数！')
        this.performanceForm.superGrade = 0
        this.performanceForm.selfGrade = 100
      } else if (this.performanceForm.selfGrade > 100) {
        this.$message.warning('绩效占比不能大于100！')
        this.performanceForm.superGrade = 100
        this.performanceForm.selfGrade = 0
      } else {
        this.performanceForm.selfGrade = 100 - this.performanceForm.superGrade
      }
      this.$forceUpdate()
    },
    checkNumscro(e) {
      console.log(e)
      if (parseInt(e.target.value) < 0) {
        this.$message.warning('输入的分值不可以为负数')
        e.target.value = 0
      } else if (e.target.value === '') {
        this.$message.warning('输入的分值不可以为空')
        e.target.value = 0
      } else {
        e.target.value = parseInt(e.target.value)
      }
    },
    getperformanceList() {
      const info = {
        ids: this.examIds
      }
      const that = this
      // 获取绩效试题库
      getExamFifter(this.searchInfo, info).then(res => {
        if (res.code === 200 || res.code === '200') {
          that.tableData = res.data.itembanks
          that.total = res.data.pager.recTotal
        }
      })
    },
    addQuestion() {
      if (this.performanceType === 'edit') {
        const arr = []
        for (let i = 0; i < this.performanceShowList.length; i++) {
          arr.push(this.performanceShowList[i].id)
        }
        this.examIds = arr.join(',')
      }
      this.getperformanceList()
      this.performanceChoseList = []
      this.performanceShow = true
    },
    removeQuestion(item) {
      let index = 0
      index = this.performanceShowList.indexOf(item)
      this.performanceShowList.splice(index, 1)
      const arr = this.performanceShowList.map(function(o) {
        return o.id
      })
      this.examIds = arr.join(',')
      this.changeHeight()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.searchInfo.pageID = 1
      this.searchInfo.recPerPage = val
      this.tableData = []
      this.getperformanceList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.searchInfo.pageID = val
      this.getperformanceList()
    },
    beforeunloadHandler(e) {
      if (window.localStorage.getItem('logout') === 0 || window.localStorage.getItem('logout') === '0') {
        if (this.$route.path === '/administration/performanceIndex/performanceInfo') {
          e = e || window.event
          if (e) {
            e.returnValue = '关闭提示'
          }
          return '关闭提示'
        }
      }
    },
    goBack() {
      if (this.leavePage === 1) {
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
      } else if (this.leavePage === 2) {
        this.$router.go(-1)
      }
    },
    returnBack() {
      this.leavePage = 2
      this.$confirm('是否离开当前页面，离开页面会导致已输入内容丢失?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.$router.go(-1)
      }).catch(() => {
        console.log('用户点击了取消')
        this.leavePage = 1
      })
    },
    savePerformancePaper() {
      const that = this
      let flag = true
      if (this.performanceForm.title == '') {
        this.$message.warning('绩效主题不能为空')
      } else if (this.orgName.length === 0) {
        this.$message.warning('适用部门不能为空')
      } else if (this.performanceForm.startDate == '') {
        this.$message.warning('考核日期不能为空')
      } else if (this.performanceForm.endDate == '') {
        this.$message.warning('考核日期不能为空')
      } else if (this.performanceForm.time.length == 0) {
        this.$message.warning('适用时段不能为空')
      } else if (this.performanceForm.selfGrade == '') {
        this.$message.warning('评分标准不能为空')
      } else if (this.performanceForm.superGrade == '') {
        this.$message.warning('评分标准不能为空')
      } else if (this.performanceShowList.length === 0) {
        this.$message.warning('试题不能为空')
      } else {
        let sum = 0
        let isErr = true
        const list = this.performanceShowList
        console.log(this.performanceShowList)
        for (let i = 0; i < list.length; i++) {
          if (list[i].type == '4') {
            sum += parseInt(list[i].score)
            console.log(list[i].score)
            if (parseInt(list[i].score) == 0 || parseInt(list[i].score) < 0 || list[i].score == '') {
              this.$message.warning('题目分值不能为负数或为空')
              isErr = false
              flag = false
              break
            }
          } else {
            console.log(list[i].optionsList, '5432121')
            list[i].optionsList.map(function(item) {
              if (parseInt(item.score) < 0 || item.score === '') {
                that.$message.warning('题目分值不能为负数或为空')
                isErr = false
                flag = false
                // break
              }
            })
            sum += parseInt(Math.max.apply(Math, list[i].optionsList.map(function(o) {
              return o.score
            })))
          }
        }
        if (isErr) {
          let msg = ''
          if (sum > 100) {
            msg = '当前试题总分为' + sum + ',不能超过100分'
            this.$message.warning(msg)
            flag = false
          } else if (sum < 100) {
            msg = '当前试题总分为' + sum + ',不能小于100分'
            this.$message.warning(msg)
            flag = false
          } else {
            console.log('啥')
          }
        }
        if (flag) {
          this.$refs['performanceForm'].validate((valid) => {
          // 格式化试题列表
            const exams = []
            for (let i = 0; i < this.performanceShowList.length; i++) {
              if (this.performanceShowList[i].type === '4') {
                exams.push({
                  id: this.performanceShowList[i].id,
                  score: parseInt(this.performanceShowList[i].score),
                  isRemark: this.performanceShowList[i].isRemark
                })
              } else {
                const arr = this.performanceShowList[i].optionsList.map(function(o) {
                  return parseInt(o.score)
                })
                exams.push({
                  id: this.performanceShowList[i].id,
                  score: arr.join(','),
                  isRemark: this.performanceShowList[i].isRemark
                })
              }
            }
            const info = {
              title: this.performanceForm.title,
              startTime: this.performanceForm.time[0],
              endTime: this.performanceForm.time[1],
              startDate: this.performanceForm.startDate,
              endDate: this.performanceForm.endDate,
              selfGrade: this.performanceForm.selfGrade,
              superGrade: this.performanceForm.superGrade,
              role: this.orgName,
              subject: JSON.stringify(exams)
            }
            this.leavePage = 2
            if (this.performanceId === '') {
              savePerformance(info).then(res => {
                if (res.code === 200 || res.code === '200') {
                  that.$message({
                    message: '试卷添加成功！',
                    type: 'success'
                  })
                  that.$router.go(-1)
                } else {
                  that.$message({
                    message: res.data.msg,
                    type: 'warning'
                  })
                  that.leavePage = 1
                }
              })
            } else {
              updatePerformance(this.performanceId, info).then(res => {
                if (res.code === 200 || res.code === '200') {
                  that.$message({
                    message: '试卷更新成功！',
                    type: 'success'
                  })
                  that.$router.go(-1)
                } else {
                  that.$message({
                    message: res.data.msg,
                    type: 'warning'
                  })
                  that.leavePage = 1
                }
              })
            }
          })
        }
      }
    },
    resetModel() {

    },
    searchTest() {
      console.log(this.fifterKey)
      const that = this
      searchFifter(this.fifterKey).then(res => {
        console.log(res)
        if (res.code === 200) {
          that.searchInfo.search = 'bySearch'
          that.searchInfo.pageID = 1
          that.tableData = []
          that.loading = true
          that.getperformanceList()
          // this.$emit('search', true)
        }
      })
    },
    resetTest() {
      console.log('重置')
      this.fifterKey = {
        app: 'ad',
        module: 'itembank',
        field1: 't1.title',
        field2: 't1.type',
        field3: 't2.realname',
        value1: '',
        value2: '',
        value3: '',
        count: 3
      }
      this.searchInfo.search = ''
    },
    choseMoreperformance(val) {
      this.performanceChoseList = []
      this.performanceChoseList = val
      for (let i = 0; i < this.performanceChoseList.length; i++) {
        // 多选题
        if (this.performanceChoseList[i].type === '2') {
          this.performanceChoseList[i].trueAnswer = this.performanceChoseList[i].questionAnswer.split(',')
          this.performanceChoseList[i].isRemark = '0'
        }
        if (this.performanceChoseList[i].type !== '4') {
          this.performanceChoseList[i].optionsList = JSON.parse(this.performanceChoseList[i].questionSelect)
          for (let j = 0; j < this.performanceChoseList[i].optionsList.length; j++) {
            this.performanceChoseList[i].optionsList[j].score = 0
            this.performanceChoseList[i].isRemark = '0'
          }
        } else {
          this.performanceChoseList[i].score = 0
          this.performanceChoseList[i].isRemark = '0'
        }
      }
    },
    addperformanceNode(type, data) {
      this.examIds = ''
      if (this.performanceShowList.length === 0) {
        this.performanceShow = false
        this.performanceShowList = this.performanceChoseList
        const arr = this.performanceShowList.map(function(o) {
          return o.id
        })
        this.examIds = arr.join(',')
      } else {
        let flag = true
        for (let i = 0; i < this.performanceChoseList.length; i++) {
          for (let j = 0; j < this.performanceShowList.length; j++) {
            if (this.performanceChoseList[i].id === this.performanceShowList[j].id) {
              const msg = '不允许添加重复试题，题号为' + this.performanceChoseList[i].id + '并且标题为' + this.performanceChoseList[i]
                .title + '重复！'
              this.$message.warning(msg)
              flag = false
              break
            }
          }
        }
        if (flag) {
          this.performanceShowList = this.performanceShowList.concat(this.performanceChoseList)
          this.performanceShow = false
          this.performanceChoseList = []
          const arr = this.performanceShowList.map(function(o) {
            return o.id
          })
          this.examIds = arr.join(',')
        }
      }
      if (type === 'new') {
        // 弹框新增
        this.$refs.exam.clearSelection()
      } else {
        const arr = JSON.parse(data)
        // 编辑显示
        for (let i = 0; i < this.performanceShowList.length; i++) {
          for (let j = 0; j < arr.length; j++) {
            if (this.performanceShowList[i].id === arr[j].id) {
              this.performanceShowList[i].isRemark = arr[j].isRemark
              if (this.performanceShowList[i].type === 4 || this.performanceShowList[i].type === '4') {
                this.performanceShowList[i].score = arr[j].score
              } else {
                const scoreList = arr[j].score.split(',')
                for (let k = 0; k < this.performanceShowList[i].optionsList.length; k++) {
                  this.performanceShowList[i].optionsList[k].score = scoreList[k]
                }
              }
            }
          }
        }
      }
      this.tableData = []
      this.$forceUpdate()
      this.changeHeight()
    }
  }
}

</script>
<style lang="less" scoped>
  .i_performance_bg {
    background: #f2f2f2;
    padding: 10px;
    position: relative;
    width: 100%;
    height: calc(100vh - 110px);
    top: 0;
    z-index: 99;
    overflow: hidden;

    .performance_info {
      background: #fff;
      padding: 10px;

      .performance_info_head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ccc;
        padding-bottom: 10px;

        .performance_info_title {
          font-family: '微软雅黑 Bold', '微软雅黑';
          font-weight: 700;
          font-style: normal;
          font-size: 14px;
          color: #333333;
        }
      }

      .exam_scroll {
        height: calc(100vh - 200px);
        .performance_info_detail {
          .performance_form {
            margin-top: 10px;
            .obj_style {
              .show_objs {
                display: flex;
                align-items: center;
                // margin-bottom: 10px;

                .show_tags {
                  min-height: 100px;
                  background-color: #fff;
                  background-image: none;
                  border: 1px solid #dcdfe6;
                  border-radius: 4px;
                  padding: 5px 15px;
                  line-height: 1.5;
                  margin-bottom: 10px;

                  span {
                    margin-right: 5px;
                    margin-bottom: 5px;
                  }
                }

                .show_objs_right {
                  display: inline-flex;
                  margin-left: 20px;

                  i {
                    font-size: 26px;
                  }
                }
              }
            }

            .score_style {
              span {
                margin-right: 5px;
                font-size: 14px;
                color: #333;
              }
            }

            .performance_list {
              border-top: 1px solid #e0e0e0;
              padding-top: 10px;
              .performance_block {
                font-size: 14px;
                font-family: 'Arial Normal', 'Arial';
                font-weight: 400;
                color: #333;
                margin-bottom: 20px;
                border: 1px solid #e0e0e0;
                border-bottom: none;
                .performance_block_topic{
                  display: flex;
                  border-bottom: 1px solid #e0e0e0;
                  .performance_block_topic_title{
                    font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
                    font-weight: 700;
                    font-size: 12px;
                    color: #333333;
                    background: #f9fafc;
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    border-right: 1px solid #e0e0e0;
                    min-width: 80px;
                  }
                  .performance_left{
                    padding: 6px 10px;;
                  }
                .performance_title {
                  color: #333;
                  display: flex;
                  align-items: center;

                  i {
                    font-size: 24px;
                    margin-left: 20px;
                  }
                }

                .performance_option {
                  .active {
                    color: #006633;
                    font-weight: 700;
                  }
                }

                .performance_analysis {
                  margin-top: 10px;
                }

                .performance_score {
                  span {
                    margin-right: 10px;
                  }
                }
                }

              }
            }
          }

        }
      }

    }

  }

  .performanceModel {
    .performance_table{
      padding-top: 20px;
      .fifter{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        margin-top: -10px;
        .fifter_block{
          margin-right: 10px;
        }
      }
    }
    .view_page {
      text-align: center;
      margin-top: 10px;
      margin-bottom: 20px;
    }
  }

</style>
