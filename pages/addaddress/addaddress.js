// pages/addaddress/addaddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selCity:"请选择",
    selProvince:"请选择",
    selDistrict:"请选择",
    provinces:[],
    cities:[],
    districts:[],
    selProviceIndex:0,
    selCityIndex:0,
    selDistricIndex:0
  },
  bindSave:function(e){

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  onShow: function () {
  
  },
  selectCity:function(e){

  },
  pickerProvince:function(e){

  },
  pickerCity:function(e){

  },
  pickerDistrict:function(e){

  },
  deleteAddress:function(e){

  },
  bindCancel:function(e){
    wx.navigateBack({});
  }
})