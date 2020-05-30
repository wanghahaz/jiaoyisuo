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
				<input type="text" v-model="email" placeholder="邮箱账号" style="margin-left: 16rpx;"/>
			</view>
			<button type="primary" @click="sendCode">下一步</button>
			<view class="next">
				<navigator url="/pages/login_register/forgetpassword" open-type="redirect">手机找回密码</navigator>
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
import {sendEmailCode, checkEmail, forgetPasswordPhone} from '@/api/user_api'
	
export default {
	data() {
		return {
			step: 1,
			email: '',
			verification: '',
			ispsw: true,
			password: '',
			confirmpassword: ''
		}
	},
	methods: {
		// 发送验证码, 先检查输入的账号有没有注册,如果注册了再发送验证码
		async sendCode() {
			let checkres = await checkEmail({
				email: this.email.trim()
			}, {
				source: 2
			})
			if(checkres.code === '0') {
				let res = await sendEmailCode({
					email: this.email.trim()
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
					title: '此邮箱未注册',
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
				email: this.phone.trim(),
				password: this.password,
				repeatPassword: this.confirmpassword,
				emailCode: this.verification
			})
			if(res.code === '1' && res.success) {
				uni.showToast({
					title: '登录密码修改成功',
					icon: 'none'
				})
				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/login_register/login?nav_num=1'
					})
				}, 3000)
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.loginBg{
	background-color: #fff;
	height: 100%;
	position: relative;
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
			color: #fff;
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
