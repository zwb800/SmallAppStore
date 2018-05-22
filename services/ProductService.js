
module.exports.getList = function (callback){
  
wx.request({
  url: getApp().host +'/product/',
  success:function(data){
    
    if(callback)
      callback(data);
  },
})

 var  data = [
    { id: 1, name: '红心火龙果', price: 45.9, img: 'https://img10.360buyimg.com/n7/jfs/t3118/197/229364904/200600/37296076/57ab28ceNf76fe40f.jpg' },
    { id: 2, name: '芒果', price: 34.9, img: 'https://img10.360buyimg.com/n7/jfs/t3832/361/3992685655/451734/4d12e581/58a6bfa1N56a8232f.jpg' },
    { id: 3, name: '脐橙', price: 59.9, img: 'https://img10.360buyimg.com/n7/jfs/t17740/327/925846464/279298/4e2c0a11/5ab0d753N246cf77e.jpg' },
    { id: 4, name: '草莓', price: 39.9, img: 'https://img11.360buyimg.com/n7/jfs/t15994/184/2167604929/554815/b4f234/5a93bd8cN7f388e57.jpg' },
    { id: 5, name: '百香果', price: 24.9, img: 'https://img12.360buyimg.com/n7/jfs/t13057/81/825407133/1439835/58674273/5a14e701N139506ac.jpg' },
    {
      id: 6, name: '香梨', title: '爱奇果 新疆库尔勒香梨 总重量约2.5kg 精选特级大果 新鲜水果', price: 34.9,
      skus: [{ id: 1, name: "1kg" }, { id: 2, name: "3kg" }],
      detail: 'https://img11.360buyimg.com/cms/jfs/t9133/17/896207706/99566/2a3cdabe/59b0aa16Nbdff4c7e.jpg', img: 'https://img11.360buyimg.com/n7/jfs/t8212/335/867296173/346941/42857e6f/59b0afceNd7a1adfa.jpg', imgs: ['https://img11.360buyimg.com/n1/jfs/t8938/30/873811715/423513/cea961e0/59b0afd9Nbbdc5f09.jpg', 'https://img11.360buyimg.com/n1/jfs/t7972/286/2511692290/402163/9c3f34c2/59b0afddN9dabe22c.jpg', 'https://img11.360buyimg.com/n1/jfs/t7399/265/2507137150/453229/dbe9e1cf/59b0afe0Nfbe8f936.jpg']
    },
  ];
}

