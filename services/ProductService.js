
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
module.exports.confirm = function (skuid, callback) {
  const db = wx.cloud.database();
  db.collection("skus").where({ _id:db.command.in( skuid.split(",")) }).get({
    success: function (data) {
        callback({ skus : data.data, address: {} });
    }
  });
}
module.exports.get = function(id,callback){
  const db = wx.cloud.database();


  db.collection("Product").doc(id).get({
    success: function (data) {
      db.collection("skus").where({ product_id: id}).get({success:function(sku){
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