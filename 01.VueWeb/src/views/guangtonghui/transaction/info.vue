<template>
  <div class="i_info_bg">
    <div class="info_left">
      <el-tabs v-model="infoType" type="border-card" class="follow_study" @tab-click="choseType">
        <el-tab-pane v-for="(item,index) in typeList" :key="index" :label="item.text" :name="item.name">
          <div class="infos_scroll">
            <ol v-if="infoType!='assign'" class="study_list">
              <li v-for="(item,index) in infoList" :key="index">
                <span v-if ="item.action=='create'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span> 创建。</span></span>
                <span v-if ="item.action=='lose'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span> 关闭。</span></span>
                <span v-if ="item.action=='delete'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span> 删除。</span></span>
                <span v-if ="item.action=='update'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span> 将 </span><span class="font_bold">{{ item.field }}</span><span> 修改为 </span><span class="font_bold">{{ item.new }}</span></span>
                <span v-if ="item.action=='assign'">
                  <span v-if="showFiles[index][0].name==''">
                    <span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span> 添加了跟进 </span><span>，内容为 </span><span class="font_bold">{{ item.comment.content }}</span>。
                  </span>
                  <span v-if="showFiles[index][0].name!=''">
                    <span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span> 添加了跟进 </span><span>，内容为 </span><span class="font_bold">{{ item.comment.content }}</span><span>，附件为 </span><span v-for="(item,index) of showFiles[index]" :key="index"><a :href="fileUrl+item.url" download="" style="color:#409EFF;text-decoration: underline;display:block;font-weight:normal;line-height: 0.5;">{{ item.name }}</a></span>
                  </span>
                </span>
                <span v-if ="item.action=='appoint'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span> 指派给 </span><span class="font_bold">{{ item.extra }}</span><span> {{ item.comment.salesName }} </span>。</span>
                <span v-if ="item.action=='editadress'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span > {{ item.extra }}</span><span class="font_bold"> {{ item.comment.areasName }} </span><span class="font_bold"> {{ item.comment.address }} </span>。</span>
              </li>
            </ol>
            <ol v-if="infoType=='assign'" class="study_list">
              <li v-for="(item,index) in infoList" :key="index">
                <span v-if="showFiles[index][0].name === ''"><span>{{ item.createdDate }} ，由 </span><span style="font-weight:bold">{{ item.userName }}</span><span>添加了跟进</span><span>，内容为</span><span style="font-weight:bold">{{ item.content }}</span>。</span>
                <span v-if="showFiles[index][0].name != ''"><span>{{ item.createdDate }} ，由 </span><span style="font-weight:bold">{{ item.userName }}</span><span>添加了跟进</span><span>，内容为 </span><span class="font_bold">{{ item.content }}</span><span>，附件为 </span><span v-for="(item,index) of showFiles[index]" :key="index"><a :href="fileUrl+item.url" download="" style="color:#409EFF;text-decoration: underline;display:block;font-weight:normal;line-height: 0.5;">{{ item.name }}</a></span></span>
              </li>
            </ol>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="跟进记录">配置管理</el-tab-pane>
        <el-tab-pane label="学习记录">角色管理</el-tab-pane> -->
      </el-tabs>
      <!-- <div class="follow_study">
        <div class="info_title">动态记录</div>
        <ol class="study_list">
          <li v-for="(item,index) in stydyList" :key="index">
            <span v-if ="item.action=='create'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span> 创建。</span></span>
            <span v-if ="item.action=='lose'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span> 关闭。</span></span>
            <span v-if ="item.action=='delete'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span> 删除。</span></span>
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
            <span v-if ="item.action=='editadress'"><span>{{ item.date }} ，由</span> <span class="font_bold">{{ item.actor }}</span><span > {{ item.extra }}</span><span class="font_bold"> {{ item.comment.areasName }} </span><span class="font_bold"> {{ item.comment.address }} </span>。</span>
          </li>
        </ol>
      </div>
      <div class="follow_info">
        <div class="info_title">跟进记录</div>
        <ol>
          <li v-for="(item,index) in assignList" :key="index">
            <span v-if="showFiles2[index].name === ''"><span>{{ item.createdDate }} ，由 </span><span style="font-weight:bold">{{ item.userName }}</span><span>添加了跟进</span><span>，内容为</span><span style="font-weight:bold">{{ item.content }}</span>。</span>
            <span v-if="showFiles2[index].name != ''"><span>{{ item.createdDate }} ，由 </span><span style="font-weight:bold">{{ item.userName }}</span><span>添加了跟进</span><span>，内容为 </span><span class="font_bold">{{ item.content }}</span><span>，附件为 </span><span class="font_bold"><a :href="fileUrl+showFiles2[index].url" download="" style="color:#409EFF;text-decoration: underline;font-weight:700">{{ showFiles2[index].name }}</a></span>。</span>
          </li>
        </ol>
        <div class="info_btn">
          <el-button plain @click="returnBack">返回</el-button>
        </div>
      </div> -->
    </div>

    <div class="info_right">
      <el-tabs type="border-card" class="basic_info">
        <el-tab-pane label="基本信息">
          <ul>
            <li><span>经销商名称：</span><span>{{ proxyInfo.name }}</span></li>
            <li><span>手机：</span><span>{{ proxyInfo.phone }}</span></li>
            <li><span>微信：</span><span>{{ proxyInfo.wechat }}</span></li>
            <li><span>邮箱：</span><span>{{ proxyInfo.email }}</span></li>

            <li><span>所属客服：</span><span>{{ proxyInfo.salesId }}</span></li>
            <!-- <li><span>所属客服：</span><span>{{ proxyInfo.serviceId }}</span></li> -->
            <li><span>经销商等级：</span><span>{{ proxyInfo.levleId }}</span></li>
            <li class="width_line"><span>地址：</span><span>{{ proxyInfo.areasName }}</span><span>{{ proxyInfo.address }}</span></li>
          </ul>
        </el-tab-pane>
      </el-tabs>
      <!-- <div class="basic_info">
        <div class="info_title">基本信息</div>
        <ul>
          <li><span>客户名称：</span><span>{{ proxyInfo.name }}</span></li>
          <li><span>手机：</span><span>{{ proxyInfo.phone }}</span></li>
          <li><span>微信：</span><span>{{ proxyInfo.wechat }}</span></li>
          <li><span>邮箱：</span><span>{{ proxyInfo.email }}</span></li>

          <li><span>所属销售：</span><span>{{ proxyInfo.salesId }}</span></li>
          <li><span>客户等级：</span><span>{{ proxyInfo.levleId }}</span></li>
          <li class="width_line"><span>地址：</span><span>{{ proxyInfo.areasName }}</span><span>{{ proxyInfo.address }}</span></li>
        </ul>
      </div> -->
      <!-- <div class="contact_info">
        <div class="info_title">联系方式</div>
        <ul>
          <li><span>联系人：</span><span>{{ proxyInfo.name }}</span></li>
          <li><span>手机号：</span><span>{{ proxyInfo.phone }}</span></li>
          <li><span>微信号：</span><span>{{ proxyInfo.wechat }}</span></li>
          <li><span>邮箱：</span><span>{{ proxyInfo.email }}</span></li>
          <li><span>QQ号：</span><span>{{ proxyInfo.qq }}</span></li>
        </ul>
      </div> -->
    </div>
  </div>
</template>

<script>
import {
  gthAgentview
} from '@/api/guangtonghui'
export default {
  name: 'IntentInfo',
  data() {
    return {
      infoType: 'assign',
      typeList: [{
        text: '跟进记录',
        name: 'assign'
      }, {
        text: '操作记录',
        name: 'history'
      }],
      agentId: '',
      proxyInfo: {},
      infoList: [],
      assignList: [],
      stydyList: [],
      fileList: [],
      files: [],
      fileUrl: '',
      uploadUrl: '',
      showFiles: [],
      showFiles2: []
    }
  },
  created() {

  },
  mounted() {
    this.fileUrl = process.env.FILE_API
    // 页面第一个渲染的函数
    this.agentId = this.$route.query.id
    // 获取列表
    this.getList()
  },
  methods: {
    getList() {
      const that = this
      gthAgentview(this.agentId, this.infoType).then(res => {
        if (res.code === 200 || res.code === '200') {
          // console.log(res.data.agentinfo)
          // console.log(res.data.historyinfo['2'].content)
          // 基本信息
          that.proxyInfo = res.data.gthagentbusinessinfo
          that.infoList = res.data.gthagentbusinesshistoryinfo
          // 跟进记录
          // that.assignList = res.data.gthagentbusinessassigninfo
          // 动态信息
          // that.stydyList = res.data.gthagentbusinesshistoryinfo
          // for (var i = 0; i < that.stydyList.length; i++) {
          //   if (that.stydyList[i].comment.file !== '' && that.stydyList[i].comment.file !== '[]' && that.stydyList[i].comment.file !== '[object Object]' && that.stydyList[i].comment.file !== undefined) {
          //     that.stydyList[i].comment.files = JSON.parse(that.stydyList[i].comment.file)
          //     // console.log(that.stydyList[i].comment.file, '////')
          //     // console.log(that.stydyList[i].comment.files, 'ddd')
          //   }
          // }
          if (that.infoType === 'assign') {
            for (var i = 0; i < that.infoList.length; i++) {
              that.showFiles[i] = { name: '', url: '' }
              if (that.infoList[i].file !== null && that.infoList[i].file !== 'null' && that.infoList[i].file !== '' && that.infoList[i].file !== '[object Object]') {
                console.log(that.infoList[i].file)
                that.infoList[i].file = JSON.parse(that.infoList[i].file)
                console.log(that.infoList[i].file)
                that.showFiles[i] = that.infoList[i].file
              } else {
                that.infoList[i].file = [{ name: '', url: '' }]
              }
            }
          }
          // for (var i = 0; i < that.infoList.length; i++) {
          //   that.showFiles[i] = { name: '', path: '' }
          //   if (that.infoList[i].action === 'assign') {
          //     if (that.infoList[i].comment.file !== null && that.infoList[i].comment.file !== 'null' && that.infoList[i].comment.file !== '') {
          //       console.log(typeof that.infoList[i].comment.file)
          //       that.infoList[i].comment.file = JSON.parse(that.infoList[i].comment.file)
          //       that.showFiles[i] = { name: that.infoList[i].comment.file[0].name, url: that.infoList[i].comment.file[0].url }
          //     } else {
          //       that.infoList[i].file = [{ name: '', path: '' }]
          //     }
          //   }
          // }
          that.$forceUpdate()
          console.log(that.showFiles, '...')
          // for (var j = 0; j < that.assignList.length; j++) {
          //   that.showFiles2[j] = { name: '', url: '' }
          //   if (that.assignList[j].file !== '' && that.assignList[j].file !== '[]' && that.assignList[j].file !== '[object Object]' && that.assignList[j].file !== 'null' && that.assignList[j].file !== null) {
          //     that.assignList[j].file = JSON.parse(that.assignList[j].file)
          //     that.showFiles2[j] = { name: that.assignList[j].file[0].name, url: that.assignList[j].file[0].url }
          //     console.log(that.assignList[j].file, 'bbbbbbb')
          //     console.log(that.assignList[j].file, '////')
          //   }
          // }
        }
      })
    },
    choseType() {
      this.infoList = []
      this.showFiles = []
      this.loading = true
      this.getList()
    },
    // 方法
    returnBack() {
      this.$router.go(-1)
    }
  }
}

</script>
<style lang="less" scoped>
  .i_info_bg {
    background: #d7d7d7;
    padding: 10px;
    position: relative;
    width: 100%;
    height: 100vh;
    top: 0;
    z-index: 99;
    overflow: hidden;

    .info_title {
      font-family: '微软雅黑 Bold', '微软雅黑';
      font-weight: 700;
      font-style: normal;
      font-size: 14px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 15px;
      color: #333333;
    }

    .info_left {
      float: left;
      width: 60%;
      // padding: 15px 25px;
      .follow_buy{
        padding: 15px 25px;
        background: #fff;
        margin-bottom: 15px;
        .buy_list{
          list-style: none;
          padding: 0;
          margin: 0;
          font-family: 'Arial Normal', 'Arial';
          font-weight: 400;
          font-style: normal;
          font-size: 14px;
          color: #333333;
          li{
            line-height: 28px;
            width: 100%;
            margin-left: 20px;
            span{
              width: 24%;
              display: inline-block;
            }
          }
        }
      }
      .follow_study{
        // padding: 15px 25px;
        background: #fff;
        margin-bottom: 15px;
        .study_list{
          padding: 0;
          margin: 0;
          font-family: 'Arial Normal', 'Arial';
          font-weight: 400;
          font-style: normal;
          font-size: 14px;
          color: #333333;
          height: 560px;
          li{
            line-height: 28px;
            // width: 100%;
            margin-left: 20px;
            .font_bold {
              font-weight: bold;
            }
            // span{
            //   width: 20%;
            //   display: inline-block;
            // }
            // span:nth-child(3){
            //   width: 30%;
            // }
            // span:nth-child(4){
            //   text-align: center;
            // }
          }

        }
      }
      .follow_info {
        padding: 15px 25px;
        background: #fff;
        color: #333333;
        font-family: 'Arial Normal', 'Arial';
        font-weight: 400;
        font-style: normal;
        font-size: 14px;
        border-width: 1px;
        border-style: solid;
        border-color: rgba(204, 204, 204, 1);
        border-radius: 3px;

        ol {
          padding-left: 15px;
          padding-right: 35px;
          margin: 0;
          height: 200px;
          overflow-y: scroll;
          li {
            line-height: 28px;
          }
        }

        .info_btn {
          text-align: right;
          border-top: 1px solid #ccc;
          padding-top: 10px;
        }

      }
    }

    .info_right {
      float: left;
      width: 38%;
      margin-left: 15px;

      .basic_info {
        background: #fff;
        // padding: 15px 25px;
        color: #333333;
        font-family: 'Arial Normal', 'Arial';
        font-weight: 400;
        font-style: normal;
        font-size: 14px;
        margin-bottom: 15px;
        border-width: 1px;
        border-style: solid;
        border-color: rgba(204, 204, 204, 1);
        border-radius: 3px;

        ul {
          list-style: none;
          margin: 0;
          padding: 0;
          height: 350px;
          // overflow-y: scroll;
          li {
            line-height: 28px;
          }
        }
      }

      .contact_info {
        background: #fff;
        padding: 15px 25px;
        color: #333333;
        font-family: 'Arial Normal', 'Arial';
        font-weight: 400;
        font-style: normal;
        font-size: 14px;
        border-width: 1px;
        border-style: solid;
        border-color: rgba(204, 204, 204, 1);
        border-radius: 3px;

        ul {
          list-style: none;
          margin: 0;
          padding: 0;

          li {
            line-height: 28px;
          }
        }
      }
    }
  }

</style>
