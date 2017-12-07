var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupons:[]
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getMyCoupons();
  },
  getMyCoupons:function(){
    var that=this;
    wx.request({
      url: app.globalData.subDomain+"/discounts/my",
      data:{
        token:app.globalData.token,
        status:0
      },
      success:function(res){
        if(res.data.code==0){
          var coupons=res.data.data;
          if(coupons.length>0){
           that.setData({
             coupons:coupons
           });
          }
        }
      }
    })
  },
  goBuy:function(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
})