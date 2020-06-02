let fn = {
  params: function(obj) {
    if (!obj) return '';
    let str = '';
    for (let i in obj) {
      str == '' ? str += ('?' + i + '=' + obj[i]) : str += ('&' + i + '=' + obj[i])
    }
    return str;
  },
  log: function() {
    console.log.apply(console, arguments)
  }
}

function toast(obj) {
  uni.showToast({
    icon: obj.icon || 'none',
    title: obj.text||'',
    duration: obj.time || 2000
  })
}

function loading(type, text) {
  type == 1 ? uni.showLoading({
    title: text||''
  }) : uni.hideLoading()
}

function model(obj) {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title: obj.title || '提示',
      content: obj.text||'',
      confirmText:obj.stext||'确认',
      cancelText:obj.etext||'取消',
      success: function(res) {
        if (res.confirm) {
          resolve(1)
        } else if (res.cancel) {
          resolve(0)
        }
      }
    });
  })
}

function downDays(dateTime) {
  // 指定日期和时间
  // var EndTime = new Date(dateTime);
  // // 当前系统时间
  // console.log(dateTime)
  // var NowTime = new Date();
  var t = new Date(dateTime.replace(/-/g, '/')).getTime() - new Date().getTime();
  // console.log(t)
  var d = Math.floor(t / 1000 / 60 / 60 / 24);
  var h = Math.floor(t / 1000 / 60 / 60 % 24);
  var m = Math.floor(t / 1000 / 60 % 60);
  var s = Math.floor(t / 1000 % 60);
  // var html = d + " 天" + h + " 时" + m + " 分" + s + " 秒";
  return d + 1;
}
let reg = {}
export {
  fn,
  reg,
  toast,
  loading,
  downDays,
  model
}
