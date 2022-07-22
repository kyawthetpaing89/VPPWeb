using VPPModel;
using System.Web.Mvc;
using System.Web.Security;

namespace VPPWeb.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }
        public ActionResult Dashboard()
        {
            return View();
        }
        public ActionResult SetLoginAuth(UserModel userModel)
        {
            FormsAuthentication.SetAuthCookie(userModel.UserLoginInfo, false);
            if(string.IsNullOrEmpty(userModel.ReturnUrl))
                return RedirectToAction("Dashboard");
            else
            {
                return Redirect(userModel.ReturnUrl);
            }
        }

        public ActionResult LogOut()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Login");
        }

        public ActionResult Test()
        {
            return View();
        }
    }
}