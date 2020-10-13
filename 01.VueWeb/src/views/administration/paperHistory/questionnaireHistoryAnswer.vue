<template>
  <div class="i_quest_bg">
    <div class="quest_info">
      <div class="quest_info_head">
        <span class="quest_info_title">{{ viewTitle }}</span>
        <span>
          <el-button v-if="questType=='answer'" :loading="submit_loading" size="mini" type="primary" @click="savequestPaper">交 卷</el-button>
          <el-button plain size="mini" @click="returnBack">返 回</el-button>
        </span>
      </div>
      <div :class="isScroll?'scroll_bar':''" class="quest_scroll">
        <div class="quest_info_detail">
          <div class="quest_paper">
            <div class="quest_paper_title">
              <h2>{{ questInfo.title }}</h2>
            </div>
            <div v-if="questType=='answer'" class="quest_paper_time">
              <p>本卷共分为{{ questShowList.length }}道小题</p>
              <p>问卷开始时间：{{ questInfo.startTime }}</p>
              <p>问卷结束时间：{{ questInfo.endTime }}</p>
              <p>问卷答题时间：{{ questInfo.answerDate }}</p>
              <p>问卷发起人：{{ questInfo.createdBy }}</p>
            </div>
            <div v-if="questType=='view'" class="quest_paper_time">
              <p>本卷共分为{{ questShowList.length }}道小题</p>
              <p>问卷开始时间：{{ questInfo.startTime }}</p>
              <p>问卷结束时间：{{ questInfo.endTime }}</p>
              <p>问卷发起人：{{ questInfo.createdBy }}</p>
              <p>答题人：{{ questInfo.accountName }}</p>
            </div>
            <div v-if="questType==='detail'" class="quest_paper_time">
              <p>本卷共分为{{ questShowList.length }}道小题</p>
              <p>问卷开始时间：{{ questInfo.startTime }}</p>
              <p>问卷结束时间：{{ questInfo.endTime }}</p>
              <p>问卷发起人：{{ questInfo.createdBy }}</p>
              <p>总人数：{{ questInfo.total }}</p>
            </div>
            <div class="quest_list answer_result">
              <ul v-if="questType==='detail'" style="margin-bottom:50px;">
                <li v-for="(quest,index) in questShowList" :key="index" class="quest_block">
                  <div class="quest_title">
                    <div class="quest_title_left">
                      <span>{{ index+1 }}、</span>
                      <span v-if="quest.type==1" class="paper_type">(单选题)</span>
                      <span v-if="quest.type==2" class="paper_type">(多选题)</span>
                      <span v-if="quest.type==3" class="paper_type">(是非题)</span>
                      <span v-if="quest.type==4" class="paper_type">(问答题)</span>
                      <span>{{ quest.title }}</span>
                    </div>
                  </div>
                  <div v-if="quest.type==1" class="quest_option">
                    <ul>
                      <li v-for="(option,index) in quest.optionsList" :key="index">
                        <span>{{ option.code }}.{{ option.title }}</span>
                        <span class="answernum">答题人数：<b class="numColor">{{ option.num }}</b></span>
                        <span class="answerpro">答题占比：</span><el-progress :stroke-width="12" :percentage="option.percent" color="rgba(61, 158, 255, 0.7)"/>
                      </li>
                    </ul>
                  </div>
                  <div v-if="quest.type==2" class="quest_option">
                    <ul>
                      <li v-for="(option,index) in quest.optionsList" :key="index">
                        <span>{{ option.code }}.{{ option.title }}</span>
                        <span class="answernum">答题人数：<b class="numColor">{{ option.num }}</b></span>
                        <span class="answerpro">答题占比：</span><el-progress :stroke-width="12" :percentage="option.percent" color="rgba(61, 158, 255, 0.7)"/>
                      </li>
                    </ul>
                  </div>
                  <div v-if="quest.type==3" class="quest_option">
                    <ul>
                      <li v-for="(option,index) in quest.optionsList" :key="index">
                        <span>{{ option.code }}.{{ option.title }}</span>
                        <span class="answernum">答题人数：<b class="numColor">{{ option.num }}</b></span>
                        <span class="answerpro">答题占比：</span><el-progress :stroke-width="12" :percentage="option.percent" color="rgba(61, 158, 255, 0.7)"/>
                      </li>
                    </ul>
                  </div>
                  <div v-if="quest.type==4" class="quest_option">
                    <span class="answernum" style="display:block;padding-left:40px;">答题人数：<b class="numColor">{{ quest.num }}</b></span>
                  </div>
                </li>
              </ul>
              <ul v-else>
                <li v-for="(quest,index) in questShowList" :key="index" class="quest_block">
                  <div class="quest_title">
                    <div class="quest_title_left">
                      <span>{{ index+1 }}、</span>
                      <span v-if="quest.type==1" class="paper_type">(单选题)</span>
                      <span v-if="quest.type==2" class="paper_type">(多选题)</span>
                      <span v-if="quest.type==3" class="paper_type">(是非题)</span>
                      <span v-if="quest.type==4" class="paper_type">(问答题)</span>
                      <span>{{ quest.title }}</span>
                    </div>
                  </div>
                  <div v-if="quest.type==1" class="quest_option exam_option">
                    <el-radio-group
                      v-model="quest.answers"
                      :disabled="questType=='view'"
                      @change="choseRadio(index,quest.answers)">
                      <el-radio
                        v-for="(option,index) in quest.optionsList"
                        :key="index"
                        :label="option.code"
                        :class="{'error':option.chose}"
                        class="paper_block">
                        {{ option.code }}.{{ option.title }}</el-radio>
                    </el-radio-group>
                  </div>
                  <div v-if="quest.type==2" class="quest_option exam_option">
                    <el-checkbox-group
                      v-model="quest.answerList"
                      :disabled="questType=='view'"
                      @change="choseCheck(index,quest.answerList)">
                      <el-checkbox
                        v-for="(option,index) in quest.optionsList"
                        :key="index"
                        :label="option.code"
                        :class="{'error':option.chose}"
                        class="paper_block">
                        {{ option.code }}.{{ option.title }}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div v-if="quest.type==3" class="quest_option exam_option">
                    <el-radio-group
                      v-model="quest.answers"
                      :disabled="questType=='view'"
                      @change="choseRadio(index,quest.answers)">
                      <el-radio
                        v-for="(option,index) in quest.optionsList"
                        :key="index"
                        :label="option.code"
                        :class="{'error':option.chose}"
                        class="paper_block">
                        {{ option.code }}.{{ option.title }}</el-radio>
                    </el-radio-group>
                  </div>
                  <div v-if="quest.type==4" class="quest_option exam_option">
                    <el-input
                      v-model="quest.answers"
                      :rows="4"
                      :disabled="questType=='view'"
                      type="textarea"
                      style="width:600px"
                      placeholder="请输入您的答案"
                      @input="updateValue"
                      @change="choseInput(index,quest.answers)"/>
                  </div>
                  <div class="quest_result">
                    <div v-if="questType!=='answer'&&quest.answer!==''" class="quest_analysis">
                      调查目的：{{ quest.answer }}
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
  viewquestPaper,
  resultquestPaper,
  answerquestPaper,
  detailquestPaper
  // approvalquestPaper
} from '@/api/administration'
export default {
  name: 'QuestionnaireHistoryAnswer',
  data() {
    return {
      isScroll: false,
      submit_loading: false,
      questId: '',
      questType: '',
      questInfo: {},
      questIds: '',
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
      viewTitle: '问卷详情',
      questShowList: [],
      questChoseList: [],
      questShow: false,
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
      this.viewTitle = '问卷详情'
      this.questId = this.$route.query.id
      this.questType = 'answer'
    } else if (this.$route.query.type === 'view') {
      this.viewTitle = '查看问卷结果'
      this.questId = this.$route.query.id
      this.questType = 'view'
    } else if (this.$route.query.type === 'detail') {
      this.viewTitle = '查看统计详情'
      this.questId = this.$route.query.id
      this.questType = 'detail'
    }
    console.log(this.$route.query.type)
    this.getDetail(this.questType)
  },
  methods: {
    changeHeight() {
      setTimeout(() => {
        console.log(document.getElementsByClassName('quest_paper')[0].offsetHeight)
        console.log(document.getElementsByClassName('quest_scroll')[0].offsetHeight)
        if (document.getElementsByClassName('quest_paper')[0].offsetHeight > document.getElementsByClassName('quest_scroll')[0].offsetHeight) {
          this.isScroll = true
        } else {
          this.isScroll = false
        }
      }, 100)
    },
    getDetail(type) {
      const that = this
      if (type === 'answer') {
        viewquestPaper(this.questId).then(res => {
          if (res.code === '200' || res.code === 200) {
            that.questInfo = res.data
            const view = res.data
            // 转换试题库
            that.choseMorequest(view.questions)
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
        resultquestPaper(this.questId).then(res => {
          if (res.code === '200' || res.code === 200) {
            that.questInfo = res.data
            console.log(that.questInfo)
            const view = res.data
            // 转换试题库
            that.choseMorequest(view.answer)
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
        detailquestPaper(this.questId).then(res => {
          if (res.code === '200' || res.code === 200) {
            that.questInfo = res.data
            console.log(res, '12321')
            const view = res.data
            // 转换试题库
            that.choseMorequest(view.statistics)
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
      if (this.questType != 'view' && this.questType != 'detail') {
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
    savequestPaper() {
      console.log(this.questShowList)
      const that = this
      let flag = true
      const arr = []
      for (let i = 0; i < this.questShowList.length; i++) {
        if (this.questShowList[i].answers === '') {
          const msg = '第' + (i + 1) + '题未作答'
          that.$message.warning(msg)
          flag = false
          break
        } else {
          arr.push({
            id: this.questShowList[i].id,
            answer: this.questShowList[i].answers
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
          answerquestPaper(that.questId, info).then(res => {
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
    choseMorequest(val) {
      this.questChoseList = []
      if (val !== '' && val !== '[]' && val !== '[object Object]') {
        this.questChoseList = JSON.parse(val)
        console.log(this.questChoseList, '132134324')
      }
      if (this.questType === 'answer') {
        for (let i = 0; i < this.questChoseList.length; i++) {
          this.questChoseList[i].answers = ''
          // 多选题
          if (this.questChoseList[i].type === '2') {
            this.questChoseList[i].answerList = []
            this.questChoseList[i].trueAnswer = []
          }
          if (this.questChoseList[i].type !== '4') {
            this.questChoseList[i].optionsList = JSON.parse(this.questChoseList[i].questionSelect)
            for (let j = 0; j < this.questChoseList[i].optionsList.length; j++) {
              this.questChoseList[i].optionsList[j].istrue = false
            }
          }
        }
      } else if (this.questType === 'detail') {
        for (let i = 0; i < this.questChoseList.length; i++) {
          if (this.questChoseList[i].questionSelect !== '') {
            this.questChoseList[i].optionsList = JSON.parse(this.questChoseList[i].questionSelect)
          }
        }
      } else {
        for (let i = 0; i < this.questChoseList.length; i++) {
          this.questChoseList[i].answers = this.questChoseList[i].myAnswer
          // 多选题
          if (this.questChoseList[i].type === '2') {
            this.questChoseList[i].answerList = []
            this.questChoseList[i].answerList = this.questChoseList[i].myAnswer.split(',')
            this.questChoseList[i].trueAnswer = this.questChoseList[i].questionAnswer.split(',')
          }
          if (this.questChoseList[i].type !== '4') {
            this.questChoseList[i].optionsList = JSON.parse(this.questChoseList[i].questionSelect)
            for (let j = 0; j < this.questChoseList[i].optionsList.length; j++) {
              this.questChoseList[i].optionsList[j].istrue = false
              this.questChoseList[i].optionsList[j].chose = false
              // 多选题
              if (this.questChoseList[i].type === '2') {
                // for (let k = 0; k < this.questChoseList[i].trueAnswer.length; k++) {
                //   if (this.questChoseList[i].trueAnswer[k] === this.questChoseList[i].optionsList[j].code) {
                //     this.questChoseList[i].optionsList[j].chose = true
                //   }
                // }
                for (let k = 0; k < this.questChoseList[i].answerList.length; k++) {
                  if (this.questChoseList[i].answerList[k] === this.questChoseList[i].optionsList[j].code) {
                    this.questChoseList[i].optionsList[j].chose = true
                  }
                }
              } else {
                if (this.questChoseList[i].optionsList[j].code === this.questChoseList[i].questionAnswer) {
                  this.questChoseList[i].optionsList[j].istrue = true
                }
                if (this.questChoseList[i].optionsList[j].code === this.questChoseList[i].myAnswer) {
                  this.questChoseList[i].optionsList[j].chose = true
                }
              }
            }
          } else {
            this.questChoseList[i].myScore = ''
          }
        }
      }
      this.questShowList = this.questChoseList
      console.log(this.questShowList)
      this.$forceUpdate()
      this.changeHeight()
      console.log(this.questShowList)
    },
    choseCheck(key, event) {
      console.log(key, 'key')
      console.log(event, 'event')
      const arr = event.sort()
      this.questShowList[key].answers = ''
      this.questShowList[key].answers = arr.join(',')
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
  .i_quest_bg {
    background: #f2f2f2;
    padding: 10px;
    position: relative;
    width: 100%;
    height: calc(100vh - 108px);
    top: 0;
    z-index: 99;
    overflow: hidden;
    // .quest_list answer_result{
    //   padding-bottom: 200px;
    // }
    .answernum{
      display: block;
      line-height: 24px;
      margin-top:10px;
      color: #000;
      .numColor{
        display: inline-block;
        padding-left: 15px;
        font-weight: normal;
        font-size: 14px;
        color:#409EFF
      }
   }
    .answerpro{
      display: block;
      line-height: 24px;
    }
    .quest_info {
      background: #fff;
      padding: 10px;

      .quest_info_head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ccc;
        padding-bottom: 10px;

        .quest_info_title {
          font-family: '微软雅黑 Bold', '微软雅黑';
          font-weight: 700;
          font-style: normal;
          font-size: 14px;
          color: #333333;
        }
      }

      .quest_scroll {
        .quest_info_detail {
          .quest_paper {
            margin-top: 10px;
            .quest_paper_title {
              color: #333;
              text-align: center;
              border-bottom: 1px dashed #e0e0e0;
            }

            .quest_paper_time {
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

            .quest_list {
              ul {
                list-style: none;
                padding-right: 40px;

                .quest_block {
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
                  .quest_title {
                    color: #333;
                    display: flex;
                    align-items: center;
                    font-size: 16px;
                    background: #fff8e7;
                    padding: 20px 10px;
                    border-bottom: 1px solid #e0e0e0;
                    justify-content: space-between;
                    padding-right: 20px;

                    .quest_title_left {
                      padding-right: 10px;
                      .paper_type {
                        color: #0000FF;
                      }
                    }
                    i {
                      font-size: 24px;
                      margin-left: 20px;
                    }
                  }

                  .quest_option {
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

                  .quest_result {
                    background: #f9f9f9;
                    // padding: 10px 20px;
                    // border-top: 1px solid #e0e0e0;
                    .quest_analysis {
                      border-top: 1px solid #e0e0e0;
                      max-width: 80%;
                      // padding-top: 20px;
                      color: #0000FF;
                       padding: 10px 20px;

                    }

                    // .quest_score {
                    //   margin: 10px 0;
                    //   span{
                    //     font-size: 20px;
                    //     // color: #ff0000;
                    //   }
                    // }
                  }

                }
              }

            }
          }

        }
      }

    }

  }

  .questModel {
    .view_page {
      text-align: center;
      margin-top: 10px;
      margin-bottom: -20px;
    }
  }

</style>
