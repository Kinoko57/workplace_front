<template>
  <div>
    <div class="folllow_bg">
      <div class="follow_detail">
        <div class="title">
          <svg-icon icon-class="menu" />
          <span>跟进/</span>
          <span class="name">{{ proxyInfo.name }}</span>
        </div>
        <div class="info_title">客户信息</div>
        <div class="info">
          <ul>
            <!-- 无表示新增的 -->
            <li><span>姓名：</span><span>{{ proxyInfo.name }}</span></li>
            <li><span>性别：</span><span>{{ proxyInfo.sex==1?'男':'女' }}</span></li>
            <li><span>手机号：</span><span>{{ proxyInfo.phone }}</span></li>
            <li><span>微信号：</span><span>{{ proxyInfo.wechat }}</span></li>
            <!-- <li><span>经销商等级：</span><span>{{ proxyInfo.levleId }}</span></li> -->
            <li><span>客户来源：</span><span>{{ proxyInfo.source }}</span></li>
            <li><span>QQ号：</span><span>{{ proxyInfo.qq }}</span></li>
            <li><span>邮箱：</span><span>{{ proxyInfo.email }}</span></li>
            <li><span>销售：</span>
              <span v-if="proxyInfo.salesId !== ''">{{ proxyInfo.salesId }}</span>
              <span v-else>未指派销售</span>
            </li>
            <!-- <li><span>备注：</span><span>无</span></li> -->
            <!-- <li class="width_line"><span>地址：</span><span>{{ proxyInfo.address }}</span></li> -->
            <!-- <li class="width_line"><span>备注：</span><span>的框架萨拉丁尽量靠近可点击啊减掉了结束了</span></li> -->
          </ul>
        </div>
        <div class="info_title"><i class="red_star">*</i><span>跟进内容:</span></div>
        <div class="follow_info">
          <el-input :rows="6" v-model="assignInfo.content" type="textarea" placeholder="请输入跟进内容" />
        </div>
        <div class="info_title">附件：</div>
        <div class="info_upload follow_info">
          <el-upload
            ref="upload"
            :on-preview="handlePreview"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :limit="1"
            :name="'files'"
            :file-list="fileList"
            :action="uploadUrl"
            class="upload-demo"
            multiple>
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">请上传图片，且不超过5MB</div>
          </el-upload>
        </div>
        <!-- <div class="info_title">下次联系时间：</div>
        <div class="meeting_time follow_info">
          <el-date-picker v-model="assignInfo.nextDate" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" @change="controlDate"/>
        </div> -->
        <div class="sure_btn follow_info">
          <el-button :loading="submitting" type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="returnPage">返回</el-button>
        </div>
      </div>
      <div class="follow_history">
        <div class="title">
          <svg-icon icon-class="timing" />
          <span>历史记录</span>
        </div>
        <div class="history_info">
          <ol>
            <li v-for="(item,index) in assignList" :key="index">
              <span v-if ="item.action=='receive'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span> 领取。</span></span>
              <span v-if ="item.action=='import'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span> 导入。</span></span>
              <span v-if ="item.action=='create'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span> 创建。</span></span>
              <span v-if ="item.action=='update'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span> 将 </span><span class="font_bold">{{ item.field }}</span><span> 修改为 </span><span class="font_bold">{{ item.new }}</span></span>
              <span v-if ="item.action=='assign'">
                <span v-if="showFiles[index].name==''">
                  <span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span> 添加了跟进 </span><span>，内容为 </span><span class="font_bold">{{ item.comment.content }}</span>。
                </span>
                <span v-if="showFiles[index].name!=''">
                  <span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span> 添加了跟进 </span><span>，内容为 </span><span class="font_bold">{{ item.comment.content }}</span><span>，附件为 </span><span class="font_bold"><a :href="fileUrl+showFiles[index].url" download="" style="color:#409EFF;text-decoration: underline">{{ showFiles[index].name }}</a></span>。
                </span>
              </span>
              <span v-if ="item.action=='appoint'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span> 指派给 </span><span class="font_bold">{{ item.extra }}</span><span> {{ item.comment.salesName }} </span>。</span>
              <span v-if ="item.action=='transformation'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span> 转化。</span></span>
              <span v-if ="item.action=='study'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span>参加学习 课程</span><span class="font_bold">《{{ item.comment.lessionname }}》。</span></span>
              <span v-if ="item.action=='gthagentingore'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span> 忽略。</span></span>
              <span v-if ="item.action=='addicon'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span > {{ item.extra }}</span><span class="font_bold"> {{ item.comment.iconName }} </span>。</span>
              <span v-if ="item.action=='grantwelfare'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span > {{ item.extra }}</span><span class="font_bold"> {{ item.comment.remarks }} </span>。</span>
              <span v-if ="item.action=='addblacklist'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span > 加入黑名单。</span></span>
              <span v-if ="item.action=='removeblacklist'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span > 移出黑名单。</span></span>
              <span v-if ="item.action=='bindwx'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span > {{ item.extra }}</span><span class="font_bold"> {{ item.comment.wechat }} </span>。</span>
              <span v-if ="item.action=='editadress'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span > {{ item.extra }}</span><span class="font_bold"> {{ item.comment.address }} </span>。</span>
              <span v-if ="item.action=='lose'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span >  关闭。</span></span>
              <span v-if ="item.action=='resale'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span >  二次销售</span><span class="font_bold">,备注：{{ item.comment.remarks }}</span>。</span>
              <!-- <span>{{ item.date }} ，由</span>
              <span class="font_bold">{{ item.actor }}</span>
              <span>{{ item.action =='create'?'创建':'' }}</span>

              <span>{{ item.action =='assign'?'添加了跟进':'' }}</span>
              <span v-if="item.action == 'assign'">，内容为</span>
              <span v-if="item.action == 'assign'" class="font_bold">{{ item.comment.content }}</span>
              <span>。</span> -->

            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  followagent, saveagentFollow
} from '@/api/guangtonghui'
export default {
  name: 'FollowUp',
  data() {
    return {
      proxyId: '',
      proxyInfo: {},
      assignList: [],
      fileUrl: '',
      assignInfo: {
        sourceId: this.$route.query.id,
        type: '2',
        content: '',
        file: [],
        nextDate: ''
      },
      fileList: [],
      files: [],
      uploadUrl: '',
      showFiles: [],
      submitting: false
    }
  },
  mounted() {
    this.fileUrl = process.env.FILE_API
    this.uploadUrl = process.env.BASE_API + 'sys/file-upload'
    this.proxyId = this.$route.query.id
    // 获取列表
    this.getList()
  },
  methods: {
    controlDate(date) {
      console.log(date)
      const currentDate = new Date()
      const selectDate = new Date(date)
      if (selectDate < currentDate) {
        this.$message({
          message: '下次跟进时间必须大于当前时间',
          type: 'warning'
        })
        this.assignInfo.nextDate = ''
      }
    },
    getList() {
      const that = this
      followagent(this.proxyId).then(res => {
        if (res.code === 200 || res.code === '200') {
          // console.log(res.data.agentinfo)
          // console.log(res.data.historyinfo['2'].content)
          that.proxyInfo = res.data.gthagentinfo
          that.assignList = res.data.historyinfo
          for (var i = 0; i < that.assignList.length; i++) {
            that.showFiles[i] = [{ name: '', url: '' }]
            if (that.assignList[i].action === 'assign') {
              if (that.assignList[i].comment.file !== null && that.assignList[i].comment.file !== 'null' && that.assignList[i].comment.file !== '') {
                console.log(typeof that.assignList[i].comment.file)
                that.assignList[i].comment.file = JSON.parse(that.assignList[i].comment.file)
                that.showFiles[i] = { name: that.assignList[i].comment.file[0].name, url: that.assignList[i].comment.file[0].url }
              } else {
                that.assignList[i].file = [{ name: '', url: '' }]
              }
            }
            that.$forceUpdate()
          }
        }
      })
    },
    beforeUpload(file, fileList) {
      const isLt5M = file.size / 1024 / 1024 < 5
      // if (!isLt5M) {
      //   this.$message.warning('文件大小不能超过5M！')
      //   return false
      // }
      if (file.name.indexOf('.png') === -1 && file.name.indexOf('.jpg') === -1 && file.name.indexOf('.jpeg') === -1 && file.name.indexOf('.bmp') === -1) {
        // this.$message.warning('文件格式必须是.png或.jpg或.jpeg或.bmp的后缀名！')
        this.$message.warning('文件格式不正确！')
        return false
      }
    },
    handlePreview(file) {
      console.log(file)
    },
    handleSuccess(res, file) {
      let list = {}
      if (res.code === 200 || res.code === '200') {
        list = [{ name: file.name, url: res.data.data[0].pathname }]
        this.assignInfo.file = JSON.stringify(list)
        // this.onSubmit()
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning('当前限制选择 1 个文件，请删除后继续上传')
    },
    // sureSave() {
    //   this.$refs.upload.submit()
    //   if (this.files.length === 0) {
    //     this.onSubmit()
    //   }
    // },
    onSubmit() {
      //  else if (this.assignInfo.nextDate === '') {
      //   this.$message({
      //     type: 'warning',
      //     message: '您当前未选择下次来联系时间'
      //   })
      // }

      // saveAssign
      if (this.assignInfo.content === '') {
        this.$message({
          type: 'warning',
          message: '您当前未填写跟进内容'
        })
      } else {
        const that = this
        this.submitting = true
        saveagentFollow(this.proxyId, this.assignInfo).then(res => {
          this.submitting = false
          if (res.code === 200 || res.code === '200') {
            that.$message({
              message: '跟进内容添加成功！',
              type: 'success'
            })
            that.getList()
            that.assignInfo = {
              sourceId: this.proxyId,
              type: 2,
              content: '',
              file: [],
              nextDate: ''
            }
            this.fileList = []
            this.submitting = false
          } else {
            that.$message({
              message: 'warning',
              type: res.msg
            })
            this.submitting = false
          }
        })
      }
    },
    returnPage() {
      this.$router.back(-1)
    }
  }

}

</script>
<style lang="less" scoped>
  .folllow_bg {
    background: #fff;
    // padding: 10px 0;
    padding: 0;
    position: relative;
    width: 100%;
    height: 100vh;
    top: 0;
    z-index: 99;
    overflow: hidden;

    .title {
      height: 50px;
      line-height: 50px;
      padding: 0 10px;
      border-bottom: 1px solid #f2f2f2;

      .svg-icon {
        color: #333333;
        font-size: 18px;
      }

      span {
        font-family: '微软雅黑 Bold', '微软雅黑';
        font-weight: 700;
        font-size: 14px;
        color: #333333;
      }

      .name {
        font-family: '微软雅黑 Regular', '微软雅黑';
        font-weight: 400;
        font-size: 12px;
        color: #5E5E5E;
      }
    }

    .follow_detail {
      float: left;
      width: 70%;
      // border-top: 1px solid #f2f2f2;
      border-right: 1px solid #f2f2f2;

      .info_title {
        font-family: '黑体 Regular', '黑体';
        font-weight: 400;
        font-style: normal;
        color: #515151;
        padding: 10px;
        padding-bottom: 0;
        font-size: 14px;

        span {
          font-family: '微软雅黑 Regular', '微软雅黑';
          color: #666666;
        }
      }

      .info {
        margin: 10px 0;
        margin-left: 10px;
        margin-right: 18px;
        padding: 0 10px;
        padding-bottom: 10px;
        border: 1px solid #d7d7d7;
        border-radius: 5px;

        ul {
          list-style: none;
          overflow: hidden;
          padding-left: 0;
          margin: 0;

          li {
            float: left;
            width: 30%;
            padding-top: 10px;

            span {
              font-family: '微软雅黑 Regular', '微软雅黑';
              font-weight: 400;
              font-style: normal;
              color: #A1A1A1;
              font-size: 14px;
            }
          }

          .width_line {
            width: 100%;
          }
        }
      }

      .follow_info {
        margin: 10px 0;
        margin-left: 10px;
        margin-right: 18px;
      }

      .sure_btn {
        padding-top: 10px;
      }

    }

    .follow_history {
      float: right;
      width: 30%;
      // border-top: 1px solid #f2f2f2;
      // border-left: 1px solid #f2f2f2;

      .history_info {
        li {
          font-family: '微软雅黑 Regular', '微软雅黑';
          color: #333333;
          font-size: 12px;
          font-weight: 400;
          margin: 10px 0;
          .font_bold {
            font-weight: bold;
          }
        }
      }
    }
  }

</style>
