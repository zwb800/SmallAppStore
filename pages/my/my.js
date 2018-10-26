var UserService = require('../../services/UserService.js');

// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  userid:1,
  orders:new Array(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onShow();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  i: 0,
  pageSize:5,
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.i = 0;    
    this.data.orders = [];
    this.loadData();
  },

  loadData:function(){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var $this = this;
    UserService.get(this.i, this.pageSize, function (data) {

      wx.stopPullDownRefresh();
      wx.hideLoading();
      for (var i = 0; i < data.length; i++) {
        $this.data.orders.push(data[i]);
      }
      $this.setData({ orders: $this.data.orders });

    });
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
    
    this.onShow();
  },

  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.i += this.pageSize;
    this.loadData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})