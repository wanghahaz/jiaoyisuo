export default {
	state: {
		deviceInfo: null,
		userinfo: null,
		usercenter: null
	},
	getters: {
		deviceInfo(state) {
			return state.deviceInfo
		},
		userinfo(state) {
			return state.userinfo
		},
		usercenter(state) {
			return state.usercenter
		}
	},
	mutations: {
		'SET_DEVICEINFO'(state, payload) {
			state.deviceInfo = payload
		},
		'SET_USERINFO'(state, payload) {
			state.userinfo = payload
		},
		'SET_USERCENTER'(state, payload) {
			state.usercenter = payload
		}
	},
	actions: {
		setDeviceInfo({commit}, payload) {
			commit('SET_DEVICEINFO', payload)
		},
		setUserInfo({commit}, payload) {
			uni.setStorage({
				key: 'userinfo',
				data: payload
			})
			commit('SET_USERINFO', payload)
		},
		setUserCenter({commit}, payload) {
			uni.setStorage({
				key: 'usercenter',
				data: payload
			})
			commit('SET_USERCENTER', payload)
		}
	}
}