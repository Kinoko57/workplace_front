<template>
  <div>
    <div class="proxy_bg">
      <div class="fifter">

        <!-- <search-fifter
          :add="btnPermission('offlinestudy_offlinestudymembercreate')"
          :module-name="'offlinestudymember'"
          :fifter="true"
          :delay-fifter="loading==false"
          :other="btnPermission('offlinestudy_offlinestudymemberrecordingreate')"
          :import-show="btnPermission('offlinestudy_offlinestudymemberimport')"
          :export-show="btnPermission('offlinestudy_offlinestudymemberexport')"
          :add-text="'创建经销商'"
          :other-text="'补录经销商'"
          :upload-url="uploadUrl"
          :download-url="downloadUrl"
          :export-type="moduleType"
          :export-name="'邀约经销商列表'"
          :return-show="true"
          @addAction="addProxy"
          @returnAction="returnPage"
          @actionClick="supplementProxy"
          @search="fifterSearch"
          @importAction="importProxy"/> -->
        <my-tabs
          :page-name="page_name"
          :module-name="module_name"
          :add="btnPermission('offlinestudymember_create')"
          :active-name="searchInfo.mode"
          :tabs-list="tabsList"
          :supplement="btnPermission('offlinestudymember_recordingcreate')"
          :supp-text="'补录'"
          :add-text="'邀约'"
          :return-show="true"
          @supplementAction="supplementProxy"
          @returnAction="returnPage"
          @addAction="addProxy"
          @handleClick="choseType"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)"/>
      </div>
      <div class="proxy_info">
        <div class="info_total">
          <div class="data_total">
            <span class="total_text">共{{ total }}条内容，已选中{{ choseTotal }}条</span>
            <el-button v-if="btnPermission('offlinestudymember_batchcancellation')" plain size="mini" @click="batchstop('remover')">批量作废</el-button>
            <!-- <el-button plain size="mini">导出选中</el-button> -->
          </div>
          <div class="export_btn">
            <search-fifter
              :upload-url="uploadUrl"
              :download-url="downloadUrl"
              :import-show="btnPermission('offlinestudymember_import')"
              :export-show="btnPermission('offlinestudymember_export')"
              :export-type="moduleType"
              :export-name="'邀约经销商列表'"
              :module-name="'offlinestudymember'"
              @importAction="importProxy"/>
          </div>
        </div>
        <el-table
          v-loading="loading"
          ref="tabel"
          :data="tableData"
          :max-height="tableHeight"
          border
          row-key="id"
          style="width: 100%"
          tooltip-effect="light"
          @sort-change="fifterTable"
          @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" width="55" /> -->
          <el-table-column type="selection" width="50" fixed="left" align="center"/>
          <el-table-column prop="seat" label="座位" >
            <template slot-scope="scope">
              <span class="text_color">{{ scope.row.seat }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="team" label="所属团队" min-width="120" show-overflow-tooltip/>
          <el-table-column prop="boss" label="报名老大" min-width="120"/>
          <el-table-column prop="auth_code" label="授权号" min-width="120"/>
          <el-table-column prop="custname" label="经销商姓名" width="150" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <div style="display: inline-flex;">
                <span class="overline_one">{{ scope.row.custname }}</span>
                <label-color v-if="scope.row.iconname!=''" :color="scope.row.iconcolor" :text="scope.row.iconname"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="联系电话" min-width="120"/>
          <!-- <el-table-column prop="offlineproxycount" label="邀约经销商数量" sortable >
            <template slot-scope="scope">
              <span class="text_color">{{ scope.row.offlineproxycount }}</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="signinDate" label="签到时间" min-width="140" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.status!=4" class="text_color">{{ scope.row.signinDate }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="welfare_status" label="是否有福利" min-width="140" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.welfare_status==1">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column prop="welfare_num" label="福利数量" min-width="140" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.welfare_status==1" class="text_color">{{ scope.row.welfare_num }}</span>
              <span v-else>暂无</span>
            </template>
          </el-table-column>
          <el-table-column prop="welfare" label="福利内容" min-width="140" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.welfare_status==1" class="text_color">{{ scope.row.welfare }}</span>
              <span v-else>暂无</span>
            </template>
          </el-table-column>
          <el-table-column prop="source" label="状态" min-width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status==4" type="danger">未签到</el-tag>
              <el-tag v-if="scope.row.status==2" type="success">手机签到</el-tag>
              <el-tag v-if="scope.row.status==1" type="success">后台签到</el-tag>
              <el-tag v-if="scope.row.status==3" type="success">补录</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button v-if="btnPermission('offlinestudymember_signup')" :disabled="scope.row.status!=4" type="text" size="small" @click="signUp(scope.row,'1')">签到</el-button>
              <el-button v-if="btnPermission('offlinestudymember_edit')" :disabled="scope.row.status!=4" type="text" size="small" @click="showModel(scope.row,'edit')">编辑</el-button>
              <el-button v-if="btnPermission('offlinestudymember_assign')" type="text" size="small" @click="goFllow(scope.row)">培训回访</el-button>
              <el-button v-if="btnPermission('offlinestudymember_updatestatus')" type="text" size="small" @click="changeStates(scope.row,'99')">作废</el-button>
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
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="modelShow" :title="modelTitle" width="600px" class="dialogModel" @close="resetModel">
      <!-- 新建经销商 -->
      <el-scrollbar class="fixed_scroll">
        <el-form
          v-if="modelShow"
          ref="proxyForm"
          :model="proxyForm"
          :rules="rules"
          class="modelForm center"
          label-width="120px"
          label-position="right">
          <el-form-item label="座位：" prop="seat">
            <el-input v-model.trim="proxyForm.seat" autocomplete="off" style="width:500px" placeholder="请输入座位号"/>
          </el-form-item>
          <el-form-item label="所属团队：" prop="team">
            <el-input v-model.trim="proxyForm.team" autocomplete="off" style="width:500px" placeholder="请输入所属团队"/>
          </el-form-item>
          <el-form-item label="报名老大：" prop="boss">
            <el-input v-model.trim="proxyForm.boss" autocomplete="off" style="width:500px" placeholder="请输入报名老大"/>
          </el-form-item>
          <el-form-item label="经销商姓名：" prop="custname">
            <el-select
              v-model="proxyForm.custname"
              :disabled="disab"
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
          <el-form-item label="授权号：" prop="auth_code">
            <el-input v-model="proxyForm.auth_code" disabled autocomplete="off" style="width:500px" placeholder="请输入授权号"/>
          </el-form-item>
          <el-form-item label="联系电话：" prop="phone">
            <el-input v-model.trim="proxyForm.phone" autocomplete="off" style="width:500px" placeholder="请输入联系电话"/>
          </el-form-item>
          <el-form-item label="是否有福利：" prop="welfare_status">
            <el-switch
              v-model="proxyForm.welfare_status"
              active-text="是"
              inactive-text="否"
              active-value="1"
              inactive-value="99"/>
          </el-form-item>
          <el-form-item v-if="proxyForm.welfare_status==1" label="福利名称" prop="welfare">
            <el-input v-model="proxyForm.welfare" autocomplete="off" style="width:500px" placeholder="请输入福利名称"/>
          </el-form-item>
          <el-form-item v-if="proxyForm.welfare_status==1" label="福利数量" prop="welfare_num">
            <el-input-number v-model="proxyForm.welfare_num" :min="1" :precision="0"/>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="modelType === 'new'||modelType === 'supplement'" @click="resetsubmit">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">{{ sureBtn }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getProxyInfo,
  saveProxy,
  updateProxy,
  changeProxy,
  showPhoe,
  supplementProxy,
  proxyListbatchCancel
} from '@/api/training'
import {
  getAgentListByName
} from '@/api/public'
export default {
  name: 'ProxyListManage',
  data() {
    return {
      selectArr: [],
      submitting: false,
      moduleType: '/ofs/offlinestudymember-export',
      uploadUrl: '',
      downloadUrl: '',
      page_name: 'offlinestudymember',
      module_name: 'ofs',
      tabsList: [
        { label: '全部经销商', name: 'all' }
      ],
      selectLoading: false,
      choseTotal: 0,
      tableData: [],
      courseList: [],
      isShow: true,
      loading: true,
      modelType: '',
      modelTitle: '',
      modelShow: false,
      disab: false,
      sureBtn: '确 定',
      optionsList: [],
      selectList: [],
      backList: [],
      studyId: '',
      proxyForm: {
        seat: '',
        team: '',
        boss: '',
        custname: '',
        phone: '',
        welfare_status: 99,
        welfare: '',
        welfare_num: 1,
        auth_code: ''
      },
      tableHeight: 250,
      phone1: false,
      rules: {
        seat: [{
          required: true,
          message: '座位号不能为空',
          trigger: 'blur'
        }],
        team: [{
          required: true,
          message: '所属团队不能为空',
          trigger: 'blur'
        }],
        boss: [{
          required: true,
          message: '报名老大不能为空',
          trigger: 'blur'
        }],
        custname: [{
          required: true,
          message: '经销商名称不能为空',
          trigger: 'blur'
        }]
      },
      searchInfo: {
        mode: 'all', // 类型  全部 all 未邀约 notInvited 已邀约 invited 已学习 proxy
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      total: 0 // 总条数
    }
  },
  mounted() {
    this.studyId = this.$route.params.id
    this.uploadUrl = process.env.BASE_API + 'ofs/offlinestudymember-import-' + this.studyId + '.json'
    this.downloadUrl = process.env.BASE_API + 'data/download/邀约经销商模板.xls'
    console.log(this.uploadUrl)
    this.getDefault()
    // 获取列表
    this.getList()
    // this.choseBussiness()
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  methods: {
    batchstop() {
      const that = this
      console.log('askldjslkdf')
      if (that.selectArr.length > 0) {
        const obj = {
          ids: this.selectArr.join(',')
        }
        this.$confirm('经销商一旦作废不可恢复，确定要批量“作废”吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          proxyListbatchCancel(obj).then(res => {
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
        this.tableHeight = document.body.offsetHeight - 330
      }
    },
    fuzzyQueryAction(value) {
      // table表格重置高度
      this.tableHeight = document.body.offsetHeight - 330
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
    resetsubmit() {
      this.submitting = false
      this.$refs['proxyForm'].resetFields()
      this.proxyForm = {
        seat: '',
        team: '',
        boss: '',
        custname: '',
        phone: '',
        welfare_status: 99,
        welfare: '',
        welfare_num: 1,
        auth_code: ''
      }
    },
    fifterTable(event) {
      console.log(event.order)
      if (event.order === 'ascending') {
        this.searchInfo.orderBy = event.prop + '_asc'
      } else if (event.order === 'descending') {
        this.searchInfo.orderBy = event.prop + '_desc'
      } else {
        this.searchInfo.orderBy = ''
      }
      this.loading = true
      this.searchInfo.pageID = 1
      this.tableData = []
      this.getList()
    },
    getList() {
      const that = this
      // 获取经销商列表
      getProxyInfo(this.studyId, this.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          that.tableData = res.data.offlinestudymember
          that.total = res.data.pager.recTotal // 总条数
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
    getDefault() {
      const that = this
      const name = ''
      getAgentListByName('').then(res => {
        if (res.code == 200) {
          // eslint-disable-next-line no-undef
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
    returnPage() {
      this.$router.back(-1)
    },
    addProxy() {
      this.modelTitle = '创建经销商'
      this.modelType = 'new'
      this.modelShow = true
      this.sureBtn = '保 存'
      this.disab = false
    },
    supplementProxy() {
      this.modelTitle = '补录经销商'
      this.modelType = 'supplement'
      this.modelShow = true
      this.sureBtn = '保 存'
      this.disab = false
    },
    importProxy(event) {
      if (event) {
        this.getList()
      }
    },
    choseType() {
      this.searchInfo.pageID = 1
      this.tableData = []
      this.searchInfo.orderBy = ''
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
    handleClick(tab, event) {
      // console.log(tab, event)
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
    handleChange(value) {
      console.log(value)
    },
    goFllow(data) {
      this.$router.push({
        path: '/training/studyVisit',
        name: 'StudyVisit',
        params: {
          id: data.id
        }
      })
    },
    showModel(data, type) {
      this.modelType = type
      this.modelShow = true
      console.log(data)
      this.proxyForm = {
        id: data.id,
        seat: data.seat,
        team: data.team,
        boss: data.boss,
        custname: data.custname,
        phone: data.phone,
        welfare_status: data.welfare_status,
        welfare: data.welfare,
        welfare_num: data.welfare_num,
        auth_code: data.auth_code
      }
      this.disab = true
      this.modelTitle = '编辑经销商'
    },
    saveModel() {
      const that = this
      this.$refs['proxyForm'].validate((valid) => {
        if (valid) {
          that.submitting = true
          console.log(this.proxyForm)
          if (this.modelType === 'new') {
            // 新增经销商
            saveProxy(this.studyId, this.proxyForm).then(res => {
              if (res.code === 200 || res.code === '200') {
                this.$message({
                  message: '经销商添加成功！',
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
          } else if (this.modelType === 'supplement') {
            // 补录经销商
            supplementProxy(this.studyId, this.proxyForm).then(res => {
              if (res.code === 200 || res.code === '200') {
                this.$message({
                  message: '经销商补录成功！',
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
            // 更新经销商
            updateProxy(this.proxyForm).then(res => {
              if (res.code === 200 || res.code === '200') {
                this.$message({
                  message: '经销商更新成功！',
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
        this.proxyForm.phone = obj.phone
        this.proxyForm.auth_code = obj.auth_code
      } else {
        this.proxyForm.phone = ''
      }
    },
    resetModel() {
      console.log('重置表单')
      this.submitting = false
      this.$refs['proxyForm'].resetFields()
      this.proxyForm = {
        seat: '',
        team: '',
        boss: '',
        custname: '',
        phone: '',
        welfare_status: 99,
        welfare: '',
        welfare_num: 1,
        auth_code: ''
      }
      this.modelShow = false
    },
    signUp(event, states) {
      const that = this
      const msg = '确定要“签到”吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeProxy(event.id, states).then(res => {
          console.log(res)
          if (res.code === 200 || res.code === '200') {
            that.$message({
              type: 'success',
              message: res.data
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
      }).catch(() => {
        console.log('用户点击了取消')
      })
    },
    changeStates(event, states) {
      const that = this
      const msg = '经销商一旦作废不可恢复，确定要“作废”吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeProxy(event.id, states).then(res => {
          console.log(res)
          if (res.code === 200 || res.code === '200') {
            that.$message({
              type: 'success',
              message: res.data
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
    }
  }
}

</script>
<style lang="less" scoped>
  .proxy_bg {
    // background: #fff;
    // padding: 10px;
    position: absolute;
    width: 100%;
    top: 0;
    // .search_btn {
    //   display: flex;
    //   align-items: center;
    //   justify-content: space-between;
    // }

    .proxy_info {
      background: #fff;
      padding: 20px 10px;
      // margin: 10px 0;
      .tabs_table{
        .text_color{
          color: #409EFF;
        }
      }
    }

    .proxy_page {
      text-align: center;
      padding: 10px 0;
    }
  }

  .dialogModel {
    .modelForm {
      margin: 0 10px;
    }

    .center {
      margin: 0 70px;
    }

    .conversionHistory {

      .his_list {
        list-style: none;
      }
    }
  }

</style>
