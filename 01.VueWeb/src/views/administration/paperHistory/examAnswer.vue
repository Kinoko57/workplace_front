<template>
  <div class="i_exam_bg">
    <div class="exam_info">
      <div class="exam_info_head">
        <span class="exam_info_title">{{ viewTitle }}</span>
        <span>
          <el-button v-if="examType=='answer'" :loading="submit_loading" size="mini" type="primary" @click="saveExamPaper">交 卷</el-button>
          <el-button v-if="examType=='approval'" :loading="submit_loading" size="mini" type="primary" @click="approvalExamPaper">审 批</el-button>
          <el-button plain size="mini" @click="returnBack">返 回</el-button>
        </span>
      </div>
      <div :class="isScroll?'scroll_bar':''" class="exam_scroll">
        <div class="exam_info_detail">
          <div class="exam_paper">
            <div class="exam_paper_title">
              <h2>{{ examInfo.title }}</h2>
            </div>
            <div v-if="examType=='answer'" class="exam_paper_time">
              <p>本卷共分为{{ examShowList.length }}道小题，总分100分</p>
              <p>考试时间：{{ examInfo.startTime }}-{{ examInfo.endTime }}</p>
              <p>考试发起人：{{ examInfo.createdBy }}</p>
            </div>
            <div v-if="examType=='view'" class="exam_paper_time">
              <p>本卷共分为{{ examShowList.length }}道小题，总分100分</p>
              <p>答题时间：{{ examInfo.answerDate }}</p>
              <p>考试发起人：{{ examInfo.createdBy }}</p>
              <p>答题人：{{ examInfo.answerBy }}</p>
              <p>试卷得分：<span>{{ examInfo.score }}</span></p>
              <!-- <div class="paper_score">
                <span>最终得分</span>
                {{ examInfo.score }}
              </div> -->
            </div>
            <div v-if="examType=='approval'" class="exam_paper_time">
              <p>本卷共分为{{ examShowList.length }}道小题，总分100分</p>
              <p>答题时间：{{ examInfo.answerDate }}</p>
              <p>考试发起人：{{ examInfo.createdBy }}</p>
              <p>答题人：{{ examInfo.account }}</p>
            </div>
            <div class="exam_list answer_result">
              <ul>
                <li v-for="(exam,index) in examShowList" :key="index" class="exam_block">
                  <div v-if="examType!='answer'&&exam.type!=4">
                    <img v-if="exam.realScore==exam.score" src="@/assets/paper_success.png" alt="" srcset="" class="paper_icon">
                    <img v-if="exam.realScore!=exam.score" src="@/assets/paper_error.png" alt="" srcset="" class="paper_icon">
                  </div>
                  <div class="exam_title">
                    <div class="exam_title_left">
                      <span>{{ index+1 }}、</span>
                      <span v-if="exam.type==1" class="paper_type">(单选题)</span>
                      <span v-if="exam.type==2" class="paper_type">(多选题)</span>
                      <span v-if="exam.type==3" class="paper_type">(是非题)</span>
                      <span v-if="exam.type==4" class="paper_type">(问答题)</span>
                      <span>{{ exam.title }}</span>
                    </div>
                    <div class="exam_title_right" style="min-width:80px;text-align:center">
                      <span>分值：{{ exam.score }}</span>
                    </div>
                  </div>
                  <div v-if="exam.type==1" class="exam_option">
                    <el-radio-group
                      v-model="exam.answers"
                      :disabled="examType=='view'||examType=='approval'"
                      @change="choseRadio(index,exam.answers)">
                      <el-radio
                        v-for="(option,index) in exam.optionsList"
                        :key="index"
                        :label="option.code"
                        :class="{'error':option.chose}"
                        class="paper_block">
                        {{ option.code }}.{{ option.title }}</el-radio>
                    </el-radio-group>
                  </div>
                  <div v-if="exam.type==2" class="exam_option">
                    <el-checkbox-group
                      v-model="exam.answerList"
                      :disabled="examType=='view'||examType=='approval'"
                      @change="choseCheck(index,exam.answerList)">
                      <el-checkbox
                        v-for="(option,index) in exam.optionsList"
                        :key="index"
                        :label="option.code"
                        :class="{'error':option.chose}"
                        class="paper_block">
                        {{ option.code }}.{{ option.title }}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div v-if="exam.type==3" class="exam_option">
                    <el-radio-group
                      v-model="exam.answers"
                      :disabled="examType=='view'||examType=='approval'"
                      @change="choseRadio(index,exam.answers)">
                      <el-radio
                        v-for="(option,index) in exam.optionsList"
                        :key="index"
                        :label="option.code"
                        :class="{'error':option.chose}"
                        class="paper_block">
                        {{ option.code }}.{{ option.title }}</el-radio>
                    </el-radio-group>
                  </div>
                  <div v-if="exam.type==4" class="exam_option">
                    <el-input
                      v-model="exam.answers"
                      :rows="4"
                      :disabled="examType=='view'||examType=='approval'"
                      type="textarea"
                      style="width:600px"
                      placeholder="请输入您的答案"
                      @input="updateValue"
                      @change="choseInput(index,exam.answers)" />
                  </div>
                  <div v-if="examType!='answer'" class="exam_result">
                    <div v-if="examType!='answer'" class="exam_analysis">
                      <p>参考答案：{{ exam.questionAnswer }}</p>
                    </div>
                    <div v-if="examType!='answer'" class="exam_analysis">
                      答案解析：{{ exam.answer }}
                    </div>
                    <div v-if="examType=='view'" class="exam_score">
                      该题得分：<span>{{ exam.realScore }}</span>
                    </div>
                    <div v-if="examType=='approval'&&exam.type==4" class="exam_score">
                      该题得分：<el-input v-model="exam.myScore" placeholder="分值" style="width:100px" min="0" type="number" @input="inputChange" @blur="scoreNum"/>
                    </div>
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
import {
  viewExamPaper,
  resultExamPaper,
  answerExamPaper,
  approvalExamPaper
} from '@/api/administration'
export default {
  name: 'ExamAnswer',
  data() {
    return {
      isScroll: false,
      submit_loading: false,
      examId: '',
      examType: '',
      examInfo: {},
      examIds: '',
      loading: false,
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
      this.viewTitle = '试卷详情'
      this.examId = this.$route.query.id
      this.examType = 'answer'
    } else if (this.$route.query.type === 'view') {
      this.viewTitle = '查看试卷结果'
      this.examId = this.$route.query.id
      this.examType = 'view'
    } else if (this.$route.query.type === 'approval') {
      this.viewTitle = '审批试卷'
      this.examId = this.$route.query.id
      this.examType = 'approval'
    }
    console.log(this.$route.query.type)
    this.getDetail(this.examType)
  },
  methods: {
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
    inputChange() {
      this.$forceUpdate()
    },
    scoreNum(e) {
      e.target.value = parseInt(e.target.value)
    },
    getDetail(type) {
      const that = this
      if (type === 'answer') {
        viewExamPaper(this.examId).then(res => {
          if (res.code === '200' || res.code === 200) {
            that.examInfo = res.data
            const view = res.data
            // 转换试题库
            that.choseMoreExam(view.questions)
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
        resultExamPaper(this.examId).then(res => {
          if (res.code === '200' || res.code === 200) {
            that.examInfo = res.data
            const view = res.data
            // 转换试题库
            that.choseMoreExam(view.answer)
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
        resultExamPaper(this.examId).then(res => {
          if (res.code === '200' || res.code === 200) {
            that.examInfo = res.data
            const view = res.data
            // 转换试题库
            that.choseMoreExam(view.answer)
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
      for (let i = 0; i < this.examShowList.length; i++) {
        if (this.examShowList[i].answers === '') {
          const msg = '第' + (i + 1) + '题未作答'
          that.$message.warning(msg)
          flag = false
          break
        } else {
          arr.push({
            id: this.examShowList[i].id,
            answer: this.examShowList[i].answers
          })
        }
      }
      let info = {}
      if (flag) {
        info = {
          answerList: JSON.stringify(arr)
        }
        this.$confirm('您确定要交卷吗？一旦交卷无法修改答案！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.submit_loading = true
          answerExamPaper(that.examId, info).then(res => {
            that.submit_loading = false
            if (res.code === 200 || res.code === '200') {
              that.$message({
                message: '答题完成！',
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
        }).catch(() => {
          console.log('用户点击了取消')
        })
      }
    },
    approvalExamPaper() {
      console.log(this.examShowList)
      const that = this
      let flag = true
      for (let i = 0; i < this.examShowList.length; i++) {
        if (this.examShowList[i].type === '4') {
          if (this.examShowList[i].myScore === '' || parseInt(this.examShowList[i].myScore) < 0) {
            const msg = '第' + (i + 1) + '题未评分或为负数！'
            that.$message.warning(msg)
            flag = false
            break
          }
          // if (!/^\d+$/.test(this.examShowList[i].myScore)) {
          //   const msg = '第' + (i + 1) + '题只能输入整数！'
          //   that.$message.warning(msg)
          //   flag = false
          //   break
          // }
          console.log(this.examShowList[i].myScore)
          if (parseInt(this.examShowList[i].myScore) > parseInt(this.examShowList[i].score)) {
            const msg = '第' + (i + 1) + '题评分超过本题的最大分值了！'
            that.$message.warning(msg)
            flag = false
            break
          }
        }
      }
      let info = {}
      if (flag) {
        const arr = []
        for (let i = 0; i < this.examShowList.length; i++) {
          if (this.examShowList[i].type === '4') {
            arr.push({
              id: this.examShowList[i].id,
              score: parseInt(this.examShowList[i].myScore)
            })
          }
        }
        info = {
          answerList: JSON.stringify(arr)
        }
        this.$confirm('您确定要提交审批吗？一旦提交无法修改分数！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.submit_loading = true
          approvalExamPaper(that.examId, info).then(res => {
            that.submit_loading = false
            if (res.code === 200 || res.code === '200') {
              that.$message({
                message: '审批完成！',
                type: 'success'
              })
              that.$router.go(-1)
            } else {
              that.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
        }).catch(() => {
          console.log('用户点击了取消')
        })
      }
    },
    choseMoreExam(val) {
      this.examChoseList = []
      this.examChoseList = JSON.parse(val)
      console.log(this.examChoseList, 'jzxfck')
      if (this.examType === 'answer') {
        for (let i = 0; i < this.examChoseList.length; i++) {
          this.examChoseList[i].answers = ''
          // 多选题
          if (this.examChoseList[i].type === '2') {
            this.examChoseList[i].answerList = []
            this.examChoseList[i].trueAnswer = []
          }
          if (this.examChoseList[i].type !== '4') {
            this.examChoseList[i].optionsList = JSON.parse(this.examChoseList[i].questionSelect)
            for (let j = 0; j < this.examChoseList[i].optionsList.length; j++) {
              this.examChoseList[i].optionsList[j].istrue = false
            }
          }
        }
      } else {
        for (let i = 0; i < this.examChoseList.length; i++) {
          this.examChoseList[i].answers = this.examChoseList[i].myAnswer
          // 多选题
          if (this.examChoseList[i].type === '2') {
            this.examChoseList[i].answerList = []
            this.examChoseList[i].answerList = this.examChoseList[i].myAnswer.split(',')
            this.examChoseList[i].trueAnswer = this.examChoseList[i].questionAnswer.split(',')
          }
          if (this.examChoseList[i].type !== '4') {
            this.examChoseList[i].optionsList = JSON.parse(this.examChoseList[i].questionSelect)
            for (let j = 0; j < this.examChoseList[i].optionsList.length; j++) {
              this.examChoseList[i].optionsList[j].istrue = false
              this.examChoseList[i].optionsList[j].chose = false
              // 多选题
              if (this.examChoseList[i].type === '2') {
                for (let k = 0; k < this.examChoseList[i].trueAnswer.length; k++) {
                  if (this.examChoseList[i].trueAnswer[k] === this.examChoseList[i].optionsList[j].code) {
                    this.examChoseList[i].optionsList[j].istrue = true
                  }
                }
                for (let k = 0; k < this.examChoseList[i].answerList.length; k++) {
                  if (this.examChoseList[i].answerList[k] === this.examChoseList[i].optionsList[j].code) {
                    this.examChoseList[i].optionsList[j].chose = true
                  }
                }
              } else {
                if (this.examChoseList[i].optionsList[j].code === this.examChoseList[i].questionAnswer) {
                  this.examChoseList[i].optionsList[j].istrue = true
                }
                if (this.examChoseList[i].optionsList[j].code === this.examChoseList[i].myAnswer) {
                  this.examChoseList[i].optionsList[j].chose = true
                }
              }
            }
          } else {
            this.examChoseList[i].myScore = ''
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
      const arr = event.sort()
      this.examShowList[key].answers = ''
      this.examShowList[key].answers = arr.join(',')
      this.$forceUpdate()
    },
    choseRadio(key, event) {
      this.$forceUpdate()
    },
    updateValue() {
      this.$forceUpdate()
    },
    choseInput(key, event) {
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
              position: relative;
              span{
                font-size: 20px;
                color: #ff0000;
              }
              .paper_score{
                position: absolute;
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
                  position: relative;
                  .paper_icon{
                    position: absolute;
                    top:10%;
                    right: 10%;
                    width: 160px;
                    height: 160px;
                  }
                  .exam_title {
                    color: #333;
                    display: flex;
                    align-items: center;
                    font-size: 16px;
                    background: #fff8e7;
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

                    .success {
                      color: #006633;
                      font-weight: 700;
                    }
                  }

                  .exam_result {
                    padding: 5px 10px;
                    border-top: 1px solid #e0e0e0;
                    background: #f9f9f9;
                    .exam_analysis {
                      color: #0000FF;
                      padding-right: 20px;
                    }

                    .exam_score {
                      margin: 10px 0;
                      span{
                        font-size: 20px;
                        // color: #ff0000;
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
