var ProductService = require('../../services/ProductService.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid:1,
  },
  shippingOrder:function(){

    ProductService.shippingOrder(this.data.userid,this.data.skus,this.data.address,function(success){
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

if(this.data.skus[i].id == skuid)
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
        $this.setData({ address: $this.data.address});
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var skuid = options.id;
    var $this = this;
    ProductService.confirm(this.data.userid, skuid,function(data){
for(var i=0;i<data.skus.length;i++)
{
data.skus[i].count = 1;

}
data.shippingFee = 5.0;

$this.setData(data);
      $this.calcSum();
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