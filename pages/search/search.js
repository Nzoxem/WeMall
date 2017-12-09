var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    keywords: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var keyword = options.key;
    if (keyword == null) {
      that.setData({
        goodsList: []
      });
    } else {
      that.setData({
        keywords: keyword
      });
    }
    this.getGoodsList();
  },
  //获取输入的值
  inputChange: function (e) {
    this.setData({
      keywords: e.detail.value,
    });
  },
  onKeyConfirm: function (e) {
    var keyword = e.detail.value;
    this.setData({
      keywords: keyword,
      categoryId: 0,
      goodsList: []
    })
    this.getGoodsList();
  },
  getGoodsList: function () {
    var that = this;
    wx.showLoading();
    var keyword = this.data.keywords;
    if (keyword != "") {
      wx.request({
        url: app.globalData.subDomain + "/shop/goods/list?nameLike=" + keyword,
        header: {},
        method: "GET",
        dataType: "json",
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 0) {
            that.setData({
              goodsList: res.data.data
            })
          }
        }
      });
    }else{
      wx.hideLoading();
      that.setData({
        keywords:"",
        goodsList:[]
      })
    }

  },
  cancelTap: function (e) {
    this.setData({
      keywords: ""
    });
    this.getGoodsList();
  },
  onDetailsTap: function (e) {
    wx.navigateTo({
      url: '/pages/gdetails/gdetails?id=' + e.currentTarget.dataset.id,
    })
  },
})