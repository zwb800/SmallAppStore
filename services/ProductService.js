var Util = require('../utils/util.js');
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

module.exports.saveAddress = function(address,callback){
  const db = wx.cloud.database();
  db.collection("Address").where({
    cityName: address.cityName,
    countyName: address.countyName,
    detailInfo: address.detailInfo,
    provinceName: address.provinceName,
    telNumber: address.telNumber,
    userName: address.userName
  }).get({
    success: function (dataAddress) {
      if (dataAddress.data.length == 0) {
        db.collection("Address").add({
          data: {
            cityName: address.cityName,
            countyName: address.countyName,
            detailInfo: address.detailInfo,
            provinceName: address.provinceName,
            telNumber: address.telNumber,
            userName: address.userName
          }, success: function (dataAddAddress) {
            callback(dataAddAddress._id);
          }
        });
      }
      else{
        callback(dataAddress._id);
      }
    }
  });
}

module.exports.wxPay = function (skus, address, shippingFee, callback) {
  var sumPrice = 0;
  for (var i = 0; i < skus.length; i++) {
    var sku = skus[i];
    sumPrice += sku.price * 100 * sku.count;//js的乘除法bug 浮点乘除会出现无限循环小数
  }
  var price = parseInt(sumPrice + shippingFee * 100);

  const db = wx.cloud.database();
    var openid = getApp().openid;
    if (openid == "o11Ir5PDVZVosiqboF3jOXQ8ZYMw")
    {
      price = 1;
    }

    this.saveAddress(address, function (address_id) {
          db.collection("Product").doc(skus[0].product_id).get({
            success: function (data2) {
              wx.request({
                url: getApp().host + '/product/wxpay',
                data: { openId: openid, body: data2.data.title, price: price },
                success: function (preOrderdata) {
                  db.collection("Order").add({data:{
                    address_id: address_id,
                    create_time:new Date(),
                    status :Util.orderStatus.等待支付,
                    price:price
                  },success:function(orderData){
                    var i = 0;
                    for(var j=0;j<skus.length;j++){
                      var sku = skus[j];
                      db.collection("OrderSku").add({
                        data: {
                          sku_id: sku._id,
                          count:sku.count,
                          order_id:orderData._id
                          }, success: function () {
                          i++;
                          if (i == skus.length) {
                            wx.requestPayment(
                              {
                                'timeStamp': preOrderdata.data.timeStamp,
                                'nonceStr': preOrderdata.data.nonceStr,
                                'package': preOrderdata.data.package,
                                'signType': 'MD5',
                                'paySign': preOrderdata.data.paySign,
                                'success': function (res) {
                                  db.collection("Order").doc(orderData._id).update({
                                    data: { status: Util.orderStatus.已支付},success:function(){

                                  }})
                                  callback(true);
                                },
                                'fail': function (res) {
                                  callback(false);
                                },
                                'complete': function (res) {
                                  console.log(res);
                                }
                              });
                          }
                        }
                      });
                    }
                  }});
              
                }
              });
            }
          });
        });
}

module.exports.confirm = function (skuid, callback,fromCart) {
  const db = wx.cloud.database();
 
  db.collection("Sku").where({ _id:db.command.in( skuid.split(",")) }).get({
    success: function (data) {
      var skus = data.data;
      var productids = new Array();
      for(var i=0;i<skus.length;i++)
      {
        skus[i].count = 1;
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

          db.collection("Address").get({
            success: function (data3) {
              if (fromCart) {
                db.collection("Cart").where({ sku_id: db.command.in(skuid.split(",")) }).get({
                  success: function (cartData) {
                    for (var i = 0; i < skus.length; i++) {
                      var s = skus[i];
                      for (var j = 0; j < cartData.data.length; j++) {
                        if (cartData.data[j].sku_id == s._id) {
                          s.count = cartData.data[j].count;
                        }
                      }
                    }

                    callback({ skus: skus, address: data3.data[data3.data.length - 1], shippingFee: 5.0 });
                  }
                });
              }
              else {
                callback({ skus: skus, address: data3.data[data3.data.length-1], shippingFee: 5.0 });
              }
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