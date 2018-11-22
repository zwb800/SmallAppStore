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
        getApp().openid = res.result.userInfo.openId;
        getApp().admin = 
          getApp().openid == "o11Ir5PDVZVosiqboF3jOXQ8ZYMw" || //张文彬
          getApp().openid == "o11Ir5OqIil_qpzd8RxpuhvHqRL4";//翟严
        
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
