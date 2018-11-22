// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var product = event.product;

  var newP = {
    name: product.name,
    title: product.title,
    price: product.price,
    img: product.img,
    detail: product.detail,
    imgs: product.imgs,
  };
  
  if(product._id)
  {

    await db.collection("Product").doc(product._id).update({
      data: newP
    })

    for (var i = 0; i < 10; i++) {
      var skuname = product["sku_name_" + i];
      if (skuname) {
        await db.collection("Sku").doc(product["sku_id_" + i]).update({
          data: {
            name: skuname,
            price: product["sku_price_" + i],
          }
        })
      }
      else
        break;
    }
  }
  else
  {
    var newproduct = await db.collection("Product").add({
      data: {
        name: product.name,
        title: product.title,
        price: product.price,
        img: product.img,
        detail: product.detail,
        imgs: product.imgs,
      }
    });

    for (var i = 0; i < 10; i++) {
      var skuname = product["sku_name_" + i];
      if (skuname) {
        await db.collection("Sku").add({
          data: {
            name: skuname,
            price: product["sku_price_" + i],
            product_id: newproduct._id
          }
        })
      }
      else
        break;
    }
  }
  
}