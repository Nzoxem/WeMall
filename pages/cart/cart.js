var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: {
      hidden: true,
      totalPrice: 0,
      allSelect: true,
      noSelect: false,
      list: []
    },
    delBtnWidth: 120,//删除按钮宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initEleWidth();
    this.onShow();
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (width) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (width / 2);//以宽度750rpx做宽度的自适应
      real = Math.floor(res / scale);
    } catch (e) {
      return false;
    }
  },
  //初始化元素宽度
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delbtnWidth);
    this.setData({
      delbtnWidth: delBtnWidth
    });
  },
  onShow: function () {
    var shopList = [];
    var shopCarInfo = wx.getStorageSync("shopCarInfo");
    if (shopCarInfo && shopCarInfo.shopList) {
      shopList = shopCarInfo.shopList;
    }
    this.data.goodsList.list = shopList;
    this.setGoodsList(this.getHidden(), this.getTotalPrice(), this.getAllSelect(), this.getNoSelect(), shopList);
  },
  //设置商品数据并更新缓存
  setGoodsList: function (hidden, total, allS, noS, list) {
    this.setData({
      goodsList: {
        hidden: hidden,
        totalPrice: total,
        allSelect: allS,
        noSelect: noS,
        list: list
      }
    });
    var shopCarInfo = {};
    var tempNum = 0;
    shopCarInfo.shopList = list;
    for (var i = 0; i < list.length; i++) {
      tempNum += list[i].number;
    }
    shopCarInfo.shopNum = tempNum;
    wx.setStorage({
      key: "shopCarInfo",
      data: shopCarInfo
    })
  },
  //获取显隐参数
  getHidden: function () {
    var hidden = this.data.goodsList.hidden;
    return hidden;
  },
  //获取总价
  getTotalPrice: function () {
    var list = this.data.goodsList.list;
    var total = 0;
    for (var i = 0; i < list.length; i++) {
      var curItem = list[i];
      if (curItem.active) {
        total += parseFloat(curItem.price) * curItem.number;
      }
    }
    total = parseFloat(total.toFixed(2));
    return total;
  },
  //获取全选参数
  getAllSelect: function () {
    var list = this.data.goodsList.list;
    var allSelect = false;
    for (var i = 0; i < list.length; i++) {
      if (list[i].active) {
        allSelect = true;
      }
      else {
        allSelect = false;
        break;
      }
    }
    return allSelect;
  },
  //获取未选参数
  getNoSelect: function () {
    var list = this.data.goodsList.list;
    var noSelect = 0;
    for (var i = 0; i < list.length; i++) {
      if (!list[i].active) {
        noSelect++;
      }
    }
    if (noSelect == list.length) {
      return true;
    } else {
      return false;
    }
  },
  toIndexPage: function () {
    wx.switchTab({
      url: "/pages/index/index",
    });
  },
  //编辑
  editTap: function (e) {
    var list = this.data.goodsList.list;
    for (var i = 0; i < list.length; i++) {
      list[i].active = false;
    }
    this.setGoodsList(!this.getHidden(), this.getTotalPrice(), this.getAllSelect(), this.getNoSelect(), list);
  },
  //完成
  saveTap: function (e) {
    var list = this.data.goodsList.list;
    for (var i = 0; i < list.length; i++) {
      list[i].active = true;
    }
    this.setGoodsList(!this.getHidden(), this.getTotalPrice(), this.getAllSelect(), this.getNoSelect(), list);
  },
  //选中商品
  selectTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if (index != null && index !== "") {
      list[parseInt(index)].active = !list[parseInt(index)].active;
      this.setGoodsList(this.getHidden(), this.getTotalPrice(), this.getAllSelect(), this.getNoSelect(), list);
    }
  },
  //删除选中元素
  deleteSelected: function () {
    var list = this.data.goodsList.list;
    list = list.filter(function (curGood) {
      return !curGood.active;
    });
    this.setGoodsList(this.getHidden(), this.getTotalPrice(), this.getAllSelect(), this.getNoSelect(), list);
  },
  //减少购买数量
  jianBtnTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if (index !== "" && index != null) {
      if (list[parseInt(index)].number > 1) {
        list[parseInt(index)].number--;
        this.setGoodsList(this.getHidden(), this.getTotalPrice(), this.getAllSelect(), this.getNoSelect(), list);
      }
    }
  },
  //增加购买数量
  jiaBtnTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if (index !== "" && index != null) {
      if (list[parseInt(index)].number < list[parseInt(index)].stores) {
        list[parseInt(index)].number++;
        this.setGoodsList(this.getHidden(), this.getTotalPrice(), this.getAllSelect(), this.getNoSelect(), list);
      }else{
        wx.showModal({
          title: "提示",
          content: "此商品库存量只有" + list[parseInt(index)].stores+"件",
          showCancel: false,
        });
        return;
      }
    }
  },
  //全选
  bindAllSelect: function (e) {
    var curAll = this.data.goodsList.allSelect;
    var list = this.data.goodsList.list;
    if (curAll) {
      for (var i = 0; i < list.length; i++) {
        list[i].active = false;
      }
    }
    else {
      for (var i = 0; i < list.length; i++) {
        list[i].active = true;
      }
    }
    this.setGoodsList(this.getHidden(), this.getTotalPrice(), !curAll, this.getNoSelect(), list);
  }

})