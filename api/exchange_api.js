import request from '../common/request'

// 用户当前委托
const transactionPage = function(data) {
  return new Promise((resolve, reject) => {
    request.post({
      url: '/transactionPage/' + data.marketId
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
// 收藏交易对
const saveCoin = function(data) {
  return new Promise((resolve, reject) => {
    request.get({
      url: '/userMaket/save/' + data.marketId,
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
// 收藏交易对
const cancelCoin = function(data) {
  return new Promise((resolve, reject) => {
    request.get({
      url: '/userMaket/cancel/' + data.marketId
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
// 买入或卖出
const exchange = function(data) {
  return new Promise((resolve, reject) => {
    request.post({
      url: '/orders/add',
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
// 买入或卖出
const cancelExchange = function(data) {
  return new Promise((resolve, reject) => {
    request.get({
      url: '/orders/cancel/' + data.id,
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

export {
  transactionPage,
  saveCoin,
  cancelCoin,
  exchange,
  cancelExchange
}
