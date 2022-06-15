using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace VPPWeb.Controllers
{
    public class TrainingController : Controller
    {
        // GET: Training
        public ActionResult TrainingTypeListing()
        {
            return View();
        }
    }
}