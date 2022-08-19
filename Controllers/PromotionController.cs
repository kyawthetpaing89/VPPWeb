using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VPPModel;
using Promotion_BL;
using Newtonsoft.Json;
using System.IO;
using ErrorLog_BL;
using Message_BL;

namespace VPPWeb.Controllers
{
    public class PromotionController : Controller
    {
        // GET: Promotion
        public ActionResult PromotionListing()
        {
            return View();
        }

        [HttpPost]
        public string Promotion_CUD()
        {
            string j1 = HttpContext.Request.Params.Get("PromotionModel");
            PromotionModel promotionModel = JsonConvert.DeserializeObject<PromotionModel>(j1);
            try
            {
                PromotionBL PromotionBL = new PromotionBL();

                if (promotionModel.Mode.Equals("New"))
                {
                    promotionModel.PromotionCode = PromotionBL.GeneratePromotionCode(promotionModel);
                }

                if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + promotionModel.PromotionRemove)))
                    System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + promotionModel.PromotionRemove));

                for (int i = 0; i < Request.Files.Count; i++)
                {
                    string key = Request.Files.GetKey(i);
                    if (key == "promotion")
                    {
                        if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + promotionModel.PromotionImage)))
                            System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + promotionModel.PromotionImage));

                        promotionModel.PromotionImage = "Promotion/" + promotionModel.PromotionCode + '_' + DateTime.Now.ToString("yyyymmddhhmmss") + Path.GetExtension(Request.Files[i].FileName);
                        promotionModel.PromotionImageName = Request.Files[i].FileName;

                        Request.Files[i].SaveAs(Path.Combine(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/"), promotionModel.PromotionImage));
                    }
                }

                return PromotionBL.Promotion_CUD(promotionModel);
            }
            catch (Exception exception)
            {
                ErrorLogModel errorLogModel = new ErrorLogModel
                {
                    ErrorMessage = exception.Message,
                    UpdatedBy = promotionModel.UpdatedBy
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