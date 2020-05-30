<template>
	<view class="content">
		<view class="bb step">
			<view class="title">第一步下载谷歌验证器APP</view>
			<image src="../../static/images/google.png"></image>
			<text>进入android应用市场下载谷歌验证器APP</text>
		</view>
		<view class="bb step">
			<view class="title">第二步使用谷歌验证器扫描谷歌二维码或填入密钥</view>
			<view class="qrimg">
				<tki-qrcode
				ref="qrcode"
				:val="codeUrl"
				:size="220"
				:onval="true"
				:usingComponents="false"
				/>
			</view>
			<text>密匙: {{key}}</text>
			<view class="tips">温馨提示：如果您无法扫描二维码，可以将该16位密钥手动输入到谷歌验证APP中</view>
		</view>
		<view class="code">
			<view class="title">第三步绑定谷歌验证器</view>
			<input class="bb" type="text" v-model="code" placeholder="请输入谷歌验证码"/>
		</view>
		<view class="btn" @click="btn">开启认证</view>
	</view>
</template>

<script>
	import {getGoogleQRBarcodeUrl, bindGoogleCode} from '@/api/center_api.js';
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue";
	export default {
		components: {
			tkiQrcode,
		},
		data() {
			return {
				code: "",//验证码
				codeUrl: "",
				key: ""
			};
		},
		async onLoad(options) {
			let data = await getGoogleQRBarcodeUrl();
			this.codeUrl = data.data.QRBarcodeUrl;
			this.key = data.data.secret;
			// this.codeUrl = data.data.address;
		},
		methods: {
			async btn() {
				if(this.code == "") {
					uni.showToast({
						title: "请输入相关内容",
						icon: "none"
					})
					return
				}
				let googleResult = await bindGoogleCode({
					googleKey: this.key,
					googleCode: this.code
				}).then(res=> {
					if (res.code == 1) {
						uni.showToast({
							title: "绑定成功",
							icon: "none"
						})
						setTimeout(() => {
							uni.navigateBack({
								delta:1
							})
						},1500)
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}
	.content {
		padding-bottom: 54upx;
		> view {
			font-size: 28upx;
		}
	}
	.step {
		padding: 40upx 30upx;
		image {
			width: 220upx;
			height: 220upx;
			margin: 40upx auto;
			display: block;
		}
		.qrimg {
			width: 220upx;
			height: 220upx;
			margin: 40upx auto;
		}
		text {
			font-size: 24upx;
			text-align: center;
			display: block;
		}
		.tips {
			padding: 20upx 40upx;
			background: #f5f5f5;
			border-radius: 8upx;
			font-size: 24upx;
			margin-top: 40upx;
		}
	}
	.code {
		padding: 40upx 30upx 0;
		input {
			padding: 20upx 0;
			font-size: 28upx;
		}
	}
	.btn {
		box-shadow: 0px 6px 10px -4px #534DFF;
		background: #534DFF;
		color: #fff;
		text-align: center;
		width: 690upx;
		height: 80upx;
		line-height: 80upx;
		margin: 60upx auto 0;
	}
</style>
