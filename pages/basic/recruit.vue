<template>
  <view class="recruitBox">
    <uni-icons :style="{'top':barHeight+'px'}" class="arrowleft" @click="goBack" color="#fff" type="arrowleft" size="30"></uni-icons>
    <view class="bg"><image src="../../static/images/recruit_bg.png"></image></view>
    <view class="title">
      <text>与你共赢财富</text>
      <text>一 起 轻 松 赚 钱 一 起 轻 松 创 业</text>
      <image src="../../static/images/joinus.png"></image>
    </view>
    <view class="plan">
      <text style="margin-bottom: 15px;display: inline-block;line-height: 22px;">
        舞台再大，你没有用心，永远是个观众；平台再好，你没有参与，永远赚不到钱；胆子再大，你不敢闯，永远发挥不了；只有敢试，敢干，敢闯的人才会成功；
      </text>
      <text>2020年，Super Culture全面启动合伙人招募，助你实现梦想。</text>
    </view>
    <view class="form">
      <image src="../../static/images/title3.png" mode="widthFix"></image>
      <input type="text" v-model="name" placeholder="联系人姓名" />
      <view class="phone">
        <picker @change="selectPhoneArea" :value="areaIndex" :range="area" range-key="cnName" v-if="area.length">
          <view class="uni-input">{{ '+' + area[areaIndex]['code'] }}</view>
        </picker>
        <input type="number" v-model="phone" placeholder="联系人电话" />
      </view>
      <input type="number" v-model="idcard" placeholder="身份证号码" />
      <view class="submit" @click="submit">立即申请</view>
    </view>
  </view>
</template>

<script>
import { recruit } from '@/api/index_api';
import { getCountryCode } from '@/api/user_api';
import uniIcons from '@/components/uni-icons/uni-icons.vue';

export default {
  components: {
    uniIcons
  },
  data() {
    return {
      barHeight: '',
      name: '',
      phone: '',
      idcard: '',
      areaIndex: 0,
      area: [] // 手机区号列表
    };
  },
  computed: {
    areaCode() {
      return '+' + this.area[this.areaIndex].code;
    }
  },
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1
      });
    },
    // 选择手机地区
    selectPhoneArea(e) {
      this.areaIndex = e.target.value;
    },
    submit() {
      if (!this.name || !this.phone || !this.idcard) {
        uni.showToast({
          title: '请将信息填写完整',
          icon: 'none'
        });
        return;
      }
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone)) {
        uni.showToast({
          title: '请填写正确的手机号',
          icon: 'none'
        });
        return;
      }
      if (!/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(this.idcard)) {
        uni.showToast({
          title: '请填写正确的身份证号',
          icon: 'none'
        });
        return;
      }
      recruit({
        idcard: this.idcard,
        phone: this.areaCode + this.phone,
        name: this.name,
        amount: 1,
        proportion: 1
      }).then(res => {
        if (res.success && res.msg == '操作成功') {
          uni.showToast({
            title: '提交成功',
            icon: 'none'
          });
          this.phone = '';
          this.name = '';
          this.idcard = '';
        }
      });
    }
  },
  async onLoad() {
    let res = await getCountryCode();
    this.area = res.data;
    let _self=this;
    // #ifdef APP-PLUS
          var height = plus.navigator.getStatusbarHeight();
          console.log(height)
           _self.barHeight = height;
            // #endif
            // #ifdef H5
               _self.barHeight = 0;
               // #endif
    }

};
</script>

<style lang="scss">
.arrowleft {
  position: fixed;
  left: 10upx;
  z-index: 10;
}
.recruitBox:after {
  content: '';
  display: block;
  height: 30px;
}
.recruitBox {
  position: relative;
  z-index: 1;
  background-color: #2f32d7;
  .bg {
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 85vh;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .title {
    padding-top: 40vh;
    margin-bottom: 30px;
    text:nth-of-type(1) {
      display: block;
      text-align: center;
      font-size: 40rpx;
      color: #ffe24c;
      margin-bottom: 15px;
    }
    text:nth-of-type(2) {
      display: block;
      text-align: center;
      font-size: 30rpx;
      color: #ffe24c;
      margin-bottom: 15px;
    }
    image {
      display: block;
      margin: 0 auto;
      width: 320rpx;
      height: 30px;
    }
  }
  .plan {
    width: 87%;
    margin: 0 auto 30px auto;
    border-radius: 30rpx;
    background-color: #fff;
    padding: 30px 15px;
    text {
      font-size: 14px;
    }
  }
  .form {
    width: 87%;
    margin: 0 auto;
    border-radius: 30rpx;
    background-color: #fff;
    padding: 30px 30px;
    image {
      display: block;
      width: 70%;
      margin: 0 auto 20px auto;
    }
    input {
      border: 1px solid #2d2c30;
      border-radius: 4px;
      background-color: #f7f7f7;
      margin-bottom: 15px;
      font-size: 12px;
      height: 30px;
      padding-left: 5px;
    }
    .phone {
      display: flex;
      justify-content: space-between;
      picker {
        width: 22%;
        border: 1px solid #2d2c30;
        border-radius: 4px;
        background-color: #f7f7f7;
        font-size: 12px;
        height: 30px;
        line-height: 30px;
        text-align: center;
      }
      input {
        width: 70%;
        border: 1px solid #2d2c30;
        border-radius: 4px;
        background-color: #f7f7f7;
        font-size: 12px;
        height: 30px;
      }
    }
    .submit {
      height: 40px;
      background-color: #2d2c30;
      color: #fff;
      text-align: center;
      line-height: 40px;
      font-size: 14px;
    }
  }
}
</style>
