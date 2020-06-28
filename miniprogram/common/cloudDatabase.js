
wx.cloud.init({
  env:'development-04e5f9',
  traceUser: true
});

const db = wx.cloud.database({
  env:'development-04e5f9'  
});

export function getCollection (collectionname){
  return db.collection(collectionname);
}
