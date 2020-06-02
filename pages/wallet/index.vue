<template>
  <view class="content">
    <view class="main">
      <view class="bg">
        <image src="../../static/images/bg_3.png"></image>
        <view class="assets">
          <view class="bill" @click="jumpBill">
            <image src="../../static/images/bill_1.png"></image>
            <text>账单</text>
          </view>
          <view class="txt"><text>账户总资产</text></view>
          <view class="txt txtBtc" style="margin-bottom: 20upx;">
            {{ total.totalBanlance || 0 }}
            <text>SC</text>
          </view>
          <!-- <text class="withdraw" @click="jump('/pages/wallet/withdrawMoney', { coidId: total.coidId, qty: total.scBanlance })">提现</text> -->
          <view  class="myinfo">
            <view v-if="total.scTotalBanlance||(total.scTotalBanlance==0)" class="">
              <text>资金余额</text>
              <text>{{ total.scTotalBanlance.toFixed(2) }}</text>
            </view>
            <image @click="jump('/pages/contract/moneyMove',{})" src="../../static/images/wallet/huazhuan.png" mode=""></image>
            <view v-if="total.contractAccountBalances||( total.contractAccountBalances==0)" class="">
              <text>合约余额</text>
              <text>{{ total.contractAccountBalances.toFixed(2) }}</text>
            </view>
          
          </view>
        </view>
      </view>
      <view class="list bcf">
      
        <view class="title">
          <text style="width: 30%">名称/代码</text>
          <text style="width: 40%;text-align: center;">产品数量/可卖数量</text>
          <text style="width: 30%;text-align: right;">现价</text>
        </view>
        <view class="listItem bb" v-for="(item, index) in coinList" :key="index">
          <view class="name" style="width: 30%">
            <text>{{ item.coinCnName }}</text>
            <text>{{ item.shortName }}</text>
          </view>
          <text class="ellips" style="width: 40%;text-align: center;">{{ item.totalBanlance }}/{{ item.banlance }}</text>
          <text style="width: 30%;text-align: right;">{{ item.lastTradePrice }}</text>
        </view>
      </view>
    </view>
    <!-- <tab-bar :current="currentTabIndex"></tab-bar> -->
  </view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import { propertyList } from '@/api/wallet_api.js';
import QSTabs from '@/components/QS-tabs/QS-tabs';
import { toast, loading, fn } from '@/common/common.js';
export default {
  components: {
    uniIcons,
    QSTabs
  },
  data() {
    return {
      currentTabIndex: 2,
      ifOnShow: false,
      tabs: ['持仓', '买入', '卖出', '撤单', '查询'],
      currentTab: 0,
      data: {},
      total: {}, //资产详情
      coinList: [] //资产列表
    };
  },
  onReachBottom(e) {
    console.log(1);
  },
  onLoad() {},
  onShow() {
    this.propertyList();
  },
  // 监听右上角按钮
  onNavigationBarButtonTap() {
    this.jump('/pages/wallet/withdrawMoney', { coidId: this.total.coidId, qty: this.total.scBanlance || '0' });
  },
  methods: {
    propertyList() {
      loading(1, '加载中');
      propertyList({ type: 2 }).then(res => {
        loading(2);
        if (res.code == 1) {
          this.total = res.data.total;
          this.coinList = res.data.coinList;
        }
      });
    },
    changeTab(index) {
      this.currentTab = index;
    },
    // 添加资产
    jumpAdd() {
      uni.navigateTo({
        url: './addAssets'
      });
    },
    jump(url, data) {
      uni.navigateTo({
        url: url + fn.params(data)
      });
    },
    // 充值
    jumpPay(id, name) {
      uni.navigateTo({
        url: './payCode?id=' + id + '&name=' + name
      });
    },
    // 提现
    jumpGetM(id, max, name) {
      uni.navigateTo({
        url: './getMoney?id=' + id + '&max=' + max + '&name=' + name
      });
    },
    // 交易
    jumpExchange(id) {
      uni.navigateTo({
        url: '/pages/basic/exchange/index?id=' + id
      });
    },
    //账单
    jumpBill() {
      uni.navigateTo({
        url: './bill'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import './assets.css';
.content {
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 50px;
  .tabs {
    background-color: #fff;
  }

  .main {
    flex: 1;
    overflow-y: auto;
    .bg {
      position: relative;
      z-index: 1;
      > image {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: -1;
      }
      .assets {
        width: 100%;
        height: 100%;
        padding: 10px 15px 15px 15px;
        > text {
          display: block;
          color: #fff;
          font-size: 12px;
          text-align: center;
        }
        .bill {
          font-size: 30upx;
          color: #fff;
          text-align: right;
          // margin-bottom: 20upx;
          image {
            width: 22upx;
            height: 24upx;
            margin-right: 16upx;
          }
        }
        .txt {
          // margin-bottom: 10upx;
          color: #fff;
          font-size: 24upx;
          text-align: center;
          image {
            width: 30upx;
            height: 20upx;
            margin-left: 6upx;
            padding: 0 20upx;
          }
        }
        .txtBtc {
          font-size: 48upx;
          padding: 4px 0;
          text {
            padding-left: 8px;
            font-size: 28rpx;
          }
        }
        .withdraw {
          width: 96rpx;
          height: 40rpx;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 3px 6px 0px rgba(52, 46, 226, 0.5);
          border-radius: 2px;
          color: rgba(83, 77, 255, 1);
          font-size: 24rpx;
          line-height: 40rpx;
          font-weight: 500;
          margin: 10rpx auto 20rpx auto;
        }
        .myinfo {
          width: 90%;
          margin-left: 5%;
          height: 112upx;
          background: #fff;
          border-radius: 8upx;
          display: flex;
          justify-content: space-between;
          > view {
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text {
              color: #534dff;
            }
            > text:nth-of-type(1) {
              font-size: 24upx;
            }
            > text:nth-of-type(2) {
              margin-top: 6upx;
              font-size: 36upx;
              font-weight: 700;
            }
          }
          image {
            margin: auto 0;
            flex-shrink: 0;
            width: 120upx;
            height: 80upx;
          }
        }
        // .myinfo{
        //   display: flex;
        //   justify-content: center;
        //   color: #fff;
        //   view {
        //     width: 33.33%;
        //     display: flex;
        //     flex-direction: column;
        //     flex-shrink: 1;
        //     text {
        //       flex-shrink: 1;
        //       text-align: center;
        //       width: 100%;
        //       overflow: hidden;
        //       text-overflow: ellipsis;
        //       white-space: nowrap;
        //     }
        //     text:nth-of-type(1) {
        //       font-size: 12px;
        //     }
        //     text:nth-of-type(2) {
        //       font-size: 40rpx;
        //     }
        //   }
        // }
      }
    }
    .list {
      .line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 28upx;
        padding-left: 30upx;
        text {
          margin-left: 6upx;
          font-size: 20upx;
        }
      }
      .title {
        color: #999;
        background-color: #fff;
        font-size: 12px;
        display: flex;
        padding: 10px 15px;
        border-bottom: 1px solid #f5f5f5;
        text {
          display: block;
        }
      }
      .listItem {
        display: flex;
        justify-content: center;
        font-size: 14px;
        padding: 15px;
        .name {
          > text:nth-of-type(1) {
            display: block;
            font-weight: bold;
          }
          > text:nth-of-type(2) {
            display: block;
            color: #999;
            font-size: 12px;
          }
        }
        text {
          font-weight: 500;
        }
      }
    }
  }
  .ellips {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
