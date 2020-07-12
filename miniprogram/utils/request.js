import Cookie from './cookies.js';
import UserInfo from './userInfo.js';
const config = {
  mode: 'production'
};

export default async function request (option,tryTime){
  console.log('trytime',tryTime);
  const baseUrl = config.mode == 'development' ? 'http://localhost:9999':'http://aoshiman.com.cn/shopServer';
  let openid = Cookie.getItem('openid');
  console.log('request add openid', openid);
  const writeList = ['/miniProgram/getsessionkey'];
  if(!writeList.includes(option.url)){
    console.log('url',option.url);
    if(!openid){
      const user =  await UserInfo.getUserInfo();
      console.log('usr',user);
      openid = Cookie.getItem('openid');
     }
     console.log('trytime',tryTime);
     if(tryTime>2){
       return reject(new Error('请求失败，请稍后再试~'));
     }
  }

  return new Promise((resolve, reject)=>{
    wx.request({
      url: baseUrl + option.url,
      data:{
        openid,
        ...option.data,
      },
      header: Object.assign({},option.header,{
         'openid': openid
      }),
      method: option.type ? option.type.toUpperCase() : "GET",
      success(res) {
        if(res.data.code=== -1000){
          reject(new Error('登录失败'))
          // resolve(request(option,tryTime+1)) ;
        }
        resolve(res);
        // console.log(res.data)
      },
      fail(error){
        reject(error);
      }
    });
  });
}