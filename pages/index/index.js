//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    swiperCurrent: 0,
    categories: [],
    activeCategoryId: 0,
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function () {
    var that = this;
    //设置商城名称
    wx.setNavigationBarTitle({
      title: wx.getStorageSync("mallName")
    })
    //发送请求从后台获取Banner数据
    wx.request({
      url: app.globalData.subDomain + "/banner/list",
      data: {
        key: "mallName"
      },
      success: function (res) {
        if (res.data.code == 404) {
          wx.showModal({
            title: "提示",
            content: "请在后台添加Banner轮播图片",
            showCancel: false
          })
        } else {
          that.setData({
            banners: res.data.data
          });
        }
      }
    })
    // 获取商品类别信息
    wx.request({
      url: app.globalData.subDomain + "/shop/goods/category/all",
      success: function (res) {
        var cate = [
          {
            id: 0,
            name: "全部"
          }
        ];
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            cate.push(res.data.data[i]);
          }
        }
        that.setData({
          categories: cate,
          activeCategoryId: 0
        });
        that.getGoodsList(0);
      }
    })
    that.getNotice();
  },

  swiperChange: function (event) {
    this.setData({
      swiperCurrent: event.detail.current
    })
  },
  //点击banner跳转
  tapBanner: function (event) {
    if (event.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/gdetails/gdetails?id=" + event.currentTarget.dataset.id
      })
    }
  },
  //点击选择不同类别
  tabClick: function (event) {
    this.setData({
      activeCategoryId: event.currentTarget.id
    })
    this.getGoodsList(this.data.activeCategoryId);
  },
  //获取通知
  getNotice: function (event) {
    var that = this;
    wx.request({
      url: app.globalData.subDomain + "/notice/list",
      data: {
        pagesize: 5
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            noticeList: res.data.data
          })
        }
      }
    })
  },
  //获取商品列表
  getGoodsList: function (categoryId) {
    if (categoryId == 0) {
      categoryId = "";
    }
    var that = this;
    wx.request({
      url: app.globalData.subDomain + "/shop/goods/list",
      data: {
        categoryId: categoryId
      },
      success: function (res) {
        that.setData({
          goods: [],
          loadingMoreHidden: true
        });
        var goods = [];
        if (res.data.code != 0 || res.data.data.length == 0) {
          that.setData({
            loadingMoreHidden: false
          })
          return;
        }
        for (var i = 0; i < res.data.data.length; i++) {
          goods.push(res.data.data[i]);
        }
        that.setData({
          goods: goods
        })
      }
    })
  },
  onDetailsTap:function(event){
    wx.navigateTo({
      url: "Pages/gdetails/gdetails?id="+event.currentTarget.dataset.id
    })
  }
})
