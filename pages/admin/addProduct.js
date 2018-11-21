var ProductService = require('../../services/ProductService.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var productid = options.id;
    
    // productid = "W8wyZA6qgQy38jUS";
    if(!productid)
    {
      this.setData({ imgs: [""],skus: [{ name: "", price: "" }]});
    }
    else{
      wx.showLoading({
        title: '加载中',
      })
      var $this = this;
      ProductService.get(productid, function (data) {
        $this.setData({ data});
        wx.hideLoading();
      });
    }

  },
  addImgs:function(){
    this.data.imgs.push("");
    this.setData({ imgs: this.data.imgs});
  },
  addSKU:function(){
    this.data.skus.push({ name: "", price: "" });
    this.setData({ skus: this.data.skus });
  },

  formSubmit:function(e){
    const db = wx.cloud.database();
    var product = e.detail.value;
    product.imgs = new Array();
    for (var i = 0; i < 10; i++) {
      var imgs = product["imgs_" + i];
      if (imgs) {
        product.imgs.push(imgs);
      }
    }

    wx.cloud.callFunction({
      name:"addProduct",
      data:{product:product}
    }).then(data=>{
      wx.reLaunch({
        url: '/pages/index/index',
      })
    })
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