<template>
  <view class="my_selectbox">
    <view class="thead">
      <text style="width:30%;text-align: left">名称</text>
      <text style="width:25%">最新(USDT)</text>
      <text style="width:24%">涨跌</text>
      <text style="width:21%;text-align: right">涨幅</text>
    </view>
    <view class="content">
      <view class="item" v-for="item in mineList" :key="item.marketId">
        <view class="maininfo" @click="gotoExchange(item.marketId)">
          <view class="name" style="width:30%;text-align: left">
            <text>{{ item.coinCnName }}</text>
            <text>{{ item.coinName }}</text>
          </view>
          <text style="width:25%">{{ item.lastTradePrice.toFixed(2) }}</text>
          <text style="width:24%">{{ item.zhangdie >= 0 ? '+' + item.zhangdie.toFixed(2) : item.zhangdie.toFixed(2) }}</text>
          <view style="width:21%" class="rise_fall" :class="{ rise: item.incRate >= 0, fall: item.incRate < 0 }">
            {{ item.incRate >= 0 ? '+' + item.incRate.toFixed(2) : item.incRate.toFixed(2) }}%
          </view>
        </view>
      </view>
      <view class="add" @click="selectCoin()">
        <text class="iconfont iconbianzu9"></text>
        <text>添加自选</text>
      </view>
    </view>
    <!-- <tab-bar :current="currentTabIndex"></tab-bar> -->
  </view>
</template>

<script>
import { indexPage } from '@/api/index_api';

export default {
  data() {
    return {
      currentTabIndex: 1,
      mineList: []
    };
  },
  onLoad() {
    // uni.hideTabBar()
  },
  methods: {
    // 点击去交易
    gotoExchange(id) {
      uni.navigateTo({
        url: '/pages/basic/exchange/index?marketId=' + id
      });
    },
    // 跳转到自选页面
    selectCoin() {
      uni.navigateTo({
        url: '/pages/basic/exchange/selectCoin'
      });
    }
  },
  onNavigationBarButtonTap() {
    uni.navigateTo({
      url: '/pages/basic/search'
    });
  },
  async onShow() {
    let indexData = await indexPage();
    this.mineList = indexData.data.userMaketList;
    // console.log(this.mineList);
  }
};
</script>

<style lang="scss" scoped>
page {
  height: 100%;
}
.my_selectbox {
  height: calc(100% - 4px);
  background-color: #fff;
  .thead {
    display: flex;
    padding: 10rpx 28rpx;
    background-color: #fff;
    margin-top: 4px;
    text {
      color: #999;
      font-size: 32rpx;
      // font-size: 32rpx;
      text-align: center;
      display: block;
    }
  }
  .content {
    background-color: #fff;
    .item {
      padding: 0 15px;
      .maininfo {
        display: flex;
        justify-content: space-between;
        padding: 15rpx 0;
        > .name {
          text {
            font-size: 16px;
            display: block;
            text-align: left;
          }
          text:nth-of-type(2) {
            font-size: 12px;
            color: #999;
          }
        }
        text {
          font-size: 18px;
          display: block;
          text-align: center;
        }
        .rise_fall {
          color: #fff;
          text-align: right;
          font-size: 15px;
          height: 54rpx;
          line-height: 54rpx;
          text-align: center;
          border-radius: 2px;
        }
        .rise_fall.rise {
          background-color: #00c188;
        }
        .rise_fall.fall {
          background-color: #fa3354;
        }
      }
      .info {
        > view {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20rpx;
          > view {
            display: flex;
            font-size: 24rpx;
            > view:nth-of-type(1) {
              margin-right: 30rpx;
              > text:nth-of-type(1) {
                display: block;
                color: #999;
                margin-bottom: 6rpx;
              }
              > text:nth-of-type(2) {
                display: block;
                color: #fa3354;
              }
            }
            > view:nth-of-type(2) {
              margin-right: 30rpx;
              > text:nth-of-type(1) {
                display: block;
                color: #999;
                margin-bottom: 6rpx;
              }
              > text:nth-of-type(2) {
                display: block;
                color: #48bea4;
              }
            }
            > view:nth-of-type(3) {
              margin-right: 30rpx;
              > text:nth-of-type(1) {
                display: block;
                color: #999;
                margin-bottom: 6rpx;
              }
              > text:nth-of-type(2) {
                display: block;
                color: #333;
              }
            }
          }
          button {
            width: 150rpx;
            height: 68rpx;
            border-radius: 4px;
            border: 1px solid #48bea4;
            background-color: #fff;
            text-align: center;
            line-height: 68rpx;
            color: #48bea4;
            font-size: 30rpx;
            margin: 0;
          }
        }
        mycom {
        }
      }
    }
    .add {
      width: 240rpx;
      height: 72rpx;
      background-color: #534dff;
      color: #fff;
      font-size: 32rpx;
      line-height: 72rpx;
      text-align: center;
      border-radius: 4px;
      margin: 0 auto;
      margin-top: 40rpx;
      > text:nth-of-type(1) {
        font-size: 24rpx;
        margin-right: 10rpx;
      }
    }
  }
}
</style>
