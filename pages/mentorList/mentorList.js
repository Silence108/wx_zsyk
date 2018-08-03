// pages/mentorList/mentorList.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 获取私教列表
  getList: function (pagenum, pagesize){
    var that = this,
      IP = app.globalData.IP,
      accessToken = wx.getStorageSync('accessToken');
    console.log(accessToken);
    // 获取私教列表
    wx.request({
      url: IP + '/trainer/list',
      data: {
        'accessToken': accessToken,
        'pagenum': pagenum,
        'pagesize': pagesize
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == '200') {
          var list = res.data.datas.list;
          console.log(res.data.datas.list);
          that.setData({
            list: list
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
          that.setData({
            list: ''
          })
        }
      },
      fail: function (res) {
        console.log('请求参数错误')
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    that.getList(1,10)
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
    var that = this;
    that.getList(1,10)
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