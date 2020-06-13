let timestampToTime = (timestamp, type) => {
  //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  if (timestamp == 0) {
    return '';
  }
  if (timestamp.toString().length == 10) {
    var date = new Date(timestamp * 1000);
  } else {
    var date = new Date(timestamp);
  }

  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  if (type) {
    if (type == "date") {
      return Y + M + D;
    } else if (type == "dateTime") {
      return Y + M + D + h + m + s;
    } else if (type == "time") {
      return h + m + s;
    }
  } else {
    return Y + M + D;
  }
};
const diffTime = function(startDate, endDate) {
  var diff = endDate - startDate; //时间差的毫秒数  
  //计算出相差天数  
  var days = Math.floor(diff / (24 * 3600 * 1000));

  //计算出小时数  
  var leave1 = diff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数  
  var hours = Math.floor(leave1 / (3600 * 1000));
  hours = hours > 9 ? hours : `0${hours}`;
  //计算相差分钟数  
  var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数  
  var minutes = Math.floor(leave2 / (60 * 1000));
  minutes = minutes > 9 ? minutes : `0${minutes}`;
  //计算相差秒数  
  var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数  
  var seconds = Math.round(leave3 / 1000);
  seconds = seconds > 9 ? seconds : `0${seconds}`;
  return {
    days,
    hours,
    minutes,
    seconds
  }
}

export {
  timestampToTime,
  diffTime
}
