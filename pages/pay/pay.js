var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    allGoodsPrice: 0,
    yunfei: 0,
    allGoodsYunfei: 0,
    isNeedLogistics: 0,//是否需要物流信息
    curAddressData: {},
    goodsJsonStr: "",
    orderType: "",//订单类型
    hasNoCoupons: true,
    coupons: [],//优惠券
    youhuijine: 0,//优惠金额
    curCoupon: null//当前选中使用的优惠券
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    var that = this;
    var shopList = [];
    //立即购买
    if ("buyNow" == that.data.orderType) {
      var buyNowInfo = wx.getStorageSync("buyNowInfo");
      if (buyNowInfo && buyNowInfo.shopList) {
        shopList = buyNowInfo.shopList;
      } 
    } else {
      //购物车购买
      var shopCarInfo = wx.getStorageSync("shopCarInfo");
      if (shopCarInfo && shopCarInfo.shopList) {
        shopList = shopCarInfo.shopList.filter(function(entity){
          return entity.active;
        });
      }
    }
    that.setData({
      goodsList:shopList
    });
    that.initAddress();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.setData({
      isNeedLogistics:1,
      orderType:e.orderType
    });
  },

  initAddress: function () {
    var that = this;
    wx.request({
      url: app.globalData.subDomain + "/user/shipping-address/default",
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            curAddressData: res.data.data
          });
        } else {
          that.setData({
            curAddressData: null
          })
        }
        //that.processYunfei();
      }
    })
  },
  processYunfei:function(){

  },
  addAdress: function () {
    wx.navigateTo({
      url: 'pages/addaddress/addaddress',
    })
  },
  selectAddress: function () {
    wx.navigateTo({
      url: 'pages/seladdress/seladdress',
    })
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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