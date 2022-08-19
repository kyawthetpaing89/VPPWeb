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
using System.Net;
using System.Net.Mail;
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

        public ActionResult PartnerLoginFrequent()
        {
            return View();
        }

        [HttpPost]
        public string CheckRevisePartnerImport()
        {
            MessageBL messageBL = new MessageBL();
            PartnerModel partnerModel = new PartnerModel();
            if (Request.Files["VipPartnerReviseUpload"].FileName.EndsWith(".xlsx"))
            {
                Stream stream = Request.Files["VipPartnerReviseUpload"].InputStream;

                CommonFunction commonFunction = new CommonFunction();
                DataTable csvTable = commonFunction.ExceltoDatatable(stream);

                if (!csvTable.Columns.Contains("Register_No") || !csvTable.Columns.Contains("Company_Name") ||                  
                    !csvTable.Columns.Contains("FirstName") || !csvTable.Columns.Contains("LastName") ||
                    !csvTable.Columns.Contains("Phone") || !csvTable.Columns.Contains("Email") ||
                    !csvTable.Columns.Contains("Date_Of_Event") || !csvTable.Columns.Contains("DSS_EventCode") ||
                    !csvTable.Columns.Contains("EventName") || !csvTable.Columns.Contains("Country2") ||
                    !csvTable.Columns.Contains("RewardPoints"))
                {
                    MessageModel messageModel = new MessageModel
                    {
                        MessageID = "E015"
                    };
                    return messageBL.Message_Select(messageModel);
                }

                partnerModel.ReviseImportJson = commonFunction.DataTableToJSONWithJSONNet(csvTable);

                PartnerBL partnerBL = new PartnerBL();

                return partnerBL.CheckRevisePartnerImport(partnerModel);
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

        [HttpPost]
        public string PartnerReviseImportConfirm()
        {
            MessageBL messageBL = new MessageBL();
            string j1 = HttpContext.Request.Params.Get("PartnerModel");
            PartnerModel partnerModel = JsonConvert.DeserializeObject<PartnerModel>(j1);

            try
            {
                if (Request.Files["VipPartnerReviseUpload"].FileName.EndsWith(".xlsx"))
                {
                    Stream stream = Request.Files["VipPartnerReviseUpload"].InputStream;
                    CommonFunction commonFunction = new CommonFunction();
                    DataTable csvTable = commonFunction.ExceltoDatatable(stream);

                    partnerModel.FileName = Request.Files["VipPartnerReviseUpload"].FileName;
                    partnerModel.ReviseImportJson = commonFunction.DataTableToJSONWithJSONNet(csvTable);

                    PartnerBL partnerBL = new PartnerBL();

                    partnerBL.Partner_ReviseImportConfirm(partnerModel);

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

        private string CreateRandomPassword(int length = 15)
        {
            // Create a string of characters, numbers, special characters that allowed in the password  
            string validChars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*?_-";
            Random random = new Random();

            // Select one random character at a time from the string  
            // and create an array of chars  
            char[] chars = new char[length];
            for (int i = 0; i < length; i++)
            {
                chars[i] = validChars[random.Next(0, validChars.Length)];
            }
            return new string(chars);
        }

        //public string SendWelcomeMail()
        //{
        //    MessageBL messageBL = new MessageBL();
        //    string j1 = HttpContext.Request.Params.Get("PartnerModel");
        //    PartnerModel partnerModel = JsonConvert.DeserializeObject<PartnerModel>(j1);
        //    try
        //    {
        //        PartnerBL partnerBL = new PartnerBL();
        //        DataTable dtPartner = partnerBL.VIPPartner_SelectDT(partnerModel);

        //        DataTable dtPartnerAfterMail = new DataTable();
        //        dtPartnerAfterMail.Columns.Add("Register_No");
        //        dtPartnerAfterMail.Columns.Add("LoginPassword");
        //        dtPartnerAfterMail.Columns.Add("WelcomeMail");

        //        for (int i = 0; i < dtPartner.Rows.Count; i++)
        //        {
        //            try
        //            {
        //                MailMessage mail = new MailMessage();
        //                SmtpClient SmtpServer = new SmtpClient();
        //                //mail.From = new MailAddress("kyawthetpaing.mm@gmail.com");
        //                mail.From = new MailAddress("dlinkvip@gmail.com");
        //                mail.IsBodyHtml = true;
        //                mail.To.Add(dtPartner.Rows[i]["Email"].ToString());
        //                mail.Subject = "Welcome aboard | D-Link Registered Partner Rewards Program";
        //                string password = CreateRandomPassword(8);
        //                mail.Body = "<html><body>Dear " + dtPartner.Rows[i]["LastName"] + " " + dtPartner.Rows[i]["FirstName"] + "" + ",<br/>"
        //                    + "&emsp;&emsp;Thank you so much for joining D-Link Registered Partner Rewards Program! We’re so excited to have you on board and can’t wait to get to know and serve you.<br/><br/>"
        //                    + "&emsp;&emsp;We invite you to log in at http://viplogin.dlink.com.sg:88/VipPartner and access the exclusive, members-only resources.<br/><br/>"
        //                    + "&emsp;&emsp;For security reason, please change the default password.</p><br/>"
        //                    + "&emsp;&emsp;Login Name: " + dtPartner.Rows[i]["Email"] + "<br/>"
        //                    + "&emsp;&emsp;Default Password: " + password + "<br/><br/>"
        //                    + "&emsp;&emsp;Should you need any assistance or have questions, feel free to contact us.<br/><br/>"
        //                    + "&emsp;&emsp;Thank you for being a part of D-Link Registered Partner family.<br/><br/>"
        //                    + "&emsp;&emsp;Best Regards,<br/><br/>"
        //                    + "&emsp;&emsp;Jacky Chang<br/>"
        //                    + "&emsp;&emsp;President of D-Link ASEAN"
        //                    + "</body></html>";
        //                SmtpServer.UseDefaultCredentials = false;
        //                //NetworkCredential NetworkCred = new NetworkCredential("kyawthetpaing.mm@gmail.com", "pjeqdhmncmktuatd");
        //                NetworkCredential NetworkCred = new NetworkCredential("dlinkvip@gmail.com", "vfgzvvdmfdmsdgxn");
        //                SmtpServer.Credentials = NetworkCred;
        //                SmtpServer.EnableSsl = true;
        //                SmtpServer.Port = 587;
        //                SmtpServer.Host = "smtp.gmail.com";
        //                SmtpServer.Send(mail);

        //                dtPartnerAfterMail.Rows.Add();
        //                dtPartnerAfterMail.Rows[i]["Register_No"] = dtPartner.Rows[i]["Register_No"].ToString();
        //                dtPartnerAfterMail.Rows[i]["LoginPassword"] = password;
        //                dtPartnerAfterMail.Rows[i]["WelcomeMail"] = "1";

        //            }
        //            catch (Exception)
        //            {
        //                dtPartnerAfterMail.Rows.Add();
        //                dtPartnerAfterMail.Rows[i]["Register_No"] = dtPartner.Rows[i]["Register_No"].ToString();
        //                dtPartnerAfterMail.Rows[i]["LoginPassword"] = "";
        //                dtPartnerAfterMail.Rows[i]["WelcomeMail"] = "2";
        //            }
        //        }

        //        CommonFunction commonFunction = new CommonFunction();           

        //        partnerModel.ImportJson = commonFunction.DataTableToJSONWithJSONNet(dtPartnerAfterMail);

        //        partnerBL.PartnerRegister_AfterWelcomeMail(partnerModel);

        //        MessageModel messageModel = new MessageModel
        //        {
        //            MessageID = "I008"
        //        };
        //        return messageBL.Message_Select(messageModel);
        //    }
        //    catch (Exception exception)
        //    {
        //        ErrorLogModel errorLogModel = new ErrorLogModel
        //        {
        //            ErrorMessage = exception.Message,
        //            UpdatedBy = partnerModel.UpdatedBy
        //        };

        //        ErrorLogBL errorLogBL = new ErrorLogBL();
        //        errorLogBL.ErrorLog_Insert(errorLogModel);

        //        MessageModel messageModel = new MessageModel
        //        {
        //            MessageID = "E018"
        //        };
        //        return messageBL.Message_Select(messageModel);
        //    }        
        //}
    }
}