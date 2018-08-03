// pages/feedback/feedback.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList: ['功能反馈','界面反馈'],
    typeIndex: 0,
    imgNumber: true,
    count: 3,
    feed: '',
    imglist: [],
    imglists: ''
  },
  // 选择反馈类型
  bindTypeChange: function (e) {
    var taht = this;
    taht.setData({
      typeIndex: e.detail.value
    })
  },
  // 监听反馈意见输入
  feedChange: function(e){
    var that = this;
    // console.log(e.detail.value)
    that.setData({
      feed: e.detail.value
    });
    // console.log(that.data.feed)
  },
  // 监听手机号输入
  telChange: function (e) {
    var that = this;
    that.setData({
      tel: e.detail.value
    });
  },
  // 监听邮箱号输入
  emailChange: function (e) {
    var that = this;
    that.setData({
      email: e.detail.value
    });
  },
  // 选择图片
  chooseImages: function (e) {
    var that = this,
      count = that.data.count,
      IP = app.globalData.IP,
      imglist = that.data.imglist,
      imgslist = that.data.imglists;
    // console.log(imglist)
    console.log(imgslist)
    if (imglist == '' || imglist == null || imglist == undefined) {
      count = 3;
    } else {
      count = 3 - imglist.length;
      if (count == 0) {
        that.setData({
          imgNumber: false
        })
      }
    }
    if (imglist != '' || imglist != null || count <= 3 || count > 0) {
      // console.log(count)
      if (count == 0) {
        that.setData({
          imgNumber: false
        })
      }
      // console.log(count)
      wx.chooseImage({
        count: count, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          // console.log(imglist);
          if (imglist == '' || imglist == null || imglist == undefined) {
            imglist = res.tempFilePaths;
            if (imglist.length >= 3) {
              that.setData({
                imgNumber: false,
              })
            }
            that.setData({
              count: imglist.length
            })
          } else {
            imglist = imglist.concat(res.tempFilePaths);
            if (imglist.length >= 3) {
              that.setData({
                imgNumber: false,
              })
            }
          }
          that.setData({
            imglist: imglist
          })
          for (var i = 0; i < res.tempFilePaths.length; i++) {
            // console.log(i)
            wx.uploadFile({
              url: IP + '/upload/single',
              filePath: res.tempFilePaths[i],
              name: 'file',
              success: function (res) {
                var data = JSON.parse(res.data);
                if(data.code == '200'){
                  // console.log(data);
                  var imgurl = data.datas.id;
                  
                  imgslist += imgurl + ',';
                  console.log(imgslist)
                  that.setData({
                    imglists: imgslist
                  })
                }
              }
            })
          }
        }
      })
    }
  },
  // 查看图片
  readimg: function (e) {
    var that = this,
      imgurl = e.target.dataset.imgsrc;
    console.log(imgurl)
    wx.previewImage({
      current: imgurl, // 当前显示图片的http链接
      urls: that.data.imglist // 需要预览的图片http链接列表
    })
  },
  sub: function(e){
    var that = this,
      IP = app.globalData.IP,
      accessToken = wx.getStorageSync('accessToken'),
      content = that.data.feed,
      category = that.data.typeObj[that.data.typeIndex].id,
      mobile = that.data.tel,
      email = that.data.email,
      attachids = that.data.imglists;
    // console.log(accessToken)
    // console.log(content)
    // console.log(category)
    // console.log(mobile)
    // console.log(email)
    console.log(attachids);
    if (content == '' || content == null || content == undefined){
      wx.showToast({
        title: '请输入您的宝贵意见',
        icon: 'none',
        duration: 2000
      })
    }else {
      if (attachids == '' || attachids == null || attachids == undefined) {
        attachids = '';
      }
      if (mobile == '' || mobile == null || mobile == undefined) {
        mobile = '';
      }
      if (email == '' || email == null || email == undefined) {
        email = '';
      }
      wx.request({
        url: IP + '/suggest/submit',
        data: {
          accessToken: accessToken,
          content: content,
          mobile: mobile,
          email: email,
          category: category,
          attachids: attachids
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        success: function (res) {
          console.log(res.data);
          if(res.data.code == '200'){
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000
            });
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }, 2000);

          }
          
        },
        fail: function(){
          wx.showToast({
            title: '请求参数错误',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this,
      IP = app.globalData.IP;
    // 获取反馈类型列表
    wx.request({
      url: IP + '/common/dict?classid=1001',
      success:function(res){
        console.log(res.data);
        if(res.data.code == '200'){
          var data = res.data.datas,
            typeList = [];
          for (var i = 0; i < data.length; i++){
            typeList[i] = data[i].name
          }
          that.setData({
            typeObj: data,
            typeList: typeList
          })
        }else {
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