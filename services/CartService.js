module.exports.delete = function ( id, callback) {
  const db = wx.cloud.database();
  db.collection("Cart").doc(id).remove({
    success: function (data) {
      callback(true);
    }
  });
}

module.exports.update = function ( id, count, callback) {
  const db = wx.cloud.database();
  db.collection("Cart").doc(id).update({
    data: { count: count }, success: function (res) {
      callback(true);
    }
  });
}

module.exports.add = function (skuid, callback) {
  const db = wx.cloud.database();
  db.collection("Cart").where({  sku_id: skuid }).get({
    success: function (data) {
      if (data.data.length == 0) {
        db.collection("Cart").add({
          data: { sku_id: skuid, count: 1 }, success: function (res) {
            callback(true);
          }
        });
      }
      else {
        data.data[0].count++;
        db.collection("Cart").doc(data.data._id).update({
          data: { count: data.data[0].count }, success: function (res) {
            callback(true);
          }
        });
      }
    }
  });
}

module.exports.get = function ( callback) {
  const db = wx.cloud.database();
  var carts = null;
  db.collection("Cart").get().then(data=>{
    carts = data.data;
    var skuids = new Array();
    for (var i = 0; i < carts.length; i++) {
      skuids.push(carts[i].sku_id);
    }

    return db.collection("Sku").where({ _id: db.command.in(skuids) }).get();
  })
  .then(data=>{
    var skus = data.data;
    var productids = new Array();
    for (var i = 0; i < skus.length; i++) {
      var sku = skus[i]
      productids.push(sku.product_id);
      for (var j = 0; j < carts.length; j++) {
        if (carts[j].sku_id == sku._id) {
          carts[j].sku = sku;
          break;
        }
      }
    }

    //导入的_id查询不到 微信bug
    return db.collection("Product").where({ _id: db.command.in(productids) }).field({img:true,title:true}).get();
  })
  .then(data=>{
    var products = data.data;
    for (var i = 0; i < carts.length; i++) {
      var c = carts[i];
      for (var j = 0; j < products.length; j++) {
        var product = products[j];
        if (c.sku.product_id == product._id) {
          c.sku.product = product;
          break;
        }
      }
    }
    callback(carts);
  })
}
