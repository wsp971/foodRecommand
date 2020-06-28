// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init();
const db = cloud.database();
const userCollections = db.collection("users");

// 云函数入口函数
exports.main = async (event, context) => {
  let { userInfo} = event;
  let { openId} = userInfo;
  
 

  // let dbUserInfo = await userCollections.where({openid:openId}).get();
  // let dbResult= '';
  // if(!dbUserInfo[0]){
  //   dbResult =  await userCollections.add({
  //     data:{
  //       openid:openId
  //     }
  //   });
  // }


  // let result = await cloud.callFunction({
  //   name:"test",
  //   data:{a:1,b:5}
  // });

  return {
    openId,
  }
}