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
      <!-- 轨迹点 -->
      <el-tab-pane label="轨迹点" name="marke">
        <my-table :isPageing="false" height="200" ref="marke" id="line-mak" :tableData="pointArr" :tableTitle="tableTitle1" @handleRow="handleRow" />
      </el-tab-pane>
      <!-- 停车点 -->
      <el-tab-pane label="停车点" name="stopMak">
        <my-table :isPageing="false" height="200" :tableData="stopList" :tableTitle="tableTitle2" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getCopyObj } from '@/utils/util'
import MyTable from '@/components/myTable'
import { Tooltip, Tabs, TabPane } from 'element-ui'

export default {
  components: {
    ElTooltip: Tooltip,
    ElTabs: Tabs,
    ElTabPane: TabPane,
    MyTable
  },
  data() {
    const data = this.getData()
    const tableTitle1 = getCopyObj(this.$t('carAnalysis.tableTitle1'))
    const tableTitle2 = getCopyObj(this.$t('carAnalysis.tableTitle2'))
    return {
      tableTitle1,
      tableTitle2,
      ...data
    }
  },
  props: {
    pointArr: {
      type: [Array, Object],
      default: () => []
    },
    stopList: {
      type: [Array, Object],
      default: () => []
    }
  },
  created() {
    eventBus.$on('setSlider', this.changeMarke)
  },
  beforeDestroy() {
    eventBus.$off('setSlider', this.changeMarke)
    this.initData()
  },
  methods: {
    /**
     * 获取参数
     */
    getData() {
      return {
        isShow: false,
        activeName: 'marke'
      }
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
      if (this.isShow && this.activeName == 'marke') {
        // this.setTableScrollAndCurRow(this._Map.markerCurIndex-1);
      }
    },
    /**
     * 选项卡切换
     * @param {Object} cur 当前选项卡的数据
     */
    handleClick(cur) {
      this.isShow = true
      if (cur.name == 'marke') {
        // this.setTableScrollAndCurRow(this._Map.markerCurIndex-1);
      }
    },
    /**
     * 点击表格行
     * @param {Object} row 当前行的数据
     */
    handleRow(row) {
      eventBus.$emit('handleRow', row.BDPt)
    },
    /**
     * 轨迹点改变
     * @param {Numer} times 当前点的时间戳
     * @param {Numer} state 当前点的位置，0是起点，1是终点，2是其它
     * @param {Numer} index 当前点的下标
     */
    changeMarke(times, state, index) {
      if (!this.isShow || this.activeName !== 'marke') return
      const row = this.pointArr[index]
      this.$refs.marke.$refs.table.setCurrentRow(row)
      // console.log(row)
      const omarke = document.getElementById('line-mak')
      // 表格的外盒子
      const oTbaleWrap = omarke.children[2]
      // 表格的内容
      const oTbaleBody = oTbaleWrap.children[0]
      // 盒子的高度
      const boxH = oTbaleWrap.clientHeight
      // 内容的高度
      const contentH = oTbaleBody.clientHeight
      // 这两个高度为0就return掉
      if (!boxH || !contentH) return
      // 盒子滚动条的距离
      const scrollT = oTbaleWrap.scrollTop
      // 表格每一行的高度
      const rowH = document.getElementsByClassName('el-table__row')[0].clientHeight
      // 当前行乘以行高减去盒子的高度
      const curTop = (index + 1) * rowH - boxH
      if (curTop > 0) oTbaleWrap.scrollTop = curTop
    },
    /**
     * 设置轨迹点表格内容滚筒条的位置与高亮
     * @param {Number} num 数组的下标
     */
    setTableScrollAndCurRow(num) {
      // console.log(this.foot.isShowTable, this.foot.activeName);
      // 表格展开的时候且是轨迹点的时候才执行
      if (this.isShow && this.activeName == 'marke' && !this.pointArr.length) {
        // 设置高亮
        this.$refs.marke.setCurrentRow(this.pointArr[num]);
        // console.log(this.pointArr[num]);
        const omarke = document.getElementById('line-mak');
        // 表格的外盒子
        const oTbaleWrap = omarke.children[2];
        // 表格的内容
        const oTbaleBody = oTbaleWrap.children[0];
        // 盒子的高度
        const boxH = oTbaleWrap.clientHeight;
        // 内容的高度
        const contentH = oTbaleBody.clientHeight;
        // 这两个高度为0就return掉
        if (!boxH || !contentH) {
          return
        }
        // 盒子滚动条的距离
        const scrollT = oTbaleWrap.scrollTop;
        // 表格每一行的高度
        const rowH = document.getElementsByClassName('el-table__row')[0].clientHeight;
        // 当前行乘以行高减去盒子的高度
        const curTop = (num + 1) * rowH - boxH;
        if (curTop > 0) {
          oTbaleWrap.scrollTop = curTop;
        }
      }
    }
  }
}
</script>

<style scoped>
.foot {
  position: relative;
  overflow: hidden;
  padding: 5px 2px 0;
  box-sizing: border-box;
}
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
.transtion-top {
  transition: height ease-in .3s;
  height: 44px !important;
}
.transtion-bottom {
  transition: height ease-in .3s;
  /*max-height: 256px !important;*/
  height: 256px !important;
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

