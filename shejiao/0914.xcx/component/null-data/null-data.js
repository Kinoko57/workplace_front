var app = getApp()
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    showNullImg: {
      type: Boolean,
      value: true
    },
    loadingText: {
      type: String,
      value: '加载中...'
    },
    loadingShow: {
      type: Boolean,
      value: false
    },
    bottomText: {
      type: String,
      value: '到底了~'
    },
    bottomShow: {
      type: Boolean,
      value: false
    },
    dataText: {
      type: String,
      value: '暂无数据'
    },
    dataShow: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 弹窗显示控制
    is_iphonex: app.globalData.isiPhoneX,
    isAllScreen: app.globalData.isAllScreen,
    staticUrl: app.globalData.staticUrl

  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */

    // //隐藏弹框
    // hide() {
    //   this.setData({
    //     isShow: !this.data.isShow
    //   })
    // },
    // //展示弹框
    // show() {
    //   this.setData({
    //     isShow: !this.data.isShow
    //   })
    // },
    // /*
    //  * 内部私有方法建议以下划线开头
    //  * triggerEvent 用于触发事件
    //  */
    // _cancelEvent() {
    //   //触发取消回调
    //   this.triggerEvent("cancelEvent")
    // },
    // _actionEvent() {
    //   //触发成功回调
    //   this.triggerEvent("actionEvent");
    // }
  }
});