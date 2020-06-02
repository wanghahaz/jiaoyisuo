<template>
  <view class="content">
    <view class="tabF bb">
      <view :class="{ activeF: typeF == 3 }" @click="clickTypeF(3)">
        消费记录
        <text></text>
      </view>
      <view :class="{ activeF: typeF == 2 }" @click="clickTypeF(2)">
        转入记录
        <text></text>
      </view>
      <view :class="{ activeF: typeF == 4 }" @click="clickTypeF(4)">
        划转记录
        <text></text>
      </view>
      <view :class="{ activeF: typeF == 1 }" @click="clickTypeF(1)">
        提现记录
        <text></text>
      </view>
    </view>
    <view class="tabC bb" v-if="typeF == 1">
      <view :class="{ activeC: typeC == 0 }" @click="clickTypeC(0)">
        全部
        <text></text>
      </view>
      <view :class="{ activeC: typeC == 1 }" @click="clickTypeC(1)">
        成功
        <text></text>
      </view>
      <view :class="{ activeC: typeC == 2 }" @click="clickTypeC(2)">
        审核
        <text></text>
      </view>
      <view :class="{ activeC: typeC == 3 }" @click="clickTypeC(3)">
        失败
        <text></text>
      </view>
    </view>
    <scroll-view class="scrollView" scroll-y="true" @scrolltolower="scroll">
      <view class="enterList" v-if="typeF == 2 || typeF == 3">
        <view class="enterItem bb pd23" v-for="(val, index) in list" :key="index">
          <view class="center">
            <view class="center_left">
              <text class="btnBuy" :class="val.type == 1 ? 'buy' : 'sell'" v-if="typeF == 3">{{ val.type == 1 ? '买入' : '卖出' }}</text>
              <text v-if="typeF == 3">{{ val.cnName }} {{ val.shortName }}</text>
              <text v-else>{{ 'SC' }}</text>
            </view>
            <view>{{ val.transfer || val.money + ' sc' }}</view>
          </view>
          <view>{{ val.updateTime || val.createTime }}</view>
        </view>
        <view class="noMore" v-show="typeF == 2">没有更多数据了</view>
      </view>
      <view class="outList transferLogs" v-else-if="typeF == 4">
        <view class="outItem" v-for="(val, index) in list" :key="index">
          <view>{{ fromAccount[val.fromAccount] }} 转到 {{ fromAccount[val.toAccount] }}</view>
          <view class="">
            <text>转入时间:</text>
            <text>{{ val.time }}</text>
          </view>
          <view class="">
            <text>转入金额:</text>
            <text>{{ val.transferMoney.toFixed(2) }}</text>
          </view>
        </view>
      </view>
      <view class="outList" v-else>
        <view class="outItem" v-for="(val, index) in list" :key="index">
          <view class="top">
            <view>
              <text class="btnBuy" :class="status[val.status]">
                {{ val.status == -3 || val.status == -2 || val.status == -1 ? '失败' : val.status == 0 || val.status == 1 ? '审核中' : '成功' }}
              </text>
              <text class="weight">{{ val.shortName }}</text>
            </view>
            <view class="weight">数量：{{ val.qty }}</view>
          </view>
          <view class="btm">
            <view>{{ val.createTime }}</view>
            <view class="weight">金额：{{ val.qty }}</view>
          </view>
        </view>
      </view>
      <view class="noMore" v-show="typeF == 1">没有更多数据了</view>
      <uni-load-more v-if="typeF == 3 || typeF == 4" :status="more"></uni-load-more>
    </scroll-view>
  </view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

import { timestampToTime} from '@/common/timestampToTime.js';
import { toast, loading, fn } from '@/common/common.js';
import { rechargeList, withdrawList, integralRecord, ordersRecord, getAccount } from '@/api/wallet_api.js';
export default {
  components: {
    uniLoadMore
  },
  data() {
    return {
      fromAccount: {
        '1': '期权合约账户',
        '2': '永续合约账户',
        '3': '交割合约账户',
        '4': '币币账户'
      },
      status: {
        '-3': 'error',
        '-2': 'error',
        '-1': 'error',
        '0': 'pending',
        '1': 'pending',
        '2': 'succ',
        '3': 'succ',
        '4': 'succ'
      },
      typeF: 3,
      typeC: 0,
      page: 1,
      isLast: false,
      more: 'loading',
      list: []
    };
  },
  async onLoad() {
    this.ordersRecord();
  },
  methods: {
    scroll() {
      if (this.more == 'more') {
        this.page++;
        this.ordersRecord();
      }
    },
    async ordersRecord() {
      loading(1, '加载中');
      this.more = 'loading';
      let res = null;
      if (this.typeF == 4) {
        res = await getAccount({ pageNum: this.page, pageSize: 10 });
      } else {
        res = await ordersRecord({ status: '0,1,2,3', pageNo: this.page, pageSize: 10 });
      }
      if(res.data.list){
        res.data.list.forEach(item=>{
          if(item.createTime){
            this.$set(item,'time',timestampToTime(item.createTime,'date'))
          }
        })
      }
      res.code == 1 ? (this.page == 1 ? (this.list = res.data.list) : (this.list = [...this.list, ...res.data.list])) : (this.list = []);
      res.data.pages > this.page ? (this.more = 'more') : (this.more = 'noMore');
      loading(2);
    },
    //切换类型
    async clickTypeF(type) {
      if (this.typeF != type) {
        this.page = 1;
        this.list = [];
        loading(1, '加载中');
        this.typeF = type;
        this.typeC = 0;
        this.page = 1;
        if (type == 1) {
          let res = await withdrawList({});
          loading(2);
          res.code == 1 ? (this.list = res.data.list) : (this.list = []);
        } else if (type == 2) {
          let res = await integralRecord({});
          loading(2);
          res.code == 1 ? (this.list = res.data.list) : (this.list = []);
        } else if (type == 4) {
          this.ordersRecord();
        } else {
          this.page = 1;
          this.ordersRecord();
        }
      }
    },
    async clickTypeC(type) {
      if (this.typeC != type) {
        this.typeC = type;
        // this.typeC = 0;
        this.page = 1;
        if (type == 0) {
          let resListData = await withdrawList({});
          this.list = resListData.data.list;
        } else if (type == 1) {
          let resListData = await withdrawList({
            status: '2,3,4'
          });
          this.list = resListData.data.list;
        } else if (type == 2) {
          let resListData = await withdrawList({
            status: '0,1'
          });
          this.list = resListData.data.list;
        } else {
          let resListData = await withdrawList({
            status: '-3,-2,-1'
          });
          this.list = resListData.data.list;
        }
      }
    }
  }
};
</script>

<style lang="scss">
page {
  background: #fff;
}
.noMore {
  text-align: center;
  font-size: 30upx;
  color: rgb(119, 119, 119);
  line-height: 50px;
}
.status {
  width: 88upx;
  line-height: 32upx;
  height: 32upx;
  font-size: 20upx;
  text-align: center;
  border-radius: 2px;
  color: #fff;
  margin: auto 10upx auto 0;
}
.scrollView {
  width: 100%;
  position: fixed;
  height: calc(100% - 96upx);
}
.tabF {
  height: 96upx;
  display: flex;
  text-align: center;
  align-items: center;
  font-size: 28upx;
  > view {
    width: 50%;
    text {
      display: block;
      width: 54upx;
      height: 4upx;
      background: #fff;
      margin: 10upx auto 0;
    }
  }
  .activeF {
    font-weight: 600;
    color: #534dff;
    text {
      background: #534dff;
    }
  }
}
.tabC {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: space-between;
  font-size: 28upx;
  > view {
    padding: 20upx 30upx;
    text {
      display: block;
      width: 54upx;
      height: 4upx;
      background: #fff;
      margin: 10upx auto 0;
    }
  }
  .activeC {
    font-weight: 600;
    color: #534dff;
    text {
      background: #534dff;
    }
  }
}
.enterList {
  .enterItem {
    font-size: 24upx;
    .center_left {
      display: flex;
    }
    > view:first-child {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 32upx;
      font-weight: 600;
      color: $uni-text-color;
      .btnBuy {
        @extend .status;
      }
      .buy {
        background: #00c284;
      }
      .sell {
        background: #fe3255;
      }
    }
    > view:not(:first-child) {
      font-size: 28upx;
      font-weight: 400;
      margin-top: 20upx;
      color: #999999;
    }
  }
}
.outList {
  .outItem {
    font-size: 32upx;
    border-bottom: 1px solid #f5f5f5;
    padding: 40upx 30upx;
    .weight {
      font-weight: 600;
    }
    > view {
      display: flex;
      justify-content: space-between;
    }
    .btm {
      font-size: 28upx;
      color: #999999;
    }
    .top {
      margin-bottom: 30upx;
      > view:nth-of-type(1) {
        display: flex;
      }
      .succ {
        background: #534dff;
      }
      .pending {
        background: #d1d3d8;
      }
      .error {
        background: #fa3354;
      }
      .btnBuy {
        @extend .status;
      }
    }
  }
}
.transferLogs {
  .outItem {
    > view {
      margin-bottom: 10upx;
      justify-content: flex-start;
      font-size: 28upx;
      > text {
        margin-right: 20upx;
      }
    }
    > view:nth-of-type(3) {
      margin: 0;
    }
  }
}
</style>
