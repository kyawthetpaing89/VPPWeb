using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using VPPModel;
using Event_BL;

namespace VPPWeb.Controllers
{
    public class EventApiController : ApiController
    {
        [UserAuthentication]
        [HttpPost]
        public string GetEventType([FromBody] EventModel eventModel)
        {
            EventBL eventBL = new EventBL();
            return eventBL.EventType_Select(eventModel);
        }

        [UserAuthentication]
        [HttpPost]
        public string GetEvent([FromBody] EventModel eventModel)
        {
            EventBL eventBL = new EventBL();
            return eventBL.Event_Select(eventModel);
        }
    }
}
