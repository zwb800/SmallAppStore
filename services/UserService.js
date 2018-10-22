module.exports.get = function (userid, callback) {
  const db = wx.cloud.database();
  db.collection("Order").orderBy("create_time","desc").get({success:function(data){
    var orders = data.data;
    var count = 0;
    for(var h=0;h<orders.length;h++){
      const order = orders[h];
      db.collection("OrderSku").where({ order_id: order._id }).get({
        success: function (ordersku) {
          ordersku = ordersku.data;
          order.skus = ordersku;
          console.log(order)
          var skuids = new Array();
          for (var i = 0; i < ordersku.length; i++) {
            skuids.push(ordersku[i].sku_id);
          }

          db.collection("Sku").where({ _id: db.command.in(skuids) }).get({
            success: function (data) {
              var skus = data.data;
              var productids = new Array();
              for (var i = 0; i < skus.length; i++) {
                var sku = skus[i]
                productids.push(sku.product_id);
                for (var j = 0; j < ordersku.length; j++) {
                  if (ordersku[j].sku_id == sku._id) {
                    ordersku[j].sku = sku;
                    break;
                  }
                }
              }

              //导入的_id查询不到 微信bug
              db.collection("Product").where({ _id: db.command.in(productids) }).get({
                success: function (data2) {
                  var products = data2.data;
                  for (var i = 0; i < ordersku.length; i++) {
                    var c = ordersku[i];
                    for (var j = 0; i < products.length; j++) {
                      var product = products[j];
                      if (c.sku.product_id == product._id) {
                        c.sku.product = product;
                        break;
                      }
                    }
                  }
                  
                  count++;
                  if(count == orders.length)
                    callback(orders);
                }
              });

            }
          });
        }
      });
    }
    
  }})
}
