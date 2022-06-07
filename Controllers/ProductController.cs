using Newtonsoft.Json;
using System;
using System.Web.Mvc;
using VPPModel;
using Product_BL;
using System.IO;
using ErrorLog_BL;
using Message_BL;

namespace VPPWeb.Controllers
{
    public class ProductController : Controller
    {
        // GET: Product
        public ActionResult ProductList()
        {
            return View();
        }

        [HttpPost]
        public string Product_CUD()
        {
            string j1 = HttpContext.Request.Params.Get("ProductModel");
            ProductModel productModel = JsonConvert.DeserializeObject<ProductModel>(j1);
            try
            {        
                ProductBL productBL = new ProductBL();

                if (productModel.Mode.Equals("New"))
                {
                    productModel.ProductID = productBL.GenerateProductID(productModel);
                }

                for (int i = 0; i < Request.Files.Count; i++)
                {
                    string key = Request.Files.GetKey(i);
                    if (key == "product")
                    {
                        productModel.ProductPhoto = "DLinkProduct/" + productModel.ProductID + DateTime.Now.ToString("yyyyMMddhhmmss") + ".jpg";

                        if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + productModel.ProductPhoto)))
                            System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + productModel.ProductPhoto));

                        Request.Files[i].SaveAs(Path.Combine(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/"), productModel.ProductPhoto));
                    }
                }

                return productBL.Product_CUD(productModel);
            }
            catch (Exception exception)
            {
                ErrorLogModel errorLogModel = new ErrorLogModel
                {
                    ErrorMessage = exception.Message,
                    UpdatedBy = productModel.UpdatedBy
                };

                ErrorLogBL errorLogBL = new ErrorLogBL();
                errorLogBL.ErrorLog_Insert(errorLogModel);

                MessageBL messageBL = new MessageBL();
                MessageModel messageModel = new MessageModel
                {
                    MessageID = "E007"
                };
                return messageBL.Message_Select(messageModel);
            }
        }
    }
}