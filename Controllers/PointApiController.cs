using System;
using System.Web.Http;
using VPPModel;
using Point_BL;
using ErrorLog_BL;
using Message_BL;

namespace VPPWeb.Controllers
{
    public class PointApiController : ApiController
    {
        [UserAuthentication]
        [HttpPost]
        public string GetMimimumRedemptionPoints([FromBody] PointModel pointModel)
        {
            PointBL pointBL = new PointBL();
            return pointBL.MinimumRedemptionPoints_Select(pointModel);
        }

        [UserAuthentication]
        [HttpPost]
        public string MinimumRedemptionPoints_CUD([FromBody] PointModel pointModel)
        {
            try
            {
                PointBL pointBL = new PointBL();
                pointBL.MinimumRedemptionPoints_CUD(pointModel);

                MessageBL messageBL = new MessageBL();
                var messageModel = new MessageModel
                {
                    MessageID = pointModel.Mode.Equals("New") ? "I001" : "I002"
                };
                return messageBL.Message_Select(messageModel);
            }
            catch (Exception exception)
            {
                ErrorLogModel errorLogModel = new ErrorLogModel
                {
                    ErrorMessage = exception.Message,
                    UpdatedBy = pointModel.UpdatedBy
                };

                ErrorLogBL errorLogBL = new ErrorLogBL();
                errorLogBL.ErrorLog_Insert(errorLogModel);

                MessageBL messageBL = new MessageBL();
                MessageModel messageModel = new MessageModel
                {
                    MessageID = "E007"
                };
                return messageBL.Message_Select(messageModel);
            }
        }
    }
}
