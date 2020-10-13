// pages/articleList/articleList.js
let col1H = 0;
let col2H = 0;
let util = require('../../utils/util.js')
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticUrl: app.globalData.staticUrl,
    showSkeleton: true, //骨架屏显示隐藏
    activityType: '',
    activityId: '',
    activityBanner: '',
    scrollHeight: 0,
    filePath: app.globalData.fileUrl,
    typeList:[],
    articleList:[],
    article_total: 0,
    page: 1,
    size: 6,
    page_num: 0,
    hasData: true,
    is_end: false,
    isTop: true,
    topNum: 0,
    scrollH: 0,
    imgWidth: 320,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: []
  },
  returnTop: function () {
    this.setData({
      topNum: 0,
    })
  },
  onImageLoad: function (list, id,width,height) {
    console.log(list)
    // console.log(e.currentTarget.id)
    // let imageId = e.currentTarget.id;
    // let oImgW = e.detail.width;         //图片原始宽度
    // let oImgH = e.detail.height;        //图片原始高度
    let imageId = id;
    let oImgW = width;         //图片原始宽度
    let oImgH = height;        //图片原始高度
    let imgWidth = this.data.imgWidth;  //图片设置的宽度
    let scale = imgWidth / oImgW;        //比例计算
    let imgHeight = oImgH * scale;      //自适应高度

    let images = list;
    let imageObj = null;

    for (let i = 0; i < images.length; i++) {
      if (images[i].id == imageId) {
        imageObj = images[i];
        break;
      }
    }

    imageObj.height = imgHeight;

    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;

    if (col1H <= col2H) {
      col1H += imgHeight + 66;
      col1.push(imageObj);
    } else {
      col2H += imgHeight + 66;
      col2.push(imageObj);
    }
    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2
    };
    if (!loadingCount) {
      data.images = [];
    }
    console.log(col1H)
    console.log(col2H)
    this.setData(data);
  },
  loadImages: function (list) {
    console.log(list)
    this.setData({
      loadingCount: list.length
    });
    let that = this
    for(let i = 0;i<list.length;i++){
      setTimeout(()=>{
        wx.downloadFile({
          url: list[i].image, 
          success (req) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (req.statusCode === 200) {
              wx.getImageInfo({
                src: req.tempFilePath,
                success (res) {
                  that.onImageLoad(list,list[i].id,res.width,res.height)
                }
              })
            }
          }
        })
      },100)
    }
  },
  goLink(event) {
    console.log(event)
    wx.navigateTo({
      url: event.currentTarget.dataset.link
    })
  },
  getArticleType(){
    let that = this
    util.queryRequest('/app/article/getCate',{},'GET').then(function(res){
      if(res.code == 200){
        let banner = ''
        for(let i = 0;i<res.data.length;i++){
          res.data[i].key = 'type_'+res.data[i].id
          if (that.data.activityId == res.data[i].id){
            banner = res.data[i].banner
          }
        }
        that.setData({
          typeList:res.data,
          activityType: 'type_' + that.data.activityId,
          activityBanner: banner
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 3000
        })
        console.log(res.msg)
      }
    })
  },
  choseTypeId(e){
    console.log(e)
    this.setData({
      activityId: e.currentTarget.dataset.type,
      activityType: e.currentTarget.id,
      activityBanner:e.currentTarget.dataset.banner,
      page: 1,
      size: this.data.size,
      articleList:[],
      col1: [],
      col2: [],
      loadingCount:0
    })
    col1H = 0
    col2H = 0
    this.getList()
  },
  getList(){
    let that = this
    let info={
      cate_id: this.data.activityId,
      page: this.data.page,
      size: this.data.size,
    }
    util.queryRequest('/app/article/index', info, 'GET').then(function (res) {
      if (res.code == 200) {
        if (res.data.rows.length>0){
          for (let i = 0; i < res.data.rows.length; i++) {
            res.data.rows[i].left = 1
            if (i % 2 == 0) {
              res.data.rows[i].left = 0
            }
          }
          that.setData({
            articleList: res.data.rows,
            article_total: res.data.total,
            page_num: Math.ceil(res.data.total / that.data.size),
            is_end: Math.ceil(res.data.total / that.data.size) == that.data.page,
            hasData: true
          })
          that.loadImages(res.data.rows);
        }else{
          that.setData({
            hasData: false,
            is_end: true
          })
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 3000
        })
        console.log(res.msg)
      }
    })
  },
  loadMore() {
    let that = this
    let info = {}
    if (this.data.is_end == false) {
      console.log('加载更多')
        info = {
          cate_id: this.data.activityId,
          page: ++this.data.page,
          size: this.data.size,
        }
      util.queryRequest('/app/article/index', info, 'GET').then(function (res) {
        wx.hideLoading()
        if (res.code == 200) {
          for (let i = 0; i < res.data.rows.length; i++) {
            res.data.rows[i].left = 1
            if (i % 2 == 0) {
              res.data.rows[i].left = 0
            }
          }
          that.setData({
            articleList: that.data.articleList.concat(res.data.rows),
            is_end: that.data.page_num == that.data.page
          })
          that.loadImages(res.data.rows);
        }
      })
    } else {
      console.log("加载完了")
    }

  },
  scroll: function (e) {
    if (e.detail.scrollTop >= 680) {
      if (this.data.isTop) {
        this.setData({
          isTop: false
        })
      }
    } else {
      if (this.data.isTop == false) {
        this.setData({
          isTop: true
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      activityId: options.id
    })
    col1H = 0
    col2H = 0
    // 获取分类列表
    this.getArticleType()
    // 根据id获取文章列表
    this.getList()
    let that = this
    setTimeout(() => { //3S后隐藏骨架屏
      that.setData({
        showSkeleton: false
      })
      let query1 = wx.createSelectorQuery()
      query1.select('.article_top').boundingClientRect()
      query1.exec(function (res) {
        that.setData({
          scrollHeight: app.globalData.useWindowHeight - res[0].height
        })
      })
    }, 500)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})