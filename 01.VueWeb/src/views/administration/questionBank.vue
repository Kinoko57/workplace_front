<template>
  <div>
    <div class="view_bg">
      <div class="fifter">
        <my-tabs
          :active-name="'all'"
          :add="btnPermission('itembank_create')"
          :page-name="page_name"
          :module-name="module_name"
          :tabs-list="typeList"
          :fifter-open="false"
          @addAction="addReport"
          @handleClick="choseType"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)" />
          <!-- <search-fifter :add="btnPermission('itembank_create')" :module-name="'itembank'" :fifter="true" :add-text="'创建试题'" @addAction="addReport" @search="fifterSearch" /> -->
      </div>
      <div class="view_info">
        <!-- <el-tabs v-model="searchInfo.mode" type="card" class="tabs_table" @tab-click="choseType">
          <el-tab-pane v-for="(item,index) in typeList" :key="index" :label="item.text" :name="item.name"> -->
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}个记录，已选中{{ choseTotal }}条</span>
            <el-button v-if="btnPermission('itembank_cancellations')" plain size="mini" @click="batchstop('remover')">批量作废</el-button>
          </div>
        </div>
        <el-table v-loading="loading" ref="table" :data="tableData" :max-height="tableHeight" border row-key="id" style="width: 100%" tooltip-effect="light" @sort-change="fifterTable" @selection-change="handleSelectionChange">
          <el-table-column type="selection" min-width="40" fixed="left" align="center"/>
          <el-table-column prop="title" label="题目" show-overflow-tooltip min-width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="scene" label="适用场景" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.scene==1">日常考试</span>
              <span v-if="scope.row.scene==2">问卷调查</span>
              <span v-if="scope.row.scene==3">绩效考核</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.type==1">单选题</span>
              <span v-if="scope.row.type==2">多选题</span>
              <span v-if="scope.row.type==3">是非题</span>
              <span v-if="scope.row.type==4">问答题</span>
            </template>
          </el-table-column>
          <el-table-column prop="answer" label="答案解析/评分标准/调查目的" show-overflow-tooltip min-width="260">
            <template slot-scope="scope">
              <span>{{ scope.row.answer }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createdBy" label="创建人" min-width="100"/>
          <el-table-column prop="createdDate" label="创建时间" min-width="150"/>
          <el-table-column v-if="tableData.length>0" label="操作" min-width="100" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('itembank_edit')" type="text" size="small" @click="showModel(scope.row,'edit')">编辑</el-button>
              <el-button v-if="btnPermission('itembank_cancellation')" type="text" size="small" @click="changeStates(scope.row)">作废</el-button>
            </template>
          </el-table-column>
        </el-table>
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
        <!-- </el-tab-pane>
        </el-tabs> -->
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="modelShow" :title="modelTitle" class="dialogModel" @close="resetModel">
      <!-- 新建/编辑试题 -->
      <el-scrollbar v-if="modelShow" class="fixed_scroll over_scroll">
        <div class="show_scroll scroll_question">
          <el-form
            v-if="modelShow"
            ref="questionForm"
            :model="questionForm"
            :rules="rules"
            class="modelForm"
            label-width="100px"
            label-position="right">
            <el-form-item label="适用场景：" prop="scene">
              <el-radio-group v-model="questionForm.scene" :disabled="modelType=='edit'" @change="choseSceneType">
                <el-radio label="1">日常考试</el-radio>
                <el-radio label="2">问卷调查</el-radio>
                <el-radio label="3">绩效考核</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="题目：" prop="title">
              <el-input v-model.trim="questionForm.title" :rows="4" type="textarea" style="width:500px" placeholder="请输入题目,最多120个字" />
            </el-form-item>
            <el-form-item label="类型：" prop="type">
              <el-radio-group v-model="questionForm.type" :disabled="modelType=='edit'" @change="choseQuestionType">
                <el-radio label="1">单选题</el-radio>
                <el-radio v-if="questionForm.scene!=3" label="2">多选题</el-radio>
                <el-radio label="3">是非题</el-radio>
                <el-radio label="4">问答题</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="questionForm.type!=4" label="选项：" class="answer_bg" required>
              <div v-show="questionForm.type==1">
                <div v-for="(block,index) in radioList" :key="index" class="answer_blcok">
                  <span class="answer_code">{{ letterFifter[index] }}：</span>
                  <span>
                    <el-input v-model.trim="block.title" style="width:450px" placeholder="请输入选项内容，50字以内" maxlength="50" />
                    <i class="el-icon-remove" @click="removeRadioNode(block,index)" />
                  </span>
                </div>
                <el-button type="primary" @click="addRadioNode">添加选项</el-button>
              </div>
              <div v-show="questionForm.type==2">
                <div v-for="(block,index) in checkList" :key="index" class="answer_blcok">
                  <span class="answer_code">{{ letterFifter[index] }}：</span>
                  <span>
                    <el-input v-model.trim="block.title" style="width:450px" placeholder="请输入选项内容，50字以内" maxlength="50" />
                    <i class="el-icon-remove" @click="removeCheckNode(block,index)" />
                  </span>
                </div>
                <el-button type="primary" @click="addCheckNode">添加选项</el-button>
              </div>
              <div v-show="questionForm.type==3">
                <div v-for="(block,index) in judgeList" :key="index" class="answer_blcok">
                  <span class="answer_code">{{ block.code }}：</span>
                  <span>{{ block.title }}</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item v-if="questionForm.type!=4&&questionForm.scene==1" label="正确答案：" class="answer_true" required>
              <el-radio-group v-show="questionForm.type==1" v-model="questionForm.questionAnswer" class="true_block">
                <el-radio v-for="(block,index) in radioList" :label="letterFifter[index]" :key="index">{{ letterFifter[index] }}</el-radio>
              </el-radio-group>
              <el-checkbox-group v-show="questionForm.type==2" v-model="checkAnswer" @change="choseCheck">
                <el-checkbox v-for="(block,index) in checkList" :label="letterFifter[index]" :key="index"/>
              </el-checkbox-group>
              <el-radio-group v-show="questionForm.type==3" v-model="questionForm.questionAnswer">
                <el-radio v-for="(block,index) in judgeList" :label="block.code" :key="index">{{ block.code }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="questionForm.type==4&&questionForm.scene==1" label="参考答案：" class="answer_true" required>
              <el-input v-model.trim="questionForm.questionAnswer" :rows="4" type="textarea" maxlength="200" style="width:400px" placeholder="请输入参考答案,最多200个字" />
            </el-form-item>
            <el-form-item v-if="questionForm.scene==1" label="答案解析：">
              <el-input v-model.trim="questionForm.answer" :rows="4" type="textarea" maxlength="200" style="width:500px" placeholder="请输入答案解析,最多200个字" />
            </el-form-item>
            <el-form-item v-if="questionForm.scene==2" label="调查目的：">
              <el-input v-model.trim="questionForm.answer" :rows="4" type="textarea" maxlength="200" style="width:500px" placeholder="请输入调查目的,最多200个字" />
            </el-form-item>
            <el-form-item v-if="questionForm.scene==3" label="评分标准：">
              <el-input v-model.trim="questionForm.answer" :rows="4" type="textarea" maxlength="200" style="width:500px" placeholder="请输入评分标准,最多200个字" />
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="submitting" type="primary" @click="saveModel">{{ sureBtn }}</el-button>
        <!-- <el-button @click="resetForm">重 置</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getQuestionInfo,
  saveQuestion,
  banQuestion,
  questionBankbatchCancel,
  updateQuestion
} from '@/api/administration'
export default {
  name: 'QuestionBank',
  data() {
    return {
      moduleType: '',
      page_name: 'itembank',
      module_name: 'ad',
      choseTotal: 0,
      letterFifter: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
        'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
      ],
      tableData: [],
      loading: true,
      modelType: '',
      modelTitle: '',
      modelShow: false,
      sureBtn: '保 存',
      questionForm: {
        scene: '1',
        title: '',
        questionSelect: '',
        type: '1',
        questionAnswer: '',
        answer: ''
      },
      checkAnswer: [],
      tableHeight: 250,
      rules: {
        title: [{
          required: true,
          message: '题目不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '题目长度超出范围1-120位之间', trigger: 'blur' }],
        scene: [{
          required: true,
          message: '适用场景不能为空',
          trigger: 'change'
        }],
        type: [{
          required: true,
          message: '类型不能为空',
          trigger: 'change'
        }]
      },
      radioList: [],
      checkList: [],
      judgeList: [{
        code: 'A',
        title: '是'
      }, {
        code: 'B',
        title: '否'
      }],
      typeList: [{
        label: '全部试题',
        name: 'all'
      },
      {
        label: '日常考试',
        name: 'routine'
      },
      {
        label: '绩效考核',
        name: 'performance'
      },
      {
        label: '问卷调查',
        name: 'survey'
      }
      ],
      submitting: false,
      searchInfo: {
        mode: 'all', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      selectArr: [],
      total: 0 // 总条数
    }
  },
  mounted() {
    // 页面第一个渲染的函数
    this.getList()
    this.resetForm()
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  methods: {
    batchstop(type) {
      const that = this
      console.log('askldjslkdf')
      if (that.selectArr.length > 0) {
        const obj = {
          ids: this.selectArr.join(',')
        }
        this.$confirm('试题一旦作废，不可以恢复哦~,确定要批量“作废”吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          questionBankbatchCancel(obj).then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                type: 'success',
                message: res.data.message
              })
              that.getList()
              that.selectArr = []
              that.$refs.table.clearSelection()
            } else {
              that.$message({
                type: 'warning',
                message: res.data.message
              })
              console.log('没有成功')
            }
          })
        }).catch(() => {
          console.log('用户点击了取消')
        })
      }
    },
    handleSelectionChange(val) {
      console.log(val)
      this.choseTotal = val.length
      if (val.length > 0) {
        const arr = []
        for (let i = 0; i < val.length; i++) {
          arr.push(val[i].id)
        }
        this.selectArr = arr
        console.log('本页选择了')
      } else {
        this.selectArr = []
        console.log('取消选择')
      }
    },
    importAction() {

    },
    searchShowAction(value) {
      console.log('switch改变了')
      console.log(value)
      if (value) {
        this.$nextTick(res => {
          var elementHeight = parseInt(document.getElementsByClassName('search_style')[0].clientHeight)
          this.tableHeight = document.body.offsetHeight - 330 - elementHeight
          console.log(this.tableHeight)
        })
      } else {
        this.tableHeight = document.body.offsetHeight - 360
      }
    },
    fuzzyQueryAction(value) {
      // table表格重置高度
      this.tableHeight = document.body.offsetHeight - 360
      // 模糊查询搜索
      console.log(value)
      if (value) {
        this.tableData = []
        this.searchInfo.search = 'bySearch'
        this.total = 0
        this.searchInfo.pageID = 1
        this.loading = true
        this.getList()
      }
    },
    searchQueryAction(value) {
      // 高级搜索
      console.log(value)
      if (value) {
        this.tableData = []
        this.searchInfo.search = 'bySearch'
        this.total = 0
        this.searchInfo.pageID = 1
        this.loading = true
        this.getList()
      }
    },
    filterQueryAction(value) {
      // 筛选查询
      console.log(value)
      if (value) {
        this.tableData = []
        this.searchInfo.search = 'bySearch'
        this.total = 0
        this.searchInfo.pageID = 1
        this.loading = true
        this.getList()
      }
    },
    // 方法
    getList() {
      const that = this
      getQuestionInfo(this.searchInfo).then(res => {
        if (res.code === 200 || res.code === '200') {
          this.loading = false
          that.tableData = res.data.itembanks
          that.total = res.data.pager.recTotal
        }
      })
    },
    choseType(value) {
      this.searchInfo.pageID = 1
      this.searchInfo.mode = value
      this.tableData = []
      this.loading = true
      if ((this.$refs.table) !== undefined) {
        this.resetTable()
      }
      this.getList()
    },
    resetTable() {
      for (let i = 0; i < (this.$refs.table).length; i++) {
        (this.$refs.table)[i].clearSort()
      }
    },
    choseSceneType(e) {
      this.questionForm.title = ''
      this.questionForm.questionSelect = ''
      this.questionForm.questionAnswer = ''
      this.questionForm.answer = ''
      this.questionForm.type = '1'
      this.resetForm()
    },
    choseQuestionType(e) {
      this.questionForm.questionAnswer = ''
      this.questionForm.answer = ''
      if (e === '4') {
        this.questionForm.questionSelect = ''
      }
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
    fifterTable(event) {
      console.log(event.prop)
      console.log(event.order)
      this.loading = true
      if (event.order === 'ascending') {
        this.searchInfo.orderBy = event.prop + '_asc'
      } else if (event.order === 'descending') {
        this.searchInfo.orderBy = event.prop + '_desc'
      } else {
        this.searchInfo.orderBy = ''
      }
      this.searchInfo.pageID = 1
      this.tableData = []
      this.getList()
    },
    addReport() {
      this.modelTitle = '创建试题'
      this.modelType = 'new'
      this.modelShow = true
      this.sureBtn = '保 存'
    },
    changeStates(event) {
      const that = this
      const msg = '试题一旦作废不可恢复，确定要“作废”吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        banQuestion(event.id).then(res => {
          if (res.code === 200 || res.code === '200') {
            that.$message({
              type: 'success',
              message: res.data.message
            })
            that.modelShow = false
            that.loading = true
            that.getList()
          } else {
            that.$message({
              type: 'warning',
              message: res.data.message
            })
          }
        })
      }).catch(() => {
        console.log('用户点击了取消')
      })
    },
    showModel(data) {
      this.modelType = 'edit'
      data = {
        ...data
      }
      this.questionForm = {
        id: data.id,
        scene: data.scene,
        title: data.title,
        questionSelect: data.questionSelect,
        type: data.type,
        questionAnswer: data.questionAnswer,
        answer: data.answer
      }
      console.log(this.questionForm)
      if (data.type === '1') {
        // 单选题
        this.radioList = JSON.parse(data.questionSelect)
      } else if (data.type === '2') {
        // 多选题
        this.checkList = JSON.parse(data.questionSelect)
        this.checkAnswer = data.questionAnswer.split(',')
      } else if (data.type === '3') {
        // 是非题
        this.judgeList = JSON.parse(data.questionSelect)
      }
      this.modelTitle = '编辑试题'
      this.modelShow = true
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.searchInfo.pageID = 1
      this.searchInfo.recPerPage = val
      this.tableData = []
      this.loading = true
      this.getList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.searchInfo.pageID = val
      this.loading = true
      this.getList()
    },
    addRadioNode() {
      const info = {
        code: '',
        title: ''
      }
      if (this.radioList.length <= 0) {
        this.radioList.push(info)
      } else {
        let flag = true
        const list = this.radioList
        for (let i = 0; i < list.length; i++) {
          if (list[i]['title'] === '') {
            this.$message.warning('选项内容不能为空！')
            flag = false
            break
          }
        }
        if (flag) {
          this.radioList.push(info)
        }
      }
    },
    removeRadioNode(item, key) {
      this.questionForm.questionAnswer = ''
      let index = 0
      index = this.radioList.indexOf(item)
      this.radioList.splice(index, 1)
    },
    addCheckNode() {
      const info = {
        code: '',
        title: ''
      }
      if (this.checkList.length <= 0) {
        this.checkList.push(info)
      } else {
        let flag = true
        const list = this.checkList
        for (let i = 0; i < list.length; i++) {
          if (list[i]['title'] === '') {
            this.$message.warning('选项内容不能为空！')
            flag = false
            break
          }
        }
        if (flag) {
          this.checkList.push(info)
        }
      }
    },
    removeCheckNode(item, key) {
      this.checkAnswer = []
      this.questionForm.questionAnswer = ''
      let index = 0
      index = this.checkList.indexOf(item)
      this.checkList.splice(index, 1)
    },
    choseCheck(e) {
      const arr = e.sort()
      this.questionForm.questionAnswer = ''
      this.questionForm.questionAnswer = arr.join(',')
    },
    saveModel() {
      const that = this
      let flag = true
      if (this.questionForm.scene === '1') {
        // 日常考试
        if (this.questionForm.questionAnswer === '') {
          if (this.questionForm.type === '4') {
            this.$message.warning('参考答案不能为空！')
          } else {
            this.$message.warning('正确答案不能为空！')
          }
          flag = false
        }
      }
      if (this.questionForm.type === '1') {
        if (this.radioList.length === '' || this.radioList.length === 0) {
          this.$message.warning('选项不能为空！')
          flag = false
        }
        // 判断单选选项是否为空
        const list = this.radioList
        for (let i = 0; i < list.length; i++) {
          list[i]['code'] = this.letterFifter[i]
          if (list[i]['title'] === '') {
            this.$message.warning('选项内容不能为空！')
            flag = false
          }
        }
        this.questionForm.questionSelect = JSON.stringify(list)
      } else if (this.questionForm.type === '2') {
        if (this.checkList.length === '' || this.checkList.length === 0) {
          this.$message.warning('选项不能为空！')
          flag = false
        }
        // 判断多选选项是否为空
        const list = this.checkList
        for (let i = 0; i < list.length; i++) {
          list[i]['code'] = this.letterFifter[i]
          if (list[i]['title'] === '') {
            this.$message.warning('选项内容不能为空！')
            flag = false
          }
        }
        this.questionForm.questionSelect = JSON.stringify(list)
      } else if (this.questionForm.type === '3') {
        const list = this.judgeList
        for (let i = 0; i < list.length; i++) {
          list[i]['code'] = this.letterFifter[i]
        }
        this.questionForm.questionSelect = JSON.stringify(list)
      }
      if (flag) {
        this.$refs['questionForm'].validate((valid) => {
          console.log(this.questionForm)
          if (valid) {
            this.submitting = true
            if (this.modelType === 'new') {
              // 新增试题
              saveQuestion(this.questionForm).then(res => {
                that.submitting = false
                if (res.code === 200 || res.code === '200') {
                  that.$message({
                    message: '试题添加成功！',
                    type: 'success'
                  })
                  that.resetModel()
                  that.loading = true
                  that.getList()
                } else {
                  that.$message({
                    message: res.data.msg,
                    type: 'warning'
                  })
                }
              })
            } else {
              updateQuestion(this.questionForm.id, this.questionForm).then(res => {
                that.submitting = false
                if (res.code === 200 || res.code === '200') {
                  that.$message({
                    message: '试题更新成功！',
                    type: 'success'
                  })
                  that.resetModel()
                  that.loading = true
                  that.getList()
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
    },
    resetModel() {
      console.log('重置表单')
      this.$refs['questionForm'].resetFields()
      this.questionForm = {
        scene: '1',
        title: '',
        questionSelect: '',
        type: '1',
        questionAnswer: '',
        answer: ''
      }
      this.resetForm()
      this.modelShow = false
    },
    resetForm() {
      this.radioList = [{
        code: '',
        title: ''
      }, {
        code: '',
        title: ''
      }, {
        code: '',
        title: ''
      }, {
        code: '',
        title: ''
      }]
      this.checkList = [{
        code: '',
        title: ''
      }, {
        code: '',
        title: ''
      }, {
        code: '',
        title: ''
      }, {
        code: '',
        title: ''
      }]
      this.checkAnswer = []
    }
  }
}

</script>
<style lang="less" scoped>
  .view_bg {
    // background: #fff;
    // padding: 10px;
    position: absolute;
    width: 100%;
    top: 0;

    .view_info {
      padding: 20px 10px;
      background: #fff;
      .tabs_table {
        .text_color {
          color: #409EFF;
        }

        .over_line_one {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap
        }

        .over_line_two {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }

    .view_page {
      text-align: center;
      padding: 10px 0;
    }
  }

  .dialogModel {

    .scroll_question {
      height: 500px;

      .modelForm {
        .answer_bg {
          .answer_blcok {
            margin-bottom: 10px;
            display: flex;
            align-items: center;

            .answer_code {
              margin-right: 5px;
            }

            i {
              font-size: 24px;
              margin-left: 20px;
            }
          }
        }

        .answer_true {
          .true_block {
            width: 400px;

            .el-radio {
              margin: 0;
              margin-right: 40px;
              margin-top: 10px;
            }
          }
        }
      }
    }
  }

</style>
