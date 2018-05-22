using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StoreCore.Models;

namespace StoreCore.Controllers
{
    [Route("[controller]")]
    public class ProductController : Controller
    {
        storeContext storeContext = new storeContext();
        public IEnumerable<Product> Get(int page = 1)
        {
            return storeContext.Product.OrderByDescending(p => p.Id).Skip(page - 1).Take(8);
        }
    }
}