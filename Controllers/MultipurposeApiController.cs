using VPPModel;
using System.Web.Http;
using Multipurpose_BL;
using System;
using ErrorLog_BL;
using Message_BL;

namespace VPPWeb.Controllers
{
    public class MultipurposeApiController : ApiController
    {
        [UserAuthentication]
        [HttpPost]
        public string MultipurposeUpdate([FromBody] MultipurposeModel multipurposeModel)
        {
            try
            {
                MultipurposeBL multipurposeBL = new MultipurposeBL();
                multipurposeBL.Multipurpose_Update(multipurposeModel);

                MessageBL messageBL = new MessageBL();
                MessageModel messageModel = new MessageModel();
                messageModel.MessageID = "I001";
                return messageBL.Message_Select(messageModel);
            }
            catch (Exception exception)
            {
                ErrorLogModel errorLogModel = new ErrorLogModel
                {
                    ErrorMessage = exception.Message,
                    UpdatedBy = multipurposeModel.UpdatedBy
                };

                ErrorLogBL errorLogBL = new ErrorLogBL();
                errorLogBL.ErrorLog_Insert(errorLogModel);

                MessageBL messageBL = new MessageBL();
                MessageModel messageModel = new MessageModel();
                messageModel.MessageID = "I001";
                return messageBL.Message_Select(messageModel);
            }
        }
    }
}
