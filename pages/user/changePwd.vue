<template>
	<view class="content">
		<view class="pwd" v-if="type == 0">
			<view class="ipt bb">
				<view>
					<view>旧密码</view>
					<input type="text" :password="password" v-model="oPwd" placeholder="请填写旧登录密码"/>
				</view>
				<image src="../../static/images/eye_2.png" @click="pwd(1)"></image>
			</view>
			<view class="ipt bb">
				<view>
					<view>新密码</view>
					<input type="text" :password="password" v-model="nPwd" placeholder="请填写新登录密码"/>
				</view>
				<image src="../../static/images/eye_2.png" @click="pwd(1)"></image>
			</view>
			<view class="ipt bb">
				<view>
					<view>确认密码</view>
					<input type="text" :password="password" v-model="nPwdT" placeholder="请再次输入新登录密码"/>
				</view>
				<image src="../../static/images/eye_2.png" @click="pwd(1)"></image>
			</view>
		</view>
		<view class="cpwd" v-if="type == 1">
			<view class="ipt bb" v-if="transactionPasswordIsNull == 0">
				<view>
					<view>旧交易密码</view>
					<input type="text" :password="password" v-model="ocPwd" placeholder="请填写交易密码"/>
				</view>
				<image src="../../static/images/eye_2.png" @click="pwd(1)"></image>
			</view>
			<view class="ipt bb">
				<view>
					<view>交易密码</view>
					<input type="text" :password="password" v-model="cPwd" placeholder="请填写交易密码"/>
				</view>
				<image src="../../static/images/eye_2.png" @click="pwd(1)"></image>
			</view>
			<view class="ipt bb">
				<view>
					<view>确认密码</view>
					<input type="text" :password="password" v-model="cPwdT" placeholder="请再次填写交易密码"/>
				</view>
				<image src="../../static/images/eye_2.png" @click="pwd(1)"></image>
			</view>
		</view>
		<view class="tel" v-if="type == 2">
			<view class="ipt bb">
				<view>
					<view>新手机号</view>
					<input type="text" v-model="nTel" value="" placeholder="请填写手机号"/>
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
					<input type="text" value="" v-model="nCode" placeholder="请输入验证码"/>
				</view>
				<view class="code" v-if="!status" @click="getVerificationCode(7)">获取验证码</view>
				<view class="code" v-else>{{ timeNum }}</view>
			</view>
		</view>
		<view class="tel" v-if="type == 3">
			<view class="ipt bb">
				<view>
					<view>原手机号</view>
					<input type="text" v-model="nTel" placeholder="请输入原手机号码"/>
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
					<input type="text" v-model="nCode" placeholder="请输入验证码"/>
				</view>
				<view class="code" v-if="!status" @click="getVerificationCode(4)">获取验证码</view>
				<view class="code" v-else>{{ timeNum }}</view>
			</view>
		</view>
		<neil-modal :show="showModel" @close="closeModal" title="请输入验证码" @confirm="bindBtn('confirm')">
		    <view class="input-view">
		        <view class="input-name pd23">
		            <view>验证码{{phone}}</view>
		            <input type="text" v-model="code" placeholder="请输入验证码" />
		        </view>
		    </view>
		</neil-modal>
		<view class="btn" @click="submit" v-if="type != 3">提交</view>
		<view class="btn" @click="jumpNext" v-else>下一步</view>
	</view>
</template>

<script>
	import {changePwd, updateTransactionPassword, setTransactionPassword, updatePhone, sendSms, checkPhone, countryCode, bindPhone, checkSms} from '@/api/center_api.js';
	import wPicker from "@/components/w-picker/w-picker.vue";
	import neilModal from '@/components/neil-modal/neil-modal.vue';
	export default {
		components: {
		  wPicker,
		  neilModal
		},
		data() {
			return {
				password: true,
				oPwd: "", //旧密码
				nPwd: "",//新密码
				nPwdT: "", //新密码确认
				cPwd: "", //交易密码
				cPwdT: "", //确认交易密码
				ocPwd: "",
				oTel: "", //旧手机号
				oCode: "",//旧手机号验证码
				nTel: "", //新手机号
				nCode: "",//新手机号验证码
				type: 0,
				timeNum: 60,
				timer: null,
				status: false,
				transactionPasswordIsNull: "",
				countryCode: "",
				index: 0,
				array: [],
				cityData: {},
				showModel: false,
				code: "",
				phone: ""
			};
		},
		async onLoad(options) {
			this.type = options.type;
			uni.setNavigationBarTitle({
			    title: options.type == 0 ? "登录密码修改" : options.type == 1 ? "设置交易密码" : options.type == 2 ? "绑定手机" : "修改绑定手机"
			});
			this.transactionPasswordIsNull = uni.getStorageSync("usercenter").transactionPasswordIsNull;
			let cityData = await countryCode();
			
			this.cityData = cityData.data;
			console.log(this.cityData)
			this.cityData.forEach((item, index) => {
				this.array.push(item.cnName)
			})
			this.countryCode = this.cityData[0].code;
			this.phone = uni.getStorageSync("userinfo").phone;
		},
		methods: {
			closeModal(){
				this.showModel = false;
			},
			//选择国家
			bindPickerChange: function(e) {
			    console.log('picker发送选择改变，携带值为', e.target.value)
			    this.index = e.target.value;
				this.countryCode = this.cityData[e.target.value].code;
			},
			async jumpNext() {
				if(this.nCode == "" || this.nTel.trim() == "") {
					uni.showToast({
						title: "请输入验证码/手机号",
						icon: "none"
					})
					return
				}
				let checkSmsRes = await checkSms({
					phone: "00" + this.countryCode +this.nTel.trim(),
					code: this.nCode
				})
				if (checkSmsRes.code == 0) {
					uni.showToast({
						title: checkSmsRes.msg,
						icon: "none"
					})
					return
				}
				uni.redirectTo({
					url: "./next"
				})
			},
			//修改password
			pwd(idx) {
				this.password = !this.password;
			},
			async bindBtn(){
				if (this.code == "") {
					uni.showToast({
						title: "请输入验证码",
						icon: "none"
					})
					return
				}
				if (this.type == 0) {
					let result = await changePwd({
						oldPassword: this.oPwd,
						newPassword: this.nPwd,
						repeatPassword: this.nPwdT,
						smsCode: this.code
					}).then(res => {
						if (res.code == 1) {
							uni.showToast({
								title: "修改成功",
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
				} else {
					if (uni.getStorageSync("usercenter").transactionPasswordIsNull == 0) {
						let result = await updateTransactionPassword({
							oldPassword: this.ocPwd,
							newPassword: this.cPwd,
							repeatPassword: this.cPwdT,
							smsCode: this.code
						}).then(res => {
							if (res.code == 1) {
								uni.showToast({
									title: "修改成功",
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
					} else {
						let result = await setTransactionPassword({
							transactionPassword: this.cPwd,
							repeatPassword: this.cPwdT,
						}).then(res => {
							if (res.code == 1) {
								uni.showToast({
									title: "修改成功",
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
				
			},
			async submit() {
				if (this.type == 0) {
					if (this.oPwd == "" || this.nPwd == "" || this.nPwdT == "") {
						uni.showToast({
							title: "请输入相关内容",
							icon: "none"
						})
						return
					}
					debugger
					let res = await sendSms({
						phone: uni.getStorageSync("userinfo").phone,
						type: 2
					})
					if(res.code == 1) {
						this.showModel = true;
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/user/changePwd?type=2'
							})
						}, 1000)
					}
				} else if (this.type == 1) {
					if (this.cPwd == "" || this.cPwdT == "") {
						uni.showToast({
							title: "请输入相关内容",
							icon: "none"
						})
						return
					}
					let res = await sendSms({
						phone: uni.getStorageSync("userinfo").phone,
						type: 3
					})
					if(res.code == 1) {
						this.showModel = true
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/user/changePwd?type=2'
							})
						}, 1000)
					}
				} else if (this.type == 2) {
					if(this.nCode == "" || this.nTel.trim() == "") {
						uni.showToast({
							title: "请输入验证码/手机号",
							icon: "none"
						})
						return
					}
					let checkSmsRes = await checkSms({
						phone: "00" + this.countryCode +this.nTel.trim(),
						code: this.nCode
					})
					if (checkSmsRes.code == 0) {
						uni.showToast({
							title: checkSmsRes.msg,
							icon: "none"
						})
						return
					}
					let result = await bindPhone({
						phone: "00" + this.countryCode +this.nTel.trim(),
						code: this.nCode,
					}).then(res => {
						if (res.code == 1) {
							uni.showToast({
								title: "修改成功",
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
			},
			//获取验证码
			async getVerificationCode(index) {
				let phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/ // 手机正则
				if(this.nTel.trim() == "") {
					uni.showToast({
						title: "请输入手机号",
						icon: "none"
					})
					return
				}
				if (!phoneReg.test(this.nTel.trim())) {
					uni.showToast({
						title: "请输入正确手机号",
						icon: "none"
					})
					return
				}
				console.log("00" + this.countryCode +this.nTel.trim())
				if(this.type == 2) {
					console.log(1)
					let checkres = await checkPhone({
						phone: "00" + this.countryCode +this.nTel.trim(),
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
								phone: "00" + this.countryCode +this.nTel.trim(),
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
				} else {
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
						phone: "00" + this.countryCode +this.nTel.trim(),
						type: index
					})
					if(res.code == 1) {
						uni.showToast({
							title: '验证码已发送',
							icon: 'none'
						})
					}
				}
				
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
			color: #534DFF;
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
		box-shadow: 0px 6px 10px -4px #534DFF;
		background: #534DFF;
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
