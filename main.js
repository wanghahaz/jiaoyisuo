import Vue from 'vue'
import App from './App'
import store from './store/index'
// import './static/iconfont/iconfont.css'

Vue.config.productionTip = false

// 判断调试环境使用不同的接口路径
// #ifdef APP-PLUS
 Vue.prototype.baseURL = 'http://39.98.79.218:8080/oax-web-1.0' // app平台
// Vue.prototype.baseURL = 'http://192.168.1.40:8080' // app平台
// #endif

// #ifdef H5
Vue.prototype.baseURL = '/api' // 浏览器和小程序平台
// #endif

// socket地址
if(process.env.NODE_ENV === 'development') {
	// Vue.prototype.socketURL = '192.168.1.40:8080'
  Vue.prototype.socketURL = '39.98.79.218:8080/oax-web-1.0'
} else {
	Vue.prototype.socketURL = '39.98.79.218:8080/oax-web-1.0'
}

// import tabBar from './components/tabar/tabar.vue'
// Vue.component('tab-bar', tabBar)

// 将设备信息存入vuex
uni.getSystemInfo({
	success(info) {
		store.dispatch('setDeviceInfo', info)
	}
})
Vue.prototype.upInfoData = {};

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
