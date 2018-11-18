// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var product = (await db.collection("Product").doc(event.id).get()).data;
  product.skus = (await db.collection("Sku").where({ product_id: product._id }).get()).data;
  return product;
}