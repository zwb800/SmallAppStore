var ProductService = require('../../services/ProductService.js');


Page({
  data: {
    productList : null,
    admin:false,
  },
  onLoad: function () {
    var $this = this;
    
    wx.cloud.callFunction({
      name: 'login',
      success: function (res) {
        console.log(res.result.userInfo.openId)
        getApp().openid = res.result.userInfo.openId;
        getApp().admin = getApp().openid == "o11Ir5PDVZVosiqboF3jOXQ8ZYMw";
        
        $this.setData({admin:getApp().admin});
        }
      });
    
    wx.showLoading({
      title: '加载中',
      mask:true
    })
   
    ProductService.getList(function(data){
      $this.setData({ productList:data});
      wx.hideLoading()
      wx.stopPullDownRefresh();
    });
  },
  onPullDownRefresh: function () {
    this.onLoad();
  },
})
