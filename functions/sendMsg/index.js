// 云函数入口文件
const cloud = require('wx-server-sdk')
const urllib = require('urllib');

cloud.init()

const db = cloud.database();

const URL_ACCESS_TOKEN = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxd386c7dc2ba5ab39&secret=5068dce882d9eb962bdeb1fd0ad32d33"

const SEND_MESSAGE = "https://api.weixin.qq.com/cgi-bin/message/wxopen/template/uniform_send?access_token="

// 云函数入口函数
exports.main = async (event, context) => {
  // return 

  const access_token = await this.getAccessToken();

  return urllib.request(SEND_MESSAGE + access_token, {
    method: "POST",
    dataType: "json",
    contentType: "json",
    data: event.message
  })
}

exports.getAccessToken = async()=> {

  let data = await db.collection("AccessToken").get()
  var accessToken = ""
  if (data.data.length == 0) {
    var dataNew = await this.getNewAccessToken()
    await db.collection("AccessToken").add({
      data: dataNew
    })

    accessToken = dataNew.access_token;
  }
  else {
    if (data.data[0].expires_time < Date.now()) {
      var dataNew = await this.getNewAccessToken()
      await db.collection("AccessToken").doc(data.data._id).update({
        data: dataNew
      })

      accessToken = dataNew.access_token;
    } else {
      accessToken = data.data[0].access_token;
    }

  }

  return accessToken;
}

exports.getNewAccessToken = async()=>{
  var dataNew = (await urllib.request(URL_ACCESS_TOKEN, { dataType: "json" })).data
  dataNew.expires_time = Date.now() + (dataNew.expires_in * 1000)
  return dataNew
}