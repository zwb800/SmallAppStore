module.exports.get = function (userid, callback) {
  module.exports.request("index", { }, callback);
}

module.exports.request = function (url, data, callback) {

  data.userid = getApp().userid;
  wx.request({
    url: getApp().host + '/user/' + url,
    data: data,
    success: function (data) {
      if (callback)
        callback(data.data);
    }
  });

}