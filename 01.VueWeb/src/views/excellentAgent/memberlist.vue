<template>
  <div>
    <div class="list_bg">
      <div class="fifter">
        <!-- <search-fifter
          :add="btnPermission('cradlegroupdmlist_cradlegroupmembercreate')"
          :fifter="true"
          :delay-fifter="loading==false"
          :import-show="btnPermission('cradlegroupdmlist_cradlegroupmemberimport')"
          :export-show="btnPermission('cradlegroupdmlist_cradlegroupmemberexport')"
          :add-text="'添加群员'"
          :upload-url="uploadUrl"
          :export-type="moduleType"
          :export-name="'群经销商列表'"
          :return-show="true"
          :download-url="downloadUrl"
          @search="fifterSearch"
          @addAction="addMember"
          @returnAction="returnPage"
          @importAction="importMember"/> -->
        <my-tabs
          :page-name="page_name"
          :module-name="module_name"
          :add="btnPermission('cradlegroupdmmember_create')"
          :return-show="true"
          :active-name="searchInfo.mode"
          :tabs-list="typeList"
          @addAction="addMember"
          @returnAction="returnPage"
          @handleClick="choseType"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)"/>
      </div>
      <div class="list_info">
        <!-- <el-tabs type="card" class="tabs_table" >
          <el-tab-pane label="全部群员" > -->
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}个记录，已选中{{ choseTotal }}条</span>
            <el-button v-if="btnPermission('cradlegroupdmmember_updatestatusall')" plain size="mini" @click="batchstop('remover')">批量移除</el-button>
          </div>
          <div class="export_btn">
            <search-fifter
              :import-show="btnPermission('cradlegroupdmmember_import')"
              :export-show="btnPermission('cradlegroupdmmember_export')"
              :upload-url="uploadUrl"
              :export-type="moduleType"
              :export-name="'群经销商列表'"
              :download-url="downloadUrl"
              @importAction="importMember"/>
          </div>
        </div>
        <el-table v-loading="loading" :data="tableData" :max-height="tableHeight" border row-key="id" tooltip-effect="light" @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" width="50" /> -->
          <el-table-column type="selection" min-width="40" fixed="left" align="center"/>
          <el-table-column label="编号" min-width="100" >
            <template slot-scope="scope">
              <span class="text_color">{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="经销商"  sortable prop="name"/> -->
          <el-table-column label="授权号" prop="auth_code" min-width="120"/>
          <el-table-column prop="name" label="姓名" min-width="200" >
            <template slot-scope="scope">
              <div style="display: inline-flex;">
                <span class="overline_one">{{ scope.row.name }}</span>
                <label-color v-if="scope.row.iconname!=''" :color="scope.row.iconcolor" :text="scope.row.iconname"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="联系电话" prop="phone" min-width="120"/>
          <el-table-column label="群员等级" prop="leavelname" min-width="100"/>
          <el-table-column prop="createdDate" label="创建时间" min-width="120"/>
          <el-table-column label="类型" prop="typeName" min-width="100"/>
          <el-table-column label="操作" width="200" min-width="100" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('cradlegroupdmmember_edit')" type="text" size="small" @click="editMember(scope.row)">修改等级</el-button>
              <el-button v-if="btnPermission('cradlegroupdmmember_updatestatus')" type="text" size="small" @click="changeStates(scope.row,'99')">移除</el-button>
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
      <!-- 新建/编辑经销商 -->
      <el-scrollbar class="fixed_scroll">
        <el-form
          v-if="modelShow"
          ref="listForm"
          :model="listForm"
          :rules="rules"
          class="modelForm center"
          label-width="140px"
          label-position="right">
          <el-form-item label="选择类型：" prop="type">
            <template>
              <el-radio v-model="listForm.type" :disabled="isChoseType" label="1" @change="choseType('1')">经销商</el-radio>
              <el-radio v-model="listForm.type" :disabled="isChoseType" label="2" @change="choseType('2')">公司员工</el-radio>
            </template>
          </el-form-item>
          <el-form-item label="选择经销商：" prop="agentId">
            <!-- <el-select v-model="listForm.agentId" :disabled="modelType=='edit'" filterable placeholder="请选择名称" style="width:500px" filterable>
              <el-option v-for="item in selectList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select> -->
            <el-select
              v-model="listForm.agentId"
              :disabled="modelType=='edit'"
              :remote-method="getSelectList"
              :loading="selectLoading"
              placeholder="请选择经销商姓名"
              style="width:500px"
              filterable
              remote
              clearable
              reserve-keyword
              @change="choseBussiness">
              <el-option v-for="item in selectList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="listForm.type==1" label="授权号：" prop="auth_code">
            <el-input v-model="listForm.auth_code" disabled autocomplete="off" style="width:500px" placeholder="请输入授权号"/>
          </el-form-item>
          <el-form-item label="群员等级：" prop="leavel">
            <el-select v-model="listForm.leavel" filterable placeholder="请选择群员等级" style="width:500px">
              <el-option v-for="item in optionsList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="modelType == 'new'" @click="restForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getcradlegroupmember,
  getagentlistinfo,
  getcradlegroupleavel,
  addcradlegroupmember,
  editcradlegroupmember,
  memberbatchCancel,
  updateStatus,
  getEmployeesListInfo
} from '@/api/excellentAgent'
import {
  getAgentListByName
} from '@/api/public'
export default {
  name: 'MemberListManage',
  data() {
    return {
      page_name: 'cradlegroupdmmember',
      module_name: 'olsdm',
      typeList: [{ label: '全部群员', name: 'all' }],
      choseTotal: 0,
      submitting: false,
      moduleType: '/olsdm/cradlegroupdmmember-export',
      studyId: '',
      uploadUrl: '',
      downloadUrl: '',
      loading: false,
      tableData: [],
      searchInfo: {
        mode: 'all', // 类型
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      total: 0, // 总条数
      listForm: {
        type: '1',
        agentId: '',
        leavel: ''
      },
      isChoseType: false,
      rules: {
        type: [{
          required: true,
          message: '请选择成员类型',
          trigger: 'change'
        }],
        agentId: [{
          required: true,
          message: '名称不能为空',
          trigger: 'change'
        }],
        leavel: [{
          required: true,
          message: '群员等级不能为空',
          trigger: 'change'
        }]
      },
      selectLoading: false,
      selectList: [],
      tableHeight: 250,
      optionsList: [],
      modelShow: false,
      modelTitle: '',
      selectArr: [],
      modelType: 'new'
    }
  },
  mounted() {
    console.log(this.$route)
    this.studyId = this.$route.query.id
    this.downloadUrl = process.env.BASE_API + 'data/download/群经销商模板2.xls'
    this.uploadUrl = process.env.BASE_API + 'olsdm/cradlegroupdmmember-import-' + this.studyId + '.json'
    this.getList()
  },
  methods: {
    batchstop(type) {
      const that = this
      if (that.selectArr.length > 0) {
        const obj = {
          ids: this.selectArr.join(',')
        }
        that.$confirm('成员一旦移除，不可以恢复,确定要批量“作废”吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          memberbatchCancel(obj).then(res => {
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
      const that = this
      this.submitting = false
      console.log('重置表单')
      this.$refs['listForm'].resetFields()
      this.listForm = {
        type: '1',
        agentId: '',
        leavel: ''
      }
      this.isChoseType = false
      getagentlistinfo().then(res => {
        if (res.code === 200) {
          that.selectList = res.data
        }
      })
    },
    getSelectList(query) {
      console.log(query)
      const that = this
      if (query != '') {
        this.selectLoading = true
        setTimeout(() => {
          this.selectLoading = false
          // 获取下拉框的经销商列表
          getAgentListByName(query).then(res => {
            if (res.code == 200) {
              // eslint-disable-next-line no-undef
              that.selectList = res.data
            }
          })
          // this.selectList = this.backList.filter(item => {
          //   return item.label.toLowerCase()
          //     .indexOf(query.toLowerCase()) > -1
          // })
        }, 500)
      } else {
        console.log('输入为空')
        getAgentListByName('').then(res => {
          if (res.code == 200) {
          // eslint-disable-next-line no-undef
            that.selectList = res.data
          }
        })
      }
    },
    choseBussiness(e) {
      if (e !== '') {
        console.log(this.selectList)
        console.log(e)
        let obj = {}
        for (let i = 0; i < this.selectList.length; i++) {
          if (e == this.selectList[i].id) {
            obj = this.selectList[i]
            break
          }
        }
        this.listForm.auth_code = obj.auth_code
      } else {
        this.listForm.auth_code = ''
      }
    },
    getList() {
      const that = this
      console.log(this.studyId)
      getcradlegroupmember(this.studyId, that.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          console.log(res)
          that.tableData = res.data.cradlegroupdmmember
          that.total = res.data.pager.recTotal// 总条数
        }
      })
      // 获取经销商列表
      getAgentListByName('').then(res => {
        if (res.code === 200) {
          that.selectList = res.data
        }
      })
      // 添加群员中公司员工对应选择名称的的列表
      getEmployeesListInfo().then(res => {
        if (res.code === 200) {
          console.log(res.data, '11')
          // that.selectList = res.data
        }
      })
      // 获取群员等级列表
      getcradlegroupleavel().then(res => {
        if (res.code === 200) {
          that.optionsList = res.data
        }
      })
    },
    choseType(typeNum) {
      console.log(typeNum)
      const that = this
      this.listForm.type = typeNum
      this.listForm.agentId = ''
      if (this.listForm.type === '1') {
      // 获取经销商列表
        getAgentListByName('').then(res => {
          if (res.code === 200) {
            that.selectList = res.data
          }
        })
      } else {
        getEmployeesListInfo().then(res => {
          if (res.code === 200) {
            console.log(res.data, '11')
            that.selectList = res.data
          }
        })
      }
    },
    addMember() {
      this.modelType = 'new'
      this.modelShow = true
      this.modelTitle = '新增群员'
      this.isChoseType = false
    },
    editMember(event) {
      this.modelType = 'edit'
      this.isChoseType = true
      const data = { ...event }
      console.log(data)
      this.listForm = {
        type: data.type,
        id: data.id,
        auth_code: data.auth_code,
        agentId: data.name,
        leavel: data.leavel
      }
      this.modelShow = true
      this.modelTitle = '编辑群员信息'
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
    importMember(event) {
      if (event) {
        this.getList()
      }
    },
    returnPage() {
      this.$router.back(-1)
    },
    changeStates(event, states) {
      const that = this
      const msg = '确定移除此群员吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatus(event.id, states).then(res => {
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
      // 保存经销商
      this.$refs['listForm'].validate((valid) => {
        if (valid) {
          that.submitting = true
          console.log(that.listForm)
          if (that.modelType === 'new') {
            // 新增
            addcradlegroupmember(that.studyId, that.listForm).then(res => {
              console.log(res, '00')
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: res.msg,
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
            editcradlegroupmember(that.listForm).then(res => {
              console.log(res)
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '群员更新成功！',
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
      this.submitting = false
      console.log('重置表单')
      this.$refs['listForm'].resetFields()
      this.listForm = {
        type: '1',
        agentId: '',
        leavel: ''
      }
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
  .list_bg {
    position: absolute;
    top: 0;
    width: 100%;
    // background: #fff;
    // padding: 0 10px;
    .list_info{
      padding: 20px 10px;
      background: #fff;
    }
    .list_page {
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
