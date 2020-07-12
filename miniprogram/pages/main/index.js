// pages/main/index.js
const QQMapWX = require('../../lib/qqmap-wx-jssdk.js');
import request from '../../utils/request.js';
const moment = require('moment');
// import * as moment from 'moment';

const qqmapSDK = new QQMapWX({
  key: 'DC5BZ-ULGKI-NV4GK-5FX4Y-CDQKS-TRB7W'
});


const app = getApp();

console.log('globallocation',app.globalData.location,app.isDebug);


Page({

  /**
   * 页面的初始数据
   */

  data: {
  
    // 猜你喜欢推荐数据
    foodRecommend:[],

    // 检查有没有获取到位置授权
    noAuth: false,
    
    //推荐的商家
    recommendShop:[],

    weixinRunData:{},

    averageStep:0,
  },


  // 获取推荐得精品店铺
  getRecommendShopList(){
    return request({
      url:"/miniProgram/suggestShop"
    }).then(res=>{
      this.setData({
        recommendShop: res.data.data
      })
      console.log(res);
    });
  },


  // 收藏店铺
  async fav(event){
    wx.showLoading({
      title: '',
      mask:true
    })
    const shopId = event.currentTarget.dataset.item.id
    const index = event.currentTarget.dataset.index;
    console.log('fav',shopId,index);
    const result = await  request({
      url:"/miniProgram/favShop",
      data:{
        type:1,
        id: shopId
      }
    })

    if(result.data.code==0){
      wx.showToast({
        title: '收藏成功',
        icon:'success'
      })
      this.setData({
        [`recommendShop[${index}].isFav`] : !event.currentTarget.dataset.item.isFav
      })
    }else{
      wx.showToast({
        title: '收藏失败' + result.data.message,
        icon:'none'
      })
    }
    console.log(result,'favResult');
  },

  // 取消收藏店铺
  async unFav(event){
    wx.showLoading({
      title: '',
      mask:true
    })
    const shopId = event.currentTarget.dataset.item.id
    const index = event.currentTarget.dataset.index;
    console.log('fav',shopId,index);
    const result = await  request({
      url:"/miniProgram/favShop",
      data:{
        type:2,
        id: shopId
      }
    })
    if(result.data.code==0){
      wx.showToast({
        title: '取消收藏成功',
        icon:'fail'
      })
      this.setData({
        [`recommendShop[${index}].isFav`] : !event.currentTarget.dataset.item.isFav
      })
    }else{
      wx.showToast({
        title: '取消收藏失败' + result.data.message,
        icon:'none'
      })
    }
    console.log(result,'favResult');
  },
  
   // 获取随机推荐菜品
   getRecommendFoods(){
    request({
      url:'/miniProgram/suggestFood',
      type:'GET',
    }).then(res=>{
      let foods = res.data.data;
      this.setData({
        foodRecommend:foods,
      })
    })
  },

  // 检查位置授权权限
  checkLocationAuth(){
      return new Promise((resolve, reject)=>{
          wx.getSetting({
            success: function (res) {
              if (res.authSetting['scope.userLocation']) {
                resolve(true);
              } else {
                wx.authorize({
                  scope: 'scope.userLocation',
                  success: function (res) {
                    resolve(true);
                  },
                  fail: function (err) {
                     reject();
                  }
                })
              }
              console.log('setting', res);
            },
            fail: function (err) {
              console.log('setting err', err);
              reject();
            } 
          })
      });
  },

  goRandomRecommend(){
    wx.navigateTo({
      url: '/pages/draw/index',
    })
  },
  computeDistance(){
    console.log('current location',app.globalData.location);
    if(!app.globalData.location){
      return Promise.reject();
    }
    const destLocation = this.data.recommendShop.map(shop=>{
      return {
        latitude: parseFloat(shop.latLng.lat),
        longitude: parseFloat(shop.latLng.lng)
      }
    })

    function distanceDes(distance){
      if(distance > 1000){
        return parseInt(distance/1000) + 'km';
      }
      return parseInt(distance) + 'm'
    } 

    function timeDes(timestr){
      const oneMinute = 60 ;
      const halfHour = oneMinute * 30;
      const oneHour = 2 * halfHour;
      let des = '';
      if(timestr < 10 * oneMinute){
        des = parseInt(timestr/oneMinute) + '分钟'
      }else if( timestr < halfHour){
        des = '半小时'
      }else if (timestr < oneHour){
        des = parseInt(timestr/oneMinute) + '分钟'
      }else {
        des = parseInt(timestr/oneHour) + "小时";
      }
      return des;
    }

    return new Promise((resolve,reject)=>{
      qqmapSDK.calculateDistance({
        mode:'walking',
        from: app.globalData.location,
        to:destLocation,
        sig:'XFbpmfe8GJjEoWgnWMJOxFjJ5Wr2cR9k',
        success:(res)=>{
          const newShopList = this.data.recommendShop.map((shop,index)=>{
            return {
              ...shop,
              distance:res.result.elements[index].distance,
              duration:res.result.elements[index].duration,
              distanceDes: distanceDes(res.result.elements[index].distance),
              durationDes: timeDes(res.result.elements[index].duration)
            }
          })
          this.setData({
            recommendShop:newShopList
          })
          resolve();
        },
        fail:(error)=>{
        }
      })
    })
    
  },

  // 获取当前所在城市
  getCity(){

    if(!app.globalData.location){
      return;
    }
    if(app.globalData.city){
      wx.setNavigationBarTitle({
        title:app.globalData.city
      })
      return Promise.resolve();
    }
    return new Promise((resolve,reject)=>{
      qqmapSDK.reverseGeocoder({
        location:app.globalData.location,
        sig:'XFbpmfe8GJjEoWgnWMJOxFjJ5Wr2cR9k',
        success:  (res)=> {
          let city = res.result.ad_info.city
          app.globalData.city = city;
          wx.setNavigationBarTitle({
            title:city
          })
          resolve();
        },
        fail: function (res) {
          console.log(res);
          reject();
        },
      });
    })
  },

  // 获取当前位置得地理坐标
  getLocation(){
    return new Promise((resolve,reject)=>{
      wx.getLocation({
        success:  (res)=> {
          console.log(res);
          const { latitude, longitude } = res;
          console.log('坐标', latitude,longitude);
          app.globalData.location = {
            latitude,
            longitude
          };
          this.setData({
            noAuth: false
          })
          resolve();
        },
        fail: (err)=>{
          console.log('err',err);
          this.setData({
            noAuth:true
          })
          reject();
        }
      });
    })
  },


  getWeixinRunAuth(){
    return new Promise((resolve,reject)=>{
      wx.getSetting({
        success(res){
          if(!res.authSetting['scope.werun']){
            wx.authorize({
              scope: 'scope.werun',
              success () {
                resolve();
              },
              error(err){
                reject(err)
              }
            })
          }else{
            resolve();
          }
        },
        error(err){
          reject(err)
        }
      })
    })
  },

  getWeixinRun(){
    const self = this;
    console.log('weixinrun');
    this.getWeixinRunAuth()
    .then(()=>{
      wx.getWeRunData({
        async success(res){
          console.log('wexinrundata',res);
          const result = await request({
            url:'/miniProgram/getWeixinRun',
            type:'GET',
            data:{
              encryptedData:res.encryptedData,
              iv: res.iv
            }
          })

          // console.log('lala',result);
          if(result.data.code===0){
            let stepSum = 0;
            const runInfo = result.data.data.stepInfoList;
            let xData= [];
            let yData = [];
            runInfo.forEach((item,index)=>{
              if(index==0){
                xData.push(moment.unix(item.timestamp).format('MM/DD'));
                return;
              }
              xData.push(moment.unix(item.timestamp).format('DD'));
              yData.push(item.step);
              stepSum += item.step;
            })

            const averageStep = parseInt(stepSum/runInfo.length);
            self.setData({
              weixinRunData:{xData,yData,averageStep},
              averageStep:averageStep
            })

          }
          console.log('lala',result);
        },
        error(error){
          console.log('获取微信运动数据失败', error);
        } 
      })
    })
  },
  
  goHealthRecommend(){
    wx.navigateTo({
      url: '/pages/healthyFoods/healthyFoods',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 

    // 获取猜你喜欢的数据
    this.getRecommendFoods()

    // 获取推荐列表
    //获取当前用户得地理坐标
    this.getRecommendShopList()
      .then(this.checkLocationAuth)
      .then(this.getLocation)
      .then(this.computeDistance)
      .then(this.getCity)
      .then(this.getWeixinRun)
      .catch(e=>{
          console.log('location err',e);
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})