// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {


  return db.collection("Product").doc(event.id).get()
    .then(data => {
      product = data.data;
      return db.collection("Sku").where({ product_id: data.data._id }).get();
    })
    .then(sku => {
      product.skus = sku.data;
      return product;
    });
}