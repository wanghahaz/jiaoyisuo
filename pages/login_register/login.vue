<template>
  <view class="loginBg">
    <!-- 		<view class="bg">
			<image src="../../static/images/title_img.png" mode="widthFix"></image>
		</view> -->
    <image src="../../static/images/title_img.png" mode="widthFix"></image>
    <view class="nav">
      <view class="nav_item" :class="{ active: nav_num == 0 }" @click="nav_num = 0"><text>手机登录</text></view>
      <view class="nav_item" :class="{ active: nav_num == 1 }" @click="nav_num = 1"><text>邮箱登录</text></view>
    </view>
    <view class="form" v-if="nav_num == 0">
      <view class="form_item">
        <picker @change="selectPhoneArea" :value="areaIndex" :range="area" range-key="cnName" v-if="area.length">
          <view class="uni-input">{{ '+' + area[areaIndex]['code'] }}</view>
        </picker>
        <text class="iconfont iconxiala1 small"></text>
        <input type="text" v-model="username1" placeholder="请输入手机号" />
      </view>
      <view class="form_item psw">
        <input type="text" v-model="password1" placeholder="登录密码" :password="ispsw1" />
        <text class="iconfont iconchakan" @click="ispsw1 = !ispsw1" v-if="ispsw1"></text>
        <text class="iconfont iconbianzu" @click="ispsw1 = !ispsw1" v-else></text>
      </view>
      <view class="form_item forget"><navigator url="/pages/login_register/forgetpassword">忘记登录密码</navigator></view>
      <button type="primary" @click="doLogin(1)">立即登录</button>
      <view class="toRegister"><navigator url="/pages/login_register/register">注册新账号</navigator></view>
    </view>
    <view class="form" v-if="nav_num == 1">
      <view class="form_item"><input type="text" v-model="username2" placeholder="请输入邮箱号" /></view>
      <view class="form_item psw">
        <input type="text" v-model="password2" placeholder="登录密码" :password="ispsw2" />
        <text class="iconfont iconchakan" @click="ispsw2 = !ispsw2" v-if="ispsw2"></text>
        <text class="iconfont iconbianzu" @click="ispsw2 = !ispsw2" v-else></text>
      </view>
      <view class="form_item forget"><navigator url="/pages/login_register/forgetpassword">忘记登录密码</navigator></view>
      <button type="primary" @click="doLogin(2)">立即登录</button>
      <view class="toRegister"><navigator url="/pages/login_register/register">注册新账号</navigator></view>
    </view>
    <Modal ref="modal" :phone="this.areaCode + this.username1.trim()" />
  </view>
</template>

<script>
import Modal from '@/components/Modal/Modal';
import { getCountryCode, checkLoginPassword, login } from '@/api/user_api';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    Modal
  },
  data() {
    return {
      nav_num: 0, // 切换导航绑定值
      area: [], // 手机区号列表
      areaIndex: 0,
      username1: '', // 输入的手机号
      password1: '', // 输入的密码
      ispsw1: true, // 密码是否可见,true可见false不可见
      username2: '', // 输入的邮箱
      password2: '', // 输入的密码
      ispsw2: true, // 密码是否可见,true可见false不可见
      redirect: '', // 登陆后要重定向的位置
      redirectType: '' // 登陆后重定向到tabbar页面还是其他页面
    };
  },
  computed: {
    ...mapGetters(['deviceInfo', 'userinfo']),
    // 选择的手机地区号
    areaCode() {
      return this.area.length ? '00' + this.area[this.areaIndex].code : '00';
    }
  },
  created() {},
  methods: {
    ...mapActions(['setUserInfo']),
    // 选择手机地区
    selectPhoneArea(e) {
      this.areaIndex = e.target.value;
    },
    // 访问登录接口
    async login(data) {
      let userinfo = await login(data);
      // 登陆后存入vuex
      if (userinfo.success) {
        this.setUserInfo(userinfo.data);
        if (this.redirect) {
          console.log(this.redirect);
          if (this.redirectType == 'tabBar') {
            uni.switchTab({
              url: this.redirect
            });
          } else {
            uni.redirectTo({
              url: this.redirect
            });
          }
        } else {
          uni.switchTab({
            url: '/pages/basic/index'
          });
        }
      } else {
        uni.showToast({
          title: userinfo.msg,
          icon: 'none'
        });
      }
    },
    // 点击登录
    async doLogin() {
      let phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/; // 手机正则
      let emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; // 邮箱正则
      let data = null;
      if (this.nav_num == 0 && !phoneReg.test(this.username1.trim())) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return;
      } else if (this.nav_num == 1 && !emailReg.test(this.username2.trim())) {
        uni.showToast({
          title: '请输入正确的邮箱',
          icon: 'none'
        });
        return;
      }
      if (this.nav_num == 0) {
        data = {
          username: this.areaCode + this.username1.trim(),
          password: this.password1,
          source: this.deviceInfo.platform === 'android' ? 3 : this.deviceInfo.platform === 'ios' ? 2 : 1,
          type: 1
        };
      } else if (this.nav_num == 1) {
        data = {
          username: this.username2.trim(),
          password: this.password2,
          source: this.deviceInfo.platform === 'android' ? 3 : this.deviceInfo.platform === 'ios' ? 2 : 1,
          type: 2
        };
      }
      // 校验登录密码后调用登录接口
      let checkres = await checkLoginPassword({
        username: data.username,
        password: data.password
      });
      if (checkres.success) {
        // 如果开启手机验证
        if (checkres.data.phoneStatus && this.nav_num == 0) {
          this.$refs.modal.show({
            phone: this.areaCode + this.username1.trim(),
            title: '请填写验证码',
            success: () => {
              data.smsCode = this.$refs.modal.code;
              this.login(data);
            }
          });
        } else if (checkres.data.googleStatus) {
          this.login(data);
        } else {
          this.login(data);
        }
      } else {
        uni.showToast({
          title: checkres.msg,
          icon: 'none'
        });
      }
    }
  },
  async onLoad(option) {
    if (uni.getStorageSync('userinfo')) {
      uni.clearStorage('userinfo');
      uni.clearStorage('usercenter');
    }
    // 页面载入时获取url参数判断当前导航位置
    this.nav_num = option.nav_num || 0;
    // 获取登陆后要跳转的页面信息
    this.redirect = option.redirect;
    this.redirectType = option.redirectType;

    let res = await getCountryCode();
    this.area = res.data;
  }
};
</script>

<style lang="scss" scoped>
.loginBg {
  height: 100%;
  position: relative;
  background-color: #fff;
  > image {
    width: 65%;
    display: block;
    margin: 0 auto;
    padding-top: 150rpx;
    position: relative;
    z-index: 1;
  }
  .nav {
    position: relative;
    z-index: 2;
    margin-top: 66rpx;
    display: flex;
    justify-content: center;
    color: #333;
    font-size: 34rpx;
    .nav_item {
      box-sizing: border-box;
      padding: 10rpx 0 20rpx 0;
      margin: 0 26rpx;
    }
    .nav_item.active {
      color: #534dff;
      border-bottom: 2px solid #534dff;
    }
  }
  .form {
    margin-top: 300rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    .form_item {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      width: 85%;
      margin-bottom: 50rpx;
      border-bottom: 1px solid #f0f0f2;
      color: #333;
      picker {
        color: #333;
        font-size: 32rpx;
        margin-bottom: 16rpx;
      }
      .iconfont {
        font-size: 24rpx;
        color: #5a5d64;
      }
      input {
        margin-bottom: 16rpx;
        width: 75%;
        font-size: 32rpx;
      }
      text {
        margin-bottom: 16rpx;
        font-size: 30rpx;
      }
    }
    .psw {
      display: flex;
    }
    .forget {
      border-bottom: none;
      text-align: right;
      margin-top: 18rpx;
      justify-content: flex-end;
      font-size: 28rpx;
      color: #333;
      opacity: 0.82;
    }
    button {
      box-shadow: 0px 6px 10px -4px #534dff;
      width: 85%;
      background-color: #534dff;
      color: #fff;
      font-size: 32rpx;
      height: 100rpx;
      line-height: 100rpx;
    }
    .toRegister {
      border-bottom: none;
      font-size: 30rpx;
      text-align: center;
      width: 100%;
      position: fixed;
      bottom: 50rpx;
      left: 0;
      color: #333;
    }
  }
}
</style>
