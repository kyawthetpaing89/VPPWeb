using Newtonsoft.Json;
using System;
using System.Web.Mvc;
using VPPModel;
using Reward_BL;
using System.IO;
using ErrorLog_BL;
using Message_BL;
using System.Data;
using LumenWorks.Framework.IO.Csv;
using CKM_CommonFunction;

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

                if (!string.IsNullOrEmpty(rewardPrizeModel.RemoveProductPhoto))
                {
                    if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + rewardPrizeModel.RemoveProductPhoto)))
                        System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + rewardPrizeModel.RemoveProductPhoto));
                }

                if (!string.IsNullOrEmpty(rewardPrizeModel.RemoveQuotationPhoto))
                {
                    if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + rewardPrizeModel.RemoveQuotationPhoto)))
                        System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + rewardPrizeModel.RemoveQuotationPhoto));
                }

                for (int i = 0; i < Request.Files.Count; i++)
                {
                    string key = Request.Files.GetKey(i);
                    if (key == "product")
                    {

                        if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + rewardPrizeModel.ProductPhoto)))
                            System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + rewardPrizeModel.ProductPhoto));

                        rewardPrizeModel.ProductPhoto = "Product/" + rewardPrizeModel.ItemCode + DateTime.Now.ToString("yyyyMMddhhmmss") + ".jpg";

                        Request.Files[i].SaveAs(Path.Combine(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/"), rewardPrizeModel.ProductPhoto));
                    }
                    else if (key == "quotation")
                    {
                        if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + rewardPrizeModel.QuotationPhoto)))
                            System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + rewardPrizeModel.QuotationPhoto));

                        rewardPrizeModel.QuotationPhoto = "Quotation/" + rewardPrizeModel.ItemCode + DateTime.Now.ToString("yyyyMMddhhmmss") + ".jpg";

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
                MessageModel messageModel = new MessageModel
                {
                    MessageID = "E007"
                };
                return messageBL.Message_Select(messageModel);
            }
        }

        [HttpPost]
        public string CheckRewardImport()
        {
            MessageBL messageBL = new MessageBL();
            string j1 = HttpContext.Request.Params.Get("RewardPrizeModel");
            RewardPrizeModel rewardPrizeModel = JsonConvert.DeserializeObject<RewardPrizeModel>(j1);

            if (Request.Files["rewardprizeupload"].FileName.EndsWith(".csv"))
            {
                Stream stream = Request.Files["rewardprizeupload"].InputStream;
                DataTable csvTable = new DataTable();
                using (CsvReader csvReader =
                    new CsvReader(new StreamReader(stream), true))
                {
                    csvTable.Load(csvReader);
                }

                if (!csvTable.Columns.Contains("Country") || !csvTable.Columns.Contains("Category") ||
                    !csvTable.Columns.Contains("ProductName") || !csvTable.Columns.Contains("RewardPointsRequired") ||
                    !csvTable.Columns.Contains("ValidTill") || !csvTable.Columns.Contains("PageType") ||
                    !csvTable.Columns.Contains("ExternalURL") || !csvTable.Columns.Contains("ProductDescriptions") ||
                    !csvTable.Columns.Contains("UnitCost") || !csvTable.Columns.Contains("Supplier"))
                {
                    MessageModel messageModel = new MessageModel
                    {
                        MessageID = "E015"
                    };
                    return messageBL.Message_Select(messageModel);
                }

                CommonFunction commonFunction = new CommonFunction();
                rewardPrizeModel.ImportJson = commonFunction.DataTableToJSONWithJSONNet(csvTable);

                RewardBL rewardBL = new RewardBL();

                return rewardBL.CheckRewardPrizeImport(rewardPrizeModel);
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
        public string RewardImportConfirm()
        {
            MessageBL messageBL = new MessageBL();
            string j1 = HttpContext.Request.Params.Get("RewardPrizeModel");
            RewardPrizeModel rewardPrizeModel = JsonConvert.DeserializeObject<RewardPrizeModel>(j1);

            try
            {
                if (Request.Files["rewardprizeupload"].FileName.EndsWith(".csv"))
                {
                    Stream stream = Request.Files["rewardprizeupload"].InputStream;
                    DataTable csvTable = new DataTable();
                    using (CsvReader csvReader =
                        new CsvReader(new StreamReader(stream), true))
                    {
                        csvTable.Load(csvReader);
                    }

                    CommonFunction commonFunction = new CommonFunction();
                    rewardPrizeModel.FileName = Request.Files["rewardprizeupload"].FileName;
                    rewardPrizeModel.ImportJson = commonFunction.DataTableToJSONWithJSONNet(csvTable);

                    RewardBL rewardBL = new RewardBL();
                    rewardBL.RewardPrize_ImportConfirm(rewardPrizeModel);

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
            catch(Exception exception)
            {
                ErrorLogModel errorLogModel = new ErrorLogModel
                {
                    ErrorMessage = exception.Message,
                    UpdatedBy = rewardPrizeModel.UpdatedBy
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