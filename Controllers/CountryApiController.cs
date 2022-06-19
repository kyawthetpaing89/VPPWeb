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

        [UserAuthentication]
        [HttpPost]
        public string GetCountryPhoto([FromBody] CountryModel countryModel)
        {
            CountryBL countryBL = new CountryBL();
            return countryBL.CountryPhoto_Select(countryModel);
        }

        [HttpPost]
        public string CountryPhoto_Updateapi([FromBody] CountryModel countryModel)
        {
            if (!string.IsNullOrWhiteSpace(countryModel.RemoveBannerPhoto))
            {
                if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + countryModel.RemoveBannerPhoto)))
                    System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + countryModel.RemoveBannerPhoto));
            }

            CountryBL countryBL = new CountryBL();
            return countryBL.CountryPhoto_Update(countryModel);
        }
    }
}
