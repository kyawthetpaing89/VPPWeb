using Newtonsoft.Json;
using System;
using System.Web.Mvc;
using VPPModel;
using Reward_BL;
using System.IO;
using ErrorLog_BL;
using Message_BL;

namespace VPPWeb.Controllers
{
    public class RewardController : Controller
    {
        public ActionResult RewardPrizeListing()
        {
            return View();
        }

        [HttpPost]
        public string RewardPrize_CUD()
        {
            string j1 = HttpContext.Request.Params.Get("RewardPrizeModel");
            RewardPrizeModel rewardPrizeModel = JsonConvert.DeserializeObject<RewardPrizeModel>(j1);
            try
            {
                RewardBL reward_BL = new RewardBL();

                for (int i = 0; i < Request.Files.Count; i++)
                {
                    string key = Request.Files.GetKey(i);
                    if (key == "product")
                    {
                        rewardPrizeModel.ProductPhoto = "Product/" + rewardPrizeModel.ItemCode + ".jpg";

                        if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + rewardPrizeModel.ProductPhoto)))
                            System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + rewardPrizeModel.ProductPhoto));

                        Request.Files[i].SaveAs(Path.Combine(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/"), rewardPrizeModel.ProductPhoto));
                    }
                    else if (key == "quotation")
                    {
                        rewardPrizeModel.QuotationPhoto = "Quotation/" + rewardPrizeModel.ItemCode + ".jpg";

                        if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + rewardPrizeModel.QuotationPhoto)))
                            System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + rewardPrizeModel.QuotationPhoto));

                        Request.Files[i].SaveAs(Path.Combine(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/"), rewardPrizeModel.QuotationPhoto));
                    }
                }

                return reward_BL.RewardPrize_CUD(rewardPrizeModel);
            }
            catch(Exception exception)
            {
                ErrorLogModel errorLogModel = new ErrorLogModel
                {
                    ErrorMessage = exception.Message,
                    UpdatedBy = rewardPrizeModel.UpdatedBy
                };

                ErrorLogBL errorLogBL = new ErrorLogBL();
                errorLogBL.ErrorLog_Insert(errorLogModel);

                MessageBL messageBL = new MessageBL();
                MessageModel messageModel = new MessageModel();
                messageModel.MessageID = "E007";
                return messageBL.Message_Select(messageModel);
            }
        }
    }
}