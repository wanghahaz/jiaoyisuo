<template>
  <view class="contract_list">
    <view class="header">
      <image class="fixed" src="../../static/images/contract/simpleBg.png" mode=""></image>
      <text>当前锦绣山河 302913 指数</text>
      <text>1294.23</text>
    </view>
    <view class="box_content">
      <view class="img_box"><image class="simple_" src="../../static/images/contract/simple_.png" mode=""></image></view>
      <text>您认为接下来2天会上涨</text>
      <text>可以买入锦绣山河（23891）的看涨期权，到期 时拥有一约定的价格买入的权利</text>
      <view @click="toRouter('/pages/contract/simpleContent', {})" class="list_content">
        <view v-for="(item, ind) in 5" :key="ind">
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
      </view>
    </view>
  </view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import * as myAxios from '@/api/content_api.js';
import { toast, loading, model, fn } from '@/common/common.js';
export default {
  name: 'simple',
  methods: {
    toRouter(url, data) {
      uni.navigateTo({
        url: url + fn.params(data)
      });
    }
  }
};
</script>

<style lang="scss">
$fs14: 28upx;
$cl99: #999;
$cl33: #333;
.contract_list {
  .list_content {
    > view {
      border: 1px solid #efefef;
      padding: 40upx 20upx;
      display: flex;
      flex-direction: column;
      margin: 14upx 40upx 20upx 40upx;
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
  .header {
    position: relative;
    height: 390upx;
    text-align: center;
    display: flex;
    flex-direction: column;
    > text:nth-of-type(1) {
      margin: 60upx 0 10upx 0;
    }
    > text:nth-of-type(2) {
      font-size: 68upx;
    }
    text {
      position: relative;
      z-index: 9;
      font-size: $fs14;
      color: #fff;
    }
    image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  .box_content {
    position: fixed;
    left: 4%;
    bottom: 0;
    width: 92%;
    overflow-y: auto;
    font-size: $fs14;
    // #ifdef APP-PLUS
    height: calc(100% - 16%);
    // #endif
    // #ifdef H5
    height: calc(100% - 26%);
    // #endif
    background: #fff;
    border-radius: 4upx;
    display: flex;
    flex-direction: column;
    .img_box {
      display: flex;
      justify-content: center;
      .simple_ {
        width: 180upx;
        height: 180upx;
        margin: 60upx auto 40upx auto;
      }
    }
    > text:nth-of-type(1) {
      color: $cl33;
      text-align: center;
    }
    > text:nth-of-type(2) {
      color: #999999;
      margin: 28upx  40upx 0 40upx;
      line-height: 44upx;
    }
  }
}
</style>
