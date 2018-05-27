var ProductService = require('../../services/ProductService.js');


Page({
  data: {
    productList : null,
  },
  onLoad: function () {
    var $this = this;
    ProductService.getList(function(data){
      $this.setData({ productList:data});
    });
  },
})
