<template>
	<view class="content">
		<view class="list">
			<view>头像</view>
			<view>
				<image class="pic" src="../../static/images/user_13.png"></image>
				<!-- <text>李思来</text> -->
				<image class="rt" src="../../static/images/right_2.png"></image>
			</view>
		</view>
		<view class="list">
			<view>UID</view>
			<view>
				<text>{{userData.userId}}</text>
			</view>
		</view>
		<view class="list">
			<view>姓名</view>
			<view>
				<text>{{userData.name}}</text>
			</view>
		</view>
		<view class="list" @click="jumpReal">
			<view>认证信息</view>
			<view>
				<text>{{userData.checkStatus == -1 ? '未通过' : userData.checkStatus == 0 ? "未认证" : userData.checkStatus == 1 ? '待审核' :  '审核通过'}}</text>
				<image class="rt" src="../../static/images/right_2.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userData: {}
			};
		},
		onLoad() {
			let that = this;
			uni.getStorage({
			    key: 'userinfo',
			    success: res=> {
					that.userData = res.data
			    }
			});
		},
		methods: {
			jumpReal() {
				if (this.userData.checkStatus == -1 || this.userData.checkStatus == 0) {
					uni.navigateTo({
						url:"./real"
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	@import './list.css';
</style>
