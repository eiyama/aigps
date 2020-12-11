<template>
  <div class="cp-page">         
      <div class="input_list">        
            <el-input  v-model="AdressName" placeholder="请输入需要搜索的目的地" clearable>
            </el-input>                  
            <div class="search"  @click="searchAddress">
              <i class="el-icon-search"  style="font-size: 25px;color:#fff" ></i>
            </div>              
      </div>        
    <div id="bmap-box" class="bMap"></div>
  </div>
</template>
<script>
import { Radio, InputNumber, TimeSelect, Upload, Input, Button, Tree, DatePicker, Select, Option, Dialog, Form, FormItem, Tooltip, Scrollbar } from 'element-ui'
import getLngLat from '@/utils/coordtransform'
 
import address from '@/assets/json/address.json'
  export default {
      components: {
        ElRadio: Radio,
        ElInputNumber: InputNumber,
        ElTimeSelect: TimeSelect,
        ElUpload: Upload,
        ElInput: Input,
        ElButton: Button,
        ElTree: Tree,
        ElDatePicker: DatePicker,
        ElSelect: Select,
        ElOption: Option,
        ElDialog: Dialog,
        ElForm: Form,
        ElFormItem: FormItem,
        ElTooltip: Tooltip,
        ElScrollbar: Scrollbar
    },
		data(){
		      return{
		        mapObj: null, //地图
		        drawingManager:null, //鼠标绘图工具
		        overlays:[],//清除底层图案
		        show:false,
            AdressName:'',
		        circle:null,//圆形
		        radius:'', //半径
		        circlecenter:[],//圆心坐标
		        circleArea:'', //面积		
		        polygon:null, //多边形
		        polygonPath:[],//获取多边形点坐标
		        polygonArea:'', //面积
            addressValue:{},
            showrendDraw:false,
		      }
     },      
     created(){
    //   this.loadBMapScript();
    },
    props:{
        pointArr: {
          type: Array,
          default: () => {}
        },
        markerType:{
            type:Number,
            default: () => {}
        },
        showAddress:{
            type:Boolean,
            default: false
        },
        showSubmitBtn:{
            type:Boolean,
            default: false
        },
        clearll:{
          type:Boolean,
          default:false,
        },
        rowDetail:{
          type:Object,
          default: () => {}
        }
    },
    watch:{
      showAddress(oldVal,newVal){    
        var BMapLib_Drawing = document.getElementsByClassName('BMapLib_Drawing');
        // console.log(BMapLib_Drawing)          
        if(BMapLib_Drawing[0]){
          if(!newVal){                   
            BMapLib_Drawing[0].style.display = "none"          
            // this.DrawingManager.enableDrawingTool = false;     
          }else{
            BMapLib_Drawing[0].style.display = ""          
          }
        }
       
      },
      pointArr(newVal,oldVal){
        if(newVal.length ){                       
          if(this.markerType < 5){
            this.drawDetail(newVal);   
          }else{
            var addressName = this.getAreaName(this.rowDetail.areaCode);
            eventBus.$emit("addressName",addressName);
          }                             
        }else{
            this.clearAll();  
        }
      },
      clearll(newVal){
        if(newVal){       
          this.showDraw();   
          this.clearAll();   
          let point = new BMap.Point(116.404, 39.915);               
          this.map.centerAndZoom(point, 14);       
        }
      },       

    },
    destroyed(){
      this.map = null;
      this.mapObj = null;
    },
    mounted(){
      this.initMap();
      //初始化加载绘图工具  
    	eventBus.$on('addressObj',this.setAddress);
      // this.$nextTick(function () {
      this.showDraw();     
      var BMapLib_Drawing  = document.getElementsByClassName('BMapLib_Drawing');          
      if(!this.showSubmitBtn){                   
        BMapLib_Drawing[0].style.display = "none"                       
      }else{
        BMapLib_Drawing[0].style.display = ""          
      }
      if(this.pointArr.length ){                       
            if(this.markerType <5){
              this.drawDetail(this.pointArr);   
            }else{
              var addressName = this.getAreaName(this.rowDetail.areaCode);
              eventBus.$emit("addressName",addressName);
            }            
        }  
    if(this.clearll){       
      this.showDraw();   
      this.clearAll();   
      let point = new BMap.Point(116.404, 39.915);               
      this.map.centerAndZoom(point, 14);       
    }          
    },
    methods:{            
      // 设置行政区域
      setAddress(addressObj){         
        this.addressValue = addressObj;      
        let self = this;
        // 创建地址解析器实例     
        let myGeo = new BMap.Geocoder();      
        let name = addressObj.name;
        this.getBoundary(name);        
        // 将地址解析结果显示在地图上，并调整地图视野             
      },       
      //初始化地图
      initMap: function () {
        // console.log(8)
        let self = this;
        let map =  new BMap.Map('bmap-box');
        // 创建点坐标
        let point = new BMap.Point(116.404, 39.915);
        this.map = map;        
        map.centerAndZoom(point, 14);                     
        //开启鼠标滚轮缩放
        map.enableScrollWheelZoom(true);
        //鱼骨图                                      
        self.mapObj = map;
      },
       // 收缩定位
    seachBoundary(name){            
        const self = this;
        var bdary = new BMap.Boundary();
        bdary.get(name, function(rs){       //获取行政区域
          self.map.clearOverlays();        //清除地图覆盖物       
          var count = rs.boundaries.length; //行政区域的点有多少个          
          if (count === 0) {
            alert('未能获取当前输入行政区域');
            return ;
          }
          var pointArray = [];
          // console.log(rs.boundaries);           
          for (var i = 0; i < count; i++) {       
            var ply = new BMap.Polygon(rs.boundaries[i]); //建立多边形覆盖物
            // self.map.addOverlay(ply);  //添加覆盖物            
            pointArray = pointArray.concat(ply.getPath());
          }                   
          self.map.setViewport(pointArray);    //调整视野            
                               
        });         
      },
      // 行政区域划分
    getBoundary(name){            
        const self = this;
        var bdary = new BMap.Boundary();
        bdary.get(name, function(rs){       //获取行政区域
          self.map.clearOverlays();        //清除地图覆盖物       
          var count = rs.boundaries.length; //行政区域的点有多少个
          
          if (count === 0) {
            alert('未能获取当前输入行政区域');
            return ;
          }
          var pointArray = [];
          for (var i = 0; i < count; i++) {
            var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2,  strokeColor:"red",   fillColor:"red" }); //建立多边形覆盖物
            self.map.addOverlay(ply);  //添加覆盖物            
            pointArray = pointArray.concat(ply.getPath());
          }       
          // console.log(pointArray);          
          self.map.setViewport(pointArray);    //调整视野            
          let submitPointArr = {};
          submitPointArr.pointArr = pointArray;
          submitPointArr.markType = self.addressValue.markType;
          submitPointArr.code = self.addressValue.code;
          self.$emit("submitPointArr",submitPointArr);                      
        });         
      },
      // 绘制详情地图
      drawDetail(pointArr){
        this.mapObj = null;
        this.map = null;
        let map =  new BMap.Map('bmap-box');
        // 创建点坐标
        this.mapObj = map;
        this.map = map;
        let point = new BMap.Point(116.404, 39.915);             
        map.centerAndZoom(point, 14);                     
        //开启鼠标滚轮缩放
        map.enableScrollWheelZoom(true);        
        let self = this;        
        self.clearAll();        
        // 如果是详情则显示已有标记
        const markerType = this.markerType; 
        let pointArray = []         
        if(pointArr.length){
          let overLay = null;
           let styleOptions = {
            strokeColor:"red",    //边线颜色。
            fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: 1.5,       //边线的宽度，以像素为单位。
            strokeOpacity: 1,	   //边线透明度，取值范围0 - 1。
            fillOpacity: 0.35,      //填充的透明度，取值范围0 - 1。
            strokeStyle: 'solid' //边线的样式，solid或dashed。
          };         
          
          pointArr.map(item=>{                            
            let latLng = item.split(',');   
            let bd_point =  getLngLat(latLng[0], latLng[1], 'gcj02tobd09')                                            
            pointArray.push(new BMap.Point(bd_point.lng,bd_point.lat)); 
            
          })
          // console.log(pointArray)
          // console.log(pointArray,markerType);
          // this.mapObj.clearOverlays();
          switch (markerType){
                case 1 : 
                  overLay = new BMap.Marker(pointArray[0])                  
                 break;
                case 2 :
                  overLay = new BMap.Polyline(pointArray, styleOptions)                   
                  break;                
                default:
                   overLay = new BMap.Polygon(pointArray,styleOptions)
                break;                   
            }                                                                                                              
            //增加多边形，           
            map.addOverlay(overLay);    
            console.log(overLay)         
            var viewPort = map.getViewport(pointArray)                     
            map.centerAndZoom(viewPort.center, viewPort.zoom > 18 ?  12  : viewPort.zoom );                                     
        }
      },
      //显示绘制工具
      showDraw(){
    
        let self = this;
        self.show = true;       
        self.clearAll();          
        //画图样式         
          if(!this.showrendDraw && this.markerType < 5 ){       
            this.drawDetail(this.pointArr);
          }                    
          let styleOptions = {
            strokeColor:"red",    //边线颜色。
            fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: 1.5,       //边线的宽度，以像素为单位。
            strokeOpacity: 1,	   //边线透明度，取值范围0 - 1。
            fillOpacity: 0.35,      //填充的透明度，取值范围0 - 1。
            strokeStyle: 'solid' //边线的样式，solid或dashed。
          };
        //生成鼠标绘制工具
        self.drawingManager = new BMapLib.DrawingManager(self.mapObj , {
          isOpen: false,
          enableDrawingTool:true, //是否显示工具栏
          drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT,
            offset: new BMap.Size(5, 50),             
          },
          //图形默认样式
          circleOptions: styleOptions,
          polylineOptions: styleOptions,
          polygonOptions: styleOptions,
          rectangleOptions: styleOptions
        });
        //判断图案类型        
        let markType = 0;
        let overlaycomplete = function(e){          
          //清除底层图案
          self.mapObj.clearOverlays();
           //判断画图的类型          
          if(e.drawingMode=='circle'){
            self.clearData();          
            self.radius =  e.overlay.getRadius();//圆半径
            self.circlecenter = e.overlay.getCenter(); //圆心坐标
            self.circleArea = 3.14*(self.radius*self.radius)
            self.drawingManager.close();
            //增加圆
            self.mapObj.clearOverlays();
            self.circle = new BMap.Circle(self.circlecenter,self.radius,styleOptions);
            self.mapObj.clearOverlays();
            self.mapObj.addOverlay(self.circle);
            markType = 3;
            //编辑圆
            // self.circle.enableEditing();
            // self.circle.addEventListener("lineupdate",function(e){
            //   self.circlecenter=e.target.point; //圆心
            //   self.radius=e.target.Da; //半径
            //   self.circleArea = 3.14*(self.radius*self.radius); //面积
            // });
          }else if(e.drawingMode=='rectangle'){
              //画多边形           
              self.clearData();
              self.polygonPath = e.overlay.getPath(); //获取多边形路径点                                
              self.drawingManager.close();
              self.mapObj.clearOverlays();
              //增加多边形，
              self.polygon = new BMap.Polygon(self.polygonPath, styleOptions);
              self.mapObj.clearOverlays();           
              self.mapObj.addOverlay(self.polygon);
              markType = 4;
              //编辑多边形
            //   self.polygon.enableEditing();
            //   self.polygon.addEventListener("lineupdate",function(e){
            //     self.polygonArea = ""; //面积               
            //     //alert(e.target.Nc[0].tb.lng);
            //     // console.log(e.target.Nc[0].tb.lng)
            //   });
          }else if(e.drawingMode=='marker'){
            //显示mark点
            self.clearData();
            self.drawingManager.close();
            self.mapObj.clearOverlays();
            let point = e.overlay.point;
            let marker = new BMap.Marker(point);// 创建标注           
            self.mapObj.clearOverlays();
            self.mapObj.addOverlay(marker);
            marker.enableDragging();
            markType = 1 ;
          }else if(e.drawingMode=='polyline'){
            self.clearData();
            self.drawingManager.close();
            self.mapObj.clearOverlays();
            let polyPath = e.overlay.getPath();            
            let polyline= new BMap.Polyline(polyPath,styleOptions)
            self.mapObj.clearOverlays();
            self.mapObj.addOverlay(polyline); 
            markType = 2;
            // polyline.enableEditing()
          }
          let pointArr = [];
          if(e.drawingMode=='marker'){
            let {lat,lng} = e.overlay.point;             
            pointArr.push({lat,lng});                       
          }else{
            pointArr = e.overlay.getPath();                                               
          }                    
          pointArr =  pointArr.map(item=>{
            return item = getLngLat(item.lng,item.lat, 'bd09togcj02')
          })  
          console.log(pointArr)             
          self.$emit("submitPointArr",{pointArr,markType});                  
        };             
        //监听画图方法
        self.drawingManager.addEventListener('overlaycomplete', overlaycomplete);                        
      },

      searchAddress(){
        let self = this;
        // 创建地址解析器实例     
        let myGeo = new BMap.Geocoder();      
        let name = this.AdressName;
        this.seachBoundary(name)
        // 将地址解析结果显示在地图上，并调整地图视野    
         
      },
      getAreaName(code){
        if(this.markerType < 4){return};
        var province = code.slice(0,2) + "0000";
        var city = code.slice(0,4) + "00";
        var area = code;
        var provinceName,cityName,areaName;
        if(this.rowDetail.markerType == 5){        
         provinceName = (address.find(item => province == item.code)).name;
         this.getBoundary(provinceName)
        }
        if(this.rowDetail.markerType == 6){        
          for(var i = 0 ; i < address.length;i++){
            var item = address[i];            
            if(item.code == province){
              provinceName = item.name;
              cityName = (item.childs.find(_item=>_item.code == city)).name;
              this.getBoundary(cityName)
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
                  areaName = (item.childs.find(_item=>area == _item.code)).name;
                  this.getBoundary(areaName)
                }
              }
            }
          }
        }
        return {provinceName,cityName,areaName}
      },
      //清空坐标点
      clearData(){
        let self=this;
        self.radius=''; //半径
        self.circleArea='';
        self.polygonArea="";
      },
      //重置方法
      clearAll(){
        let self=this;
        self.clearData();
        self.mapObj.clearOverlays();
        for(let i = 0; i < self.overlays.length; i++){
          self.mapObj.clearOverlays(self.overlays[i]);
        }
        self.overlays.length = 0;
      },

    }

}
</script>
<style scoped>
.bMap{
  width: 100%;
  height: 730px;    
}
.input_list{
    position: absolute;
    top: 0px;
    left: 0px;
    height: 36px;
    width: 443px;
    background-color: #fff;
    border-radius: 1px;
    box-shadow: 2px 3px 3px #aeada8;
    z-index: 9;
}
.search{
  background: #1890ff;
  border: 0;   
  padding: 7px 20px;
  position: absolute;
  right: 0;
  top: 0;
}
ul li {list-style: none;}
.info {
      z-index: 999;
      width: auto;
      min-width: 22rem;
      padding: .75rem 1.25rem;
      margin-left: 1.25rem;
      position: fixed;
      top: 1rem;
      background-color: #fff;
      border-radius: .25rem;
      font-size: 14px;
      color: #666;
      box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
  }
  .drawing-panel {
      z-index: 999;
      position: fixed;
      bottom: 3.5rem;
      margin-left: 2.5rem;
      padding-left: 0;
      border-radius: .25rem;
      height: 47px;
      box-shadow: 0 2px 6px 0 rgba(27, 142, 236, 0.5);
  }
  .bmap-btn {
      border-right: 1px solid #d2d2d2;
      float: left;
      width: 64px;
      height: 100%;
      background-image: url(//api.map.baidu.com/library/DrawingManager/1.4/src/bg_drawing_tool.png);
      cursor: pointer;
  }
  .drawing-panel .bmap-marker {
      background-position: -65px 0;
  }
  .drawing-panel .bmap-polyline {
      background-position: -195px 0;
  }
  .drawing-panel .bmap-rectangle {
      background-position: -325px 0;
  }
  .drawing-panel .bmap-polygon {
      background-position: -260px 0;
  }
  .drawing-panel .bmap-circle {
      background-position: -130px 0;
  }
</style>
