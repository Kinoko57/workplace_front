var app = getApp()
let util = require('../../utils/util.js')
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    typeSort: {
      type: String,
      value: ''
    },
    listStyle: {
      type: String,
      value: ''
    },
    flootItem:{
      type:Object,
      value:()=>{}
    },
    systimestamp: {
      type: String,
      value: ''
    },
    actionList:{
      type:Array,
      value:()=>[]
    },
    actionText: {
      type: String,
      value: ''
    },
    actionIcon: {
      type: String,
      value: ''
    },
    actionTips: {
      type: String,
      value: ''
    },
    cancelText: {
      type: String,
      value: '取消'
    },
    // 弹窗确认按钮文字
    confirmText: {
      type: String,
      value: '确定'
    }
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    selectorBlock: 'activity',
    moduleSkeleton: true, //骨架图
    // 弹窗显示控制
    isShow: false,
    isAllScreen: app.globalData.isAllScreen,
    list_style: '#cd2f54'
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    
    /*
     * 公有方法
     */

    //隐藏弹框
    hide() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    //展示弹框
    show() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    goDetail:util.throttle(function(e){
      console.log(e[0])
      let type = e[0].currentTarget.dataset.type
      let id = e[0].currentTarget.id
      wx.navigateTo({
        url: '../flashDetail/flashDetail?id=' +id+"&type=" + type,
      })
    }),
    goMore:util.throttle(function(e){
      console.log(e[0])
      let type = e[0].currentTarget.dataset.type
      let id = e[0].currentTarget.id
      let link=''
      switch(type){
        case 1: link='../flashSale/flashSale';break;
        case 2: link='../experienceArea/experienceArea';break;
        case 4: link='../spikeArea/spikeArea';break;
        case 5: link='../groupActivities/groupActivities';break;
        case 6: link='../integralArea/integralArea';break;
        case 7: link='../newShow/newShow';break;
        case 100: link='../specialActivity/specialActivity?id=' + id;break;
        default:link = '../proList/proList';break;
      }
      wx.navigateTo({
        url: link,
      })
    }),
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    _cancelEvent() {
      //触发取消回调
      this.triggerEvent("cancelEvent")
    },
    _actionEvent(e) {
      //触发成功回调
      console.log(e)
      this.triggerEvent("actionEvent",{id:e.currentTarget.id},{});
    }
  }
});