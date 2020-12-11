<template>
  <!-- <div @mousedown.stop id="trail-map"></div> -->
  <baidu-map class="bm-view" ref="map"  @ready="map_handler"  :center="center" :zoom="zoom" :mapClick="false" scrollWheelZoom ak="dF8sMa2zZUk8znVfxyvzxQjsiQWrDfW2">
  <bm-scale anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-scale>
    <!-- 轨迹 -->
    <bm-polyline-new
      v-for="(v, i) of speedAll"      
      :stroke-color="v.color"
      :path="v.polyline"
      :stroke-weight="6"            
    />
    <!-- 海量点 -->     
    <bm-point-collection      :points="pointCollection"    shape="BMAP_POINT_SHAPE_CIRCLE"
     color="#ffffff00" size="BMAP_POINT_SIZE_NORMAL" @mouseover="mouseoverPoint" @mouseout="mouseoutPoint" @click="clickHandler">
    </bm-point-collection>     
    <!-- 覆盖物，车 -->
    <bm-marker              
      v-for="(v, i) of markers" 
      :key="`1${i}`"     
      :offset="v.offset"
      :rotation="v.rotation"
      :position="v.pt"
      :icon="v.icon"
      :zIndex="v.zIndex"
      :show="v.show" 
      :v-if="v.show"            
      @click="handleMarker(i)"
    >
    </bm-marker>
    <!-- 车辆信息 -->
    <bm-overlay
      v-for="(v, i) of infoWin"
      :key="`01${i}`"
      ref="overlay"
      pane="labelPane"
      class="sample"
      :zIndex="v.zIndex"
      :pt="v.pt"
      :y="v.y"   
      @draw="draw($event, i)"
    >
      	<!-- <bm-info-window  :position="v.pt" :height="200" :width="300"  :show="v.show"  :closeOnClick="false" >				
				  <div class="vehinfoW">	 -->
            <veh-info-win v-show="v.show" :info="v" @handleColse="handleColse" />
				  <!-- </div>
      	</bm-info-window> -->
    </bm-overlay>
  <!-- </div> -->
  </baidu-map>
</template>

<script>
import VehInfoWin from '@/components/map/VehInfoWin'
import { getCopyObj } from '@/utils/util'
import getLngLat from '@/utils/coordtransform'
import { BaiduMap,BmInfoWindow, BmPolylineNew, BmPolyline , BmScale, BmMarker, BmOverlay , BmPointCollection } from 'vue-baidu-map/components';
export default {
  components: {  
    BmScale,
    BaiduMap,
    BmMarker,
    BmOverlay,
    BmPolylineNew,
    VehInfoWin,
    BmPolyline,
    BmInfoWindow,
    BmPointCollection,   

  },
  data() {
    const data = this.getData()
    return {
      pointLabel:null,
      oTrail: null,
      pointIndex:0,
      LinePath:[],
      showMax:false,
      linesMax:[],
      BMap:null,
      map:null,
      pointCollection:[],
      ...data
    }
  },
  created() {
    eventBus.$on('suspend', this.suspend)
    eventBus.$on('changeTaktTime', this.changeTaktTime)
    eventBus.$on('handlePlay', this.trailPlay)
    eventBus.$on('initData', this.initData)
    eventBus.$on('handleRow', this.handleRow)   
  },
  mounted(){    
      
  },
  beforeDestroy() {
    eventBus.$off('suspend', this.suspend)
    eventBus.$off('changeTaktTime', this.changeTaktTime)
    eventBus.$off('handlePlay', this.trailPlay)
    eventBus.$off('initData', this.initData)
    eventBus.$off('handleRow', this.handleRow)
    this.onDestory()
  },
  methods: {  
     map_handler({ BMap, map }) {
            let _this = this
            this.BMap = BMap
            this.map = map            
        },  
    /**
     * 初始化数据
     */
    getData() {
      return {
        index: 0,
        pointArr: [],
        stopList: [],
        time: 300,
        switch: true,
        lineArr: [],
        markes: [],
        markers: [],
        infoWins: [],
        center: {
          lng: 116.404,
          lat: 39.915 
        },
        zoom: 7,
        lines: [],
        lineData: {},
        infoWin: [],  
        speedAll:[], 
        linePath:[]          
      }
    },
    /**
     * 轨迹初始化参数
     */
    initData() {
      this.index = 0
      this.switch = true
      this.lines = []
      for (const v of this.infoWin.values()) {
        v.show = false
      }
      for (const v of this.markers.values()) {
        v.show = false
      }      
    },
    /**
     * 监控页面点击关闭初始化数据
     */
    onDestory() {
      const data = this.getData()
      for (const [k, v] of Object.entries(data)) {
        this[k] = v
      }
    },
    // 清除轨迹
     resetLine(){      
       for (const route of this.linePath) {
          this.map.removeOverlay(route);
       }   
     },       
    /**
     * 点击轨迹表格行
     * @param {String} lng 经度
     * @param {String} lat 纬度
     */
    handleRow(pt) {
      // console.log(pt)
      if (this.switch) return;
      for(let i = 0 ; i <  this.pointArr.length ; i++ ){         
        if(this.pointArr[i].gcj02Coordinate.lat == pt.lat && this.pointArr[i].gcj02Coordinate.lng == pt.lng){
            this.trailPlay( null, null,i);
            this.suspend(false);              
            eventBus.$emit('changeState', 2); 
            return;            
        }
      }       
    },  
    /**
     * 播放轨迹
     * @param {Array} arr 轨迹数据
     * @param {Array} stop 停车点数据
     */
    async trailPlay(arr, stopArr,pointIndex) {   
      if (arr) {
        this.pointArr = arr;
        this.stopList = stopArr;
        // await this.drawLine(arr);
        await this.addpolyline(arr);              
        this.drawStopMarke(stopArr);
      }      
      //  拖动时
       if(pointIndex || pointIndex == 0 ){
        this.index = pointIndex;        
      }              
      const {index, pointArr, infoWin, markers } = this
      const length = pointArr.length
      if (!length) {
        return
      }        
      const v = pointArr[index]
      const curPt = v.BDPt
      v.pt = curPt      
      if (pointIndex || pointIndex == 0 || index === length - 1) {
        const res = await this.$refs.map.getLocation(curPt);
        v.address = res;
      }
      // 当前点不在可视区的时候地图会以当前点为中心移动
      if (!this.$refs.map.isVisualArea(curPt)) {
        this.center = curPt
      }
      const vehData = {
        url: require('@/assets/image/map/hc.png'),
        w: 15,
        id: 'veh',
        popupId: 'base',
        pt: curPt,
        zIndex: 2,
        rotation: v.gpsDirect
      }    
      // 车辆marker vehData为点
      this.setMarker(vehData); 
      const item = infoWin.find(e => e.id === vehData.popupId)
      if (!item || ((index === 0 || item.show) && item.markerId === vehData.id)) {
        const index = markers.findIndex(e => e.id === vehData.id)
        if (index > -1) {
          this.handleMarker(index)
        }
      }      
      if (index === 0) { 
        if(!this.switch){//第一次搜索不播放
          eventBus.$emit('changeState', 2);
        }        
      } else if (index === length - 1) {
        this.switch = false;
        this.index = 0;      
        eventBus.$emit('changeState', 3);       
      }
      this.index++
      eventBus.$emit('setSlider', index,v.gpstime)
      setTimeout(() => {
        if (this.switch) {
          this.trailPlay()
        }
      }, this.time)
    },
    // 点击轨迹事件
    clickHandler(e){           
      let index = this.pointArr.findIndex(item=>
        item.BDPt.lat == e.point.lat && item.BDPt.lng == e.point.lng
      )      
      if(index > -1){
        this.trailPlay( null, null,index);
        this.suspend(false);              
        eventBus.$emit('changeState', 2); 
        eventBus.$emit('changeIndex', index); 
        return;
      }   

    },
    // 海量点鼠标移动上去显示时间
    mouseoverPoint(e){
      var opts = {
          position : e.point,    // 指定文本标注所在的地理位置
          offset   : new BMap.Size(5, -25)    //设置文本偏移量
      }
      let point= this.pointArr.find(x=>x.BDPt.lat == e.point.lat && x.BDPt.lng == e.point.lng)
      if(point){
          this.pointLabel = new BMap.Label(point.gpstime, opts);  // 创建文本标注对象
              this.pointLabel.setStyle({
                color : "#333333",
                fontSize : "12px",
                height : "20px",
                lineHeight : "20px",
                fontFamily:"微软雅黑"
              });
          this.map.addOverlay(this.pointLabel); 
      }         
    },
    // 海量点鼠标移出
    mouseoutPoint(e){
      // console.log(this.pointLabel);
      this.map.removeOverlay(this.pointLabel)
    },
    /**
     * 经纬度数据
     */
    drawLine(pointArr) {
      return new Promise(resolve => {
        let points = [];
        let distance = 0;  
        let speedmax = 0;             
        let speedmin = 0;             
       for (const [i, v] of pointArr.entries()) {                                    
        points.push(v.BDPt)                      
        if (points.length > 1) {                       
           distance += this.$refs.map.getDistances(points);
           const isEnd = i === pointArr.length - 1;                                
           if ( distance  >= 15000 || isEnd ) { 
             speedmin = 0;
             speedmax = 0;        
             const obj = {
              points: getCopyObj(points),
              color: v.gpsSpeed <= 80 ? 'green' : 'red',
              isIcons: i !== pointArr.length - 1,
              id: 'line',
              popupId: 'base',
              pt: v.BDPt
            }
            this.lines.push(obj);                      
            points = points.slice(-1);
            distance = 0;            
           }
           if (isEnd) {
             this.setStartEndMarker(false, v.BDPt)
           }
          } else {
            this.setStartEndMarker(true, v.BDPt)
          }
       }        
       resolve()
      })
    },
    // 画轨迹
    addpolyline(list){
        let lineColor = '';
        let speedAll = []; 
        let speedMin = [];
        let speedMax = [];
        // if(this.speedAll.length){
        //     this.resetLine();  
        //     this.linePath = [];             
        // }     
        this.speedAll = [];  
        this.pointCollection = [];
        for(let i = 0 ; i < list.length; i++ ) {            
            var v = list[i];   
            this.pointCollection.push(v.BDPt);          
            v.BDPt = new BMap.Point(v.BDPt.lng, v.BDPt.lat); 
            if(v.gpsSpeed>80){              
              if(speedMin.length>1){
                speedMin.push(v.BDPt)
                let route={}
                route.color = 'green'
                route.polyline= speedMin
                speedAll.push(route)
                speedMin=[]
              }else if(speedMin.length==1){
                speedMax.push(speedMin[0])
                speedMin=[]
              }
              speedMax.push(v.BDPt)
            }else{
              if(speedMax.length>1){
                speedMax.push(v.BDPt)
                let route={}
                route.color = 'red'
                route.polyline= speedMax
                speedAll.push(route)
                speedMax=[]
              }else if(speedMax.length==1){
                speedMin.push(speedMax[0])
                speedMax=[]
              }
              speedMin.push(v.BDPt)
            }     
          }
          let route={}
          route.color =speedMax.length>0?"red":"green"
          route.polyline=speedMin.concat(speedMax)
          speedAll.push(route)
          speedMin=[]
          speedMax=[]
          this.setStartEndMarker(true, list[0].BDPt);    
          this.setStartEndMarker(false, list[list.length-1].BDPt);
          this.speedAll = speedAll;
          // for (const route of speedAll) {
          //   let polyline = new BMap.Polyline(route.polyline, 
          //                       {
          //                       strokeColor : route.color, //线路颜色
          //                       strokeWeight : 6,  //线路大小                                
          //                       });   //创建折线   
          //   this.linePath.push(polyline);                             
          //   this.map.addOverlay(polyline); 
          // }
          let mapViewObj = this.map.getViewport(this.pointCollection); 
          this.map.centerAndZoom(mapViewObj.center, mapViewObj.zoom);
    },
    /**
     * 绘制停车点
     * @param {Array} stopArr 停车点的数据
     */
    drawStopMarke(stopArr) {
      if (!(stopArr instanceof Array) || !stopArr.length) return
        const { pointArr } = this
      for (const v of stopArr.values()) {
        const startTime = new Date(v.stopStartTime).getTime()
        const elem = pointArr.find(e => new Date(e.gpstime).getTime() >= startTime)
        if (elem) {
          this.setMarker(
            {
              url: require('@/assets/image/map/mapTrailIcon2.png'),
              w: 18,
              h: 18,
              id: 'stop',
              popupId: 'stop',
              pt: v.BDPt,
              isAdd: true
            }
          )
        }
      }
    },
    /**
     * 设置起始点与终点的marker
     * @param {Boolean} isStart true为起始点，false为终点
     * @param {Object} pt 当前点的经纬度
     */
    setStartEndMarker(isStart, pt) {
      const url = isStart ? require('@/assets/image/map/shi.png') : require('@/assets/image/map/zhong.png')
      const id = isStart ? 'start' : 'end'
      this.setMarker(
        {
          url,
          y: -18,
          id,
          popupId: 'base',
          pt
        }
      )
    },
    /**
     * 设置marker,没有就创建，有就修改
     */
    setMarker(opt) {
      const index = opt.isAdd ? -1 : this.markers.findIndex(elem => elem.id === opt.id)
      if (index > -1) {
        this.$set(this.markers[index], 'pt', opt.pt)
        this.$set(this.markers[index], 'show', true)
        this.$set(this.markers[index], 'rotation', opt.rotation || 0)
      } else {
        const data = {
          icon: {
            url: opt.url,
            size: {
              width: opt.w || 28,
              height: opt.h || 34
            }
          },
          offset: {
            height: opt.y || 0,
            width: opt.x || 0
          },
          pt: opt.pt,
          id: opt.id,
          popupId: opt.popupId,
          rotation: opt.rotation || 0,
          show: true,
          zIndex: opt.zIndex || 1
        }
        this.markers.push(data)
      }
    },
    /**
     * 自定义覆盖物改变postion的值
     */
    draw ({ el, BMap, map, pt }, i) {
      const { lng, lat } = pt
      const { infoWin } = this
      if (!infoWin.length) {
        return
      }
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat));        
      // this.zoom = map.getViewport(this.pointArr).zoom;
      // console.log(pixel);
      // el.style.left = pixel.x - 60 + 'px'
      const w = infoWin[i].css.width.replace('px', '')
      el.style.left = pixel.x + 14 - (w / 2) + 'px'
      el.style.bottom = -pixel.y - infoWin[i].y + 40 + 'px'
    },
    /**
     * 点击轨迹线
     * @param {Number} i 该线的下标
     */
    handleLine(i) {         
      this.handleMarker(i, true);
    },
    /**
     * 点击marker点
     * @param {Number} i 下标
     * @param {Boolean} isLine true为点击的line，false不是
     */
    handleMarker(i,isLine) {
      const { markers, pointArr, stopList, lines } = this;
      let item;
      let keys;    
      let obj = markers[i];  
      if (isLine) {
        obj = lines[i]
      }
      // 证明点击的点不需要infoWin
      if (!obj.popupId) {
        return
      }       
      if (!isLine && obj.id === 'stop') {
        item = stopList.find(e => e.BDPt === obj.pt)
        keys = this.$t('carAnalysis.stopInfo')        
      } else {
        item = pointArr.find(e => e.BDPt === obj.pt)
        keys = this.$t('carAnalysis.baseInfo')
      }              
      if (item) {
        item.id = obj.popupId
        item.y = obj.offset ? obj.offset.height : 0
        item.markerId = obj.id      
        this.setInfoWin(item, keys)
      }
    },
    /**
     * 设置infoWin，有就修改数据，没有就添加
     */
    setInfoWin(info, keys) {
      const { infoWin } = this
      const baseInfo = []
      for (const v of keys.values()) {
        if (info[v.key] || !v.required) {
          const obj = {}
          obj.label = v.name
          const val = info[v.key] || info[v.key] == 0 ? info[v.key] : ''
          obj.val = `${val}${v.unit || ''}`
          baseInfo.push(obj)
        }
      }
      const index = infoWin.findIndex(e => info.id === e.id)      
      if (index > -1) {
        this.$set(infoWin[index], 'title', `车辆：${info.vehPlateNo}`)       
        this.$set(infoWin[index], 'baseInfo', baseInfo)
        this.$set(infoWin[index], 'show', true)
        this.$set(infoWin[index], 'pt', info.BDPt)
        this.$set(infoWin[index], 'y', info.y)
        this.$set(infoWin[index], 'markerId', info.markerId)        
      } else {
        const data = {
          title: `车辆：${info.vehPlateNo}`,
          css: {
            width: '300px',
            padding: "0 0 20px",
          },
          baseInfo,
          show: true,
          zIndex: 3,
          index: infoWin.length,
          pt: info.BDPt,
          id: info.id,
          y: info.y,
          markerId: info.markerId
        }
        infoWin.push(data)
      }
    },
    /**
     * 点击关闭infoWin
     */
    handleColse(index) {
      const { infoWin } = this
      this.$set(infoWin[index], 'show', false)
    },
    /**
     * 根据经纬度获取地址
     */
    getLocation(pt) {
      return this.$refs.map.getLocation(pt)
    },
    /**
     * 获取百度经纬度
     * @param {String} lng 经度
     * @param {String} lng 纬度
     * @return {Object} 返回包含经纬度的json
     */
    getPoint(lng, lat) {
      const BDPt = getLngLat(lng, lat, 'gcj02tobd09')
      return BDPt
    },
    /**
     * 暂停或者播放
     * @param {Boolean} state 状态值
     */
    suspend(state) {
      this.switch = state;
    },
    /**
     * 改变划线的间隔时间
     * @param {Number} times 间隔时间（ms）
     */
    changeTaktTime(times) {
      this.time = times
    }
  }
}
</script>

<style   scoped>
#trail-map,
.bm-view {
  width: 100%;
  padding: 0;
  height: 100%;
  background: #fff;
  
}
.sample {
    position: absolute;
  }
	/* 一下样式为处理信息窗口样式 */
	/* .bm-view >>> .BMap_pop img {
		display:none !important;
	}
	.bm-view >>> .BMap_pop img:nth-child(1) {
		display:block !important;
	}
 
	.bm-view >>> .BMap_bubble_content {
		background-color:white;			 		 
		padding-bottom:10px;
		display: block !important;
	}
	.bm-view >>> .BMap_bubble_content div {
		display: block !important;
	}
 
	.bm-view >>> .BMap_pop div:nth-child(9) {
		top:35px !important;
		border-radius:7px;
	}
 
	.bm-view >>> .BMap_pop img {
		top:43px !important;	 
		margin-left:-10px;
	}
	.bm-view >>> .BMap_top {
		display:none;
	}
	.bm-view >>> .BMap_bottom {
		display:none;
	}
	.bm-view >>> .BMap_center {
		display:none;
	}		 	
	 
	.bm-view >>> .BMap_pop div:nth-child(1) div {
		display:none; 
	}
	.bm-view >>>  .BMap_pop div:nth-child(3) > div {
		display:none;
	}
	.bm-view >>>  .BMap_pop div:nth-child(5) {
		display:none;
	}		 
	.bm-view >>>  .BMap_pop div:nth-child(7) {
		display:none;
	}
	.vehinfoW{
		height: 200px;
	}
	.vehinfoW  div{
		display: block !important;
	} */
</style>