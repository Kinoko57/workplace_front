<template>
  <div>
    <div class="group_bg">
      <div class="fifter">
        <!-- <search-fifter
          :add="btnPermission('cradlegroupdm_create')"
          :download-url="downloadUrl"
          :module-name="'cradlegroupdm'"
          :upload-url="uploadUrl"
          :fifter="true"
          :delay-fifter="loading==false"
          :add-text="'创建优秀经销商群'"
          :import-show="btnPermission('cradlegroupdm_import')"
          :export-show="btnPermission('cradlegroupdm_export')"
          :export-type="moduleType"
          :export-name="'优秀经销商列表'"
          @addAction="addCradlegroup"
          @importAction="importAction"
          @search="fifterSearch" /> -->
        <my-tabs
          :page-name="page_name"
          :module-name="module_name"
          :add="btnPermission('cradlegroupdm_create')"
          :active-name="searchInfo.mode"
          :tabs-list="typeList"
          :fifter-open="false"
          @addAction="addCradlegroup"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)"/>
      </div>
      <div class="group_info">
        <!-- <el-tabs type="card" class="tabs_table" >
          <el-tab-pane label="全部群组" > -->
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}条数据，已选中{{ choseTotal }}条</span>
            <el-button v-if="btnPermission('cradlegroupdm_cancellations')" plain size="mini" @click="batchstop('remover')">批量作废</el-button>
          </div>
          <div class="export_btn">
            <search-fifter
              :download-url="downloadUrl"
              :module-name="'cradlegroupdm'"
              :upload-url="uploadUrl"
              :import-show="btnPermission('cradlegroupdm_import')"
              :export-show="btnPermission('cradlegroupdm_export')"
              :export-type="moduleType"
              :export-name="'优秀经销商群列表'"
              @importAction="importAction"/>
          </div>
        </div>
        <el-table v-loading="loading" ref="tabel" :data="tableData" :max-height="tableHeight" border row-key="id" tooltip-effect="light" @selection-change="handleSelectionChange" @sort-change="fifterTable">
          <el-table-column type="selection" min-width="40" fixed="left" align="center"/>
          <el-table-column label="群组名称" prop="name" show-overflow-tooltip min-width="120"/>
          <el-table-column label="工号" prop="job" show-overflow-tooltip min-width="200"/>
          <el-table-column label="手机号" prop="phone" show-overflow-tooltip min-width="200"/>
          <el-table-column label="微信号" prop="wechat" show-overflow-tooltip min-width="200"/>
          <el-table-column prop="createdDate" label="创建时间" show-overflow-tooltip min-width="100"/>
          <el-table-column label="操作" min-width="200" align="center">
            <template slot-scope="scope" min-width="100">
              <el-button v-if="btnPermission('cradlegroupdm_edit')" type="text" size="small" @click="editCradlegroup(scope.row)">编辑</el-button>
              <el-button v-if="btnPermission('cradlegroupdm_cancellation')" type="text" size="small" @click="changeStates(scope.row,'99')">作废</el-button>
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
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="modelShow" :title="modelTitle" width="600px" class="dialogModel" @close="resetModel">
      <!-- 新建标签 -->
      <el-scrollbar class="fixed_scroll">
        <el-form
          v-if="modelShow"
          ref="groupForm"
          :model="groupForm"
          :rules="rules"
          class="modelForm center"
          label-width="100px"
          label-position="right">
          <el-form-item label="群组名称：" prop="name">
            <el-input v-model.trim="groupForm.name" autocomplete="off" style="width:500px" placeholder="请输入群组名称"/>
          </el-form-item>
          <el-form-item label="工号：" prop="job">
            <el-input v-model.trim="groupForm.job" autocomplete="off" style="width:500px" placeholder="请输入工号" />
          </el-form-item>
          <el-form-item label="手机号：" prop="phone">
            <el-input v-model.trim="groupForm.phone" autocomplete="off" style="width:500px" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="微信号：" prop="wechat">
            <el-input v-model.trim="groupForm.wechat" autocomplete="off" style="width:500px" placeholder="请输入微信号" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="modelType === 'new'" @click="restForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getCradlegroupInfo,
  addCradlegroupInfo,
  cradbatchCancel,
  updateCradlegroupInfo,
  changeCradlegroupInfo
} from '@/api/excellentAgent'
// import { getAreaList } from '@/api/public'
export default {
  name: 'CradleGroupManage',
  data() {
    return {
      page_name: 'cradlegroupdm',
      module_name: 'olsdm',
      choseTotal: 0,
      typeList: [{ label: '全部经销商群', name: 'all' }],
      submitting: false,
      loading: true,
      uploadUrl: '',
      downloadUrl: '',
      modelType: '',
      moduleType: '/olsdm/cradlegroupdm-export',
      tableData: [],
      searchInfo: {
        mode: 'all', // 类型
        search: '', // 搜索关键字
        orderBy: 'id_desc', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      total: 0, // 总条数
      groupForm: {
        name: '',
        job: '',
        phone: '',
        wechat: ''
      },
      tableHeight: 250,
      rules: {
        name: [{
          required: true,
          message: '群组名称不能为空',
          trigger: 'blur'
        }, {
          min: 1, max: 20, message: '群组名称长度在1-20位', trigger: 'blur'
        }],
        job: [{
          required: true,
          message: '工号不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^([-_a-zA-Z0-9]{2,8})$/,
          message: '工号包含下划线，字母和数字,长度在2到8个字符',
          trigger: 'blur'
        }],
        wechat: [{
          required: true,
          message: '微信号不能为空',
          trigger: 'blur'
        }],
        phone: [{
          required: true,
          message: '手机号不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^[1][0-9]{10}$/,
          message: '手机号格式错误',
          trigger: 'blur'
        }]
      },
      modelShow: false,
      selectArr: [],
      modelTitle: ''
    }
  },
  mounted() {
    this.uploadUrl = process.env.BASE_API + 'olsdm/cradlegroupdm-import.json'
    this.downloadUrl = process.env.BASE_API + 'data/download/优秀经销商群模板.xls'
    this.getList()
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
        that.$confirm('摇篮群一旦作废，不可以恢复,确定要批量“作废”吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          cradbatchCancel(obj).then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                type: 'success',
                message: '操作成功'
              })
              that.getList()
              that.selectArr = []
              that.$refs.tabel.clearSelection()
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
      this.$refs['groupForm'].resetFields()
      this.groupForm = {
        name: '',
        job: '',
        phone: '',
        wechat: ''
      }
    },
    importAction() {
      if (event) {
        this.getList()
      }
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
      getCradlegroupInfo(that.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          // console.log(res)
          that.tableData = res.data.cradlegroupdm
          that.total = res.data.pager.recTotal// 总条数
        }
      })
    },
    addCradlegroup() {
      this.modelShow = true
      this.modelType = 'new'
      this.modelTitle = '新增优秀经销商群'
    },
    editCradlegroup(event) {
      const data = { ...event }
      this.groupForm = {
        id: data.id,
        name: data.name,
        job: data.job,
        phone: data.phone,
        wechat: data.wechat
      }
      this.modelType = 'edit'
      this.modelShow = true
      this.modelTitle = '编辑优秀经销商群'
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
    changeStates(event, states) {
      const that = this
      const msg = '确定作废此优秀经销商群吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeCradlegroupInfo(event.id, states).then(res => {
          console.log(res)
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
              message: res.data.msg
            })
          }
        })
      }).catch(() => {
        console.log('用户点击了取消')
      })
    },
    saveModel() {
      const that = this
      // 保存优秀经销商群
      this.$refs['groupForm'].validate((valid) => {
        if (valid) {
          // console.log(this.groupForm)
          that.submitting = true
          console.log(that.groupForm.id)
          if (this.groupForm.phone == '' && this.groupForm.wechat == '') {
            that.$message({
              message: '手机号和微信号必须填一个',
              type: 'warning'
            })
          } else {
            if (that.groupForm.id === undefined) {
            // 新增
              addCradlegroupInfo(that.groupForm).then(res => {
              // console.log(res)
                if (res.code === 200 || res.code === '200') {
                  that.$message({
                    message: '优秀经销商群添加成功！',
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
              updateCradlegroupInfo(that.groupForm).then(res => {
                console.log(res)
                if (res.code === 200 || res.code === '200') {
                  that.$message({
                    message: '优秀经销商群更新成功！',
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
      // console.log('重置表单')
      this.submitting = false
      this.$refs['groupForm'].resetFields()
      this.groupForm = {}
      this.modelShow = false
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
    }
  }
}

</script>
<style lang="less" scoped>
  .group_bg {
    position: absolute;
    width: 100%;
    top: 0;
    .group_info{
      background: #fff;
      padding: 20px 10px;
    }
    // .group_info{
    //   .text_color{
    //     color: #409EFF;
    //   }
    // }
    .group_page {
      text-align: center;
      padding: 10px 0;
    }
  }
    .dialogModel {
    .modelForm {
      margin: 0 10px;
      .input_tips{
        font-size: 12px;
        color: #AEAEAE;
        font-family: '微软雅黑 Regular', '微软雅黑';
      }
    }
    .center{
      margin:0 70px;
    }
  }

</style>
