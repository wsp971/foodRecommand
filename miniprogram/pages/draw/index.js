
import Request from '../../utils/request'


Page({
  data: {
    circleList: [],//圆点数组
    awardList: [],//奖品数组
    colorCircleFirst: '#FFDF2F',//圆点颜色1
    colorCircleSecond: '#FE4D32',//圆点颜色2
    colorAwardDefault: '#F5F0FC',//奖品默认颜色
    colorAwardSelect: '#ffe400',//奖品选中颜色
    indexSelect: 0,//被选中的奖品index
    isRunning: false,//是否正在抽奖
    randomFoods:[]
  },

  onLoad: function () {
    var _this = this;
    //圆点设置
    var leftCircle = 7.5;
    var topCircle = 7.5;
    var circleList = [];
    for (var i = 0; i < 24; i++) {
      if (i == 0) {
        topCircle = 15;
        leftCircle = 15;
      } else if (i < 6) {
        topCircle = 7.5;
        leftCircle = leftCircle + 102.5;
      } else if (i == 6) {
        topCircle = 15
        leftCircle = 620;
      } else if (i < 12) {
        topCircle = topCircle + 94;
        leftCircle = 620;
      } else if (i == 12) {
        topCircle = 565;
        leftCircle = 620;
      } else if (i < 18) {
        topCircle = 570;
        leftCircle = leftCircle - 102.5;
      } else if (i == 18) {
        topCircle = 565;
        leftCircle = 15;
      } else if (i < 24) {
        topCircle = topCircle - 94;
        leftCircle = 7.5;
      } else {
        return
      }
      circleList.push({ topCircle: topCircle, leftCircle: leftCircle });
    }
    this.setData({
      circleList: circleList
    })
    //圆点闪烁
    setInterval(function () {
      if (_this.data.colorCircleFirst == '#FFDF2F') {
        _this.setData({
          colorCircleFirst: '#FE4D32',
          colorCircleSecond: '#FFDF2F',
        })
      } else {
        _this.setData({
          colorCircleFirst: '#FFDF2F',
          colorCircleSecond: '#FE4D32',
        })
      }
    }, 500)
    //奖品item设置
    var awardList = [];
    //间距,怎么顺眼怎么设置吧.
    var topAward = 25;
    var leftAward = 25;
    for (var j = 0; j < 8; j++) {
      if (j == 0) {
        topAward = 25;
        leftAward = 25;
      } else if (j < 3) {
        topAward = topAward;
        //166.6666是宽.15是间距.下同
        leftAward = leftAward + 166.6666 + 15;
      } else if (j < 5) {
        leftAward = leftAward;
        //150是高,15是间距,下同
        topAward = topAward + 150 + 15;
      } else if (j < 7) {
        leftAward = leftAward - 166.6666 - 15;
        topAward = topAward;
      } else if (j < 8) {
        leftAward = leftAward;
        topAward = topAward - 150 - 15;
      }
      // var imageAward = this.data.imageAward[j];
      awardList.push({ topAward: topAward, leftAward: leftAward });
    }
    this.setData({
      awardList: awardList
    })
  },

  onReady: function(){
    this.getRandomFood();
  },

  async getRandomFood(){
    const data = await Request({
      url:'/miniProgram/suggestFood',
      type:'GET'
    });
    console.log('data',data);

    if(data.data.code===0){
      this.setData({
        randomFoods: data.data.data.slice(0,9),
        changeIndex:0,
        allFoods: data.data.data
      })
    }
  },
  change(){
    const index = this.data.changeIndex + 1;
    const foods = this.data.allFoods.slice(index* 9,(index+1)* 9);
    if(foods.length<9){
      wx.showToast({
        title: '没有更多啦~~~',
        icon:'none'
      })
      return;
    }
    this.setData({
      changeIndex:index,
      randomFoods: foods
    })
  },
  //开始游戏
  startGame: function () {
    if (this.data.isRunning) return
    this.setData({
      isRunning: true
    })
    var _this = this;
    var indexSelect = 0
    var i = 0;
    var timer = setInterval(function () {
      indexSelect++;
      //这里我只是简单粗暴用y=30*x+200函数做的处理.可根据自己的需求改变转盘速度
      i += parseInt(Math.random() * 30);

      indexSelect = indexSelect % 8;
      _this.setData({
        indexSelect: indexSelect
      })
      if (i > 1000) {
        //去除循环
        clearInterval(timer)
        //获奖提示
        wx.showModal({
          title: '恭喜你',
          content: `今天你的胃想吃${_this.data.randomFoods[indexSelect].name}啦~`,
          confirmText:"去吃",
          showCancel: false,//去掉取消按钮
          success: function (res) {
            if (res.confirm) f
              _this.setData({
                isRunning: false
              })
            }
          })
      }
    }, 200 )
  }
})