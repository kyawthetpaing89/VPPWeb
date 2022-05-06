using VPPModel;
using System.Web.Http;
using Message_BL;
namespace VPPWeb.Controllers
{
    public class MessageApiController : ApiController
    {
        [UserAuthentication]
        [HttpPost]
        public string GetMessage([FromBody] MessageModel Mmodel)
        {
            if (Mmodel == null)
            {
                Mmodel = new MessageModel();
            }
            MessageBL msgBL = new MessageBL();
            return msgBL.Message_Select(Mmodel);
        }
    }
}
