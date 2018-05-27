var ProductService = require('../../services/ProductService.js');

// pages/product/product.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnCss: ['selected',"unselected"],
      productName:'',
      price:0,
      imgs:[],
      product:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var productid = options.id;

    var $this = this;
     ProductService.get(productid,function(data){

       $this.setData({ product: data,sku:data.skus[0] });
     });
    
  },

  sku_tap:function(e){
    var skuid = e.target.dataset.skuid;
    if(skuid){
      console.log(skuid);
      for(var i=0;i<this.data.btnCss.length;i++)
      {
        this.data.btnCss[i] = "unselected";
      }
      this.data.btnCss[e.target.dataset.index] = "selected";

var skus = this.data.product.skus;
var sku = null;
      for(var i=0;i<skus.length;i++)
      {
        if (skus[i].id == skuid)
        {

          sku = skus[i];
        }
      }
      this.setData({
        btnCss:this.data.btnCss,
        sku:sku,
      });
    }
  },

  tapBuy:function(e){
    wx.navigateTo({
      url: '/pages/confirm/confirm?id='+this.data.product.id,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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