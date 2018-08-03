// pages/userinfo/userinfo.js
var date = new Date(),
  day = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(); //当前日期
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex: ['未知', '男', '女'],
    sexIndex: 1,
    date: day,
    addressName: [['请选择所在地区'], [''], ['']],
    addressIndex: [0, 0, 0],
    schooltype: ['请选择学校类型', ''],
    schooltypeIndex: 0,
    levelIndex: 0,
    telephone: null,
    isChange: false
  },
  // 查看头像
  previewImg: function (e) {
    // console.log(e);
    wx.previewImage({
      current: e.target.dataset.url, // 当前显示图片的http链接
      urls: [e.target.dataset.url] // 需要预览的图片http链接列表
    })
  },
  // 修改昵称
  nickNameInput: function (e) {
    var that = this,
      nickName = e.detail.value;
    console.log(nickName);
    that.setData({
      nickName: nickName,
      isChange: true
    })
  },
  // 修改手机号
  usernameInput: function (e) {
    var that = this,
      telephone = e.detail.value;
    console.log(telephone);
    that.setData({
      telephone: telephone,
      isChange: true
    })
  },
  // 修改详细地址addressInput
  addressInput: function (e) {
    var that = this,
      address = e.detail.value;
    console.log(address);
    that.setData({
      address: address,
      isChange: true
    })
  },
  // 选择性别
  bindSexChange: function (e) {
    console.log('性别', e.detail.value);
    var taht = this;
    taht.setData({
      sexIndex: e.detail.value,
      isChange: true
    })
  },
  // 出生日期选择
  bindDateChange: function (e) {
    console.log('出生日期', e.detail.value);
    var that = this;
    that.setData({
      date: e.detail.value,
      isChange: true
    })
  },
  // 选择所在区域
  bindMultiPickerChange: function (e) {
    console.log('区域', e.detail.value);
    var that = this;
    that.setData({
      multiIndex: e.detail.value,
      isChange: true
    })
  },
  // 区域列表更改
  bindMultiPickerColumnChange: function (e) {
    var that = this,
      IP = app.globalData.IP;
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var addressArray = that.data.addressArray,
      addressName = that.data.addressName,
      addressIndex = that.data.addressIndex,
      columnId = e.detail.column,
      valueId = e.detail.value;
    addressIndex[columnId] = valueId;
    if (columnId == 0) {
      addressIndex = [valueId, 0, 0]
      that.setData({
        addressIndex: addressIndex,
      })
      app.getCity(addressArray[columnId][valueId].id, 2, function (data) {
        console.log(data);
        if (data.status) {
          addressArray[1] = data.list;
          addressName[1] = data.listName;
          app.getCity(data.list[0].id, 3, function (data) {
            if (data.status) {
              addressArray[2] = data.list;
              addressName[2] = data.listName;
              that.setData({
                addressArray: addressArray,
                addressName: addressName,
                isChange: true
              })
            }
          });
        }
      });
    }
    if (e.detail.column == 1) {
      addressIndex[2] = 0
      that.setData({
        addressIndex: addressIndex,
      })
      app.getCity(addressArray[1][valueId].id, 3, function (data) {
        if (data.status) {
          addressArray[2] = data.list;
          addressName[2] = data.listName;
          that.setData({
            addressArray: addressArray,
            addressName: addressName,
            isChange: true
          })
        }
      });
    }
  },
  // 换头像
  chooseImg: function (res) {
    var that = this,
      IP = app.globalData.IP,
      accessToken = wx.getStorageSync('accessToken');
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res);
        if (res.errMsg == 'chooseImage:ok') {
          var userinfo = that.data.userinfo;
          userinfo.userinfo.headimg = res.tempFilePaths[0]
          that.setData({
            userinfo: userinfo
          });
          // 请求更换头像接口
          wx.uploadFile({
            url: IP + '/student/change_headimg',
            filePath: res.tempFilePaths[0],
            name: 'file',
            formData: {
              accessToken: accessToken
            },
            success: function (res) {
              // console.log(res);
              if (res.statusCode == '200') {
                wx.showToast({
                  title: '修改头像成功',
                  icon: 'none',
                  duration: 2000
                })
              } else {
                wx.showToast({
                  title: '上传头像失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            },
            fail: function (res) {
              wx.showToast({
                title: '请求参数错误',
                icon: 'none',
                duration: 2000
              })
            }
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
          title: '取消选择',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 选择学校类型
  bindSchoolTypeChange: function (e) {
    console.log(e.detail.value);
    var that = this,
      schooltype = that.data.schooltypeObj,
      index = e.detail.value;
    that.setData({
      schooltypeIndex: index,
      isChange: true
    });
    // 改变年级
    that.levelChange(schooltype[index].id);
  },
  // 年级设定
  levelChange: function (levelid) {
    var that = this,
      IP = app.globalData.IP;
    wx.request({
      url: IP + '/common/grade',
      data: {
        sctype: levelid
      },
      success: function (resL) {
        console.log(resL.data)
        if (resL.data.code == '200') {
          var level = resL.data.datas,
            levelname = []; level
          for (var i = 0; i < level.length; i++) {
            levelname[i] = level[i].name
          }
          that.setData({
            levelname: levelname,
            levelObj: level
          })
        }
      }
    })
  },
  // 选择年级
  bindClassChange: function (e) {
    console.log(e.detail.value);
    var that = this,
      levelname = that.data.levelObj,
      index = e.detail.value;
    that.setData({
      levelIndex: index,
      levelId: that.data.levelObj[index].id,
      isChange: true
    });
  },
  // 选择学校
  checkSchool: function (e) {
    var that = this,
      provinceId = that.data.addressArray[0][that.data.addressIndex[0]].id,
      cityId = that.data.addressArray[1][that.data.addressIndex[1]].id,
      countyId = that.data.addressArray[2][that.data.addressIndex[2]].id,
      sctype = that.data.schooltypeObj[that.data.schooltypeIndex].id;
    wx.navigateTo({
      url: '/pages/userinfo/school?provinceId=' + provinceId + '&cityId=' + cityId + '&countyId=' + countyId + '&sctype=' + sctype,
    });
    that.setData({
      isChange: true
    })
  },
  // 提交个人信息
  subUserInfo: function () {
    var that = this,
      IP = app.globalData.IP,
      accessToken = wx.getStorageSync('accessToken'),
      telephone = that.data.telephone,
      address = that.data.address;
    if(that.data.isChange){
      if (telephone == undefined){
        telephone = ''
      }
      if (address == undefined) {
        address = ''
      }
      wx.request({
        url: IP + '/student/save',
        data: {
          accessToken: accessToken,
          nickname: that.data.nickName,
          telephone: telephone,
          gender: that.data.sexIndex,
          birthday: that.data.date,
          gradeid: that.data.levelId,
          provinceId: that.data.addressArray[0][that.data.addressIndex[0]].id,
          cityId: that.data.addressArray[1][that.data.addressIndex[1]].id,
          countyId: that.data.addressArray[2][that.data.addressIndex[2]].id,
          address: address,
          schoolId: that.data.schoolnameid,
          schoolType: that.data.schooltypeObj[that.data.schooltypeIndex].id
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        success: function (res) {
          // console.log(res.data);
          if (res.data.code == '200') {
            wx.showToast({
              title: '修改成功',
              icon: 'none',
              duration: 2000
            });
            that.setData({
              isChange: false
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function (res) {
          // 修改个人信息接口超时
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
      IP = app.globalData.IP,
      accessToken = wx.getStorageSync('accessToken');
    // 获取学校类型
    wx.request({
      url: IP + '/common/schooltype',
      success: function (res) {
        console.log(res.data)
        if (res.data.code == '200') {
          var schooltype = res.data.datas,
            schooltypename = [];
          for (var i = 0; i < schooltype.length; i++) {
            schooltypename[i] = schooltype[i].name
          }
          that.setData({
            schooltype: schooltypename,
            schooltypeObj: schooltype
          });
          // 年级设定
          that.levelChange(schooltype[0].id);
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
          title: '请求超时',
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this,
      IP = app.globalData.IP,
      accessToken = wx.getStorageSync('accessToken');
    // 获取个人信息
    wx.request({
      url: IP + '/student/userinfo',
      data: {
        accessToken: accessToken
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == '200') {
          var userInfo = res.data.datas
          if (userInfo.areainfo != '' && userInfo.areainfo != null && userInfo.areainfo != undefined) {
            if (userInfo.areainfo.detailAddress != '' && userInfo.areainfo.detailAddress != null && userInfo.areainfo.detailAddress != undefined){
              that.setData({
                address: userInfo.areainfo.detailAddress
              })
            }
            if (userInfo.areainfo.provinceId != '' && userInfo.areainfo.provinceId != null && userInfo.areainfo.provinceId != undefined) {
              // 获取省市区
              var addressArray = [],
                addressName = [],
                addressIndex = that.data.addressIndex;
              app.getCity(0, 1, function (data) {
                // console.log(data);
                if (data.status) {
                  addressArray.push(data.list);
                  addressName.push(data.listName);
                  for (var i = 0; i < data.list.length; i++) {
                    if (data.list[i].id == userInfo.areainfo.provinceId) {
                      addressIndex[0] = i;
                    }
                  }
                  app.getCity(userInfo.areainfo.provinceId, 2, function (data) {
                    // console.log(data);
                    if (data.status) {
                      addressArray.push(data.list);
                      addressName.push(data.listName);
                      for (var c = 0; c < data.list.length; c++) {
                        if (data.list[c].id == userInfo.areainfo.cityId) {
                          addressIndex[1] = c;
                        }
                      }
                      app.getCity(userInfo.areainfo.cityId, 3, function (data) {
                        // console.log(data);
                        if (data.status) {
                          addressArray.push(data.list);
                          addressName.push(data.listName);
                          for (var j = 0; j < data.list.length; j++) {
                            if (data.list[j].id == userInfo.areainfo.countyId) {
                              addressIndex[2] = j;
                            }
                          }
                          // console.log(addressIndex)
                          that.setData({
                            addressArray: addressArray,
                            addressName: addressName,
                            addressIndex: addressIndex
                          })
                        }
                      });
                    }
                  });
                }
              });
            }
            if (userInfo.areainfo.schoolId != '' && userInfo.areainfo.schoolId != null && userInfo.areainfo.schoolId != undefined) {
              that.setData({
                schoolnameid: userInfo.areainfo.schoolId,
                schoolname: userInfo.areainfo.schoolName
              });
            }
            if (userInfo.areainfo.schoolType != '' && userInfo.areainfo.schoolType != null && userInfo.areainfo.schoolType != undefined) {
              for (var i = 0; i < that.data.schooltypeObj.length; i++) {
                if (userInfo.areainfo.schoolType == that.data.schooltypeObj[i].id) {
                  that.setData({
                    schooltypeIndex: i
                  })
                }
              }
              // 年级设定
              that.levelChange(userInfo.areainfo.schoolType);
            }
          } else {
            // 获取省市区
            var addressArray = [],
              addressName = [],
              addressIndex = that.data.addressIndex;
            app.getCity(0, 1, function (data) {
              // console.log(data);
              if (data.status) {
                addressArray.push(data.list);
                addressName.push(data.listName);
                
                app.getCity(data.list[0].id, 2, function (data) {
                  // console.log(data);
                  if (data.status) {
                    addressArray.push(data.list);
                    addressName.push(data.listName);
                    
                    app.getCity(data.list[0].id, 3, function (data) {
                      // console.log(data);
                      if (data.status) {
                        addressArray.push(data.list);
                        addressName.push(data.listName);
                        
                        // console.log(addressIndex)
                        that.setData({
                          addressArray: addressArray,
                          addressName: addressName,
                          addressIndex: addressIndex
                        })
                      }
                    });
                  }
                });
              }
            });
          }
          if (userInfo.userinfo.gradeid != '' && userInfo.userinfo.gradeid != null && userInfo.userinfo.gradeid != undefined) {
            setTimeout(function(){
              for (var i = 0; i < that.data.levelObj.length; i++) {
                if (userInfo.userinfo.gradeid == that.data.levelObj[i].id) {
                  that.setData({
                    levelIndex: i,
                    levelId: userInfo.userinfo.gradeid,
                  })
                }
              }       
            },1000)                   
          }
          if (userInfo.userinfo.telephone != '' && userInfo.userinfo.telephone != null && userInfo.userinfo.telephone != undefined){
            that.setData({
              telephone: userInfo.userinfo.telephone,
            })
          }
          if (userInfo.userinfo.birthday != '' && userInfo.userinfo.birthday != null && userInfo.userinfo.birthday != undefined) {
            that.setData({
              date: app.timeStamp2String(userInfo.userinfo.birthday, 2),
            })
          }
          that.setData({
            userinfo: userInfo,
            nickName: userInfo.userinfo.nickname,
            sexIndex: userInfo.userinfo.gender
          });
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
          title: '请求超时',
          icon: 'none',
          duration: 2000
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // 获取学校名称
    wx.getStorage({
      key: 'schoolname',
      success: function (res) {
        that.setData({
          schoolname: res.data
        })
      },
    });
    // 获取学校ID
    wx.getStorage({
      key: 'schoolnameid',
      success: function (res) {
        that.setData({
          schoolnameid: res.data
        })
      },
    });
    wx.setStorage({
      key: 'schoolname',
      data: '',
    })
    wx.setStorage({
      key: 'schoolnameid',
      data: '',
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