var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusType: ["待付款", "待发货", "待收货", "待评价", "已完成"],
    currentType: 0,
    tabClass: ["", "", "", "", ""]
  },
  statusTap: function (e) {
    var curType = e.currentTarget.dataset.index;
    var orderId = e.currentTarget.dataset.id;
    this.setData({
      currentType: curType
    });
    this.onShow();
  },
  cancelOrderTap: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定取消该订单？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading();
          wx.request({
            url: app.globalData.subDomain + "/order/close",
            data: {
              token: app.globalData.token,
              orderId: orderId
            },
            success: function (res) {
              wx.hideLoading();
              if (res.data.code == 0) {
                that.onShow();
              }
            }
          });
        }
      }
    });
  },
  toPayTap: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    var orderList = this.data.orderList;
    var money = e.currentTarget.dataset.money;
    let remark = "在线充值";
    let nextAction = {};
    if (orderId != 0) {
      remark = "支付订单 ：" + orderId;
      nextAction = { type: 0, id: orderId };
    }
    wx.request({
      url: app.globalData.subDomain + "/pay/wxapp/get-pay-data",
      data: {
        token: app.globalData.token,
        money: money,
        remark: remark,
        payName: "在线支付",
        nextAction: nextAction
      },
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '由于权限问题，本商城目前只支持货到付款，确认即发货',
          success: function (res) {
            if (res.confirm) {
              wx.showToast({
                title: '确认发货成功'
              });
              for (var i = 0; i < orderList.length; i++) {
                if (orderList[i].id == orderId) {
                  orderList[i].status = 1;
                }
              }
              that.setData({
                orderList: orderList
              });
              wx.setStorageSync("orderList", orderList);
            } else if (res.cancel) {
              return;
            }
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //判断获取到的orderList中相同订单号的订单是否与缓存中的相同，若相同则用缓存中的更新请求到的
    wx.showLoading();
    var that = this;
    var postData = {
      token: app.globalData.token
    };
    postData.status = that.data.currentType;
    this.getOrderStatistics();
    wx.request({
      url: app.globalData.subDomain + "/order/list",
      data: postData,
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          that.setData({
            logisticsMap: res.data.data.logisticsMap,
            goodsMap: res.data.data.goodsMap
          });
          var orderListData = res.data.data.orderList;
          var orderListDataStor = wx.getStorageSync("orderList");
          for (var i = 0; i < orderListData.length; i++) {
            for(var j=0;j<orderListDataStor.length;j++)
            if (orderListData[i].id == orderListDataStor[j].id) {
              orderListData[i].status = orderListDataStor[j].status;
            }
          }
          that.setData({
            orderList: orderListData
          })
        } else {
          that.setData({
            orderList: null,
            logisticsMap: {},
            goodsMap: {}
          });
        }
      }
    });
  },
  getOrderStatistics: function () {
    var that = this;
    wx.request({
      url: app.globalData.subDomain + "/order/statistics",
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          var tabClass = that.data.tabClass;
          if (res.data.data.count_id_no_pay > 0) {
            tabClass[0] = "red-dot"
          } else {
            tabClass[0] = ""
          }
          if (res.data.data.count_id_no_transfer > 0) {
            tabClass[1] = "red-dot"
          } else {
            tabClass[1] = ""
          }
          if (res.data.data.count_id_no_confirm > 0) {
            tabClass[2] = "red-dot"
          } else {
            tabClass[2] = ""
          }
          if (res.data.data.count_id_no_reputation > 0) {
            tabClass[3] = "red-dot"
          } else {
            tabClass[3] = ""
          }
          if (res.data.data.count_id_success > 0) {
            //tabClass[4] = "red-dot"
          } else {
            //tabClass[4] = ""
          }
          that.setData({
            tabClass: tabClass
          });
        }
      }
    });
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