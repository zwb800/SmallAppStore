var ConfirmService = require('../../services/ConfirmService.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  
  wxOrder:function(){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    ConfirmService.wxPay(this.data.skus, this.data.address,this.data.shippingFee, function (success) {
      wx.hideLoading();
      if (success) {
        wx.showModal({
          title: '订单',
          content: '下单成功！',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/my/my',
              });
            }
          }
        });
      }

    });

  },
  shippingOrder:function(){

    ConfirmService.shippingOrder(this.data.skus,this.data.address,function(success){
      if(success)
      {
        wx.showModal({
          title: '订单',
          content: '下单成功！',
          showCancel:false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 10
              });        
            }
          }
        });
      }

    });
  },
  calcSum:function(){
    var sumPrice = 0;
    for(var i=0;i<this.data.skus.length;i++)
    {
      var sku = this.data.skus[i];
      sumPrice += parseInt(sku.price*100)*sku.count/100;//js的乘除法bug 浮点乘除会出现无限循环小数
    }
    this.setData({sumPrice:sumPrice,payPrice:(sumPrice+this.data.shippingFee)});

  },
  add:function(e){
    var skuid = e.target.dataset.skuid;
    this.getSkuByID(skuid).count++;
    this.setData({ skus: this.data.skus });
    this.calcSum();
  },

  sub: function (e) {
    var skuid = e.target.dataset.skuid;
    this.getSkuByID(skuid).count--;
    this.setData({ skus: this.data.skus });
    this.calcSum();
  },
  getSkuByID:function(skuid)
  {
    for(var i=0;i<this.data.skus.length;i++){

    if(this.data.skus[i]._id == skuid)
    {

      return this.data.skus[i];
    }

    }

    return null;

  },


  chooseAddress:function(){
    var $this = this;
    wx.chooseAddress({
      success: function (res) {
        $this.setData({ address: res});
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var skuid = options.id;

    wx.showLoading({
      title: '加载中',
      mask: true
    })

    var $this = this;
    ConfirmService.confirm( skuid,function(data){
        wx.hideLoading();
        $this.setData(data);
        $this.calcSum();

        if(data.address==null)
        {
          wx.showModal({
            title: '请先设置收货地址',
            // content: '下单成功！',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                $this.chooseAddress();
              }
            }
          });
        }
      },options.cart);
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