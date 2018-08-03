// pages/mentorList/mentorList.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  getCourseList: function (pagenum, pagesize) {
    var that = this,
      IP = app.globalData.IP,
      accessToken = wx.getStorageSync('accessToken');
    wx.request({
      url: IP + '/course/my_apply_course',
      data: {
        'accessToken': accessToken,
        'pagenum': pagenum,
        'pagesize': pagesize
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == '200') {
          var list = res.data.datas.list
          for (var i = 0; i < list.length; i++) {
            list[i].starttime = app.timeStamp2String(list[i].starttime, 9)
            list[i].endtime = app.timeStamp2String(list[i].endtime, 9)
            list[i].applytime = app.timeStamp2String(list[i].applytime, 9)
          }
          that.setData({
            courseList: list
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
          that.setData({
            courseList: ''
          })
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    that.getCourseList(1, 10)
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