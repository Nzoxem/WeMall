var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    continuous: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserInfo();
    this.getUserAmount();
    this.checkScoreSign();
  },
  //获取用户信息
  getUserInfo: function (e) {
    var that = this;
    wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            that.setData({
              userInfo: res.userInfo
            });
          }
        })
      }
    })
  },
  //每日签到
  scoresign: function () {
    var that = this;
    wx.request({
      url: app.globalData.subDomain + "/score/sign",
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.getUserAmount();
          that.checkScoreSign();
        } else {
          wx.showModal({
            title: "错误",
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },
  // 检查连续签到的次数
  checkScoreSign: function () {
    var that = this;
    wx.request({
      url: app.globalData.subDomain + "/score/today-signed",
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            continuous: res.data.data.continuous
          });
        }
      }
    })
  },
  //获取用户积分余额信息
  getUserAmount: function () {
    var that = this;
    wx.request({
      url: app.globalData.subDomain + "/user/amount",
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            balance: res.data.data.balance,
            freeze: res.data.data.freeze,
            score: res.data.data.score
          });
        }
      }

    })
  },
  //关于我们
  aboutUs: function () {
    wx.showModal({
      title: "关于我们",
      content: "微信电商交易小程序开发小组成员：张旭、张磊、王岁兴",
      showCancel: false
    })
  },
  //重新登录
  relogin:function(){
    var that=this;
    app.globalData.token=null;
    app.login();
    wx.showModal({
      title: "提示",
      content: "重新登录成功",
      showCancel:false,
      success:function(res){
        if(res.confirm){
          that.onShow();
        }
      }
    });
  }
})