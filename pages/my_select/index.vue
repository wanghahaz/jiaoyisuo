<template>
  <view class="my_selectbox">
    <view class="v_centent" v-if="type == 2">
      <view class="v_header flex item_list">
        <view><text>币对名称</text></view>
        <view @click="editsort"><text>最新成交价</text></view>
        <!-- <uni-icons size="15" color="#534DFF" :type="sort==1?'arrowthinup':'arrowthindown'"/> -->
        <view><text>涨跌幅</text></view>
      </view>
      <view class="item_list flex" v-for="(item, ind) in list" :key="ind">
        <view>
          <text>{{ item.instrument_id }}</text>
          <text class="base_volume">成交量:{{ (item.base_volume_24h / 1).toFixed(2) }}</text>
        </view>
        <view>
          <text>$ {{ item.last || item.last.toFixed(2) }}</text>
        </view>
        <view class="v_box">
          <text :class="((item.last - item.open_24h) / item.open_24h) * 100 > 0 ? 'up' : 'fall'">{{ (((item.last - item.open_24h) / item.open_24h) * 100).toFixed(2) + '%' }}</text>
        </view>
      </view>
    </view>
    <view v-if="type == 1" class="thead">
      <text style="width:30%;text-align: left">名称</text>
      <text style="width:25%">最新(USDT)</text>
      <text style="width:24%">涨跌</text>
      <text style="width:21%;text-align: right">涨幅</text>
    </view>
    <view class="content" v-if="type == 1">
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
let data = [
  {
    best_ask: '237.19',
    best_bid: '237.18',
    instrument_id: 'ETH-USDT',
    product_id: 'ETH-USDT',
    last: '237.2',
    last_qty: '0.021077',
    ask: '237.19',
    best_ask_size: '13.791087',
    bid: '237.18',
    best_bid_size: '71.827083',
    open_24h: '249.34',
    high_24h: '253.84',
    low_24h: '224.3',
    base_volume_24h: '635767.921973',
    timestamp: '2020-06-03T08:06:56.048Z',
    quote_volume_24h: '151150712.62'
  }
];
let timers = null;
import { indexPage } from '@/api/index_api';
import * as myAjax from './index.js';
import uniIcons from '@/components/uni-icons/uni-icons.vue';
export default {
  data() {
    return {
      sort: 1,
      load: 1,
      currentTabIndex: 1,
      mineList: [],
      list: [],
      type: 1
    };
  },
  components: {
    uniIcons
  },
  onLoad() {
    // uni.hideTabBar()
  },
  beforeDestroy() {},
  onHide() {
    clearInterval(timers);
  },
  methods: {
    editsort() {
      this.sort = this.sort == 1 ? 2 : 1;
    },
    times() {
      timers = setInterval(() => {
        this.getApp();
      }, 3000);
    },
    async getApp() {
      let that = this;
      if (this.load) {
        uni.showLoading({
          title: '加载中'
        });
      }
      // let list = await myAjax.Ajax0();
      // let list1 = await myAjax.Ajax1();
      // let list10 = await myAjax.Ajax10();
      // let list2 = await myAjax.Ajax2();
      // let list3 = await myAjax.Ajax3();
      // let list4 = await myAjax.Ajax4();
      // let list11 = await myAjax.Ajax11();
      // let list5 = await myAjax.Ajax5();
      // let list6 = await myAjax.Ajax6();
      // let list7 = await myAjax.Ajax7();
      // let list8 = await myAjax.Ajax8();
      // let list9 = await myAjax.Ajax9();
      // uni.hideLoading()
      // this.load= 0;
      // this.list = [list,list10, list1, list2, list3, list4,list11, list5, list6, list7, list8, list9];
      Promise.all([myAjax.Ajax0(), myAjax.Ajax1(),myAjax.Ajax10(), myAjax.Ajax2(), myAjax.Ajax3(), myAjax.Ajax4(), myAjax.Ajax5(),myAjax.Ajax11(), myAjax.Ajax6(), myAjax.Ajax7(), myAjax.Ajax8(), myAjax.Ajax9()])
        .then(res => {
          console.log(res);
          that.list = res;
          that.load = 0;
          uni.hideLoading();
          //所有请求都成功后执行函数
        })
        .catch((err) => {
          console.log(err)
          that.load = 0;
          uni.hideLoading();
          uni.showToast('加载失败');
          //// 异常处理
        });
    },
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
  onShow() {
    /* #ifdef H5 */
    this.type = 1;
    // let indexData = await indexPage();
    // this.mineList = indexData.data.userMaketList;
    /* #endif */

    /* #ifdef APP-PLUS */
    this.type = 2;
    this.getApp();
    this.times();
    /* #endif */
  }
};
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}
.v_header {
  margin-top: 1px;
}
.ellips {
  overflow: hidden;
  text-overflow: ellipsis;
}
.v_centent {
  .item_list {
    padding: 30upx 5%;
    border-bottom: 1px solid #f5f5f5;
    justify-content: space-between;
    font-size: 34upx;
    > view {
      display: flex;
      // flex: 1;
      width: 33%;
      align-items: center;
    }
    > view:nth-of-type(1) {
      flex-direction: column;
      align-items: flex-start;
      text,
      view {
        width: 100%;
        @extend .ellips;
      }
    }
    > view:nth-of-type(2) {
      justify-content: center;
    }
    > view:nth-of-type(3) {
      justify-content: flex-end;
    }
    .base_volume {
      margin-top: 4upx;
      font-size: 22upx;
      color: #999;
    }
    .v_box {
      text {
        text-align: center;
        border-radius: 4upx;
        width: 60%;
        font-size: 30upx;
        height: 64upx;
        line-height: 64upx;
        color: #fff;
      }
      .up {
        background: #00c188;
      }
      .fall {
        background: #fa3354;
      }
    }
  }
  > view:last-child {
    border: none;
  }
}

page {
  height: 100%;
}
.my_selectbox {
  padding-bottom: 20px;
  // height: calc(100% - 4px);
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
