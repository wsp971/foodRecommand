const cloud = require('wx-server-sdk');
cloud.init({
  env:"development"
});
exports.main = async (event, context) =>{
    let {userInfo,a,b} = event;
    let {openId,appId} = userInfo;
    let sum = a + b;
    return {
      openId,
      appId,
      sum
    }
}