import request from '../common/request';

// 支付宝列表 
export function aliList() {
  return new Promise((resolve, reject) => {
    request.get({
      url: `/aliAddress/list`
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
// 添加支付宝
export function addAli(data) {
  return new Promise((resolve, reject) => {
    request.post({
      url: `/aliAddress`,
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
// 获取支付宝信息
export function getAli(id) {
  return new Promise((resolve, reject) => {
    request.get({
      url: `/aliAddress/${id}`
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

// 银行卡列表
export function bankList() {
  return new Promise((resolve, reject) => {
    request.post({
      url: `/coinAddress/list`,
      data: {}
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
// 添加银行卡
export function addBank(data) {
  return new Promise((resolve, reject) => {
    request.post({
      url: `/coinAddress/add`,
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
// 修改银行卡
export function editBank(data) {
  return new Promise((resolve, reject) => {
    request.post({
      url: `/coinAddress/updateById`,
      data
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

// 获取银行卡信息
export function getbank(id) {
  return new Promise((resolve, reject) => {
    request.get({
      url: `/coinAddress/${id}`
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
