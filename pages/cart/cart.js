var CartService = require('../../services/CartService.js');


// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid: 1
  },
  delete:function(e){
    var skuid = e.target.dataset.skuid;
    var $this = this;
    CartService.delete(this.data.userid,skuid,function(data){
if(data=="success")
{
  $this.onLoad();
}

    });
  },
  add: function (e) {
    var skuid = e.target.dataset.skuid;
    var sku = this.getSkuByID(skuid);
    sku.count++;
    this.setData({ skus: this.data.skus });
    CartService.update(this.data.userid, sku.id, sku.count);
  },

  sub: function (e) {
    var skuid = e.target.dataset.skuid;
    var sku = this.getSkuByID(skuid);
    sku.count--;
    this.setData({ skus: this.data.skus });
    CartService.update(this.data.userid,sku.id,sku.count);
  },
  getSkuByID: function (skuid) {
    for (var i = 0; i < this.data.skus.length; i++) {

      if (this.data.skus[i].id == skuid) {

        return this.data.skus[i];
      }

    }

    return null;

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var $this = this;
   CartService.get(this.data.userid,function(data){
     $this.setData({skus:data});
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