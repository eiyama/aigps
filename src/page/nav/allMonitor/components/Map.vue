<template>
	<baidu-map
		class="bm-view"
		ref="map"
		:center="center"
		:zoom="zoom"
		:mapClick="false"
		scrollWheelZoom
		ak="dF8sMa2zZUk8znVfxyvzxQjsiQWrDfW2"
	>
		<!-- 比例尺 -->
		<bm-scale />
		<!-- 缩放 -->
		<!-- <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" :offset="{ width: 0, height: 100  }" /> -->
		<!-- infoWindow弹窗 -->
		<bm-overlay
			v-for="(v, i) of infoWin"
			:key="i"
			ref="overlay"
			pane="labelPane"
			class="sample"
			:zIndex="v.zIndex"
			:pt="v.pt"
			:y="v.y"
			@draw="draw($event, i)"
		>

			<veh-info-win v-show="v.show" :info="v" v-on:click.stop  @handleColse="handleColse" @handleBtn="handleBtn" @handleActive="handleActive"  />
		</bm-overlay>
		<!-- marker点聚合 -->
		<bml-marker-clusterer-new
			ref="clusterer"
			v-if="!!markers.length"
			:icon="icon"
			averageCenter
			:points="markers"
			@click="handleMarker"
		/>
		<!-- 鼠标绘制工具 -->
		<bml-drawing-manager ref="drawingManager" @overlaycomplete="overlaycomplete" />
		<!-- marker点 -->
		<bm-marker v-for="(v, j) of markerAll" :key="`0${j}`" :position="v.pt" :dragging="v.edit" :icon="mData.icon" @dragend="dragend">
			<bm-label :content="v.title" :labelStyle="mData.labelStyle" :offset="mData.offset" />
		</bm-marker>
		<!-- 线 -->
		<bm-polyline v-for="(v, j) of lineAll" :key="`1${j}`" :path="v.pt" stroke-color="red" :stroke-weight="2" :editing="v.edit" @lineupdate="lineupdate" />
		<!-- 圆形 -->
		<!-- <bm-circle v-for="(v, j) of polygonAll" :key="`2${j}`" :path="v.pt" stroke-color="red" :stroke-weight="2" :editing="v.edit" @lineupdate="lineupdate"
		:radius="circleObj.radius"   :stroke-opacity="0.5"  ></bm-circle> -->
		<!-- 多边形 -->
		<bm-polygon v-for="(v, j) of polygonAll" :key="`2${j}`" :path="v.pt" stroke-color="red" :stroke-weight="2" :editing="v.edit" @lineupdate="lineupdate" />
		<!-- label -->
		<bm-label v-for="(v, j) of [...polygonAll, ...lineAll]" :key="`3${j}`" :position="v.pt[0]" :content="v.title" :labelStyle="mData.labelStyle" :offset="mData.offset" />
		<!-- 视频设备打点（划线） -->
		<div class="line-box" v-for="(v, i) of lines" :key="`4${i}`">
			<bm-polyline-new
				v-for="(e, j) of v.ptArr"
				:key="j"
				:stroke-color="e.color"
				:path="e.points"
				:stroke-weight="6"
				:isIcons="e.isIcons"
			/>
		</div>
		<!-- 路况信息 -->
		<bm-traffic v-if="isTraffic" :predictDate="predictDate" />
	</baidu-map>
</template>

<style scoped lang="scss">
.bm-view {
	width: 100%;
	position: absolute;
	top: 0;
	right: 0;
	height: 100%;
	z-index: 16;
	.sample {
		position: absolute;
	}
}
</style>

<script>
// import _Map from '@/conmon/js/baiDu_Map'
import { mapGetters } from 'vuex'
import { parentId } from '@/utils/data'
import { getDateStr, getParse, getDecimalN, getCopyObj } from '@/utils/util'
import getLngLat from '@/utils/coordtransform'
import VehInfoWin from '@/components/map/VehInfoWin'


import {
	BaiduMap,
	BmPolylineNew,
	BmScale,
	BmMarker,
	BmLabel,
	BmPolyline,
	BmPolygon,
	BmOverlay,
	BmlMarkerClustererNew,
	BmlDrawingManager,
	BmNavigation,
	BmTraffic
} from 'vue-baidu-map/components'

export default {
	components: {
		BmScale,
		BaiduMap,
		BmMarker,
		BmLabel,
		BmPolyline,
		BmPolygon,
		BmOverlay,
		BmPolylineNew,
		BmlMarkerClustererNew,
		BmlDrawingManager,
		BmNavigation,
		BmTraffic,
		VehInfoWin
	},
	data() {
		const data = this.getData()
		return {
			...data,
			mData: {
				icon: {
					url: require('@/assets/image/map/locationIcon.png'),
					size: {
						width: 32,
						height: 32
					}
				},
				labelStyle: {
					fontSize: '14px',
					minWidth: '70px',
					color: '#fff',
					background: '#00A8D4',
					border: 'none',
					textAlign: 'center',
					padding: '5px'
				},
				offset: {
					width: -25,
					height: -35
				}
			},
			icon: {
				url: require('@/assets/image/map/hc.png'),
				size: {
					width: 15,
					height: 34
				}
			},
			parentId,
			lines: []
		}
	},
	props: {
		isShowCenVideo: {
			type: Boolean
		},
		newTree: {
			type: [Map, Object]
		},
		info: {
			type: Object,
			default: () => new Object
		},
		vehTerminalNoIdMap: {
			type: [Map, Object]
		},
		isTraffic: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		...mapGetters([
			'userInfo'
		])
	},
	created() {
		this.lines = []
	},
	beforeDestroy() {
		// const data = this.getData()
		// for (const [k, v] of Object.entries(data)) {
		// 	this[k] = v
		// }
	},
	methods: {
		getData() {
			return {
				state: {},
				isChangeMap: true,
				overlays: [],
				markerAll: [],
				lineAll: [],
				polygonAll: [],
				overlaysAll: [],
				curVidMark: [],
				markers: [],
				clusterer: null,
				infoWin: [],
				curMarkeNode: {},
				center: {
					lng: 116.404,
					lat: 39.915
				},
				zoom: 15,
				pointArr: [],
				lineData: {},
				predictDate: {}
			}
		},
		/**
		 * 点击infoWindow上面的按钮
		 * @param {String} id 按钮的id
		 */
		handleBtn(id) {
			this.$emit('handleBtn', id)
		},
		getCurMarke() {
			return this.curMarkeNode
		},
		/**
		 * 鼠标绘制地图之后的事件方法
		 */
		overlaycomplete($event, e) {
			const { $refs } = this
			$refs.drawingManager.close()
			const ptArr = $refs.map.getPath(e.overlay)
			let markType = 3
			e = e || event;
			console.log(e.drawingMode);
			this.overlays.push(e.overlay)
			if (e.drawingMode === 'marker') {
				markType = 1
			} else if (e.drawingMode === 'polyline') {
				markType = 2
			}
			const arr = []
			if (Array.isArray(ptArr)) {
				for (const v of ptArr.values()) {
					// 百度转国测局
					const lngLat = getLngLat(v.lng, v.lat, 'bd09togcj02')
					arr.push(`${lngLat.lng},${lngLat.lat}`)
				}
			} else {
				const lngLat = getLngLat(ptArr.lng, ptArr.lat, 'bd09togcj02')
				arr.push(`${lngLat.lng},${lngLat.lat}`)
			}
			console.log(ptArr);
			this.$emit('addMarkShow', markType, arr)
		},
		/**
		 * 清除地图的聚合
		 */
		removeClusterer() {
			const { $refs, markers, infoWin } = this
			if (!$refs.clusterer || !markers.length) {
				return
			}
			this.markers = []
			// 关闭infoWin
			for (const v of infoWin.values()) {
				if (v.show) {
					v.state = true
					v.show = false
					break
				}
			}
			this.curMarkeNode = {}
		},
		/**
		 * 勾选节点
		 */
		async checkedFn(data, node, res, isChcked) {
			// console.log(res)
			// 判断是取消勾选还是勾选
			const checkedKeys = node.checkedKeys
			const key = checkedKeys ? checkedKeys.findIndex((elem) => elem == data.id) : null
			// 没有data，证明是从首页点击过来
			if (!data || data.type == '1' || key == -1) {
				// 证明是点击的根节点，将所有的车辆居中
				this.setMarkerAll(res, isChcked)
			} else {
				// 点击的子节点，只有一条数据，直接将infoWin打开
				const obj = res.find((elem) => elem.vehTerminalNo === data.vehTerminalNo)
				if (obj && obj.location) {
					// 居中
					const { location } = obj
					const BDPt = getLngLat(location.gpsWebLng, location.gpsWebLat, 'gcj02tobd09')
					this.center = BDPt
					const info = {
						...obj,
						...location,
						type: 'veh',
						BDPt
					}
					delete info.location
					await this.setInfoWin(info)
				}
				// 是子节点，将选中的车辆居中
				this.setMarkerAll(res, false)
			}
		},
		/**
		 * 设置marke点
		 * @param {Array} arr marker点的数据
		 * @param {Boolean} boole true让当前点居中
		 */
		setMarkerAll(arr, boole) {
			if (arr.length === 0) {
				this.state.mapResize = true
				this.isChangeMap = true
				return
			}
			this.pointArr = getCopyObj(arr)
			const { pointArr, infoWin, lines, info, state, newTree, $refs } = this
			const pts = []
			const infoWinI18n = info.infoWin
			state.mapResize = false
			console.log(this.pointArr);
			for (let [i, v] of pointArr.entries()) {
				const obj = newTree.get(v.vehTerminalNo)
				if (obj && obj.location) {
					obj.id = v.id
					v = obj
				}
				const location = v.location || {}
				v = {
					...v,
					...location,
					type: 'veh'
				}
				delete v.location
				const { gpsWebLng, gpsWebLat, vehTerminalNo, gpsDirect } = v
				// 当前的marker是否有值
				// 该终端号的车辆是否有marker,没有就创建一个marker，有就直接显示marker
				const BDPt = getLngLat(gpsWebLng, gpsWebLat, 'gcj02tobd09')
				v.BDPt = BDPt
				pointArr[i] = v
				const mData = {
					...BDPt,
					id: vehTerminalNo,
					rotation: gpsDirect
				}
				pts.push(mData)
				// 显示轨迹线
				const j = infoWin.findIndex((e) => e.markerId === vehTerminalNo && e.state)
				if (j > -1) {
					this.setInfoWin(v)
				}
			}
			this.$nextTick(() => {
				this.markers = pts
			})
			// 是否需要展示所有的点
			if (boole) {
				$refs.map.setViewports(pts, true)
			}			
			// 如果没有对应的车辆那么打点的线也要删除
			if (lines.length) {
				for (const [i, v] of lines.entries()) {
					const item = pts.find(e => e.id === v.vehTerminalNo)
					if (!item) {
						// lines.splice(i, 1)
						lines[i].ptArr = []
					}
				}
			}
		},
		/**
     * 更新marker点与infoWin的数据
     */
    upMarker(data) {
      const { markers, infoWin, $refs, pointArr } = this
      // 当前数据的车辆如果存在marker就修改marker数据
      const marker = markers.find(e => e.id === data.vehTerminalNo)
      // const marker = markers[0]
      if (marker) {
        const { gpsDirect, vehTerminalNo, isShowCenVideo } = data
        // const BDPt = getLngLat(gpsWebLng, gpsWebLat, 'gcj02tobd09')
	      const newInfo = this.getInfo(data)
        const obj = {
          id: marker.id,
          rotation: gpsDirect,
          ...newInfo.BDPt
        }
        const i = pointArr.findIndex(e => e.vehTerminalNo === vehTerminalNo)
        if (i > -1) {
        	newInfo.sensor = pointArr[i].sensor
        	newInfo.ttxVehicleCfg = pointArr[i].ttxVehicleCfg
        	pointArr[i] = newInfo
        }
        $refs.clusterer.setMarker(obj)
        // 中间的实时视频播放的时候给视频车辆打点
				if (isShowCenVideo) {
					this.setLine(data, false)
				}
        // 当前数据的车辆如果弹窗就修改弹窗数据
        const oInfoWin = infoWin.find(e => e.markerId === data.vehTerminalNo && (e.state || e.show))
	      if (oInfoWin) {
	        this.setInfoWin(newInfo)
	        // 当前点不在可视区的时候地图会以当前点为中心移动
	        if (!$refs.map.isVisualArea(newInfo.BDPt)) {
	          this.center = {
	          	...newInfo.BDPt
	          }
	        }
	      }
      }

    },
    /**
     * 获取marker需要的数据
     * @param {Object} data 车辆数据
     * @return {Object} obj 返回修改之后的的数据
     */
    getInfo(data) {
      const location = data.location || {}
      const obj = {
        ...data,
        ...location,
        type: 'veh'
      }
      delete obj.location
      const { gpsWebLng, gpsWebLat } = obj
      const BDPt = getLngLat(gpsWebLng, gpsWebLat, 'gcj02tobd09')
      obj.BDPt = BDPt
      return obj
    },
		/**
		 * 点击marker点
		 * @param {Object} v 当前点的数据
		 */
		handleMarker(v) {
			const { curMarkeNode } = this
			if (curMarkeNode.vehTerminalNo === v.id) return
			const { pointArr } = this
			const obj = pointArr.find(e => v.id === e.vehTerminalNo)
			if (obj) {
				this.setInfoWin(obj)
			}
		},
		/**
		 * 点击关闭infoWin
		 */
		handleColse(index) {
			const { infoWin } = this
			this.$set(infoWin[index], 'show', false)
			this.$set(infoWin[index], 'state', false)
			this.curMarkeNode = {}
		},
		/**
		 * 自定义覆盖物改变postion的值
		 */
		draw({ el, BMap, map, pt }, i) {
			const { lng, lat } = pt
			const { infoWin } = this
			if (!infoWin.length) {
				return
			}
			const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat))
			// el.style.left = pixel.x - 60 + 'px'
			const w = infoWin[i].css.width.replace('px', '')
			el.style.left = pixel.x + 14 - w / 2 + 'px'
			el.style.bottom = -pixel.y + 40 + 'px'
			el.parentNode.style.zIndex = 999
		},
		/**
		 * 设置infoWin，有就修改数据，没有就添加
		 */
		setInfoWin(info) {
			return new Promise(async resolve => {
				const { infoWin, $refs, curMarkeNode } = this
				if (curMarkeNode.id) {
					info.id = curMarkeNode.id
				}
				this.curMarkeNode = info
				const i18n = this.$t('carAnalysis.infoWin')
				info.gpstime = getDateStr(info.gpsTime)
				info.gpsDayDistance = getDecimalN(info.gpsDayDistance)
				if (!info.address) {
					info.address = await $refs.map.getLocation(info.BDPt)
				}
				const { extensionDataObj, sensor } = info
				const otherObj = getParse(info.extensionData)
				if (otherObj.DriverName) info.driver = otherObj.DriverName;								 
				const sensorArr = sensor.split('')			 			
				const str = info.gpsIsposition ? (info.LocationType ? info.LocationType : i18n.localtion) : i18n.noLocaltion
				info.state = `${info.acc ? i18n.accOpen : i18n.accShut}，${str}`
				const keys = this.$t('carAnalysis.baseInfo')

				const baseInfo = []
				const btns = this.getBtns(info, i18n)
				for (const v of keys.values()) {
					if (info[v.key] || !v.required) {
						const obj = {}
	          			obj.label = v.name
	          			const val = info[v.key] || info[v.key] == 0 ? info[v.key] : ''
						obj.val = `${val}${v.unit || ''}`
						obj.click = v.click
						baseInfo.push(obj)
					}
				}
				const otherArr = []
				// 有电量就赋值
				if (sensorArr instanceof Array && sensorArr[1] === '1') {
					const keys = this.$t('carAnalysis.batteryPower')
					for (const v of keys.values()) {
						if (typeof extensionDataObj[v.key] !== 'undefined') {
							const obj = {}
							obj.label = v.name
							const val = extensionDataObj[v.key] || extensionDataObj[v.key] == 0 ? extensionDataObj[v.key] : ''
							obj.val = `${val}${v.unit || ''}`
							otherArr.push(obj)
						}
					}
				}

				// 有温度就赋值
				if (sensorArr instanceof Array && sensorArr[2] === '1') {
					const keys = this.$t('carAnalysis.temperature')
					for (const v of keys.values()) {
						if (typeof extensionDataObj[v.key] !== 'undefined') {
							const obj = {}
							obj.label = v.name
							const val = extensionDataObj[v.key] || extensionDataObj[v.key] == 0 ? extensionDataObj[v.key] : ''
							obj.val = `${val}${v.unit || ''}`
							otherArr.push(obj)
						}
					}
				}

				const index = infoWin.findIndex(e => info.type === e.id)
				if (index > -1) {
					this.$set(infoWin[index], 'title', `${i18n.car}${info.name}`)
					this.$set(infoWin[index], 'baseInfo', baseInfo)
					this.$set(infoWin[index], 'show', true)
					this.$set(infoWin[index], 'pt', info.BDPt)
					this.$set(infoWin[index], 'markerId', info.vehTerminalNo)
					this.$set(infoWin[index], 'btns', btns)
					this.$set(infoWin[index], 'otherArr', otherArr)
				} else {
					const data = {
						title: `${i18n.car}${info.name}`,
						css: {
							width: '300px'
						},
						baseInfo,
						btns,
						otherArr,
						show: true,
						zIndex: 10,
						index: infoWin.length,
						pt: info.BDPt,
						markerId: info.vehTerminalNo,
						id: info.type
					}
					infoWin.push(data)
				}
				resolve()
			})
		},
		/**
		 * 获取infoWin上面按钮的数据
		 */
		getBtns(info, i18n) {
			const { userInfo, parentId } = this
			const { sensor } = info
			const arr = sensor.split('')
			const [str1, str2, str3, str4] = arr
			const btns = []
			// 轨迹按钮
			const trackReplay = {
				id: 'trail-play',
				text: i18n.trackReplay
			}
			// 下发指令
			const sendCommand = {
				id: 'send-command',
				text: i18n.sendCommand
			}
			btns.push(trackReplay, sendCommand)
			// 胎压按钮
			if (str1 === '1') {
				const obj = {
					id: 'tyre-pressure',
					text: i18n.tyrePressure 
				}
				btns.push(obj)
			}
			// 电量按钮
			if (str2 === '1') {
				const obj = {
					id: 'electric',
					text: i18n.electricQuantityDetail 
				}
				btns.push(obj)
			}
			// 温度按钮
			if (str3 === '1') {
				const obj = {
					id: 'temperature',
					text: i18n.temperatureDetail 
				}
				btns.push(obj)
			}
			// 载重按钮
			if (str4 === '1') {
				const obj = {
					id: 'load',
					text: i18n.load 
				}
				btns.push(obj)
			}
			// root才有运行报表按钮
			if (userInfo.id === parentId) {
				const obj = {
					id: 'run',
					text: i18n.run 
				}
				btns.push(obj)
			}
			// 是否有视频
			const { ttxVehicleCfg } = info
			if (ttxVehicleCfg && ttxVehicleCfg.haveLiveVideo) {
				const obj = {
					id: 'video',
					text: i18n.realTimeVio
				}
				btns.push(obj)
			}

			// 联系信息按钮
			const contact = {
				id: 'contactInfo',
				text: i18n.contactInfo
			}
			btns.push(contact)

			return btns
		},
		/**
		 * 添加划线的数据
		 * @param {Object} data 数据
		 * @param {Boolean} isAdd true为增加线，false为增加线的数据
		 */
		setLine(data, isAdd) {
			const { lines, $refs } = this
			const index = lines.findIndex(e => e.name === data.name)
			// 没有相同的name
			if (isAdd && index === -1) {
				const { name, vehTerminalNo, id, location } = data
				const { gpsWebLng, gpsWebLat } = location
				const BDPt = getLngLat(gpsWebLng, gpsWebLat, 'gcj02tobd09')
				const obj = {
					name,
					id,
					vehTerminalNo,
					ptArr: [],
					lastPt: BDPt,
					spacing: 0,
					count: 0
				}
				lines.push(obj)
			}
			
			// 往车辆里面添加线的数据
			if (!isAdd && index > -1) {
				const curVal = lines[index]
				// 上一个点的数据
				const lastPt = curVal.lastPt
				const { name, vehTerminalNo, id, location } = data
				const { gpsWebLng, gpsWebLat, gpsSpeed } = location
				const curPt = getLngLat(gpsWebLng, gpsWebLat, 'gcj02tobd09')
        const points = [lastPt, curPt]
				curVal.spacing += $refs.map.getDistances(points)
        if (gpsSpeed) {
          curVal.count++
        }
        const { spacing, count } = curVal
        const obj = {
          points,
          pt: curPt,
          color: gpsSpeed <= 80 ? 'green' : 'red',
          isIcons: spacing >= 15000,
          id: 'line',
          popupId: 'base'
        }
        if (obj.isIcons) {
          curVal.spacing = 0
          curVal.coount = 0
				}
				curVal.lastPt = curPt
				curVal.ptArr.push(obj)
			}
		},
		/**
		 * 清除打点的轨迹线
		 * @param id 车辆id
		 * @param isAll 是否是清除所有
		 */
		clearLine(id, isAll) {
			console.log('清除打点')
			if (isAll) {
				this.lines = []
			} else {
				const { lines } = this
				const index = lines.findIndex(e => e.id === id)
				if (index > -1) {
					lines.splice(index, 1)
				}
			}
		},
		/**
		 * 清除打点的线但是可以继续setline
		 * @param {String} id 车辆id
		 */
		clearPt(id) {
			const { lines } = this
			for (const v of lines.values()) {
				if (!id || id === v.id) {
					v.ptArr = []
					if (id === v.id) {
						break
					}	
				}
			}
		},
		// 获取的树节点去重
		sortInfo(list) {
			var arr = []
			for (const v of list.values()) {
				//type等于2为车辆
				if (v.type == '2' && v.location && v.location.state != 6) {
					arr.push(v)
				}
			}
			if (arr.length == 0) {
				return { arr }
			}
			// 地图渲染的时候会移动或者缩放地图，所以需要阻止该事件
			this.isChangeMap = false
			// 保存勾选节点的终端号
			const vehTerminalNos = []
			//车牌相同的去重
			outer: for (var i = 0; i < arr.length; i++) {
				const obj = this.vehTerminalNoIdMap.get(arr[i].vehTerminalNo)
				// 请求过一次下次就不再请求
				if (obj && !obj.isRequest) {
					obj.isRequest = true
					this.$emit('setVehTerminalNoIdMap', arr[i].vehTerminalNo, obj)
					vehTerminalNos.push(arr[i].vehTerminalNo)
					inter: for (var j = 0; j < arr.length; j++) {
						if (arr[i].name == arr[j].name && i != j) {
							arr.splice(j, 1)
							// 将重复去掉
							vehTerminalNos.splice(j, 1)
							j--
							if (i > j) {
								i--
								break inter
							}
						}
					}
				}
			}
			return { arr, vehTerminalNos }
		},
		/**
		 * 清除标记点的覆盖物
		 * @param { Boolean } isOverlays 需要清除谁
		 * @param {Any} opt 删除的参数
		 */
		clearOverlaysAll(isOverlays, opt) {
			// 为正清除鼠标编辑的覆盖物，反之清除围栏的覆盖物
			if (isOverlays) {
				const { overlays, $refs } = this
				if (overlays.length === 0) return
				$refs.drawingManager.clearAll(overlays)
				this.overlays = []
			} else {
				if (!opt || opt.data instanceof Array) {
					this.markerAll = []
					this.lineAll = []
					this.polygonAll = []
				} else {
					const { data, type } = opt
          		let curArr = []
					if (type === 1) {
						curArr = this.markerAll
					} else if (type === 2) {
						curArr = this.lineAll
					} else {
						curArr = this.polygonAll
					}
					const index = curArr.findIndex(e => e.id === data.id)
					if (index > -1) {
						curArr.splice(index, 1)
					}
				}
			}
		},
		/**
		 * 根据选中的数据来生成marker或者图形
		 * @param {Array} data 复选框勾选的数据
		 * @param {Number} type 标注点的类型
		 */
		setMarkerFn(data, type) {
			var arr2 = []
			const isArr = data instanceof Array
			if (!isArr) {
				data = [data]
			}
			for (const v of data.values()) {
				var markLatLngs = v.markLatLngs.split(';')
				var latLngList = []
				for (const e of markLatLngs.values()) {
					var latLng = e.split(',')
					latLngList.push({
						lng: latLng[0],
						lat: latLng[1]
					})
				}
				arr2.push({
					markName: v.markName,
					markLatLngs: latLngList,
					edit: !!v.edit,
					id: v.id
				})
			}
			// 保存起来如果没有修改绘图就把这个经纬度传给后台
			this.$emit('setLatLngs', arr2[0].markLatLngs)
			this.setSpot(arr2, type, isArr)
		},
		/**
		 * 在地图上渲染标记点
		 * @param {Array} arr2 数据
		 * @param {Number} type 标记点类型
		 * @param {Boolean} isArr 是否是数组
		 */
		setSpot(arr2, type, isArr) {
			const { $refs } = this
			// 标记点
			const arr = []
			let oldData
			let curArr
			if (type === 1) {
				curArr = this.markerAll
			} else if (type === 2) {
				curArr = this.lineAll
			} else {
				curArr = this.polygonAll
			}
			for (const [i, v] of curArr.entries()) {
				if (v.edit) {
					curArr.splice(i, 1)
					oldData = v
				}
				if (v.pt instanceof Array) {
					arr.push(...v.pt)
				} else {
					arr.push(v.pt)
				}
			}

			for (const v of arr2.values()) {
				const { markLatLngs } = v
				const data = {
					pt: [],
					title: v.markName,
					edit: v.edit,
					id: v.id
				}

				for (const e of markLatLngs.values()) {
					const { lng, lat } = e
					const lngLat = getLngLat(lng, lat, 'bd09togcj02')
					data.pt.push(lngLat)
				}

				const isRepeat = curArr.some(e => e.id === v.id)
				if (!isRepeat) {
					arr.push(...data.pt)
					if (type === 1) {
						data.pt = data.pt[0]
					}
					curArr.push(data)
				}
			}

			if (oldData) {
				this.$nextTick(() => {
					oldData.edit = false
					curArr.push(oldData)
				})
			}
			// 将当前点的所有的point点在地图上居中
			if (arr.length > 1 && isArr) {
				$refs.map.setViewports(arr, true)
			} else {
				if (!isArr) {
					const { lng, lat } = arr2[0].markLatLngs[0]
					const lngLat = getLngLat(lng, lat, 'bd09togcj02')
					$refs.map.setPanToCenter(lngLat, true)
					return
				}
				$refs.map.setPanToCenter(arr[0], true)
			}
		},
		/**
		 * 编辑围栏的marker点
		 */
		dragend(e) {
			const { $refs } = this
			const pt = $refs.map.getPath(e.target)
			const lngLat = getLngLat(pt.lng, pt.lat, 'bd09togcj02')
			this.$emit('setLatLngs', [lngLat])
		},
		/**
		 * 编辑围栏的线
		 */
		lineupdate(e) {
			const { $refs } = this
			const pts = $refs.map.getPath(e.target)
			const lngLats = pts.reduce((arr, v) => {
				const lngLat = getLngLat(v.lng, v.lat, 'bd09togcj02')
				arr.push(lngLat)
				return arr
			}, [])
			this.$emit('setLatLngs', lngLats)
		},
		/**
		 * 退出绘制，取消编辑
		 */
		handleQuit() {
			let curArr
			if (this.markerAll.length) {
				curArr = this.markerAll
			} else if (this.lineAll.length) {
				curArr = this.lineAll
			} else if (this.polygonAll.length) {
				curArr = this.polygonAll
			}
			if (curArr) {
				let data
				for (const i of curArr.keys()) {
					data = curArr[i]
					this.$set(curArr[i], 'edit', false)
					curArr.splice(i, 1)
				}
				// 把覆盖物还原
				this.$nextTick(() => {
					curArr.push(data)
				})
			}
		},
		/**
     * infoWindow是否存在
     * @param {String} veh 车辆终端号
     */
    isInfoWindow(veh) {
      const { infoWin } = this
      return infoWin.some(e => e.markerId === veh)
    },
    /**
     * 点击司机名打开司机详情弹窗
     */
    handleActive() {
    	const { curMarkeNode } = this
    	this.$emit('handleDrive', curMarkeNode)
    },
    /**
     * 刷新路况
     */
    handleRefreshTraffic() {
    	const { predictDate } = this
    	const date = new Date()
    	this.$set(predictDate, 'weekday', date.getDay())
    	this.$set(predictDate, 'hour', date.getHours())
    }
	}
}
</script>
