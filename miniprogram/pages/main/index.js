// pages/main/index.js
const QQMapWX = require('../../lib/qqmap-wx-jssdk.min.js');
import request from '../../utils/request.js';

const qqmapSDK = new QQMapWX({
  key: 'DC5BZ-ULGKI-NV4GK-5FX4Y-CDQKS-TRB7W'
});


const app = getApp();

console.log('globallocation',app.globalData.location,app.isDebug);


// console.log('instance',instance);

Page({

  /**
   * 页面的初始数据
   */

  data: {
  
    recommendFoodList:[{
      name:'精品兰州牛肉面',
      pic:'http://wq.360buyimg.com/data/ppms/picture/WechatIMG105.jpeg',
      description:'兰州牛肉面，具有牛肉烂软，萝卜白净，辣油红艳，香菜翠绿，面条柔韧、滑利爽口、汤汁、诸味和谐，香味扑鼻，诱人食欲等特点。',
       price:'15.00',
       distance: '1km',
       favourite:233,
       tags:[{
          name:'有特色',
          color:'red'
       },{
         name:'新客立减',
         color:'green'
       }]
    }, {
        name: '炒粉',
        pic: 'http://wq.360buyimg.com/data/ppms/picture/WechatIMG103.jpeg',
        description: '香气逼人的炒粉，人气爆品',
        price: '10.00',
        favourite: 1003,
        distance: '500m',
        tags: [{
          name: '爆款',
          color: 'red'
        }, {
          name: '热门',
          color: 'red'
        }]
      }],

    // 检查有没有获取到位置授权
    noAuth: false,
    
    //推荐的商家
    recommendShop:[]
  },

  handleChange({detail}) {
    this.setData({
      current: detail.key
    });
    wx.redirectTo({
      url: this.data.tabConfig[detail.key],
    })
  },

  // 获取推荐得精品店铺
  getRecommendShopList(){
    request({
      url:"/shop/shopList?pageIndex=0&pageSize=5"
    }).then(res=>{
      this.setData({
        recommendShop: res.data.data
      })
      console.log(res);
    });
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
    return new Promise((resolve,reject)=>{
      qqmapSDK.calculateDistance({
        mode:'driving',
        from: app.globalData.location,
        to:destLocation,
        success:(res)=>{
          const newShopList = this.data.recommendShop.map((shop,index)=>{
            return {
              ...shop,
              distance:res.result.elements[index].distance,
              duration:res.result.elements[index].duration,
            }
          })
          this.setData({
            recommendShop:newShopList
          })
          resolve();
        },
        fail:(error)=>{
          debugger;
        }
      })
    })
    
  },

  // 获取当前所在城市
  getCity(){
    if(!app.globalData.location){
      return Promise.reject();
    }
    return new Promise((resolve,reject)=>{
      qqmapSDK.reverseGeocoder({
        location:app.globalData.location,
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取推荐列表
    this.getRecommendShopList();

    //获取当前用户得地理坐标
    this.checkLocationAuth()
      .then(this.getLocation)
      .then(this.computeDistance)
      .then(this.getCity)
      .catch(e=>{
          console.log('location err',e);
      })



    // wx.openSetting({
    //   success: function(){
    //       debugger;
    //   },
    //   fail: function(){
    //       debugger;
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // firstCollection.add({
    //   data: {
    //     name: "wsp",
    //     age: 28
    //   }}).then(res=>{
    //     console.log(res);
    //   }).catch(e=>{
    //     console.error(e);
    //   })
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