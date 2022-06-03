using Import_BL;
using VPPModel;
using System.Web.Http;

namespace VPPWeb.Controllers
{
    public class ImportApiController : ApiController
    {
        [UserAuthentication]
        [HttpPost]
        public string GetImoprtLog([FromBody] ImportModel importModel)
        {
            ImportBL importBL = new ImportBL();
            return importBL.ImportLog_Select(importModel);
        }

        [UserAuthentication]
        [HttpPost]
        public string GetImportRewardPrize([FromBody] ImportModel importModel)
        {
            ImportBL importBL = new ImportBL();
            return importBL.ImportRewardPrize_Select(importModel);
        }
    }
}
