<template>
  <div>
    <common-header :h_title="h_title" :showback="true"></common-header>
    <div class='my_code'>
      <return-top @returnTop='goTop'></return-top>
      <div id='code' style='height:0.9rem'></div>
      <div class='code_body'>
        <div class='gift_nav'>
          <span @click='viewType(2)' :class="giftType=='2'?'text_active':''">我的邀请人</span>
          <span @click='viewType(3)' :class="giftType=='3'?'text_active':''">我的导师</span>
          <span @click='viewType(1)' :class="giftType=='1'?'text_active':''">我的二维码</span>
        </div>
        <div style='height:0.9rem'></div>
        <!-- 我的上级 -->
        <div class="code_view" v-if="giftType=='2'&&hasDate">
          <div class="invite_name">昵称：{{superInfo.nickname}}</div>
          <div class="invite_qrcode" v-if="superInfo.wx_image!=null&&superInfo.wx_image!=''"
            @click="previewImg(superInfo.wx_image)" id="superInfo.wx_image">
            <img :src="superInfo.wx_image" />
            <span>点击查看大图</span>
          </div>
          <div class="invite_qrcode" v-if="superInfo.wx_image==null||superInfo.wx_image==''">
            <div class="null_code">
              <span>您的邀请人暂未上传二维码</span>
            </div>
          </div>
          <div class="invite_wxcode" v-if="superInfo.wx_code!=null&&superInfo.wx_code!=''">微信号: {{superInfo.wx_code}}
            <label class='lab_copy' @click='copyBtn(superInfo.wx_code)'>复制</label>
            <input type="text" v-model="superInfo.wx_code" class="hide_input" readonly>
          </div>
        </div>
        <!-- 我的导师 -->
        <div class="code_view" v-if="giftType=='3'&&hasDate">
          <div class="invite_name">昵称：{{bossInfo.nickname}}</div>
          <div class="invite_qrcode" v-if="bossInfo.wx_image!=null&&bossInfo.wx_image!=''"
            @click="previewImg(bossInfo.wx_image)" id="superInfo.wx_image">
            <img :src="bossInfo.wx_image" />
            <span>点击查看大图</span>
          </div>
          <div class="invite_qrcode" v-if="bossInfo.wx_image==null||bossInfo.wx_image==''">
            <div class="null_code">
              <span>您的导师暂未上传二维码</span>
            </div>
          </div>
          <div class="invite_wxcode" v-if="bossInfo.wx_code!=null&&bossInfo.wx_code!=''">微信号: {{bossInfo.wx_code}}
            <label class='lab_copy' @click='copyBtn(bossInfo.wx_code)'>复制</label>
            <input type="text" v-model="bossInfo.wx_code" class="hide_input" readonly>
          </div>
        </div>
        <!-- 我的 -->
        <div class="code_view" v-if="giftType=='1'&&hasDate">
          <div class="invite_name">
            <div class="input_code" v-if="showCode">微信号：{{code_value}}<span class='lab_copy'
                @click='editWxcode(code_value)'>修改</span> </div>
            <div class="input_code" v-if="!showCode">微信号：
              <input placeholder="请输入微信号" type='text' v-model="code_value" @blur='saveValue(code_value)' />
              <span class='lab_copy' @click='saveWxcode'>保存</span>
            </div>
          </div>
          <!-- <div class="invite_wxcode">微信号: wx_eda4313213
            <label class='lab_copy' @click="copyBtn('wx_eda4313213')">复制</label>
            <input type="text" v-model="wx_eda4313213" class="hide_input">
          </div> -->
          <div class="invite_qrcode" v-if="myInfo.wx_image!=null&&myInfo.wx_image!=''">
            <img :src="myInfo.wx_image" @click='editavatat' />
            <span @click='editavatat'>点击更换二维码</span>
          </div>
          <div class="invite_qrcode" v-if="myInfo.wx_image==null||myInfo.wx_image==''">
            <div class="null_code" @click='editavatat'>
              <span>请上传我的二维码</span>
            </div>
          </div>
        </div>
        <!-- 暂无数据 -->
        <div class="code_view" v-if="!hasDate">
          <img :src="imgPath+'pro/null_1.png'" class="null_img" />
        </div>
      </div>
      <div class='pro_com_img_bg' v-if='imgShow' catchtouchmove="ture" @click="hiddenImg"></div>
      <div class='pro_com_img' v-if='imgShow' catchtouchmove="ture" @click="hiddenImg">
        <img :src="img_show_big" alt="" @click="hiddenImg" class="img_big">
        <mt-button class="save_img" @click='saveImg'>
          <!-- <i class="iconfont icon-xiazai"></i> -->
          <span>保存图片</span>
        </mt-button>
      </div>
    </div>
    <div class='avatar_model_bg' v-if="!hiddenavatar" @click='hiddenModel'>
    </div>
    <div class='avatar_model' v-if="!hiddenavatar">
      <div class='avatar_title'>
        <span>修改二维码</span>
      </div>
      <div class='avatar_info' @click='choseAlbum'>
        <input type="file" accept="image/*" id='album' name="pic">
        <img :src="imgPath+'com/cra.png'" />
        <span>相册</span>
      </div>
      <div class='avatar_info' @click='choseCra'>
        <img :src="imgPath+'com/cra1.png'" />
        <span>拍照</span>
      </div>
    </div>
    <div class='goIndex' @click='goIndex'>
      <i class='iconfont icon-home'></i>
    </div>
  </div>
</template>

<script>
import commonHeader from 'common/common-header'
import {
  InfiniteScroll,
  Indicator,
  Button,
  Lazyload,
  Toast
} from 'mint-ui'
import {
  parseTime
} from '@/store/pubilc.js'
import {
  getMyCode,
  saveMyCode,
  getImageBase64
} from '@/api/share'
import axios from 'axios'
export default {
  name: 'MyQrcode',
  components: {
    commonHeader,
    InfiniteScroll,
    Indicator,
    Button,
    Lazyload,
    Toast
  },
  data() {
    return {
      h_title: '我的二维码',
      imgPath: process.env.FilE_URL,
      isMember: this.$store.state.home.is_member,
      isShare: this.$store.state.home.is_share,
      allowbind: true,
      giftType: '2',
      code_value: 'wx_dasdasd',
      giftList: [],
      proType: 'scan',
      showCode: true,
      hiddenavatar: true,
      superInfo: {},
      bossInfo: {},
      myInfo: {},
      img_save_show: true,
      save_url: '',
      hasDate: false,
      imgShow: false,
      img_show_big: ''
    }
  },
  mounted() {
    Indicator.open('加载中...')
    // 获取我的二维码列表
    this.getInfo()
  },
  methods: {
    goTop() {
      console.log('回到顶部')
      document.getElementById('code').scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      })
    },
    goIndex() {
      this.$router.replace({
        path: '/index'
      })
    },
    getInfo: function () {
      var that = this
      // 查看二维码信息
      getMyCode().then(res => {
        Indicator.close()
        if (res.isSuccess) {
          console.log(res)
          that.myInfo = res.data.member
          that.code_value = res.data.member.wx_code
          that.superInfo = res.data.inviter
          that.bossInfo = res.data.team_leader
          that.hiddenavatar = true
          that.hasDate = true
          if (that.giftType == '2' && res.data.inviter.length == 0) {
            that.hasDate = false
          } else if (that.giftType == '3' && res.data.bossInfo.length == 0) {
            that.hasDate = false
          }
          if (that.superInfo.wx_image != undefined && that.superInfo.wx_image != '') {
            getImageBase64({
              url: that.superInfo.wx_image
            }).then(res => {
              if (res.isSuccess) {
                that.superInfo.wx_image = res.data
              }
            })
          }
          if (that.bossInfo.wx_image != undefined && that.bossInfo.wx_image != '') {
            getImageBase64({
              url: that.bossInfo.wx_image
            }).then(res => {
              if (res.isSuccess) {
                that.bossInfo.wx_image = res.data
              }
            })
          }
        }
      })
    },
    previewImg(url) {
      this.imgShow = true
      this.img_show_big = url
    },
    hiddenImg() {
      this.imgShow = false
    },
    saveImg() {
      let that = this
      var _canvas = document.createElement('canvas')
      var ctx = _canvas.getContext('2d')
      var getPixelRatio = function (context) { // 获取设备的PixelRatio
        var backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1
        return (window.devicePixelRatio || 1) / backingStore
      }
      var ratio = getPixelRatio(ctx)
      ctx.scale(ratio, ratio)
      let bgImg = document.getElementsByClassName('img_big')[0]
      _canvas.width = bgImg.offsetWidth * ratio
      _canvas.height = bgImg.offsetHeight * ratio
      _canvas.style.width = bgImg.offsetWidth * ratio + 'px'
      _canvas.style.height = bgImg.offsetHeight * ratio + 'px'
      ctx.drawImage(bgImg, 0, 0, bgImg.offsetWidth * ratio, bgImg.offsetHeight * ratio)
      let url = _canvas.toDataURL('image/png')
      that.toSave(url)
    },
    toSave(url) {
      let type = 'png'
      let that = this
      let imgData = url
      var bitmap = new plus.nativeObj.Bitmap()
      let filename = 'new_code_' + (new Date()).getTime() + '.' + type
      bitmap.loadBase64Data(imgData)
      // 保存Bitmap图片
      bitmap.save(
        '_doc/' + filename, {
          overwrite: true
        },
        function (i) {
          // 保存到系统相册
          plus.gallery.save(
            i.target,
            function (d) {
              Indicator.close()
              console.log('保存图片成功：' + JSON.stringify(d))
              // 销毁Bitmap图片
              that.fileUrl = '_doc/' + filename
              bitmap.clear()
              Toast({
                message: '图片已保存到相册',
                iconClass: 'iconfont icon-dui1',
                duration: 2000
              })
            },
            function (e) {
              Indicator.close()
              // 销毁Bitmap图片
              console.log('加载Base64图片数据失败：' + JSON.stringify(e))
              bitmap.clear()
              console.log('保存失败', i)
            }
          )
        },
        function () {
          bitmap.clear()
        }
      )
    },
    copyBtn(code) {
      console.log(code)
      this.$copyText(code).then(function (e) {
        Toast({
          message: '复制成功',
          iconClass: 'iconfont icon-dui1',
          duration: 1000
        })
        console.log(e)
      }, function (e) {
        console.log('复制失败')
        console.log(e)
      })
      // var that = this
      // wx.setClipboardData({
      // // 准备复制的数据
      //   data: id,
      //   success: function (res) {
      //     wx.showToast({
      //       title: '复制成功'
      //     })
      //   }
      // })
    },
    editavatat: function () {
      this.hiddenavatar = !this.hiddenavatar
    },
    hiddenModel: function () {
      this.hiddenavatar = true
    },
    viewType(id) {
      // Indicator.open('加载中...')
      this.giftType = id
      this.hasDate = true
      this.save_url = ''
      if (id === '1' && this.code_value === '') {
        this.showCode = false
      }
      if (id === '2' && this.superInfo.length === 0) {
        this.hasDate = false
      }
      if (id === '3' && this.bossInfo.length === 0) {
        this.hasDate = false
      }
      // Indicator.close()
    },
    editWxcode(id) {
      this.showCode = false
      this.code_value = id
    },
    saveWxcode() {
      const that = this
      console.log(this.code_value)
      var wechatReg = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/
      var phonereg = /^1[3|4|5|6|7|8|9]\d{9}$/
      if (!wechatReg.test(this.code_value) && !phonereg.test(this.code_value)) {
        Toast({
          message: '微信号格式不正确',
          duration: 1000
        })
        this.code_value = ''
      } else if (this.code_value === '') {
        Toast({
          message: '微信号不能为空',
          duration: 1000
        })
        this.code_value = ''
      } else {
        let info = {
          name: this.code_value
        }
        saveMyCode(info).then(res => {
          if (res.isSuccess) {
            Toast({
              message: '保存成功',
              iconClass: 'iconfont icon-dui1',
              duration: 1000
            })
            setTimeout(() => {
              that.showCode = true
            })
          } else {
            Toast({
              message: res.msg,
              duration: 1000
            })
          }
        })
      }
    },
    saveValue(val) {
      var regu = '^[ ]+$'
      var re = new RegExp(regu)
      if (re.test(val)) {
        val = ''
      }
      this.code_value = val
    },
    choseAlbum: function () {
      console.log('选择相册')
      var that = this
      var imginput = document.getElementById('album')
      imginput.onchange = function (e) {
        let file = e.target.files[0]
        console.log(file)
        if (file.size > 5242880) {
          Toast({
            message: '头像大小不能大于5MB！',
            duration: 1000
          })
        } else {
          that.uploadImg(file)
        }
      }
    },
    choseCra() {
      var that = this
      console.log('选择拍照')
      let System = window.plus
      var cmr = System.camera.getCamera()
      var res = cmr.supportedImageResolutions[0]
      var fmt = cmr.supportedImageFormats[0]
      console.log('Resolution: ' + res + ', Format: ' + fmt)
      console.log(cmr)
      cmr.captureImage(function (path) {
        console.log(path)
        System.io.resolveLocalFileSystemURL(path, function (entry) {
          // 压缩图片
          let name = '_doc/upload/' + entry.name
          System.zip.compressImage({
            src: entry.toLocalURL(), // src: (String 类型 )压缩转换原始图片的路径
            dst: name, // 压缩转换目标图片的路径
            quality: 40, // quality: (Number 类型 )压缩图片的质量.取值范围为1-100
            overwrite: true // overwrite: (Boolean 类型 )覆盖生成新文件
          },
          function (zip) {
            console.log(zip)
            // 页面显示图片
            System.io.resolveLocalFileSystemURL(zip.target, function (url) {
              console.log(url)
              url.file(function (file) {
                console.log(file)
                if (file.size > 657920) {
                  Toast({
                    message: '头像必须小于5MB！',
                    duration: 1000
                  })
                } else {
                  let fileReader = new System.io.FileReader()
                  fileReader.readAsDataURL(file)
                  fileReader.onloadend = function (e) {
                    // console.log(e.target.result.toString())
                    let files = that.dataURLtoBlob(e.target.result.toString())
                    files.name = file.name
                    console.log(files)
                    that.uploadImg(files)
                  }
                }
              })
            })
            // eslint-disable-next-line handle-callback-err
          },
          function (error) {
            console.log('压缩图片失败，请稍候再试')
          })
        }, function (e) {
          console.log('读取拍照文件错误：' + e.message)
        })
      },
      function (error) {
        console.log('Capture image failed: ' + error.message)
      }, {
        resolution: res,
        format: fmt
      }
      )
    },
    dataURLtoBlob(dataurl) {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1].replace(/\s/g, ''))
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], {
        type: mime
      })
    },
    uploadImg(file) {
      console.log(file)
      var that = this
      // Indicator.open('上传中...')
      let param = new FormData() // 创建form对象
      param.append('file', file, file.name) // 通过append向form对象添加数据
      // console.log(param.get('file')) // FormData私有类对象，访问不到，可以通过get判断值是否传进去
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      }
      let url = '?m=invite&a=head_portrait'
      if (process.env.NODE_ENV === 'development') {
        url = '/api' + url
      } else {
        url = process.env.BASE_URL + url
      }
      console.log('请求上传接口啦')
      axios.post(url, param, config)
        .then(response => {
          if (response.data.isSuccess) {
            that.getInfo()
          } else {
            Toast({
              message: response.data.msg,
              duration: 1000
            })
            setTimeout(function () {
              that.hiddenavatar = true
            }, 1000)
          }
        }).catch(res => {
          console(res)
        })
    }
  }
}

</script>

<style scoped lang="less">
  @import "~styles/index.less";
  @import "~styles/variable.less";

  .my_code {
    background: #f2f2f2;
    overflow-x: hidden;
  }

  .code_body {
    height: 100%;
  }

  .gift_nav {
    height: 90/100rem;
    background: #f6f6f6;
    width: 100%;
    z-index: 50;
    position: fixed;
    top: 0.9rem;
  }

  .gift_nav span {
    width: 32%;
    display: inline-block;
    color: #999;
    font-size: 32/100rem;
    text-align: center;
    border-bottom: 4/100rem solid transparent;
    border-top: 4/100rem solid transparent;
    height: 82/100rem;
    line-height: 82/100rem;
  }

  .gift_nav .text_active {
    border-bottom: 4/100rem solid #e21f11;
    color: #333;
  }

  .cou_list {
    padding: 0 26/100rem;
    /* background: #f6f6f6; */
    height: 100%;
  }

  .nullTips {
    font-size: 30/100rem;
    color: #999;
  }

  .cou_info {
    margin-top: 16/100rem;
    background: #fff;
    height: 200/100rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }

  .cou_info img {
    width: 240/100rem;
    height: 200/100rem;
  }

  .cou_info .cou_more {
    position: absolute;
    text-align: center;
    width: 240/100rem;
  }

  .cou_more .cou_value {
    font-size: 26/100rem;
    color: #fff;
    text-align: center;
  }

  .cou_value span {
    font-size: 90/100rem;
    font-family: "DIN";
    margin-left: -16/100rem;
  }

  .cou_more .cou_more_tips {
    text-align: center;
    margin-top: -19/100rem;
  }

  .cou_more_tips span {
    font-size: 22/100rem;
    color: #fff;
    margin-right: 8/100rem;
  }

  .cou_more_tips .iconfont {
    color: #fff;
    font-size: 20/100rem;
  }

  .cou_info .cou_tips {
    /* margin-right: 126/100rem; */
    float: left;
    width: 420/100rem;
  }

  .cou_info .cou_tips span {
    // display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .cou_info .cou_title {
    color: #444;
    font-size: 32/100rem;
  }

  .cou_info .cou_type {
    font-size: 24/100rem;
    margin: 10/100rem 0;
    width: 300/100rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    max-height: 0.7rem;
  }

  .cou_info .cou_type_normal {
    width: 400/100rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .cou_info .cou_time {
    color: #999;
    font-size: 24/100rem;
    // margin: 15/100rem 0;
    /* width: 220/100rem; */
  }

  .cou_time span {
    /* float: right; */
    font-size: 26/100rem;
  }

  .cou_states {
    position: absolute;
    right: 0;
    top: 0;
  }

  .cou_states .iconfont {
    font-size: 120/100rem;
    color: #999;
  }

  .more_load {
    display: flex;
    justify-content: center;
  }

  .list_bottom {
    height: 84/100rem;
    line-height: 84/100rem;
    text-align: center;
    background: #f2f2f2;
    font-size: 23.97/100rem;
    color: #bebebe;
  }

  .code_view {
    text-align: center;
    /* font-weight: bold; */
    padding-top: 100/100rem;
  }

  .code_view .null_img {
    display: inline-block;
    width: 750/100rem;
    height: 357/100rem;
  }

  .null_img {
    width: 6.4rem;
  }

  .code_view .invite_name {
    font-size: 30/100rem;
    color: #333;
    line-height: 60/100rem;
    margin-bottom: 40/100rem;
    text-align: center;
  }

  .code_view .invite_name .input_code {
    display: flex;
    justify-content: left;
    align-items: center;
    padding-left: 200/100rem;
  }

  .code_view .invite_name .input_code input {
    text-align: left;
    width: 200/100rem;
    border-bottom: 1px solid #999;
    font-size: 26/100rem;
    background: transparent;
  }

  .code_view .invite_qrcode {
    /* margin: 40/100rem 0; */
    text-align: center;
  }

  .code_view .invite_qrcode img {
    width: 360/100rem;
  }

  .code_view .invite_qrcode span {
    margin: 30/100rem 0;
    font-size: 24/100rem;
    display: block;
    color: #999;
    text-align: center;
  }

  .code_view .invite_qrcode .null_code {
    margin: 0 auto;
    width: 360/100rem;
    height: 360/100rem;
    border: 1px solid #e0e0e0;
    border-radius: 10/100rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .code_view .invite_qrcode .null_code span {
    font-size: 24/100rem;
    color: #999;
  }

  .code_view .invite_wxcode {
    margin-top: 40/100rem;
    font-size: 30/100rem;
    color: #333;
    text-align: center;
  }

  .code_view .invite_wxcode .hide_input {
    background: transparent;
    color: transparent;
    display: block;
    margin: 0 auto
  }

  .lab_copy {
    font-size: 24/100rem;
    color: #ff4e79;
    margin-left: 20/100rem;
  }

  /* 弹出层 */

  .avatar_model_bg {
    position: fixed;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 50;
  }

  .avatar_model {
    width: 548/100rem;
    height: 328/100rem;
    border-radius: 10/100rem;
    position: fixed;
    margin: auto;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 60;
    background: #fff;
    /* text-align: center; */
  }

  .avatar_title {
    height: 82/100rem;
    margin-top: 20/100rem;
    padding-left: 30/100rem;
    border-bottom: 3/100rem solid #e2e2e2;
    display: flex;
    align-items: center;
  }

  .avatar_title span {
    font-size: 32/100rem;
    color: #333;
  }

  .avatar_info {
    height: 112/100rem;
    display: flex;
    align-items: center;
    padding-left: 30/100rem;
    border-bottom: 1px solid #e2e2e2 !important;
    position: relative;
  }

  .avatar_info input {
    position: absolute;
    z-index: 10;
    opacity: 0;
  }

  .avatar_info:last-child {
    border: none !important;
  }

  .avatar_info img {
    width: 34/100rem;
    height: 30/100rem;
  }

  .avatar_info span {
    font-size: 28/100rem;
    color: #555;
    margin-left: 20/100rem;
  }

  .pro_com_img_bg {
    position: fixed;
    background: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 202;
  }

  .pro_com_img {
    width: 100%;
    height: 100%;
    position: fixed;
    bottom: 0;
    z-index: 203;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 80%;
      vertical-align: middle;
      -webkit-touch-callout: default;
    }

    .save_img {
    position: absolute;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    bottom: 4%;
    background: #ff4e79;
    width: 50%;
    z-index: 999;
    height: 0.7rem;
    border: none;
    -webkit-box-shadow: none;
    box-shadow: none;

      i {
        font-size: 0.88rem;
        color: #fff;
      }
      span{
        display: block;
        font-size: 0.24rem;
        color: #fff;
        text-align: center;
      }
    }
  }

</style>
