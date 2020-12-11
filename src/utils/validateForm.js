export function isEmpty(val) {
  if (val && typeof val === 'object') val = val.model
  const relu = /^\S+$/
  return relu.test(val)
}

/**
 * @param {*} val 要校验的值
 * @param {Boolean} required true为不必填，false为必填
 */
export function isPsw(val, required) {
  if (val && typeof val === 'object') {
    val = val.model
  }
  if (required && !val) return true
  if (val && val.length <= 32) {
    return true;
  } else {
    return false;
  }
}

/**
 * 密码可以为空，但是必须小于等于32
 */
export function isPsw2(val) {
  if (val && typeof val === 'object') {
    val = val.model
  }
  if (!val || val.length <= 32) {
    return true;
  } else {
    false;
  }
}

/**
 * 保留一位小数
 */
export function isOneDecimal(val) {
  if (val && typeof val === 'object') {
    val = val.model
  }
  const rule = /^(([1-9]\d{0,})|([1-9]\d{0,}\.\d)|([0-9]\.\d))$/;
  if (!val || rule.test(val)) {
    return true;
  } else {
    return false;
  }
}

/**
 * 校验数字
 */
export function isNumber(val) {
  if (val && typeof val === 'object') {
    val = val.model
  }
  const rule = /^[1-9]\d{0,}$/;
  if (!val || rule.test(val)) {
    return true;
  } else {
    return false;
  }
}

/**
 * 校验数字11位
 */
export function isNumberLength11(val) {
  if (val && typeof val === 'object') {
    val = val.model
  }
  const rule = /^\d{11}$/;
  return rule.test(val);
}

/**
 * 身份证校验
 */
export function isIdCard(val) {
  if (val != null && typeof val == 'object') {
    val = val.model;
  }
  const city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外 '
  }
  const rule = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i;
  if (!val || !rule.test(val)) {
    return false;
  } else if (!city[val.substring(0, 2)]) {
    return false;
  } else {
    // 18位身份证需要验证最后一位校验位
    if (val.length == 18) {
      val = val.split('');
      // ∑(ai×Wi)(mod 11)
      // 加权因子
      const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      // 校验位
      const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      let sum = 0;
      let ai = 0;
      let wi = 0;
      let i = 0;
      while(i < 17) {
        ai = val[i];
        wi = factor[i];
        sum += ai * wi;
        i ++;
      }
      const last = parity[sum % 11];
      if (last != val[17]) {
        return false;        
      }
    }
  }
  return true;
}

/**
 * 校验端口号
 */
export function isPort(val) {
  if (val && typeof val === 'object') {
    val = val.model
  }
  if (isNumber(val) && val >= 1025 && val <= 65535 ) {
    return true;
  } else {
    return false;
  }
}

/**
 * 大于10的数字
 */
export function isFrequency(val) {
  if (val && typeof val === 'object') {
    val = val.model
  }
  if (isNumber(val) && val >= 10) {
    return true;
  } else {
    return false;
  }
}

/**
 * 校验手机号
 * @param {*} val 要校验的值
 * @param {Boolean} required true为不必填，false为必填
 */
export function isPhone(val, required) {
  if (val && typeof val === 'object') {
    val = val.model
  }
  if (required && !val) return true
  const rule = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
  return rule.test(val)
}