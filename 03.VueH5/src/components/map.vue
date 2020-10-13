<script charset="utf-8" src="https://map.qq.com/api/js?v=2.exp&key=34IBZ-ZTRRG-WI4Q2-IYFXG-MBRUO-FEBVC"></script>
<template>
  <div class='map_style'>
    <!-- <div id="container" class='map_style'></div> -->
    <iframe id="mapPage" width="100%" height="100%" frameborder=0
      src="https://apis.map.qq.com/tools/locpicker?search=0&type=1&mapdraggable=0&radius=1500&tota=20&key=34IBZ-ZTRRG-WI4Q2-IYFXG-MBRUO-FEBVC&referer=myapp">
    </iframe>
    <div v-transfer-dom>
      <confirm v-model="show5" ref="confirm5" :title="title" @on-confirm="saveConfirm">
        <p style="text-align:center;">是否立即签到？</p>
      </confirm>
    </div>
  </div>

</template>

<script>
  import {
    visitSign
  } from "@/api/public"
  import {
    Confirm,
    TransferDomDirective as TransferDom
  } from 'vux'
  import {
    setTimeout
  } from 'timers';
  export default {
    name: 'myMap',
    components: {
      Confirm
    },
    directives: {
      TransferDom
    },
    data() {
      return {
        infoId: '',
        title: '提示',
        show5: false,
        confirmType: '',
        confirmKey: '',
        locations: {},
        longitude: 0, //经度
        latitude: 0, //纬度
        city: '',
        addr: ''
      }
    },
    created() {

    },

    methods: {
      // 自定义控件
      CustomZoomControl(controlDiv, map, loaction) {
        // console.log(controlDiv.style)
        console.log(map)
        console.log(loaction)
        controlDiv.style.padding = "0.05rem";
        controlDiv.style.backgroundColor = "#FFFFFF";
        controlDiv.style.border = "0.02rem solid #86ACF2";
        controlDiv.style.borderRadius = "50%";
        controlDiv.style.width = "1rem";
        controlDiv.style.height = "1rem";
        controlDiv.style.fontSize = "0.3rem";
        controlDiv.style.display = "flex";
        controlDiv.style.alignItems = "center";
        controlDiv.style.justifyContent = "center";
        controlDiv.style.margin = "0 0.1rem";
        controlDiv.index = 100; //设置在当前布局中的位置
        controlDiv.innerHTML = "签到";
        document.getElementById("container").appendChild(controlDiv)
        console.log('111')
        console.log(controlDiv)
        qq.maps.event.addListener(controlDiv, "click", function signIn(event) {
          console.log(loaction)
          console.log('点击签到')
        });
      },
      drawSign() {
        if (document.getElementById("container") != null) {
          console.log(2222)
          //获取dom元素添加地图信息
          var map = new qq.maps.Map(document.getElementById("container"));
          console.log(map)
          //创建div元素
          var customZoomDiv = document.createElement("div");
          //获取控件接口设置控件
          var customZoomControl = this.CustomZoomControl(customZoomDiv, map, this.locations);
          //将控件添加到controls栈变量并将其设置在顶部位置
          map.controls[qq.maps.ControlPosition.TOP_CENTER].push(customZoomDiv);
        }
      },
      saveConfirm() {
        console.log(this.infoId)
        let that = this
        let info = {
          address: this.locations.poiaddress,
          lng: this.locations.latlng.lng,
          lat: this.locations.latlng.lat
        }
        visitSign(this.infoId, info).then(res => {
          console.log(res)
          if (res.code === 200 || res.code === '200') {
            that.$vux.toast.show({
              text: '签到成功!',
              type: "success",
              time: 1000
            })
            setTimeout(function () {
              that.$router.back(-1)
            }, 1000)
          } else {
            that.$vux.toast.show({
              text: res.data.msg,
              type: "warn",
              time: 1000
            })
          }
        })
      }
    },
    mounted() {
      this.infoId = this.$route.query.infoId; // 列表的id
      let that = this
      window.addEventListener('message', function (event) {
        // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
        var loc = event.data;
        that.locations = event.data;
        if (loc && loc.module == 'locationPicker') { //防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
          console.log('location', loc);
          that.show5 = true
        }
      }, false);
      this.drawSign()
    }
  }

</script>

<style lang="less" scoped>
  .map_style {
    width: 100%;
    height: 100vh;
  }

</style>
