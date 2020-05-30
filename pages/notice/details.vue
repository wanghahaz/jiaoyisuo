<template>
	<view class="content">
		<view class="title bb ft6">
			<view>{{details.name}}</view>
			<view class="time">
				<view>发布时间：{{details.releaseTime}}</view>
				<view>发布人：Super Culture数字资产交易所</view>
			</view>
		</view>
		<view class="html pd23">
			<rich-text :nodes="details.contentApp"></rich-text>
		</view>
	</view>
</template>

<script>
	import {contentDetails} from '@/api/content_api.js';
	export default {
		data() {
			return {
				details: {},
			};
		},
		async onLoad(options) {
			let details = await contentDetails({
				id: options.id
				});
			this.details = details.data;
			const regex = new RegExp('<img', 'gi');
			this.details.contentApp = this.details.contentApp.replace(regex, `<img style="width: 100%;"`);
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}
	.title {
		padding: 40upx 30upx;
		font-size: 28upx;
		>view:nth-of-type(1){
			font-size: 36rpx;
		}
		.time {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 20upx;
			color: #999;
			margin-top: 20upx;
		}
	}
	.html {
		background: #fff;
	}
</style>
