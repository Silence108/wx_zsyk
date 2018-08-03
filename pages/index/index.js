//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    imgUrls: [],
    mentorList: [],
    indicatorDots: true,
    indicatorColor: '',
    indicatorActiveColor: '#039FEC',
    autoplay: true,
    interval: 5000,
    duration: 500,
    x: wx.getSystemInfoSync().windowWidth - 20,
    y: wx.getSystemInfoSync().windowHeight -20
  },
  // 点击投诉建议
  feedback: function(){
    wx.navigateTo({
      url: '/pages/feedback/feedback',
    })
  },
  // 获取数据
  getData: function (accessToken) {
    var that = this,
      IP = app.globalData.IP;
    // 获取首页广告
    wx.request({
      url: IP + '/banner/list',
      data: {
        'type': 1
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == '200') {
          that.setData({
            imgUrls: res.data.datas
          })
        } else if (res.data.code == '404') {
          wx.showToast({
            title: '暂无轮播图',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '请求超时，请重试',
          icon: 'none',
          duration: 2000
        })
      }
    });
    // 获取首页名师推荐
    wx.request({
      url: IP + '/trainer/recommend',
      data: {
        'accessToken': accessToken,
        'hotnum': 3
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == '200') {
          that.setData({
            mentorList: res.data.datas
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
          that.setData({
            mentorList: ''
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
    });
    // 获取首页视频推荐
    wx.request({
      url: IP + '/course/vedio_recommend',
      data: {
        'accessToken': accessToken,
        'hotnum': 4
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == '200') {
          that.setData({
            videoList: res.data.datas
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
          that.setData({
            videoList: ''
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
    // 获取首页课程推荐
    wx.request({
      url: IP + '/course/personal_recommend',
      data: {
        'accessToken': accessToken,
        'hotnum': 5
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == '200') {
          var list = res.data.datas
          for (var i = 0; i < list.length; i++) {
            list[i].starttime = app.timeStamp2String(list[i].starttime, 9)
          }
          that.setData({
            courseList: list
          })
        } else {
          that.setData({
            courseList: ''
          })
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

  onLoad: function () {
    // console.log(wx.getStorageSync('accessToken'))
    var that = this;
    that.getData(wx.getStorageSync('accessToken'));
    wx.getSystemInfo({
      success: function (res) {
        console.info(app.globalData);
        wx.request({
          url: app.globalData.IP + '/system/start',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          method: 'POST',
          data: {
            accessToken: wx.getStorageSync('accessToken'),
            model: res.model,
            pixelRatio: res.pixelRatio,
            screenDpi: res.windowWidth + "X" + res.windowHeight,
            language: res.language,
            wxVersion: res.version,
            system: res.system,
            platform: res.platform,
            sdkVersion: res.SDKVersion,
            network: app.globalData.netWorkType
          },
          success: function (e) {
            if (e.data.code == '200') {
              wx.showToast({
                title: '欢迎您使用掌上悦客',
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      }
    })
  },
  onShow: function(){
    var that = this;
    that.getData(wx.getStorageSync('accessToken'));
  },
  // 搜索入口  
  wxSearchTab: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  }
  
})
