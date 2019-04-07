// pages/main/index.js
import * as db from '../../common/cloudDatabase.js';
const firstCollection = db.getCollection('firstCollection');
const QQMapWX = require('../../lib/qqmap-wx-jssdk.min.js');
import request from '../../utils/request.js';
const instance = new QQMapWX({
  key: 'DC5BZ-ULGKI-NV4GK-5FX4Y-CDQKS-TRB7W'
});

Page({

  /**
   * 页面的初始数据
   */

  data: {
    current: 'homepage',
    x: 30,
    y:30,
    tabConfig:{
      'homepage':'/pages/main/index',
      'mine':'/pages/test/index'
    },
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
    noAuth: false,
  },

  handleChange({detail}) {
    this.setData({
      current: detail.key
    });
    wx.redirectTo({
      url: this.data.tabConfig[detail.key],
    })
  },

  getDishes(){
    request({
      url:"/shop/shopList?pageIndex=0&pageSize=5"
    }).then(res=>{
      console.log(res);
    });
  },

  getShops(){
     
  },

  getLocationAuth(){
      let self = this;
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

            } 
          })
      });
  },

  callback: function({detail}){
    if(detail.authSetting['scope.userLocation']){
      this.setData({
          noAuth: false
      })
    }else{
      this.setData({
          noAuth: true
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 用户授权地理位置
    // wx.getSetting({
    //   success: function(res){
    //     console.log('setting',res);
    //   },
    //   fail: function(err){
    //     console.log('setting err', err);

    //   }

    // })
    this.getDishes();
    this.getLocationAuth()
    .then(res=>{
        console.log('have location');
        wx.getLocation({
          success: function (res) {
            console.log(res);
            const { latitude, longitude } = res;


          }
        });
        this.setData({
          noAuth: false
        })
    }).catch(e=>{
        this.setData({
          noAuth: true
        })
        console.log('not location auth');
    });

  

    

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
    firstCollection.add({
      data: {
        name: "wsp",
        age: 28
      }}).then(res=>{
        console.log(res);
      }).catch(e=>{
        console.error(e);
      })
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