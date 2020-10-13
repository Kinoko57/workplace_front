<template>
  <div>
    <div class="course_bg">
      <div class="fifter">
        <my-tabs
          :page-name="page_name"
          :module-name="module_name"
          :add="btnPermission('onlinestudy_create')"
          :active-name="searchInfo.mode"
          :tabs-list="typeList"
          @addAction="addCourse"
          @handleClick="choseType"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)"/>
      </div>
      <div class="course_info">
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}条数据，已选中{{ choseTotal }}条</span>
            <el-button v-if="btnPermission('onlinestudy_cancellations')" plain size="mini" @click="batchstop('remover')">批量作废</el-button>
            <!-- <el-button plain size="mini">批量启用</el-button>
            <el-button plain size="mini">批量停用</el-button> -->
          </div>
          <div class="export_btn">
            <search-fifter
              :module-name="'onlinestudy'"
              :export-show="btnPermission('onlinestudy_export')"
              :export-type="moduleType"
              :export-name="'排课列表'"/>
          </div>
        </div>
        <el-table
          v-loading="loading"
          ref="table"
          :data="tableData"
          :max-height="tableHeight"
          row-key="id"
          border
          tooltip-effect="light"
          @sort-change="fifterTable"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" min-width="40" fixed="left" align="center"/>
          <el-table-column label="主题" prop="name" min-width="120" show-overflow-tooltip/>
          <el-table-column label="排课日期" min-width="150">
            <template slot-scope="scope">
              <span class="text_color">{{ scope.row.uploadDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="排课分类" prop="studyLeavelName" min-width="150" show-overflow-tooltip/>
          <el-table-column label="摇篮群" min-width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="text_color">{{ scope.row.cradlegroupIdName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="techerIdName" label="讲师" min-width="150" show-overflow-tooltip/>
          <el-table-column prop="status" label="状态" width="200" >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status==1">待完成</el-tag>
              <el-tag v-if="scope.row.status==2" type="success">已完成</el-tag>
              <el-tag v-if="scope.row.status==3" type="danger">未完成</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="tableData.length>0" label="操作" min-width="200" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('onlinestudy_edit')" type="text" size="small" @click="editCourse(scope.row)">编辑</el-button>
              <el-button v-if="btnPermission('onlinestudy_setresult')" :disabled="isdisabled && scope.row.status==1" type="text" size="small" @click="viewCourse(scope.row)">结果</el-button>
              <el-button v-if="btnPermission('onlinestudy_updatestatus')" type="text" size="small" @click="changeStates(scope.row,'99')">作废</el-button>
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
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="modelShow" :title="modelTitle" class="dialogModel" @close="resetModel">
      <el-scrollbar v-if="modelType!='view'&&modelShow" class="fixed_scroll">
        <!-- 新建/编辑排课 -->
        <el-form
          v-if="modelType!='view'&&modelShow"
          ref="courseForm"
          :model="courseForm"
          :rules="rules"
          class="modelForm center"
          label-width="120px"
          label-position="right">
          <el-form-item label="学习主题：" prop="name">
            <el-input v-model.trim="courseForm.name" autocomplete="off" style="width:500px" placeholder="请输入学习主题" />
          </el-form-item>
          <el-form-item label="课程分类：" prop="studyType">
            <el-cascader :options="optionsList" v-model="courseForm.studyType" placeholder="请选择课程分类" style="width:500px"/>
          </el-form-item>
          <el-form-item label="摇篮群：" prop="cradlegroupId">
            <el-select v-model="courseForm.cradlegroupId" filterable placeholder="请选择摇篮群" style="width:500px" @change="choseCourse">
              <el-option v-for="item in selectList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="courseForm.cradlegroupId!=''" label="讲师：" prop="techerId">
            <el-select v-model="courseForm.techerId" clearable filterable placeholder="请选择讲师名称" style="width:500px">
              <el-option v-for="item in teacherList" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="排课日期：" prop="uploadDate">
            <el-date-picker
              v-model="courseForm.uploadDate"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:500px" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <el-scrollbar v-if="modelType=='view'&&modelShow" class="fixed_scroll over_scroll">
        <table class="view_dialog view_dialog_find" cellpadding="0" cellspacing="0">
          <tr class="view_line">
            <td class="line_title">学习主题：</td>
            <td class="second_line">{{ viewForm.name }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">课程分类：</td>
            <td class="second_line">{{ viewForm.studyLeavelName }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">摇篮群：</td>
            <td class="second_line">{{ viewForm.cradlegroupIdName }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">讲师：</td>
            <td class="second_line">{{ viewForm.techerIdName }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">排课日期：</td>
            <td class="second_line">{{ viewForm.uploadDate }}</td>
          </tr>
        </table>
        <el-form
          v-if="modelType=='view'&&modelShow"
          ref="viewForm"
          :model="viewForm"
          :rules="viewRules"
          class="modelForm center"
          label-width="100px"
          label-position="right">
          <el-form-item label="设置状态：" prop="status">
            <el-radio-group v-model="viewForm.status">
              <!-- <el-radio :label="1">待完成</el-radio> -->
              <el-radio :label="2" @change="showRed('2')">已完成</el-radio>
              <el-radio :label="3" @change="showRed('3')">未完成</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item ref="isShow" label="课件：" prop="classFile">
            <i v-if="isShowRed" class="red_star">*</i>
            <el-upload
              ref="upload"
              :on-preview="handlePreview"
              :on-exceed="handleExceed"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :on-change="uploadChange"
              :limit="1"
              :name="'files'"
              :action="uploadUrl"
              :file-list="fileList"
              class="upload-demo"
              style="width:500px"
              multiple>
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip" style="width:500px">请上传压缩包、word文档、excel文档、ppt演示文稿、pdf文档、图片文件</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="备注：" prop="remarks">
            <el-input :rows="4" v-model.trim="viewForm.remarks" style="width:500px" type="textarea" placeholder="如果没有上传课件，则必须填写未开课理由，最大字长度为120个字" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div v-if="modelType!='view'" slot="footer" class="dialog-footer">
        <el-button v-show="modelType=='new'" @click="restForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">保 存</el-button>
      </div>
      <div v-if="modelType=='view'" slot="footer" class="dialog-footer">
        <el-button @click="restForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveFile">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getdoubleonlinelist,
  getlastdata,
  getonlinestudy,
  getonlineTeacher,
  addonlinestudy,
  editonlinestudy,
  coursebatchCancel,
  setresult,
  updateonlinestudystatus
} from '@/api/online'
export default {
  name: 'CourseManage',
  data() {
    var checkLength = (rule, value, callback) => {
      console.log(value, 4)
      if (value.length !== 2) {
        callback(new Error('请选择二级分类'))
      } else {
        callback()
      }
    }
    var checkLength2 = (rule, value, callback) => {
      // console.log(value, 4)
      if (this.lable === '2') {
        if (this.$refs.upload.uploadFiles.length !== 0) {
          callback()
        } else {
          callback(new Error('请上传课件'))
        }
      } else {
        callback()
      }
    }
    return {
      page_name: 'onlinestudy',
      module_name: 'ols',
      choseTotal: 0,
      uploadUrl: '',
      moduleType: '/ols/onlinestudy-export',
      loading: true,
      vieinfo: {},
      tableData: [],
      optionsList: [],
      selectList: [],
      fileList: [],
      files: [],
      tableHeight: 250,
      typeList: [{
        label: '全部排课',
        name: 'all'
      },
      {
        label: '待完成',
        name: 'notInvited'
      },
      {
        label: '已完成',
        name: 'invited'
      },
      {
        label: '未完成',
        name: 'study'
      }
      ],
      DateCreate: [],
      searchInfo: {
        mode: 'all', // 类型
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      isShowRed: false,
      total: 0, // 总条数
      lable: '',
      isdisabled: false,
      courseForm: {
        name: '',
        studyType: [],
        cradlegroupId: '',
        techerId: '',
        uploadDate: ''
      },
      teacherList: [],
      viewForm: {
        file: [],
        remarks: '',
        status: ''
      },
      rules: {
        name: [{
          required: true,
          message: '学习主题不能为空',
          trigger: 'blur'
        }, { min: 1, max: 60, message: '学习主题长度超出范围1-60位之间', trigger: 'blur' }],
        studyType: [{
          required: true,
          message: '课程分类不能为空',
          trigger: 'change'
        }, { validator: checkLength, trigger: 'change' }],
        type: [{
          required: true,
          message: '摇篮群不能为空',
          trigger: 'change'
        }],
        techerId: [{
          required: true,
          message: '讲师不能为空',
          trigger: 'change'
        }],
        uploadDate: [{
          required: true,
          message: '排课日期不能为空',
          trigger: 'change'
        }],
        cradlegroupId: [
          {
            required: true,
            message: '摇篮群不能为空',
            trigger: 'change'
          }
        ]
      },
      viewRules: {
        remarks: [{
          required: true,
          message: '排课备注不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '排课备注长度超出范围1-120位之间', trigger: 'blur' }],
        status: [{
          required: true,
          message: '状态不能为空',
          trigger: 'change'
        }],
        classFile: [{ validator: checkLength2, trigger: 'change' }]
      },
      modelShow: false,
      modelTitle: '',
      modelType: '',
      selectArr: [],
      submitting: false
    }
  },
  mounted() {
    this.uploadUrl = process.env.BASE_API + 'sys/file-upload'
    this.getList()
    this.getList1()
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  methods: {
    batchstop(type) {
      const that = this
      if (that.selectArr.length > 0) {
        const obj = {
          ids: this.selectArr.join(',')
        }
        that.$confirm('排课一旦作废，不可以恢复,确定要批量“作废”吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          coursebatchCancel(obj).then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                type: 'success',
                message: '操作成功'
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
    restForm() {
      this.submitting = false
      if (this.modelType === 'new') {
        this.courseForm = {
          name: '',
          studyType: [],
          cradlegroupId: '',
          techerId: '',
          uploadDate: ''
        }
        this.$refs['courseForm'].resetFields()
      } else {
        this.viewForm = {
          id: this.vieinfo.id,
          name: this.vieinfo.name,
          studyLeavelName: this.vieinfo.studyLeavelName,
          cradlegroupIdName: this.vieinfo.cradlegroupIdName,
          techerIdName: this.vieinfo.techerIdName,
          uploadDate: this.vieinfo.uploadDate,
          remarks: '',
          file: '',
          status: ''
        }
        this.$refs['viewForm'].resetFields()
        this.fileList = []
        this.isShowRed = false
      }
      this.typeForm = {}
    },
    fifterTable(event) {
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
      this.getList()
    },
    getList() {
      const that = this
      that.loading = false
      // const nn = (new Date('2019-05-15 00:00:00')).getTime()
      // console.log(nn)
      // 获取学习列表
      getonlinestudy(that.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          // console.log(res, 'fjnh')
          that.tableData = res.data.onlinestudy
          that.total = res.data.pager.recTotal // 总条数
        }
      })
    },
    getList1() {
      const that = this
      // 获取摇篮群课程等级 二级联动
      getdoubleonlinelist().then(res => {
        if (res.data !== null) {
          // eslint-disable-next-line no-undef
          that.optionsList = res.data
        }
      })
      // 获取摇篮群最新批次群
      getlastdata().then(res => {
        // eslint-disable-next-line no-undef
        that.selectList = res.data
      })
    },
    uploadChange(file, filelist) {
      console.log(filelist, 'ddd')
      if (filelist.length && filelist.length >= 1) {
        this.$refs.viewForm.validateField('classFile')
      }
    },
    showRed(e) {
      if (e === '2') {
        this.isShowRed = true
        this.lable = '2'
      } else {
        this.isShowRed = false
        // this.$refs['viewForm'].resetFields()
        this.lable = '3'
        // this.$forceUpdate()
        this.$refs['viewForm'].clearValidate('classFile')
      }
    },
    addCourse() {
      this.modelShow = true
      this.modelType = 'new'
      this.modelTitle = '创建排课'
      this.teacherList = []
    },
    choseType(value) {
      this.searchInfo.pageID = 1
      this.tableData = []
      this.searchInfo.orderBy = ''
      this.searchInfo.mode = value
      if ((this.$refs.table) !== undefined) {
        this.resetTable()
      }
      this.loading = true
      this.getList()
    },
    resetTable() {
      for (let i = 0; i < (this.$refs.table).length; i++) {
        (this.$refs.table)[i].clearSort()
      }
    },
    choseCourse() {
      const that = this
      // 将type传给后端获取讲师列表,赋值给teacherList
      getonlineTeacher(this.courseForm.cradlegroupId).then(res => {
        that.courseForm.techerId = ''
        if (res.code === 200) {
          that.teacherList = res.data
        } else {
          that.teacherList = []
        }
      })
    },
    editCourse(event) {
      const that = this
      this.modelType = 'edit'
      const data = {
        ...event
      }
      // this.courseForm = data
      getonlineTeacher(data.cradlegroupId).then(res => {
        if (res.code === 200) {
          that.teacherList = res.data
        } else {
          that.teacherList = []
        }
        that.courseForm = {
          id: data.id,
          name: data.name,
          studyType: data.studyType.split(','),
          cradlegroupId: data.cradlegroupId,
          techerId: data.techerId,
          uploadDate: data.uploadDate

        }
        that.modelShow = true
        that.modelTitle = '编辑排课'
      })
    },
    viewCourse(event) {
      this.vieinfo = event
      this.modelShow = true
      this.modelType = 'view'
      this.modelTitle = '设置结果'
      const data = {
        ...event
      }
      this.viewForm = {
        id: data.id,
        name: data.name,
        studyLeavelName: data.studyLeavelName,
        cradlegroupIdName: data.cradlegroupIdName,
        techerIdName: data.techerIdName,
        uploadDate: data.uploadDate,
        remarks: data.remarks,
        file: data.file,
        status: (parseInt(data.status) === 1) ? '' : parseInt(data.status)
      }
      console.log(this.viewForm.status)
      this.isShowRed = this.viewForm.status !== 3
      this.isShowRed = this.viewForm.status !== ''
      this.isShowRed = this.viewForm.status === 2
      if (this.viewForm.file === null || this.viewForm.file === '') {
        this.fileList = []
        this.viewForm.file = []
      } else {
        const file = JSON.parse(this.viewForm.file)
        file[0].url = file[0].url
        this.fileList = file
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
    importCourse(event) {
      if (event) {
        this.getList()
      }
    },
    changeStates(event, states) {
      const that = this
      const msg = '确定作废此排课吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        offset: '0'
      }).then(() => {
        updateonlinestudystatus(event.id, states).then(res => {
          // console.log(res);
          if (res.code === 200 || res.code === '200') {
            that.$message({
              type: 'success',
              message: res.msg
            })
            this.modelShow = false
            that.getList()
          } else {
            that.$message({
              type: 'warning',
              message: res.msg
            })
          }
        })
      })
        .catch(() => {
          console.log('用户点击了取消')
        })
    },
    saveModel() {
      const that = this
      // 保存排课
      this.$refs['courseForm'].validate(valid => {
        if (valid) {
          that.submitting = true
          if (that.courseForm.id === undefined) {
            // 新增
            addonlinestudy(that.courseForm).then(res => {
              console.log(res)
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '排课添加成功！',
                  type: 'success'
                })
                that.resetModel()
                that.getList()
              } else {
                that.submitting = false
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
          } else {
            // 更新
            editonlinestudy(that.courseForm).then(res => {
              console.log(res)
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '排课更新成功！',
                  type: 'success'
                })
                that.resetModel()
                that.getList()
              } else {
                that.submitting = false
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
          }
        } else {
          that.submitting = false
          console.log('error submit!!')
          // this.$message.warning('信息填写不完整或者信息填写有误！')
          this.$nextTick(() => {
            this.checkFormErr()
          })
          return false
        }
      })
    },
    resetModel() {
      if (this.modelType !== 'view') {
        console.log('重置表单')
        this.$refs['courseForm'].resetFields()
        this.courseForm = {
          name: '',
          studyType: [],
          cradlegroupId: '',
          techerId: '',
          uploadDate: ''
        }
      } else {
        this.$refs['viewForm'].resetFields()
        this.fileList = []
        this.viewForm = {
          status: ''
        }
        this.isShowRed = false
      }
      this.submitting = false
      this.modelShow = false
    },
    // sureSave() {
    //   this.$refs.upload.submit()
    //   console.log(this.files)
    //   if (this.files.length === 0) {
    //     this.saveFile()
    //   }
    // },
    saveFile() {
      const that = this
      console.log(this.$refs['viewForm'])
      this.$refs['viewForm'].validate(valid => {
        if (valid) {
          console.log(that.viewForm)
          setresult(that.viewForm).then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                message: '操作成功！',
                type: 'success'
              })
              that.resetModel()
              that.getList()
            } else {
              that.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
        }
      })
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
    beforeUpload(file, fileList) {
      console.log(file)
      const isLt5M = file.size / 1024 / 1024 < 5
      if (file.name.indexOf('.png') === -1 && file.name.indexOf('.jpg') === -1 && file.name.indexOf('.bmp') === -1 && file.name.indexOf('.doc') === -1 && file.name.indexOf('.docx') === -1 && file.name.indexOf('.ppt') === -1 && file.name.indexOf('.pdf') === -1 && file.name.indexOf('.zip') === -1 && file.name.indexOf('.rar') === -1 &&
          file.name.indexOf('.xls') === -1 && file.name.indexOf('.xlsx') === -1 && file.name.indexOf('.csv') === -1) {
        // this.$message.warning('文件格式必须是.png或.jpg或.bmp或.doc或.docx或.ppt或.pdf或.zip或.rar的后缀名！')
        this.$message.warning('文件格式不正确！')
        return false
      }
      if (!isLt5M) {
        this.$message.warning('文件最大只能为5MB!')
        return false
      }
    },
    handlePreview(file) {
      // 下载文件
      console.log(file)
      const url = process.env.FILE_API + file.url
      window.open(url)
      // 创建隐藏的可下载链接
      // var eleLink = document.createElement('a');
      // eleLink.download = file.url;
      // eleLink.style.display = 'none';
      // // 字符内容转变成blob地址
      // var blob = new Blob([url]);
      // console.log(blob)
      // eleLink.href = URL.createObjectURL(blob);
      // // 触发点击
      // document.body.appendChild(eleLink);
      // eleLink.click();
      // // 然后移除
      // document.body.removeChild(eleLink);
    },
    handleSuccess(res, file) {
      let list = {}
      if (res.code === 200 || res.code === '200') {
        list = [{
          name: file.name,
          url: res.data.data[0].pathname
        }]
        this.viewForm.file = JSON.stringify(list)
      }
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleRemove(file, fileList) {
      this.viewForm.file = ''
    },
    handleExceed(files, fileList) {
      this.$message.warning('当前限制选择 1 个文件，请删除后继续上传')
    }
  }
}

</script>
<style lang="less" scoped>
  .course_bg {
    position: absolute;
    width: 100%;
    top: 0;
    .course_info {
      padding: 20px 10px;
      background: #fff;
    }
  }

  .red_star {
      position: absolute;
      left: -66px;
      font-size: 13px;
      font-family: 'Arial Normal', 'Arial';
      color: #f56c6c;
  }

  .dialogModel {
    .modelForm {
      margin: 0 10px;

      .input_tips {
        font-size: 12px;
        color: #aeaeae;
        font-family: "微软雅黑 Regular", "微软雅黑";
      }
    }

    .center {
      margin: 0 70px;
    }
  }

</style>
