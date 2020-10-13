<template>
  <div>
    <div class="find_bg">
      <div class="find_detail">
        <div class="title">
          <svg-icon icon-class="menu" />
          <span>查看/</span>
          <span class="name">{{ agreementInfo.protocolNo }}</span>
        </div>
        <div class="info_title">合同信息</div>
        <div class="info">
          <ul>
            <li><span>授权号：</span><span>{{ agreementInfo.protocolNo }}</span></li>
            <li><span>客户：</span><span>{{ agreementInfo.name }}</span></li>
            <li><span>性别：</span><span>{{ agreementInfo.sex==1?'男':'女' }}</span></li>
            <li><span>手机号：</span><span>{{ agreementInfo.mobile }}</span></li>
            <li><span>微信号：</span><span>{{ agreementInfo.weixin }}</span></li>
            <li><span>身份证号：</span><span>{{ agreementInfo.idcardNo }}</span></li>
            <!-- <li><span>邮箱：</span><span>{{ agreementInfo.mobile }}</span></li> -->
            <!-- <li><span>客服：</span><span>{{ agreementInfo.agent }}</span></li> -->
            <!-- <li class="width_line"><span>地址：</span><span>{{ agreementInfo.address }}</span></li> -->
            <!-- <li class="width_line"><span>备注：</span><span>{{ agreementInfo.remark }}</span></li> -->
          </ul>
        </div>
        <div class="info_title"><i class="red_star"/><span>合同金额及合同附件</span></div>
        <div class="find_info">
          <ul>
            <li><span>合同金额：</span><span>￥{{ agreementInfo.amount }}</span></li>
            <li style="overflow:hidden">
              <span style="float:left">合同附件：</span>
              <!-- {{agreementInfo.file}} -->
              <span v-if="agreementInfo.file!=''&& agreementInfo.file !== '[]' && agreementInfo.file !== '[object Object]'" style="float:left">
                <span v-for="(item,index) in agreementInfo.files" :key="index">
                  <!-- {{index}} -->
                  <a :href="fileUrl+item.url" download="" style="color:#409EFF;text-decoration: underlinel;display:block">{{ item.name }}</a>
                </span>
              </span>
              <a v-else/>
            </li>
          </ul>
        </div>
        <!-- <div class="info_title"><i class="red_star"/><span>保证金及协议:</span></div> -->
        <!-- <div class="find_info">
          <ul>
            <li><span>保证金：</span><span>{{ agreementInfo.amount }}</span></li>
            <li><span>协议：</span>
              <a v-if="agreementInfo.file!=''&& agreementInfo.file !== '[]' && agreementInfo.file !== '[object Object]'" :href="fileUrl+agreementInfo.files[0].url" style="color:#409EFF;text-decoration: underline">{{ agreementInfo.files[0].name }}</a>
              <a v-else/>
            </li>
          </ul>
        </div> -->
        <div class="sure_btn find_info">
          <el-button @click="returnPage">返回</el-button>
        </div>
      </div>
      <div class="find_history">
        <div class="title">
          <svg-icon icon-class="timing" />
          <span>历史记录</span>
        </div>
        <div class="history_info">
          <ol>
            <li v-for="(item,index) in agreeList" :key="index">
              <span v-if ="item.action=='create'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span> 创建。</span></span>
              <span v-if ="item.action=='edit'">
                <span>{{ item.date }} ，由</span>
                <span class="font_bold">{{ item.actor }}</span>
                <span> 将 </span>
                <span class="font_bold">{{ item.field }}</span><span v-if="item.cause !== '' && item.cause !== '[]' && item.cause !== '[object Object]'" style="font-weight:700;">,合同附件</span>
                <span> 修改成 </span>
                <span>
                  <span v-if="item.new !== '' && item.cause === '' || item.cause === '[]' || item.cause === '[object Object]'" class="font_bold">{{ item.new }}</span>
                  <span v-if="item.new === '' && item.cause !== '' && item.cause !== '[]' && item.cause !== '[object Object]'" class="font_bold"><span v-for="(item,index) in item.cause" :key="index"><a :href="fileUrl+item.url" download="" style="color:#409EFF;text-decoration: underline">{{ item.name }}&nbsp;&nbsp;</a></span></span>
                  <span v-if="item.new !== '' && item.cause !== '' && item.cause !== '[]' && item.cause !== '[object Object]'" class="font_bold">{{ item.new }},<span v-for="(item,index) in item.cause" :key="index"><a :href="fileUrl+item.url" download="" style="color:#409EFF;text-decoration: underline">{{ item.name }}&nbsp;&nbsp;</a></span></span>
                </span>
              </span>
              <span v-if="item.action=='cancellation'"><span>{{ item.date }} , 由</span><span class="font_bold">{{ item.actor }}</span><span> 作废。</span></span>
              <!-- <span v-if ="item.action=='edit'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span> 删除。</span></span> -->
              <!-- <span v-if ="item.action=='edit'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span> 添加了跟进 </span><span>，内容为 </span><span class="font_bold">{{ item.comment.content }}</span>。</span>
              <span v-if ="item.action=='appoint'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span> 指派给 </span><span class="font_bold">{{ item.extra }}</span><span> {{ item.comment.salesId }} </span>。</span>
              <span v-if ="item.action=='edit'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span> 转化。</span></span> -->
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { gthLook } from '@/api/guangtonghui'
export default {
  name: 'Find',
  data() {
    return {
      agreementId: '',
      loading: 'false',
      onshow: [],
      fileUrl: '',
      // onshows:false,
      agreementInfo: {
        agent: '',
        gender: '',
        protocolNo: '',
        createdDate: '',
        amount: '',
        receiveAmount: '',
        file: '',
        status: '',
        address: '',
        remark: '',
        files: [{ name: '', url: '' }]
      },
      agreeList: [
      ],
      type: '',
      fileList: [],
      files: [],
      uploadUrl: ''
    }
  },
  mounted() {
    this.fileUrl = process.env.FILE_API
    this.uploadUrl = process.env.BASE_API + 'sys/file-upload'
    this.agreementId = this.$route.query.id
    console.log(this.agreementId)
    // // 获取列表
    this.getList()
  },
  methods: {
    beforeUpload(file, fileList) {
      console.log(file)
      // const isPDF = file.type === 'application/pdf'
      // const isWord = file.type === 'application/msword'
      // const isPPT = file.type === 'application/vnd.ms-powerpoint'
      const isLt5M = file.size / 1024 / 1024 < 5
      if (file.name.indexOf('.png') === -1 && file.name.indexOf('.jpg') === -1 && file.name.indexOf('.doc') === -1 && file.name.indexOf('.docx') === -1 && file.name.indexOf('.ppt') === -1 && file.name.indexOf('.pdf') === -1) {
        this.$message.warning('文件格式不正确！')
        return false
      } else if (!isLt5M) {
        this.$message.warning('文件格式不正确！')
      } else {
        this.files = [file]
        return true
      }
      this.files = [file]
    },
    handleSuccess(res, file) {
      let list = {}
      if (res.code === 200 || res.code === '200') {
        list = [{
          name: file.name,
          url: res.data.data[0].pathname
        }]
        this.ruleForm.file = JSON.stringify(list)
        console.log(this.ruleForm.file)
        this.saveModel()
      }
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning('当前限制选择 1 个文件，请删除后继续上传')
    },
    getList() {
      const that = this
      gthLook(that.agreementId).then(res => {
        console.log(res, 'fffffffff')
        if (res.code === 200 || res.code === '200') {
          that.agreementInfo = res.data.gthcontractInfo
          console.log(that.agreementInfo)
          if (that.agreementInfo.file !== '' && that.agreementInfo.file !== '[]' && that.agreementInfo.file !== '[object Object]') {
            that.agreementInfo.files = JSON.parse(that.agreementInfo.file)
            console.log(that.agreementInfo.files[0], 11)
          }
          that.agreeList = res.data.historyInfo
          console.log(that.agreeList, 'zzzz')
          if (that.agreeList.length !== 0) {
            for (var i = 0; i < that.agreeList.length; i++) {
              console.log(that.agreeList[i], 'fdsfsd')
              if (that.agreeList[i].cause !== '' && that.agreeList[i].cause !== '[]' && that.agreeList[i].cause !== '[object Object]') {
                that.agreeList[i].cause = JSON.parse(that.agreeList[i].cause)
                console.log(that.agreeList[i], 'd')
              }
            }
          }
          // if (that.agreeList.length !== 0) {
          //   console.log(that.agreeList)
          //   for (var i = 0; i < that.agreeList.length; i++) {
          //     if (that.agreeList[i].action === 'edit') {
          //       that.agreeList[i].type = 0// 默认type为0, 1为纯字符串，2、为纯文件，3、为文件加字符串
          //       var obj = null
          //       console.log(that.agreeList[i].new, 'jhg')
          //       try {
          //         // eslint-disable-next-line no-eval
          //         obj = eval('(' + that.agreeList[i].new + ')')
          //         console.log(obj, 'wwwwwwwhhhh')
          //       // eslint-disable-next-line no-empty
          //       } catch (e) {}
          //       var xx = Object.prototype.toString.call(obj)
          //       console.log(xx, 's')
          //       if (xx === '[object Object]' || xx === '[object Array]') {
          //         console.log(that.agreeList[i].new.split(',['))
          //         if (that.agreeList[i].new.split(',[').length === 1) {
          //           that.agreeList[i].new = JSON.parse(that.agreeList[i].new)
          //           // debugger
          //           console.log(11)
          //           that.agreeList[i].type = 2
          //         } else {
          //           const a = that.agreeList[i].new.split(',[')[0]
          //           const b = JSON.parse(that.agreeList[i].new.split(',[')[1].split(']')[0]).name
          //           console.log(JSON.parse(that.agreeList[i].new.split(',[')[1].split(']')[0]), '1111')
          //           const arr = []
          //           arr.push({
          //             a, b
          //           })
          //           that.agreeList[i].new = arr
          //           that.agreeList[i].type = 3
          //         }
          //       } else {
          //         console.log(that.agreeList[i].new, '2')
          //         that.agreeList[i].type = 1
          //       }
          //     }
          //   }
          //   console.log(that.onshow, 'zzzzz')
          // }
        }
      })
    },
    beforeRemove(files, fileList) {
      return this.$confirm(`确定移除 ${files.name}？`)
    },
    // handleExceed(files, fileList) {
    //   this.$message.warning('当前限制选择 1 个文件，请删除后继续上传')
    // },
    returnPage() {
      this.$router.back(-1)
    }
  }
}

</script>
<style lang="less" scoped>
  .find_bg {
    background: #fff;
    padding: 10px 0;
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

    .find_detail {
      float: left;
      width: 70%;
      border-top: 1px solid #f2f2f2;
      border-right: 1px solid #f2f2f2;

      .info_title {
        font-family: '黑体 Regular', '黑体';
        font-weight: 400;
        font-style: normal;
        color: #515151;
        padding:10px;
        padding-bottom: 0;
        font-size: 14px;
        line-height: 25px;
        margin: 0 10px;
         border-bottom: 1px solid #d7d7d7;
        span {
          font-family: '微软雅黑 Regular', '微软雅黑';
          color: #333;
        }
      }

      .info {
        margin: 10px 0;
        margin-left: 10px;
        margin-right: 18px;
        padding: 0 10px;
        padding-bottom: 10px;

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

      .find_info {
        margin: 10px 0;
        margin-left: 10px;
        margin-right: 18px;
        ul{
          padding-left:10px;
          li{
            list-style: none;
            line-height: 24px;
          }
        }
        .info_upload{
          .el-button{
            width: 170px;
            background-color: #eee;
          }
        }
      }

      .sure_btn {
        padding-top: 30px;
        margin-left:87%;
      }

    }
    .find_history {
      float: right;
      width: 30%;
      border-top: 1px solid #f2f2f2;
      border-left: 1px solid #f2f2f2;
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
