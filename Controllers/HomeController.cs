using VPPModel;
using System.Web.Mvc;
using System.Web.Security;

namespace VPPWeb.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Login()
        {
            return View();
        }
        public ActionResult Dashboard()
        {
            return View();
        }
        public ActionResult SetLoginAuth(UserModel partnerModel)
        {
            FormsAuthentication.SetAuthCookie(partnerModel.UserLoginInfo, false);
            return RedirectToAction("Dashboard");
        }

        public ActionResult LogOut()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Login");
        }
    }
}