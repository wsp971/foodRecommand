import Request from './request.js';
import Cookie from './cookies.js';

export default function Authorize (){
  return new Promise((resolve,reject)=>{
    wx.login({
      success: res => {
        Request({
          url: '/miniProgram/getsessionkey',
          data: {
            code: res.code
          }
        }).then(resp => {
          Cookie.addItem('openid', resp.data.data.openid);
          resolve();
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
      fail:(err=>{
        reject(err);
      })
    })
  })
    
}
