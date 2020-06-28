// components/myComponents/myComponents.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  lifetimes:{
    ready:function(){
      this.init(4);
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    cards:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init(num){
      const card = [];
      for(let i=0;i< num;i++){
        card.push({
          index:i,
          name:`card_${i}`
        })
      }
      this.setData(cards,card);
    }
  }
})
