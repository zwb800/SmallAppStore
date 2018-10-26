// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var skus = null;
  var address = null;
  return db.collection("Sku").where({ _id: db.command.in(event.skuid.split(",")) }).get()
    .then(data => {
      skus = data.data;
      var productids = new Array();
      for (var i = 0; i < skus.length; i++) {
        skus[i].count = 1;
        productids.push(skus[i].product_id);
      }
      return db.collection("Product").where({ _id: db.command.in(productids) }).field({ img: true, title: true }).get();
    })
    .then(data => {
      var products = data.data;
      for (var i = 0; i < skus.length; i++) {
        var s = skus[i];
        for (var j = 0; j < products.length; j++) {
          var product = products[j];
          if (s.product_id == product._id) {
            s.product = product;
            break;
          }
        }
      }

      return db.collection("Address").where({ _openid: event.userInfo.openId }).get();
    })
    .then(data3 => {
      if (data3.data.length > 0)
        address = data3.data[data3.data.length - 1];

      if (event.fromCart) {
        return db.collection("Cart").where({ sku_id: db.command.in(event.skuid.split(",")), 
        _openid: event.userInfo.openId }).get();
      }

    })
    .then(cartData => {
      if (cartData) {
        for (var i = 0; i < skus.length; i++) {
          var s = skus[i];
          for (var j = 0; j < cartData.data.length; j++) {
            if (cartData.data[j].sku_id == s._id) {
              s.count = cartData.data[j].count;
            }
          }
        }
      }

      return { skus: skus, address: address, shippingFee: 5.0 };
    })
}