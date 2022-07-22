using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VPPModel;
using Event_BL;
using System.IO;
using ErrorLog_BL;
using Message_BL;

namespace VPPWeb.Controllers
{
    public class EventController : Controller
    {
        // GET: Event
        public ActionResult EventListing()
        {
            return View();
        }

        [HttpPost]
        public string Event_CUD()
        {
            string j1 = HttpContext.Request.Params.Get("EventModel");
            EventModel eventModel = JsonConvert.DeserializeObject<EventModel>(j1);
            try
            {
                EventBL eventBL = new EventBL();

                if (eventModel.Mode.Equals("New"))
                {
                    eventModel.EventCode = eventBL.GenerateEventCode(eventModel);
                }

                for (int i = 0; i < Request.Files.Count; i++)
                {
                    string key = Request.Files.GetKey(i);
                    if (key == "calendar")
                    {
                        if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + eventModel.OutlookClanderICS)))
                            System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + eventModel.OutlookClanderICS));

                        eventModel.OutlookClanderICS = "Event/" + eventModel.EventCode + "_.ics";

                        Request.Files[i].SaveAs(Path.Combine(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/"), eventModel.OutlookClanderICS));
                    }
                    else if (key == "flyer")
                    {
                        if (System.IO.File.Exists(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + eventModel.EventFlyer)))
                            System.IO.File.Delete(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/" + eventModel.EventFlyer));

                        eventModel.EventFlyer = "Event/" + eventModel.EventCode + ".pdf";

                        Request.Files[i].SaveAs(Path.Combine(System.Web.Hosting.HostingEnvironment.MapPath("~/SystemImages/"), eventModel.EventFlyer));
                    }
                }

                return eventBL.Event_CUD(eventModel);
            }
            catch (Exception exception)
            {
                ErrorLogModel errorLogModel = new ErrorLogModel
                {
                    ErrorMessage = exception.Message,
                    UpdatedBy = eventModel.UpdatedBy
                };

                ErrorLogBL errorLogBL = new ErrorLogBL();
                errorLogBL.ErrorLog_Insert(errorLogModel);

                MessageBL messageBL = new MessageBL();
                MessageModel messageModel = new MessageModel
                {
                    MessageID = "E007"
                };
                return messageBL.Message_Select(messageModel);
            }
        }
    }
}