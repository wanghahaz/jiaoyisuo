<template>
	<view class="modalshadow" v-if="opt.isShow">
		<view class="box">
			<text class="title">{{opt.title}}</text>
			<text class="tip">{{opt.tip}}</text>
			<text class="content">{{opt.content}}</text>
			<view class="passwordBox">
				<input class="input_main" type="text" v-model="code" :placeholder="opt.ispsw ? '交易密码' : '验证码'" :password="opt.ispsw ? true : false"/>
				<text v-if="!timer && !opt.ispsw" @click="sendSms">获取验证码</text>
				<text v-if="timer && !opt.ispsw" style="color: #D9DADC">{{opt.time}}</text>
			</view>
			<view class="btns">
				<button @click="opt.success()">确定</button>
			</view>
			<text class="iconfont icondanchuangguanbi close" @click="close"></text>
		</view>
	</view>
</template>

<script>
import {sendSms} from '@/api/user_api'
	
export default {
	data() {
		return {
			code: '',
			timer: null,
			opt: {
				isShow: false,
				title: '提示',
				time: 60,
				phone: '',
				ispsw: false
			}
		};
	},
	methods: {
		async sendSms() {
			let res = await sendSms({
				phone: this.opt.phone,
				type: 1
			})
			console.log(res)
			if(res.success) {
				uni.showToast({
					title: '验证码已发送',
					icon: 'none'
				})
				this.startTimer()
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				})
			}
		},
		show(opt) {
			this.opt = Object.assign({}, this.opt, opt, {
				isShow: true
			})
			if(!this.opt.ispsw) {
				this.sendSms()
			}
		},
		startTimer() {
			this.timer = setInterval(() => {
				this.opt.time--
				if(this.opt.time == 0) {
					clearInterval(this.timer)
					this.opt.time = 60
					this.timer = null
				}
			}, 1000)
		},
		close() {
			if(!this.opt.ispsw) {
				clearInterval(this.timer)
				this.timer = null
			}
			this.opt.isShow = false
			this.code = ''
		}
	}
}
</script>

<style lang="scss">
.modalshadow {
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	top: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.4);
	width: 100%;
	height: 100%;
	z-index: 100;

	.box {
		width: 80%;
		background-color: #fff;
		border-radius: 6px;
		position: relative;
		.title {
			font-size: 34rpx;
			display: block;
			line-height: 100rpx;
			color: #333;
			text-align: center;
		}

		.tip {
			font-size: 26rpx;
			color: #ccc;
			text-align: center;
			margin-bottom: 20rpx;
			display: block;
		}

		.content {
			font-size: 40rpx;
			margin-bottom: 40rpx;
			display: block;
			text-align: center;
		}

		.passwordBox {
			margin: 0 auto;
			width: 80%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 80rpx;
			border-bottom: 1px solid #eee;
			input {
				width: 50%;
				height: 70rpx;
				box-sizing: border-box;
				padding-left: 8rpx;
				font-size: 26rpx;
			}
			>text{
				font-size: 24rpx;
				color: #534DFF;
			}
		}
		.btns {
			button {
				box-shadow: 0px 6px 10px -4px #534DFF;
				width: 80%;
				background-color: #534DFF;
				color: #fff;
				border-radius: 2px;
				margin-bottom: 40rpx;
				font-size: 32rpx;
			}
		}
		.close{
			position: absolute;
			top: 20px;
			right: 20px;
		}
	}
}
</style>
