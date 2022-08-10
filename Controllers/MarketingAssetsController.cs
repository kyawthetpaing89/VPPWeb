using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VPPModel;
using MarketingAssets_BL;
using System.IO;
using ErrorLog_BL;
using Message_BL;
using Videos_BL;

namespace VPPWeb.Controllers
{
    public class MarketingAssetsController : Controller
    {
        // GET: MarketingAssets
        public ActionResult VideosListing()
        {
            return View();
        }

        [HttpPost]
        public string Video_CUD()
        {
            string j1 = HttpContext.Request.Params.Get("VideoModel");
            VideoModel videoModel = JsonConvert.DeserializeObject<VideoModel>(j1);
            try
            {
                VideosBL videosBL = new VideosBL();

                if (videoModel.Mode.Equals("New"))
                {
                    videoModel.VideoCode = videosBL.GenerateVideoCode(videoModel);
                }

                if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + videoModel.ThumbnailImageRemove)))
                    System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + videoModel.ThumbnailImageRemove));

                for (int i = 0; i < Request.Files.Count; i++)
                {
                    string key = Request.Files.GetKey(i);
                    if (key == "thumbnailimage")
                    {
                        if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + videoModel.ThumbnailImage)))
                            System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + videoModel.ThumbnailImage));

                        videoModel.ThumbnailImage = "MarketingAssets/Thumbnail/" + videoModel.VideoCode + '_' + DateTime.Now.ToString("yyyymmdd") + Path.GetExtension(Request.Files[i].FileName);
                        videoModel.ThumbnailImageName = Request.Files[0].FileName;

                        Request.Files[i].SaveAs(Path.Combine(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/"), videoModel.ThumbnailImage));
                    }
                }

                return videosBL.Video_CUD(videoModel);
            }
            catch (Exception exception)
            {
                ErrorLogModel errorLogModel = new ErrorLogModel
                {
                    ErrorMessage = exception.Message,
                    UpdatedBy = videoModel.UpdatedBy
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