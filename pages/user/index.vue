<template>
  <view class="content">
    <!-- <view class="tips">此版本为测试版本，不支持任何虚拟资产交易。</view> -->
    <view class="userInfo">
      <view class="info pd30 bb" @click="jump('myInfo')">
        <view>
          <image src="../../static/images/user_13.png"></image>
          <view>
            <view class="userName">
              <text>{{ centerData.idName }}</text>
              <image
                :src="centerData.level == 1 ? '../../static/images/vip_1-1.png' : centerData.level == 2 ? '../../static/images/vip_2-1.png' : '../../static/images/vip_3-1.png'"
              ></image>
            </view>
            <view class="userId">
              UID： {{ centerData.id }}
              <text :style="{ color: centerData.checkStatus == 2 ? '' : '#fff', background: centerData.checkStatus == 2 ? '' : '#D8D8D8' }">
                {{ centerData.checkStatus == 2 ? '已认证' : '未认证' }}
              </text>
            </view>
          </view>
        </view>
        <view><uni-icons type="arrowright" size="24"></uni-icons></view>
      </view>
      <view class="quota">
        <view class="bg"><image src="../../static/images/my_bg.png" mode="aspectFill"></image></view>
        <view>
          <view>
            <text>每日提现：</text>
            2BTC
          </view>
          <view>
            <text>每日提现：</text>
            4BTC
          </view>
          <view>
            <text>每日提现：</text>
            8BTC
          </view>
        </view>
        <view>
          <image src="../../static/images/vip_1-1.png" v-if="centerData.level >= 1"></image>
          <image src="../../static/images/vip_1-2.png" v-else></image>
          <view style="width: 60rpx;height: 1px;background-color: #fff;"></view>
          <image src="../../static/images/vip_2-1.png" v-if="centerData.level >= 2"></image>
          <image src="../../static/images/vip_2-2.png" v-else></image>
          <view style="width: 60rpx;height: 1px;background-color: #fff;"></view>
          <image src="../../static/images/vip_3-1.png" v-if="centerData.level >= 3"></image>
          <image src="../../static/images/vip_3-2.png" v-else></image>
        </view>
      </view>
    </view>
    <view class="mybtn">
      <view class="item" @click="jump('entrust')">
        <!-- jump('entrust') showToast -->
        <image src="../../static/images/my_btn1.png"></image>
        <text>我的委托</text>
      </view>
      <view class="item" @click="jump('invitation')">
        <image src="../../static/images/my_btn2.png"></image>
        <text>我的邀请</text>
      </view>
      <view class="item" @click="jump('myApplication')">
        <image src="../../static/images/my_btn3.png"></image>
        <text>我的申请</text>
      </view>
    </view>
    <view class="operation">
      <view class="bb" @click="jump('safe')">
        <view class="left">
          <image src="../../static/images/user_3.png"></image>
          <view>安全中心</view>
        </view>
        <view class="right"><image src="../../static/images/right_2.png"></image></view>
      </view>
      <view class="bb" @click="jumpList">
        <view class="left">
          <image src="../../static/images/user_4.png"></image>
          <view>公告中心</view>
        </view>
        <view class="right"><image src="../../static/images/right_2.png"></image></view>
      </view>
      <!-- <view class="bb" @click="jumpDetails(0)">
				<view class="left">
					<image src="../../static/images/user_5.png"></image>
					<view>帮助中心</view>
				</view>
				<view class="right">
					<image src="../../static/images/right_2.png"></image>
				</view>
			</view> -->
      <view class="bb" @click="jumpDetails(4)">
        <view class="left">
          <image src="../../static/images/user_6.png"></image>
          <view>关于我们</view>
        </view>
        <view class="right"><image src="../../static/images/right_2.png"></image></view>
      </view>
      <view class="bb" @click="jumpDetails(18)">
        <view class="left">
          <image src="../../static/images/user_7.png"></image>
          <view>联系我们</view>
        </view>
        <view class="right"><image src="../../static/images/right_2.png"></image></view>
      </view>
      <view class="bb" @click="jumpDetails(14)">
        <view class="left">
          <image src="../../static/images/user_8.png"></image>
          <view>商务合作</view>
        </view>
        <view class="right"><image src="../../static/images/right_2.png"></image></view>
      </view>

      <view class="bb" @click="toRouter('/pages/user/receivingSet')">
        <view class="left">
          <image src="../../static/images/user_8.png"></image>
          <view>收付款设置</view>
        </view>
        <view class="right"><image src="../../static/images/right_2.png"></image></view>
      </view>
    </view>

    <!-- 		<view class="upTime">最近登录时间：{{loginTime}}</view>
		<view class="upIp">ip：{{ip}}</view> -->
    <!-- <tab-bar :current="currentTabIndex"></tab-bar> -->
  </view>
</template>

<script>
import { userCenter } from '@/api/center_api.js';
import { timestampToTime } from '@/common/timestampToTime.js';
import { mapGetters, mapActions, mapState } from 'vuex';
import uniIcons from '@/components/uni-icons/uni-icons.vue';
export default {
  data() {
    return {
      currentTabIndex: 4,
      centerData: {}, //用户信息
      loginData: {}, //登录信息
      loginTime: '',
      ip: ''
    };
  },
  components: {
    uniIcons
  },
  onNavigationBarButtonTap() {
    this.jump('setInfo');
  },
  async onLoad() {
    // uni.hideTabBar()
    let userData = await userCenter();
    // console.log(userData)
    this.centerData = userData.data.usercenter;
    this.loginData = userData.data.userLoginLogList;
    // console.log(this.centerData)
    this.loginTime = timestampToTime(this.loginData[0].loginTime, 'dateTime');
    this.ip = this.loginData[0].ip;

    let data = {
      emailStatus: userData.data.usercenter.emailStatus,
      phoneStatus: userData.data.usercenter.phoneStatus,
      googleStatus: userData.data.usercenter.googleStatus,
      needTransactionPassword: userData.data.usercenter.needTransactionPassword,
      googleKey: userData.data.usercenter.googleKey,
      transactionPasswordIsNull: userData.data.usercenter.transactionPasswordIsNull
    };
    this.setUserCenter(data);
  },
  computed: {
    ...mapGetters(['usercenter'])
  },
  methods: {
    ...mapActions(['setUserCenter']),
    showToast() {
      uni.showToast({
        title: '暂未开放,敬请期待',
        icon: 'none'
      });
    },
    //跳转
    jump(text) {
      uni.navigateTo({
        url: './' + text
      });
    },
    jumpDetails(id) {
      uni.navigateTo({
        url: '../notice/details?id=' + id
      });
    },
    toRouter(path) {
      uni.navigateTo({
        url: path
      });
    },
    jumpList(id) {
      uni.navigateTo({
        url: '../notice/index'
      });
    }
  }
};
</script>

<style lang="scss">
.bb {
  .left {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.tips {
  background: #534dff;
  color: #fff;
  font-size: 20upx;
  padding-left: 30upx;
  height: 50upx;
  line-height: 50upx;
}
.userInfo {
  background: #fff;
  .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    > view:first-child {
      display: flex;
      align-items: center;
      > image {
        width: 120upx;
        height: 120upx;
        border-radius: 50%;
        margin-right: 20upx;
        box-shadow: 0 0 15px 1px #a4a4bb;
      }
      .userName {
        font-weight: 500;
        font-size: 32rpx;
        margin-bottom: 16upx;
        image {
          width: 92upx;
          height: 32upx;
          margin-left: 16upx;
          vertical-align: sub;
        }
      }
      .userId {
        font-size: 24upx;
        color: #999999;
        text {
          font-size: 20upx;
          color: #5dc1cf;
          background: #d2fff5;
          padding: 8rpx 14rpx;
          border-radius: 22rpx;
          margin-left: 20rpx;
        }
      }
    }
    > view:last-child {
      margin-top: 12rpx;
      align-self: flex-start;
      image {
        width: 40rpx;
        height: 36rpx;
      }
    }
  }
  .quota {
    width: 95%;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    padding: 20px 15px;
    font-size: 20upx;
    box-shadow: 0 2px 15px 0px #a4a4bb;
    border-radius: 8px;
    > .bg {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      > image {
        width: 100%;
        height: 100%;
        margin: 0;
      }
    }
    > view:nth-of-type(2) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      color: #fff;
    }
    > view:nth-of-type(3) {
      margin-top: 30upx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      image {
        width: 92upx;
        height: 32upx;
      }
    }
  }
}
.mybtn {
  background: #fff;
  padding-top: 20upx;
  padding: 50rpx 30rpx 30rpx 30rpx;
  display: flex;
  justify-content: space-around;
  > .item {
    image {
      width: 84rpx;
      height: 84rpx;
      display: block;
      margin: 0 auto;
    }
    text {
      display: block;
      font-size: 14px;
      margin-top: 10px;
    }
  }
}
.operation {
  background: #fff;
  margin-top: 20upx;
  padding: 0 30upx;
  > view {
    padding: 30upx 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 30upx;
    .left {
      image {
        width: 36upx;
        height: 32upx;
        border-radius: 50%;
        margin-right: 20upx;
        vertical-align: bottom;
      }
      view {
        font-size: 14px;
        display: inline-block;
      }
    }
    .right {
      color: #999;
      image {
        width: 12upx;
        height: 22upx;
        margin-left: 20upx;
        vertical-align: baseline;
      }
      view {
        display: inline-block;
      }
    }
  }
}
.upTime {
  margin: 40upx 0 20upx;
  text-align: center;
  color: #999;
  font-size: 20upx;
}
.upIp {
  padding-bottom: 40upx;
  font-size: 20upx;
  text-align: center;
}
</style>
