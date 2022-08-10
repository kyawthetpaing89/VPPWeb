using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using VPPModel;
using MarketingAssets_BL;

namespace VPPWeb.Controllers
{
    public class MarketingAssetsApiController : ApiController
    {
        [UserAuthentication]
        [HttpPost]
        public string GetVideos([FromBody] VideoModel videoModel)
        {
            MarketingAssetsBL marketingAssetsBL = new MarketingAssetsBL();
            return marketingAssetsBL.Videos_Select(videoModel);
        }
    }
}
