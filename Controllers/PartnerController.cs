using CKM_CommonFunction;
using ClosedXML.Excel;
using ErrorLog_BL;
using Message_BL;
using Newtonsoft.Json;
using Partner_BL;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VPPModel;

namespace VPPWeb.Controllers
{
    public class PartnerController : Controller
    {
        public ActionResult PartnerList()
        {
            return View();
        }

        [HttpPost]
        public string CheckStandardPartnerImport()
        {
            MessageBL messageBL = new MessageBL();
            PartnerModel partnerModel = new PartnerModel();
            if (Request.Files["VipPartnerUpload"].FileName.EndsWith(".xlsx"))
            {
                Stream stream = Request.Files["VipPartnerUpload"].InputStream;

                CommonFunction commonFunction = new CommonFunction();
                DataTable csvTable = commonFunction.ExceltoDatatable(stream);

                if (!csvTable.Columns.Contains("Register_No") || !csvTable.Columns.Contains("Company_Name") ||
                    !csvTable.Columns.Contains("Address") || !csvTable.Columns.Contains("City") ||
                    !csvTable.Columns.Contains("ZipCode") || !csvTable.Columns.Contains("Country") ||
                    !csvTable.Columns.Contains("Website") || !csvTable.Columns.Contains("Location_No") ||
                    !csvTable.Columns.Contains("Partner_Type") || !csvTable.Columns.Contains("Business_Focus") ||
                    !csvTable.Columns.Contains("EmailNoti") || !csvTable.Columns.Contains("Prefix") ||
                    !csvTable.Columns.Contains("FirstName") || !csvTable.Columns.Contains("LastName") ||
                    !csvTable.Columns.Contains("Phone") || !csvTable.Columns.Contains("Email") ||
                    !csvTable.Columns.Contains("Job_Title"))
                {
                    MessageModel messageModel = new MessageModel
                    {
                        MessageID = "E015"
                    };
                    return messageBL.Message_Select(messageModel);
                }

                partnerModel.StandardImportJson = commonFunction.DataTableToJSONWithJSONNet(csvTable);

                PartnerBL partnerBL = new PartnerBL();

                return partnerBL.CheckStandardPartnerImport(partnerModel);
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
        public string PartnerStandardImportConfirm()
        {
            MessageBL messageBL = new MessageBL();
            string j1 = HttpContext.Request.Params.Get("PartnerModel");
            PartnerModel partnerModel = JsonConvert.DeserializeObject<PartnerModel>(j1);

            try
            {
                if (Request.Files["VipPartnerUpload"].FileName.EndsWith(".xlsx"))
                {
                    Stream stream = Request.Files["VipPartnerUpload"].InputStream;
                    CommonFunction commonFunction = new CommonFunction();
                    DataTable csvTable = commonFunction.ExceltoDatatable(stream);

                    partnerModel.FileName = Request.Files["VipPartnerUpload"].FileName;
                    partnerModel.StandardImportJson = commonFunction.DataTableToJSONWithJSONNet(csvTable);

                    PartnerBL partnerBL = new PartnerBL();
                    
                    partnerBL.Partner_StandardImportConfirm(partnerModel);

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
                    UpdatedBy = partnerModel.UpdatedBy
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