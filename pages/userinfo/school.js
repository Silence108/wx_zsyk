var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data:{
    surname: '',
    surnameinput: '',
    surnamelist: [],
    isContent: false,
    hasSurname: true
  },
  // 监听输入框
  changeInput: function (e) {
    var that = this;
    if (e.detail.value != '' && e.detail.value != null && e.detail.value != undefined) {
      that.setData({
        isContent: true,
        surname: e.detail.value
      })
    } else {
      that.setData({
        isContent: false,
        surname: e.detail.value
      })
    }
  },
  // 搜索
  searchSurname: function (e) {
    var that = this,
      surname = that.data.surname,
      sctype = that.data.sctype,
      provinceId = that.data.provinceId,
      cityId = that.data.cityId,
      countyId = that.data.countyId;
    // 获取学校列表
    that.getSchool(surname, sctype, provinceId, cityId, countyId, 1, 1000)
  },
  // 选择学校
  checkSurname: function (e) {
    var that = this,
      schoolnameid = e.target.dataset.id,
      schoolname = e.target.dataset.value;
    wx.setStorage({
      key: 'schoolname',
      data: schoolname,
    });
    wx.setStorage({
      key: 'schoolnameid',
      data: schoolnameid,
    });
    wx.navigateBack({
      url: '/pages/userinfo/userinfo',
    })
  },
  // 获取学校列表
  getSchool: function (schoolname, sctype, provinceId, cityId, countyId, pagenum, pagesize){
    var that = this,
      IP = app.globalData.IP;
    wx.request({
      url: IP + '/common/school',
      data: {
        schoolname: schoolname,
        sctype: sctype,
        provinceId: provinceId,
        cityId: cityId,
        countyId: countyId,
        pagenum: pagenum,
        pagesize: pagesize
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == '200') {
          that.setData({
            surnamelist: res.data.datas.list,
            hasSurname: true,
          })
        } else if (res.data.code == '404') {
          that.setData({
            hasSurname: false,
            surnamelist: ''
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
  onLoad: function (options) {
    console.log(options)
    var that = this,
      sctype = options.sctype,
      provinceId = options.provinceId,
      cityId = options.cityId,
      countyId = options.countyId;
    console.log(sctype)
    console.log(provinceId)
    console.log(cityId)
    console.log(countyId)
    that.setData({
      sctype: sctype,
      provinceId: provinceId,
      cityId: cityId,
      countyId: countyId,
    })
    // 获取学校列表
    that.getSchool('', sctype, provinceId, cityId, countyId,1,1000)
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