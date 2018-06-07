module.exports.delete = function ( skuid, callback) {
  module.exports.request("deleteCart",{skuid:skuid},callback);
}

module.exports.update = function ( skuid, count, callback) {
  module.exports.request("updatecart", { skuid: skuid ,count:count}, callback);
}

module.exports.get = function ( callback) {
  module.exports.request("cart", {  }, callback);
}

module.exports.add = function ( skuid, callback) {
  module.exports.request("addcart", { skuid: skuid }, callback);
}

module.exports.request = function(url,data,callback)
{
  data.userid = getApp().userid;
  wx.request({
    url: getApp().host + '/cart/'+url,
    data:data,
    success: function (data) {
      if (callback)
        callback(data.data);
    }
  });

}
