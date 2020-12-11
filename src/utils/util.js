/**
 * 把时间戳转成天时分秒
 * @param {Number} times 时间戳（秒）
 * @param {Object} i18n 中英文的天时分秒
 * @return {String} 返回一个字符串
 */
export function getDateHMS(times, i18n) {
  var sec = times % 60;
  var minutes = Math.floor(times / 60);
  var minute = minutes % 60;
  var hours = Math.floor(minutes / 60);
  var hour = hours % 24;
  var day = Math.floor(hours / 24);
  if (hour || day) {
    hour = hour + i18n.hour;
  } else {
    hour = '';
  }
  if (minute || hour || day) {
    minute = minute + i18n.minute;
  } else {
    minute = '';
  }
  return (day ? day + i18n.day : '') + hour + minute + sec + i18n.sec;
}

/**
 * 根据参数值来补零
 * @param {String} str 需要补零的字符串
 * @param {Number} num 长度少于多少开始补零
 * @return {String} str 被处理之后的字符串
 */
export function customZeroize(str, num) {
  if (str.length === num) {
    return str
  }
  const leng = str.length
  while(num - leng > 0) {
    str = `0${str}`
    num--
  }
  return str
}

/**
 * 对象深度拷贝
 * @param {Object|Aarry} obj json或者数组
 */
export function getCopyObj(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 完美的深度拷贝
 * @param {Object|Aarry} obj json或者数组
 */
export function getDeepCopy(obj) {
  let copy;
  if (obj instanceof Array) {
    copy = [];
    for (const [i, v] of obj.entries()) {
      copy.push(v);
      if (v && typeof v === 'object') {
        copy[i] = getDeepCopy(v);
      }
    }
  } else if (obj && typeof obj === 'object') {
    copy = {}
    for (const [k, v] of Object.entries(obj)) {
      copy[k] = v;
      if (v && typeof v === 'object') {
        copy[k] = getDeepCopy(v);
      }
    }
  } else {
    return false;
  }
  return copy;
}

/**
 * 把时间戳转成日期时间
 * @param {Number|Null} times 时间戳，不传就获取当前的
 * @param {Boolean} isDate 是否只需要日期
 */
export function getDateTime(times, isDate) {
  const date = times ? new Date(times) : new Date();
  const month = date.getMonth() + 1;
  const strDate = date.getDate();
  const str = `${date.getFullYear()}-${zeroize(month)}-${zeroize(strDate)}`;
  if (isDate) {
    return str;
  }
  const dataTime = `${str} ${zeroize(date.getHours())}:${zeroize(date.getMinutes())}:${zeroize(date.getSeconds())}`;
  return dataTime;
}

/**
 * 
 * @param {*} times 时间戳，不传就获取当前的
 * @return {String} str 年—月
 */
export function getDateMonth (times) {
  const date = times ? new Date(times) : new Date();
  const month = date.getMonth() + 1;
  const str = `${date.getFullYear()}-${zeroize(month)}`;
  return str;
}

/**
 * 补零
 * @param {Number|String} num Number或者字符串数字
 * @return {String} 返回一个字符串
 */
export function zeroize (num) {
  if (num <= 9) {
    return `0${num}`;
  } else {
    return `${num}`;
  }
}

/**
 * 字符串长度小于n就在前面补零
 * @param {String} str 需要补零的字符串
 * @param {Number} n 长度小于多少开始补零
 */
export function zerosN (str, n) {
  if (str.length >= n) return str;
  let i = n - str.length;
  while (i > 0) {
    str = `0${str}`;
    i --;
  }
  return str;
}
/**
 * 根据字符串方法截取时间
 * @param {String} str 日期时间字符串(2019-11-12T13:42:18.827+08:00)
 * @param {Boolean} isDate 是否只是返回日期，默认返回日期时间
 * @return {String} 返回处理之后的字符串
 */
export function getDateStr (str, isDate) {
  if (str) {
    if (isDate) return str.substring(0, 10);
    return str.substring(0, 19).replace('T', ' ');
  } else {
    return '';
  }
}
/**
 * 字符串对象序列化
 * @param {String} strObj 字符串对象 
 * @param {*} err 如果strObj错误返回的值，默认{}
 * @return {*} 返回序列化之后的对象，如果报错返回err
 */
export function getParse (strObj, err) {
  try {
    return JSON.parse(strObj);
  } catch(error) {
    if (typeof err === 'undefined') return {};
    return err;
  }
}
/**
 * 保留N位小数
 * @param {Number} num 数字
 * @param {Number} n 保留多少位，默认保留两位
 * @return {Number} val 修改之后的值
 */
export function getDecimalN (num, n) {
  if (!num) return 0;
  if (!n) n = 2;
  const count = Math.pow(10, n);
  const val = Math.floor(num * count) / count;
  return val;
}

/**
 * 格式化时间
 * @param {String} format 格式化规则
 * @param {Number|Null} times 需要格式化的时间戳，默认当前时间
 * @return {String} format 操作之后的值
 */
export function getFormatTime(format, times) {
  const oDate = !times ? new Date() : new Date(times);
  const year = oDate.getFullYear();
  const month = oDate.getMonth() + 1;
  const day = oDate.getDate();
  const hour = oDate.getHours();
  const minute = oDate.getMinutes();
  const second = oDate.getSeconds();
  const formats = ['Y', 'M', 'D', 'h', 'm', 's'];
  const returnArr = [year, month, day, hour, minute, second];
  for (const [i, v] of returnArr.entries()) {
    format = format.replace(formats[i], zeroize(v));
  }

  return format;
}

/**
 * 根据秒来获取一个时：分：秒
 * @param sec 秒
 * @return str 时：分：秒
 */
export function getHMS (sec) {
  if (sec < 0) sec = 0;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const str = `${zeroize(h)}:${zeroize(m)}:${zeroize(s)}`;
  return str;
}

/**
 * 清除字符串的空格
 * @param {String} str 要处理的字符串
 * @return str 返回处理之后的字符串
 */
export function getTrim (str) {
  if (str && str.replace) {
    return str.replace(/\s/g, '');
  }
  return '';
}

/**
 * 获取图表最大值
 */
export function getMax (count, reta) {
  reta = reta || 1.2
  const max = Math.ceil(count * reta / 5) * 5
  if (max < 10) return 10
  return max
}
/**
 * 获取图表y轴每一刻度的值
 */
export function getInterval (arr, reta) {
  reta = reta || 1.2
  const max = arr.reduce((maxVal, v) => {
    maxVal = Math.max(maxVal, v)
    return maxVal
  }, 0)
  const count = Math.ceil(max * reta / 5)
  if (count < 2) return 2
  return count
}

/**
 * 数组去重
 * @param {Array} arr 数组 
 * @param {Strimg|*} k 数组里面是对象的话，k代表要去重的属性
 */
export function unique (arr, k) {
  if (k) {
    let i = 0
    while (i < arr.length) {
      const v = arr[i]
      const index = arr.findIndex((e, j) => i !== j && v[k] === e[k])
      if (index > -1) {
        arr.splice(index, 1)
        i --
      }
      i ++
    }
    return arr
  } else {
    return Array.from(new Set(arr))
  }
}

export function copyToClipboard(text) {
  const textArea = document.createElement('textarea')
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    return successful
  } catch (err) {
    document.body.removeChild(textArea)
    return false
  }
}

/**
 * 将树数据转换成普通的array
 * @param {Array} tree tree数据
 * @param {String} childKey 包裹子级的数组key
 * @return {Array} arr 返回一个数组
 */
export function getTreeChangeArr(tree, childKey) {
  let arr = []
  for (const v of tree.values()) {
    const temp = getCopyObj(v)
    delete temp[childKey]
    arr.push(temp)
    if (v[childKey] instanceof Array && v[childKey].length) {
      arr = [...arr, ...getTreeChangeArr(v[childKey], childKey)]
    }
  }

  return arr
}

/**
 * 获取添加路由的树数据（将数组拼接成路由树）
 * @param {Array} arr 路由数据
 * @return {Array} tree 返回一个路由树
 */
export function getRoutes(data) {
  const parents = data.filter(value => !value.meta || !value.meta.parentPath)
  const childrens = data.filter(value => value.meta && value.meta.parentPath)
  const translator = (parents, childrens) => {
  parents.forEach((parent, i) => {
    childrens.forEach((current, index) => {
      if (current.meta && current.meta.parentPath === parent.path) {
        const temp = JSON.parse(JSON.stringify(childrens))
        temp.splice(index, 1)
        translator([current], temp)
        typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
      }
    })
    if (parent.hasOwnProperty('children') && !parent.children.length) {
      parents.splice(i, 1)
    }
  })
}

translator(parents, childrens)

return parents
}
