<template>
	<view class="content pd23">
		<view class="address">
			<view>
				<view class="ft6">提现地址</view>
				<view @click="addAddress">选择地址</view>
			</view>
			<input class="bb" type="text" v-model="dAddress" value="" placeholder="请输入提现地址" />
		</view>
		<view class="remark">
			<view>
				<view class="ft6">备注 (选填)</view>
			</view>
			<input class="bb" type="text" v-model="remark" value="" placeholder="备注信息" />
		</view>
		<view class="getMoney">
			<view>
				<view class="ft6">提现数额</view>
			</view>
			<view class="flexv">
				<input class="bb" type="digit" v-model="number" value="" placeholder="提现数额" />
				<view class="all" @click="all">全部提现</view>
			</view>
		</view>
		<view class="tips">
			<view>温馨提示： </view>
			<view>* 最小提现数量为0.01{{name}} </view>
			<view>* 最大提现数量为{{max}}{{name}} </view>
			<view>* 该提现手续费为0{{name}} </view>
			<view>* 您可以在提现记录页面跟踪状态</view>
		</view>
		<button :loading="loading" @click="cashWithdrawal">提现</button>
		<!-- <w-picker
		    mode="region"
		    :level="3"
		    @confirm="onConfirm"
		    ref="picker"
		    themeColor="#5DC1CF"
		></w-picker> -->
	</view>
</template>

<script>
	// import wPicker from "@/components/w-picker/w-picker.vue";
	import {withdrawal} from '@/api/wallet_api.js';
	export default {
		components: {
		  // wPicker
		},
		data() {
			return {
				// addressText: "选择地址",
				dAddress: "",
				remark: "",
				number: "",
				loading: false,
				id: "",
				max: "",
				name: ""
			};
		},
		onLoad(options) {
			this.id = options.id;
			this.max = options.max;
			this.name = options.name;
		},
		onShow(){
			if (uni.getStorageSync("isBack")) {
				this.dAddress = uni.getStorageSync("address");
				uni.removeStorageSync("isBack")
			}
			
		},
		// 监听右上角按钮
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: "./bill"
			})
		},
		methods: {
			//地区联动回调
			onConfirm(res) {
				this.addressText = "";
				for(var i = 0; i < res.checkArr.length; i++) {
					this.addressText += res.checkArr[i] + "/"
				}
				
				this.addressText = this.addressText.replace(/(.*)\//, '$1')
				console.log(res)
			},
			//添加地址
			addAddress() {
				uni.navigateTo({
					url: "./listAddress"
				})
			},
			//全部提现
			all() {
				this.number = this.max;
			},
			//提现
			async cashWithdrawal() {
				if (this.dAddress == "" || this.number == "") {
					uni.showToast({
						title: "请填写相关内容",
						icon: "none"
					})
					return
				}
				console.log(this.dAddress)
				console.log(this.remark)
				console.log(this.number)
				console.log(this.id)
				await withdrawal({
					address: this.dAddress,
					remark: this.remark,
					qty: this.number,
					coinId: this.id
				}).then(res=> {
					console.log(!res.code)
					// if (res.code) {
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
						setTimeout(()=>{
							uni.navigateBack({
								delta: 1
							})
						},1500)
					// } else {
						
					// }
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}
	.address, .remark, .getMoney {
		position: relative;
		> view {
			display: flex;
			justify-content: space-between;
			align-items: center;
			view:last-child {
				font-size: 24upx;
				padding: 20upx 0;
			}
			view:first-child {
				font-size: 28upx;
				padding: 20upx 0;
			}
		}
	}
	.flexv {
		display: flex;
		justify-content: space-between;
		align-items: center;
		input {
			flex: 1;
		}
	}
	.all {
		font-size: 28upx;
		color: #5DC1CF;
		height: 100upx;
		// position: absolute;
		// right: 0;
		// bottom: -20upx;
		padding: 20upx 0 20upx 30upx !important;
	}
	input {
		width: 100%;
		padding: 20upx 0;
		font-size: 28upx;
		box-sizing: border-box;
		height: 68upx;
		margin-bottom: 20upx;
	}
	.tips {
		border-radius: 8upx;
		background: #F5F5F5;
		padding: 20upx 40upx;
		font-size: 20upx;
		line-height: 30upx;
		margin-top: 80upx;
	}
	button {
		color: #fff;
		background: #5DC1CF;
		border-radius: 0;
		height: 80upx;
		font-size: 28upx;
		position: fixed;
		bottom: 40upx;
		width: 690upx;
		box-sizing: border-box;
		line-height: 80upx;
	}
</style>
