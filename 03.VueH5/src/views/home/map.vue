<template>
  <div class="result_bg">
    <div class="result_head">
      <img src="@/assets/index/success.png" v-if="signResult">
      <img src="@/assets/index/err.png" v-else>
    </div>

    <div class="result_text">
      <p class="success" v-if="signResult">{{signMsg}}</p>
      <p class="err" v-else>{{signMsg}}</p>
    </div>
    <div class="result_tips" v-if="signResult">
      <span id='time'>5</span>秒倒计时后，自动返回...
    </div>
    <div class="result_list" v-if="signResult">
      <p>
        <span class="title">签到时间：</span>
        <span id="name">{{locations.time}}</span>
      </p>
      <p>
        <span class="title">签到地点：</span>
        <span id="teacher">{{locations.addr}}</span>
      </p>
      <p>
        <span class="title">签到经纬度：</span>
        <span id="addr">{{locations.latng}}</span>
      </p>
    </div>
    <div class="return_btn">
      <x-button @click.native="back()">返回上一页</x-button>
    </div>
  </div>
</template>
<script>
  import {
    visitSign
  } from "@/api/public";
  import {
    XButton
  } from "vux";
  export default {
    name: "Map",
    components: {
      XButton
    },
    data() {
      return {
        locations: {},
        signResult: true,
        signMsg: '',
      };
    },
    mounted() {
      let str = decodeURI(location.href);
      console.log(str);
      let startIndex = 0;
      let shortStr = "";
      if (process.env.NODE_ENV === "development") {
        startIndex = str.indexOf("/&");
        shortStr = str.substring(startIndex + 2, startIndex.length);
        shortStr = shortStr.replace("?", "&");
      } else {
        startIndex = str.indexOf("?");
        shortStr = str.substring(startIndex + 1, startIndex.length);
      }
      let arr = [];
      arr = shortStr.split("&");
      for (let i = 0; i < arr.length; i++) {
        let a = arr[i].split("=");
        this.locations[a[0]] = a[1];
      }
      this.locations.time = '2019-03-02 18:20:10'
      this.sign();
    },
    methods: {
      sign() {
        let that = this;
        let arr = this.locations.latng.split(",");
        let info = {
          address: this.locations.addr,
          lng: arr[1],
          lat: arr[0]
        };
        visitSign(this.locations.id, info).then(res => {
          console.log(res);
          if (res.code === 200 || res.code === "200") {
            that.signResult = true
            that.signMsg = '恭喜您，签到成功！'
            that.locations.time = res.data.visit.date
            that.times()
            // setTimeout(function() {
            //   that.$router.back(-1);
            // }, 1000);
          } else {
            that.signResult = false
            that.signMsg = res.data.msg
          }
        });
      },
      back() {
        window.localStorage.setItem('maploading',1)
        this.$router.back(-1);
      },
      times() {
        var i = 5
        var timer = setInterval(() => {
          if (i === -1) {
            clearInterval(timer)
          } else {
            --i
            document.getElementById('time').innerText = i
            if (i === 0) {
              this.back()
            }
          }
        }, 1000)
      }
    }
  };

</script>
<style lang="less" scoped>
  .result_bg {
    background: #fff;
    height: 100vh;

    .result_head {
      padding-top: 0.4rem;
      text-align: center;

      img {
        height: 2.06rem;
        width: 2.06rem;
      }
    }
    .result_tips{
      text-align: center;
      padding-top: 0.2rem;
      font-size: 0.26rem;
    }
    .result_text {
      margin-top: 0.4rem;
      text-align: center;
      padding: 0 0.8rem;
      line-height: 1.6;

      p {
        font-family: 'Arial Negreta', 'Arial';
        font-weight: 700;
        font-style: normal;
        font-size: 0.26rem;
      }

      .err {
        color: #FF3333;
      }

      .success {
        color: #33CC00;
      }
    }

    .result_list {
      text-align: center;
      padding: 0 0.1rem;
      padding-top: 0.2rem;

      p {
        border-bottom: 0.001rem solid #e0e0e0;

        display: flex;
        height: 1rem;
        align-items: center;
        padding-left: 1.5rem;

        span {
          color: #6B6B6B;
          font-size: 0.22rem;
          // display: inline-block;
          // text-align: left;
          // width: 50%;
        }

        .title {
          // width: 40%;
          text-align: right;
          padding-right: 0.3rem;
        }
      }
    }

    .return_btn {
      display: flex;
      justify-content: center;

      .weui-btn_default {
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
        font-size: 0.26rem;
        width: 42%;
        margin: 0;
        margin-top: 0.4rem;
      }
    }
  }

</style>
