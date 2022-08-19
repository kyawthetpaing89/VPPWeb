using DigitalLibrary_BL;
using ErrorLog_BL;
using Message_BL;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VPPModel;
using CaseStudies_BL;

namespace VPPWeb.Controllers
{
    public class CaseStudiesController : Controller
    {
        // GET: CaseStudies
        public ActionResult CaseStudiesListing()
        {
            return View();
        }

        [HttpPost]
        public string CaseStudies_CUD()
        {
            string j1 = HttpContext.Request.Params.Get("CaseStudiesModel");
            CaseStudiesModel caseStudiesModel = JsonConvert.DeserializeObject<CaseStudiesModel>(j1);
            try
            {
                CaseStudiesBL caseStudiesBL = new CaseStudiesBL();

                if (caseStudiesModel.Mode.Equals("New"))
                {
                    caseStudiesModel.CaseStudiesCode = caseStudiesBL.GenerateCaseStudiesCode(caseStudiesModel);
                }

                if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + caseStudiesModel.ThumbnailRemove)))
                    System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + caseStudiesModel.ThumbnailRemove));

                if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + caseStudiesModel.ResourceRemove)))
                    System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + caseStudiesModel.ResourceRemove));

                for (int i = 0; i < Request.Files.Count; i++)
                {
                    string key = Request.Files.GetKey(i);
                    if (key == "resource")
                    {
                        if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + caseStudiesModel.ThumbnailImage)))
                            System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + caseStudiesModel.ThumbnailImage));

                        caseStudiesModel.ResourceFile = "CaseStudies/Resource/" + caseStudiesModel.CaseStudiesCode + '_' + DateTime.Now.ToString("yyyymmddhhmmss") + Path.GetExtension(Request.Files[i].FileName);
                        caseStudiesModel.ResourceFileName = Request.Files[i].FileName;

                        Request.Files[i].SaveAs(Path.Combine(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/"), caseStudiesModel.ResourceFile));
                    }

                    if (key == "thumbnail")
                    {
                        if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + caseStudiesModel.ThumbnailImage)))
                            System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + caseStudiesModel.ThumbnailImage));

                        caseStudiesModel.ThumbnailImage = "CaseStudies/Thumbnail/" + caseStudiesModel.CaseStudiesCode + '_' + DateTime.Now.ToString("yyyymmddhhmmss") + Path.GetExtension(Request.Files[i].FileName);
                        caseStudiesModel.ThumbnailImageName = Request.Files[i].FileName;

                        Request.Files[i].SaveAs(Path.Combine(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/"), caseStudiesModel.ThumbnailImage));
                    }
                }

                return caseStudiesBL.Casestudies_CUD(caseStudiesModel);
            }
            catch (Exception exception)
            {
                ErrorLogModel errorLogModel = new ErrorLogModel
                {
                    ErrorMessage = exception.Message,
                    UpdatedBy = caseStudiesModel.UpdatedBy
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