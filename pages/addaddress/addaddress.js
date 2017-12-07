var commonCityData = require("../../utils/city.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selCity: "请选择",
    selProvince: "请选择",
    selDistrict: "请选择",
    provinces: [],
    cities: [],
    districts: [],
    selProvinceIndex: 0,
    selCityIndex: 0,
    selDistrictIndex: 0
  },
  bindSave: function (e) {
    var that = this;
    var linkMan = e.detail.value.linkMan;
    var address = e.detail.value.address;
    var mobile = e.detail.value.mobile;
    var code = e.detail.value.code;
    if (linkMan == "") {
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel: false
      })
      return;
    }
    if (mobile == "") {
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel: false
      })
      return;
    }
    if (this.data.selProvince == "请选择") {
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel: false
      })
      return;
    }
    if (this.data.selCity == "请选择") {
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel: false
      })
      return;
    }
    if (this.data.selDistrict == "请选择") {
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel: false
      })
      return;
    }
    var cityId = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].id;
    var districtId;
    if (this.data.selDistrict == "请选择" || !this.data.selDistrict) {
      districtId = "";
    } else {
      districtId = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[this.data.selDistrictIndex].id;
    }
    if (address == "") {
      wx.showModal({
        title: '提示',
        content: '请填写详细地址信息',
        showCancel: false
      })
      return;
    }
    if (code == "") {
      wx.showModal({
        title: '提示',
        content: '请填写邮政编码',
        showCancel: false
      })
      return;
    }
    var apiAddOrUpdate = "add";
    var apiAddId = that.data.id;
    if (apiAddId) {
      apiAddOrUpdate = "update";
    } else {
      apiAddId = 0;
    }
    wx.request({
      url: app.globalData.subDomain + "/user/shipping-address/" + apiAddOrUpdate,
      data: {
        token: app.globalData.token,
        id: apiAddId,
        provinceId: commonCityData.cityData[that.data.selProvinceIndex].id,
        cityId: cityId,
        districtId: districtId,
        linkMan: linkMan,
        address: address,
        mobile: mobile,
        code: code,
        isDefault: "true"
      },
      success: function (res) {
        if (res.data.code != 0) {
          wx.hideLoading();
          wx.showModal({
            title: '失败',
            content: res.data.msg,
            showCancel: false
          })
          return;
        }
        wx.navigateBack({});
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var that = this;
    this.initCityData(1);
    var id = e.id;
    if (id) {
      wx.showLoading();
      wx.request({
        url: app.globalData.subDomain + "/user/shipping-address/detail",
        data: {
          token: app.globalData.token,
          id: id
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 0) {
            that.setData({
              id: id,
              addressData: res.data.data,
              selProvince: res.data.data.provinceStr,
              selCity: res.data.data.cityStr,
              selDistrict: res.data.data.areaStr
            });
            that.setDBSaveAddressId(res.data.data);
            return;
          } else {
            wx.showModal({
              title: '提示',
              content: '无法获取快递地址数据',
              showCancel: false
            })
          }
        }
      })
    }
  },
  initCityData: function (level, obj) {
    var that=this;
    if (level == 1) {
      var pinkArray = [];
      for (var i = 0; i < commonCityData.cityData.length; i++) {
        pinkArray.push(commonCityData.cityData[i].name);
      }
      that.setData({
        provinces: pinkArray
      });
    } else if (level == 2) {
      var pinkArray = [];
      var dataArray = obj.cityList;
      for (var i = 0; i < dataArray.length; i++) {
        pinkArray.push(dataArray[i].name);
      }
      that.setData({
        cities: pinkArray
      });
    } else if (level == 3) {
      var pinkArray = [];
      var dataArray = obj.districtList;
      for (var i = 0; i < dataArray.length; i++) {
        pinkArray.push(dataArray[i].name);
      }
      this.setData({
        districts: pinkArray
      });
    }
  },
  setDBSaveAddressId: function (data) {
    var retSelIdx = 0;
    for (var i = 0; i < commonCityData.cityData.length; i++) {
      if (data.provinceId == commonCityData.cityData[i].id) {
        this.data.selProvinceIndex = i;
        for (var j = 0; j < commonCityData.cityData[i].cityList.length; j++) {
          if (data.cityId == commonCityData.cityData[i].cityList[j].id) {
            this.data.selCityIndex = j;
            for (var k = 0; k < commonCityData.cityData[i].cityList[j].districtList.length; k++) {
              if (data.districtId == commonCityData.cityData[i].cityList[j].districtList[k].id) {
                this.data.selDistrictIndex = k;
              }
            }
          }
        }
      }
    }
  },
  pickerProvince: function (e) {
    var selItem = commonCityData.cityData[e.detail.value];
    this.setData({
      selProvince: selItem.name,
      selProvinceIndex: e.detail.value,
      selCity: "请选择",
      selCityIndex: 0,
      selDistrict: "请选择",
      selDistrictIndex: 0
    })
    this.initCityData(2, selItem);
  },
  pickerCity: function (e) {
    var selItem = commonCityData.cityData[this.data.selProvinceIndex].cityList[e.detail.value];
    this.setData({
      selCity: selItem.name,
      selCityIndex: e.detail.value,
      selDistrict: "请选择",
      selDistrictIndex: 0
    })
    this.initCityData(3, selItem);
  },
  pickerDistrict: function (e) {
    var selItem = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[e.detail.value];
    if (selItem && selItem.name && e.detail.value) {
      this.setData({
        selDistrict:selItem.name,
        selDistrictIndex:e.detail.value
      })
    }
  },
  deleteAddress: function (e) {
    var that=this;
    var id=e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success:function(res){
        if(res.confirm){
          wx.request({
            url: app.globalData.subDomain+"/user/shipping-address/delete",
            data:{
              token:app.globalData.token,
              id:id
            },
            success:function(res){
              wx.navigateBack({});
            }
          })
        }else if(res.cancel){
          console.log("用户取消删除");
        }
      }
    })
  },
  bindCancel: function (e) {
    wx.navigateBack({});
  }
})