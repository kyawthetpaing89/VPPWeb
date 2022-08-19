using DigitalLibrary_BL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VPPModel;

namespace VPPWeb.Controllers
{
    public class PartialController : Controller
    {
        // GET: Partial
        public ActionResult LoadDigitalLibrary(DigitalLibraryModel digitalLibraryModel)
        {
            DigitalLibraryBL digitalLibraryBL = new DigitalLibraryBL();
            digitalLibraryModel.ActiveStatus = "1";

            digitalLibraryModel.DtDigitalLibrary = digitalLibraryBL.DigitalLibrary_SelectDT(digitalLibraryModel);
            return PartialView(digitalLibraryModel);
        }
    }
}