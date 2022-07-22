using System;
using VPPModel;
using System.Web.Mvc;
using Newtonsoft.Json;
using Country_BL;
using System.IO;
using ErrorLog_BL;
using Message_BL;

namespace VPPWeb.Controllers
{
    public class CountryController : Controller
    {
        // GET: Country
        public ActionResult BannerPhotoListing()
        {
            return View();
        }

        [HttpPost]
        public string CountryPhoto_Update()
        {
            string j1 = HttpContext.Request.Params.Get("CountryModel");
            CountryModel countryModel = JsonConvert.DeserializeObject<CountryModel>(j1);
            try
            {
                CountryBL countryBL = new CountryBL();

                for (int i = 0; i < Request.Files.Count; i++)
                {
                    string key = Request.Files.GetKey(i);
                    if (key == "banner1")
                    {
                        if (!string.IsNullOrWhiteSpace(countryModel.Bannerphoto1))
                        {
                            if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + countryModel.Bannerphoto1)))
                                System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + countryModel.Bannerphoto1));
                        }

                        countryModel.Bannerphoto1 = "BannerPhotos/" + countryModel.CountryID + "_banner1_"  + DateTime.Now.ToString("yyyyMMddhhmmss") + ".jpg";
                        Request.Files[i].SaveAs(Path.Combine(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/"), countryModel.Bannerphoto1));
                    }
                    else if (key == "banner2")
                    {
                        if (!string.IsNullOrWhiteSpace(countryModel.Bannerphoto2))
                        {
                            if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + countryModel.Bannerphoto2)))
                                System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + countryModel.Bannerphoto2));
                        }

                        countryModel.Bannerphoto2 = "BannerPhotos/" + countryModel.CountryID + "_banner2_" + DateTime.Now.ToString("yyyyMMddhhmmss") + ".jpg";
                       
                        Request.Files[i].SaveAs(Path.Combine(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/"), countryModel.Bannerphoto2));
                    }
                    else if (key == "banner3")
                    {
                        if (!string.IsNullOrWhiteSpace(countryModel.Bannerphoto3))
                        {
                            if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + countryModel.Bannerphoto3)))
                                System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + countryModel.Bannerphoto3));
                        }

                        countryModel.Bannerphoto3 = "BannerPhotos/" + countryModel.CountryID + "_banner3_" + DateTime.Now.ToString("yyyyMMddhhmmss") + ".jpg";

                        Request.Files[i].SaveAs(Path.Combine(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/"), countryModel.Bannerphoto3));
                    }
                    else if (key == "banner4")
                    {
                        if (!string.IsNullOrWhiteSpace(countryModel.Bannerphoto4))
                        {
                            if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + countryModel.Bannerphoto4)))
                                System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + countryModel.Bannerphoto4));
                        }

                        countryModel.Bannerphoto4 = "BannerPhotos/" + countryModel.CountryID + "_banner4_" + DateTime.Now.ToString("yyyyMMddhhmmss") + ".jpg";
                        Request.Files[i].SaveAs(Path.Combine(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/"), countryModel.Bannerphoto4));
                    }
                    else if (key == "banner5")
                    {
                        if (!string.IsNullOrWhiteSpace(countryModel.Bannerphoto5))
                        {
                            if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + countryModel.Bannerphoto5)))
                                System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + countryModel.Bannerphoto5));
                        }

                        countryModel.Bannerphoto5 = "BannerPhotos/" + countryModel.CountryID + "_banner5_" + DateTime.Now.ToString("yyyyMMddhhmmss") + ".jpg";

                        Request.Files[i].SaveAs(Path.Combine(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/"), countryModel.Bannerphoto5));
                    }
                    else if (key == "banner6")
                    {
                        if (!string.IsNullOrWhiteSpace(countryModel.Bannerphoto6))
                        {
                            if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + countryModel.Bannerphoto6)))
                                System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + countryModel.Bannerphoto6));

                        }
                        countryModel.Bannerphoto6 = "BannerPhotos/" + countryModel.CountryID + "_banner6_" + DateTime.Now.ToString("yyyyMMddhhmmss") + ".jpg";
                        
                        Request.Files[i].SaveAs(Path.Combine(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/"), countryModel.Bannerphoto6));
                    }
                    else if (key == "footer1")
                    {
                        if (!string.IsNullOrWhiteSpace(countryModel.Footerphoto1))
                        {
                            if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + countryModel.Footerphoto1)))
                                System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + countryModel.Footerphoto1));
                        }

                        countryModel.Footerphoto1 = "BannerPhotos/" + countryModel.CountryID + "_footer1_" + DateTime.Now.ToString("yyyyMMddhhmmss") + ".jpg";
                        Request.Files[i].SaveAs(Path.Combine(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/"), countryModel.Footerphoto1));
                    }
                }

                return countryBL.CountryPhoto_Update(countryModel);
            }
            catch (Exception exception)
            {
                ErrorLogModel errorLogModel = new ErrorLogModel
                {
                    ErrorMessage = exception.Message,
                    UpdatedBy = countryModel.UpdatedBy
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

        public ActionResult CountryPageFooter()
        {
            return View();
        }

        public ActionResult BannerListing()
        {
            return View();
        }
    }
}