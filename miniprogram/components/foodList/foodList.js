// components/foodList/foodList.js

import request from '../../utils/request.js';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    foodData:{
      type:Array,
    },
    showType:{
      type:Number,
      value:1
    }
  },

  /**
   * 组件的初始数据
   */
 

  /**
   * 组件的方法列表
   */
  methods: {
    async like(event){
      wx.showLoading({
        title: '',
        mask:true
      })
      const id = event.currentTarget.dataset.item._id
      const index = event.currentTarget.dataset.idx;
      console.log('like',id,index);
      const result = await  request({
        url:"/miniProgram/favFood",
        data:{
          type:1,
          id
        }
      })
  
      if(result.data.code==0){
        wx.showToast({
          title: '喜欢成功',
          icon:'success'
        })
        this.setData({
          [`foodData[${index}].isFav`] : !event.currentTarget.dataset.item.isFav,
          [`foodData[${index}].favourites`]: event.currentTarget.dataset.item.favourites + 1
        })
      }else{
        wx.showToast({
          title: '喜欢失败' + result.data.message,
          icon:'none'
        })
      }
    },
    async dislike(event){
      wx.showLoading({
        title: '',
        mask:true
      })
      const id = event.currentTarget.dataset.item._id
      const index = event.currentTarget.dataset.idx;
      console.log('like',id,index);
      const result = await  request({
        url:"/miniProgram/favFood",
        data:{
          type:2,
          id
        }
      })
  
      if(result.data.code==0){
        wx.showToast({
          title: '取消喜欢成功',
          icon:'success'
        })
        this.setData({
          [`foodData[${index}].isFav`] : !event.currentTarget.dataset.item.isFav,
          [`foodData[${index}].favourites`]: event.currentTarget.dataset.item.favourites - 1
        })
      }else{
        wx.showToast({
          title: '取消喜欢失败' + result.data.message,
          icon:'none'
        })
      }
    }
  }
})
