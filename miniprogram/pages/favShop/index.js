// miniprogram/pages/favShop/index.js
import Request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myFavShopList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    this.getMyFavShopList();
  },

  async getMyFavShopList(){
    const result  = await  Request({
      url:'/miniProgram/myFavShop',
      type:'get'
    })
    if(result.data.code ===0){
      this.setData({
        myFavShopList:result.data.data
      })
    }
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