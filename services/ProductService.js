
module.exports.shippingOrder = function(skus,address,callback){
  wx.request({
    url: getApp().host + '/product/shippingorder',
    data: { userid: getApp().userid,skus: skus, address: address },
    method:"POST",
    header:{"content-type": "application/json"},
    success: function (data) {
      if (callback)
        callback(data.data=="success");
    }
  });
}

module.exports.wxPay = function (skus, address, shippingFee, callback) {
  const db = wx.cloud.database();
  db.collection("User").doc(getApp().userid).get({success:function(data){
    
    var openid = data.data.OpenId;

    var sumPrice = 0;
    for (var i = 0; i < skus.length; i++) {
      var sku = skus[i];
      sumPrice += parseInt(sku.price * 100) * sku.count / 100;//js的乘除法bug 浮点乘除会出现无限循环小数
    }
    var price = sumPrice + shippingFee;

    wx.request({
      url: getApp().host + '/product/wxpay',
      data: { openid: openid,body:"",price:price},
      method: "POST",
      header: { "content-type": "application/json" },
      success: function (data) {
        data = data.data;
        wx.requestPayment(
          {
            'timeStamp': data.timeStamp,
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': 'MD5',
            'paySign': data.paySign,
            'success': function (res) {
              callback("success")
             },
            'fail': function (res) { },
            'complete': function (res) { }
          })
      }
    });

  }
  });


}

module.exports.confirm = function (skuid, callback) {
  const db = wx.cloud.database();
  db.collection("Sku").where({ _id:db.command.in( skuid.split(",")) }).get({
    success: function (data) {
      var skus = data.data;
      var productids = new Array();
      for(var i=0;i<skus.length;i++)
      {
        productids.push(skus[i].product_id);
      }

      //根据id而不是_id 因为导入的_id查询不到 微信bug
      db.collection("Product").where({ _id: db.command.in(productids)}).get({
        success:function(data2)
        {
          var products = data2.data;
          for (var i = 0; i < skus.length; i++) {
              var s = skus[i];
              for(var j=0;i<products.length;j++)
              {
                var product = products[j];
                if (s.product_id == product._id)
                {
                  s.product = product;
                  break;
                }
              }
          }
          db.collection("Address").where({ userId: getApp().userid}).get({
            success:function(data3)
            {
              callback({ skus: skus, address: data3.data[0] });
            }
          });
          
        }
      });
      
    }
  });
}
module.exports.get = function(id,callback){
  const db = wx.cloud.database();


  db.collection("Product").doc(id).get({
    success: function (data) {
      db.collection("Sku").where({ product_id: data.data._id}).get({success:function(sku){
          data.data.skus = sku.data;
          callback(data.data);
      }});

      
    }
  });
}

module.exports.getList = function (callback){
  // module.exports.request("", {}, callback);
  const db = wx.cloud.database();
  db.collection("Product").get({success:function(data){
    callback(data.data);
  }
  });
}

module.exports.request = function (url, data, callback) {

  data.userid = getApp().userid;
  wx.request({
    url: getApp().host + '/product/' + url,
    data: data,
    success: function (data) {
      if (callback)
        callback(data.data);
    }
  });


}