//app.js
App({
  host:"https://www.xianpinduo.cn",
  userid:0,
  openid:null,
  onLaunch: function () {
    wx.cloud.init();
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    const db = wx.cloud.database();

    // db.collection("Order").limit(1).get().then(data=>{
    //   wx.cloud.callFunction({ name: "login", data: { price: data.data[0].price / 100 } }).then(data => {
    //     console.log(data);
    //   })
    // })
    
    // wx.cloud.callFunction({
    //   name: 'login',
    //   success: function (res) {
    //     console.log(res.result.userInfo.openId)
    //     getApp().openid = res.result.userInfo.openId;
        
    //     getApp().admin = getApp().openid == "o11Ir5PDVZVosiqboF3jOXQ8ZYMw";
        // db.collection("User").where({_openid:res.result.openId}).get({success:function(data){
        //   if(data.data.length ==0)
        //   {
        //     db.collection("User").add({ data: { },success:function(data2){
        //       getApp().userid = data2._id;
        //     }});
        //   }
        //   else{
        //     getApp().userid = data.data[0]._id;
        //   } 
          
        // }});
    //   },
    //   fail: console.error
    // })

    // db.collection("Order").doc("W8_arpL-scb2IavR").get().then(data => {
    //     var order = data.data;
    //     debugger
    //     return db.collection("OrderSku").where({ order_id: order._id }).get()
    //   })
    //   .then(data => {
    //     debugger
    //     return db.collection("Sku").doc(data.data[0].sku_id).get();
    //   })
    //   .then(data => {
    //     debugger
    //     return db.collection("Product").where({ _id: data.data.product_id }).field({ title: true }).get();
    //   })
    //   .then(data => {
    //     product = data.data;
    //     return db.collection("Address").doc(order.address_id).get();
    //   })

    // 登录
    // wx.login({
    //   success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // wx.request({
        //   url: getApp().host + '/user/login?code=' + res.code,
        //   success:function(result){
        //     getApp().userid = result.data.id;
        //   }
        // })
    //   }
    // })

    
  },
  globalData: {
    userInfo: null
  }
})