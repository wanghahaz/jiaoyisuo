<template>
  <view class="issue">
    <view class="tab_ flex">
      <text :class="tab_ind == 0 ? 'tab_active' : ''" @click="edit_tab(0)">我要购买</text>
      <text :class="tab_ind == 1 ? 'tab_active' : ''" @click="edit_tab(1)">我要出售</text>
    </view>
    <view class="price">
      <view class="flex">
        <text>价格</text>
        <view class="flex">
          <text>当前盘口价格</text>
          <text class="text">27.00CNY</text>
        </view>
      </view>
      <view class="flex">
        <text>定价方式</text>
        <text>固定价格</text>
      </view>
      <view class="flex">
        <text>交易价格</text>
        <input placeholder="请输入交易价格" type="text" value="" />
      </view>
    </view>
    <view class="deal_num">
      <view class="flex">
        <text></text>
        <text>交易数额</text>
      </view>
      <view class="flex">
        <text>数量(SC)</text>
        <input type="text" placeholder="请输入购买数量" value="" />
      </view>
      <view class="flex">
        <text>金额(CNY)</text>
        <text>0</text>
      </view>
      <view class="flex">
        <text>交易说明</text>
        <textarea :placeholder="tab_ind == 0?'下单后急速付款，到账后请及时放币':'1、请及时付款并点击「我已支付」按钮 2、币由系统锁定托管，请安心下单'" />
      </view>
    </view>
    <view class="sub_">
      <text>平台服务费：0.5%</text>
      <view @click="show_">发布委托单</view>
    </view>
    <!-- 弹层 -->
    <view class="mask" v-if="show"></view>
    <view :class="show?'mask_content':''" class="sure_box">
      <view>
        <text>{{tab_ind==0?'确认购买sc':'确认出售sc'}}</text>
        <uni-icons @click="show_()" class="icon" size="36" type="closeempty" color="#999" />
      </view>
      <view>
        <text>固定价格</text>
        <text>100CNY</text>
      </view>
      <view>
        <text>数量</text>
        <text>10.00SC(1，000.00CNY)</text>
      </view>
      <view class="sure">确认</view>
    </view>
  </view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';
import * as myAxios from '@/api/otc.js';
import { toast, loading, model, fn } from '@/common/common.js';
export default {
  name: '',
  data() {
    return {
      tab_ind: 0,
      show: false
    };
  },
  onLoad(e) {},
  onShow() {},
  methods: {
    edit_tab(ind) {
      if (ind != this.tab_ind) {
        this.tab_ind = ind;
      }
    },
    show_() {
      this.show = !this.show;
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
$txt: #333;
$bg: #fff;
.issue {
  font-size: 32upx;
  padding-bottom: 40upx;
  .sure_box {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    background: $bg;
    padding: 60upx 5% 80upx 5%;
    transform: translateY(100%);
    transition: all 700ms;
    z-index: 100;
    > view {
      position: relative;
      display: flex;
      align-items: center;
    }
    .sure{
      line-height: 90upx;
      justify-content: center;
      color: #fff;
      background: $active;
      border-radius: 4px;
      margin-top: 80upx;
      box-shadow: 0px 6px 16px -6px $active;
    }
    > view:nth-of-type(2),
    > view:nth-of-type(3) {
      justify-content: space-between;
      margin-top: 30upx;
      >text:nth-of-type(2){
        color: #999;
      }
    }
    > view:nth-of-type(1) {
      justify-content: center;
      margin-bottom: 60upx;
      .icon {
        position: absolute;
        right: 0;
      }
    }
  }
  .sub_ {
    padding: 0 4%;
    margin-top: 120upx;
    text {
      display: inline-block;
      width: 100%;
      text-align: right;
      color: #999;
      font-size: 26upx;
      margin-bottom: 10upx;
    }
    view {
      line-height: 90upx;
      background: $bg;
      text-align: center;
      border-radius: 4px;
    }
  }
  .deal_num {
    margin-top: 18upx;
    > view {
      margin-top: 1px;
      position: relative;
      padding: 34upx 6%;
      background: $bg;
      > text:nth-of-type(1) {
        width: 28%;
      }
      textarea {
        height: 160upx;
      }
    }
    > view:nth-of-type(1) {
      > text:nth-of-type(1) {
        position: absolute;
        left: 0;
        top: 50%;
        width: 20upx;
        height: 3px;
        transform: translateY(-50%);
        background: $active;
      }
    }
  }
  .price {
    > view {
      padding: 0 6%;
    }
    > view:nth-of-type(1) {
      color: #999;
      line-height: 80upx;
      justify-content: space-between;
      .text {
        color: $txt;
      }
    }
    > view:nth-of-type(2),
    > view:nth-of-type(3) {
      background: #fff;
      height: 108upx;
      align-items: center;
      > text:nth-of-type(1) {
        width: 28%;
      }
      > text:nth-of-type(2) {
        font-weight: 700;
      }
    }
    > view:nth-of-type(3) {
      margin-top: 1px;
    }
  }
  .tab_ {
    margin-top: 1px;
    height: 92upx;
    background: $bg;
    justify-content: space-around;
    align-items: center;
    text {
      position: relative;
      color: $txt;
    }
  }
}
</style>
