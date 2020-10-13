<template>
  <div>
    <div class="find_wraper">
      <div class="find_top">
        <div class="find_top_t" ><el-button size="mini" pain icon="el-icon-arrow-left" @click="returnPage">返回</el-button></div>
        <div class="find_top_tit">
          <img src="@/assets/common/com_userName.png" alt="" srcset="">
          <span>{{ agreementInfo.agent }}</span>
        </div>
        <div class="find_top_content">
          <span class="find_top_content_span">授权号：<span class="style_color">{{ agreementInfo.protocolNo }}</span></span>
          <span>保证金状态：<span class="style_color">{{ agreementInfo.status=='1'?'回款不足':'已回款' }}</span></span>
        </div>
        <div class="find_top_btn">
          <el-button v-if="btnPermission('contract_edit')" plain size="mini" icon="el-icon-edit-outline" @click="changeInfo('edit')">编辑信息</el-button>
          <el-button v-if="btnPermission('contract_cancellation')" plain size="mini" icon="el-icon-edit-outline" @click="changeInfo('remove')">作废保证金</el-button>
        </div>
      </div>
      <div class="find_center">
        <div class="find_center_click">
          <div class="find_center_chose">
            <el-tabs v-model="searchInfo.mode" @tab-click="handleClick">
              <el-tab-pane v-for="(item,index) in typeList" :key="index" :label="item.label" :name="item.name"/>
            </el-tabs>
          </div>
          <div v-if="searchInfo.mode=='overview'||searchInfo.mode=='agent'" class="find_center_tit">
            <div class="chose_style_tit">经销商信息</div>
            <table class="view_dialog view_dialog_self" cellpadding="0" cellspacing="0" style="margin:">
              <tr class="view_line">
                <td class="line_title">姓名：</td>
                <td :class="{null_data_style:nullStyle(agreementInfo.agent)}" class="second_line" >{{ agreementInfo.agent|textNull }}</td>
                <td class="line_title">性别：</td>
                <td class="second_line">{{ agreementInfo.gender==0?'男':(agreementInfo.gender==1?'女':'') }}</td>
                <td class="line_title">手机：</td>
                <td :class="{null_data_style:nullStyle(agreementInfo.mobile)}" class="second_line">{{ agreementInfo.mobile |textNull }}</td>
              </tr>
              <tr class="view_line">
                <td class="line_title">微信：</td>
                <td :class="{null_data_style:nullStyle(agreementInfo.weixin)}" class="second_line">{{ agreementInfo.weixin |textNull }}</td>
                <td class="line_title">身份证号：</td>
                <td :class="{null_data_style:nullStyle(agreementInfo.idcardNo)}" class="second_line">{{ agreementInfo.idcardNo|textNull }}</td>
                <td class="line_title">经销商等级：</td>
                <td :class="{null_data_style:nullStyle(levels)}" class="second_line">{{ levels|textNull }}</td>
              </tr>
              <tr class="view_line">
                <td class="line_title">备注：</td>
                <td :class="{null_data_style:nullStyle(agreementInfo.remark)}" class="second_line">{{ agreementInfo.remark|textNull }}</td>
                <td class="line_title"/>
                <td class="second_line"/>
                <td class="line_title"/>
                <td class="second_line"/>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div :class="searchInfo.mode=='agrement'||searchInfo.mode=='operation'?'find_bottom_color':''" class="find_bottom">
        <div v-if="searchInfo.mode=='overview'||searchInfo.mode=='agrement'" :class="searchInfo.mode=='agrement'?'find_bottom_left_color':''" class="find_bottom_left">
          <div class="chose_style_tit"> 保证金信息</div>
          <div style="padding:20px 30px 40px 20px;background:#fff" class="tit_width">
            <table class="view_dialog" style="margin:0 auto;border-left:0;" cellpadding="0" cellspacing="0">
              <tr class="view_line">
                <td class="line_title">授权号：</td>
                <td :class="{null_data_style:nullStyle(agreementInfo.protocolNo)}" class="second_line">{{ agreementInfo.protocolNo|textNull }}</td>
                <td class="line_title">签约日期：</td>
                <td :class="{null_data_style:nullStyle(agreementInfo.createdDate)}" class="second_line">{{ agreementInfo.createdDate|textNull }}</td>
              </tr>
              <tr class="view_line">
                <td class="line_title">保证金金额：</td>
                <td :class="{null_data_style:nullStyle(agreementInfo.amount)}" class="second_line">{{ agreementInfo.amount|textNull }}</td>
                <td class="line_title">回款金额 ：</td>
                <td :class="{null_data_style:nullStyle(agreementInfo.receiveAmount)}" class="second_line">{{ agreementInfo.receiveAmount |textNull }}</td>
              </tr>
              <!-- <tr class="view_line">
                <td class="line_title">保证金：</td>
                <td class="second_line">{{ agreementInfo.assureMoney }}</td>
                <td class="line_title">保证金附件 ：</td>
                <td class="second_line">
                  <span v-if="agreementInfo.file!=''&& agreementInfo.file !== '[]' && agreementInfo.file !== '[object Object]'" style="float:left">
                    <a v-for="(item,index) in agreementInfo.files" :key="index" :title="item.name" :href="fileUrl+item.url" download="" style="color:#409EFF;text-decoration: underline;display:block;word-break: break-all;">{{ item.name }}</a>
                  </span>
                </td>
              </tr> -->
              <tr class="view_line">
                <td class="line_title">保证金附件 ：</td>
                <td class="second_line">
                  <span v-if="agreementInfo.file!=''&& agreementInfo.file !== '[]' && agreementInfo.file !== '[object Object]'" style="float:left">
                    <a v-for="(item,index) in agreementInfo.files" :key="index" :title="item.name" :href="fileUrl+item.url" download="" style="color:#409EFF;text-decoration: underline;display:block;word-break: break-all;">{{ item.name }}</a>
                  </span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
                <td class="line_title">状态：</td>
                <td class="second_line">{{ agreementInfo.status=='1'?'回款不足':'已回款' }}</td>
              </tr>
            </table>
          </div>
        </div>
        <div v-if="searchInfo.mode=='overview'||searchInfo.mode=='operation'" :class="searchInfo.mode=='operation'?'find_bottom_right_color':''" class="find_bottom_right">
          <div class="chose_style_tit" >操作记录</div>
          <ul v-if="agreeList.length>0" :class="searchInfo.mode=='operation'?'tit_width_long':''" class="tit_width">
            <li v-for="(item,index) in agreeList" :key="index">
              <div class="operate"><span/></div>
              <span class="operate_con">
                <span class="span_time">{{ item.date }}</span>
                <span class="span_cont">
                  <span v-if ="item.action=='create'"><span>由</span> <span class="font_bold">{{ item.actor }}</span><span> 创建。</span></span>
                  <span v-if ="item.action=='alter'">
                    <span>由</span>
                    <span class="font_bold">{{ item.actor }}</span>
                    <span>将</span>
                    <span class="font_bold">{{ item.field }}</span>
                    <span>从</span>
                    <span class="font_bold">{{ item.old }}</span>
                    <span>变更为</span>
                    <span class="font_bold">{{ item.new }}</span>
                  </span>
                  <span v-if ="item.action=='payment'">
                    <span>由</span>
                    <span class="font_bold">{{ item.actor }}</span>
                    <span>{{ item.extra }}</span>。
                  </span>
                  <span v-if ="item.action=='edit'">
                    <span class="font_bold">由{{ item.actor }}</span>
                    <span> 将 </span>
                    <span class="font_bold">{{ item.field }}</span><span v-if="item.field!=''&&item.extra != ''" style="font-weight:700;">,</span><span v-if="item.extra !== '' && item.extra !== '[]' && item.extra !== '[object Object]'" style="font-weight:700;">保证金附件</span>
                    <span> 修改成 </span>
                    <span>
                      <span v-if="item.new !== '' && item.extra === '' || item.extra === '[]' || item.extra === '[object Object]'">{{ item.new }}</span>
                      <span v-if="item.new === '' && item.extra !== '' && item.extra !== '[]' && item.extra !== '[object Object]'" class="font_bold"><a v-for="(item,index) in item.extra" :key="index" :href="fileUrl+item.url" download="" style="color:#409EFF;text-decoration: underline">{{ item.name }}&nbsp;&nbsp;</a></span>
                      <span v-if="item.new !== '' && item.extra !== '' && item.extra !== '[]' && item.extra !== '[object Object]'" class="font_bold">{{ item.new }},<a v-for="(item,index) in item.extra" :key="index" :href="fileUrl+item.url" download="" style="color:#409EFF;text-decoration: underline">{{ item.name }}&nbsp;&nbsp;</a></span>
                    </span>
                  </span>
                </span>
              </span>
            </li>
          </ul>
          <p v-else class="style_null">暂无操作记录~</p>
        </div>
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :title="modelTitle" :visible.sync="modelShow" class="dialog agreementS" @close="resetModel">
      <el-scrollbar class="fixed_scroll over_scroll">
        <el-form v-if="modelShow" ref="ruleForm" :label-position="'right'" :rules="rules" :model="ruleForm" label-width="120px" class="payment_form modelForm center">
          <el-form-item class="itemFrom" label="授权号：" prop="protocolNo">
            <el-input v-model.trim="ruleForm.protocolNo" disabled placeholder="请输入授权号" style="width:500px" />
          </el-form-item>
          <el-form-item class="itemFrom" label="客户名称：" prop="agent">
            <el-input v-model.trim="ruleForm.agent" placeholder="请输入客户名称" style="width:500px" />
          </el-form-item>
          <el-form-item class="itemFrom" label="性别：" prop="gender" >
            <el-radio v-model="ruleForm.gender" label="0">男</el-radio>
            <el-radio v-model="ruleForm.gender" label="1">女</el-radio>
          </el-form-item>
          <el-form-item class="itemFrom" label="手机号：" prop="mobile" >
            <el-input v-model.trim="ruleForm.mobile" placeholder="请输入手机号" style="width:500px" />
          </el-form-item>
          <el-form-item class="itemFrom" label="微信号：" prop="weixin" >
            <el-input v-model.trim="ruleForm.weixin" placeholder="请输入微信号" style="width:500px" />
          </el-form-item>
          <el-form-item class="itemFrom" label="经销商等级：" prop="level" >
            <el-select v-model="ruleForm.level" disabled placeholder="请选择经销商等级" style="width:500px" filterable>
              <el-option v-for="(item,index) in agentLevelList" :label="item.label" :value="item.value" :key="index"/>
            </el-select>
          </el-form-item>
          <el-form-item class="itemFrom" label="身份证号：" prop="idcardNo" >
            <el-input v-model.trim="ruleForm.idcardNo" placeholder="请输入身份证号" style="width:500px" />
          </el-form-item>
          <el-form-item class="itemFrom" label="保证金金额：" prop="amount" >
            <template >
              <el-input v-model.trim="ruleForm.amount" disabled placeholder="请输入保证金金额(含保证金)" autocomplete="off" min="0" style="width:500px" type="number" @blur="iptNum">
                <i slot="suffix" class="el-input__icon" style="font-style:normal">￥</i>
              </el-input>
            </template>
          </el-form-item>
          <!-- <el-form-item class="itemFrom" label="保证金：" prop="assureMoney" >
            <template >
              <el-input v-model.trim="ruleForm.assureMoney" placeholder="请输入保证金" min="0" style="width:500px" type="number" @blur="iptNum1">
                <i slot="suffix" class="el-input__icon" style="font-style:normal">￥</i>
              </el-input>
            </template>
          </el-form-item> -->
          <el-form-item class="itemFrom" label="协议备注：" prop="remark" >
            <el-input v-model.trim="ruleForm.remark" :rows="2" placeholder="请输入协议备注，最大长度为120个字" type="textarea" style="width:500px" />
          </el-form-item>
          <el-form-item class="itemFrom" label="保证金附件：" prop="file">
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
              style="width:500px"
              class="upload-demo"
              multiple>
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请上传压缩包、word文档、excel文档、ppt演示文稿、pdf文档、图片文件</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button @click="restForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAgreementIdinfo, editInfo, changeagree } from '@/api/agreement'
import { addTransformationLabel } from '@/api/agent'
export default {
  name: 'Find',
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
      agreementInfo: {},
      activities: [],
      typeList: [
        { label: '概览信息', name: 'overview' },
        { label: '经销商信息', name: 'agent' },
        { label: '保证金信息', name: 'agrement' },
        { label: '操作记录', name: 'operation' }
      ],
      searchInfo: {
        mode: 'overview', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      levels: '',
      agreementId: '',
      loading: 'false',
      onshow: [],
      fileUrl: '',
      ruleForm: {
        agent: '',
        gender: '0',
        mobile: '',
        weixin: '',
        level: '',
        idcardNo: '',
        protocolNo: '',
        amount: '',
        createdDate: '',
        remark: '',
        assureMoney: '',
        file: ''
      },
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
          // { pattern: /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/, message: '微信号以字母开头，包含6-20个字母、数字、下划线和减号', trigger: 'blur' }
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
        amount: [
          { required: true, message: '保证金金额不能为空', trigger: 'blur' },
          { validator: checkNum, trigger: 'blur' }
        ],
        protocolNo: [
          { required: true, message: '授权号不能为空', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_]{2,25}$/, message: '授权号为数字、字母、_', trigger: 'blur' }
        ]
      },
      agreeList: [
      ],
      fileList: [],
      filesArr: [],
      files: [],
      uploadUrl: '',
      modelShow: false,
      modelTitle: '写新回访',
      submitting: false,
      agentLevelList: []
    }
  },
  mounted() {
    this.fileUrl = process.env.FILE_API
    this.uploadUrl = process.env.BASE_API + 'sys/file-upload'
    this.agreementId = this.$route.query.id
    // // 获取列表
    this.getListInfo()
    this.level()
  },
  methods: {
    beforeUpload(file, fileList) {
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
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleRemove(file, fileList) {
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
    iptNum1(e) {
      if (parseInt(e.target.value) < 0) {
        this.ruleForm.assureMoney = e.target.value
      } else {
        this.ruleForm.assureMoney = parseFloat(e.target.value).toFixed(2)
      }
    },
    saveModel() {
      const that = this
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.filesArr.length > 0) {
            this.ruleForm.file = JSON.stringify(this.filesArr)
          } else {
            this.ruleForm.file = ''
          }
          console.log(this.ruleForm)
          if (this.ruleForm.mobile == '' && this.ruleForm.weixin == '') {
            that.$message({
              message: '手机号和微信号必须填一个',
              type: 'warning'
            })
          } else {
            this.submitting = true
            // 更新
            editInfo(this.ruleForm).then(res => {
              if (res.code === 200 || res.code === '200') {
                that.$message({
                  message: '保证金更新成功！',
                  type: 'success'
                })
                that.resetModel()
                that.getListInfo()
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
          // this.$message.warning('信息填写不完整或者信息填写有误！')
          this.$nextTick(() => {
            this.checkFormErr()
          })
          return false
        }
      })
    },
    resetModel() {
      this.ruleForm = {
        agent: '',
        gender: '0',
        mobile: '',
        weixin: '',
        level: '',
        idcardNo: '',
        protocolNo: '',
        amount: '',
        // receiveAmount: '',
        createdDate: '',
        remark: '',
        assureMoney: '',
        file: ''
        // files:[{name: '',url: ''}]
      }
      this.modelShow = false
      this.submitting = false
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
    restForm() {
      this.ruleForm = {
        agent: '',
        gender: '0',
        mobile: '',
        weixin: '',
        level: '',
        idcardNo: '',
        protocolNo: '',
        amount: '',
        // receiveAmount: '',
        createdDate: '',
        remark: '',
        assureMoney: '',
        file: ''
        // files:[{name: '',url: ''}]
      }
    },
    changeInfo(type) {
      if (type == 'edit') {
        this.modelTitle = '编辑保证金信息'
        this.modelShow = true
        this.ruleForm = (({ agent, amount, assureMoney, createdDate, file, gender, id, idcardNo, level, mobile, protocolNo, remark, status, weixin }) => ({ agent, amount, assureMoney, createdDate, file, gender, id, idcardNo, level, mobile, protocolNo, remark, status, weixin }))(this.agreementInfo)
        if (this.ruleForm.file === null || this.ruleForm.file === '' || this.ruleForm.file === '[]' || this.ruleForm.file === '[object Object]') {
          this.fileList = []
          this.ruleForm.file = [{ name: '', url: '' }]
        } else {
          this.ruleForm.file = JSON.parse(this.ruleForm.file)
          this.fileList = this.ruleForm.file
        }
      } else {
        const that = this
        this.$confirm('确定作废此保证金,一旦作废不可恢复哦~？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          changeagree(that.agreementId, '99').then(res => {
            if (res.code === 200 || res.code === '200') {
              that.$message({
                type: 'success',
                message: res.data.message
              })
              this.modelShow = false
              that.loading = true
              that.$router.back(-1)
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
      console.log(this.ruleForm)
    },
    handleClick(tab, event) {
      this.searchInfo.mode = tab.name
    },
    getListInfo() {
      const that = this
      getAgreementIdinfo(that.agreementId).then(res => {
        if (res.code === 200 || res.code === '200') {
          that.agreementInfo = res.data.contract
          if (that.agreementInfo.file !== '') {
            that.agreementInfo.files = JSON.parse(that.agreementInfo.file)
            that.filesArr = JSON.parse(that.agreementInfo.file)
          }
          console.log(that.agreementInfo)
          that.agreeList = res.data.history
          if (that.agreeList.length !== 0) {
            for (var i = 0; i < that.agreeList.length; i++) {
              if (that.agreeList[i].extra !== '' && that.agreeList[i].extra !== '[]' && that.agreeList[i].extra !== '[object Object]') {
                that.agreeList[i].extra = JSON.parse(that.agreeList[i].extra)
              }
            }
          }
          addTransformationLabel().then(res => {
            if (res.code === 200) {
              for (var j = 0; j < res.data.length; j++) {
                if (that.agreementInfo.level === res.data[j].value) {
                  that.levels = res.data[j].label
                }
              }
            }
          })
        }
      })
    },
    returnPage() {
      this.$router.back(-1)
    }
  }
}

</script>
<style lang="less" scoped>
/deep/::-webkit-scrollbar-track{
  background:#f3f3f3
}
.view_dialog .view_line .line_title{
      border-left: 1px solid #e4e4e4;
}
.style_null{
  width: 100%;
  text-align: center;
  color: #666;
  padding-top: 20px;
  font-size: 12px;
}
.find_wraper{
  position: absolute;
  width: 100%;
  top: 0;
  height:calc(100vh - 90px);
  overflow-y: scroll;
  overflow-x: hidden;
  .find_top{
    padding:10px 20px 30px 40px;
    background-color: rgba(255, 255, 255, 1);
    color: #333;
    background: #fff;
    border:1px solid rgba(233, 233, 233, 1);
    .find_top_t{
      width: 100%;
      text-align: right;
      font-size: 14px;
      span{
        cursor: pointer;
      }
    }
    .find_top_tit{
      height: 30px;
      // line-height: 40px;
      font-size: 18px;
      font-weight: 600;
      img{
        width: 26px;
        height: 20px;
        vertical-align: middle;
      }
    }
    .find_top_content{
      color: #999999;
      font-size: 12px;
      height: 40px;
      line-height: 40px;
      margin-bottom: 10px;
      .find_top_content_span{
        margin-right: 20px;
        .style_color{
          color: #333;
        }
      }
    }
    .find_top_btn{

    }
  }
  .find_center{
    margin-top: 10px;
    /deep/ .el-tabs__header{
      margin: 0
    }
    .find_center_click{
      width: 100%;
      margin-bottom: 10px;
      .find_center_chose{
        background: #fff;
        padding: 0 20px;
      }
      .find_center_tit{
        padding-bottom: 20px;
        background: #fff;
        margin-top: 5px;
      }
      .view_dialog_self{
        background: #fff;
        border: 1px solid #e4e4e4;
        border-left: 0;
        margin:20px 100px 20px 20px;
        border-bottom: none;
        max-width: none;
        .view_line{
           .line_title{
             border-left: 1px solid #e4e4e4;
           }
        }
      }
    }
  }
  .find_bottom{
    width: 100%;
    display: flex;
    // margin-bottom: 100px;
    justify-content: space-between;
    .find_bottom_left{
      // background: #fff;
      width: 67%;
    }
    .find_bottom_right{
      background: #fff;
      width: 32%;
      ul{
        padding:0;margin:0;list-style-type:none;
        padding: 20px 20px 30px 30px;
        background: #fff;
        li{
          padding:0;margin:0;list-style-type:none;
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          div.operate{
            margin-right: 10px;
            span{
              display:block;
              width:10px;
              height: 10px;
              border-radius: 50%;
               background: rgb(0,153,204);
            }
          }
         .operate_con{
            font-size: 12px;
            span.span_time{
              display: block;
              word-break: break-all;
              color: #999;
              margin-bottom: 4px;
            }
            span.span_cont{
              display: block;
              color: #666;
              width: 100%;
               word-break: break-all;
              // overflow: hidden;
              // display: -webkit-box;//将元素设为盒子伸缩模型显示
              // -webkit-box-orient: vertical;//伸缩方向设为垂直方向
              // -webkit-line-clamp: 3;//超出3行隐藏，并显示省略号
            }
         }
        }
      }
    }
  }
// tab修改背景切换样式
.find_bottom_color{
  background: #fff;
}
.find_bottom_color .find_bottom_right_color{
    width: 100%;
    .tit_width{
      width: 39%
    }
    .tit_width_long{
      width: 100%
    }
  }
  .find_bottom_color .find_bottom_left_color{
    width: 100%;
    .tit_width{
      width: 60%
    }
     .tit_width_long{
      width: 100%
    }
  }
  .chose_style_tit{
    padding-left: 20px;
    background-color: rgba(249, 250, 252, 1);
    height: 40px;
    line-height: 40px;
    font-weight: 700;
    color: #333;
    font-size: 13px;
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
/deep/::-webkit-scrollbar-track {
  background: #f3f3f3;
  // background: #fff;
}
</style>
