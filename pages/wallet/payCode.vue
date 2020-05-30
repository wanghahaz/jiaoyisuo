<template>
	<view class="content pd23">
		<view class="token bb">
			<view class="ft6">{{name}}充值地址</view>
			<view>
				<view>{{codeUrl}}</view>
				<view @click="clickCopy(codeUrl)">复制</view>   
			</view>
		</view>
		<view class="qrcode">
			<tki-qrcode
			ref="qrcode"
			:val="codeUrl"
			:size="280"
			:onval="true"
			:usingComponents="false"
			/>
		</view>
		<view class="tips">
			<view>温馨提示： </view>
			<view>* 禁止向 {{name}}地址充值除 {{name}}之外的资产 </view>
			<view>* 任何充入{{name}} 地址的非 {{name}} 资产将不可找回 </view>
			<view>* 使用 {{name}} 地址充值需要网络确认才能到账 </view>
			<view>* 充值完成后，您可以进入充值记录页面跟踪进度</view>
		</view>
	</view>
</template>

<script>
	import {recharge} from '@/api/wallet_api.js';
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue";
	export default {
		components: {
			tkiQrcode,
		},
		data() {
			return {
				codeUrl: "",
				name: ""
			};
		},
		async onLoad(options) {
			this.name = options.name;
			let data = await recharge({
				coinId: options.id
			});
			if (data.code == 0) {
				uni.showToast({
					title: data.msg,
					icon: "none"
				})
			}
			this.codeUrl = data.data.address;
		},
		// 监听右上角按钮
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: "./bill"
			})
		},
		methods: {
			//复制
			clickCopy(num){
			  uni.setClipboardData({
			    data: num
			  });
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}
	.token {
		padding-bottom: 20upx;
		>view:first-child {
			font-size: 28upx;
		}
		>view:last-child {
			display: flex;
			font-size: 24upx;
			justify-content: space-between;
			align-items: center;
			view:first-child {
				color: #666666;
			}
			view:last-child {
				color: #EC5754;
				padding: 20upx 0 20upx 20upx;
			}
		}
	}
	.qrcode {
		padding: 40upx;
		text-align: center;
		image {
			width: 420upx;
			height: 420upx;
		}
	}
	.tips {
		border-radius: 8upx;
		background: #F5F5F5;
		padding: 20upx 40upx;
		font-size: 20upx;
		line-height: 30upx;
	}
</style>
