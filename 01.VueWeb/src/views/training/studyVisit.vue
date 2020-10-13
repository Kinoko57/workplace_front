<template>
  <div>
    <div class="find_wraper">
      <div class="find_top">
        <div class="find_top_t" ><el-button size="mini" pain icon="el-icon-arrow-left" @click="returnPage">返回</el-button></div>
        <div class="find_top_tit">
          <img src="@/assets/common/com_userName.png" alt="" srcset="">
          <span >{{ agentInfo.business_name }}</span>
        </div>
        <div class="find_top_content">
          <span v-if="belonger.realname!=''&&JSON.stringify(belonger)!='{}'" class="find_top_content_span">经销商归属：<span class="style_color">{{ belonger.realname }}</span></span>
          <span v-if="agentInfo.nextDate!='0000-00-00 00:00:00'&&agentInfo.nextDate!=undefined&&agentInfo.nextDate!=''">下次跟进：<span class="style_color" >{{ agentInfo.nextDate }}</span></span>
        </div>
        <div class="find_top_btn">
          <el-button plain size="mini" icon="el-icon-edit-outline" @click="changeInfo()">添加回访</el-button>
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
            <table class="view_dialog view_dialog_self" cellpadding="0" cellspacing="0">
              <tr class="view_line">
                <td class="line_title">姓名：</td>
                <td class="second_line">{{ agentInfo.name }}</td>
                <td class="line_title">性别：</td>
                <td class="second_line">{{ agentInfo.sex==1?'男':(agentInfo.sex== 2?'女':'' ) }}</td>
                <td class="line_title">手机 ：</td>
                <td class="second_line">
                  <span v-if="agentInfo.phone!=''">{{ agentInfo.phone }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">微信 ：</td>
                <td class="second_line">
                  <span v-if="agentInfo.wechat!=''">{{ agentInfo.wechat }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
                <td class="line_title">经销商等级：</td>
                <td class="second_line">
                  <span v-if="agentInfo.levleName!=''&&agentInfo.levleName!=undefined">{{ agentInfo.levleName }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
                <td class="line_title">经销商来源：</td>
                <td class="second_line">
                  <span v-if="agentInfo.source!=''">{{ agentInfo.source }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">所属销售：</td>
                <td class="second_line">
                  <span v-if="agentInfo.salesName!=''">{{ agentInfo.salesName }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
                <td class="line_title"> 客服号：</td>
                <td class="second_line">
                  <span v-if="agentInfo.serviceId!=''">{{ agentInfo.serviceId }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
                <td class="line_title">邮箱：</td>
                <td class="second_line">
                  <span v-if="agentInfo.email!=''">{{ agentInfo.email }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">生日：</td>
                <td class="second_line"><span v-if="agentInfo.birthday!=''">{{ agentInfo.birthday }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
                <td class="line_title">部门职务：</td>
                <td class="second_line"><span v-if="agentInfo.job!=''">{{ agentInfo.job }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
                <td class="line_title">qq：</td>
                <td class="second_line">
                  <span v-if="agentInfo.qq!=''">{{ agentInfo.qq }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">微信小号：</td>
                <td class="second_line">
                  <span v-if="agentInfo.smallWx!=undefined&&agentInfo.smallWx.length>0">
                    <span v-for="(item,index) of agentInfo.smallWx" :key="index">{{ item.label }},</span>
                  </span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
                <td class="line_title"> 微信连锁号：</td>
                <td class="second_line">
                  <span v-if="agentInfo.linkWx!=undefined&&agentInfo.linkWx.length>0" >
                    <span v-for="(item,index) of agentInfo.linkWx" :key="index">{{ item.label }}, </span>
                  </span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
                <td class="line_title" >福利信息：</td>
                <td class="second_line" ><span v-if="agentInfo.welfareCount>0">{{ agentInfo.welfareCount }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">授权号：</td>
                <td class="second_line">{{ agentInfo.auth_code }}</td>
                <td class="line_title">地址：</td>
                <td class="second_line" colspan="3"><span v-if="agentInfo.areasName!=''||agentInfo.address!=''">{{ agentInfo.areasName }}{{ agentInfo.address }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div :class="searchInfo.mode=='returnRecord'||searchInfo.mode=='returnInfo'||searchInfo.mode=='operation'||searchInfo.mode=='belonger'?'find_bottom_color':''" class="find_bottom" >
        <div v-if="searchInfo.mode=='overview'||searchInfo.mode=='returnRecord'" :class="searchInfo.mode=='returnRecord'?'find_bottom_left_color':''" class="find_bottom_left">
          <div v-if="searchInfo.mode=='overview'||searchInfo.mode=='returnRecord'" class="find_bottom_left_t" >
            <div class="chose_style_tit">回访记录</div>
            <div v-if="followInfo.length>0" :class="searchInfo.mode=='returnRecord'?'tit_width_long':''" class="follow_wraper block tit_width">
              <el-timeline>
                <el-timeline-item v-for="(item,index) of followInfo" :key="index" placement="top" type="primary">
                  <el-card>
                    <div class="follow_name">
                      <div><img src="@/assets/common/follow_user.png" alt="" srcset=""><span>{{ item.userName }}</span></div>
                      <el-button v-if="item.isEdit==1" size="mini" @click="editFollow(item)">编辑</el-button>
                    </div>
                    <div class="follow_top">
                      <span class="follow_right">跟进时间：{{ item.thisDate }}</span>
                      <span class="follow_right">跟进方式：{{ item.followType==0?'到访':'电话' }}</span>
                      <span>下次跟进：{{ item.nextDate }}</span>
                    </div>
                    <p class="follow_content">{{ item.content }}</p>
                    <div class="follow_bto">
                      <div class="follow_file">附件：<a v-if="item.file[0].name!=''" :href="fileUrl+item.file[0].url" :title="item.name" download="" class="file_up" target="_blank">{{ item.file[0].name }}</a><a v-else>暂无附件</a></div>
                      <!-- <div class="follow_timer"><img src="@/assets/common/folow_timer.png" alt="" srcset=""><span>{{ item.createdDate }}</span></div> -->
                    </div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
            <p v-else class="style_null">暂无回访记录~</p>
          </div>
        </div>
        <div v-if="searchInfo.mode=='overview'||searchInfo.mode=='returnInfo'||searchInfo.mode=='operation'||searchInfo.mode=='belonger'" :class="searchInfo.mode=='returnInfo'||searchInfo.mode=='operation'||searchInfo.mode=='belonger'?'find_bottom_right_color':''" class="find_bottom_right">
          <div v-if="searchInfo.mode=='overview'||searchInfo.mode=='belonger'" class="find_wraper_bottom find_bottom_right_t">
            <div class="chose_style_tit">归属人信息</div>
            <table class="view_dialog view_dialog_followUp tit_width" cellpadding="0" cellspacing="0">
              <tr class="view_line">
                <td class="line_title">姓名：</td>
                <td class="second_line">
                  <span v-if="belonger.realname!=''&&belonger.realname!=undefined&&belonger.realname!=''!=null">{{ belonger.realname }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">性别：</td>
                <td class="second_line">
                  <span v-if="belonger.gender!=''&&belonger.gender!=null&&belonger.gender!=undefined">{{ belonger.gender==1?'男':(belonger.gender==2?'女':'') }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">手机：</td>
                <td class="second_line">
                  <span v-if="belonger.mobile!=''&&belonger.mobile!=undefined&&belonger.mobile!=''!=null">{{ belonger.mobile }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
              <tr class="view_line">
                <td class="line_title">部门：</td>
                <td class="second_line">
                  <span v-if="belonger.name!=''&&belonger.name!=undefined&&belonger.name!=''!=null">{{ belonger.name }}</span>
                  <span v-else style="color:#999">暂无数据</span>
                </td>
              </tr>
            </table>
            <div>
              <table class="view_dialog view_dialog_follow" border="0" cellpadding="0" cellspacing="0">
                <tr class="view_line">
                  <td class="line_title">最近更新人：</td>
                  <td class="second_line">
                    <span :class="{null_data_style:nullStyle(agentInfo.editedBy)}">{{ agentInfo.editedBy|textNull }}</span>
                  </td>
                </tr>
                <tr class="view_line">
                  <td class="line_title">更新时间：</td>
                  <td class="second_line">
                    <span v-if="agentInfo.editedDate!='0000-00-00 00:00:00'&&agentInfo.editedDate!=undefined&&agentInfo.editedDate!=''&&agentInfo.editedDate!=null">{{ agentInfo.editedDate }}</span>
                    <span v-else style="color:#999">暂无数据</span>
                    <!-- {{ agentInfo.editedDate!='0000-00-00 00:00:00'?agentInfo.editedDate:'' }}</td> -->
                </td></tr>
              </table>
            </div>
          </div>
          <div v-if="searchInfo.mode=='overview'||searchInfo.mode=='operation'" class="find_bottom_right_t find_wraper_bottom">
            <div class="chose_style_tit">操作记录</div>
            <ul v-if="operateInfo.length>0" :class="searchInfo.mode=='operation'?'tit_width_long':''" class="tit_width">
              <li v-for="(item,index) of operateInfo" :key="index">
                <div class="operate"><span/></div>
                <div class="operate_con">
                  <span class="span_time">{{ item.date }}</span>
                  <span class="span_cont">
                    <span>由<span class="font_bold">{{ item.actor }}</span> <span>{{ item.comment.type==3?'添加了培训回访日志':'' }}，内容为 </span><span class="font_bold">{{ item.comment.content }}</span>。</span>
                  </span>
                </div>
              </li>
            </ul>
            <p v-else class="style_null">暂无操作记录~</p>
          </div>
          <div v-if="searchInfo.mode=='overview'||searchInfo.mode=='returnInfo'" class="find_bottom_right_t">
            <div class="chose_style_tit">回访人信息</div>
            <div style="margin:20px 30px" class="tit_width">
              <el-table
                :data="tableData"
                border>
                <el-table-column
                  prop="realname"
                  align="center"
                  label="姓名"
                  min-width="80"/>
                <el-table-column
                  prop="mobile"
                  align="center"
                  label="手机号"
                  min-width="100"/>
                <el-table-column
                  prop="name"
                  align="center"
                  min-width="100"
                  label="部门职务"/>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" :visible.sync="modelShow" :title="modelTitle" class="dialogModel" @close="resetModel">
      <!-- 跟进 -->
      <el-scrollbar v-if="modelShow" class="fixed_scroll over_scroll">
        <el-form
          ref="followAssignForm"
          :model="followAssignForm"
          class="modelForm"
          label-width="120px"
          label-position="right">
          <el-form-item label="跟进方式：" class="red_star_wraper">
            <i class="red_star">*</i>
            <el-select v-model="followAssignForm.followType" placeholder="请选择" style="width:250px">
              <el-option
                v-for="item in followType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                style="width:250px"/>
            </el-select>
            <el-date-picker
              v-model="followAssignForm.thisDate"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:250px"
              placeholder="选择日期时间"
              @change="dateChangelast"/>
          </el-form-item>
          <el-form-item label="跟进内容：" class="red_star_wraper">
            <i class="red_star">*</i>
            <el-input v-model.trim="followAssignForm.content" :rows="4" maxlength="500" type="textarea" autocomplete="off" style="width:500px" placeholder="请输入内容,最大长度为500" />
          </el-form-item>
          <el-form-item label="下次跟进时间：" class="red_star_wraper">
            <i class="red_star" style="position: absolute;left: -120px;">*</i>
            <el-date-picker
              v-model="followAssignForm.nextDate"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:500px"
              placeholder="请选择下次跟进时间"
              @change="dateChange"/>
          </el-form-item>
          <el-form-item label="附件：" prop="file" class="red_star_wraper">
            <i class="red_star" style="position: absolute;left: -63px;">*</i>
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
              style="width:500px"
              class="upload-demo"
              multiple>
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请上传只能上传jpg/png格式文件，文件大小不超过5M</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button @click="restForm">重 置</el-button>
        <el-button :loading="submitting" type="primary" @click="saveModel">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  assignProxy, saveAssign
} from '@/api/training'
import {
  followEdit
} from '@/api/agent'
export default {
  name: 'StudyVisit',
  data() {
    return {
      agentInfo: {},
      belonger: {},
      tableData: [],
      operateInfo: [],
      modelShow: false,
      modelTitle: '写新回访',
      followAssignForm: {
        content: '',
        thisDate: '',
        followType: '',
        file: [
          { name: '', url: '' }
        ],
        nextDate: ''
      },
      filesArr: [],
      proxyId: '',
      proxyInfo: {},
      assignList: [],
      fileUrl: '',
      assignInfo: {
        sourceId: this.$route.query.id,
        type: '1',
        content: '',
        file: [],
        nextDate: ''
      },
      name_edit: false,
      static_name: '',
      sex_edit: false,
      static_sex: '',
      phone_edit: false,
      static_phone: '',
      wechat_edit: false,
      static_wechat: '',
      showFiles: [],
      fileList: [],
      uploadUrl: '',
      searchInfo: {
        mode: 'overview', // 类型 指派 assign 全部 all 有我忽略 ignore 公海 public
        search: '', // 搜索关键字
        orderBy: '', // 排序字段
        pageID: 1, // 第几页
        recPerPage: 10, // 每页显示条数
        recTotal: 0 // 总条数
      },
      typeList: [
        { label: '概览信息', name: 'overview' },
        { label: '经销商信息', name: 'agent' },
        { label: '回访信息', name: 'returnInfo' },
        { label: '回访记录', name: 'returnRecord' },
        { label: '操作记录', name: 'operation' }
      ],
      followInfo: [],
      followType: [
        {
          value: '0',
          label: '到访'
        }, {
          value: '1',
          label: '电话'
        }
      ],
      follor_id: '',
      follow_type: 'add',
      submitting: false
    }
  },
  mounted() {
    this.fileUrl = process.env.FILE_API
    this.uploadUrl = process.env.BASE_API + 'sys/file-upload'
    this.proxyId = this.$route.params.id
    // 获取列表
    this.getListInfo()
  },
  methods: {
    editFollow(item) {
      console.log(item)
      this.followAssignForm = {
        content: item.content,
        thisDate: item.thisDate,
        followType: item.followType,
        file: item.file,
        nextDate: item.nextDate
      }
      this.follor_id = item.id
      this.fileList = item.file
      this.filesArr = item.file
      this.modelType = 'follow'
      this.follow_type = 'edit'
      this.modelShow = true
      this.modelTitle = '编辑跟进'
    },
    dateChangelast(date) {
      if (date) {
        const nowTime = new Date()
        const lastTime = new Date(date)
        console.log(nowTime, lastTime)
        if (lastTime > nowTime) {
          this.$message({
            message: '跟进时间必须小于当前时间',
            type: 'warning'
          })
          this.followAssignForm.thisDate = ''
        }
      }
    },
    dateChange(date) {
      if (date) {
        const nowTime = new Date()
        const pickTime = new Date(date)
        console.log(nowTime, pickTime)
        if (pickTime < nowTime) {
          this.$message({
            message: '下次跟进时间必须大于当前时间',
            type: 'warning'
          })
          this.followAssignForm.nextDate = ''
        }
      }
    },
    getListInfo() {
      const that = this
      assignProxy(this.proxyId).then(res => {
        that.loading = false
        if (res.code === 200 || res.code === '200') {
          console.log(res.data.historyinfo.length, res.data.historyinfo)
          that.agentInfo = res.data.agentinfo
          that.salesInfo = res.data.agentinfo.sales
          if (res.data.historyinfo.length > 0) {
            for (var i = 0; i < res.data.historyinfo.length; i++) {
              if (res.data.historyinfo[i].file != '') {
                res.data.historyinfo[i].file = JSON.parse(res.data.historyinfo[i].file)
              } else {
                res.data.historyinfo[i].file = [
                  { name: '', url: '' }
                ]
              }
            }
          }
          that.tableData = res.data.backInfo
          that.followInfo = res.data.historyinfo != null ? res.data.historyinfo : []
          that.operateInfo = res.data.execquery != null ? res.data.execquery : []
          that.belonger = res.data.saleInfo
        }
      })
    },
    uploadChange(file, filelist) {
      console.log(filelist, 'ddd')
      if (filelist.length && filelist.length >= 1) {
        this.$refs.followAssignForm.validateField('classFile')
      }
    },
    resetModel() {
      this.followAssignForm = {
        content: '',
        thisDate: '',
        followType: '',
        file: [
          { name: '', url: '' }
        ],
        nextDate: ''
      }
      this.modelShow = false
      this.submitting = false
    },
    restForm() {
      this.followAssignForm = {
        content: '',
        thisDate: '',
        followType: '',
        file: [
          { name: '', url: '' }
        ],
        nextDate: ''
      }
    },
    changeInfo() {
      this.modelShow = true
      this.follow_type = 'add'
    },
    saveModel() {
      // 新跟进
      const that = this
      if (this.followAssignForm.followType === '') {
        this.$message.warning('请选择跟进方式！')
      } else if (this.followAssignForm.thisDate === '') {
        this.$message.warning('请选择跟进日期！')
      } else if (this.followAssignForm.content === '') {
        this.$message.warning('跟进内容不可以为空！')
      } else if (this.followAssignForm.nextDate === '') {
        this.$message.warning('请选择下次跟进日期！')
      } else if (this.filesArr.length <= 0) {
        this.$message.warning('请上传附件！')
      } else {
        this.$refs['followAssignForm'].validate((valid) => {
          if (valid) {
            that.submitting = true
            this.followAssignForm.file = JSON.stringify(that.filesArr)
            if (that.follow_type == 'add') {
              const obj = {
                type: 3,
                sourceId: this.proxyId,
                ...this.followAssignForm
              }
              saveAssign(this.proxyId, obj).then(res => {
                that.submitting = false
                if (res.code === 200 || res.code === '200') {
                  that.$message({
                    message: '添加成功！',
                    type: 'success'
                  })
                  this.$message({
                    message: '保存成功！',
                    type: 'success'
                  })
                  that.filesArr = []
                  that.fileList = []
                  that.resetModel()
                  that.getListInfo()
                } else {
                  that.submitting = false
                  that.$message({
                    message: 'warning',
                    type: res.msg
                  })
                }
              })
            } else {
              followEdit(that.follor_id, this.followAssignForm).then(res => {
                console.log(res)
                that.submitting = false
                if (res.code === 200 || res.code === '200') {
                  this.$message({
                    message: '保存成功！',
                    type: 'success'
                  })
                  that.filesArr = []
                  that.fileList = []
                  that.resetModel()
                  that.getListInfo()
                } else {
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
      }
    },
    handleClick(tab, event) {
      console.log(event, tab)
      this.searchInfo.mode = tab.name
    },
    returnPage() {
      this.$router.back(-1)
    },
    beforeUpload(file, fileList) {
      const isLt5M = file.size / 1024 / 1024 < 5
      // if (!isLt5M) {
      //   this.$message.warning('文件大小不能超过5M！')
      //   return false
      // }
      if (file.name.indexOf('.png') === -1 && file.name.indexOf('.jpg') === -1 && file.name.indexOf('.jpeg') === -1) {
        // this.$message.warning('文件格式必须是.png或.jpg或.jpeg或.bmp的后缀名！')
        this.$message.warning('文件格式不正确！')
        return false
      }
    },
    handlePreview(file) {
      console.log(file)
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
        this.assignInfo.file = ''
      }
      console.log(this.filesArr)
    },
    handleExceed(files, fileList) {
      this.$message.warning('当前限制选择 1 个文件，请删除后继续上传')
    }
  }

}
</script>
<style lang="less" scoped>
.webcat{
  margin-top: 5px;
}
.style_null{
  width: 100%;
  text-align: center;
  color: #666;
  padding-top: 20px;
  font-size: 12px;
}
.find_wraper .find_bottom {
  /deep/ .el-table--border{
    border-right: none;
    border-bottom: none;
    padding: 0;
    // margin: 20px;
    width: 100%;
  }
}
.find_wraper_bottom{
  margin-bottom: 10px;
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
      button{
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
      margin-bottom: 10px;
      span{
        display: inline-block;
        height: 40px;
        line-height: 40px;
      }
      .find_top_content_span{
         margin-right: 20px;
      }
        .style_color{
          color: #333;
        }
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
        margin:20px 90px 20px 30px;
        border-bottom: none;
        max-width: none;
        .view_line{
           .line_title{
             border-left: 1px solid #e4e4e4;
             color: #666;
            font-weight: normal;
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
      width: 60%;
      .find_bottom_left_t{
         background: #fff;
         padding-bottom: 30px;
         .follow_wraper{
           padding-top: 20px;
           /deep/ .el-card.is-always-shadow{
             box-shadow:none
           }
          .el-timeline{
              margin-right: 30px;
              margin-left: -10px;
          }
          /deep/ .el-card__body{
            // width: 520px;
            background-color: rgba(247, 251, 254, 1);
            border-color: rgba(215, 232, 244, 1);
          }
           .follow_name{
              color: #333;
              display: flex;
              justify-content: space-between;
              font-size: 13px;
              img{
                vertical-align: middle;
                width: 16px;
                height: 18px;
                margin-right: 10px;
              }
              :nth-child(3){
                color: #666;
              }
           }
            .follow_top{
              padding-left: 26px;
              color: #333;
              margin-top: 15px;
              font-size: 12px;
              .follow_right{
                padding-right: 8px;
              }
           }
           .follow_content{
             color: #999;
             padding-left: 26px;
            overflow:hidden;/*超出隐藏*/
            text-overflow:ellipsis;/*文本溢出时显示省略标记*/
            display:-webkit-box;/*设置弹性盒模型*/
            -webkit-line-clamp:3;/*文本占的行数,如果要设置2行加...则设置为2*/
            -webkit-box-orient:vertical;/*子代元素垂直显示*/
           }
           .follow_bto{
            //  display: flex;
            //  align-items: center;
            //  justify-content:space-between;
             .follow_file{
               font-size: 12px;
               padding-left: 26px;
               color: #333;
               .file_up{
                  word-break: break-all;
               }
               a{
                color: rgb(60, 142, 233);
               }
             }
             .follow_timer{
               font-size: 12px;
               color: #999;
                img{
                vertical-align: middle;
                width: 12px;
                height: 13px;
                margin-right: 10px;
              }
             }
           }
         }
      }
    }
    .find_bottom_right{
      width: 39%;
      .find_bottom_right_t{
        background: #fff;
        padding-bottom: 30px;
      }
      ul{
       padding:0;margin:0;list-style-type:none;
          padding: 20px 20px 20px 30px;
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
            width: 98%;
            span.span_time{
              display: block;
              color: #999;
              margin-bottom: 4px;
            }
            span.span_cont{
              display: block;
              color: #666;
              width: 100%
            }
          }
        }
      }
    }
    .view_dialog_followUp{
      // max-width: 320px;
      margin: 20px 30px 0 30px;
       .view_line{
           .line_title{
             color: #666;
            font-weight: normal;
           }
        }
    }
     .view_dialog_self{
       margin-left: 30px;
     }
     .view_dialog_follow{
        border:0;
        margin: 20px 30px 0 30px;
        .view_line{
          td{
             border: 0;
          }
           .line_title{
            background: none;
            border: 0;
            color: #666;
            font-weight: normal;
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
      width: 100%
    }

  }
  .find_bottom_color .find_bottom_left_color{
    width: 100%;
    .tit_width{
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
/deep/::-webkit-scrollbar-track {
  background: #f3f3f3;
  // background: #fff;
}
.modelForm {
    margin: 0 10px;
    .red_star_wraper {
      position: relative;
      .red_star {
        position: absolute;
        left: -90px;
        font-size: 13px;
        font-family: 'Arial Normal', 'Arial';
        color: #f56c6c;
      }
    }
  }
</style>
