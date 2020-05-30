import request from '../common/request'

// 详情
const contentDetails = function(data) {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/helpCenter/readDetail',
			data
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
// 列表
const noticeList = function() {
	return new Promise((resolve, reject) => {
		request.post({
			url: '/noticeCenter/list',
		}).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
export {contentDetails, noticeList}