using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Promotion_BL;
using VPPModel;

namespace VPPWeb.Controllers
{
    public class PromotionApiController : ApiController
    {
        [UserAuthentication]
        [HttpPost]
        public string GetPromotion([FromBody] PromotionModel promotionModel)
        {
            PromotionBL promotionBL = new PromotionBL();
            return promotionBL.Promotion_Select(promotionModel);
        }
    }
}
