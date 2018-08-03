// pages/user/user.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    isChange: false
  },
  // 获取用户信息
  getUserInfo: function (e) {
    console.log(e.detail);
    var that = this,
      data = e.detail,
      IP = app.globalData.IP;
    if (data.errMsg == 'getUserInfo:ok') {
      app.wxLogin(data.userInfo,function(data){
        // console.log(data);
        that.loadUserInfo(data);
        that.setData({
          isLogin: true
        })
      });
    }
  },
  // 点击修改个性签名按钮
  signatureClick: function(e){
    var that = this;
    that.setData({
      isChange: true
    })
  }, 
  // 点击修改个性签名按钮
  showBox: function(e) {
    var that = this;
    that.setData({
      isChange: true
    })
  },
  // 监听签名改变
  signatureChange: function (e) {
    var that = this;
    console.log(e.detail.value);
    that.setData({
      signature: e.detail.value
    })
  },
  // 取消修改签名
  cancel: function(e){
    var that = this;
    that.setData({
      isChange: false
    })
  },
  // 修改签名点击完成
  confirmS: function(e){
    var that = this,
      IP = app.globalData.IP,
      accessToken = wx.getStorageSync('accessToken'),
      signature = that.data.signature;
    wx.request({
      url: IP + '/student/edit_signature',
      data: {
        accessToken: accessToken,
        signature: signature
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success: function(res){
        console.log(res.data);
        if(res.data.code == '200'){
          that.setData({
            signature: res.data.datas,
            isChange: false
          });
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        // 修改个性签名超时
        wx.showToast({
          title: '请求参数错误',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 加载个人中心数据
  loadUserInfo: function (accesToken) {
    // console.log(accesToken)
    var that = this,
      flag = true,
      IP = app.globalData.IP;
    wx.request({
      url: IP + '/student/mycenter',
      data: {
        'accessToken': accesToken
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == '200') {
          that.setData({
            userInfo: res.data.datas,
            signature: res.data.datas.userinfo.signature
          });
          flag = true;
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
          flag = true;
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '请求超时',
          icon: 'none',
          duration: 2000
        });
        flag = true;
      }
    })
    return flag;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'accessToken',
      success: function (res) {
        // console.log(res.data);
        if (res.data == 0){
          that.setData({
            isLogin: false
          })
        }else{
          that.setData({
            isLogin: true
          });
        }
        that.loadUserInfo(res.data)
      },
      fail: function (res) {
        that.loadUserInfo(0);
        that.setData({
          isLogin: false
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
    var that = this;
    wx.getStorage({
      key: 'accessToken',
      success: function (res) {
        // console.log(res.data);
        if (res.data == 0) {
          that.setData({
            isLogin: false
          })
        } else {
          that.setData({
            isLogin: true
          });
        }
        that.loadUserInfo(res.data)
      },
      fail: function (res) {
        that.loadUserInfo(0);
        that.setData({
          isLogin: false
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
  // onPullDownRefresh: function () {

  // },

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