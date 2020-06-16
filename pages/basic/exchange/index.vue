<template>
  <view v-if="marketInfo.coinName" class="exchangeBox">
    <view class="title">
      <text>{{ marketInfo.coinCnName }}</text>
      <text>{{ marketInfo.coinName }}</text>
    </view>
    <view class="top">
      <view :class="{ up: marketInfo.incRate >= 0, down: marketInfo.incRate < 0 }">
        <text>{{ marketInfo.lastTradePrice.toFixed(2) }}</text>
        <view>
          <text style="display: block;">{{ (marketInfo.lastTradePrice - market.close).toFixed(2) }}</text>
          <text style="display: block;">{{ marketInfo.incRate.toFixed(2) }}%</text>
        </view>
      </view>
      <view>
        <view>
          <text class="label">昨收</text>
          <text>{{ market.close ? market.close.toFixed(2) : '0.00' }}</text>
        </view>
        <view>
          <text class="label">今开</text>
          <text :class="{ up: marketInfo.incRate >= 0, down: marketInfo.incRate < 0 }">{{ market.open ? market.open.toFixed(2) : '0.00' }}</text>
        </view>
        <view>
          <text class="label">最高</text>
          <text class="up">{{ marketInfo.maxPrice ? marketInfo.maxPrice.toFixed(2) : '0.00' }}</text>
        </view>
        <view>
          <text class="label">最低</text>
          <text class="down">{{ marketInfo.minPrice ? marketInfo.minPrice.toFixed(2) : '0.00' }}</text>
        </view>
        <view>
          <text class="label">换手</text>
          <text>{{ marketInfo.huanshou ? marketInfo.huanshou.toFixed(2) : '0.00' }}%</text>
        </view>
        <view>
          <text class="label">总量</text>
          <text>{{ marketInfo.zongliang ? marketInfo.zongliang.toFixed(2) : '0.00' }}</text>
        </view>
      </view>
    </view>
    <view class="chartBox">
      <view class="title">
        <view>
          <view>
            <text class="label">涨停：</text>
            <text class="up">{{ (market.close * 1.1).toFixed(2) }}</text>
          </view>
          <view>
            <text class="label">跌停：</text>
            <text class="down">{{ (market.close * 0.9).toFixed(2) }}</text>
          </view>
        </view>
        <button type="default" @click="gotoDetail">
          <image mode="widthFix" src="../../../static/images/btn_icon.png"></image>
          详情图表
        </button>
      </view>
      <view class="chart"><index-uchart class="chartdetail" :uchartData="chartData" :chartData="chartData"></index-uchart></view>
    </view>
    <view class="data">
      <view>
        <text class="label">委比</text>
        <text class="up">{{ marketInfo.weibi ? marketInfo.weibi.toFixed(2) : '0.00' }}%</text>
      </view>
      <view>
        <text class="label">委差</text>
        <text class="up">{{ marketInfo.weicha ? marketInfo.weicha.toFixed(2) : '0.00' }}</text>
      </view>
      <view>
        <text class="label">数量</text>
        <text>{{ marketInfo.shuliang ? marketInfo.shuliang : '0' }}</text>
      </view>
      <view>
        <text class="label">量比</text>
        <text class="down">{{ marketInfo.liangbi ? marketInfo.liangbi.toFixed(2) : '0.00' }}</text>
      </view>
      <view>
        <text class="label">内盘</text>
        <text class="down">{{ marketInfo.neipan ? marketInfo.neipan.toFixed(2) : '0.00' }}</text>
      </view>
      <view>
        <text class="label">外盘</text>
        <text class="up">{{ marketInfo.waipan ? marketInfo.waipan.toFixed(2) : '0.00' }}</text>
      </view>
      <view>
        <text class="label">市值</text>
        <text>{{ marketInfo.shizhi ? marketInfo.shizhi.toFixed(2) : '0.00' }}</text>
      </view>
      <view>
        <text class="label">振幅</text>
        <text>{{ marketInfo.zhenfu ? marketInfo.zhenfu.toFixed(2) : '0.00' }}%</text>
      </view>
    </view>
    <view class="bottom">
      <view class="btnbox">
        <view class="button" :class="{ active: currentTab == 0 }" @click="changetab('0')"><text>盘口</text></view>
        <view class="button" :class="{ active: currentTab == 1 }" @click="changetab('1')"><text>明细</text></view>
      </view>
      <view class="content" v-if="selldeepList.length && buydeepList.length">
        <view class="pankou" v-if="currentTab == 0">
          <view>
            <view v-for="(item, index) in selldeepList.slice(0, 5)" :key="index">
              <text class="label">卖{{ 5 - index }}</text>
              <text class="down">{{ item.price.toFixed(2) }}</text>
              <text>{{ item.qty }}</text>
            </view>
          </view>
          <view>
            <view v-for="(item, index) in buydeepList.slice(0, 5)" :key="index">
              <text class="label">买{{ index + 1 }}</text>
              <text class="up">{{ item.price.toFixed(2) }}</text>
              <text>{{ item.qty }}</text>
            </view>
          </view>
        </view>
        <view class="mingxi" v-if="currentTab == 1">
          <view>
            <view v-for="(item, index) in tradeList.slice(0, 5)" :key="index">
              <text class="label">{{ item.createTime }}</text>
              <text class="down">{{ item.price.toFixed(2) }}</text>
              <text>{{ item.qty }}</text>
            </view>
          </view>
          <view>
            <view v-for="(item, index) in tradeList.slice(5, 10)" :key="index">
              <text class="label">{{ item.createTime }}</text>
              <text class="down">{{ item.price.toFixed(2) }}</text>
              <text>{{ item.qty }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="footer">
      <view @click="jump('/pages/my_select/optional_area',{})">添加自选</view>
      <view @click="jump('/pages/basic/exchange/sellBuy', { marketId: marketId, type: 1 })">买入</view>
      <view @click="jump('/pages/basic/exchange/sellBuy', { marketId: marketId, type: 2 })">卖出</view>
    </view>
  </view>
</template>

<script>
import indexUchart from '@/components/my-uchart/index-uchart';
import { findListByMarketId } from '@/api/index_api';
import { toast, loading, fn } from '@/common/common.js';

export default {
  components: {
    indexUchart
  },
  data() {
    return {
      start: true,
      market: [],
      userInfo: {}, // 交易页面用户相关数据
      marketInfo: {}, // 当前交易对信息
      selldeepList: [], // 卖出深度数据
      buydeepList: [], // 买入深度数据
      entrustList: [], // 当前委托数据
      tradeList: [], // 最新成交数据
      myDealList: [], // 我的成交数据
      klineList: {}, // k线图数据
      currentTab: '0',
      chartData: {}
    };
  },
  methods: {
    jump(url, data) {
      if (!uni.getStorageSync('userinfo')) {
        uni.reLaunch({
          url: '/pages/login_register/login'
        });
      } else {
        uni.navigateTo({
          url: url + fn.params(data)
        });
      }
    },
    goto(url) {
      uni.switchTab({
        url: url
      });
    },
    // 初始化socket连接并处理接收的数据
    initSocket(time) {
      if (this.start) {
        loading(1, '加载中');
      }
      let userinfo = uni.getStorageSync('userinfo');
      uni.connectSocket({
        url: `ws://${this.socketURL}/websocket/topic/tradeListAndMarketOrders/${this.marketId}/5/${userinfo ? userinfo.userId + '' : null}`,
        method: 'POST',
        header: {
          lang: 'cn',
          userId: userinfo ? userinfo.userId : '',
          accessToken: userinfo ? userinfo.accessToken : ''
        }
      });
      // 处理接收到的数据
      uni.onSocketMessage(res => {
        if (this.start) {
          loading();
        }
        this.start = false;
        let data = JSON.parse(res.data);
        this.chartData = data;
        this.userInfo = data.userData;
        this.selldeepList = data.sellList;
        this.buydeepList = data.buyList;
        this.tradeList = data.tradeList;
        this.klineList = data.klineList;
        this.marketInfo = data.marketInfo;
      });
      uni.onSocketOpen(res => {
        console.log('WebSocket连接已打开！');
      });
      uni.onSocketError(err => {
        console.log('WebSocket连接打开失败，请检查！', err);
      });
      uni.onSocketClose(function(res) {
        console.log('WebSocket 已关闭！');
      });
    },
    changetab(index) {
      this.currentTab = index;
    },
    gotoDetail() {
      uni.navigateTo({
        url: '/pages/basic/exchange/chartDetail?marketId=' + this.marketId
      });
    }
  },
  onNavigationBarButtonTap() {
    uni.navigateTo({
      url: '/pages/basic/exchange/selectCoin'
    });
  },
  onShow() {
    this.initSocket();
    // #ifdef H5
    window.onbeforeunload = () => {
      uni.closeSocket();
    };
    // #endif
  },
  onLoad(opt) {
    this.marketId = opt.marketId;
    findListByMarketId({ marketId: this.marketId, minType: '30' }).then(res => {
      this.market = res.data[res.data.length - 1];
    });
  },
  onHide() {
    uni.closeSocket();
  },
  onUnload() {
    uni.closeSocket();
  }
};
</script>
<style lang="scss" scoped>
.exchangeBox:after {
  content: '';
  display: block;
  height: 70px;
}
.exchangeBox {
  background-color: #f5f5f5;
  height: 100%;
  margin-top: 1px;
  .label {
    color: #999999;
  }
  > .title {
    background-color: #fff;
    margin-bottom: 1px;
    padding-left: 40rpx;
    padding: 10px 0 10px 40rpx;
    > text {
      display: block;
    }
    > text:nth-of-type(2) {
      font-size: 12px;
      color: #999;
      margin-top: 3px;
    }
  }
  .top {
    background-color: #fff;
    padding: 10px 13px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #f5f5f5;
    > view:nth-of-type(1) {
      width: 30%;
      text-align: center;
      > text {
        display: block;
        font-size: 54rpx;
        margin-bottom: 6px;
      }
      view {
        font-size: 12px;
        display: flex;
        justify-content: center;
        > text {
          font-weight: bold;
        }
        > text:nth-of-type(1) {
          margin-right: 26rpx;
          display: block;
        }
      }
    }
    > view.up:nth-of-type(1) {
      color: #00c188;
    }
    > view.down:nth-of-type(1) {
      color: #fa3354;
    }
    > view:nth-of-type(2) {
      width: 70%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      > view {
        width: 50%;
        > text {
          font-size: 12px;
        }
        > text:nth-of-type(1) {
          margin-right: 20rpx;
        }
        > text:nth-of-type(2) {
          font-weight: bold;
        }
        > text.up {
          color: #00c188;
        }
        > text.down {
          color: #fa3354;
        }
      }
      > view:nth-of-type(even) {
        padding: 0 5px;
      }
    }
  }
  .chartBox {
    background-color: #fff;
    padding: 10px 13px;
    margin-top: 10px;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
      > view {
        display: flex;
        > view:nth-of-type(1) {
          margin-right: 50rpx;
        }
        text {
          font-size: 12px;
        }
        text:nth-of-type(2) {
          font-weight: bold;
        }
        text.up {
          color: #00c188;
        }
        text.down {
          color: #fa3354;
        }
      }
      button {
        margin: 0;
        padding: 0;
        width: 180rpx;
        height: 60rpx;
        line-height: 60rpx;
        font-size: 14px;
        background-color: #eeedff;
        border: 1px solid #534dff;
        color: #534dff;
        > image {
          display: inline-block;
          width: 20rpx;
          margin-right: 4rpx;
        }
      }
    }
  }
  .data {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    background-color: #fff;
    padding: 10px 13px;
    > view {
      width: 33.33%;
      margin-bottom: 5px;
      > text {
        font-size: 12px;
      }
      > text:nth-of-type(1) {
        margin-right: 20rpx;
      }
      > text:nth-of-type(2) {
        font-weight: bold;
      }
      > text.up {
        color: #00c188;
      }
      > text.down {
        color: #fa3354;
      }
    }
  }
  .bottom {
    margin-top: 10px;
    background-color: #fff;
    .btnbox {
      padding: 8px 0;
      > view.active {
        color: #534dff;
        > text {
          border-bottom: 2px solid #534dff;
        }
      }
      .button {
        width: 50%;
        height: 30px;
        display: inline-block;
        font-size: 14px;
        color: #999;
        line-height: 30px;
        text-align: center;
        > text {
          border-bottom: 2px solid #fff;
          padding-bottom: 4px;
        }
      }
    }
    .content {
      font-size: 12px;
      .pankou {
        display: flex;
        > view {
          width: 50%;
          > view {
            padding: 7px;
            > text {
              display: inline-block;
            }
            > text:nth-of-type(1) {
              width: 40%;
            }
            > text:nth-of-type(2) {
              width: 25%;
              font-weight: bold;
            }
            > text:nth-of-type(3) {
              width: 35%;
              text-align: right;
              font-weight: bold;
            }
            > text.up {
              color: #00c188;
            }
            > text.down {
              color: #fa3354;
            }
          }
        }
        > view:nth-of-type(1) {
          padding-right: 15px;
        }
        > view:nth-of-type(2) {
          padding-left: 15px;
        }
      }
      .mingxi {
        display: flex;
        > view {
          width: 50%;
          > view {
            padding: 7px;
            > text {
              display: inline-block;
            }
            > text:nth-of-type(1) {
              width: 50%;
            }
            > text:nth-of-type(2) {
              width: 25%;
              font-weight: bold;
            }
            > text:nth-of-type(3) {
              width: 25%;
              text-align: right;
              font-weight: bold;
            }
            > text.up {
              color: #00c188;
            }
            > text.down {
              color: #fa3354;
            }
          }
        }
        > view:nth-of-type(1) {
          padding-right: 20px;
        }
        > view:nth-of-type(2) {
          padding-left: 20px;
        }
      }
    }
  }
  .footer {
    box-shadow: 0px -3px 6px -4px #a4a4bb;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #fff;
    border-top: 1px solid #eee;
    view:nth-of-type(1) {
      width: 28%;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      border: 1px solid #666;
      color: #333;
      text-align: center;
      border-radius: 6px;
      background-color: #fff;
    }
    view:nth-of-type(2) {
      width: 28%;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      border: 1px solid #00c188;
      color: #fff;
      text-align: center;
      border-radius: 6px;
      background-color: #00c188;
    }
    view:nth-of-type(3) {
      width: 28%;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      border: 1px solid #fa3354;
      color: #fff;
      text-align: center;
      border-radius: 6px;
      background-color: #fa3354;
    }
  }
}
</style>
