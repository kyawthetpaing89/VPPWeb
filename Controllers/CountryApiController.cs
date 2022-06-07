using System;
using System.Web.Http;
using VPPModel;
using Country_BL;
using ErrorLog_BL;
using Message_BL;

namespace VPPWeb.Controllers
{
    public class CountryApiController : ApiController
    {
        [UserAuthentication]
        [HttpPost]
        public string GetCountry([FromBody] PointModel pointModel)
        {
            CountryBL countryBL = new CountryBL();
            return countryBL.Country_Select(pointModel);
        }

        [UserAuthentication]
        [HttpPost]
        public string Country_Points_Update([FromBody] PointModel pointModel)
        {
            try
            {
                CountryBL countryBL = new CountryBL();
                countryBL.CountryPoints_Update(pointModel);

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
