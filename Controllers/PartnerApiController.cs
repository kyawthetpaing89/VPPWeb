using VPPModel;
using System.Web.Http;
using Partner_BL;

namespace VPPWeb.Controllers
{
    public class PartnerApiController : ApiController
    {
        [UserAuthentication]
        [HttpPost]
        public string GetVIPPartnerLoginCheck([FromBody] PartnerModel partnerModel)
        {
            PartnerBL partnerBL = new PartnerBL();
            return partnerBL.Partner_LoginCheck(partnerModel);
        }
    }
}
