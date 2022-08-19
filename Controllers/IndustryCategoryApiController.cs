using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using VPPModel;
using IndustryCategory_BL;

namespace VPPWeb.Controllers
{
    public class IndustryCategoryApiController : ApiController
    {
        [UserAuthentication]
        [HttpPost]
        public string GetIndustryCategory([FromBody] IndustryCategoryModel industryCategoryModel)
        {
            IndustryCategoryBL industryCategoryBL = new IndustryCategoryBL();
            return industryCategoryBL.IndustryCategory_Select(industryCategoryModel);
        }
    }
}
