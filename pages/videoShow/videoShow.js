// pages/videoShow/videoShow.js
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Tab: 0,
    current: 0
  },
  listenerVideo: function (e) {
    console.log('视频播放'+e.detail.errMsg);
  },
  
  // 选项卡
  tabChange: function (e) {
    var that = this,
      id = e.target.dataset.id;
    if (that.data.Tab == id) {
      return
    } else {
      that.setData({
        'Tab': id,
        'current': id
      })
    }
  },
  // 监听滑动事件
  currentChange: function (e) {
    // console.log(e.detail.current);
    var that = this,
      id = e.detail.current;
    that.setData({
      'Tab': id,
      'current': id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this,
      accessToken = wx.getStorageSync('accessToken'),
      IP = app.globalData.IP,
      uuid = options.uuid;
    wx.request({
      url: IP + '/course/vedio_detail',
      data: {
        accessToken: accessToken,
        uuid: uuid
      },
      success:function(res){
        console.log(res.data);
        console.log(app.globalData.userInfo);
        if (res.data.code == '200') {
          that.setData({
            show: res.data.datas,
            userinfo: app.globalData.userInfo
          })
          WxParse.wxParse('article', 'html', res.data.datas.content, that, 5);
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '请求超时',
          icon: 'none',
          duration: 2000
        })
      }
    })
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var that = this,
     uuid = that.data.uuid;
    // 获取评论
    app.getComment(uuid, 3, 1, 10, function (data) {
      console.log(data);
      if (data.status) {
        console.log(data.list.list)
        that.setData({
          commentlist: data.list.list,
          hasData: true
        })
      } else {
        that.setData({
          commentlist: '',
          hasData: false
        })
      }
    })
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