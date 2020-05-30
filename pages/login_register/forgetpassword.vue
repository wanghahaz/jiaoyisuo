<template>
	<view class="loginBg">
		<view class="bg">
			<!-- <image src="../../static/images/login_register/login_bg.png" mode="widthFix"></image> -->
			<text class="iconfont iconbianzu59" v-if="step == 2" @click="step = 1"></text>
			<text class="iconfont iconbianzu59" v-if="step == 3" @click="step = 2"></text>
		</view>
		<image src="../../static/images/title_img.png" mode="widthFix"></image>
		<view class="form" v-if="step === 1">
			<view class="form_item" style="justify-content: flex-start;">
				<picker @change="selectPhoneArea" :value="areaIndex" :range="area" range-key="cnName" v-if="area.length">
					<view class="uni-input">{{'+' + area[areaIndex]['code']}}</view>
				</picker>
				<text class="iconfont iconxiala1 small"></text>
				<input type="text" v-model="phone" placeholder="手机号码" style="margin-left: 16rpx;"/>
			</view>
			<button type="primary" @click="sendCode">下一步</button>
			<view class="next">
				<navigator url="/pages/login_register/forgetpasswordEmail" open-type="redirect">邮箱找回密码</navigator>
			</view>
		</view>
		<view class="form" v-if="step === 2">
			<view class="form_item" style="justify-content: flex-start;">
				<input type="text" v-model="verification" placeholder="填写验证码" style="margin-left: 16rpx;"/>
			</view>
			<button type="primary" @click="step++">下一步</button>
		</view>
		<view class="form" v-if="step === 3">
			<view class="form_item psw">
				<input type="text" v-model="password" placeholder="填写新登录密码" :password="ispsw"/>
				<text class="iconfont iconchakan" @click="ispsw = !ispsw" v-if="ispsw"></text>
				<text class="iconfont iconbianzu" @click="ispsw = !ispsw" v-else></text>
			</view>
			<view class="form_item psw">
				<input type="text" v-model="confirmpassword" placeholder="再次填写新登录密码" :password="ispsw"/>
				<text class="iconfont iconchakan" @click="ispsw = !ispsw" v-if="ispsw"></text>
				<text class="iconfont iconbianzu" @click="ispsw = !ispsw" v-else></text>
			</view>
			<button type="primary" @click="confirm">确认并重新登录</button>
		</view>
	</view>
</template>

<script>
import {getCountryCode, sendSms, checkPhone, forgetPasswordPhone} from '@/api/user_api'
	
export default {
	data() {
		return {
			step: 1,
			phone: '',
			area: [],
			areaIndex: 0,
			verification: '',
			ispsw: true,
			password: '',
			confirmpassword: ''
		}
	},
	computed: {
		// 选择的手机地区号
		areaCode() {
			return '00' + this.area[this.areaIndex].code
		}
	},
	methods: {
		// 选择手机地区
		selectPhoneArea(e) {
			console.log(e.target.value)
			this.areaIndex = e.target.value
		},
		// 发送验证码, 先检查输入的账号有没有注册,如果注册了再发送验证码
		async sendCode() {
			let checkres = await checkPhone({
				phone: this.areaCode + this.phone.trim()
			})
			if(checkres.code === '0') {
				let res = await sendSms({
					phone: this.areaCode + this.phone.trim(),
					type: 5
				})
				if(res.success) {
					uni.showToast({
						title: '验证码已发送',
						icon: 'none'
					})
					this.step++
				}
			} else if(checkres.code === '1') {
				uni.showToast({
					title: '此号码未注册',
					icon: 'none'
				})
				return
			}
		},
		// 确认修改密码
		async confirm() {
			if(this.password !== this.confirmpassword) {
				uni.showToast({
					title: '两次密码填写不一致',
					icon: 'none'
				})
				return
			}
			let res = await forgetPasswordPhone({
				phone: this.areaCode + this.phone.trim(),
				password: this.password,
				repeatPassword: this.confirmpassword,
				code: this.verification
			})
			if(res.code === '1' && res.success) {
				uni.showToast({
					title: '登录密码修改成功',
					icon: 'none'
				})
				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/login_register/login'
					})
				}, 3000)
			}
		}
	},
	async onLoad() {
		let res = await getCountryCode()
		console.log(res)
		this.area = res.data
	}
}
</script>

<style lang="scss" scoped>
.loginBg{
	height: 100%;
	position: relative;
	background-color: #fff;
	.bg{
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		image{
			width: 100%;
		}
		text{
			position: absolute;
			top: 60rpx;
			left: 30rpx;
			color: #333;
		}
	}
	>image{
		width: 65%;
		display: block;
		margin: 0 auto;
		padding-top: 150rpx;
		position: relative;
		z-index: 1;
	}
	.form{
		margin-top: 300rpx;
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		.form_item{
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			width: 85%;
			margin-bottom: 50rpx;
			border-bottom: 1px solid #F0F0F2;
			color: #333;
			picker{
				color: #333;
				font-size: 32rpx;
				margin-bottom: 16rpx;
			}
			.iconfont{
				font-size: 24rpx;
				color: #5A5D64;
			}
			input{
				margin-bottom: 16rpx;
				width: 75%;
				font-size: 32rpx;
			}
			text{
				margin-bottom: 16rpx;
				font-size: 30rpx;
			}
		}
		button{
			box-shadow: 0px 6px 10px -4px #534DFF;
			width: 85%;
			background-color: #534DFF;
			color: #fff;
			font-size: 32rpx;
			height: 100rpx;
			line-height: 100rpx;
		}
		.next{
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
