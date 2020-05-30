<template>
  <view class="content" v-if="info.id">
    <view class="list" @click="jumpChange('0')">
      <view>登录密码修改</view>
      <view>
        <text>修改</text>
        <image class="rt" src="../../static/images/right_2.png"></image>
      </view>
    </view>
    <view class="list bdline" @click="jumpChange('1')">
      <view>交易密码</view>
      <view>
        <text>修改</text>
        <image class="rt" src="../../static/images/right_2.png"></image>
      </view>
    </view>
    <view class="list" @click="jumpGoogle">
      <view>Google认证</view>
      <view>
        <!-- <text>未认证</text> -->
        <image class="rt" src="../../static/images/right_2.png"></image>
      </view>
    </view>
    <view class="list bdline" @click="jumpChange('2')">
      <view>手机号</view>
      <view>
        <text>{{ info.phone? info.phone.slice(4) : '您还没绑定手机' }}</text>
        <image class="rt" src="../../static/images/right_2.png"></image>
      </view>
    </view>
    <!-- <view class="list">
			<view>邮箱认证</view>
			<view>
				<text>未认证</text>
				<image class="rt" src="../../static/images/right_2.png"></image>
			</view>W
		</view> -->
    <view class="list">
      <view>Google验证</view>
      <switch
        style="transform: scale(0.7,0.7)"
        :disabled="disabled"
        data-type="googleStatus"
        :checked="info.googleStatus == 1 ? true : false"
        @click="changeSwitch($event, 3)"
        color="#534DFF"
      />
    </view>
    <view class="list">
      <view>手机验证</view>
      <switch
        style="transform: scale(0.7,0.7)"
        :disabled="disabled"
        data-type="phoneStatus"
        :checked="info.phoneStatus == 1 ? true : false"
        @click="changeSwitch($event, 1)"
        color="#534DFF"
      />
    </view>
    <!-- <view class="list">
			<view>邮箱验证</view>
			<switch style="transform: scale(0.7,0.7)" :data-type="info.googleStatus" checked @click="changeSwitch($event,2) color="#534DFF"/>
		</view> -->
    <view class="list">
      <view>交易验证</view>
      <switch
        style="transform: scale(0.7,0.7)"
        :disabled="disabled"
        data-type="needTransactionPassword"
        :checked="info.needTransactionPassword == 1 ? true : false"
        @click="changeSwitch($event, 4)"
        color="#534DFF"
      />
    </view>
    <view v-show="showModel" @click="closeModal" class="mask"></view>
    <view v-show="showModel" class="model">
      <view class="md_title">请输入验证码</view>
      <view class="md_input">
        <view class="">
          <text>手机号 {{ info.phone?info.phone.slice(4):'' }}</text>
        </view>
        <view class="">
          <text>验证码：</text>
          <input type="number" maxlength="8" v-model="code" placeholder="请输入验证码" />
        </view>
      </view>
      <view class="nd_btn">
        <view class="cancel" @click="closeModal()">取消</view>
        <view class="confim" @click="bindBtn">确认</view>
      </view>
    </view>
    <!-- <neil-modal :show="showModel" @close="closeModal" title="请输入验证码" @confirm="bindBtn('confirm')">
      <view class="input-view">
        <view class="input-name pd23">
          <view>验证码{{ info.phone }}</view>
          <input type="text" v-model="code" placeholder="请输入验证码" />
        </view>
      </view>
    </neil-modal> -->
  </view>
</template>

<script>
import { switchCheck, openOrCloseTradePassword, sendSms, checkSms, userCenter } from '@/api/center_api.js';
import neilModal from '@/components/neil-modal/neil-modal.vue';
import { toast, loading, model } from '@/common/common.js';
import { mapActions } from 'vuex';
export default {
  components: {
    neilModal
  },
  data() {
    return {
      info: {},
      disabled: true,
      code: '',
      showModel: false,
      type: '',
      eType: ''
    };
  },
  onLoad() {},
  onShow() {
    this.getUserCenter();
  },
  methods: {
    ...mapActions(['setUserCenter', 'setUserInfo']),
    async getUserCenter() {
      let res = await userCenter();
      let setVuxCenter = {
        id:res.data.usercenter.id,
        emailStatus: res.data.usercenter.emailStatus,
        phoneStatus: res.data.usercenter.phoneStatus,
        googleStatus: res.data.usercenter.googleStatus,
        needTransactionPassword: res.data.usercenter.needTransactionPassword,
        googleKey: res.data.usercenter.googleKey,
        transactionPasswordIsNull: res.data.usercenter.transactionPasswordIsNull
      };
      this.setUserCenter(setVuxCenter);
      console.log(res.data)
      this.info = setVuxCenter;
      let userInfo = uni.getStorageSync('userinfo');
      userInfo.phone = res.data.usercenter.phone;
      this.setUserInfo(userInfo);
      this.$set(this.info, 'phone', res.data.usercenter.phone);
    },
    closeModal() {
      this.showModel = false;
    },
    async bindBtn() {
      if (this.code == '') {
        uni.showToast({
          title: '请输入验证码',
          icon: 'none'
        });
        return;
      }
      let statusCode = await checkSms({ phone: uni.getStorageSync('userinfo').phone, code: this.code });
      if (statusCode.code == 0) {
        toast({ text: statusCode.msg });
        return;
      }
      var res = null;
      console.log(this.info);
      console.log(this.eType);
      if (this.type == 4) {
        res = await openOrCloseTradePassword({
          flag: this.info[this.eType] == 0 ? 1 : 0,
          smsCode: this.code
        });
      } else {
        res =await switchCheck({
          type: this.type,
          status: this.info[this.eType] == 0 ? 1 : 0
        });
      }
      console.log(res)
      if (res.code == 0) {
        toast({ text: res.msg });
      } else {
        this.info[this.eType] = this.info[this.eType] == 0 ? 1 : 0;
        this.showModel = false;
        this.getUserCenter();
      }
    },
    async changeSwitch(e, type) {
      if (!uni.getStorageSync('userinfo').phone) {
        model({ text: '您还没绑定手机号，请您先去绑定手机' }).then(res => {
          if (res) {
            this.jumpChange(2);
            return;
          } else {
          }
        });
      } else {
        this.disabled = true;
        this.showModel = true;
        let res = await sendSms({
          phone: uni.getStorageSync('userinfo').phone,
          type: 6
        });
        this.type = type;
        this.eType = e.target.dataset.type;
        if (res.code == 1) {
          this.showModel = true;
        }
      }
    },
    //修改密码、交易密码、手机号
    jumpChange(type) {
      // uni.navigateTo({
      // 	url: "./next"
      // })
      if (type == 2 && uni.getStorageSync('userinfo').phone) {
        uni.navigateTo({
          url: './changePwd?type=' + 3
        });
        return;
      }
      uni.navigateTo({
        url: './changePwd?type=' + type
      });
    },
    //Google
    jumpGoogle() {
      uni.navigateTo({
        url: './google'
      });
    }
  }
};
</script>

<style lang="scss">
@import './list.css';
page {
  background: #fff;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(#000, 0.6);
  z-index: 5;
}
.model {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #fff;
  width: 76%;
  left: 50%;
  border-radius: 16upx;
  z-index: 10;
  font-size: 30upx;
  top: 50%;
  transform: translate(-50%, -50%);
  .md_input {
    padding: 20upx;
    display: flex;
    flex-direction: column;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    input {
      font-size: 28upx;
    }
    view:nth-child(1) {
      color: #333333;
      font-size: 30upx;
    }
    view:nth-child(2) {
      margin-top: 10upx;
      display: flex;
    }
  }
  .nd_btn {
    display: flex;
    .cancel {
      border-right: 1px solid #f5f5f5;
    }
    view {
      flex: 1;

      text-align: center;
      line-height: 80upx;
    }
  }
  .md_title {
    font-weight: 600;
    line-height: 84upx;
    text-align: center;
  }
}
.content {
  .list {
    > view {
      font-size: 34rpx;
    }
  }
}
.uni-switch-input {
  width: 44upx;
  height: 22upx;
}
</style>
