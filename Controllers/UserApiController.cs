using VPPModel;
using System.Web.Http;
using User_BL;

namespace VPPWeb.Controllers
{
    public class UserApiController : ApiController
    {
        [UserAuthentication]
        [HttpPost]
        public string GetUserLoginCheck([FromBody] UserModel userModel)
        {
            UserBL userBL = new UserBL();
            return userBL.User_LoginCheck(userModel);
        }
    }
}
