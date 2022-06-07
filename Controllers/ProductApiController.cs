using System.Web.Http;
using VPPModel;
using Product_BL;

namespace VPPWeb.Controllers
{
    public class ProductApiController : ApiController
    {
        [UserAuthentication]
        [HttpPost]
        public string GetProduct([FromBody] ProductModel productModel)
        {
            ProductBL productBL = new ProductBL();
            return productBL.Product_Select(productModel);
        }
    }
}
