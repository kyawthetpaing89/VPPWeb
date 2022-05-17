using VPPModel;
using System.Web.Http;
using Reward_BL;
using System;
using ErrorLog_BL;
using Message_BL;

namespace VPPWeb.Controllers
{
    public class RewardApiController : ApiController
    {
        [UserAuthentication]
        [HttpPost]
        public string GetRewardPrize([FromBody] RewardPrizeModel rewardPrizeModel)
        {
            RewardBL rewardBL = new RewardBL();
            return rewardBL.RewardPrize_Select(rewardPrizeModel);
        }
    }
}
