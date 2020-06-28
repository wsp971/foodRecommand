
// 简单的cookies存储
const cookies = wx.getStorageSync('cookies') || {};

function addItem(key,value){
    console.log(key,value);
    Object.assign(cookies,{[key]:value});
    wx.setStorage({
      key: 'cookies',
      data: cookies,
    });
}

function getItem(key){
  return cookies[key] || null;
}

export default {
    getItem,
    addItem
}