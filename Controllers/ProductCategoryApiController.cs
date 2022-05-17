using VPPModel;
using System.Web.Http;
using ProductCategory_BL;
using System;
using ErrorLog_BL;
using Message_BL;

namespace VPPWeb.Controllers
{
    public class ProductCategoryApiController : ApiController
    {
        [UserAuthentication]
        [HttpPost]
        public string GetProductCategory([FromBody] ProductCategoryModel productCategoryModel)
        {
            ProductCategoryBL productCategoryBL = new ProductCategoryBL();
            return productCategoryBL.ProductCategory_Select(productCategoryModel);
        }

        [UserAuthentication]
        [HttpPost]
        public string ProductCategory_CUD([FromBody] ProductCategoryModel productCategoryModel)
        {
            try
            {
                ProductCategoryBL productCategoryBL = new ProductCategoryBL();
                productCategoryBL.ProductCategory_CUD(productCategoryModel);

                MessageBL messageBL = new MessageBL();
                MessageModel messageModel = new MessageModel();
                
                messageModel.MessageID = productCategoryModel.Mode.Equals("New")?"I001": "I002";
                return messageBL.Message_Select(messageModel);
            }
            catch (Exception exception)
            {
                ErrorLogModel errorLogModel = new ErrorLogModel
                {
                    ErrorMessage = exception.Message,
                    UpdatedBy = productCategoryModel.UpdatedBy
                };

                ErrorLogBL errorLogBL = new ErrorLogBL();
                errorLogBL.ErrorLog_Insert(errorLogModel);

                MessageBL messageBL = new MessageBL();
                MessageModel messageModel = new MessageModel();
                messageModel.MessageID = "E007";
                return messageBL.Message_Select(messageModel);
            }
        }

    }
}
