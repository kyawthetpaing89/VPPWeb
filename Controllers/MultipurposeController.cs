using VPPModel;
using System.Web.Mvc;
using Multipurpose_BL;

namespace VPPWeb.Controllers
{
    public class MultipurposeController : Controller
    {
        public ActionResult TermsAndConditions()
        {
            MultipurposeModel multipurposeModel = new MultipurposeModel
            {
                ID = "01",
                KeyCode = "001"
            };

            MultipurposeBL multipurposeBL = new MultipurposeBL();
            multipurposeModel = multipurposeBL.MultiPurpose_SelectModel(multipurposeModel);
            return View(multipurposeModel);
        }

        public ActionResult PrivacyAndPolicy()
        {
            MultipurposeModel multipurposeModel = new MultipurposeModel();
            multipurposeModel.ID = "02";
            multipurposeModel.KeyCode = "001";

            MultipurposeBL multipurposeBL = new MultipurposeBL();
            multipurposeModel = multipurposeBL.MultiPurpose_SelectModel(multipurposeModel);
            return View(multipurposeModel);
        }

        public ActionResult ContactUs()
        {
            MultipurposeModel multipurposeModel = new MultipurposeModel();
            multipurposeModel.ID = "03";
            multipurposeModel.KeyCode = "001";

            MultipurposeBL multipurposeBL = new MultipurposeBL();
            multipurposeModel = multipurposeBL.MultiPurpose_SelectModel(multipurposeModel);
            return View(multipurposeModel);
        }

        public ActionResult MinimumRedemptionPoints()
        {
            return View();
        }

        public ActionResult ProductCategory()
        {
            return View();
        }
    }
}