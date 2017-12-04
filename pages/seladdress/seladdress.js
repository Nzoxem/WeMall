var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: []
  },
  selectTap: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: app.globalData.subDomain + "/user/shipping-address/update",
      data: {
        id: id,
        token: app.globalData.token,
        isDefault: "true"
      },
      success: function (res) {
        wx.navigateBack({});
      },
    });
  },
  editAddress: function (e) {
    wx.navigateTo({
      url: "/pages/addaddress/addaddress?id=" + e.currentTarget.dataset.id,
    })
  },
  addAddress: function (e) {
    wx.navigateTo({
      url: "/pages/addaddress/addaddress",
    });
  },
  onShow: function () {
    var that = this;
    wx.request({
      url: app.globalData.subDomain + "/user/shipping-address/list",
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        if(res.data.code==0){
          that.setData({
            addressList:res.data.data
          });
        }else if(res.data.code==700){
          that.setData({
            addressList:null
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