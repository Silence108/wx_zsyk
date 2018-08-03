// pages/courseShow/courseShow.js
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    Tab: 0,
    current: 0,
    isConsult: false,
    settingHidden: true,
    detail:null,
    remark: ''
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
  // 点击我要咨询
  consult: function(e){
    var that = this;
    that.setData({
      isConsult: true
    })
  },
  // 取消咨询框
  cancel: function (e) {
    var that = this;
    that.setData({
      isConsult: false
    })
  },
  // 监听输入咨询内容
  consultInput: function(e){
    var that = this;
    // console.log(e.detail.value)
    that.setData({
      consult: e.detail.value
    });
  },
  // 发送咨询内容
  sendConsult:function(e){
    var that = this,
      content = that.data.consult,
      uuid = that.data.uuid;
    app.submitComment(uuid,4,content,function(data){
      console.log(data);
      that.setData({
        isConsult: false
      })
      // 获取评论
      app.getComment(uuid, 4, 1, 10, function (data) {
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
      wx.showToast({
        title: data.message,
        icon: 'none',
        duration: 2000
      })
    });
  },
  // 我要报名
  signUp: function(e){
    var that = this,
      uuid = that.data.uuid,
      IP = app.globalData.IP,
      accessToken = wx.getStorageSync('accessToken'),
      isapply = that.data.isapply,
      applynum = that.data.applynum,
      status = 1,
      remark = that.data.remark;
    if (accessToken == null || accessToken == undefined || accessToken == '' || accessToken == 0) {
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
      console.info("报名状态： "+isapply);
      if(isapply){
        status = 0;
        isapply=false;
        applynum = applynum-1;
      }else{
        status=1;
        isapply = true;
        applynum = applynum+1;
      }
      wx.request({
        url: IP + '/apply/submit_or_canel',
        data: {
          accessToken: accessToken,
          uuid: uuid,
          status: status,
          remark: remark
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        success: function (res) {
          console.log(res.data);
          that.setData({
            applynum, applynum,
            isapply: isapply
          });
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
        }
      })
    }
  },
  signDown:function(){
    var that = this;
    that.setData({
      settingTitle:'取消原因',
      settingHidden:false
    });

  },
  onSettingTextInput: function (e) {
    var that = this;
    that.setData({
      remark: e.detail.value
    });
  },
  onSettingConfirm: function(e){
    var that = this;
    that.signUp();
    that.setData({
      settingHidden: true
    });

  },
  onSettingCancel: function (e) {
    var that = this;
    that.setData({
      settingHidden: true
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this,
      IP = app.globalData.IP,
      accessToken = wx.getStorageSync('accessToken'),
      uuid = options.uuid;
    that.setData({
      uuid: uuid
    })
    // 获取课程详情
    wx.request({
      url: IP + '/course/personal_detail',
      data: {
        accessToken: accessToken,
        uuid: uuid
      },
      success: function (res) {
        console.log(res.data);
        console.log(app.globalData.userInfo);
        if (res.data.code == '200') {
          var detail = res.data.datas;
          detail.starttime = app.timeStamp2String(detail.starttime, 9);
          detail.endtime = app.timeStamp2String(detail.endtime, 9);
          WxParse.wxParse('article', 'html', detail.content, that, 5);
          that.setData({
            applynum: detail.applynum,
            detail: detail,
            isapply: detail.isapply
          });
          wx.setNavigationBarTitle({
            title: detail.course
          })
        } else {
          wx.showToast({
            title: '请求参数错误',
            icon: 'none',
            duration: 2000
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
    // 获取评论
    app.getComment(uuid, 4, 1, 10, function(data) {
      console.log(data);
      if(data.status){
        console.log(data.list.list)
        that.setData({
          commentlist: data.list.list,
          hasData: true
        })
      }else {
        that.setData({
          commentlist: '',
          hasData: false
        })
      }
    })
  },
  /**
    * 监听定位到当前位置
    */
  listenerBtnGetLocation: function (event) {
    wx.getLocation({
      //定位类型 wgs84, gcj02
      type: 'gcj02',
      success: function (res) {
        console.log(res)
        wx.openLocation({
          //当前经纬度
          latitude: Number(event.currentTarget.dataset.latitude),
          longitude: Number(event.currentTarget.dataset.longitude),
          //缩放级别默认28
          scale: 28,
          //位置名
          name: '授课地点:' + event.currentTarget.dataset.address,
          //详细地址
          address: event.currentTarget.dataset.address,
          //成功打印信息
          success: function (res) {
            console.log(res)
          },
          //失败打印信息
          fail: function (err) {
            console.log(err)
          },
          //完成打印信息
          complete: function (info) {
            console.log(info)
          },
        })

      },
      fail: function (err) {
        console.log(err)
      },
      complete: function (info) {
        console.log(info)
      },
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

  },
  sendMsgNotice: function (e) {
    console.info(e.detail.formId);
    var that = this,
       IP = app.globalData.IP;
    wx.request({
      url: IP + '/apply/wxNotice',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        jsonStrParam: JSON.stringify({
              touser: wx.getStorageSync('openid'),
              template_id: 'is8qeiQKU5T2Jge9i-riECQqMeKQykRrU7DQfUdm9TY',
              form_id: e.detail.formId,
              page: "pages/myCourseList/myCourseList",
              color: "red",//颜色  
              emphasis_keyword: "keyword1.DATA",//需要着重显示的关键词  
              data: {
                keyword1: { value: that.data.detail.title, color: "#173177" },
                keyword2: { value: that.data.detail.address, color: "#173177" },
                keyword3: { value: that.data.detail.userinfo.realname, color: "#173177" },
                keyword4: { value: that.data.detail.starttime, color: "#173177" },
              }
            }) 
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        if(res.data.code==200){
          that.signUp();
        }else{
          wx.showToast({
            title: '报名失败，请重试！',
            icon: 'none',
            duration: 2000
          });
        }
        
      },
      fail: function (err) {
        console.log('request fail ', err);
      },
      complete: function (res) {
        console.log("request completed!");
      }
    })
  }
})