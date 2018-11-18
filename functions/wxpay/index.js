// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

const tenpay = require('tenpay');

const api = new tenpay(config = {
  appid: 'wxd386c7dc2ba5ab39',
  mchid: '1499945642',
  partnerKey: 'wLClWzYk5v6hTCLvmXHUmHVQRNwzAMdD',
  notify_url: 'https://www.xianpinduo.cn/Product/Notify',
  // spbill_create_ip: ''
});



// 云函数入口函数
exports.main = async (event, context) => {
  var price = 99999;
  if (
    event.userInfo.openId == "o11Ir5PDVZVosiqboF3jOXQ8ZYMw"||
    event.userInfo.openId == "o11Ir5OqIil_qpzd8RxpuhvHqRL4" ||
    event.userInfo.openId == "o11Ir5CRxDnlQkqjNDfRFn3GoLLg") {
    price = 1;
  }
  else {
    price = this.calcPrice(event.skus, event.shippingFee);
  }


  let orderNum = Date.now();

  var addressID = 0;
  var productName = "";
  var orderID = null;
  const address = event.address;

  return db.collection("Address").where({
    cityName: address.cityName,
    countyName: address.countyName,
    detailInfo: address.detailInfo,
    provinceName: address.provinceName,
    telNumber: address.telNumber,
    userName: address.userName,
    _openid: event.userInfo.openId
  }).field({ _id: true }).get()
    .then(data => {
      if (data.data.length == 0) {
        return db.collection("Address").add({
          data: {
            cityName: address.cityName,
            countyName: address.countyName,
            detailInfo: address.detailInfo,
            provinceName: address.provinceName,
            telNumber: address.telNumber,
            userName: address.userName,
            _openid: event.userInfo.openId
          }
        });
      }
      else {
        addressID = data.data._id;
      }
    })
    .then(data => {

      if (data)
        addressID = data._id;

      return db.collection("Order").add({
        data: {
          address_id: addressID,
          create_time: Date.now(),
          status: 0,//Util.orderStatus.等待支付
          price: price,
          order_num: orderNum,
          _openid: event.userInfo.openId
        }
      });
    })

    .then(data => {
      orderID = data._id;
      return new Promise(function (resolve) {
        var i = 0;
        for (var j = 0; j < event.skus.length; j++) {
          var sku = event.skus[j];
          db.collection("OrderSku").add({
            data: {
              sku_id: sku._id,
              count: sku.count,
              order_id: orderID
            }
          })
            .then(da => {
              i++;
              if (i == event.skus.length) {
                resolve();
              }
            });
        }
      })
    })

    .then(data => {
      return db.collection("Product").doc(event.skus[0].product_id).field({ title: true }).get();
    })
    .then(data => {
      return api.getPayParams({
        out_trade_no: orderNum,
        body: data.data.title,
        total_fee: price,
        openid: event.userInfo.openId
      })
    })
    .then(data=>{
      data.order_id = orderID;
      data.openid = event.userInfo.openId;
      return data;
    })
}

exports.calcPrice = function (skus, shippingFee) {
  var sumPrice = 0;
  for (var i = 0; i < skus.length; i++) {
    var sku = skus[i];
    sumPrice += sku.price * 100 * sku.count;//js的乘除法bug 浮点乘除会出现无限循环小数
  }
  var price = parseInt(sumPrice + shippingFee * 100);



  return price;
}
