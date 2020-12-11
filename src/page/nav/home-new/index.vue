<template>
	<div class="home">
		<div class="top">
			<img class="img-top" src="../../../assets/image/home/top-bg2.png">
			<div class="title">车联网监控服务平台</div>
			<ul>
				<li v-for="(v,i) in navList" :key="i" @click="handleLink(i)">{{ v.name }}</li>
			</ul>
		</div>
		<div class="container">
			<div class="main">
				<div class="left">
					<div class="title">车辆分布图</div>
					<div id="e-map">
						<charts-map ref="map" :otherText="otherText" :i18nInfo="i18nInfo" />
					</div>
				</div>
				<div class="center" ref="mainCenter">
					<ul v-if="!!totalList.length">
						<li v-for="(v, i) of totalList" :key="i">{{ v }}</li>
					</ul>
					<div
					  class="pie"
					  :style="{width: `${boxH}px`, height: `${boxH}px`, marginLeft: `${-boxH / 2}px`, top: `${boxH * 0.03}px`}"
					>
						<canvas ref="scale"></canvas>
						<div class="num">
							<span>车辆使用率</span>
							<em>{{ info.vehicleUseRate || '0%' }}</em>
							<i>{{ info.vehicleOnline || '' }}</i>
						</div>
					</div>
					<img class="bottom-bg" src="@/assets/image/home/home-center-bottom.png" >
				</div>
				<div class="right">
					<div class="mileage">
						<div class="title">今日行驶里程</div>
						<div class="pie-bg">
							<div class="img" ref="pieImg">
								<img src="@/assets/image/home/home-round.png" :style="{width: `${imgH}px`, height: `${imgH}px`}">
								<div class="text">
									<span class="unit">km</span>
									<em class="val">{{ info.mileageTodayTotal || 0 }}</em>
								</div>
							</div>
							<div class="text-box">
								<div class="h">
									<div class="name">{{ i18nInfo.hoursAverage }}</div>
									<div class="val">
										<em>{{ info.hoursAverage || 0 }}</em>
	            			<span>h</span>
									</div>
								</div>
								<div class="km">
									<div class="name">{{ i18nInfo.mileageAverage }}</div>
				          <div class="val">
				            <em>{{ info.mileageAverage || 0 }}</em>
				            <span>{{ otherText.km }}</span>
				          </div>
								</div>
							</div>
						</div>
					</div>
					<div class="state">
						<div class="title">行驶状况</div>
						<my-line ref="line" :otherText="otherText" :i18nInfo="i18nInfo" />
					</div>
				</div>
			</div>
			<div class="foot">
				<div class="left">
					<div class="title">今日报警数据</div>
					<ul>
						<li v-for="(v, i) of alarmList" :key="i">
							<img :src="v.img">
							<span class="text">{{ v.text }}</span>
							<em class="num">{{ v.val }}{{ v.unit }}</em>
						</li>
					</ul>
				</div>
				<div class="center">
					<div class="title">百公里风险数据对比</div>
					<line-bar ref="lineBar" :otherText="otherText" :i18nInfo="i18nInfo" />
				</div>
				<div class="right">
					<div class="title">车型类别</div>
					<div class="pie-box">
						<chart-pie ref="chartPie" />
						<div class="shadow" ref="shadow">
							<div class="bg"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	html, body {
		min-height: 100%;
		height: 100%;
		// width: 3840px;
		// height: 2160px;
	}
	.home {
		min-height: 100%;
		height: 100%;
		min-width: 1300px;
		// width: 3840px;
		// height: 2160px;
		background: url('../../../assets/image/home/home-bg2.png') repeat;
		position: relative;
		.top {
			width: 100%;
			position: absolute;
			top: 0;
			left: 0;
			height: 75px;
			z-index: 10;
			.img-top {
				width: 100%;
				height: 24px;
			}
			.title {
				width: 480px;
				height: 66px;
				line-height: 60px;
				text-align: center;
				position: absolute;
				bottom: 0;
				left: 50%;
				margin-left: -240px;
				z-index: 9;
				color: #68d9fe;
				background: url('../../../assets/image/home/home-top-center.png') no-repeat;
				background-size: 100% 100%;
				font-size: 32px;
				font-weight: bold;
			}
			ul {
				display: flex;
				justify-content: center;
				li {
					width: 180px;
					height: 51px;
					line-height: 51px;
					text-align: center;
					font-size: 20px;
					font-weight: bold;
					background: url('../../../assets/image/home/home-nav-bg1.png');
					background-size: 100% 100%;
					color: #e4f6f9;
					cursor: pointer;
					&:nth-child(2) {
						margin-right: 240px;
					}
					&:nth-child(3) {
						margin-left: 240px;
					}
					&:nth-child(3), &:nth-child(4) {
						background: url('../../../assets/image/home/home-nav-bg2.png');
						background-size: 100% 100%;
					}
				}
			}
		}
		.container {
			display: flex;
			flex-direction: column;
			padding: 75px 0 0;
			box-sizing: border-box;
			min-height: 100%;
			height: 100%;
			.main {
				height: 66%;
				display: flex;
				min-height: 480px;
				background: url('../../../assets/image/home/home-bg2.png') repeat;
				padding: 1.3% 2% 0;
				.left {
					flex: 1;
					background: url('../../../assets/image/home/home-map.png');
					background-size: 100% 100%;
					overflow: hidden;
					position: relative;
					#e-map {
						width: 100%;
						height: 100%;
					}
				}
				.center {
					flex: 1;
					margin: 0 1.5%;
					position: relative;
					.bottom-bg {
						position: absolute;
						bottom: 0;
						left: 0;
						width: 100%;
						height: 26%;
						z-index: 9;
					}
					.pie {
						position: absolute;
						left: 50%;
						top: 0;
						canvas {
							position: absolute;
							left: 0;
							top: 0;
							z-index: 3;
						}
						.num {
							width: 40%;
							height: 40%;
							position: absolute;
							left: 30%;
							top: 30%;
							z-index: 5;
							border-radius: 50%;
							background: linear-gradient(to top, #1163d6 0%, #019cfd 30%, #019cfd 70%, #1163d6 100%);
							color: #fff;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
							span, em, i {
								display: block;
								text-align: center;
							}
							span {
								font-size: 18px;
								margin-top: -6%;
							}
							em {
								font-size: 36px;
								font-weight: bold;
							}
							i {
								font-size: 26px;
							}
						}
					}
					ul {
						overflow: hidden;
						position: absolute;
						top: -2%;
						left: 45%;
						transform: translateX(-45%);
						z-index: 5;
						li {
							float: left;
							color: #fff;
							text-align: center;
							width: 30px;
							height: 42px;
							line-height: 42px;
							font-size: 30px;
							background: linear-gradient(to bottom, #0694f9 0%, #08b4f8 30%, #09d0f6 70%, #0ae4f6 100%);
							margin: 0 5px 0;
							border-radius: 2px;
						}
					}
				}
				.right {
					flex: 1;
					display: flex;
					flex-direction: column;
					position: relative;
					.mileage, .state {
						flex: 1;
						background: url('../../../assets/image/home/home-data.png');
						background-size: 100% 100%;
						position: relative;
						padding: 42px 0 0;
					}
					.title {
						top: 3%;
					}
					.mileage {
						margin: 0 0 1.5%;
						overflow: hidden;
						.pie-bg {
							overflow: hidden;
							height: 100%;
							.img {
								float: left;
								width: 50%;
								height: 100%;
								display: flex;
								justify-content: center;
								align-items: center;
								position: relative;
								.text {
									position: absolute;
									top: 50%;
									left: 50%;
									transform: translate(-50%, -50%);
									z-index: 9;
									span, em {
										display: block;
										color: #fff;
										font-size: 18px;
										line-height: 28px;
										text-align: center;
									}
									.unit {
										font-size: 22px;
									}
								}
							}
							.text-box {
								float: right;
								width: 50%;
								overflow: hidden;
								height: 100%;
								padding: 1% 0 0;
								.h, .km {
									width: 80%;
									height: 40%;
									border: 1px solid #0872cc;
									margin: 2% 0 0;
									border-radius: 3px;
									display: flex;
									flex-direction: column;
									justify-content: center;
									// align-items: center;
								}
								.name {
									color: #fff;
									padding: 0 0 0 5%;
									font-size: 14px;
								}
								.val {
									overflow: hidden;
									text-align: center;
									em, span {
										color: #fff;
										font-size: 30px;
									}
									span {
										font-size: 20px;
										margin: 0 0 0 4px;
									}
								}
							}
						}
						.pie, .text-box {
							height: 100%;
							width: 50%;
							float: left;
						}
						
					}
				}
			}
			.foot {
				background: url('../../../assets/image/home/home-bg2.png') repeat;
				height: 33%;
				min-height: 240px;
				display: flex;
				margin: 1% 0 0;
				padding: 0 2% 1%;
				.title {
					top: 3%;
				}
				.left, .center, .right {
					flex: 1;
					background: url('../../../assets/image/home/home-data.png');
					background-size: 100% 100%;
					position: relative;
					padding: 42px 0 1%;
				}
				.center {
					margin: 0 1.5%;
				}
				.left {
					display: flex;
					align-items: center;
					ul {
						flex: 1;
						overflow: hidden;
						display: flex;
						justify-content: space-around;
						li {
							img {
								width: 64px;
								height: 65px;
								display: block;
								margin: 0 auto 4px;
							}
							.text {
								display: block;
								font-size: 12px;
								font-weight: bold;
								text-align: center;
								color: #fff;
								line-height: 22px;
							}
							.num {
								display: block;
								font-size: 18px;
								font-weight: bold;
								text-align: center;
								color: #3c80a4;
								line-height: 32px;
							}
						}
					}
				}
				.right {
					overflow: hidden;
					.pie-box {
						position: relative;
						height: 100%;
						overflow: hidden;
						::v-deep .pie {
							height: 200%;
							position: relative;
							z-index: 5;
						}
						.shadow {
							height: 150%;
							position: absolute;
							top: 25%;
							left: 50%;
							background: #102660;
							transform: translateX(-50%);
							border-radius: 50% 50%;
							z-index: 3;
							opacity: .8;
							.bg {
								width: 80%;
								height: 80%;
								position: absolute;
								top: 10%;
								left: 10%;
								background: url('../../../assets/image/home/home-bg2.png') repeat;
								border-radius: 50% 50%;
							}
						}
					}
				}
			}
			.title {
				position: absolute;
				top: 1.5%;
				left: 30%;
				z-index: 11;
				width: 40%;
				height: 42px;
				line-height: 42px;
				text-align: center;
				font-size: 20px;
				color: #fff;
				// margin: 0 0 0 -15%;
				background: url('../../../assets/image/home/home-title-bg.png');
				background-size: 100% 100%;
			}
		}
	}
	// 4k屏设置
	@media only screen and (min-width: 3000px){
		.home {
			.top {
				height: 150px;
				.img-top {
					height: 48px;
				}
				.title {
					height: 132px;
					line-height: 120px;
					width: 960px;
					margin-left: -480px;
					font-size: 60px;
				}
				ul {
					li {
						width: 360px;
						height: 102px;
						line-height: 102px;
						text-align: center;
						font-size: 40px;
						&:nth-child(2) {
							margin-right: 480px;
						}
						&:nth-child(3) {
							margin-left: 480px;
						}
					}
				}
			}
			.container {
				padding: 150px 0 0;
				.main {
					.center {
						.pie {
							.num {
								span {
									font-size: 34px;
								}
								em {
									font-size: 62px;
								}
								i {
									font-size: 40px;
								}
							}
						}
						ul {
							li {
								height: 82px;
								line-height: 82px;
								width: 60px;
								font-size: 52px;
							}
						}
					}
					.right {
						.state, .mileage {
							padding: 72px 0 0;
						}
						.mileage {
							.pie-bg {
								.img {
									.text {
										.unit {
											font-size: 40px;
											line-height: 80px;
										}
										.val {
											font-size: 36px;
											line-height: 52px;
										}
									}
								}
								.text-box {
									.name {
										font-size: 28px;
									}
									.val {
										em {
											font-size: 48px;
										}
										span {
											font-size: 32px;
										}
									}
								}
							}
						}
					}
				}
				.foot {
					.left, .center, .right {
						padding: 72px 0 1%;
					}
					.left {
						ul {
							li {
								img {
									width: 128px;
									height: 130px;
								}
								.text {
									font-size: 24px;
									line-height: 48px;
								}
								.num {
									font-size: 32px;
									line-height: 56px;
								}
							}
						}
					}
				}
				.title {
				  height: 72px;
				  line-height: 72px;
				  font-size: 30px;
				}
			}
		}
	}
</style>

<script type="text/javascript">
import { mapGetters } from 'vuex'
import ChartsMap from './components/ChartsMap.vue'
import Line from './components/Line'
import LineBar from './components/LineBar'
import ChartPie from '@/components/chartPie'
import { homeNew } from '@/api/index'
import { getDecimalN, getCopyObj } from '@/utils/util'

export default {
	components: {
		ChartsMap,
		MyLine: Line,
		LineBar,
		ChartPie
	},
	data() {
		return {
			i18nInfo: getCopyObj(this.$t('home.info')),
	    otherText: this.$t('otherText'),
	    info: {},
	    boxH: 0,
	    totalList: [],
	    alarmList: [],
	    imgH: 0
		}
	},
	computed: {
    ...mapGetters([
      'menuTree'
    ]),
    navList() {
    	const { menuTree } = this
    	return menuTree.filter((v, i) => {
    		return i < 4
    	})
    }
  },
  mounted() {
		this.alarmList = getCopyObj(this.$t('home.alarmList'))
  	this.requestInfo(0)
  	this.boxH = this.getHeight('mainCenter', 0.84)
  	this.drawScale('scale', { end: 0 })
  	window.addEventListener('resize', this.resize)
  	this.setImgHeight()
  	// this.drawPie('pie')
  },
  beforeDestroy() {
  	window.removeEventListener('resize', this.resize)
  },
  methods: {
  	resize() {
  		const { info } = this
  		this.boxH = this.getHeight('mainCenter', 0.84)
  		if (!info.vehicleUseRate) return
  		const end = info.vehicleUseRate.replace('%', '')  / 100
  		this.drawScale('scale', { end })
    	this.setShadowWidth()
  		this.setImgHeight()
  	},
  	setImgHeight() {
  		const { $refs } = this
  		const oBox = $refs.pieImg
  		const w = oBox.clientWidth
  		const h = oBox.clientHeight
  		const min = Math.min(w, h)
  		this.imgH = Math.floor(min * 0.94)
  	},
  	/** 
		 * 画圆
		 * @param {String} ref 元素的ref
  	 */
  	 drawCircle(cxt, opt) {
  	 	const { boxH } = this
			cxt.lineWidth = opt.lineW || 1
			if (opt.isRound) {
				cxt.lineCap = 'round'
			} else {
				cxt.lineCap = 'butt'
			}
			cxt.beginPath()
			cxt.arc(boxH / 2, boxH / 2, boxH / 2 * opt.rateW, opt.start, 2 * Math.PI * opt.rateEnd + opt.start)
			cxt.strokeStyle = opt.color || opt.bg
      cxt.fillStyle = opt.bg
      cxt.fill()
			cxt.stroke()
			cxt.closePath()
			cxt.save()
  	},
  	/** 
		 * 画刻度盘
		 * @param {String} ref 元素的ref
  	 */
  	drawScale(ref, opt) {
  		const { $refs, boxH } = this
  		const box = $refs[ref]
  		box.width = boxH
  		box.height = boxH
  		if (!opt.hasOwnProperty('x')) opt.x = 0
  		if (!opt.hasOwnProperty('step')) opt.step = 0.01
  		const cxt = box.getContext('2d')
  		// 清画布
			cxt.clearRect(0, 0, boxH, boxH)
			// 画最外层的圆并填充
			this.drawCircle(cxt, { bg: '#0e2059', start: 0, rateEnd: 1, rateW: 1 })

			// 画第二层的圆并填充
			this.drawCircle(cxt, { bg: '#112669', start: 0, rateEnd: 1, rateW: 0.8 })

			// 画第三层的圆并填充
			this.drawCircle(cxt, { bg: '#132e7c', start: 0, rateEnd: 1, rateW: 0.7 })

			// 进度条
			if (opt.end > 0) {
				this.drawCircle(cxt, { bg: '#132e7c', color: '#009eff', lineW: 10, isRound: opt.end < 1, start: -(Math.PI / 2), rateEnd: getDecimalN(opt.x), rateW: 0.5 })
			}
			opt.x = opt.x + opt.step
			// 画表盘
			cxt.lineWidth = 1
			cxt.strokeStyle = '#77ecf1'
			cxt.beginPath()
			const radius = boxH / 2 * 0.86
			cxt.arc(boxH / 2,boxH / 2, radius, 0, 2 * Math.PI)
			cxt.stroke()

			// 画刻度
			let i = 0
			while (i < 24) {
			  cxt.save()
			  cxt.translate(boxH / 2, boxH / 2)
			  cxt.rotate(360 / 24 * i * Math.PI / 180)
			  cxt.lineWidth = 1
			  cxt.beginPath()
			 	if (i % 6 === 0) {
					cxt.moveTo(0, -radius + 16)
					cxt.lineTo(0, -radius)
			 	} else {
			 		// 移动到位置0，-170的位置
					cxt.moveTo(0, -radius + 8)
					// 创建0，-180的直线
					cxt.lineTo(0, -radius)
			 	}
				  cxt.stroke()
				  cxt.restore()
				i ++
			}

			const tid = setTimeout(() => {
				if (getDecimalN(opt.x) > opt.end) {
					clearTimeout(tid)
					return
				}
				this.drawScale(ref, opt)
			}, 10)
  	},
  	/** 
		 * 画右侧饼图
		 * @param {String} ref 元素的ref
  	 */
  	drawPie(ref) {
  		const { $refs } = this
  		const oCanvas = $refs.pie
  		const w = oCanvas.parentNode.clientWidth
  		const h = oCanvas.parentNode.clientHeight
  		const min = Math.min(w, h)
  		const width = min - 42
  		oCanvas.width = width
  		oCanvas.height = width
  		const cxt = oCanvas.getContext('2d')
  		cxt.lineWidth = 2
			cxt.beginPath()
			cxt.arc(width / 2, width / 2, width / 2 * 0.8, -(Math.PI / 2), 1.5 * Math.PI)
			cxt.strokeStyle = '#07f0fa'
      cxt.fillStyle = '#0a1d83'
      cxt.fill()
			cxt.stroke()
			cxt.closePath()
			cxt.save()

			cxt.lineWidth = 22
			cxt.beginPath()
			cxt.arc(width / 2, width / 2, width / 2 * 0.8 - (cxt.lineWidth / 2), -(Math.PI / 2), 1 * Math.PI)
			cxt.strokeStyle = '#07f0fa'
			cxt.stroke()
  	},
  	// 底部右侧半饼图
    setPie(info) {
    	const { gpsListType } = info
    	if (!(gpsListType instanceof Array) || !gpsListType.length) return
    	this.setShadowWidth()
    	let datas = []
    	let names = []
    	const total = gpsListType.reduce((num, v) => {
    		const obj = {
    			name: v.typeName,
    			value: v.vehicleCount
    		}
    		datas.push(obj)

    		names.push(v.typeName)

    		num += v.vehicleCount
    		return num
    	}, 0)
    	datas.push({ name: '', value: total })

    	const { i18nInfo, $refs } = this
 
      const opt = {
        color: ['#2150b7', '#0872cc', '#87c7de', '#09bed9'],
        graphic: {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            // text: [info.vehicleUseRate, i18nInfo.vehicleUseRate].join('\n'),
            font: '20px Microsoft YaHei',
            textAlign: 'center',
            fill: '#fff'
          }
        },
        serie: {
        	name: '车辆类别',
        	startAngle: -180,
        	minAngle: 5,
          itemStyle: {
            normal: {
              label: {
                // show: false
            		color: '#fff'
              },
              labelLine: {
                // show: false
              }
            }
          },
          data: datas,
          radius: ['45%', '70%'],
          center: ['50%', '50%'],
          hoverAnimation: false
        },
        legend: {
          // show: false,
          selectedMode: false,
          data: names,
          x: 'center',
          top: '3%',
          textStyle: {
          	color: '#fff'
          },
          orient: 'horizontal'
        },
        tooltip: {
          // show: false
          trigger: 'item',
          confine: true,
          // formatter: '{a}<br/>{b} : {c} ({d}%)'
          formatter: (params, ticket) => {
          	const dom = `<p style="color: #fff"><span>${params.seriesName}</span><br/><span>${params.name}<em>${params.value} (${params.percent * 2}%)</em></span></p>`
          	return dom
          },
          position: (pos, params, dom, rect, size) => {
          	const h = dom.clientHeight
			      const [left, top] = pos
			      // 让tooltip始终在鼠标上方
			      return {
			      	left,
			      	top: top - h
			      }
				  }
        }
      }
      $refs.chartPie.chartsRender(opt, true)
    },
    setShadowWidth() {
    	const { $refs } = this
    	const oBox = $refs.shadow
    	const h = oBox.clientHeight
    	oBox.style.width = `${h}px`
    },
  	/**
  	 * 获取高度
		 * @param {String} ref 元素的ref
		 * @param {Number} rate 比例
  	 */
  	getHeight(ref, rate) {
  		const { $refs } = this
  		const w = $refs[ref].clientWidth
  		const h = $refs[ref].clientHeight
  		const min = Math.min(w, h)
  		return Math.floor(min * (rate || 1))
  	},
  	/**
     * 设置车辆总数
     */
    setVehTotal() {
    	const { info, totalList } = this
    	const total = info.vehicleTotal
    	// 执行30次
    	const sped = Math.floor(total / 30) || 1

    	let oldTotal = Math.floor(totalList.join().replace(/(^0{1,}|,)/g, ''))
    	if (!oldTotal) oldTotal = 0
    	oldTotal += sped
    	if (oldTotal > total) oldTotal = total
    	// this.totalList = `${oldTotal}`.split('')
    	this.totalList = `00${oldTotal}`.split('')
    	const tid = setTimeout(() => {
    		clearTimeout(tid)
    		if (oldTotal >= total) return
    		this.setVehTotal()
    	}, 10)
    },
	  /**
     * 请求数据
     * @param {Number} queryType 类型
     * @param {Boolean} isLine true只是渲染底部折线柱状图，反之全部渲染
     */
    async requestInfo(queryType, isLine) {
    	const { $refs } = this
      try {
        const res = await homeNew({ queryType })
        const obj = res.result
        if (obj) {
          $refs.line.echartsLineBar(obj)
          $refs.lineBar.echartsLineBar(obj)
          // if (isLine) return;
          obj.mileageTodayTotal = getDecimalN(obj.mileageTodayTotal)
          obj.hoursAverage = getDecimalN(obj.hoursTodayTotal / obj.vehicleOnline)
          obj.mileageAverage = getDecimalN(obj.mileageTodayTotal / obj.vehicleOnline)
          obj.vehicleUseRate = `${Math.round(obj.vehicleOnline * 100 / obj.vehicleTotal * 100) / 100}%`
          this.info = obj
          $refs.map.loadMap(obj)
          // this.$refs.pie.pie(obj);
          this.setPie(obj)
          const end = obj.vehicleUseRate.replace('%', '')  / 100
  				this.drawScale('scale', { end })
          // obj.totalList = `${obj.vehicleTotal}`.split('')
          this.setVehTotal()
          this.setAlarmList(obj)
        }
      } catch(err) {

      }
    },
    /**
     * 设置报警数据
     * @param {Object} info 数据
     */
    setAlarmList(info) {
    	const list = info.gpsAlarmsData || []
    	if (!list.length) return
    	const { alarmList } = this
    	for (const v of list.values()) {
    		const obj = alarmList.find(e => e.text.indexOf(v.displayName) > -1)
    		if (obj) this.$set(obj, 'val', v.alarmCount)
    	}
    },
    /**
     * 跳转页面
     * @param {Number} i 当前下标
     */
    handleLink(i) {
    	const { navList, $route, menuTree } = this
    	const v = navList[i]
    	const url = v.url
    	const curPath = $route.path
      // 点击的当前页面
      if (curPath === url) return
      // 数据查询页面打开新窗口
      if (url.indexOf('/home/dataSearch') > -1) {
        open(`${location.protocol}//${location.host}/#${url}?code=${v.code}`)
      } else if (url.indexOf('http://') > -1) {
        open(url)
      } else {
        this.$router.push({
          path: url,
          query: {
            code: v.code
          }
        })
      }
    }
  }
}
</script>
