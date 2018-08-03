// pages/mentorInfo/mentorInfo.js
var app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this,
      IP = app.globalData.IP,
      accessToken = wx.getStorageSync('accessToken'),
      uuid = options.uuid;
    // 获取私教详情
    wx.request({
      url: IP + '/trainer/detail',
      data: {
        'accessToken': accessToken,
        'uuid': uuid
      },
      success: function(res){
        console.log(res.data);
        if(res.data.code == '200'){
          that.setData({
            'userInfo': res.data.datas
          });
        }else {
          wx.showToast({
            title: res.data.massage,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function(res){
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