<template>
	<view class="QS-tabs box_zing" :style="{
	'z-index': zIndex,
	'font-size': fontSize + 'rpx',
	'background-color': getBgColor,
	'transition-duration': getDuration + 's'
	}">
		<scroll-view id="QS-tabs-scroll" scroll-x class="QS-tabs-scroll box_zing" :scroll-left="left" scroll-with-animation :style="{ 
			'z-index': (Number(zIndex) + 1)
		}">
			<view class="QS-tabs-scroll-box box_zing">
				<!-- 循环tabs -->
				<view class="QS-tabs-scroll-item " :style="{
					'height': getHeight + 'rpx', 
					'line-height': getHeight + 'rpx',
					'min-width': getWidth + 'rpx',
					'padding': '0 ' + space + 'rpx',
					'color': index===getCurrent?getActiveColor:getDefaultColor,
					'font-weight': activeBold&&index===getCurrent?'bold':'',
					'transition-duration': getDuration + 's',
					'z-index': (Number(zIndex) + 2)
				}"
				 v-for="(item, index) in getTabs" :key="index" @tap="emit(index)" :id="preId + index">
					<!-- line1 -->
					<view v-if="animationMode==='line1'" class="boxStyle box_zing" :style="getDurationStyle + (index===getCurrent?getActiveStyle:getDefaultStyle)"></view>
					{{item.name || item}}
				</view>
				<!-- itemBackground -->
				<view v-if="hasItemBackground" class="itemBackgroundBox box_zing" :style="{
					'height': getHeight + 'rpx',
					'width': (isLine3?tabsInfo[getFinishCurrent]?tabsInfo[getFinishCurrent].width:0:tabsInfo[getCurrent]?tabsInfo[getCurrent].width:0) + 'px',
					'z-index': Number(zIndex) + 1,
					'transition-duration': (isLine3?0:getDuration) + 's',
					'left': (isLine3?
					tabsInfo[getFinishCurrent]?
					(tabsInfo[getFinishCurrent].left + Number(line3AddDx)):
					0:
					(tabsInfo[getCurrent]?
					tabsInfo[getCurrent].left
					:0)) + 'px'
				}">
					<view class="itemBackground box_zing" :style="'transition-duration:' + getDuration + 's;' + 
						'background-color:' + getItemBackgroundColor + ';' + 
						'box-shadow: 0 0 5rpx 5rpx ' + getItemBackgroundColor + ';' + 
						itemBackgroundStyle + ';'" />
				</view>
				<!-- line2 -->
				<view v-if="animationMode==='line2'" class="boxStyle2 box_zing" :style="getLinezIndex + getDurationStyle + 
				'bottom:' + lineBottom + ';' + 
				'width:' + lW + 'px;' + 
				'background-color:' + (lineColor||getActiveColor) + ';' + 
				line2Style + ';' + 
				'left:' + line2Dx + 'px;'" />

				<view v-if="animationMode==='line3'" class="boxStyle2 box_zing" :style="getLinezIndex + 
				'bottom:' + lineBottom + ';' + 
				'width:' + lW + 'px;' + 
				'background-color:' + (lineColor||getActiveColor) + ';' + 
				line2Style + ';' + 
				'left:' + (oldLine3Dx||getLine3Dx) + 'px'" />

			</view>
		</scroll-view>
	</view>
</template>

<script>
	const {
		windowWidth
	} = uni.getSystemInfoSync();
	const preId = 'QSTabsID_';
	export default {
		props: {
			tabs: { //需循环的标签列表
				type: Array,
				default () {
					return [];
				}
			},
			current: { //当前所在滑块的 index
				type: Number,
				default: 0
			},
			height: { //QS-tabs的高度和行高
				type: [String, Number],
				default: 80
			},
			minWidth: { //单个tab的最小宽度	//v1.4修改
				type: [String, Number],
				default: 250
			},
			fontSize: { //字体大小
				type: [String, Number],
				default: 34
			},
			duration: { //过渡动画时长, 单位 s
				type: [String, Number],
				default: .5
			},
			activeColor: { //选中项的主题颜色
				type: String,
				default: '#33cc33'
			},
			defaultColor: { //未选中项的主题颜色
				type: String,
				default: '#888'
			},
			animationLineWidth: { //动画线条的宽度
				type: [String, Number],
				default: 20
			},
			line2Style: { //line2线条的样式
				type: String,
				default: 'height: 8rpx;border-radius: 4rpx;'
			},
			animationMode: { //动画类型
				type: String,
				default: 'line1'
			},
			autoCenter: { //是否自动滚动至中心目标
				type: Boolean,
				default: true
			},
			autoCenterMode: { //滚动至中心目标类型
				type: String,
				default: 'component'
			},
			activeStyle: { //line1模式选中项的样式
				type: String,
				default: 'bottom:0;left:50%;transform: translate(-50%,-100%);height: 8rpx;border-radius:4rpx;'
			},
			defaultStyle: { //line1模式未选中项的样式
				type: String,
				default: 'bottom:0;left:50%;transform: translate(-50%,-100%);height: 8rpx;border-radius:4rpx;'
			},
			backgroundColor: { //统一背景颜色
				type: String,
				default: 'rgba(255,255,255,0)'
			},
			hasItemBackground: { //是否开启背景追光
				type: Boolean,
				default: false
			},
			itemBackgroundColor: { //统一追光背景颜色
				type: String,
				default: 'rgba(255,255,255,0)'
			},
			itemBackgroundStyle: { //追光样式
				type: String,
				default: ''
			},
			zIndex: { //css的z-index属性值
				type: [String, Number],
				default: 99
			},
			swiperWidth: { //line3生效, 外部swiper的宽度, 单位rpx
				type: [String, Number],
				default: 750
			},
			space: { //tab间距
				type: [String, Number],
				default: '40'
			},
			activeBold: { //当前tab字体是否加粗
				type: Boolean,
				default: true
			},
			lineColor: { //line颜色
				type: String,
				default: ''
			},
			lineBottom: { //line距离底部位置
				type: [String, Number],
				default: '0'
			}
		},
		computed: {
			isLine3() {
				return this.animationMode === 'line3';
			},
			getCurrent() {
				const current = Number(this.current);
				if (current > (this.getTabs.length - 1)) {
					return (this.getTabs.length - 1)
				}
				return current;
			},
			getTabs() {
				return this.tabs;
			},
			getHeight() {
				return Number(this.height);
			},
			getWidth() {
				return Number(this.minWidth);
			},
			getDuration() {
				return Number(this.duration);
			},
			getBgColor() {
				const defaultColor = this.backgroundColor || 'rgba(255,255,255,0)';
				if (this.getTabs[this.getCurrent] instanceof Object) {
					return this.getTabs[this.getCurrent].backgroundColor || defaultColor;
				} else {
					return defaultColor;
				}
			},
			getItemBackgroundColor() {
				const defaultColor = this.itemBackgroundColor || 'rgba(255,255,255,0)';
				if (this.getTabs[this.getCurrent] instanceof Object) {
					return this.getTabs[this.getCurrent].itemBackgroundColor || defaultColor;
				} else {
					return defaultColor;
				}
			},
			getActiveColor() {
				let activeColor;
				if (this.getTabs[this.getCurrent] instanceof Object) {
					if (this.getTabs[this.getCurrent].activeColor) {
						activeColor = this.getTabs[this.getCurrent].activeColor;
					} else {
						activeColor = this.activeColor;
					}
				} else {
					activeColor = this.activeColor;
				}
				return activeColor;
			},
			getDefaultColor() {
				let defaultColor;
				if (this.getTabs[this.getCurrent] instanceof Object) {
					if (this.getTabs[this.getCurrent].defaultColor) {
						defaultColor = this.getTabs[this.getCurrent].defaultColor;
					} else {
						defaultColor = this.defaultColor;
					}
				} else {
					defaultColor = this.defaultColor;
				}
				return defaultColor;
			},
			getActiveStyle() {
				return `width:${this.animationLineWidth}%;background-color:${this.getActiveColor};${this.activeStyle};`;
			},
			getDefaultStyle() {
				return `width:0;background-color:${this.getActiveColor};${this.defaultStyle};`;
			},
			getLinezIndexNum() {
				return Number(this.zIndex) + 2;
			},
			getLinezIndex() {
				return `z-index: ${this.getLinezIndexNum};`;
			},
			getLine3Dx() {
				return Number(this.line3Dx) + Number(this.line3AddDx);
			},
			getFinishCurrent() {
				if(this.tabs && this.tabs.length > 0) {
					const l = this.tabs.length - 1;
					if(this.finishCurrent > l) {
						return l;
					}else{
						return this.finishCurrent;
					}
				}else{
					return 0;
				}
			}
		},
		watch: {
			current(n, o) {
				this.change(n);
			},
			tabs(n, o) {
				if(o && o.length > 0 && !this.getQueryEveryTime) { 
					this.getQueryEveryTime = true; 
					if(this.timeOutFc) clearTimeout(this.timeOutFc);
					this.timeOutFc = setTimeout(()=>{
						this.getQueryEveryTime = false; 
					}, 2000);
				}
				this.init();
			}
		},
		data() {
			return {
				left: 0,
				tabsInfo: [],
				line2Width: Number(this.animationLineWidth),
				setTimeoutFc: null,
				componentsWidth: 0,
				finishCurrent: this.current,
				pxWidth: 0,
				lW: 0,
				sW: 0,
				preId,
				line3Dx: 0,
				line3AddDx: 0,
				line2Dx: 0,
				oldLine3Dx: 0,
				getQueryEveryTime:false,
				timeOutFc: null,
				getDurationStyle: `transition-duration: ${this.getDuration}s;`
			}
		},
		// #ifndef H5
		onReady() {
			this.init();
		},
		// #endif
		// #ifdef H5
		mounted() {
			this.init();
		},
		// #endif
		methods: {
			init() {
				setTimeout(()=>{
					this.countPx();
					let view = uni.createSelectorQuery().in(this);
					let scroll = uni.createSelectorQuery().in(this);
					scroll.select('#QS-tabs-scroll').fields({ scrollOffset: true });
					for (let i = 0; i < this.tabs.length; i++) {
						view.select('#' + preId + i).boundingClientRect();
					}
					scroll.exec((data)=>{
						view.exec((res) => {
							const arr = [];
							for (let i = 0; i < res.length; i++) {
								const item = res[i];
								if(item) {
									item.left += data[0].scrollLeft;
									arr.push(item);
								}
							}
							this.tabsInfo = arr;
							this.countLine2Dx();
							this.countLine3Dx();
							this.getQuery(() => {
								this.countScrollX();
							});
						})
					})
				}, 0)
			},
			countLine2Dx() {
				if (this.animationMode === 'line2') {
					const tab = this.tabsInfo[this.getCurrent];
					if (tab) this.line2Dx = tab.left + tab.width / 2 - this.lW / 2;
				}
			},
			countLine3Dx() {
				if (this.animationMode === 'line3') {
					if(this.getQueryEveryTime) {
						let view = uni.createSelectorQuery().in(this);
						let scroll = uni.createSelectorQuery().in(this);
						scroll.select('#QS-tabs-scroll').fields({ scrollOffset: true });
						view.select('#' + preId + this.getFinishCurrent).boundingClientRect();
						scroll.exec((data)=>{
							if(data) {
								view.exec((res) => {
									if(res[0]) {
										const tab = res[0];
										this.line3Dx = tab.left + data[0].scrollLeft + tab.width / 2 - this.lW / 2;
										this.oldLine3Dx = 0;
									}
								})
							}
						})
					}else{
						const tab = this.tabsInfo[this.getFinishCurrent];
						if (tab) this.line3Dx = tab.left + tab.width / 2 - this.lW / 2;
					}
				}
			},
			countPx() {
				const w = uni.upx2px(this.getWidth);
				this.pxWidth = w;
				this.lW = w * (Number(this.animationLineWidth) / 100);
				this.sW = uni.upx2px(Number(this.swiperWidth));
			},
			emit(index) {
				this.$emit('change', index);
			},
			change() {
				this.countScrollX();
				if (this.animationMode === 'line2') {
					this.line2Width = 2;
					if (this.setTimeoutFc) clearTimeout(this.setTimeoutFc);
					this.setTimeoutFc = setTimeout(() => {
						this.line2Width = this.animationLineWidth;
					}, this.getDuration * 1000 * 3 / 5);
					this.countLine2Dx();
				}
			},
			getQuery(cb) {
				try {
					let view = uni.createSelectorQuery().in(this).select('.QS-tabs');
					view.fields({
						size: true
					}, data => {
						if (data) {
							this.componentsWidth = data.width;
							if (cb && typeof cb === 'function') cb(data);
						} else {
							this.retryGetQuery(cb);
						}
					}).exec();
				} catch (e) {
					//TODO handle the exception
					this.componentsWidth = windowWidth;
				}
			},
			retryGetQuery(cb) {
				try {
					let view = uni.createSelectorQuery().select('.QS-tabs');
					view.fields({
						size: true
					}, data => {
						if (data) {
							this.componentsWidth = data.width;
						} else {
							this.componentsWidth = windowWidth;
						}
						if (cb && typeof cb === 'function') cb(data);
					}).exec();
				} catch (e) {
					//TODO handle the exception
					this.componentsWidth = windowWidth;
				}
			},
			countScrollX() {
				if (this.autoCenter) {
					let tab;
					if (this.isLine3) {
						tab = this.tabsInfo[this.getFinishCurrent];
					} else {
						tab = this.tabsInfo[this.getCurrent];
					}
					if (tab) {
						let tabCenter = tab.left + tab.width / 2;
						let fatherWidth;
						if (this.autoCenterMode === 'window') {
							fatherWidth = windowWidth;
						} else {
							fatherWidth = this.componentsWidth;
						}
						this.left = tabCenter - fatherWidth / 2;
					}
				}
			},
			setDx(dx) {
				const tab = this.tabsInfo[dx > 0 ? (this.getFinishCurrent + 1) : (this.getFinishCurrent - 1)];
				this.line3AddDx = dx / this.sW * (tab ? tab.width : this.pxWidth);
			},
			setFinishCurrent(current) {
				if(this.getQueryEveryTime) {
					this.oldLine3Dx = this.getLine3Dx;
				}
				this.line3AddDx = 0;
				this.finishCurrent = current;
				this.countLine3Dx();
			}
		}
	}
</script>

<style scoped>
	.box_zing{
		box-sizing: border-box;
	}

	.QS-tabs {
		width: 100%;
		transition-property: background-color, color;
	}

	.QS-tabs::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
	}

	.QS-tabs-scroll {
		width: 100%;
		white-space: nowrap;
		position: relative;
	}

	.QS-tabs-scroll-box {
		position: relative;
		display: flex;
		white-space: nowrap !important;
		display: block !important;
	}

	.QS-tabs-scroll-item {
		position: relative;
		display: inline-block;
		text-align: center;
		transition-property: background-color, color, font-weight;
	}

	.content {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.boxStyle {
		pointer-events: none;
		position: absolute;
		transition-property: all;
	}

	.boxStyle2 {
		pointer-events: none;
		position: absolute;
		transition-property: all;
		transform: translateY(-100%);
	}

	.itemBackgroundBox {
		pointer-events: none;
		position: absolute;
		top: 0;
		transition-property: left, background-color, width, height;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.itemBackground {
		height: 100%;
		width: 100%;
		transition-property: all;
	}
</style>
