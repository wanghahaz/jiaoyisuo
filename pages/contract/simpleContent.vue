<template>
  <view class="simple_content">
    <view class="header">
      <view>
        <text>锦绣山河 - 20200312 - 32 - B</text>
        <text>¥9823.14</text>
      </view>
      <view>
        <text>成本较高</text>
        <text>风险适中</text>
      </view>
      <text>适用于在2天内会10230.12突破的情况</text>
      <text>成本适中，盈利可能性较高，盈利幅度相对较小</text>
    </view>
    <text class="time">买入期权，2020年4月12日到期时，收益曲线如下</text>
    <view class="echarts"><u-charts :extraType="opt.extraType" :chartType="opt.chartType" :canvasId="'c1'" :opts="opt" /></view>
    <text class="explain">到期时，锦绣山河（238940）指数涨过¥1278即可盈利，涨的越高盈利越多，盈利无上限 到期时，若走势与预期不同，最多亏损权费，亏损有上限</text>
    <view class="btn">
      <view class="goback" @click="goBack">重新选择期权</view>
      <view @click="reLaunch('/pages/contract/index')">购买期权</view>
    </view>
  </view>
</template>

<script>
import uCharts from '@/components/u-charts/component.vue';
var LineA = { enableScroll: true, extraType: 'curve', line: { width: 10 } };
LineA.chartType = 'line';
LineA.categories = ['04-10', '04-13', '04-14', '04-15', '04-16', '04-17']; //result.data.LineA.categories
LineA.series = [
  {
    color: '#000000',
    name: '成交量C',
    data: [100, 80, 0, 0, 0, 0]
  }
]; //result.data.LineA.series
export default {
  data() {
    return {
      opt: LineA
    };
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    reLaunch(url) {
      uni.setStorageSync('id','我是存在的')
      uni.reLaunch({
        url: url
      });
    }
  },
  components: { uCharts }
};
</script>

<style lang="scss">
$fs14: 28upx;
$cl99: #999;
$cl33: #333;
.simple_content {
  .echarts {
    width: 92%;
    margin: 20upx auto;
  }
  height: calc(100% - 1px);
  margin-top: 1px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: $fs14;
  padding-top: 40upx;
  .btn {
    position: fixed;
    bottom: 60upx;
    left: 4%;
    width: 92%;
    height: 76upx;
    line-height: 76upx;
    display: flex;
    justify-content: space-between;
    view {
      width: 47%;
      border-radius: 8upx;
      text-align: center;
    }
    > view:nth-of-type(1) {
      border: 1px solid #524cff;
      color: #524cff;
    }
    > view:nth-of-type(2) {
      color: #fff;
      background: #524cff;
    }
  }
  .time {
    display: inline-block;
    color: $cl33;
    width: 90%;
  }
  .explain {
    color: $cl99;
    width: 90%;
  }
  .header {
    border: 1px solid #efefef;
    padding: 40upx 20upx;
    display: flex;
    flex-direction: column;
    width: 84%;
    margin: 0 auto 40upx auto;
    > view:nth-of-type(1) {
      display: flex;
      justify-content: space-between;
      > text:nth-of-type(2) {
        color: #fa3354;
      }
    }
    > view:nth-of-type(2) {
      margin: 16upx 0;
      display: flex;
      color: $cl99;
      text {
        width: 96upx;
        height: 32upx;
        margin-right: 20upx;
        line-height: 32upx;
        text-align: center;
        font-size: 20upx;
        background: #f7f8fa;
        border-radius: 4upx;
      }
    }
    > text:nth-of-type(1) {
      margin: 0 0 16upx 0;
      font-size: 24upx;
      color: $cl33;
    }
    > text:nth-of-type(2) {
      font-size: 24upx;
      color: $cl99;
    }
  }
}
</style>
