<template>
	<view class="content">
		<view class="tel">
			<view class="ipt bb">
				<view>
					<view>新手机号</view>
					<input type="text" v-model="tel" placeholder="请输入手机号码"/>
				</view>
				<picker class="bb" @change="bindPickerChange" :value="index" :range="array">
				    <!-- <view class="uni-input">{{array[index]}}</view> -->
					<view class="down"><!-- {{array[index]}} -->+{{countryCode}}
						<image src="../../static/images/down_1.png"></image>
					</view>
				</picker>	
			</view>
			<view class="ipt bb">
				<view>
					<view>验证码</view>
					<input type="text" v-model="code" placeholder="请输入验证码"/>
				</view>
				<view class="code" v-if="!status" @click="getVerificationCode(4)">获取验证码</view>
				<view class="code" v-else>{{ timeNum }}</view>
			</view>
		</view>
		<view class="btn" @click="submit">提交</view>
	</view>
</template>

<script>
	import {updatePhone, sendSms, checkPhone, countryCode, checkSms} from '@/api/center_api.js';
	import {logout} from '@/api/user_api.js'
	import wPicker from "@/components/w-picker/w-picker.vue";
	export default {
		components: {
		  wPicker
		},
		data() {
			return {
				tel: "",
				code: "",
				status: false,
				timeNum: 60,
				countryCode: "",
				index: 0,
				array: [],
				timer: null
			};
		},
		async onLoad(options) {
			let cityData = await countryCode();
			this.cityData = cityData.data;
			console.log(this.cityData)
			this.cityData.forEach((item, index) => {
				this.array.push(item.cnName)
			})
			this.countryCode = this.cityData[0].code;
		},
		methods: {
			async submit() {
				if(this.code == "" || this.tel.trim() == "") {
					uni.showToast({
						title: "请输入验证码/手机号",
						icon: "none"
					})
					return
				}
				// let checkSmsRes = await checkSms({
				// 	phone: "00" + this.countryCode +this.tel.trim(),
				// 	code: this.code
				// })
				// if (checkSmsRes.code == 0) {
				// 	uni.showToast({
				// 		title: checkSmsRes.msg,
				// 		icon: "none"
				// 	})
				// 	return
				// }
				let result = await updatePhone({
					phone: "00" + this.countryCode +this.tel.trim(),
					code: this.code,
				}).then(res => {
					if (res.code == 1) {
						uni.showToast({
							title: "修改成功",
							icon: "none"
						})
						logout().then((res)=> {
							if (res.code == 1) {
								uni.showToast({
									title: res.msg,
									icon: "none"
								})
								setTimeout(()=>{
									uni.reLaunch({
									    url: '../login_register/login'
									});
								},1500)
							}
						})
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
					}
				});
			},
			bindPickerChange: function(e) {
			    console.log('picker发送选择改变，携带值为', e.target.value)
			    this.index = e.target.value;
				this.countryCode = this.cityData[e.target.value].code;
			},
			//获取验证码
			async getVerificationCode(index) {
				let phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/ // 手机正则
				if(this.tel.trim() == "") {
					uni.showToast({
						title: "请输入手机号",
						icon: "none"
					})
					return
				}
				if (!phoneReg.test(this.tel.trim())) {
					uni.showToast({
						title: "请输入正确手机号",
						icon: "none"
					})
					return
				}
				console.log("00" + this.countryCode +this.tel.trim())
				let checkres = await checkPhone({
					phone: "00" + this.countryCode +this.tel.trim(),
				}).then(async res=> {
					if(res.code == 1) {
						this.status = true
						this.timer = setInterval(() => {
							this.timeNum--
							if(this.timeNum == 0) {
								this.status = false;
								this.timeNum = 60;
								clearInterval(this.timer)
							}
						}, 1000)
						let res = await sendSms({
							phone: "00" + this.countryCode +this.tel.trim(),
							type: index
						})
						if(res.code == 1) {
							uni.showToast({
								title: '验证码已发送',
								icon: 'none'
							})
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}
	.content {
		padding: 40upx 30upx;
		font-size: 28upx;
		font-weight: 500;
	}
	.ipt {
		position: relative;
		margin-bottom: 20upx;
		> view {
			display: flex;
			align-items: center;
			view {
				width: 144upx;
			}
		}
		input {
			padding: 20upx 20upx 20upx 0;
			font-size: 24upx;
			flex: 1;
		}
		> image {
			width: 32upx;
			height: 18upx;
			padding: 20upx;
			position: absolute;
			right: 0;
			bottom: 0;
		}
		.code {
			padding: 20upx 20upx;
			color: #5DC1CF;
			font-size: 24upx;
			position: absolute;
			right: 0;
			bottom: 0;
		}
	}
	.down {
		position: absolute;
		right: 0;
		bottom: 0;
		padding: 20upx 0 20upx 20upx;
		font-size: 24upx;
		image {
			width: 14upx;
			height: 8upx;
			margin-left: 8upx;
			vertical-align: middle;
		}
	}
	.btn {
		background: #5DC1CF;
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
