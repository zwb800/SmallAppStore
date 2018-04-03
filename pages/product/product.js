// pages/product/product.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      productName:'',
      price:0,
      productList: [
        { id: 1, name: '猕猴桃', price: 5.2 },
        { id: 2, name: '榴莲', price: 19.8 },
      ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var productid = options.id;
    var productList = this.data.productList;
    for(var i=0;i<productList.length;i++)
    {
      if(productList[i].id == productid)
      {
        this.setData({productName : productList[i].name});
        this.setData({price:productList[i].price});
        break;
      }
    }
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