<template>
  <div>
    <div>
      <div class="agreement_bg">
        <div class="fifter">
          <my-tabs
            :page-name="page_name"
            :module-name="module_name"
            :active-name="searchInfo.mode"
            :supp-text="'录入'"
            :supplement="btnPermission('contract_create')"
            :tabs-list="typeList"
            :fifter-open = "false"
            @supplementAction="addluru"
            @handleClick="choseType"
            @searchShow="searchShowAction($event)"
            @fuzzyQuery="fuzzyQueryAction($event)"
            @searchQuery="searchQueryAction($event)"
            @filterQuery="filterQueryAction($event)"/>
            <!-- <search-fifter :add="btnPermission('contract_create')" :module-name="'contract'" :fifter="true" :add-text="'录入'" @search="fifterSearch" @addAction="addluru"/> -->
        </div>
        <div class="proxy_info">
          <!-- <el-tabs v-model="searchInfo.mode" type="card" class="tabs_table" tooltip-effect="light" @tab-click="choseType">
            <el-tab-pane v-for="(item,index) in typeList" :key="index" :label="item.text" :name="item.name"> -->
          <div class="info_total">
            <div class="data_total">
              <span class="total_text">共{{ total }}条内容，已选中{{ choseTotal }}条</span>
              <el-button v-if="btnPermission('contract_cancellations')" plain size="mini" @click="batchstop('remover')">批量作废</el-button>
            </div>
          </div>
          <el-table v-loading="loading" ref="table" :data="tableData" :max-height="tableHeight" border row-key="id" style="width: 100%" tooltip-effect="light" @selection-change="handleSelectionChange" @sort-change="fifterTable">
            <!-- <el-table-column type="selection" width="50" align="center"/> -->
            <el-table-column type="selection" min-width="40" fixed="left" align="center"/>
            <el-table-column label="客户名称" width="120" show-overflow-tooltip prop="agent">
              <template slot-scope="scope">
                <span class="text_color">{{ scope.row.agent }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="名称"  sortable prop="name"/> -->
            <el-table-column label="授权号" prop="protocolNo" show-overflow-tooltip min-width="100"/>
            <el-table-column prop="createdDate" label="签约日期" sortable="custom" show-overflow-tooltip min-width="160"/>
            <el-table-column label="保证金" sortable="custom" min-width="100" show-overflow-tooltip prop="amount">
              <template slot-scope="scope">
                <span class="text_color">￥{{ scope.row.amount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="回款金额" sortable="custom" min-width="100" show-overflow-tooltip prop="receiveAmount">
              <template slot-scope="scope">
                <span class="text_color">￥{{ scope.row.receiveAmount }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="保证金" sortable="custom" min-width="100" show-overflow-tooltip prop="assureMoney">
              <template slot-scope="scope">
                <span class="text_color">￥{{ scope.row.assureMoney }}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="保证金附件" prop="file" min-width="100" >
              <template slot-scope="scope">
                <div v-for="(item,index) of scope.row.file" v-show="scope.row.file!=''" :key="index" class="fileStyle">
                  <a :title="item.name" :href="fileUrl + item.url" download="" class="file" target="_blank">{{ item.name }}</a>
                </div>
                <div v-show="scope.row.file==''"/>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" min-width="100" >
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status==1" type="danger">回款不足</el-tag>
                <el-tag v-if="scope.row.status==2" type="success">已回款</el-tag>
                <!-- <el-tag v-show="scope.row.status==99" type="warning">作废</el-tag> -->
              </template>
            </el-table-column>
            <el-table-column v-if="tableData.length>0" label="操作" width="200" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button v-if="btnPermission('contract_view')" type="text" size="small" @click.native="find(scope.row)">查看</el-button>
                <el-button v-if="btnPermission('contract_alter')" type="text" size="small" @click="editagreement(scope.row,'change')">变更</el-button>
                <el-button v-if="btnPermission('contract_edit')" type="text" size="small" @click="editagreement(scope.row,'edit')">编辑</el-button>
                <el-button v-if="btnPermission('contract_cancellation')" type="text" size="small" @click="changeagreement(scope.row,'99')">作废</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="info_page">
            <el-pagination
              :current-page="searchInfo.pageID"
              :page-sizes="[5, 10, 15,20]"
              :page-size="searchInfo.recPerPage"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              aligin="center"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"/>
          </div>
          <!-- </el-tab-pane>
          </el-tabs> -->
        </div>
      </div>
      <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :title="modelTitle" :visible.sync="onShow" class="dialog agreementS" @close="resetModel">
        <el-scrollbar class="fixed_scroll over_scroll">
          <div class="show_scroll">
            <el-form v-if="onShow" ref="ruleForm" :label-position="labelPosition" :rules="rules" :model="ruleForm" label-width="120px" class="payment_form center modelForm">
              <el-form-item class="itemFrom" label="授权号：" prop="protocolNo">
                <el-input :disabled="modelType=='edit'||modelType=='change'" v-model.trim="ruleForm.protocolNo" placeholder="请输入授权号" style="width:500px" />
              </el-form-item>
              <el-form-item class="itemFrom" label="客户名称：" prop="agent">
                <el-input v-model.trim="ruleForm.agent" :disabled="modelType=='change'" placeholder="请输入客户名称" style="width:500px" />
              </el-form-item>
              <el-form-item class="itemFrom" label="性别：" prop="gender">
                <el-radio v-model="ruleForm.gender" :disabled="modelType=='change'" label="0">男</el-radio>
                <el-radio v-model="ruleForm.gender" :disabled="modelType=='change'" label="1">女</el-radio>
              </el-form-item>
              <el-form-item class="itemFrom" label="手机号：" prop="mobile" >
                <el-input v-model.trim="ruleForm.mobile" :disabled="modelType=='change'" placeholder="请输入手机号" style="width:500px" />
              </el-form-item>
              <el-form-item class="itemFrom" label="微信号：" prop="weixin" >
                <el-input v-model.trim="ruleForm.weixin" :disabled="modelType=='change'" placeholder="请输入微信号" style="width:500px" />
              </el-form-item>
              <el-form-item class="itemFrom" label="经销商等级：" prop="level" >
                <el-select v-model="ruleForm.level" :disabled="modelType=='edit'" filterable placeholder="请选择经销商等级" style="width:500px" >
                  <el-option v-for="(item,index) in agentLevelList" :label="item.label" :value="item.value" :key="index"/>
                </el-select>
              </el-form-item>
              <el-form-item class="itemFrom" label="身份证号：" prop="idcardNo" >
                <el-input v-model.trim="ruleForm.idcardNo" :disabled="modelType=='change'" placeholder="请输入身份证号" style="width:500px" />
              </el-form-item>
              <el-form-item class="itemFrom" label="保证金：" prop="amount" >
                <template >
                  <el-input v-model.trim="ruleForm.amount" :disabled="modelType=='edit'" placeholder="请输入保证金" autocomplete="off" min="0" style="width:500px" type="number" @blur="iptNum">
                    <i slot="suffix" class="el-input__icon" style="font-style:normal">￥</i>
                  </el-input>
                </template>
              </el-form-item>
              <el-form-item class="itemFrom" label="协议备注：" prop="remark" >
                <el-input v-model.trim="ruleForm.remark" :disabled="modelType=='change'" :rows="2" placeholder="请输入协议备注，最大长度为120个字" type="textarea" style="width:500px" />
              </el-form-item>
              <el-form-item class="itemFrom" label="保证金附件：" prop="file">
                <el-upload
                  ref="upload"
                  :disabled="modelType=='change'"
                  :on-preview="handlePreview"
                  :on-exceed="handleExceed"
                  :before-upload="beforeUpload"
                  :on-success="handleSuccess"
                  :on-remove="handleRemove"
                  :file-list="fileList"
                  :name="'files'"
                  :action="uploadUrl"
                  class="upload-demo"
                  style="width:500px;"
                  multiple>
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">请上传压缩包、word文档、excel文档、ppt演示文稿、pdf文档、图片文件</div>
                </el-upload>
              </el-form-item>
            </el-form>
          </div>
        </el-scrollbar>
        <div slot="footer" class="dialog-footer">
          <el-button v-if="modelType=='new'" @click="resetsubmit">重 置</el-button>
          <el-button :loading="submitting" type="primary" @click="saveModel">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getAgreementInfo, editInfo, addgreement, changeagree, agreementBatchCancel, catchChange } from '@/api/agreement'
import { addTransformationLabel } from '@/api/agent'
export default {
  name: 'Agreement',
  data() {
    const checkNum = (rule, value, callback) => {
      if (!value) {
        return new Error('请输入保证金金额')
      } else {
        if (value < 0) {
          callback(new Error('输入的保证金金额不能为负数'))
        } else {
          callback()
        }
      }
    }
    return {
      page_name: 'contract',
      module_name: 'fi',
      choseTotal: 0,
      filesArr: [],
      fileUrl: '',
      submitting: false,
      uploadUrl: '',
      loading: true,
      onShow: false,
      Show: 'true',
      fileList: [],
      files: [],
      total: 0,
      modelType: '',
      modelTitle: '创建录入',
      labelPosition: 'right',
      tableData: [],
      typeList: [
        { label: '全部', name: 'all' },
        { label: '已回款', name: 'back' },
        { label: '回款不足', name: 'lack' }
      ],
      ruleForm: {
        agent: '',
        gender: '0',
        mobile: '',
        weixin: '',
        level: '',
        idcardNo: '',
        protocolNo: '',
        amount: 0.00,
        // receiveAmount: '',
        createdDate: '',
        remark: '',
        assureMoney: 0.00,
        file: ''
        // files:[{name: '',url: ''}]
      },
      agentLevelList: [],
      tableHeight: 250,
      rules: {
        agent: [
          { required: true, message: '客户名称不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度为2-20', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '性别不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: false, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^[1][0-9]{10}$/, message: '手机号格式错误', trigger: 'blur' }
        ],
        weixin: [
          { required: false, message: '微信号不能为空', trigger: 'blur' }
        ],
        level: [{
          required: true,
          message: '经销商等级不能为空',
          trigger: 'change'
        }],
        idcardNo: [
          { required: true, message: '身份证号不能为空', trigger: 'blur' },
          { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号格式错误', trigger: 'blur' }
        ],
        protocolNo: [
          { required: true, message: '授权号不能为空', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_]{2,25}$/, message: '授权号为数字、字母、_', trigger: 'blur' }
        ]
      },
      searchInfo: {
        mode: 'all', // 类型
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0
      },
      selectArr: [],
      options: [{
        value: '1',
        label: '1'
      },
      {
        value: '2',
        label: '2'
      }]
    }
  },
  mounted() {
    this.fileUrl = process.env.FILE_API
    console.log(process.env, 'fdsgggggggggg')
    this.uploadUrl = process.env.BASE_API + 'sys/file-upload'
    this.getList()
    this.level()
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  methods: {
    batchstop() {
      const that = this
      if (that.selectArr.length > 0) {
        const obj = {
          ids: this.selectArr.join(',')
        }
        that.$confirm('保证金一旦作废，不可以恢复,确定要批量“作废”吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          agreementBatchCancel(obj).then(res => {
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
      this.$refs['ruleForm'].resetFields()
      this.ruleForm = {
        agent: '',
        gender: '0',
        mobile: '',
        weixin: '',
        level: '',
        idcardNo: '',
        protocolNo: '',
        amount: 0.00,
        // receiveAmount: '',
        createdDate: '',
        remark: '',
        assureMoney: 0.00,
        file: ''
      }
      this.fileList = []
      this.submitting = false
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
    iptNum(e) {
      // const a = parseFloat(e.target.value).toFixed(2)
      if (parseInt(e.target.value) < 0) {
        this.ruleForm.amount = e.target.value
      } else {
        this.ruleForm.amount = parseFloat(e.target.value).toFixed(2)
      }
    },
    iptNum1(e) {
      if (parseInt(e.target.value) < 0) {
        this.ruleForm.assureMoney = e.target.value
      } else {
        this.ruleForm.assureMoney = parseFloat(e.target.value).toFixed(2)
      }
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
    handleSuccess(res, file, fileList) {
      console.log(fileList)
      if (res.code == 200 || res.code == '200') {
        this.filesArr = []
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].response == undefined) {
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
      // if (res.code === 200 || res.code === '200') {
      //   this.filesArr.push({
      //     name: file.name,
      //     url: res.data.data[0].pathname
      //   })
      // }
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
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
        this.ruleForm.file = ''
      }
      console.log(this.filesArr)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning('当前限制选择 1 个文件，请删除后继续上传')
    },
    getList() {
      const that = this
      getAgreementInfo(that.searchInfo).then(res => {
        that.loading = false
        // that.tableData = res.data.contracts
        console.log(res.data.contracts)
        const conData = res.data.contracts
        if (conData.length !== 0) {
          for (var i = 0; i < conData.length; i++) {
            console.log()
            if (conData[i].file !== '' && conData[i].file !== '[]' && conData[i].file !== '[object Object]' && conData[i].file !== 1 && conData[i].file !== '[object Object],[object Object]') {
              conData[i].file = JSON.parse(conData[i].file)
              console.log(conData[i].file, 'fdsfds')
            }
          }
          console.log(conData, 'fff')
        }
        that.tableData = conData
        that.total = res.data.pager.recTotal
      })
    },
    level() {
      // 获取经销商等级
      const that = this
      addTransformationLabel().then(res => {
        if (res.code === 200) {
          that.agentLevelList = res.data
        }
      })
    },
    choseType(value) {
      this.searchInfo.pageID = 1
      this.tableData = []
      this.searchInfo.mode = value
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
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.searchInfo.pageID = 1
      this.searchInfo.recPerPage = val
      this.tableData = []
      // this.loading = true
      this.getList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.searchInfo.pageID = val
      this.loading = true
      this.getList()
    },
    addluru() {
      console.log('aslkdj')
      this.onShow = true
      this.modelType = 'new'
      this.modelTitle = '录入保证金信息'
    },
    saveModel() {
      const that = this
      console.log(this.ruleForm, 'fhbgdgfhygf')
      // receiveAmount
      // 保存保证金
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.filesArr.length > 0) {
            this.ruleForm.file = JSON.stringify(this.filesArr)
          }
          // if (parseFloat(this.ruleForm.amount) < parseFloat(this.ruleForm.assureMoney)) {
          //   that.$message.warning('保证金不能大于保证金金额！')
          // } else
          // {
          if (this.ruleForm.mobile == '' && this.ruleForm.weixin == '') {
            that.$message({
              message: '手机号和微信号必须填一个',
              type: 'warning'
            })
          } else {
            this.submitting = true
            if (that.modelType === 'new') {
              // 新增
              addgreement(this.ruleForm).then(res => {
                console.log(res)
                if (res.code === 200 || res.code === '200') {
                  that.$message({
                    message: '保证金添加成功！',
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
            } else if (that.modelType === 'edit') {
              // 更新
              console.log(this.ruleForm, '2erf')
              editInfo(this.ruleForm).then(res => {
                console.log(res)
                if (res.code === 200 || res.code === '200') {
                  that.$message({
                    message: '保证金更新成功！',
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
            } else if (that.modelType === 'change') {
              const obj = {
                level: that.ruleForm.level,
                amount: that.ruleForm.amount
              }
              catchChange(that.ruleForm.id, obj).then(res => {
                if (res.code === 200 || res.code === '200') {
                  that.$message({
                    message: '付款信息保存成功！',
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
          // }
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
      this.$refs['ruleForm'].resetFields()
      this.ruleForm = {
        agent: '',
        gender: '0',
        mobile: '',
        weixin: '',
        level: '',
        idcardNo: '',
        protocolNo: '',
        amount: 0.00,
        // receiveAmount: '',
        createdDate: '',
        remark: '',
        assureMoney: 0.00,
        file: ''
      }
      this.filesArr = []
      this.fileList = []
      this.onShow = false
      this.submitting = false
    },
    find(data) {
      // this.Show = false
      this.$router.push({
        path: '/financialman/agreement/find?id=' + data.id
      })
    },
    editagreement(data, type) {
      // console.log(data, 'fdsagdfgfahfhytuytuyei')
      console.log(this.ruleForm, 'adf')
      this.ruleForm = (({ agent, amount, assureMoney, createdDate, file, gender, id, idcardNo, level, mobile, protocolNo, remark, status, weixin }) => ({ agent, amount, assureMoney, createdDate, file, gender, id, idcardNo, level, mobile, protocolNo, remark, status, weixin }))(data)
      // this.ruleForm = { ...data }
      // this.ruleForm.amount = this.ruleForm.amount.split('￥')[1]
      // console.log(this.ruleForm.amount.split('￥')[1])
      if (this.ruleForm.file === null || this.ruleForm.file === '' || this.ruleForm.file === '[]' || this.ruleForm.file === '[object Object]' || this.ruleForm.file === '[object Object],[object Object]') {
        this.fileList = []
        this.ruleForm.file = ''
      } else {
        const file = this.ruleForm.file
        console.log(file)
        this.fileList = file
        this.ruleForm.file = JSON.stringify(this.ruleForm.file)
      }
      console.log(this.ruleForm)
      this.onShow = true
      this.modelType = type
      this.modelTitle = '编辑保证金信息'
    },
    fifterSearch(event) {
      console.log(event)
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
    changeagreement(event, states) {
      const that = this
      let msg = ''
      if (states !== '1' && states !== '2') {
        msg = '确定作废此保证金,一旦作废不可恢复哦~？'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeagree(event.id, states).then(res => {
          console.log(res)
          if (res.code === 200 || res.code === '200') {
            that.$message({
              type: 'success',
              message: res.data.message
            })
            this.modelShow = false
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
    }
  }
}
</script>
<style lang="less" scoped>
.agreement_bg{
    // background: #fff;
    // padding: 10px;
    position: absolute;
    width: 100%;
    top: 0;
    .proxy_info {
      background: #fff;
      padding: 20px 10px;
    }
    .agreement_page{
        text-align: center;
        margin-top: 20px;
    }
    .file{
       text-decoration: underline;
        color:#409EFF;
        font-size: 12px;
    }
}
.dialog{
     .payment_form{
       margin: 0 10px;
      // .input_tips{
      //   font-size: 12px;
      //   color: #AEAEAE;
      //   font-family: '微软雅黑 Regular', '微软雅黑';
      // }
      .itemFrom{
        margin-bottom: 22px;
      }

      .moneyIcon{
        display: inline-block;
      }
    }
    .center{
       margin:20px;
    }
}

</style>

