<template>
  <view class="buyOtc">
    <view class="status_app"></view>
    <view class="header flex">
      <uni-icons @click="back_" color="#fff" class="icons" type="arrowleft" size="26" />
      <text class="header_name">购买SC</text>
    </view>
    <view class="otc_header">
      <view>
        <text>￥72.00</text>
        <text>/SC</text>
      </view>
      <view>还剩{{ s }}s，超时自动取消</view>
    </view>
    <view class="from">
      <view class="input flex">
        <input type="text" value="" placeholder="请输入想要购买总数量" />
        <text class="name">SC</text>
        <text class="all">全部</text>
      </view>
      <view class="input flex">
        <input type="text" value="" placeholder="请输入想要购买总数量" />
        <text class="name">CNY</text>
        <text class="all">全部</text>
      </view>
      <view class="subs">购买</view>
    </view>
    <view class="content">
      <view>
        <text>买家信息</text>
        <text></text>
      </view>
      <view>
        <text>卖家昵称</text>
        <text>张三</text>
      </view>
      <view class="no_bt">
        <text>放币时效</text>
        <text>1`30</text>
      </view>
    </view>
  </view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import * as myAxios from '@/api/otc.js';
import { toast, loading, model, fn } from '@/common/common.js';
let timers =null;
export default {
  name: 'buyOtc',
  data() {
    return {
      s: 60
    };
  },
  onLoad(e) {
    timers=setInterval(()=>{
        this.s--;
        if(this.s==0){
          clearInterval(timers)
          this.back_()
        }
    },1000)
  },
  onShow() {},
  onHide(){
    if(timers){
      clearInterval(timers)
    }
  },
  methods: {
    back_() {
      uni.navigateBack({
        delta: 1
      });
    }
  },
  computed: {},
  components: {
    uniIcons
  }
};
</script>

<style scoped lang="scss">
@import './index.scss';
.buyOtc {
  font-size: 32upx;
  .otc_header {
    /* #ifdef APP-PLUS */
    margin-top: var(--status-bar-height);
    /* #endif */
    font-size: 32upx;
    color: #fff;
    background: $active;
    padding: 50px 5% 100upx 5%;
    > view:nth-of-type(1) {
      margin-bottom: 6upx;
      text:nth-of-type(1) {
        font-size: 40upx;
      }
      text:nth-of-type(2) {
        font-size: 30upx;
        margin-left: 4upx;
      }
    }
  }
  .content,
  .from {
    width: 92%;
    margin: -60upx 4% 0 4%;
    background: #fff;
    box-sizing: border-box;
    padding: 40upx 30upx;
    border-radius: 4px;
  }
  .content {
    margin-top: 40upx;
    > view {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20upx;
      > text:nth-of-type(1) {
        color: #999;
      }
    }
    .no_bt {
      margin-bottom: 0;
    }
  }
  .from {
    .input {
      position: relative;
      height: 90upx;
      margin-bottom: 30upx;
      width: 100%;
      input {
        box-sizing: border-box;
        position: absolute;
        width: 100%;
        padding: 0 40% 0 20upx;
        height: 100%;
        border: 1px solid #f5f5f5;
        border-radius: 4px;
      }
      .all {
        right: 20upx;
        color: $active;
      }
      .name {
        right: 120upx;
      }
      .name,
      .all {
        top: 50%;
        transform: translateY(-50%);
        position: absolute;
      }
    }
    .subs {
      width: 100%;
      line-height: 90upx;
      text-align: center;
      background: #e8e8e8;
      color: #fff;
      border-radius: 4px;
    }
  }
}
</style>
