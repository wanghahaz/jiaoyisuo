import request from '../common/request'

// 首页信息
const indexPage = function(data) {
	return new Promise((resolve, reject) => {
		request.get({
			url: '/indexPage',
      data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 查找交易对
const search = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/market/getTradingOnListByCoinName',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 查询交易对详细信息
const findListByMarketId = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/kline/findListByMarketId',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 招募合伙人
const recruit = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/user/bonusadd',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}

export {indexPage, search, findListByMarketId, recruit}