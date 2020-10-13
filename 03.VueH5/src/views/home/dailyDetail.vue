<template>
  <div class="detail_bg">
    <div class="show_detail">
      <p class="div_title">
        <span>基本信息</span>
      </p>
      <ul class="detail_info">
        <li>
          <div class="div">
            <span class="title">员工</span>
            <span>{{dailyInfo.accountName}}</span>
          </div>
        </li>
        <li>
          <div class="div">
            <span class="title">部门</span>
            <span>{{dailyInfo.organizeName}}</span>
          </div>
        </li>
        <li>
          <div class="div">
            <span class="title">日期</span>
            <span>{{dailyInfo.startDate}}</span>
          </div>
        </li>
      </ul>
      <p class="div_title">
        <span>日报内容</span>
      </p>
      <ul class="detail_info">
        <li>
          <div class=" detail_content">
            <span class="title" style="display:inline-block;min-width:0.5rem;padding-right:0.2rem">内容</span>
            <span>{{dailyInfo.content}}</span>
          </div>
        </li>
      </ul>
      <p class="div_title">
        <span>日报附件</span>
      </p>
      <ul class="detail_info" v-if="dailyInfo.file.length>0">
        <li v-for="(item,index) in dailyInfo.file" :key="index">
          <div class="detail_content">
            <!-- <span class="title" style="display:inline-block;min-width:0.5rem;padding-right:0.2rem">内容</span> -->
            <span @click="isShowFile(item)" style="text-decoration: underline;color: #409eff;">{{item.name}}</span>
          </div>
        </li>
      </ul>
      <ul class="detail_info" v-if="dailyInfo.file.length==0">
        <li>
          <div class=" detail_content">
            <!-- <span class="title" style="display:inline-block;min-width:0.5rem;padding-right:0.2rem">内容</span> -->
            <span>暂无附件</span>
          </div>
        </li>
      </ul>
      <p class="div_title">
        <span>审批</span>
      </p>
      <ul class="detail_info">
        <li  v-if="dailyInfo.status==2">
          <div class="div">
            <span class="title">审批结果</span>
            <span >{{ dailyInfo.checkResult==1?'好':(dailyInfo.checkResult==2?'一般':'差') }}</span>
          </div>
        </li>
        <li v-if="dailyInfo.status==2">
          <p>
            <span class="title">批注</span>
            <span style="display:block;margin-top:0.15rem;">{{ dailyInfo.checkPostil }}</span>
          </p>
        </li>
        <li v-if="dailyInfo.status==1">
          <div class="div">
            <group class="form_item radio_form">
              <span class="title">审批</span>
              <popup-radio class="showBorder" :options="radioList" v-model="type" placeholder="请评分" placeholder-align="left"></popup-radio>
            </group>
          </div>
        </li>
        <li v-if="dailyInfo.status==1">
          <p>
            <span>批注</span>
            <x-textarea class="showBorder" :max="200" name="detail" placeholder="请填写批注内容" :show-counter="false" v-model="remark"></x-textarea>
          </p>
        </li>
      </ul>
    </div>
    <group class="detail_sure" v-if="dailyInfo.status==1">
        <div @click="saveForm">保 存</div>
    </group>
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
</template>
<script>
  import {
    viewDaily,
    doApproveDaily
  } from "@/api/public";
  import {
    XTextarea,
    XButton,
    PopupRadio,
    XDialog,
    Icon,
    TransferDomDirective as TransferDom
  } from "vux";
  export default {
    name: "DailyDetail",
    components: {
      PopupRadio,
      XButton,
      XTextarea,
      XDialog,
      Icon
    },
    directives: {
      TransferDom
    },
    data() {
      return {
        dailyInfo: {
          file: []
        },
        dailyId: "",
        fileUrl: '',
        type: '1',
        remark: "",
        radioList: [{
            value: "好",
            key: "1"
          },
          {
            value: "一般",
            key: "2"
          },
          {
            value: "差",
            key: "3"
          }
        ],
        file_type: "img",
        showFile: {},
        is_img: false,
        showHideOnBlur: false,
      };
    },
    mounted() {
      this.fileUrl = process.env.FILE_API
      this.dailyId = this.$route.query.id;
      this.getDetail();
    },
    methods: {
      getDetail() {
        const that = this;
        viewDaily(this.dailyId).then(res => {
          console.log(res);
          if (res.code === 200) {
            that.dailyInfo = res.data.daily;
            if(that.dailyInfo.file!=''){
              that.dailyInfo.file = JSON.parse(that.dailyInfo.file)
            }else{
              that.dailyInfo.file = []
            }
          }
        });
      },
      isShowFile(e) {
        console.log(e, 'fdsfdsf')
        this.showFile = e
        if (e.name.indexOf('.png') !== -1 || e.name.indexOf('.jpg') !== -1 || e.name.indexOf('.jpeg') !== -1 || e.name
          .indexOf('.bmp') !== -1) {
          this.file_type = 'img'
          this.showHideOnBlur = true
        } else if (e.name.indexOf('.pdf') !== -1) {
          //预览pdf
          let url = './static/pdfjs/web/viewer.html?file=' + this.fileUrl + e.url
          // let url = './static/pdfjs/web/viewer.html?file=http://tyun.71360.com/download/%E7%99%BE%E5%BA%A6%E5%95%86%E6%A1%A5%E6%8E%A5%E5%85%A5%E8%AF%B4%E6%98%8E.pdf'
          console.log(url)
          window.open(url);
        } else if (e.name.indexOf('.zip') !== -1 || e.name.indexOf('.rar') !== -1) {
          this.file_type = 'other'
          this.showHideOnBlur = true
        } else {
          var newdownloadUrl = this.fileUrl + e.url
          window.open(newdownloadUrl);
        }
      },
      saveForm() {
        const that = this
        let info = {
          id: this.dailyId,
          result: this.type,
          postil: this.remark
        }
        doApproveDaily(info).then(res => {
          console.log(res, 'gfdgfdgfdgf')
          if (res.code === 200 || res.code === '200') {
            that.$vux.toast.show({
              text: '日报审批成功！',
              type: "success",
              time: 1000
            })
            setTimeout(() => {
              that.$router.go(-1)
            }, 1000)
          } else {
            that.$vux.toast.show({
              text: res.msg,
              type: "warn",
              time: 1000
            })
            return false;
          }
        })
      }
    }
  };

</script>
<style lang="less" scoped>
  .detail_bg {
     .show_detail {
      font-size: 0.24rem;
      color: #666666;
      font-family: 'Arial Normal', 'Arial';

      .div_title {
        font-weight: 700;
        color: #333333;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.1rem 0.3rem;
        border-bottom: 0.02rem solid #f2f2f2;

        .info_code {
          color: #666666;
          font-weight: normal;
        }
      }

      .detail_info {
        li {
          div.div {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 0.02rem solid #f2f2f2;
            background: #fff;
            padding: 0.14rem 0.3rem;
            line-height: 1.5;
            .title {
              color: #333333;
            }
            .form_item {
              width: 100%;
              & /deep/.weui-cells {
                display: flex;
                align-items: center;
                background: transparent;
                justify-content: space-between;
                span {
                  color: #333333;
                  font-size: 0.24rem;
                  width: 15%;
                  text-align: left;
                }
              }
            }
             .radio_form {
               /deep/.weui-cells{
                 margin-top: 0;
               }
              & /deep/.weui-cell {
                border: 0;
                padding: 0;
                margin: 0;
                .weui-cell__ft {
                  width: 100%;
                }
              }
            }
          }
          p {
            border-bottom: 0.02rem solid #f2f2f2;
            background: #fff;
            padding: 0.14rem 0.3rem;
            line-height: 1.5;
            .title {
              color: #333333;
            }

          }
          .detail_content{
            display: flex;
            align-items:flex-start;
            justify-content: space-between;
            border-bottom: 0.02rem solid #f2f2f2;
            background: #fff;
            padding: 0.14rem 0.3rem;
            line-height: 1.5;
          }
          .div_block{
            display: block;
          }
          .bottom_none{
            border-bottom: none;
            padding: 0.14rem 0;
          }
          .link_text{
            color: #409eff;
            text-decoration: underline;
          }
          
          .file_list{
              display: block;
              p{
                display: flex;
                align-items: center;
                justify-content: space-between;
                line-height: 2;
                .flies{
                  color: #409eff;
                }
              }
          }
        }
      }
      & /deep/.weui-cell:before{
         border: 0;
      }
      & /deep/ .weui-cell{
        margin-top: 0.1rem;
      }
     & /deep/.weui-cells{
        border: 0;
        padding: 0;
      } 
      & /deep/.weui-cells:after{
        border: 0;
      } 
      & /deep/.weui-cell:after{
         border: 0;
      }
      & /deep/.weui-cell{
        border: 0;
        padding: 0;
      }
    }
    // .table_info {
    //   .title {
    //     font-size: 0.2rem;
    //     color: #333333;
    //     width: 2rem;
    //   }

    //   th {
    //     color: #888888;
    //     font-size: 0.18rem;
    //   }

    //   td {
    //     color: #888888;
    //     font-size: 0.18rem;
    //     padding: 0 0.1rem;
    //   }
    // }

    // .daily_approval {
    //   .form_item {
    //     & /deep/.weui-cells {
    //       display: flex;
    //       align-items: center;
    //       background: transparent;

    //       span {
    //         color: #333333;
    //         font-size: 0.24rem;
    //         width: 15%;
    //         text-align: left;

    //         .red_star {
    //           font-family: 'Arial Normal', 'Arial';
    //           color: #ff0000;
    //           font-weight: 400;
    //           font-style: normal;
    //           font-size: 0.14rem;
    //         }
    //       }

    //       .normal_span {
    //         font-size: 0.24rem;
    //         font-style: normal;
    //         padding-left: 0.1rem;
    //       }

    //       .iconfont {
    //         font-size: 0.32rem;
    //         padding-left: 0.4rem;
    //         color: #999;
    //       }

    //       .vux-cell-placeholder {
    //         color: #757575;
    //       }

    //       .weui-cell {
    //         margin-left: 0.1rem;
    //         width: 75%;
    //         background: #fff;
    //         border-radius: 0.1rem;
    //         padding: 0.16rem;
    //         font-size: 0.24rem;
    //         padding-left: 0.2rem;

    //         .weui-cell__ft {
    //           text-align: left;

    //           .weui-icon-warn {
    //             font-size: 0.28rem;
    //           }

    //           .vux-input-icon.weui-icon-warn:before {
    //             font-size: 0.28rem;
    //           }

    //           .vux-input-icon.weui-icon-success:before {
    //             font-size: 0.28rem;
    //           }
    //         }
    //       }
    //     }

    //     & /deep/.weui-cells:before {
    //       border-top: none;
    //     }

    //     & /deep/.weui-cells:after {
    //       border-bottom: none;
    //     }

    //     & /deep/.weui-cell:before {
    //       border-top: none;
    //     }

    //     .weui-btn_default {
    //       color: #fff;
    //       background-color: #409eff;
    //       border-color: #409eff;
    //       width: 45%;
    //       font-size: 0.3rem;
    //     }

    //     .weui-btn_disabled {
    //       color: rgba(0, 0, 0, 0.3);
    //       background-color: #f7f7f7;
    //       border-color: #f7f7f7;
    //     }
    //   }

    //   .radio_form {
    //     & /deep/.weui-cell {
    //       .weui-cell__ft {
    //         width: 100%;
    //       }
    //     }
    //   }
    // }

    // .approval_view {
    //   margin-top: 0.4rem;
    // }
  }
  .detail_sure{
    width: 70%;
    height: 0.7rem;
    font-size: 0.26rem;
    border-radius: 0.35rem;
    line-height: 0.7rem;
    text-align: center;
    border:0;
    margin: 0.2rem auto;
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    & /deep/ .weui-cells{
     background: none;
     border: 0;
      height: 0.7rem;
      line-height: 0.7rem;
    }
  }  
  & /deep/.weui-cells:before,& /deep/.weui-cells:after{
    border: 0;
  }  
</style>
