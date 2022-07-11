using Newtonsoft.Json;
using System;
using System.Web.Mvc;
using VPPModel;
using Product_BL;
using System.IO;
using ErrorLog_BL;
using Message_BL;
using System.Data;
using LumenWorks.Framework.IO.Csv;
using CKM_CommonFunction;

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

                if (!string.IsNullOrEmpty(productModel.RemovePhoto))
                {
                    if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + productModel.RemovePhoto)))
                        System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + productModel.RemovePhoto));
                }

                for (int i = 0; i < Request.Files.Count; i++)
                {
                    string key = Request.Files.GetKey(i);
                    if (key == "product")
                    {
                        if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + productModel.ProductPhoto)))
                            System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + productModel.ProductPhoto));

                        productModel.ProductPhoto = "DLinkProduct/" + productModel.ProductID + DateTime.Now.ToString("yyyyMMddhhmmss") + ".jpg";

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

        [HttpPost]
        public string CheckProductImport()
        {
            MessageBL messageBL = new MessageBL();
            string j1 = HttpContext.Request.Params.Get("ProductModel");
            RewardPrizeModel rewardPrizeModel = JsonConvert.DeserializeObject<RewardPrizeModel>(j1);

            if (Request.Files["productListupload"].FileName.EndsWith(".csv"))
            {
                Stream stream = Request.Files["productListupload"].InputStream;
                DataTable csvTable = new DataTable();
                using (CsvReader csvReader =
                    new CsvReader(new StreamReader(stream), true))
                {
                    csvTable.Load(csvReader);
                }

                if (!csvTable.Columns.Contains("Country")  ||
                    !csvTable.Columns.Contains("NewsName") ||
                    !csvTable.Columns.Contains("NewsUrl"))
                {
                    MessageModel messageModel = new MessageModel
                    {
                        MessageID = "E015"
                    };
                    return messageBL.Message_Select(messageModel);
                }

                CommonFunction commonFunction = new CommonFunction();
                rewardPrizeModel.ImportJson = commonFunction.DataTableToJSONWithJSONNet(csvTable);

                ProductBL productBL = new ProductBL();

                return productBL.CheckProductImport(rewardPrizeModel);
            }
            else
            {
                MessageModel messageModel = new MessageModel
                {
                    MessageID = "E014"
                };
                return messageBL.Message_Select(messageModel);
            }
        }

        [HttpPost]
        public string ProductImportConfirm()
        {
            MessageBL messageBL = new MessageBL();
            string j1 = HttpContext.Request.Params.Get("ProductModel");
            ProductModel productModel = JsonConvert.DeserializeObject<ProductModel>(j1);

            try
            {
                if (Request.Files["productListupload"].FileName.EndsWith(".csv"))
                {
                    Stream stream = Request.Files["productListupload"].InputStream;
                    DataTable csvTable = new DataTable();
                    using (CsvReader csvReader =
                        new CsvReader(new StreamReader(stream), true))
                    {
                        csvTable.Load(csvReader);
                    }

                    CommonFunction commonFunction = new CommonFunction();
                    productModel.FileName = Request.Files["productListupload"].FileName;
                    productModel.ImportJson = commonFunction.DataTableToJSONWithJSONNet(csvTable);

                    ProductBL productBL = new ProductBL();
                    productBL.Product_ImportConfirm(productModel);

                    MessageModel messageModel = new MessageModel
                    {
                        MessageID = "I006"
                    };
                    return messageBL.Message_Select(messageModel);
                }
                else
                {
                    MessageModel messageModel = new MessageModel
                    {
                        MessageID = "E014"
                    };
                    return messageBL.Message_Select(messageModel);
                }
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

                MessageModel messageModel = new MessageModel
                {
                    MessageID = "E014"
                };
                return messageBL.Message_Select(messageModel);
            }

        }
    }
}