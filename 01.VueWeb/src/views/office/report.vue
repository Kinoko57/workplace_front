<template>
  <div>
    <div class="report_bg">
      <div class="fifter">
        <my-tabs
          :page-name="page_name"
          :module-name="module_name"
          :add="btnPermission('notice_create')"
          :active-name="searchInfo.mode"
          :tabs-list="tabsList"
          @addAction="addReport"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)"/>
      </div>
      <div class="report_info">
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}个公告，已选中{{ choseTotal }}条</span>
            <el-button v-if="btnPermission('notice_cancellations')" plain size="mini" @click="batchstop('remover')">批量作废</el-button>
          </div>
          <div class="export_btn">
            <search-fifter
              :edit="btnPermission('docking_create')"
              :helpedit="btnPermission('document_create')"
              :module-name="'notice'"
              @helpAction="editHelpWord"
              @editAction="editTransaction"/>
          </div>
        </div>
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="tableData"
          :max-height="tableHeight"
          :default-sort = "{prop: 'id', order: 'descending'}"
          border
          row-key="id"
          tooltip-effect="light"
          @sort-change="fifterTable"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" min-width="40" fixed="left" align="center"/>
          <el-table-column prop="title" label="标题" show-overflow-tooltip min-width="150"/>
          <el-table-column prop="sort" label="排序" min-width="150" />
          <el-table-column prop="accountName" label="发布人" min-width="100" />
          <el-table-column prop="createdDate" label="发布时间" show-overflow-tooltip min-width="120" />
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('notice_view')" type="text" size="small" @click="showModel(scope.row,'view')">查看</el-button>
              <el-button v-if="btnPermission('notice_edit')" type="text" size="small" @click="showModel(scope.row,'edit')">编辑</el-button>
              <el-button v-if="btnPermission('notice_cancellation')" type="text" size="small" @click="changeStates(scope.row)">作废</el-button>
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
    <el-dialog
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :visible.sync="modelShow"
      :title="modelTitle"
      :class="{'modelPosition':modelType!='view'}"
      :ref="reportForm"
      width="860px"
      class="dialogModel "
      @close="resetModel">
      <div v-show="depTree" class="model_layer" @click="hiddenDepTree"/>
      <el-scrollbar class="fixed_scroll over_scroll">
        <!-- 新建/编辑提示 -->
        <el-form
          v-show="modelType!='view'&&modelShow"
          ref="reportForm"
          :model="reportForm"
          :rules="rules"
          class="modelForm"
          label-width="100px"
          label-position="right">
          <el-form-item label="标题：" prop="title">
            <el-input v-model.trim="reportForm.title" style="width:500px" placeholder="请输入公告标题"/>
          </el-form-item>
          <el-form-item label="所属部门：" class="checkDep" prop="organizeId">
            <!-- <el-cascader
              ref="orgLabel"
              :options="orgList"
              v-model="reportForm.organizeIds"
              :props="defaultNode"
              :show-all-levels="false"
              :change-on-select="false"
              style="width:500px"
              placeholder="请选择所属部门"
              filterable
            /> -->
            <el-select v-model="reportForm.organizeId" multiple filterable placeholder="请选择所属部门" style="width:500px">
              <el-option
                v-for="(select,index) in orgList"
                :label="select.label"
                :value="select.id"
                :key="index"
              />
            </el-select>
          </el-form-item>
            <!-- <i class="red_star">*</i> -->
            <!-- <div class="fifter_tree" style="width:500px">
              <div class="fifter_down">
                <el-input id="focusInput" :placeholder="inputName" class="chose_dep" readonly @focus="showDepTree">
                  <i v-show="!depTree" slot="suffix" class="el-input__icon el-icon-arrow-down" @click="showDepTree" />
                  <i v-show="depTree" slot="suffix" class="el-input__icon el-icon-arrow-up" @click="depTree=false" />
                </el-input>
                <div v-show="depNameList.length>0" class="tag_list">
                  <el-tag v-for="(item,index) in depNameList" v-show="index<3" :key="index" closable @close="handleClose(item,index)">{{
                  item.name }}</el-tag>
                  <span v-show="depNameList.length>3">...</span>
                </div>
                <div :class="{'layer_hidden':depTree}" class="tag_list_layer" @click="showDepTree"/>
              </div>
              <transition name="slide-fade">
                <div v-show="depTree" class="scroll_tree" style="width:500px">
                  <el-input v-model="depText" placeholder="模糊查询部门" class="fifter_input" style="width:360px" @focus="showDepTree" />
                  <div class="fifter_up dep_tree dep_tree_fifter">
                    <el-tree
                      ref="deptree"
                      :data="depList"
                      :props="defaultProps"
                      :filter-node-method="filterDepNode"
                      :expand-on-click-node="false"
                      :highlight-current="false"
                      show-checkbox
                      node-key="id"
                      default-expand-all
                      class="filter-tree"
                      @check="choseDep" />
                  </div>
                </div>
              </transition>
            </div> -->
          <!-- </el-form-item> -->
          <el-form-item label="排序：" prop="sort">
            <el-input-number v-model="reportForm.sort" :min="1" size="large" controls-position="right" style="width:400px"/>
            <span class="tip">数值越大越靠前</span>
          </el-form-item>
          <el-form-item label="是否置顶：">
            <el-switch v-model="reportForm.isTop" active-text="是" inactive-text="否" active-value="1" inactive-value="0"/>
          </el-form-item>
          <el-form-item label="内容：" prop="content" class="rich_input">
            <my-Editor v-if="modelShow" ref="myQuillEditor" :items="editorConfig" :content="reportForm.content" style="width:500px" height="400" @on-content-change="getValue"/>
          </el-form-item>
          <el-form-item label="上传附件：">
            <el-upload
              ref="upload"
              :on-preview="handlePreview"
              :on-exceed="handleExceed"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :name="'files'"
              :file-list="fileList"
              :action="uploadUrl1"
              class="upload-demo"
              style="width:500px"
              multiple>
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请上传压缩包、word文档、excel文档、ppt演示文稿、pdf文档、图片文件</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <table v-show="modelType=='view'" class="view_dialog view_dialog_find" cellpadding="0" cellspacing="0">
          <tr class="view_line">
            <td class="line_title">标题：</td>
            <td class="second_line">{{ viewForm.title }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">发布人：</td>
            <td class="second_line">{{ viewForm.createdBy }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">发布时间：</td>
            <td class="second_line">{{ viewForm.createdDate }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">公告内容：</td>
            <td class="rich_show ql-snow second_line" v-html="viewForm.content">{{ viewForm.content }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">所属部门：</td>
            <td class="second_line">{{ viewForm.organizeName }}</td>
          </tr>
          <tr v-if="viewForm.file.length>0" class="view_line">
            <td class="line_title">附件：</td>
            <td class="download_style second_line">
              <a v-for="(item,index) in viewForm.file" v-if="viewForm.file.length>0&&viewForm.file[0].name!=''" :key="index" :href="pathUrl + item.url" download="" target="_blank" class="file_a file_a_long">{{ item.name }}</a>
              <span v-else style="color:#999">暂无数据</span>
            </td>
          </tr>
        </table>
      </el-scrollbar>
      <div v-show="modelType!='view'" slot="footer" class="dialog-footer">
        <el-button v-if="modelType=='new'" @click="resetForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">{{ sureBtn }}</el-button>
      </div>
      <div v-show="modelType=='view'" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modelShow=false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import myEditor from '@/components/myEditor/index'
import {
  getReportInfo,
  banReport,
  saveReport,
  updateReport,
  viewReport,
  reportbatchCancel
} from '@/api/office'
// import {
//   getOrgList
// } from '@/api/system'
import {
  getExecutiveOrg
} from '@/api/public'
  // import axios from 'axios'
export default {
  name: 'ReportManage',
  components: {
    myEditor
  },
  data() {
    return {
      page_name: 'notice',
      module_name: 'oa',
      choseTotal: 0,
      pathUrl: process.env.FILE_API,
      canCrop: false,
      uploadUrl: '',
      uploadUrl1: '',
      inputName: '请选择所属部门，不选则通知整个集团',
      tableData: [],
      orgList: [{
        id: '',
        name: ''
      }], // 组织架构列表
      loading: true,
      modelType: '',
      modelTitle: '',
      modelShow: false,
      defaultNode: {
        value: 'id',
        label: 'name',
        children: 'children',
        multiple: true
        // checkStrictly: true
      },
      sureBtn: '确 定',
      content: '',
      tableHeight: 250,
      reportForm: {
        title: '',
        sort: 1,
        isTop: 0,
        content: '',
        file: '',
        organizeId: []
      },
      viewForm: {
        file: [{ name: '', url: '' }]
      },
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      depList: [],
      depTree: false,
      depText: '',
      depIdList: [],
      depNameList: [],
      depId: 0,
      fileList: [],
      files: [],
      depIdList2: [],
      filesArr: [],
      selectArr: [],
      rules: {
        title: [{
          required: true,
          message: '公告标题不能为空',
          trigger: 'blur'
        }, {
          min: 6,
          max: 50,
          message: '公告标题长度在6-50位之间',
          trigger: 'blur'
        }],
        content: [{
          required: true,
          message: '公告内容不能为空',
          trigger: 'change'
        }],
        sort: [{
          required: true,
          message: '请输入排序值',
          trigger: 'blur'
        }],
        organizeId: [{
          required: true,
          message: '请选择所属部门',
          trigger: 'change'
        }]
      },
      tabsList: [
        { label: '全部公告', name: 'all' }
      ],
      searchInfo: {
        mode: 'all', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
        search: '', // 搜索关键字
        orderBy: 'id_desc', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      num: 1,
      editorConfig: [
        'undo', 'redo', '|',
        '|', 'formatblock', 'fontname', 'fontsize', '|',
        'justifyleft', 'justifycenter', 'justifyright',
        'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', '|', 'forecolor',
        'hilitecolor', 'bold',
        'italic', 'underline', 'lineheight', 'removeformat', '|', 'image', 'table', 'hr', 'pagebreak'
      ],
      submitting: false,
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
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  mounted() {
    this.uploadUrl = process.env.BASE_API + 'sys/file-upload'
    this.uploadUrl1 = process.env.BASE_API + 'sys/file-upload'
    // 获取列表
    this.getList()
    this.getDefault()
  },
  methods: {
    batchstop() {
      const that = this
      console.log('askldjslkdf')
      if (that.selectArr.length > 0) {
        const obj = {
          ids: this.selectArr.join(',')
        }
        const msg = '公告一旦作废不可恢复，确定要批量“作废”吗？'
        that.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          reportbatchCancel(obj).then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                type: 'success',
                message: '操作成功'
              })
              that.getList()
              that.selectArr = []
              that.$refs.multipleTable.clearSelection()
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
    getList() {
      const that = this
      getReportInfo(this.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          that.tableData = res.data.notices
          that.total = res.data.pager.recTotal // 总条数
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
          that.orgList = arr
          console.log(that.orgList, 'laskjflasfaslfk')
        }
      })
      // getDepChoseList().then(res => {
      //   if (res.code === 200 || res.code === '200') {
      //     that.depList = JSON.parse(JSON.stringify(res.data.organize))
      //   }
      // })
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
      console.log(this.content)
      this.modelTitle = '创建公告'
      this.modelType = 'new'
      this.modelShow = true
      this.sureBtn = '保 存'
    },
    editHelpWord() {
      this.$router.push({
        path: '/office/editHelpWord'
      })
    },
    editTransaction() {
      this.$router.push({
        path: '/office/editTransaction'
      })
    },
    getValue(e) {
      console.log(e, 'fdsfartgtr')
      // this.reportForm.content = e.replace(/(^&nbsp;)|(&nbsp;$)/g, '')
      this.reportForm.content = e
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
    changeStates(event) {
      const that = this
      const msg = '公告一旦作废不可恢复，确定要“作废”吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        banReport(event.id).then(res => {
          if (res.code === 200 || res.code === '200') {
            that.$message({
              type: 'success',
              message: res.data.message
            })
            this.modelShow = false
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
    showModel(data, type) {
      // const that = this
      if (type === 'view') {
        this.modelTitle = '查看'
        // this.viewForm = data
        const that = this
        viewReport(data.id).then(res => {
          if (res.code === 200) {
            that.viewForm = res.data.notice
            if (that.viewForm.file !== '') {
              that.viewForm.file = JSON.parse(that.viewForm.file)
            } else {
              that.viewForm.file = [{ name: '', url: '' }]
            }
            this.modelType = type
            this.modelShow = true
          }
        })
      } else {
        data = {
          ...data
        }
        // console.log(data.organizeIds)
        // const arr = []
        this.reportForm = {
          id: data.id,
          sort: data.sort,
          isTop: data.isTop,
          title: data.title,
          content: data.content,
          file: data.file,
          organizeId: data.organizeId.split(',')
        }
        this.content = data.content
        if (this.reportForm.file !== undefined && this.reportForm.file !== '') {
          this.fileList = JSON.parse(this.reportForm.file)
        }
        // this.depIdList = []
        // this.depNameList = []
        // if (data.organizeId !== '' && (data.organizeId !== 0 && data.organizeId !== '0')) {
        //   const ids = data.organizeId.split(',')
        //   const names = data.organizeName.split(',')
        //   for (let i = 0; i < ids.length; i++) {
        //     this.depIdList[i] = parseInt(ids[i])
        //     this.depNameList.push({
        //       id: ids[i],
        //       name: names[i]
        //     })
        //   }
        //   this.inputName = ''
        // }
        this.modelTitle = '编辑公告'
        this.modelType = type
        this.modelShow = true
      }
    },
    // sureSave() {
    //   this.$refs.upload.submit()
    //   if (this.files.length === 0) {
    //     this.saveModel()
    //   }
    // },
    handleSuccess(res, file, fileList) {
      console.log(res)
      console.log(file)
      console.log(fileList)
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
      }
    },
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
      } else {
        this.reportForm.file = ''
      }
      console.log(this.filesArr)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    saveModel() {
      const that = this
      console.log(this.reportForm)
      this.$refs['reportForm'].validate((valid) => {
        if (valid) {
          // const arr = []
          // for (let i = 0; i < this.reportForm.organizeIds.length; i++) {
          //   arr.push(this.reportForm.organizeIds[i][this.reportForm.organizeIds[i].length - 1])
          // }
          // this.reportForm.organizeId = arr.join(',')
          // this.reportForm.organizeIds = JSON.stringify(this.reportForm.organizeIds)
          this.submitting = true
          if (this.filesArr.length > 0) {
            this.reportForm.file = JSON.stringify(this.filesArr)
          }
          if (this.modelType === 'new') {
            // 新增公告
            const info = {
              title: this.reportForm.title,
              sort: this.reportForm.sort,
              isTop: this.reportForm.isTop,
              content: this.reportForm.content,
              file: this.reportForm.file,
              organizeId: this.reportForm.organizeId
            }
            console.log(info)
            saveReport(info).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '公告添加成功！',
                  type: 'success'
                })
                that.resetModel()
                that.loading = true
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
            const info = {
              id: this.reportForm.id,
              title: this.reportForm.title,
              sort: this.reportForm.sort,
              isTop: this.reportForm.isTop,
              content: this.reportForm.content,
              file: this.reportForm.file,
              organizeId: this.reportForm.organizeId
            }
            // 更新公告
            updateReport(info).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '公告更新成功！',
                  type: 'success'
                })
                that.resetModel()
                that.loading = true
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
      console.log('重置表单')
      this.$refs['reportForm'].resetFields()
      this.reportForm = {
        title: '',
        sort: 1,
        isTop: 0,
        content: '',
        file: '',
        organizeId: []
      }
      this.$nextTick(() => {
        this.$refs.reportForm.clearValidate()
      })
      // this.$nextTick(function() {
      //   this.$refs.deptree.setCheckedKeys([])
      // })
      // this.depIdList2 = []
      this.content = ''
      this.modelShow = false
      this.depNameList = []
      this.fileList = []
      this.filesArr = []
      this.submitting = false
      this.depTree = false
      if (this.modelType === 'view') {
        this.viewForm = []
        this.viewForm.file = [{ name: '', url: '' }]
      }
    },
    resetForm() {
      console.log('重置表单')
      this.$refs['reportForm'].resetFields()
      this.reportForm = {
        title: '',
        sort: 1,
        isTop: 0,
        content: '',
        file: '',
        organizeId: []
      }
      // this.depIdList2 = []
      // this.$nextTick(function() {
      //   this.$refs.deptree.setCheckedKeys([])
      // })
      this.$nextTick(() => {
        this.$refs.reportForm.clearValidate()
      })
      this.content = ''
      // this.modelShow = false
      this.depNameList = []
      this.fileList = []
      this.filesArr = []
      this.submitting = false
      this.depTree = false
    },
    beforeUpload(file, fileList) {
      console.log(file)
      if (file.name.indexOf('.png') === -1 && file.name.indexOf('.jpg') === -1 && file.name.indexOf('.bmp') === -1 && file.name.indexOf('.doc') === -1 && file.name.indexOf('.docx') === -1 && file.name.indexOf('.ppt') === -1 && file.name.indexOf('.pdf') === -1 && file.name.indexOf('.zip') === -1 && file.name.indexOf('.rar') === -1 &&
          file.name.indexOf('.xls') === -1 && file.name.indexOf('.xlsx') === -1 && file.name.indexOf('.csv') === -1) {
        // this.$message.warning('文件格式必须是.png或.jpg或.bmp或.doc或.docx或.ppt或.pdf或.zip或.rar的后缀名！')
        this.$message.warning('文件格式不正确！')
        return false
      }
      // if (file.size > 5 * 1024 * 1024) {
      //   this.$message.warning('上传文件大小不能超过 5MB!')
      //   return false
      // }
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning('当前限制选择 1 个文件，请删除后继续上传')
    },
    // 过滤
    filterDepNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 显示部门列表
    showDepTree() {
      const that = this
      this.depTree = true
      if (this.type === 'edit') {
        console.log(this.depIdList, '2')
        this.$nextTick(function() {
          that.$refs.deptree.setCheckedKeys(that.depIdList)
        })
      } else if (this.type === 'new') {
        console.log(this.depIdList2, '2')
        this.$nextTick(function() {
          that.$refs.deptree.setCheckedKeys(that.depIdList2)
        })
      }
    },
    // 隐藏部门列表
    hiddenDepTree() {
      this.depTree = false
    },
    // 选择部门
    choseDep() {
      const ids = []
      // document.getElementById('focusInput').focus()
      const choseDepList = this.$refs.deptree.getCheckedNodes()
      this.depNameList = []
      for (let i = 0; i < choseDepList.length; i++) {
        this.depNameList.push({
          id: choseDepList[i].id,
          name: choseDepList[i].name
        })
        ids.push(choseDepList[i].id)
      }
      if (this.depNameList.length > 0) {
        this.inputName = ''
      } else {
        this.inputName = '请选择所属部门，不选则通知整个集团'
      }
      this.$nextTick(function() {
        this.$refs.deptree.setCheckedKeys(ids)
      })
      this.depTree = true
      this.depText = ''
      this.depIdList2 = []
      this.depIdList2 = ids
      console.log(this.depIdList2, '3')
    },
    handleClose(item, index) {
      this.depNameList.splice(index, 1)
      const ids = []
      for (let i = 0; i < this.depNameList.length; i++) {
        ids.push(this.depNameList[i].id)
      }
      this.$refs.deptree.setCheckedKeys(ids)
      if (this.depNameList.length > 0) {
        this.inputName = ''
      } else {
        this.inputName = '请选择所属部门，不选则通知整个集团'
      }
    }
  }
}

</script>
<style lang="less" scoped>
  .report_bg {
    position: absolute;
    width: 100%;
    top: 0;
    // .search_btn {
    //   display: flex;
    //   align-items: center;
    //   justify-content: space-between;
    // }
    .rich_show{
      color: #000000;
      width: 100%;
      p{
        margin:0;
      }
    }
    .report_info {
      background: #fff;
      padding: 20px 10px;
      .tabs_table {
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

    .report_page {
      text-align: center;
      padding: 10px 0;
    }
  }

  .dialogModel {
    .modelForm {
      // margin: 0 10px;

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
          // border-color: #c0c4cc;
          // border-radius: 4px;
          // border: 1px solid #dcdfe6;
          // height: 36px;
          // line-height: 36px;
          // display: flex;
          // align-items: center;
          // justify-content: space-between;
          // padding: 0 10px;
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
          z-index: 101;

          span {
            margin-right: 5px;
          }
        }
        .tag_list_layer{
          position: absolute;
          top: 0;
          left: 5px;
          max-width: 100%;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          height: 36px;
          line-height: 36px;
          z-index: 100;
        }
        .layer_hidden{
          display: none;
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

    .center {
      margin: 0 70px;
    }

    .conversionHistory {

      .his_list {
        list-style: none;
      }
    }

    .tip{
      margin-left: 10px;
      color: #999999;
    }
  }

</style>
