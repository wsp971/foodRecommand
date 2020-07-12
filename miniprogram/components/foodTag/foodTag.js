// components/foodTag.js
const tagMap = {
  new:{
    name:"新品",
    color:"primary",
  },
  hot:{
    name:"热门",
    color:'error',
  },
  saleGood:{
    name:"热卖",
    color:"orange",
  },
  hotter:{
    name:"超火爆",
    color:"gold",
  },
  minus:{
    name:"满减",
    color:"cyan",
  },
  discount:{
    name:"狠优惠",
    color:"volcano",
  },
  style:{
    name:"有格调",
    color:"green",
  },
  sign:{
    name:"招牌",
    color:"red",
  },
  newDiscount:{
    name:"新客立减",
    color:"pink",
  },
  packet:{
    name:"有红包",
    color:"geekblue",
  }
};

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tagType:{
      type: String,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
     tag: {},
  },

  lifetimes:{
    attached: function () { 
      this.setData({
        tag:tagMap[this.data.tagType]
      })
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
