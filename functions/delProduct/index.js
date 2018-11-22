// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  
    
  var sku = (await db.collection("Sku").where({product_id:event.id}).field({_id:true}).get()).data;
  var skuids = new Array();
  for (var i = 0; i < sku.length;i++)
  {
    skuids.push(sku[i]._id);
  }
  var existsOrder = (await db.collection("OrderSku").where({ sku_id: db.command.in(skuids)}).count()).total>0

    if(!existsOrder)
    {
      await db.collection("Product").doc(event.id).remove();
      await db.collection("Sku").where({ product_id: event.id }).remove();
    }
  return !existsOrder;
}