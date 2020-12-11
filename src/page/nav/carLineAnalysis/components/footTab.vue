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
      <!-- 停车点 -->
      <el-tab-pane label="停车点" name="stopMak">
        <my-table id="stopTable" :isPageing="false" height="200" :tableData="stopList" :tableTitle="tableTitle2" />
      </el-tab-pane> 
      <!-- 轨迹点 -->
      <el-tab-pane label="轨迹点" name="marke">
        <my-table  :isPageing="false" height="200" ref="marke" id="line-mak" :setIndex="setIndex" :tableData="pointList" :tableTitle="tableTitle1" @handleRow="handleRow" />
          <el-pagination
            background
            :page-size="10"           
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            layout="prev, pager, next"
            :total="pointArr.length">
          </el-pagination>
      </el-tab-pane>          
    </el-tabs>
    
    <el-button style="position: absolute;top: 4px;right: 85px;" type="primary" @click="exportPosition">导出</el-button>
  </div>
</template>

<script>
import { getCopyObj } from '@/utils/util'
import MyTable from '@/components/myTable'
import { Tooltip, Tabs, TabPane , Pagination} from 'element-ui'
import exportFile from '@/utils/exportFile';
import request from '@/utils/request'
export default {
  components: {
    ElTooltip: Tooltip,
    ElTabs: Tabs,
    ElTabPane: TabPane,
    MyTable,
    ElPagination:Pagination
  },
  data() {
    const data = this.getData()
    const tableTitle1 = getCopyObj(this.$t('carAnalysis.tableTitle1'))
    const tableTitle2 = getCopyObj(this.$t('carAnalysis.tableTitle2'))
    return {
      tableTitle1,
      tableTitle2,
      ...data,
      total:0,
      index:0,
      pointList:[],
      currentPage:1,
      search:{},
      map:null    
    }
  },
  props: {
    pointArr: {
      type: Array,
      default: () => []
    },
    stopList: {
      type: Array,
      default: () => []
    },
    exportData:{
      type: String,
      default: () => []
    }
  }, 
  created() {    
    eventBus.$on('searchResult', this.getSearchData) ;
    eventBus.$on('setSlider', this.changeMarke);
    eventBus.$on('map', this.addressAnalys);
    eventBus.$on('changeIndex', this.getIndex);    
  },
  beforeDestroy() {
    // this.initData()
    eventBus.$off('setSlider', this.changeMarke);
    eventBus.$off('map', this.addressAnalys);
  },   
  mounted(){
    if(this.pointArr.length){
        this.pointList = this.pointArr.slice(0,10);
    }    
  },
  methods: {
    // 获取点击的index并设置选中状态。
    getIndex(index){
      let currentPage = Math.ceil( index / 10) ;
      this.handleCurrentChange(currentPage);
      const currentIndex = index % 10;
      const row = this.pointList[currentIndex]
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
    handleSizeChange(e){
      
    },
   async handleCurrentChange(index){      
      const i = index - 1;      
      this.currentPage = index;
      // this.setIndex
      this.pointList = this.pointArr.slice(i * 10, (i + 1) * 10 );
      for( const v of this.pointList){
          const curPt = v.BDPt
          v.pt = curPt            
          const res = await this.map.getLocation(curPt);
          v.address = res;
        }
    },
    currentPage1(){

    },
    setIndex(index){     
      return (this.currentPage - 1) * 10 + index + 1
     },
    addressAnalys(map){
      this.map = map;     
    },
    /**
     * 获取参数
     */
    getData() {
      return {
        isShow: false,
        activeName: 'stopMak'
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
    },
    /**
     * 点击表格行
     * @param {Object} row 当前行的数据
     */
    handleRow(row) {        
       let index = this.pointArr.findIndex(item=>
        item.BDPt.lat == row.BDPt.lat && item.BDPt.lng == row.BDPt.lng
      ) 
      if(index > -1){
        eventBus.$emit('suspend', false);
        eventBus.$emit('setIndex', index);
        eventBus.$emit('handlePlay', null,null,index);          
        eventBus.$emit('changeState', 2); 
      } 

      // eventBus.$emit('handleRow', row.BDPt);
      console.log(this.pointArr);
    },
    /**
     * 选项卡切换
     * @param {Object} cur 当前选项卡的数据
     */
    handleClick() {
      this.isShow = true
    },
    getSearchData(search){
        this.search = search;
    },
    // 导出轨迹点，停车点
    exportPosition(){   
       const search = this.search;
       const begin =  search.dates[0];
       const end =  search.dates[1];
       const data = {
          VehTerminalNo : search.veh,
          StartTime: begin,
          EndTime: end
      };       
      if(this.activeName == "stopMak"){
          const num = this.stopList.length;
				if (num) {
					exportFile(num, "停车点报表",'stopTable');
				} else {
					Message.error(this.$t('otherText.msgExport'));
				}
      }else{
           request({
            url: `/api/services/app/GpsPosition/ExportPosition`,      
            method: 'POST',        
            data       
          }).then(async res => {
              if (res.result && res.success) {
                // location.href = `${process.env.VUE_APP_BASEURL}${res.result}`
                  const localHost = (window.location.href).split("/#")[0] + res.result;    
                  window.location.href = localHost;        
                }
            }).catch(err => {
              
            }) 
      }
         
    },

    /**
     * 轨迹点改变
     * @param {Numer} index 当前点的下标
     */
  async changeMarke(index) {
      if(index==0){
        this.currentPage = 1;
        this.pointList = this.pointArr.slice(0,10);
        // console.log( this.pointList)
        for( const v of this.pointList){
          const curPt = v.BDPt
          v.pt = curPt            
          const res = await this.map.getLocation(curPt);
          v.address = res;
        }       
      }
      this.index = index;      
      // console.log(this.pointArr);     
      if (!this.isShow || this.activeName !== 'marke') return     
     
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
  /* position: absolute;
  left: 0;
  width: 390px;
  height: 100%;
  background: #fff; */
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
  height: 500px !important;
}
.foot >>> .table-box {
  padding: 0;
  height: 85%;
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

