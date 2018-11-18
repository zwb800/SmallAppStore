
module.exports.get = function(id,callback){
  // const db = wx.cloud.database();

  // var product =null;
  // db.collection("Product").doc(id).get()
  // .then(data=>{
  //   product = data.data;
  //   return db.collection("Sku").where({ product_id: data.data._id }).get();
  // })
  // .then(sku=>{
  //   product.skus = sku.data;
  //   callback(product);
  // });
  // var product = (await db.collection("Product").doc(event.id).get()).data;
  // product.skus = (await db.collection("Sku").where({ product_id: product._id }).get()).data;
  // callback(product)
  wx.cloud.callFunction({
    name:"getProduct",
    data:{
      id:id
    }
  }).then(data=>{
    callback(data.result);
  })
}


module.exports.getList = function (callback){
  const db = wx.cloud.database();
  db.collection("Product").field({ price:true,img: true, title: true }).get().then(data=>{
    callback(data.data);
  });
}