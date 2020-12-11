<!-- 电量明细报表 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" @exportFile="exportFile" @query="query" @searchValChange="searchValChange" @searchNodeClick="handleNode"></tab-bar>
    <div class="table-box">
      <template>
        <el-tabs @tab-click="tabClick" style="display: flex;flex-direction: column;flex: 1;overflow: hidden;" v-model="activeName">
          <el-tab-pane :label="$t('otherText.chart')" name="chart">
            <chart-line ref="chart" />
          </el-tab-pane>
          <el-tab-pane :label="$t('otherText.table')" name="table">
            <my-table ref="table" :isPageing="false" :tableData="tableData" :tableTitle="tableTitle" :tableMoreConList="tableMoreConList"/>
          </el-tab-pane>
        </el-tabs>
      </template>
      <div class="block">
        <el-pagination :disabled="pageing.isShow" class="pagination el-input--mini" :page-sizes="[200,400,600,800,1000]"
          :page-size="pageing.limit" @current-change="changeCurPage" @size-change="changeSize" layout="sizes,total, prev, pager, next, jumper"
          :total="pageing.totalCount"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { Tabs, TabPane, Pagination, Message } from 'element-ui'
import { getOperButton, getTreeRepeatValue, getTodays } from '@/utils/data'
import { getCopyObj, getDateHMS, getInterval, getMax, getDateStr, getDecimalN } from '@/utils/util'
import { getReportPosition, getPowerExcel } from '@/api/dataSearch/busine'
import TabBar from '@/components/tabBar'
import MyTable from '@/components/myTable'
import ChartLine from '@/components/chartLine'

export default {
  components: {
    ElTabs: Tabs,
    ElTabPane: TabPane,
    ElPagination: Pagination,
    TabBar,
    MyTable,
    ChartLine
  },
  name: 'electricity',
  data() {
    const searchList = getCopyObj(this.$t('electricity.searchList'))
    const tableTitle = this.$t('electricity.tableTitle');
    const tableMoreConList = this.$t('electricity.tableMoreConList');
    const pageing = {
      curPage: 1,
      limit: 600,
      totalCount: 0,
      perTableCount: {},
      isShow: false
    }
    return {
      searchList,
      tableTitle,
      tableMoreConList,
      pageing,
      tableData: [],
      operButton: {},
      activeName: 'chart'
    }
  },
  computed: {
    ...mapGetters([
      'menuTree'
    ])
  },
  props: {
    codeUrl: {
      type: Object,
      default: () => new Object
    },
    curMarker: {
      type: Object,
      default: () => new Object
    },
    startEndTime: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    //监听搜索框的值，改变了之后禁用分页按钮
    searchList: {
      deep: true,
      handler(newVal, oldVal) {
        this.pageing.isShow = true;
        this.pageing.perTableCount = {};
        this.pageing.totalCount = 0;
      }
    },
    curMarker: {
      deep: true,
      handler(newVal, oldVal) {
        this.componentInit();
      }
    }
  },
  async created() {
    const { $route, $store, menuTree, searchList, curMarker } = this
    const url = curMarker.url || $route.path
    this.operButton = getOperButton(menuTree, url)
    searchList.startEndTime.model = getTodays()
    if (curMarker && curMarker.url) {
      this.componentInit()
    }

    try {
      const tree = await $store.dispatch('data/setCarTree')
      searchList.vehTerminalNo.tree = tree
    } catch(err) {

    }
  },
  methods: {
    /**
     * 校验搜索框的值
     */
    isInputVal() {
      const search = this.searchList;
      const id = search.vehTerminalNo.id;
      const dates = search.startEndTime.model;
      if (!id) {
        Message.error(this.$t('error.selectCar'));
        return false;
      } else if (!dates || !dates.length) {
        Message.error(this.$t('error.selectTimes'));
        return false;
      } else {
        return true;
      }
    },
    /**
     * 点击查询
     */
    query(obj, boole) {
      if (!this.isInputVal(obj)) return;
      this.pageing.totalCount = 0;
      this.pageing.curPage = 1;
      this.requestInfo();
    },
    /**
     * 请求数据
     */
    requestInfo() {
      const pageing = this.pageing;
      const search = this.searchList;
      const vehTerminalNo = search.vehTerminalNo.id;
      const dates = search.startEndTime.model;
      const filter = search.filter.model ? 1 : 0;
      const chargeStatus = search.chargeStatus.model;
      const zero = search.zero.model;
      
      const data = {
        type: 1,
        begin: dates[0],
        end: dates[1],
        zero,
        filter,
        vehTerminalNo,
        chargeStatus,
        limit: pageing.limit,
        page: pageing.curPage,
        totalCount: pageing.totalCount,
        perTableCount: pageing.perTableCount
      }
      getReportPosition(data).then(res => {
        if (res.result) {
          const list = res.result.postion;
          const i18n = this.$t('electricity.other');
          
          for(const v of list.values()) {
            v.gpstime = getDateStr(v.gpstime);
            v.gpsAcc = v.gpsAcc ? this.$t('otherText.open') : this.$t('otherText.shut');
            v.creationTime = getDateStr(v.creationTime);
            v.gpsIsposition = v.gpsIsposition ? this.$t('otherText.isPosition_1') : this.$t('otherText.isPosition_2');
            v.gpsDayDistance = getDecimalN(v.gpsDayDistance);
            v.gpsHasPower = !v.gpsHasPower ? i18n.unknown : v.gpsHasPower ? i18n.charge : i18n.noCharge;
            const extensionData = v.extensionDataObj || {};
            v.batteryPower = v.batteryPower ? Math.floor(v.batteryPower.replace('%', '')) : 0;
            const voltage = extensionData.ConvertBatteryVoltage || extensionData.NonChargedConvertBatteryVoltage || extensionData.ConvertMasterVoltage
            v.convertBatteryVoltage = getDecimalN(voltage);
          }
          this.tableData = list;

          const perTableCount = res.result.perTableCount;
          const totalCount = res.result.totalCount;
          this.pageing.perTableCount = perTableCount;
          this.pageing.totalCount = totalCount;
          this.pageing.isShow = false;

          this.$refs.table.setPageing(this.pageing);
          if (list.length) {
            const opt = this.getOpt(list);
            this.$refs.chart.chartsRender(opt);
          } else {
            this.$refs.chart.setState(false);
          }
        }
      })
      .catch(err => {

      });
    },
    /**
     * 组装图表的数据
     */
    getOpt(list) {
      const arr = getCopyObj(this.$t('electricity.options'));
      const opt = arr.reduce((result, v) => {
        if (!result.yAxis) {
          result.yAxis = [];
          result.series = [];
          result.legend = {
            data: []
          }
        }
        const yAxis = {
          type: 'value',
          name: `${v.name}(${v.unit})`,
          min: 0,
          max: 100,
          axisLabel: {
            formatter: `{value} ${v.unit}`
          }
        }
        result.yAxis.push(yAxis)

        const series = {
          name: v.name,
          type: 'line',
          data: [],
          smooth: true,
          itemStyle: {
            normal: {
              color: v.color
            }
          }
        }
        result.series.push(series)

        result.legend.data.push(v.name)
        return result;
      }, {});
      opt.timeArr = [];
      for (const v of list.values()) {
        if (v.convertBatteryVoltage < 655.35) {
          opt.series[0].data.push(v.batteryPower);
          opt.series[1].data.push(v.convertBatteryVoltage);
          opt.timeArr.push(v.gpstime);
        }
      }
      opt.title = this.searchList.vehTerminalNo.model;

      return opt;
    },
    /**
     * 页码改变
     * @param {Number} curPage 当前页码
     */
    changeCurPage(curPage) {
      this.$set(this.pageing, 'curPage', curPage);
      this.requestInfo();
    },
    /**
     * 每页条数改变
     * @param {Number} limit 改变之后的每页条数
     */
    changeSize(limit) {
      this.$set(this.pageing, 'limit', limit);
      this.requestInfo();
    },
    /**
     * 点击导出按钮
     */
    exportFile() {
      if (!this.isInputVal(this.searchList)) return;
      
      const id = this.searchList.vehTerminalNo.id;
      const dates = this.searchList.startEndTime.model;
      const data = {
        id,
        begin: dates[0],
        end: dates[1]
      }
      getPowerExcel(data).then(res => {
        if (res.result) {
          location.href = `${process.env.VUE_APP_BASEURL}${res.result.fileName}`;
        }
      })
      .catch(err => {

      });
    },
    /**
     * 点击tab切换的时候
     */
    tabClick(tab) {
      // 等于0就是切换图表项
      if (tab.index == 0) {
        this.$nextTick(() => {
          const isChart = this.$refs.chart.isChart();
          if (isChart) {
            this.$refs.chart.resize();
          } else {
            const opt = this.getOpt(this.tableData);
            this.$refs.chart.chartsRender(opt);
          }
        });
      }
    },
    /**
     * 组件初始化赋值
     */
    componentInit() {
      this.searchList.vehTerminalNo.model = this.curMarker.carName;
      this.searchList.vehTerminalNo.id = this.curMarker.id;
      this.query();
    },
    /**
     * 搜索框树点击节点
     * @param {Object} data 当前节点的数据
     * @param {String} key 当前选项的key
     */
    handleNode(data, key) {
      this.searchList[key].model = data.name;
      this.searchList[key].id = data.vehTerminalNo;
    },
    /**
     * 树类型搜索框值改变
     * @param {String} key 当前选项的key
     */
    searchValChange(key) {
      this.searchList[key].id = '';
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
}

.table-box {
  padding: 25px 0 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.table-box >>> .el-tabs__content .el-tab-pane {
  display: flex;
  flex-direction: column;
}
.table-box >>> .el-tabs__content .table-box {
  padding: 0;
}
.table-model {
  height: 100%;
  position: relative;
}

.block {
  display: flex;
  justify-content: center;
  padding: 20px 0 0;
}

#chart {
  height: 100%;
}
</style>
