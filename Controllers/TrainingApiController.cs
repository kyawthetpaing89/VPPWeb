using VPPModel;
using System.Web.Http;
using Training_BL;
using System;
using ErrorLog_BL;
using Message_BL;
using Enquiry_BL;

namespace VPPWeb.Controllers
{
    public class TrainingApiController : ApiController
    {
        [UserAuthentication]
        [HttpPost]
        public string GetTrainingType([FromBody] TrainingModel trainingModel)
        {
            TrainingBL trainingBL = new TrainingBL();
            return trainingBL.TrainingType_Select(trainingModel);
        }
       
        [UserAuthentication]
        [HttpPost]
        public string TrainingType_CUD([FromBody] TrainingModel trainingModel)
        {
            try
            {
                TrainingBL trainingBL = new TrainingBL();
                return trainingBL.TrainingType_CUD(trainingModel);
            }
            catch (Exception exception)
            {
                ErrorLogModel errorLogModel = new ErrorLogModel
                {
                    ErrorMessage = exception.Message,
                    UpdatedBy = trainingModel.UpdatedBy
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
        public string GetEnquiry([FromBody] EnquiryModel enquiryModel)
        {
            EnquiryBL enquiryBL = new EnquiryBL();
            return enquiryBL.Enquiry_Select(enquiryModel);
        }

        [UserAuthentication]
        [HttpPost]
        public string GetTraining([FromBody] TrainingModel trainingModel)
        {
            TrainingBL trainingBL = new TrainingBL();
            return trainingBL.Training_Select(trainingModel);
        }

        [UserAuthentication]
        [HttpPost]
        public string Training_CUD([FromBody] TrainingModel trainingModel)
        {
            try
            {
                TrainingBL trainingBL = new TrainingBL();
                return trainingBL.Training_CUD(trainingModel);
            }
            catch (Exception exception)
            {
                ErrorLogModel errorLogModel = new ErrorLogModel
                {
                    ErrorMessage = exception.Message,
                    UpdatedBy = trainingModel.UpdatedBy
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
