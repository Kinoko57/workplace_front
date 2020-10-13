<template>
  <!-- <scroller lock-x :height="infoHeight"> -->
  <div class="view_bg">
    <!-- <div class="view_head">
      <div class="view_left">
        <p class="view_title">{{ viewInfo.title }}</p>
        <p><span class="view_time" v-if="viewType == 'report'">{{ viewInfo.createdDate }}</span></p>
        <p><span class="view_time" v-if="viewType != 'report'">{{ viewInfo.releaseDate }}</span></p>
      </div>
    </div> -->
    <div class="view_detail">
      <!-- <div class="view_line" v-if="viewType == 'report'">
        <span class="line_title">发布人：</span>
        <span class="second_line">{{ viewInfo.createdBy }}</span>
      </div> -->
      <div class="view_line">
        <div class="view_tit">
          <span></span><span>{{viewInfo.title}}</span>
        </div>
        <div class="view_createdby" v-if="viewType=='report'">
          <div class="view_createdby_l"><img src="@/assets/icon/notice1.png" alt="" srcset=""><span>{{ viewInfo.createdDate }}</span></div>
          <div class="view_createdby_l"><img src="@/assets/icon/user.png" alt="" srcset=""><span>{{ viewInfo.createdBy }}</span></div>
          <div class="view_createdby_l"><img src="@/assets/icon/eye.png" alt="" srcset=""><span>{{ viewInfo.readNum }}</span></div>
        </div>
        <div class="view_createdby" v-if="viewType=='message'">
          <div class="view_createdby_l"><img src="@/assets/icon/notice1.png" alt="" srcset=""><span>{{ viewInfo.releaseDate }}</span></div>
          <div class="view_createdby_l"><img src="@/assets/icon/user.png" alt="" srcset=""><span>{{ viewInfo.from }}</span></div>
        </div>
        <div>
          <span class="line_title">内容：</span>
          <span v-html="viewInfo.content" class="rich_text"></span>
        </div>
      </div>
      <div v-if="viewType == 'report'&&viewInfo.file.length>0" class="view_line">
        <span class="line_title">附件：</span>
        <span v-for="(item,index) in viewInfo.file" :key="index" class="link_text" v-if="item.name!=''"  @click="isShowFile(item)">{{ item.name }}</span>
      </div>
      <div class="view_line" v-if="viewType == 'report'">
        <span class="line_title">针对部门：</span>
        <span v-if="viewInfo.organizeName!=''" class="second_line">{{ viewInfo.organizeName }}</span>
        <span v-else class="second_line">全部部门</span>
      </div>
      <div v-transfer-dom>
          <x-dialog v-model="showHideOnBlur" class="dialog-demo" hide-on-blur>
            <div class="img-box" style="text-align:center">
              <span v-if="file_type=='img'">
                <img :src="fileUrl+showFile.url" style="max-width:100%;vertical-align: middle;" v-if="showFile.url!=''">
              </span>
              <span v-if="file_type!='img'" class="tipInfo">压缩包暂不支持预览和下载</span>
            </div>
            <div style="height: 1rem; display: flex; align-items: center; justify-content: center;" v-if="file_type!='img'">
              <!-- <span class="vux-close"></span> -->
              <icon type="clear" style="font-size:26px" @click.native="closeDialog"></icon>
            </div>
          </x-dialog>
      </div>
    </div>
  </div>
  <!-- </scroller> -->
</template>
<script>
  import {
    viewReport,
    viewMessage,
    getUnRead
  } from '@/api/public'
  import {
    XButton,
    XDialog,
    XTextarea,
    Icon,
    TransferDomDirective as TransferDom
  } from 'vux'
  export default {
    name: 'MessageView',
    components: {
      XTextarea,
      XButton,
      XDialog,
      Icon
    },
    directives: {
      TransferDom
    },
    data() {
      return {
        viewType: '',
        viewId: '',
        fileUrl: '',
        file_type: "img",
        showHideOnBlur:false,
        showiframe: false,
        showFile: {},
        viewInfo: {
          file: [{ name: '', url: '' }]
        },
        infoHeight:''
      }
    },
    // created() {
    //   this.showiframe = false
    // },
    mounted() {
      this.fileUrl = process.env.FILE_API
      this.viewId = this.$route.query.id;
      this.viewType = this.$route.query.type;
      this.getDetail();
      // this.getNum()
    },
    methods: {
      getDetail() {
        const that = this
        if (this.viewType === 'report') {
          viewReport(this.viewId).then(res => {
          console.log(res, 'fff')
            if (res.code === 200) {
              that.viewInfo = res.data.notice
              if (that.viewInfo.file !== '') {
                that.viewInfo.file = JSON.parse(that.viewInfo.file)
              } else {
                that.viewInfo.file = [{ name: '', url: '' }]
              }
              that.$nextTick(()=>{
              // 获取当前窗口的高度
              var windows_height = window.outerHeight
              // 获取底部栏的高度
              var footer_height = document.getElementsByClassName('my-footer')[0].children[0].clientHeight
              that.infoHeight = windows_height - footer_height - 15 +'px'
              })

            }
          })
        } else {
          viewMessage(this.viewId).then(res => {
            if (res.code === 200) {
              that.viewInfo = res.data.message
              that.viewInfo.file = [{ name: '', url: '' }]
              that.$nextTick(()=>{
              // 获取当前窗口的高度
              var windows_height = window.outerHeight
              // 获取底部栏的高度
              var footer_height = document.getElementsByClassName('my-footer')[0].children[0].clientHeight
              that.infoHeight = windows_height - footer_height - 15 +'px'
              })
              that.getNum()
            }
          })
        }
      },
      // 方法
      getNum() {
        const that = this
        getUnRead().then(res => {
            if (res.code === 200) {
              console.log('请求未读')
              this.$store.commit('app/ADD_UNREAD', res.data.unread)
              // that.addUnread(res.data.unread)
              // setCookie('unread',res.data.unread)
            }
        })
      },
      closeDialog(){
        console.log("关闭弹框")
        this.showHideOnBlur = false
      },
      isShowFile(e){
        console.log(e, 'fdsfdsf')
        this.showFile = e
        if(e.name.indexOf('.png') !== -1 || e.name.indexOf('.jpg') !== -1 || e.name.indexOf('.jpeg') !== -1 || e.name.indexOf('.bmp') !== -1){
          this.file_type = 'img'
          this.showHideOnBlur = true
        }else if(e.name.indexOf('.pdf') !== -1){
          //预览pdf
          let url = './static/pdfjs/web/viewer.html?file=' + this.fileUrl + e.url
          console.log(url)
          window.open(url);
        }else if(e.name.indexOf('.zip') !== -1||e.name.indexOf('.rar') !== -1){
          this.file_type ='other'
          this.showHideOnBlur = true
        }else{
          var newdownloadUrl = this.fileUrl + e.url
          window.open(newdownloadUrl);
        }
      },
    }
  }

</script>
<style lang="less" scoped>
  .view_bg {
    // padding: 0.3rem;
    padding-bottom: 1.18rem;
    .link_text{
        color: #409eff;
        text-decoration: underline;
        display: block;
    }
    .view_detail {
      font-size: 0.28rem;
      // margin: 0.2rem 0;
      word-wrap: break-word;
      word-break: break-all;
      overflow: hidden;
      .view_line{
        padding: 0.3rem;
        margin-bottom: 0.05rem;
        background: #fff;
        .view_tit{
          color: #333;
          font-weight: 700;
          font-size: 0.24rem;
          display: flex;
          height: 0.4rem;
          align-items: center;
          span:nth-child(1){
            width: 0.08rem;
            height: 0.28rem;
            display: inline-flex;
            margin-right: 0.1rem;
            background-color: rgba(51, 51, 51, 1);
          }
        }
        .view_createdby{
          display: flex;
          font-size: 0.24rem;
          color: #999;
          font-weight: 400;
          margin: 0.2rem 0;
          justify-content: flex-start;
          .view_createdby_l{
             display: inline-flex;
             align-items: center;
             margin-right: 0.4rem;
              img{
                margin-right: 0.05rem;
                width: 0.32rem;
                height: 0.32rem;
                margin-top: -0.05rem;
              }
          }
        }
        // .second_line{
        //   color:#000;
        // }
      }
    }
  }

</style>
