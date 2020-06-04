<template>
	<view class="loginBg">
<!-- 		<view class="bg">
			<image src="../../static/images/login_register/login_bg.png" mode="widthFix"></image>
		</view> -->
		<image src="../../static/images/title_img.png" mode="widthFix"></image>
		<view class="nav">
			<view class="nav_item" :class="{active: nav_num == 0}" @click="nav_num = 0">
				<text>手机注册</text>
			</view>		
			<view class="nav_item" :class="{active: nav_num == 1}"  @click="nav_num = 1">
				<text>邮箱注册</text>
			</view>	
		</view>
		<view class="form" v-if="nav_num == 0">
			<view class="form_item" style="justify-content: flex-start;">
				<picker @change="selectPhoneArea" :value="areaIndex" :range="area" range-key="cnName" v-if="area.length">
					<view class="uni-input">{{'+' + area[areaIndex]['code']}}</view>
				</picker>
				<text class="iconfont iconxiala1 small"></text>
				<input type="text" v-model="phone" placeholder="手机号码" style="margin-left: 16rpx;"/>
			</view>
			<view class="form_item">
				<input type="text" v-model="verificationCode1" placeholder="验证码"/>
				<text @click="getVerificationCode(0)" v-if="!timerStatus1">获取验证码</text>
				<text v-else style="color: #D9DADC">{{timerNum1}}</text>
			</view>
			<view class="form_item">
				<input type="text" v-model="password1" placeholder="设置登录密码" :password="ispsw1"/>
				<text class="iconfont iconchakan" @click="ispsw1 = !ispsw1" v-if="ispsw1"></text>
				<text class="iconfont iconbianzu" @click="ispsw1 = !ispsw1" v-else></text>
			</view>
			<view class="form_item">
				<input type="text" v-model="confirmpassword1" placeholder="再次确认登录密码" :password="ispsw1"/>
				<text class="iconfont iconchakan" @click="ispsw1 = !ispsw1" v-if="ispsw1"></text>
				<text class="iconfont iconbianzu" @click="ispsw1 = !ispsw1" v-else></text>
			</view>
			<view class="form_item">
				<input type="text" v-model="uid1" placeholder="推荐人邀请码(选填)"/>
			</view>
		</view>
		<view class="form" v-if="nav_num == 1">
			<view class="form_item">
				<input type="text" v-model="email" placeholder="邮箱账号"/>
			</view>
			<view class="form_item">
				<input type="text" v-model="password2" placeholder="设置登录密码" :password="ispsw2"/>
				<text class="iconfont iconchakan" @click="ispsw2 = !ispsw2" v-if="ispsw2"></text>
				<text class="iconfont iconbianzu" @click="ispsw2 = !ispsw2" v-else></text>
			</view>
			<view class="form_item">
				<input type="text" v-model="confirmpassword2" placeholder="再次确认登录密码" :password="ispsw2"/>
				<text class="iconfont iconchakan" @click="ispsw2 = !ispsw2" v-if="ispsw2"></text>
				<text class="iconfont iconbianzu" @click="ispsw2 = !ispsw2" v-else></text>
			</view>
			<view class="form_item">
				<input type="text" v-model="uid2" placeholder="推荐人邀请码(选填)"/>
			</view>
		</view>
		<view class="btnBox">
			<button type="primary" @click="submit">立即注册</button>
			<view class="toLogin">
				<navigator url="/pages/login_register/login" open-type="redirect">已有账号 立即登录</navigator>
			</view>
			<view class="agree">
				<checkbox-group  @change="agree = !agree">
					<checkbox :checked="agree" style="transform:scale(0.5);"/>
				</checkbox-group>
				<text>我已阅读并同意</text>
				<navigator url="/pages/login_register/agreement">《super culture注册用户协议》</navigator>
			</view>
		</view>
	</view>
</template>

<script>
import {getCountryCode, checkPhone, checkEmail, sendSms, checkSms, phoneRegister, emailRegister} from '@/api/user_api'
import {mapGetters} from 'vuex'
	
export default {
	data() {
		return {
			nav_num: 0, // 切换导航绑定值
			area: [], // 手机区号列表
			areaIndex: 0,
			phone: '', // 手机号
			email: '', //邮箱号
			ispsw1: true, // 密码是否可见,true可见false不可见
			ispsw2: true, // 密码是否可见,true可见false不可见
			password1: '', //密码
			confirmpassword1: '', //确认密码
			verificationCode1: '', //验证码
			uid1: '', //邀请人uid
			timer1: null, // 倒计时定时器
			timerStatus1: false ,// 倒计时状态
			timerNum1: 60, // 倒计时时间
			password2: '', //密码
			confirmpassword2: '', //确认密码
			uid2: '', //邀请人uid
			agree: true // 是否同意协议
		}
	},
	computed: {
		...mapGetters(['deviceInfo']),
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
		// 判断手机或邮箱是否被注册 return false为注册,true为未注册
		checkUser(username, type) {
			return new Promise(resolve => {
				let checkres = null
				if(type == 0) { //判断手机
					checkPhone({
						phone: this.areaCode + this.phone.trim()
					}).then(res => {
						checkres = res
						if(checkres.code === '0') {
							resolve(false)
						} else {
							resolve(true)
						}
					})
				} else if(type == 1) {//判断邮箱
					checkEmail({
						email: this.email.trim(),
						type: 1
					}, {
						source: 2
					}).then(res => {
						checkres = res
						if(checkres.code === '0') {
							resolve(false)
						} else {
							resolve(true)
						}
            
					})
				}
			})
		},
		// 发送手机验证码
		async getVerificationCode(index) {
			let checkres = await this.checkUser(this.phone, index) //先判断是否注册
			if(checkres) {
				this.timerStatus1 = true
				this.timer1 = setInterval(() => {
					this.timerNum1--
					if(this.timerNum1 === 0) {
						clearInterval(this.timer1)
						this.timerStatus1 = false
						this.timerNum1 = 60
					}
				}, 1000)
				let res = await sendSms({
					phone: this.areaCode + this.phone.trim(),
					type: 1
				})
				if(res.success) {
					uni.showToast({
						title: '验证码已发送',
						icon: 'none'
					})
				}
			} else {
				uni.showToast({
					title: '此号码已注册',
					icon: 'none'
				})
			}
		},
		
		// 点击注册按钮
		async submit() {
			let phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/ // 手机正则
			let emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/ // 邮箱正则
			if(this.nav_num === 0) {
				if(!this.phone || !this.password1 || !this.confirmpassword1) {
					uni.showToast({
						title: '请将注册信息填写完整',
						icon: 'none'
					})
					return
				}
				if(!phoneReg.test(this.phone)) {
					uni.showToast({
						title: '请输入正确的手机号码',
						icon: 'none'
					})
					return
				}
				if(!this.verificationCode1) {
					uni.showToast({
						title: '请输入验证码',
						icon: 'none'
					})
					return
				}
        if(this.password1.length<6||this.confirmpassword1<6){
          uni.showToast({
          	title: '密码不得少6位',
          	icon: 'none'
          })
          return
        }
				if(this.password1 !== this.confirmpassword1) {
					uni.showToast({
						title: '两次密码输入不一致',
						icon: 'none'
					})
					return
				}
				if(!this.agree) {
					uni.showToast({
						title: '请同意《用户协议》',
						icon: 'none'
					})
					return
				}
				// 先判断验证码是否正确,正确再调用注册接口
				let checkSmsRes = await checkSms({
					phone: this.areaCode + this.phone.trim(),
					code: this.verificationCode1
				})
				if(checkSmsRes.success && checkSmsRes.code === '1') {
					let res = await phoneRegister({
						phone: this.areaCode + this.phone.trim(),
						password: this.password1,
						repeatPassword: this.confirmpassword1,
						smsCode: this.verificationCode1,
						invateCode: this.uid1,
						source: this.deviceInfo.platform === 'android' ? 3 : this.deviceInfo.platform === 'ios' ? 2 : 1,
					})
					if(res.code === '1' && res.success) {
						uni.showToast({
							title: '注册成功!',
							icon: 'none'
						})
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/login_register/login'
							})
						}, 3000)
					}
				} else {
					uni.showToast({
						title: '验证码错误',
						icon: 'none'
					})
				}
			} else if(this.nav_num === 1) {
				if(!this.email || !this.password2 || !this.confirmpassword2) {
					uni.showToast({
						title: '请将注册信息填写完整',
						icon: 'none'
					})
					return
				}
				if(!emailReg.test(this.email)) {
					uni.showToast({
						title: '请输入正确的邮箱地址',
						icon: 'none'
					})
					return
				}
        if(this.password2.length<6||this.confirmpassword2<6){
          uni.showToast({
          	title: '密码不得少6位',
          	icon: 'none'
          })
          return
        }
				if(this.password2 !== this.confirmpassword2) {
					uni.showToast({
						title: '两次密码输入不一致',
						icon: 'none'
					})
					return
				}
				if(!this.agree) {
					uni.showToast({
						title: '请同意《用户协议》',
						icon: 'none'
					})
					return
				}
				let checkres = await this.checkUser(this.email, 1)
				if(!checkres) {
					uni.showToast({
						title: '此邮箱已注册',
						icon: 'none'
					})
					return
				}
				let res = await emailRegister({
					email: this.email.trim(),
					password: this.password2,
					repeatPassword: this.confirmpassword2,
					invateCode: this.uid2,
					source: this.deviceInfo.platform === 'android' ? 3 : this.deviceInfo.platform === 'ios' ? 2 : 1,
				})
				if(res.code === '1' && res.success) {
					uni.showToast({
						title: '注册成功!请点击激活邮件!',
						icon: 'none'
					})
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/login_register/login?nav_num=1'
						})
					}, 3000)
				}else{
          uni.showToast({
          	title: res.msg,
          	icon: 'none'
          })
        }
			}
		}
	},
	async onLoad() {
		let res = await getCountryCode()
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
	}
	>image{
		width: 65%;
		display: block;
		margin: 0 auto;
		padding-top: 150rpx;
		position: relative;
		z-index: 1;
	}
	.nav{
		position: relative;
		z-index: 2;
		margin-top: 66rpx;
		display: flex;
		justify-content: center;
		color: #333;
		font-size: 34rpx;
		.nav_item{
			box-sizing: border-box;
			padding: 10rpx 0 20rpx 0;
			margin: 0 26rpx;
		}
		.nav_item.active{
			color: #534DFF;
			border-bottom: 2px solid #534DFF;
		}
	}
	.form{
		position: relative;
		z-index: 2;
		margin-top: 60rpx;
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
				color: #534DFF;
				margin-bottom: 16rpx;
				font-size: 30rpx;
			}
		}
	}
	.btnBox{
		width: 100%;
		position: fixed;
		bottom: 70rpx;
		left: 0;
		button{
			width: 85%;
			background-color: #534DFF;
			color: #fff;
			font-size: 32rpx;
			height: 100rpx;
			line-height: 100rpx;
			box-shadow: 0px 6px 10px -4px #534DFF;
		}
		.toLogin{
			margin: 40rpx 0;
			border-bottom: none;
			font-size: 30rpx;
			text-align: center;
			width: 100%;
			color: #333;
		}
		.agree{
			font-size: 24rpx;
			text-align: center;
			checkbox-group{
				display: inline-block;
				checkbox{
					display: inline-block;
				}
			}
			text{
				color: #333;
			}
			navigator{
				display: inline;
				color: #534DFF;
			}
		}
	}
}
</style>
