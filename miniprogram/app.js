import authorize from './utils/authorize.js'

App({
  onLaunch: function () {
    authorize();
  },
  globalData: {
    userInfo: null,
    location:null,
    city:''
  },
  isDebug:false
})