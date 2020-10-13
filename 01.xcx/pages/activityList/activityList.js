// pages/redeem/redeem.js
let util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content_height:0,
    show_icon: true,
    isopen: true,
    isShow:false,
    headbg:'',
    content:'',
    bgColor:'#fff',
    title:'',
    activity_id:'',
    newNews: false,
    total_amout: 0,
    topNum: 0,
    redShowList:[],
    redList: [],
    apiUrl: app.globalData.apiUrl,
    height: '',
    allowScorll: true,
    isSign: true,
    total: 0,
    page: 0,
    limit: 6,
    is_end: false,
    top: 0,
    hasData: true,
    is_load: true,
    is_iphonex: app.globalData.phoneType
  },
  goPro: function(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  scroll: function(e) {
    if (e.detail.scrollTop >= 980) {
      this.setData({
        isSign: false
      })
    } else {
      this.setData({
        isSign: true
      })
    }
  },
  openText:function(e){
    console.log(e)
    const that = this
    if (this.data.isopen){
      // that.animation.height(70).step()
      that.setData({
        // animation: that.animation.export(),
        isopen:false
      })
    }else{
      console.log(that.data.content_height)
        // that.animation.height(that.data.content_height).step()
        // that.setData({
        //   animation: that.animation.export()
        // })
        setTimeout(function(){
          that.setData({
            isopen: true
          })
        },400)
    }
  },
  returnTop: function() {
    this.setData({
      isSign: true
    })
    if (this.data.topNum == 0) {
      this.setData({
        topNum: 1
      })
    } else {
      this.setData({
        topNum: 0
      })
    }
  },
  getList: function() {
    var that = this
    util.queryRequest('?m=list&a=schemeGoodsList', {
      scheme_id: that.data.activity_id
    }, 'GET', function(res) {
      wx.hideLoading()
      if (res.isSuccess == true) {
        wx.setNavigationBarTitle({
          title: res.data.moudule.title
        })
        that.setData({
          headbg: res.data.moudule.list_img,
          content: res.data.moudule.content,
          title: res.data.moudule.title,
          bgColor: res.data.moudule.color
        })
        if (res.data.moudule.content!=''){
          if (that.data.content_height > 70) {
            that.setData({
              show_icon: true,
              isopen: false
            })
            // that.animation.height(70).step()
            // that.setData({
            //   animation: that.animation.export()
            // })
          } else {
            var query = wx.createSelectorQuery()
            query.select('.content_info').boundingClientRect()
            query.exec(function (res) {
              that.setData({
                content_height: res[0].height
              })
              console.log(res[0].height)
              if (res[0].height <= 80) {
                that.setData({
                  show_icon: false,
                  isopen: false
                })
              } else {
                that.setData({
                  show_icon: true,
                  isopen: false
                })
                // that.animation.height(70).step()
                // that.setData({
                //   animation: that.animation.export()
                // })
              }
            })
          }
        }
        wx.hideLoading()
        if (res.data.list.rows!=undefined && res.data.list.rows.length > 0) {
          let currentpage = that.data.page
          console.log(that.data.page)
          that.data.redList = res.data.list.rows
          if (currentpage === 0) {
            that.setData({
              redShowList: []
            })
          }
          that.setData({
            ['redShowList[' + currentpage + ']']: res.data.list.rows[currentpage],
            total: res.data.list.total,
            limit: res.data.list.limit,
            hasData: true,
            is_end: false,
            isShow: true
          })
          // 如果一页加载数据等于总条数
          if (res.data.list.rows[currentpage].length < res.data.list.limit || res.data.list.rows.length==1) {
            that.setData({
              is_load: false,
              hasData: true,
              is_end: true,
              isShow: true
            })
          }
        } else {
          that.setData({
            is_load: false,
            hasData: false,
            is_end: true
          })
        }
        console.log(that.data.redShowList)
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      activity_id: options.id,
      redShowList:[]
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f9f9f9',
    })
    this.getList()
  },
  // 上拉加载更多
  loadMore: function() {
    var that = this
    if (this.data.is_load) {
      this.data.is_load = false;
      console.log(that.data.page)
      console.log(that.data.redList.length)
      if (that.data.page < that.data.redList.length-1){
        ++that.data.page
        let currentpage = that.data.page
        that.setData({
          ['redShowList[' + currentpage + ']']: that.data.redList[currentpage],
          is_end: false,
          is_load: true
        })
        console.log(that.data.redList[currentpage].length)
        console.log(that.data.limit)
        if (that.data.redList[currentpage].length < that.data.limit || currentpage == that.data.redList.length) {
          that.setData({
            is_load: false,
            hasData: true,
            is_end: true
          })
        }
      }else{
        that.setData({
          is_load: false,
          hasData: true,
          is_end: true
        })
      }
      console.log(this.data.redShowList)

    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // this.animation = wx.createAnimation({
    //   duration: 400
    // })
  },
  // showDialog() {
  //   this.dialog.showReload()
  // },
  // _relaod() {
  //   util.loadPage(this)
  //   console.log('触发relaod')
  // },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('show'+this.data.content_height)
    this.setData({
      newNews: app.globalData.news,
      total_amout: app.globalData.carNum,
      is_iphonex: app.globalData.phoneType,
      isShow:true,
    })
      // ,
      // is_load: true,
      //   isShow: false,
      //     show_icon: true,
      //       isopen: true
    // this.animation = wx.createAnimation({
    //   duration: 400
    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})