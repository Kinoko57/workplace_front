<template>
  <div>
    <div class="report_bg">
      <div class="fifter">
        <my-tabs
          :page-name="page_name"
          :module-name="module_name"
          :add="btnPermission('knowledge_create')"
          :active-name="searchInfo.mode"
          :tabs-list="tabsList"
          @addAction="addReport"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)"/>
          <!-- <search-fifter
          :add="btnPermission('knowledge_create')"
          :module-name="'knowledge'"
          :fifter="true"
          :delay-fifter="loading==false"
          :add-text="'创建内容'"
          @addAction="addReport"
          @search="fifterSearch" /> -->
      </div>
      <div class="report_info">
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}个记录，已选中{{ choseTotal }}条</span>
            <el-button v-if="btnPermission('knowledge_cancellations')" plain size="mini" @click="delSelectAll">批量作废</el-button>
          </div>
        </div>
        <el-table v-loading="loading" ref="multipleTable" :data="tableData" :max-height="tableHeight" border row-key="id" tooltip-effect="light" @selection-change="handleSelectionChange" @sort-change="fifterTable">
          <el-table-column type="selection" min-width="40" fixed="left" align="center"/>
          <el-table-column prop="title" label="标题" min-width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="category" label="分类" />
          <el-table-column prop="organizeName" label="所属部门" min-width="150" show-overflow-tooltip/>
          <el-table-column prop="publisher" label="发布人" min-width="100" />
          <el-table-column prop="browseNum" label="浏览次数" sortable="custom" min-width="100"/>
          <el-table-column prop="attachmentList" label="附件" width="200">
            <template slot-scope="scope">
              <div v-show="scope.row.attachment!=''">
                <a v-for="(item,index) of scope.row.attachmentList" :title="item.name" :href="fileUrl + item.url" :key="index" download="" target="_blank" class="file_a file file_a_overflow">{{ item.name }}</a>
              </div>
              <div v-show="scope.row.attachment==''"/>
            </template>
          </el-table-column>
          <el-table-column prop="publishDate" label="发布时间" min-width="140" show-overflow-tooltip/>
          <el-table-column prop="status" label="状态" width="80">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status==1" type="success">正常</el-tag>
              <el-tag v-if="scope.row.status==99" type="danger">删除</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('knowledge_view')" type="text" size="small" @click="showModel(scope.row,'view')">查看</el-button>
              <el-button v-if="btnPermission('knowledge_edit')" type="text" size="small" @click="showModel(scope.row,'edit')">编辑</el-button>
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
      <!-- <el-row>
        <el-col :span="8">
          <div style="margin-top: 10px">
            <el-button v-if="type == 1" @click="toggleSelection(tableData)">全选</el-button>
            <el-button v-if="type == 2" @click="setCurrent()">取消全选</el-button>
            <el-button v-if="btnPermission('knowledge_delall')" @click="delSelectAll()">批量删除</el-button>
          </div>
        </el-col>
      </el-row> -->
    </div>
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="modelShow" :title="modelTitle" :width="modelWidth" class="dialogModel" @close="resetModel">
      <el-scrollbar v-show="modelType!='view'&&modelShow" class="fixed_scroll over_scroll">
        <!-- 新建/编辑知识库 -->
        <el-form
          v-show="modelType!='view'&&modelShow"
          ref="reportForm"
          :model="reportForm"
          :rules="rules"
          class="modelForm"
          label-width="100px"
          label-position="right">
          <el-form-item label="标题：" prop="title">
            <el-input v-model.trim="reportForm.title" style="width:500px" placeholder="请输入内容标题" />
          </el-form-item>
          <el-form-item label="所属部门：" prop="organizeId" label-width="100px" class="checkDep">
            <el-select v-model="reportForm.organizeId" multiple filterable placeholder="请选择所属部门" style="width:500px" @change="choseDepList">
              <el-option
                v-for="item in depList"
                :key="item.id"
                :label="item.label"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="内容分类：" prop="category">
            <el-select v-model.trim="reportForm.category" placeholder="请选择内容分类" style="width:500px">
              <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="内容说明：" prop="content" class="rich_input">
            <el-input v-model.trim="reportForm.content" :rows="3" type="textarea" style="width:500px" placeholder="请输入内容说明,最多200字" />
          </el-form-item>
          <el-form-item label="排序：" prop="sort">
            <el-input-number v-model.trim="reportForm.sort" :min="1" size="large" controls-position="right" style="width:300px"/>
            <span class="tip">数值越大越靠前</span>
          </el-form-item>
          <el-form-item label="是否置顶：">
            <el-switch v-model="reportForm.stick" active-text="是" inactive-text="否" active-value="1" inactive-value="0"/>
          </el-form-item>
          <el-form-item label="附件：" prop="attachment">
            <el-upload
              ref="upload"
              :on-preview="handlePreview"
              :on-exceed="handleExceed"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :name="'files'"
              :file-list="fileList"
              :action="uploadUrl"
              :on-change="uploadChange"
              class="upload-demo"
              style="width:500px"
              multiple>
              <el-button size="mini" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请上传压缩包、word文档、excel文档、ppt演示文稿、pdf文档、图片文件</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <el-scrollbar v-show="modelType=='view'&&modelShow" class="fixed_scroll over_scroll">
        <h2>{{ viewForm.title }}</h2>
        <table class="view_dialog view_dialog_find" cellpadding="0" cellspacing="0">
          <tr class="view_line">
            <td class="line_title">内容分类</td>
            <td class="second_line">{{ viewForm.category }}</td>
            <td class="line_title" style="border-left: 1px solid #e4e4e4;">提交人</td>
            <td class="second_line">{{ viewForm.publisher }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">创建时间</td>
            <td class="second_line">{{ viewForm.publishDate }}</td>
            <td class="line_title" style="border-left: 1px solid #e4e4e4;">浏览次数</td>
            <td class="second_line">{{ viewForm.browseNum }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">所属部门</td>
            <td colspan="3" class="second_line" style="padding: 10px;">{{ viewForm.organizeName }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">说明</td>
            <td colspan="3" class="second_line">{{ viewForm.content }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">下载附件</td>
            <td colspan="3" class="second_line">
              <div v-if="viewForm.attachment !== '[]' && viewForm.attachment !== '' && viewForm.attachment != '[object Object]'" style="overflow:hidden">
                <span style="float:left"/><span style="float:left"><a v-for="(item,index) of attachment" :key="index" :href="fileUrl + item.url" :download="item.name" target="_blank" class="file_a file_a_long">{{ item.name }}</a></span>
              </div>
            </td>
          </tr>
        </table>
      </el-scrollbar>
      <div v-show="modelType!='view'" slot="footer" class="dialog-footer">
        <el-button v-if="modelType=='new'" @click="resetForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">{{ sureBtn }}</el-button>
      </div>
      <div v-show="modelType=='view'" slot="footer" class="dialog-footer">
        <el-button v-if="modelType=='view'" @click="goback">返回</el-button>
      </div>
      <!-- <div v-show="modelType=='view'" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modelShow=false">确 定</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>
<script>
import richText from '@/components/richText/richText'
import {
  knowledgeListInfo,
  creadeKnowledge,
  Editknowledge,
  viewknowledge,
  delSelect,
  knowledgeBasebatchCancel
} from '@/api/office'
  // import axios from 'axios'
// import {
//   getWefareThirdList
// } from '@/api/system'
import {
  getExecutiveOrg
} from '@/api/public'
export default {
  name: 'KnowledgeBase',
  components: {
    richText
  },
  data() {
    return {
      page_name: 'knowledge',
      module_name: 'oa',
      choseTotal: 0,
      tabsList: [
        { label: '全部', name: 'all' }
      ],
      filesArr: [],
      submitting: false,
      canCrop: false,
      uploadUrl: '',
      fileUrl: '',
      tableData: [],
      categoryList: [],
      depNameList: [],
      loading: true,
      modelType: '',
      modelTitle: '',
      modelShow: false,
      modelWidth: '600px',
      sureBtn: '确 定',
      attachment: [{ name: '', url: '' }],
      content: '',
      reportForm: {
        title: '',
        sort: 1,
        stick: 0,
        content: '',
        attachment: '',
        category: '',
        organizeId: []
      },
      viewForm: {

      },
      depList: [],
      fileList: [],
      category: [],
      files: [],
      multipleSelection: [],
      deleteSelectId: [],
      tableHeight: 250,
      type: 1,
      rules: {
        title: [{
          required: true,
          message: '内容标题不能为空',
          trigger: 'blur'
        }, {
          min: 6,
          max: 50,
          message: '标题长度在6-50位之间',
          trigger: 'blur'
        }],
        organizeId: [{
          required: true,
          message: '所属部门不能为空',
          trigger: 'change'
        }],
        category: [{
          required: true,
          message: '内容分类不能为空',
          trigger: 'change'
        }],
        content: [{
          required: true,
          message: '内容说明不能为空',
          trigger: 'blur'
        }, { min: 1, max: 200, message: '内容长度超出范围,长度在1-200之间', trigger: 'change' }],
        sort: [{
          required: true,
          message: '请输入排序值',
          trigger: 'blur'
        }],
        attachment: [{
          required: true,
          message: '附件不能为空',
          trigger: 'change'
        }]
      },
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
  watch: {
    depText(val) {
      if (this.modelShow) {
        this.$refs.deptree.filter(val)
      }
    }
  },
  mounted() {
    this.uploadUrl = process.env.BASE_API + 'sys/file-upload'
    this.fileUrl = process.env.FILE_API
    // 获取列表
    this.getList()
    this.getTableList()
    this.getDefault()
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  methods: {
    handleSelectionChange(val) {
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
    getList() {
      const that = this
      knowledgeListInfo(this.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          that.tableData = res.data.knowledges
          that.total = res.data.pager.recTotal // 总条数
          const obj = res.data.categoryList
          for (var i = 0; i < that.tableData.length; i++) {
            if (that.tableData[i].attachment.length !== '[]' && that.tableData[i].attachment !== '' && that.tableData[i].attachment !== '[object Object]') {
              that.tableData[i].attachmentList = JSON.parse(that.tableData[i].attachment)
            }
            if (that.tableData[i].organizeId !== '') {
              that.tableData[i].organizeId = that.tableData[i].organizeId.split(',')
            }
            for (const j in obj) {
              if (that.tableData[i].category === j) {
                that.tableData[i].category = obj[j]
              }
            }
          }
          const arr = []
          for (const i in obj) {
            arr.push({
              value: i, label: obj[i]
            })
          }
          that.categoryList = arr
          console.log(that.categoryList)
        }
      })
    },
    getDefault() {
      const that = this
      getExecutiveOrg().then(res => {
        if (res.code === 200 || res.code === '200') {
          const arr = res.data
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].label = res.data[i].pname + '-' + res.data[i].name
          }
          // that.formatDep(arr)
          arr.unshift({
            id: '0',
            label: '所有部门'
          })
          that.depList = arr
          console.log(that.depList)
        }
      })
    },
    choseDepList() {

    },
    goback() {
      this.getList()
      this.modelShow = false
    },
    getTableList() {
      // const buttonHeight = this.$refs.buttonH.offsetHeight
      // console.log(buttonHeight)
    },
    toggleSelection(rows) {
      if (this.tableData.length === 0) {
        this.$message({
          message: '没有可选择的内容了',
          type: 'warning'
        })
        return
      }
      this.type = 2
      console.log(rows, this.$refs.multipleTable)
      rows.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row, true)
      })
    },
    uploadChange(file, filelist) {
      console.log(filelist, 'ddd')
      if (filelist.length && filelist.length >= 1) {
        this.$refs.reportForm.validateField('attachment')
      }
    },
    setCurrent() {
      this.type = 1
      this.$refs.multipleTable.clearSelection()
    },
    delSelectAll() {
      const that = this
      // const selectId = []
      // for (var i = 0; i < this.multipleSelection.length; i++) {
      //   selectId.push(this.multipleSelection[i].id)
      // }
      // that.deleteSelectId = selectId.join(',')
      // const selectId2 = {
      //   ids: this.deleteSelectId
      // }
      if (that.selectArr.length > 0) {
        const selectId2 = {
          ids: this.selectArr.join(',')
        }
        if (selectId2.ids.length === 0 || selectId2.ids.length === '0') {
          this.$message({
            message: '请选择要批量作废的知识库',
            type: 'warning'
          })
          return
        }
        that.$confirm('知识库一旦批量作废不可恢复，确定要“作废”吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // delSelect(selectId2).then(res => {
          knowledgeBasebatchCancel(selectId2).then(res => {
            console.log(res, 11)
            if (res.code === 200 || res.code === '200') {
              that.$message({
                type: 'success',
                message: '操作成功'
              })
              that.$refs.multipleTable.clearSelection()
              this.getList()
              this.type = 1
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
      }
    },
    fifterSearch(event) {
      if (event) {
        this.searchInfo.search = 'bySearch'
        this.tableData = []
        this.loading = true
        this.searchInfo.pageID = 1
        this.type = 1
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
      this.modelTitle = '创建内容'
      this.modelType = 'new'
      this.modelShow = true
      this.sureBtn = '保 存'
      this.modelWidth = '600px'
    },
    getValue(e) {
      this.reportForm.content = e.html
    },
    choseType() {
      this.searchInfo.pageID = 1
      this.tableData = []
      this.loading = true
      this.getList()
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
    showModel(data, type) {
      // const that = this
      if (type === 'view') {
        this.modelTitle = '查看'
        this.modelWidth = '700px'
        // this.viewForm = data
        const that = this
        viewknowledge(data.id).then(res => {
          if (res.code === 200) {
            that.viewForm = res.data.knowledge
            if (that.viewForm.attachment !== '[]' && that.viewForm.attachment !== '' && that.viewForm.attachment !== '[object Object]') {
              that.attachment = JSON.parse(res.data.knowledge.attachment)
              console.log(that.attachment)
            }
          }
        })
      } else {
        this.modelWidth = '600px'
        this.reportForm = { ...data }
        console.log(data, 'fgfdg')
        console.log(this.reportForm, 'dsgfsdgfds')
        this.modelTitle = '编辑内容'
        if (this.reportForm.attachment === null || this.reportForm.attachment === '' || this.reportForm.attachment === '[object Object]') {
          this.fileList = []
          this.reportForm.attachment = ''
        } else {
          const file = this.reportForm.attachmentList
          this.fileList = file
          // this.reportForm.attachment = JSON.stringify(this.reportForm.attachment)
        }
      }
      this.modelType = type
      this.modelShow = true
    },
    handleSuccess(res, file, fileList) {
      if (res.code === 200 || res.code === '200') {
        this.filesArr = []
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].response === undefined) {
            this.filesArr.push({
              name: fileList[i].name,
              url: fileList[i].url
            })
          } else {
            this.filesArr.push({
              name: fileList[i].name,
              url: fileList[i].response.data.data[0].pathname
            })
          }
        }
        if (this.filesArr.length > 0) {
          this.reportForm.attachment = JSON.stringify(this.filesArr)
        }
      }
    },
    // handleSuccess(res, file) {
    //   // let list = {}
    //   if (res.code === 200 || res.code === '200') {
    //     this.filesArr.push({
    //       name: file.name,
    //       url: res.data.data[0].pathname
    //     })
    //     if (this.filesArr.length > 0) {
    //       this.reportForm.attachment = JSON.stringify(this.filesArr)
    //     }
    //     // list = [{
    //     //   name: file.name,
    //     //   url: res.data.data[0].pathname
    //     // }]
    //     // this.reportForm.file = JSON.stringify(list)
    //   }
    // },
    handleRemove(file, fileList) {
      console.log(fileList)
      this.filesArr = []
      if (fileList.length > 0) {
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].response === undefined) {
            this.filesArr.push({
              name: fileList[i].name,
              url: fileList[i].url
            })
          } else {
            this.filesArr.push({
              name: fileList[i].name,
              url: fileList[i].response.data.data[0].pathname
            })
          }
        }
        if (this.filesArr.length > 0) {
          this.reportForm.attachment = JSON.stringify(this.filesArr)
        }
      } else {
        this.reportForm.attachment = ''
      }
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    saveModel() {
      const that = this
      this.$refs['reportForm'].validate((valid) => {
        if (valid) {
          if (this.depNameList.length !== 0) {
            const ids = []
            for (let i = 0; i < this.depNameList.length; i++) {
              ids.push(this.depNameList[i].id)
            }
            // this.reportForm.organizeId = ids.join(',')
          }
          this.submitting = true
          if (that.reportForm.id === undefined) {
            console.log(this.reportForm)
            // 新增内容
            creadeKnowledge(this.reportForm).then(res => {
              that.submitting = false
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '内容添加成功！',
                  type: 'success'
                })
                that.resetModel()
                that.loading = true
              } else {
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
          } else {
            // 更新内容
            console.log(this.reportForm.category)
            for (var i = 0; i < this.categoryList.length; i++) {
              if (this.categoryList[i].label === this.reportForm.category) {
                this.reportForm.category = this.categoryList[i].value
                console.log(this.reportForm.category, 'czxdczv')
              }
            }
            console.log(this.reportForm, 'gf')
            // this.reportForm = (({ title, sort, category, content, stick, attachment, id }) => ({ title, sort, category, content, stick, attachment, id }))(this.reportForm)
            var info = {
              id: this.reportForm.id,
              title: this.reportForm.title,
              sort: this.reportForm.sort,
              stick: this.reportForm.stick,
              content: this.reportForm.content,
              attachment: this.reportForm.attachment,
              category: this.reportForm.category,
              organizeId: this.reportForm.organizeId
            }
            Editknowledge(info).then(res => {
              that.submitting = false
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '内容更新成功！',
                  type: 'success'
                })
                that.resetModel()
                that.loading = true
              } else {
                that.$message({
                  message: res.data.msg,
                  type: 'warning'
                })
              }
            })
          }
        }
      })
    },
    resetModel() {
      console.log('重置表单')
      this.$refs['reportForm'].resetFields()
      this.reportForm = {
        title: '',
        sort: 1,
        stick: 0,
        content: '',
        attachment: '',
        category: '',
        organizeId: []
      }
      this.content = ''
      this.modelShow = false
      this.fileList = []
      this.filesArr = []
      this.getList()
    },
    resetForm() {
      console.log('重置表单')
      this.$refs['reportForm'].resetFields()
      this.reportForm = {
        title: '',
        sort: 1,
        stick: 0,
        content: '',
        attachment: '',
        category: '',
        organizeId: []
      }
      this.content = ''
      this.fileList = []
    },
    beforeUpload(file, fileList) {
      console.log(file.name, 'jajaaj')
      if (file.name.indexOf('.png') === -1 && file.name.indexOf('.jpg') === -1 && file.name.indexOf('.bmp') === -1 && file.name.indexOf('.doc') === -1 && file.name.indexOf('.docx') === -1 && file.name.indexOf('.ppt') === -1 && file.name.indexOf('.pdf') === -1 && file.name.indexOf('.zip') === -1 && file.name.indexOf('.rar') === -1 &&
          file.name.indexOf('.xls') === -1 && file.name.indexOf('.xlsx') === -1 && file.name.indexOf('.csv') === -1) {
        // this.$message.warning('文件格式必须是.png或.jpg或.bmp或.doc或.docx或.ppt或.pdf或.zip或.rar的后缀名！')
        this.$message.warning('文件格式不正确！')
        return false
      }
      // if (file.size > 5 * 1024 * 1024) {
      //   this.$message.warning('文件大小不能超过5M！')
      //   return false
      // }
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning('当前限制选择 1 个文件，请删除后继续上传')
    }
  }
}

</script>
<style lang="less" scoped>
  .report_bg {

    position: absolute;
    width: 100%;
    top: 0;
    .search_btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .report_info {
      background: #fff;
      padding: 20px 10px;

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
          color: #409EFF;
          white-space: nowrap;
          width: 50px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }

    .report_page {
      text-align: center;
      padding: 10px 0;
    }
  }

  .dialogModel {
    .modelForm {
      margin: 0 10px;

      .checkDep {
        position: relative;

        .red_star {
          position: absolute;
          left: -90px;
          font-size: 13px;
          font-family: 'Arial Normal', 'Arial';
          color: #f56c6c;
        }
      }

      .fifter_down {
        position: relative;

        .chose_dep {
          background: transparent;
          border-color: #c0c4cc;
          border-radius: 4px;
          border: 1px solid #dcdfe6;
          height: 36px;
          line-height: 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
        }

        .tag_list {

          position: absolute;
          top: 0;
          left: 5px;
          width: 310px;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          height: 36px;
          line-height: 36px;

          span {
            margin-right: 5px;
          }
        }
      }

      .scroll_tree {
        .fifter_input {
          width: 400px;
          padding-top: 5px;
          padding-left: 5px;
          padding-bottom: 5px;
        }
      }
    }

    .model_layer {
      width: 100%;
      height: calc(100% - 60px);
      background: transparent;
      position: absolute;
      left: 0;
      top: 60px;
      z-index: 100;
    }

    // .view_report {
    //   padding: 20px 10px;
      h2 {
        text-align: center;
        margin: 20px 0;
        font-size: 14px;
        color: #666;
      }
    //   .view_line {
    //     overflow: hidden;
    //     padding: 10px 0;

    //     span {
    //       font-family: '微软雅黑 Regular', '微软雅黑';
    //       font-weight: 400;
    //       font-size: 14px;
    //       color: #999999;
    //       float: left;
    //       width: 460px;

    //     }

    //     .line_title {
    //       font-weight: 400;
    //       color: #666666;
    //       width: 80px;
    //     }

    //     .first_line {
    //       font-weight: 700;
    //       font-size: 16px;
    //       color: #999999;
    //     }

    //     .second_line {
    //       color: #000000;
    //     }

    //     .small_font {
    //       font-size: 12px;
    //     }
    //   }

    //   .view_dialog {
    //     border-collapse: collapse;
    //     margin: 0 auto;
    //     width: 100%;

    //     td {
    //       border: 1px solid #333333;
    //       padding: 10px 5px;
    //       text-align: center;
    //       min-width: 100px;

    //       a {
    //         color: #409eff;
    //         text-decoration: underline;
    //       }
    //     }
    //     .td_title{
    //         color: #333333;
    //         font-size: 13px;
    //         font-weight: 700;
    //         text-align: center;
    //     }
    //   }

    //   .center {
    //     margin: 0 70px;
    //   }

    //   .conversionHistory {

    //     .his_list {
    //       list-style: none;
    //     }
    //   }
    // }

    .tip{
      margin-left: 10px;
      color: #999999;
    }
  }

</style>
