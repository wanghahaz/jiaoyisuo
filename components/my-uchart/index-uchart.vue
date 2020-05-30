<template>
  <view class="box"><canvas canvas-id="canvas" id="canvas" class="charts"></canvas></view>
</template>

<script>
import Vue from 'vue';
import uCharts from '@/components/u-charts/u-charts';
import { toast, loading, fn } from '@/common/common.js';
export default {
  props: ['chartData'],
  data() {
    return {
      domo: {},
      chart: null,
      cWidth: '',
      cHeight: '',
      pixelRatio: 1,
      klineList: [],
      marketInfo: null,
      data: {}
    };
  },
  watch: {
    chartData: {
      handler(data, oldData) {
        setTimeout(() => {
          // this.$nextTick(() => {
          this.klineList = data.klineList;
          this.initChartData(this.klineList);
          this.marketInfo = data.marketInfo;
          if (this.chart) {
            this.chart.updateData(this.data);
          } else {
            this.drawChart('canvas');
          }
          // });
        }, 1000);
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    drawChart(canvasId) {
      this.chart = new uCharts({
        $this: this,
        canvasId: canvasId,
        type: 'area',
        fontSize: 10,
        padding: [0, 40, 0, 0],
        legend: {
          show: false
        },
        enableMarkLine: false,
        dataLabel: false,
        dataPointShape: false,
        background: '#fff',
        pixelRatio: this.pixelRatio,
        categories: this.data.categories,
        series: this.data.series,
        animation: false,
        xAxis: {
          disableGrid: true,
          labelCount: 3,
          boundaryGap: 'justify',
          axisLine: false
        },
        yAxis: {
          disableGrid: false,
          gridType: 'dash',
          gridColor: '#ccc',
          position: 'right',
          dashLength: 8,
          splitNumber: 6,
          min: 0,
          max: 80,
          format(num) {
            if (num == 0) {
              return '';
            } else {
              return num.toFixed(0);
            }
          }
        },
        width: this.cWidth * this.pixelRatio,
        height: this.cHeight * this.pixelRatio,
        extra: {
          area: {
            type: 'straight',
            opacity: 0.2,
            addLine: true,
            width: 1
          }
        }
      });
    },
    initChartData(data) {
      let data1 = {};
      data1.categories = data.map(item => String(item.createTime2));
      data1.series = [];
      data1.series[0] = {};
      data1.series[0].data = [];
      data1.series[0].color = '#534DFF';
      data.forEach(item => {
        data1.series[0].data.push(item.close);
      });
      this.data = data1;
    }
  },
  mounted() {
    // 由于此组件共用,防止多次创建socket连接,载入时必须先关闭连接再初始化
    // loading(1,'加载中')
    this.cWidth = uni.upx2px(750);
    this.cHeight = uni.upx2px(450);
  },
  destroyed() {
    this.chart = null;
  }
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
}
.charts {
  background: #fff;
  width: 100%;
  height: 450rpx;
}
</style>
