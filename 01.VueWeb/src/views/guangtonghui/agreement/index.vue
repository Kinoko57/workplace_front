<template>
  <div>
    <div v-if="Show">
      <div class="agreement_bg">
        <div class="fifter">
          <search-fifter :add="btnPermission('gthcontract_create')" :module-name="'gthcontract'" :fifter="true" :add-text="'录入'" @search="fifterSearch" @addAction="addluru"/>
        </div>
        <div class="proxy_info">
          <el-tabs v-model="searchInfo.mode" type="card" class="tabs_table" @tab-click="choseType">
            <el-tab-pane v-for="(item,index) in typeList" :key="index" :label="item.text" :name="item.name">
              <el-table v-loading="loading" :data="tableData" :max-height="tableHeight" tooltip-effect="light" style="width: 100%" @sort-change="fifterTable">
                <!-- <el-table-column type="selection" width="50" /> -->
                <el-table-column width="20" />
                <el-table-column prop="name" label="客户" show-overflow-tooltip min-width="100" >
                  <template slot-scope="scope">
                    <span class="text_color">{{ scope.row.name }}</span>
                  </template>
                </el-table-column>
                <!-- <el-table-column label="名称"   prop="name"/> -->
                <el-table-column label="授权号" show-overflow-tooltip prop="protocolNo" min-width="150"/>
                <el-table-column prop="createdDate" label="签约日期" show-overflow-tooltip sortable="custom" min-width="150"/>
                <el-table-column prop="amount" label="保证金" sortable="custom" min-width="150">
                  <template slot-scope="scope">
                    <span class="text_color">￥{{ scope.row.amount }}</span>
                  </template>
                </el-table-column>
                <!-- <el-table-column label="回款金额" sortable="custom" >
                  <template slot-scope="scope">
                    <span class="text_color">￥{{ scope.row.receiveAmount }}</span>
                  </template>
                </el-table-column> -->
                <el-table-column label="合同附件" prop="file" min-width="200">
                  <template slot-scope="scope">
                    <!-- <a v-if="scope.row.file!=''" :href="fileUrl + scope.row.file[0].url" class="file" show-overflow-tooltip target="_blank">{{ scope.row.file[0].name }}</a>
                    <span v-else/> -->
                    <div v-if="scope.row.file!='' && scope.row.file!='[]' && scope.row.file!=1" class="fileStyle">
                      <div v-for="(item,index) of scope.row.file" :key="index">
                        <a :title="item.name" :href="fileUrl +item.url" class="file" target="_blank">{{ item.name }}</a>
                      </div>
                    </div>
                    <span v-else/>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="status" label="状态"  width="200" >
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.status==1" type="danger">回款不足</el-tag>
                    <el-tag v-if="scope.row.status==2" type="success">已回款</el-tag>
                    <el-tag v-show="scope.row.status==99" type="warning">作废</el-tag>
                  </template>
                </el-table-column> -->
                <el-table-column label="操作" width="200" align="center">
                  <template slot-scope="scope">
                    <el-button v-if="btnPermission('gthcontract_view')" type="text" size="small" @click.native="find(scope.row)">查看</el-button>
                    <el-button v-if="btnPermission('gthcontract_edit')" type="text" size="small" @click="editagreement(scope.row)">编辑</el-button>
                    <el-button v-if="btnPermission('gthcontract_cancellation')" type="text" size="small" @click="changeagreement(scope.row,'99')">作废</el-button>
                  </template>
                </el-table-column>

              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="info_page">
          <el-pagination
            :current-page="10"
            :page-sizes="[5, 10, 15,20]"
            :page-size="searchInfo.recPerPage"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            aligin="center"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"/>
        </div>
      </div>
      <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :title="modelTitle" :visible.sync="onShow" class="dialog agreementS" width="700px" @close="resetModel">
        <div class="show_scroll">
          <el-form v-if="onShow" ref="ruleForm" :label-position="labelPosition" :rules="rules" :model="ruleForm" label-width="120px" class="payment_form center">
            <el-form-item class="itemFrom" label="授权号：" prop="protocolNo" style="width:90%">
              <el-input v-model.trim="ruleForm.protocolNo" placeholder="请输入授权号" style="width:300px"/>
            </el-form-item>
            <el-form-item class="itemFrom" label="客户：" prop="name">
              <el-input v-model.trim="ruleForm.name" placeholder="请输入客户姓名" style="width:300px"/>
            </el-form-item>
            <el-form-item class="itemFrom" label="性别：" prop="sex">
              <el-radio v-model="ruleForm.sex" label="1">男</el-radio>
              <el-radio v-model="ruleForm.sex" label="2">女</el-radio>
            </el-form-item>
            <el-form-item class="itemFrom" label="手机号：" prop="mobile">
              <el-input v-model.trim="ruleForm.mobile" placeholder="请输入手机号" style="width:300px"/>
            </el-form-item>
            <el-form-item class="itemFrom" label="微信号：" prop="weixin">
              <el-input v-model.trim="ruleForm.weixin" placeholder="请输入微信号" style="width:300px"/>
            </el-form-item>
            <el-form-item class="itemFrom" label="身份证号：" prop="idcardNo">
              <el-input v-model.trim="ruleForm.idcardNo" placeholder="请输入身份证号" style="width:300px"/>
            </el-form-item>
            <!-- <el-form-item class="itemFrom" label="保证金：" prop="amount">
              <el-row>
                <el-col :span="1">
                  <span class="moneyIcon">￥</span>
                </el-col>
                <el-col :span="23">
                  <el-input v-model.trim="ruleForm.amount" placeholder="请输入保证金" type="number" style="width:283px" @blur="iptNum"/>
              </el-col></el-row>
            </el-form-item> -->
            <el-form-item class="itemFrom" label="合同附件：" prop="file">
              <el-upload
                ref="upload"
                :on-preview="handlePreview"
                :on-exceed="handleExceed"
                :before-upload="beforeUpload"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
                :file-list="fileList"
                :name="'files'"
                :action="uploadUrl"
                class="upload-demo"
                multiple>
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">请上传压缩包、word文档、excel文档、ppt演示文稿、pdf文档、图片文件</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button v-if="modelType=='new'" @click="resetsubmit">重 置</el-button>
          <el-button :loading="submitting" type="primary" @click="saveModel">保存</el-button>
        </div>
      </el-dialog>
    </div>
    <router-view/>
  </div>
</template>
<script>
// import { getAgreementInfo, editInfo, addgreement, changeagree } from '@/api/agreement'
import { gthAgreementInfo, gthEditInfo, gthAddgreement, gthAbolish } from '@/api/guangtonghui'
export default {
  name: 'Agreement',
  data() {
    const checkNum = (rule, value, callback) => {
      // console.log(value)
      if (!value) {
        return new Error('请输入保证金')
      } else {
        if (value < 0) {
          callback(new Error('输入的保证金不能为负数'))
        } else {
          callback()
        }
      }
    }
    return {
      fileUrl: '',
      uploadUrl: '',
      loading: true,
      onShow: false,
      Show: 'true',
      fileList: [],
      files: [],
      filesArr: [],
      modelTitle: '创建录入',
      labelPosition: 'right',
      modelType: '',
      total: 0,
      tableData: [{
        name: '',
        protocolNo: '',
        createdDate: '',
        amount: '',
        receiveAmount: '',
        file: '',
        status: ''
        // files:[{name: '',url: ''}]
      }
      ],
      typeList: [
        { text: '全部', name: 'all' }
        // { text: '已回款', name: 'back' },
        // { text: '回款不足', name: 'lack' }
      ],
      //  viewForm:{
      //   url:'',
      //   files:[{name:'',url:''}]
      // },
      ruleForm: {
        name: '',
        sex: '1',
        mobile: '',
        weixin: '',
        idcardNo: '',
        protocolNo: '',
        amount: '',
        file: ''
        // files:[{name: '',url: ''}]
      },
      tableHeight: 250,
      rules: {
        name: [
          { required: true, message: '客户姓名不能为空', trigger: 'blur' },
          // { pattern: /^[\u4E00-\u9FA5]{2,6}$/, message: '姓名只能是中文', trigger: 'blur' }
          { min: 2, max: 20, message: '长度为2-20', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '性别不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: false, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^[1][0-9]{10}$/, message: '手机号格式错误', trigger: 'blur' }
        ],
        weixin: [
          { required: false, message: '微信号不能为空', trigger: 'blur' },
          { pattern: /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/, message: '微信号以字母开头，包含6-20个字母、数字、下划线和减号', trigger: 'blur' }
        ],
        idcardNo: [
          { required: false, message: '身份证号不能为空', trigger: 'blur' }
          // { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号格式错误', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '保证金不能为空', trigger: 'blur' },
          //  {type:'number', message: '金额格式错误', trigger: 'blur' }
          { validator: checkNum, trigger: 'blur' }
        ],
        // receiveAmount: [
        //   { required: true, message: '保证金不能为空', trigger: 'blur' }
        //   //  { type:'number', message: '金额格式错误', trigger: 'blur' }
        // ],
        protocolNo: [
          { required: true, message: '授权号不能为空', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_]+$/, message: '授权号为数字、字母、_', trigger: 'blur' }
        ]
      },
      searchInfo: {
        mode: 'all', // 类型
        search: '', // 搜索关键字
        orderBy: 'id_desc', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0
      },
      options: [{
        value: '1',
        label: '1'
      },
      {
        value: '2',
        label: '2'
      }],
      submitting: false
    }
  },
  created() {
    console.log(document.body.offsetHeight, 11)
    this.tableHeight = document.body.offsetHeight - 330
    console.log(this.tableHeight)
  },
  mounted() {
    this.fileUrl = process.env.FILE_API
    console.log(this.fileUrl)
    this.uploadUrl = process.env.BASE_API + 'sys/file-upload'
    this.getList()
  },
  methods: {
    resetsubmit() {
      this.$refs['ruleForm'].resetFields()
      this.ruleForm = {
        name: '',
        sex: '1',
        mobile: '',
        weixin: '',
        idcardNo: '',
        protocolNo: '',
        amount: '',
        file: ''
      }
      this.fileList = []
      this.submitting = false
    },
    beforeUpload(file, fileList) {
      console.log(file)
      // const isPDF = file.type === 'application/pdf'
      // const isWord = file.type === 'application/msword'
      // const isPPT = file.type === 'application/vnd.ms-powerpoint'
      const isLt5M = file.size / 1024 / 1024 < 5
      if (file.name.indexOf('.png') === -1 && file.name.indexOf('.jpg') === -1 && file.name.indexOf('.bmp') === -1 && file.name.indexOf('.doc') === -1 && file.name.indexOf('.docx') === -1 && file.name.indexOf('.ppt') === -1 && file.name.indexOf('.pdf') === -1 && file.name.indexOf('.zip') === -1 && file.name.indexOf('.rar') === -1 &&
          file.name.indexOf('.xls') === -1 && file.name.indexOf('.xlsx') === -1 && file.name.indexOf('.csv') === -1) {
        // this.$message.warning('只能上传word/pdf/ppt/jpg/png文件!')
        this.$message.warning('文件格式不正确！')
        return false
      } else {
        this.files = [file]
        return true
      }
      this.files = [file]
    },
    handleSuccess(res, file) {
      // let list = {}
      if (res.code === 200 || res.code === '200') {
        this.filesArr.push({
          name: file.name,
          url: res.data.data[0].pathname
        })
        // list = [{
        //   name: file.name,
        //   url: res.data.data[0].pathname
        // }]
        // this.ruleForm.file = JSON.stringify(list)
        // this.saveModel()
      }
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
    handleRemove(file, fileList) {
      // this.ruleForm.file = ''
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
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning('当前限制选择 1 个文件，请删除后继续上传')
    },
    iptNum(e) {
      // const a = parseFloat(e.target.value).toFixed(2)
      if (parseInt(e.target.value) < 0) {
        this.ruleForm.amount = e.target.value
      } else {
        this.ruleForm.amount = parseFloat(e.target.value).toFixed(2)
      }
    },
    getList() {
      const that = this
      gthAgreementInfo(that.searchInfo).then(res => {
        console.log(res)
        that.loading = false
        that.tableData = res.data.gthcontracts
        for (var i = 0; i < that.tableData.length; i++) {
          // var num = typeof that.tableData[i].file
          // console.log(num)
          if (that.tableData[i].file !== '' && that.tableData[i].file !== '[]' && that.tableData[i].file !== '[object Object]') {
            that.tableData[i].file = JSON.parse(that.tableData[i].file)
          }
        }
        that.total = res.data.pager.recTotal
      })
    },
    // sureSave() {
    //   this.$refs.upload.submit()
    //   if (this.files.length === 0) {
    //     this.saveModel()
    //   }
    // },
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
      this.onShow = true
      this.modelType = 'new'
      this.modelTitle = '录入合同协议信息'
    },
    saveModel() {
      const that = this
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.submitting = true
          if (this.filesArr.length > 0) {
            this.ruleForm.file = JSON.stringify(this.filesArr)
          }
          if (this.ruleForm.mobile == '' && this.ruleForm.weixin == '') {
            that.$message({
              message: '手机号和微信号必须填一个',
              type: 'warning'
            })
          } else {
            if (that.modelType === 'new') {
            // 新增
              gthAddgreement(this.ruleForm).then(res => {
                console.log(res)
                if (res.code === 200 || res.code === '200') {
                  that.$message({
                    message: '添加成功！',
                    type: 'success'
                  })
                  that.resetModel()
                  that.getList()
                  that.submitting = false
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
              gthEditInfo(this.ruleForm).then(res => {
                console.log(res)
                if (res.code === 200 || res.code === '200') {
                  that.$message({
                    message: '更新成功！',
                    type: 'success'
                  })
                  that.resetModel()
                  that.getList()
                  that.submitting = false
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
          console.log('error submit!!')
          // this.$message.warning('信息填写不完整或者信息填写有误！')
          this.$nextTick(() => {
            this.checkFormErr()
          })
          return false
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
      this.getList()
    },
    resetModel() {
      console.log('重置表单')
      this.$refs['ruleForm'].resetFields()
      this.ruleForm = {
        name: '',
        sex: '1',
        mobile: '',
        weixin: '',
        idcardNo: '',
        protocolNo: '',
        amount: '',
        file: ''
      }
      this.fileList = []
      this.onShow = false
      this.filesArr = []
    },
    find(data) {
      this.Show = false
      this.$router.push({
        path: '/guangtonghui/agreementIndex/find?id=' + data.id
      })
    },
    editagreement(data) {
      console.log(data)
      this.ruleForm = { ...data }
      console.log(this.ruleForm.file)
      if (this.ruleForm.file === null || this.ruleForm.file === '' || this.ruleForm.file === '[]' || this.ruleForm.file === '[object Object]') {
        this.fileList = []
        this.ruleForm.file = []
      } else {
        const file = this.ruleForm.file
        console.log(file)
        this.fileList = file
      }
      this.ruleForm.file = JSON.stringify(this.ruleForm.file)
      console.log(this.ruleForm)
      // const that = this
      this.onShow = true
      this.modelType = 'edit'
      this.modelTitle = '编辑合同协议信息'
      // editInfo(data).then(res=>{
      //   this.loading=false;
      //   if (res.code === 200) {
      //     console.log(res)
      //     //  that.ruleForm= res.data
      //   }
      // })
    },
    changeagreement(event, states) {
      const that = this
      let msg = ''
      if (states !== '1' && states !== '2') {
        msg = '确定作废此合同协议？'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        gthAbolish(event.id, states).then(res => {
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
    background: #fff;
    padding: 10px;
    position: absolute;
    width: 100%;
    top: 0;
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
    // .payment_form{
    //     padding-bottom:10px;
    // }
    .dialog-footer{
        margin-top:-25px;
        margin-right: 30px;
    }
     .payment_form{
       margin: 0 10px;
       .itemFrom{
        margin-bottom: 22px;
      }
      // .input_tips{
      //   font-size: 12px;
      //   color: #AEAEAE;
      //   font-family: '微软雅黑 Regular', '微软雅黑';
      // }
    }
    .center{
       margin:0 40px;
    }
}

</style>

