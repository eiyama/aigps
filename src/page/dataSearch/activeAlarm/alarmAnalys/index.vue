<!-- 车辆报警分析 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" :filterFn="filterFn" @exportFile="exportFile"
     ref="tabBar" @query="query" @check="check"></tab-bar>
    <my-table :isPageing="false" :tableData="tableData" :tableTitle="tableTitle" @handleCell="handleDateils" @handleRow="handleRow" />
		<div class="echarts-box">
      <div class="btn-bar">
        <el-button size="small" @click="changeInfo(0)" :type="!echartData.curState ? 'primary' : ''">饼图</el-button>
        <el-button size="small" @click="changeInfo(1)" :type="echartData.curState ? 'primary' : ''">柱状图</el-button>
      </div>  
      <div class="pie-box">
        <div ref="pieBox" class="pie">
          <!-- 苏标饼图 -->
          <chart-pie v-show="!searchList.ageerType.model && !echartData.curState" ref="pie" />
          <!-- 苏标柱状图 -->
          <chart-line v-show="!searchList.ageerType.model && echartData.curState" ref="bar" vId="bar" />
        </div>
      </div>
			<!-- 线图 -->
      <chart-line ref="line" />
		</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOperButton, getTodays } from '@/utils/data'
import { getCopyObj, getDateStr } from '@/utils/util'
import { getAlarmReportNew, getAlarmReportTrendNew, getAlarmReportExcel,exportAlarmStatisticsExcel , queryAlarmStatistics, queryAlarmsTrend   } from '@/api/dataSearch/alarm'
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'
import ChartLine from '@/components/chartLine'
import ChartPie from '@/components/chartPie'
import { Message } from 'element-ui'

export default {
  name: 'AlarmAnalys',
  components: {
    TabBar,
    MyTable,
    ChartLine,
    ChartPie
  },
  data() {
    const searchList = getCopyObj(this.$t('alarmAnalys.searchList'));
    const tableTitle = this.$t('alarmAnalys.tableTitle');
    return {
      searchList,
      tableTitle,
      tableData: [],
      tableTitle2: [],
      operButton: {},
      oldSearchInfo: {}, // 原始的报警查询参数
      echartData: {} // 控制图表的参数
    }
  },
  computed: {
    ...mapGetters([
      'menuTree'
    ])
  },
  async created() {
    const { $route, $store, menuTree, searchList } = this
    const url = $route.path
    this.operButton = getOperButton(menuTree, url)

    // 给时间选择框赋值
    searchList.startEndTime.model = getTodays()
    try {
      const tree = await $store.dispatch('data/setCarTree')
      searchList.vehTerminalNo.tree = tree
    } catch(err) {

    }
  },
  methods: {
    /**
     * 报警类型的树过滤
     */
    filterFn(value, data) {
      if (!value) return true;
      // 搜索框的值
      const val = value.toUpperCase();
      // 自定义传过来的字段key值
      const veh = data.label ? data.label.toUpperCase() : '';
      if (veh.indexOf(val) !== -1) {
        return true;
      } else {
        return false;
      }
    },
    /**
     * 点击查询
     */
    query() {
      const dates = this.searchList.startEndTime.model;
       if (!dates || !dates.length) {
        Message.error(this.$t('error.selectTimes'));
        return;
      }
      this.requestInfo();
    },
    /**
     * 请求获取数据
     */
    requestInfo() {
      const getData = this.getrequestData();
      if(getData.ids == ''){
        return;
      }
      const data =  {
          "vehTerminalNos": getData.ids.split(','),
            "startTime":  getData.begin,
            "endTime": getData.end
        }    
      queryAlarmStatistics(data).then(res => {
        if (res.result) {
          // 把当前行的数据清空
          this.$set(this.echartData, 'curRow', null);
          this.oldSearchInfo = data;
          const list = res.result || [];
            for (const v of list.values()) {
            v.beginDateTime = getDateStr(v.beginDateTime);
            v.other = 0;
            v.otherSum = 0;
            // 为正是私有协议，反之为苏标
            // if (data.ageerType) {
            //   // 私有协议
            //   this.setAlarmCount(this.tableTitle2, v.countAlarmTypesLevelNone, v);
            // } else {
              // 苏标的一级报警
              this.setAlarmCount(this.tableTitle, v.countAlarmTypesLevel1, v, 1);
              // 苏标的二级报警
              this.setAlarmCount(this.tableTitle, v.countAlarmTypesLevel2, v, 2);                    
            // }
            for (const [i, e] of this.tableTitle.entries()) {
              if (!v[e.prop] && e.isButton) {
                v[e.prop] = 0;
              }
            }
          }
          this.tableData = list;
          // 0是饼图，等于1是柱状图
          if (this.echartData.curState) {
            const opt = this.getBarOpt();
            this.$refs.bar.chartsRender(opt);
            this.$refs.pie.dispose()
          } else {
            const opt = this.getPieOpt();
            this.$refs.pie.chartsRender(opt);
            this.$refs.bar.dispose()
          }
        }
      })
      .catch(err => {

      });
      this.getDayQueryInfo(data);
    },
    /**
     * 按天获取报警详情
     * 
     */
    getDayQueryInfo(data) {
      queryAlarmsTrend(data).then(res => {
        if (res.result) {
          const opt = this.getLineOpt(res.result, data.plateNo);
          this.$refs.line.chartsRender(opt);
        }
      })
      .catch(err => {

      });
    },
    /**
     * 获取曲线图的参数
     * @param {Array} list 折线图的数据
     * @param {String} plateNo 车牌号
     */
    getLineOpt(list, plateNo) {
      const echarts = this.$refs.line.getEcharts();
      const i18n = this.$t('alarmAnalys.line');
      const opt = {
        timeArr: [],
        series : [
					{
						name: i18n.name,
						type:'line',
						smooth: true, // 曲线
						itemStyle: {
              color: '#00A8D4' // 曲线颜色
						},
						areaStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
									offset: 0,
									color: '#00A8D4' // 背景色过渡上边的颜色
								},
								{
									offset: 1,
									color: '#d2ddf1' // 背景色过渡下边的颜色
								}
							])
            },
						data: []
					}
        ],
        yAxis: [
          {
            type : 'value',
            name: i18n.name
					}
        ],
        title: `${plateNo || ''}${i18n.title2}`,
        align: 'center'
      }
      for (const v of list.values()) {
        const date = v.date.substring(0, 10);
        opt.timeArr.push(date);
        opt.series[0].data.push(v.count);
      }
      return opt;
    },
    /**
     * 获取饼图的参数
     */
    getPieOpt(data) {
      const alaArr = this.getOptData(data);
      const i18n = this.$t('alarmAnalys.line');
      const opt = {
        title: `${(data && data.plateNo || '')} ${i18n.title}`,
        color: [],
        legend: {
          data: [],
          selected: {},
          selectedMode: false
        },
				serie: {
          name: i18n.name,
          data: alaArr
        }
      }
      let num = 0;
      for (const v of alaArr.values()) {
        opt.color.push(v.bg);
        if (v.value > 0) {
          opt.legend.data.splice(num, 0, v.name);
          opt.legend.selected[v.name] = true;
          opt.legend.selectedMode = true;
          num++;
        } else {
          opt.legend.data.push(v.name);
          opt.legend.selected[v.name] = false;
        }
      }
      this.$set(this.echartData, 'empty', opt.legend.selectedMode);
      
      return opt;
    },
    /**
     * 获取柱状图的参数
     */
    getBarOpt(data) {
      const alaArr = this.getOptData(data);
      const i18n = this.$t('alarmAnalys.line');

      const opt = {
        title: `${(data && data.plateNo || '')} ${i18n.title}`,
        align: 'center',
        color: [],
        timeArr: [],
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar',
            data: [],
            itemStyle: {
              normal: {
                color: '#2c9994'
              }
            },
            barWidth: 30
          }
        ]
      }
      for (const v of alaArr.values()) {
        opt.color.push(v.bg);
        opt.timeArr.push(v.name);
        opt.series[0].data.push(v.value);
      }
      return opt;
    },
    /**
     * 获取图表的数据
     * @param data 饼图与柱状图的参数
     * @return 返回一个数组
     */
    getOptData(data) {
      // 私有协议反之则苏标
      const ageerType = this.searchList.ageerType.model;
      let alarmArr;
      if (ageerType) {
        alarmArr = getCopyObj(this.$t('alarmAnalys.pie.alarmArr2'));
      } else {
        alarmArr = getCopyObj(this.$t('alarmAnalys.pie.alarmArr'));
      }
      if (data) {
        for (const [i, v] of alarmArr.entries()) {
          for (const [k, e] of Object.entries(data)) {
            if (k === v.key) {
              v.value = e;
            }
          }
        }
      } else {
        if (!Array.isArray(this.tableData) || this.tableData.length == 0) return alarmArr;
        for (const v of this.tableData.values()) {
          for (const k of Object.keys(v)) {
            const index = alarmArr.findIndex(elem => elem.key == k);
            if (index > -1) {
              const num = +alarmArr[index].value;
              alarmArr[index].value = num + +v[k];
            }
          }
        }
      }
      return alarmArr;
    },
    /**
     * 点击大于0的值跳转详情
     * @param row 行的数据
     * @param key 表格的key
     */
    handleDateils(row, key) {
      const obj = this.tableTitle.find(e => e.prop === key);
      if (!row[key] || !obj) return;
      const alarmLevel = key && key.match(/\d/g) ? key.match(/\d/g).join() : '';
      this.$router.push(
        {
          name: '/home/dataSearch/activeAlarm/handAlarm',
          query: {
            ...this.oldSearchInfo,
            vehPlateNo: row.plateNo,
            vehTerminalNo: row.vehTerminalNo,
            alarmLevel,
            alarmValue: obj.alarmValue,
            pageId: 2,
            code: 'dataQuery'
          }
        }
      );
    },
    /**
     * 获取报警的全部id
     * @return arr 返回一个数组
     */
    getAlaAllId(key, tree) {
      let arr = [];
      if (!tree) {
        tree = this.searchList[key].tree;
      }
      for (const v of tree.values()) {
        if (v.type == 2) {
          arr.push(v.id);
        } else {
          if (v.options.length) {
            arr = [...arr, ...this.getAlaAllId(key, v.options)];
          }
        }
      } 
      return arr;
    },
    /**
     * 点击导出
     */
    exportFile() {
      const dates = this.searchList.startEndTime.model;
       if (!dates || !dates.length) {
        Message.error(this.$t('error.selectTimes'));
        return;
      }
      const getData = this.getrequestData();       
      const data =  {
          "vehTerminalNos": getData.ids.split(','),
          "startTime":  getData.begin,
          "endTime": getData.end
        }         
      exportAlarmStatisticsExcel(data).then(res => {
        if (res.result) {
          const localHost = (window.location.href).split("/#")[0] + res.result;    
          window.location.href = localHost; 
        }
      })
      .catch(err => {

      });
    },
    /**
     * 获取请求参数
     * @returns {Object} data 返回一个json
     */
    getrequestData() {
      const ids = this.searchList.vehTerminalNo.id || '';
      if(ids == ''){
         Message.error(this.$t('error.selectTimes'));
        return;
      }
      const dates = this.searchList.startEndTime.model;
      // 报警类型，默认全选，如果用户不选择就全选
      const ageerType = this.searchList.ageerType.model;
      const alarmLevel = ageerType ? '' : this.searchList.alarmLevel.model;
      const key = ageerType ? 'alarmType2' : 'alarmType';
      const alarmType = this.searchList.alarmType.id || this.getAlaAllId(key).join();
      
      const data = {
        ids,
        begin: dates[0],
        end: dates[1],
        alarmLevel,
        alarmType,
        ageerType
      }
      return data;
    },
    /**
     * 报警分类判断
     * @param tableTitle 表格头部的字段
     * @arr 要操作的数组
     * @param v 数据的对象
     * @param level 报警等级
     */
    setAlarmCount(tableTitle, arr, v, level) {
      // 有值是苏标，没有是私有   
      if (level === 1) {
        if (Array.isArray(v.countAlarmTypesLevelNone) && v.countAlarmTypesLevelNone.length) {
          for (const e of v.countAlarmTypesLevelNone.values()) {
            v.other += e.alarmCount;        
          }
        }
      } else if (!level) {
        const countAlarm = [...v.countAlarmTypesLevel1, ...v.countAlarmTypesLevel2];
        if (Array.isArray(countAlarm) && countAlarm.length > 0) {
          for (const e of countAlarm.values()) {
            v.otherSum += e.alarmCount;
          }
        }
      }
      if (Array.isArray(arr) && arr.length > 0) {
        for (const e of arr.values()) {
          const alarmDisplay = e.alarmDisplay + (level || '');
          const obj = tableTitle.find(elem => elem.label.indexOf(alarmDisplay) > -1);
          if (obj) {
            v[obj.prop] = e.alarmCount;
          } else {           
            if (level && v.other > 0) {
              v.other = v.other - e.alarmCount;
            } else if (!level && v.otherSum > 0) {
              v.otherSum = v.otherSum - e.alarmCount;
            }
          }
        }
      }       
      v.other = 0;     
      if (Array.isArray(v.countAlarmTypesLevelNone) && v.countAlarmTypesLevelNone.length) {
        for (const e of v.countAlarmTypesLevelNone.values()) {
            v.other += e.alarmCount;                                
        }
      }                               
      
    },
    /**
     * 搜索的树复选框选中
     */
    check(res, key) {
      var arr = [];
      var arr2 = [];
      for (const v of res.values()) {
        const ttxVehicleCfg = v.ttxVehicleCfg || {};
        // 是否是视频设备
        if (key === 'vehTerminalNo' && v.type === 2 && ttxVehicleCfg.isVideoDevice) {
          arr.push(v.vehTerminalNo);
          arr2.push(v.name);
        } else if (key === 'alarmType'  && v.type === 2) {
          arr.push(v.id);
          arr2.push(v.label);
        }
      }
      // es6的方法去重
      arr = Array.from(new Set(arr));
      arr2 = Array.from(new Set(arr2));
      this.searchList[key].id = arr.join();
      this.searchList[key].model = arr2.join();
    },
    /**
     * 点击按钮切换饼图与柱状图
     * @param index 用来区分切换的是柱状图还是饼图
     */
    changeInfo(index) {
      // 证明点击的是当前按钮
      if (this.echartData.curState === index) return;
      // 0是切换饼图，1是柱状图
      this.$set(this.echartData, 'curState', index);
      const curRow = this.echartData.curRow || null;
      this.$nextTick(() => {
        if (index === 0) {
          // this.setPie(curRow);
          const isChart = this.$refs.pie.isChart();
          if (isChart) {
            this.$refs.pie.resize();
          } else {
            const opt = this.getPieOpt(curRow);;
            this.$refs.pie.chartsRender(opt);
          }
        } else {
          const isChart = this.$refs.bar.isChart();
          if (isChart) {
            this.$refs.bar.resize();
          } else {
            const opt = this.getBarOpt(curRow);
            this.$refs.bar.chartsRender(opt);
          }
        }
      });
    },
    /**
     * 点击表格行
     */
    handleRow(row) {
      // 保存当前点击行的数据
      this.$set(this.echartData, 'curRow', row);
      const obj = {
        ...this.oldSearchInfo,
        ids: row.vehTerminalNo,
        begin: row.beginDateTime.substring(0, 19).replace('T', ' '),
        end: row.endDateTime.substring(0, 19).replace('T', ' '),
        plateNo: row.plateNo
      }
      // 等于1是柱状图，0是饼图
      if (this.echartData.curState) {
        const opt = this.getBarOpt(row);
        this.$refs.bar.chartsRender(opt);
        this.$refs.pie.dispose()
      } else {
        const opt = this.getPieOpt(row);
        this.$refs.pie.chartsRender(opt);
        this.$refs.bar.dispose()
      }
      this.getDayQueryInfo(obj);
    }
  }
}
</script>

<style scoped>
.content {
  flex: 1;
  padding: 22px 0 0 40px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
  position: relative;
  overflow: hidden;
}
.content >>> .table-model {
  /* flex: 1; */
  height: 100%;
  position: relative;
}
.echarts-box {
	flex: 1;
  /* display: flex; */
  overflow-y: scroll;
}
.echarts-box .btn-bar {
  padding: 10px 0 0;
}
.echarts-box .pie-box {
  height: 100%;
  padding: 0 0 20px;
}
.pie {
  width: 100%;
  height: 100%;
  position: relative;
}

</style>
