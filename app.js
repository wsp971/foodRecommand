//app.js
App({
  onLaunch: function () {
    // debugger;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    var cookies = wx.getStorageSync('cookies') || {};
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    // 登录
    wx.login({
      success: res => {
          wx.request({
            url: 'http://localhost:9999/miniProgram/getsessionkey',
            data:{
              code: res.code
            },
            success: (res)=>{
                if(res.data.code ==0){
                  let openid = { openid: res.data.data.openid }; 
                  wx.setStorageSync('cookies', openid);  
                }
            },
            error: error=>{
              
            }
          })

        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    // debugger;
    wx.getSetting({
      success: res => {
        // debugger;
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;



              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              // if (this.userInfoReadyCallback) {
                // this.userInfoReadyCallback(res)
              // }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
  isDebug:false
})