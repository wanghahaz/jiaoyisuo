<template>
	<view class="content">
		<view class="list" @click="jumpDetails(1)">
			<view>服务协议</view>
			<view>
				<image class="rt" src="../../static/images/right_2.png"></image>
			</view>
		</view>
		<view class="list" @click="jumpDetails(13)">
			<view>隐私声明</view>
			<view>
				<image class="rt" src="../../static/images/right_2.png"></image>
			</view>
		</view>
		<view class="list" @click="jumpDetails(15)">
			<view>费率标准</view>
			<view>
				<image class="rt" src="../../static/images/right_2.png"></image>
			</view>
		</view>
		<view class="list">
			<view>版本号</view>
			<view>
				<text>V1.2.5</text>
				<image class="rt" src="../../static/images/right_2.png"></image>
			</view>
		</view>
		<view class="btn" @click="unLogin">退出当前账号</view>
	</view>
</template>

<script>
	import {logout} from '@/api/user_api.js'
	export default {
		data() {
			return {
				version: "",//版本号
			};
		},
		onLoad() {
			this.version = plus.runtime.version;
		},
		methods: {
			jumpDetails(id) {
				uni.navigateTo({
					url: "../notice/details?id=" + id
				})
			},
			unLogin() {
				let that = this;
				uni.showModal({
				    title: '提示',
				    content: '确定退出登录',
				    success: function (res) {
				        if (res.confirm) {
							let unLogin = logout().then((res)=> {
								if (res.code == 1) {
									uni.showToast({
										title: res.msg,
										icon: "none"
									})
                  uni.clearStorage('userinfo')
                  uni.clearStorage('usercenter')
									setTimeout(()=>{
										uni.reLaunch({
										    url: '../login_register/login'
										});
									},1500)
								}
							})
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			}
		}
	}
</script>

<style lang="scss">
	@import './list.css';
	.btn {
		box-shadow: 0px 6px 10px -4px #534DFF;
		background-color: #534DFF;
		color: #fff;
		font-size: 28upx;
		text-align: center;
		width: 690upx;
		height: 80upx;
		position: fixed;
		bottom: 60upx;
		line-height: 80upx;
		left: 30upx;
	}
</style>
