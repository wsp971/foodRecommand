// components/recommendFood/index.js

import Request from '../../utils/request';

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    cards: [], // 卡片数据，一个包含所有卡片对象的数组
    removed_cards: [],// 存放已经移除的卡片的索引数据，如果索引填充了其他卡片，需要将该索引移出
    transition: true,//是否开启过渡动画
    circling: false, // 是否列表循环
    rotate_deg: 45,// 整个滑动过程旋转角度
    slide_duration: 800,// 手指离开屏幕后滑出界面时长，单位(ms)毫秒
    show_cards: 3,// 显示几张卡片
    thershold: 60,// 松手后滑出界面阈值，单位px
    scale_ratio: 0.07,// 下层卡片收缩力度
    up_height: 40,// 下层卡片下移高度，单位rpx
    recommendFoods:[]// 推荐得菜品
  },

  ready: function () {
    this.generateCards(5)
    setTimeout(()=>{
      console.log("cards",this.data.cards);
    },1000)
    this.getRecommendFoods();
  },
 
 
  /**
   * 组件的方法列表
   */
  methods: {
    generateCards(num) {
      const cards = []
      for (let i = 0; i < num; i++) {
        cards.push({
          title: `卡片${i + 1}`,
          src: `https://source.unsplash.com/collection/190727/500x600?id=${i}`,
          desc: `这是一段卡片${i + 1}的描述。`
        })
      }

      this.setData({
        cards: cards,
        current_cursor: cards.findIndex(item => item),
        removed_cards: []
      })
    },


    // 获取随机推荐菜品
    getRecommendFoods(){
      Request({
        url:'/miniProgram/suggestFood',
        type:'GET',
      }).then(res=>{
        let foods = res.data.data;
        // foods = foods.concat(foods);
        console.log('foods',foods);
        this.setData({
          recommendFoods:foods,
          current_cursor: foods.findIndex(item => item),
          removed_cards: []
        })
      })
    },

    cardSwipe(e) {
      const { direction, swiped_card_index, current_cursor } = e.detail
      console.log(e.detail)
      wx.showToast({
        title: `卡片${swiped_card_index + 1}向${direction === 'left' ? '左' : '右'}滑`,
        icon: 'none',
        duration: 1000
      })
      this.setData({
        current_cursor
      })
    },
  }
})
