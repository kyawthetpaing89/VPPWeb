using VPPModel;
using System.Web.Http;
using Partner_BL;

namespace VPPWeb.Controllers
{
    public class PartnerApiController : ApiController
    {
        [UserAuthentication]
        [HttpPost]
        public string GetVIPPartner([FromBody] PartnerModel partnerModel)
        {
            PartnerBL partnerBL = new PartnerBL();
            return partnerBL.VIPPartner_Select(partnerModel);
        }

        
        [UserAuthentication]
        [HttpPost]
        public string GetPartnerLoginLog([FromBody] PartnerModel partnerModel)
        {
            PartnerBL partnerBL = new PartnerBL();
            return partnerBL.PartnerRegister_LoginFrequentSelect(partnerModel);
        }
        [UserAuthentication]
        [HttpPost]
        public string GetPartnerLoginLogDetail([FromBody] PartnerModel partnerModel)
        {
            PartnerBL partnerBL = new PartnerBL();
            return partnerBL.LogPartnerLogin_Select(partnerModel);
        }

        
    }
}
