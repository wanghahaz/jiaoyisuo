<template>
  <view class="entrust_contract">
    <scroll-view class="scrollView" :scroll-y="'true'" @scrolltolower="scroll">
      <view v-for="(item, ind) in list" :key="ind" class="list" @click="toRouter('/pages/contract/entrustContent', { id:item.id})">
        <view class="box_content">
          <view class="left_content">
            <text>{{ item.contractName }}</text>
            <image v-if="item.buyOrSell == 1" class="img_" src="../../../static/images/wallet/buy.png" mode=""></image>
            <image v-else class="img_" src="../../../static/images/wallet/sell.png" mode=""></image>
          </view>
          <text class="text_">{{ status[item.status] }}</text>
        </view>
        <text class="time">{{ item.createTime }}</text>
        <view class="num_content mb">
          <text class="num_text left">委托总量 {{ item.qty }}张</text>
          <text class="num_text">委托价格 {{ item.price }}sc</text>
        </view>
        <view class="num_content">
          <text class="num_text left">已成交量{{item.main}}张</text>
          <!-- <text class="num_text">成交均价 0sc</text> -->
        </view>
      </view>
      <view v-if="list.length==0&&reset" class="nomore">您还没有委托记录~</view>
      <view v-if="list.length!=0&&!load" class="nomore">已加载全部</view>
      <view class="clear"></view>
    </scroll-view>
  </view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import * as myAxios from '@/api/contract_api.js';
import { toast, loading, model, fn } from '@/common/common.js';
export default {
  name: 'entrustContract',
  data() {
    return {
      page: {
        pageNum: 1,
        pageSize: 10
      },
      status: {
        '-1': '已撤单',
        '0': '已下单',
        '1': '待撮合',
        '2': '撮合中',
        '3': '已完成'
      },
      list: [],
      load: true,
      reset:false,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      loading(1, '加载中...');
      myAxios.entrustList(this.page).then(res => {
        loading(2);
        this.reset =true
        if (res.code == 1) {
          res.data.list.forEach(item =>{
            item.main  =(item.main/1).toFixed(1)
          })
          this.list = [...this.list, ...res.data.list];
        }
        if (this.list.length >= res.data.total) {
          this.load = false;
        }
      });
    },
    closeMask() {
      this.maskShow = false;
    },
    scroll() {
      if (!this.load) return;
      this.page.pageNum = this.page.pageNum + 1;
      this.getList()
    },
    toRouter(url, data) {
      uni.navigateTo({
        url: url + fn.params(data)
      });
    }
  }
};
</script>

<style lang="less">
.entrust_contract {
  .scrollView {
    background: #fff;
    height: 100%;
    .clear {
      //#ifdef H5
      height: 90px;
      // #endif
    }
  }
  .nomore{
    margin: 30upx 0;
    text-align: center;
    color: #c3c3c3;
    font-size: 30upx;
  }
  .list {
    padding: 40upx 30upx;
    margin-top: 1px;
    background: #fff;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    flex-direction: column;
    .box_content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .img_ {
        margin-left: 10upx;
        width: 68upx;
        height: 32upx;
      }
      .left_content {
        display: flex;
        align-items: center;
        color: #333333;
        font-size: 32upx;
        font-weight: 700;
      }
      .text_ {
        font-size: 26upx;
        color: #999999;
      }
    }
    .time {
      margin: 20upx 0 30upx 0;
      font-size: 24upx;
      color: #999999;
    }
    .mb {
      margin-bottom: 10upx;
    }
    .num_content {
      font-size: 28upx;
      display: flex;
      .left {
        width: 40%;
      }
    }
  }
}
</style>
