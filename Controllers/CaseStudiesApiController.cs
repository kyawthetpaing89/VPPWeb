using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using VPPModel;
using CaseStudies_BL;

namespace VPPWeb.Controllers
{
    public class CaseStudiesApiController : ApiController
    {
        [UserAuthentication]
        [HttpPost]
        public string GetCaseStudies([FromBody] CaseStudiesModel caseStudiesModel)
        {
            CaseStudiesBL caseStudiesBL = new CaseStudiesBL();
            return caseStudiesBL.CaseStudies_Select(caseStudiesModel);
        }
    }
}
