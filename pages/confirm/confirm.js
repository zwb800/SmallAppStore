// pages/confirm/confirm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count:1,
    address: { userName: "张文彬", provinceName: "北京市", cityName: "北京市", countyName: "海淀区", detailInfo:"北三环西路75号",telNumber:"1531508135"}
  },
  add:function(e){
    this.data.count++;
    this.setData({ count: this.data.count});
  },
  sub: function (e) {
    this.data.count--;
    this.setData({ count: this.data.count });
  },

  chooseAddress:function(){
    var $this = this;
    wx.chooseAddress({
      success: function (res) {
        $this.setData({address:res});
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