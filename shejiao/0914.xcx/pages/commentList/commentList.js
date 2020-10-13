// pages/commentList/commentList.js
let util = require('../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSkeleton: true, //骨架屏显示隐藏
    typeList: [{
        key: 0,
        name: '全部',
        num: 2
      },
      {
        key: 1,
        name: '外观美',
        num: 6
      },
      {
        key: 2,
        name: '质量好',
        num: 8
      }
    ],
    commentList: [],
    goods_id: '',
    page: 1,
    size: 6,
    label: 'all',
    total: 0,
    page_num:0,
    is_end:false,
    hasData:false,
    show_open: false,
    show_more: false,
    is_end: true,
    hasData: true,
  },
  changeType: util.throttle(function () {
    this.setData({
      show_more: !this.data.show_more
    })
  }),
  viewImage: util.throttle(function (e) {
    console.log(e[0])
    let that = this
    // 父级idconsole.log(e[0].currentTarget.dataset.pindex)
    let pid = e[0].currentTarget.dataset.pindex
    let index = e[0].currentTarget.id
    // 当前index console.log(e[0].currentTarget.id)
    let pindex = that.data.commentList.findIndex((item) => item.com_id == pid)
    wx.previewImage({
      current: that.data.commentList[pindex].image[index], // 当前显示图片的http链接
      urls: that.data.commentList[pindex].image // 需要预览的图片http链接列表
    })
  }),
  getTypeList:function(){
    let that = this
    util.queryRequest('/app/comment/getNum',{
      goods_id: this.data.goods_id
    },"GET").then(function(res){
      if(res.code == 200){
        console.log(res.data)
        that.setData({
          typeList:res.data,
          label: res.data[0].key
        })
        that.getList()
      }
    })
  },
  choseCommentType:util.throttle(function(e){
    if(e[0].currentTarget.id==this.data.label){
      console.log("已经选中了")
    }else{
      this.setData({
        page: 1,
        size: this.data.size,
        label: e[0].currentTarget.id,
        commentList: [],
        total: 0,
        page_num: 0,
        is_end: false,
        hasData: true
      })
      this.getList()
    }
  }),
  getList:function(){
    let that = this
    let info ={
      page: this.data.page,
      size: this.data.size,
      label: this.data.label,
      type: 0,
      goods_id: this.data.goods_id,
      last_id:0
    }
    util.queryRequest('/app/comment/index',info,"GET").then(function(res){
      if(res.code == 200){
        console.log(res.data)
        if(res.data.rows.length>0){
          that.setData({
            commentList: res.data.rows,
            total: res.data.total,
            page_num: Math.ceil(res.data.total / that.data.size),
            is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
            hasData: true
          })
        }else{
          that.setData({
            commentList: [],
            total: 0,
            page_num: 0,
            is_end: true,
            hasData: false
          })
        }

      }
    })
  },
  loadMore() {
      let that = this
      let info ={
        page: ++this.data.page,
        size: this.data.size,
        label: this.data.label,
        type:0,
        goods_id: this.data.goods_id,
        last_id:0
      }
      util.queryRequest('/app/comment/index',info,"GET").then(function(res){
        if(res.code == 200){
          if(res.data.rows.length>0){
            that.data.commentList = that.data.commentList.concat(res.data.rows)
            that.setData({
              commentList: that.data.commentList,
              is_end: that.data.page_num == that.data.page
            })
          }else{
            that.setData({
              is_end: true
            })
          }

        }
      })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    let that = this
    this.setData({
      goods_id: options.id
    })
    let query3 = wx.createSelectorQuery()
    query3.select('.comment_type_list').boundingClientRect()
    query3.exec(function (req) {
      console.log(req)
      if (req[0].height > 60) {
        //展示查看更多
        that.setData({
          show_open: true,
          show_more: true,
        })
      } else {
        that.setData({
          show_open: false,
          show_more: false
        })
      }
    })
    this.getTypeList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.is_end==false){
      this.loadMore()
    }else{
      console.log("加载完了")
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})