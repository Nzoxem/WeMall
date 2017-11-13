var app = getApp();
var wxParse = require("../../wxParse/wxParse.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopType: "addShopCar",
    swiperCurrent: 0,
    hasMoreSelect: false,
    buyNumber: 0,
    buyNumMax: 0,
    buyNumMin: 1,
    goodsDetail: {},
    selectSize: "选择：",
    selectSizePrice: 0,
    shopNum: 0,
    hideShopPopup: true,

    //购物车
    shopCarInfo: {},
    shopNum: 0,
    canSubmit: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取购物车缓存数据
    wx.getStorage({
      key: 'shopCarInfo',
      success: function (res) {
        that.setData({
          shopCarInfo: res.data,
          shopNum: res.data.shopNum
        });
      },
    })
    wx.request({
      url: app.globalData.subDomain + "/shop/goods/detail",
      data: {
        id: options.id
      },
      success: function (res) {
        var selcetSizeTmp = "";
        if (res.data.data.properties) {
          for (var i = 0; i < res.data.data.properties.length; i++) {
            selcetSizeTmp = selcetSizeTmp + " " + res.data.data.properties[i].name;
          }
          that.setData({
            hasMoreSelect: true,
            selectSize: that.data.selectSize + selcetSizeTmp,
            selectSizePrice: res.data.data.basicInfo.minPrice
          });
        }
        that.setData({
          goodsDetail: res.data.data,
          selectSizePrice: res.data.data.basicInfo.minPrice,
          buyNumMax: res.data.data.basicInfo.stores,
          buyNumber: (res.data.data.basicInfo.stores > 0) ? 1 : 0
        })
        wxParse.wxParse("article", "html", res.data.data.content, that, 5);
      }
    })
    this.reputation(options.id);
  },
  swipChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //规格选择弹出框
  onMoreSize: function (e) {
    this.setData({
      hideShopPopup: false
    });
  },
  //跳转至购物车
  goShopCar: function (e) {
    wx.reLaunch({
      url: "/pages/cart/cart",
    })
  },
  //添加到购物车
  toAddShopCar: function (e) {
    this.setData({
      shopType: "addShopCar"
    });
    this.onMoreSize();
  },
  //
  toBuy: function (e) {
    this.setData({
      shopType: "tobuy"
    })
    this.onMoreSize();
  },
  //规格选择弹出框隐藏
  closePopupTap: function (e) {
    this.setData({
      hideShopPopup: true
    });
  },
  //选择商品规格
  lableItemTap: function (e) {
    var that = this;
    //取消该分类下子栏目所有的选中状态
    var childs = that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods;
    for (var i = 0; i < childs.length; i++) {
      that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods[i].active = false;
    }
    //设置当前选中状态
    that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods[e.currentTarget.dataset.propertychildindex].active = true;
    //获取所有选中规格的尺寸数据
    var needSelectNum = that.data.goodsDetail.properties.length;
    var curSelectNum = 0;
    var propertyChildIds = "";
    var propertyChildNames = "";
    for (var i = 0; i < needSelectNum; i++) {
      childs = that.data.goodsDetail.properties[i].childsCurGoods;
      for (var j = 0; j < childs.length; j++) {
        if (childs[j].active) {
          curSelectNum++;
          propertyChildIds = propertyChildIds + that.data.goodsDetail.properties[i].id + ":" + childs[j].id + ",";
          propertyChildNames = propertyChildNames + this.data.goodsDetail.properties[i].name + ":" + childs[j].name + " ";
        }
      }
    }
    var canSubmit = false;
    if (needSelectNum == curSelectNum) {
      canSubmit = true;
    }
    //计算当前价格
    if (canSubmit) {
      wx.request({
        url: app.globalData.subDomain + "/shop/goods/price",
        data: {
          goodsId: that.data.goodsDetail.basicInfo.id,
          propertyChildIds: propertyChildIds
        },
        success: function (res) {
          that.setData({
            selectSizePrice: res.data.data.price,
            propertyChildIds: propertyChildIds,
            propertyChildNames: propertyChildNames,
            buyNumMax: res.data.data.stores,
            buyNumber: (res.data.data.stores > 0) ? 1 : 0
          });
        }
      })
    }
    this.setData({
      goodsDetail: that.data.goodsDetail,
      canSubmit: canSubmit
    })
  },
  //-
  numJianTap: function (e) {
    if (this.data.buyNumber > this.data.buyNumMin) {
      var currentNum = this.data.buyNumber;
      currentNum--;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  //+
  numJiaTap: function (e) {
    if (this.data.buyNumber < this.data.buyNumMax) {
      var currentNum = this.data.buyNumber;
      currentNum++;
      this.setData({
        buyNumber: currentNum
      });
    }
    else if (this.data.buyNumber >= this.data.buyNumMax) {
      wx.showModal({
        title: "提示",
        content: "此商品库存量只有" + this.data.buyNumMax + "件",
        showCancel: false
      });
      return;
    }

  },
  //加入购物车
  addShopCar: function (e) {
    if (this.data.goodsDetail.properties && !this.data.canSubmit) {
      wx.showModal({
        title: "提示",
        content: "请选择商品规格",
        showCancel: false
      });
      this.onMoreSize();
      return;
    }
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: "提示",
        content: "购买数量不能为0!",
        showCancel: false
      });
      return;
    }
    //组建购物车
    var shopCarInfo = this.buildShopCarInfo();
    this.setData({
      shopCarInfo: shopCarInfo,
      shopNum: shopCarInfo.shopNum
    });
    //写入缓存
    wx.setStorage({
      key: "shopCarInfo",
      data: shopCarInfo,
    })
    this.closePopupTap();
    wx.showToast({
      title: "加入购物车成功",
      icon: "success"
    })
  },
  buildShopCarInfo: function (e) {
    var shopCarMap = {};
    shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
    shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
    shopCarMap.name = this.data.goodsDetail.basicInfo.name;
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.label = this.data.propertyChildNames;
    shopCarMap.price = this.data.selectSizePrice;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber;
    shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;
    shopCarMap.logistics = this.data.goodsDetail.logistics;
    shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;
    shopCarMap.stores = this.data.buyNumMax;
    var shopCarInfo = this.data.shopCarInfo;
    if (!shopCarInfo.shopNum) {
      shopCarInfo.shopNum = 0;
    }
    if (!shopCarInfo.shopList) {
      shopCarInfo.shopList = [];
    }
    //处理id相同的货物
    var hasSameIndex = -1;
    for (var i = 0; i < shopCarInfo.shopList.length; i++) {
      var temp = shopCarInfo.shopList[i];
      if (temp.goodsId == shopCarMap.goodsId && temp.propertyChildIds == shopCarMap.propertyChildIds) {
        hasSameIndex = i;
        shopCarMap.number = shopCarMap.number + temp.number;
        break;
      }
    }
    shopCarInfo.shopNum = shopCarInfo.shopNum + this.data.buyNumber;
    if (hasSameIndex > -1) {
      shopCarInfo.shopList.splice(hasSameIndex, 1, shopCarMap);
    }
    else {
      shopCarInfo.shopList.push(shopCarMap);
    }
    return shopCarInfo;
  },
  //立即购买
  buynow: function (e) {
    if (this.data.goodsDetail.properties && !this.data.canSubmit) {
      wx.showModal({
        title: "提示",
        content: "请选择商品规格",
        showCancel: false
      });
      this.onMoreSize();
      return;
    }
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: "提示",
        content: "购买数量不能为0!",
        showCancel: false
      });
      return;
    } else if (this.data.buyNum < this.data.buyNumMax) {
      wx.showModal({
        title: "提示",
        content: "此商品库存量只有" + this.data.buyNumMax + "件",
        showCancel: false
      });
      return;
    }
    //组件立即购买信息
    var buyNowInfo = this.buildBuyNowInfo();
    wx.setStorage({
      key: "buyNowInfo",
      data: buyNowInfo
    })
    this.closePopupTap();
    wx.navigateTo({
      url: "/Pages/pay/pay?orderType=buyNow",
    })
  },
  buildBuyNowInfo: function (e) {
    var shopCarMap = {};
    shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
    shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
    shopCarMap.name = this.data.goodsDetail.basicInfo.name;
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.label = this.data.propertyChildNames;
    shopCarMap.price = this.data.selectSizePrice;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber;
    shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;
    shopCarMap.logistics = this.data.goodsDetail.logistics;
    shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;
    shopCarMap.stores = this.data.buyNumMax;
    var buyNowInfo = {};
    if (!buyNowInfo.shopNum) {
      buyNowInfo.shopNum = 0;
    }
    if (!buyNowInfo.shopList) {
      buyNowInfo.shopList = [];
    }
    buyNowInfo.shopList.push(shopCarMap);
    return buyNowInfo;
  },
  //评价
  reputation: function (goodsId) {
    var that = this;
    wx.request({
      url: app.globalData.subDomain + "/shop/goods/reputation",
      data: {
        goodsId: goodsId
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            reputation: res.data.data
          });
        }
      }
    })
  }

})