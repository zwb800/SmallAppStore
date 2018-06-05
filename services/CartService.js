module.exports.delete = function (userid, skuid, callback) {
  module.exports.request("deleteCart",{userid:userid,skuid:skuid},callback);
}

module.exports.update = function (userid, skuid, count, callback) {
  module.exports.request("updatecart", { userid: userid, skuid: skuid ,count:count}, callback);
}

module.exports.get = function (userid, callback) {
  module.exports.request("cart", { userid: userid }, callback);
}

module.exports.add = function (userid, skuid, callback) {
  module.exports.request("addcart", { userid: userid, skuid: skuid }, callback);
}

module.exports.request = function(url,data,callback)
{
  wx.request({
    url: getApp().host + '/cart/'+url,
    data:data,
    success: function (data) {
      if (callback)
        callback(data.data);
    }
  });

}
