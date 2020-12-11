<template>
  <div class="cp-page">                  
    <div id="bmap-box" class="bMap"></div>
  </div>
</template>
<script>
// import { Radio, InputNumber, TimeSelect, Upload, Input, Button, Tree, DatePicker, Select, Option, Dialog, Form, FormItem, Tooltip, Scrollbar } from 'element-ui'
import getLngLat from '@/utils/coordtransform'
import address from '@/assets/json/address.json'
  export default {       
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
            iconstart: require("@/assets/image/map/shi.png"),
            iconend:require("@/assets/image/map/zhong.png"),
		        polygonArea:'', //面积
            addressValue:{},
            showrendDraw:false,
            pointArray:[],
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
             this.drawDetail(newVal);                                                 
        }else{
          this.clearAll();  
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
      if(this.pointArr.length ){                                   
          this.drawDetail(this.pointArr);                  
      }                
    },
    methods:{            
         
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
        if(pointArr.length){
           let overLay = null;
           let styleOptions = {
            strokeColor:"red",    //边线颜色。
            fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: 3.5,       //边线的宽度，以像素为单位。
            strokeOpacity: 1,	   //边线透明度，取值范围0 - 1。
            fillOpacity: 0.35,      //填充的透明度，取值范围0 - 1。
            strokeStyle: 'solid' //边线的样式，solid或dashed。
          };                                  
            pointArr.map((item,index)=>{
                var title = index == 0 ? "实际路线" : "推荐路线";
                styleOptions.strokeColor = index == 0 ? "red" : "#07c160";
                let pointArray = [];
                item.map(_item=>{   
                    let point = this.getPoint(_item[0],_item[1])    
                    pointArray.push(new BMap.Point(point.lng,point.lat))
                })      
                    
                overLay = new BMap.Polyline(pointArray,styleOptions)                                                                                                                                
                map.addOverlay(overLay);  
                var label = new BMap.Label(title, {       // 创建文本标注
                    position: pointArray[100],            // 设置标注的地理位置
                    offset: new BMap.Size(0, 0)           // 设置标注的偏移量
                })  
                map.addOverlay(label);  
                var myIcon = new BMap.Icon(this.iconstart, new BMap.Size(30, 30));//起点
                var marker = new BMap.Marker(pointArray[0],{icon:myIcon});   
                var myIconend = new BMap.Icon(this.iconend, new BMap.Size(30, 30));//起点
                var markeredn = new BMap.Marker(pointArray[pointArray.length-1],{icon:myIconend});              
                map.addOverlay(marker); 
                map.addOverlay(markeredn);                                  
                this.pointArray = pointArray;      
            })  
            let viewPort = map.getViewport(this.pointArray);  
            console.log(viewPort)                   
            map.centerAndZoom(viewPort.center, viewPort.zoom > 18 ?  12  : viewPort.zoom );                                                                               
        }
      },
     
      // 坐标转换
      getPoint(lng, lat) {
          const BDPt = getLngLat(lng, lat, 'gcj02tobd09')
          return BDPt
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
        self.map.clearOverlays();
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
  height: 530px;    
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
