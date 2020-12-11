<!--  -->
<template>
  <div class="content">
    <tab-bar :searchList="searchList" :operButton="operButton" @exportFile="exportFile" ref="tabBar"  @searchNodeClick="handleNode" @query="query"
    @clickAdd="clickAdd" @clickDelete="clickDelete"  @check="check" @bindingCar="bindingCar" >   
    </tab-bar>      
    <my-table ref="table" isCheck :tableData="tableData" :tableTitle="tableTitle" @request="requestInfo" @handleCell="handleCell" @handleCelldbl="handleCelldbl" />
    <el-dialog  class="eldialogBox"  :close-on-click-modal="false"  :visible.sync="isDrawer" :show-close="false" :with-header="false" width="1085px" top="8vh"  >
      <div class="el-drawer-header">
        <h3>{{title}}</h3>
        <div class="btnBox" >
          <el-button @click="closeDrawer" > {{$t("button.close")}} </el-button>
          <el-button v-show="showSubmitBtn" type="primary"  @click="submitPreserve" > {{$t("button.preserve")}} </el-button>            
        </div>
      </div>
      <div class="drawer-body">
        <!-- 新增 -->
         <div class="drawer-body-leftTable">
            <click-button-add             
              :listLi="relationForm"  
              :showAddress="showAddress"  
              :disabled="disabled"
              :addList="addList"
              @check="treeCheck"  
              @node-click="handleNodeClick"    
              @changeSelect="addchangeSelect"          
              @timeSelectFocus="timeSelectFocus"              
            >
            </click-button-add>
         </div>
          
         <div class="drawer-body-rightMap">
           <my-map 
            @submitPointArr="submitPointArr"
            :showAddress="showAddress"
            :rowDetail="rowDetail"
            :showSubmitBtn="showSubmitBtn"
            :pointArr="pointArr"
            :markerType="markerType"
            :clearll="clearll"
            ref="map"  />
         </div>
      </div>
    </el-dialog>
    <el-dialog  class="" :title="$t('button.bandingCar')" :visible.sync="showBindingCar" :close-on-click-modal="false" :show-close="false" :with-header="false" width="1085px" :center="true"  >
        <div style="height:580px;padding:20px">
          <tab-bar-bandin :searchList="bandingSearchList" @changeSelect="changeSelect" :operButton="operButtonBandin"   @searchNodeClick="bandhandleNode"  ref="tabBar" @check="bindCheck"  @query="queryBanding">   
          </tab-bar-bandin>           
          <my-table height="400" ref="tablecar" :isPageing="false" isCheck :tableData="activePlateList" :tableTitle="bandingTitle"   @selectAll="selectAll"   />
          <div style="margin:auto;text-align:center;">
            <el-pagination
              background
              style="margin: 15px;"
              :page-size="10"           
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              layout="prev, pager, next"
              :total="bandinsPlateList.length">
            </el-pagination>   
            <el-button type="primary" @click="bandFenceBtn"> {{bandingSearchList.allocation.model ? $t('button.unbinding') : $t('button.binding') }}</el-button>    
            <el-button type="" @click="openBack">{{$t('button.cancel')}}</el-button>    
          </div>          
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryFence,queryVehicleInfo,bindFence, addFence,deleteFence ,managerFence} from '@/api/dpt'
import { mapGetters } from 'vuex'
import { getOperButton, getTodays } from '@/utils/data'
import ClickButtonAdd from './components/leftForm'
import { getCopyObj, getDateHMS, getDateStr, getParse } from '@/utils/util'
import { getAlarmRecodeDetailNew, alarmRecodeDetailNewExport } from '@/api/dataSearch/alarm'
import { getDevicerAlarmNew , exportDeviceAlarm} from '@/api/dataSearch/deviceAlarm'
import exportFile from '@/utils/exportFile'
import TabBar from './components/tabBar'
import TabBarBandin from '@/components/tabBar'
import MyTable from './components/myTable'
import { Message , Dialog , Pagination } from 'element-ui'
import MyMap from "./components/newmap";
import { getDepartmentAll } from '@/api/sysetsmM/dpt'
import address from '@/assets/json/address.json'
import getLngLat from '@/utils/coordtransform'
export default {
  name: 'newAllMonitor',
  components: {
    TabBar,
    MyTable,
    ElDialog : Dialog ,
    ClickButtonAdd,        
    ElPagination:Pagination,
    MyMap,
    TabBarBandin
  },
  data() {
    const searchList = getCopyObj(this.$t('mapAllMontior.searchList'))
    const tableTitle = this.$t('mapAllMontior.tableTitle')
    const bandingTitle = this.$t('mapAllMontior.bandingTitle');
    const bandingSearchList = this.$t('mapAllMontior.bandingSearchList');
    const data = this.getData()
    return {
      ...data,
      searchList,
      tableTitle,
      bandingTitle,
      bandingSearchList,
      showAddress:false,
      tableData: [],
      tableDataAll: [],
      operButton: {},
      markerType:0,
      rowDetail:{},
      operButtonBandin:{search:true},
      info: [],
      totalCount:0,
      curNode:{},
      submitPoint:[],
      showBindingCar:false,
      plateResult:[],
      activePlateList:[],
      bandinsPlateList:[],
      pointArr:[],
      currentPage:1,
			limit:10,
      isDrawer:false,      
      title:'新增',  
      rowLsit:{},
      bandindId:'',
      submitNode:{},   
      showSubmitBtn:true,
      disabled:false,
      code:'',     
      clearll:false,
      clearAll:false,
     addList:{
        provinceName:'',
        cityName:'',
        areaName:''
      },
      reslultData:{
        name:1,
      }
    }
  },
   computed: {
    ...mapGetters([
      'menuTree',
      'userInfo',
    ])
  },   
  async created() {
    const { $route, $store, menuTree, searchList } = this
    const url = $route.path
    this.operButton = getOperButton(menuTree, url)       
    try {      
      const res = await getDepartmentAll({ id: this.userInfo.id }, { dom: null });
      this.relationForm.fenceOrg.tree = res.result.items;    
      searchList.fenceOrg.tree = res.result.items;  
      // console.log(getTodays()); 
      this.relationForm.fencestartTime.model = getTodays()[0];
      this.bandingSearchList.fenceOrg.tree = res.result.items;   
      const tree = await $store.dispatch('data/setCarTree');         
      // this.bandingSearchList.vehTerminalNo.tree = tree;
      this.setInit()
    } catch(err) {

    }
    this.query();
    // eventBus.$on("addressName",this.getaddressName);
  },
  methods: { 
    changeSelect(data){      
      this.queryBanding();
    },
    addchangeSelect(data,key){
      if(key == "fencemarkType"){
        this.pointArr = [];         
         this.addList = {
          provinceName:'',
          cityName:'',
          areaName:''
        }
      if(this.relationForm.fencemarkType.model == "yes"){
            this.showAddress = true;           
        }else{
            this.showAddress = false;             
        }
      }      
    },
    selectAll(isCheck){
      for (const v of this.activePlateList.values()) {
        v.check = isCheck
      }
    },
    // 绑定复选
    bindCheck(res){
      let arr = [];
      let arr2 = [];
      for (const v of res.values()) {
        if (v.type == 2) {
          arr.push(v.vehTerminalNo);
          arr2.push(v.name);
        }
      }
      // es6的方法去重
      arr = Array.from(new Set(arr));
      arr2 = Array.from(new Set(arr2));
      this.bandingSearchList.vehTerminalNo.vehTerminalNo = arr.join();
      this.bandingSearchList.vehTerminalNo.model = arr2.join();
    },
    // 确认绑定事件
    bandFenceBtn(){
      const self = this;
      let data = {
        id: this.bandindId,
        vehTerminalNos:[]
      }  
      let oldVehterminalNos = [];
      const vehTerminalNos = this.activePlateList.reduce((arr, v) => {        
        if (v.check ) {
          // console.log(v.vehTerminalNo);
          arr.push(v.vehTerminalNo)
        }
        return arr
      }, [])
      if (!vehTerminalNos.length) {
        Message.error('请选择需要分配的车辆！')
        return
      }   
      let plateResult = JSON.parse(sessionStorage.getItem('plateResult'));         
      plateResult.bindVehicles.map(item=>{
        oldVehterminalNos.push(item.vehTerminalNo);
      })
      // console.log(oldVehterminalNos);
      if(this.bandingSearchList.allocation.model){                  
        data.vehTerminalNos = oldVehterminalNos.filter(function (val) { return vehTerminalNos.indexOf(val) === -1 })                    
      }else{
        data.vehTerminalNos= vehTerminalNos.concat(oldVehterminalNos);          
      }  
       
      bindFence(data).then(res=>{
        if(res.success){
          Message({
            type: 'success',
            message: this.$t('success.success')
          });
          sessionStorage.removeItem('plateResult')
          self.queryBanding();       
          self.query();
        }
      })    
      
    },
    //获取省市区名称
    getAreaName(code){
        if(this.markerType < 4){return};
        var province = code.slice(0,2)+"0000";
        var city = code.slice(0,4)+"00";
        var area = code;
        var provinceName,cityName,areaName;
        if(this.rowDetail.markerType == 5){        
         provinceName = (address.find(item => province == item.code)).name;          
        }
        if(this.rowDetail.markerType == 6){        
          for(var i = 0 ; i < address.length;i++){
            var item = address[i];            
            if(item.code == province){
              provinceName = item.name;
              cityName = (item.childs.find(_item => _item.code == city)).name;              
            }
          }         
        }
        if(this.rowDetail.markerType == 7){        
          for(var i = 0 ; i < address.length;i++){
            var item = address[i];            
            if(item.code == province){
              provinceName = item.name;
              // cityName = item.childs.find(_item=>_item.code == city);
              for(var j = 0 ; j < item.childs.length ; j++){
                if(city == item.childs[j].code){
                  cityName = item.childs[j].name;
                  areaName = (item.childs.find(_item => area == _item.code)).name;                  
                }
              }
            }
          }
        }
        return {provinceName,cityName,areaName}
      },
      // 数组内查询
    findBind(){
      const self = this;
      let dptPath = '';
      let vehPlateNo = "";      
      if(!!this.bandingSearchList.fenceOrg.curNode && this.bandingSearchList.fenceOrg.model ){
        dptPath = this.bandingSearchList.fenceOrg.curNode.dptPath
      }
      if(this.bandingSearchList.vehTerminalNo.model){
        vehPlateNo = this.bandingSearchList.vehTerminalNo.model;
      }
      let plateResult = JSON.parse(sessionStorage.getItem("plateResult"));
      let vehPlateNoArr = vehPlateNo.split(",");
      if(vehPlateNo){
        this.activePlateList = []
        if(this.bandingSearchList.allocation.model){
          // if(plateResult.bindVehicles.find(item => item.vehPlateNo == vehPlateNo))
          self.activePlateList = plateResult.bindVehicles.filter(item => {return vehPlateNoArr.indexOf(item.vehPlateNo) > -1});
        }else{
          // if(plateResult.unBindVehicles.find(item => item.vehPlateNo == vehPlateNo))
          self.activePlateList = plateResult.unBindVehicles.filter(item => {return vehPlateNoArr.indexOf(item.vehPlateNo) > -1})
          // self.activePlateList.push(plateResult.unBindVehicles.find(item => item.vehPlateNo == vehPlateNo));
        }
        this.bandinsPlateList  = this.activePlateList;
      }         
    },
    //  绑定车辆查询按钮
    queryBanding(){         
      const self = this;
      let dptPath = '';
      let vehPlateNo = "";      
      if(!!this.bandingSearchList.fenceOrg.curNode && this.bandingSearchList.fenceOrg.model ){
        dptPath = this.bandingSearchList.fenceOrg.curNode.dptPath
      }
      if(this.bandingSearchList.vehTerminalNo.model){
        vehPlateNo = this.bandingSearchList.vehTerminalNo.model;
      }
      // if(vehPlateNo){
      //   this.findBind();
      //   return;
      // }
      const data = {
        "id": this.bandindId,
        "vehPlateNo": vehPlateNo,
        "dptPath":  dptPath
      }           
      self.bandindId = data.id;
      queryVehicleInfo(data).then(res=>{
        if(res.success){
          if(!sessionStorage.getItem("plateResult")){
            sessionStorage.setItem('plateResult',JSON.stringify(res.result));
          }          
          this.currentPage  = 1;
          self.plateResult = res.result;
          if(self.bandingSearchList.allocation.model){
            self.bandinsPlateList  = res.result.bindVehicles;
          }else{
            self.bandinsPlateList  = res.result.unBindVehicles;
          }          
          self.activePlateList =  self.bandinsPlateList.slice(0,10);
          self.showBindingCar  = true;
        }       
      }) 
    },
    // 翻页
    handleCurrentChange(e){		
			this.currentPage = e ;
			this.limit = e * 10;		
			this.activePlateList = this.bandinsPlateList.slice(this.limit - 10 ,this.limit);			
		},
    submitPointArr(opt){
      //  console.log(opt);
       this.submitPoint = opt.pointArr;       
       this.markType = opt.markType;
       if(opt.markType > 4){
         this.code = opt.code;
         this.submitPoint = [];
       }
    }, 
    // 关闭
    closeDrawer(){      
      this.isDrawer = false;      
    },
    // 新建围栏
    submitPreserve(){     
      // let lngLats = "";
      const self = this;
      let arr2 = [];
      let arr = this.submitPoint;
			for (var i in arr) {
				arr2.push(arr[i].lng + ',' + arr[i].lat)
			}
      let markLatLngs = arr2.join(';');  
      let dptName = '';
      let dptPath = '';
      let areaCode = null;
      if(!this.relationForm.fenceName.model){
        Message.error('请输入围栏名称');
        return;
      }
      if(!this.relationForm.fenceOrg.orgcode){
        Message.error('请输入选择机构');
        return;
      }
      if( !this.code && arr.length < 1 ){
        Message.error('请确认围栏是否生成');
        return;
      }
      if(!this.relationForm.fenceRule.model){
        Message.error('请选择报警规则');
        return;
      }
      if(this.markType > 4){
        areaCode = this.code;
      }
      // console.log(this.submitNode);
      if(!!this.submitNode ){
        dptName = this.submitNode.dptName;
        dptPath = this.submitNode.dptPath;
      }else{
        let dptPath = '';
      } 
      if(new Date(this.relationForm.fencestartTime.model) >= new Date(this.relationForm.fenceDate.model) && this.relationForm.fenceDate.model){
        Message.error('开始日期不能大于截至日期');
        return
      }         
      let data = {
          "fenceName": this.relationForm.fenceName.model,
          "dptId": this.relationForm.fenceOrg.orgcode,
          "dptName": dptName,
          "dptPath": dptPath,
          "markType": this.markType,
          "lngLats": markLatLngs,
          "areaCode":areaCode,
          "fenceType": null,
          "fenceAlarmRule": this.relationForm.fenceRule.model,
          "fenceAlarmLimitValue": this.relationForm.fenceLimitValue.model,
          "fenceStartDate": this.relationForm.fencestartTime.model,
          "fenceEndDate": this.relationForm.fenceDate.model ?  this.relationForm.fenceDate.model + ' 00:00:00' : null,
          "fenceStartTime": this.relationForm.fenceStartTime.model ? this.relationForm.fenceStartTime.model + ':00' : null ,
          "fenceEndTime": this.relationForm.fenceEndTime.model ? this.relationForm.fenceEndTime.model + ":00" : null,           
          "isActive": true,
          "isPublic": true
        }
        addFence(data).then(res=>{
          if(res.success){
            Message({
							type: 'success',
							message: this.$t('success.add')
						});
            this.isDrawer = false;
            self.query();
          }
        }) 
    },
    openBack(){
      this.showBindingCar = false;
      sessionStorage.removeItem("plateResult")
    },
    /**
     * 点击树节点
     */
    handleNode(data) {
      this.curNode = data;         
      this.searchList.fenceOrg.orgcode = data.id;
      this.searchList.fenceOrg.model = data.dptName;
    },
  // 点击的是机构树还是车牌号树     
    bandhandleNode(data){              
      if(data.dptPath || data.dptName ){
        this.bandingSearchList.fenceOrg.curNode = data;         
        this.bandingSearchList.fenceOrg.orgcode = data.id;
        this.bandingSearchList.fenceOrg.model = data.dptName;
      }else{
        this.bandingSearchList.vehTerminalNo.id = data.vehTerminalNo;
        this.bandingSearchList.vehTerminalNo.model = data.name;
      }      
    },
    /**
		 * 固定时间输入框触发焦点
		 */
		timeSelectFocus(key) {
			// 根据开始时间和结束时间控制取值范围
			if (key == 'fenceStartTime') {
				this.relationForm[key].pickerOptions.maxTime = this.relationForm.fenceEndTime.model
			} else {
				this.relationForm[key].pickerOptions.minTime = this.relationForm.fenceStartTime.model
			}
    }, 
    // 初始化数据
    getData(){               
      let relationForm = getCopyObj(this.$t('mapAllMontior.relationForm'));          
      return {       
        relationForm
      }
    },    
    /**
		 * 添加标注表单取消之后 || 点击添加标注取消
		 */
		addClose() {
			this.$emit('clearOverlaysAll', true)
    },
    // 点击树
    handleNodeClick(data){    
      this.submitNode = data;
      this.relationForm.fenceOrg.model = data.dptName;
      this.relationForm.fenceOrg.orgcode = data.id;
    },
    /**
		 * 保存并关联车辆点击复选框
		 */
		treeCheck(nodeAll) {   
			var arr = []
			var arr2 = []
			for (var i in nodeAll) {
				if (nodeAll[i].type == 2) {
					/*拼接车牌号*/
					arr.push(nodeAll[i].name)
					/*拼接车辆id*/
					// arr2.push(nodeAll[i].vehTerminalNo);
					arr2.push(nodeAll[i].id)
				}
			}
			/*把选择的车辆拼接成字符串赋值给表单的输入框*/
			this.relationForm.fenceVehids.model = arr.join()
			/*保存选择复选框的车辆id*/
			this.curNode.fenceVehids = arr2.join()
    }, 
    // 新增围栏 
    clickAdd(){
      this.title = '新增标注';
      this.isDrawer = true;
      this.disabled  = false; 
      this.showSubmitBtn = true;
      this.clearll = true;     
      this.reset();
    },
    // 删除围栏
    clickDelete(){ 
      const self = this; 
      const fenceIds = this.tableData.reduce((arr, v) => {
        if (v.check && !v.alarmStatus) {
            arr.push(v.id)
          }
          return arr
        }, [])    
      if(fenceIds.length){
      this.$confirm('此操作将永久删除所选围栏, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data = {}; 
         
                data.fenceIds = fenceIds;
                deleteFence(data).then(res=>{
                  if(res.success){
                    Message({
                        type: 'success',
                        message: '删除成功!'
                      });
                    self.query();
                  }
                })
          
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消删除'
          });          
      });  
     }else{
       Message.error("请选择要删除的围栏")
     }              
    },     
      /**
     * 查询
     */
    query() {    
      const pageing = {
        curPage: 1,
        totalCount: 0
      }      
      this.$refs.table.setPageing(pageing);
      this.requestInfo();
    },
    // 绑定车辆弹窗
    bindingCar(){
      // console.log(this.searchList)  
     const self = this;
     const data = {
        "id": "",
        "vehPlateNo": "",
        "dptPath": ""   
     }
      const ids = this.tableData.reduce((arr, v) => {
        if (v.check && !v.alarmStatus) {
          arr.push(v.id)
        }
        return arr
      }, [])
      if (!ids.length) {
        Message.error('请选择要处理的数据！')
        return
      }
      if(ids.length > 1){
        Message.error('请选择一条数据数据进行操作')
        return
      }
      data.id = ids.join();   
      self.bandindId = data.id;
      this.bandingSearchList.vehTerminalNo.model = '';
      this.bandingSearchList.fenceOrg.model = "";
      this.queryBanding();  
    },
    // 解绑车辆
    unbindCar(){

    },
    /**
     * 请求数据
     */
    async requestInfo() {
      // const data = this.getOpt()
      const pageing = this.$refs.table.getPageing();
      let data = {
      "fenceName": "",
      "dptPath": "",
      "fenceAlarmRule": 10001,
      "fenceType": "",
      "isActive": true,
      "isPublic": true,
      "pageOption": {
          "pageIndex": pageing.curPage,
          "pageSize": pageing.limit,
          "total": pageing.totalCount
        }
    }     
    data.fenceName = this.searchList.fenceName.model;
    data.dptPath = this.curNode.dptPath;
    data.fenceAlarmRule = this.searchList.fenceRule.model;
    data.isActive = this.searchList.isActive.model;
    data.isPublic = this.searchList.isPublic.model;
    // console.log(data);
      try {
        const res = await queryFence(data)
        this.tableDataAll = res.result || []
        this.changeInfo()
      } catch(err) {

      }
    },
    /**
     * 校验参是是否通过
     * @return {[Object|Boolean]} 校验通过返回true，不通过反回false
     */
    hasOpt() {
      const { searchList } = this
      const dates = searchList.startEndTime.model
      if (!dates || !dates.length) {
        Message.error(this.$t('error.selectTimes'))
        return false
      }
      return true
    },
   
    /**
     * 静态改变数据
     */
    changeInfo() {      
      const pageing = this.$refs.table.getPageing();
      const start = (pageing.curPage - 1) * pageing.limit;
      const list = getCopyObj(this.tableDataAll.data);
      const i18n = this.$t('otherText');
      for (const v of list.values()) {
          v.fenceStartDate = getDateStr(v.fenceStartDate,true);
          v.fenceEndDate = getDateStr(v.fenceEndDate,true);
          v.disabled = {}
          v.disabled.isActive = v.isActive ;
          v.disabled.isPublic = v.isPublic;
          v.isActive = v.isActive ? '是' : '否';
          v.isPublic = v.isPublic ? '是' : '否';
          v.fenceStartTime = v.fenceStartTime;          
          // console.log(v.disabled);
          // v.disabled = "<span>禁用</span> <span>启用</span> span>公用</span> <span>私有</span>"
      }    
      this.tableData = list;

      // console.log(tableData);
      const totalCount = this.tableDataAll.pageOption.total;
      this.totalCount = totalCount;
      const obj = {
        isShow: false,
        totalCount
      }
      this.$nextTick(() => {
        this.$refs.table.setPageing(obj)
      })
    },
    // 
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
    // 清空值
    reset(){
      this.relationForm.fenceName.model = '';
      this.relationForm.fenceOrg.model = '';
      this.relationForm.fenceRule.model = '';
      this.relationForm.fencestartTime.model = getTodays()[0];
      this.relationForm.fenceDate.model = "",
      this.relationForm.fenceStartTime.model = "00:00"

      this.addList = {
        provinceName:'',
        cityName:'',
        areaName:''
      }
      this.showAddress = false;
      this.relationForm.fencemarkType.model = "no";
      // this.relationForm.fenceName.model = row.fenceName;
      // this.relationForm.fenceOrg.model = row.dptName;
      // this.relationForm.fenceRule.model = row.fenceAlarmRuleDisplay;
      // this.relationForm.fenceDate.model = getDateStr(row.fenceEndDate);
      // this.relationForm.fencestartTime.model = getDateStr(row.fenceStartDate)
      // this.relationForm.fenceStartTime.model = row.fenceStartTime;
      // this.relationForm.fenceDate.model = '';            
    },
    handleCell(row,code){
      // console.log(row,code)
      var id = row.id;
      var isActive = row.disabled.isActive;
      var isPublic = row.disabled.isPublic;
      var data = {
        id:id,
        isActive:null,
        isPublic:null
      }
      if(code == "isActive"){
        data.isActive = !isActive
      }
      if(code == "isPublic"){
        data.isPublic = !isPublic;
      }
      managerFence(data).then(res=>{
        if(res.success){
          this.query();
        }
      })
      
    },
    /**
     * 查看当前位置
     */
    handleCelldbl(row) {       
      // console.log(row)
      this.showSubmitBtn = false;
      this.title = "详情"
      this.isDrawer = true;
      this.clearll = false;
      this.rowLsit = row;
      let pointArr = row.lnglats;
      var markLatLngs = pointArr.split(';')				    
      this.pointArr = markLatLngs;
      this.markerType = row.markType; 
      this.rowDetail.pointArr = markLatLngs;
      this.rowDetail.markerType = row.markType;
      this.rowDetail.areaCode = row.areaCode;
      this.disabled  = true;
      if(row.areaCode){
        this.addList = this.getAreaName(row.areaCode);  
        this.relationForm.fencemarkType.model = "yes";
        this.showAddress = true;           
      }else{
        this.addList = {
          provinceName:'',
          cityName:'',
          areaName:''
        }
        this.relationForm.fencemarkType.model = "no";
        this.showAddress = false;
      }    
      // 赋值
      this.relationForm.fenceName.model = row.fenceName;
      this.relationForm.fenceOrg.model = row.dptName;
      this.relationForm.fenceRule.model = row.fenceAlarmRuleDisplay;
      this.relationForm.fenceDate.model = getDateStr(row.fenceEndDate);
      this.relationForm.fencestartTime.model = getDateStr(row.fenceStartDate)
      this.relationForm.fenceStartTime.model = row.fenceStartTime;
                   
    },
    /**
     * 转成天-时-分-秒
     */
    getDays(val) {
      if (val <= 0) {
        return '0';
      } else if (!val) {
        return '--';    
      } else {
        return getDateHMS(val, this.$t('otherText'));
      }
    },   
    /**
     * 点击导出
     */
    async exportFile() {
      const hasOpt = this.hasOpt()
      if (!hasOpt) {
        return
      }     
      let Opt = this.getOpt();
       
      let data = {
      "vehTerminalNos": Opt.vehTerminalNos,
      "startTime": Opt.startTime,
      "endTime": Opt.endTime,
      "alarmCategory": Opt.alarmCategory,
      "alarmDisplay": Opt.alarmDisplay,
      "alarmHandleStatus": Opt.alarmHandleStatus,
      "alarmLevel":  0,  
      "alarmDuration": 0
    }   
      try {
        const res = await exportDeviceAlarm(data);
        if(res.result){
          const localHost = (window.location.href).split("/#")[0] + res.result;    
          window.location.href = localHost;             
        }                 
      } catch(err) {

      }
    },
    /**
     * 搜索的树复选框选中
     */
    check(res, key) {    
      // console.log(res,key)  
      var arr = [];
      var arr2 = [];
      for (let v of res.values()) {
        // 车牌号
        if (key == 'vehTerminalNo') {
          const ttxVehicleCfg = v.ttxVehicleCfg || {};
          // 是否是视频设备
          if (v.type == 2 && ttxVehicleCfg.isVideoDevice) {
            arr.push(v.vehTerminalNo);
            arr2.push(v.name);
          }
        } 
        // 报警类型
        else if (key == 'alarmType' || key == 'alarmType2') {
          if (v.type == 2) {
            arr.push(v.id);
            arr2.push(v.label);
          }
        }
      }
      // es6的方法去重
      arr = Array.from(new Set(arr));
      arr2 = Array.from(new Set(arr2));
      this.searchList[key].id = arr.join();
      this.searchList[key].model = arr2.join();
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
}
.el-drawer-header{
  position: relative;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  border-radius: 2px 2px 0 0;
}
.el-drawer-header h3{
  margin: 0;
  color: rgba(0,0,0,.85);
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;    
}
.btnBox{
  position: absolute;
  right: 32px;
  top: 7px;
}
.drawer-body{
  height: calc(100vh - 200px);
  overflow-y: auto;
  /* padding: 24px; */
  display: flex;
}
.drawer-body-leftTable{
  flex:1;
}
.drawer-body-rightMap{
  width: calc(58% - 1px); 
  /* margin-left: 14px; */
  position: relative;
}
.eldialogBox >>> .el-dialog__body{
  padding: 0 !important;
}
.eldialogBox >>>  .el-dialog__header{
  padding: 0 !important;
}
.drawer-body-leftTable ul li {
    display: flex;
    justify-items: center;
    align-items: center;
    padding: 10px 15px;
}
.drawer-body-leftTable ul li h3{
  color: #999;
  font-size: 16px;
}
.drawer-body-leftTable ul li p{
  color: #333;
  font-size: 16px;
  margin-left: 15px;
}
</style>
