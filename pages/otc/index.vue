<template>
  <view class="otc_index">
    <view class="status_app"></view>
    <view class="tab flex">
      <view class="tab_area flex">
        <text :class="tab_area == 0 ? 'areaActive' : ''" @click="editTab(1, 0)">快捷区</text>
        <text :class="tab_area == 1 ? 'areaActive' : ''" @click="editTab(1, 1)">自选区</text>
      </view>
      <view class="flex tab_sell">
        <view class="flex">
          <text :class="sellType == 0 ? 'sellActive' : ''" @click="editTab(2, 0)">我要买</text>
          <text :class="sellType == 1 ? 'sellActive' : ''" @click="editTab(2, 1)">我要卖</text>
        </view>
        <text @click="toRouter('/pages/otc/order', {})">订单</text>
      </view>
    </view>
    <swiper :current="tab_area" class="swiper" @change="swiperTab">
      <swiper-item>
        <view @tap="editTab(1, 0)" class="arae_1">
          <view class="uni-input"><input class="uni-input" placeholder="请输入数量" type="text" value="" /></view>
          <view class="tip">按数量购买</view>
          <view class="sub_buy" @click="oneKey">{{ sellType == 0 ? '一键购买' : '一键出售' }}</view>
          <view class="service_money">交易手续费0</view>
        </view>
      </swiper-item>
      <swiper-item>
        <view @tap="editTab(1, 1)" class="optional">
          <scroll-view scroll-y="true" class="scroll_box" @scrolltolower="scroll">
            <view class="add flex" @click="toRouter('/pages/otc/issue', {})"></view>
            <view class="item flex" v-for="item in 10" :key="item">
              <view class="left">
                <view class="flex"><text>张三</text></view>
                <view>
                  <text>数量</text>
                  <text>50,60 SC</text>
                </view>
                <view>
                  <text>限额</text>
                  <text>241,52 SC</text>
                </view>
              </view>
              <view class="right flex">
                <view class="flex">
                  <text>￥{{ (21).toFixed(2) }}</text>
                  <text>/SC</text>
                </view>
                <view @click="toRouter('/pages/otc/buyOtc',{})">去购买</view>
              </view>
            </view>
          </scroll-view>
        </view>
      </swiper-item>
    </swiper>
    <view v-if="maskShow" class="mask"></view>
    <view :class="maskShow ? 'mask_content' : ''" class="btm_box">
      <view class="flex mask_header">
        <text>{{ buySort == 1 ? '确认出售' : '选择收款方式' }}</text>
        <uni-icons @click="show_()" class="icon" size="36" type="closeempty" color="#999" />
      </view>
      <view class="sort_1" v-if="buySort == 1">
        <view class="flex">
          <text>参考单价</text>
          <text>7.11 CNY/SC</text>
        </view>
        <view class="flex">
          <text>数量</text>
          <text>10.00SC(1，000.00CNY)</text>
        </view>
        <view class="flex">
          <text>总金额</text>
          <text>19.40CNY</text>
        </view>
      </view>
      <checkbox-group  v-else class="sort_2" @change="boxChange">
        <view class="flex" v-for="item in checkList" :key="item.id">
            <checkbox style="transform:scale(0.7)" :value="item.id"  />
            <view class="flex"><image class="check_img" :src="item.src" mode=""></image>  <span>{{ item.name }}</span></view>
        </view>
        <!-- <label class="uni-list-cell uni-list-cell-pd" v-for="item in items" :key="item.value">
          <view></view>
          <view>{{ item.name }}</view>
        </label> -->
      </checkbox-group>
      <view class="subs" @click="sbt">{{ buySort == 1 ? '确认' : '下一步' }}</view>
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
      checkList:[{name:'支付宝',id:'1',src:'../../static/images/otc/zfb.png'},{name:'银行卡',id:'2',src:'../../static/images/otc/bank.png'}],
      maskShow: false,
      buySort: 1, //购买弹框顺序
      tab_area: 0,
      sellType: 0
    };
  },
  onLoad(e) {},
  onShow() {},
  methods: {
    show_() {
      this.maskShow = !this.maskShow;
    },
    // 购买
    sbt() {
      if (this.buySort == 1) this.buySort = 2;
    },
    boxChange(e){
      console.log(e.detail.value)
    },
    // 一键操作
    oneKey() {
      this.buySort = 1;
      this.show_();
    },
    toRouter(url, data) {
      uni.navigateTo({
        url: url + fn.params(data)
      });
    },
    swiperTab(e) {
      this.tab_area = e.detail.current;
    },
    scroll() {
      console.log(1);
    },
    editTab(type, ind) {
      // type 1 选区  2买卖
      // ind  1 快捷/买  2  自选/卖
      if (type == 1) {
        if (ind != this.tab_area) {
          this.tab_area = ind;
        }
      } else {
        if (ind != this.sellType) {
          this.sellType = ind;
        }
      }
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
$bg: #534dff;
.flex {
  display: flex;
}
.otc_index {
  overflow-y: hidden;
  height: calc(100%);
  background: #fff;
  .btm_box {
    position: fixed;
    left: 0;
    bottom: 0;
    /* #ifdef H5 */
    bottom: 50px;
    /* #endif */
    background: #fff;
    width: 100%;
    z-index: 100;
    box-sizing: border-box;
    transform: translateY(100%);
    transition: all 0.3s;
    font-size: 32upx;
    > view {
      padding: 0 4%;
    }
    .sort_1 {
      view {
        justify-content: space-between;
        margin-bottom: 20upx;
        > text:nth-of-type(2) {
          color: #999999;
          font-size: 28upx;
        }
      }
    }
    .sort_2{
      padding: 0 4%;
      >view{
        margin-bottom: 20upx;
        align-items: center;
        >view{
          align-items: center;
          justify-content: flex-start;
        }
      }
       .check_img{
         width:40upx;
         height: 40upx;
         margin-right: 10upx;
       }
    }
    .subs {
      background-color: $bg;
      width: 92%;
      text-align: center;
      line-height: 90upx;
      color: #fff;
      border-radius: 5px;
      margin: 70upx 4%;
      @extend .blue_shadow;
    }
    .mask_header {
      position: relative;
      justify-content: center;
      line-height: 102upx;
      border-bottom: 1px solid #f5f5f5;
      margin-bottom: 50upx;
      .icon {
        position: absolute;
        right: 0;
      }
    }
  }
  .optional {
    height: 100%;
    /* #ifdef APP-PLUS */
    height: calc(100% - (var(--status-bar-height)));
    /* #endif */
    .scroll_box {
      position: relative;
      height: 100%;
      .add {
        position: fixed;
        right: 4%;
        bottom: 100upx;
        width: 70upx;
        height: 70upx;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.9);
        justify-content: center;
        align-items: center;
      }
      .add::after,
      .add::before {
        content: '';
        position: absolute;
        background: $bg;
      }
      .add::after {
        left: 33upx;
        width: 4upx;
        top: 18upx;
        height: 34upx;
      }
      .add::before {
        left: 18upx;
        width: 34upx;
        height: 4upx;
        top: 33upx;
      }
      .item {
        padding: 40upx 4%;
        box-sizing: border-box;
        border-bottom: 2upx solid #f5f5f5;
        .left {
          flex: 1.8;
          > view:nth-of-type(1) {
            color: #333333;
            font-weight: 700;
            align-items: flex-end;
          }
          > view:nth-of-type(2),
          > view:nth-of-type(3) {
            margin-top: 12upx;
            font-size: 26upx;
            > text:nth-of-type(1) {
              color: #999999;
            }
            > text:nth-of-type(2) {
              margin-left: 20upx;
              color: #333333;
            }
          }
        }
        .right {
          flex: 0.8;
          flex-direction: column;
          justify-content: space-between;
          > view:nth-of-type(1) {
            color: $bg;
            justify-content: space-around;
            align-items: flex-end;
            text:nth-of-type(1) {
              font-size: 44upx;
            }
            text:nth-of-type(2) {
              font-size: 28upx;
              padding-bottom: 6upx;
            }
          }
          > view:nth-of-type(2) {
            border-radius: 8upx;
            width: 90%;
            margin-left: 10%;
            line-height: 60upx;
            text-align: center;
            background: $bg;
            color: #fff;
            font-size: 30upx;
          }
        }
      }
    }
  }
  .swiper {
    height: calc(100% - 170upx);
  }
  .arae_1 {
    padding: 0 4%;
    .service_money {
      text-align: center;
      margin-top: 40upx;
      font-size: 30upx;
      color: #d9dadc;
    }
    .sub_buy {
      width: 100%;
      background: $bg;
      color: #fff;
      font-size: 34upx;
      text-align: center;
      margin-top: 40%;
      line-height: 90upx;
      border-radius: 8upx;
      box-shadow: 0px 6px 16px -6px $bg;
    }
    .uni-input {
      box-sizing: border-box;
      padding-left: 10upx;
      height: 100upx;
      width: 100%;
      border-bottom: 2upx solid #f5f5f5;
    }
    .tip {
      height: 40upx;
      margin-top: 20upx;
      color: $bg;
      text-align: right;
      font-size: 28upx;
    }
  }
  .status_app {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
    background: $bg;
    /* #ifdef APP-PLUS */
    height: var(--status-bar-height);
    /* #endif */
  }
  .tab {
    /* #ifdef APP-PLUS */
    margin-top: var(--status-bar-height);
    /* #endif */
    padding: 10upx 0;
    flex-direction: column;
    justify-content: space-around;
    height: 170rpx;
    background: $bg;
    .tab_sell {
      padding: 0 4%;
      align-items: flex-end;
      justify-content: space-between;
      > view {
        flex: 1;
        align-items: flex-end;
        text {
          margin-right: 24rpx;
        }
        > .sellActive {
          font-size: 40rpx;
        }
      }
      > text {
        width: 100upx;
        text-align: right;
      }
      text {
        color: #fff;
        font-size: 30rpx;
      }
    }
    .tab_area {
      line-height: 68rpx;
      width: 300rpx;
      margin: 0 auto;
      font-size: 32upx;
      border-radius: 40rpx;
      background: #8682ff;
      color: #f1f1f1;
      > text {
        flex: 1;
        text-align: center;
      }
      > .areaActive {
        background: #fff;
        color: $bg;
        border-radius: 40rpx;
      }
    }
  }
}
</style>
