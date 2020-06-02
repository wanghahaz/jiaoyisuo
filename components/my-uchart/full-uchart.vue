<template>
  <view class="">
    <view class="chartsBox">
      <canvas class="charts charts1" :class="{ background: background }" canvas-id="canvas" id="canvas" @touchstart="touchCandle"
        @touchmove="moveCandle" @touchend="touchEndCandle"></canvas>
    </view>
    <view class="chartsBox2"><canvas class="charts charts2" :class="{ background: background }" canvas-id="canvasColumn"
        id="canvasColumn"></canvas></view>
  </view>
</template>

<script>
  import Vue from 'vue';
  import uCharts from '@/components/u-charts/u-charts';

  export default {
    props: ['background', 'klineList'],
    data() {
      return {
        chart: null,
        chart2: null,
        cWidth: '',
        cHeight: '',
        cHeight2: '',
        pixelRatio: 1,
        itemCount: 40, //x轴单屏数据密度
        sliderMax: 50,
        chartData: null,
        chartData2: null
      };
    },
    watch: {
      klineList: {
        handler(newVal) {
          setTimeout(() => {
            this.initChartData1(newVal);
            this.initChartData2(newVal);
            this.chart.updateData(this.chartData);
            this.chart2.updateData(this.chartData2);
          });
        },
        immediate: true,
        deep: true
      }
    },
    methods: {
      // 绘制k线图
      drawChart(canvasId) {
        this.chart = new uCharts({
          $this: this,
          canvasId: canvasId,
          type: 'candle',
          fontSize: 10,
          padding: [15, 15, 0, 15],
          legend: {
            show: true,
            padding: 5,
            lineHeight: 11,
            margin: 8,
            fontColor: '#B6BEC8'
          },
          // dataLabel: false,
          // dataPointShape: false,
          background: this.background ? '#fff' : '#17202E',
          pixelRatio: this.pixelRatio,
          enableMarkLine: true,
          categories: this.chartData.categories,
          series: this.chartData.series,
          animation: false,
          enableScroll: true,
          xAxis: {
            disableGrid: true,
            labelCount: 4,
            itemCount: this.itemCount,
            scrollShow: false,
            scrollAlign: 'right'
          },
          yAxis: {
            gridType: 'dash',
            disableGrid: false,
            splitNumber: 5,
            gridColor: '#444',
            format: num => num.toFixed(0)
          },
          width: this.cWidth * this.pixelRatio,
          height: this.cHeight * this.pixelRatio,
          dataLabel: false,
          dataPointShape: true,
          extra: {
            candle: {
              color: {
                upLine: '#D85B36',
                upFill: '#D85B36',
                downLine: '#2fc25b',
                downFill: '#2fc25b'
              },
              average: {
                show: true,
                name: ['MA5', 'MA10', 'MA30'],
                day: [5, 10, 30],
                color: ['#1890ff', '#2fc25b', '#facc14']
              }
            },
            tooltip: {
              bgColor: '#000000',
              bgOpacity: 0.7,
              gridType: 'dash',
              dashLength: 5,
              gridColor: '#1890ff',
              fontColor: '#FFFFFF',
              horizentalLine: true,
              xAxisLabel: true,
              yAxisLabel: true,
              labelBgColor: '#DFE8FF',
              labelBgOpacity: 0.95,
              labelAlign: 'left',
              labelFontColor: '#666666'
            }
          }
        });
      },
      // 绘制k线图相关的柱状图
      drawChart2(canvasId) {
        this.chart2 = new uCharts({
          $this: this,
          canvasId: canvasId,
          type: 'column',
          padding: [15, 15, 0, 15],
          legend: {
            show: false
          },
          fontSize: 10,
          background: this.background ? '#fff' : '#17202E',
          pixelRatio: this.pixelRatio,
          animation: false,
          enableScroll: true,
          dataLabel: false,
          categories: this.chartData2.categories,
          series: this.chartData2.series,
          xAxis: {
            disableGrid: true,
            labelCount: 4,
            itemCount: this.itemCount,
            scrollShow: false,
            scrollAlign: 'right'
          },
          yAxis: {
            gridType: 'dash',
            disableGrid: false,
            splitNumber: 2,
            gridColor: '#444',
            min: 0,
            format: num => num.toFixed(0)
          },
          width: this.cWidth * this.pixelRatio,
          height: this.cHeight2 * this.pixelRatio,
          extra: {
            column: {
              type: 'group'
            }
          }
        });
      },
      touchCandle(e) {
        this.chart.scrollStart(e);
      },
      moveCandle(e) {
        let distance = this.chart.scroll(e);
        if (distance !== undefined) {
          this.chart2.translate(distance);
        }
      },
      touchEndCandle(e) {
        this.chart.scrollEnd(e);
        //下面是toolTip事件，如果滚动后不需要显示，可不填写
        this.chart.showToolTip(e, {
          format(item, category) {
            return category + ' ' + item.name + ':' + item.data;
          }
        });
      },
      initChartData1(data) {
        let data1 = {};
        data1.categories = data.map(item => String(item.createTime2));
        data1.series = [];
        data1.series[0] = {};
        data1.series[0].data = [];
        data.forEach(item => {
          data1.series[0].data.push([item.open, item.close, item.low, item.high]);
        });
        this.chartData = data1;
      },
      initChartData2(data) {
        let data2 = {};
        data2.categories = data.map(item => String(item.createTime2));
        data2.series = [];
        data2.series[0] = {};
        data2.series[0].data = [];
        data2.series[0].data = data.map(item => item.qty);
        this.chartData2 = data2;
      }
    },
    mounted() {
      this.cWidth = uni.upx2px(750);
      this.cHeight = uni.upx2px(500);
      this.cHeight2 = uni.upx2px(200);

      // 初始化k线图数据
      this.initChartData1(this.klineList);
      this.initChartData2(this.klineList);

      this.drawChart('canvas');
      this.drawChart2('canvasColumn');
    },
    destroyed() {
      this.chart = null;
    }
  };
</script>

<style lang="scss" scoped>
  .chartsBox {
    width: 100%;
    height: 500rpx;

    .charts1 {
      background: #17202e;
    }

    .charts1.background {
      background: #fff;
    }
  }

  .chartsBox2 {
    width: 100%;
    height: 200rpx;
    overflow: hidden;

    .charts2 {
      background: #17202e;
    }

    .charts2.background {
      background: #fff;
    }
  }
</style>
