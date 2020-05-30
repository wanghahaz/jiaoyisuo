<template>
  <view class="hold_contract">
    <scroll-view class="scrollView" :scroll-y="'true'" @scrolltolower="scroll">
      <view class="header">
        <text style="flex:2" class="header_">执行</text>
        <text class="header_">执行价格</text>
        <text class="header_">买/卖</text>
        <text class="header_">仓数</text>
        <!-- <text class="header_">开仓均价</text> -->
      </view>
      <view class="list_ header" v-for="(item, ind) in list" :key="ind">
        <text style="flex:2" class="header_">{{item.contractName}}</text>
        <text class="header_">{{item.price}}</text>
        <text class="header_" :class="item.buyOrSell==1? 'buy' : 'sell'">{{item.buyOrSell == 1 ? '买' : '卖' }}</text>
        <text class="header_">{{item.accountnum}}</text>
        <!-- <text class="header_">18.87</text> -->
      </view>
      <view v-if="list.length == 0 && reset" class="nomore">您还没有持仓记录~</view>
      <view v-if="list.length != 0 && !load" class="nomore">已加载全部</view>
      <view class="clear"></view>
    </scroll-view>
  </view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import * as myAxios from '@/api/contract_api.js';
import { toast, loading, model, fn } from '@/common/common.js';
export default {
  name: 'holdContract',
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      list: [],
      load: true,
      reset: false
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      loading(1, '加载中...');
      myAxios.getQuery(this.page).then(res => {
        loading(2);
        this.reset = true;
        if (res.code == 1) {
          this.list = [...this.list, ...res.data.list];
        }
        if (this.list.length >= res.data.total) {
          this.load = false;
        }
      });
    },
    scroll() {
      if (!this.load) return;
      this.page.pageNum = this.page.pageNum + 1;
      this.getList();
    }
  }
};
</script>

<style lang="scss">
.hold_contract {
  .nomore {
    margin: 30upx 0;
    text-align: center;
    color: #c3c3c3;
    font-size: 30upx;
  }
  .scrollView {
    background: #fff;
    height: 100%;
    .clear {
      //#ifdef H5
      height: 90px;
      // #endif
    }
  }
  .header {
    line-height: 72upx;
    font-size: 30upx;
    color: #999;
    display: flex;
    .header_ {
      flex: 1;
      text-align: center;
    }
  }
  .list_ {
    border-top: 1px solid #f5f5f5;
    line-height: 112upx;
    color: #333;
    .buy {
      color: #00c188;
    }
    .sell {
      color: #fa3354;
    }
  }
}
</style>
