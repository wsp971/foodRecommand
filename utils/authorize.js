const cookies = require('./cookies.js');
module.exports = function(){
  const cookies = wx.getStorageSync('cookies') || {};
  if (wx.cloud) {
    wx.cloud.init({
      env: 'development-04e5f9',
      traceUser: true
    });
    wx.cloud.callFunction({
      name: "login"
    }).then(res => {  
      cookies.addItem('openid',res.result.openId);
    }).catch(error=>{
      // todo 登录出错，要全局提示重试。
    });
  } else {
    wx.login({
      success: res => {
        wx.request({
          url: 'http://localhost:9999/miniProgram/getsessionkey',
          data: {
            code: res.code
          },
          success: ({data}) => {
            if (data.code == 0) {
              cookies.addItem('openid', data.data.openid);
            }else{
                // todo 登录出错，要全局提示重试。

            }
          },
          error: error => {
            // todo 登录出错，要全局提示重试。
          }
        })

        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  }
}
