const config = {
  mode: 'development'
};
const cookie = require('./cookies.js');
export default function request (option){
  const baseUrl = config.mode == 'development' ? 'http://localhost:9999':'https://aoshiman.com.cn';
  const openid = cookie.getItem('openid');
  return new Promise((resolve, reject)=>{
    wx.request({
      url: baseUrl + option.url,
      data:option.data,
      header: Object.assign({},option.header,{
         'openid': openid
      }),
      method: option.type ? option.type.toUpperCase() : "GET",
      success(res) {
        resolve(res);
        // console.log(res.data)
      },
      fail(error){
        reject(error);
      }
    });
  });
}