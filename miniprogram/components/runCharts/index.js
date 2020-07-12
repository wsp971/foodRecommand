

import * as echarts from '../ec-canvas/echarts';

let chart;

var option = {
  xAxis: {
      type: 'category',
      data: []
  },
  yAxis: {
      type: 'value',
      axisTick:{
        show:false
      },
      axisLabel:{
        show:false
      },
      splitLine:{
        show:false
      },
      // boundaryGap:['30%','10%']
  },
  series: [{
      data: [],
      type: 'line',
      smooth: true,
      color:"#232323",
      areaStyle: {
        color: '#61B2A7'
      }
  }]
}

function initChart(canvas, width, height, dpr) {
   chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 像素
  });
  canvas.setChart(chart);
  chart.setOption(option);
  return chart;
}


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    chartData:{
      type:Object,
      value:{},
      observer:function(newData){
        if(newData.xData && newData.yData){
          option.xAxis.data = newData.xData;
          option.series[0].data = newData.yData;

          console.log('option',option);
          // canvas.setChart(chart);
          chart.setOption(option);
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ec:{
      onInit: initChart
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})

