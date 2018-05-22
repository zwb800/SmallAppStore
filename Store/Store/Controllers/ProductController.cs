using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Store.Controllers
{
    public class ProductController : Controller
    {
        StoreEntities entities = new StoreEntities();

        public ActionResult List(int page=1)
        {
            return Json(entities.Product.OrderByDescending(p=>p.Id).Skip(page-1).Take(8), JsonRequestBehavior.AllowGet);
        }
    }
}