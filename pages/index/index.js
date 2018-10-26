var ProductService = require('../../services/ProductService.js');


Page({
  data: {
    productList : null,
  },
  onLoad: function () {

    wx.showLoading({
      title: '加载中',
      mask:true
    })
    var $this = this;
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
