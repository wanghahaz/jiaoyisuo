<template>
  <view class="entrust_content" v-if="data">
    <view class="header">
      <text>{{status[data.status]}}</text>
      <text>{{data.createTime}}</text>
    </view>
    <view class="title">
      <view>
        <text>{{data.contractName}}</text>
        <image v-if="data.buyOrSell==1" class="img_" src="../../static/images/wallet/buy.png" mode=""></image>
        <image v-else class="img_" src="../../static/images/wallet/sell.png" mode=""></image>
      </view>
      <text>{{status[data.status]}}</text>
    </view>
    <view class="entrust_list">
      <view>
        <text>委托类型</text>
        <text>限价委托</text>
      </view>
      <view>
        <text>已成交量</text>
        <text>{{data.allreadyqty}}</text>
      </view>
      <view>
        <text>委托总量</text>
        <text>{{data.qty}}</text>
      </view>
     <!-- <view>
        <text>成交均价</text>
        <text>成交均价</text>
      </view> -->
      <view>
        <text>委托价格</text>
        <text>{{(data.price/1).toFixed(2)}}</text>
      </view>
      <view>
        <text>手续费</text>
        <text>{{(data.fee/1).toFixed(2)}}</text>
      </view>
    </view>
    <view v-if="data.contractTradesListVos.length>0" class="title">
      <view><text>成交明细</text></view>
    </view>
    <view v-if="data.contractTradesListVos.length>0" class="entrust_list entrust_time">
      <view>
        <text>时间</text>
        <text>data.contractTradesListVos[0].createTime</text>
      </view>
      <view>
        <text>成交价</text>
        <text>data.contractTradesListVos[0].price</text>
      </view>
      <view>
        <text>成交量</text>
        <text>data.contractTradesListVos[0].qty</text>
      </view>
    </view>
  </view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import * as myAxios from '@/api/contract_api.js';
import { toast, loading, model, fn } from '@/common/common.js';
export default {
  name: '',
  data() {
    return {
      status: {
        '-1': '已撤单',
        '0': '已下单',
        '1': '待撮合',
        '2': '撮合中',
        '3': '已完成'
      },
      id: 0,
      data: null
    };
  },
  onLoad(e) {
    this.id = e.id;
    this.getData(this.id);
  },
  onShow() {},
  methods: {
    getData(id) {
      loading(1, '加载中...');
      myAxios.entrustList({ id: id }).then(res => {
        loading(2);
        this.data = res.data.list[0];
      });
    }
  }
};
</script>

<style lang="scss">
$col99: #999;
$col33: #333;
$fs14: 28upx;
$fs15: 30upx;
$fs16: 32upx;
$bg: #fff;
.flex_bet {
  display: flex;
  justify-content: space-between;
}
.entrust_content {
  > view {
    background: $bg;
    padding: 0 4%;
  }
  .entrust_list {
    font-size: $fs15;
    color: $col99;
    padding: 40upx 4%;
    margin-top: 1px;
    > view {
      @extend .flex_bet;
      margin-bottom: 40upx;
      > text:nth-of-type(2) {
        color: $col33;
      }
    }
    > view:nth-last-of-type(1) {
      margin: 0;
    }
  }
  .entrust_time {
    > view {
      justify-content: flex-start;
      > text:nth-of-type(1) {
        width: 200upx;
      }
    }
  }
  .title {
    margin-top: 20upx;
    font-size: $fs16;
    height: 108upx;
    @extend .flex_bet;
    align-items: center;
    font-weight: 700;
    > view {
      display: flex;
      align-items: center;
    }
    > text {
      color: $col99;
      font-size: 28upx;
      font-weight: 500;
    }
    .img_ {
      margin-left: 20upx;
      width: 68upx;
      height: 32upx;
    }
  }

  .header {
    margin-top: 1px;
    @extend .flex_bet;
    align-items: center;
    height: 110upx;
    text:nth-of-type(1) {
      font-size: $fs16;
    }
    text:nth-of-type(2) {
      font-size: 24upx;
      color: $col99;
    }
  }
}
</style>
