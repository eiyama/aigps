
import * as validates from './validateForm'
/**
 * 生成表格自定义校验函数
 * @param {String} key 方法名
 * @param {String} msg 提示文字
 */
export const formValidateGene = (key, msg, required) => (rule, value, cb) => {
  const tid  = setTimeout(() => {
    clearTimeout(tid)
    if(validates[key](value, required)) {
      cb()
    } else {
      cb(new Error(msg))
    }
  }, 200)
}

/**
 * 返回一个用于校验的数组
 * @param {String} key 方法名
 * @param {String} msg 提示文字
 * @param {String} trigger 触发校验的方式
 */
export function rule(key, msg, required, trigger) {
  return [
    {
      validator: formValidateGene(key, msg, required),
      required: !required,
      trigger: trigger || 'blur'
    }
  ]
}