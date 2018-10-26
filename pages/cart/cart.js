var CartService = require('../../services/CartService.js');


// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected:new Array()
  },
  delete:function(e){
    var id = e.target.dataset.id;
    var $this = this;
    CartService.delete(id,function(success){
      if (success)
      {
        $this.onShow();
      }

    });
  },
  add: function (e) {
    var id = e.target.dataset.id;
    var sku = this.getSkuByID(id);
    sku.count++;
    this.setData({ skus: this.data.skus });
    CartService.update( sku._id, sku.count);
  },

  sub: function (e) {
    var id = e.target.dataset.id;
    var sku = this.getSkuByID(id);
    sku.count--;
    this.setData({ skus: this.data.skus });
    CartService.update(sku._id,sku.count);
  },
  getSkuByID: function (id) {
    for (var i = 0; i < this.data.skus.length; i++) {

      if (this.data.skus[i]._id == id) {

        return this.data.skus[i];
      }

    }

    return null;

  },

  cbxChange:function(e){
    var id = e.currentTarget.dataset.id;
    if(e.detail.value == "selected"){
      this.data.selected.push(id);
    }
    else{
      for(var i=0;i<this.data.selected.length;i++)
      {
        if(this.data.selected[i]== id)
        {
          this.data.selected.splice(i,1);
        }

      }
    }

    this.setData({ selected:this.data.selected});

  },
  removeSelected:function(e){
    var $this = this;
    for(var i=0;i<this.data.selected.length;i++)
    {
        if(this.data.selected[i]!=undefined)
        {
          var id = this.data.selected[i];
          CartService.delete(id, function (data) {
            if (data && i==$this.data.selected.length) {
              $this.onShow();
            }

          });
        }
    }
    
   
  },

  buy:function(){
    var skuids="";
    for (var i = 0; i < this.data.selected.length; i++) {
      if (this.data.selected[i] != undefined) {
        var sku = this.getSkuByID(this.data.selected[i]);
        skuids += "" + sku.sku_id+",";
      }
    }

    wx.navigateTo({
      url: '/pages/confirm/confirm?cart=1&id='+skuids,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.setData({
      skus: []});
    var $this = this;
    CartService.get(function (data) {
      
      wx.stopPullDownRefresh();
      wx.hideLoading();
      $this.data.selected = [];
      for(var i=0;i<data.length;i++)
      {
        $this.data.selected.push(data[i]._id);
      }

      $this.setData({ skus: data, selected: $this.data.selected });
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})