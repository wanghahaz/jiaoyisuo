<template>
	<view class="content">
		<view class="number bb">
			<view>
				<view>{{invateData.vertycounts}}</view>
				<text>已邀请人数</text>
			</view>
			<text></text>
			<view>
				<view>{{invateData.registercounts}}</view>
				<text>已认证人数</text>
			</view>
		</view>
		<view class="url pd23">
			<view class="ft6">邀请链接</view>
			<view class="code bb">
				<text>{{invateData.invateAddress}}</text>
				<view @click="copy(invateData.invateAddress)">复制链接</view>
			</view>
			<view class="qrimg">
				<view>
			    <tki-qrcode
			    ref="qrcode"
			    :val="codeUrl"
			    :size="250"
			    :onval="true"
			    :usingComponents="true"
			    />
				</view>
			</view>
			<!-- <image src="../../static/images/bg_3.png"></image> -->
			<view class="ft6">推广链接二维码</view>
		</view>
		<view class="list">
			<view class="ft6 bb pd23">邀请记录</view>
			<view class="pd23">
				<view class="tab">
					<view>用户信息</view>
					<view>用户UID</view>
					<view>注册时间</view>
				</view>
				<view class="listItem bb" v-for="(val, index) in list" :key="index">
					<view class="head">
						<image src="../../static/images/user_13.png"></image>
						<text>{{val.idName}}</text>
						<view :style="{color: val.checkStatus < 2 ? '#fff' : '', background: val.checkStatus < 2 ? '#D8D8D8' : ''}">{{val.checkStatus == -1 ? "未通过" : val.checkStatus == 0 ? "未认证" : val.checkStatus == 1 ? "待审核" : "已认证"}}</view>
					</view>
					<view>{{val.id}}</view>
					<view>{{val.registerTime}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {myInvate} from '@/api/center_api.js';
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue";
	import {timestampToTime} from '@/common/timestampToTime.js';
	export default {
		components: {
			tkiQrcode,
		},
		data() {
			return {
				invateData: {},
				codeUrl: "",
				list: [],
			};
		},
		async onLoad() {
			let invateData = await myInvate();
			this.invateData = invateData.data;
			this.list = invateData.data.inver;
			this.codeUrl = invateData.data.invateAddress;
			console.log(invateData.data)
			console.log(this.list)
			console.log(this.codeUrl)
			for(let i = 0; i < this.list.length; i++) {
				this.list[i].registerTime = timestampToTime(this.list[i].registerTime, "dateTime")
			}
			// invateData.data.inver.forEach((item,index)=> {
			// 	item.registerTime = time(item.registerTime, "dateTime");
			// })
			
		},
		methods: {
			//复制
			copy(num){
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
	.number {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 36upx;
		text-align: center;
		padding: 20upx 0;
		view text {
			font-size: 24upx;
			margin-top: 10upx;
			color: #999;
		}
		> text {
			display: block;
			margin: 0 114upx;
			width: 2upx;
			height: 60upx;
			background: #f5f5f5;
		}
	}
	.url {
		border-bottom: 20upx solid #f5f5f5;
		font-size: 28upx;
		.code {
			font-size: 24upx;
			color: #666;
			display: flex;
			justify-content: space-between;
			align-items: center;
			text {
				flex: 1;
			}
			view {
				padding: 20upx 0 20upx 20upx;
				color: #EC5754;
			}
		}
		.qrimg {
			margin: 40upx auto;
			text-align: center;
			>view{
				width: 296rpx;
				height: 296rpx;
				padding: 23rpx;
				margin: 0 auto;
				background-color: #EFF0FB;
			}
		}
		> view:last-child {
			text-align: center;
		}
	}
	.list {
		font-size: 28upx;
		.tab {
			font-size: 24upx;
			display: flex;
			justify-content: space-between;
		}
		.listItem {
			padding: 20upx 0;
			font-size: 24upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.head {
				display: flex;
				align-items: center;
				image {
					width: 52upx;
					height: 52upx;
					border-radius: 50%;
				}
				text {
					margin: 0 14upx 0 20upx;
				}
				view {
					background: #D2FFF5;
					color: #5DC1CF;
					font-size: 20upx;
					padding: 4upx;
					border-radius: 4upx;
				}
			}
			> view:last-child {
				color: #999;
			}
		}
	}
</style>
