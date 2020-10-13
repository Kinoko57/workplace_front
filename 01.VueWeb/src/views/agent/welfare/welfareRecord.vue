<template>
  <div>
    <div class="welfare_bg">
      <!-- <div class="fifter">
        <search-fifter :fifter="true" :export-show="btnPermission('welfarerecord_export')" :module-name="'welfarerecord'" :export-type="moduleType" :export-name="'福利发放列表'" @addAction="addReport" @search="fifterSearch" />
      </div> -->
      <!-- @addAction="addReport" -->
      <div class="welfare_fifter">
        <my-tabs
          :active-name="searchInfo.mode"
          :add="btnPermission('welfarerecord_create')&&searchInfo.mode=='import'"
          :page-name="page_name"
          :module-name="module_name"
          :tabs-list="tabsList"
          @addAction="addRecord"
          @handleClick="choseType"
          @searchShow="searchShowAction($event)"
          @fuzzyQuery="fuzzyQueryAction($event)"
          @searchQuery="searchQueryAction($event)"
          @filterQuery="filterQueryAction($event)" />
      </div>
      <div class="welfare_info">
        <div class="welfare_total">
          <div class="data_total">
            <span>共{{ total }}条福利记录</span>
            <el-button v-if="btnPermission('welfarerecord_batchconfirm')&&searchInfo.mode=='import'" plain size="mini" @click="allRecordView('','sure')">批量确认</el-button>
            <el-button v-if="btnPermission('welfarerecord_batchremove')&&searchInfo.mode=='import'" plain size="mini" @click="allRecordView('','delet')">批量作废</el-button>
          </div>
          <div class="export_btn">
            <search-fifter
              :export-show="btnPermission('welfarerecord_export')&&searchInfo.mode=='all'"
              :module-name="'welfarerecord'"
              :export-type="moduleType"
              :export-name="'福利发放列表'"
              @importAction="importAction" />
            <search-fifter
              :module-name="'welfarerecord'"
              :import-show="btnPermission('welfarerecord_import')&&searchInfo.mode=='import'"
              :download-url="downloadUrl"
              :upload-url="uploadUrl"
              :export-name="'福利发放列表'"
              @importAction="importAction" />
          </div>
        </div>
        <el-table v-loading="loading" ref="table" :data="tableData" :max-height="tableHeight" row-key="id" highlight-current-row border tooltip-effect="light" @selection-change="handleSelectionChange" @sort-change="fifterTable">
          <!-- <el-table-column type="selection" min-width="40" fixed="left" align="center"/> -->
          <el-table-column v-show="searchInfo.mode=='import'" type="selection" min-width="40" fixed="left" align="center"/>
          <el-table-column prop="agentName" label="经销商" show-overflow-tooltip min-width="100px">
            <template slot-scope="scope">
              <span class="over_line_one">{{ scope.row.agentName }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="searchInfo.mode=='import'" prop="status" label="状态" show-overflow-tooltip min-width="100px">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status==3" type="success">待确认</el-tag>
              <el-tag v-if="scope.row.status==1" type="danger">已确认</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="welfareId" label="发放福利" show-overflow-tooltip min-width="120px" />
          <el-table-column prop="number" label="发放数量" sortable="custom" min-width="100px"/>
          <el-table-column prop="createdBy" label="执行人" min-width="120px" show-overflow-tooltip/>
          <el-table-column prop="organizeId" label="执行部门" min-width="120px" show-overflow-tooltip/>
          <el-table-column prop="createdDate" label="执行时间" sortable="custom" min-width="150px" show-overflow-tooltip/>
          <el-table-column :width="searchInfo.mode=='import'?140:120" label="操作" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="showModel(scope.row,'view')">查看</el-button>
              <el-button v-if="btnPermission('welfarerecord_confirm')&&searchInfo.mode=='import'" type="text" size="small" @click="RecordView(scope.row,'sure')">确认</el-button>
              <el-button v-if="btnPermission('welfarerecord_remove')&&searchInfo.mode=='import'" type="text" size="small" @click="RecordView(scope.row,'delet')">作废</el-button>
              <el-button v-if="btnPermission('welfarerecord_updateStatus')" type="text" size="small" @click="changeStates(scope.row,'99')">作废</el-button>
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
      <el-scrollbar v-show="modelType=='view'" :class="{'over_scroll':showScroll}" class="fixed_scroll">
        <table class="view_dialog view_dialog_find" cellpadding="0" cellspacing="0">
          <tr class="view_line">
            <td class="line_title">经销商</td>
            <td class="second_line">{{ viewForm.agentName }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">发放福利</td>
            <td class="second_line">{{ viewForm.welfareId }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">执行人</td>
            <td class="second_line">{{ viewForm.createdBy }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">执行部门</td>
            <td class="second_line">{{ viewForm.organizeId }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">执行时间</td>
            <td class="second_line">{{ viewForm.createdDate }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">发放说明</td>
            <td class="second_line">{{ viewForm.remarks }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">收货人信息</td>
            <td class="second_line">{{ viewForm.shipName }}   {{ viewForm.mobile }}</td>
          </tr>
          <tr class="view_line">
            <td class="line_title">收货人地址</td>
            <td class="second_line">{{ viewForm.shipArea }}     {{ viewForm.shipAddr }}</td>
          </tr>
        </table>
      </el-scrollbar>
      <el-scrollbar v-if="modelShow&&searchInfo.mode=='import'&&modelType!='view'" class="fixed_scroll">
        <el-form
          ref="welfareForm"
          :model="welfareForm"
          :rules="welfareRules"
          class="modelForm"
          label-width="120px"
          label-position="right">
          <!-- 添加福利 -->
          <el-form-item label="经销商姓名：" prop="agentId">
            <el-select
              v-model="welfareForm.agentId"
              :disabled="disab"
              :remote-method="getSelectList"
              :loading="selectLoading"
              placeholder="请选择经销商姓名"
              style="width:500px"
              filterable
              remote
              clearable
              reserve-keyword
              @change="choseBussiness"
              @clear="resetSearch">
              <el-option v-for="item in selectList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="授权号：" prop="auth_code">
            <el-input v-model="welfareForm.auth_code" disabled autocomplete="off" style="width:500px" placeholder="请输入授权号"/>
          </el-form-item>
          <el-form-item label="联系电话：" prop="mobile">
            <el-input v-model.trim="welfareForm.mobile" autocomplete="off" style="width:500px" placeholder="请输入联系电话"/>
          </el-form-item>
          <el-form-item v-if="false" label="经销商：" prop="name">
            <el-input v-model.trim="welfareForm.shipName" disabled="" autocomplete="off" style="width:500px" placeholder="请输入联系人"/>
          </el-form-item>
          <el-form-item label="福利：" prop="welfareId">
            <el-select v-model="welfareForm.welfareId" placeholder="请选择福利" filterable style="width:500px">
              <el-option v-for="(item,index) in welfareList" :label="item.label" :value="item.value" :key="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="数量：" prop="number">
            <template>
              <el-input-number v-model.trim="welfareForm.number" :precision="0" :min="1" :max="500" size="large" style="width:500px" controls-position="right" placeholder="请输入数量"/>
            </template>
          </el-form-item>
          <el-form-item label="发放说明：" prop="remarks">
            <el-input :rows="6" v-model.trim="welfareForm.remarks" type="textarea" placeholder="请输入发放说明,最大长度为120个字" style="width:500px"/>
          </el-form-item>
          <el-form-item label="联系人：" prop="shipName">
            <el-input v-model.trim="welfareForm.shipName" autocomplete="off" style="width:500px" placeholder="请输入联系人"/>
          </el-form-item>
          <el-form-item label="省市区：" prop="shipAreas">
            <el-cascader ref="shipArea" :options="areaList" v-model="welfareForm.shipAreas" style="width:500px" placeholder="请选择省市区" @change="getAreaValues('address')"/>
          </el-form-item>
          <el-form-item label="详细地址：" prop="shipAddr">
            <el-input :rows="4" v-model.trim="welfareForm.shipAddr" type="textarea" style="width:500px" placeholder="请输入详细地址,最大长度为120个字" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div v-show="modelType=='view'" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modelShow=false">确 定</el-button>
      </div>
      <div v-show="searchInfo.mode=='import'&&modelType!='view'" slot="footer" class="dialog-footer">
        <el-button v-show="modelType!='edit'" @click="restForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">{{ sureBtn }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getwelfarerecordlist,
  changewelfarerecordLabel,
  removeRecord,
  confirmRecord,
  welfTips,
  addRecord
} from '@/api/agent'
import {
  getwelfarelist,
  getContractList

} from '@/api/agent'
import {
  getAreaList, getAgentListByName
} from '@/api/public'
import {
  getDepChoseList
} from '@/api/system'
  // import axios from 'axios'
export default {
  name: 'WelfareRecord',
  data() {
    const checkNum = (rule, value, callback) => {
      if (!value) {
        return new Error('福利不能为空')
      } else {
        if (value < 0) {
          callback(new Error('输入的福利数量不能为负数'))
        } else {
          callback()
        }
      }
    }
    return {
      selectList: [],
      disab: false,
      selectLoading: false,
      areaList: [],
      sureBtn: '保 存',
      submitting: false,
      welfareForm: {
        welfareId: '',
        auth_code: '',
        agentId: '',
        number: '1',
        remarks: '',
        mobile: '',
        shipAddr: '',
        shipArea: '',
        shipName: ''
      },
      welfareRules: {
        agentId: [{
          required: true,
          message: '经销商名称不能为空',
          trigger: 'blur'
        }],
        welfareId: [{
          required: true,
          message: '福利不能为空',
          trigger: 'change'
        }],
        number: [{
          required: true,
          message: '数量不能为空',
          trigger: 'change'
        }, { validator: checkNum, trigger: 'blur' }],
        remarks: [{
          required: true,
          message: '发放说明不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '发放说明长度超出范围1-120位之间', trigger: 'blur' }],
        shipName: [{
          required: false,
          message: '联系人不能为空',
          trigger: 'blur'
        }, { min: 2, max: 20, message: '联系人长度在2-20位之间', trigger: 'blur' }],
        mobile: [{
          required: false,
          message: '联系电话不能为空',
          trigger: 'blur'
        },
        {
          pattern: /^[1][0-9]{10}$/,
          message: '联系电话格式错误',
          trigger: 'blur'
        }],
        shipAreas: [{
          required: false,
          message: '省市区不能为空',
          trigger: 'change'
        }],
        shipAddr: [{
          required: false,
          message: '地址不能为空',
          trigger: 'blur'
        }, { min: 1, max: 120, message: '地址长度超出范围1-120位之间', trigger: 'blur' }]
      },
      checkAll: false,
      page_name: 'welfarerecord',
      module_name: 'agent',
      moduleType: '/agent/welfarerecord-export',
      tabsList: [{
        label: '全部记录',
        name: 'all'
      }, {
        label: '福利发放',
        name: 'import'
      }],
      uploadUrl: '',
      showScroll: false,
      tableData: [],
      loading: false,
      modelType: '',
      modelTitle: '',
      downloadUrl: '',
      modelShow: false,
      tableHeight: 250,
      viewForm: {},
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
    this.loading = true
    this.uploadUrl = 'agent/welfarerecord-import.json'
    this.downloadUrl = process.env.BASE_API + 'data/download/福利记录模板.xls'
    // 获取列表
    this.getList()
    this.getOtherList()
    this.getDefault()
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  methods: {
    getAreaValues() {
      const arr = this.$refs['shipArea'].getCheckedNodes()[0].pathLabels
      this.welfareForm.shipArea = arr.join(',')
    },
    choseBussiness(e) {
      console.log(e, 'hahahah')
      if (e !== '') {
        let obj = {}
        for (let i = 0; i < this.selectList.length; i++) {
          if (e == this.selectList[i].id) {
            obj = this.selectList[i]
            break
          }
        }
        console.log(obj, '选中的经销商')
        this.welfareForm.mobile = obj.phone
        this.welfareForm.auth_code = obj.auth_code
      } else {
        this.welfareForm.phone = ''
      }
    },
    resetSearch() {
      this.getDefault()
    },
    // blurBussiness(e) {
    //   console.log(e, 'hahahah111')
    //   this.welfareForm.agentId = ''
    // },
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
              that.selectList = res.data
            }
          })
        }, 500)
      } else {
        console.log('输入为空')
        getAgentListByName('').then(res => {
          if (res.code == 200) {
            that.selectList = res.data
          }
        })
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
    // 批量操作
    allRecordView(event, type) {
      const that = this
      if (that.selectArr.length > 0) {
        if (type === 'sure') {
          var obj = {
            ids: that.selectArr.join(',')
          }
          this.$confirm('确定要批量确认福利吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            confirmRecord(obj).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  type: 'success',
                  message: '操作成功'
                })
                that.getList()
                that.selectArr = []
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
        } else {
          const obj = {
            ids: this.selectArr.join(',')
          }
          this.$confirm('福利一旦作废不可恢复，确定要“批量作废”吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            removeRecord(obj).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  type: 'success',
                  message: '操作成功'
                })
                that.getList()
                that.selectArr = []
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
      } else {
        that.$message({
          type: 'warning',
          message: '当前未选择操作数据~'
        })
      }
    },
    RecordView(event, type) {
      const that = this
      // 操作
      if (type === 'sure') {
        var obj = {
          ids: event.id
        }
        this.$confirm('确定要确认此福利吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          confirmRecord(obj).then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                type: 'success',
                message: '操作成功'
              })
              that.getList()
              that.selectArr = []
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
      } else {
        const obj = {
          ids: event.id
        }
        this.$confirm('福利一旦作废不可恢复，确定要“作废”吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeRecord(obj).then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                type: 'success',
                message: '操作成功'
              })
              that.getList()
              that.selectArr = []
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
    serchInfo() {

    },
    addRecord() {
      this.modelShow = true
      this.modelType = 'add'
      this.modelTitle = '创建福利'
    },
    getOtherList() {
      const that = this
      // 获取省市区信息
      getAreaList().then(res => {
        console.log(res)
        that.areaList = res.data
      })
      // 获取福利列表
      getwelfarelist().then(res => {
        console.log(res)
        if (res.code === 200) {
          that.welfareList = res.data
        }
      })
      // 授权号下拉框的列表
      getContractList().then(res => {
        console.log(res, 'fdsaf')
        if (res.code === 200) {
          this.contractList = res.data
        }
      })
    },
    saveModel() {
      const that = this
      this.$refs['welfareForm'].validate((valid) => {
        if (valid) {
          that.submitting = true
          welfTips(this.welfareForm.welfareId, this.welfareForm.agentId).then(res => {
            console.log(res)
            if (res.code === 200 || res.code === '200') {
              if (res.data.number != '') {
                const msg = '该福利已经发放' + res.data.number + '件，最后一次发放时间是' + res.data.createdDate + '，是否要继续添加'
                this.$confirm(msg, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  const obj = {
                    welfareId: that.welfareForm.welfareId,
                    agentId: that.welfareForm.agentId,
                    number: that.welfareForm.number,
                    remarks: that.welfareForm.remarks,
                    mobile: that.welfareForm.mobile,
                    shipAddr: that.welfareForm.shipAddr,
                    shipArea: that.welfareForm.shipArea,
                    shipName: that.welfareForm.shipName
                  }
                  addRecord(obj).then(res => {
                    console.log(res)
                    that.submitting = false
                    if (res.code === 200 || res.code === '200') {
                      that.$message({
                        message: '添加成功！',
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
                }).catch(() => {
                  that.submitting = false
                  console.log('取消成功')
                })
              } else {
                const obj = {
                  welfareId: that.welfareForm.welfareId,
                  agentId: that.welfareForm.agentId,
                  number: that.welfareForm.number,
                  remarks: that.welfareForm.remarks,
                  mobile: that.welfareForm.mobile,
                  shipAddr: that.welfareForm.shipAddr,
                  shipArea: that.welfareForm.shipArea,
                  shipName: that.welfareForm.shipName
                }
                addRecord(obj).then(res => {
                  console.log(res)
                  that.submitting = false
                  if (res.code === 200 || res.code === '200') {
                    that.$message({
                      message: '添加成功！',
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
            } else {
              that.$message({
                message: res.data.msg,
                type: 'warning'
              })
            }
          })
        } else {
          console.log('error submit!!')
          // this.$message.warning('信息填写不完整或者信息填写有误！')
          this.$nextTick(() => {
            this.checkFormErr()
          })
          return false
        }
      })
      console.log(this.welfareForm)
    },
    importAction() {
      if (event) {
        this.getList()
      }
    },
    choseType(value) {
      this.$nextTick(() => {
        this.searchInfo.mode = value
        this.searchInfo.pageID = 1
        this.searchInfo.orderBy = ''
        if ((this.$refs.table) !== undefined) {
          this.resetTable()
        }
        this.tableData = []
        this.loading = true
        this.getList()
      })
    },
    resetTable() {
      for (let i = 0; i < (this.$refs.table).length; i++) {
        (this.$refs.table)[i].clearSort()
      }
    },
    restForm() {
      this.$refs['welfareForm'].resetFields()
      this.welfareForm = {
        welfareId: '',
        number: '1',
        remarks: '',
        mobile: '',
        shipAddr: '',
        shipArea: '',
        shipName: ''
      }
    },
    getList() {
      const that = this
      console.log(this.searchInfo, 'zhi')
      getwelfarerecordlist(this.searchInfo).then(res => {
        that.loading = false
        if (res.code === 200) {
          that.tableData = res.data.welfarerecord
          that.total = res.data.pager.recTotal // 总条数
        }
      })
      getDepChoseList().then(res => {
        if (res.code === 200 || res.code === '200') {
          this.depList = JSON.parse(JSON.stringify(res.data.organize))
        }
      })
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
      this.getList()
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
    addReport() {
      this.modelTitle = '创建福利'
      this.modelType = 'new'
      this.modelShow = true
      this.sureBtn = '保 存'
    },
    // choseType() {
    //   this.searchInfo.pageID = 1
    //   this.tableData = []
    //   this.loading = true
    //   this.getList()
    // },
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
    changeStates(event, states) {
      const that = this
      const msg = '福利记录一旦作废不可恢复，确定要“作废”吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changewelfarerecordLabel(event.id, states).then(res => {
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
    showModel(data, type) {
      if (type === 'view') {
        this.modelTitle = '查看福利'
        this.viewForm = data
      // eslint-disable-next-line no-empty
      } else {
      }
      this.modelType = type
      this.modelShow = true
      this.$nextTick(() => {
        console.log(document.getElementsByClassName('view_dialog')[0].offsetHeight)
        console.log(document.getElementsByClassName('view_dialog')[0].offsetHeight > 588)
        this.showScroll = document.getElementsByClassName('view_dialog')[0].offsetHeight > 588
      })
    },
    resetModel() {
      this.modelShow = false
      this.welfareForm = {
        welfareId: '',
        auth_code: '',
        agentId: '',
        number: '1',
        remarks: '',
        mobile: '',
        shipAddr: '',
        shipArea: '',
        shipName: ''
      }
    }
  }
}

</script>
<style lang="less" scoped>
  .welfare_bg {
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

    .welfare_info {
      background: #fff;
      padding: 20px 10px;
      .welfare_total{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 10px;
        span{
          font-size: 13px;
          color: #333333;
          margin-right: 6px;
        }
        .export_btn{
          float: right;
          display: inline-flex;
        }
      }
      .welfare_page {
      text-align: right;
      padding: 10px;
      }
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

    .view_welfare {
      margin: 20px 30px;
      border: 1px solid #e4e4e4;
      border-bottom: none;
      .view_line {
        overflow: hidden;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #e4e4e4;

        span {
          font-family: '微软雅黑 Regular', '微软雅黑';
          font-weight: 400;
          font-size: 14px;
          color: #999999;
          float: left;
          width: 350px;
        }

        .line_title {
          font-weight: 400;
          color: #666666;
          width: 130px;
          text-align: right;
          background: #f9fafc;
          border-right: 1px solid #e4e4e4;
          text-align: center;
          font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
          font-weight: 700;
          font-size: 12px;
          color: #333333;
        }

        .second_line {
          font-weight: 400;
          font-size: 14px;
          color: #333333;
          padding-left: 10px;
        }
      }
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
