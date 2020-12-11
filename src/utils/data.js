/**该页面是处理数据的方法 */

export const parentId = '00000000-0000-0000-0000-000000000000'
export const devArr = ['SuBiao', 'ShanBiao', 'DV05', 'DV06', 'Video', 'JT1078']

/**
 * 没有URl就往下级找，直到找到为止然后赋值给当前项的URL
 * @param {Array} tree 树形数据
 * @return {Array} tree 返回新的树形数据
 */
export function getTreeUrlList(tree) {
  for (const v of tree.values()) {
    //没有url就调方法获取回调
    if (!v.url) {
      if (v.child && v.child.length > 0) {
        v.url = getTreeUrl(v.child);
        //把所有的都循环一下
        getTreeUrlList(v.child);
      }
    }
  }
  return tree;
}

 /**
  * 没有URl就往下级找，直到找到为止然后返回
  * @param {Array} tree 树形数据
  * @return {String} url 返回一个url 
  */
 export function getTreeUrl(tree) {
  let url = '';
  for (const v of tree.values()) {
    //有url就返回一个url,没有就继续递归
    if (v.url) {
      url = v.url;
      break;
    } else {
      if (!url && v.child && v.child.length > 0) {
        url = getTreeUrl(v.child);
      }
    }
  }
  return url;
}

  /**
   * 用一个参数来与树的每一项进行比较，返回一致的某个字段
   * @param {Array} tree tree数据
   * @param {String} key 要比较得字段
   * @param {String} getKey 要返回得字段
   * @param {String} value 比较得值
   * @return {String} val
   */
export function getTreeRepeatValue(tree, key, getKey, value) {
  let val
  for (const v of tree.values()) {
    if (v[key] === value) {
      val = v[getKey]
    } else {
      if (!val && Array.isArray(v.child) && v.child.length) {
        val = getTreeRepeatValue(v.child, key, getKey, value)
      }
    }
  }
  return val
}

/**
 * 判断该树数据里面key字段的值是否包含val
 * @param {Array} tree 树形数据
 * @param {String} key 要判断字段的key
 * @param {String} val 要比较的值
 * @return {Boolean} res 包含的话就返回true，反之false
 */
export function isValIndexOf(tree, key, val) {
  let res = false
  for (const v of tree.values()) {
    if (v[key] && v[key].indexOf(val) > -1) {
      res = true
      break
    } else {
      if (!res && Array.isArray(v.child) && v.child.length > 0) {
        res = isValIndexOf(v.child, key ,val)
      }
    }
  }
  return res
}
/**
 * 遍历树找到与之对应每个页面有哪些操作按钮
 * @param {Array} tree 树形数据
 * @param {String} url url地址
 * @return {Object} 返回一个JSON对象
 */
export function getOperButton(tree, url) {
  let obj = {};
  for (const v of tree.values()) {
    if (v.type == 2 && v.url == url) {
      obj = getOperName(v.child)
    } else {
      if (JSON.stringify(obj) == '{}' && Array.isArray(v.child) && v.child.length > 0) {
        obj = getOperButton(v.child, url);
      }
    }
  }
  return obj;
}
/**
 * 遍历操作按钮来获取有哪些操作
 * @param {Array} arr 包含操作权限的数组
 * @return {Object} operButton 返回一个JSON对象
 */
export function getOperName(arr) {
  const operButton = {};
  for (const v of arr.values()) {
    switch (v.name) {
      case '增加':
        operButton.add = true;
        break;
      case '修改':
        operButton.revise = true;
        break;
      case '删除':
        operButton.delete = true;
        break;
      case '查询':
        operButton.search = true;
        break;
      case '导出':
        operButton.export = true;
        break;
    }
  }
  return operButton;
}
/**
 * 根据id判断子级有没有节点
 * @param {Array} tree 树数据
 * @param {String} id 要判断的id
 * @return boole 如果有返回true，没有返回false
 */
export function notIsChild(tree, id) {
  let boole = true;
  for (const v of tree.values()) {
    if (v.id === id) {
      if (v.child && v.child.length) {
        boole = false;
      }
    } else {
      if (boole && v.child && v.child.length) {
        boole = notIsChild(v.child, id);
      }
    }
  }
  return boole;
}

/**
 * 数组sort方法排序的方法
 * @param {Object} v1 第一个参数
 * @param {Object} v2 第而个参数
 * @param {String} key 用来比较的key
 * @return {Number} -1第一个参数在第二个的前面，1第一个在第二个参数的后面，0不变
 */
export function compaer(key) {
  return function(v1, v2) {
    if (typeof v1 === 'object' && typeof v2 === 'object') {
      if (v1[key] < v2[key]) {
        return -1;
      } else if (v1[key] > v2[key]) {
        return 1;
      } else {
        return 0;
      }
    }
  }
}

/**
 * 判断添加或修改名称是否重复
 * @param {Array} arr 数据
 * @param {String} name 输入框的name值
 * @param {String} id 如果有id就是修改，没有就是添加
 * @param {String} nameK name的key
 * @param {String} idK id的key （可以不传）
 * @return {Boolean} 如果有重复就返回true
 */
export function isNameRepeat(opt) {
  const boole = opt.tree.some(v => {
    if ((!opt.name || v[opt.nameK] === opt.name) && (!opt.id || opt.id !== v[opt.idK])) {
      return true;
    }
  });
  return boole;
}
/**
 * 递归判断添加菜单同级下有没有重复的名称
 */
export function testTreeName(opt) {
  let boole = false;
  for (const v of opt.tree.values()) {
    // 当树的id与选中id相同证明找到同级的数组
    if (v[opt.idK] == opt.id) {
      let data = {
        ...opt
      }
      if (opt.isUp) {
        data.tree = opt.tree;
        boole = isNameRepeat(data);
      } else {
        if (v.child && v.child.length) {
          data.tree = v.child;
          boole = isNameRepeat(data);
        }
      }
    } else {
      if (!boole && v.child && v.child.length) {
        opt.tree = v.child;
        boole = testTreeName(opt);
      }
    }
  }
  return boole;
}

/**
 * 用树的一个参数或者改节点的子级与一个值indexOf比较，满足条件就返回true
 * @param {Array} tree 树数据 
 * @param {String} idK key值
 * @param {String} value 要比较的值
 * @return {Boolean} 有就返回true，反之false 
 */
export function isTreeIndexOf(tree, idK, value) {
  let boole = false;
  for (const v of tree.values()) {
    if (v[idK] && v[idK].indexOf(value) > -1) {
      boole = true;
      break;
    } else {
      if (!boole && v.child && v.child.length) {
        boole = isTreeIndexOf(v.child, idK, value);
      }
    }
  }
  return boole;
}

/**
 * 递归获取需要勾选的id
 * @param {Array} tree 树数据
 */
export function getOperationId(tree) {
  let ids = [];
  for (const v of tree.values()) {
    if (v.type == '3' && v.state) {
      ids.push(v.code);
    }
    if (v.child && v.child.length) {
      ids = [...getOperationId(v.child), ...ids];
    }
  }
  return ids;
}

/**
 * 
 * 获取时间组件的pickerOptions
 * @param {Object} opt 中英文里面的otherText
 * @return {Object} pickerOptions 时间组件需要的pickerOptions数据
 */
export function getPickerOptions(opt) {
  const pickerOptions = {
    // disabledDate(time) {
    //   return time.getTime() > (Date.now() + 3600 * 24 * 1e3)
    // },
    shortcuts: [
      {
        text: opt.today,
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          // 从当天的00:00:00开始
          const startDate = `${start.getFullYear()}/${(start.getMonth() + 1)}/${start.getDate()} 00:00:00`
          start.setTime(new Date(startDate).getTime());
          // 从当天的23:59:59结束
          const endDate = `${end.getFullYear()}/${(end.getMonth() + 1)}/${end.getDate()} 23:59:59`
          end.setTime(new Date(endDate).getTime());
          picker.$emit('pick', [start, end]);
        }
      },
      {
        text: opt.yesterday,
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          // 开始时间减掉1天
          start.setTime(start.getTime() - 3600 * 1000 * 24);
          const startDate = `${start.getFullYear()}/${(start.getMonth() + 1)}/${start.getDate()} 00:00:00`
          start.setTime(new Date(startDate).getTime());
          const endDate = `${start.getFullYear()}/${(start.getMonth() + 1)}/${start.getDate()} 23:59:59`
          end.setTime(new Date(endDate).getTime());
          picker.$emit('pick', [start, end]);
        }
      },
      {
        text: opt.dayBefore,
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          // 开始时间减掉2天
          start.setDate(start.getDate() - 2);
          const startDate = `${start.getFullYear()}/${(start.getMonth() + 1)}/${start.getDate()} 00:00:00`
          start.setTime(new Date(startDate).getTime());
          const endDate = `${start.getFullYear()}/${(start.getMonth() + 1)}/${start.getDate()} 23:59:59`
          end.setTime(new Date(endDate).getTime());
          picker.$emit('pick', [start, end]);
        }
      },
      {
        text: opt.threeDays,
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          // 开始时间减掉3天
          start.setDate(start.getDate() - 3);
          const startDate = `${start.getFullYear()}/${(start.getMonth() + 1)}/${start.getDate()} 00:00:00`
          start.setTime(new Date(startDate).getTime());
          const endDate = `${end.getFullYear()}/${(end.getMonth() + 1)}/${end.getDate()} 23:59:59`
          end.setTime(new Date(endDate).getTime());
          picker.$emit('pick', [start, end]);
        }
      },
      {
        text: opt.aWeek,
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          // 开始时间减掉7天
          start.setDate(start.getDate() - 7);
          // 设置开始时间为00:00:00
          const startDate = `${start.getFullYear()}/${(start.getMonth() + 1)}/${start.getDate()} 00:00:00`
          start.setTime(new Date(startDate).getTime());
          const endDate = `${end.getFullYear()}/${(end.getMonth() + 1)}/${end.getDate()} 23:59:59`
          end.setTime(new Date(endDate).getTime());
          picker.$emit('pick', [start, end]);
        }
      },
      {
        text: opt.lastMonth,
        onClick(picker) {
          const end = new Date();
          const start = new Date();
          start.setMonth(start.getMonth() - 1);
          const startDate = `${start.getFullYear()}/${(start.getMonth() + 1)}/${start.getDate()} 00:00:00`
          start.setTime(new Date(startDate).getTime());
          const endDate = `${end.getFullYear()}/${(end.getMonth() + 1)}/${end.getDate()} 23:59:59`
          end.setTime(new Date(endDate).getTime());
          picker.$emit('pick', [start, end]);
        }
      }
    ]
  }

  return pickerOptions
}

/**
 * 
 * 获取时间组件的pickerOptions
 * @param {Object} opt 中英文里面的otherText
 * @return {Object} pickerOptions 时间组件需要的pickerOptions数据
 */
export function getPickerOptions2(opt) {
  const pickerOptions = {
    shortcuts: [
      {
        text: opt.today,
        onClick(picker) {
          picker.$emit('pick', new Date())
        }
      },
      {
        text: opt.aWeekLater,
        onClick(picker) {
          const date = new Date()
          date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
          picker.$emit('pick', date)
        }
      },
      {
        text: opt.aMonthLater,
        onClick(picker) {
          const date = new Date()
          date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
          picker.$emit('pick', date)
        }
      }
    ]
  }

  return pickerOptions
}

/**
 * 
 * 获取时间组件的pickerOptions
 * @param {Object} opt 中英文里面的otherText
 * @return {Object} pickerOptions 时间组件需要的pickerOptions数据
 */
export function getPickerOptions3(opt) {
  const pickerOptions = {
    disabledDate(time) {
      return time.getTime() > Date.now()
    },
    shortcuts: [
      {
        text: opt.today,
        onClick(picker) {
          picker.$emit('pick', new Date())
        }
      },
      {
        text: opt.yesterday,
        onClick(picker) {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1e3 * 24)
          picker.$emit('pick', date)
        }
      },
      {
        text: opt.dayBefore,
        onClick(picker) {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1e3 * 24 * 2)
          picker.$emit('pick', date)
        }
      },
      {
        text: opt.threeDays,
        onClick(picker) {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1e3 * 24 * 3)
          picker.$emit('pick', date)
        }
      },
      {
        text: opt.aWeek,
        onClick(picker) {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1e3 * 24 * 7)
          picker.$emit('pick', date)
        }
      }
    ]
  }

  return pickerOptions
}

/**
 * 获取今日时间段
 * @return {Array} 返回一个包含开始时间与结束时间的数组
 */
export function getTodays() {
  const curDate = new Date()
  const startDate = `${curDate.getFullYear()}-${(curDate.getMonth() + 1)}-${curDate.getDate()} 00:00:00`
  const endDate = `${curDate.getFullYear()}-${(curDate.getMonth() + 1)}-${curDate.getDate()} 23:59:59`
  return [startDate, endDate]
}

/**
 * 获取今日时间段
 * @return {Array} 返回一个包含开始时间与结束时间的数组
 */
export function getYesterday() {
  const curDate = new Date()
  curDate.setDate(curDate.getDate() - 1);
  const startDate = `${curDate.getFullYear()}-${(curDate.getMonth() + 1)}-${curDate.getDate()} 00:00:00`
  const endDate = `${curDate.getFullYear()}-${(curDate.getMonth() + 1)}-${curDate.getDate()} 23:59:59`
  return [startDate, endDate]
}
/**
 * 获取一年之后的时间
 * @param {Number} num 多少年后的日期时间
 * @return {String} 返回一个日期时间
 */
export function getNYearLater(num) {
  let curDate = new Date();
  curDate.setFullYear(curDate.getFullYear() + num);
  const dateTime = `${curDate.getFullYear()}-${curDate.getMonth() + 1}-${curDate.getDate()}`;
  return dateTime;
}

/**
 * 根据key获取与key相同的数据
 * @param {Object|Array} obj 数据
 * @param {String} key 要获取的字段
 * @return 找到了就返回相同key的数据，反之false
 */
export function getKeyObj(obj, key) {
  if (!obj || typeof obj !== 'object') return false;
  let boole = false;
  if (obj instanceof Array) {
    for (const v of obj.values()) {
      if (!boole) {
        boole = getKeyObj(v, key);
      }
    }
  } else {
    for (const [k, v] of Object.entries(obj)) {
      if (key === k) {
        boole = v;
      } else {
        if (!boole) {
          boole = getKeyObj(v, key);
        }
      }
    }
  }
  return boole;
}
