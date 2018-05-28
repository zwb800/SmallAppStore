module.exports.get = function(userid,callback){
  wx.request({
    url: getApp().host + '/product/cart',
    data: { userid: userid },
    success: function (data) {
      if (callback)
        callback(data.data);

    }
  });

}

module.exports.add = function (userid,skuid,callback) {
  wx.request({
    url: getApp().host + '/product/addcart',
    data: { userid: userid,skuid:skuid },
    success: function (data) {
      if (callback)
        callback(data.data=="success");
    }
  });
}