using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace VPPWeb.Controllers
{
    public class PointController : Controller
    {
        // GET: Point
        public ActionResult MinimumRedemptionPoints()
        {
            return View();
        }
    }
}