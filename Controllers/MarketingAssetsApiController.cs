using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using VPPModel;
using Videos_BL;
using DigitalLibrary_BL;
using MarketingDocumentType_BL;
using MarketingProductCategory_BL;

namespace VPPWeb.Controllers
{
    public class MarketingAssetsApiController : ApiController
    {
        [UserAuthentication]
        [HttpPost]
        public string GetVideos([FromBody] VideoModel videoModel)
        {
            VideosBL videosBL = new VideosBL();
            return videosBL.Videos_Select(videoModel);
        }

        [UserAuthentication]
        [HttpPost]
        public string GetDigitalLibrary([FromBody] DigitalLibraryModel digitalLibraryModel)
        {
            DigitalLibraryBL digitalLibraryBL = new DigitalLibraryBL();
            return digitalLibraryBL.DigitalLibrary_Select(digitalLibraryModel);
        }

        [UserAuthentication]
        [HttpPost]
        public string GetMarketingDocumentType([FromBody] MarketingDocumentTypeModel marketingDocumentTypeModel)
        {
            MarketingDocumentTypeBL marketingDocumentTypeBL = new MarketingDocumentTypeBL();
            return marketingDocumentTypeBL.MarketingDocumentType_Select(marketingDocumentTypeModel);
        }

        [UserAuthentication]
        [HttpPost]
        public string GetMarketingProductCategory([FromBody] MarketingProductCategoryModel marketingProductCategoryModel)
        {
            MarketingProductCategoryBL marketingProductCategoryBL = new MarketingProductCategoryBL();
            return marketingProductCategoryBL.MarketingProductCategory_Select(marketingProductCategoryModel);
        }
    }
}
