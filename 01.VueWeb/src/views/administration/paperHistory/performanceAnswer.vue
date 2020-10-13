<template>
  <div class="i_exam_bg">
    <div class="exam_info">
      <div class="exam_info_head">
        <span class="exam_info_title">{{ viewTitle }}</span>
        <span>
          <el-button v-if="examType=='answer'" :loading="submit_loading" size="mini" type="primary" @click="saveExamPaper">提 交</el-button>
          <el-button v-if="examType=='super'" :loading="submit_loading" size="mini" type="primary" @click="saveExamPaper">审 批</el-button>
          <el-button v-if="examType=='approval'" :loading="submit_loading" size="mini" type="primary" @click="saveExamPaper">审 批</el-button>
          <el-button plain size="mini" @click="returnBack">返 回</el-button>
        </span>
      </div>
      <div :class="isScroll?'scroll_bar':''" class="exam_scroll">
        <div class="exam_info_detail">
          <div class="exam_paper">
            <div class="exam_paper_title">
              <h2>{{ examInfo.title }}</h2>
            </div>
            <div class="exam_paper_time">
              <p>本卷共分为{{ examShowList.length }}道小题，总分100分</p>
              <p>绩效考核时间：本月{{ examInfo.startDate }}号至{{ examInfo.endDate }}号</p>
              <p>绩效适用部门：{{ examInfo.organizeName }}</p>
              <p v-if="examInfo.status==3||examInfo.status==4">绩效考核人：{{ examInfo.accountName }}</p>
              <p>自评分占比：{{ examInfo.selfGrade }}%，上级评分占比：{{ examInfo.superGrade }}%</p>
              <p>
                <span v-if="examInfo.status==3||examInfo.status==4">自评总分：<span class="score">{{ selfScore }}</span> </span>
                <span v-if="examInfo.status==4">上级总分：<span class="score">{{ superScore }}</span></span>
                <span v-if="examInfo.status==4">最终总分：<span class="score">{{ examInfo.score }}</span></span>
              </p>
            </div>
            <div class="exam_list">
              <ul v-if="examType=='answer'">
                <li v-for="(exam,index) in examShowList" :key="index" class="exam_block">
                  <div class="exam_title">
                    <div class="exam_title_left">
                      <span>{{ index+1 }}、</span>
                      <span v-if="exam.type==1" class="paper_type">(单选题)</span>
                      <span v-if="exam.type==2" class="paper_type">(多选题)</span>
                      <span v-if="exam.type==3" class="paper_type">(是非题)</span>
                      <span v-if="exam.type==4" class="paper_type">(问答题)</span>
                      <span>{{ exam.title }}</span>
                    </div>
                    <div v-if="exam.type!=4" class="exam_title_right">
                      <span>按选择项依次为：{{ exam.score }}分</span>
                    </div>
                    <div v-else class="exam_title_right">
                      <span>满分为：{{ exam.score }}分</span>
                    </div>
                  </div>
                  <div v-if="exam.type==1" class="exam_option">
                    <el-radio-group v-model="exam.answers" @change="choseRadio(index,exam.answers)">
                      <el-radio
                        v-for="(option,index) in exam.optionsList"
                        :key="index"
                        :label="option.code"
                        class="paper_block">
                        {{ option.code }}.{{ option.title }}</el-radio>
                    </el-radio-group>
                  </div>
                  <div v-if="exam.type==2" class="exam_option">
                    <el-checkbox-group v-model="exam.answerList" @change="choseCheck(index,exam.answerList)">
                      <el-checkbox
                        v-for="(option,index) in exam.optionsList"
                        :key="index"
                        :label="option.code"
                        class="paper_block">
                        {{ option.code }}.{{ option.title }}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div v-if="exam.type==3" class="exam_option">
                    <el-radio-group v-model="exam.answers" @change="choseRadio(index,exam.answers)">
                      <el-radio
                        v-for="(option,index) in exam.optionsList"
                        :key="index"
                        :label="option.code"
                        class="paper_block">
                        {{ option.code }}.{{ option.title }}</el-radio>
                    </el-radio-group>
                  </div>
                  <div v-if="exam.type==4" class="exam_option">
                    <span>得分：</span>
                    <el-input
                      v-model="exam.myScore"
                      :max="exam.score"
                      style="width:120px"
                      type="number"
                      min="0"
                      placeholder="请输入分数"
                      @change="updateValue"
                      @input="updateValue"
                      @blur="scoreNum" />
                  </div>
                  <div v-if="exam.isRemark==1" class="exam_remark">
                    <el-input
                      v-model="exam.remark"
                      :rows="3"
                      type="textarea"
                      style="width:600px"
                      placeholder="请填写备注（必填）"
                      @input="updateValue"/>
                  </div>
                  <div v-if="exam.answer!=''" class="exam_analysis">
                    评分标准：{{ exam.answer }}
                  </div>
                </li>
              </ul>
              <ul v-if="examType=='view'">
                <li v-for="(exam,index) in examShowList" :key="index" class="exam_block">
                  <div class="exam_title">
                    <div class="exam_title_left">
                      <span>{{ index+1 }}、</span>
                      <span v-if="exam.type==1" class="paper_type">(单选题)</span>
                      <span v-if="exam.type==2" class="paper_type">(多选题)</span>
                      <span v-if="exam.type==3" class="paper_type">(是非题)</span>
                      <span v-if="exam.type==4" class="paper_type">(问答题)</span>
                      <span>{{ exam.title }}</span>
                    </div>
                    <div v-if="exam.type!=4" class="exam_title_right">
                      <span>按选择项依次为：{{ exam.score }}分</span>
                    </div>
                    <div v-else class="exam_title_right">
                      <span>满分为：{{ exam.score }}分</span>
                    </div>
                  </div>
                  <div v-if="exam.type==1" class="exam_option">
                    <span v-for="(option,index) in exam.optionsList" :key="index" class="paper_block">
                      {{ option.code }}.{{ option.title }}</span>
                  </div>
                  <div v-if="exam.type==2" class="exam_option">
                    <span v-for="(option,index) in exam.optionsList" :key="index" class="paper_block">
                      {{ option.code }}.{{ option.title }}</span>
                  </div>
                  <div v-if="exam.type==3" class="exam_option">
                    <span v-for="(option,index) in exam.optionsList" :key="index" class="paper_block">
                      {{ option.code }}.{{ option.title }}</span>
                  </div>
                  <div v-if="exam.isRemark==1" class="exam_remark">
                    <el-input
                      v-model="exam.remark"
                      :rows="3"
                      type="textarea"
                      style="width:600px"
                      placeholder="请填写备注（必填）"
                      @input="updateValue"/>
                  </div>
                  <div v-if="examInfo.status==3||examInfo.status==4" class="exam_self">
                    <span v-if="exam.type!=4">本人选项：<i>{{ exam.myAnswer }}</i></span><span>本题得分：<i>{{ exam.realScore }}</i></span>
                    <p v-if="exam.remark!=''">本人备注：<i>{{ exam.remark }}</i></p>
                  </div>
                  <div v-if="examInfo.status==4" class="exam_my">
                    <span v-if="exam.type!=4">上级选项：<i>{{ exam.superMyAnswer }}</i></span><span>上级评分：<i>{{ exam.superRealScore }}</i></span>
                    <p v-if="exam.superremark!=''">上级备注：<i>{{ exam.superremark }}</i></p>
                  </div>
                  <div v-if="exam.answer!=''" class="exam_analysis">
                    评分标准：{{ exam.answer }}
                  </div>
                </li>
              </ul>
              <ul v-if="examType=='super'">
                <li v-for="(exam,index) in examShowList" :key="index" class="exam_block">
                  <div class="exam_title">
                    <div class="exam_title_left">
                      <span>{{ index+1 }}、</span>
                      <span v-if="exam.type==1" class="paper_type">(单选题)</span>
                      <span v-if="exam.type==2" class="paper_type">(多选题)</span>
                      <span v-if="exam.type==3" class="paper_type">(是非题)</span>
                      <span v-if="exam.type==4" class="paper_type">(问答题)</span>
                      <span>{{ exam.title }}</span>
                    </div>
                    <div v-if="exam.type!=4" class="exam_title_right">
                      <span>按选择项依次为：{{ exam.score }}分</span>
                    </div>
                    <div v-else class="exam_title_right">
                      <span>满分为：{{ exam.score }}分</span>
                    </div>
                  </div>
                  <div v-if="exam.type==1" class="exam_option">
                    <el-radio-group v-model="exam.superMyAnswer" @change="choseRadio(index,exam.superMyAnswer)">
                      <el-radio
                        v-for="(option,index) in exam.optionsList"
                        :key="index"
                        :label="option.code"
                        class="paper_block">
                        {{ option.code }}.{{ option.title }}</el-radio>
                    </el-radio-group>
                  </div>
                  <div v-if="exam.type==2" class="exam_option">
                    <el-checkbox-group v-model="exam.answerList" @change="choseCheck(index,exam.answerList)">
                      <el-checkbox
                        v-for="(option,index) in exam.optionsList"
                        :key="index"
                        :label="option.code"
                        class="paper_block">
                        {{ option.code }}.{{ option.title }}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div v-if="exam.type==3" class="exam_option">
                    <el-radio-group v-model="exam.superMyAnswer" @change="choseRadio(index,exam.superMyAnswer)">
                      <el-radio
                        v-for="(option,index) in exam.optionsList"
                        :key="index"
                        :label="option.code"
                        class="paper_block">
                        {{ option.code }}.{{ option.title }}</el-radio>
                    </el-radio-group>
                  </div>
                  <div class="exam_self">
                    <span v-if="exam.type!=4">本人选项：<i>{{ exam.myAnswer }}</i></span><span>本题得分：<i>{{ exam.realScore }}</i></span>
                    <p v-if="exam.remark!=''">本人备注：<i>{{ exam.remark }}</i></p>
                  </div>
                  <div v-if="examType=='approval'" class="exam_my">
                    <span v-if="exam.type!=4">上级选项：<i>{{ exam.superMyAnswer }}</i></span><span>上级评分：<i>{{ exam.superRealScore }}</i></span>
                    <p v-if="exam.superremark!=''">上级备注：<i>{{ exam.superremark }}</i></p>
                  </div>
                  <div v-if="exam.type==4" class="exam_option">
                    <span>得分：</span>
                    <el-input
                      v-model="exam.superRealScore"
                      :max="exam.score"
                      style="width:120px"
                      type="number"
                      min="0"
                      placeholder="请输入分数"
                      @change="updateValue"
                      @input="updateValue"
                      @blur="scoreNum"/>
                  </div>
                  <div v-if="exam.isRemark==1" class="exam_remark">
                    <el-input
                      v-model="exam.superremark"
                      :rows="3"
                      type="textarea"
                      style="width:600px"
                      placeholder="请填写备注（必填）"
                      @input="updateValue"/>
                  </div>
                  <div v-if="exam.answer!=''" class="exam_analysis">
                    评分标准：{{ exam.answer }}
                  </div>
                </li>
              </ul>
              <ul v-if=" examType=='approval'">
                <li v-for="(exam,index) in examShowList" :key="index" class="exam_block">
                  <div class="exam_title">
                    <div class="exam_title_left">
                      <span>{{ index+1 }}、</span>
                      <span v-if="exam.type==1" class="paper_type">(单选题)</span>
                      <span v-if="exam.type==2" class="paper_type">(多选题)</span>
                      <span v-if="exam.type==3" class="paper_type">(是非题)</span>
                      <span v-if="exam.type==4" class="paper_type">(问答题)</span>
                      <span>{{ exam.title }}</span>
                    </div>
                    <div v-if="exam.type!=4" class="exam_title_right">
                      <span>按选择项依次为：{{ exam.score }}分</span>
                    </div>
                    <div v-else class="exam_title_right">
                      <span>满分为：{{ exam.score }}分</span>
                    </div>
                  </div>
                  <div v-if="exam.type==1" class="exam_option">
                    <el-radio-group v-model="exam.topAnswer" @change="choseRadio(index,exam.topAnswer)">
                      <el-radio
                        v-for="(option,index) in exam.optionsList"
                        :key="index"
                        :label="option.code"
                        class="paper_block">
                        {{ option.code }}.{{ option.title }}</el-radio>
                    </el-radio-group>
                  </div>
                  <div v-if="exam.type==2" class="exam_option">
                    <el-checkbox-group v-model="exam.answerList" @change="choseCheck(index,exam.answerList)">
                      <el-checkbox
                        v-for="(option,index) in exam.optionsList"
                        :key="index"
                        :label="option.code"
                        class="paper_block">
                        {{ option.code }}.{{ option.title }}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div v-if="exam.type==3" class="exam_option">
                    <el-radio-group v-model="exam.topAnswer" @change="choseRadio(index,exam.topAnswer)">
                      <el-radio
                        v-for="(option,index) in exam.optionsList"
                        :key="index"
                        :label="option.code"
                        class="paper_block">
                        {{ option.code }}.{{ option.title }}</el-radio>
                    </el-radio-group>
                  </div>
                  <div class="exam_self" style="padding-bottom:10px">
                    <span v-if="exam.type!=4">本人选项：<i>{{ exam.myAnswer }}</i></span><span>本题得分：<i>{{ exam.realScore }}</i></span>
                    <p v-if="exam.remark!=''">本人备注：<i>{{ exam.remark }}</i></p>
                  </div>
                  <div v-if="examType=='approval'" class="exam_my" style="padding-bottom:10px">
                    <span v-if="exam.type!=4">上级选项：<i>{{ exam.superMyAnswer }}</i></span><span>上级评分：<i>{{ exam.superRealScore }}</i></span>
                    <p v-if="exam.superremark!=''">上级备注：<i>{{ exam.superremark }}</i></p>
                  </div>
                  <div v-if="exam.type==4" class="exam_option" style="padding-bottom:10px">
                    <span>得分：</span>
                    <el-input
                      v-model="exam.topRealScore"
                      :max="exam.score"
                      style="width:120px"
                      type="number"
                      min="0"
                      placeholder="请输入分数"
                      @change="updateValue"
                      @input="updateValue"
                      @blur="scoreNum"/>
                  </div>
                  <div v-if="exam.isRemark==1" class="exam_remark" style="padding-bottom:10px">
                    <el-input
                      v-model="exam.topremark"
                      :rows="3"
                      type="textarea"
                      style="width:600px"
                      placeholder="请填写备注（必填）"
                      @input="updateValue"/>
                  </div>
                  <div v-if="exam.answer!=''" class="exam_analysis" style="padding-bottom:10px">
                    评分标准：{{ exam.answer }}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import {
//   getAgentview
// } from '@/api/agent'
import {
  viewExamPerformance,
  answerExamPerformance,
  resultExamPerformance,
  answerSuperPerformance
} from '@/api/administration'
export default {
  name: 'PerformanceAnswer',
  data() {
    return {
      isScroll: false,
      submit_loading: false,
      examId: '',
      examType: '',
      examInfo: {},
      examIds: '',
      loading: false,
      answerType: '',
      selfScore: '',
      superScore: '',
      rules: {
        title: [{
          required: true,
          message: '考试主题不能为空',
          trigger: 'blur'
        }],
        time: [{
          required: true,
          message: '开始时间不能为空',
          trigger: 'change'
        }]
      },
      tableData: [],
      viewTitle: '试卷详情',
      examShowList: [],
      examChoseList: [],
      examShow: false,
      searchInfo: {
        mode: 'routine', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 5, // 每页显示条数
        recTotal: 0 // 总条数
      },
      total: 0 // 总条数
    }
  },
  mounted() {
    // 页面第一个渲染的函数
    if (this.$route.query.type === 'answer') {
      this.viewTitle = '绩效详情'
      this.examId = this.$route.query.id
      this.examType = 'answer'
      this.answerType = 'self'
    } else if (this.$route.query.type === 'view') {
      this.viewTitle = '查看绩效结果'
      this.examId = this.$route.query.id
      this.examType = 'view'
    } else if (this.$route.query.type === 'super') {
      this.viewTitle = '审核绩效'
      this.examId = this.$route.query.id
      this.examType = 'super'
      this.answerType = 'super'
    } else {
      this.viewTitle = '审核绩效'
      this.examId = this.$route.query.id
      this.examType = 'approval'
    }
    // 根据id获取试卷详情
    if (this.examId !== '') {
      this.getDetail(this.examType)
    }
  },
  methods: {
    updateValue() {
      this.$forceUpdate()
    },
    scoreNum(e) {
      e.target.value = parseInt(e.target.value)
    },
    changeHeight() {
      setTimeout(() => {
        console.log(document.getElementsByClassName('exam_paper')[0].offsetHeight)
        console.log(document.getElementsByClassName('exam_scroll')[0].offsetHeight)
        if (document.getElementsByClassName('exam_paper')[0].offsetHeight > document.getElementsByClassName('exam_scroll')[0].offsetHeight) {
          this.isScroll = true
        } else {
          this.isScroll = false
        }
      }, 100)
    },
    getDetail(type) {
      console.log(type)
      const that = this
      if (type === 'answer') {
        viewExamPerformance(this.examId).then(res => {
          if (res.code === '200' || res.code === 200) {
            that.examInfo = res.data
            // 转换试题库
            that.choseMoreExam(res.data)
          } else {
            that.$confirm(res.data.msg, '提示', {
              confirmButtonText: '我知道了',
              showCancelButton: false,
              type: 'warning',
              showClose: false,
              closeOnClickModal: false
            }).then(() => {
              window.localStorage.setItem('activetab', 'my')
              that.$router.go(-1)
            })
          }
        })
      } else if (type === 'view') {
        resultExamPerformance(this.examId).then(res => {
          if (res.code === '200' || res.code === 200) {
            that.examInfo = res.data
            // 转换试题库
            that.choseMoreExam(res.data)
          } else {
            that.$confirm(res.data.msg, '提示', {
              confirmButtonText: '我知道了',
              showCancelButton: false,
              type: 'warning',
              showClose: false,
              closeOnClickModal: false
            }).then(() => {
              window.localStorage.setItem('activetab', 'my')
              that.$router.go(-1)
            })
          }
        })
      } else if (type === 'super') {
        resultExamPerformance(this.examId).then(res => {
          if (res.code === '200' || res.code === 200) {
            that.examInfo = res.data
            // 转换试题库
            that.choseMoreExam(res.data)
          } else {
            that.$confirm(res.data.msg, '提示', {
              confirmButtonText: '我知道了',
              showCancelButton: false,
              type: 'warning',
              showClose: false,
              closeOnClickModal: false
            }).then(() => {
              window.localStorage.setItem('activetab', 'my')
              that.$router.go(-1)
            })
          }
        })
      } else {
        resultExamPerformance(this.examId).then(res => {
          if (res.code === '200' || res.code === 200) {
            that.examInfo = res.data
            // 转换试题库
            that.choseMoreExam(res.data)
          } else {
            that.$confirm(res.data.msg, '提示', {
              confirmButtonText: '我知道了',
              showCancelButton: false,
              type: 'warning',
              showClose: false,
              closeOnClickModal: false
            }).then(() => {
              window.localStorage.setItem('activetab', 'my')
              that.$router.go(-1)
            })
          }
        })
      }
    },
    returnBack() {
      if (this.examType !== 'view') {
        this.$confirm('是否离开当前页面，离开页面会导致已输入内容丢失?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false
        }).then(() => {
          console.log('用户点击了确定')
          this.$router.go(-1)
        }).catch(() => {
          console.log('用户点击了取消')
        })
      } else {
        this.$router.go(-1)
      }
    },
    saveExamPaper() {
      console.log(this.examShowList)
      const that = this
      let flag = true
      const arr = []
      console.log(this.examShowList)
      for (let i = 0; i < this.examShowList.length; i++) {
        if (this.examType === 'answer') {
          if (this.examShowList[i].answers === '' && this.examShowList[i].type !== '4') {
            const msg = '第' + (i + 1) + '题未作答'
            that.$message.warning(msg)
            flag = false
            break
          } else if (this.examShowList[i].isRemark === '1' && this.examShowList[i].remark === '') {
            const msg = '第' + (i + 1) + '题备注未填写'
            that.$message.warning(msg)
            flag = false
            break
          } else if ((this.examShowList[i].myScore === '' || parseInt(this.examShowList[i].myScore) < 0) && this.examShowList[i].type === '4') {
            const msg = '第' + (i + 1) + '题分数未填写或为负数'
            that.$message.warning(msg)
            flag = false
            break
          } else if (this.examShowList[i].type === '4' && parseInt(this.examShowList[i].myScore) > parseInt(this
            .examShowList[i].score)) {
            const msg = '第' + (i + 1) + '题分数超过最大值了'
            that.$message.warning(msg)
            flag = false
            break
          } else {
            arr.push({
              id: this.examShowList[i].id,
              answer: this.examShowList[i].answers,
              remark: this.examShowList[i].remark,
              myScore: parseInt(this.examShowList[i].myScore)
            })
          }
        } else if (this.examType === 'super') {
          if (this.examShowList[i].superMyAnswer === '' && this.examShowList[i].type !== '4') {
            const msg = '第' + (i + 1) + '题未作答'
            that.$message.warning(msg)
            flag = false
            break
          } else if (this.examShowList[i].isRemark === '1' && this.examShowList[i].superremark === '') {
            const msg = '第' + (i + 1) + '题备注未填写'
            that.$message.warning(msg)
            flag = false
            break
          } else if ((this.examShowList[i].superRealScore === '' || parseInt(this.examShowList[i].superRealScore) < 0) && this.examShowList[i].type === '4') {
            const msg = '第' + (i + 1) + '题分数未填写或为空'
            that.$message.warning(msg)
            flag = false
            break
          } else if (this.examShowList[i].type === '4' && parseInt(this.examShowList[i].superRealScore) > parseInt(this
            .examShowList[i].score)) {
            const msg = '第' + (i + 1) + '题分数超过最大值了'
            that.$message.warning(msg)
            flag = false
            break
          } else {
            arr.push({
              id: this.examShowList[i].id,
              answer: this.examShowList[i].superMyAnswer,
              remark: this.examShowList[i].superremark,
              myScore: parseInt(this.examShowList[i].superRealScore)
            })
          }
        } else {
          if (this.examShowList[i].topAnswer === '' && this.examShowList[i].type !== '4') {
            const msg = '第' + (i + 1) + '题未作答'
            that.$message.warning(msg)
            flag = false
            break
          } else if (this.examShowList[i].isRemark === '1' && this.examShowList[i].topremark === '') {
            const msg = '第' + (i + 1) + '题备注未填写'
            that.$message.warning(msg)
            flag = false
            break
          } else if ((this.examShowList[i].topRealScore === '' || parseInt(this.examShowList[i].topRealScore) < 0) && this.examShowList[i].type === '4') {
            const msg = '第' + (i + 1) + '题分数未填写或为负数'
            that.$message.warning(msg)
            flag = false
            break
          } else if (this.examShowList[i].type === '4' && parseInt(this.examShowList[i].topRealScore) > parseInt(this
            .examShowList[i].score)) {
            const msg = '第' + (i + 1) + '题分数超过最大值了'
            that.$message.warning(msg)
            flag = false
            break
          } else {
            arr.push({
              id: this.examShowList[i].id,
              answer: this.examShowList[i].topAnswer,
              remark: this.examShowList[i].topremark,
              myScore: parseInt(this.examShowList[i].topRealScore)
            })
          }
        }
      }
      let info = {}
      if (flag) {
        info = {
          answerList: JSON.stringify(arr)
        }
        console.log(info)
        this.$confirm('您确定要提交吗？一旦提交无法修改考核答案！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submit_loading = true
          if (this.examType === 'answer' || this.examType === 'super') {
            answerExamPerformance(that.examId, that.answerType, info).then(res => {
              that.submit_loading = false
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '评价完成！',
                  type: 'success'
                })
                window.localStorage.setItem('activetab', 'my')
                setTimeout(() => {
                  that.$router.go(-1)
                }, 500)
              } else {
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
          } else {
            // 主要负责人评价
            answerSuperPerformance(that.examId, info).then(res => {
              that.submit_loading = false
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '评价完成！',
                  type: 'success'
                })
                window.localStorage.setItem('activetab', 'sponsor')
                setTimeout(() => {
                  that.$router.go(-1)
                }, 500)
              } else {
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
          }
        }).catch(() => {
          console.log('用户点击了取消')
        })
      }
    },
    choseMoreExam(val) {
      this.examChoseList = []
      console.log(this.examType)
      if (this.examType === 'answer') {
        this.examChoseList = JSON.parse(val.questions)
        const remarkList = JSON.parse(val.subject)
        for (let i = 0; i < this.examChoseList.length; i++) {
          this.examChoseList[i].answers = ''
          this.examChoseList[i].remark = ''
          this.examChoseList[i].isRemark = remarkList[i].isRemark
          // 多选题
          if (this.examChoseList[i].type === '2') {
            this.examChoseList[i].answerList = []
            this.examChoseList[i].trueAnswer = this.examChoseList[i].questionAnswer.split(',')
          }
          if (this.examChoseList[i].type !== '4') {
            const scoreList = this.examChoseList[i].score.split(',')
            this.examChoseList[i].optionsList = JSON.parse(this.examChoseList[i].questionSelect)
            for (let j = 0; j < this.examChoseList[i].optionsList.length; j++) {
              this.examChoseList[i].optionsList[j].score = scoreList[j]
              // 多选题
              if (this.examChoseList[i].type === '2') {
                for (let k = 0; k < this.examChoseList[i].trueAnswer.length; k++) {
                  if (this.examChoseList[i].trueAnswer[k] === this.examChoseList[i].optionsList[j].code) {
                    this.examChoseList[i].optionsList[j].istrue = true
                  }
                }
              } else {
                if (this.examChoseList[i].optionsList[j].code === this.examChoseList[i].questionAnswer) {
                  this.examChoseList[i].optionsList[j].istrue = true
                }
              }
            }
          } else {
            this.examChoseList[i].myScore = ''
          }
        }
      } else if (this.examType === 'view') {
        this.examChoseList = JSON.parse(val.answer)
        console.log(this.examChoseList)
        this.selfScore = 0
        this.superScore = 0
        for (let i = 0; i < this.examChoseList.length; i++) {
          this.selfScore += parseInt(this.examChoseList[i].realScore)
          if (this.examInfo.status === '4') {
            this.superScore += parseInt(this.examChoseList[i].superRealScore)
          }
          this.examChoseList[i].answers = this.examChoseList[i].myAnswer
          this.examChoseList[i].remark = this.examChoseList[i].remark
          // 多选题
          if (this.examChoseList[i].type === '2') {
            this.examChoseList[i].answerList = []
            this.examChoseList[i].trueAnswer = this.examChoseList[i].questionAnswer.split(',')
          }
          if (this.examChoseList[i].type !== '4') {
            const scoreList = this.examChoseList[i].score.split(',')
            console.log(scoreList)
            this.examChoseList[i].optionsList = JSON.parse(this.examChoseList[i].questionSelect)
            for (let j = 0; j < this.examChoseList[i].optionsList.length; j++) {
              this.examChoseList[i].optionsList[j].score = scoreList[j]
              // 多选题
              if (this.examChoseList[i].type === '2') {
                for (let k = 0; k < this.examChoseList[i].trueAnswer.length; k++) {
                  if (this.examChoseList[i].trueAnswer[k] === this.examChoseList[i].optionsList[j].code) {
                    this.examChoseList[i].optionsList[j].istrue = true
                  }
                }
              } else {
                if (this.examChoseList[i].optionsList[j].code === this.examChoseList[i].questionAnswer) {
                  this.examChoseList[i].optionsList[j].istrue = true
                }
              }
            }
          }
        }
      } else {
        this.examChoseList = JSON.parse(val.answer)
        const remarkList = JSON.parse(val.subject)
        this.selfScore = 0
        this.superScore = 0
        for (let i = 0; i < this.examChoseList.length; i++) {
          this.selfScore += parseInt(this.examChoseList[i].realScore)
          if (this.examType === 'super') {
            this.examChoseList[i].superMyAnswer = ''
            this.examChoseList[i].superremark = ''
            this.examChoseList[i].superRealScore = ''
          }
          if (this.examType === 'approval') {
            this.superScore += parseInt(this.examChoseList[i].superRealScore)
            this.examChoseList[i].topAnswer = ''
            this.examChoseList[i].topremark = ''
            this.examChoseList[i].topRealScore = ''
          }
          this.examChoseList[i].isRemark = remarkList[i].isRemark
          // 多选题
          if (this.examChoseList[i].type === '2') {
            this.examChoseList[i].answerList = []
            this.examChoseList[i].trueAnswer = this.examChoseList[i].questionAnswer.split(',')
          }
          if (this.examChoseList[i].type !== '4') {
            const scoreList = this.examChoseList[i].score.split(',')
            console.log(scoreList)
            this.examChoseList[i].optionsList = JSON.parse(this.examChoseList[i].questionSelect)
            for (let j = 0; j < this.examChoseList[i].optionsList.length; j++) {
              this.examChoseList[i].optionsList[j].score = scoreList[j]
              // 多选题
              if (this.examChoseList[i].type === '2') {
                for (let k = 0; k < this.examChoseList[i].trueAnswer.length; k++) {
                  if (this.examChoseList[i].trueAnswer[k] === this.examChoseList[i].optionsList[j].code) {
                    this.examChoseList[i].optionsList[j].istrue = true
                  }
                }
              } else {
                if (this.examChoseList[i].optionsList[j].code === this.examChoseList[i].questionAnswer) {
                  this.examChoseList[i].optionsList[j].istrue = true
                }
              }
            }
          }
        }
      }

      this.examShowList = this.examChoseList
      this.$forceUpdate()
      this.changeHeight()
      console.log(this.examShowList)
    },
    choseCheck(key, event) {
      console.log(key)
      console.log(event)
      this.examShowList[key].answers = ''
      this.examShowList[key].answers = event.join(',')
      this.$forceUpdate()
    },
    choseRadio(key, event) {
      console.log(key)
      console.log(event)
      console.log(this.examShowList[key].optionsList)
      for (let i = 0; i < this.examShowList[key].optionsList.length; i++) {
        if (event === this.examShowList[key].optionsList[i].code) {
          if (this.examType === 'answer') {
            this.examShowList[key].myScore = this.examShowList[key].optionsList[i].score
            break
          } else if (this.examType === 'super') {
            this.examShowList[key].superRealScore = this.examShowList[key].optionsList[i].score
            break
          } else {
            this.examShowList[key].topRealScore = this.examShowList[key].optionsList[i].score
            break
          }
        }
      }
      this.$forceUpdate()
    }
  }
}

</script>
<style lang="less" scoped>
  .i_exam_bg {
    background: #f2f2f2;
    padding: 10px;
    position: relative;
    width: 100%;
    height: calc(100vh - 108px);
    top: 0;
    z-index: 99;
    overflow: hidden;

    .exam_info {
      background: #fff;
      padding: 10px;

      .exam_info_head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ccc;
        padding-bottom: 10px;

        .exam_info_title {
          font-family: '微软雅黑 Bold', '微软雅黑';
          font-weight: 700;
          font-style: normal;
          font-size: 14px;
          color: #333333;
        }
      }

      .exam_scroll {

        .exam_info_detail {
          .exam_paper {
            margin-top: 10px;

            .exam_paper_title {
              color: #333;
              text-align: center;
              border-bottom: 1px dashed #e0e0e0;
            }

            .exam_paper_time {
              font-size: 14px;
              border-bottom: 1px dashed #e0e0e0;
              padding-left: 40px;
              .score{
                color: #0000FF;
                margin-right: 20px;
              }
            }

            .exam_list {
              ul {
                list-style: none;
                padding-right: 40px;

                .exam_block {
                  font-size: 14px;
                  font-family: 'Arial Normal', 'Arial';
                  font-weight: 400;
                  color: #333;
                  margin-bottom: 20px;
                  border: 1px solid #e0e0e0;

                  .exam_title {
                    color: #333;
                    display: flex;
                    align-items: center;
                    font-size: 16px;
                    background: #f9f9f9;
                    padding: 20px 10px;
                    border-bottom: 1px solid #e0e0e0;
                    justify-content: space-between;
                    padding-right: 20px;
                    line-height: 1.4;
                    .exam_title_left {
                      padding-right: 10px;
                      .paper_type {
                        color: #0000FF;
                      }
                    }
                    .exam_title_right{
                      min-width: 240px;
                      text-align: right;
                    }

                    i {
                      font-size: 24px;
                      margin-left: 20px;
                    }
                  }

                  .exam_option {
                    // margin-top: 10px;
                    padding: 15px 10px;

                    .paper_block {
                      display: block;
                      margin-left: 10px;
                      padding: 10px 0;
                    }

                    .active {
                      color: #006633;
                      font-weight: 700;
                    }
                  }

                  .exam_analysis {
                    color: #0000FF;
                    padding-left: 10px;
                    padding-bottom: 15px;
                    padding-right: 20px;
                    line-height: 1.4;
                  }

                  .exam_remark {
                    padding-left: 10px;
                    padding-bottom: 15px;
                  }

                  .exam_score {
                    margin: 5px 0;
                  }

                  .exam_self {
                    padding-top:15px;
                    padding-bottom: 5px;
                    padding-left: 10px;
                    line-height: 1.4;

                    span {
                      margin-right: 10px;

                      i {
                        font-style: normal;
                        color: #0000FF;
                      }
                    }

                    p {
                      i {
                        font-style: normal;
                        color: #0000FF;
                      }
                    }
                  }

                  .exam_my {
                    padding-left: 10px;
                    padding-bottom: 15px;
                    line-height: 1.4;

                    span {
                      margin-right: 10px;

                      i {
                        font-style: normal;
                        color: #0000FF;
                      }
                    }

                    p {
                      i {
                        font-style: normal;
                        color: #0000FF;
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

  }

  .examModel {
    .view_page {
      text-align: center;
      margin-top: 10px;
      margin-bottom: -20px;
    }
  }

</style>
