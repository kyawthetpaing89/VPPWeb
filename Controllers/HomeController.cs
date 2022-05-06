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
        public ActionResult SetLoginAuth(PartnerModel partnerModel)
        {
            FormsAuthentication.SetAuthCookie(partnerModel.VipLoginInfo, false);
            return RedirectToAction("Dashboard");
        }
    }
}