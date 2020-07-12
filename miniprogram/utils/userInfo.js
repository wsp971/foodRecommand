import Request from './request.js';
import Cookie from './cookies.js';


export default class UserInfo{
  static instance = null;

  constructor(){
    this.userInfo= null;
    this.promiseChain = null;
  }
  static getInstance(){
    if(!UserInfo.instance){
     UserInfo.instance= new UserInfo();
    }
    return UserInfo.instance;
  }

  static getUserInfo(){
    const user = UserInfo.getInstance();
    if(user.userInfo){
      return Promise.resolve(user.userInfo);
    }
    if(user.promiseChain){
      return user.promiseChain;
    }
    user.promiseChain = user.getAuthorize()
    .then(user.getUserInfo)
    .then(userInfo=>{
      user.userInfo = userInfo;
      user.promiseChain = null;
      return user;
    })
    return user.promiseChain;
    
  }

  getAuthorize(){
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
            resolve(resp.data.data.openid);
          })
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
        },
        fail:(err=>{
          reject(err);
        })
      })
  })
}


getUserInfo(openid){
  const app = getApp();
  return Request({
    url:'/miniProgram/getUserInfo',
    type:'GET',
    data:{
      openid
    }
  }).then(res=>{
    app.globalData.userInfo = res.data.data[0];
    return res.data.data[0];
  })
}    
}
