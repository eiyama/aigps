
/**
 * 保留一位小数
 */
export function isOneDecimal(num) {
  const rule = /^(([0-9]+)|([0-9]+\.[0-9]))$/;
  return rule.test(num)
}

/**
 * 校验数字
 */
export function isNumber(val) {
  const rule = /^[1-9]\d{0,}$/;
  return rule.test(val);
}

/**
 * 清除字符串中的空格，并返回新的字符串
 */
export function getStrTrim(val) {
  const rule = /\s+/g;
  return val.replace(rule, '');
}

/**
 * 校验省的编号（末尾是否是四个0）
 * @param {String} str 字符串
 */
export function isProvince(str) {
  const rule = /0{4}$/
  return rule.test(str)
}

/**
 * 校验是否是经纬度
 * @param {String} str
 */
export function isLatLng(str) {
  const rule = /^(\d{1,}|\d{1,}.\d{1,}),(\d{1,}|\d{1,}.\d{1,})$/
  return rule.test(str)
}