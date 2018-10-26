module.exports.get = function (skip,take,callback) {
  wx.cloud.callFunction({
    name:"getOrder",
    data:{
      skip:skip,
      take:take
    }
  }).then(data=>{
    callback(data.result)
  })
}
