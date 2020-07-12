// components/footer/footer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    current:{
      type:String,
      value:'homepage'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // current: 'homepage',
    tabConfig:{
      'homepage':'/pages/main/index',
      'mine':'/pages/my/index'
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleChange({detail}) {
      if(detail.key === this.data.current){
        return;
      }
      this.setData({
        current: detail.key
      });
      wx.redirectTo({
        url: this.data.tabConfig[detail.key],
      })
    },
  }
})
