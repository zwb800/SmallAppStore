//app.js
App({
  host:"https://www.xianpinduo.cn",
  userid:0,
  onLaunch: function () {
    wx.cloud.init();
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    const db = wx.cloud.database();

    wx.cloud.callFunction({
      name: 'login',
      success: function (res) {
        console.log(res.result.openId)
        db.collection("User").where({OpenId:res.result.openId}).get({success:function(data){
          getApp().userid = data.data[0]._id;
          console.log(getApp().userid);
        }});
      },
      fail: console.error
    })

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