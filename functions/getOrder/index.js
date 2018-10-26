// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  return db.collection("Order").where({_openid:event.userInfo.openId}).orderBy("create_time", "desc").skip(event.skip).limit(event.take).get().then(data=>{
    
      var orders = data.data;
      var count = 0;

      if (orders.length == 0) {
        return [];
      }

      return new Promise(function(resolve){
        for (var h = 0; h < orders.length; h++) {
          const order = orders[h];
          db.collection("OrderSku").where({ order_id: order._id }).get().then(orderskudata => {

            order.skus = orderskudata.data;
            var skuids = new Array();
            for (var i = 0; i < order.skus.length; i++) {
              skuids.push(order.skus[i].sku_id);
            }

            return db.collection("Sku").where({ _id: db.command.in(skuids) }).get();
          })
            .then(skudata => {
              var skus = skudata.data;
              var productids = new Array();
              for (var i = 0; i < skus.length; i++) {
                var sku = skus[i]
                productids.push(sku.product_id);
                for (var j = 0; j < order.skus.length; j++) {
                  if (order.skus[j].sku_id == sku._id) {
                    order.skus[j].sku = sku;
                    break;
                  }
                }
              }

              //导入的_id查询不到 微信bug
              return db.collection("Product").where({ _id: db.command.in(productids) }).field({ title: true, img: true }).get();
            })
            .then(productdata => {
              var products = productdata.data;
              for (var i = 0; i < order.skus.length; i++) {
                var c = order.skus[i];
                for (var j = 0; j < products.length; j++) {
                  var product = products[j];
                  if (c.sku.product_id == product._id) {
                    c.sku.product = product;
                    break;
                  }
                }
              }

              count++;
              if (count == orders.length)
                resolve(orders);
            })

        }
      })
      


    })
}