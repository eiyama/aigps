<template>
  <div class="foot" :class="!isShow ? 'transtion-top' : 'transtion-bottom'">
    <div @click="handleState" class="fn-icon">
      <el-tooltip class="item" effect="dark" content="窗口化" placement="top">
        <span v-show="!isShow" class="iconfont icon-zuidahua"></span>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="最小化" placement="top">
        <span v-show="isShow" class="iconfont icon-zuixiaohua"></span>
      </el-tooltip>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <!-- 报警 -->
      <el-tab-pane label="报警" name="alarm">
        <my-table :isPageing="false" height="400" :tableData="alarmList" :tableTitle="tableTitle1" />
      </el-tab-pane>
      <!-- 运行 -->
      <el-tab-pane label="运行" name="run">
        <my-table :isPageing="false" height="200" :tableData="runList" :tableTitle="tableTitle2" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getCopyObj, getParse, getDateStr, getFormatTime } from '@/utils/util'
import MyTable from '@/components/myTable'
import { getAlarmNew } from '@/api/alarm'
import { Tooltip, Tabs, TabPane } from 'element-ui'

export default {
	name: 'FootTable',
  	components: {
	    ElTooltip: Tooltip,
	    ElTabs: Tabs,
	    ElTabPane: TabPane,
	    MyTable
  	},
	 data() {
	    const data = this.getData()
	    const tableTitle1 = getCopyObj(this.$t('allMonitor.alarmTableTitle'))
	    const tableTitle2 = getCopyObj(this.$t('allMonitor.runTableTitle'))
	    return {
	      	tableTitle1,
	      	tableTitle2,
	      	maxTotal: 50,
	      	...data
	   }
	},
  	created() {
  		this.isUp = true
  		this.setDelayUpdateRun()
  		this.setDelayUpdateAlarm()
  	},
  	beforeDestroy() {
      this.alarmList = []
      this.runList = []
      this.newAlarmList = []
      this.newRunList = []
      this.tableTitle1 = null
      this.tableTitle2 = null
  	},
  	methods: {
	    /**
	     * 获取参数
	     */
	    getData() {
	      	return {
	      		alarmList: [],
	      		runList: [],
	      		newAlarmList: [],
	      		newRunList: [],
		        isShow: false,
		        activeName: 'alarm',
		        isUp: false
		    }
	    },
	    /**
	     * 延时更新
	     */
	    setDelayUpdateRun() {
	    	const { isUp } = this
	    	if (!isUp) return
	    	const tid = setTimeout(() => {
	    		clearTimeout(tid)
	    		const { runList, newRunList, maxTotal } = this
	    		if (runList.length >= maxTotal) {
		    		const arr = newRunList.reduce((initArr, v, i) => {
		    			if (i < maxTotal) {
		    				initArr.push(v)
		    			}
		    			return initArr
		    		}, [])
		    		if (arr.length < maxTotal) {
		    			let i = 0
		    			const length = arr.length
		    			while (i < maxTotal - length && i < runList.length) {
		    				arr.push(runList[i])
		    				i ++
		    			}
		    		}
		    		this.runList = arr
	    		}
	    		this.newRunList = []
	    		this.setDelayUpdateRun()
	    	}, 1e4)
	    },
	    setDelayUpdateAlarm() {
	    	const { isUp } = this
	    	if (!isUp) return
	    	this.requestAlarmInfo()
	    	const tid = setTimeout(() => {
	    		clearTimeout(tid)
	    		this.setDelayUpdateAlarm()
	    	}, 6e5)
	    },
	    async requestAlarmInfo() {
	    	const { maxTotal, alarmList } = this
	    	const time = (new Date()).getTime()
	    	const begin = getFormatTime('Y-M-D h:m:s', time - 6e5)
	    	const end = getFormatTime('Y-M-D h:m:s', time)
	    	const data = {
		        vehTerminalNo: '',
		        begin,
		        end,
		        alarmCategory: '',
		        alarmDisplay: '',
		        state: '',
		        duration: 0,
		        curPage: 1,
		        pageSize: maxTotal
		    }

		    try {
		    	const res = await getAlarmNew(data, true)
		    	const arr = res.result.alarm || []
		    	for (const v of arr.values()) {
		    		v.alaTime = getDateStr(v.gpsAlarmEndTime);
		            v.gpsAlarmStartTime = getDateStr(v.gpsAlarmStartTime);
		            v.alaHandleTime = getDateStr(v.alarmHandleTime);
		    	}
		    	if (arr.length < maxTotal && alarmList.length) {
		    		const length = arr.length
		    		let i = 0
		    		while (i < maxTotal - length && i < alarmList.length) {
		    			arr.push(alarmList[i])
		    			i++
		    		}
		    	}
		    	this.alarmList = arr

		    } catch(err) {

		    }
	    },
	    /**
	     * 添加报警数据
	     * @param {Object} opt 报警数据
	     */
	    addAlarm(opt) {
	    	console.log(opt)
	    	const { maxTotal, alarmList } = this
	    	return
	    	alarmList.push(opt)
	    	if (alarmList.length > maxTotal) {
	    		alarmList.pop()
	    	}
	    },
	    /**
	     * 添加运行数据
	     * @param {Object} opt 运行数据
	     */
	    addRun(opt) {
	    	const data = this.getInfoKeyToLowerCase(opt)
	    	data.accState = data.gpsAcc ? this.$t('otherText.open') : this.$t('otherText.shut')
	    	data.gpstime = getDateStr(data.gpstime)
	    	if (data.extensionData) {
	    		const extensionData = getParse(data.extensionData)
	    		data.locationType = extensionData.LocationType || ''
	    	}
	    	const { maxTotal, runList, newRunList } = this
	    	if (runList.length < maxTotal) {
		    	runList.push(data)
	    	}
	    	newRunList.push(data)
	    	// if (newRunList.length > maxTotal) {
	    	// 	newRunList.pop()
	    	// }
	    },
	    getInfoKeyToLowerCase(obj) {
	    	const data = {}
	    	for (const [k, v] of Object.entries(obj)) {
	    		const first = k.charAt(0)
	    		const newKey = `${first.toLowerCase()}${k.substring(1)}`
	    		data[newKey] = v
	    	}
	    	return data
	    	obj = null
	    },
	    /**
	     * 初始化数据
	     */
	    initData() {
		    const data = this.getData()
		    for (const [k, v] of Object.entries(data)) {
		        this[k] = v
		    }
	    },
	    /**
	     * 点击切换最大化和最小化
	     */
	    handleState() {
		    this.isShow = !this.isShow
	    },
	    /**
	     * 选项卡切换
	     * @param {Object} cur 当前选项卡的数据
	     */
	    handleClick(cur) {
	      	this.isShow = true
	    }
	}
}
</script>

<style lang="scss" scoped>
.foot {
	width: calc(100% - 330px);
	position: fixed;
	bottom: 0px;
	right: 0;
	overflow: hidden;
	// padding: 5px 0 0 5px;
	box-sizing: border-box;
	height: 320px;
	.fn-icon {
	    position: absolute;
	  	top: 10px;
	  	right: 5px;
	  	cursor: pointer;
	  	z-index: 999;
	  	width: 22px;
	  	height: 22px;
	  	line-height: 24px;
	  	text-align: center;
	  	border: 1px solid #fff;
	}
	.fn-icon:hover {
	  	border-color: #dedede;
	}
	.fn-icon span {
	  	display: block;
	  	font-size: 16px;
	  	color: #00A8D4;
	}
	::v-deep .el-tabs {
		background: #fff;
		.table-box {
			padding: 0;
		}
	}
}
.transtion-top {
  transition: height ease-in .3s;
  height: 44px !important;
  z-index: 998;
}
.transtion-bottom {
  transition: height ease-in .3s;
  /*max-height: 256px !important;*/
  height: 256px !important;
  z-index: 9998;
}
.foot >>> .table-box {
  padding: 0;
  height: 100%;
}
.foot >>> .el-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.foot >>> .el-tabs__content {
  flex: 1;
}
</style>

