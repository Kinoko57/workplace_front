<template>
  <div class="i_questionnaire_bg">
    <div class="questionnaire_info">
      <div class="questionnaire_info_head">
        <span class="questionnaire_info_title">{{ viewTitle }}</span>
        <span>
          <el-button :loading="submit_loading" type="primary" size="mini" @click="saveExamPaper">保 存</el-button>
          <el-button plain size="mini" @click="returnBack">返 回</el-button>
        </span>
      </div>
      <div :class="isScroll?'scroll_bar':''" class="exam_scroll">
        <div class="questionnaire_info_detail">
          <div class="questionnaire_form">
            <el-form
              ref="questionnaireForm"
              :model="questionnaireForm"
              :rules="rules"
              class="modelForm"
              label-width="100px"
              label-position="right">
              <el-form-item label="问卷主题：" required style="display:inline-block;width:45%;float:left;">
                <el-input v-model.trim="questionnaireForm.title" style="width:300px" placeholder="请输入问卷主题" />
              </el-form-item>
              <el-form-item label="调查时间：" required style="display:inline-block;width:50%;">
                <el-date-picker
                  v-model="questionnaireForm.time"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"/>
              </el-form-item>
              <el-form-item label="参与角色：" class="obj_style" required>
                <div v-for="(item,index) in objList" :key="index" class="show_objs">
                  <div class="show_objs_left">
                    <!-- <el-cascader
                      ref="orgLabel"
                      :options="orgList"
                      v-model="item.orgName"
                      :props="defaultNode"
                      :show-all-levels="false"
                      :change-on-select="true"
                      style="width:140px"
                      placeholder="请选择部门"
                      filterable
                      @change="choseOrg(index,item)" /> -->
                    <el-select v-model="item.orgName" filterable placeholder="请选择部门" style="width:200px" @change="choseOrg(index,item)">
                      <el-option
                        v-for="(select,index) in orgList"
                        :label="select.label"
                        :value="select.id"
                        :key="index"
                      />
                    </el-select>
                    <el-select v-if="item.orgId==0" v-model="item.roleId" placeholder="请选择角色" style="width:160px">
                      <el-option label="全部成员" value="-1" />
                      <el-option label="管理层" value="-2" />
                      <el-option label="部门主要负责人" value="-3" />
                    </el-select>
                    <el-select v-else v-model="item.roleId" placeholder="请选择角色" style="width:160px">
                      <el-option
                        v-for="(select,index) in item.roleList"
                        :label="select.name"
                        :value="select.id"
                        :key="index" />
                    </el-select>
                  </div>
                  <div class="show_objs_right">
                    <i class="el-icon-remove" @click="removeObjNode(item)" />
                  </div>
                </div>
                <el-button type="primary" size="mini" @click="addObjNode">添加对象</el-button>
              </el-form-item>
              <div class="questionnaire_list">
                <div class="add_btn" style="padding-left:20px;">
                  <el-button type="primary" size="mini" @click="addQuestion">添加试题</el-button>
                </div>
                <ol style="list-style:none;padding:0;margin: 16px;">
                  <li v-for="(questionnaire,index) in questionnaireShowList" :key="index" class="questionnaire_block">
                    <div class="questionnaire_topic">
                      <div class="questionnaire_block_topic_title">{{ index+1 }}、</div>
                      <div class="questionnaire_title questionnaire_left">
                        <div class="questionnaire_title_left">
                          <span v-if="questionnaire.type==1">(单选题)</span>
                          <span v-if="questionnaire.type==2">(多选题)</span>
                          <span v-if="questionnaire.type==3">(是非题)</span>
                          <span v-if="questionnaire.type==4">(问答题)</span>
                          <span>{{ questionnaire.title }}</span>
                        </div>
                        <div class="questionnaire_title_right"><i
                          class="el-icon-remove"
                          @click="removeQuestion(questionnaire)" /></div>
                      </div>
                    </div>
                    <div v-if="questionnaire.type!=4" class="questionnaire_topic">
                      <div class="questionnaire_block_topic_title">分值</div>
                      <div class="questionnaire_option questionnaire_left">
                        <p v-for="(option,index) in questionnaire.optionsList" :key="index">
                          {{ option.code }}.{{ option.title }}</p>
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
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :visible.sync="questionnaireShow"
      title="试题库"
      width="860px"
      class="questionnaireModel"
      append-to-body
      @close="resetTest">
      <el-scrollbar class="fixed_scroll over_scroll">
        <div class="questionnaire_table">
          <div class="fifter">
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
              <el-button type="primary" size="mini" round @click="searchTest">搜索</el-button>
              <el-button round size="mini" @click="resetTest">重置</el-button>
            </div>
          </div>
          <el-table ref="exam" :row-key="getRowKeys" :data="tableData" border style="width:720px;margin:0 auto;" @selection-change="choseMorequestionnaire" @sort-change="fifterTable">
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
        <el-button type="primary" @click="addQuestionnaireNode('new','')">添加</el-button>
        <!-- <el-button @click="questionnaireShow=false">取 消</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList
} from '@/api/common'
// import {
//   getOrgList
// } from '@/api/system'
import {
  getExecutiveOrg
} from '@/api/public'
import {
  getExamFifter,
  viewSurvey,
  saveSurvey,
  updateSurvey
} from '@/api/administration'
import {
  getFifter,
  searchFifter
} from '@/api/public'
export default {
  name: 'QuestionnaireInfo',
  data() {
    return {
      isScroll: false,
      submit_loading: false,
      questionnaireId: '',
      questionnaireType: '',
      questionnaireForm: {
        title: '',
        time: [],
        startTime: '',
        endTime: '',
        role: '',
        subject: ''
      },
      examIds: [],
      rules: {
        title: [{
          required: true,
          message: '问卷主题不能为空',
          trigger: 'blur'
        }],
        time: [{
          required: true,
          message: '调查时间不能为空',
          trigger: 'change'
        }]
      },
      tableData: [],
      viewTitle: '新增/编辑问卷调查',
      orgList: [{
        id: '',
        name: ''
      }], // 组织架构列表
      defaultNode: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      getRowKeys(row) {
        return row.id
      },
      roleList: [], // 根据id获取角色列表
      objList: [],
      questionnaireShowList: [],
      questionnaireChoseList: [],
      questionnaireShow: false,
      searchInfo: {
        mode: 'survey', // 类型 日常routine 问卷 performance 绩效 survey
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 5, // 每页显示条数
        recTotal: 0 // 总条数
      },
      leavePage: 1,
      num: 1,
      total: 0, // 总条数
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
      fifterOptions: []
    }
  },
  mounted() {
    // 监听浏览器返回
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.goBack, false)
    }
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    // 页面第一个渲染的函数
    if (this.$route.query.type === 'new') {
      this.viewTitle = '新增日常问卷调查试卷'
    } else if (this.$route.query.type === 'edit') {
      this.viewTitle = '编辑日常问卷调查试卷'
      this.questionnaireId = this.$route.query.id
      this.questionnaireType = 'edit'
    } else if (this.$route.query.type === 'copy') {
      this.viewTitle = '复制日常问卷调查试卷'
      this.questionnaireId = this.$route.query.id
      this.questionnaireType = 'copy'
    }
    this.$route.meta.title = this.viewTitle
    // 获取列表
    this.getList()
    // 获取试题库筛选条件
    this.getFifterInfo()
    // // 获取问卷调查试题库
    // this.getquestionnaireList()
    // 根据id获取试卷详情
    // if (this.questionnaireId !== '') {
    //   this.getDetail(this.questionnaireType)
    // }
  },
  destroyed() {
    window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
    window.removeEventListener('popstate', this.goBack, false)
  },
  methods: {
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
    updateValue() {
      this.$forceUpdate()
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
          // 获取角色列表
          getRoleList().then(res => {
            if (res.code === 200 || res.code === '200') {
              that.roleList = res.data
              if (that.questionnaireId !== '') {
                that.getDetail(that.questionnaireType)
              }
            }
          })
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
      this.getquestionnaireList()
    },
    getFifterInfo() {
      const that = this
      getFifter('itembank', 'ad').then(res => {
        if (res.code === 200) {
          // console.log(res, 'dsadad')
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
    getDetail(type) {
      const that = this
      viewSurvey(this.questionnaireId).then(res => {
        if (res.code === '200' || res.code === 200) {
          const view = res.data.survey
          const arr = []
          arr.push(view.startTime)
          arr.push(view.endTime)
          that.questionnaireForm = {
            title: view.title,
            time: arr
          }
          that.changeList(view)
        }
      })
    },
    // 将获取的数据通知对象和试题列表进行转换
    changeList(data) {
      // 转换通知对象
      this.objList = JSON.parse(data.role)
      for (let i = 0; i < this.objList.length; i++) {
        this.objList[i].orgName = this.objList[i].orgId
        const len = this.objList[i].orgName.length - 1
        if (this.objList[i].orgName !== 0 || this.objList[i].orgName !== '0') {
          this.objList[i].roleList = []
          if (this.objList[i].roleList.length === 0) {
            this.objList[i].roleList.push({
              id: '0',
              name: '全部角色'
            })
            for (let j = 0; j < this.roleList.length; j++) {
              if (this.objList[i].orgName === this.roleList[j].organize_id) {
                console.log(this.objList[i].orgName)
                let arr = []
                arr = this.objList[i].roleList.concat(this.roleList[j].data)
                this.objList[i].roleList = [...arr]
                break
              }
            }
          }
        }
      }
      // 转换试题库
      this.choseMorequestionnaire(data.itembank)
      this.addQuestionnaireNode('edit', data.subject)
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
    getquestionnaireList() {
      const that = this
      const info = {
        ids: this.examIds
      }
      // 获取绩效试题库
      getExamFifter(this.searchInfo, info).then(res => {
        if (res.code === 200 || res.code === '200') {
          that.tableData = res.data.itembanks
          that.total = res.data.pager.recTotal
        }
      })
    },
    addQuestion() {
      if (this.questionnaireType === 'edit') {
        const arr = []
        for (let i = 0; i < this.questionnaireShowList.length; i++) {
          arr.push(this.questionnaireShowList[i].id)
        }
        this.examIds = arr.join(',')
      }
      this.getquestionnaireList()
      this.questionnaireChoseList = []
      this.questionnaireShow = true
    },
    removeQuestion(item) {
      let index = 0
      index = this.questionnaireShowList.indexOf(item)
      this.questionnaireShowList.splice(index, 1)
      const arr = this.questionnaireShowList.map(function(o) {
        return o.id
      })
      this.examIds = arr.join(',')
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.searchInfo.pageID = 1
      this.searchInfo.recPerPage = val
      this.tableData = []
      this.getquestionnaireList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.searchInfo.pageID = val
      this.getquestionnaireList()
    },
    beforeunloadHandler(e) {
      if (window.localStorage.getItem('logout') === 0 || window.localStorage.getItem('logout') === '0') {
        if (this.$route.path === '/administration/questionnaireIndex/questionnaireInfo') {
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
    addObjNode() {
      const info = {
        orgId: '',
        orgName: [],
        roleId: '',
        roleList: []
      }
      if (this.objList.length === 0) {
        this.objList.push(info)
      } else {
        let flag = true
        const list = this.objList
        for (let i = 0; i < list.length; i++) {
          for (const item in list[i]) {
            if (list[i][item] === '') {
              this.$message.warning('参与角色内容不能为空')
              flag = false
              break
            }
          }
        }
        if (flag) {
          this.objList.push(info)
        }
      }
      this.$forceUpdate()
      this.changeHeight()
    },
    removeObjNode(item) {
      let index = 0
      index = this.objList.indexOf(item)
      this.objList.splice(index, 1)
      this.changeHeight()
    },
    choseOrg(key, value) {
      // const that = this
      const len = value.orgName.length - 1
      this.objList[key].orgId = ''
      this.objList[key].roleId = ''
      this.objList[key].roleList = []
      if (this.objList[key].orgName !== 0 || this.objList[key].orgName !== '0') {
        if (this.objList[key].roleList.length === 0) {
          for (let i = 0; i < this.roleList.length; i++) {
            this.objList[key].roleList = []
            this.objList[key].roleList.push({
              id: '0',
              name: '全部角色'
            })
            if (this.objList[key].orgName === this.roleList[i].organize_id) {
              let arr = []
              arr = this.objList[key].roleList.concat(this.roleList[i].data)
              this.objList[key].roleList = [...arr]
              break
            }
          }
        }
      }
      this.objList[key].orgId = this.objList[key].orgName
      this.$forceUpdate()
      this.changeHeight()
      console.log(this.objList[key])
    },
    saveExamPaper() {
      console.log(this.questionnaireForm)
      console.log(this.objList)
      console.log(this.questionnaireShowList)
      let flag = true
      const that = this
      if (this.questionnaireForm.title == '') {
        this.$message.warning('考试主题不能为空')
      } else if (this.questionnaireForm.time.length == 0) {
        this.$message.warning('考试时间不能为空')
      } else if (this.objList.length <= 0) {
        this.$message.warning('参与角色不能为空')
      } else if (this.questionnaireShowList.length <= 0) {
        this.$message.warning('试题不能为空')
      } else {
        const list = this.objList
        for (let i = 0; i < list.length; i++) {
          for (const item in list[i]) {
            if (list[i][item] === '') {
              this.$message.warning('参与角色内容不能为空')
              flag = false
              break
            }
          }
        }
        // const list1 = this.questionnaireShowList
        if (flag) {
          this.$refs['questionnaireForm'].validate((valid) => {
            if (valid) {
              // 格式化通知对象
              const arr = []
              for (let i = 0; i < this.objList.length; i++) {
                arr.push({
                  orgId: this.objList[i].orgId,
                  roleId: this.objList[i].roleId
                })
              }
              // 格式化试题列表
              const exams = []
              for (let i = 0; i < this.questionnaireShowList.length; i++) {
                exams.push({
                  id: this.questionnaireShowList[i].id
                })
              }
              // 新增日常考试试卷
              const info = {
                title: this.questionnaireForm.title,
                startTime: this.questionnaireForm.time[0],
                endTime: this.questionnaireForm.time[1],
                role: JSON.stringify(arr),
                subject: JSON.stringify(exams)
              }
              this.leavePage = 2
              this.submit_loading = true
              if (this.questionnaireId === '') {
                saveSurvey(info).then(res => {
                  that.submit_loading = true
                  if (res.code === 200 || res.code === '200') {
                    console.log(res)
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
                  }
                })
              } else {
                updateSurvey(this.questionnaireId, info).then(res => {
                  that.submit_loading = true
                  if (res.code === 200 || res.code === '200') {
                    console.log(res)
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
                  }
                })
              }
            } else {
              console.log('error submit!!')
              // this.$message.warning('信息填写不完整或者信息填写有误！')
              this.$nextTick(() => {
                this.checkFormErr()
              })
              return false
            }
          })
        }
      }
    },
    searchTest() {
      console.log(this.fifterKey)
      const that = this
      searchFifter(this.fifterKey).then(res => {
        console.log(res)
        if (res.code === 200) {
          that.searchInfo.search = 'bySearch'
          that.tableData = []
          that.total = 0
          that.searchInfo.pageID = 1
          that.getquestionnaireList()
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
    choseMorequestionnaire(val) {
      console.log(val)
      this.questionnaireChoseList = []
      this.questionnaireChoseList = val
      for (let i = 0; i < this.questionnaireChoseList.length; i++) {
        // 多选题
        if (this.questionnaireChoseList[i].type === '2') {
          this.questionnaireChoseList[i].trueAnswer = this.questionnaireChoseList[i].questionAnswer.split(',')
        }
        if (this.questionnaireChoseList[i].type !== '4') {
          this.questionnaireChoseList[i].optionsList = JSON.parse(this.questionnaireChoseList[i].questionSelect)
          for (let j = 0; j < this.questionnaireChoseList[i].optionsList.length; j++) {
            this.questionnaireChoseList[i].optionsList[j].istrue = false
            // 多选题
            if (this.questionnaireChoseList[i].type === '2') {
              for (let k = 0; k < this.questionnaireChoseList[i].trueAnswer.length; k++) {
                if (this.questionnaireChoseList[i].trueAnswer[k] === this.questionnaireChoseList[i].optionsList[j]
                  .code) {
                  this.questionnaireChoseList[i].optionsList[j].istrue = true
                }
              }
            } else {
              if (this.questionnaireChoseList[i].optionsList[j].code === this.questionnaireChoseList[i]
                .questionAnswer) {
                this.questionnaireChoseList[i].optionsList[j].istrue = true
              }
            }
          }
        }
      }
    },
    addQuestionnaireNode(type, data) {
      this.examIds = ''
      // const arr = []
      if (this.questionnaireShowList.length === 0) {
        this.questionnaireShow = false
        this.questionnaireShowList = this.questionnaireChoseList
        const arr = this.questionnaireShowList.map(function(o) {
          return o.id
        })
        this.examIds = arr.join(',')
      } else {
        let flag = true
        for (let i = 0; i < this.questionnaireChoseList.length; i++) {
          for (let j = 0; j < this.questionnaireShowList.length; j++) {
            if (this.questionnaireChoseList[i].id === this.questionnaireShowList[j].id) {
              const msg = '不允许添加重复试题，题号为' + this.questionnaireChoseList[i].id + '并且标题为' + this.questionnaireChoseList[i]
                .title + '重复！'
              this.$message.warning(msg)
              flag = false
              break
            }
          }
        }
        if (flag) {
          this.questionnaireShowList = this.questionnaireShowList.concat(this.questionnaireChoseList)
          this.questionnaireShow = false
          this.questionnaireChoseList = []
          const arr = this.questionnaireShowList.map(function(o) {
            return o.id
          })
          this.examIds = arr.join(',')
        }
      }
      if (type === 'new') {
        // 弹框新增
        this.$refs.exam.clearSelection()
      // eslint-disable-next-line no-empty
      } else {
      }
      this.$forceUpdate()
      this.changeHeight()
    }
  }
}

</script>
<style lang="less" scoped>
  .i_questionnaire_bg {
    background: #f2f2f2;
    padding: 10px;
    position: relative;
    width: 100%;
    height: calc(100vh - 108px);
    top: 0;
    z-index: 99;
    overflow: hidden;

    .questionnaire_info {
      background: #fff;
      padding: 10px;

      .questionnaire_info_head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ccc;
        padding-bottom: 10px;

        .questionnaire_info_title {
          font-family: '微软雅黑 Bold', '微软雅黑';
          font-weight: 700;
          font-style: normal;
          font-size: 14px;
          color: #333333;
        }
      }

      .exam_scroll {
        .questionnaire_info_detail {
          .questionnaire_form {
            margin-top: 10px;

            .obj_style {
              .show_objs {
                display: flex;
                align-items: center;
                margin-bottom: 10px;

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

            .questionnaire_list {
              border-top: 1px solid #e0e0e0;
              padding-top: 10px;
              .questionnaire_block {
                font-size: 14px;
                font-family: 'Arial Normal', 'Arial';
                font-weight: 400;
                color: #333;
                margin-bottom: 20px;
                border: 1px solid #e0e0e0;
                border-bottom: none;
                .questionnaire_topic{
                  display: flex;
                  border-bottom: 1px solid #e0e0e0;
                  .questionnaire_block_topic_title{
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
                  .questionnaire_left{
                    padding: 6px 10px;;
                  }
                .questionnaire_title {
                  color: #333;
                  display: flex;
                  align-items: center;

                  i {
                    font-size: 24px;
                    margin-left: 20px;
                  }
                }

                .questionnaire_option {
                  .active {
                    color: #006633;
                    font-weight: 700;
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

  .questionnaireModel {
    .questionnaire_table{
      padding-top: 20px;
      .fifter{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        margin-top: -10px;
        .fifter_block{
          // width: 200px;
          margin-right: 10px;
        }

      }
    }
    .view_page {
      text-align: center;
      margin-top: 10px;
      margin-bottom:20px;
    }
  }

</style>
