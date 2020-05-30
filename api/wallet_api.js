import request from '../common/request'

// 首页信息
const propertyList = function(data) {
  return new Promise((resolve, reject) => {
    request.post({
      url: '/userCoin/propertyList',
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

// 币种列表
const userCoinList = function() {
  return new Promise((resolve, reject) => {
    request.post({
      url: '/userCoin/list',
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
// 删除提币地址
const deleteById = function(data) {
  return new Promise((resolve, reject) => {
    request.post({
      url: '/coinAddress/deleteById/' + data.id,
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
// 充值记录
const rechargeList = function(data) {
  return new Promise((resolve, reject) => {
    request.post({
      url: '/property/recharge',
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
// 提现记录
const withdrawList = function(data) {
  return new Promise((resolve, reject) => {
    request.post({
      url: '/property/withdraw',
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
// 充值
const recharge = function(data) {
  return new Promise((resolve, reject) => {
    request.post({
      url: '/userCoin/recharge/' + data.coinId,
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
// 提现
const withdrawal = function(data) {
  return new Promise((resolve, reject) => {
    request.post({
      url: '/userCoin/withdrawal',
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
// 银行卡列表
const coinAddress=function(data){
  return new Promise((resolve, reject) => {
    request.post({
      url: '/coinAddress/list',
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
// 添加银行卡
const addBank = function(data) {
  return new Promise((resolve, reject) => {
    request.post({
      url: '/coinAddress/add',
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
// 删除银行卡
const delBank=function(data){
  return new Promise((resolve, reject) => {
    request.post({
      url:`/coinAddress/deleteById/${data.id}`,
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
// 积分转入记录：
const integralRecord =function(data){
  return new Promise((resolve, reject) => {
    request.post({
      url:`/property/transferred`,
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
// 消费记录
const ordersRecord=function(data){
  return new Promise((resolve, reject) => {
    request.post({
      url:`/ordersRecord/findListByPage`,
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
// 划转计划
const getAccount=function(data){
  return new Promise((resolve, reject) => {
    request.post({
      url:`/user/gettranctionAccount`,
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
export {
  propertyList,
  userCoinList,
  deleteById,
  rechargeList,
  withdrawList,
  recharge,
  coinAddress,
  withdrawal,
  addBank,
  delBank,
  integralRecord,
  ordersRecord,
  getAccount
}
