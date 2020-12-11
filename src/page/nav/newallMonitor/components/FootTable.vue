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
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" >
      <!-- 轨迹点 -->
      <el-tab-pane label="报警" name="alarm" >
        <my-table id="alarmTable" :isPageing="false" height="200" :tableData="alarmList" :tableTitle="tableTitle1" @handleRow="handleRowAlarm" />
      </el-tab-pane>
      <!-- 停车点 -->
      <el-tab-pane label="运行" name="run">
        <my-table   :isPageing="false" height="200" :setIndex="setIndex" :tableData="tableRunList" :tableTitle="tableTitle2" @handleRow="handleRowRun" />
		<my-table v-show="false" id="runTable" :isPageing="false" height="200" :setIndex="setIndex" :tableData="tableRunAll" :tableTitle="tableTitle2" @handleRow="handleRowRun" />
		 <el-pagination
            background
            :page-size="10"           
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            layout="prev, pager, next"
            :total="tableRunAll.length">
          </el-pagination>
      </el-tab-pane>	 
    </el-tabs>
	<el-button style="position: absolute;top: 0px;right: 80px;" type="primary" @click="exportPosition">导出</el-button>
  </div>
</template>

<script>
import { getCopyObj, getParse, getDateStr, getFormatTime } from '@/utils/util'
import MyTable from '@/components/myTable'
import { getAlarmNew } from '@/api/alarm'
import exportFile from '@/utils/exportFile';
import getLngLat from '@/utils/coordtransform'
import {getLocation} from '@/utils/jsonp';
import { Tooltip, Tabs, TabPane ,Pagination ,Message} from 'element-ui'

export default {
	name: 'FootTable',
  	components: {
	    ElTooltip: Tooltip,
	    ElTabs: Tabs,
	    ElTabPane: TabPane,
		MyTable,
		ElPagination:Pagination
  	},
	 data() {
	    const data = this.getData()
	    const tableTitle1 = getCopyObj(this.$t('allMonitor.alarmTableTitle'))
	    const tableTitle2 = getCopyObj(this.$t('allMonitor.newrunTableTitle'))
	    return {
	      	tableTitle1,
	      	tableTitle2,
			maxTotal: 50,
			tableRunList:[],
			currentPage:1,
			limit:10,
			pointArr:[],
			...data,	
			map:null,		 
	   }
	},
  	created() {
  		this.isUp = true
  		this.setDelayUpdateRun()
		this.setDelayUpdateAlarm();
    	eventBus.$on('setmap', this.getMap);
    
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
		//   接收map实例
		getMap(data){
			this.map = data;
		},
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
				isUp: false,
				tableRunAll:[],
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
		// 点击报警
		handleRowAlarm(){

		},
		exportPosition(){	
			if(this.activeName == "run"){
				const num = this.tableRunAll.length;
				if (num) {
					exportFile(num, "运行监控报表",'runTable');
				} else {
					Message.error(this.$t('otherText.msgExport'));
				}
			}else{
				const num = this.alarmList.length;
				if (num) {
					exportFile(num, "报警监控报表",'alarmTable');
				} else {
					Message.error(this.$t('otherText.msgExport'));
				}
			} 
				
		},
		// 翻页
		handleCurrentChange(e){		
			this.currentPage = e ;
			this.limit = e * 10;		
			this.tableRunList = this.tableRunAll.slice(this.limit - 10 ,this.limit);
			
		},
		// getLocation(opt){
		// 	const { BMap } = this.map;
		// 	return new Promise(resolve => {
		// 		let pt = opt.pt
		// 		if (!opt.pt) {
		// 			pt = new BMap.Point(opt.lng, opt.lat) 
		// 		}
		// 		const geocoder = new BMapGL.Geocoder()
		// 		geocoder.getLocation(pt, (geocoderResult) => {
		// 			let poi = ''
		// 			const opoint = geocoderResult.point
		// 			let npoint
		// 			let tmpValue = Math.pow(opoint.lat, 2) * Math.pow(opoint.lng, 2)
		// 			for (const v of geocoderResult.surroundingPois.values()) {
		// 			npoint = v.point
		// 			const ntmpValue = Math.abs(
		// 				Math.pow(opoint.lat, 2) * Math.pow(opoint.lng, 2) - Math.pow(npoint.lat, 2) * Math.pow(npoint.lng, 2)
		// 			)

		// 			if (tmpValue > ntmpValue) {
		// 				poi = `,${v.address}`
		// 				tmpValue = ntmpValue
		// 			}
		// 			}
		// 			// const addComp = geocoderResult.addressComponents;
		// 			// const address =  addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber
		// 			const address = `${geocoderResult.address}${poi || ''}`
		// 			resolve(address)
		// 			return
		// 		})
		// 	})
		// },
		setIndex(index){
			return (this.currentPage - 1) * 10 + index + 1
		} ,
		async tableData(data, node, arr, isCheck){
			// this.$refs.footTable.tableData(data, node, arr, isCheck);
			// console.log(data, node, arr, isCheck)
			const tableRunAll = [];	
			this.tableRunList = [];		
			this.pointArr = arr;
			for( const item of arr){
			// arr.map(item=>{
				let runTable = {}; //组装数据
				runTable.vehPlateNo =  item.name;
				runTable.vehTerminalNo =  item.vehTerminalNo;
				runTable.gpsSpeed = item.location.gpsSpeed;
				runTable.gpsDayDistance = item.location.gpsDirect;
				runTable.accState = item.location.acc ? this.$t('otherText.open') : this.$t('otherText.shut');
				runTable.gpstime =  getDateStr(item.location.gpsTime);
				const gpsWebLng = item.location.gpsWebLng;
				const gpsWebLat = item.location.gpsWebLat;
				const BDPt = getLngLat(gpsWebLng, gpsWebLat, 'gcj02tobd09')				 		
				const address = await getLocation(BDPt.lng,BDPt.lat);
				console.log(address)
				if(address.status ==  0){					 
            		runTable.address = address.result.formatted_address + address.result.sematic_description;	
				}							
				if (item.location.extensionData) {
					const extensionData = getParse(item.location.extensionData)
					runTable.locationType = extensionData.LocationType || ''
				}			
				tableRunAll.push(runTable);
			// })	
			}		
		  this.tableRunAll = tableRunAll;
		  this.tableRunList = tableRunAll.slice(0,10);		  
		  
		},		
		// 点击运行
		handleRowRun(row){
			var handleArr = this.pointArr.find(item => item.vehTerminalNo == row.vehTerminalNo);
			eventBus.$emit('handleMonitorRow', handleArr); 
			// if (row ) {
			// 		// 居中
			// 		const { location } = obj
			// 		const BDPt = getLngLat(row.gpsWebLng, row.gpsWebLat, 'gcj02tobd09')
			// 		this.center = BDPt
			// 		const info = {
			// 			...obj,
			// 			...location,
			// 			type: 'veh',
			// 			BDPt
			// 		}
			// 		delete info.location
			// 		await this.setInfoWin(info)
		    // }    
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
			// console.log(opt);
			const data = this.getInfoKeyToLowerCase(opt);						 
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
			newRunList.push(data);		 
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
	// overflow: hidden;
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
  height: 356px !important;
  z-index: 99;
}
.foot >>> .table-box {
  padding: 0;
  height: 82%;
}
.foot >>> .el-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.foot >>> .el-tabs__content {
  flex: 1;
}
// .foot >>> .el-tabs__item.is-active{
// 	color: #fff;
//     background: #369be9;
//     border-right: 1px solid #369be9;
//     border-left: 1px solid #369be9;
// }
// .foot >>> .el-tabs__nav-scroll{
// 	background: #363f44;
// }
</style>

