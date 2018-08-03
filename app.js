//app.js
var QQMapWX = require('/utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
App({
  globalData: {
    latitude: '',
    longitude: '',
    location: '',
    netWorkType: '',
    userInfo: null,
    IP: 'https://api.qiliang1033.com/v1'
    //IP: 'http://192.168.1.14:9090/zsyk-api/api/v1'
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [],
      that = this;
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    console.log(wx.getStorageSync('accessToken'))
    if (wx.getStorageSync('accessToken') == undefined || wx.getStorageSync('accessToken') == '') {
      wx.setStorageSync('accessToken', 0);
    }
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    // 启动接口
    wx.getNetworkType({
      success: function (res) {
        that.globalData.netWorkType = res.networkType;
      }
    });
    qqmapsdk = new QQMapWX({
      key: 'I35BZ-5NXCQ-6DI5W-GN2JS-5O7PH-X4FST'
    });
    that.getLocation();
  },
  // 登录操作
  wxLogin: function (userInfo, callBack) {
    var that = this,
      IP = that.globalData.IP,
      accessToken = 0;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(res);
        wx.request({
          url: IP + '/login/index',
          data: {
            'code': res.code
          },
          success: function (r) {
            if (r.data.code == '200') {
              wx.request({
                url: IP + '/login/saveuserinfo',
                data: {
                  'userinfo': JSON.stringify(userInfo),
                  'openid': r.data.datas,
                  'location': that.globalData.location,
                  'latitude': that.globalData.latitude,
                  'longitude': that.globalData.longitude
                },
                header: { 'content-type': 'application/x-www-form-urlencoded' },
                method: 'POST',
                success: function (e) {
                  if (e.data.code == '200') {
                    wx.setStorageSync('accessToken', e.data.datas);
                    wx.setStorageSync('openid', r.data.datas);
                    callBack(e.data.datas);
                    // 保存用户信息成功
                    wx.showToast({
                      title: e.data.message,
                      icon: 'none',
                      duration: 2000
                    });
                  } else {
                    callBack(0);
                    wx.showToast({
                      title: '保存用户信息失败',
                      icon: 'none',
                      duration: 2000
                    })
                  }
                },
                fail: function (r) {
                  // 保存用户信息接口调用失败
                  callBack(0);
                  wx.showToast({
                    title: '获取用户信息失败',
                    icon: 'none',
                    duration: 2000
                  })
                }
              })
            }
          }
        })
      },
      fail: function () {
        wx.showToast({
          title: '登录失败',
          icon: 'none',
          duration: 2000
        })
      }
    });
    return accessToken;
  },
  // 获取省市区
  getCity: function (parentid, level, callBack) {
    var that = this,
      IP = that.globalData.IP;
    wx.request({
      url: IP + '/common/area',
      data: {
        parentid: parentid,
        level: level
      },
      success: function (res) {
        if (res.data.code == '200') {
          var list = res.data.datas,
            listName = [];
          for (var i = 0; i < list.length; i++) {
            listName[i] = list[i].name;
          }
          callBack({
            status: true,
            list: list,
            listName: listName
          });
        } else {
          callBack({
            status: false,
            list: ''
          });
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function () {
        callBack({
          status: false,
          list: ''
        });
        wx.showToast({
          title: '请求超时',
          icon: 'none',
          duration: 2000
        })
      }

    })
  },
  // 提交评论接口
  submitComment: function (targetuid, targettype, content, callBack){
    var that = this,
      IP = that.globalData.IP,
      accessToken = wx.getStorageSync('accessToken');
    if (accessToken == null || accessToken == undefined || accessToken == '' || accessToken == 0){
      wx.showModal({
        title: '提示',
        content: '你还没有登录，是否登录后继续？',
        confirmText: '去登录',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            wx.switchTab({
              url: '/pages/user/user',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else {
      wx.request({
        url: IP + '/comment/submit',
        data: {
          accessToken: accessToken,
          targetuid: targetuid,
          targettype: targettype,
          content: content
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        success: function (res) {
          console.log(res.data);
          callBack(res.data)
        },
        fail: function () {
          wx.showToast({
            title: '请求参数错误',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },
  // 获取评论
  getComment: function (targetuid, targettype, pagenum, pagesize, callBack) {
    // 获取课程评价列表
    // 评论目标类型 1. 回复评论; 2. 私教评论; 3. 视频课程评论; 4. 个人线下课程评论
    console.log(accessToken)
    console.log(targetuid)
    console.log(targettype)
    var that = this,
      IP = that.globalData.IP,
      accessToken = wx.getStorageSync('accessToken');
    wx.request({
      url: IP + '/comment/list',
      data: {
        accessToken: accessToken,
        targetuid: targetuid,
        targettype: targettype,
        pagenum: pagenum,
        pagesize: pagesize
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == '200') {
          var list = res.data.datas;
          callBack({
            status: true,
            list: list
          });
        } else {
          callBack({
            status: false,
            list: '',
            message: res.data.message
          });
        }
      },
      fail: function (res) {
        callBack({
          status: false,
          list: ''
        });
        wx.showToast({
          title: '请求超时',
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
  // 转换时间
  timeStamp2String: function (time, type) {
    var datetime = new Date();
    datetime.setTime(time);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    if (type == '1') {
      return year + "年" + month + "月" + date + "日";
    }
    if (type == '2') {
      return year + "-" + month + "-" + date;
    }
    if (type == '3') {
      return month + "-" + date;
    }
    if (type == '4') {
      return month;
    }
    if (type == '5') {
      return date;
    }
    if (type == '6') {
      return year + "." + month + "." + date + " " + hour + ":" + minute + ":" + second;
    }
    if (type == '7') {
      return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    }
    if (type == '8') {
      return year + "-" + month + "-" + date + " " + hour + ":" + minute;
    }
    if (type == '9') {
      return month + "-" + date + " " + hour + ":" + minute;
    }
  },
  getLocation: function () {
    var that = this;
    //1、获取当前位置坐标
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            var address = addressRes.result.formatted_addresses.recommend;
            that.globalData.location = address;
            that.globalData.latitude = res.latitude;
            that.globalData.longitude = res.longitude;
          }
        })
      }
    })
  }
})