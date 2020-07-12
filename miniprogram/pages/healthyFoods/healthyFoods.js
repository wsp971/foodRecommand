import request from '../../utils/request';
import * as moment from 'moment';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    weixinRunData:{},
    averageStep:0,
    userType:0,
    userDesc:'',
    recommendFoods:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    this.getWeixinRun();
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
            let userDesc;
            if(averageStep > 10000){
              userDesc = '高热量摄入人群'
            }
            else if(averageStep < 2000){
              userDesc = '低热量摄入人群'
            }else {
              userDesc = '适度热量摄入人群'
            }
            self.setData({
              weixinRunData:{xData,yData,averageStep},
              averageStep:averageStep,
              userDesc
            })
            self.getRecommendFood(averageStep);

          }
          console.log('lala',result);
        },
        error(error){
          console.log('获取微信运动数据失败', error);
        } 
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  async getRecommendFood(averageStep){
    let type='small'
    if(averageStep> 5000){
      type= 'middle';
    }else if(averageStep> 10000){
      type= 'large'
    };

    const result = await request({
      url:"/miniProgram/getRecommendByRun",
      type:"get",
      data:{
        type
      }
    })

    if(result.data.code ===0){

      const foods = result.data.data;

      this.setData({
        recommendFoods: foods
      })

    }




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