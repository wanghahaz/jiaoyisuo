<template>
	<view class="exchangeBox" @scroll="scrolling">
		<view class="title">
			<view @click="selectCoin" v-if="marketInfo">
				<text>{{marketInfo.coinName}}/{{marketInfo.marketCoinName}}</text>
				<text class="iconfont iconlujing1"></text>
			</view>
			<navigator class="iconfont icontiaojie4" :url="'/pages/exchange/chartDetail?marketId=' + marketId"></navigator>
		</view>
		<view class="buy_sell">
			<view class="left" v-if="marketInfo && userInfo">
				<view class="left_nav">
					<text class="buy" :class="{active: buyOrsell == 0}" @click="buyOrsell = 0">买入</text>
					<text class="sell" :class="{active: buyOrsell == 1}" @click="buyOrsell = 1">卖出</text>
				</view>
				<view class="content" v-if="buyOrsell == 0">
					<view class="price">
						<view @click="subtract('price')">-</view>
						<input type="number" :placeholder="`委托价格(${marketInfo.marketCoinName})`" v-model="price"/>
						<view @click="add('price')">+</view>
					</view>
					<text>≈{{cnyprice * parseFloat(price)}} CNY</text>
					<view class="count">
						<view @click="subtract('count')">-</view>
						<input type="number" :placeholder="`委托数量(${marketInfo.coinName})`" v-model="count"/>
						<view @click="add('count')">+</view>
					</view>
					<view class="countPercent">
						<view @click="count = userInfo.coinBalance.leftCoinBalance * 0.25">25%</view>
						<view @click="count = userInfo.coinBalance.leftCoinBalance * 0.5">50%</view>
						<view @click="count = userInfo.coinBalance.leftCoinBalance * 0.75">75%</view>
						<view @click="count = userInfo.coinBalance.leftCoinBalance * 1">100%</view>
					</view>
					<text style="display: block;margin-top: 14rpx;">可用{{marketInfo.marketCoinName}}：{{userInfo.coinBalance.leftCoinBalance}}</text>
					<text style="display: block;">已有{{marketInfo.coinName}}：{{userInfo.coinBalance.rightCoinBalance}}</text>
					<view class="exchange_count">
						<text>{{price * count}}</text>
						<view>{{marketInfo.marketCoinName}}</view>
					</view>
					<text>≈{{cnyprice * price * count}} CNY</text>
					<view class="buy_btn" @click="exchange(1)">现货买入</view>
				</view>
				<view class="content" v-if="buyOrsell == 1">
					<view class="price">
						<view @click="subtract('price2')">-</view>
						<input type="number" :placeholder="`委托价格(${marketInfo.marketCoinName})`" v-model="price2"/>
						<view @click="add('price2')">+</view>
					</view>
					<text>≈{{cnyprice}} CNY</text>
					<view class="count">
						<view @click="subtract('count2')">-</view>
						<input type="number" :placeholder="`委托数量(${marketInfo.coinName})`" v-model="count2"/>
						<view @click="add('count2')">+</view>
					</view>
					<view class="countPercent">
						<view>25%</view>
						<view>50%</view>
						<view>75%</view>
						<view>100%</view>
					</view>
					<text style="display: block;margin-top: 14rpx;">可用{{marketInfo.coinName}}：{{userInfo.coinBalance.leftCoinBalance}}</text>
					<text style="display: block;">已有{{marketInfo.marketCoinName}}：{{userInfo.coinBalance.rightCoinBalance}}</text>
					<view class="exchange_count">
						<text>{{price2 * count2}}</text>
						<view>MDT</view>
					</view>
					<text>≈{{cnyprice * price2 * count2}} CNY</text>
					<view class="sell_btn" @click="exchange(2)">现货卖出</view>
				</view>
			</view>
			<view class="right">
				<view class="righttitle">
					<text>价格</text>
					<text>数量</text>
				</view>
				<view class="sell_list">
					<view class="item" v-for="(item, index) in selldeepList" :key="index">
						<view class="progress" :style="{width: item.qty/(Math.max.apply(null, selldeepList.map(item=>item.qty))) * 100 + '%'}"></view>
						<text>{{index + 1}}</text>
						<text>{{item.price}}</text>
						<text>{{item.qty}}</text>
					</view>
				</view>
				<view class="currentPrice" :class="{up: marketInfo.incRate >= 0, down: marketInfo.incRate < 0}" v-if="marketInfo">
					<text>${{marketInfo.lastTradePrice}}</text>
					<text>{{marketInfo.incRate}}%</text>
				</view>
				<view class="buy_list">
					<view class="item" v-for="(item, index) in buydeepList" :key="index">
						<view class="progress" :style="{width: item.qty/(Math.max.apply(null, buydeepList.map(item=>item.qty))) * 100 + '%'}"></view>
						<text>{{index + 1}}</text>
						<text>{{item.price}}</text>
						<text>{{item.qty}}</text>
					</view>
				</view>
				<view class="legend">
					<view class="sell">
						<view></view>
						<text>卖</text>
					</view>
					<view class="buy">
						<view></view>
						<text>买</text>
					</view>
				</view>
			</view>
		</view>
		<view class="dealBox">
			<QSTabs class="tabs" :tabs="tabs" :current="currentTab" minWidth="120" activeColor="#5DC1CF" defaultColor="#000" :activeBold="false" animationMode="line1" space="20" @change="changeTab"></QSTabs>
			<view class="entrust show" v-if="currentTab == 0">
				<view class="title">
					<text>时间</text>
					<text>数量</text>
					<text>价格</text>
					<text>已成交量</text>
					<text>操作</text>
				</view>
				<view class="content" v-if="entrustList.length" :style="{overflow: overflow ? 'scroll' : 'hidden'}">
					<view class="item" :class="{buy: item.type == 1, sell: item.type == 2}" v-for="(item, index) in entrustList" :key="index" >
						<text>{{item.createTime}}</text>
						<text>{{item.qty}}</text>
						<text>{{item.price}}</text>
						<text>{{item.tradeQty}}</text>
						<text @click="cancelExchange(item.id)">撤销</text>
					</view>
				</view>
				<view style="padding: 50rpx;text-align: center;font-size: 32rpx;" v-else>
					<text>暂无数据</text>
				</view>
			</view>
			<view class="newDeal show" v-if="currentTab == 1">
				<view class="title">
					<text>时间</text>
					<text>价格</text>
					<text>交易量</text>
				</view>
				<view class="content" v-if="newDealList.length" :style="{overflow: overflow ? 'scroll' : 'hidden'}">
					<view class="item" :class="{buy: item.type == 1, sell: item.type == 2}" v-for="(item, index) in newDealList" :key="index">
						<text>{{item.createTime}}</text>
						<view>
							<text class="sell">{{item.price}}</text>
							<text>≈42350.2 CNY</text>
						</view>
						<view>
							<text>{{item.qty}}</text>
							<text>≈42350.2 CNY</text>
						</view>
					</view>
				</view>
				<view style="padding: 50rpx;text-align: center;font-size: 32rpx;" v-else>
					<text>暂无数据</text>
				</view>
			</view>
			<view class="myDeal show" v-if="currentTab == 2">
				<view class="title">
					<text>时间</text>
					<text>价格</text>
					<text>交易量</text>
				</view>
				<view class="content" v-if="myDealList.length" :style="{overflow: overflow ? 'scroll' : 'hidden'}">
					<view class="item" :class="{buy: item.type == 1, sell: item.type == 2}" v-for="(item, index) in myDealList" :key="index">
						<text>{{item.createTime}}</text>
						<view>
							<text class="sell">{{item.price}}</text>
							<text>≈42350.2 CNY</text>
						</view>
						<view>
							<text>{{item.qty}}</text>
							<text>≈42350.2 CNY</text>
						</view>
					</view>
				</view>
				<view style="padding: 50rpx;text-align: center;font-size: 32rpx;" v-else>
					<text>暂无数据</text>
				</view>
			</view>
			<view class="charts show" v-if="currentTab == 3">
				<view class="coinInfo">
					<view :class="{up: marketInfo.incRate >= 0, down: marketInfo.incRate < 0}">
						<text>${{marketInfo.lastTradePrice}}</text>
						<text>{{marketInfo.incRate}}%</text>
					</view>
					<view>
						<view class="">
							<text>≈{{marketInfo.lastTradePrice * cnyprice}}CNY</text>
						</view>
						<text>最高 {{marketInfo.maxPrice}}</text>
					</view>
					<view>
						<text>24H量 {{marketInfo.tradeQty}}</text>
						<text>最低 {{marketInfo.minPrice}}</text>
					</view>
				</view>
				<view class="kline">
					<QSTabs :tabs="tabs2" :current="currentTab2" minWidth="120" activeColor="#D65A34" defaultColor="#B6BEC8" :activeBold="false" animationMode="line1" space="20" @change="changeTab2"></QSTabs>
					<full-uchart background="#fff" :klineList="klineList"></full-uchart>
				</view>
			</view>
		</view>
		<Modal ref="modal"/>
	</view>
</template>

<script>
import QSTabs from '@/components/QS-tabs/QS-tabs'
import fullUchart from '@/components/my-uchart/full-uchart'
import {transactionPage, exchange, cancelExchange} from '@/api/exchange_api'
import Modal from '@/components/Modal/Modal'
	
export default {
	components: {
		QSTabs,
		fullUchart,
		Modal
	},
	data() {
		return {
			overflow: false,
			marketId: 0, // 当前所选的交易对id
			buyOrsell: 0,// 买入卖出tab
			price: '', // 买入价格
			count: '', // 买入数量
			price2: '', // 卖出价格
			count2: '', // 卖出数量
			userInfo: null, // 交易页面用户相关数据
			marketInfo: null, // 当前交易对信息
			selldeepList: [], // 卖出深度数据
			buydeepList: [], // 买入深度数据
			tabs: ['当前委托', '最新成交', '我的成交', '行情图表'], //下方tab标签
			currentTab: 0, // 下方所在当前tab页
			tabs2: ['1分钟', '5分钟', '10分钟', '30分钟', '1小时', '4小时', '1天', '1周', '1月'], // 行情图表k线图tab
			currentTab2: 1,// 行情图表k线图所在当前tab页
			entrustList: [], // 当前委托数据
			newDealList: [], // 最新成交数据
			myDealList: [], // 我的成交数据
			klineList: null, // k线图数据
			cnyprice: 1 ,// 美元对cny的汇率
			needTransactionPassword: '1', // 是否开启验证交易密码
			transactionPassword: '' // 交易密码
		}
	},
	methods: {
		scrolling() {
			uni.createSelectorQuery().in(this).select('.dealBox').boundingClientRect(data => {
			 this.overflow = data.top == 0 ? true : false
			}).exec()
		},
		// 切换tab标签
		changeTab(index) {
			this.currentTab = index
		},
		// 切换k线图时间类型
		changeTab2(index) {
			this.currentTab2 = index
			let time = null
			switch (index) {
				case 0:
					time = 1;
					break;
				case 1:
					time = 5;
					break;
				case 2:
					time = 10;
					break;
				case 3:
					time = 30;
					break;
				case 4:
					time = 60;
					break;
				case 5:
					time = 240;
					break;
				case 6:
					time = 1440;
					break;
				case 7:
					time = 10080;
					break;
				case 8:
					time = 43200;
			}

			uni.closeSocket()
			uni.onSocketClose(() => {
				this.initSocket(time)
			})
		},
		// 点击切换coin
		selectCoin() {
			// 由于tabbar页面无法传参,需要先在storage里设置一个值,然后跳转到selectCoin页面再做相应处理,这里是tabbar页所以设置为true
			uni.setStorageSync('tab', true)
			uni.navigateTo({
				url: '/pages/exchange/selectCoin'
			})
		},
		// 点击加
		add(type) {
			if(type == 'price') {
				if(!isNaN(parseFloat(this.price))) {
					this.price++
				} else {
					this.price = 1
				}
			} else if(type == 'count') {
				if(!isNaN(parseFloat(this.count))) {
					this.count++
				} else {
					this.count = 1
				}
			} else if(type == 'price2') {
				if(!isNaN(parseFloat(this.price2))) {
					this.price2++
				} else {
					this.price2 = 1
				}
			} else if(type == 'count2') {
				if(!isNaN(parseFloat(this.count2))) {
					this.count2++
				} else {
					this.count2 = 1
				}
			}
		},
		// 点击减
		subtract(type) {
			if(type == 'price') {
				if(!isNaN(parseFloat(this.price))) {
					this.price--
					if(this.price < 0) this.price = 0
				} else {
					this.price = 0
				}
			} else if(type == 'count') {
				if(!isNaN(parseFloat(this.count))) {
					this.count--
					if(this.count < 0) this.count = 0
				} else {
					this.count = 0
				}
			} else if(type == 'price2') {
				if(!isNaN(parseFloat(this.price2))) {
					this.price2--
					if(this.price2 < 0) this.price2 = 0
				} else {
					this.price2 = 0
				}
			} else if(type == 'count2') {
				if(!isNaN(parseFloat(this.count2))) {
					this.count2--
					if(this.count2 < 0) this.count2 = 0
				} else {
					this.count2 = 0
				}
			}
		},
		// 买入或卖出
		async exchange(type) {
			let userinfo = uni.getStorageSync('userinfo')
			let data = {
				marketId: this.marketId,
				type,
				price: type == 1 ? this.price : this.price2,
				qty: type == 1 ? this.count : this.count2
			}
			if(!userinfo) {
				uni.navigateTo({
					url: `/pages/login_register/login?redirect=${'/page/exchange/index'}&redirectType=tabBar`
				})
				return
			}
			if(this.needPassword == '1') {
				this.$refs.modal.show({
					title: '请填写交易密码',
					ispsw: true,
					success: async () => {
						data.transactionPassword = this.$refs.modal.code
						let res = await exchange(data)
						if(res.code === '1' && res.success) {				
							uni.showToast({
								title: res.msg
							})
							this.price = this.count = this.price2 = this.count2 = ''
							// 成功后重新查询订单
							this.initData()
							this.$refs.modal.close()
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					}
				})
			} else {
				uni.showToast({
					title: '请设置交易密码',
					icon: 'none'
				})
				uni.navigateTo({
					url: `/pages/user/changePwd?type=1`
				})
			}
		},
		// 撤销委托
		async cancelExchange(id) {
			let res = await cancelExchange({id})
			if(res.code === '1' && res.success) {
				// 成功后重新查询订单
				this.initData()
			}
		},
		// 初始化socket连接并处理接收的数据
		initSocket(time) {
			console.log(this.marketId)
			let userinfo = uni.getStorageSync('userinfo')
			uni.connectSocket({
				url: `ws://${this.socketURL}/websocket/topic/tradeListAndMarketOrders/${this.marketId}/5/${userinfo ? userinfo.userId + '' : null}`,
				method: 'POST',
				header: {
					lang: 'cn',
					userId: userinfo ? userinfo.userId : '',
					accessToken: userinfo ? userinfo.accessToken : ''
				}
			})
			// 处理接收到的数据
			uni.onSocketMessage(res => {
				let data = JSON.parse(res.data)
				console.log(JSON.parse(res.data))
				this.userInfo = data.userData
				this.selldeepList = data.sellList
				this.buydeepList = data.buyList
				this.newDealList = data.tradeList
				this.klineList = data.klineList
				this.marketInfo = data.marketInfo
				this.cnyprice = data.marketInfo.cnyPrice
			})
			uni.onSocketOpen(res => {
			  console.log('WebSocket连接已打开！');
			})
			uni.onSocketError(err => {
			  console.log('WebSocket连接打开失败，请检查！', err);
			})
			uni.onSocketClose(function (res) {
			  console.log('WebSocket 已关闭！');
			});
		},
		// 初始化数据, 查询当前委托订单列表、我的成交列表
		async initData() {
			let userinfo = uni.getStorageSync('userinfo')
			if(userinfo) {
				let res = await transactionPage({
					marketId: this.marketId
				})
				this.needPassword = res.data.needTransactionPassword
				this.entrustList = res.data.orderList
				this.myDealList = res.data.marketTradeList
			}
		}
	},
	onShow() {
		this.marketId = this.$route.query.marketId
		this.initSocket()
		this.initData()
		// #ifdef H5
		window.onbeforeunload = () => {
			uni.closeSocket()
		}
		// #endif
	},
	onHide() {
		uni.closeSocket()
	},
	destroyed() {
		uni.closeSocket()
	}
}
</script>

<style lang="scss" scoped>
.exchangeBox{
	height: 100%;
	overflow: scroll;
	.title{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 14rpx 18rpx;
		background-color: #fff;
		margin-bottom: 2px;
		>view:nth-of-type(1){
			margin-bottom: 10rpx;
			text:nth-of-type(1){
				color: #333;
				margin-right: 8rpx;
				font-size: 32rpx;
			}
			text:nth-of-type(2){
				color: #333;
				font-size: 8px;
				vertical-align: middle;
			}
		}
	}
	.buy_sell{
		display: flex;
		padding: 18rpx 18rpx;
		background-color: #fff;
		.left{
			width: 55%;
			.left_nav{
				display: flex;
				margin-bottom: 30rpx;
				text{
					display: block;
					width: 50%;
					height: 64rpx;
					line-height: 64rpx;
					font-size: 30rpx;
					text-align: center;
					background-color: #fff;
					border: 1px solid #F4F5F6;
					color: #999A9B;
				}
				text.active.buy{
					background-color: #48BEA4;
					border: 1px solid #48BEA4;
					color: #fff;
				}
				text.active.sell{
					background-color: rgb(214,91,48);
					border: 1px solid rgb(214,91,48);
					color: #fff;
				}
			}
			.content{
				>text{
					font-size: 24rpx;
					color: #999A9B;
				}
				.price,.count{
					border: 1px solid #F4F5F6;
					box-sizing: border-box;
					height: 64rpx;
					display: flex;
					view:nth-of-type(1){
						font-size: 46rpx;
						font-weight: bold;
						color: #999A9B;
						width: 64rpx;
						height: 64rpx;
						text-align: center;
						line-height: 48rpx;
						border-right: 1px solid #F4F5F6;
						box-sizing: border-box;
					}
					input{
						flex: 1;
						height: 64rpx;
						line-height: 64rpx;
						padding-left: 10rpx;
						font-size: 28rpx;
						text-align: center;
						color: #999A9B;
					}
					view:nth-of-type(2){
						font-size: 46rpx;
						font-weight: bold;
						color: #999A9B;
						width: 64rpx;
						height: 64rpx;
						text-align: center;
						line-height: 48rpx;
						border-left: 1px solid #F4F5F6;
						box-sizing: border-box;
					}
				}
				.count{
					margin-top: 30rpx;
					margin-bottom: 20rpx;
				}
				.countPercent{
					font-size: 24rpx;
					color: #999A9B;
					display: flex;
					>view{
						width: 25%;
						height: 50rpx;
						line-height: 50rpx;
						text-align: center;
						margin-right: 10rpx;
						border: 1px solid #F4F5F6;
					}
					>view:last-of-type{
						margin-right: 0;
					}
				}
				.exchange_count{
					height: 64rpx;
					border: 1px solid #F4F5F6;
					display: flex;
					align-items: center;
					margin-top: 30rpx;
					>text{
						flex: 1;
						display: block;
						line-height: 64rpx;
						padding-left: 10rpx;
						color: #999A9B;
					}
					>view{
						line-height: 64rpx;
						color: #999A9B;
						font-size: 32rpx;
						margin-right: 10rpx;
					}
				}
				.buy_btn{
					height: 64rpx;
					line-height: 64rpx;
					font-size: 30rpx;
					text-align: center;
					background-color: #48BEA4;
					color: #fff;
					border-radius: 2px;
					margin-top: 50rpx;
				}
				.sell_btn{
					height: 64rpx;
					line-height: 64rpx;
					font-size: 30rpx;
					text-align: center;
					background-color: rgb(214,91,48);
					color: #fff;
					border-radius: 2px;
					margin-top: 50rpx;
				}
			}
		}
		.right{
			width: 45%;
			padding-left: 20rpx;
			.righttitle{
				display: flex;
				color: #999A9B;
				font-size: 24rpx;
				text{
					display: block;
					width: 50%;
				}
				text:nth-of-type(1) {
					padding-left: 40rpx;
				}
				text:nth-of-type(2) {
					text-align: right;
					padding-right: 10rpx;
				}
			}
			.sell_list{
				height: 330rpx;
				overflow: scroll;
				border-bottom: 1px solid #F4F5F6;
				.item{
					height: 50rpx;
					position: relative;
					font-size: 24rpx;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					.progress{
						max-width: 100%;
						height: 50rpx;
						position: absolute;
						top: 0;
						right: 0;
						background-color: rgba(214,91,48,.3);
					}
					>text:nth-of-type(1){
						color: rgb(214,91,48);
						text-align: left;
						margin-right: 20rpx;
					}
					>text:nth-of-type(2){
						color: rgb(214,91,48);
						margin-right: 30rpx;
					}
					>text:nth-of-type(3){
						flex: 1;
						color: #5E6168;
						text-align: right;
					}
				}
			}
			.currentPrice{
				height: 80rpx;
				line-height: 80rpx;
				display: flex;
				justify-content: space-between;
				text:nth-of-type(2){
					font-size: 24rpx;
				}
			}
			.currentPrice.up{
				color: rgb(45,178,93);
			}
			.currentPrice.down{
				color: rgb(214,91,48);
			}
			.buy_list{
				height: 330rpx;
				overflow: scroll;
				border-top: 1px solid #F4F5F6;
				.item{
					height: 50rpx;
					position: relative;
					font-size: 24rpx;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					.progress{
						max-width: 100%;
						height: 50rpx;
						position: absolute;
						top: 0;
						right: 0;
						background-color: rgba(45,178,93,.3);
					}
					>text:nth-of-type(1){
						color: rgb(45,178,93);
						text-align: left;
						margin-right: 20rpx;
					}
					>text:nth-of-type(2){
						color: rgb(45,178,93);
						margin-right: 30rpx;
					}
					>text:nth-of-type(3){
						flex: 1;
						color: #5E6168;
						text-align: right;
					}
				}
			}
			.legend{
				display: flex;
				margin-top: 30rpx;
				.sell{
					margin-right: 40rpx;
					display: flex;
					align-items: center;
					view{
						width: 20rpx;
						height: 20rpx;
						background-color: rgb(214,91,48);
						margin-right: 10rpx;
					}
					text{
						color: rgb(214,91,48);
						font-size: 30rpx;
					}
				}
				.buy{
					display: flex;
					align-items: center;
					view{
						width: 20rpx;
						height: 20rpx;
						background-color: rgb(45,178,93);
						margin-right: 10rpx;
					}
					text{
						color: rgb(45,178,93);
						font-size: 30rpx;
					}
				}
			}
		}
	}
	.dealBox{
		background-color: #fff;
		height: 100%;
		display: flex;
		flex-direction: column;
		.show{
			flex: 1;
			display: flex;
			flex-direction: column;
			overflow: hidden;
			.content{
				flex: 1;
			}
		}
		.entrust{
			.title{
				border-top: 1px solid #F5F5F5;
				display: flex;
				align-items: center;
				>text{
					font-size: 24rpx;
					color: #333;
					width: 20%;
					text-align: center;
				}
			}
			.content{
				.item{
					font-size: 32rpx;
					display: flex;
					align-items: center;
					padding: 10rpx 0;
					>text{
						display: block;
						width: 20%;
						text-align: center;
					}
					>text:last-of-type{

					}
				}
				text:nth-of-type(1) {
					font-size: 24rpx;
				}
				.item.sell{
					color: #DC4DA1;
				}
				.item.buy{
					color: #48BEA4;
				}
			}
		}
		.newDeal,.myDeal{
			.title{
				border-top: 1px solid #F5F5F5;
				display: flex;
				align-items: center;
				>text{
					font-size: 24rpx;
					color: #333;
					width: 25%;
					text-align: center;
				}
			}
			.content,{
				.item{
					font-size: 32rpx;
					display: flex;
					align-items: center;
					padding: 10rpx 0;
					>text{
						display: block;
						width: 33.33%;
						text-align: center;
					}
					>view:nth-of-type(1){
						width: 33.33%;
						text-align: center;
						>text:nth-of-type(1){
							display: block;
						}
						>text:nth-of-type(2){
							display: block;
							font-size: 24rpx;
							color: #999A9B;
						}
						>text.sell{
							color: #DC4DA1;
						}
						>text.buy{
							color: #48BEA4;
						}
					}
					>view:nth-of-type(2){
						width: 33.33%;
						text-align: center;
						>text:nth-of-type(1){
							display: block;
						}
						>text:nth-of-type(2){
							display: block;
							font-size: 24rpx;
							color: #999A9B;
						}
					}
				}
			}
		}
		.charts{
			// background-color: #17202E;
			.coinInfo{
				padding: 14rpx 18rpx;
				// >view:nth-of-type(1){
				// 	margin-bottom: 10rpx;
				// 	text:nth-of-type(1){
				// 		color: #fff;
				// 		margin-right: 8rpx;
				// 	}
				// 	text:nth-of-type(2){
				// 		color: #fff;
				// 		font-size: 24rpx;
				// 		vertical-align: middle;
				// 	}
				// }
				>view.up{
					color: #48BEA4;
				}
				>view.down{
					color: #D65A34;
				}
				>view:nth-of-type(1){
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 24rpx;
					margin-bottom: 8rpx;
					>text{
						font-size: 42rpx;
					}
					>view{
						color: #B6BEC8;
						>text:nth-of-type(1){
							font-size: 20rpx;
							margin-right: 6rpx;
						}
					}
				}
				>view:nth-of-type(2){
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 24rpx;
					margin-bottom: 8rpx;
					color: #B6BEC8;
					>view{
						>text:nth-of-type(1){
							margin-right: 16rpx;
						}
					}
					>text{
						display: block;
						width: 210rpx;
					}
				}
				>view:nth-of-type(3){
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 24rpx;
					margin-bottom: 8rpx;
					color: #B6BEC8;
					>text:nth-of-type(2){
						display: block;
						width: 210rpx;
					}
				}
			}
		}
	}
}
</style>
