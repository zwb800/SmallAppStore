var Util = require('../utils/util.js');
module.exports.shippingOrder = function (skus, address, callback) {
  wx.request({
    url: getApp().host + '/product/shippingorder',
    data: { userid: getApp().userid, skus: skus, address: address },
    method: "POST",
    header: { "content-type": "application/json" },
    success: function (data) {
      if (callback)
        callback(data.data == "success");
    }
  });
}

module.exports.saveAddress = function (address, callback) {
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
      else {
        callback(dataAddress._id);
      }
    }
  });
}

module.exports.calcPrice = function (skus, shippingFee) {
  var sumPrice = 0;
  for (var i = 0; i < skus.length; i++) {
    var sku = skus[i];
    sumPrice += sku.price * 100 * sku.count;//js的乘除法bug 浮点乘除会出现无限循环小数
  }
  var price = parseInt(sumPrice + shippingFee * 100);

  var openid = getApp().openid;
  if (openid == "o11Ir5PDVZVosiqboF3jOXQ8ZYMw") {
    price = 1;
  }

  return price;
}

module.exports.wxPay = function (skus, address, shippingFee, callback) {
  const db = wx.cloud.database();
  
  var order = null;
  var product = null;

  wx.cloud.callFunction({
    name:"wxpay",
  data:{
    skus:skus,
    address:address,
    shippingFee: shippingFee
  }
  }).then(data=>{
    const prepay_id = data.result.package.replace("prepay_id=","");
    const openid = data.result.openid;
    wx.requestPayment(
      {
        'timeStamp': data.result.timeStamp,
        'nonceStr': data.result.nonceStr,
        'package': data.result.package,
        'signType': 'MD5',
        'paySign': data.result.paySign,
        'success': function (res) {
          db.collection("Order").doc(data.result.order_id).update({
            data: { status: Util.orderStatus.已支付 }
          })
          .then(data=>{
            return db.collection("Order").doc(data._id).get()
          })
          .then(data => {
            order = data.data;
            return db.collection("OrderSku").where({ order_id: order._id}).get()
          })
          .then(data => {
            return db.collection("Sku").doc(data.data[0].sku_id ).get();
          })
          .then(data=>{
            return db.collection("Product").doc(data.data.product_id).field({ title: true }).get();
          })
          .then(data => {
            product = data.data;
            return db.collection("Address").doc(order.address_id ).get();
          })
          .then(data => {
            address = data.data;
            console.log(prepay_id)
            debugger
            wx.cloud.callFunction({
              name: "sendMsg",
              data:{
                message: {
                  "touser": openid,
                  "weapp_template_msg": {
                    "template_id": "fSOMZgOtUN4gqaLuWcB98xKTelwQXsMqaNXh1cIh9Fs",
                    "page": "pages/my/my",
                    "form_id": prepay_id,
                    "data": {
                      "keyword1": {
                        "value": order.order_num
                      },
                      "keyword2": {
                        "value": product.title
                      },
                      "keyword3": {
                        "value": (order.price / 100)+"元"
                      },
                      "keyword4": {
                        "value": address.userName
                      },
                       "keyword5": {
                         "value": address.countyName + address.detailInfo
                      }
                    },
                    // "emphasis_keyword": "keyword1.DATA"
                  }
                }
              }
            })
              .then(result => {
                console.log(result.result.data);
              })
            
            callback(true);
          })

        },
        'fail': function (res) {
          callback(false);
        },
        'complete': function (res) {
          console.log(res);
        }
      });
  })
  // const price = this.calcPrice(skus, shippingFee);

  // const db = wx.cloud.database();


  // var addressID = 0;
  // var productName = "";
  // var orderID = null;

  // db.collection("Address").where({
  //   cityName: address.cityName,
  //   countyName: address.countyName,
  //   detailInfo: address.detailInfo,
  //   provinceName: address.provinceName,
  //   telNumber: address.telNumber,
  //   userName: address.userName
  // }).field({_id:true}).get()
  // .then(data => {
  //   if (data.data.length == 0) {
  //     return db.collection("Address").add({
  //       data: {
  //         cityName: address.cityName,
  //         countyName: address.countyName,
  //         detailInfo: address.detailInfo,
  //         provinceName: address.provinceName,
  //         telNumber: address.telNumber,
  //         userName: address.userName
  //       }
  //     });
  //   }
  //   else {
  //     addressID = data.data._id;
  //   }
  // })
  // .then(data => {

  //   if (data)
  //     addressID = data._id;

  //   return db.collection("Order").add({
  //     data: {
  //       address_id: addressID,
  //       create_time: new Date(),
  //       status: Util.orderStatus.等待支付,
  //       price: price
  //     }
  //   });
  // })

  // .then(data => {
  //   orderID = data._id;
  //   return new Promise(function (resolve) {
  //     var i = 0;
  //     for (var j = 0; j < skus.length; j++) {
  //       var sku = skus[j];
  //       db.collection("OrderSku").add({
  //         data: {
  //           sku_id: sku._id,
  //           count: sku.count,
  //           order_id: data._id
  //         }, success: function () {
  //           i++;
  //           if (i == skus.length) {
  //             resolve();
  //           }
  //         }
  //       });
  //     }
  //   })
  // })

  // .then(data => {
  //   return db.collection("Product").doc(skus[0].product_id).field({title:true}).get();
  // })

  // .then(data => {

  //   return wx.cloud.callFunction({
  //     name: "wxpay",
  //     data: {
  //       body: data.data.title,
  //       price: price
  //     },
  //   })
  //   return new Promise(function (resolve) {
  //     // wx.request({
  //     //   url: getApp().host + '/product/wxpay',
  //     //   data: { openId: getApp().openid, body: data.data.title, price: price },
  //     //   success: function (preOrderdata) {
  //     //     resolve(preOrderdata);
  //     //   }
  //     // });
     

  //   });
  // })

  // .then(preOrderdata => {
  //   wx.requestPayment(
  //     {
  //       'timeStamp': preOrderdata.result.timeStamp,
  //       'nonceStr': preOrderdata.result.nonceStr,
  //       'package': preOrderdata.result.package,
  //       'signType': 'MD5',
  //       'paySign': preOrderdata.result.paySign,
  //       'success': function (res) {
  //         db.collection("Order").doc(orderID).update({
  //           data: { status: Util.orderStatus.已支付 }
  //         })
  //         .then(data => {
  //           callback(true);
  //         })

  //       },
  //       'fail': function (res) {
  //         callback(false);
  //       },
  //       'complete': function (res) {
  //         console.log(res);
  //       }
  //     });
  // })
}

module.exports.confirm = function (skuid, callback, fromCart) {
  wx.cloud.callFunction({
    name: "getConfirm",
    data: {
      skuid: skuid,
      fromCart: fromCart
    }
  }).then(data => {
    callback(data.result);
  })
  // const db = wx.cloud.database();
// 
  // var skus = null;
  // var address = null;
  // db.collection("Sku").where({ _id: db.command.in(skuid.split(",")) }).get()
  //   .then(data => {
  //     skus = data.data;
  //     var productids = new Array();
  //     for (var i = 0; i < skus.length; i++) {
  //       skus[i].count = 1;
  //       productids.push(skus[i].product_id);
  //     }
  //     return db.collection("Product").where({ _id: db.command.in(productids) }).field({img:true,title:true}).get();
  //   })
  //   .then(data => {
  //     var products = data.data;
  //     for (var i = 0; i < skus.length; i++) {
  //       var s = skus[i];
  //       for (var j = 0; j < products.length; j++) {
  //         var product = products[j];
  //         if (s.product_id == product._id) {
  //           s.product = product;
  //           break;
  //         }
  //       }
  //     }

  //     return db.collection("Address").get();
  //   })
  //   .then(data3 => {
  //     if (data3.data.length > 0)
  //       address = data3.data[data3.data.length - 1];

  //     if (fromCart) {
  //       return db.collection("Cart").where({ sku_id: db.command.in(skuid.split(",")) }).get();
  //     }

  //   })
  //   .then(cartData => {
  //     if (cartData) {
  //       for (var i = 0; i < skus.length; i++) {
  //         var s = skus[i];
  //         for (var j = 0; j < cartData.data.length; j++) {
  //           if (cartData.data[j].sku_id == s._id) {
  //             s.count = cartData.data[j].count;
  //           }
  //         }
  //       }
  //     }

  //     callback({ skus: skus, address: address, shippingFee: 5.0 });
  //   })
}