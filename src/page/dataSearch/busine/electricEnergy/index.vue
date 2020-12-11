<!-- 电量明细报表 -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" @query="query" @searchValChange="searchValChange" @searchNodeClick="handleNode"></tab-bar>
    <div class="table-box">
      <template>
        <el-tabs @tab-click="tabClick" style="display: flex;flex-direction: column;flex: 1;overflow: hidden;" v-model="activeName">
          <el-tab-pane :label="$t('otherText.chart')" name="chart">
            <chart-line ref="chart" />
          </el-tab-pane>
          <el-tab-pane :label="$t('otherText.table')" name="table">
            <my-table ref="table" :isPageing="false" :tableData="tableData" :tableTitle="tableTitle" />
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
import { mapGetters } from 'vuex'
import { Tabs, TabPane, Pagination, Message } from 'element-ui'
import { getOperButton, getTodays } from '@/utils/data'
import { getCopyObj, getDateStr } from '@/utils/util'
import { getDCEnergyMeterData } from '@/api/dataSearch/busine'
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
  name: 'electricEnergy',
  data() {
    const searchList = getCopyObj(this.$t('electricEnergy.searchList'))
    const tableTitle = this.$t('electricEnergy.tableTitle');
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
      pageing,
      tableData: [],
      operButton: {},
      activeName: 'chart',
      options: null
    }
  },
  computed: {
    ...mapGetters([
      'menuTree'
    ])
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
    }
  },
  async created() {
    this.searchList.startEndTime.model = getTodays();
    const url = this.$route.path;
    const code = this.$route.query.code;
    for (const v of this.menuTree.values()) {
      if (v.code == code) {
        this.operButton = getOperButton(v.child, url);
        break;
      }
    }
    try {
      const tree = await this.$store.dispatch('data/setCarTree');
      this.searchList.vehTerminalNo.tree = tree;
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
      
      const data = {
        vehTerminalNo,
        begin: dates[0],
        end: dates[1],
        page: pageing.curPage,
        limit: pageing.limit,
        totalCount: pageing.totalCount,
        perTableCount: pageing.perTableCount
      }
      getDCEnergyMeterData(data).then(res => {
        if (res.result) {
          const list = res.result.dCEnergyMeters || []
          const opt = this.getOpt();
          const rule = /[a-zA-Z]|\.(0+)[a-zA-Z]+$|(0+)[a-zA-Z]+$/g
          for (const v of list.values()) {
            v.gpstime = getDateStr(v.gpstime)
            opt.timeArr.push(v.gpstime)
            opt.series[0].data.push(v.forwardPowerDisplay.replace(rule, ''))
            opt.series[1].data.push(v.reversePowerDisplay.replace(rule, ''))
            opt.series[2].data.push(v.voltageDisplay.replace(rule, ''))
            opt.series[3].data.push(v.currentDisplay.replace(rule, ''))
            opt.series[4].data.push(v.powerDisplay.replace(rule, ''))
          }

          this.tableData = list

          const perTableCount = res.result.perTableCount;
          const totalCount = res.result.totalCount;
          this.pageing.perTableCount = perTableCount;
          this.pageing.totalCount = totalCount;
          this.pageing.isShow = false;

          this.$refs.table.setPageing(this.pageing);
          if (list.length) {
            this.options = opt;
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
      const arr = getCopyObj(this.$t('electricEnergy.options'));
      const opt = arr.reduce((result, v) => {
        if (!result.series) {
          result.yAxis = {
            type: 'value'
          }
          result.tooltip = {
            trigger: 'axis',
            formatter(res) {
              let list = []
              let listItem = ''
              for (const [i, e] of res.entries()) {
                const str = `<i style="display: inline-block;width: 10px;height: 10px;background: ${e.color}
                  ;margin-right: 5px;border-radius: 50%;}"></i><span style="display:inline-block;">
                  ${e.seriesName}</span>：${e.value} ${arr[i].unit}`
                list.push(str);
              }
              listItem = list.join('<br>')
              return '<div class="showBox">' + listItem + '</div>'
            }
          }
          result.series = [];
          result.legend = {
            data: []
          }
        }
        
        const series = {
          name: v.name,
          type: 'line',
          data: [],
          un: v.unit,
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
            if (this.options) {
              this.$refs.chart.chartsRender(this.options);
            }
          }
        });
      }
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
