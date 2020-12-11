import zhLocale from 'element-ui/lib/locale/lang/zh-CN' // 引入element语言包
const cn = {
  // 提示文字
  message: {
    title: '提示',
    delete: '删除之后不能恢复，确认删除？',
    quit: '确定退出？',
    msgMin1: '离线时长必须是最小为1的整数',
    offlineTime: '请输入离线时长',
    offlineTimeError: '离线时长只能是整数且大于0',
    noPower: '您没有查看该页面的权限'
  },
  // 按钮的文字
  button: {
    add: '增加',
    delete: '删除',
    revise: '修改',
    search: '查询',
    confirm: '确认',
    close:'关闭',
    cancel: '取消',
    prve: '返回',
    submit: '提交',
    refresh: '刷新',
    exportFile: '导出',
    relation: '关联',
    addRelation: '保存并关联车辆',
    dingwei: '标注',
    quit: '退出',
    quitDraw: '退出绘制',
    drawSuccess: '绘制完成',
    queryCurAddress: '查看当前位置',
    queryAddress: '点击查看位置',
    clickHandle: '点击处理',
    upload: '导入',
    setAlarm: '报警设置',
    traffic: '路况信息',
    bandingCar : '绑定/解绑车辆',
    unbindCar : '车辆解绑',
    binding:'分配',
    unbinding:'取消分配',
    preserve:'保存',
    
  },
  // input的placeholder
  placeholder: {
    roleSearch: '请填写登录代码/用户名/部门名',
    carSearch: '车牌号/终端号/SIM号/VIN号',
    times: '请选择日期时间',
    time: '请选择时间',
    startTime: '开始日期',
    endTime: '结束日期',
    to: '至',
    userName: '请输入用户名',
    userPsw: '请输入密码',
    modelName: '请输入模块名称',
    modelCode: '请输入模块编码',
    operationName: '请输入操作名称',
    operationCode: '请输入操作代码',
    dptName: '请输入部门名称',
    carNum: '请输入车牌号/终端号',
    dptIsCar: '部门名称/车牌号码',
    roleName: '请输入角色名称',
    offlineTime: '请输入离线时长(天)',
    duration: '请输入持续时间',
    alaType: '请选择报警类型'
  },
  // 其他标题文字
  otherText: {
    selectAll: '全选',
    yesSelect: '已选择：',
    yesterday: '昨天',
    dayBefore: '前天',
    threeDays: '最近三天',
    aWeek: '最近一周',
    lastMonth: '最近一个月',
    today: '今天',
    aWeekLater: '一周后',
    aMonthLater: '一月后',
    aYearLater: '一年后',
    day: '天',
    hour: '小时',
    minute: '分',
    sec: '秒',
    index: '序号',
    lastDay30: '最近30天',
    thisMonth: '本月',
    km: 'Km',
    truck: '辆',
    second: '次',
    invalid: '无效',
    open: '开',
    shut: '关',
    table: '表格',
    chart: '图表',
    noData: '暂无数据',
    cobrar: '收取',
    noCobrar: '未收取',
    blue: '蓝色',
    yellow: '黄色',
    msgExport: '表格有数据才能导出！',
    prohibit: '禁用',
    enable: '启用',
    search: '查询',
    edit: '编辑',
    total: '合计',
    isPosition_1: '已定位',
    isPosition_2: '未定位',
    positionType_1: 'LBS',
    positionType_2: 'GPS',
    send: '已发送',
    noSend: '未发送',
    response: '已应答',
    noResponse: '未应答',
    startAddress: '开始地址',
    endAddress: '结束地址',
    alarmAddress: '报警位置',
    left: '左转',
    right: '右转',
    run: '运行',
    stop: '停车',
    handleYes: '已处理',
    handleNo: '未处理',
    equipment: '设备',
    vehicle: '车辆',
    operator1: '移动',
    operator2: '联通',
    operator3: '电信',
    man: '男',
    woman: '女'
  },

  // 失败的提示
  error: {
    nameRepeat: '同级下不能存在同名！',
    menuNode: '下级存在菜单！',
    menuRoot: '根节点不能进行操作！',
    menuNextModel: '菜单下存在功能模块！',
    notNode: '根节点不能添加模块！',
    noData: '请选择一条数据进行操作！',
    dptNode: '存在下级子部门！',
    roleNode: '存在下级子角色！',
    selectCar: '请选择车辆！',
    addCar: '请添加车辆！',
    selectTime: '请选择轨迹播放的时间范围！',
    msgMax: '已经是最大了！',
    msgMin: '已经是最小了！',
    carNoGps: '该车辆从未上线！',
    carNoLine: '该车辆没有在线',
    // noTrail: '该车辆没有轨迹！',
    noTrail: '该时间段没有轨迹！',
    selectTimes: '请选择时间范围！',
    duration: '持续时长必须是整数',
    limitSpeed: '超速阈值必须是整数',
    tyrePressureIsNo: '该车辆没有胎压！',
    stopCarTime: '请选择停车时间！',
    selectType: '请选择类型！',
    msgOldPsw: '请输入旧密码！',
    msgNewPsw: '请输入新密码！',
    msgConfirmPsw: '确认密码不能为空！',
    errorConfirmPsw: '确认密码与新密码必须相同！',
    pswNotTheSame: '旧密码与新密码不能相同！',
    msgUserName: '请输入用户名！',
    msgPsw: '请输入密码！',
    numDay3: '时间范围不能超过三天',
    haveLiveVideo: '该设备没有实时视频！',
    httpError: '您的网络好像出现了问题！',
    http408: '请求超时,请重新操作！',
    http502: '网络错误，请检查网络！',
    iccId: '请输入智能卡号！',
    channel: '视频设备必须设置通道参数！',
    copy: '您的浏览器不支持点击复制到剪贴板!'
  },
  // 成功的提示
  success: {
    add: '添加成功！',
    revise: '修改成功！',
    delete: '删除成功！',
    alarm: '报警处理成功！',
    revisePsw: '密码修改成功！',
    sendCommand: '发送指令成功！',
    copy: '复制成功！',
    bind:'绑定成功',
    success: '成功'
  },

  // 地图相关
  mapData: {
    searchData: {
      city: {
        label: '地区：',
        type: 'input',
        model: ''
      },
      keyword: {
        label: '关键词：',
        type: 'input',
        model: ''
      }
    }
  },

  // 首页
  home: {
    logo: 'AI车管家',
    equipment: '设备',
    vehicle: '车辆',
    logTitle: '日志',
    tableTitle: [
      {
        label: '终端号',
        prop: 'terminalPhoneNo',
        width: '140'
      },
      {
        label: '消息ID',
        prop: 'msgId',
        width: '140'
      },
      {
        label: '创建时间',
        prop: 'createTime',
        width: '160',
        sort: true
      },
      {
        label: '16进制',
        prop: 'hexData',
        width: '300'
      },
      {
        label: '内容',
        prop: 'json',
        width: '300'
      }
    ],
    tableMoreConList: [
      {
        label: '终端号',
        prop: 'terminalPhoneNo'
      },
      {
        label: '消息ID',
        prop: 'msgId'
      },
      {
        label: '创建时间',
        prop: 'createTime'
      },
      {
        label: '16进制',
        prop: 'hexData',
        width: true
      },
      {
        label: '内容',
        prop: 'json',
        width: true
      }
    ],
    historyOnlineTableTitle: [
      {
        label: '当天',
        children: [
          {
            label: '在线数',
            prop: 'curDayonlineCount',
            width: '120'
          },
          {
            label: '离线数',
            prop: 'curDayoffLineCount',
            width: '120'
          },
          {
            label: '在线率',
            prop: 'curDayrate',
            width: '120'
          }
        ]
      },
      {
        label: '三天',
        children: [
          {
            label: '在线数',
            prop: 'threeDayonlineCount',
            width: '120'
          },
          {
            label: '离线数',
            prop: 'threeDayoffLineCount',
            width: '120'
          },
          {
            label: '在线率',
            prop: 'threeDayrate',
            width: '120'
          }
        ]
      },
      {
        label: '七天',
        children: [
          {
            label: '在线数',
            prop: 'weekonlineCount',
            width: '120'
          },
          {
            label: '离线数',
            prop: 'weekoffLineCount',
            width: '120'
          },
          {
            label: '在线率',
            prop: 'weekrate',
            width: '120'
          }
        ]
      },
      {
        label: '三十天',
        children: [
          {
            label: '在线数',
            prop: 'monthonlineCount',
            width: '120'
          },
          {
            label: '离线数',
            prop: 'monthoffLineCount',
            width: '120'
          },
          {
            label: '在线率',
            prop: 'monthrate',
            width: '120'
          }
        ]
      }
    ],
    alarmData: [
      {
        id: '00',
        label: '设备报警',
        title: '全选',
        type: 1,
        options: [
          {
            id: '紧急报警_触动报警开关后触发',
            label: '紧急报警_触动报警开关后触发',
            parentName: '设备报警',
            type: 2
          },
          {
            id: '超速报警',
            label: '超速报警',
            parentName: '设备报警',
            type: 2
          },
          {
            id: '疲劳驾驶',
            label: '疲劳驾驶',
            parentName: '设备报警',
            type: 2
          },
          {
            id: '危险预警',
            label: '危险预警',
            parentName: '设备报警',
            type: 2
          },
          {
            id: 'GNSS模块发生故障',
            label: 'GNSS模块发生故障',
            parentName: '设备报警',
            type: 2
          },
          {
            id: 'GNSS天线未接或被剪断',
            label: 'GNSS天线未接或被剪断',
            parentName: '设备报警',
            type: 2
          },
          {
            id: 'GNSS天线短路',
            label: 'GNSS天线短路',
            parentName: '设备报警',
            type: 2
          },
          {
            id: '终端主电源欠压',
            label: '终端主电源欠压',
            parentName: '设备报警',
            type: 2
          },
          {
            id: '终端主电源掉电',
            label: '终端主电源掉电',
            parentName: '设备报警',
            type: 2
          },
          {
            id: '终端LCD或显示器故障',
            label: '终端LCD或显示器故障',
            parentName: '设备报警',
            type: 2
          },
          {
            id: 'TTS模块故障',
            label: 'TTS模块故障',
            parentName: '设备报警',
            type: 2
          },
          {
            id: '摄像头故障',
            label: '摄像头故障',
            parentName: '设备报警',
            type: 2
          },
          {
            id: '道路运输证IC卡模块故障',
            label: '道路运输证IC卡模块故障',
            parentName: '设备报警',
            type: 2
          },

          {
            id: '超速预警',
            label: '超速预警',
            parentName: '设备报警',
            type: 2
          },
          {
            id: '疲劳驾驶预警',
            label: '疲劳驾驶预警',
            parentName: '设备报警',
            type: 2
          },
          {
            id: '当天累计驾驶超时',
            label: '当天累计驾驶超时',
            parentName: '设备报警',
            type: 2
          },
          {
            id: '超时停车',
            label: '超时停车',
            parentName: '设备报警',
            type: 2
          },
          {
            id: '进出区域',
            label: '进出区域',
            parentName: '设备报警',
            type: 2
          },
          {
            id: '进出路线',
            label: '进出路线',
            parentName: '设备报警',
            type: 2
          },
          {
            id: '路段行驶时间不足或过长',
            label: '路段行驶时间不足或过长',
            parentName: '设备报警',
            type: 2
          },
          {
            id: '路线偏离报警',
            label: '路线偏离报警',
            parentName: '设备报警',
            type: 2
          },

          {
            id: '车辆VSS故障',
            label: '车辆VSS故障',
            parentName: '设备报警',
            type: 2
          },
          {
            id: '车辆油量异常',
            label: '车辆油量异常',
            parentName: '设备报警',
            type: 2
          },
          {
            id: '车辆被盗',
            label: '车辆被盗',
            parentName: '设备报警',
            type: 2
          },
          {
            id: '车辆非法点火',
            label: '车辆非法点火',
            parentName: '设备报警',
            type: 2
          },
          {
            id: '车辆非法位移',
            label: '车辆非法位移',
            parentName: '设备报警',
            type: 2
          },
          {
            id: '碰撞预警',
            label: '碰撞预警',
            parentName: '设备报警',
            type: 2
          },
          {
            id: '侧翻预警',
            label: '侧翻预警',
            parentName: '设备报警',
            type: 2
          },
          {
            id: '非法开门报警',
            label: '非法开门报警',
            parentName: '设备报警',
            type: 2
          },
          {
            id: '电池低电报警',
            label: '电池低电报警',
            parentName: '设备报警',
            type: 2
          }
        ]
      },
      {
        id: '01',
        label: '胎压报警',
        title: '全选',
        type: 1,
        options: [
          {
            id: '胎压异常',
            label: '胎压异常',
            parentName: '胎压报警',
            type: 2
          }
        ]
      },
      {
        id: '02',
        label: '围栏报警',
        title: '全选',
        type: 1,
        options: [
          {
            id: '入围栏报警',
            label: '入围栏报警',
            parentName: '围栏报警',
            type: 2
          },
          {
            id: '出围栏报警',
            label: '出围栏报警',
            parentName: '围栏报警',
            type: 2
          },
          {
            id: '围栏内停车报警',
            label: '围栏内停车报警',
            parentName: '围栏报警',
            type: 2
          },
          {
            id: '围栏内超速报警',
            label: '围栏内超速报警',
            parentName: '围栏报警',
            type: 2
          },
          {
            id: '线路报警',
            label: '线路报警',
            parentName: '围栏报警',
            type: 2
          }
        ]
      },
      {
        id: '03',
        label: '视频设备报警',
        title: '全选',
        type: 1,
        options: [
          {
            id: '前向碰撞报警',
            label: '前向碰撞报警',
            parentName: '视频设备报警',
            type: 2
          },
          {
            id: '车道偏离报警',
            label: '车道偏离报警',
            parentName: '视频设备报警',
            type: 2
          },
          {
            id: '车距过近报警',
            label: '车距过近报警',
            parentName: '视频设备报警',
            type: 2
          },
          {
            id: '频繁变道',
            label: '频繁变道',
            parentName: '视频设备报警',
            type: 2
          },
          {
            id: '疲劳驾驶报警',
            label: '疲劳驾驶报警',
            parentName: '视频设备报警',
            type: 2
          },
          {
            id: '接打电话报警',
            label: '接打电话报警',
            parentName: '视频设备报警',
            type: 2
          },
          {
            id: '抽烟报警',
            label: '抽烟报警',
            parentName: '视频设备报警',
            type: 2
          },
          {
            id: '分神驾驶报警',
            label: '分神驾驶报警',
            parentName: '视频设备报警',
            type: 2
          },
          {
            id: '驾驶员异常报警',
            label: '驾驶员异常报警',
            parentName: '视频设备报警',
            type: 2
          },
          {
            id: '驾驶员变更事件',
            label: '驾驶员变更事件',
            parentName: '视频设备报警',
            type: 2
          }
        ]
      }
    ],
    info: {
      title: '今日车辆在线情况',
      vehicleTotal: '车辆总数',
      vehicleOnline: '今日上线数',
      vehicleUseRate: '车辆使用率',
      historyOnline: '历史在线率',
      vehicleOnlineDetail: '车辆在线情况',
      mileageTodayTotal: '今日行驶里程',
      mileageAverage: '日均行驶里程',
      hoursAverage: '日均行驶时长',
      moreThan50: '50以上',
      moreThan100: '100以上',
      runTime: '运行时长(h)',
      runMileage: '运行里程(Km)',
      addressArr: [
        { code: '110000', name: '北京', value: null, key: [] },
        { code: '120000', name: '天津', value: null, key: [] },
        { code: '310000', name: '上海', value: null, key: [] },
        { code: '500000', name: '重庆', value: null, key: [] },
        { code: '130000', name: '河北', value: null, key: [] },
        { code: '410000', name: '河南', value: null, key: [] },
        { code: '530000', name: '云南', value: null, key: [] },
        { code: '210000', name: '辽宁', value: null, key: [] },
        { code: '230000', name: '黑龙江', value: null, key: [] },
        { code: '430000', name: '湖南', value: null, key: [] },
        { code: '340000', name: '安徽', value: null, key: [] },
        { code: '370000', name: '山东', value: null, key: [] },
        { code: '650000', name: '新疆', value: null, key: [] },
        { code: '320000', name: '江苏', value: null, key: [] },
        { code: '330000', name: '浙江', value: null, key: [] },
        { code: '360000', name: '江西', value: null, key: [] },
        { code: '420000', name: '湖北', value: null, key: [] },
        { code: '450000', name: '广西', value: null, key: [] },
        { code: '620000', name: '甘肃', value: null, key: [] },
        { code: '140000', name: '山西', value: null, key: [] },
        { code: '150000', name: '内蒙古', value: null, key: [] },
        { code: '610000', name: '陕西', value: null, key: [] },
        { code: '220000', name: '吉林', value: null, key: [] },
        { code: '350000', name: '福建', value: null, key: [] },
        { code: '520000', name: '贵州', value: null, key: [] },
        { code: '440000', name: '广东', value: null, key: [] },
        { code: '630000', name: '青海', value: null, key: [] },
        { code: '540000', name: '西藏', value: null, key: [] },
        { code: '510000', name: '四川', value: null, key: [] },
        { code: '640000', name: '宁夏', value: null, key: [] },
        { code: '460000', name: '海南', value: null, key: [] },
        { code: '710000', name: '台湾', value: null, key: [] },
        { code: '810000', name: '香港', value: null, key: [] },
        { code: '820000', name: '澳门', value: null, key: [] }
      ],
      stateList: [
        {
          icon: 'icon-jijiasu1',
          name: '急加速：',
          key: 'rapidAccelerationCount'
        },
        {
          icon: 'icon-jijiansu1',
          name: '急减速：',
          key: 'rapidDecelerationCount'
        },
        {
          icon: 'icon-jizhuanwan1',
          name: '急转弯：',
          key: 'sharpTurnCount'
        },
        {
          icon: 'icon-chaosu',
          name: '超速：',
          key: 'overSpeedCount'
        },
        {
          icon: 'icon-gpspilaojiashi',
          name: '疲劳驾驶：',
          key: 'fatigueDrivingCount'
        }
      ]
    },
    options: [
      {
        name: '运行里程',
        unit: 'Km',
        color: '#2c9994',
        type: 'bar',
        barWidth: 30
      },
      {
        name: '运行时长',
        unit: 'h',
        smooth: true,
        yAxisIndex: 1,
        color: '#f8da78',
        type: 'line'
      }
    ],
    options2: [
      {
        name: '运行里程',
        unit: 'Km',
        areaStyle: {
          color: '#423d8d'
        },
        color: '#9270f2',
        type: 'line'
      },
      {
        name: '运行时长',
        unit: 'h',
        areaStyle: {
          color: '#262d88'
        },
        smooth: true,
        yAxisIndex: 1,
        color: '#4578ef',
        type: 'line'
      }
    ],
    options3: [
      {
        name: '上周',
        unit: '次',
        color: '#2c9994',
        type: 'bar',
        barWidth: 20
      },
      {
        name: '本周',
        unit: '次',
        color: '#c205c2',
        type: 'bar',
        barWidth: 20
      },
      {
        name: '总数',
        unit: '次',
        smooth: false,
        color: '#fff100',
        type: 'line'
      }
    ],
    alarmList: [
      {
        text: '接打电话报警',
        img: require('@/assets/image/home/home-icon1.png'),
        val: 0,
        unit: '次'
      },
      {
        text: '分神驾驶报警',
        img: require('@/assets/image/home/home-icon2.png'),
        val: 0,
        unit: '次'
      },
      {
        text: '车道偏离报警',
        img: require('@/assets/image/home/home-icon3.png'),
        val: 0,
        unit: '次'
      },
      {
        text: '疲劳驾驶报警',
        img: require('@/assets/image/home/home-icon4.png'),
        val: 0,
        unit: '次'
      }
    ],
    setUserInfo: [
      {
        name: '修改密码',
        path: '',
        type: 'psd'
      },
      {
        name: '安全大屏',
        path: '/home/safeBigScreen',
        type: 'link'
      }
    ],
    revisePsw: {
      oldPsw: '输入旧密码',
      newPsw: '输入新密码',
      confirmPsw: '确认新密码',
      title: '修改密码'
    }
  },
  // 菜单管理
  menuManage: {
    listLi: {
      menuName: {
        label: '菜单名称：',
        type: 'input',
        model: ''
      },
      menuCode: {
        label: '菜单编码：',
        type: 'input',
        model: ''
      },
      menuEnName: {
        label: '菜单英文名称：',
        type: 'input',
        model: ''
      },
      menuIcon: {
        label: '菜单图标：',
        type: 'input',
        model: ''
      },
      menuType: {
        label: '菜单类型：',
        type: 'dropDown',
        model: 0,
        default: 0,
        children: ['单页面', '选项卡']
      },
      menuIsHomePage: {
        label: '是否首页：',
        type: 'dropDown',
        model: 0,
        default: 0,
        children: ['否', '是']
      },
      sortNum: {
        label: '排序码：',
        type: 'inputNumber',
        model: '',
        default: 0
      },
      memo: {
        label: '备注：',
        type: 'textarea',
        model: ''
      }
    },
    menuRules: {
      menuCode: '菜单编码不能为空！',
      menuName: '菜单名称不能为空！',
      moduleName: '模块名不能为空！',
      moduleUniqeCode: '模块唯一编码不能为空！',
      moduleEntrance: '模块入口不能为空！'
    },
    modelListLi: {
      moduleName: {
        label: '模块名称：',
        type: 'input',
        model: ''
      },
      moduleUniqeCode: {
        label: '唯一编码：',
        type: 'input',
        model: ''
      },
      moduleEnName: {
        label: '英文模块名称：',
        type: 'input',
        model: ''
      },
      moduleIcon: {
        label: '模块图标：',
        type: 'input',
        model: ''
      },
      moduleVersion: {
        label: '模块版本：',
        type: 'input',
        model: ''
      },
      moduleEntrance: {
        label: '模块入口：',
        type: 'input',
        model: ''
      },
      dataFlag: {
        label: '是否启用：',
        type: 'dropDown',
        model: 1,
        default: 1,
        children: ['不启用', '启用']
      },
      sortNum: {
        label: '排序码：',
        type: 'inputNumber',
        model: '',
        default: 0
      },
      memo: {
        label: '备注：',
        type: 'textarea',
        model: ''
      }
    },
    searchList: {
      modelName: {
        label: '模块名称：',
        type: 'input',
        model: '',
        placeholder: '请输入模块名称'
      },
      modelCode: {
        label: '唯一编码：',
        type: 'input',
        model: '',
        placeholder: '请输入模块编码'
      }
    },
    tableTitle: [
      {
        label: '模块名称',
        prop: 'moduleName',
        width: '180'
      },
      {
        label: '英文模块名',
        prop: 'moduleEnName',
        width: '160'
      },
      {
        label: '唯一编码',
        prop: 'moduleUniqeCode',
        width: '160'
      },
      {
        label: '模块入口',
        prop: 'moduleEntrance',
        width: '320'
      },
      {
        label: '是否启用',
        prop: 'flag',
        width: '90'
      },
      {
        label: '版本号',
        prop: 'moduleVersion',
        width: '80'
      },
      {
        label: '备注',
        prop: 'memo',
        width: '240'
      },
      {
        label: '排序码',
        prop: 'sortNum',
        width: '80'
      }
    ],
    addTitle: '菜单添加',
    addModelTitle: '模块添加',
    reviseTitle: '修改菜单',
    deleteMsg: '请选择一条记录！',
    reviseModelTitle: '修改模块',
    curMenuTitle: '菜单管理',
    curModelTitle: '功能模块管理'
  },
  // 操作按钮管理
  buttonManage: {
    listLi: {
      oprCode: {
        label: '操作代码：',
        type: 'input',
        model: ''
      },
      oprName: {
        label: '操作名称：',
        type: 'input',
        model: ''
      },
      oprType: {
        label: '操作分类：',
        type: 'dropDown',
        model: 0,
        default: 0,
        children: ['查询', '编辑']
      },
      sortNum: {
        label: '排序码：',
        type: 'inputNumber',
        model: '',
        default: 0
      },
      memo: {
        label: '备注：',
        type: 'textarea',
        model: ''
      }
    },
    searchList: {
      handName: {
        label: '操作名称：',
        prop: 'handName',
        type: 'input',
        model: '',
        placeholder: '请输入操作名称'
      },
      handCode: {
        label: '操作代码：',
        prop: 'handCode',
        type: 'input',
        model: '',
        placeholder: '请输入操作代码'
      }
    },
    operationRules: {
      oprCode: '操作代码不能为空！',
      oprName: '操作名称不能为空！',
      oprType: '操作分类不能为空！'
    },
    tableTitle: [
      {
        label: '操作代码',
        prop: 'oprCode',
        width: '200'
      },
      {
        label: '操作名称',
        prop: 'oprName',
        width: '200'
      },
      {
        label: '操作分类',
        prop: 'oprType',
        width: '200'
      },
      {
        label: '备注',
        prop: 'memo',
        width: '260'
      },
      {
        label: '排序码',
        prop: 'sortNum',
        width: '80'
      }
    ],
    addTitle: '添加操作',
    reviseTitle: '修改操作',
    curTitle: '操作按钮'
  },
  // 部门管理
  divisionManage: {
    curTitle: '部门车辆管理',
    leftTitle: {
      title: '部门架构',
      addTitle: '添加部门',
      listLi: {
        dptName: {
          label: '部门名称：',
          type: 'input',
          model: ''
        },
        dptCode: {
          label: '部门编码：',
          type: 'input',
          model: ''
        },
        contractPhone: {
          label: '联系电话：',
          type: 'input',
          model: ''
        },
        businessLicense: {
          label: '营业执照：',
          type: 'input',
          model: ''
        },
        sortNum: {
          label: '排序码：',
          type: 'inputNumber',
          model: '',
          default: 0
        },
        memo: {
          label: '备注：',
          type: 'textarea',
          model: ''
        }
      },
      rules: {
        dptName: '部门名称不能为空！',
        dptCode: '部门编码不能为空！',
        contractPhone: '请输入正确的电话号码！'
      }
    },
    nodeDropSuc: '部门移动成功',
    nodeDropErr: '部门移动失败',
    msgSelectDivision: '请选择部门！',
    msgSelectCar: '请选择要添加的车辆！',
    msgSelectCancelCar: '请选择要取消的车辆！',
    centerTitle: {
      title: '已分配'
    },
    rightTitle: {
      title: '未分配'
    }
  },
  // 角色管理
  roleManage: {
    curPageTitle: '角色权限管理',
    reviseTitle: '修改角色',
    addTitle: '添加角色',
    listLi: {
      roleName: {
        label: '角色名称：',
        type: 'input',
        model: ''
      },
      roleCode: {
        label: '角色编码：',
        type: 'input',
        model: ''
      },
      roleDscr: {
        label: '角色描述：',
        type: 'input',
        model: ''
      },
      sortNum: {
        label: '排序码：',
        type: 'inputNumber',
        model: '',
        default: 0
      },
      memo: {
        label: '备注：',
        type: 'textarea',
        model: ''
      }
    },
    rules: {
      roleName: '角色名称不能为空！'
    },
    curTitle: [
      {
        value: '分配权限',
        name: 'index1'
      },
      {
        value: '用户列表',
        name: 'index2'
      }
    ],
    tableTitle: [
      {
        label: '部门名称',
        prop: 'dptName',
        width: '200'
      },
      {
        label: '登录代码',
        prop: 'userCode',
        width: '140'
      },
      {
        label: '用户名',
        prop: 'userName',
        width: '140'
      }
    ],
    selectRoleMsg: '请选择子节点！'
  },
  // 用户管理
  userManage: {
    listLi: {
      userName: {
        label: '用户名：',
        type: 'input',
        model: ''
      },
      userCode: {
        label: '登录代码：',
        type: 'input',
        model: ''
      },
      userMd5pwd: {
        label: '密码：',
        type: 'pwd',
        model: ''
        // disabled: true,
      },
      dptName: {
        label: '所属部门：',
        type: 'tree',
        tree: [],
        props: {},
        opendId: [],
        model: ''
      },
      // isRevisePsw: {
      //   label: '是否修改密码：',
      //   type: 'dropDown',
      //   model: 0,
      //   default: 0,
      //   isHide: true, //是否显示
      //   children: ['不修改', '修改'],
      // },
      userEmail: {
        label: '电子邮件：',
        type: 'input',
        model: ''
      },
      userMobile: {
        label: '电话号码：',
        type: 'input',
        model: ''
      },
      userType: {
        label: '用户类型：',
        type: 'dropDown',
        model: 0,
        default: 0,
        children: ['普通用户', '管理员']
      },
      userIsAvailable: {
        label: '是否可用：',
        type: 'dropDown',
        model: 1,
        default: 1,
        children: ['不可用', '可用']
      },
      sortNum: {
        label: '排序码：',
        type: 'inputNumber',
        model: '',
        default: 0
      },
      memo: {
        label: '备注：',
        type: 'textarea',
        model: ''
      }
    },
    rules: {
      userCode: '登录代码不能为空！',
      userName: '用户名不能为空！',
      userMd5pwd: '用户密码不能为空！',
      userMd5pwd2: '用户密码不能超过32位！',
      dptName: '部门名称不能为空！'
    },
    tableTitle: [
      {
        label: '部门名称',
        prop: 'dptName',
        width: '300'
      },
      {
        label: '用户名',
        prop: 'userName',
        width: '300'
      },
      {
        label: '登录代码',
        prop: 'userCode',
        width: '200'
      },
      {
        label: '联系电话',
        prop: 'userMobile',
        width: '200'
      },
      {
        label: '用户类型',
        prop: 'type',
        width: '120'
      },
      {
        label: '备注',
        prop: 'memo',
        width: '300'
      },
      {
        label: '排序码',
        prop: 'sortNum',
        width: '90'
      }
    ],
    searchList: {
      dptName: {
        label: '部门名称：',
        prop: 'dptName',
        type: 'input',
        model: '',
        placeholder: '请输入部门名称'
      },
      userName: {
        label: '用户名：',
        prop: 'userName',
        type: 'input',
        model: '',
        placeholder: '请输入用户名'
      },
      userCode: {
        label: '登录代码：',
        prop: 'userCode',
        type: 'input',
        model: '',
        placeholder: '请输入登录代码'
      }
    },
    addTitle: '添加用户',
    reviseTitle: '修改用户',
    curTitle: '用户管理'
  },
  // 设备协议管理
  deviceProtocol: {
    listLi: {
      prtName: {
        label: '协议名称：',
        type: 'input',
        model: ''
      },
      protocolCode: {
        label: '协议编码：',
        type: 'input',
        model: ''
      },
      prtServerPort: {
        label: '协议端口：',
        type: 'input',
        model: ''
      },
      sortNum: {
        label: '排序码：',
        type: 'inputNumber',
        model: '',
        default: 0
      },
      memo: {
        label: '备注：',
        type: 'textarea',
        model: ''
      }
    },
    rules: {
      prtName: '协议名称不能为空！',
      protocolCode: '协议编码不能为空！',
      prtServerPort: '协议端口必须在1025到65535之间！'
    },
    tableTitle: [
      {
        label: '协议名称',
        prop: 'prtName',
        width: '200'
      },
      {
        label: '协议端口',
        prop: 'prtServerPort',
        width: '160'
      },
      {
        label: '协议编码',
        prop: 'protocolCode',
        width: '200'
      },
      {
        label: '备注',
        prop: 'memo',
        width: '300'
      },
      {
        label: '排序码',
        prop: 'sortNum',
        width: '90'
      }
    ],
    searchList: {},
    addModelTitle: '添加设备协议',
    reviseModelTitle: '修改设备协议',
    curTitle: '设备协议'
  },
  // 设备类型管理
  deviceType: {
    listLi: {
      devtName: {
        label: '设备类型名称：',
        type: 'input',
        model: ''
      },
      devtCode: {
        label: '设备类型编码：',
        type: 'input',
        model: ''
      },
      devtFactory: {
        label: '设备厂家：',
        type: 'input',
        model: ''
      },
      prtId: {
        label: '协议类型：',
        type: 'select1',
        model: '',
        list: [],
        key: {
          value: 'id',
          id: 'prtName'
        }
      },
      frequency: {
        label: '上报频率(秒)：',
        type: 'input',
        model: 30,
        default: 30
      },
      devtDocument: {
        label: '设备相关文档1：',
        type: 'input',
        model: ''
      },
      devtDocument2: {
        label: '设备相关文档2：',
        type: 'input',
        model: ''
      },
      devtDocument3: {
        label: '设备相关文档3：',
        type: 'input',
        model: ''
      },
      sortNum: {
        label: '排序码：',
        type: 'inputNumber',
        model: '',
        default: 0
      },
      memo: {
        label: '备注：',
        type: 'textarea',
        model: ''
      }
    },
    rules: {
      devtCode: '设备类型编码不能为空！',
      devtName: '设备类型名称不能为空！',
      prtId: '协议类型不能为空！',
      devtFactory: '设备厂家不能为空！',
      frequency: '上传频率最小为10的整数！'
    },
    tableTitle: [
      {
        label: '设备类型名称',
        prop: 'devtName',
        width: '200'
      },
      {
        label: '设备类型编码',
        prop: 'devtCode',
        width: '160'
      },
      {
        label: '设备厂家',
        prop: 'devtFactory',
        width: '200'
      },
      {
        label: '上报频率',
        prop: 'frequency',
        width: '160'
      },
      {
        label: '协议名称',
        prop: 'prtName',
        width: '200'
      },
      {
        label: '协议编码',
        prop: 'protocolCode',
        width: '200'
      },
      {
        label: '服务器端口',
        prop: 'prtServerPort',
        width: '100'
      },
      {
        label: '备注',
        prop: 'memo',
        width: '200'
      },
      {
        label: '排序码',
        prop: 'sortNum',
        width: '90'
      }
    ],
    searchList: {},
    addModelTitle: '添加设备类型',
    reviseModelTitle: '修改设备类型',
    curTitle: '设备类型'
  },
  // 车辆管理
  carManage: {
    curTitle: '车辆管理',
    listLi: {
      vehPlateNo: {
        label: '车牌号：',
        type: 'input',
        model: '',
        parentKey: 'gpsVehicleDto',
        disabled: false
      },
      vehTerminalNo: {
        label: '终端ID：',
        type: 'input',
        placeholder: '本机号/终端ID/设备SIM卡号',
        model: '',
        parentKey: 'gpsVehicleDto',
        disabled: false
      },
      deviceTypeId: {
        label: '设备类型：',
        type: 'select1',
        model: '',
        placeholder: '请选择设备类型',
        list: [],
        key: {
          value: 'id',
          id: 'devtName'
        },
        parentKey: 'gpsVehicleDto',
        disabled: false
      },
      dptName: {
        label: '部门名称：',
        type: 'tree',
        model: '',
        disabled: false,
        props: {},
        parentKey: 'gpsVehicleDto',
        tree: []
      },
      vehSimno: {
        label: 'SIM卡号：',
        type: 'input',
        model: '',
        parentKey: 'gpsVehicleDto',
        disabled: false
      },
      vehVin: {
        label: 'VIN号：',
        type: 'input',
        parentKey: 'gpsVehicleDto',
        model: ''
      },
      vehOverSpeed: {
        label: '超速值：',
        type: 'number',
        parentKey: 'gpsVehicleDto',
        model: ''
      },
      vehOilPercent: {
        label: '百公里油耗：',
        type: 'number',
        parentKey: 'gpsVehicleDto',
        model: ''
      },
      vehOilsize: {
        label: '油箱体积：',
        type: 'number',
        parentKey: 'gpsVehicleDto',
        model: ''
      },
      vehOilmark: {
        label: '油箱总刻度：',
        type: 'number',
        parentKey: 'gpsVehicleDto',
        model: ''
      },
      vehDisPercent: {
        label: '里程百分比：',
        type: 'number',
        parentKey: 'gpsVehicleDto',
        model: ''
      },
      vehInstaller: {
        label: '安装人员：',
        type: 'input',
        model: '',
        parentKey: 'gpsVehicleDto',
        disabled: false
      },
      vehBrand: {
        label: '车辆品牌：',
        type: 'input',
        parentKey: 'gpsVehicleDto',
        model: ''
      },
      vehTon: {
        label: '吨位：',
        type: 'number',
        parentKey: 'gpsVehicleDto',
        model: ''
      },
      vehTransno: {
        label: '道路运输证号：',
        type: 'input',
        parentKey: 'gpsVehicleDto',
        model: ''
      },
      masterDriverId: {
        label: '主司机：',
        type: 'select1',
        model: '',
        key: {
          value: 'id',
          id: 'drvName'
        },
        parentKey: 'gpsVehicleDto',
        list: []
      },
      slaveDriverId: {
        label: '副司机：',
        type: 'select1',
        model: '',
        key: {
          value: 'id',
          id: 'drvName'
        },
        parentKey: 'gpsVehicleDto',
        list: []
      },
      vehColor: {
        label: '车牌颜色：',
        type: 'dropDown',
        model: 1,
        default: 1,
        parentKey: 'gpsVehicleDto',
        children: ['蓝色', '黄色']
      },
      loadFactor: {
        label: '载重因子：',
        type: 'number',
        model: '',
        parentKey: 'gpsVehicleDto',
        placeholder: '载重因子=真实净重/车机净重'
      },
      transportationType: {
        label: '运输行业类型：',
        type: 'select1',
        model: '',
        key: {
          value: 'id',
          id: 'text'
        },
        list: [],
        parentKey: 'gpsVehicleDto',
        disabled: false
      },
      vehicleType: {
        label: '车辆类型：',
        type: 'select1',
        model: '',
        key: {
          value: 'id',
          id: 'text'
        },
        list: [],
        parentKey: 'gpsVehicleDto',
        disabled: false
      },
      vehicleNativePlace: {
        label: '车籍地：',
        type: 'input',
        readonly: true,
        model: '',
        parentKey: 'gpsVehicleDto',
        disabled: false
      },
      installationLocation: {
        label: '安装地点：',
        type: 'input',
        parentKey: 'gpsVehicleDto',
        model: ''
      },
      installationTime: {
        label: '安装时间：',
        type: 'date',
        parentKey: 'gpsVehicleDto',
        placeholder: '安装时间',
        model: ''
      },
      stopTime: {
        label: '停止时间：',
        type: 'date',
        parentKey: 'gpsVehicleDto',
        placeholder: '停止时间',
        model: ''
      },
      usingState: {
        label: '使用状态：',
        type: 'select1',
        parentKey: 'gpsVehicleDto',
        model: '已开通',
        key: {
          value: 'value',
          id: 'label'
        },
        list: [
          {
            label: '已开通',
            value: '已开通'
          },
          {
            label: '未开通',
            value: '未开通'
          }
        ]
      },
      installationDescription: {
        label: '安装描述：',
        type: 'textarea',
        parentKey: 'gpsVehicleDto',
        model: ''
      },
      carCaptain: {
        label: '车队长：',
        type: 'input',
        parentKey: 'gpsVehicleDto',
        model: ''
      },
      carCaptainPhone: {
        label: '电话：',
        type: 'input',
        parentKey: 'gpsVehicleDto',
        model: ''
      },
      companyContactPerson: {
        label: '公司联系人：',
        type: 'input',
        parentKey: 'gpsVehicleDto',
        model: ''
      },
      companyContactPersonPhone: {
        label: '电话：',
        type: 'input',
        parentKey: 'gpsVehicleDto',
        model: ''
      },
      emergencyContactPerson: {
        label: '紧急联系人：',
        type: 'input',
        parentKey: 'gpsVehicleDto',
        model: ''
      },
      emergencyContactPersonPhone: {
        label: '电话：',
        type: 'input',
        parentKey: 'gpsVehicleDto',
        model: ''
      },
      driverName: {
        label: '司机：',
        type: 'input',
        parentKey: 'gpsVehicleDto',
        model: ''
      },
      driverPhone: {
        label: '电话：',
        type: 'input',
        parentKey: 'gpsVehicleDto',
        model: ''
      },
      vehExpired: {
        label: '服务到期时间：',
        type: 'date',
        model: '',
        parentKey: 'gpsVehicleDto',
        disabled: false
      },
      vehIsfees: {
        label: '费用是否收取：',
        type: 'dropDown',
        model: 0,
        default: 0,
        children: ['未收取', '收取'],
        parentKey: 'gpsVehicleDto',
        disabled: false
      },
      sortNum: {
        label: '排序码：',
        type: 'inputNumber',
        model: 0,
        parentKey: 'gpsVehicleDto',
        default: 0
      },
      memo: {
        label: '备注：',
        type: 'textarea',
        parentKey: 'gpsVehicleDto',
        model: ''
      },
      firstGuaranteeInterval: {
        label: '首保周期：',
        type: 'number',
        append: '月',
        placeholder: '',
        parentKey: 'gpsMaintenanceDto',
        model: ''
      },
      firstGuaranteeDate: {
        label: '首保日期：',
        type: 'date',
        placeholder: '',
        parentKey: 'gpsMaintenanceDto',
        model: ''
      },
      firstGuaranteeMileage: {
        label: '首保里程：',
        type: 'number',
        append: 'Km',
        placeholder: '',
        parentKey: 'gpsMaintenanceDto',
        model: ''
      },
      maintenanceDate: {
        label: '保养日期：',
        type: 'date',
        placeholder: '',
        parentKey: 'gpsMaintenanceDto',
        model: ''
      },
      maintenanceMileage: {
        label: '保养里程：',
        type: 'number',
        append: 'Km',
        placeholder: '',
        parentKey: 'gpsMaintenanceDto',
        model: ''
      },
      maintenanceInterval: {
        label: '保养间隔：',
        type: 'input',
        append: '月',
        placeholder: '',
        parentKey: 'gpsMaintenanceDto',
        model: ''
      },
      maintenanceTimes: {
        label: '保养次数：',
        type: 'number',
        prepend: '第',
        append: '次',
        placeholder: '',
        parentKey: 'gpsMaintenanceDto',
        model: ''
      },
      maintenanceContent: {
        label: '保养内容：',
        type: 'textarea',
        placeholder: '',
        parentKey: 'gpsMaintenanceDto',
        model: ''
      },
      remark1: {
        label: '备注：',
        type: 'textarea',
        placeholder: '',
        parentKey: 'gpsMaintenanceDto',
        model: ''
      },
      insuranceCompany: {
        label: '保险公司：',
        type: 'input',
        placeholder: '',
        parentKey: 'gpsInsuranceDto',
        model: ''
      },
      registrationDate: {
        label: '登记日期：',
        type: 'date',
        placeholder: '请选择登记日期',
        parentKey: 'gpsInsuranceDto',
        model: ''
      },
      insuranceType: {
        label: '险种明细：',
        type: 'input',
        placeholder: '',
        parentKey: 'gpsInsuranceDto',
        model: ''
      },
      reminderDate: {
        label: '提醒日期设置：',
        type: 'input',
        prepend: '提前',
        append: '天',
        placeholder: '',
        parentKey: 'gpsInsuranceDto',
        model: ''
      },
      renewalCompany: {
        label: '续保公司：',
        type: 'input',
        placeholder: '',
        parentKey: 'gpsInsuranceDto',
        model: ''
      },
      renewalTimes: {
        label: '续保次数：',
        type: 'number',
        prepend: '第',
        append: '次',
        placeholder: '',
        parentKey: 'gpsInsuranceDto',
        model: ''
      },
      renewalType: {
        label: '续保险种：',
        type: 'input',
        placeholder: '',
        parentKey: 'gpsInsuranceDto',
        model: ''
      },
      totalSum: {
        label: '总金额：',
        type: 'number',
        append: '元',
        placeholder: '',
        parentKey: 'gpsInsuranceDto',
        model: ''
      },
      remark2: {
        label: '备注：',
        type: 'textarea',
        placeholder: '',
        parentKey: 'gpsInsuranceDto',
        model: ''
      },
      isOpen: {
        label: '是否开启风控：',
        type: 'dropDown',
        model: 0,
        default: 0,
        parentKey: 'gpsRiskManagementDto',
        children: ['关闭', '开启']
      },
      bindProvincialAlarm: {
        label: '绑定出省报警：',
        model: '',
        type: 'select1',
        model: '',
        list: [],
        key: {
          value: 'id',
          id: 'name'
        },
        parentKey: 'gpsRiskManagementDto',
        disabled: false
      },
      homeAddress: {
        label: '家庭地址：',
        type: 'input',
        placeholder: '',
        readonly: true,
        parentKey: 'gpsRiskManagementDto',
        model: ''
      },
      companyAddress: {
        label: '公司地址：',
        type: 'input',
        placeholder: '',
        readonly: true,
        parentKey: 'gpsRiskManagementDto',
        model: ''
      },
      remark3: {
        label: '备注：',
        type: 'textarea',
        placeholder: '',
        parentKey: 'gpsRiskManagementDto',
        model: ''
      }
    },
    listTitle: {
      mainInfo: {
        title: '车辆主要信息',
        isAnimation: false
      },
      basicsInfo: {
        title: '车辆基础信息',
        isAnimation: true,
        isSwitch: false
      },
      contactInfo: {
        title: '联系信息',
        isAnimation: true,
        isSwitch: false
      },
      otherInfo: {
        title: '其他信息',
        isAnimation: true,
        isSwitch: false
      },
      gpsMaintenanceDto: {
        title: '保养信息',
        isAnimation: true,
        isSwitch: false
      },
      gpsInsuranceDto: {
        title: '保险信息',
        isAnimation: true,
        isSwitch: false
      },
      gpsRiskManagementDto: {
        title: '风控设置',
        isAnimation: true,
        isSwitch: false
      },
      channel: {
        title: '通道参数设置',
        name: '通道参数',
        label: '通道数量：',
        isAnimation: true,
        isSwitch: false,
        isShow: false,
        model: 0
      }
    },
    channelData: {
      name: {
        label: '名称：',
        width: '220px',
        model: ''
      },
      type: {
        label: '型号：',
        width: '220px',
        model: '模拟摄像头',
        list: [
          {
            label: '模拟摄像头',
            value: '模拟摄像头'
          },
          {
            label: '数字摄像头',
            value: '数字摄像头'
          },
          {
            label: '传感器',
            value: '传感器'
          }
        ]
      }
    },
    rules: {
      vehPlateNo: '请输入车牌号！',
      vehTerminalNo: '终端ID必须11位的数字！',
      deviceTypeId: '设备类型ID不能为空！',
      dptName: '请选择部门名称！',
      vehSimno: '请输入SIM卡号！',
      vehOilmark: '请输入正确的油箱刻度！',
      vehTon: '请输入正确的吨位！',
      testNum: '必须是数字！'
    },
    addTitle: '添加车辆',
    reviseTitle: '修改车辆',
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '150'
      },
      {
        label: '终端ID',
        prop: 'vehTerminalNo',
        width: '150'
      },
      {
        label: 'VIN号',
        prop: 'vehVin',
        width: '180'
      },
      {
        label: 'SIM卡号',
        prop: 'vehSimno',
        click: true,
        width: '160'
      },
      {
        label: '设备类型',
        prop: 'deviceTypeName',
        width: '200'
      },
      {
        label: '部门名称',
        prop: 'dptName',
        width: '250'
      },
      
      {
        label: '车辆登记时间',
        prop: 'creatTime',
        width: '160'
      },
      {
        label: '服务到期时间',
        prop: 'vehExpired',
        width: '160'
      },
      {
        label: '最后定位时间',
        prop: 'lastLocationTime',
        width: '160'
      },
      {
        label: '安装时间',
        prop: 'installationTime',
        width: '160'
      },
      {
        label: '停止时间',
        prop: 'stopTime',
        width: '160'
      },
      {
        label: '使用状态',
        prop: 'usingState',
        width: '160'
      },
      {
        label: '备注',
        prop: 'memo',
        width: '180'
      }
    ],
    tableMoreConList: [
      {
        label: '车牌号',
        prop: 'vehPlateNo'
      },
      {
        label: '终端ID',
        prop: 'vehTerminalNo'
      },
      {
        label: '设备类型',
        prop: 'deviceTypeName'
      },
      {
        label: '部门名称',
        prop: 'dptName'
      },
      {
        label: 'SIM卡号',
        prop: 'vehSimno'
      },
      {
        label: 'VIN号',
        prop: 'vehVin'
      },
      {
        label: '车牌颜色',
        prop: 'color'
      },
      {
        label: '车辆类型',
        prop: 'vehType'
      },
      {
        label: '超速值',
        prop: 'vehOverSpeed'
      },
      {
        label: '百公里油耗',
        prop: 'vehOilPercent'
      },
      {
        label: '邮箱体积(升)',
        prop: 'vehOilsize'
      },
      {
        label: '油箱总刻度',
        prop: 'vehOilmark'
      },
      {
        label: '里程百分比',
        prop: 'vehDisPercent'
      },
      {
        label: '安装人员',
        prop: 'vehInstaller'
      },
      {
        label: '是否收费',
        prop: 'isfees'
      },
      {
        label: '车辆品牌',
        prop: 'vehBrand'
      },
      {
        label: '吨位',
        prop: 'vehTon'
      },
      {
        label: '车辆登记时间',
        prop: 'creatTime'
      },
      {
        label: '服务费到期时间',
        prop: 'vehExpired'
      },
      {
        label: '最后定位时间',
        prop: 'lastLocationTime'
      },
      {
        label: '道路运输证号',
        prop: 'vehTransno'
      },
      {
        label: '主司机名',
        prop: 'masterDriverName'
      },
      {
        label: '副司机名',
        prop: 'slaveDriverName'
      },
      {
        label: '排序码',
        prop: 'sortNum'
      },
      {
        label: '备注',
        prop: 'memo'
      },

      {
        label: '定位附加信息',
        prop: 'extension'
      },
      {
        label: '车辆附加信息',
        prop: 'sensorExtension'
      },

      {
        label: '首保周期',
        prop: 'firstGuaranteeInterval'
      },
      {
        label: '首保日期',
        prop: 'firstGuaranteeDate'
      },
      {
        label: '首保里程',
        prop: 'firstGuaranteeMileage'
      },
      {
        label: '保养日期',
        prop: 'maintenanceDate'
      },
      {
        label: '保养里程',
        prop: 'maintenanceMileage'
      },
      {
        label: '保养间隔',
        prop: 'maintenanceInterval'
      },
      {
        label: '保养次数',
        prop: 'maintenanceTimes'
      },
      {
        label: '保养内容',
        prop: 'maintenanceContent'
      },
      {
        label: '保养备注',
        prop: 'maintenanceMemo'
      },

      {
        label: '保险公司',
        prop: 'insuranceCompany'
      },
      {
        label: '注册时间',
        prop: 'registrationDate'
      },
      {
        label: '险种类型',
        prop: 'insuranceType'
      },
      {
        label: '提醒保险日期',
        prop: 'reminderDate'
      },
      {
        label: '续保次数',
        prop: 'renewalTimes'
      },
      {
        label: '续保公司',
        prop: 'renewalCompany'
      },
      {
        label: '续保险种',
        prop: 'renewalType'
      },
      {
        label: '总金额',
        prop: 'totalSum'
      },
      {
        label: '保险备注',
        prop: 'renewalMemo'
      },

      {
        label: '绑定出省报警',
        prop: 'bindProvincialAlarm'
      },
      {
        label: '家庭地址',
        prop: 'homeAddress'
      },
      {
        label: '公司地址',
        prop: 'companyAddress'
      },
      {
        label: '风控备注',
        prop: 'RiskMemo'
      }
    ],
    searchList: {
      search: {
        label: '搜索：',
        prop: 'search',
        type: 'selectSearch',
        width: '200px !important',
        model: '',
        placeholder: '车牌号/终端号/VIN/SIM',
        list: [],
        loading: false,
        key: {
          value: 'val',
          id: 'vehTerminalNo'
        }
      },
      dptIds: {
        label: '部门：',
        prop: 'dptIds',
        type: 'tree',
        width: '200px !important',
        model: '',
        placeholder: '请选择部门',
        showcheck: true,
        name: 'dptName',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'dptName'
        }
      },
      type: {
        label: '设备类型：',
        prop: 'type',
        type: 'selectAll',
        model: '',
        width: '200px !important',
        placeholder: '请选择设备类型',
        list: [],
        key: {
          label: 'devtName',
          value: 'id'
        }
      },
      vehExpired: {
        label: '到期时间：',
        prop: 'vehExpired',
        placeholder: '请选择到期时间',
        type: 'date',
        model: ''
      }
    },
    riskMsg: [
      {
        label: '二押点：',
        msg: '防止车辆在二手抵押点停留，增加风险预防。'
      },
      {
        label: '绑定省市：',
        msg: '绑定省市区域后，该车辆驶出所绑定的区域，触发超出区域报警。'
      },
      {
        label: '设置经常停留：',
        msg: '当车辆连续三天不经过您设置的两点（范围：1000米），系统会自动推送车辆异常停留报警。'
      },
      {
        label: '注意事项：',
        msg: '风控设置只对指定本设备有效。'
      }
    ],
    uploadInfo: {
      msgMenu: '请选择部门',
      msgDeviceType: '请选择设备类型',
      msgFile: '请选择要上传的文件',
      msgSuccess: '已成功上传',
      unit: '条',
      max4M: '要上传的文件不能大于4M',
      tip: '请按照模板内容的格式编写文件，然后进行上传',
      title: '提示',
      downTemplate: '下载模板',
      upload: '上传文件',
      clickUpload: '点击上传',
      drapUpload: '将文件拖到此处，或',
      msgXlsx: '只能上传xlsx文件，大小不超过4M'
    }
  },
  // 司机管理
  driverManage: {
    curTitle: '司机管理',
    listLi: {
      drvName: {
        label: '姓名：',
        type: 'input',
        placeholder: '请输入姓名',
        model: ''
      },
      drvGender: {
        label: '性别：',
        type: 'dropDown',
        model: 1,
        default: 1,
        children: ['女', '男']
      },
      drvMobile: {
        label: '手机号：',
        type: 'input',
        model: ''
      },
      drvIdCards: {
        label: '身份证号：',
        type: 'input',
        model: ''
      },
      fileImage: {
        label: '司机照片：',
        type: 'upload',
        model: [],
        default: []
      },
      sortNum: {
        label: '排序码：',
        type: 'inputNumber',
        model: '',
        default: 0
      },
      memo: {
        label: '备注：',
        type: 'textarea',
        model: ''
      }
    },
    rules: {
      drvName: '姓名不能为空！',
      drvIdCards: '身份证号格式错误！'
    },
    addTitle: '添加司机',
    reviseTitle: '修改司机',
    tableTitle: [
      {
        label: '姓名',
        prop: 'drvName',
        width: '200'
      },
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '200',
        click: true
      },
      {
        label: '性别',
        prop: 'gender',
        width: '200'
      },
      {
        label: '手机号',
        prop: 'drvMobile',
        width: '200'
      },
      {
        label: '身份证号',
        prop: 'drvIdCards',
        width: '200'
      },
      {
        label: '排序码',
        prop: 'sortNum',
        width: '200'
      },
      {
        label: '备注',
        prop: 'memo',
        width: '200'
      }
    ],
    searchList: {
      driveName: {
        label: '司机姓名：',
        type: 'input',
        model: '',
        placeholder: '输入司机姓名',
        width: '160px'
      }
    }
  },
  // 车辆轨迹
  carAnalysis: {
    controller: {
      startPlay: '开始播放',
      stopPlay: '暂停播放',
      replay: '重新播放',
      zeroName: '速度大于0',
      containBaseStationPosition: '精确定位',
      douglasPeucker: '抽稀'
    },
    infoWin: {
      speedUnit: 'Km/h',
      speed: '速度：',
      curMileage: '今日里程：',
      mileageUnit: 'Km',
      gpsTime: '时间：',
      state: '状态：',
      gpsAddress: '地址：',
      driverName: '司机：',
      trackReplay: '轨迹回放',
      accOpen: 'Acc开',
      accShut: 'Acc关',
      localtion: '已定位',
      noLocaltion: '未定位',
      sendCommand: '发送指令',
      tyreInfo: '轮胎情况：',
      temperature: '温度：',
      batteryVoltage: '电压：',
      hasPower: '充电情况：',
      charging: '正在充电',
      noCharge: '未充电',
      electricQuantity: '电量：',
      temperatureDetail: '温度明细',
      electricQuantityDetail: '电量明细',
      load: '载重明细',
      queryDetails: '查看详情',
      carMonitor: '实时监控',
      realTimeVio: '实时视频',
      tyrePressure: '胎压',
      car: '车辆：',
      stopStartTime: '停车开始时间：',
      stopEndTime: '停车结束时间：',
      stopTime: '停留时长：',
      positionType_1: '(LBS)',
      positionType_2: '(GPS)',
      run: '运行报表',
      contactInfo: '联系信息'
    },
    stopInfo: [
      {
        key: 'stopStartTime',
        name: '停车开始时间：'
      },
      {
        key: 'stopEndTime',
        name: '停车结束时间：'
      },
      {
        key: 'stopTime',
        name: '停留时长：'
      },
      {
        key: 'address',
        name: '地址：'
      }
    ],
    baseInfo: [
      {
        key: 'vehTerminalNo',
        name: '设备号：'        
      },
      {
        key: 'gpsSpeed',
        name: '速度：',
        unit: 'Km/h'
      },
      {
        key: 'gpsDayDistance',
        name: '今日里程：',
        unit: 'Km'
      },
      {
        key: 'gpstime',
        name: '时间：'
      },
      {
        key: 'driver',
        name: '司机：',
        click: true,
        required: true
      },
      {
        key: 'state',
        name: '状态：'
      },
      {
        key: 'address',
        name: '地址：'
      }
    ],
    speedometer: {
      normal: '超速',
      overspeed: '正常'
    },
    tableTitle1: [
      {
        label: '定位时间',
        prop: 'gpstime',
        width: '160'
      },
      {
        label: '速度(Km/h)',
        prop: 'gpsSpeed',
        width: '120'
      },
      {
        label: '当日里程(Km)',
        prop: 'gpsDayDistance',
        width: '120'
      },
      {
        label: '状态',
        prop: 'state',
        width: '160'
      },
      {
        label: '位置',
        prop: 'address',
        width: '240'
      },
      {
        label: '经度',
        prop: 'gpsWebLng',
        width: '160'
      },
      {
        label: '纬度',
        prop: 'gpsWebLat',
        width: '160'
      }
    ],
    tableTitle2: [
      {
        label: '停车开始时间',
        prop: 'stopStartTime',
        width: '160'
      },
      {
        label: '停车结束时间',
        prop: 'stopEndTime',
        width: '160'
      },
      {
        label: '停车时长',
        prop: 'stopTime',
        width: '160'
      },
      {
        label: '位置',
        prop: 'address',
        width: '240'
      },
      {
        label: '经度',
        prop: 'gpsWebLng',
        width: '160'
      },
      {
        label: '纬度',
        prop: 'gpsWebLat',
        width: '160'
      }
    ],
    batteryPower: [
      {
        key: 'convertBatteryVoltage',
        name: '电压：',
        unit: 'V'
      },
      {
        key: 'batteryPower',
        name: '电量：',
        unit: ''
      }
    ],
    temperature: [
      {
        key: 'temperature',
        name: '温度：',
        unit: '℃'
      }
    ]
  },
  // 录像回放
  playVideo: {
    curTitle: '录像回放',
    tableTitle: [
      {
        label: '操作',
        prop: 'act',
        act: true,
        width: '100'
      },
      {
        label: '上传',
        prop: 'up',
        act: true,
        icon: 'el-icon-upload2',
        width: '100'
      },
      {
        label: '时间',
        prop: 'time',
        width: '260'
      },
      {
        label: '时长',
        prop: 'duration',
        width: '120'
      },
      {
        label: '类型',
        prop: 'videoType',
        width: '100'
      },
      {
        label: '终端设备',
        prop: 'devIdno',
        width: '140'
      },
      {
        label: '通道',
        prop: 'newChn',
        width: '80'
      },
      {
        label: '位置',
        prop: 'ioc',
        width: '160'
      },
      {
        label: '大小(MB)',
        prop: 'len',
        width: '120'
      },
      {
        label: '文件',
        prop: 'file',
        width: '300'
      }
    ],
    downTableTitle: [
      {
        label: '下载',
        prop: 'down',
        act: true,
        icon: 'el-icon-download',
        width: '100'
      },
      {
        label: '时间',
        prop: 'time',
        width: '260'
      },
      {
        label: '终端设备',
        prop: 'devIdno',
        width: '120'
      },
      {
        label: '通道',
        prop: 'newChn',
        width: '100'
      },
      {
        label: '大小(MB)',
        prop: 'len',
        width: '100'
      },
      {
        label: '位置',
        prop: 'ioc',
        width: '100'
      },
      {
        label: '文件',
        prop: 'file',
        width: '300'
      }
    ],
    upTableTitle: [
      {
        label: '终端设备',
        prop: 'devIDNO',
        width: '120'
      },
      {
        label: '通道号',
        prop: 'newChn',
        width: '100'
      },
      {
        label: '任务流水号',
        prop: 'sequence',
        width: '100'
      },
      {
        label: '文件开始时间',
        prop: 'fileBeg',
        width: '160'
      },
      {
        label: '文件结束时间',
        prop: 'fileEnd',
        width: '160'
      },
      {
        label: '任务生成时间',
        prop: 'taskS',
        width: '160'
      },
      {
        label: '任务结束时间',
        prop: 'taskE',
        width: '160'
      }
    ],
    otherInfo: {
      devIdno: '终端设备',
      stoSer: '存储服务器',
      upSer: '下载服务器',
      alarm: '报警',
      rule: '常规'
    }
  },
  // 车辆监控
  allMonitor: {
    listLi: {
      markName: {
        label: '标注名：',
        type: 'input',
        model: ''
      },
      markPointType: {
        label: '标注点类型：',
        type: 'select1',
        model: '',
        isHide: false,
        disabled: false,
        key: {
          value: 'value',
          id: 'label'
        },
        list: [
          {
            label: '修理点',
            value: '1'
          },
          {
            label: '加油站',
            value: '2'
          },
          {
            label: '停车厂',
            value: '3'
          },
          {
            label: '兴趣点',
            value: '4'
          },
          {
            label: '客户点',
            value: '5'
          }
        ]
      },
      sortNum: {
        label: '排序码：',
        type: 'inputNumber',
        model: '',
        default: 0
      },
      memo: {
        label: '备注：',
        type: 'textarea',
        model: ''
      }
    },
    relationForm: {
      fenceName: {
        label: '规则名称：',
        type: 'input',
        model: '',
        placeholder: '请输入规则名称'
      },
      fenceRule: {
        label: '类型：',
        type: 'select1',
        placeholder: '请选择',
        disabled: false,
        model: '',
        key: {
          value: 'value',
          id: 'label'
        },
        list: [
          {
            label: '进入围栏',
            value: '10001'
          },
          {
            label: '出围栏',
            value: '10002'
          },
          {
            label: '围栏内停车',
            value: '10003'
          },
          {
            label: '围栏内超速',
            value: '10004'
          },
          {
            label: '线路',
            value: '10005'
          }
        ]
      },
      fenceVehids: {
        label: '车牌：',
        type: 'tree',
        model: '',
        showcheck: true,
        placeholder: '请选择车辆',
        tree: [],
        opendId: [],
        props: {
          children: 'child',
          label: 'name'
        }
      },
      fenceStartTime: {
        label: '生效时间：',
        type: 'fixedTime',
        pickerOptions: {
          start: '00:00',
          step: '01:00',
          end: '22:00'
        },
        default: '00:00',
        model: '00:00'
      },
      sortNum: {
        label: '排序码：',
        type: 'inputNumber',
        model: '',
        default: 0
      },
      fenceEndTime: {
        label: '至：',
        type: 'fixedTime',
        pickerOptions: {
          start: '01:00',
          step: '01:00',
          end: '23:00'
        },
        default: '23:00',
        model: '23:00'
      },
      memo: {
        label: '备注：',
        type: 'textarea',
        model: ''
      },
      fenceLimitValue: {
        label: '限定值：',
        type: 'input',
        isHide: false,
        model: '',
        placeholder: '偏离距离（米）'
      }
    },
    rules: {
      markName: '标注名不能为空！',
      fenceName: '规则名称不能为空！',
      fenceRule: '类型不能为空！'
    },
    sendCommandTitle: '发送指令',
    sendCommandVehTerminalNo: '终端号：',
    sim: 'sim：',
    sendCommandContext: '内容：',
    addTitle: '添加标注',
    relationTitle: '编辑并关联车辆',
    reviseTitle: '修改标注',
    relation: '关联',
    relationTip: '绘制完成',
    placeholder1003: '停车时长（分钟）',
    placeholder1004: '最高速度（Km/h）',
    placeholder1005: '偏离距离（米）',
    tabs: [
      {
        label: '点',
        name: 'point',
        disabled: false,
        check: false
      },
      {
        label: '线',
        name: 'line',
        disabled: true,
        check: false
      },
      {
        label: '面',
        name: 'area',
        disabled: true,
        check: false
      }
    ],
    sideTabsTitle: {
      all: '全部',
      alarm: '告警',
      run: '运行',
      stop: '停车',
      offline: '离线',
      share: '共享',
      msgShareShow: '点击显示共享车辆',
      msgShareHide: '点击过滤共享车辆'
    },
    alaPop: {
      alaContent: '报警内容：',
      alaTime: '报警时间：',
      alaCount: '报警次数：',
      alaDuration: '持续时间：',
      carNum: '车牌号码：',
      msgId: '消息ID：',
      result: '结果：',
      alaBtn: '报警查询'
    },
    videoInfo: {
      preview: '实时预览',
      play: '启动视频',
      stop: '停止视频',
      videoMsg: '您的浏览器不支持 video 标签！',
      page1: '1画面',
      page4: '4画面',
      page9: '9画面',
      dropdown1: [
        {
          val: '流畅性好',
          label: '0'
        },
        {
          val: '实时性好',
          label: '1'
        }
      ],
      dropdown2: [
        {
          val: '启动视频',
          label: 'play'
        },
        {
          val: '启动所有视频',
          label: 'playAll'
        }
      ],
      dropdown3: [
        {
          val: '停止视频',
          label: 'stop'
        },
        {
          val: '停止所有视频',
          label: 'stopAll'
        },
        {
          val: '清除数据',
          label: 'clear'
        },
        {
          val: '清除所有数据',
          label: 'clearAll'
        }
      ]
    },
    alarmForm: {
      plateNo: {
        label: '车牌号：',
        model: ''
      },
      vehTerminalNo: {
        label: '终端号：',
        model: ''
      },
      context: {
        label: '内容：',
        model: ''
      }
    },
    runTableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '终端号',
        prop: 'vehTerminalNo',
        width: '120'
      },
      {
        label: '速度(Km/h)',
        prop: 'gpsSpeed',
        width: '110',
        sort: true
      },
      {
        label: '里程(Km)',
        prop: 'gpsDayDistance',
        width: '110',
        sort: true
      },
      {
        label: 'Acc',
        prop: 'accState',
        width: '80'
      },
      {
        label: '定位时间',
        prop: 'gpstime',
        width: '160',
        sort: true
      },
      {
        label: '经度',
        prop: 'gpsWebLng',
        width: '120'
      },
      {
        label: '纬度',
        prop: 'gpsWebLat',
        width: '120'
      },
      {
        label: '定位类型',
        prop: 'locationType',
        width: '140'
      },
      {
        label: '方向',
        prop: 'gpsDirect',
        width: '100'
      }
    ],
    newrunTableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '终端号',
        prop: 'vehTerminalNo',
        width: '120'
      },
      {
        label: '速度(Km/h)',
        prop: 'gpsSpeed',
        width: '110',
        sort: true
      },
      {
        label: '里程(Km)',
        prop: 'gpsDayDistance',
        width: '110',
        sort: true
      },
      {
        label: 'Acc',
        prop: 'accState',
        width: '80'
      },
      {
        label: '定位时间',
        prop: 'gpstime',
        width: '160',
        sort: true
      },
      {
        label: '地址',
        prop: 'address',
        width: '120'
      },
      // {
      //   label: '经度',
      //   prop: 'gpsWebLng',
      //   width: '120'
      // },
      // {
      //   label: '纬度',
      //   prop: 'gpsWebLat',
      //   width: '120'
      // },
      {
        label: '定位类型',
        prop: 'locationType',
        width: '140'
      },
      {
        label: '方向',
        prop: 'gpsDirect',
        width: '100'
      }
    ],
    alarmTableTitle: [
      {
        label: '部门',
        prop: 'dptName',
        width: '200'
      },
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '报警类型',
        prop: 'alarmDisplay',
        width: '180'
      },
      {
        label: '报警来源',
        prop: 'alarmCategory',
        width: '160'
      },
      {
        label: '速度(Km/h)',
        prop: 'gpsSpeed',
        width: '120'
      },
      {
        label: '报警开始时间',
        prop: 'gpsAlarmStartTime',
        width: '180',
        sort: true
      },
      {
        label: '报警结束时间',
        prop: 'alaTime',
        width: '180',
        sort: true
      },
      {
        label: '持续时间',
        prop: 'alarmDuration',
        width: '180',
        sort: true
      }
    ],
    traffic: {
      title: '实时路况',
      state: [
        {
          color: 'red',
          text: '拥挤'
        },
        {
          color: '#CC9900',
          text: '缓行'
        },
        {
          color: 'green',
          text: '畅通'
        }
      ],
      uptime: '更新时间：'
    },
    contactInfo: [
      {
        label: '司机姓名：',
        key: 'driveName'
      },
      {
        label: '电话号码：',
        key: 'driveMobile'
      },
      {
        label: '车队长：',
        key: 'carCaptain'
      },
      {
        label: '车队长电话：',
        key: 'carCaptainPhone'
      },
      {
        label: '公司联系人：',
        key: 'companyContactPerson'
      },
      {
        label: '公司联系人电话：',
        key: 'companyContactPersonPhone'
      },
      {
        label: '紧急联系人：',
        key: 'emergencyContactPerson'
      },
      {
        label: '紧急联系人电话：',
        key: 'emergencyContactPersonPhone'
      }
    ]
  },
  // 模块操作
  modelManage: {
    curTitle: '模块操作'
  },
  // 报警管理
  alarmManage: {
    tableTitle: [
      {
        label: '部门',
        prop: 'dptName',
        width: '200'
      },
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '处理状态',
        prop: 'alaStateText',
        isButton: true,
        width: '140'
      },
      {
        label: '报警类型',
        prop: 'alarmDisplay',
        click: true,
        width: '180'
      },
      {
        label: '报警来源',
        prop: 'alarmCategory',
        width: '160'
      },
      {
        label: '开始位置',
        prop: 'startAddress',
        click: true,
        width: '100'
      },
      {
        label: '结束位置',
        prop: 'endAddress',
        click: true,
        width: '100'
      },
      {
        label: '报警开始时间',
        prop: 'gpsAlarmStartTime',
        width: '180',
        sort: true
      },
      {
        label: '报警结束时间',
        prop: 'alaTime',
        width: '180',
        sort: true
      },
      {
        label: '持续时间',
        prop: 'alarmDuration',
        width: '180',
        sort: true
      },
      // {
      //   label: '报警信息',
      //   prop: 'alarmDisplay',
      //   width: '320',
      // },
      {
        label: '处理时间',
        prop: 'alaHandleTime',
        width: '180'
      },
      {
        label: '处理人',
        prop: 'alarmHandler',
        width: '180'
      },
      {
        label: '处理意见',
        prop: 'alarmHandlerContent',
        width: '320'
      }
    ],
    title: '报警信息',
    searchList: {
      vehTerminalNo: '车牌号：',
      startEndTime: '报警时间：',
      to: '至',
      alarmType: '报警类型：',
      alarmStatus: '报警状态：',
      duration: '持续时间(秒)：'
    },
    handleForm: {
      handleTitle: '报警处理',
      vehTerminalNo: '车牌号：',
      alarmInfo: '报警信息：',
      mome: '处理意见：',
      btnCancel: '取消',
      btnOk: '确定'
    },
    deleteMsg: '请选择一条记录！'
  },
   // 停车报表
   parkInfoNew: {
    curTitle: '停车报表',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        placeholder: '请选择车牌号',
        tree: [],
        showcheck: true,
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      duration: {
        label: '停车时间：',
        type: 'select1',
        model: 300,
        default: 300,
        placeholder: '请选择停车时间',
        key: {
          value: 'value',
          id: 'label'
        },
        list: [
          {
            label: '5分钟',
            value: 300
          },
          {
            label: '10分钟',
            value: 600
          },
          {
            label: '15分钟',
            value: 900
          },
          {
            label: '20分钟',
            value: 1200
          },
          {
            label: '25分钟',
            value: 1500
          },
          {
            label: '30分钟',
            value: 1800
          },
          {
            label: '35分钟',
            value: 2100
          },
          {
            label: '40分钟',
            label: 2400
          },
          {
            label: '45分钟',
            value: 2700
          },
          {
            label: '50分钟',
            value: 3000
          },
          {
            label: '55分钟',
            value: 3300
          },
          {
            label: '60分钟',
            value: 3600
          }
        ]
      },
      accClosed: {
        label: '是否熄火：',
        type: 'select1',
        width: '240px',
        model: '',
        default: '',
        placeholder: '请选择熄火状态',
        key: {
          value: 'value',
          id: 'label'
        },
        list: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '熄火',
            value: 1
          },
          {
            label: '未熄火',
            value: 0
          }
        ]
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '停车时间',
        prop: 'sTime',
        width: '160',
        sort: true
      },
      {
        label: '停车开始时间',
        prop: 'stopStartTime',
        width: '160',
        sort: true
      },
      {
        label: '停车结束时间',
        prop: 'stopEndTime',
        width: '160',
        sort: true
      },
      {
        label: '是否熄火',
        prop: 'accClosedDisplay',
        width: '160',
        sort: true
      },
      {
        label: '停车位置',
        prop: 'stopPointAddress',
        width: '240'
      },
      {
        label: '停车地点',
        prop: 'address',
        click: true,
        width: '100'
      }
    ]
  },
  // 停车报表
  parkInfo: {
    curTitle: '停车报表',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        placeholder: '请选择车牌号',
        tree: [],
        showcheck: true,
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      duration: {
        label: '停车时间：',
        type: 'select1',
        model: 300,
        default: 300,
        placeholder: '请选择停车时间',
        key: {
          value: 'value',
          id: 'label'
        },
        list: [
          {
            label: '5分钟',
            value: 300
          },
          {
            label: '10分钟',
            value: 600
          },
          {
            label: '15分钟',
            value: 900
          },
          {
            label: '20分钟',
            value: 1200
          },
          {
            label: '25分钟',
            value: 1500
          },
          {
            label: '30分钟',
            value: 1800
          },
          {
            label: '35分钟',
            value: 2100
          },
          {
            label: '40分钟',
            label: 2400
          },
          {
            label: '45分钟',
            value: 2700
          },
          {
            label: '50分钟',
            value: 3000
          },
          {
            label: '55分钟',
            value: 3300
          },
          {
            label: '60分钟',
            value: 3600
          }
        ]
      },      
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '停车时间',
        prop: 'sTime',
        width: '160',
        sort: true
      },
      {
        label: '停车开始时间',
        prop: 'stopStartTime',
        width: '160',
        sort: true
      },
      {
        label: '停车结束时间',
        prop: 'stopEndTime',
        width: '160',
        sort: true
      },
      {
        label: '停车位置',
        prop: 'stopPointAddress',
        width: '240'
      },
      {
        label: '停车地点',
        prop: 'address',
        click: true,
        width: '100'
      }
    ]
  },
  // 停车未熄火
  parkNoFlameout: {
    curTitle: '停车未熄火',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        placeholder: '请选择车牌号',
        tree: [],
        showcheck: true,
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      duration: {
        label: '停车时间：',
        type: 'select1',
        model: 300,
        default: 300,
        placeholder: '请选择停车时间',
        key: {
          value: 'value',
          id: 'label'
        },
        list: [
          {
            label: '5分钟',
            value: 300
          },
          {
            label: '10分钟',
            value: 600
          },
          {
            label: '15分钟',
            value: 900
          },
          {
            label: '20分钟',
            value: 1200
          },
          {
            label: '25分钟',
            value: 1500
          },
          {
            label: '30分钟',
            value: 1800
          },
          {
            label: '35分钟',
            value: 2100
          },
          {
            label: '40分钟',
            value: 2400
          },
          {
            label: '45分钟',
            value: 2700
          },
          {
            label: '50分钟',
            value: 3000
          },
          {
            label: '55分钟',
            value: 3300
          },
          {
            label: '60分钟',
            value: 3600
          }
        ]
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '停车时间',
        prop: 'sTime',
        width: '160',
        sort: true
      },
      {
        label: '停车开始时间',
        prop: 'stopStartTime',
        width: '160',
        sort: true
      },
      {
        label: '停车结束时间',
        prop: 'stopEndTime',
        width: '160',
        sort: true
      },
      {
        label: '停车位置',
        prop: 'stopPointAddress',
        width: '240'
      },
      {
        label: '停车地点',
        prop: 'address',
        click: true,
        width: '100'
      }
    ]
  },
  // 里程报表
  mileage: {
    curTitle: '里程报表',
    tip: {
      tableTip: '这是实时计算的没有该值'
    },
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        showcheck: true,
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '日期范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '日期',
        prop: 'mileageDate',
        width: '120'
      },
      {
        label: '运行时长',
        prop: 'runTime',
        width: '160',
        sort: true
      },
      {
        label: '停车时间',
        prop: 'stopTime',
        width: '160',
        sort: true
      },
      {
        label: '平台里程(Km)',
        prop: 'mileage',
        width: '120',
        sort: true
      },
      {
        label: '设备里程(Km)',
        prop: 'facilityMileage',
        width: '120',
        sort: true
      },
      {
        label: '设备开始里程(Km)',
        prop: 'facilityStartDistance',
        width: '140',
        sort: true
      },
      {
        label: '设备结束里程(Km)',
        prop: 'facilityEndDistance',
        width: '140',
        sort: true
      },
      {
        label: '最后电量',
        prop: 'batteryPower',
        width: '100',
        sort: true
      },
      {
        label: '最后电压(V)',
        prop: 'batteryVoltage',
        width: '100',
        sort: true
      },
      {
        label: '开始时间',
        prop: 'mileageStartTime',
        width: '160',
        sort: true
      },
      {
        label: '结束时间',
        prop: 'mileageStopTime',
        width: '160',
        sort: true
      },
      {
        label: '开始位置',
        prop: 'startAddress',
        width: '240'
      },
      {
        label: '结束位置',
        prop: 'endAddress',
        width: '240'
      },
      {
        label: '查看位置',
        prop: 'address',
        click: true,
        width: '100'
      }
    ]
  },
  // 异常路线诊断
  abnormalPath:{
    curTitle: '异常路线诊断报表',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        showcheck: true,
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '日期范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      },      
      tactic:  {
        label: '线路策略：',
        type: 'select1',
        model: 0,
        default: 0,
        placeholder: '请选择报警类型',
        list: [          
          {
            value: 0,
            label: '默认 （时间优先）'
          },
          {
            value: 1,
            label: '不走高速'
          },
          {
            value: 2,
            label: '躲避拥堵'
          },
          {
            value: 3,
            label: '距离较短'
          } 
        ]
      },
      // distanceGap: {
      //   label: '距离偏差(km)：',
      //   type: 'input',
      //   width: '200px',
      //   model: ''
      // },
      // timeGap: {
      //   label: '时间偏差：',
      //   type: 'input',
      //   width: '200px',
      //   model: ''
      // }
    },
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      }, 
      // {
      //   label: '是否大于偏差值',
      //   prop: 'isgap',
      //   width: '140',
      //   sort: true
      // }, 
      {
        label: '距离偏差值（km）',
        prop: 'mileageDiff',
        width: '140',
        sort: true
      },          
      {
        label: '线路策略',
        prop: 'tactic',
        width: '140',
        sort: true
      },
      {
        label: '里程(Km)',
        prop: 'mileageKm',
        width: '120',
        sort: true
      },
      {
        label: '里程对比',
        prop: 'mileagesCompared',
        width: '100',
        icon: true
      },
      {
        label: '时长（s）',
        prop: 'durationSecond',
        width: '140',
        sort: true
      },
      {
        label: '时长对比',
        prop: 'durationSecondsCompared',
        width: '140',
        icon: true
      },    
      {
        label: '开始位置',
        prop: 'startAddress',
        width: '240'
      },
      {
        label: '结束位置',
        prop: 'endAddress',
        width: '240'
      },
      {
        label: '查看位置',
        prop: 'address',
        click: true,
        width: '100'
      }
    ],     
  },
  // 时间段里程
  newMileage: {
    curTitle: '时间段里程报表',
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '里程(Km)',
        prop: 'mileage',
        width: '120',
        sort: true
      },
       
      {
        label: '设备开始里程(Km)',
        prop: 'startDeviceMileage',
        width: '140',
        sort: true
      },
      {
        label: '设备结束里程(Km)',
        prop: 'endDeviceMileage',
        width: '140',
        sort: true
      },
      {
        label: '最后电量',
        prop: 'batteryPower',
        width: '100',
        sort: true
      },
      {
        label: '最后电压(V)',
        prop: 'batteryVoltage',
        width: '100',
        sort: true
      },
      {
        label: '开始时间',
        prop: 'mileageStartTime',
        width: '160',
        sort: true
      },
      {
        label: '结束时间',
        prop: 'mileageStopTime',
        width: '160',
        sort: true
      },
      {
        label: '开始位置',
        prop: 'startAddress',
        width: '240'
      },
      {
        label: '结束位置',
        prop: 'endAddress',
        width: '240'
      },
      {
        label: '查看位置',
        prop: 'address',
        click: true,
        width: '100'
      }
    ],
    newTableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '里程(Km)',
        prop: 'mileage',
        width: '120',
        sort: true
      },
       
      {
        label: '设备开始里程(Km)',
        prop: 'facilityStartDistance',
        width: '140',
        sort: true
      },
      {
        label: '设备结束里程(Km)',
        prop: 'facilityEndDistance',
        width: '140',
        sort: true
      },
      {
        label: '最后电量',
        prop: 'batteryPower',
        width: '100',
        sort: true
      },
      {
        label: '最后电压(V)',
        prop: 'batteryVoltage',
        width: '100',
        sort: true
      },
      {
        label: '开始时间',
        prop: 'mileageStartTime',
        width: '160',
        sort: true
      },
      {
        label: '结束时间',
        prop: 'mileageStopTime',
        width: '160',
        sort: true
      },
      {
        label: '开始位置',
        prop: 'startAddress',
        width: '240'
      },
      {
        label: '结束位置',
        prop: 'endAddress',
        width: '240'
      },
      {
        label: '查看位置',
        prop: 'address',
        click: true,
        width: '100'
      }
    ]
  },
  // 时间段里程
  newTimeMileage: {
    curTitle: '时间段里程报表',
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '平台里程(Km)',
        prop: 'mileage',
        width: '120',
        sort: true
      },
      {
        label: '设备里程(Km)',
        prop: 'facilityMileage',
        width: '120',
        sort: true
      },
      {
        label: '设备开始里程(Km)',
        prop: 'facilityStartDistance',
        width: '140',
        sort: true
      },
      {
        label: '设备结束里程(Km)',
        prop: 'facilityEndDistance',
        width: '140',
        sort: true
      },
      {
        label: '最后电量',
        prop: 'batteryPower',
        width: '100',
        sort: true
      },
      {
        label: '最后电压(V)',
        prop: 'batteryVoltage',
        width: '100',
        sort: true
      },
      {
        label: '开始时间',
        prop: 'mileageStartTime',
        width: '160',
        sort: true
      },
      {
        label: '结束时间',
        prop: 'mileageStopTime',
        width: '160',
        sort: true
      },
      {
        label: '开始位置',
        prop: 'startAddress',
        width: '240'
      },
      {
        label: '结束位置',
        prop: 'endAddress',
        width: '240'
      },
      {
        label: '查看位置',
        prop: 'address',
        click: true,
        width: '100'
      }
    ]
  },
  // 里程日月报表
  dayMonthMileage: {
    curTitle: '里程日/月报表',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        showcheck: true,
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '日期范围：',
        type: 'startEndDate',
        width: '220px',
        model: ''
      },
      startMonth: {
        label: '开始月份：',
        type: 'month',
        placeholder: '请选择开始月份',
        isHide: true,
        model: ''
      },
      endMonth: {
        label: '结束月份：',
        type: 'month',
        placeholder: '请选择结束月份',
        isHide: true,
        model: ''
      },
      statisticType: {
        label: '统计类型：',
        type: 'select1',
        width: '240px',
        model: 1,
        default: 1,
        placeholder: '请选择驾驶时长',
        key: {
          value: 'value',
          id: 'label'
        },
        list: [
          {
            label: '日报表',
            value: 1
          },
          {
            label: '月报表',
            value: 2
          }
        ]
      }
    },
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '日期',
        prop: 'mileageDate',
        width: '120'
      },
      {
        label: '运行时长',
        prop: 'runTime',
        width: '160',
        sort: true
      },
      {
        label: '停车时间',
        prop: 'stopTime',
        width: '160',
        sort: true
      },
      {
        label: '里程(Km)',
        prop: 'mileage',
        width: '100',
        sort: true
      },
      {
        label: '开始时间',
        prop: 'mileageStartTime',
        width: '160',
        sort: true
      },
      {
        label: '结束时间',
        prop: 'mileageStopTime',
        width: '160',
        sort: true
      },
      {
        label: '开始位置',
        prop: 'startAddress',
        width: '240'
      },
      {
        label: '结束位置',
        prop: 'endAddress',
        width: '240'
      },
      {
        label: '查看位置',
        prop: 'address',
        click: true,
        width: '100'
      }
    ]
  },
    // 里程日月报表
    dayMonthMileageNew: {
      curTitle: '里程日/月报表',
      searchList: {
        vehTerminalNo: {
          label: '车牌号：',
          type: 'tree',
          model: '',
          showcheck: true,
          placeholder: '请选择车牌号',
          tree: [],
          defaultProps: {
            children: 'child',
            label: 'name'
          }
        },
        startEndTime: {
          label: '时间范围：',
          type: 'startEndTime',
          width: '346px',
          model: ''
        },     
      },
      tableTitle: [
        {
          label: '车牌号',
          prop: 'vehPlateNo',
          width: '140'
        },
        {
          label: '日期',
          prop: 'date',
          width: '160'
        },
        {
          label: '运行时长(s)',
          prop: 'runTime',
          width: '160',
          sort: true
        },
        {
          label: '停车时间',
          prop: 'stopTime',
          width: '160',
          sort: true
        },
        {
          label: '平台日里程(Km)',
          prop: 'platformDayMileage',
          width: '100',
          sort: true
        },
        {
          label: '设备日里程(Km)',
          prop: 'deviceDayMileage',
          width: '100',
          sort: true
        },        
        {
          label: '开始时间',
          prop: 'startTime',
          width: '160',
          sort: true
        },
        {
          label: '结束时间',
          prop: 'endTime',
          width: '160',
          sort: true
        },
        {
          label: '开始位置',
          prop: 'startAddress',
          width: '240'
        },
        {
          label: '结束位置',
          prop: 'endAddress',
          width: '240'
        },
        {
          label: '查看位置',
          prop: 'address',
          click: true,
          width: '100'
        }
      ]
    },
  // 急加速报表
  acceleration: {
    curTitle: '急加速报表',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        placeholder: '请选择车牌号',
        showcheck: true,
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '开始速度(Km/h)',
        prop: 'startSpeed',
        width: '140',
        sort: true
      },
      {
        label: '结束速度(Km/h)',
        prop: 'endSpeed',
        width: '140',
        sort: true
      },
      {
        label: '持续时间',
        prop: 'countTime',
        width: '100',
        sort: true
      },
      {
        label: '加速度(m/s^2)',
        prop: 'accSpeed',
        width: '120',
        sort: true
      },
      {
        label: '开始时间',
        prop: 'startTime',
        width: '160',
        sort: true
      },
      {
        label: '结束时间',
        prop: 'endTime',
        width: '160',
        sort: true
      },
      {
        label: '查看位置',
        prop: 'address',
        click: true,
        width: '100'
      }
    ]
  },
  // 急减速报表
  deceleration: {
    curTitle: '急减速报表',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        placeholder: '请选择车牌号',
        showcheck: true,
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '开始速度(Km/h)',
        prop: 'startSpeed',
        width: '140',
        sort: true
      },
      {
        label: '结束速度(Km/h)',
        prop: 'endSpeed',
        width: '140',
        sort: true
      },
      {
        label: '持续时间',
        prop: 'countTime',
        width: '100',
        sort: true
      },
      {
        label: '加速度(m/s^2)',
        prop: 'accSpeed',
        width: '140',
        sort: true
      },
      {
        label: '开始时间',
        prop: 'startTime',
        width: '160',
        sort: true
      },
      {
        label: '结束时间',
        prop: 'endTime',
        width: '160',
        sort: true
      },
      {
        label: '查看位置',
        prop: 'address',
        click: true,
        width: '100'
      }
    ]
  },
  // 疲劳驾驶报表
  fatigueDriving: {
    curTitle: '疲劳驾驶',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        placeholder: '请选择车牌号',
        showcheck: true,
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      duration: {
        label: '驾驶时长：',
        type: 'select1',
        model: 14400,
        default: 14400,
        placeholder: '请选择驾驶时长',
        key: {
          value: 'value',
          id: 'label'
        },
        list: [
          {
            label: '4小时',
            value: 14400
          },
          {
            label: '5小时',
            value: 18000
          },
          {
            label: '6小时',
            value: 21600
          },
          {
            label: '7小时以上',
            value: 25200
          }
        ]
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '驾驶时长',
        prop: 'countTime',
        width: '140',
        sort: true
      },
      {
        label: '行驶里程(Km)',
        prop: 'mileage',
        width: '140',
        sort: true
      },
      {
        label: '开始时间',
        prop: 'startTime',
        width: '160',
        sort: true
      },
      {
        label: '结束时间',
        prop: 'endTime',
        width: '160',
        sort: true
      },
      {
        label: '查看位置',
        prop: 'address',
        click: true,
        width: '100'
      }
    ]
  },
  // 驾驶行为统计
  driverCount: {
    curTitle: '驾驶行为统计',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        showcheck: true,
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '日期范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      },
      duration: {
        label: '统计类型：',
        type: 'select1',
        model: 2,
        default: 2,
        placeholder: '请选择统计类型',
        key: {
          value: 'value',
          id: 'label'
        },
        list: [
          {
            label: '按天统计',
            value: 0
          },
          {
            label: '按小时统计',
            value: 1
          },
          {
            label: '按设备统计',
            value: 2
          }
        ]
      }
    },
    tableTitle: [
      {
        label: '部门名称',
        prop: 'dptName',
        width: '210',
        sort: false
      },
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140',
        sort: false
      },
      {
        label: '终端号',
        prop: 'vehTerminalNo',
        width: '120',
        sort: false
      },
      {
        label: '日期',
        prop: 'creationTime',
        width: '120',
        sort: true
      },
      {
        label: '时间(h)',
        prop: 'hour',
        width: '100',
        sort: true
      },
      {
        label: '急加速次数',
        prop: 'accelerate',
        width: '120',
        sort: true,
        isButton: true
      },
      {
        label: '急减速次数',
        prop: 'slowDown',
        width: '120',
        sort: true,
        isButton: true
      },
      {
        label: '急转弯次数',
        prop: 'turn',
        width: '120',
        sort: true,
        isButton: true
      },
      {
        label: '超速次数',
        prop: 'overSpeed',
        width: '120',
        sort: true,
        isButton: true
      },
      {
        label: '疲劳驾驶次数',
        prop: 'fatigue',
        width: '120',
        sort: true,
        isButton: true
      }
    ]
  },
  // 超速报表
  overspeed: {
    curTitle: '超速报表',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        placeholder: '请选择车牌号',
        showcheck: true,
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      limitSpeed: {
        label: '超速阈值：',
        type: 'input',
        model: ''
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '实际速度(Km/h)',
        prop: 'overSpeed',
        width: '140',
        sort: true
      },
      {
        label: '限速阈值(Km/h)',
        prop: 'speedThreshold',
        width: '140',
        sort: true
      },
      {
        label: '开始时间',
        prop: 'startTime',
        width: '160',
        sort: true
      },
      {
        label: '结束时间',
        prop: 'endTime',
        width: '160',
        sort: true
      },
      {
        label: '持续时间',
        prop: 'countTime',
        width: '120',
        sort: true
      },
      {
        label: '超速里程(Km)',
        prop: 'mileage',
        width: '120',
        sort: true
      },
      {
        label: '道路类型',
        prop: 'roadGrade',
        width: '180'
      },
      {
        label: '查看位置',
        prop: 'address',
        click: true,
        width: '100'
      }
    ]
  },
  // 运行报表
  run: {
    curTitle: '运行报表',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      zero: {
        label: '速度大于0：',
        type: 'radio',
        model: false,
        default: false
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '终端号',
        prop: 'vehTerminalNo',
        width: '120'
      },
      {
        label: '速度(Km/h)',
        prop: 'gpsSpeed',
        width: '110',
        sort: true
      },
      {
        label: '里程(Km)',
        prop: 'gpsDayDistance',
        width: '110',
        sort: true
      },
      {
        label: '定位时间',
        prop: 'gpstime',
        width: '160',
        sort: true
      },     
      {
        label: 'Acc',
        prop: 'gpsAcc',
        width: '80'
      },
      {
        label: '最后电量',
        prop: 'batteryPower',
        width: '100',
        sort: true
      },
      {
        label: '是否定位',
        prop: 'gpsIsposition',
        width: '120'
      },     
      {
        label: '经度',
        prop: 'gpsWebLng',
        width: '120'
      },
      {
        label: '纬度',
        prop: 'gpsWebLat',
        width: '120'
      },     
      {
        label: '定位类型',
        prop: 'locationType',
        width: '140'
      },
      {
        label: '方向',
        prop: 'gpsDirect',
        width: '100'
      },     
      {
        label: '定位地址',
        prop: 'positionAddress',
        width: '240',
        sort: true
      },
      {
        label: '查看位置',
        prop: 'address',
        width: '120',
        click: true
      }
    ],
    tableMoreConList: [
      {
        label: '车牌号',
        prop: 'vehPlateNo'
      },
      {
        label: '终端号',
        prop: 'vehTerminalNo'
      },
      {
        label: '速度(Km/h)',
        prop: 'gpsSpeed'
      },
      {
        label: '总里程(Km)',
        prop: 'gpsTotalDistance'
      },
      {
        label: '当天里程(Km)',
        prop: 'gpsDayDistance'
      },
      {
        label: 'Acc',
        prop: 'gpsAcc'
      },
      {
        label: '定位时间',
        prop: 'gpstime'
      },
      {
        label: '经度',
        prop: 'gpsWebLng'
      },
      {
        label: '纬度',
        prop: 'gpsWebLat'
      },
      {
        label: '方向',
        prop: 'gpsDirect'
      },
      {
        label: '报警代码',
        prop: 'gpsAlarm'
      },
      {
        label: '定位类型',
        prop: 'locationType'
      },
      {
        label: '是否定位',
        prop: 'gpsIsposition'
      },
      {
        label: '创建时间',
        prop: 'creationTime'
      },
      {
        label: '定位状态',
        prop: 'gpsState'
      },
      {
        label: '定位地址',
        prop: 'positionAddress'
      },
      {
        label: '基站定位信息',
        prop: 'infoLBS'
      },
      {
        label: '定位附加信息',
        prop: 'extensionData'
      }
    ]
  },
  // 围栏统计
  fenceCount: {
    curTitle: '围栏报警统计',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        showcheck: true,
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '日期范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '车牌号',
        prop: 'plateNo',
        width: '160'
      },
      {
        label: '终端号',
        prop: 'vehTerminalNo',
        width: '160'
      },
      {
        label: '围栏超速次数',
        prop: 'fanceOverSpeedCount',
        isButton: true,
        sort: true,
        width: '140'
      },
      {
        label: '围栏停车次数',
        prop: 'fanceStopCarCount',
        isButton: true,
        sort: true,
        width: '140'
      },
      {
        label: '进入围栏次数',
        prop: 'inFanceCount',
        isButton: true,
        sort: true,
        width: '140'
      },
      {
        label: '出围栏次数',
        prop: 'outFanceCount',
        isButton: true,
        sort: true,
        width: '140'
      },
      {
        label: '开始时间',
        prop: 'startTime',
        sort: true,
        width: '160'
      },
      {
        label: '结束时间',
        prop: 'endTime',
        sort: true,
        width: '160'
      }
    ]
  },
  // 围栏告警详情
  fenceEnter: {
    curTitle: '围栏告警详情',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        placeholder: '请选择车牌号',
        showcheck: true,
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      },
      alaType: {
        label: '报警类型：',
        type: 'select1',
        model: '',
        default: '',
        placeholder: '请选择报警类型',
        list: [
          {
            value: '',
            label: '所有'
          },
          {
            value: '10001',
            label: '入围栏报警'
          },
          {
            value: '10002',
            label: '出围栏报警'
          },
          {
            value: '10003',
            label: '围栏内停车报警'
          },
          {
            value: '10004',
            label: '围栏内超速报警'
          }
        ]
      }
    },
    tableTitle: [
      {
        label: '部门',
        prop: 'dptName',
        width: '200'
      },
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '报警来源',
        prop: 'vehResoure',
        width: '100'
      },
      {
        label: '报警时间',
        prop: 'alaTime',
        width: '180',
        sort: true
      },
      {
        label: '报警信息',
        prop: 'alaDisplay',
        width: '200'
      },
      {
        label: '报警位置',
        prop: 'alarmAddress',
        width: '160'
      }
    ]
  },
  // 区域进出
  area: {
    curTitle: '围栏报警详情',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        placeholder: '请选择车牌号',
        showcheck: true,
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      alarmType: {
        label: '报警类型：',
        type: 'select1',
        model: '',
        default: '',
        placeholder: '请选择报警类型',
        list: [
          {
            value: '',
            label: '所有'
          },
          {
            value: '10001',
            label: '入围栏报警'
          },
          {
            value: '10002',
            label: '出围栏报警'
          },
          {
            value: '10003',
            label: '围栏内停车报警'
          },
          {
            value: '10004',
            label: '围栏内超速报警'
          },
          {
            value: '10005',
            label: '线路偏移'
          }
        ]
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '部门',
        prop: 'dptName',
        width: '200'
      },
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '报警来源',
        prop: 'vehResoure',
        width: '100'
      },
      {
        label: '报警时间',
        prop: 'alaTime',
        width: '180',
        sort: true
      },
      {
        label: '报警信息',
        prop: 'alaDisplay',
        width: '200'
      },
      {
        label: '报警位置',
        prop: 'alarmAddress',
        click: true,
        width: '120'
      }
    ]
  },
  //线路偏移
  line: {
    curTitle: '线路偏移',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        placeholder: '请选择车牌号',
        showcheck: true,
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '部门',
        prop: 'dptName',
        width: '200'
      },
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '报警来源',
        prop: 'vehResoure',
        width: '100'
      },
      {
        label: '报警时间',
        prop: 'alaTime',
        width: '180',
        sort: true
      },
      {
        label: '报警信息',
        prop: 'alaDisplay',
        width: '200'
      },
      {
        label: '报警位置',
        prop: 'alarmAddress',
        click: true,
        width: '160'
      }
    ]
  },
  // 电量明细
  electricity: {
    curTitle: '电量明细',
    other: {
      unknown: '未知',
      charge: '正在充电',
      noCharge: '未充电'
    },
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      filter: {
        label: '是否滤波：',
        type: 'radio',
        model: false,
        default: false
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      },
      chargeStatus: {
        label: '充电情况：',
        type: 'select1',
        model: -1,
        default: -1,
        list: [
          {
            value: -1,
            label: '全部'
          },
          {
            value: 1,
            label: '正在充电'
          },
          {
            value: 0,
            label: '未充电'
          }
        ]
      },
      zero: {
        label: '运行情况：',
        type: 'select1',
        model: 0,
        default: 0,
        list: [
          {
            value: 0,
            label: '全部'
          },
          {
            value: 1,
            label: '运行'
          },
          {
            value: -1,
            label: '停车'
          }
        ]
      }
    },
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '电压(V)',
        prop: 'convertBatteryVoltage',
        width: '110',
        sort: true
      },
      {
        label: '电量',
        prop: 'batteryPower',
        width: '110',
        sort: true
      },
      {
        label: '充电情况',
        prop: 'gpsHasPower',
        width: '120'
      },
      {
        label: '速度(Km/h)',
        prop: 'gpsSpeed',
        width: '120',
        sort: true
      },
      {
        label: '当日里程(Km)',
        prop: 'gpsDayDistance',
        width: '120',
        sort: true
      },
      {
        label: 'Acc',
        prop: 'gpsAcc',
        width: '100'
      },
      {
        label: '定位时间',
        prop: 'gpstime',
        width: '160',
        sort: true
      },
      {
        label: '创建时间',
        prop: 'creationTime',
        width: '160',
        sort: true
      }
    ],
    tableMoreConList: [
      {
        label: '车牌号',
        prop: 'vehPlateNo'
      },
      {
        label: '电压(V)',
        prop: 'convertBatteryVoltage'
      },
      {
        label: '电量',
        prop: 'batteryPower'
      },
      {
        label: '充电情况',
        prop: 'gpsHasPower'
      },
      {
        label: '速度(Km/h)',
        prop: 'gpsSpeed'
      },
      {
        label: '当日里程(Km)',
        prop: 'gpsDayDistance'
      },
      {
        label: 'Acc',
        prop: 'gpsAcc'
      },
      {
        label: '定位时间',
        prop: 'gpstime'
      },
      {
        label: '创建时间',
        prop: 'creationTime'
      },
      {
        label: '车牌号',
        prop: 'vehPlateNo'
      },
      {
        label: '终端号',
        prop: 'vehTerminalNo'
      },
      {
        label: '速度(Km/h)',
        prop: 'gpsSpeed'
      },
      {
        label: '总里程(Km)',
        prop: 'gpsTotalDistance'
      },
      {
        label: 'Acc',
        prop: 'gpsAcc'
      },
      {
        label: '经度',
        prop: 'gpsWebLng'
      },
      {
        label: '纬度',
        prop: 'gpsWebLat'
      },
      {
        label: '方向',
        prop: 'gpsDirect'
      },
      {
        label: '报警代码',
        prop: 'gpsAlarm'
      },
      {
        label: '定位地址',
        prop: 'gpsIsposition'
      },
      {
        label: '定位状态',
        prop: 'gpsState'
      },
      {
        label: '定位地址',
        prop: 'positionAddress'
      },
      {
        label: '基站定位信息',
        prop: 'infoLBS'
      },
      {
        label: '定位附加信息',
        prop: 'extensionData'
      }
    ],
    options: [
      {
        name: '电量',
        unit: '%',
        color: '#00A8D4'
      },
      {
        name: '电压',
        unit: 'V',
        color: '#ff0000'
      }
    ]
  },
  // 温度明细
  temperature: {
    curTitle: '温度明细',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      filter: {
        label: '是否滤波：',
        type: 'radio',
        model: false,
        default: false
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '温度(℃)',
        prop: 'temperature',
        width: '140',
        sort: true
      },
      {
        label: '速度(Km/h)',
        prop: 'gpsSpeed',
        width: '140',
        sort: true
      },
      {
        label: '当日里程(Km)',
        prop: 'gpsDayDistance',
        width: '160',
        sort: true
      },
      {
        label: 'Acc',
        prop: 'gpsAcc',
        width: '100'
      },
      {
        label: '定位时间',
        prop: 'gpstime',
        width: '160',
        sort: true
      },
      {
        label: '创建时间',
        prop: 'creationTime',
        width: '160',
        sort: true
      }
    ],
    options: [
      {
        name: '温度',
        unit: '℃',
        color: '#00A8D4'
      }
    ]
  },
  // 载重明细
  load: {
    curTitle: '载重明细',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '载重(Kg)',
        prop: 'load',
        width: '120',
        sort: true
      },
      // {
      //   label: '部门',
      //   prop: 'dptName',
      //   width: '200',
      // },
      {
        label: '车辆状态',
        prop: 'carState',
        width: '100'
      },
      {
        label: '速度(Km/h)',
        prop: 'gpsSpeed',
        width: '140',
        sort: true
      },
      {
        label: '当日里程(Km)',
        prop: 'gpsDayDistance',
        width: '160',
        sort: true
      },
      {
        label: 'Acc',
        prop: 'gpsAcc',
        width: '100'
      },
      {
        label: '定位时间',
        prop: 'gpstime',
        width: '160',
        sort: true
      },
      {
        label: '创建时间',
        prop: 'creationTime',
        width: '160',
        sort: true
      },
      {
        label: '经度',
        prop: 'gpsWebLng',
        width: '100',
        sort: true
      },
      {
        label: '纬度',
        prop: 'gpsWebLat',
        width: '100',
        sort: true
      },
      {
        label: '定位地址',
        prop: 'address',
        click: true,
        width: '120'
      }
    ],
    options: [
      {
        name: '载重',
        unit: 'Kg',
        color: '#00A8D4'
      },
      {
        name: '速度',
        unit: 'Km/h',
        color: '#ff0000'
      }
    ]
  },
  // 电能数据
  electricEnergy: {
    curTitle: '电能数据',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '终端号',
        prop: 'vehTerminalNo',
        width: '140'
      },
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '经度',
        prop: 'gpsWebLng',
        width: '140'
      },
      {
        label: '纬度',
        prop: 'gpsWebLat',
        width: '140'
      },
      {
        label: '海拔高度',
        prop: 'gpsHeight',
        width: '100'
      },
      {
        label: '速度',
        prop: 'gpsSpeed',
        width: '100'
      },
      {
        label: '角度',
        prop: 'gpsDirect',
        width: '100'
      },
      {
        label: '时间',
        prop: 'gpstime',
        width: '160'
      },
      {
        label: '正向电能',
        prop: 'forwardPowerDisplay',
        width: '140'
      },
      {
        label: '反向电能',
        prop: 'reversePowerDisplay',
        width: '140'
      },
      {
        label: '电压',
        prop: 'voltageDisplay',
        width: '140'
      },
      {
        label: '电流',
        prop: 'currentDisplay',
        width: '140'
      },
      {
        label: '功率',
        prop: 'powerDisplay',
        width: '140'
      }
    ],
    options: [
      {
        name: '正向电能',
        unit: 'MWh',
        color: ''
      },
      {
        name: '反向电能',
        unit: 'MWh',
        color: ''
      },
      {
        name: '电压',
        unit: 'V',
        color: ''
      },
      {
        name: '电流',
        unit: 'A',
        color: ''
      },
      {
        name: '功率',
        unit: 'KW',
        color: ''
      }
    ]
  },
  // 陀螺仪
  gyroscope: {
    curTitle: '陀螺仪',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '终端号',
        prop: 'vehTerminalNo',
        width: '140'
      },
      {
        label: '头部',
        prop: 'inertialNavigationHeader',
        width: '140'
      },
      {
        label: '时间片',
        prop: 'timeStamp',
        width: '140'
      },
      {
        label: '经度',
        prop: 'convertLng',
        width: '140'
      },
      {
        label: '纬度',
        prop: 'convertLat',
        width: '140'
      },
      {
        label: '海拔高度',
        prop: 'height',
        width: '100'
      },
      {
        label: 'OBD速度',
        prop: 'obdSpeed',
        width: '100'
      },
      {
        label: 'GPS速度',
        prop: 'gpsSpeed',
        width: '100'
      },
      {
        label: '航向角',
        prop: 'directionAngle',
        width: '100'
      },
      {
        label: '俯仰角度',
        prop: 'pitchAngle',
        width: '100'
      },
      {
        label: '滚动角度',
        prop: 'scrollAngle',
        width: '100'
      },

      {
        label: 'Y重力加速度',
        prop: 'yGravityAcceleration',
        width: '100'
      },
      {
        label: 'Z重力加速度',
        prop: 'zGravityAcceleration',
        width: '100'
      },
      {
        label: '收星数',
        prop: 'receiveStarsNumber',
        width: '100'
      },
      {
        label: 'Utc时间',
        prop: 'utcTime',
        width: '100'
      },
      {
        label: 'X角速度',
        prop: 'xAngleSpeed',
        width: '100'
      },
      {
        label: 'Y角速度',
        prop: 'yAngleSpeed',
        width: '100'
      },
      {
        label: 'Z角速度',
        prop: 'zAngleSpeed',
        width: '100'
      },
      {
        label: '尾部',
        prop: 'inertialNavigationTail',
        width: '100'
      },
      {
        label: '创建时间',
        prop: 'createTime',
        width: '160'
      }
    ]
  },
  // 轨道交通能耗计量
  lightRail: {
    curTiele: '轨道交通能耗计量系统',
    searchList: {
      carName: {
        label: '终端号：',
        type: 'input',
        model: '',
        placeholder: '请输入终端号'
      }
    }
  },
  // 保险
  insurance: {
    curTiele: '车辆保险',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        placeholder: '请选择车牌号',
        tree: [],
        showcheck: true,
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      }
    },
    tableTitle: [
      {
        label: '终端号',
        prop: 'vehTerminalNo',
        width: '140'
      },
      {
        label: '保险公司',
        prop: 'insuranceCompany',
        width: '140'
      },
      {
        label: '险种类型',
        prop: 'insuranceType',
        width: '140'
      },
      {
        label: '续保公司',
        prop: 'renewalCompany',
        width: '140'
      },
      {
        label: '续保险种',
        prop: 'renewalType',
        width: '140'
      },
      {
        label: '总金额',
        prop: 'totalSum',
        width: '140'
      },
      {
        label: '提醒保险日期',
        prop: 'reminderDate',
        width: '140'
      },
      {
        label: '注册时间',
        prop: 'registrationDate',
        width: '140'
      },
      {
        label: '创建时间',
        prop: 'creationTime',
        width: '140'
      },
      {
        label: '备注',
        prop: 'remark',
        width: '140'
      }
    ]
  },
  // 保养
  maintain: {
    curTitle: '车辆保养',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        placeholder: '请选择车牌号',
        tree: [],
        showcheck: true,
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      }
    },
    tableTitle: [
      {
        label: '终端号',
        prop: 'vehTerminalNo',
        width: '140'
      },
      {
        label: '首保里程(Km)',
        prop: 'firstGuaranteeMileage',
        width: '140'
      },
      {
        label: '保养里程(Km)',
        prop: 'maintenanceMileage',
        width: '140'
      },
      {
        label: '保养间隔(月)',
        prop: 'maintenanceInterval',
        width: '140'
      },
      {
        label: '保养次数',
        prop: 'maintenanceTimes',
        width: '140'
      },
      {
        label: '保养内容',
        prop: 'maintenanceContent',
        width: '140'
      },
      {
        label: '首保日期',
        prop: 'firstGuaranteeDate',
        width: '140'
      },
      {
        label: '保养日期',
        prop: 'maintenanceDate',
        width: '140'
      },
      {
        label: '创建时间',
        prop: 'creationTime',
        width: '140'
      },
      {
        label: '备注',
        prop: 'remark',
        width: '140'
      }
    ]
  },
  // 指令报表
  sendcommand: {
    curTitle: '下发指令',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        placeholder: '请选择车牌号',
        tree: [],
        showcheck: true,
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '消息名称',
        prop: 'commandName',
        width: '180'
      },
      {
        label: '下发信息内容',
        prop: 'creationContent',
        width: '180'
      },
      {
        label: '是否发送',
        prop: 'sState',
        width: '120'
      },
      {
        label: '是否应答',
        prop: 'rState',
        width: '120'
      },
      {
        label: '响应数据',
        prop: 'responseResult',
        width: '180'
      },
      {
        label: '下发时间',
        prop: 'creationTime',
        width: '160',
        sort: true
      }
    ],
    tableMoreConList: [
      {
        label: '车牌号',
        prop: 'vehPlateNo'
      },
      {
        label: '消息名称',
        prop: 'commandName'
      },
      {
        label: '下发信息内容',
        prop: 'creationContent'
      },
      {
        label: '是否发送',
        prop: 'sendState'
      },
      {
        label: '是否应答',
        prop: 'responseState'
      },
      {
        label: '下发时间',
        prop: 'creationTime'
      },
      {
        label: '响应数据',
        prop: 'responseResult'
      }
    ]
  },
  // 离线报表
  offline: {
    curTitle: '离线报表',
    searchList: {
      dptName: {
        label: '部门名称：',
        type: 'tree',
        model: '',
        showcheck: true,
        placeholder: '请选择部门',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'dptName'
        }
      },
      offlineTime: {
        label: '离线时长(小时)：',
        type: 'input',
        model: '',
        placeholder: '请输入离线时长'
      }
    },
    tableTitle: [
      {
        label: '部门名称',
        prop: 'dptName',
        width: '210',
        sort: true
      },
      {
        label: '车牌号',
        prop: 'plateNo',
        width: '140',
        sort: true
      },
      {
        label: '终端号',
        prop: 'terminalNo',
        width: '120',
        sort: true
      },
      {
        label: 'Sim卡号',
        prop: 'sim',
        width: '130',
        sort: true
      },
      {
        label: '设备类型',
        prop: 'dvTypeName',
        width: '140',
        sort: true
      },
      {
        label: '最后电量',
        prop: 'batteryPower',
        width: '100',
        sort: true
      },
      {
        label: '最后定位时间',
        prop: 'lastRecode',
        width: '160',
        sort: true
      },
      {
        label: '离线时长',
        prop: 'offline',
        width: '180',
        sort: true
      },
      {
        label: '最后定位经度',
        prop: 'gpsWebLng',
        width: '120'
      },
      {
        label: '最后定位纬度',
        prop: 'gpsWebLat',
        width: '120'
      },
      {
        label: '最后定位地址',
        prop: 'address',
        width: '120',
        click: true
      }
    ]
  },
  // 到期车辆
  carExpire: {
    curTitle: '到期车辆',
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '150'
      },
      {
        label: '终端ID',
        prop: 'vehTerminalNo',
        width: '150'
      },
      {
        label: 'VIN号',
        prop: 'vehVin',
        width: '180'
      },
      {
        label: '设备类型',
        prop: 'deviceTypeName',
        width: '200'
      },
      {
        label: '部门名称',
        prop: 'dptName',
        width: '250'
      },
      {
        label: 'SIM卡号',
        prop: 'vehSimno',
        width: '160'
      },
      {
        label: '车辆登记时间',
        prop: 'creationTime',
        width: '160'
      },
      {
        label: '服务到期时间',
        prop: 'vehExpired',
        width: '160'
      },
      {
        label: '最后定位时间',
        prop: 'lastLocationTime',
        width: '160'
      },
      {
        label: '备注',
        prop: 'memo',
        width: '180'
      }
    ],
    tableMoreConList: [
      {
        label: '车牌号',
        prop: 'vehPlateNo'
      },
      {
        label: '终端ID',
        prop: 'vehTerminalNo'
      },
      {
        label: '设备类型',
        prop: 'deviceTypeName'
      },
      {
        label: '部门名称',
        prop: 'dptName'
      },
      {
        label: 'SIM卡号',
        prop: 'vehSimno'
      },
      {
        label: 'VIN号',
        prop: 'vehVin'
      },
      {
        label: '车牌颜色',
        prop: 'vColor'
      },
      {
        label: '车辆类型',
        prop: 'vehType'
      },
      {
        label: '超速值',
        prop: 'vehOverSpeed'
      },
      {
        label: '百公里油耗',
        prop: 'vehOilPercent'
      },
      {
        label: '邮箱体积(升)',
        prop: 'vehOilsize'
      },
      {
        label: '油箱总刻度',
        prop: 'vehOilmark'
      },
      {
        label: '里程百分比',
        prop: 'vehDisPercent'
      },
      {
        label: '安装人员',
        prop: 'vehInstaller'
      },
      {
        label: '是否收费',
        prop: 'vIsfees'
      },
      {
        label: '车辆品牌',
        prop: 'vehBrand'
      },
      {
        label: '吨位',
        prop: 'vehTon'
      },
      {
        label: '车辆登记时间',
        prop: 'creationTime'
      },
      {
        label: '服务费到期时间',
        prop: 'vehExpired'
      },
      {
        label: '最后定位时间',
        prop: 'lastLocationTime'
      },
      {
        label: '道路运输证号',
        prop: 'vehTransno'
      },
      {
        label: '主司机名',
        prop: 'masterDriverName'
      },
      {
        label: '副司机名',
        prop: 'slaveDriverName'
      },
      {
        label: '排序码',
        prop: 'sortNum'
      },
      {
        label: '备注',
        prop: 'memo'
      },
      {
        label: '定位附加信息',
        prop: 'extension'
      },
      {
        label: '车辆附加信息',
        prop: 'sensorExtension'
      }
    ],
    searchList: {
      Search: {
        label: '搜索：',
        prop: 'Search',
        type: 'selectSearch',
        width: '200px !important',
        model: '',
        placeholder: '车牌号/终端号/VIN/SIM',
        list: [],
        loading: false,
        key: {
          value: 'val',
          id: 'vehTerminalNo'
        }
      },
      DptIds: {
        label: '部门：',
        prop: 'DptIds',
        type: 'tree',
        width: '200px !important',
        model: '',
        placeholder: '请选择部门',
        placeholder2: '请输入部门名称',
        showcheck: true,
        name: 'dptName',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'dptName'
        }
      },
      Type: {
        label: '设备类型：',
        prop: 'Type',
        type: 'selectAll',
        model: '',
        width: '200px !important',
        placeholder: '请选择设备类型',
        list: [],
        key: {
          label: 'devtName',
          value: 'id'
        }
      }
    }
  },
  // 主动安全周报
  activeSafetyMonthly: {
    curTitle: '主动安全周报',
    searchList: {
      dpt: {
        label: '部门：',
        type: 'tree',
        model: '',
        placeholder: '请选择部门',
        tree: [],
        filter: true,
        defaultProps: {
          children: 'child',
          label: 'dptName'
        }
      },
      date: {
        label: '时间：',
        type: 'date',
        pickType: true,
        model: ''
      },
      type: {
        label: '类型：',
        type: 'select1',
        model: 0,
        default: 0,
        list: [
          {
            value: 0,
            label: '日报'
          },
          {
            value: 1,
            label: '周报'
          },
          {
            value: 2,
            label: '月报'
          }
        ]
      }
    },
    driverTable: [
      {
        label: '司机',
        prop: 'driveName',
        width: '110px'
      },
      {
        label: '安全扣分',
        prop: 'safetyDeductionPer100Km',
        width: '120px'
      },
      {
        label: '疲劳驾驶(次)',
        prop: '疲劳驾驶报警',
        alaType: '618,619,668,669',
        width: '110px'
      },
      {
        label: '分神驾驶(次)',
        prop: '分神驾驶报警',
        alaType: '624,625,674,675',
        width: '110px'
      },
      {
        label: '使用手机(次)',
        prop: '接打电话报警',
        alaType: '620,621,670,671',
        width: '110px'
      },
      {
        label: '车道分离(次)',
        prop: '车道偏离报警',
        alaType: '602,603,652,653',
        width: '110px'
      },
      {
        label: '碰撞报警(次)',
        prop: '前向碰撞报警',
        alaType: '600,601,650,651',
        width: '110px'
      },
      {
        label: '车距过近(次)',
        prop: '车距过近报警',
        alaType: '604,605,654,655',
        width: '110px'
      }
    ],
    carTable: [
      {
        label: '车牌号',
        prop: 'plateNo',
        width: '110px'
      },
      {
        label: '行驶里程(Km)',
        prop: 'totalMileage',
        width: '110px'
      },
      {
        label: '百公里安全扣分',
        prop: 'safetyDeductionPer100Km',
        width: '120px'
      },
      {
        label: '疲劳驾驶(次)',
        prop: '疲劳驾驶报警',
        alaType: '618,619,668,669',
        width: '110px'
      },
      {
        label: '分神驾驶(次)',
        prop: '分神驾驶报警',
        alaType: '624,625,674,675',
        width: '110px'
      },
      {
        label: '使用手机(次)',
        prop: '接打电话报警',
        alaType: '620,621,670,671',
        width: '110px'
      },
      {
        label: '车道分离(次)',
        prop: '车道偏离报警',
        alaType: '602,603,652,653',
        width: '110px'
      },
      {
        label: '碰撞报警(次)',
        prop: '前向碰撞报警',
        alaType: '600,601,650,651',
        width: '110px'
      },
      {
        label: '车距过近(次)',
        prop: '车距过近报警',
        alaType: '604,605,654,655',
        width: '110px'
      }
    ],
    text: {
      day: {
        prev: '昨日',
        cur: '今天',
        unit: '日'
      },
      week: {
        prev: '上周',
        cur: '本周',
        unit: '周'
      },
      month: {
        prev: '上月',
        cur: '本月',
        unit: '月'
      }
    }
  },
  // 急转弯
  swerve: {
    curTitle: '急转弯报表',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        placeholder: '请选择车牌号',
        showcheck: true,
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '开始速度(Km/h)',
        prop: 'startSpeed',
        width: '140',
        sort: true
      },
      {
        label: '结束速度(Km/h)',
        prop: 'endSpeed',
        width: '140',
        sort: true
      },
      {
        label: '方向',
        prop: 'position',
        width: '120'
      },
      {
        label: '开始时间',
        prop: 'startTime',
        width: '160',
        sort: true
      },
      {
        label: '结束时间',
        prop: 'endTime',
        width: '160',
        sort: true
      },
      {
        label: '急转弯地址',
        prop: 'address',
        click: true,
        width: '100'
      }
    ]
  },
  // 胎压报表
  tirePressure: {
    curTitle: '胎压明细',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '轮数',
        prop: 'number',
        width: '80'
      },
      {
        label: '时间',
        prop: 'gpsTime',
        width: '160',
        sort: true
      },
      {
        label: '位置',
        prop: 'position',
        width: '180'
      },
      {
        label: '压力(bar)',
        prop: 'pressure',
        width: '120',
        sort: true
      },
      {
        label: '温度(℃)',
        prop: 'temperature',
        width: '120',
        sort: true
      },
      {
        label: '传感器ID',
        prop: 'sensorId',
        width: '160'
      },
      {
        label: '报警代码',
        prop: 'alarmState',
        width: '160'
      },
      {
        label: '报警内容',
        prop: 'alarmStateDisplay',
        width: '320'
      }
    ],
    options: [
      {
        name: '胎压',
        unit: 'bar',
        color: '#00A8D4'
      },
      {
        name: '温度',
        unit: '℃',
        color: '#ff0000'
      }
    ]
  },
  // 重量装载
  weightLoad: {
    curTitle: '重量装载',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        showcheck: true,
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '部门名称',
        prop: 'dptName',
        width: '200'
      },
      {
        label: '总轴载重等级',
        prop: 'x7085',
        width: '120',
        sort: true
      },
      {
        label: '车辆速度(Km/h)',
        prop: 'x7093',
        width: '140',
        sort: true
      },
      {
        label: '上报时间',
        prop: 'creationTime',
        width: '160',
        sort: true
      },
      {
        label: '位置',
        prop: 'address',
        width: '100',
        click: true
      }
    ],
    tableMoreConList: [
      {
        label: '车牌号',
        prop: 'vehPlateNo'
      },
      {
        label: '部门名称',
        prop: 'dptName'
      },
      {
        label: '总轴载重等级',
        prop: 'x7085'
      },
      {
        label: '车辆速度(Km/h)',
        prop: 'x7093'
      },
      {
        label: '上报时间',
        prop: 'creationTime'
      },
      {
        label: '报警状态',
        prop: 'alarmStatus'
      },
      {
        label: '车辆编号',
        prop: 'truckNum'
      },
      {
        label: '设备号',
        prop: 'gpsNo'
      },
      {
        label: '打卡司机号',
        prop: 'icno'
      },
      {
        label: '机构号',
        prop: 'orgcode'
      },
      {
        label: '司机名称',
        prop: 'driverName'
      },
      {
        label: '事件',
        prop: 'speed'
      },
      {
        label: '经度',
        prop: 'startWebLng'
      },
      {
        label: '纬度',
        prop: 'startWebLat'
      }
    ]
  },
  // 体积装载
  volumeLoad: {
    curTitle: '体积装载',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        showcheck: true,
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '部门名称',
        prop: 'dptName',
        width: '200'
      },
      {
        label: '上报时间',
        prop: 'creationTime',
        width: '160',
        sort: true
      },
      {
        label: '车厢容积(m³)',
        prop: 'volume',
        width: '140',
        sort: true
      },
      {
        label: '负载(m³)',
        prop: 'burden',
        width: '140',
        sort: true
      },
      {
        label: '装载率',
        prop: 'loadingRate',
        width: '140',
        sort: true
      },
      {
        label: '位置',
        prop: 'address',
        width: '100',
        click: true
      }
    ]
  },
  // 事件报表
  event: {
    curTitle: '事件管理',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        showcheck: true,
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      },
      type: {
        label: '事件类型：',
        type: 'selectAll',
        model: '',
        width: '240px !important',
        placeholder: '请选择事件类型',
        list: [
          {
            label: '防抱死事件',
            id: 120
          },
          {
            label: '防侧翻事件',
            id: 121
          },
          {
            label: 'TEBS 故障红灯报警事件',
            id: 137
          },
          {
            label: 'TEBS 故障黄灯报警事件',
            id: 138
          }
        ],
        key: {
          label: 'label',
          value: 'id'
        }
      }
    },
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '部门名称',
        prop: 'dptName',
        width: '200'
      },
      {
        label: '事件名称',
        prop: 'alaDisplay',
        width: '160'
      },
      {
        label: '上报时间',
        prop: 'creationTime',
        width: '160',
        sort: true
      },
      {
        label: '开始时间',
        prop: 'startTime',
        width: '160',
        sort: true
      },
      {
        label: '结束时间',
        prop: 'endTime',
        width: '160',
        sort: true
      },
      {
        label: '持续时长(秒)',
        prop: 'sec',
        width: '160',
        sort: true
      },
      {
        label: '位置',
        prop: 'address',
        width: '100',
        click: true
      }
    ],
    tableMoreConList: [
      {
        label: '车牌号',
        prop: 'vehPlateNo'
      },
      {
        label: '部门名称',
        prop: 'dptName'
      },
      {
        label: '上报时间',
        prop: 'creationTime'
      },
      {
        label: '开始时间',
        prop: 'startTime'
      },
      {
        label: '结束时间',
        prop: 'endTime'
      },
      {
        label: '持续时长(秒)',
        prop: 'seconds'
      },
      {
        label: '事件名称',
        prop: 'alaDisplay'
      },
      {
        label: '报警状态',
        prop: 'alarmStatus'
      },
      {
        label: '车辆编号',
        prop: 'truckNum'
      },
      {
        label: '设备号',
        prop: 'gpsNo'
      },
      {
        label: '打卡司机号',
        prop: 'icno'
      },
      {
        label: '机构号',
        prop: 'orgcode'
      },
      {
        label: '司机名称',
        prop: 'driverName'
      },
      {
        label: '事件',
        prop: 'speed'
      },
      {
        label: '经度',
        prop: 'startWebLng'
      },
      {
        label: '纬度',
        prop: 'startWebLat'
      }
    ]
  },
  // 胎压弹窗
  tyrePressure: {
    tipBarName: '参考胎压：4.0bar<正常<13.0bar',
    tipTemperatureName: '参考胎温：  ≥85℃（高）',
    tipNumBerName: '轮数：  ',
    timeName: '时间：',
    axis: '#轴',
    round: '号轮',
    notInstalled: '未安装',
    normal: '正常',
    abnormal: '异常',
    viewReport: '查看报表',
    temperature: '温度',
    pressure: '胎压'
  },
  // 日志监控
  watchLog: {
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        showcheck: true,
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      msgIds: {
        label: '消息Id：',
        type: 'selectAll',
        model: [''],
        placeholder: '请选择监听类型',
        width: '200px !important',
        key: {
          value: 'value',
          label: 'label'
        },
        list: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '终端通用应答',
            value: '1'
          },
          {
            label: '终端心跳',
            value: '2'
          },
          {
            label: '位置信息汇报',
            value: '512'
          },
          {
            label: 'CAN总线数据上传',
            value: '1797'
          },
          {
            label: '数据上行透传',
            value: '2304'
          }
        ]
      }
    },
    tableTitle: [
      {
        label: 'hex',
        prop: 'hex',
        width: '800'
      }
    ],
    tableMoreConList: [
      {
        label: 'hex',
        prop: 'hex',
        width: true
      }
    ],
    msgId: '请输入id，id为数字且用逗号隔开',
    vehPlateNo: '车牌号：',
    vehTerminalNo: '终端号：',
    msgId: '消息Id：'
  },
  // 安全报警处理
  handAlarm: {
    curTitle: '安全报警处理',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        showcheck: true,
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      },
      handle: {
        label: '处理情况：',
        type: 'select1',
        model: '',
        default: '',
        list: [
          {
            value: '',
            label: '全部'
          },
          {
            value: 1,
            label: '已处理'
          },
          {
            value: 0,
            label: '未处理'
          }
        ]
      },
      ageerType: {
        label: '协议类型：',
        type: 'select1',
        model: 0,
        default: 0,
        isHide: true,
        list: [
          {
            value: 0,
            label: '苏标'
          },
          {
            value: 1,
            label: '私有协议'
          }
        ]
      },
      alarmLevel: {
        label: '报警等级：',
        type: 'select1',
        model: '',
        default: '',
        list: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '1级',
            label: '一级报警'
          },
          {
            value: '2级',
            label: '二级报警'
          }
        ]
      },
      alarmType: {
        label: '报警类型：',
        type: 'tree',
        model: '',
        showcheck: true,
        filter: true,
        placeholder: '请选择报警类型',
        tree: [
          {
            label: '主动安全(ADAS)',
            id: '0',
            type: 1,
            options: [
              {
                id: '前向碰撞报警',
                label: '前向碰撞报警',
                type: 2
              },
              {
                id: '车道偏离报警',
                label: '车道偏离报警',
                type: 2
              },
              {
                id: '车距过近报警',
                label: '车距过近报警',
                type: 2
              },
              // {
              //   id: '行人碰撞报警',
              //   label: '行人碰撞报警',
              //   type: 2
              // },
              {
                id: '频繁变道',
                label: '频繁变道',
                type: 2
              },
              // {
              //   id: '道路标识超限报警',
              //   label: '道路标识超限报警',
              //   type: 2
              // },
              // {
              //   id: '障碍物报警',
              //   label: '障碍物报警',
              //   type: 2
              // },
              // {
              //   id: '道路标志识别事件',
              //   label: '道路标志识别事件',
              //   type: 2
              // },
              // {
              //   id: '主动抓拍事件',
              //   label: '主动抓拍事件',
              //   type: 2
              // }
            ]
          },
          {
            label: '异常行驶(DSM)',
            id: '1',
            type: 1,
            options: [
              {
                id: '疲劳驾驶报警',
                label: '疲劳驾驶报警',
                type: 2
              },
              {
                id: '接打电话报警',
                label: '接打电话报警',
                type: 2
              },
              {
                id: '抽烟报警',
                label: '抽烟报警',
                type: 2
              },
              {
                id: '分神驾驶报警',
                label: '分神驾驶报警',
                type: 2
              },
              {
                id: '驾驶员异常报警',
                label: '驾驶员异常报警',
                type: 2
              },
              // {
              //   id: '自动抓拍事件',
              //   label: '自动抓拍事件',
              //   type: 2
              // },
              {
                id: '驾驶员变更事件',
                label: '驾驶员变更事件',
                type: 2
              }
            ]
          }
        ],
        defaultProps: {
          children: 'options',
          label: 'label'
        }
      },
      alarmType2: {
        label: '报警类型：',
        type: 'tree',
        model: '',
        showcheck: true,
        filter: true,
        isHide: true,
        placeholder: '请选择报警类型',
        tree: [
          {
            label: '主动安全(ADAS)',
            id: '0',
            type: 1,
            options: [
              {
                id: '前车碰撞预警',
                label: '前车碰撞预警',
                type: 2
              },
              {
                id: '道路偏离预警',
                label: '道路偏离预警',
                type: 2
              },
              {
                id: '行人检测预警',
                label: '行人检测预警',
                type: 2
              },
              {
                id: '驾驶员遮挡或镜头偏离位置',
                label: '驾驶员遮挡或镜头偏离位置',
                type: 2
              },
              {
                id: '不系安全带',
                label: '不系安全带',
                type: 2
              },
              {
                id: '车距近',
                label: '车距近',
                type: 2
              },
              {
                id: '急刹车',
                label: '急刹车',
                type: 2
              },
              {
                id: '急左转弯',
                label: '急左转弯',
                type: 2
              },
              {
                id: '急右转弯',
                label: '急右转弯',
                type: 2
              }
            ]
          },
          {
            label: '异常行驶(DSM)',
            id: '1',
            type: 1,
            options: [
              {
                id: '面向警示',
                label: '面向警示',
                type: 2
              },
              {
                id: '闭眼警示',
                label: '闭眼警示',
                type: 2
              },
              {
                id: '手机警示',
                label: '手机警示',
                type: 2
              },
              {
                id: '抽烟警示',
                label: '抽烟警示',
                type: 2
              },
              {
                id: '离岗警示',
                label: '离岗警示',
                type: 2
              },
              {
                id: '左顾右盼',
                label: '左顾右盼',
                type: 2
              },
              {
                id: '打哈欠',
                label: '打哈欠',
                type: 2
              },
              {
                id: '低头',
                label: '低头',
                type: 2
              }
            ]
          }
        ],
        defaultProps: {
          children: 'options',
          label: 'label'
        }
      }
    },
    tableTitle: [
      {
        label: '操作',
        prop: 'act',
        act: true,
        width: '100'
      },
      {
        label: '拷贝',
        prop: 'copy',
        icon: 'el-icon-printer',
        act: true,
        width: '100'
      },
      {
        label: '车牌号',
        prop: 'devIdno',
        width: '140'
      },
      {
        label: '部门名称',
        prop: 'dptName',
        width: '200'
      },
      {
        label: '报警类型',
        prop: 'alarmDisplay',
        width: '160'
      },
      {
        label: '开始时间',
        prop: 'stm',
        width: '160',
        sort: true
      },
      {
        label: '结束时间',
        prop: 'etm',
        width: '160',
        sort: true
      },
      {
        label: '持续时间',
        prop: 'alarmDuration',
        width: '100',
        sort: true
      },
      {
        label: '报警级别',
        prop: 'alarmLevel',
        width: '120'
      },
      {
        label: '报警来源',
        prop: 'vehResoure',
        width: '160'
      },
      {
        label: '报警位置',
        prop: 'address',
        click: true,
        width: '100'
      },
      {
        label: '处理情况',
        prop: 'isHd',
        width: '120'
      },
      {
        label: '处理用户',
        prop: 'alarmHandler',
        width: '120'
      },
      {
        label: '处理时间',
        prop: 'hdt',
        width: '160'
      },
      {
        label: '处理意见',
        prop: 'alarmHandleContent',
        width: '160'
      }
    ],
    other: {
      code: {
        label: '编号：',
        val: ''
      },
      dptName: {
        label: '部门：',
        val: ''
      },
      vehPlateNo: {
        label: '车牌号：',
        val: ''
      },
      speed: {
        label: '行驶速度：',
        val: '',
        unit: 'Km/h'
      },
      speed: {
        label: '行驶速度：',
        val: '',
        unit: 'Km/h'
      },
      stm: {
        label: '生成时间：',
        val: ''
      },
      alaType: {
        label: '风险事件：',
        val: ''
      },
      url: {
        label: '请点击',
        val: '',
        unit: '点击查看风险详情，请跟进，谢谢'
      }
    }
  },
  // 主动安全证据查询
  queryAlarm: {
    curTitle: '安全证据查询',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        showcheck: true,
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      },
      mediaType: {
        label: '多媒体类型：',
        type: 'select1',
        model: -1,
        default: -1,
        list: [
          {
            value: -1,
            label: '全部'
          },
          {
            value: 0,
            label: '图片'
          },
          {
            value: 1,
            label: '视频'
          }
        ]
      },
      ageerType: {
        label: '协议类型：',
        type: 'select1',
        model: 0,
        default: 0,
        isHide: true,
        list: [
          {
            value: 0,
            label: '苏标'
          },
          {
            value: 1,
            label: '私有协议'
          }
        ]
      },
      alarmType: {
        label: '报警类型：',
        type: 'tree',
        model: '',
        showcheck: true,
        filter: true,
        placeholder: '请选择报警类型',
        tree: [
          {
            label: '主动安全(ADAS)',
            id: '0',
            type: 1,
            options: [
              {
                id: '600,601,650,651',
                label: '前向碰撞报警',
                type: 2
              },
              {
                id: '602,603,652,653',
                label: '车道偏离报警',
                type: 2
              },
              {
                id: '604,605,654,655',
                label: '车距过近报警',
                type: 2
              },
              // {
              //   id: '606,607,656,657',
              //   label: '行人碰撞报警',
              //   type: 2
              // },
              {
                id: '608,609,658,659',
                label: '频繁变道',
                type: 2
              },
              // {
              //   id: '610,611,660,661',
              //   label: '道路标识超限报警',
              //   type: 2
              // },
              // {
              //   id: '612,613,662,663',
              //   label: '障碍物报警',
              //   type: 2
              // },
              // {
              //   id: '614,615,664,665',
              //   label: '道路标志识别事件',
              //   type: 2
              // },
              // {
              //   id: '616,617,666,667',
              //   label: '主动抓拍事件',
              //   type: 2
              // }
            ]
          },
          {
            label: '异常行驶(DSM)',
            id: '1',
            type: 1,
            options: [
              {
                id: '618,619,668,669',
                label: '疲劳驾驶报警',
                type: 2
              },
              {
                id: '620,621,670,671',
                label: '接打电话报警',
                type: 2
              },
              {
                id: '622,623,672,673',
                label: '抽烟报警',
                type: 2
              },
              {
                id: '624,625,674,675',
                label: '分神驾驶报警',
                type: 2
              },
              {
                id: '626,627,676,677',
                label: '驾驶员异常报警',
                type: 2
              },
              // {
              //   id: '628,629,678,679',
              //   label: '自动抓拍事件',
              //   type: 2
              // },
              {
                id: '630,631,680,681',
                label: '驾驶员变更事件',
                type: 2
              }
            ]
          }
        ],
        defaultProps: {
          children: 'options',
          label: 'label'
        }
      },
      alarmType2: {
        label: '报警类型：',
        type: 'tree',
        model: '',
        showcheck: true,
        filter: true,
        isHide: true,
        placeholder: '请选择报警类型',
        tree: [
          {
            label: '主动安全(ADAS)',
            id: '0',
            type: 1,
            options: [
              {
                id: '400,450',
                label: '前车碰撞预警',
                type: 2
              },
              {
                id: '401,451',
                label: '道路偏离预警',
                type: 2
              },
              {
                id: '402,452',
                label: '行人检测预警',
                type: 2
              },
              {
                id: '403,453',
                label: '驾驶员遮挡或镜头偏离位置',
                type: 2
              },
              {
                id: '404,454',
                label: '不系安全带',
                type: 2
              },
              {
                id: '406,456',
                label: '车距近',
                type: 2
              },
              {
                id: '407,457',
                label: '急刹车',
                type: 2
              },
              {
                id: '408,458',
                label: '急左转弯',
                type: 2
              },
              {
                id: '409,459',
                label: '急右转弯',
                type: 2
              }
            ]
          },
          {
            label: '异常行驶(DSM)',
            id: '1',
            type: 1,
            options: [
              {
                id: '170,171',
                label: '面向警示',
                type: 2
              },
              {
                id: '172,173',
                label: '闭眼警示',
                type: 2
              },
              {
                id: '174,175',
                label: '手机警示',
                type: 2
              },
              {
                id: '176,177',
                label: '抽烟警示',
                type: 2
              },
              {
                id: '186,187',
                label: '离岗警示',
                type: 2
              },
              {
                id: '188,189',
                label: '左顾右盼',
                type: 2
              },
              {
                id: '190,191',
                label: '打哈欠',
                type: 2
              },
              {
                id: '410,460',
                label: '低头',
                type: 2
              }
            ]
          }
        ],
        defaultProps: {
          children: 'options',
          label: 'label'
        }
      }
    }
  },
  // 车辆报警分析
  alarmAnalys: {
    curTitle: '车辆报警分析',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        showcheck: true,
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      },
      ageerType: {
        label: '协议类型：',
        type: 'select1',
        model: 0,
        default: 0,
        isHide: true,
        list: [
          {
            value: 0,
            label: '苏标'
          },
          {
            value: 1,
            label: '私有协议'
          }
        ]
      },
      alarmLevel: {
        label: '报警等级：',
        type: 'select1',
        model: '',
        default: '',
        isHide: true,
        list: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '1级',
            label: '一级报警'
          },
          {
            value: '2级',
            label: '二级报警'
          }
        ]
      },
      alarmType: {
        label: '报警类型：',
        type: 'tree',
        model: '',
        showcheck: true,
        isHide: true,
        filter: true,
        placeholder: '请选择报警类型',
        tree: [
          {
            label: '主动安全(ADAS)',
            id: '0',
            type: 1,
            options: [
              {
                id: '前向碰撞报警',
                label: '前向碰撞报警',
                type: 2
              },
              {
                id: '车道偏离报警',
                label: '车道偏离报警',
                type: 2
              },
              {
                id: '车距过近报警',
                label: '车距过近报警',
                type: 2
              },
              // {
              //   id: '行人碰撞报警',
              //   label: '行人碰撞报警',
              //   type: 2
              // },
              {
                id: '频繁变道',
                label: '频繁变道',
                type: 2
              },
              // {
              //   id: '道路标识超限报警',
              //   label: '道路标识超限报警',
              //   type: 2
              // },
              // {
              //   id: '障碍物报警',
              //   label: '障碍物报警',
              //   type: 2
              // },
              // {
              //   id: '道路标志识别事件',
              //   label: '道路标志识别事件',
              //   type: 2
              // },
              // {
              //   id: '主动抓拍事件',
              //   label: '主动抓拍事件',
              //   type: 2
              // }
            ]
          },
          {
            label: '异常行驶(DSM)',
            id: '1',
            type: 1,
            options: [
              {
                id: '疲劳驾驶报警',
                label: '疲劳驾驶报警',
                type: 2
              },
              {
                id: '接打电话报警',
                label: '接打电话报警',
                type: 2
              },
              {
                id: '抽烟报警',
                label: '抽烟报警',
                type: 2
              },
              {
                id: '分神驾驶报警',
                label: '分神驾驶报警',
                type: 2
              },
              {
                id: '驾驶员异常报警',
                label: '驾驶员异常报警',
                type: 2
              },
              // {
              //   id: '自动抓拍事件',
              //   label: '自动抓拍事件',
              //   type: 2
              // },
              {
                id: '驾驶员变更事件',
                label: '驾驶员变更事件',
                type: 2
              }
            ]
          }
        ],
        defaultProps: {
          children: 'options',
          label: 'label'
        }
      },
      alarmType2: {
        label: '报警类型：',
        type: 'tree',
        model: '',
        showcheck: true,
        filter: true,
        isHide: true,
        placeholder: '请选择报警类型',
        tree: [
          {
            label: '主动安全(ADAS)',
            id: '0',
            type: 1,
            options: [
              {
                id: '前车碰撞预警',
                label: '前车碰撞预警',
                type: 2
              },
              {
                id: '道路偏离预警',
                label: '道路偏离预警',
                type: 2
              },
              {
                id: '行人检测预警',
                label: '行人检测预警',
                type: 2
              },
              {
                id: '驾驶员遮挡或镜头偏离位置',
                label: '驾驶员遮挡或镜头偏离位置',
                type: 2
              },
              {
                id: '不系安全带',
                label: '不系安全带',
                type: 2
              },
              {
                id: '车距近',
                label: '车距近',
                type: 2
              },
              {
                id: '急刹车',
                label: '急刹车',
                type: 2
              },
              {
                id: '急左转弯',
                label: '急左转弯',
                type: 2
              },
              {
                id: '急右转弯',
                label: '急右转弯',
                type: 2
              }
            ]
          },
          {
            label: '异常行驶(DSM)',
            id: '1',
            type: 1,
            options: [
              {
                id: '面向警示',
                label: '面向警示',
                type: 2
              },
              {
                id: '闭眼警示',
                label: '闭眼警示',
                type: 2
              },
              {
                id: '手机警示',
                label: '手机警示',
                type: 2
              },
              {
                id: '抽烟警示',
                label: '抽烟警示',
                type: 2
              },
              {
                id: '离岗警示',
                label: '离岗警示',
                type: 2
              },
              {
                id: '左顾右盼',
                label: '左顾右盼',
                type: 2
              },
              {
                id: '打哈欠',
                label: '打哈欠',
                type: 2
              },
              {
                id: '低头',
                label: '低头',
                type: 2
              }
            ]
          }
        ],
        defaultProps: {
          children: 'options',
          label: 'label'
        }
      }
    },
    tableTitle: [
      {
        label: '车牌号',
        prop: 'plateNo',
        width: '140'
      },
      {
        label: '终端号',
        prop: 'vehTerminalNo',
        width: '140'
      },
      {
        label: '部门名称',
        prop: 'dptName',
        width: '180'
      },
      {
        label: '开始时间',
        prop: 'beginDateTime',
        width: '160'
      },
      {
        label: '疲劳驾驶报警1级(次)',
        alarmValue: '疲劳驾驶报警',
        prop: 'fatigueDriving1Count',
        width: '160',
        sort: true,
        isButton: true
      },
      {
        label: '疲劳驾驶报警2级(次)',
        alarmValue: '疲劳驾驶报警',
        prop: 'fatigueDriving2Count',
        width: '160',
        sort: true,
        isButton: true
      },
      {
        label: '接打电话报警1级(次)',
        alarmValue: '接打电话报警',
        prop: 'callPhone1Count',
        width: '160',
        sort: true,
        isButton: true
      },
      {
        label: '接打电话报警2级(次)',
        alarmValue: '接打电话报警',
        prop: 'callPhone2Count',
        width: '160',
        sort: true,
        isButton: true
      },
      {
        label: '抽烟报警1级(次)',
        alarmValue: '抽烟报警',
        prop: 'smoke1Count',
        width: '160',
        sort: true,
        isButton: true
      },
      {
        label: '抽烟报警2级(次)',
        alarmValue: '抽烟报警',
        prop: 'smoke2Count',
        width: '160',
        sort: true,
        isButton: true
      },
      {
        label: '分神驾驶报警1级(次)',
        alarmValue: '分神驾驶报警',
        prop: 'distraction1Count',
        width: '160',
        sort: true,
        isButton: true
      },
      {
        label: '分神驾驶报警2级(次)',
        alarmValue: '分神驾驶报警',
        prop: 'distraction2Count',
        width: '160',
        sort: true,
        isButton: true
      },
      {
        label: '车道偏离报警1级(次)',
        alarmValue: '车道偏离报警',
        prop: 'roadDeviation1Count',
        width: '160',
        sort: true,
        isButton: true
      },
      {
        label: '车道偏离报警2级(次)',
        alarmValue: '车道偏离报警',
        prop: 'roadDeviation2Count',
        width: '160',
        sort: true,
        isButton: true
      },
      {
        label: '前向碰撞报警1级(次)',
        alarmValue: '前向碰撞报警',
        prop: 'frontCollision1Count',
        width: '160',
        sort: true,
        isButton: true
      },
      {
        label: '前向碰撞报警2级(次)',
        alarmValue: '前向碰撞报警',
        prop: 'frontCollision2Count',
        width: '160',
        sort: true,
        isButton: true
      },
      // {
      //   label: '行人碰撞报警1级(次)',
      //   alarmValue: '行人碰撞报警',
      //   prop: 'pedestrianCollision1Count',
      //   width: '160',
      //   sort: true,
      //   isButton: true
      // },
      // {
      //   label: '行人碰撞报警2级(次)',
      //   alarmValue: '行人碰撞报警',
      //   prop: 'pedestrianCollision2Count',
      //   width: '160',
      //   sort: true,
      //   isButton: true
      // },
      {
        label: '车距过近报警1级(次)',
        alarmValue: '车距过近报警',
        prop: 'vehiclesCloser1Count',
        width: '160',
        sort: true,
        isButton: true
      },
      {
        label: '车距过近报警2级(次)',
        alarmValue: '车距过近报警',
        prop: 'vehiclesCloser2Count',
        width: '160',
        sort: true,
        isButton: true
      },
      {
        label: '驾驶员异常报警1级(次)',
        alarmValue: '驾驶员异常报警',
        prop: 'driverUnusual1Count',
        width: '160',
        sort: true,
        isButton: true
      },
      {
        label: '驾驶员异常报警2级(次)',
        alarmValue: '驾驶员异常报警',
        prop: 'driverUnusual2Count',
        width: '160',
        sort: true,
        isButton: true
      },
      {
        label: '其他报警(次)',
        alarmValue: '其他报警',
        prop: 'other',
        width: '160',
        sort: true,
        isButton: true
      }
    ],
    tableTitle2: [
      {
        label: '车牌号',
        prop: 'plateNo',
        width: '140'
      },
      {
        label: '终端号',
        prop: 'vehTerminalNo',
        width: '140'
      },
      {
        label: '部门名称',
        prop: 'dptName',
        width: '180'
      },
      {
        label: '前车碰撞预警(次)',
        alarmValue: '前车碰撞预警',
        prop: 'collision',
        width: '140',
        sort: true,
        isButton: true
      },
      {
        label: '道路偏离预警(次)',
        alarmValue: '道路偏离预警',
        prop: 'roadDeviation',
        width: '140',
        sort: true,
        isButton: true
      },
      {
        label: '行人检测预警(次)',
        alarmValue: '行人检测预警',
        prop: 'pedestrianDetection',
        width: '140',
        sort: true,
        isButton: true
      },
      {
        label: '车距近(次)',
        alarmValue: '车距近',
        prop: 'carDistance',
        width: '140',
        sort: true,
        isButton: true
      },
      {
        label: '面向警示(次)',
        alarmValue: '面向警示',
        prop: 'face',
        width: '140',
        sort: true,
        isButton: true
      },
      {
        label: '闭眼警示(次)',
        alarmValue: '闭眼警示',
        prop: 'closeEyes',
        width: '140',
        sort: true,
        isButton: true
      },
      {
        label: '离岗警示(次)',
        alarmValue: '离岗警示',
        prop: 'leavePost',
        width: '140',
        sort: true,
        isButton: true
      },
      {
        label: '左顾右盼(次)',
        alarmValue: '左顾右盼',
        prop: 'leftRightSee',
        width: '140',
        sort: true,
        isButton: true
      },
      {
        label: '打哈欠(次)',
        alarmValue: '打哈欠',
        prop: 'yawn',
        width: '140',
        sort: true,
        isButton: true
      },
      {
        label: '驾驶员遮挡或镜头偏离位置(次)',
        alarmValue: '驾驶员遮挡或镜头偏离位置',
        prop: 'shelterOrDeviate',
        width: '180',
        sort: true,
        isButton: true
      },
      {
        label: '不系安全带(次)',
        alarmValue: '不系安全带',
        prop: 'noSafetyBelt',
        width: '140',
        sort: true,
        isButton: true
      },
      {
        label: '低头(次)',
        alarmValue: '低头',
        prop: 'bow',
        width: '140',
        sort: true,
        isButton: true
      },
      {
        label: '手机警示(次)',
        alarmValue: '手机警示',
        prop: 'mobile',
        width: '140',
        sort: true,
        isButton: true
      },
      {
        label: '抽烟警示(次)',
        alarmValue: '抽烟警示',
        prop: 'smoking',
        width: '140',
        sort: true,
        isButton: true
      },
      {
        label: '其他报警(次)',
        alarmValue: '其他报警',
        prop: 'other2',
        width: '160',
        sort: true,
        isButton: true
      }
    ],
    pie: {
      name: '警报类型分布',
      alarmArr: [
        {
          value: 0,
          name: '疲劳驾驶报警2级',
          key: 'fatigueDriving2Count',
          bg: '#2f4554'
        },
        {
          value: 0,
          name: '疲劳驾驶报警1级',
          key: 'fatigueDriving1Count',
          bg: '#d53a35' // 背景颜色
        },
        {
          value: 0,
          name: '接打电话报警1级',
          key: 'callPhone1Count',
          bg: '#61a0a8'
        },
        {
          value: 0,
          name: '接打电话报警2级',
          key: 'callPhone2Count',
          bg: '#d48265'
        },
        {
          name: '抽烟报警1级',
          key: 'smoke1Count',
          value: 0,
          bg: '#91c7ae'
        },
        {
          name: '抽烟报警2级',
          key: 'smoke2Count',
          value: 0,
          bg: '#749f83'
        },
        {
          name: '分神驾驶报警1级',
          key: 'distraction1Count',
          value: 0,
          bg: '#ca8622'
        },
        {
          name: '分神驾驶报警2级',
          key: 'distraction2Count',
          value: 0,
          bg: '#bda29a'
        },
        {
          name: '车道偏离报警1级',
          key: 'roadDeviation1Count',
          value: 0,
          bg: '#6e7074'
        },
        {
          name: '车道偏离报警2级',
          key: 'roadDeviation2Count',
          value: 0,
          bg: '#546570'
        },
        {
          name: '前向碰撞报警1级',
          key: 'frontCollision1Count',
          value: 0,
          bg: '#c4ccd3'
        },
        {
          name: '前向碰撞报警2级',
          key: 'frontCollision2Count',
          value: 0,
          bg: '#c23531'
        },
        // {
        //   name: '行人碰撞报警1级',
        //   key: 'pedestrianCollision1Count',
        //   value: 0,
        //   bg: '#3f4664'
        // },
        // {
        //   name: '行人碰撞报警2级',
        //   key: 'pedestrianCollision2Count',
        //   value: 0,
        //   bg: '#61a0a8'
        // },
        {
          name: '车距过近报警1级',
          key: 'vehiclesCloser1Count',
          value: 0,
          bg: '#d48265'
        },
        {
          name: '车距过近报警2级',
          key: 'vehiclesCloser2Count',
          value: 0,
          bg: '#91c7ae'
        },
        {
          name: '驾驶员异常报警1级',
          key: 'driverUnusual1Count',
          value: 0,
          bg: '#749f83'
        },
        {
          name: '驾驶员异常报警2级',
          key: 'driverUnusual2Count',
          value: 0,
          bg: '#ca8622'
        },
        {
          name: '其他报警',
          key: 'other',
          value: 0,
          bg: '#d48265'
        }
      ],
      alarmArr2: [
        {
          value: 0,
          name: '前车碰撞预警',
          key: 'collision',
          bg: '#d53a35' // 背景颜色
        },
        {
          value: 0,
          name: '道路偏离预警',
          key: 'roadDeviation',
          bg: '#2f4554'
        },
        {
          value: 0,
          name: '行人检测预警',
          key: 'pedestrianDetection',
          bg: '#61a0a8'
        },
        {
          value: 0,
          name: '车距近',
          key: 'carDistance',
          bg: '#d48265'
        },
        {
          name: '面向警示',
          key: 'face',
          value: 0,
          bg: '#91c7ae'
        },
        {
          name: '闭眼警示',
          key: 'closeEyes',
          value: 0,
          bg: '#749f83'
        },
        {
          name: '离岗警示',
          key: 'leavePost',
          value: 0,
          bg: '#ca8622'
        },
        {
          name: '左顾右盼',
          key: 'leftRightSee',
          value: 0,
          bg: '#bda29a'
        },
        {
          name: '打哈欠',
          key: 'yawn',
          value: 0,
          bg: '#6e7074'
        },
        {
          name: '驾驶员遮挡或镜头偏离位置',
          key: 'shelterOrDeviate',
          value: 0,
          bg: '#546570'
        },
        {
          name: '不系安全带',
          key: 'noSafetyBelt',
          value: 0,
          bg: '#c4ccd3'
        },
        {
          name: '低头',
          key: 'bow',
          value: 0,
          bg: '#c23531'
        },
        {
          name: '手机警示',
          key: 'mobile',
          value: 0,
          bg: '#3f4664'
        },
        {
          name: '抽烟警示',
          key: 'smoking',
          value: 0,
          bg: '#61a0a8'
        },
        {
          name: '其他报警',
          key: 'other2',
          value: 0,
          bg: '#d48265'
        }
      ]
    },
    line: {
      title: '车辆报警分布图',
      title2: '车辆报警趋势图',
      name: '报警次数'
    }
  },
  // 主动安全证据
  zdaqzj: {
    curTitle: '主动安全证据',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        showcheck: true,
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      },
      handle: {
        label: '处理情况：',
        type: 'select1',
        model: '',
        default: '',
        list: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '1',
            label: '已处理'
          },
          {
            value: '0',
            label: '未处理'
          }
        ]
      },
      ageerType: {
        label: '协议类型：',
        type: 'select1',
        model: 0,
        default: 0,
        isHide: true,
        list: [
          {
            value: 0,
            label: '苏标'
          },
          {
            value: 1,
            label: '私有协议'
          }
        ]
      },
      alarmLevel: {
        label: '报警等级：',
        type: 'select1',
        model: '',
        default: '',
        list: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '1级',
            label: '一级报警'
          },
          {
            value: '2级',
            label: '二级报警'
          }
        ]
      },
      alarmType: {
        label: '报警类型：',
        type: 'tree',
        model: '',
        showcheck: true,
        filter: true,
        placeholder: '请选择报警类型',
        tree: [
          {
            label: '主动安全(ADAS)',
            id: '0',
            type: 1,
            options: [
              {
                id: '前向碰撞报警',
                label: '前向碰撞报警',
                type: 2
              },
              {
                id: '车道偏离报警',
                label: '车道偏离报警',
                type: 2
              },
              {
                id: '车距过近报警',
                label: '车距过近报警',
                type: 2
              },
              // {
              //   id: '行人碰撞报警',
              //   label: '行人碰撞报警',
              //   type: 2
              // },
              {
                id: '频繁变道',
                label: '频繁变道',
                type: 2
              },
              // {
              //   id: '道路标识超限报警',
              //   label: '道路标识超限报警',
              //   type: 2
              // },
              // {
              //   id: '障碍物报警',
              //   label: '障碍物报警',
              //   type: 2
              // },
              // {
              //   id: '道路标志识别事件',
              //   label: '道路标志识别事件',
              //   type: 2
              // },
              // {
              //   id: '主动抓拍事件',
              //   label: '主动抓拍事件',
              //   type: 2
              // }
            ]
          }
        ],
        defaultProps: {
          children: 'options',
          label: 'label'
        }
      },
      alarmType2: {
        label: '报警类型：',
        type: 'tree',
        model: '',
        showcheck: true,
        filter: true,
        isHide: true,
        placeholder: '请选择报警类型',
        tree: [
          {
            label: '主动安全(ADAS)',
            id: '0',
            type: 1,
            options: [
              {
                id: '前车碰撞预警',
                label: '前车碰撞预警',
                type: 2
              },
              {
                id: '道路偏离预警',
                label: '道路偏离预警',
                type: 2
              },
              {
                id: '行人检测预警',
                label: '行人检测预警',
                type: 2
              },
              {
                id: '驾驶员遮挡或镜头偏离位置',
                label: '驾驶员遮挡或镜头偏离位置',
                type: 2
              },
              {
                id: '不系安全带',
                label: '不系安全带',
                type: 2
              },
              {
                id: '车距近',
                label: '车距近',
                type: 2
              },
              {
                id: '急刹车',
                label: '急刹车',
                type: 2
              },
              {
                id: '急左转弯',
                label: '急左转弯',
                type: 2
              },
              {
                id: '急右转弯',
                label: '急右转弯',
                type: 2
              }
            ]
          },
          {
            label: '异常行驶(DSM)',
            id: '1',
            type: 1,
            options: [
              {
                id: '面向警示',
                label: '面向警示',
                type: 2
              },
              {
                id: '闭眼警示',
                label: '闭眼警示',
                type: 2
              },
              {
                id: '手机警示',
                label: '手机警示',
                type: 2
              },
              {
                id: '抽烟警示',
                label: '抽烟警示',
                type: 2
              },
              {
                id: '离岗警示',
                label: '离岗警示',
                type: 2
              },
              {
                id: '左顾右盼',
                label: '左顾右盼',
                type: 2
              },
              {
                id: '打哈欠',
                label: '打哈欠',
                type: 2
              },
              {
                id: '低头',
                label: '低头',
                type: 2
              }
            ]
          }
        ],
        defaultProps: {
          children: 'options',
          label: 'label'
        }
      }
    },
    tableTitle: [
      {
        label: '操作',
        prop: 'act',
        act: true,
        width: '100'
      },
      {
        label: '车牌号',
        prop: 'devIdno',
        width: '140'
      },
      {
        label: '部门名称',
        prop: 'dptName',
        width: '200'
      },
      {
        label: '报警类型',
        prop: 'alarmDisplay',
        width: '160'
      },
      {
        label: '开始时间',
        prop: 'stm',
        width: '160',
        sort: true
      },
      {
        label: '结束时间',
        prop: 'etm',
        width: '160',
        sort: true
      },
      {
        label: '持续时间',
        prop: 'alarmDuration',
        width: '100',
        sort: true
      },
      {
        label: '报警级别',
        prop: 'alarmLevel',
        width: '120'
      },
      {
        label: '报警来源',
        prop: 'vehResoure',
        width: '160'
      },
      {
        label: '报警位置',
        prop: 'address',
        click: true,
        width: '100'
      },
      {
        label: '处理情况',
        prop: 'isHd',
        width: '120'
      },
      {
        label: '处理用户',
        prop: 'alarmHandlerName',
        width: '120'
      },
      {
        label: '处理时间',
        prop: 'hdt',
        width: '160'
      },
      {
        label: '处理意见',
        prop: 'alarmHandleContent',
        width: '160'
      }
    ]
  },
  // 异常行驶证据
  ycxszj: {
    curTitle: '异常行驶证据',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        showcheck: true,
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      },
      handle: {
        label: '处理情况：',
        type: 'select1',
        model: '',
        default: '',
        list: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '1',
            label: '已处理'
          },
          {
            value: '0',
            label: '未处理'
          }
        ]
      },
      ageerType: {
        label: '协议类型：',
        type: 'select1',
        model: 0,
        default: 0,
        isHide: true,
        list: [
          {
            value: 0,
            label: '苏标'
          },
          {
            value: 1,
            label: '私有协议'
          }
        ]
      },
      alarmLevel: {
        label: '报警等级：',
        type: 'select1',
        model: '',
        default: '',
        list: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '1级',
            label: '一级报警'
          },
          {
            value: '2级',
            label: '二级报警'
          }
        ]
      },
      alarmType: {
        label: '报警类型：',
        type: 'tree',
        model: '',
        showcheck: true,
        filter: true,
        placeholder: '请选择报警类型',
        tree: [
          {
            label: '异常行驶(DSM)',
            id: '1',
            type: 1,
            options: [
              {
                id: '疲劳驾驶报警',
                label: '疲劳驾驶报警',
                type: 2
              },
              {
                id: '接打电话报警',
                label: '接打电话报警',
                type: 2
              },
              {
                id: '抽烟报警',
                label: '抽烟报警',
                type: 2
              },
              {
                id: '分神驾驶报警',
                label: '分神驾驶报警',
                type: 2
              },
              {
                id: '驾驶员异常报警',
                label: '驾驶员异常报警',
                type: 2
              },
              // {
              //   id: '自动抓拍事件',
              //   label: '自动抓拍事件',
              //   type: 2
              // },
              {
                id: '驾驶员变更事件',
                label: '驾驶员变更事件',
                type: 2
              }
            ]
          }
        ],
        defaultProps: {
          children: 'options',
          label: 'label'
        }
      },
      alarmType2: {
        label: '报警类型：',
        type: 'tree',
        model: '',
        showcheck: true,
        filter: true,
        isHide: true,
        placeholder: '请选择报警类型',
        tree: [
          {
            label: '主动安全(ADAS)',
            id: '0',
            type: 1,
            options: [
              {
                id: '前车碰撞预警',
                label: '前车碰撞预警',
                type: 2
              },
              {
                id: '道路偏离预警',
                label: '道路偏离预警',
                type: 2
              },
              {
                id: '行人检测预警',
                label: '行人检测预警',
                type: 2
              },
              {
                id: '驾驶员遮挡或镜头偏离位置',
                label: '驾驶员遮挡或镜头偏离位置',
                type: 2
              },
              {
                id: '不系安全带',
                label: '不系安全带',
                type: 2
              },
              {
                id: '车距近',
                label: '车距近',
                type: 2
              },
              {
                id: '急刹车',
                label: '急刹车',
                type: 2
              },
              {
                id: '急左转弯',
                label: '急左转弯',
                type: 2
              },
              {
                id: '急右转弯',
                label: '急右转弯',
                type: 2
              }
            ]
          },
          {
            label: '异常行驶(DSM)',
            id: '1',
            type: 1,
            options: [
              {
                id: '面向警示',
                label: '面向警示',
                type: 2
              },
              {
                id: '闭眼警示',
                label: '闭眼警示',
                type: 2
              },
              {
                id: '手机警示',
                label: '手机警示',
                type: 2
              },
              {
                id: '抽烟警示',
                label: '抽烟警示',
                type: 2
              },
              {
                id: '离岗警示',
                label: '离岗警示',
                type: 2
              },
              {
                id: '左顾右盼',
                label: '左顾右盼',
                type: 2
              },
              {
                id: '打哈欠',
                label: '打哈欠',
                type: 2
              },
              {
                id: '低头',
                label: '低头',
                type: 2
              }
            ]
          }
        ],
        defaultProps: {
          children: 'options',
          label: 'label'
        }
      }
    }
  },
   // 异常行驶证据
   ycxszjNew: {
    curTitle: '异常行驶证据',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        showcheck: true,
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      },
      handle: {
        label: '处理情况：',
        type: 'select1',
        model: '',
        default: '',
        list: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '1',
            label: '已处理'
          },
          {
            value: '0',
            label: '未处理'
          }
        ]
      },
      ageerType: {
        label: '协议类型：',
        type: 'select1',
        model: 0,
        default: 0,
        isHide: true,
        list: [
          {
            value: 0,
            label: '苏标'
          },
          {
            value: 1,
            label: '私有协议'
          }
        ]
      },
      alarmLevel: {
        label: '报警等级：',
        type: 'select1',
        model: '',
        default: '',
        list: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '1',
            label: '一级报警'
          },
          {
            value: '2',
            label: '二级报警'
          }
        ]
      },
      alarmType: {
        label: '报警类型：',
        type: 'tree',
        model: '',
        showcheck: true,
        filter: true,
        placeholder: '请选择报警类型',
        tree: [
          {
            label: '异常行驶(DSM)',
            id: '1',
            type: 1,
            options: [
              {
                id: '疲劳驾驶报警',
                label: '疲劳驾驶报警',
                type: 2
              },
              {
                id: '接打电话报警',
                label: '接打电话报警',
                type: 2
              },
              {
                id: '抽烟报警',
                label: '抽烟报警',
                type: 2
              },
              {
                id: '分神驾驶报警',
                label: '分神驾驶报警',
                type: 2
              },
              {
                id: '驾驶员异常报警',
                label: '驾驶员异常报警',
                type: 2
              },
              // {
              //   id: '自动抓拍事件',
              //   label: '自动抓拍事件',
              //   type: 2
              // },
              {
                id: '驾驶员变更事件',
                label: '驾驶员变更事件',
                type: 2
              }
            ]
          }
        ],
        defaultProps: {
          children: 'options',
          label: 'label'
        }
      },
      alarmType2: {
        label: '报警类型：',
        type: 'tree',
        model: '',
        showcheck: true,
        filter: true,
        isHide: true,
        placeholder: '请选择报警类型',
        tree: [
          {
            label: '主动安全(ADAS)',
            id: '0',
            type: 1,
            options: [
              {
                id: '前车碰撞预警',
                label: '前车碰撞预警',
                type: 2
              },
              {
                id: '道路偏离预警',
                label: '道路偏离预警',
                type: 2
              },
              {
                id: '行人检测预警',
                label: '行人检测预警',
                type: 2
              },
              {
                id: '驾驶员遮挡或镜头偏离位置',
                label: '驾驶员遮挡或镜头偏离位置',
                type: 2
              },
              {
                id: '不系安全带',
                label: '不系安全带',
                type: 2
              },
              {
                id: '车距近',
                label: '车距近',
                type: 2
              },
              {
                id: '急刹车',
                label: '急刹车',
                type: 2
              },
              {
                id: '急左转弯',
                label: '急左转弯',
                type: 2
              },
              {
                id: '急右转弯',
                label: '急右转弯',
                type: 2
              }
            ]
          },
          {
            label: '异常行驶(DSM)',
            id: '1',
            type: 1,
            options: [
              {
                id: '面向警示',
                label: '面向警示',
                type: 2
              },
              {
                id: '闭眼警示',
                label: '闭眼警示',
                type: 2
              },
              {
                id: '手机警示',
                label: '手机警示',
                type: 2
              },
              {
                id: '抽烟警示',
                label: '抽烟警示',
                type: 2
              },
              {
                id: '离岗警示',
                label: '离岗警示',
                type: 2
              },
              {
                id: '左顾右盼',
                label: '左顾右盼',
                type: 2
              },
              {
                id: '打哈欠',
                label: '打哈欠',
                type: 2
              },
              {
                id: '低头',
                label: '低头',
                type: 2
              }
            ]
          }
        ],
        defaultProps: {
          children: 'options',
          label: 'label'
        }
      }
    }
  },

  // 设备报警详情
  alarmDetails: {
    curTitle: '设备报警详情',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        showcheck: true,
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      startEndTime: {
        label: '报警时间：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      },
      alaType: {
        label: '报警类型：',
        type: 'tree',
        placeholder: '请选择报警类型',
        model: '',
        showcheck: true,
        defaultProps: {
          children: 'options',
          label: 'label'
        },
        tree: []
      },
      handle: {
        label: '报警状态：',
        type: 'select1',
        model: '',
        default: '',
        list: [
          {
            value: '',
            label: '全部'
          },
          {
            value: '1',
            label: '已处理'
          },
          {
            value: '0',
            label: '未处理'
          }
        ]
      },
      isAnalysis: {
        label: '地址解析：',
        type: 'select1',
        model: true,
        default: '',
        list: [
          {
            value: true,
            label: '解析'
          },
          {
            value: false,
            label: '不解析'
          }
        ]
      },
      duration: {
        label: '持续时间(秒)：',
        placeholder: '请输入持续时间',
        type: 'input',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '部门',
        prop: 'dptName',
        width: '200'
      },
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '处理状态',
        prop: 'alaStateText',
        isButton: true,
        width: '140'
      },
      {
        label: '报警类型',
        prop: 'alarmDisplay',
        width: '180'
      },         
      {
        label: '报警来源',
        prop: 'alarmCategory',
        width: '160'
      },
      {
        label: '速度(Km/h)',
        prop: 'gpsSpeed',
        width: '120'
      },
      {
        label: '开始位置',
        prop: 'startAddress',
        click: true,
        width: '100'
      },
      {
        label: '结束位置',
        prop: 'endAddress',
        click: true,
        width: '100'
      },
      {
        label: '报警开始时间',
        prop: 'gpsAlarmStartTime',
        width: '180',
        sort: true
      },
      {
        label: '报警结束时间',
        prop: 'alaTime',
        width: '180',
        sort: true
      },
      {
        label: '持续时间',
        prop: 'alarmDuration',
        width: '180',
        sort: true
      },
      // {
      //   label: '报警信息',
      //   prop: 'alarmDisplay',
      //   width: '320',
      // },
      {
        label: '处理时间',
        prop: 'alaHandleTime',
        width: '180'
      },
      {
        label: '处理人',
        prop: 'alarmHandler',
        width: '180'
      },
      {
        label: '处理意见',
        prop: 'alarmHandlerContent',
        width: '320'
      }
    ],
    newtableTitle: [
      {
        label: '部门',
        prop: 'departmentName',
        width: '200'
      },
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '140'
      },
      {
        label: '处理状态',
        prop: 'alaStateText',
        isButton: true,
        width: '140'
      },
      {
        label: '报警等级',
        prop: 'gpsAlarmLevel',
        width: '120'
      },   
      {
        label: '报警类型',
        prop: 'alarmDisplay',
        width: '180'
      },
      {
        label: '报警来源',
        prop: 'alarmCategory',
        width: '160'
      },
      {
        label: '开始速度(Km/h)',
        prop: 'startSpeed',
        width: '120'
      },
      {
        label: '结束速度(Km/h)',
        prop: 'endSpeed',
        width: '120'
      },     
      {
        label: '持续时间（s）',
        prop: 'alarmDuration',
        width: '180',
        sort: true
      }, 
      {
        label: '报警开始时间',
        prop: 'gpsAlarmStartTime',
        width: '180',
        sort: true
      },
      {
        label: '报警结束时间',
        prop: 'alaTime',
        width: '180',
        sort: true
      }, 
      {
        label: '开始位置',
        prop: 'sAddress',
        click: true,
        width: '100'
      },
      {
        label: '结束位置',
        prop: 'eAddress',
        click: true,
        width: '100'
      },         
      {
        label: '处理时间',
        prop: 'alarmHandleTime',
        width: '180'
      },
      {
        label: '处理人',
        prop: 'alarmHandlerName',
        width: '180'
      },
      {
        label: '处理意见',
        prop: 'alarmHandleContent',
        width: '320'
      }
    ]
  },
  // 单卡查询
  sinCardQuery: {
    curTitle: '单卡查询',
    searchList: {
      iccId: {
        label: '智能卡号：',
        type: 'input',
        model: '',
        placeholder: '请输入智能卡号'
      }
    },
    tableTitle: [
      {
        label: '所属账号',
        prop: 'accountName',
        width: '160'
      },
      {
        label: '主套餐激活时间',
        prop: 'activityTime',
        width: '160'
      },
      {
        label: '主套餐名称',
        prop: 'cardPackage',
        width: '160'
      },
      {
        label: '卡片规格',
        prop: 'cardType',
        width: '160'
      },
      {
        label: '到期时间',
        prop: 'expirationTime',
        width: '160'
      },
      {
        label: '激活时间',
        prop: 'firstActivityTime',
        width: '160'
      },
      {
        label: '叠加包到期时间',
        prop: 'flowExpriationTime',
        width: '160'
      },
      {
        label: '运营商',
        prop: 'operator',
        width: '160'
      },
      {
        label: '已用流量(M)',
        prop: 'outdata',
        width: '160'
      },
      {
        label: '主套餐编码',
        prop: 'packageCode',
        width: '160'
      },
      {
        label: '当前状态',
        prop: 'status',
        width: '160'
      },
      {
        label: '总流量(M)',
        prop: 'totaldata',
        width: '160'
      },
      {
        label: '更新时间',
        prop: 'updateTime',
        width: '160'
      },
      {
        label: '智能号码',
        prop: 'iccid',
        width: '160'
      },
      {
        label: 'imsi号',
        prop: 'imsi',
        width: '160'
      },
      {
        label: 'sim号',
        prop: 'msisdn',
        width: '160'
      }
    ]
  },
  // 多卡查询
  simAll: {
    curTitle: '多卡查询',
    state1: '激活',
    state2: '可激活',
    state3: '测试',
    state4: '停用',
    state5: '作废',
    searchList: {
      iccid: {
        label: '智能号码：',
        type: 'input',
        model: '',
        placeholder: '请输入智能号码'
      },
      imsi: {
        label: 'imsi号：',
        type: 'input',
        model: '',
        placeholder: '请输入imsi号'
      },
      msisdn: {
        label: 'sim号：',
        type: 'input',
        model: '',
        placeholder: '请输入sim号'
      }
    },
    tableTitle: [
      {
        label: '所属账号',
        prop: 'accountName',
        width: '120'
      },
      {
        label: '主套餐名称',
        prop: 'cardPackage',
        width: '180'
      },
      {
        label: '运营商',
        prop: 'operators',
        width: '100'
      },
      {
        label: '已用流量(M)',
        prop: 'outdata',
        width: '120'
      },
      {
        label: '总流量(M)',
        prop: 'totaldata',
        width: '100'
      },
      {
        label: '当前状态',
        prop: 'state',
        width: '100'
      },
      {
        label: '卡片规格',
        prop: 'cardType',
        width: '120'
      },
      {
        label: '智能号码',
        prop: 'iccid',
        width: '180'
      },
      {
        label: 'imsi号',
        prop: 'imsi',
        width: '160'
      },
      {
        label: 'sim号',
        prop: 'msisdn',
        width: '160'
      },
      {
        label: '更新时间',
        prop: 'updateTime',
        width: '160'
      },
      {
        label: '激活时间',
        prop: 'activityTime',
        width: '120'
      },
      {
        label: '到期时间',
        prop: 'expirationTime',
        width: '120'
      },
      {
        label: '流量到期时间',
        prop: 'flowExpriationTime',
        width: '120'
      }
    ]
  },
  // 30日每日流量查询
  dailyFlow30: {
    curTitle: '30日每日流量',
    searchList: {
      iccid: {
        label: '智能号码：',
        type: 'input',
        model: '',
        placeholder: '请输入智能号码'
      },
      imsi: {
        label: 'imsi号：',
        type: 'input',
        model: '',
        placeholder: '请输入imsi号'
      },
      msisdn: {
        label: 'sim号：',
        type: 'input',
        model: '',
        placeholder: '请输入sim号'
      }
    },
    tableTitle: [
      {
        label: '每日使用量(M)',
        prop: 'onedayUseData',
        width: '120'
      },
      {
        label: '日期',
        prop: 'days',
        width: '120'
      }
    ]
  },
  // 6个月账单信息查询
  sixMonthBill: {
    curTitle: '6个月账单信息',
    searchList: {
      iccid: {
        label: '智能号码：',
        type: 'input',
        model: '',
        placeholder: '请输入智能号码'
      },
      imsi: {
        label: 'imsi号：',
        type: 'input',
        model: '',
        placeholder: '请输入imsi号'
      },
      msisdn: {
        label: 'sim号：',
        type: 'input',
        model: '',
        placeholder: '请输入sim号'
      }
    },
    tableTitle: [
      {
        label: '充值金额(元)',
        prop: 'rechMoney',
        width: '120'
      },
      {
        label: '短信用量(条)',
        prop: 'msmUseCount',
        width: '120'
      },
      {
        label: '流量用量(M)',
        prop: 'useData',
        width: '120'
      },
      {
        label: '充值笔数',
        prop: 'rechNum',
        width: '120'
      },
      {
        label: '时间',
        prop: 'yearMonth',
        width: '120'
      }
    ]
  },
  // 地图标注
  mapAllMontior:{
    bandingSearchList:{
      allocation:{
        label: '状态：',        
        type: 'select1',         
        placeholder: '请选择',
        disabled: false,
        model: false,
        key: {
          value: 'value',
          id: 'label'
        },
        list: [
          {
            label: '未分配',
            value: false
          },
          {
            label: '已分配',
            value: true
          }                               
        ]
      },
      vehTerminalNo: {
        label: '车牌号：',
        type: 'input',
        model: '',
        placeholder: '请输入车牌号（支持模糊搜索）',         
        id:'',         
      },
      fenceOrg: {
        label: '所属机构：',        
        type: 'tree',
        model: '',
        placeholder: '请选择部门',
        tree: [],    
        orgcode:'', 
        curNode:{}, 
        defaultProps: {
          children: 'child',
          label: 'dptName'
        }
      },
    },
    searchList: {             
      fenceName: {
        label: '围栏名称：',
        type: 'input',
        model: '',
        placeholder: '请输入规则名称'
      },
      fenceOrg: {
        label: '所属机构：',        
        type: 'tree',
        model: '',
        placeholder: '请选择部门',
        tree: [],    
        orgcode:'',  
        defaultProps: {
          children: 'child',
          label: 'dptName'
        }
      },
      fenceRule: {
        label: '类型：',
        type: 'select1',
        placeholder: '请选择',
        disabled: false,
        model: '',
        key: {
          value: 'value',
          id: 'label'
        },
        list: [
          {
            label: '全部',
            value: ''
          },         
          {
            label: '进围栏报警',
            value: '10001'
          },
          {
            label: '出围栏报警',
            value: '10002'
          },
          {
            label: '围栏内停车超时报警',
            value: '10003'
          },
          {
            label: '围栏内超速报警',
            value: '10004'
          },
          {
            label: '线路偏离报警',
            value: '10005'
          }
        ]
      },   
      isActive: {
        label: '是否激活：',
        type: 'select1',
        placeholder: '请选择',
        disabled: false,
        model: null,
        key: {
          value: 'value',
          id: 'label'
        },
        list: [
          {
            label: '全部',
            value: null
          },
          {
            label: '激活',
            value: true
          },
          {
            label: '未激活',
            value: false
          }                     
        ]
      },  
      isPublic: {
        label: '是否公用：',
        type: 'select1',
        placeholder: '请选择',
        disabled: false,
        model: null,
        key: {
          value: 'value',
          id: 'label'
        },
        list: [
          {
            label: '全部',
            value: null
          },
          {
            label: '公用',
            value: true
          },
          {
            label: '私有',
            value: false
          }                     
        ]
      },       
     },         
    relationForm: {
      fenceName: {
        label: '围栏名称：',
        type: 'input',
        model: '',
        placeholder: '请输入规则名称'
      },
      fenceOrg: {
        label: '所属机构：',        
        type: 'tree',
        model: '',
        placeholder: '请选择部门',
        tree: [],    
        orgcode:'',  
        props: {
          children: 'child',
          label: 'dptName'
        }
      }, 
      fenceRule: {
        label: '报警规则：',
        type: 'select1',
        placeholder: '请选择',
        disabled: false,
        model: '',
        key: {
          value: 'value',
          id: 'label'
        },
        list: [         
          {
            label: '进围栏报警',
            value: '10001'
          },
          {
            label: '出围栏报警',
            value: '10002'
          },
          {
            label: '围栏内停车超时报警',
            value: '10003'
          },
          {
            label: '围栏内超速报警',
            value: '10004'
          },
          {
            label: '线路偏离报警',
            value: '10005'
          }
        ]
      },  
      fencestartTime:{        
        label: '开始日期：',
        type: 'date',
        pickType: true,
        placeholder: '请选择开始日期！',
        model: ''
      },        
      fenceDate:{        
        label: '有效期至：',
        type: 'date',
        pickType: true,
        placeholder: '请选择有效期，为空则默认永久有效！',
        model: ''
      },
      fenceStartTime: {
        label: '生效时间：',
        type: 'fixedTime',       
        pickerOptions: {
          start: '00:00',
          step: '01:00',
          end: '22:00'
        },
        default: '00:00',
        model: '00:00'
      },     
      fenceEndTime: {
        label: '至：',
        type: 'fixedTime',
        pickerOptions: {
          start: '01:00',
          step: '01:00',
          end: '23:00'
        },
        default: '23:00',
        model: '23:00'
      },     
      fenceLimitValue: {
        label: '限定值：',
        type: 'input',
        isHide: false,
        model: '',
        placeholder: '偏离距离（米）'
      },
      fencemarkType: {
        label: '围栏类型：',
        type: 'select1',
        placeholder: '可选择行政区域、自定义区域',
        disabled: false,
        model: "no",
        key: {
          value: 'value',
          id: 'label'
        },
        list: [
          {
            label: '自定义',
            value: "no"
          },
          {
            label: '行政区域',
            value: "yes"
          }           
        ]
      },
    },
    bandingTitle:[ 
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '120'
      },
      {
        label: '所属公司',
        prop: 'dptName',
        width: '160'
      },             
    ],   
    tableTitle: [
      {
        label: '围栏名称',
        prop: 'fenceName',
        width: '120'
      },
      {
        label: '部门名称',
        prop: 'dptName',
        width: '160'
      },
      {
        label: '围栏类型',
        prop: 'fenceAlarmRuleDisplay',
        width: '150'
      },
      {
        label: '形状',
        prop: 'markTypeDisplay',
        width: '120'        
      },
      {
        label: '是否激活',
        prop: 'isActive',
        width: '120'
      },
      {
        label: '是否公用',
        prop: 'isPublic',
        width: '120'
      },
      {
        label: '开始日期',
        prop: 'fenceStartDate',
        width: '160'
      },
      {
        label: '结束日期',
        prop: 'fenceEndDate',
        width: '160'
      },  
      {
        label: '开始时间',
        prop: 'fenceStartTime',
        width: '120'
      },
      {
        label: '结束时间',
        prop: 'fenceEndTime',
        width: '120'
      }, 
      {
        label: '操作',
        prop: 'disabled',    
        disabled:true,           
        width: '120',
        isActive:true,
        isPublic:true,
      },
           
    ]   
  },
  // 六个月充值详情
  sixMonthRecharge: {
    curTitle: '六个月充值详情',
    searchList: {
      iccid: {
        label: '智能号码：',
        type: 'input',
        model: '',
        placeholder: '请输入智能号码'
      },
      imsi: {
        label: 'imsi号：',
        type: 'input',
        model: '',
        placeholder: '请输入imsi号'
      },
      msisdn: {
        label: 'sim号：',
        type: 'input',
        model: '',
        placeholder: '请输入sim号'
      },
      createDate: {
        label: '月份：',
        width: '180px',
        type: 'month',
        placeholder: '请选择要查询的月份',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '套餐名称',
        prop: 'packageName',
        width: '120'
      },
      {
        label: '智能号码',
        prop: 'iccid',
        width: '120'
      },
      {
        label: '金额',
        prop: 'money',
        width: '120'
      },
      {
        label: '运营商',
        prop: 'operator',
        width: '120'
      },
      {
        label: '来源',
        prop: 'source',
        width: '120'
      },
      {
        label: '状态',
        prop: 'rechargeStatus',
        width: '120'
      },
      {
        label: '时间',
        prop: 'createTime',
        width: '120'
      }
    ]
  },
  // 90天短信内容
  sms90DaysContent: {
    curTitle: '90天短信内容',
    searchList: {
      iccid: {
        label: '智能号码：',
        type: 'input',
        model: '',
        placeholder: '请输入智能号码'
      },
      imsi: {
        label: 'imsi号：',
        type: 'input',
        model: '',
        placeholder: '请输入imsi号'
      },
      msisdn: {
        label: 'sim号：',
        type: 'input',
        model: '',
        placeholder: '请输入sim号'
      }
    },
    tableTitle: [
      {
        label: '智能号码',
        prop: 'iccid',
        width: '180'
      },
      {
        label: 'sim号',
        prop: 'msisdn',
        width: '120'
      },
      {
        label: '操作人',
        prop: 'operationUserName',
        width: '210'
      },
      {
        label: '流水号',
        prop: 'messageNo',
        width: '240'
      },
      {
        label: '短信内容',
        prop: 'content',
        width: '180'
      },
      {
        label: '状态',
        prop: 'sendState',
        width: '100'
      },
      {
        label: '类型',
        prop: 'type',
        width: '100'
      },
      {
        label: '操作来源',
        prop: 'source',
        width: '100'
      },
      {
        label: '时间',
        prop: 'createTime2',
        width: '160'
      },
      {
        label: '备注',
        prop: 'remarks',
        width: '160'
      }
    ]
  },
  sms90DaysCount: {
    curTitle: '90天短信数量',
    label: '短信条数：',
    searchList: {
      iccid: {
        label: '智能号码：',
        type: 'input',
        model: '',
        placeholder: '请输入智能号码'
      },
      imsi: {
        label: 'imsi号：',
        type: 'input',
        model: '',
        placeholder: '请输入imsi号'
      },
      msisdn: {
        label: 'sim号：',
        type: 'input',
        model: '',
        placeholder: '请输入sim号'
      }
    }
  },
  // 流量池清单查询
  findPools: {
    curTitle: '流量池清单',
    searchList: {
      iccid: {
        label: '智能号码：',
        type: 'input',
        model: '',
        placeholder: '请输入智能号码'
      }
    },
    tableTitle: [
      {
        label: '卡池名称',
        prop: 'poolName',
        width: '160'
      },
      {
        label: '卡池编码',
        prop: 'poolNumber',
        width: '180'
      }
    ]
  },
  // 流量池详情查询
  poolInfo: {
    curTitle: '流量池详情',
    searchList: {
      poolNumber: {
        label: '卡池编码：',
        type: 'input',
        model: '',
        placeholder: '请输入卡池编码'
      }
    },
    tableTitle: [
      {
        label: '卡池名称',
        prop: 'poolName',
        width: '160'
      },
      {
        label: '卡池编码',
        prop: 'poolNumber',
        width: '180'
      },
      {
        label: '卡片数量',
        prop: 'cardNumber',
        width: '100'
      },
      {
        label: '联系人手机号',
        prop: 'contactPhone',
        width: '120'
      },
      {
        label: '卡池总量',
        prop: 'dataControl',
        width: '100'
      },
      {
        label: '卡池总使用量',
        prop: 'dataUsage',
        width: '120'
      },
      {
        label: '运营商',
        prop: 'operator1',
        width: '100'
      },
      {
        label: '卡池状态',
        prop: 'poolStatus',
        width: '100'
      },
      {
        label: '卡池套餐名称',
        prop: 'salesName',
        width: '180'
      },
      {
        label: '预警百分比',
        prop: 'warningPercent',
        width: '100'
      },
      {
        label: '创建时间',
        prop: 'createTime',
        width: '120'
      },
      {
        label: '备注',
        prop: 'remarks',
        width: '180'
      }
    ]
  },
  // 单卡某月所有短信记录
  smsContent: {
    curTitle: '某月短信记录',
    searchList: {
      iccid: {
        label: '智能号码：',
        type: 'input',
        model: '',
        placeholder: '请输入智能号码'
      },
      imsi: {
        label: 'imsi号：',
        type: 'input',
        model: '',
        placeholder: '请输入imsi号'
      },
      msisdn: {
        label: 'sim号：',
        type: 'input',
        model: '',
        placeholder: '请输入sim号'
      },
      yearMonth: {
        label: '月份：',
        width: '180px',
        type: 'month',
        placeholder: '请选择要查询的月份',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '智能卡号',
        prop: 'iccid',
        width: '160'
      },
      {
        label: 'sim号',
        prop: 'msisdn',
        width: '160'
      },
      {
        label: '类型',
        prop: 'type',
        width: '160'
      },
      {
        label: '状态',
        prop: 'sendState',
        width: '160'
      },
      {
        label: '操作人',
        prop: 'operationUserName',
        width: '160'
      },
      {
        label: '流水号',
        prop: 'messageNo',
        width: '160'
      },
      {
        label: '操作来源',
        prop: 'source',
        width: '160'
      },
      {
        label: '短信内容',
        prop: 'content',
        width: '160'
      },
      {
        label: '时间',
        prop: 'createTime',
        width: '160'
      }
    ]
  },
  simExcessFlow: {
    curTitle: 'sim卡超流80%',
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '160'
      },
      {
        label: '已用流量(M)',
        prop: 'outdata',
        width: '160'
      },
      {
        label: '总流量',
        prop: 'totaldata',
        width: '160'
      },
      {
        label: '剩余流量',
        prop: 'remainingTraffic',
        width: '160'
      },
      {
        label: 'sim卡',
        prop: 'sysSimId',
        width: '160'
      },
      {
        label: '月份',
        prop: 'month',
        width: '160'
      },
      {
        label: '比例',
        prop: 'rate',
        width: '160'
      }
    ]
  },
  // 任务纬度
  taskLatitude: {
    curTitle: '任务纬度',
    reviseTitle: '修改任务',
    searchList: {
      vehPlateNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        showcheck: true,
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      deliveryTime: {
        label: '发货时间：',
        type: 'date',
        width: '180px',
        model: ''
      },
      isCompeleted: {
        label: '是否完成：',
        type: 'select1',
        model: '',
        default: '',
        key: {
          value: 'value',
          id: 'label'
        },
        list: [
          {
            value: '',
            label: '全部'
          },
          {
            value: true,
            label: '已完成'
          },
          {
            value: false,
            label: '未完成'
          }
        ]
      }
    },
    tableTitle: [
      {
        label: '查看事件',
        prop: 'handBtn',
        width: '80',
        click: true
      },
      {
        label: '载重详情',
        prop: 'handDetails',
        width: '80',
        click: true
      },
      {
        label: '审核',
        prop: 'setBtn',
        width: '80',
        click: true
      },
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '120'
      },
      {
        label: '预计出厂时间',
        prop: 'dueDeliveryTime',
        width: '160'
      },
      {
        label: '出厂时间',
        prop: 'deliveryTime',
        width: '160'
      },
      {
        label: '预计到达时间',
        prop: 'dueArrivalTime',
        width: '160'
      },
      {
        label: '到达时间',
        prop: 'arrivalTime',
        width: '160'
      },
      {
        label: '车辆来源机构',
        prop: 'vehicleFromAgency',
        width: '120'
      },
      {
        label: '客户名称',
        prop: 'customerName',
        width: '100'
      },
      {
        label: '产品名称',
        prop: 'productName',
        width: '120'
      },
      {
        label: '发货单号',
        prop: 'trackingNumber',
        width: '100'
      },
      {
        label: '发货数量',
        prop: 'deliveryWeight',
        width: '100'
      },
      {
        label: '包装',
        prop: 'packageNew',
        width: '180'
      },
      {
        label: '任务所属机构',
        prop: 'departmentName',
        width: '100'
      },
      {
        label: '发货区域',
        prop: 'loadArea',
        width: '120'
      },
      {
        label: '卸货区域',
        prop: 'unLoadArea',
        width: '120'
      },
      {
        label: '任务来源',
        prop: 'taskSourceNew',
        width: '120'
      },
      {
        label: '任务完成用时',
        prop: 'taskCompletedTimeSpan',
        width: '120'
      },
      {
        label: '是否异常',
        prop: 'isAbnormalNew',
        width: '120'
      },
      {
        label: '系统初审',
        prop: 'systemFirstAuditNew',
        width: '120'
      },
      {
        label: '审核进度',
        prop: 'auditProgressNew',
        width: '120'
      },
      {
        label: '审判判定',
        prop: 'auditJudgeNew',
        width: '120'
      },
      {
        label: '调度状态',
        prop: 'schedulingNew',
        width: '120'
      },
      {
        label: '是否载重',
        prop: 'isWeightNew',
        width: '120'
      },
      {
        label: '创建时间',
        prop: 'createTime',
        width: '160'
      }
    ],
    listLi: {
      vehPlateNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        showcheck: false,
        props: {
          children: 'child',
          label: 'name'
        },
        tree: []
      },
      loadAreaCode: {
        label: '装货区域：',
        type: 'select1',
        model: '',
        key: {
          id: 'markName',
          value: 'id'
        },
        list: []
      },
      unLoadAreaCode: {
        label: '卸货区域：',
        type: 'select1',
        model: '',
        key: {
          id: 'markName',
          value: 'id'
        },
        list: []
      },
      vehicleFromAgency: {
        label: '车辆来源：',
        type: 'input',
        disabled: true,
        model: ''
      },
      dueDeliveryTime: {
        label: '预计出厂时间',
        type: 'time',
        model: '',
        disabled: true
      },
      dueArrivalTime: {
        label: '预计到达时间',
        type: 'time',
        model: '',
        disabled: true
      },
      customerName: {
        label: '客户名称：',
        type: 'input',
        disabled: true,
        model: ''
      },
      productName: {
        label: '产品名称：',
        type: 'input',
        disabled: true,
        model: ''
      },
      trackingNumber: {
        label: '发货单号：',
        type: 'input',
        disabled: true,
        model: ''
      },
      deliveryWeight: {
        label: '发货数量：',
        type: 'input',
        disabled: true,
        model: ''
      },
      departmentName: {
        label: '任务所属机构：',
        type: 'input',
        disabled: true,
        model: ''
      },
      package: {
        label: '包装:',
        type: 'select1',
        disabled: true,
        model: '',
        key: {
          id: 'value',
          value: 'label'
        },
        list: [
          {
            label: 0,
            value: '散装'
          },
          {
            label: 1,
            value: '袋装'
          }
        ]
      },
      taskSource: {
        label: '任务来源：',
        type: 'select1',
        disabled: true,
        model: '',
        key: {
          id: 'value',
          value: 'label'
        },
        list: [
          {
            label: 0,
            value: '接口对接'
          },
          {
            label: 1,
            value: '手工导入'
          },
          {
            label: 2,
            value: '系统算法'
          }
        ]
      },
      scheduling: {
        label: '调度状态：',
        type: 'select1',
        disabled: true,
        model: '',
        key: {
          id: 'value',
          value: 'label'
        },
        list: [
          {
            label: 0,
            value: '未调度'
          },
          {
            label: 1,
            value: '已调度'
          }
        ]
      },
      isWeight: {
        label: '是否载重：',
        type: 'select1',
        disabled: true,
        model: '',
        key: {
          id: 'value',
          value: 'label'
        },
        list: [
          {
            label: 0,
            value: '是'
          },
          {
            label: 1,
            value: '否'
          }
        ]
      }
    },
    mapping: {
      auditJudge: {
        0: '异常',
        1: '正常'
      },
      auditProgress: {
        0: '未审核',
        1: '进行中',
        2: '已完成'
      },
      systemFirstAudit: {
        0: '正常',
        1: '载重-围栏外卸货',
        2: 'GPS-围栏外卸货',
        3: '载重-卸货未尽',
        4: '超时结束-未卸货完成',
        5: '超时结束-未获取卸货事件',
        6: 'GPS 超时结束-未触发围栏',
        7: 'GPS 超时结束-未停留 30 分钟',
        8: 'GPS 超时结束-照片未全部上传',
        9: '超时结束-设备无数据',
        10: '未设置围栏'
      },
      isAbnormal: {
        0: '正常',
        1: '异常'
      },
      package: {
        0: '散装',
        1: '袋装'
      },
      auditState: {
        0: '已审核',
        1: '未审核'
      }
    },
    error: {
      areaCode: '发货区域和卸货区域不能相同！',
      dptRepeat: '部门不能重复！'
    },
    rules: {
      vehPlateNo: '请选择车牌号',
      loadAreaCode: '请选择装货区域',
      unLoadAreaCode: '请选择卸货区域'
    },
    buttons: {
      event: '查看事件',
      auditSettings: '审核设置',
      audit: '审核',
      toggle: '审核开关',
      dateils: '查看详情',
      trajectory: '轨迹回放'
    },
    auditLabel: {
      dpts: ['一级部门', '二级部门', '三级部门', '四级部门', '五级部门', '六级部门'],
      check: '允许上传照片'
    },
    examineLabel: {
      vehPlateNo: '车牌号',
      trackingNumber: '发货单号',
      departmentName: '任务发布机构',
      vehicleFromAgency: '车辆来源机构',
      package: '包装',
      deliveryWeight: '发货数量',
      customerName: '客户名称',
      loadArea: '装货区域',
      unLoadArea: '卸货区域',
      deliveryTime: '出厂时间',
      arrivalTime: '到达时间',
      systemFirstAudit: '审核信息',
      auditProgress: '审核进度'
    },
    titles: {
      task: '任务信息',
      examine: '审核信息'
    }
  },
  // 任务事件
  taskEvent: {
    curTitle: '任务事件',
     searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        showcheck: true,
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      type: {
        label: '事件类型：',
        type: 'select1',
        model: '',
        default: '',
        key: {
          value: 'value',
          id: 'label'
        },
        list: [
          {
            value: '',
            label: '全部'
          }
        ]
      }
    },
    tableTitle: [
      {
        label: '终端号',
        prop: 'venNo',
        width: '120'
      },
      {
        label: '事件名称',
        prop: 'name',
        width: '120'
      },
      {
        label: '持续事件',
        prop: 'durationMinutes',
        width: '120'
      },
      {
        label: '货物重量',
        prop: 'weight',
        width: '120'
      },
      {
        label: '事件发生时间',
        prop: 'eventTime',
        width: '160'
      },
      {
        label: '经度',
        prop: 'gpsWebLng',
        width: '120'
      },
      {
        label: '纬度',
        prop: 'gpsWebLat',
        width: '120'
      },
      {
        label: '定位地址',
        prop: 'address',
        width: '160'
      },
      {
        label: '查看位置',
        prop: 'handAddress',
        width: '120',
        click: true
      }
    ]
  },
  // 载重详情
  loadDetails: {
    curTitle: '载重详情',
    searchList: {
      vehTerminalNo: {
        label: '车牌号：',
        type: 'tree',
        model: '',
        showcheck: true,
        placeholder: '请选择车牌号',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      },
      dptName: {
        label: '部门：',
        type: 'tree',
        model: '',
        // showcheck: true,
        placeholder: '请选择部门',
        tree: [],
        defaultProps: {
          children: 'child',
          label: 'dptName'
        }
      },
      vehExpired: {
        label: '时间范围：',
        type: 'startEndTime',
        width: '346px',
        model: ''
      }
    },
    tableTitle: [
      {
        label: '车牌号',
        prop: 'vehPlateNo',
        width: '80'
      },
      {
        label: '终端号',
        prop: 'vehTerminalNo',
        width: '120'
      },
      {
        label: '部门',
        prop: 'departmentName',
        width: '120'
      },
      {
        label: '过磅重量（吨）',
        prop: 'weight',
        width: '80'
      },
      {
        label: '车辆自重',
        prop: 'vehicleWeight',
        width: '80'
      },
      {
        label: '最后过磅时间',
        prop: 'lastWeigthTime',
        width: '160'
      },
      {
        label: '更新时间',
        prop: 'updateTime',
        width: '160'
      },
      {
        label: '创建时间',
        prop: 'createTime',
        width: '160'
      }
    ]
  },
  // 配置引擎
  engine: {
    curTitle: '配置引擎',
    forms: [
      {
        key: 'arriveOverTimeMinute',
        label: '到达超时时间（分钟）',
        isCheck: false,
        check: false,
        checkText: '启用',
        val: '',
        msg: '到达超时事件，建议24或48小时'
      },
      {
        key: 'triggerUnloadAlarm',
        label: '触发卸货报警的最小变化重量（百分比）',
        isCheck: false,
        check: false,
        checkText: '启用',
        val: '',
        msg: '超过这个百分比的载重变化的才被任务是卸货'
      },
      {
        key: 'triggerUnloadUncompeleted',
        label: '触发卸货未尽报警的剩余重量（百分比）',
        isCheck: false,
        check: false,
        checkText: '启用',
        val: '',
        msg: '卸货后，载重大于这个百分比的认为是卸货未尽'
      },
      {
        key: 'unloadOverTime',
        label: '卸货超时（分钟）',
        isCheck: true,
        check: false,
        checkText: '启用',
        val: '',
        msg: '从出厂到载重量小于卸货未尽的设置被认为卸货完成'
      },
      {
        key: 'gpsOutsideFenceLoad',
        label: 'GPS围栏外卸货–超时停留（分钟）',
        isCheck: true,
        check: false,
        checkText: '启用',
        val: '',
        msg: '停留超过xx分钟'
      },
      {
        key: 'gpsOutsideFenceOffLine',
        label: 'GPS围栏外卸货–设备离线（分钟）',
        isCheck: true,
        check: false,
        checkText: '启用',
        val: '',
        msg: 'acc开，设备离线超过xx分钟'
      }
    ],
    other: {
      title: '基础设置'
    }
  },
  // 标定设置
  calibration: {
    curTitle: '标定配置',
    forms: [
      {
        key: 'emptyLoadADDiff',
        label: '空载AD差值（百分比）',
        isCheck: false,
        check: false,
        checkText: '启用',
        val: '',
        msg: '空载AD与标定的空载AD差值超过设置的比例阈值'
      },
      {
        key: 'fullLoadADDiff',
        label: '满载AD差值（百分比）',
        isCheck: false,
        check: false,
        checkText: '启用',
        val: '',
        msg: '满载AD与标定AD差值超过设置的比例阈值'
      },
      {
        key: 'fullWeightDiff',
        label: '满载重量差值（吨）',
        isCheck: false,
        check: false,
        checkText: '启用',
        val: '',
        msg: '满载重量与标定的满载重量差值超过设置的比例阈值'
      }
    ],
    other: {
      title: '自动标定设置',
      msg: '重新标定设置（满足以下任意条件则自动标定时会重新标定）'
    }
  },
  ...zhLocale
}
export default cn
